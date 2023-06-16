import { Component, OnInit ,ViewChild,TemplateRef, ElementRef, OnDestroy} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { diff } from 'bpmn-js-differ';
import { NgxSpinnerService } from "ngx-spinner";
import * as BpmnJS from './../../../bpmn-modeler.development.js';
import * as CmmnJS from 'cmmn-js/dist/cmmn-modeler.production.min.js';
import * as DmnJS from 'dmn-js/dist/dmn-modeler.development.js';
import CmmnPropertiesPanelModule from 'cmmn-js-properties-panel';
import CmmnPropertiesProviderModule from 'cmmn-js-properties-panel/lib/provider/camunda';
import DmnPropertiesPanelModule from 'dmn-js-properties-panel';
import DmnPropertiesProviderModule from 'dmn-js-properties-panel/lib/provider/dmn';
import DrdAdapterModule from 'dmn-js-properties-panel/lib/adapter/drd';
import * as PropertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import { PreviewFormProvider } from "../bpmn-props-additional-tabs/PreviewFormProvider";
import CustomRenderer from "../bpmn-props-additional-tabs/customRenderer";
import ReplaceMenuProvider from "../bpmn-props-additional-tabs/ReplaceMenuProvider";
import { OriginalPropertiesProvider, PropertiesPanelModule, InjectionNames} from "../bpmn-props-additional-tabs/bpmn-js";
import lintModule from 'bpmn-js-bpmnlint';
import { SplitComponent, SplitAreaDirective } from 'angular-split';
import { MatDialog } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { BpmnModel } from '../model/bpmn-autosave-model';
import { SharebpmndiagramService } from '../../services/sharebpmndiagram.service';
import { RestApiService } from '../../services/rest-api.service';
import { DataTransferService } from '../../services/data-transfer.service';
import Swal from 'sweetalert2';
import { MessageService, ConfirmationService } from 'primeng/api';
import { GlobalScript } from 'src/app/shared/global-script';
import { BpmnShortcut } from '../../../shared/model/bpmn_shortcut';
import { BpsHints } from '../model/bpmn-module-hints';
import { UUID } from 'angular2-uuid';
import { Subscription } from 'rxjs';
import { JsonpInterceptor } from '@angular/common/http';
import * as bpmnlintConfig from '../model/packed-config';
import { DeployNotationComponent } from 'src/app/shared/deploy-notation/deploy-notation.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import minimapModule from "diagram-js-minimap";
import BpmnColorPickerModule from 'bpmn-js-color-picker';
import { ComponentCanDeactivate } from './../../../guards/bps-data-save.guard'
import { Observable } from 'rxjs/Observable';
import { LoaderService } from 'src/app/services/loader/loader.service';
declare var require:any;


@Component({
  selector: 'app-upload-process-model',
  templateUrl: './upload-process-model.component.html',
  styleUrls: ['./upload-process-model.component.css'],
  providers:[BpmnShortcut]
})
export class UploadProcessModelComponent implements ComponentCanDeactivate,OnInit,OnDestroy {
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
  saved_bpmn_list:any;
  full_saved_bpmn_list:any[] = [];
  approver_list:any[] = [];
  selected_notation;
  selected_approver;
  diplayApproveBtn:boolean = false;
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
  selectedNotationType:string;
  category:string;
  randomNumber;
  pidId;
  isfromApprover: any=false;
  showProps: boolean=false;
  ntype: string;
  validNotationTypes: string;
  displayNotation;
  xmlTabContent: string;
  errXMLcontent: string = '';
  modalRef: BsModalRef;
  menuToggleTitle : boolean = false;
  propertiesContainer : boolean = false;
  panelOpenState = false;
  step = 0;
  isOpenedState:number=0;
  currentNotation_name:any;
  push_Obj:any
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
  selected_bpmn_list:any  
  isEdit:boolean=false;
  downloadFileformate:Subscription;
  header_btn_functions:Subscription;
  header_approvalBtn:Subscription;
  processowner_list:any=[];
  process_owner:any;
  showconsfromanceModal:any;
  vcmId:any;
  isopen:boolean=false;

  @ViewChild('variabletemplate',{ static: true }) variabletemplate: TemplateRef<any>;
  @ViewChild('keyboardShortcut',{ static: true }) keyboardShortcut: TemplateRef<any>;
  @ViewChild('dmnTabs',{ static: true }) dmnTabs: ElementRef<any>;
  @ViewChild("notationXMLTab") notationXmlTab: MatTabGroup;
  @ViewChild('wrongXMLcontent', { static: true}) wrongXMLcontent: TemplateRef<any>;
  @ViewChild('canvasopt') canvasopt: ElementRef;
  @ViewChild('processowner_template',{ static: true }) processowner_template: TemplateRef<any>;

   constructor(private rest:RestApiService, private bpmnservice:SharebpmndiagramService,private router:Router, private spinner:NgxSpinnerService, private modalService: BsModalService,
      private dt:DataTransferService, private route:ActivatedRoute, private global:GlobalScript, private hints:BpsHints,public dialog:MatDialog,private shortcut:BpmnShortcut,
      private loader: LoaderService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  canDeactivate(): Observable<boolean> | boolean {
    return !this.isDiagramChanged 
  }

   ngOnInit() {
    this.loader.show();
    localStorage.setItem("isheader","true")
    this.randomNumber = UUID.UUID();
    this.dt.changeHints(this.hints.bpsUploadHints);
    this.bpmnservice.isConfNav.subscribe(res => this.isConfNavigation = res);
    this.route.queryParams.subscribe(params => {
      this.selected_modelId = params['bpsId'];
      this.selected_version = params['ver'];
      this.category = params['category'];
      this.processName = params['processName'];
      this.selectedNotationType = params['ntype'];
      this.isShowConformance = params['isShowConformance'] == 'true';
      this.pid=params['pid'];
      this.isfromApprover=params['isfromApprover'] == 'true';
      this.validNotationTypes = '.bpmn, .cmmn, .dmn';
      if(params['vcmId']){
        this.vcmId=params['vcmId'];
      }
    });
    this.keyboardLabels=this.shortcut[this.selectedNotationType];

    this.setRPAData();
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
      this.selectedNotationType = "bpmn";
      this.getUserBpmnList(null);
      this.dt.changeParentModule({"route":"/pages/processIntelligence/upload", "title":"Process Intelligence"});
      this.dt.changeChildModule({"route":"/pages/businessProcess/uploadProcessModel", "title":"Show Conformance"});
    }
    this.getApproverList();
    this.getprocessOwners();
   }



       ngAfterViewInit(){
        if(this.isShowConformance)
          this.getAutoSavedDiagrams()
        this.downloadFileformate=this.dt.download_notation.subscribe(res=>{
          this.fileType=res
          if(this.fileType != null){
            this.downloadBpmn();
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
            if(this.isShowConformance){
              this.processOwner_modal();
            }else{
              this.saveprocess(null);
            }
            this.isEdit=false;
          }else if(headerValue=='edit'){
            this.isEdit=true;
          }else if(headerValue == 'save&approval'){
            // this.submitDiagramForApproval();
            this.isEdit=false;
          }else if(headerValue == 'orchestartion'){
            this.orchestrate()
          }else if(headerValue == 'deploy'){
            this.openDeployDialog();
          }else if(headerValue == 'startProcess'){
            this.openVariableDialog();
          }else if(headerValue == 'fitNotation'){
            this.fitNotationView();
          }else if(headerValue == 'show_conformance'){
            this.showConformance();
          }else if(headerValue == 'getBpmn_differences'){
            this.getBpmnDifferences();
          }
        }else if(result){
          this.slideUp(headerValue)
        }
        })
        this.header_approvalBtn=this.dt.subMitApprovalValues.subscribe(res=>{
          if(res){
            this.submitDiagramForApproval(res);
          }
        })
      }
       ngOnDestroy() {
        // this.subscription.unsubscribe();
        this.downloadFileformate.unsubscribe();
        this.header_btn_functions.unsubscribe();
        this.header_approvalBtn.unsubscribe();
        this.dt.bpsNotationaScreenValues(null);
        this.dt.downloadNotationValue(null);
        this.dt.bpsHeaderValues(null);
        this.dt.submitForApproval(null);
        // if(!this.isShowConformance){
        //   let req_body={
        //     "bpmnModelId":this.selected_modelId
        //   }
        //   this.rest.deleteNotationFromTemp(req_body).subscribe(res=>{
        //   })
        // }
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
        if(taskAttributes[each_restApi.taskId][each_restApi.attrId])
        taskAttributes[each_restApi.taskId][each_restApi.attrId] = this.rest.getRestAttributes(taskAttributes[each_restApi.taskId][each_restApi.attrId], each_restApi.taskId, each_restApi.attrId);
      }
    })
  }

  fetchBpmnNotationFromPI(){
    this.rest.fetchBpmnNotationFromPI(this.pid).subscribe(res=>{
       this.pivalues=res;
    })
   }

  async getUserBpmnList(isFromConf){
    this.loader.show();
    this.saved_bpmn_list = [];
    if (!this.isShowConformance && this.isfromApprover) {
      let req_body = {
        "bpmnModelId": this.selected_modelId,
        "version": this.selected_version
      }
      this.rest.getBpmnNotationByIdandVersion(req_body).subscribe(response => {
        let res = []
        res.push(response)
        this.full_saved_bpmn_list = res;
        this.saved_bpmn_list = res;
        if (isFromConf) this.isUploaded = true;
        // else this.getSelectedNotation();
        this.selected_notation = 0;
        this.notationListOldValue = this.selected_notation;
        setTimeout(() => {
          this.loader.hide();
        }, 2000);
        setTimeout(() => {
          this.getSelectedApprover();
          this.getAutoSavedDiagrams();
        }, 100);
      });
    } else {
      await this.rest.getUserBpmnsList().subscribe((res: any[]) => {
        this.full_saved_bpmn_list = res;
        if (this.isShowConformance) {
        this.saved_bpmn_list = res.filter(each_bpmn => {
          return each_bpmn.processIntelligenceId && each_bpmn.processIntelligenceId.toString() == this.pid.toString();
        });
      }else{
        this.saved_bpmn_list = res
      }

        if (isFromConf) this.isUploaded = true;
        else this.getSelectedNotation();
        this.notationListOldValue = this.selected_notation;
        setTimeout(() => {
          this.loader.hide();
        }, 2000);
        setTimeout(() => {
          this.getSelectedApprover();
          this.getAutoSavedDiagrams();
        }, 1000);
      })
    }
  }

   getSelectedNotation(){
    //  let user_role=localStorage.getItem('userRole')
    //  if(user_role=='Process Architect' || user_role == 'Process Owner'){
    //   this.loader.show();
    //   if(this.selected_modelId){
    //     this.rest.getBPMNProcessArchNotations(this.selected_modelId).subscribe(res=>{
    //       this.saved_bpmn_list=res
    //       this.saved_bpmn_list.forEach((each_bpmn,i) => {
    //         if(this.selected_version == each_bpmn.version)
    //             this.selected_notation = i;
    //       })
    //         this.loader.hide();
    //     })
    //   }else{
    //     this.saved_bpmn_list.forEach((each_bpmn,i) => {
    //       if(each_bpmn.bpmnModelId && this.selected_modelId && each_bpmn.bpmnModelId.toString() == this.selected_modelId.toString()
    //           && each_bpmn.version >= 0 && this.selected_version == each_bpmn.version)
    //           this.selected_notation = i;
    //     })
    //   }
      
    //  }else{
    this.saved_bpmn_list.forEach((each_bpmn,i) => {
      if(each_bpmn.bpmnModelId && this.selected_modelId && each_bpmn.bpmnModelId.toString() == this.selected_modelId.toString()
          && each_bpmn.version >= 0 && this.selected_version == each_bpmn.version)
          this.selected_notation = i;
    })
  // }
      
   }
  //  async getApproverList(){
  //   await this.rest.getApproverforuser('Process Architect').subscribe( res =>  {//Process Architect
  //    if(Array.isArray(res))
  //      this.approver_list = res;
  //  });
  // }
  async getApproverList(){
    let roles={
      "roleNames": ["Process Owner","Process Architect"]
    }
    await this.rest.getmultipleApproverforusers(roles).subscribe( res =>  {//Process Architect
     if(Array.isArray(res))
       this.approver_list = res;
   });
  }

   getSelectedApprover(){
    let current_bpmn_info
      current_bpmn_info = this.saved_bpmn_list[this.selected_notation];

    if(current_bpmn_info){
      this.isApprovedNotation = current_bpmn_info["bpmnProcessStatus"] == "APPROVED";
      this.rejectedOrApproved = current_bpmn_info["bpmnProcessStatus"];
      this.updated_date_time = current_bpmn_info["modifiedTimestamp"];
      this.currentNotation_name = current_bpmn_info["bpmnProcessName"];
    }
    if(!this.isShowConformance){
      let params:Params ={'bpsId':current_bpmn_info["bpmnModelId"], 'ver': current_bpmn_info["version"], 'ntype': current_bpmn_info["ntype"]};
      if(this.isfromApprover){
         params['isfromApprover']= this.isfromApprover;
      }
      if(this.vcmId){
        params['vcmId']=this.vcmId
      }
      this.router.navigate([],{ relativeTo:this.route, queryParams:params });
    }
    let status_arr = this.isShowConformance?['APPROVED','REJECTED', 'PENDING']:['APPROVED','REJECTED']
    if(status_arr.indexOf(this.rejectedOrApproved) != -1 && current_bpmn_info){
      for(var s=0; s<this.approver_list.length; s++){
        let each = this.approver_list[s];
        if(each.userId){
          let userId = each.userId.split("@")[0];
          this.selected_approver = s['selected_approver'];
          if(userId == current_bpmn_info["approverName"]){
            this.selected_approver = s['selected_approver'];
            break;
          }
        }
      }
    }
    else
      this.selected_approver = null;
      this.push_Obj={"rejectedOrApproved":this.rejectedOrApproved,"isfromApprover":this.isfromApprover,
    "isShowConformance":this.isShowConformance,"isStartProcessBtn":this.isStartProcessBtn,"autosaveTime":this.updated_date_time,
    "isFromcreateScreen":false,'process_name':this.currentNotation_name,'isSavebtn':true,"hasConformance":this.hasConformance,"resize":this.reSize,isUploaded:this.isUploaded,"selectedNotation":this.saved_bpmn_list[this.selected_notation]}
      setTimeout(() => {
        // this.dt.bpsNotationaScreenValues(this.push_Obj);
      }, 2000);
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
    if(this.selectedNotationType=="dmn"){
      this[modeler_obj].getActiveViewer()
        .get('canvas').zoom('fit-viewport');
        this.global.notify("Notation Is fit to view port.", "success")
        return;
    }
    this[modeler_obj].get('canvas').zoom('fit-viewport');
    let msg = "";
    if(this.isConfBpmnModeler){
      if(document.getElementById("canvas1") && document.getElementById("canvas1").innerHTML.trim() != "")
        msg = (this.isConfBpmnModeler?"Left":"Right")+" side notation";
      else
        msg = "Notation"
    }
    else
      msg = "Notation"
    this.global.notify(msg+" Is fit to view port.", "success")
  }

  toggleChanges(){
    let el = document.getElementById("changes");
    if(el.classList.contains("slide-top"))
      this.clearDifferences();
    else
      this.getBpmnDifferences();

    if(el){
      el.classList.toggle("slide-top");
      el.classList.toggle("slide-bottom");
    }
  }

  initiateDiagram(){
    let _self = this;
    let modeler_obj = this.isShowConformance && !this.reSize ? "confBpmnModeler":"bpmnModeler";
    this.initModeler();
    if(this.confBpmnModeler){
      this.confBpmnModeler.on('element.changed', function(){
        _self.disableShowConformance = true;
      })
    }

    this[modeler_obj].on('linting.toggle', function(event) {

      var active = event.active;

      _self.setUrlParam('linting', active);
    });
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
        this.push_Obj={"rejectedOrApproved":'',"isfromApprover":this.isfromApprover,
          "isShowConformance":this.isShowConformance,"isStartProcessBtn":this.isStartProcessBtn,"autosaveTime":this.pivalues.updatedTime,
          "isFromcreateScreen":false,'process_name':this.pivalues.piName,'isSavebtn':true,"hasConformance":this.hasConformance,"resize":this.reSize,isUploaded:this.isUploaded,"selectedNotation":this.saved_bpmn_list[this.selected_notation]}
            this.dt.bpsNotationaScreenValues(this.push_Obj);
        if(this.autosavedDiagramVersion[0] && this.autosavedDiagramVersion[0]["bpmnProcessMeta"]){
          selected_xml = this.autosavedDiagramVersion[0]["bpmnProcessMeta"];
          this.updated_date_time = this.autosavedDiagramVersion[0]["modifiedTimestamp"];
          this.push_Obj={"rejectedOrApproved":this.autosavedDiagramVersion[0]["bpmnModelTempStatus"],"isfromApprover":this.isfromApprover,
          "isShowConformance":this.isShowConformance,"isStartProcessBtn":this.isStartProcessBtn,"autosaveTime":this.updated_date_time,
          "isFromcreateScreen":false,'process_name':this.pivalues.piName,'isSavebtn':true,"hasConformance":this.hasConformance,"resize":this.reSize,isUploaded:this.isUploaded,"selectedNotation":this.saved_bpmn_list[this.selected_notation]}
            this.dt.bpsNotationaScreenValues(this.push_Obj);
        }
        try{
          this[modeler_obj].importXML(atob(unescape(encodeURIComponent(selected_xml))))
        }catch(err){
          console.error('could not import BPMN EZFlow notation', err);
        }
     })
    }else{
      let selected_xml = atob(unescape(encodeURIComponent(this.saved_bpmn_list[this.selected_notation].bpmnXmlNotation)));
      if(this.autosavedDiagramVersion[0] && this.autosavedDiagramVersion[0]["bpmnProcessMeta"]){
        selected_xml = atob(unescape(encodeURIComponent(this.autosavedDiagramVersion[0]["bpmnProcessMeta"])));
        this.updated_date_time = this.autosavedDiagramVersion[0]["modifiedTimestamp"];
      }
      if(selected_xml == "undefined"){
        this.rest.getBPMNFileContent("assets/resources/newDiagram.bpmn").subscribe(res => {
          try{
            this[modeler_obj].importXML(res);
          }catch(err){
            console.error('could not import BPMN EZFlow notation', err);
          }
        });
      }else{
        try{
          this[modeler_obj].importXML(selected_xml);
        }catch(err){
          console.error('could not import BPMN EZFlow notation', err);
        }
      }
      this.push_Obj={"rejectedOrApproved":this.rejectedOrApproved,"isfromApprover":this.isfromApprover,
      "isShowConformance":this.isShowConformance,"isStartProcessBtn":this.isStartProcessBtn,"autosaveTime":this.updated_date_time,
      "isFromcreateScreen":false,'process_name':this.currentNotation_name,'isSavebtn':true,"hasConformance":this.hasConformance,"resize":this.reSize,isUploaded:this.isUploaded,"selectedNotation":this.saved_bpmn_list[this.selected_notation]}
        this.dt.bpsNotationaScreenValues(this.push_Obj);
    }
    // this.push_Obj={"rejectedOrApproved":this.rejectedOrApproved,"isfromApprover":this.isfromApprover,
    // "isShowConformance":this.isShowConformance,"isStartProcessBtn":this.isStartProcessBtn,"autosaveTime":this.updated_date_time,
    // "isFromcreateScreen":false,'process_name':this.currentNotation_name,'isSavebtn':true,"hasConformance":this.hasConformance,"resize":this.reSize,isUploaded:this.isUploaded}
    // setTimeout(() => {
    //   this.dt.bpsNotationaScreenValues(this.push_Obj);
    // }, 3000);
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
  this.reSize = false;
  this.push_Obj={"rejectedOrApproved":this.rejectedOrApproved,"isfromApprover":this.isfromApprover,
  "isShowConformance":this.isShowConformance,"isStartProcessBtn":this.isStartProcessBtn,"autosaveTime":this.updated_date_time,
  "isFromcreateScreen":false,'process_name':this.currentNotation_name,'isSavebtn':true,"hasConformance":this.hasConformance,"resize":this.reSize,isUploaded:this.isUploaded,"selectedNotation":this.saved_bpmn_list[this.selected_notation]}
this.dt.bpsNotationaScreenValues(this.push_Obj)
  if(this.isDiagramChanged){
    this.confirmationService.confirm({
      message: "Your current changes will be lost when changing the notation.",
      header: "Are you sure?",
      rejectLabel: "No",
      acceptLabel: "Yes",
      rejectButtonStyleClass: 'btn reset-btn',
      acceptButtonStyleClass: 'btn bluebg-button',
      defaultFocus: 'none',
      rejectIcon: 'null',
      acceptIcon: 'null',
      accept: () => {
        _self.isDiagramChanged = false;
        _self.disableShowConformance = false;
        _self.notationListNewValue = _self.selected_notation;
        _self.selected_notation = value;
        _self.saveprocess(_self.notationListNewValue);
      },
      reject: () => {
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
        this.hasConformance = current_bpmn_info["hasConformance"];
        if(this.autosavedDiagramVersion[0] && this.autosavedDiagramVersion[0]["bpmnProcessMeta"]){
          selected_xml = atob(unescape(encodeURIComponent(this.autosavedDiagramVersion[0]["bpmnProcessMeta"])));
          this.updated_date_time = this.autosavedDiagramVersion[0]["modifiedTimestamp"];
          this.push_Obj={"rejectedOrApproved":this.rejectedOrApproved,"isfromApprover":this.isfromApprover,
          "isShowConformance":this.isShowConformance,"isStartProcessBtn":this.isStartProcessBtn,"autosaveTime":this.updated_date_time,
          "isFromcreateScreen":false,'process_name':this.currentNotation_name,'isSavebtn':true,"hasConformance":this.hasConformance,"resize":this.reSize,isUploaded:this.isUploaded,"selectedNotation":this.saved_bpmn_list[this.selected_notation]}
          this.dt.bpsNotationaScreenValues(this.push_Obj)
        }
        this.initModeler();
        setTimeout(()=> {
          if(this.hasConformance) this.initBpmnModeler();
          if(this.bpmnModeler){
            if(selected_xml && selected_xml != "undefined"){
              try{
                this.bpmnModeler.importXML(selected_xml);
                this.oldXml = selected_xml;
                this.newXml = selected_xml;
              }catch(err){
                console.error('could not import BPMN EZFlow notation', err);
              }
            }else{
              this.rest.getBPMNFileContent("assets/resources/newDiagram.bpmn").subscribe(res => {
                let encrypted_bpmn = btoa(unescape(encodeURIComponent(res)));
                try{
                  this.bpmnModeler.importXML(encrypted_bpmn);
                  this.oldXml = selected_xml;
                  this.newXml = selected_xml;
                }catch(err){
                  console.error('could not import BPMN EZFlow notation', err);
                }
              });
              }
            }
          },0)
          if(this.isShowConformance && current_bpmn_info["processIntelligenceId"] && current_bpmn_info["processIntelligenceId"] == this.pid ){
            this.isConfBpmnModeler = !this.hasConformance;
            let bpmn_not = this.hasConformance ? current_bpmn_info["bpmnConfProcessMeta"] : this.pivalues["data"];
            try{
              this.confBpmnModeler.importXML(btoa(unescape(encodeURIComponent(bpmn_not))));
            }catch(err){
              console.error('could not import BPMN EZFlow notation', err);
            }
          }
          _self.loader.hide();
      }
    });

    // Swal.fire({
    //   title: 'Are you sure?',
    //   text: 'Your current changes will be lost on changing notation.',
    //   icon: 'warning',
    //   showCancelButton: true,
    //   customClass: {
    //     confirmButton: 'btn bluebg-button',
    //     cancelButton:  'btn new-cancelbtn',
    //   },
    //   heightAuto: false,
    //   confirmButtonText: 'Save and Continue',
    //   cancelButtonText: 'Discard'
    // }).then((res) => {
    //   if(res.value){
    //     _self.isDiagramChanged = false;
    //     _self.disableShowConformance = false;
    //     _self.notationListNewValue = _self.selected_notation;
    //     _self.selected_notation = value;
    //     _self.saveprocess(_self.notationListNewValue);
    //   }else if(res.dismiss === Swal.DismissReason.cancel){
    //     this.isDiagramChanged = false;
    //     this.diplayApproveBtn = true;
    //     this.keyboardLabels=this.shortcut[this.selectedNotationType];
    //     this.notationListOldValue = this.selected_notation;
    //     let current_bpmn_info = this.saved_bpmn_list[this.selected_notation];
    //     let selected_xml = atob(unescape(encodeURIComponent(current_bpmn_info.bpmnXmlNotation)));
    //     this.selectedNotationType = current_bpmn_info["ntype"];
    //       this.fileType = "svg";
    //       if(this.dmnTabs)
    //         this.dmnTabs.nativeElement.innerHTML = "sdfasdfasdf";
    //     this.isApprovedNotation = current_bpmn_info["bpmnProcessStatus"] == "APPROVED";
    //     this.hasConformance = current_bpmn_info["hasConformance"];
    //     if(this.autosavedDiagramVersion[0] && this.autosavedDiagramVersion[0]["bpmnProcessMeta"]){
    //       selected_xml = atob(unescape(encodeURIComponent(this.autosavedDiagramVersion[0]["bpmnProcessMeta"])));
    //       this.updated_date_time = this.autosavedDiagramVersion[0]["modifiedTimestamp"];
    //       this.push_Obj={"rejectedOrApproved":this.rejectedOrApproved,"isfromApprover":this.isfromApprover,
    //       "isShowConformance":this.isShowConformance,"isStartProcessBtn":this.isStartProcessBtn,"autosaveTime":this.updated_date_time,
    //       "isFromcreateScreen":false,'process_name':this.currentNotation_name,'isSavebtn':true,"hasConformance":this.hasConformance,"resize":this.reSize,isUploaded:this.isUploaded,"selectedNotation":this.saved_bpmn_list[this.selected_notation]}
    //       this.dt.bpsNotationaScreenValues(this.push_Obj)
    //     }
    //     this.initModeler();
    //     setTimeout(()=> {
    //       if(this.hasConformance) this.initBpmnModeler();
    //       if(this.bpmnModeler){
    //         if(selected_xml && selected_xml != "undefined"){
    //           try{
    //             this.bpmnModeler.importXML(selected_xml);
    //             this.oldXml = selected_xml;
    //             this.newXml = selected_xml;
    //           }catch(err){
    //             console.error('could not import BPMN EZFlow notation', err);
    //           }
    //         }else{
    //           this.rest.getBPMNFileContent("assets/resources/newDiagram.bpmn").subscribe(res => {
    //             let encrypted_bpmn = btoa(unescape(encodeURIComponent(res)));
    //             try{
    //               this.bpmnModeler.importXML(encrypted_bpmn);
    //               this.oldXml = selected_xml;
    //               this.newXml = selected_xml;
    //             }catch(err){
    //               console.error('could not import BPMN EZFlow notation', err);
    //             }
    //           });
    //           }
    //         }
    //       },0)
    //       if(this.isShowConformance && current_bpmn_info["processIntelligenceId"] && current_bpmn_info["processIntelligenceId"] == this.pid ){
    //         this.isConfBpmnModeler = !this.hasConformance;
    //         let bpmn_not = this.hasConformance ? current_bpmn_info["bpmnConfProcessMeta"] : this.pivalues["data"];
    //         try{
    //           this.confBpmnModeler.importXML(btoa(unescape(encodeURIComponent(bpmn_not))));
    //         }catch(err){
    //           console.error('could not import BPMN EZFlow notation', err);
    //         }
    //       }
    //       _self.loader.hide();
    //     }
    //   })
  }else{
      this.loader.show();
      this.isDiagramChanged = false;
      this.disableShowConformance = false;
      this.diplayApproveBtn = true;
      let current_bpmn_info = this.saved_bpmn_list[this.selected_notation];
      let selected_xml = atob(unescape(encodeURIComponent(current_bpmn_info.bpmnXmlNotation)));
      this.isApprovedNotation = current_bpmn_info["bpmnProcessStatus"] == "APPROVED";
      this.hasConformance = current_bpmn_info["hasConformance"];
      this.selectedNotationType = current_bpmn_info["ntype"];
      this.fileType = "svg";
      if(this.dmnTabs)
        this.dmnTabs.nativeElement.innerHTML = "sdfasdfasdf";
      if(this.autosavedDiagramVersion[0] && this.autosavedDiagramVersion[0]["bpmnProcessMeta"]){
        selected_xml = atob(unescape(encodeURIComponent(this.autosavedDiagramVersion[0]["bpmnProcessMeta"])));
        this.updated_date_time = this.autosavedDiagramVersion[0]["modifiedTimestamp"];
        this.push_Obj={"rejectedOrApproved":this.rejectedOrApproved,"isfromApprover":this.isfromApprover,
        "isShowConformance":this.isShowConformance,"isStartProcessBtn":this.isStartProcessBtn,"autosaveTime":this.updated_date_time,
        "isFromcreateScreen":false,'process_name':this.currentNotation_name,'isSavebtn':true,"hasConformance":this.hasConformance,"resize":this.reSize,isUploaded:this.isUploaded,"selectedNotation":this.saved_bpmn_list[this.selected_notation]}
      this.dt.bpsNotationaScreenValues(this.push_Obj)
      }
    this.initModeler();
    setTimeout(()=> {
      if(this.hasConformance) this.initBpmnModeler();
      if(this.bpmnModeler){
        if(selected_xml == "undefined"){
          this.rest.getBPMNFileContent("assets/resources/newDiagram.bpmn").subscribe(res => {
              try{
                this.bpmnModeler.importXML(res);
                this.oldXml = selected_xml;
                this.newXml = selected_xml;
              }catch(err){
                console.error('could not import BPMN EZFlow notation', err);
              }
            });
          }else{
            try{
              this.bpmnModeler.importXML(selected_xml);
              this.oldXml = selected_xml;
              this.newXml = selected_xml;
            }catch(err){
              console.error('could not import BPMN EZFlow notation', err);
            }
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
        try{
          this.confBpmnModeler.importXML(atob(unescape(encodeURIComponent(bpmn_not))));
        }catch(err){
          console.error('could not import BPMN EZFlow notation', err);
        }
      }
      _self.loader.hide();
    }
    this.getSelectedApprover();
}

  autoSaveBpmnDiagram(){
    this.isStartProcessBtn=false;
    let _self = this;
    let bpmnModel={};
    let modeler_obj = this.isShowConformance && !this.reSize ? "confBpmnModeler":"bpmnModeler";
    bpmnModel["ntype"] = this.isShowConformance ? "bpmn":_self.saved_bpmn_list[_self.selected_notation]["ntype"];
    if(!(this.isShowConformance && !this.reSize)){
      bpmnModel["bpmnModelId"] = _self.saved_bpmn_list[_self.selected_notation]["bpmnModelId"];
      bpmnModel["version"] = _self.saved_bpmn_list[_self.selected_notation]["version"];
      if(_self.autosavedDiagramVersion[0] && _self.autosavedDiagramVersion[0]["bpmnModelId"] == bpmnModel["bpmnModelId"]){
        bpmnModel["bpmnModelTempId"] = _self.autosavedDiagramVersion[0]["bpmnModelTempId"];
      }else{
      //  bpmnModel["createdTimestamp"] = new Date();
      }
    }else{
      let autoSaveExists = _self.autosavedDiagramVersion[0] && _self.autosavedDiagramVersion[0]["processIntelligenceId"].toString() == _self.pid.toString();
      let autoSaveVersion = _self.autosavedDiagramVersion[0];
      bpmnModel["bpmnModelId"] = autoSaveExists ? autoSaveVersion["bpmnModelId"]:_self.randomNumber;
      bpmnModel["version"] = autoSaveExists ? autoSaveVersion["version"]:0;
      bpmnModel["processIntelligenceId"] = parseInt(this.pid);
     // bpmnModel["createdTimestamp"] = this.pivalues["createdTime"];
      if(autoSaveExists)
        bpmnModel["bpmnModelTempId"] = autoSaveVersion["bpmnModelTempId"];
    }
    this[modeler_obj].saveXML({ format: true }, function(err, xml) {
      _self.oldXml = _self.newXml;
      _self.newXml = xml;
      if(_self.oldXml != _self.newXml){
        if(!_self.isShowConformance){
        _self.spinner.show();
        }
        bpmnModel["bpmnProcessMeta"] = btoa(unescape(encodeURIComponent(_self.newXml)));
      if(_self.isShowConformance){
        // _self.autoSaveProcessowner_modal();
        // _self.showconsfromanceModal=bpmnModel

      }else{
        _self.autoSaveDiagram(bpmnModel);
      }
      }
    });
  }

  showConformance(){
    this.loader.show();
    this.selected_notation = 0;
    this.notationListOldValue = 0;
    this.isUploaded = this.saved_bpmn_list.length != 0;
    this.reSize=true;
    this.isEdit=false;
    this.push_Obj={"rejectedOrApproved":this.rejectedOrApproved,"isfromApprover":this.isfromApprover,
    "isShowConformance":this.isShowConformance,"isStartProcessBtn":this.isStartProcessBtn,"autosaveTime":this.updated_date_time,
    "isFromcreateScreen":false,'process_name':this.currentNotation_name,'isSavebtn':true,"hasConformance":this.hasConformance,"resize":this.reSize,isUploaded:this.isUploaded,"selectedNotation":this.saved_bpmn_list[this.selected_notation]}
this.dt.bpsNotationaScreenValues(this.push_Obj)
    if(this.isUploaded){
      this.bpmnservice.changeConfNav(true);
      this.notationListOldValue = this.selected_notation;
      this.getSelectedApprover();
      this.getAutoSavedDiagrams();
    }
    this.loader.hide();
  }

  autoSaveDiagram(model){
      model.processOwner = this.saved_bpmn_list[this.selected_notation]['processOwner'];
    model.processOwnerName = this.saved_bpmn_list[this.selected_notation]['processOwnerName'];
    this.rest.autoSaveBPMNFileContent(model).subscribe(
      data=>{
        this.getAutoSavedDiagrams();
        this.autosaveObj=data
        this.isEdit=true;
        this.updated_date_time = new Date();
        this.spinner.hide();
        this.push_Obj={"rejectedOrApproved":this.rejectedOrApproved,"isfromApprover":this.isfromApprover,
        "isShowConformance":this.isShowConformance,"isStartProcessBtn":this.isStartProcessBtn,"autosaveTime":this.updated_date_time,
        "isFromcreateScreen":false,'process_name':this.currentNotation_name,'isSavebtn':false,"hasConformance":this.hasConformance,"resize":this.reSize,"isEditbtn":true,isUploaded:this.isUploaded,"selectedNotation":this.saved_bpmn_list[this.selected_notation]}
      this.dt.bpsNotationaScreenValues(this.push_Obj)
      },
      err => {
        this.spinner.hide();
    })
  }

  automate(){
    let selected_id = this.saved_bpmn_list[this.selected_notation].id;
    this.rest.getautomatedtasks(selected_id).subscribe((automatedtasks)=>{
      this.messageService.add({severity: "success", summary: "Success", detail: "Tasks automated successfully!"});
      // Swal.fire(
      //   'Tasks automated successfully!',
      //   '',
      //   'success'
      // );
    })
  }

  orchestrate(){
    let selected_id = this.saved_bpmn_list[this.selected_notation].id;
    this.router.navigate(["/pages/serviceOrchestration/home"], { queryParams: { processid: selected_id }});
  }

  downloadFile(url){
    var link = document.createElement("a");
    link.href = url;
    let fileName = this.isShowConformance ? this.processName : this.saved_bpmn_list[this.selected_notation]["bpmnProcessName"];
    if(fileName.trim().length == 0 ) fileName = "newDiagram";
    link.download = fileName+"."+this.fileType;
    link.innerHTML = "Click here to download the notation";
    link.click();
  }

  downloadBpmn(){
    let yesProceed = true;
    if(this.isShowConformance && this.isUploaded && this.bpmnModeler){
      yesProceed = confirm('You are about to download '+(this.isConfBpmnModeler?'"AS IS"':'"TO BE"')+' notation')
    }
    if(!yesProceed) return;
    let modeler_obj = this.isConfBpmnModeler ? "confBpmnModeler":"bpmnModeler";
    if(this[modeler_obj]){
      let _self = this;
      if(this.fileType == this.selectedNotationType){
        this[modeler_obj].saveXML({ format: true }, function(err, xml) {
          var blob = new Blob([xml], { type: "application/xml" });
          var url = window.URL.createObjectURL(blob);
         _self.downloadFile(url);
        });
      }else{
        let modelerExp = this[modeler_obj];
        if(this.selectedNotationType == "dmn") modelerExp = this[modeler_obj]._viewers.drd;
          modelerExp.saveSVG(function(err, svgContent) {
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
    setTimeout(() => {
      this.dt.downloadNotationValue(null)
    }, 3000);
  }

  uploadAgainBpmn(e){
    this.loader.show();
    let _self = this;
    var myReader: FileReader = new FileReader();
    myReader.onloadend = (ev) => {
      this.loader.show();
      let fileString:string = myReader.result.toString();
      try{
        this.bpmnModeler.importXML(fileString);
        this.oldXml = fileString.trim();
        this.newXml = fileString.trim();
        this.loader.hide();
      }catch(err){
        console.error('could not import BPMN EZFlow notation', err);
      }
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

  initModeler(){
    let _self = this;
    if(this.notationXmlTab)
      this.notationXmlTab.selectedIndex = 0;
    let modeler_obj = this.isShowConformance && !this.reSize ? "confBpmnModeler":"bpmnModeler";
    let elId = modeler_obj == "confBpmnModeler"?"canvas2":"canvas1";
    if(this[modeler_obj]){
      document.getElementById(elId).innerHTML = ""
      document.getElementById("properties").innerHTML = ""
    }
    var CamundaModdleDescriptor = require("camunda-bpmn-moddle/resources/camunda.json");
    var CmmnCamundaModdleDescriptor = require("camunda-cmmn-moddle/resources/camunda.json");
    var DmnCamundaModdleDescriptor = require("camunda-dmn-moddle/resources/camunda.json");
    this.keyboardLabels=this.shortcut[this.selectedNotationType];
    if(this.selectedNotationType == "cmmn"){
      this[modeler_obj] = new CmmnJS({
        additionalModules: [
          CmmnPropertiesPanelModule,
          CmmnPropertiesProviderModule
        ],
        container: '#'+elId,
        propertiesPanel: {
          parent: '#properties'
        },
        moddleExtensions: {
          camunda: CmmnCamundaModdleDescriptor
        }
      });
    }else if(this.selectedNotationType == "dmn"){
      this[modeler_obj] = new DmnJS({
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
        container: '#'+elId,
        moddleExtensions: {
          camunda: DmnCamundaModdleDescriptor
        }
      });
      this[modeler_obj].on('views.changed', function(event) {
        if(_self.dmnTabs)
          _self.dmnTabs.nativeElement.innerHTML = "test";
      })
    }else{
      this[modeler_obj] = new BpmnJS({
        linting: {
           bpmnlint: bpmnlintConfig,
           active: _self.getUrlParam('linting')
        },
        additionalModules: [
          minimapModule,
          PropertiesPanelModule,
          PropertiesProviderModule,
          {[InjectionNames.bpmnPropertiesProvider]: ['type', OriginalPropertiesProvider.propertiesProvider[1]]},
          // {[InjectionNames.propertiesProvider]: ['type', PreviewFormProvider]}, // commented for remove console errors in prod build
          // {[InjectionNames.replaceMenuProvider]: ['type', ReplaceMenuProvider]},
          // CustomRenderer,
          lintModule,
          BpmnColorPickerModule
        ],
        container: '#'+elId,
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
      let canvas = this[modeler_obj].get('canvas');
      canvas.zoom('fit-viewport');
      this[modeler_obj].get("minimap").open();
    }
    this[modeler_obj].on('element.changed', function(){     
      _self.isDiagramChanged = true;
      let now = new Date().getTime();
      if(now - _self.last_updated_time > 10*1000){
        _self.autoSaveBpmnDiagram();
        _self.last_updated_time = now;
      }
    })
    if(this.isShowConformance){
      setTimeout(() => {
        this.fitNotationViewfromPI();
        }, 4000);
    }
  }

  submitDiagramForApproval(e){
    let yesProceed = true;
    this.isStartProcessBtn=false;
    if(this.isShowConformance && this.isUploaded && this.bpmnModeler){
      yesProceed = confirm('You are about to save and submit '+(this.isConfBpmnModeler?'"AS IS"':'"TO BE"')+' notation for approval')
    }
    if(!yesProceed) return;
    let bpmnModel:BpmnModel = new BpmnModel();
    this.selected_approver=e.selectedApprovar
    if((!this.selected_approver && this.selected_approver != 0) || this.selected_approver <= -1){
      this.messageService.add({severity: "error", summary: "Error", detail: "Please select an approver from the list given above!"});
      // Swal.fire({
      //   icon: 'error',
      //   title: 'No approver',
      //   text: 'Please select approver from the list given above !',
      //   heightAuto: false,
      // });
      return;
    }
    this.loader.show();
    let _self = this;
    let sel_List = this.saved_bpmn_list[this.selected_notation];
    let modeler_obj = this.isConfBpmnModeler ? "confBpmnModeler":"bpmnModeler";
    let sel_appr = this.approver_list[this.selected_approver];
    bpmnModel.approverEmail = sel_appr.userId;
    bpmnModel.approverName = sel_appr.firstName+" "+sel_appr.lastName;
    if(sel_List){
      bpmnModel.userName = sel_List["userName"];
      bpmnModel.tenantId = sel_List["tenantId"];
      bpmnModel.userEmail = sel_List['userEmail'];
    }
  if(this.isShowConformance){
    bpmnModel.notationFromPI = true;
    bpmnModel.processOwner=e.processOwner;
    bpmnModel.processOwnerName=e.processOwnerName;
    bpmnModel.bpmnProcessName = this.processName;
    bpmnModel.ntype = this.ntype;
    bpmnModel.category = this.category;
    bpmnModel.processIntelligenceId = this.pid;
    bpmnModel.ntype ='bpmn' //Notation type for bpmnFromPI
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
    bpmnModel.processOwner = _self.saved_bpmn_list[_self.selected_notation]['processOwner'];
    bpmnModel.processOwnerName = _self.saved_bpmn_list[_self.selected_notation]['processOwnerName'];
    bpmnModel.bpmnModelId = sel_List['bpmnModelId'];
    bpmnModel.bpmnProcessName = sel_List['bpmnProcessName'];
    bpmnModel.category = sel_List['category'];
    bpmnModel.ntype = sel_List['ntype'] ? sel_List['ntype'] : '-';
    bpmnModel.processIntelligenceId= sel_List['processIntelligenceId']? sel_List['processIntelligenceId']:Math.floor(100000 + Math.random() * 900000);//?? Will repeat need to replace with proper alternative??
    bpmnModel.id = sel_List["id"];
  }
    bpmnModel.bpmnProcessStatus="PENDING";
    bpmnModel.bpmnProcessApproved = 0;
    this[modeler_obj].saveXML({ format: true }, function(err, xml) {
      let final_notation = btoa(unescape(encodeURIComponent(xml)));
      bpmnModel.bpmnXmlNotation = final_notation;
      bpmnModel.role=localStorage.getItem("userRole");
      _self.rest.submitBPMNforApproval(bpmnModel).subscribe(
        data=>{
          _self.loader.hide();
          _self.isDiagramChanged = false;
          if(data["errorCode"] == "2005"){
            this.messageService.add({severity: "error", summary: "Error", detail: "The notation is already in 'PENDING' status !"});
            // Swal.fire({
            //   icon: 'error',
            //   title: 'Already exists!',
            //   text: 'The notation is already in "PENDING" status !',
            //   heightAuto: false,
            // });
          }else{
            _self.rejectedOrApproved="PENDING";
            _self.push_Obj={"rejectedOrApproved":"PENDING","isfromApprover":_self.isfromApprover,
            "isShowConformance":_self.isShowConformance,"isStartProcessBtn":_self.isStartProcessBtn,"autosaveTime":_self.updated_date_time,
            "isFromcreateScreen":false,'process_name':_self.currentNotation_name,'isSavebtn':true}
            _self.dt.bpsNotationaScreenValues(_self.push_Obj);
            this.messageService.add({severity: "success", summary: "Success", detail: "Your changes have been saved and submitted for approval successfully!"})
            // Swal.fire({
            //   icon: 'success',
            //   title: 'Saved!',
            //   text: 'Your changes has been saved and submitted for approval successfully !',
            //   heightAuto: false,
            // });
          }
        },err => {
          _self.loader.hide();
          this.messageService.add({severity: "error", summary: "Error", detail: "Oops! Something went wrong. Please try again."});
          // Swal.fire({
          //   icon: 'error',
          //   title: 'Oops!',
          //   text: 'Something went wrong. Please try again !',
          //   heightAuto: false,
          // });
        })
    })
  }

  saveprocess(newVal){
    let yesProceed = true;
    this.isStartProcessBtn=false;
    if(this.isShowConformance && this.isUploaded){
      yesProceed = confirm('You are about to save '+(this.isConfBpmnModeler?'"AS IS"':'"TO BE"')+' notation')
    }
    if(!yesProceed) return;
    this.isDiagramChanged = false;
    this.loader.show();
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
      bpmnModel.ntype = this.ntype;
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
      bpmnModel.bpmnProcessStatus = "INPROGRESS";
      bpmnModel.notationFromPI = true;
      bpmnModel.ntype ='bpmn' //Notation type for bpmnFromPI
    }else{
      bpmnModel.bpmnProcessName = sel_List['bpmnProcessName'];
      bpmnModel.bpmnModelId = sel_List['bpmnModelId'];
      bpmnModel.category = sel_List['category'];
      bpmnModel.ntype = sel_List['ntype'] ? sel_List['ntype'] : '-';
      if(sel_List['id'])
        bpmnModel.id = sel_List['id'];
      else
        delete(bpmnModel.id);
      bpmnModel.bpmnProcessStatus = sel_List['bpmnProcessStatus'];
    }
    let modeler_obj = this.isConfBpmnModeler ? "confBpmnModeler":"bpmnModeler";
    this[modeler_obj].saveXML({ format: true }, function(err, xml) {
      let final_notation = btoa(unescape(encodeURIComponent(xml)));
      bpmnModel.bpmnXmlNotation = final_notation;
      if(_self.isShowConformance && !_self.isConfBpmnModeler){
        bpmnModel.hasConformance = true;
        _self.confBpmnModeler.saveXML({ format: true }, function(err, xml2) {
          bpmnModel.bpmnConfProcessMeta = btoa(unescape(encodeURIComponent(xml2)));;
        })
        _self.push_Obj={"rejectedOrApproved":_self.rejectedOrApproved,"isfromApprover":_self.isfromApprover,
        "isShowConformance":_self.isShowConformance,"isStartProcessBtn":_self.isStartProcessBtn,"autosaveTime":_self.updated_date_time,
        "isFromcreateScreen":false,'process_name':_self.currentNotation_name,'isSavebtn':true,"hasConformance":_self.hasConformance,"resize":_self.reSize,isUploaded:_self.isUploaded}
        _self.dt.bpsNotationaScreenValues(_self.push_Obj)
      }
      if(_self.isShowConformance){
        bpmnModel.processOwner=_self.processowner_list[_self.process_owner].userId;
        bpmnModel.processOwnerName=_self.processowner_list[_self.process_owner].firstName + ' ' + _self.processowner_list[_self.process_owner].lastName;
      }else{
        bpmnModel.processOwner = _self.saved_bpmn_list[_self.selected_notation]['processOwner'];
        bpmnModel.processOwnerName = _self.saved_bpmn_list[_self.selected_notation]['processOwnerName'];
      }
      bpmnModel.role=localStorage.getItem("userRole");
      _self.rest.saveBPMNprocessinfofromtemp(bpmnModel).subscribe(
        data=>{
          _self.loader.hide();
          if(data["errorCode"] == "2005"){
            this.messageService.add({severity: "error", summary: "Error", detail: "The notation is already in 'PENDING' status!"});
            // Swal.fire({
            //   icon: 'error',
            //   title: 'Already exists!',
            //   text: 'The notation is already in "PENDING" status !',
            //   heightAuto: false,
            // });
          }else{
            if( !_self.isShowConformance && (status == "APPROVED" || status == "REJECTED")){
              
              _self.rest.getBpmnNotationById(sel_List["bpmnModelId"]).subscribe(res=>{ // new added code
                let all_bpmns  // new added code 
                all_bpmns = res  // new added code

              // let all_bpmns = _self.saved_bpmn_list.filter(each => { return each.bpmnModelId == sel_List["bpmnModelId"]})   // uncomment if above code removed
              let inprogress_version = 0;
              all_bpmns.forEach(each => {
                if(inprogress_version < each.version)
                inprogress_version = each.version;
              })
              let params:Params = {'bpsId':sel_List["bpmnModelId"], 'ver': inprogress_version, 'ntype': sel_List["ntype"]}
              if(_self.vcmId){
                params['vcmId']=_self.vcmId
              }
              _self.router.navigate([],{ relativeTo:_self.route, queryParams:params });
              
              // new added code start
              _self.saved_bpmn_list = res;
              let filterList = _self.saved_bpmn_list.filter(ele=>{return ele.version == inprogress_version})
                _self.rejectedOrApproved = filterList[0]['bpmnProcessStatus'];
                _self.updated_date_time = filterList[0]["modifiedTimestamp"];
              _self.push_Obj={"rejectedOrApproved":_self.rejectedOrApproved,"isfromApprover":_self.isfromApprover,
              "isShowConformance":_self.isShowConformance,"isStartProcessBtn":_self.isStartProcessBtn,"autosaveTime":_self.updated_date_time,
              "isFromcreateScreen":false,'process_name':_self.currentNotation_name,'isSavebtn':true,"hasConformance":_self.hasConformance,"resize":_self.reSize,isUploaded:_self.isUploaded}
              _self.dt.bpsNotationaScreenValues(_self.push_Obj)
            })
            // new added code end
            
            }
            if(_self.isShowConformance)
            _self.modalRef.hide();
            if(_self.isUploaded) _self.getUserBpmnList(true);
            else _self.getUserBpmnList(null);
            this.messageService.add({severity: "success", summary: "Success", detail: "Your changes have been saved successfully!"});
            // Swal.fire({
            //   icon: 'success',
            //   title: 'Saved!',
            //   text: 'Your changes has been saved successfully !',
            //   heightAuto: false,
            // });
            _self.process_owner='';
            if(newVal){
              _self.selected_notation = newVal;
              let current_bpmn_info = _self.saved_bpmn_list[_self.selected_notation];
              let selected_xml = atob(current_bpmn_info.bpmnXmlNotation);
              try{
                this.bpmnModeler.importXML(selected_xml);
                this.oldXml = selected_xml;
                this.newXml = selected_xml;
              }catch(err){
                console.error('could not import BPMN EZFlow notation', err);
              }
            }
          }
        },
        err => {
          _self.loader.hide();
          if(err.error.message == "2002"){
            this.confirmationService.confirm({
              message: "Oops! An in-progress process already exists for the selected process. Please make changes to the existing in-progress notation!",
              header: 'Info',
              acceptLabel:'Ok',
              rejectVisible: false,
              rejectButtonStyleClass: 'btn reset-btn',
              acceptButtonStyleClass: 'btn bluebg-button',
              defaultFocus: 'none',
              acceptIcon: 'null',
              accept: () => {},
            });
            
            // Swal.fire({
            //   icon: 'warning',
            //   title: 'Oops!',
            //   text: 'An Inprogress process already exists for the selected process. \nPlease do the changes in existing inprogress notation !',
            //   heightAuto: false,
            // });
          }         
          else
            this.messageService.add({severity: "error", summary: "Error", detail: "Oops! Something went wrong. Please try again."});
          // Swal.fire({
          //   icon: 'error',
          //   title: 'Oops!',
          //   text: 'Something went wrong. Please try again !',
          //   heightAuto: false,
          // });
        })
    })
    this.push_Obj={"rejectedOrApproved":this.rejectedOrApproved,"isfromApprover":this.isfromApprover,
    "isShowConformance":this.isShowConformance,"isStartProcessBtn":this.isStartProcessBtn,"autosaveTime":this.updated_date_time,
    "isFromcreateScreen":false,'process_name':this.currentNotation_name,'isSavebtn':false,"hasConformance":this.hasConformance,"resize":this.reSize,isUploaded:this.isUploaded,"selectedNotation":this.saved_bpmn_list[this.selected_notation]}
      this.dt.bpsNotationaScreenValues(this.push_Obj);
  }

  uploadConfBpmn(confBpmnData){
    let _self = this;
    let decrypted_data = atob(unescape(encodeURIComponent(confBpmnData)));
    this.loader.show();
    setTimeout(()=> {
      this.initBpmnModeler();
      try{
        this.bpmnModeler.importXML(decrypted_data);
        this.confBpmnXml = decrypted_data;
        this.bpmnservice.uploadConfirmanceBpmnXMLDef( _self.bpmnModeler._definitions);
        this.loader.hide();
        this.getUserBpmnList(null);
      }catch(err){
        console.error('could not import BPMN EZFlow notation', err);
      }
    }, 3000);
   }

  displayXML(e){
    let _self = this;
    _self.loader.show();
    if(e.index == 1){
      this.bpmnModeler.saveXML({ format: true }, function(err, updatedXML) {
        _self.xmlTabContent = updatedXML;
        _self.loader.hide();
      })
    }else{
      this.bpmnModeler.importXML(this.xmlTabContent, function(err){
        if(err){
          _self.errXMLcontent = err;
          _self.openModal(_self.wrongXMLcontent);
          _self.loader.hide();
        }
        else{
          _self.oldXml = _self.xmlTabContent;
          _self.newXml = _self.xmlTabContent;
          _self.loader.hide();
        }
      });
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
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
    this.isEdit=false;
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
    this.push_Obj={"rejectedOrApproved":this.rejectedOrApproved,"isfromApprover":this.isfromApprover,
    "isShowConformance":this.isShowConformance,"isStartProcessBtn":this.isStartProcessBtn,"autosaveTime":this.updated_date_time,
    "isFromcreateScreen":false,'process_name':this.currentNotation_name,'isSavebtn':false,"hasConformance":this.hasConformance,"resize":this.reSize,isUploaded:this.isUploaded,"selectedNotation":this.saved_bpmn_list[this.selected_notation]}
this.dt.bpsNotationaScreenValues(this.push_Obj)
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
      this.loader.hide();
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
    let modeler_obj = this.isConfBpmnModeler ? "confBpmnModeler":"bpmnModeler";
    this[modeler_obj].saveXML({ format: true }, function(err, xml) {
      _self.openDialog(xml)
    }); 
  }

  openDialog(data){
    let fileName = this.isShowConformance ? this.processName : this.saved_bpmn_list[this.selected_notation]["bpmnProcessName"];
    if(fileName.trim().length == 0 ) fileName = "newDiagram";
    var dd = fileName+"."+this.selectedNotationType;
     this.dialog.open(DeployNotationComponent, {disableClose: true,data: {
      dataKey: data, fileNme: dd,
      category:this.saved_bpmn_list[this.selected_notation]['category']
    }});
    
    let deployResponse;
    this.dt.current_startProcessValues.subscribe(res=>{
      if(res){
      deployResponse=res
          this.definationId=deployResponse.definationId
          this.isStartProcessBtn=deployResponse.startprocess
          this.push_Obj={"rejectedOrApproved":this.rejectedOrApproved,"isfromApprover":this.isfromApprover,
          "isShowConformance":this.isShowConformance,"isStartProcessBtn":this.isStartProcessBtn,"autosaveTime":this.updated_date_time,
          "isFromcreateScreen":false,'process_name':this.currentNotation_name,'isSavebtn':true,"hasConformance":this.hasConformance,"resize":this.reSize,isUploaded:this.isUploaded,"selectedNotation":this.saved_bpmn_list[this.selected_notation]}
            this.dt.bpsNotationaScreenValues(this.push_Obj);
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
    let response;
    this.rest.startBpmnProcess(reqBody).subscribe(res=>{response=res
      if(response.failure){
        this.messageService.add({severity: "error", summary: "Error", detail: response.failure });
        // Swal.fire(
        //   'Error!',
        //   response.failure,
        //   'error'
        // )
      }else{
        this.messageService.add({severity: "success", summary: "Success", detail: "Process started successfully!"});
        // Swal.fire(
        //   'Success!',
        //   'Process started successfully',
        //   'success'
        // )
      }
      
      this.cancelProcess();
      this.isStartProcessBtn=false;
      this.push_Obj={"rejectedOrApproved":this.rejectedOrApproved,"isfromApprover":this.isfromApprover,
      "isShowConformance":this.isShowConformance,"isStartProcessBtn":this.isStartProcessBtn,"autosaveTime":this.updated_date_time,
      "isFromcreateScreen":false,'process_name':this.currentNotation_name,'isSavebtn':true,"hasConformance":this.hasConformance,"resize":this.reSize,isUploaded:this.isUploaded,"selectedNotation":this.saved_bpmn_list[this.selected_notation]}
        this.dt.bpsNotationaScreenValues(this.push_Obj);
    })    
  }

  fitNotationViewfromPI(){
    let modeler_obj = this.isConfBpmnModeler ? "confBpmnModeler":"bpmnModeler";
    this[modeler_obj].get('canvas').zoom('fit-viewport');
  }
zoomIn() {
let modeler_obj = this.isConfBpmnModeler ? "confBpmnModeler" : "bpmnModeler";
if(this.isShowConformance){
  // this.confBpmnModeler.get('zoomScroll').stepZoom(0.1);
this[modeler_obj].get('zoomScroll').stepZoom(0.1);
    }else{
      if(this.selectedNotationType=="dmn"){
        this.bpmnModeler.getActiveViewer()
          .get('zoomScroll').stepZoom(0.1);
          return;
      }
      // this.bpmnModeler.get('zoomScroll').stepZoom(0.1);
  this[modeler_obj].get('zoomScroll').stepZoom(0.1);
    }
  }
zoomOut() {
let modeler_obj = this.isConfBpmnModeler ? "confBpmnModeler" : "bpmnModeler";
if(this.isShowConformance){
// this.confBpmnModeler.get('zoomScroll').stepZoom(-0.1);
this[modeler_obj].get('zoomScroll').stepZoom(-0.1);
    }else{
      if(this.selectedNotationType=="dmn"){
        this.bpmnModeler.getActiveViewer()
          .get('zoomScroll').stepZoom(-0.1);
          return;
      }
      // this.bpmnModeler.get('zoomScroll').stepZoom(-0.1);
  this[modeler_obj].get('zoomScroll').stepZoom(-0.1);
    }
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

getBpmnById(){
  this.rest.getBpmnNotationById(this.selected_modelId).subscribe(res=>{
  })
}

processOwner_modal(){
  this.modalRef = this.modalService.show(this.processowner_template);
}

async getprocessOwners(){
  let roles={
    "roleNames": ["Process Owner"]
  }
  await this.rest.getmultipleApproverforusers(roles).subscribe( res =>  {//Process Architect
   if(Array.isArray(res))
     this.processowner_list = res;
 });
}
closeprocessOwnerModal(){
  this.modalRef.hide();
  this.process_owner='';
}

}
