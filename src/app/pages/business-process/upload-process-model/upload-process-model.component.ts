import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SharebpmndiagramService } from '../../services/sharebpmndiagram.service';
import { RestApiService } from '../../services/rest-api.service';
import { Router } from '@angular/router';
import { diff } from 'bpmn-js-differ';
import BpmnModdle from 'bpmn-moddle';
import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import { DataTransferService } from '../../services/data-transfer.service';

@Component({
  selector: 'app-upload-process-model',
  templateUrl: './upload-process-model.component.html',
  styleUrls: ['./upload-process-model.component.css']
})
export class UploadProcessModelComponent implements OnInit,AfterViewInit {
   hideUploadContainer:boolean=false;
   hideCreateContainer:boolean=false;
   hideOptionsContainer:boolean=true;
   bpmnModeler;
   viewer:any;
   confBpmnModeler;
   reSize:boolean=false;
   bpmnXml;
   confBpmnXml;
   receivedbpmn:any;
   createDiagram:boolean = false;
   isHiddenDiff:boolean=true;
  res1: string;
  oldxmlstring: string;
  newxmlsttring: string;
  //bpmnupload:boolean=false;
  //hideEditor:boolean=false;
   constructor(private rest:RestApiService, private bpmnservice:SharebpmndiagramService,private router:Router, 
      private dt:DataTransferService) { }
 
   ngAfterViewInit(){
     this.bpmnModeler = new BpmnJS({
       container: '#canvas1',
       keyboard: {
         bindTo: window
       }
     });
   }
   ngOnInit() {
    this.dt.changeParentModule({"route":"/pages/businessProcess/home", "title":"Business Process Studio"});
    this.dt.changeChildModule({"route":"/pages/businessProcess/uploadProcessModel", "title":"Studio"});
    this.rest.getBPMNFileContent("assets/resources/"+this.bpmnservice.getBpmnData()).subscribe(res => {
      let _self = this;
      this.bpmnModeler.importXML(res, function(err){
        if(err){
          return console.error('could not import BPMN 2.0 diagram', err);
        }
        _self.bpmnXml = res;
      })
    });
   }

   uploadConfBpmn(confBpmnData){
     this.bpmnservice.uploadConfirmanceBpmn(confBpmnData);
     let _self = this;
    this.rest.getBPMNFileContent("assets/resources/"+confBpmnData).subscribe(res => {
      _self.confBpmnModeler = new BpmnJS({
        container: '#canvas2',
        keyboard: {
          bindTo: window
        }
      });
      _self.confBpmnModeler.importXML(res, function(err){
        if(err){
          return console.error('could not import BPMN 2.0 diagram', err);
        }
        _self.confBpmnXml = res;
        _self.bpmnservice.uploadConfirmanceBpmnXML(res);
      })
    });
   }
   
  slideup(){
    this.getBpmnDifferences();
    document.getElementById("foot").classList.remove("slide-down");
    document.getElementById("foot").classList.add("slide-up");
  }

  showdiagram(diagramxml){
    this.viewer.importXML(diagramxml,function(){
      let canvas=this.viewer.get('canvas1')
      canvas.addMarker('Bake the pizza', 'highlight');
    })
  }
  displayContainer(id, err){
    let container:HTMLElement = document.getElementById(id);
    if (err) {
      container.classList.remove('with-diagram');
      container.classList.add('with-error');
      container.getElementsByClassName("err-msg")[0].textContent = err.message;
    } else {
      container.classList.add('with-diagram');
      container.classList.remove('with-error');
      container.getElementsByClassName("err-msg")[0].textContent = "";
    }
  }
  getBpmnDifferences(){
    let _self = this;
    new BpmnModdle().fromXML(this.bpmnXml, function(err, bpmnDataResDef) {
      if (err) {
        // return done(err);
      }
      new BpmnModdle().fromXML(_self.bpmnservice.getConfBpmnXML(), function(errConf, confBpmnDataResDef) {
        if (errConf) {
          // return done(err);
        } 
        let bpmnDiffs = diff(bpmnDataResDef, confBpmnDataResDef);
        console.log(bpmnDiffs);
        _self.bpmnservice.updateDifferences(bpmnDiffs)
      });
    });
  }
}