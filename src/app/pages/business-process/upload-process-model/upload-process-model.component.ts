


import { Component, OnInit ,ViewChild,TemplateRef} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { diff } from 'bpmn-js-differ';
import { NgxSpinnerService } from "ngx-spinner"; 
import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';
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
  approver_list:any[] = [];
  selected_notation = 0;
  selected_approver;
  diplayApproveBtn:boolean = false;
  isLoading:boolean = false;
  rejectedOrApproved;
  isDiagramChanged:boolean = false;
  isApprovedNotation:boolean = false;
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
  pivalues:any
  @ViewChild('keyboardShortcut',{ static: true }) keyboardShortcut: TemplateRef<any>;
   constructor(private rest:RestApiService, private bpmnservice:SharebpmndiagramService,private router:Router, private spinner:NgxSpinnerService,
      private dt:DataTransferService, private route:ActivatedRoute, private global:GlobalScript, private hints:BpsHints,public dialog:MatDialog,private shortcut:BpmnShortcut) { }
 
   ngOnInit() {
    this.dt.changeParentModule({"route":"/pages/businessProcess/home", "title":"Business Process Studio"});
    this.dt.changeChildModule({"route":"/pages/businessProcess/uploadProcessModel", "title":"Studio"});
    this.dt.changeHints(this.hints.bpsUploadHints);
    this.bpmnservice.isConfNav.subscribe(res => this.isConfNavigation = res);
    this.route.queryParams.subscribe(params => {
      this.selected_modelId = params['bpsId'];
      this.selected_version = params['ver'];
      this.isShowConformance = params['isShowConformance'] == 'true';
      this.pid=params['pid'];

    });
    this.keyboardLabels=this.shortcut.keyboardLabels;
    if(!this.isShowConformance)
      this.getUserBpmnList(null);
 else
    this.fetchBpmnNotationFromPI();
    this.getApproverList();
   }

   ngAfterViewInit(){
    if(this.isShowConformance)
      this.initiateDiagram();
   }
   fetchBpmnNotationFromPI(){
     this.rest.fetchBpmnNotationFromPI(this.pid).subscribe(res=>{this.pivalues=res
      console.log(this.pivalues)
})
   }

   async getUserBpmnList(isFromConf){
    this.isLoading = true;
    await this.rest.getUserBpmnsList().subscribe( (res:any[]) =>  {
      this.saved_bpmn_list = res.filter(each_bpmn => {
        return each_bpmn.bpmnProcessStatus?each_bpmn.bpmnProcessStatus.toLowerCase() != "pending":true;
      }); 
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
    this.isApprovedNotation = current_bpmn_info["bpmnProcessStatus"] == "APPROVED";
    if(!this.isUploaded){
      let params:Params = {'bpsId':current_bpmn_info["bpmnModelId"], 'ver': current_bpmn_info["version"]}
      this.router.navigate([],{ relativeTo:this.route, queryParams:params });
    }
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

  initiateDiagram(){
    let _self=this;
    let modeler_obj = this.isShowConformance && !this.reSize ? "confBpmnModeler":"bpmnModeler";
    if(!this[modeler_obj]){
      this[modeler_obj] = new BpmnJS({
        container: this.isShowConformance && !this.reSize ? '#canvas2':'#canvas1',
        keyboard: {
          bindTo: window

        }
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
        this.rest.fetchBpmnNotationFromPI(this.pid).subscribe(res => {
        
          this[modeler_obj].importXML(atob(unescape(encodeURIComponent(res['data']))), function(err){
            if(err){
              return console.error('could not import BPMN 2.0 notation', err);
            }
          })
          this[modeler_obj].get('canvas').zoom('fit-viewport');
        });
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
        // this.confBpmnModeler.importXML(selected_xml, function(err){
          if(selected_xml == "undefined"){
            this.rest.getBPMNFileContent("assets/resources/newDiagram.bpmn").subscribe(res => {
              let encrypted_bpmn = btoa(unescape(encodeURIComponent(res)));
              this.bpmnModeler.importXML(encrypted_bpmn, function(err){
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
      if(selected_xml == "undefined"){
        this.rest.getBPMNFileContent("assets/resources/newDiagram.bpmn").subscribe(res => {
          this.bpmnModeler.importXML(res, function(err){
            _self.oldXml = selected_xml;
            _self.newXml = selected_xml;
            _self.isLoading = false;
          });
        });
      }else{
        this.bpmnModeler.importXML(selected_xml, function(err){
          _self.oldXml = selected_xml;
          _self.newXml = selected_xml;
          _self.isLoading = false;
        });
      }
    }
    this.getSelectedApprover();
  }

  autoSaveBpmnDiagram(){
    let _self = this;
    let bpmnModel={};
    this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
      _self.oldXml = _self.newXml;
      _self.newXml = xml;
      if(_self.oldXml != _self.newXml){
        _self.spinner.show();
        bpmnModel["bpmnProcessMeta"] = btoa(unescape(encodeURIComponent(_self.newXml)));
        bpmnModel["bpmnModelId"] = _self.saved_bpmn_list[_self.selected_notation]["bpmnModelId"];
        if(_self.autosavedDiagramVersion[0] && _self.autosavedDiagramVersion[0]["bpmnModelId"] == bpmnModel["bpmnModelId"])
          bpmnModel["bpmnModelTempId"] = _self.autosavedDiagramVersion[0]["bpmnModelTempId"];
        bpmnModel["bpmnModelModifiedTime"] = new Date();
        _self.autoSaveDiagram(bpmnModel);  
      }
    });
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
    let selected_process_id = this.saved_bpmn_list[this.selected_notation].processIntelligenceId;
    this.router.navigate(["/pages/rpautomation/home"], { queryParams: { processid: selected_process_id }});
  }

  downloadBpmn(){
    if(this.bpmnModeler){
      let _self = this;
      this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
        _self.saved_bpmn_list[_self.selected_notation]['bpmnXmlNotation'] = btoa(unescape(encodeURIComponent(xml)));
        var blob = new Blob([xml], { type: "application/xml" });
        var url = window.URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        let d = new Date();
        let fileName = _self.saved_bpmn_list[_self.selected_notation]['bpmnProcessName'];
        if(fileName.trim().length == 0 ) fileName = "newDiagram";
        link.download = fileName+".bpmn";
        link.innerHTML = "Click here to download the notation";
        link.click();
      });
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
    if(!this.bpmnModeler){
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
    let bpmnModel:BpmnModel = new BpmnModel();
    if((!this.selected_approver && this.selected_approver != 0) || this.selected_approver <= -1){
      Swal.fire("No approver", "Please select approver from the list given above", "error");
      return;
    }
    this.isLoading = true;
    let _self = this;
    let sel_List = this.saved_bpmn_list[this.selected_notation];
    let modeler_obj = this.isShowConformance && !this.reSize ? "confBpmnModeler":"bpmnModeler";
    let sel_appr = this.approver_list[this.selected_approver];
    bpmnModel.approverEmail = sel_appr.userId;
    bpmnModel.approverName = sel_appr.userId.split("@")[0];
    bpmnModel.userName = sel_List["userName"];
    bpmnModel.tenantId = sel_List["tenantId"];
    bpmnModel.userEmail = sel_List['userEmail'];
   if(this.isShowConformance){
    bpmnModel.bpmnModelId = UUID.UUID();
    bpmnModel.bpmnProcessName = 'process Intelligence';
    bpmnModel.category = 'Accounts';
    bpmnModel.processIntelligenceId = 0;
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
     bpmnModel.bpmnJsonNotation = final_notation;
     _self.rest.submitBPMNforApproval(bpmnModel).subscribe(
      data=>{
        _self.isDiagramChanged = false;
        _self.isLoading = false;
        Swal.fire(
          'Saved!',
          'Your changes has been saved and submitted for approval successfully.',
          'success'
        );
        _self.router.navigateByUrl("/pages/approvalWorkflow/home");
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
    let _self = this;
    let sel_List = this.saved_bpmn_list[this.selected_notation];
    bpmnModel.bpmnProcessName = sel_List['bpmnProcessName'];
    bpmnModel.bpmnModelId = sel_List['bpmnModelId'];
    bpmnModel.category = sel_List['category'];
    let status = sel_List["bpmnProcessStatus"];
    if(sel_List['id'])
      bpmnModel.id = sel_List['id'];
    else
      delete(bpmnModel.id);
    bpmnModel.userName = sel_List['userName'];
    bpmnModel.tenantId = sel_List['tenantId'];
    bpmnModel.createdTimestamp = sel_List['createdTimestamp'];
    bpmnModel.bpmnProcessStatus = sel_List['bpmnProcessStatus'];
    this.initBpmnModeler();
    this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
      let final_notation = btoa(unescape(encodeURIComponent(xml)));
      bpmnModel.bpmnXmlNotation = final_notation;
      _self.saved_bpmn_list[_self.selected_notation]['bpmnXmlNotation'] = final_notation;
      _self.rest.saveBPMNprocessinfofromtemp(bpmnModel).subscribe(
        data=>{
          if(status == "APPROVED" || status == "REJECTED"){
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
          _self.isLoading = false;
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