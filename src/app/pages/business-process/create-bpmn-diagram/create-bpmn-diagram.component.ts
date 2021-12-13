import { Component, OnInit, ViewChild,TemplateRef, ElementRef } from '@angular/core';
import * as BpmnJS from '../../../bpmn-modeler.development.js';
import * as CmmnJS from 'cmmn-js/dist/cmmn-modeler.production.min.js';
import * as DmnJS from 'dmn-js/dist/dmn-modeler.development.js';
import CmmnPropertiesPanelModule from 'cmmn-js-properties-panel';
import CmmnPropertiesProviderModule from 'cmmn-js-properties-panel/lib/provider/camunda';
import DmnPropertiesPanelModule from 'dmn-js-properties-panel';
import DmnPropertiesProviderModule from 'dmn-js-properties-panel/lib/provider/dmn';
import DrdAdapterModule from 'dmn-js-properties-panel/lib/adapter/drd';
import * as PropertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import { PreviewFormProvider } from "../bpmn-props-additional-tabs/PreviewFormProvider";
import { OriginalPropertiesProvider, PropertiesPanelModule, InjectionNames} from "../bpmn-props-additional-tabs/bpmn-js";
import { NgxSpinnerService } from "ngx-spinner";
import { Router, ActivatedRoute, Params } from '@angular/router';
import Swal from 'sweetalert2';
import {MatDialog, MatTabGroup} from '@angular/material';
import { RestApiService } from '../../services/rest-api.service';
import { DataTransferService } from '../../services/data-transfer.service';
import { SharebpmndiagramService } from '../../services/sharebpmndiagram.service';
import { BpmnModel } from '../model/bpmn-autosave-model';
import { GlobalScript } from '../../../shared/global-script';
import { BpsHints } from '../model/bpmn-module-hints';
import { BpmnShortcut } from '../../../shared/model/bpmn_shortcut';
import * as bpmnlintConfig from '../model/packed-config';
import { DndModule } from 'ngx-drag-drop';
import lintModule from 'bpmn-js-bpmnlint';
import { DeployNotationComponent } from 'src/app/shared/deploy-notation/deploy-notation.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import minimapModule from "diagram-js-minimap";
declare var require:any;
import BpmnColorPickerModule from 'bpmn-js-color-picker';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-create-bpmn-diagram',
  templateUrl: './create-bpmn-diagram.component.html',
  styleUrls: ['./create-bpmn-diagram.component.css'],
  providers:[BpmnShortcut]
})
export class CreateBpmnDiagramComponent implements OnInit {
  bpmnModeler:any;
  oldXml;
  newXml;
  autosaveObj:any;
  isLoading:boolean = false;
  diplayApproveBtn:boolean = false;
  isDiagramChanged:boolean = false;
  isApprovedNotation:boolean = false;
  last_updated_time = new Date().getTime();
  saved_bpmn_list:any[] = [];
  approver_list:any[] = [];
  selected_notation = 0;
  selected_approver;
  rejectedOrApproved;
  notationListOldValue = 0;
  notationListNewValue = undefined;
  selected_modelId;
  selected_version;
  uploadedFile;
  autosavedDiagramVersion = [];
  autosavedDiagramList = [];
  updated_date_time;
  keyboardLabels=[];
  fileType:string = "svg";
  selectedNotationType:string;
  xmlTabContent: string;
  errXMLcontent: string = '';
  modalRef: BsModalRef;
  menuToggleTitle : boolean = false;
  propertiesContainer : boolean = false;
  panelOpenState = false;
  step = 0;
  isOpenedState:number=0;
  currentNotation_name:any;
  push_Obj:any;
  rpaJson = {
    "name": "RPA",
    "uri": "https://www.omg.org/spec/BPMN/20100524/DI",
    "prefix": "rpa",
    "xml": {
      "tagAlias": "lowerCase"
    },
    "types": [
      {
        "name": "Activity",
        "superClass": [ "Element" ],
      },
      {
        "name": "InputParams",
        "superClass": [ "Element" ],
      },
      {
        "name": "OutputParams",
        "superClass": [ "Element" ],
      }
    ]
  }
  public variables: any[] = [];
  isStartProcessBtn:boolean=false;
  definationId:any;
  businessKey:any;
  downloadFileformate:Subscription;
  header_btn_functions:Subscription;
  header_approvalBtn:Subscription;
  @ViewChild('variabletemplate',{ static: true }) variabletemplate: TemplateRef<any>;
  @ViewChild('keyboardShortcut',{ static: true }) keyboardShortcut: TemplateRef<any>;
  @ViewChild('dmnTabs',{ static: true }) dmnTabs: ElementRef<any>;
  @ViewChild("notationXMLTab", { static: false }) notationXmlTab: MatTabGroup;
  @ViewChild('wrongXMLcontent', { static: true}) wrongXMLcontent: TemplateRef<any>;
  constructor(private rest:RestApiService, private spinner:NgxSpinnerService, private dt:DataTransferService,private modalService: BsModalService,
    private router:Router, private route:ActivatedRoute, private bpmnservice:SharebpmndiagramService, private global:GlobalScript, private hints:BpsHints, public dialog:MatDialog,private shortcut:BpmnShortcut) {}

  ngOnInit(){
    localStorage.setItem("isheader","true")
    this.dt.changeParentModule({"route":"/pages/businessProcess/home", "title":"Business Process Studio"});
    this.dt.changeChildModule({"route":"/pages/businessProcess/createDiagram", "title":"Studio"});
    this.dt.changeHints(this.hints.bpsCreateHints);
    this.route.queryParams.subscribe(params => {
      this.selected_modelId = params['bpsId'];
      this.selected_version = params['ver'];
      this.selectedNotationType = params['ntype'];
    });
    this.keyboardLabels=this.shortcut[this.selectedNotationType];
    this.setRPAData();
    this.getApproverList();
    this.getUserBpmnList();
    console.log(this.rejectedOrApproved)
    this.push_Obj={"rejectedOrApproved":this.rejectedOrApproved,"isfromApprover":false,
                    "isShowConformance":false,"isStartProcessBtn":this.isStartProcessBtn,"autosaveTime":this.updated_date_time,
                    "isFromcreateScreen":true,'process_name':this.currentNotation_name}
        this.dt.bpsNotationaScreenValues(this.push_Obj);
  }
  ngAfterViewInit(){
    this.downloadFileformate=this.dt.download_notation.subscribe(res=>{
      this.fileType=res
      if(this.fileType != null){
        this.downloadBpmn(false);
      }
    })
    this.header_btn_functions=this.dt.header_value.subscribe(res=>{
      let headerValue=res
      let result = headerValue instanceof Object;
      if(!result){
      if(headerValue == 'zoom_in'){
        this.zoomIn();
      }else if(headerValue == 'zoom_out'){
        this.zoomOut();
      }else if(headerValue == 'save_process'){
        this.saveprocess(null)
      }else if(headerValue == 'save&approval'){
        // this.submitDiagramForApproval()
      }else if(headerValue == 'orchestartion'){
        this.orchestrate()
      }else if(headerValue == 'deploy'){
        this.openDeployDialog();
      }else if(headerValue == 'startProcess'){
        this.openVariableDialog();
    }else if(headerValue == 'fitNotation'){
        this.fitNotationView()
    }
      
    }else if(result){
      this.slideUp(headerValue)
    }
    })
    this.header_approvalBtn=this.dt.subMitApprovalValues.subscribe(res=>{
      if(res){
        this.submitDiagramForApproval(res.selectedApprovar);
      }
    })
  }
  ngOnDestroy() {
    this.downloadFileformate.unsubscribe();
    this.header_btn_functions.unsubscribe();
    this.header_approvalBtn.unsubscribe();
    this.dt.bpsNotationaScreenValues(null);
    this.dt.downloadNotationValue(null);
    this.dt.bpsHeaderValues(null);
    this.dt.submitForApproval(null)
  }

  getUserBpmnList(){
    this.isLoading = true;
    this.rest.getUserBpmnsList().subscribe( (res:any[]) =>  {
      this.saved_bpmn_list = res.filter(each_bpmn => {
        return each_bpmn.bpmnProcessStatus?each_bpmn.bpmnProcessStatus.toLowerCase() != "pending":true;
      });
      this.getSelectedNotation();
      // this.selected_notation = 0;
      this.notationListOldValue = 0;
      this.isLoading = false;
      this.getSelectedApprover();
      this.getAutoSavedDiagrams();
    });
   }

  getSelectedNotation(){
    this.saved_bpmn_list.forEach((each_bpmn,i) => {
      if(each_bpmn.bpmnModelId && this.selected_modelId && each_bpmn.bpmnModelId.toString() == this.selected_modelId.toString()
          && each_bpmn.version >= 0 && this.selected_version == each_bpmn.version){
          this.selected_notation = i;
      }
    })
   }
  
   fitNotationView(){
    let canvas;
    if(this.selectedNotationType == "bpmn" || this.selectedNotationType == "cmmn")
      canvas = this.bpmnModeler.get('canvas');
    else if(this.selectedNotationType == "dmn")
      canvas = this.bpmnModeler.getActiveViewer().get('canvas')
    canvas.zoom('fit-viewport');
    let msg = "Notation";
    if(document.getElementById("canvas") )
    this.global.notify(msg+" Is fit to view port.", "success")
   }
  
   setRPAData(){
    this.rest.getAllAttributes().subscribe( res => {
      let rpaActivityOptions: any[] = [];
      let taskLists:any = {};
      let taskAttributes:any = {};
      let restApiAttributes = []
      if(res["General"]){
        res["General"].forEach((each) => {
          rpaActivityOptions.push({name:each.name, value: each.name});
          let tmpTasks = []; 
          each.taskList.forEach((each_task) => {
            tmpTasks.push({name:each_task.name, value: each_task.taskId})
            taskAttributes[each_task.taskId] = each_task.value;
            each_task.value.forEach((each_attr,attr_id) => {
              if(each_attr.type == "restapi"){
                let tmp_ = {
                  taskId: each_task.taskId,
                  attrId: attr_id
                }
                restApiAttributes.push(tmp_);
              }
            })
          })
          taskLists[each.name]= tmpTasks;
        })
      }
      if(res["Advanced"]){
        res["Advanced"].forEach((each) => {
          rpaActivityOptions.push({name:each.name, value: each.name});
          let tmpTasks = [];
          each.taskList.forEach((each_task) => {
            tmpTasks.push({name:each_task.name, value: each_task.taskId})
            taskAttributes[each_task.taskId] = each_task.value;
            each_task.value.forEach((each_attr,attr_id) => {
              if(each_attr.type == "restapi"){
                let tmp_ = {
                  taskId: each_task.taskId,
                  attrId: attr_id
                }
                restApiAttributes.push(tmp_);
              }
            })
          })
          taskLists[each.name]= tmpTasks;
        });
      }
      localStorage.setItem("rpaActivityOptions", JSON.stringify(rpaActivityOptions))
      localStorage.setItem("rpaActivityTaskListOptions", JSON.stringify(taskLists))
      localStorage.setItem("attributes", JSON.stringify(taskAttributes))
      for(var i=0; i<restApiAttributes.length; i++){
        let each_restApi = restApiAttributes[i];
        taskAttributes[each_restApi.taskId][each_restApi.attrId] = this.rest.getRestAttributes(taskAttributes[each_restApi.taskId][each_restApi.attrId], each_restApi.taskId, each_restApi.attrId);
      }
    })
  }

  getApproverList(){
      let roles={
        "roleNames": ["Process Owner","Process Architect"]
      }
      this.rest.getmultipleApproverforusers(roles).subscribe( res =>  {//Process Architect
       if(Array.isArray(res))
         this.approver_list = res;
     });
    }

  getSelectedApprover(){
    let current_bpmn_info = this.saved_bpmn_list[this.selected_notation];
    let params:Params = {'bpsId':current_bpmn_info["bpmnModelId"], 'ver': current_bpmn_info["version"], 'ntype':current_bpmn_info["ntype"]}
    this.router.navigate([],{ relativeTo:this.route, queryParams:params });
    this.rejectedOrApproved = current_bpmn_info["bpmnProcessStatus"];
    this.updated_date_time = current_bpmn_info["modifiedTimestamp"];
    this.currentNotation_name = current_bpmn_info["bpmnProcessName"];

    this.push_Obj={"rejectedOrApproved":this.rejectedOrApproved,"isfromApprover":false,
                    "isShowConformance":false,"isStartProcessBtn":this.isStartProcessBtn,"autosaveTime":this.updated_date_time,
                    "isFromcreateScreen":true,'process_name':this.currentNotation_name}
      this.dt.bpsNotationaScreenValues(this.push_Obj);
    if(['APPROVED','REJECTED'].indexOf(this.rejectedOrApproved) != -1){
      for(var s=0; s<this.approver_list.length; s++){
        let each = this.approver_list[s];
        if(each.userId){
          let userId = each.userId.split("@")[0];
          if(userId == current_bpmn_info["approverName"]){
            this.selected_approver = s;
            break;
          }
        }
      }
    }
    else
      this.selected_approver = null;   
   }

  getAutoSavedDiagrams(){
    this.rest.getBPMNTempNotations().subscribe( (res:any) =>  {
      if(Array.isArray(res))
        this.autosavedDiagramList = res;
        this.filterAutoSavedDiagrams();
      if(!this.bpmnModeler)
        this.initiateDiagram();
    },
    err => {
      if(!this.bpmnModeler)
        this.initiateDiagram();
    });
   }

  filterAutoSavedDiagrams(){
     let sel_not = this.saved_bpmn_list[this.selected_notation]
     this.rejectedOrApproved=sel_not['bpmnProcessStatus'];
     this.updated_date_time=sel_not['modifiedTimestamp'];
     this.push_Obj={"rejectedOrApproved":this.rejectedOrApproved,"isfromApprover":false,
                    "isShowConformance":false,"isStartProcessBtn":this.isStartProcessBtn,"autosaveTime":this.updated_date_time,
                    "isFromcreateScreen":true,'process_name':this.currentNotation_name}
     this.dt.bpsNotationaScreenValues(this.push_Obj);

      this.autosavedDiagramVersion = this.autosavedDiagramList.filter(each_asDiag => {
        return sel_not["bpmnProcessStatus"] != "APPROVED" && sel_not["bpmnProcessStatus"] != "REJECTED" && each_asDiag.bpmnModelId == sel_not["bpmnModelId"];
      })
  }

  togglePosition(){
    let el = document.getElementById("properties");
    if(el){
      el.classList.toggle("slide-left");
      el.classList.toggle("slide-right");
    }
  }
  
  initiateDiagram(){
    let _self = this;
    this.initModeler();
    let selected_xml = this.bpmnservice.getBpmnData();
    if(!selected_xml)
      selected_xml = this.saved_bpmn_list[this.selected_notation].bpmnXmlNotation
    if(this.autosavedDiagramVersion[0] && this.autosavedDiagramVersion[0]["bpmnProcessMeta"]){
      selected_xml = this.autosavedDiagramVersion[0]["bpmnProcessMeta"];
     // this.updated_date_time = this.autosavedDiagramVersion[0]["modifiedTimestamp"];
    }
    let decrypted_bpmn = atob(unescape(encodeURIComponent(selected_xml)));
    this.bpmnModeler.importXML(decrypted_bpmn, function(err){
      _self.oldXml = decrypted_bpmn.trim();
      _self.newXml = decrypted_bpmn.trim();
    });
  }

  setUrlParam(name, value) {
    var url = new URL(window.location.href);
    if (value) {
      url.searchParams.set(name, '1');
    } else {
      url.searchParams.delete(name);
    }
    window.history.replaceState({}, null, url.href);
  }

  getUrlParam(name) {
    var url = new URL(window.location.href);
    return url.searchParams.has(name);
  }

  displayBPMN(){
    let value = this.notationListOldValue;
    let _self = this;
    this.updated_date_time = null;
    this.filterAutoSavedDiagrams();
    if(this.isDiagramChanged){
      Swal.fire({
        title: 'Are you sure?',
        text: 'Your current changes will be lost on changing notation.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Save and Continue',
        cancelButtonText: 'Discard'
      }).then((res) => {
        if(res.value){
          _self.isDiagramChanged = false;
          _self.notationListNewValue = _self.selected_notation;
          _self.selected_notation = value;
          _self.saveprocess(_self.notationListNewValue);
        }else if(res.dismiss === Swal.DismissReason.cancel){
          this.isDiagramChanged = false;
          this.diplayApproveBtn = true;
          this.keyboardLabels=this.shortcut[this.selectedNotationType];
          this.notationListOldValue = this.selected_notation;
          let current_bpmn_info = this.saved_bpmn_list[this.selected_notation];
          let selected_xml = atob(unescape(encodeURIComponent(current_bpmn_info.bpmnXmlNotation)));
          this.selectedNotationType = current_bpmn_info["ntype"];
          this.fileType = "svg";
          if(this.dmnTabs)
            this.dmnTabs.nativeElement.innerHTML = "sdfasdfasdf";
          this.isApprovedNotation = current_bpmn_info["bpmnProcessStatus"] == "APPROVED";
          if(this.autosavedDiagramVersion[0] && this.autosavedDiagramVersion[0]["bpmnProcessMeta"]){
            selected_xml = atob(unescape(encodeURIComponent(this.autosavedDiagramVersion[0]["bpmnProcessMeta"])));
            this.updated_date_time = this.autosavedDiagramVersion[0]["bpmnModelModifiedTime"];
            this.push_Obj={"rejectedOrApproved":this.rejectedOrApproved,"isfromApprover":false,
                          "isShowConformance":false,"isStartProcessBtn":this.isStartProcessBtn,"autosaveTime":this.updated_date_time,
                          "isFromcreateScreen":true,'process_name':this.currentNotation_name}
            this.dt.bpsNotationaScreenValues(this.push_Obj);
          }
          this.initModeler();
          this.bpmnModeler.importXML(selected_xml, function(err){
            _self.oldXml = selected_xml;
            _self.newXml = selected_xml;
          });
        }
      })
    }else{
      this.isLoading = true;
      this.isDiagramChanged = false;
      this.diplayApproveBtn = true;
      this.keyboardLabels=this.shortcut[this.selectedNotationType];
      let current_bpmn_info = this.saved_bpmn_list[this.selected_notation];
      let selected_xml = atob(unescape(encodeURIComponent(current_bpmn_info.bpmnXmlNotation)));
      this.isApprovedNotation = current_bpmn_info["bpmnProcessStatus"] == "APPROVED";
      this.selectedNotationType = current_bpmn_info["ntype"];
      this.fileType = "svg";
      if(this.dmnTabs)
        this.dmnTabs.nativeElement.innerHTML = "sdfasdfasdf";
      if(this.autosavedDiagramVersion[0] && this.autosavedDiagramVersion[0]["bpmnProcessMeta"]){
        selected_xml = atob(unescape(encodeURIComponent(this.autosavedDiagramVersion[0]["bpmnProcessMeta"])));
        this.updated_date_time = this.autosavedDiagramVersion[0]["bpmnModelModifiedTime"];
        this.push_Obj={"rejectedOrApproved":this.rejectedOrApproved,"isfromApprover":false,
                        "isShowConformance":false,"isStartProcessBtn":this.isStartProcessBtn,"autosaveTime":this.updated_date_time,
                        "isFromcreateScreen":true,'process_name':this.currentNotation_name}
        this.dt.bpsNotationaScreenValues(this.push_Obj);
      }
      this.initModeler();
      this.bpmnModeler.importXML(selected_xml, function(err){
        _self.oldXml = selected_xml;
        _self.newXml = selected_xml;
        _self.isLoading = false;
      });
    }
    this.getSelectedApprover();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  displayXML(e){
    let _self = this;
    _self.isLoading = true;
    if(e.index == 1){
      this.bpmnModeler.saveXML({ format: true }, function(err, updatedXML) {
        _self.xmlTabContent = updatedXML;
        _self.isLoading = false;
      })
    }else{
      this.bpmnModeler.importXML(this.xmlTabContent, function(err){
        if(err){
          _self.errXMLcontent = err;
          _self.openModal(_self.wrongXMLcontent);
          _self.isLoading = false;
        }
        else{
          _self.oldXml = _self.xmlTabContent;
          _self.newXml = _self.xmlTabContent;
          _self.isLoading = false;
        }
      });
    }
  }

  autoSaveBpmnDiagram(){
    let bpmnModel={};
    this.isStartProcessBtn=false;
    let _self = this;
    this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
      _self.oldXml = _self.newXml;
      _self.newXml = xml;
      if(_self.oldXml != _self.newXml){
        _self.spinner.show();
        bpmnModel["bpmnProcessMeta"] = btoa(unescape(encodeURIComponent(_self.newXml)));
        bpmnModel["bpmnModelId"] = _self.saved_bpmn_list[_self.selected_notation]["bpmnModelId"];
        bpmnModel["version"] = _self.saved_bpmn_list[_self.selected_notation]["version"];
        bpmnModel["ntype"] = _self.saved_bpmn_list[_self.selected_notation]["ntype"];
       // bpmnModel["modifiedTimestamp"] = new Date();
        if(_self.autosavedDiagramVersion[0]&& _self.autosavedDiagramVersion[0]["bpmnModelId"] == bpmnModel["bpmnModelId"]){
          bpmnModel["bpmnModelTempId"] = _self.autosavedDiagramVersion[0]["bpmnModelTempId"];
         // bpmnModel["createdTimestamp"]=_self.autosavedDiagramVersion[0]["createdTimestamp"]
        }else{
         // bpmnModel["createdTimestamp"] = new Date();
        }
        _self.autoSaveDiagram(bpmnModel);
      }
    });
  }

  autoSaveDiagram(model){
    this.rest.autoSaveBPMNFileContent(model).subscribe(
      data=>{
        this.getAutoSavedDiagrams();
        this.autosaveObj = data;
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
    })
  }

  automate(){
    let selected_id = this.saved_bpmn_list[this.selected_notation].id;
    this.rest.getautomatedtasks(selected_id).subscribe((automatedtasks)=>{
      Swal.fire(
        'Tasks automated successfully!',
        '',
        'success'
      );
    })
  }

  orchestrate(){
    let selected_id = this.saved_bpmn_list[this.selected_notation].id;
    this.router.navigate(["/pages/serviceOrchestration/home"], { queryParams: { processid: selected_id }});
  }

  downloadFile(url){
    var link = document.createElement("a");
    link.href = url;
    let fileName = this.saved_bpmn_list[this.selected_notation]["bpmnProcessName"];
    if(fileName.trim().length == 0 ) fileName = "newDiagram";
    link.download = fileName+"."+this.fileType;
    link.innerHTML = "Click here to download the notation";
    link.click();
  }

  downloadBpmn(e){
    if(this.bpmnModeler){
      let _self = this;
      if(this.fileType == this.selectedNotationType){
        this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
          var blob = new Blob([xml], { type: "application/xml" });
          var url = window.URL.createObjectURL(blob);
         _self.downloadFile(url);
        });
      }else{
        let modelExp = this.bpmnModeler;
        if(this.selectedNotationType == 'dmn') modelExp = this.bpmnModeler._viewers.drd;
        modelExp.saveSVG(function(err, svgContent) {
          var blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
          var url = window.URL.createObjectURL(blob);
          if(_self.fileType == "svg"){
            _self.downloadFile(url);
          }else{
            let canvasEl = document.createElement("canvas");
            let canvasContext = canvasEl.getContext("2d", {alpha: false});
            let img = new Image();
            img.onload=()=>{
              canvasEl.width = img.width;
              canvasEl.height = img.height;
              canvasContext.fillStyle = "#fff";
              canvasContext.fillRect(0, 0, canvasEl.width, canvasEl.height);
              canvasContext.drawImage(img,0,0,img.width, img.height, 0, 0, canvasEl.width, canvasEl.height);
              let imgUrl;
              if(_self.fileType == "png")
                imgUrl = canvasEl.toDataURL("image/png");
              else
                imgUrl = canvasEl.toDataURL("image/jpg");
              _self.downloadFile(imgUrl)
            }
            img.src = url;
          }
        });
      }
    }
  }
  
  initModeler(){
    let _self = this;
    this.notationXmlTab.selectedIndex = 0;
    if(this.bpmnModeler){
      document.getElementById("canvas").innerHTML = ""
      document.getElementById("properties").innerHTML = ""
    }
    var CamundaModdleDescriptor = require("camunda-bpmn-moddle/resources/camunda.json");
    var CmmnCamundaModdleDescriptor = require("camunda-cmmn-moddle/resources/camunda.json");
    var DmnCamundaModdleDescriptor = require("camunda-dmn-moddle/resources/camunda.json");
    this.keyboardLabels=this.shortcut[this.selectedNotationType];
    if(this.selectedNotationType == "cmmn"){
      this.bpmnModeler = new CmmnJS({
        additionalModules: [
          CmmnPropertiesPanelModule,
          CmmnPropertiesProviderModule
        ],
        container: '#canvas',
        propertiesPanel: {
          parent: '#properties'
        },
        moddleExtensions: {
          camunda: CmmnCamundaModdleDescriptor
        }
      });
    }else if(this.selectedNotationType == "dmn"){
      this.bpmnModeler = new DmnJS({
        drd: {
          additionalModules: [
            DmnPropertiesPanelModule,
            DmnPropertiesProviderModule,
            DrdAdapterModule
          ],
          propertiesPanel: {
            parent: '#properties'
          }
        },
        container: '#canvas',
        moddleExtensions: {
          camunda: DmnCamundaModdleDescriptor
        }
      });
      this.bpmnModeler.on('views.changed', function(event) {
        if(_self.dmnTabs)
          _self.dmnTabs.nativeElement.innerHTML = "test";
      })
    }else{
      this.bpmnModeler = new BpmnJS({
        linting: {
           bpmnlint: bpmnlintConfig,
           active: _self.getUrlParam('linting')
        },
        additionalModules: [
          minimapModule,
          PropertiesPanelModule,
          PropertiesProviderModule,
          {[InjectionNames.bpmnPropertiesProvider]: ['type', OriginalPropertiesProvider.propertiesProvider[1]]},
          {[InjectionNames.propertiesProvider]: ['type', PreviewFormProvider]},
          lintModule,
          BpmnColorPickerModule
        ],
        container: '#canvas',
        keyboard: {
          bindTo: window
        },
        propertiesPanel: {
          parent: '#properties'
        },
        moddleExtensions: {
          camunda: CamundaModdleDescriptor,
          rpa: this.rpaJson
        }
      });
      let canvas = this.bpmnModeler.get('canvas');
      canvas.zoom('fit-viewport');
      this.bpmnModeler.get("minimap").open();
    }
    this.bpmnModeler.on('element.changed', function(){
      _self.isDiagramChanged = true;
      let now = new Date().getTime();
      if(now - _self.last_updated_time > 10*1000){
        _self.autoSaveBpmnDiagram();
        _self.last_updated_time = now;
      }
    })
  }

  submitDiagramForApproval(e){
    this.selected_approver=e
    if((!this.selected_approver && this.selected_approver != 0) || this.selected_approver <= -1){
      Swal.fire("No approver", "Please select approver from the list given above", "error");
      return;
    }
    this.isStartProcessBtn=false;
    let bpmnModel:BpmnModel = new BpmnModel();
    this.isLoading = true;
    let _self = this;
    let sel_List = this.saved_bpmn_list[this.selected_notation];
    let sel_appr = this.approver_list[this.selected_approver];
    bpmnModel.approverEmail = sel_appr.userId;
    bpmnModel.approverName = sel_appr.firstName+" "+sel_appr.lastName;
    bpmnModel.userName = sel_List["userName"];
    bpmnModel.tenantId = sel_List["tenantId"];
    bpmnModel.userEmail = sel_List['userEmail'];
    bpmnModel.bpmnModelId= sel_List['bpmnModelId'];
    bpmnModel.bpmnProcessName=sel_List['bpmnProcessName'];
    bpmnModel.category = sel_List['category'];
    bpmnModel.ntype = sel_List['ntype'] ? sel_List['ntype'] : '-';
    bpmnModel.processIntelligenceId= sel_List['processIntelligenceId']? sel_List['processIntelligenceId']:Math.floor(100000 + Math.random() * 900000);//?? Will repeat need to replace with proper alternative??
    bpmnModel.id = sel_List["id"];
    bpmnModel.bpmnProcessStatus="PENDING";
    bpmnModel.bpmnProcessApproved = 0;
    this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
      let final_notation = btoa(unescape(encodeURIComponent(xml)));
      bpmnModel.bpmnXmlNotation = final_notation;
      _self.rest.submitBPMNforApproval(bpmnModel).subscribe(
        data=>{
          _self.isDiagramChanged = false;
          _self.isLoading = false;
          _self.rejectedOrApproved="PENDING";
            _self.push_Obj={"rejectedOrApproved":"PENDING","isfromApprover":false,
            "isShowConformance":false,"isStartProcessBtn":_self.isStartProcessBtn,"autosaveTime":_self.updated_date_time,
            "isFromcreateScreen":false,'process_name':_self.currentNotation_name,'isSavebtn':true}
            _self.dt.bpsNotationaScreenValues(_self.push_Obj);
          Swal.fire(
            'Saved!',
            'Your changes has been saved and submitted for approval successfully.',
            'success'
          );
        },err => {
          _self.isLoading = false;
          Swal.fire(
            'Oops!',
            'Something went wrong. Please try again',
            'error'
          )
        })
    })
  }

  saveprocess(newVal){
    this.isDiagramChanged = false;
    this.isStartProcessBtn=false;
    this.isLoading = true;
    let bpmnModel:BpmnModel = new BpmnModel();
    let _self=this;
    let sel_List = this.saved_bpmn_list[this.selected_notation];
    let status = sel_List["bpmnProcessStatus"];
    bpmnModel.bpmnProcessName = sel_List['bpmnProcessName'];
    bpmnModel.bpmnModelId = sel_List['bpmnModelId'];
    bpmnModel.category = sel_List['category'];
    bpmnModel.ntype = sel_List['ntype'] ? sel_List['ntype'] : '-';
    if(sel_List['id'])
      bpmnModel.id = sel_List['id'];
    else
      delete(bpmnModel.id);
    bpmnModel.userName = sel_List['userName'];
    bpmnModel.tenantId = sel_List['tenantId'];
    bpmnModel.bpmnProcessStatus = "INPROGRESS";
    this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
      let final_notation = btoa(unescape(encodeURIComponent(xml)));
      bpmnModel.bpmnXmlNotation = final_notation;
      _self.saved_bpmn_list[_self.selected_notation]['bpmnXmlNotation'] = final_notation;
      _self.rest.saveBPMNprocessinfofromtemp(bpmnModel).subscribe(
        data=>{
          if(status == "APPROVED" || status == "REJECTED"){
            let all_bpmns = _self.saved_bpmn_list.filter(each => { return each.bpmnModelId == sel_List["bpmnModelId"]})
            let last_version = 0;
            all_bpmns.forEach(each => {
              if(last_version < each.version)
                last_version = each.version;
            })
            let params:Params = {'bpsId':sel_List["bpmnModelId"], 'ver': last_version+1, 'ntype':sel_List["ntype"]}
            _self.router.navigate([],{ relativeTo:_self.route, queryParams:params });
            _self.getUserBpmnList();
          }
          _self.isLoading = false;
          Swal.fire(
            'Saved!',
            'Your changes has been saved successfully.',
            'success'
          )
          if(newVal){
            _self.selected_notation = newVal;
            let current_bpmn_info = _self.saved_bpmn_list[_self.selected_notation];
            let selected_xml = atob(current_bpmn_info.bpmnXmlNotation);
            _self.bpmnModeler.importXML(selected_xml, function(err){
              _self.oldXml = selected_xml;
              _self.newXml = selected_xml;
            });
          }
        },
        err => {
          _self.isLoading = false;
          if(err.error.message == "2002")
          Swal.fire(
            'Oops!',
            'An Inprogress process already exists for the selected process. \nPlease do the changes in existing inprogress notation',
            'warning'
          )
          else
          Swal.fire(
            'Oops!',
            'Something went wrong. Please try again',
            'error'
          )
        })
    });
    this.push_Obj={"rejectedOrApproved":this.rejectedOrApproved,"isfromApprover":false,
                  "isShowConformance":false,"isStartProcessBtn":this.isStartProcessBtn,"autosaveTime":this.updated_date_time,
                  "isFromcreateScreen":true,'process_name':this.currentNotation_name}
    this.dt.bpsNotationaScreenValues(this.push_Obj);
  }

  slideUp(e){
    if(e.addedFiles.length == 1 && e.rejectedFiles.length == 0){
      var modal = document.getElementById('myModal');
      modal.style.display="block";
      this.uploadedFile = e.addedFiles[0];
    }else{
      this.uploadedFile = null;
      this.isLoading = false;
      let message = "Oops! Something went wrong";
      if(e.rejectedFiles[0].reason == "type")
        message = "Please upload proper notation";
      this.global.notify(message, "error");
    }
  }

  displayShortcut(){
     this.dialog.open(this.keyboardShortcut);
  }

  openDeployDialog() {
    let _self = this;
    this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
      _self.openDialog(xml)
    });
  }

  openDialog(data){
    let fileName = this.saved_bpmn_list[this.selected_notation]["bpmnProcessName"];
    if(fileName.trim().length == 0 ) fileName = "newDiagram";
    var dd = fileName+"."+this.selectedNotationType;
     this.dialog.open(DeployNotationComponent, {disableClose: true,data: {
      dataKey: data, fileNme: dd
    }});

    let deployResponse;
    this.dt.current_startProcessValues.subscribe(res=>{
      if(res){
      deployResponse=res
          this.definationId=deployResponse.definationId
          this.isStartProcessBtn=deployResponse.startprocess
      }
    })
  }

  openVariableDialog(){
    this.dialog.open(this.variabletemplate);
    this.variables= [];
    this.businessKey='';
  }

  addVariable(){
    this.variables.push({
      variableName: '',
      type: '',
      value: ''
    })
  }

  removevariable(index){
    this.variables.splice(index, 1);
  }

  cancelProcess(){
    this.dialog.closeAll()
  }
  
  startProcess(){    
    let reqBody={
      "definitionId":this.definationId,
      "businessKey":this.businessKey,
      "variableList":this.variables
    };
    this.rest.startBpmnProcess(reqBody).subscribe(res=>{
      Swal.fire(
        'Success!',
        'Process started successfully',
        'success'
      )
      this.cancelProcess();
      this.isStartProcessBtn=false;
    })    
  }
  zoomIn() {
    this.bpmnModeler.get('zoomScroll').stepZoom(0.1);
  }
  zoomOut() {
    this.bpmnModeler.get('zoomScroll').stepZoom(-0.1);
  }
  toggleOpen(){
    this.menuToggleTitle = true;
    this.propertiesContainer = true;
    let el = document.getElementById("propertiesPanelBody");
    if(el){
      el.classList.remove("slide-right");
      el.classList.add("slide-left");
    }
    
  }
  toggleClosed(){
    this.menuToggleTitle = false;
    this.propertiesContainer = false;
    let el = document.getElementById("propertiesPanelBody");
    if(el){
      el.classList.remove("slide-left");
      el.classList.add("slide-right");
    }
    this.isOpenedState=0;
  }
  onExpansionClik(i){
    this.isOpenedState=i;
    this.menuToggleTitle = true;
    this.propertiesContainer = true;
    let el = document.getElementById("propertiesPanelBody");
    if(el){
      el.classList.remove("slide-right");
      el.classList.add("slide-left");
    }
  }

}

