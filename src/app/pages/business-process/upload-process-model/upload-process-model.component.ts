import { Component, OnInit ,ViewChild,TemplateRef, ElementRef} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { diff } from 'bpmn-js-differ';
import { NgxSpinnerService } from "ngx-spinner";
import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import * as PropertiesPanelModule from 'bpmn-js-properties-panel';
import * as PropertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import lintModule from 'bpmn-js-bpmnlint';
// import * as bpmnlintConfig from '../model/.bpmnlintrc';
// import { registerBpmnJSPlugin } from 'camunda-modeler-plugin-helpers';
// import propertiesPanelExtensionModule from 'properties-panel';
import { SplitComponent, SplitAreaDirective } from 'angular-split';
import {MatDialog} from '@angular/material';
import { BpmnModel } from '../model/bpmn-autosave-model';
import { SharebpmndiagramService } from '../../services/sharebpmndiagram.service';
import { RestApiService } from '../../services/rest-api.service';
import { DataTransferService } from '../../services/data-transfer.service';
import Swal from 'sweetalert2';
import { GlobalScript } from 'src/app/shared/global-script';
import { BpmnShortcut } from '../../../shared/model/bpmn_shortcut';
import { BpsHints } from '../model/bpmn-module-hints';
import { UUID } from 'angular2-uuid';

declare var require: any;

@Component({
  selector: 'app-upload-process-model',
  templateUrl: './upload-process-model.component.html',
  styleUrls: ['./upload-process-model.component.css'],
  providers:[BpmnShortcut]
})
export class UploadProcessModelComponent implements OnInit {
  isShowConformance:boolean = false;
   hideUploadContainer:boolean=false;
   hideCreateContainer:boolean=false;
   hideOptionsContainer:boolean=true;
   isUploaded:boolean=false;
   bpmnModeler;
   viewer:any;
   confBpmnModeler;
   reSize:boolean=false;
   confBpmnXml;
   receivedbpmn:any;
   createDiagram:boolean = false;
   isConfBpmnModeler:boolean = true;
   isHiddenDiff:boolean=true;
   displayChanges:boolean=false;
  res1: string;
  oldxmlstring: string;
  newxmlsttring: string;
  split: SplitComponent;
  area1: SplitAreaDirective;
  area2: SplitAreaDirective;
  last_updated_time = new Date().getTime();
  autosaveObj:any;
  isConfNavigation:boolean=false;
  saved_bpmn_list:any[] = [];
  full_saved_bpmn_list:any[] = [];
  approver_list:any[] = [];
  selected_notation;
  selected_approver;
  diplayApproveBtn:boolean = false;
  isLoading:boolean = false;
  rejectedOrApproved;
  isDiagramChanged:boolean = false;
  isApprovedNotation:boolean = false;
  hasConformance:boolean = false;
  disableShowConformance:boolean = false;
  notationListOldValue = 0;
  notationListNewValue = undefined;
  oldXml;
  newXml;
  selected_modelId;
  selected_version;
  uploadedFile;
  autosavedDiagramVersion = [];
  autosavedDiagramList = [];
  updated_date_time;
  keyboardLabels=[];
  pid:any;
  pivalues:any;
  processName:string;
  fileType:string = "svg";
  category:string;
  randomNumber;
  pidId;
  isfromApprover: any=false;
  showProps: boolean=false;
  @ViewChild('keyboardShortcut',{ static: true }) keyboardShortcut: TemplateRef<any>;
  @ViewChild('canvasopt',{ static: false }) canvasopt: ElementRef;
   constructor(private rest:RestApiService, private bpmnservice:SharebpmndiagramService,private router:Router, private spinner:NgxSpinnerService,
      private dt:DataTransferService, private route:ActivatedRoute, private global:GlobalScript, private hints:BpsHints,public dialog:MatDialog,private shortcut:BpmnShortcut) { }

   ngOnInit() {
    this.randomNumber = UUID.UUID();
    this.dt.changeHints(this.hints.bpsUploadHints);
    this.bpmnservice.isConfNav.subscribe(res => this.isConfNavigation = res);
    this.route.queryParams.subscribe(params => {
      this.selected_modelId = params['bpsId'];
      this.selected_version = params['ver'];
      this.category = params['category'];
      this.processName = params['processName'];
      this.isShowConformance = params['isShowConformance'] == 'true';
      this.pid=params['pid'];
      this.isfromApprover=params['isfromApprover'] == 'true';
    });
    this.keyboardLabels=this.shortcut.keyboardLabels;
    if(!this.isShowConformance){
      this.selected_notation = 0;
      if(this.isfromApprover){
        this.dt.changeParentModule({"route":"/pages/approvalWorkflow/home", "title":"Approval Workflow"});
        this.dt.changeChildModule({"route":"", "title":"Notation Preview"});
        }
      else{
        this.dt.changeParentModule({"route":"/pages/businessProcess/home", "title":"Business Process Studio"});
        this.dt.changeChildModule({"route":"/pages/businessProcess/uploadProcessModel", "title":"Studio"});
        }
      this.isConfBpmnModeler = false;
      this.getUserBpmnList(null);
    }else{
        this.getUserBpmnList(null);
        this.dt.changeParentModule({"route":"/pages/processIntelligence/upload", "title":"Process Intelligence"});
        this.dt.changeChildModule({"route":"/pages/businessProcess/uploadProcessModel", "title":"Show Conformance"});
    }
    this.getApproverList();
   }

   ngAfterViewInit(){
    if(this.isShowConformance)
      this.getAutoSavedDiagrams()
   }
   fetchBpmnNotationFromPI(){
    this.rest.fetchBpmnNotationFromPI(this.pid).subscribe(res=>{
       this.pivalues=res;
    })
   }

   async getUserBpmnList(isFromConf){
    this.isLoading = true;
    await this.rest.getUserBpmnsList().subscribe( (res:any[]) =>  {
      this.full_saved_bpmn_list = res;
      if(this.isShowConformance){
        this.saved_bpmn_list = res.filter(each_bpmn => {
          return each_bpmn.processIntelligenceId && each_bpmn.processIntelligenceId.toString() == this.pid.toString();
        });
      }else{
        this.saved_bpmn_list = res.filter(each_bpmn => {
          return each_bpmn.bpmnProcessStatus?each_bpmn.bpmnProcessStatus.toLowerCase() != "pending":true;
        });
      }
      if(isFromConf) this.isUploaded = true;
      else this.getSelectedNotation();
      this.notationListOldValue = this.selected_notation;
      this.isLoading = false;
      this.getSelectedApprover();
      this.getAutoSavedDiagrams();
    });
   }

   getSelectedNotation(){
    this.saved_bpmn_list.forEach((each_bpmn,i) => {
      if(each_bpmn.bpmnModelId && this.selected_modelId && each_bpmn.bpmnModelId.toString() == this.selected_modelId.toString()
          && each_bpmn.version >= 0 && this.selected_version == each_bpmn.version)
          this.selected_notation = i;
    })
   }
   async getApproverList(){
     await this.rest.getApproverforuser('Process Architect').subscribe( res =>  {//Process Architect
      if(Array.isArray(res))
        this.approver_list = res;
    });
   }

   getSelectedApprover(){
    let current_bpmn_info = this.saved_bpmn_list[this.selected_notation];
    if(current_bpmn_info){
      this.isApprovedNotation = current_bpmn_info["bpmnProcessStatus"] == "APPROVED";
      this.rejectedOrApproved = current_bpmn_info["bpmnProcessStatus"];
    }
    if(!this.isShowConformance){
      let params:Params ={'bpsId':current_bpmn_info["bpmnModelId"], 'ver': current_bpmn_info["version"]};
      if(this.isfromApprover){
         params['isfromApprover']= this.isfromApprover;
      }
      this.router.navigate([],{ relativeTo:this.route, queryParams:params });
    }
    let status_arr = this.isShowConformance?['APPROVED','REJECTED', 'PENDING']:['APPROVED','REJECTED']
    if(status_arr.indexOf(this.rejectedOrApproved) != -1 && current_bpmn_info){
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
       if(this.isShowConformance){
          return each_asDiag.processIntelligenceId && each_asDiag.processIntelligenceId.toString() == this.pid.toString();
       }else{
         return sel_not["bpmnProcessStatus"] != "APPROVED" && sel_not["bpmnProcessStatus"] != "REJECTED" && each_asDiag.bpmnModelId == sel_not["bpmnModelId"];
       }
     })
  }

  fitNotationView(){
    let modeler_obj = this.isConfBpmnModeler ? "confBpmnModeler":"bpmnModeler";
    this[modeler_obj].get('canvas').zoom('fit-viewport');
    let msg = "";
    if(document.getElementById("canvas1") && document.getElementById("canvas1").innerHTML.trim() != "")
      msg = (this.isConfBpmnModeler?"Left":"Right")+" side notation";
    else
      msg = "Notation"
    this.global.notify(msg+" is fit to view port", "success")
  }

  togglePosition(){
    let el = document.getElementById("properties");
    if(el){
      el.classList.toggle("slide-left");
      el.classList.toggle("slide-right");
    }
  }

  initiateDiagram(){
    let _self=this;
    var CamundaModdleDescriptor2 = require("camunda-bpmn-moddle/resources/camunda.json");
    var lintConf = require("../model/.bpmnlintrc");
    let modeler_obj = this.isShowConformance && !this.reSize ? "confBpmnModeler":"bpmnModeler";
    if(!this[modeler_obj]){
      this[modeler_obj] = new BpmnJS({
        // linting: {
        //   bpmnlint: lintConf
        // },
        additionalModules: [
          PropertiesPanelModule,
          PropertiesProviderModule,
          // propertiesPanelExtensionModule,
          lintModule
        ],
        container: this.isShowConformance && !this.reSize ? '#canvas2':'#canvas1',
        keyboard: {
          bindTo: window
        },
        propertiesPanel: {
          parent: '#properties'
        },
        moddleExtensions: {
          camunda: CamundaModdleDescriptor2
        }
      });

      if(this.confBpmnModeler){
        this.confBpmnModeler.on('element.changed', function(){
          _self.disableShowConformance = true;
        })
      }
      this[modeler_obj].on('element.changed', function(){
        let now = new Date().getTime();
        _self.isDiagramChanged = true;
        if(now - _self.last_updated_time > 10*1000){
          _self.autoSaveBpmnDiagram();
          _self.last_updated_time = now;
        }
      })
      if(this.isShowConformance && !this.reSize){
        this.rest.fetchBpmnNotationFromPI(this.pid).subscribe(res=>{
          this.pivalues=res;
          let selected_xml = this.pivalues['data'];
          if(this.autosavedDiagramVersion[0] && this.autosavedDiagramVersion[0]["bpmnProcessMeta"]){
            selected_xml = this.autosavedDiagramVersion[0]["bpmnProcessMeta"];
            this.updated_date_time = this.autosavedDiagramVersion[0]["bpmnModelModifiedTime"];
          }
          this[modeler_obj].importXML(atob(unescape(encodeURIComponent(selected_xml))), function(err){
            if(err){
              return console.error('could not import BPMN 2.0 notation', err);
            }
          })
       })
      }else{
        let selected_xml = atob(unescape(encodeURIComponent(this.saved_bpmn_list[this.selected_notation].bpmnXmlNotation)));
        if(this.autosavedDiagramVersion[0] && this.autosavedDiagramVersion[0]["bpmnProcessMeta"]){
          selected_xml = atob(unescape(encodeURIComponent(this.autosavedDiagramVersion[0]["bpmnProcessMeta"])));
          this.updated_date_time = this.autosavedDiagramVersion[0]["bpmnModelModifiedTime"];
        }
        if(selected_xml == "undefined"){
          this.rest.getBPMNFileContent("assets/resources/newDiagram.bpmn").subscribe(res => {
            this[modeler_obj].importXML(res, function(err){
              if(err)
                console.error('could not import BPMN 2.0 notation', err);
            });
          });
        }else{
          this[modeler_obj].importXML(selected_xml, function(err){
            if(err)
              console.error('could not import BPMN 2.0 notation', err)
          })
        }
      }
    }
  }

displayBPMN(){
  let value = this.notationListOldValue;
  let _self = this;
  this.updated_date_time = null;
  this.filterAutoSavedDiagrams();
  this.reSize = false;
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
        _self.disableShowConformance = false;
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
        this.hasConformance = current_bpmn_info["hasConformance"];
        if(this.autosavedDiagramVersion[0] && this.autosavedDiagramVersion[0]["bpmnProcessMeta"]){
          selected_xml = atob(unescape(encodeURIComponent(this.autosavedDiagramVersion[0]["bpmnProcessMeta"])));
          this.updated_date_time = this.autosavedDiagramVersion[0]["bpmnModelModifiedTime"];
        }
        setTimeout(()=> {
          if(this.hasConformance) this.initBpmnModeler();
          if(this.bpmnModeler){
            if(selected_xml && selected_xml != "undefined"){
              this.bpmnModeler.importXML(selected_xml, function(err){
                _self.oldXml = selected_xml;
                _self.newXml = selected_xml;
              });
            }else{
              this.rest.getBPMNFileContent("assets/resources/newDiagram.bpmn").subscribe(res => {
                let encrypted_bpmn = btoa(unescape(encodeURIComponent(res)));
                this.bpmnModeler.importXML(encrypted_bpmn, function(err){
                  _self.oldXml = selected_xml;
                  _self.newXml = selected_xml;
                });
              });
            }
          }
        },0)
        if(this.isShowConformance && current_bpmn_info["processIntelligenceId"] && current_bpmn_info["processIntelligenceId"] == this.pid ){
          this.isConfBpmnModeler = !this.hasConformance;
          let bpmn_not = this.hasConformance ? current_bpmn_info["bpmnConfProcessMeta"] : this.pivalues["data"];
          this.confBpmnModeler.importXML(btoa(unescape(encodeURIComponent(bpmn_not))));
        }
        _self.isLoading = false;
      }
    })
  }else{
    this.isLoading = true;
    this.isDiagramChanged = false;
    this.disableShowConformance = false;
    this.diplayApproveBtn = true;
    let current_bpmn_info = this.saved_bpmn_list[this.selected_notation];
    let selected_xml = atob(unescape(encodeURIComponent(current_bpmn_info.bpmnXmlNotation)));
    this.isApprovedNotation = current_bpmn_info["bpmnProcessStatus"] == "APPROVED";
    this.hasConformance = current_bpmn_info["hasConformance"];
    if(this.autosavedDiagramVersion[0] && this.autosavedDiagramVersion[0]["bpmnProcessMeta"]){
      selected_xml = atob(unescape(encodeURIComponent(this.autosavedDiagramVersion[0]["bpmnProcessMeta"])));
      this.updated_date_time = this.autosavedDiagramVersion[0]["bpmnModelModifiedTime"];
    }
    setTimeout(()=> {
      if(this.hasConformance) this.initBpmnModeler();
      if(this.bpmnModeler){
        if(selected_xml == "undefined"){
          this.rest.getBPMNFileContent("assets/resources/newDiagram.bpmn").subscribe(res => {
            this.bpmnModeler.importXML(res, function(err){
              _self.oldXml = selected_xml;
              _self.newXml = selected_xml;
            });
          });
        }else{
          this.bpmnModeler.importXML(selected_xml, function(err){
            _self.oldXml = selected_xml;
            _self.newXml = selected_xml;
          });
        }
      }
    },0);
    if(this.isShowConformance && current_bpmn_info["processIntelligenceId"] && current_bpmn_info["processIntelligenceId"] == this.pid ){
      this.isConfBpmnModeler = !this.hasConformance;
      let bpmn_not = this.pivalues["data"];
      if(this.hasConformance){
        bpmn_not = current_bpmn_info["bpmnConfProcessMeta"];
      }else{
        if(this.rejectedOrApproved !="INPROGRESS")
          bpmn_not = current_bpmn_info["bpmnXmlNotation"];
        else
          bpmn_not = this.pivalues["data"];
      }
      this.confBpmnModeler.importXML(atob(unescape(encodeURIComponent(bpmn_not))), function(err){
        console.log(err)
      });
    }
    _self.isLoading = false;
  }
  this.getSelectedApprover();
}

  autoSaveBpmnDiagram(){
    let _self = this;
    let bpmnModel={};
    let modeler_obj = this.isShowConformance && !this.reSize ? "confBpmnModeler":"bpmnModeler";
    bpmnModel["modifiedTimestamp"] = new Date();
    if(!(this.isShowConformance && !this.reSize)){
      bpmnModel["bpmnModelId"] = _self.saved_bpmn_list[_self.selected_notation]["bpmnModelId"];
      bpmnModel["version"] = _self.saved_bpmn_list[_self.selected_notation]["version"];
      if(_self.autosavedDiagramVersion[0] && _self.autosavedDiagramVersion[0]["bpmnModelId"] == bpmnModel["bpmnModelId"]){
        bpmnModel["bpmnModelTempId"] = _self.autosavedDiagramVersion[0]["bpmnModelTempId"];
        bpmnModel["createdTimestamp"]=_self.autosavedDiagramVersion[0]["createdTimestamp"]
      }else{
        bpmnModel["createdTimestamp"] = new Date();
      }
    }else{
      let autoSaveExists = _self.autosavedDiagramVersion[0] && _self.autosavedDiagramVersion[0]["processIntelligenceId"].toString() == _self.pid.toString();
      let autoSaveVersion = _self.autosavedDiagramVersion[0];
      bpmnModel["bpmnModelId"] = autoSaveExists ? autoSaveVersion["bpmnModelId"]:_self.randomNumber;
      bpmnModel["version"] = autoSaveExists ? autoSaveVersion["version"]:0;
      bpmnModel["processIntelligenceId"] = parseInt(this.pid);
      bpmnModel["createdTimestamp"] = this.pivalues["createdTime"];
      if(autoSaveExists)
        bpmnModel["bpmnModelTempId"] = autoSaveVersion["bpmnModelTempId"];
    }
    this[modeler_obj].saveXML({ format: true }, function(err, xml) {
      _self.oldXml = _self.newXml;
      _self.newXml = xml;
      if(_self.oldXml != _self.newXml){
        _self.spinner.show();
        bpmnModel["bpmnProcessMeta"] = btoa(unescape(encodeURIComponent(_self.newXml)));
        _self.autoSaveDiagram(bpmnModel);
      }
    });
  }

  showConformance(){
    this.isLoading = true;
    this.selected_notation = 0;
    this.notationListOldValue = 0;
    this.isUploaded = this.saved_bpmn_list.length != 0;
    this.reSize=true;
    if(this.isUploaded){
      this.bpmnservice.changeConfNav(true);
      this.notationListOldValue = this.selected_notation;
      this.getSelectedApprover();
      this.getAutoSavedDiagrams();
    }
    this.isLoading = false;
  }

  autoSaveDiagram(model){
    this.rest.autoSaveBPMNFileContent(model).subscribe(
      data=>{
        this.getAutoSavedDiagrams();
        this.autosaveObj=data
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

  downloadFile(isConfBpmnModelerDownload, url){
    var link = document.createElement("a");
    link.href = url;
    let fileName = isConfBpmnModelerDownload ? this.processName : this.saved_bpmn_list[this.selected_notation]["bpmnProcessName"];
    if(fileName.trim().length == 0 ) fileName = "newDiagram";
    link.download = fileName+"."+this.fileType;
    link.innerHTML = "Click here to download the notation";
    link.click();
  }

  downloadBpmn(isConfBpmnModelerDownload){
    let modeler_obj = isConfBpmnModelerDownload ? "confBpmnModeler":"bpmnModeler";
    if(this[modeler_obj]){
      let _self = this;
      if(this.fileType == "bpmn"){
        this[modeler_obj].saveXML({ format: true }, function(err, xml) {
          var blob = new Blob([xml], { type: "application/xml" });
          var url = window.URL.createObjectURL(blob);
         _self.downloadFile(isConfBpmnModelerDownload, url);
        });
      }else{
        this[modeler_obj].saveSVG(function(err, svgContent) {
          var blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
          var url = window.URL.createObjectURL(blob);
          if(_self.fileType == "svg"){
            _self.downloadFile(isConfBpmnModelerDownload, url);
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
              _self.downloadFile(isConfBpmnModelerDownload, imgUrl)
            }
            img.src = url;
          }
        });
      }
    }
  }

  uploadAgainBpmn(e){
    this.isLoading = true;
    let _self = this;
    var myReader: FileReader = new FileReader();
    myReader.onloadend = (ev) => {
      this.isLoading = true;
      let fileString:string = myReader.result.toString();
      this.bpmnModeler.importXML(fileString, function(err){
        _self.oldXml = fileString.trim();
        _self.newXml = fileString.trim();
        _self.isLoading = false;
      });
    }
    myReader.readAsText(e.addedFiles[0]);
  }

  initBpmnModeler(){
    if(!this.bpmnModeler || document.getElementById("canvas1").innerHTML.trim() == ""){
      this.bpmnModeler = new BpmnJS({
        container: '#canvas1',
        keyboard: {
          bindTo: window
        }
      });
      let _self = this;
      this.bpmnModeler.on('element.changed', function(){
        let now = new Date().getTime();
        _self.isDiagramChanged = true;
        if(now - _self.last_updated_time > 10*1000){
          _self.autoSaveBpmnDiagram();
          _self.last_updated_time = now;
        }
      })
    }
  }

  submitDiagramForApproval(){
    let yesProceed = true;
    if(this.isShowConformance && this.isUploaded && this.bpmnModeler){
      yesProceed = confirm('You are about to save and submit '+(this.isConfBpmnModeler?'"AS IS"':'"TO BE"')+' notation for approval')
    }
    if(!yesProceed) return;
    let bpmnModel:BpmnModel = new BpmnModel();
    if((!this.selected_approver && this.selected_approver != 0) || this.selected_approver <= -1){
      Swal.fire("No approver", "Please select approver from the list given above", "error");
      return;
    }
    this.isLoading = true;
    let _self = this;
    let sel_List = this.saved_bpmn_list[this.selected_notation];
    let modeler_obj = this.isConfBpmnModeler ? "confBpmnModeler":"bpmnModeler";
    let sel_appr = this.approver_list[this.selected_approver];
    bpmnModel.approverEmail = sel_appr.userId;
    bpmnModel.approverName = sel_appr.userId.split("@")[0];
    if(sel_List){
      bpmnModel.userName = sel_List["userName"];
      bpmnModel.tenantId = sel_List["tenantId"];
      bpmnModel.userEmail = sel_List['userEmail'];
    }
  if(this.isShowConformance){
    bpmnModel.notationFromPI = true;
    bpmnModel.bpmnProcessName = this.processName;
    bpmnModel.category = this.category;
    bpmnModel.processIntelligenceId = this.pid;
    let match = this.full_saved_bpmn_list.filter(each_diag => {
      return each_diag.bpmnProcessName == this.processName && each_diag.processIntelligenceId && each_diag.processIntelligenceId == this.pid
    })
    if(match[0]){
      bpmnModel.bpmnModelId = match[0]['bpmnModelId'];
      bpmnModel.id = match[0]["id"];
    }else{
      bpmnModel.bpmnModelId = this.randomNumber;
    }
  }else{
    bpmnModel.bpmnModelId = sel_List['bpmnModelId'];
    bpmnModel.bpmnProcessName = sel_List['bpmnProcessName'];
    bpmnModel.category = sel_List['category'];
    bpmnModel.processIntelligenceId= sel_List['processIntelligenceId']? sel_List['processIntelligenceId']:Math.floor(100000 + Math.random() * 900000);//?? Will repeat need to replace with proper alternative??
    bpmnModel.id = sel_List["id"];
  }
  bpmnModel.bpmnProcessStatus="PENDING";
  bpmnModel.bpmnProcessApproved = 0;
  this[modeler_obj].saveXML({ format: true }, function(err, xml) {
    let final_notation = btoa(unescape(encodeURIComponent(xml)));
    bpmnModel.bpmnXmlNotation = final_notation;
    _self.rest.submitBPMNforApproval(bpmnModel).subscribe(
      data=>{
        _self.isLoading = false;
        _self.isDiagramChanged = false;
        if(data["errorCode"] == "2005"){
          Swal.fire(
            'Already exists!',
            'The notation is already in "PENDING" status.',
            'error'
          );
        }else{
          Swal.fire(
            'Saved!',
            'Your changes has been saved and submitted for approval successfully.',
            'success'
          );
        }
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
    let yesProceed = true;
    if(this.isShowConformance && this.isUploaded){
      yesProceed = confirm('You are about to save '+(this.isConfBpmnModeler?'"AS IS"':'"TO BE"')+' notation')
    }
    if(!yesProceed) return;
    this.isDiagramChanged = false;
    this.isLoading = true;
    let bpmnModel:BpmnModel = new BpmnModel();
    let _self = this;
    let sel_List = this.saved_bpmn_list[this.selected_notation];
    let status = "";
    if(sel_List){
      status = sel_List["bpmnProcessStatus"];
      bpmnModel.userName = sel_List["userName"];
      bpmnModel.tenantId = sel_List["tenantId"];
    }
    if(this.isShowConformance){
      status = "INPROGRESS";
      bpmnModel.bpmnProcessName = this.processName;
      bpmnModel.category = this.category;
      bpmnModel.processIntelligenceId = parseInt(this.pid);
      let match = this.full_saved_bpmn_list.filter(each_diag => {
        return each_diag.bpmnProcessName == this.processName && each_diag.processIntelligenceId && each_diag.processIntelligenceId == this.pid
      })
      if(match[0]){
        bpmnModel.bpmnModelId = match[0]['bpmnModelId'];
        bpmnModel.id = match[0]["id"];
      }else{
        bpmnModel.bpmnModelId = this.randomNumber;
      }
      bpmnModel.createdTimestamp = this.pivalues["createdTime"];
      bpmnModel.bpmnProcessStatus = "INPROGRESS";
      bpmnModel.notationFromPI = true;
    }else{
      bpmnModel.bpmnProcessName = sel_List['bpmnProcessName'];
      bpmnModel.bpmnModelId = sel_List['bpmnModelId'];
      bpmnModel.category = sel_List['category'];
      if(sel_List['id'])
        bpmnModel.id = sel_List['id'];
      else
        delete(bpmnModel.id);
      bpmnModel.createdTimestamp = sel_List['createdTimestamp'];
      bpmnModel.bpmnProcessStatus = sel_List['bpmnProcessStatus'];
    }
    // this.initBpmnModeler();
    let modeler_obj = this.isConfBpmnModeler ? "confBpmnModeler":"bpmnModeler";
    this[modeler_obj].saveXML({ format: true }, function(err, xml) {
      let final_notation = btoa(unescape(encodeURIComponent(xml)));
      bpmnModel.bpmnXmlNotation = final_notation;
      if(_self.isShowConformance && !_self.isConfBpmnModeler){
        bpmnModel.hasConformance = true;
        _self.confBpmnModeler.saveXML({ format: true }, function(err, xml2) {
          bpmnModel.bpmnConfProcessMeta = btoa(unescape(encodeURIComponent(xml2)));;
        })
      }
      _self.rest.saveBPMNprocessinfofromtemp(bpmnModel).subscribe(
        data=>{
          _self.isLoading = false;
          if(data["errorCode"] == "2005"){
            Swal.fire(
              'Already exists!',
              'The notation is already in "PENDING" status.',
              'error'
            );
          }else{
            if( !_self.isShowConformance && (status == "APPROVED" || status == "REJECTED")){
              let all_bpmns = _self.saved_bpmn_list.filter(each => { return each.bpmnModelId == sel_List["bpmnModelId"]})
              let inprogress_version = 0;
              all_bpmns.forEach(each => {
                if(inprogress_version < each.version)
                inprogress_version = each.version;
              })
              let params:Params = {'bpsId':sel_List["bpmnModelId"], 'ver': inprogress_version}
              _self.router.navigate([],{ relativeTo:_self.route, queryParams:params });
            }
            if(_self.isUploaded) _self.getUserBpmnList(true);
            else _self.getUserBpmnList(null);
            Swal.fire(
              'Saved!',
              'Your changes has been saved successfully.',
              'success'
            );
            if(newVal){
              _self.selected_notation = newVal;
              let current_bpmn_info = _self.saved_bpmn_list[_self.selected_notation];
              let selected_xml = atob(current_bpmn_info.bpmnXmlNotation);
              _self.bpmnModeler.importXML(selected_xml, function(err){
                _self.oldXml = selected_xml;
                _self.newXml = selected_xml;
              });
            }
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
    })
   }


   uploadConfBpmn(confBpmnData){
    let _self = this;
    let decrypted_data = atob(unescape(encodeURIComponent(confBpmnData)));
    this.isLoading = true;
    setTimeout(()=> {
      this.initBpmnModeler();
      this.bpmnModeler.importXML(decrypted_data, function(err){
        if(err){
          return console.error('could not import BPMN 2.0 notation', err);
        }
        _self.confBpmnXml = decrypted_data;
        _self.bpmnservice.uploadConfirmanceBpmnXMLDef( _self.bpmnModeler._definitions);
        _self.isLoading = false;
        _self.getUserBpmnList(null);
      })
    }, 3000);
   }

  slideUpDifferences(){
    let ele = document.getElementById("bpmn_differences");
    if(ele){
      ele.classList.add("slide-up");
      ele.classList.remove("slide-down");
    }
  }

  getElementsToColor(modeler, input, type){
    let strokeClr = "";
    let fillClr = "";
    let elementsToColor = [];
    let modeling = this[modeler].get('modeling');
    let eleRegistry = this[modeler].get('elementRegistry');
    let type_arr = input? Object.keys(input):[];
    switch(type){
      case "add": strokeClr = "green";
                  fillClr = "lightgreen";
                  break;
      case "remove": strokeClr = "red";
                  fillClr = "pink";
                  break;
      case "change": strokeClr = "orange";
                  fillClr = "yellow";
                  break;
      case "layout": strokeClr = "blue";
                  fillClr = "lightblue";
                  break;
      default:  strokeClr = "black";
                fillClr = "white";
    }
    if(type == "all"){
      elementsToColor = eleRegistry.getAll();
    }else{
      type_arr.forEach(each_add => {
        let each_ = input[each_add];
        let flowEles = each_.flowElements;
        if(flowEles){
          flowEles.forEach(each_el => {
            let el = eleRegistry.get(each_el.id);
            if(el) elementsToColor.push(el)
          })
        }else{
          let el = eleRegistry.get(each_.id);
          if(el) elementsToColor.push(el)
        }
      })
    }
    if(elementsToColor.length != 0){
      modeling.setColor(elementsToColor, {
        stroke: strokeClr,
        fill: fillClr
      });
    }
  }

  getBpmnDifferences(){
    let bpmnDiffs = diff( this.confBpmnModeler.getDefinitions(), this.bpmnModeler.getDefinitions());
    let revBpmnDiffs = diff( this.bpmnModeler.getDefinitions(), this.confBpmnModeler.getDefinitions());
    let rev_added = revBpmnDiffs._added;
    if(rev_added){
      let rev_a_keys = Object.keys(rev_added);
      rev_a_keys.forEach(each_rev_key => {
        bpmnDiffs._removed[each_rev_key] = rev_added[each_rev_key];
      })
    }
    let rev_removed = revBpmnDiffs._removed;
    if(rev_removed){
      let rev_r_keys = Object.keys(rev_removed);
      rev_r_keys.forEach(each_rev_key => {
        bpmnDiffs._added[each_rev_key] = rev_removed[each_rev_key];
      })
    }
    let rev_layout = revBpmnDiffs._layoutChanged;
    if(rev_layout){
      let rev_l_keys = Object.keys(rev_layout);
      rev_l_keys.forEach(each_rev_key => {
        bpmnDiffs._layoutChanged[each_rev_key] = rev_layout[each_rev_key];
      })
    }
    let rev_changed = revBpmnDiffs._changed;
    if(rev_changed){
      let rev_c_keys = Object.keys(rev_changed);
      rev_c_keys.forEach(each_rev_key => {
        bpmnDiffs._changed[each_rev_key] = rev_changed[each_rev_key];
      })
    }
    this.bpmnservice.updateDifferences(bpmnDiffs);

    this.getElementsToColor('bpmnModeler', bpmnDiffs._added, 'add');
    this.getElementsToColor('bpmnModeler', bpmnDiffs._changed, 'change');
    this.getElementsToColor('bpmnModeler', bpmnDiffs._layoutChanged, 'layout');

    this.getElementsToColor('confBpmnModeler', bpmnDiffs._removed, 'remove');
    this.getElementsToColor('confBpmnModeler', revBpmnDiffs._changed, 'change');
    this.getElementsToColor('confBpmnModeler', revBpmnDiffs._layoutChanged, 'layout');

    this.slideUpDifferences();
  }

  clearDifferences(){
    this.getElementsToColor('bpmnModeler', null, 'all');
    this.getElementsToColor('confBpmnModeler', null, 'all');
    this.autoSaveBpmnDiagram();
  }

  slideUp(e){
    if(e.addedFiles.length == 1 && e.rejectedFiles.length == 0){
      this.uploadAgainBpmn(e);
    }else{
      this.uploadedFile = null;
      this.isLoading = false;
      let message = "Oops! Something went wrong";
      if(e.rejectedFiles[0].reason == "type")
        message = "Please upload proper *.bpmn file";
      this.global.notify(message, "error");
    }
  }
  displayShortcut(){
    this.dialog.open(this.keyboardShortcut);
 }


}