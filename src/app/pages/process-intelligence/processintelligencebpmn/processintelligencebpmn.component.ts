import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router'
import { diff } from 'bpmn-js-differ';
import BpmnModdle from 'bpmn-moddle';
import {  ElementRef, Input, Output, ViewChild, EventEmitter,  AfterViewInit } from '@angular/core';

import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import { RestApiService } from '../../services/rest-api.service';
import { SharebpmndiagramService } from '../../services/sharebpmndiagram.service';




@Component({
  selector: 'app-processintelligencebpmn',
  templateUrl: './processintelligencebpmn.component.html',
  styleUrls: ['./processintelligencebpmn.component.css']
})
export class ProcessintelligencebpmnComponent implements OnInit, OnDestroy {
   isHidden:boolean=true;
  isHiddenTwo:boolean=true;
  bpmnModeler;
  oldBpmnModeler;
  newBpmnModeler;
  changes:any = {};
  reSize:boolean=false;
  newBpmnXml;
  oldBpmnXml;
  receivedbpmn:any;
  hasChanges:boolean = false;
  createDiagram:boolean = false;
  subscription;

  constructor(private router:Router, private rest:RestApiService, private bpmnservice:SharebpmndiagramService) { }

  ngAfterViewInit(){
    this.bpmnModeler = new BpmnJS({
      container: '#canvas1',
      keyboard: {
        bindTo: window
      }
    });
    let canvas = this.bpmnModeler.get('canvas');
    canvas.zoom('fit-viewport');
  }
  
  ngOnInit() {
    // this.subscription = this.bpmnservice.send.subscribe(x=>{
    //   this.receivedbpmn=x;
    //   //console.log(this.receivedbpmn[0].name);
  
    //   if(this.receivedbpmn){
    //     let bpmnFileName = this.receivedbpmn;
    //     let bpmnFilePath = "assets/resources/"+bpmnFileName;
    //     this.rest.getBPMNFileContent(bpmnFilePath).subscribe(res => {
    //       this.bpmnModeler.importXML(res, function(err){
    //         if(err){
    //           return console.error('could not import BPMN 2.0 diagram', err);
    //         }
    //       })
    //       })
        
    //   }
    // },
    // (err =>{
    //   console.log(err);
    // }));
  }
  
  navigateCreate(){
    this.router.navigate(['/bpsflowchart']);
  }

  // getBpmnData(){
  //   let bpmnFile = (<HTMLInputElement>document.getElementById("Finput")).files[0];
  //   if(bpmnFile){
  //     let bpmnFileName = bpmnFile.name;
  //     let bpmnFilePath = "assets/resources/"+bpmnFileName;
  //     this.rest.getBPMNFileContent(bpmnFilePath).subscribe(res => {
  //       this.bpmnModeler.importXML(res, function(err){
  //         if(err){
  //           return console.error('could not import BPMN 2.0 diagram', err);
  //         }
  //       })
  //     })
  //   }
  // }
  resizeGrid(){
    this.reSize=!this.reSize
    this.isHiddenTwo=!this.isHiddenTwo
  }
  diplayDiff(){
    let oldFile = (<HTMLInputElement>document.getElementById("Finput1")).files[0];
    let newFile = (<HTMLInputElement>document.getElementById("Finput2")).files[0];
    if(oldFile){
      let oldFileName = oldFile.name;
      oldFileName = "assets/resources/"+oldFileName;
      this.rest.getBPMNFileContent(oldFileName).subscribe(res => {
        this.oldBpmnXml = res;
        this.oldBpmnModeler.importXML(res, function(err){
          if(err){
            return console.error('could not import BPMN 2.0 diagram', err);
          }
        });
      });
    }
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
    if(oldFile && newFile){
      this.loadModels(this.oldBpmnXml, this.newBpmnXml, this);
    }
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
          // return _self.generateDiagram(adefs, bdefs);
        }
        _self.changes = diff(adefs, bdefs);
        _self.hasChanges = !(_self.changes._layoutChanged == {} && _self.changes._changed == {} && 
           _self.changes._removed == {} && _self.changes._added == {});
      });
    });
  }

  save(type){
    
    let modeler;
    if(type=="old")
      modeler = this.oldBpmnModeler;
    else if(type=="new")
      modeler = this.newBpmnModeler;
    else if(type=="create")
      modeler = this.bpmnModeler;
    if(modeler){
      modeler.saveXML({ format: true }, function(err, xml) {
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

  createBpmnDiag(){
    this.createDiagram = !this.createDiagram;
    setTimeout(()=>{
      if(this.createDiagram){
        this.bpmnModeler = new BpmnJS({
          container: '#canvas',
          keyboard: {
            bindTo: window
          }
        });
        let canvas = this.bpmnModeler.get('canvas');
        canvas.zoom('fit-viewport');
        
      }else{
        this.oldBpmnModeler = new BpmnJS({
          container: '#canvas1',
          keyboard: {
            bindTo: window
          }
        });


    
        this.newBpmnModeler = new BpmnJS({
          container: '#canvas2'
        });
      }
      this.rest.getBPMNFileContent("assets/resources/newDiagram.bpmn").subscribe(res => {
        let _self = this;
        this.bpmnModeler.importXML(res, function(err){
          _self.displayContainer("createDgm",err);
        });
      });
    },50)
  }
  generateDiagram(oldDef, newDef){

  }
  saveBpmnData(){
    
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
