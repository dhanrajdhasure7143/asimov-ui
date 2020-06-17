import { Component, AfterViewInit, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-create-bpmn-diagram',
  templateUrl: './create-bpmn-diagram.component.html',
  styleUrls: ['./create-bpmn-diagram.component.css']
})
export class CreateBpmnDiagramComponent implements OnInit,AfterViewInit {
  bpmnModeler:any;
  oldXml;
  newXml;
  updated_date_time;

  autosaveObj:any;
  bpmnModel:BpmnModel = new BpmnModel();
  counter:number = 0;
  alive:boolean = true;
  diplayApproveBtn:boolean = false;
  isDiagramChanged:boolean = false;
  last_updated_time = new Date().getTime();
  saved_bpmn_list:any[] = [];
  approver_list:any[] = [];
  selected_notation;
  randomId;
  notationListOldValue = undefined;
  notationListNewValue = undefined;

  constructor(private rest:RestApiService, private spinner:NgxSpinnerService, private dt:DataTransferService,
    private router:Router, private bpmnservice:SharebpmndiagramService, private global:GlobalScript) {}

  ngOnInit(){
    this.dt.changeParentModule({"route":"/pages/businessProcess/home", "title":"Business Process Studio"});
    this.dt.changeChildModule({"route":"/pages/businessProcess/createDiagram", "title":"Studio"});
    // this.randomId = UUID.UUID(); // Backend BPMN Model Id should be string
    this.randomId = Math.floor(Math.random()*999999);//Values get repeated
    this.bpmnModel.bpmnModelModifiedBy = "Vaidehi";//localStorage.getItem("userName")
    this.bpmnModel.bpmnModelTempStatus = "initial";
    this.rest.getUserBpmnsList().subscribe( (res:any[]) =>  {
      this.saved_bpmn_list = res; 
    });
    this.rest.getApproverforuser('Process Architect').subscribe( (res:any[]) =>  {//BPMN_Process_Modeler
      this.approver_list = res; 
    });
  }

  ngAfterViewInit(){
    this.bpmnModeler = new BpmnJS({
      container: '#canvas',
      keyboard: {
        bindTo: window
      }
    });
    let canvas = this.bpmnModeler.get('canvas');
    canvas.zoom('fit-viewport');
    this.rest.getBPMNFileContent("assets/resources/newDiagram.bpmn").subscribe(res => {
      let _self = this;
      this.bpmnModeler.importXML(res, function(err){
        _self.oldXml = res.trim();
        _self.newXml = res.trim();
      });
    });
    
    let _self = this;
    this.bpmnModeler.on('element.changed', function(){
      _self.isDiagramChanged = true;
      let now = new Date().getTime();
      if(now - _self.last_updated_time > 10*1000){
        _self.autoSaveBpmnDiagram();
        _self.last_updated_time = now;
      }
    })
  }
  
  displayBPMN(){
    let value = this.notationListOldValue;
    let _self = this;
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
          if(this.selected_notation == "undefined"){
            this.diplayApproveBtn = false;
            this.rest.getBPMNFileContent("assets/resources/newDiagram.bpmn").subscribe(res => {
              this.bpmnModeler.importXML(res, function(err){
                _self.oldXml = res.trim();
                _self.newXml = res.trim();
              });
            });
          }
          let current_bpmn_info = this.saved_bpmn_list[this.selected_notation];
          let selected_xml = atob(current_bpmn_info.bpmnXmlNotation);
          this.bpmnModeler.importXML(selected_xml, function(err){
            _self.oldXml = selected_xml;
            _self.newXml = selected_xml;
          });
        }
      })
    }else{
      this.isDiagramChanged = false;
      this.diplayApproveBtn = true;
      if(this.selected_notation == "undefined"){
        this.diplayApproveBtn = false;
        this.rest.getBPMNFileContent("assets/resources/newDiagram.bpmn").subscribe(res => {
          this.bpmnModeler.importXML(res, function(err){
            _self.oldXml = res.trim();
            _self.newXml = res.trim();
          });
        });
      }
      let current_bpmn_info = this.saved_bpmn_list[this.selected_notation];
      let selected_xml = atob(current_bpmn_info.bpmnXmlNotation);
      this.bpmnModeler.importXML(selected_xml, function(err){
        _self.oldXml = selected_xml;
        _self.newXml = selected_xml;
      });
    }
      
  }
 
  autoSaveBpmnDiagram(){
    this.spinner.show()
    let _self = this;
    this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
      _self.oldXml = _self.newXml;
      _self.newXml = xml;
      if(_self.oldXml != _self.newXml){
        _self.spinner.show();
        _self.updated_date_time = new Date();
        _self.bpmnModel.bpmnModelModifiedTime = _self.updated_date_time;
        // _self.bpmnModel.bpmnModelTempVersion = '0.0.'+_self.counter;
        _self.bpmnModel.bpmnProcessMeta = btoa(_self.newXml);
        _self.autoSaveDiagram();  
        
      }
    });
    
  }

  autoSaveDiagram(){
    let _self = this;
    this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
      _self.oldXml = _self.newXml;
      _self.newXml = xml;
    },)
    this.bpmnModel.bpmnProcessName = this.selected_notation? this.saved_bpmn_list[this.selected_notation]['bpmnProcessName']:this.bpmnservice.newDiagName.value;
    this.bpmnModel.bpmnModelId=this.randomId;
    this.bpmnModel.bpmnModelModifiedBy="gopi";//localStorage.getItem("userName")
    this.bpmnModel.bpmnModelTempStatus="PENDING";
    _self.bpmnModel.bpmnProcessMeta = btoa(_self.newXml);
    
    this.rest.autoSaveBPMNFileContent(this.bpmnModel).subscribe(
      data=>{
        this.autosaveObj=data
        this.bpmnModel.bpmnModelTempId=this.autosaveObj.bpmnModelTempId
        this.counter++;
        this.spinner.hide()
      },
      err => {
        this.spinner.hide();
      }
    )}

  automate(){
    let selected_process_id = this.saved_bpmn_list[this.selected_notation].bpmnModelId;
    this.router.navigate(["/pages/rpautomation/workspace"], { queryParams: { processid: selected_process_id }});
  }
 
  downloadBpmn(){
    if(this.bpmnModeler){
      let _self = this;
      this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
        var blob = new Blob([xml], { type: "application/xml" });
        var url = window.URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        let d = new Date();
        let fileName = _self.selected_notation? _self.saved_bpmn_list[_self.selected_notation]['bpmnProcessName']:_self.bpmnservice.newDiagName.value;
        if(fileName.trim().length == 0 ) fileName = "newDiagram";
        link.download = fileName+".bpmn";
        link.innerHTML = "Click here to download the diagram file";
        link.click();
      });
    }
  }

  uploadBpmn(e){
    if(e.addedFiles.length == 1 && e.rejectedFiles.length == 0){
      this.router.navigate(['/pages/businessProcess/uploadProcessModel'])
      this.bpmnservice.uploadBpmn(e.addedFiles[0].name)
    }else{
      let message = "Oops! Something went wrong";
      if(e.rejectedFiles[0].reason == "type")
        message = "Please upload proper *.bpmn file";
      this.global.notify(message, "error");
    }
  }
  submitDiagramForApproval(){
    let _self = this;
    this.bpmnModel.approverName="vaidehi";//get from approval list
    this.bpmnModel.bpmnJsonNotation= btoa(_self.newXml);
    this.bpmnModel.bpmnModelId= this.selected_notation ? this.saved_bpmn_list[this.selected_notation]['bpmnModelId']:this.randomId;
    this.bpmnModel.bpmnNotationAutomationTask=btoa(_self.newXml);
    this.bpmnModel.bpmnNotationHumanTask=btoa(_self.newXml);
    this.bpmnModel.bpmnProcessApproved=0;
    this.bpmnModel.bpmnProcessName = this.selected_notation? this.saved_bpmn_list[this.selected_notation]['bpmnProcessName']:this.bpmnservice.newDiagName.value;
    this.bpmnModel.bpmnProcessStatus="PENDING";
    this.bpmnModel.bpmnModelTempId=this.autosaveObj? this.autosaveObj.bpmnModelTempId:999;//need to update this
    this.bpmnModel.bpmnXmlNotation=btoa(_self.newXml);
    this.bpmnModel.category= this.selected_notation? this.saved_bpmn_list[this.selected_notation]['category']:this.bpmnservice.bpmnCategory.value;
    this.bpmnModel.emailTo= "swaroop.attaluri@epsoftinc.com";//Approver mail ID?? or user mail ID??
    this.bpmnModel.id= 5;
    this.bpmnModel.processIntelligenceId= 5;//?? FOR SHowconformance screen alone??
    this.bpmnModel.reviewComments ="";
    this.bpmnModel.tenantId=7;//localStorage get tenant Id
    this.bpmnModel.userName="gopi"; //localStorage.getItem("userName")
    this.spinner.show();
    this.rest.submitBPMNforApproval(this.bpmnModel).subscribe(
      data=>{
        Swal.fire(
          'Saved!',
          'Your changes has been saved and submitted for approval successfully.',
          'success'
        )
        this.router.navigateByUrl("/pages/approvalWorkflow/home")
        this.spinner.hide()
      },
      err => {
        alert("failed")
          this.spinner.hide();
        }
    )
  }
  
  saveprocess(newVal){
    let _self=this;
    this.bpmnModel.category=this.selected_notation? this.saved_bpmn_list[this.selected_notation]['category']:this.bpmnservice.bpmnCategory.value;
    this.bpmnModel.reviewComments="";
    this.bpmnModel.approverName="vaidehi";
    this.bpmnModel.bpmnModelId= this.selected_notation ? this.saved_bpmn_list[this.selected_notation]['bpmnModelId']:this.randomId;
    this.bpmnModel.bpmnProcessName= this.selected_notation ? this.saved_bpmn_list[this.selected_notation]['bpmnProcessName']:this.bpmnservice.newDiagName.value;
    this.bpmnModel.bpmnXmlNotation=btoa(_self.newXml);
    this.bpmnModel.userName="gopi";//localStorage.getItem("username")
    this.rest.saveBPMNprocessinfofromtemp(this.bpmnModel).subscribe(
      data=>{
        Swal.fire(
          'Saved!',
          'Your changes has been saved successfully.',
          'success'
        )
        if(newVal){
          this.selected_notation = newVal;
          let current_bpmn_info = this.saved_bpmn_list[this.selected_notation];
          let selected_xml = atob(current_bpmn_info.bpmnXmlNotation);
          this.bpmnModeler.importXML(selected_xml, function(err){
            _self.oldXml = selected_xml;
            _self.newXml = selected_xml;
            _self.spinner.hide();
          });
        }
      },
      err => {
        alert("failed")
        this.spinner.hide();
      })
  }
  
}
