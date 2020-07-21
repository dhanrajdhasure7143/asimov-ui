import { Component, OnInit } from '@angular/core';
import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import { NgxSpinnerService } from "ngx-spinner"; 
import { Router } from '@angular/router';
import { UUID } from 'angular2-uuid';
import Swal from 'sweetalert2';

import { RestApiService } from '../../services/rest-api.service';
import { DataTransferService } from '../../services/data-transfer.service';
import { SharebpmndiagramService } from '../../services/sharebpmndiagram.service';
import { BpmnModel } from '../model/bpmn-autosave-model';
import { GlobalScript } from '../../../shared/global-script';
import { BpsHints } from '../model/bpmn-module-hints';

@Component({
  selector: 'app-create-bpmn-diagram',
  templateUrl: './create-bpmn-diagram.component.html',
  styleUrls: ['./create-bpmn-diagram.component.css']
})
export class CreateBpmnDiagramComponent implements OnInit {
  bpmnModeler:any;
  oldXml;
  newXml;
  autosaveObj:any;
  isLoading:boolean = false;
  diplayApproveBtn:boolean = false;
  isDiagramChanged:boolean = false;
  last_updated_time = new Date().getTime();
  saved_bpmn_list:any[] = [];
  approver_list:any[] = [];
  selected_notation = 0;
  selected_approver;
  randomId;
  notationListOldValue = 0;
  notationListNewValue = undefined;
  selected_modelId;
  uploadedFile;
  autosavedDiagramVersion = [];
  autosavedDiagramList = [];

  constructor(private rest:RestApiService, private spinner:NgxSpinnerService, private dt:DataTransferService,
    private router:Router, private bpmnservice:SharebpmndiagramService, private global:GlobalScript, private hints:BpsHints) {}

  ngOnInit(){
    this.dt.changeParentModule({"route":"/pages/businessProcess/home", "title":"Business Process Studio"});
    this.dt.changeChildModule({"route":"/pages/businessProcess/createDiagram", "title":"Studio"});
    this.dt.changeHints(this.hints.bpsCreateHints);
    this.selected_modelId = this.bpmnservice.bpmnId.value;
    this.getUserBpmnList();
    this.getApproverList();
    this.randomId = UUID.UUID();
    //this.randomId = Math.floor(Math.random()*999999);  //Values get repeated
  }
 
  ngOnDestroy(){
    if(this.isDiagramChanged){
      Swal.fire({
        title: 'Are you sure?',
        text: 'Your current changes will be lost on changing diagram.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Save and Continue',
        cancelButtonText: 'Discard'
      }).then((res)=>{
        if(res.value){
          this.saveprocess(null);
        }
      })
    }
  }

  getUserBpmnList(){
    this.isLoading = true;
    this.rest.getUserBpmnsList().subscribe( (res:any[]) =>  {
      this.saved_bpmn_list = res.filter(each_bpmn => {
        return each_bpmn.bpmnProcessStatus?each_bpmn.bpmnProcessStatus.toLowerCase() != "pending":true;
      }); 
      this.selected_notation = 0;
      this.notationListOldValue = 0;
      this.isLoading = false;
      this.getAutoSavedDiagrams();
    });
   }

   getApproverList(){
     this.rest.getApproverforuser('Process Architect').subscribe( res =>  {//Process Architect
      if(Array.isArray(res))
        this.approver_list = res; 
    });
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
    this.autosavedDiagramVersion = this.autosavedDiagramList.filter(each_asDiag => {
      return each_asDiag.bpmnModelId == this.saved_bpmn_list[this.selected_notation]["bpmnModelId"];
    })
   }
  // ngAfterViewInit(){
    initiateDiagram(){
    let _self = this;
    this.bpmnModeler = new BpmnJS({
      container: '#canvas',
      keyboard: {
        bindTo: window
      }
    });
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
    if(this.autosavedDiagramVersion[0] && this.autosavedDiagramVersion[0]["bpmnProcessMeta"])
      selected_xml = this.autosavedDiagramVersion[0]["bpmnProcessMeta"];
    let decrypted_bpmn = atob(unescape(encodeURIComponent(selected_xml))); 
    this.bpmnModeler.importXML(decrypted_bpmn, function(err){
      _self.oldXml = decrypted_bpmn.trim();
      _self.newXml = decrypted_bpmn.trim();
    });
  }
  
  displayBPMN(){
    let value = this.notationListOldValue;
    let _self = this;
    this.filterAutoSavedDiagrams();
    if(this.isDiagramChanged){
      Swal.fire({
        title: 'Are you sure?',
        text: 'Your current changes will be lost on changing diagram.',
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
          if(this.autosavedDiagramVersion[0] && this.autosavedDiagramVersion[0]["bpmnProcessMeta"])
            selected_xml = atob(unescape(encodeURIComponent(this.autosavedDiagramVersion[0]["bpmnProcessMeta"])));
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
      if(this.autosavedDiagramVersion[0] && this.autosavedDiagramVersion[0]["bpmnProcessMeta"])
        selected_xml = atob(unescape(encodeURIComponent(this.autosavedDiagramVersion[0]["bpmnProcessMeta"])));
      this.bpmnModeler.importXML(selected_xml, function(err){
        _self.oldXml = selected_xml;
        _self.newXml = selected_xml;
        _self.isLoading = false;
      });
    }
      
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
        if(_self.autosavedDiagramVersion[0]&& _self.autosavedDiagramVersion[0]["bpmnModelId"] == bpmnModel["bpmnModelId"])
          bpmnModel["bpmnModelTempId"] = _self.autosavedDiagramVersion[0]["bpmnModelTempId"];
        bpmnModel["bpmnModelModifiedBy"] = "gopi";//logged user
        bpmnModel["bpmnModelModifiedTime"] = new Date();
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
    let selected_process_id = this.saved_bpmn_list[this.selected_notation].bpmnModelId;
    this.router.navigate(["/pages/rpautomation/workspace"], { queryParams: { processid: selected_process_id }});
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
        let fileName = _self.saved_bpmn_list[_self.selected_notation]['bpmnProcessName'];
        if(fileName.trim().length == 0 ) fileName = "newDiagram";
        link.download = fileName+".bpmn";
        link.innerHTML = "Click here to download the diagram file";
        link.click();
      });
    }
  }
  initialSave(diagramModel:BpmnModel){
    this.rest.saveBPMNprocessinfofromtemp(diagramModel).subscribe(res=>{
      this.getUserBpmnList();
    });
  }
  submitDiagramForApproval(){
    if(!this.selected_approver){
      Swal.fire("No approver", "Please select approver from the list given above", "error");
      return;
    }
    let bpmnModel:BpmnModel = new BpmnModel();
    this.isLoading = true;
    let _self = this;
    let sel_List = this.saved_bpmn_list[this.selected_notation];
    bpmnModel.approverName = this.selected_approver;
    bpmnModel.bpmnModelId= sel_List['bpmnModelId'];
    bpmnModel.bpmnProcessName=sel_List['bpmnProcessName'];
    bpmnModel.bpmnTempId=2;
    bpmnModel.category = sel_List['category'];
    bpmnModel.processIntelligenceId= Math.floor(100000 + Math.random() * 900000);//?? FOR SHowconformance screen alone??
    bpmnModel.tenantId=7;
    bpmnModel.id = sel_List["id"];
    bpmnModel.bpmnProcessStatus="PENDING";
    bpmnModel.bpmnProcessApproved = 0;
    this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
      let final_notation = btoa(unescape(encodeURIComponent(xml)));
      bpmnModel.bpmnJsonNotation = final_notation;
      bpmnModel.bpmnNotationAutomationTask = final_notation;
      bpmnModel.bpmnNotationHumanTask = final_notation;
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
    let _self=this;
    let sel_List = this.saved_bpmn_list[this.selected_notation];
    bpmnModel.bpmnProcessName = sel_List['bpmnProcessName'];
    bpmnModel.bpmnModelId = sel_List['bpmnModelId'];
    bpmnModel.category = sel_List['category'];
    bpmnModel.createdTimestamp = sel_List['createdTimestamp'];
    bpmnModel.bpmnProcessStatus = "INPROGRESS";
    this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
      let final_notation = btoa(unescape(encodeURIComponent(xml)));
      bpmnModel.bpmnXmlNotation = final_notation;
      _self.saved_bpmn_list[_self.selected_notation]['bpmnXmlNotation'] = final_notation;
      _self.rest.saveBPMNprocessinfofromtemp(bpmnModel).subscribe(
        data=>{
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
        message = "Please upload proper *.bpmn file";
      this.global.notify(message, "error");
    }
  }
  
}
