import { Component, AfterViewInit, OnInit } from '@angular/core';
import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import { NgxSpinnerService } from "ngx-spinner"; 
import { Router } from '@angular/router';

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
  bpmnModel:BpmnModel = new BpmnModel();
  counter:number = 0;
  alive:boolean = true;
  last_updated_time = new Date().getTime();

  constructor(private rest:RestApiService, private spinner:NgxSpinnerService, private dt:DataTransferService,
    private router:Router, private bpmnservice:SharebpmndiagramService, private global:GlobalScript) {}

  ngOnInit(){
    this.dt.changeParentModule({"route":"/pages/businessProcess/home", "title":"Business Process Studio"});
    this.dt.changeChildModule({"route":"/pages/businessProcess/createDiagram", "title":"Studio"});
    this.bpmnModel.bpmnModelId = 0;
    this.bpmnModel.bpmnModelModifiedBy = "Vaidehi";//localStorage.getItem("userName")
    this.bpmnModel.bpmnModelTempStatus = "initial";
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
      let now = new Date().getTime();
      if(now - _self.last_updated_time > 10*1000){
        _self.autoSaveBpmnDiagram();
        _self.last_updated_time = now;
      }
    })
  }
  
  autoSaveBpmnDiagram(){
    this.spinner.show();
      let _self = this;
      this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
        _self.updated_date_time = new Date();
        _self.bpmnModel.bpmnModelModifiedTime = _self.updated_date_time;
        _self.bpmnModel.bpmnModelTempId = _self.counter;
        _self.bpmnModel.bpmnModelTempVersion = '0.0.'+_self.counter;
        _self.bpmnModel.bpmnProcessMeta = btoa(_self.newXml);
        _self.autoSaveDiagram();
      });
  }

  autoSaveDiagram(){
    this.rest.autoSaveBPMNFileContent(this.bpmnModel).subscribe(res => {
      this.counter++;
      this.spinner.hide();
    },
    err => {
      this.spinner.hide();
    })
  }

  submitDiagramForApproval(){
    this.spinner.show();
    this.bpmnModel = new BpmnModel();
    this.rest.submitBPMNforApproval(this.bpmnModel).subscribe(res=>{
      this.spinner.hide();
    },err=>{
      this.spinner.hide();
      this.router.navigate(['/pages/businessProcess/uploadProcessModel']);})
  }
  downloadBpmn(){
    if(this.bpmnModeler){
      this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
        var blob = new Blob([xml], { type: "application/xml" });
        var url = window.URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        let d = new Date();
        link.download = "newDiagram"+d.getHours()+d.getMinutes()+d.getSeconds()+".bpmn";
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

}
