import { Component, OnInit, ViewChild,TemplateRef } from '@angular/core';
import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.development.js';
import * as CmmnJS from 'cmmn-js/dist/cmmn-modeler.production.min.js';
import * as PropertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import { PreviewFormProvider } from "../bpmn-props-additional-tabs/PreviewFormProvider";
import { OriginalPropertiesProvider, PropertiesPanelModule, InjectionNames} from "../bpmn-props-additional-tabs/bpmn-js";
import { NgxSpinnerService } from "ngx-spinner";
import { Router, ActivatedRoute, Params } from '@angular/router';
import Swal from 'sweetalert2';
import {MatDialog} from '@angular/material';
import { RestApiService } from '../../services/rest-api.service';
import { DataTransferService } from '../../services/data-transfer.service';
import { SharebpmndiagramService } from '../../services/sharebpmndiagram.service';
import { BpmnModel } from '../model/bpmn-autosave-model';
import { GlobalScript } from '../../../shared/global-script';
import { BpsHints } from '../model/bpmn-module-hints';
import { BpmnShortcut } from '../../../shared/model/bpmn_shortcut';
import * as bpmnlintConfig from '../model/packed-config';
declare var require:any;

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
  @ViewChild('keyboardShortcut',{ static: true }) keyboardShortcut: TemplateRef<any>;
  constructor(private rest:RestApiService, private spinner:NgxSpinnerService, private dt:DataTransferService,
    private router:Router, private route:ActivatedRoute, private bpmnservice:SharebpmndiagramService, private global:GlobalScript, private hints:BpsHints, public dialog:MatDialog,private shortcut:BpmnShortcut) {}

  ngOnInit(){
    this.dt.changeParentModule({"route":"/pages/businessProcess/home", "title":"Business Process Studio"});
    this.dt.changeChildModule({"route":"/pages/businessProcess/createDiagram", "title":"Studio"});
    this.dt.changeHints(this.hints.bpsCreateHints);
    this.route.queryParams.subscribe(params => {
      this.selected_modelId = params['bpsId'];
      this.selected_version = params['ver'];
    });
    this.keyboardLabels=this.shortcut.keyboardLabels;
    // this.selected_modelId = this.bpmnservice.bpmnId.value;
    this.getApproverList();
    this.getUserBpmnList();
  }

  // ngOnDestroy(){
  //   // if(this.isDiagramChanged){
  //     Swal.fire({
  //       title: 'Are you sure?',
  //       text: 'Your current changes will be lost on changing diagram.',
  //       icon: 'warning',
  //       showCancelButton: true,
  //       confirmButtonText: 'Save and Continue',
  //       cancelButtonText: 'Discard'
  //     }).then((res)=>{
  //       if(res.value){
  //         this.saveprocess(null);
  //       }
  //     })
  //   // }
  // }

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
    let canvas = this.bpmnModeler.get('canvas');
    canvas.zoom('fit-viewport');
    let msg = "Notation";
    if(document.getElementById("canvas") )
    this.global.notify(msg+" is fit to view port", "success")

   }

   getApproverList(){
     this.rest.getApproverforuser('Process Architect').subscribe( res =>  {//Process Architect
      if(Array.isArray(res))
        this.approver_list = res;
    });
   }

   getSelectedApprover(){
    let current_bpmn_info = this.saved_bpmn_list[this.selected_notation];
    let params:Params = {'bpsId':current_bpmn_info["bpmnModelId"], 'ver': current_bpmn_info["version"]}
    this.router.navigate([],{ relativeTo:this.route, queryParams:params });
    this.rejectedOrApproved = current_bpmn_info["bpmnProcessStatus"];
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
    });
   }
   filterAutoSavedDiagrams(){
     let sel_not = this.saved_bpmn_list[this.selected_notation]
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
  // ngAfterViewInit(){
    initiateDiagram(){
    let _self = this;
    var CamundaModdleDescriptor = require("camunda-bpmn-moddle/resources/camunda.json");
    this.bpmnModeler = new BpmnJS({
      linting: {
        bpmnlint: bpmnlintConfig,
        active: _self.getUrlParam('linting')
     },
      additionalModules: [
        PropertiesPanelModule,
        PropertiesProviderModule,
        {[InjectionNames.bpmnPropertiesProvider]: ['type', OriginalPropertiesProvider.propertiesProvider[1]]},
        {[InjectionNames.propertiesProvider]: ['type', PreviewFormProvider]}
      ],
      container: '#canvas',
      keyboard: {
        bindTo: window
      },
      propertiesPanel: {
        parent: '#properties'
      },
      moddleExtensions: {
        camunda: CamundaModdleDescriptor
      }
    });
    // this.bpmnModeler = new CmmnJS({
    //   container: '#canvas',
    //   propertiesPanel: {
    //     parent: '#properties'
    //   }
    // })
    let canvas = this.bpmnModeler.get('canvas');
    canvas.zoom('fit-viewport');
    this.bpmnModeler.on('element.changed', function(){
      _self.isDiagramChanged = true;
      let now = new Date().getTime();
      if(now - _self.last_updated_time > 10*1000){
        _self.autoSaveBpmnDiagram();
        _self.last_updated_time = now;
      }
    })
    let selected_xml = this.bpmnservice.getBpmnData();// this.saved_bpmn_list[this.selected_notation].bpmnXmlNotation
    if(this.autosavedDiagramVersion[0] && this.autosavedDiagramVersion[0]["bpmnProcessMeta"]){
      selected_xml = this.autosavedDiagramVersion[0]["bpmnProcessMeta"];
      this.updated_date_time = this.autosavedDiagramVersion[0]["modifiedTimestamp"];
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
          this.notationListOldValue = this.selected_notation;
          let current_bpmn_info = this.saved_bpmn_list[this.selected_notation];
          let selected_xml = atob(unescape(encodeURIComponent(current_bpmn_info.bpmnXmlNotation)));
          this.isApprovedNotation = current_bpmn_info["bpmnProcessStatus"] == "APPROVED";
          if(this.autosavedDiagramVersion[0] && this.autosavedDiagramVersion[0]["bpmnProcessMeta"]){
            selected_xml = atob(unescape(encodeURIComponent(this.autosavedDiagramVersion[0]["bpmnProcessMeta"])));
            this.updated_date_time = this.autosavedDiagramVersion[0]["bpmnModelModifiedTime"];
          }
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
      let current_bpmn_info = this.saved_bpmn_list[this.selected_notation];
      let selected_xml = atob(unescape(encodeURIComponent(current_bpmn_info.bpmnXmlNotation)));
      this.isApprovedNotation = current_bpmn_info["bpmnProcessStatus"] == "APPROVED";
      if(this.autosavedDiagramVersion[0] && this.autosavedDiagramVersion[0]["bpmnProcessMeta"]){
        selected_xml = atob(unescape(encodeURIComponent(this.autosavedDiagramVersion[0]["bpmnProcessMeta"])));
        this.updated_date_time = this.autosavedDiagramVersion[0]["bpmnModelModifiedTime"];
      }
      this.bpmnModeler.importXML(selected_xml, function(err){
        _self.oldXml = selected_xml;
        _self.newXml = selected_xml;
        _self.isLoading = false;
      });
    }
    this.getSelectedApprover();
  }

  autoSaveBpmnDiagram(){
    let bpmnModel={};
    let _self = this;
    this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
      _self.oldXml = _self.newXml;
      _self.newXml = xml;
      if(_self.oldXml != _self.newXml){
        _self.spinner.show();
        bpmnModel["bpmnProcessMeta"] = btoa(unescape(encodeURIComponent(_self.newXml)));
        bpmnModel["bpmnModelId"] = _self.saved_bpmn_list[_self.selected_notation]["bpmnModelId"];
        bpmnModel["version"] = _self.saved_bpmn_list[_self.selected_notation]["version"];
        bpmnModel["modifiedTimestamp"] = new Date();
        if(_self.autosavedDiagramVersion[0]&& _self.autosavedDiagramVersion[0]["bpmnModelId"] == bpmnModel["bpmnModelId"]){
          bpmnModel["bpmnModelTempId"] = _self.autosavedDiagramVersion[0]["bpmnModelTempId"];
          bpmnModel["createdTimestamp"]=_self.autosavedDiagramVersion[0]["createdTimestamp"]
        }else{
          bpmnModel["createdTimestamp"] = new Date();
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
        this.updated_date_time = new Date();
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
    })
  }

  automate(){
    let selected_id = this.saved_bpmn_list[this.selected_notation].id;
    this.router.navigate(["/pages/rpautomation/home"], { queryParams: { processid: selected_id }});
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


  downloadBpmn(){
    if(this.bpmnModeler){
      let _self = this;
      if(this.fileType == "bpmn"){
        this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
          var blob = new Blob([xml], { type: "application/xml" });
          var url = window.URL.createObjectURL(blob);
         _self.downloadFile(url);
        });
      }else{
        this.bpmnModeler.saveSVG(function(err, svgContent) {
          var blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
          var url = window.URL.createObjectURL(blob);
          if(_self.fileType == "svg"){
            _self.downloadFile(url);
          }else{
            let canvasEl = document.createElement("canvas");
            let canvasContext = canvasEl.getContext("2d");
            let img = new Image();
            img.onload=()=>{
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
  submitDiagramForApproval(){
    if((!this.selected_approver && this.selected_approver != 0) || this.selected_approver <= -1){
      Swal.fire("No approver", "Please select approver from the list given above", "error");
      return;
    }
    let bpmnModel:BpmnModel = new BpmnModel();
    this.isLoading = true;
    let _self = this;
    let sel_List = this.saved_bpmn_list[this.selected_notation];
    let sel_appr = this.approver_list[this.selected_approver];
    bpmnModel.approverEmail = sel_appr.userId;
    bpmnModel.approverName = sel_appr.userId.split("@")[0];
    bpmnModel.userName = sel_List["userName"];
    bpmnModel.tenantId = sel_List["tenantId"];
    bpmnModel.userEmail = sel_List['userEmail'];
    bpmnModel.bpmnModelId= sel_List['bpmnModelId'];
    bpmnModel.bpmnProcessName=sel_List['bpmnProcessName'];
    bpmnModel.category = sel_List['category'];
    bpmnModel.processIntelligenceId= sel_List['processIntelligenceId']? sel_List['processIntelligenceId']:Math.floor(100000 + Math.random() * 900000);//?? Will repeat need to replace with proper alternative??
    bpmnModel.id = sel_List["id"];
    bpmnModel.bpmnProcessStatus="PENDING";
    bpmnModel.bpmnProcessApproved = 0;
    this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
      let final_notation = btoa(unescape(encodeURIComponent(xml)));
      // bpmnModel.bpmnJsonNotation = final_notation;
      bpmnModel.bpmnXmlNotation = final_notation;
      _self.rest.submitBPMNforApproval(bpmnModel).subscribe(
        data=>{
          _self.isDiagramChanged = false;
          _self.isLoading = false;
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
    this.isLoading = true;
    let bpmnModel:BpmnModel = new BpmnModel();
    let _self=this;
    let sel_List = this.saved_bpmn_list[this.selected_notation];
    let status = sel_List["bpmnProcessStatus"];
    bpmnModel.bpmnProcessName = sel_List['bpmnProcessName'];
    bpmnModel.bpmnModelId = sel_List['bpmnModelId'];
    bpmnModel.category = sel_List['category'];
    if(sel_List['id'])
      bpmnModel.id = sel_List['id'];
    else
      delete(bpmnModel.id);
    bpmnModel.userName = sel_List['userName'];
    bpmnModel.tenantId = sel_List['tenantId'];
    bpmnModel.createdTimestamp = sel_List['createdTimestamp'];
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
            let params:Params = {'bpsId':sel_List["bpmnModelId"], 'ver': last_version+1}
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

}

