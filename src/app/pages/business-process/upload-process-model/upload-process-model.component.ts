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
       this.res1=localStorage.getItem("res1");
       if(this.res1){
         let bpmnFileName = this.res1;
         let bpmnFilePath = "assets/resources/"+bpmnFileName;
         this.rest.getBPMNFileContent(bpmnFilePath).subscribe(res => {
         this.oldxmlstring = res;
           this.bpmnModeler.importXML(res, function(err){
             if(err){
               return console.error('could not import BPMN 2.0 diagram', err);
             }
           })
          })
        }
           this.bpmnservice.send.subscribe(x=>{
            this.receivedbpmn=x;
            if(this.receivedbpmn){
              let bpmnFileName = this.receivedbpmn;
              let bpmnFilePath = "assets/resources/"+bpmnFileName;
              this.rest.getBPMNFileContent(bpmnFilePath).subscribe(res => {
                this.newxmlsttring = res;  
                this.newBpmnModeler.importXML(res,function(err){
             
                    if(err){
               return console.error('could not import BPMN 2.0 diagram',err);
             }
           })
           })
         
       }
     },
     (err =>{
       console.log(err);
     }));
   }
  
   
  //  uploadBpmn(){
  //    alert("hi")
  //   this.hideUploadContainer=!this.hideUploadContainer
  //   this.hideCreateContainer=!this.hideCreateContainer
  //    this.isHiddenDiff=!this.isHiddenDiff
     
  //    let newFile = (<HTMLInputElement>document.getElementById("Finput2")).files[0];
  //    if(newFile){
  //      let newFileName = newFile.name;
  //      newFileName = "assets/resources/"+newFileName;
  //      this.rest.getBPMNFileContent(newFileName).subscribe(res => {
  //        this.newBpmnXml = res;
  //        this.newBpmnModeler.importXML(res, function(err){
  //          if(err){
  //            return console.error('could not import BPMN 2.0 diagram', err);
  //          }
  //        });
  //      });
  //    }
  //    if(newFile){
  //      this.loadModels(this.oldBpmnXml, this.newBpmnXml, this);
  //    }
  //    this.showdiagram(this.newBpmnXml)
  //  }
  slideup(){
    document.getElementById("foot").classList.remove("slide-down");
  document.getElementById("foot").classList.add("slide-up");
  }
 uploadBpmn(){

    let newFile = this.receivedbpmn;  
    if(newFile){
 let newFileName = newFile;
 let newFilepath = "assets/resources/"+newFileName;
this.rest.getBPMNFileContent(newFilepath).subscribe(res => {
 this.newBpmnXml = res;
  this.newBpmnModeler.importXML(res, function(err){
 if(err){
   return console.error('could not import BPMN 2.0 diagram', err);
         }
             });
        });
        }
        if(newFile){
           this.loadModels(this.oldxmlstring, this.newxmlsttring);
         }
      // this.showdiagram(this.newBpmnXml)
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
 
   loadModels(a, b) {
     let changes;
      new BpmnModdle().fromXML(a, function(err, adefs) {
        
    //if (err) {
      //return done(err);
    //}

      // _self.displayContainer(a, err);
               new BpmnModdle().fromXML(b, function(err, bdefs) {
          //_self.displayContainer(b, err);
          //if (err) {
         //   return done(err);
         // } else {
          //  return done(null, adefs, bdefs);
         // }
          changes = diff(adefs, bdefs);
         console.log(changes._changed);
          //_self.hasChanges = !(changes._layoutChanged == {} && _changes._changed == {} && 
            //_changes._removed == {} && _changes._added == {});
       });
  });
 }
}