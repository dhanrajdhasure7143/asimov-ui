import { Component, OnInit ,AfterViewInit} from '@angular/core';
import { Router } from '@angular/router';
import { diff } from 'bpmn-js-differ';
import { NgxSpinnerService } from "ngx-spinner"; 

import BpmnModdle from 'bpmn-moddle';
import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import { SplitComponent, SplitAreaDirective } from 'angular-split';
import { BpmnModel } from '../model/bpmn-autosave-model';
import { SharebpmndiagramService } from '../../services/sharebpmndiagram.service';
import { RestApiService } from '../../services/rest-api.service';
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
  last_updated_time = new Date().getTime();
  bpmnModel:BpmnModel = new BpmnModel();
  uploaded_xml:any;
  counter:number = 0;
  autosaveObj:any




   constructor(private rest:RestApiService, private bpmnservice:SharebpmndiagramService,private router:Router, private spinner:NgxSpinnerService,
      private dt:DataTransferService) { }
 
   ngOnInit() {
    this.dt.changeParentModule({"route":"/pages/businessProcess/home", "title":"Business Process Studio"});
    this.dt.changeChildModule({"route":"/pages/businessProcess/uploadProcessModel", "title":"Studio"});
    
   }
   ngAfterViewInit(){
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
      this.bpmnModeler.on('element.changed', function(){
        let now = new Date().getTime();
        if(now - _self.last_updated_time > 10*1000){
          _self.autoSaveDiagram();
          _self.last_updated_time = now;
        }
      })
      
    });

     
   }
   autoSaveDiagram(){
    let _self = this;
    this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
      _self.uploaded_xml=xml
           _self.bpmnModel.bpmnXmlNotation = btoa(unescape(encodeURIComponent(xml)))
    })
    
    this.bpmnModel.bpmnModelId=1;
    this.bpmnModel.bpmnModelModifiedBy="gopi";
    this.bpmnModel. bpmnModelModifiedTime= new Date();
    this.bpmnModel.bpmnModelTempStatus="INPROGRESS";
    this.bpmnModel.bpmnModelTempVersion="v1.0";
    _self.bpmnModel.bpmnProcessMeta =btoa(unescape(encodeURIComponent(this.uploaded_xml)))
    
    this.rest.autoSaveBPMNFileContent(this.bpmnModel).subscribe(

      data=>{;
        this.autosaveObj=data
    this.bpmnModel.bpmnModelTempId=this.autosaveObj.bpmnModelTempId
        
        this.counter++;
        this.spinner.hide()
      },
      err => {
          this.spinner.hide();
        }
    )
    
    

  }
   saveprocess(){
    let _self = this;
    this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
      _self.uploaded_xml=xml
           _self.bpmnModel.bpmnXmlNotation = btoa(unescape(encodeURIComponent(xml)))
    })
    
    this.bpmnModel.approverName="vaidehi";
    
    this.bpmnModel.bpmnModelId=1,
  this.bpmnModel.bpmnProcessName="aaaaaa";
  // this.bpmnModel.bpmnXmlNotation=btoa(_self.uploaded_xml),
    
    this.bpmnModel.userName="gopi";
    this.rest.saveBPMNprocessinfofromtemp(this.bpmnModel).subscribe(

      data=>{
        
        alert("saved successfully")
        
        this.spinner.hide()
      },
      err => {
        alert("failed")
          this.spinner.hide();
        }
    )
    
   }
   submitDiagramForApproval(){
    let _self = this;
    this.bpmnModel.approverName="vaidehi";
    this.bpmnModel.bpmnJsonNotation= btoa(unescape(encodeURIComponent(this.uploaded_xml)));
    this.bpmnModel.bpmnModelId=1;
    this.bpmnModel.bpmnNotationAutomationTask=btoa(unescape(encodeURIComponent(this.uploaded_xml)));
    this.bpmnModel.bpmnNotationHumanTask=btoa(unescape(encodeURIComponent(this.uploaded_xml)));
    this.bpmnModel.bpmnProcessApproved=0;
    this.bpmnModel.bpmnProcessName="pizza diagram";
    this.bpmnModel.bpmnProcessStatus="open";
    this.bpmnModel.bpmnModelTempId=this.autosaveObj.bpmnModelTempId;
    this.bpmnModel.bpmnXmlNotation=btoa(unescape(encodeURIComponent(this.uploaded_xml)));
    this.bpmnModel.category= "string";
    this.bpmnModel.emailTo= "swaroop.attaluri@epsoftinc.com";
    this.bpmnModel.id= 5;
    this.bpmnModel.processIntelligenceId= 5;
    this.bpmnModel.bpmnJsonNotationreviewComments ="asdf";
    this.bpmnModel.tenantId=7;
    this.bpmnModel.userName="gopi";
    this.spinner.show()
    this.rest.submitBPMNforApproval(this.bpmnModel).subscribe(

      data=>{
        
        alert("saved successfully")
        
        this.spinner.hide()
      },
      err => {
        alert("failed")
          this.spinner.hide();
        }
    )
    
   

    
  
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
    let bpmnDiffs = diff(this.bpmnModeler.getDefinitions(), this.bpmnservice.getConfBpmnXMLDef());
    this.bpmnservice.updateDifferences(bpmnDiffs);
    this.slideup();
  }

  dragEnd(e){
    
  }
}