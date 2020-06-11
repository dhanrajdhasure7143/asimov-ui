import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { diff } from 'bpmn-js-differ';
import BpmnModdle from 'bpmn-moddle';
import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import { SplitComponent, SplitAreaDirective } from 'angular-split';

import { SharebpmndiagramService } from '../../services/sharebpmndiagram.service';
import { RestApiService } from '../../services/rest-api.service';
import { DataTransferService } from '../../services/data-transfer.service';

@Component({
  selector: 'app-upload-process-model',
  templateUrl: './upload-process-model.component.html',
  styleUrls: ['./upload-process-model.component.css']
})
export class UploadProcessModelComponent implements OnInit {
   hideUploadContainer:boolean=false;
   hideCreateContainer:boolean=false;
   hideOptionsContainer:boolean=true;
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
  //bpmnupload:boolean=false;
  //hideEditor:boolean=false;
  split: SplitComponent;
  area1: SplitAreaDirective;
  area2: SplitAreaDirective;

   constructor(private rest:RestApiService, private bpmnservice:SharebpmndiagramService,private router:Router, 
      private dt:DataTransferService) { }
 
   ngOnInit() {
    this.dt.changeParentModule({"route":"/pages/businessProcess/home", "title":"Business Process Studio"});
    this.dt.changeChildModule({"route":"/pages/businessProcess/uploadProcessModel", "title":"Studio"});
    this.rest.getBPMNFileContent("assets/resources/"+this.bpmnservice.getBpmnData()).subscribe(res => {
      let _self = this;
      this.bpmnModeler = new BpmnJS({
        container: '#canvas1',
        keyboard: {
          bindTo: window
        }
      });
      this.bpmnModeler.importXML(res, function(err){
        if(err){
          return console.error('could not import BPMN 2.0 diagram', err);
        }
      })
    });
   }

   uploadConfBpmn(confBpmnData){
    this.confBpmnModeler = new BpmnJS({
      container: '#canvas2',
      keyboard: {
        bindTo: window
      }
    });
     this.bpmnservice.uploadConfirmanceBpmn(confBpmnData);
     let _self = this;
    this.rest.getBPMNFileContent("assets/resources/"+confBpmnData).subscribe(res => {
      _self.confBpmnModeler.importXML(res, function(err){
        if(err){
          return console.error('could not import BPMN 2.0 diagram', err);
        }
        _self.confBpmnXml = res;
        _self.bpmnservice.uploadConfirmanceBpmnXMLDef( _self.confBpmnModeler._definitions);
      })
    });
   }
   
  slideup(){
    let ele = document.getElementById("foot");
    if(ele){
      ele.classList.add("slide-up");
      ele.classList.remove("slide-down");
    }
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
    let bpmnDiffs = diff(this.bpmnModeler._definitions, this.bpmnservice.getConfBpmnXMLDef());
    this.bpmnservice.updateDifferences(bpmnDiffs);
    this.slideup();
  }

  dragEnd(e){
    
  }
}