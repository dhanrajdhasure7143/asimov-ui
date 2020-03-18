import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SharebpmndiagramService } from '../../services/sharebpmndiagram.service';
import { RestApiService } from '../../services/rest-api.service';
import { Router } from '@angular/router'
import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import { DataTransferService } from '../../services/data-transfer.service';

@Component({
  selector: 'app-upload-process-model',
  templateUrl: './upload-process-model.component.html',
  styleUrls: ['./upload-process-model.component.css']
})
export class UploadProcessModelComponent implements OnInit,AfterViewInit {
  bpmnModeler: any;
  constructor(private router:Router,private bpmnservice:SharebpmndiagramService,
    private restApiService: RestApiService, private dt:DataTransferService){}
  receivedbpmn:any;
  resize:boolean=false;
  uploadedBpmnfile;
  
navigateCompare(){
  this.router.navigate(['/compareuploadprocessmodel'])
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
}

ngOnInit() {
  this.dt.changeParentModule({"route":"/pages/businessProcess/home", "title":"Business Process Studio"});
  this.dt.changeChildModule({"route":"/pages/businessProcess/uploadProcessModel", "title":"Studio"});

  this.bpmnservice.send.subscribe(x=>{
    this.receivedbpmn=x;

    if(this.receivedbpmn){
      let bpmnFileName = this.receivedbpmn;
      let bpmnFilePath = "assets/resources/"+bpmnFileName;
      this.restApiService.getBPMNFileContent(bpmnFilePath).subscribe(res => {
        this.bpmnModeler.importXML(res, function(err){
          if(err){
            return console.error('could not import BPMN 2.0 diagram', err);
          }
        })
        })
      
      }
    },
    (err =>{
      console.log(err);
    }));
  }
  uploadProcess(){
    this.resize=!this.resize
  }
  uploadBpmn(){
    let newFile = (<HTMLInputElement>document.getElementById("Finput2")).files[0];
    this.uploadedBpmnfile=newFile.name;
    this.router.navigate(['/pages/businessProcess/uploadProcessModel'])
    this.bpmnservice.uploadBpmn(this.uploadedBpmnfile)
  }
}
