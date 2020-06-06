import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import { RestApiService } from '../../pages/services/rest-api.service';
//import { NgxSpinnerService } from "ngx-spinner"; 
import { SharebpmndiagramService } from '../../pages/services/sharebpmndiagram.service';
import { GlobalScript } from '../global-script';
import { BpmnModel } from '../../pages/business-process/model/bpmn-autosave-model';
import { UploadProcessModelComponent } from 'src/app/pages/business-process/upload-process-model/upload-process-model.component';

@Component({
  selector: 'app-upload-create-drop-bpmn',
  templateUrl: './upload-create-drop-bpmn.component.html',
  styleUrls: ['./upload-create-drop-bpmn.component.css'],
  providers: [UploadProcessModelComponent]
})
export class UploadCreateDropBpmnComponent implements OnInit {
  bpmnModeler:any;
  oldXml;
  newXml;
  updated_date_time;
  bpmnModel:BpmnModel = new BpmnModel();
  last_updated_time = new Date().getTime();
  bpmnupload:boolean=false;
  hideEditor:boolean=true;
  create_editor:boolean=true;
  counter:number = 0;
  constructor(private router:Router,private bpmnservice:SharebpmndiagramService, 
    private global: GlobalScript, private rest:RestApiService, private uploadProcessModel:UploadProcessModelComponent) { }

  ngOnInit() {
  }
  onSelect(e){
    this.bpmnupload= true;
    this.hideEditor=false;
    if(e.addedFiles.length == 1 && e.rejectedFiles.length == 0){
      if( this.router.url.indexOf("uploadProcessModel") > -1 ){
        this.bpmnservice.changeConfNav(true);
        this.uploadProcessModel.uploadConfBpmn(e.addedFiles[0].name);
      }else{
        this.bpmnservice.changeConfNav(false);
        this.bpmnservice.uploadBpmn(e.addedFiles[0].name);
        this.router.navigate(['/pages/businessProcess/uploadProcessModel']);
      }
    }else{
      let message = "Oops! Something went wrong";
      if(e.rejectedFiles[0].reason == "type")
        message = "Please upload proper *.bpmn file";
      this.global.notify(message,"error");
    }
  }
  autoSaveBpmnDiagram(){
    // this.spinner.show();
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
      // this.spinner.hide();
    },
    err => {
      // this.spinner.hide();
     
    })
  }

  createBpmn(){
    this.bpmnupload= true;
    this.create_editor=false;
     if(this.router.url == "/pages/businessProcess/home"){
      this.router.navigateByUrl('/pages/businessProcess/createDiagram');
     }
     else{this.bpmnModeler = new BpmnJS({
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
  }}
  saveprocess(){
    alert("saved successfully");
    //this.router.navigate('')
  }   
}
