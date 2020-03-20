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
   oldBpmnModeler;
   newBpmnModeler;
   changes:any = {};
   reSize:boolean=false;
   newBpmnXml;
   oldBpmnXml;
   receivedbpmn:any;
   createDiagram:boolean = false;
   isHiddenDiff:boolean=true;
   
   constructor(private rest:RestApiService, private bpmnservice:SharebpmndiagramService,private router:Router, 
      private dt:DataTransferService) { }
 
   ngAfterViewInit(){
     this.bpmnModeler = new BpmnJS({
       container: '#canvas1',
       keyboard: {
         bindTo: window
       }
     });
     this.newBpmnModeler = new BpmnJS({
       container: '#canvas2',
       keyboard: {
         bindTo: window
       }
     });
   }
   ngOnInit() {
    this.dt.changeParentModule({"route":"/pages/businessProcess/home", "title":"Business Process Studio"});
    this.dt.changeChildModule({"route":"/pages/businessProcess/uploadProcessModel", "title":"Studio"});
     this.bpmnservice.send.subscribe(x=>{
       this.receivedbpmn=x;
       if(this.receivedbpmn){
         let bpmnFileName = this.receivedbpmn;
         let bpmnFilePath = "assets/resources/"+bpmnFileName;
         this.rest.getBPMNFileContent(bpmnFilePath).subscribe(res => {
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
   
   uploadBpmn(){
    this.hideUploadContainer=!this.hideUploadContainer
    this.hideCreateContainer=!this.hideCreateContainer
     this.isHiddenDiff=!this.isHiddenDiff
     
     let newFile = (<HTMLInputElement>document.getElementById("Finput2")).files[0];
     if(newFile){
       let newFileName = newFile.name;
       newFileName = "assets/resources/"+newFileName;
       this.rest.getBPMNFileContent(newFileName).subscribe(res => {
         this.newBpmnXml = res;
         this.newBpmnModeler.importXML(res, function(err){
           if(err){
             return console.error('could not import BPMN 2.0 diagram', err);
           }
         });
       });
     }
     if(newFile){
       this.loadModels(this.oldBpmnXml, this.newBpmnXml, this);
     }
     this.showdiagram(this.newBpmnXml)
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
 
   loadModels(a, b, _self) {
     new BpmnModdle().fromXML(a, function(err, adefs) {
       _self.displayContainer("oldDgm", err);
       new BpmnModdle().fromXML(b, function(err, bdefs) {
         _self.displayContainer("newDgm", err);
         if (!err) {
          
         }
         _self.changes = diff(adefs, bdefs);
         _self.hasChanges = !(_self.changes._layoutChanged == {} && _self.changes._changed == {} && 
            _self.changes._removed == {} && _self.changes._added == {});
       });
     });
   }
}
