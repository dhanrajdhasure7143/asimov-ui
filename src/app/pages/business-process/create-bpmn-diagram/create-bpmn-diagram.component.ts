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

  autosaveObj:any;
  bpmnModel:BpmnModel = new BpmnModel();
  counter:number = 0;
  alive:boolean = true;
  last_updated_time = new Date().getTime();

  constructor(private rest:RestApiService, private spinner:NgxSpinnerService, private dt:DataTransferService,
    private router:Router, private bpmnservice:SharebpmndiagramService, private global:GlobalScript, ) {}

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
    this.spinner.show()
    let _self = this;
    this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
      _self.oldXml = _self.newXml;
      _self.newXml = xml;
      if(_self.oldXml != _self.newXml){
        _self.spinner.show();
        _self.updated_date_time = new Date();
        _self.bpmnModel.bpmnModelModifiedTime = _self.updated_date_time;
        // _self.bpmnModel.bpmnModelTempId = _self.counter;
        _self.bpmnModel.bpmnModelTempVersion = '0.0.'+_self.counter;
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
    
    this.bpmnModel.bpmnModelId=1;
    this.bpmnModel.bpmnModelModifiedBy="gopi";
    this.bpmnModel. bpmnModelModifiedTime= new Date();
    this.bpmnModel.bpmnModelTempStatus="INPROGRESS";
    this.bpmnModel.bpmnModelTempVersion="v1.0";
    // this.bpmnModel.bpmnProcessMeta="+CiAgICA8YnBtbjpzdGFydEV2ZW50IGlkPSJTdGFydEV2ZW50XzBrZWg2emsiPgogICAgICA8YnBtbjpvdXRnb2luZz5GbG93XzByOGgzazI8L2JwbW46b3V0Z29pbmc+CiAgICA8L2JwbW46c3RhcnRFdmVudD4KICAgIDxicG1uOnRhc2sgaWQ9IkFjdGl2aXR5XzAyNzdqZGIiIG5hbWU9IlByb2Nlc3NUZXN0MSI+CiAgICAgIDxicG1uOmluY29taW5nPkZsb3dfMHI4aDNrMjwvYnBtbjppbmNvbWluZz4KICAgICAgPGJwbW46b3V0Z29pbmc+Rmxvd18wMGl4dnZ0PC9icG1uOm91dGdvaW5nPgogICAgPC9icG1uOnRhc2s+CiAgICA8YnBtbjpzZXF1ZW5jZUZsb3cgaWQ9IkZsb3dfMHI4aDNrMiIgc291cmNlUmVmPSJTdGFydEV2ZW50XzBrZWg2emsiIHRhcmdldFJlZj0iQWN0aXZpdHlfMDI3N2pkYiIgLz4KICAgIDxicG1uOnRhc2sgaWQ9IkFjdGl2aXR5XzFhOGxqeWsiIG5hbWU9IlByb2Nlc3NUZXN0MiI+CiAgICAgIDxicG1uOmluY29taW5nPkZsb3dfMDBpeHZ2dDwvYnBtbjppbmNvbWluZz4KICAgICAgPGJwbW46b3V0Z29pbmc+Rmxvd18xZHh1cWM2PC9icG1uOm91dGdvaW5nPgogICAgPC9icG1uOnRhc2s+CiAgICA8YnBtbjpzZXF1ZW5jZUZsb3cgaWQ9IkZsb3dfMDBpeHZ2dCIgc291cmNlUmVmPSJBY3Rpdml0eV8wMjc3amRiIiB0YXJnZXRSZWY9IkFjdGl2aXR5XzFhOGxqeWsiIC8+CiAgICA8YnBtbjp0YXNrIGlkPSJBY3Rpdml0eV8wejA2eGNuIiBuYW1lPSJQcm9jZXNzVGVzdDMiPgogICAgICA8YnBtbjppbmNvbWluZz5GbG93XzFkeHVxYzY8L2JwbW46aW5jb21pbmc+CiAgICAgIDxicG1uOm91dGdvaW5nPkZsb3dfMTl2YXpjdzwvYnBtbjpvdXRnb2luZz4KICAgIDwvYnBtbjp0YXNrPgogICAgPGJwbW46c2VxdWVuY2VGbG93IGlkPSJGbG93XzFkeHVxYzYiIHNvdXJjZVJlZj0iQWN0aXZpdHlfMWE4bGp5ayIgdGFyZ2V0UmVmPSJBY3Rpdml0eV8wejA2eGNuIiAvPgogICAgPGJwbW46ZW5kRXZlbnQgaWQ9IkV2ZW50XzByeDV4ZXQiPgogICAgICA8YnBtbjppbmNvbWluZz5GbG93XzE5dmF6Y3c8L2JwbW46aW5jb21pbmc+CiAgICA8L2JwbW46ZW5kRXZlbnQ+CiAgICA8YnBtbjpzZXF1ZW5jZUZsb3cgaWQ9IkZsb3dfMTl2YXpjdyIgc291cmNlUmVmPSJBY3Rpdml0eV8wejA2eGNuIiB0YXJnZXRSZWY9IkV2ZW50XzByeDV4ZXQiIC8+CiAgPC9icG1uOnByb2Nlc3M+CiAgPGJwbW5kaTpCUE1ORGlhZ3JhbSBpZD0iQlBNTkRpYWdyYW1fMSI+CiAgICA8YnBtbmRpOkJQTU5QbGFuZSBpZD0iQlBNTlBsYW5lXzEiIGJwbW5FbGVtZW50PSJQcm9jZXNzXzF5b3dwd20iPgogICAgICA8YnBtbmRpOkJQTU5TaGFwZSBpZD0iX0JQTU5TaGFwZV9TdGFydEV2ZW50XzIiIGJwbW5FbGVtZW50PSJTdGFydEV2ZW50XzBrZWg2emsiPgogICAgICAgIDxkYzpCb3VuZHMgeD0iMTU2IiB5PSI4MSIgd2lkdGg9IjM2IiBoZWlnaHQ9IjM2IiAvPgogICAgICA8L2JwbW5kaTpCUE1OU2hhcGU+CiAgICAgIDxicG1uZGk6QlBNTlNoYXBlIGlkPSJBY3Rpdml0eV8wMjc3amRiX2RpIiBicG1uRWxlbWVudD0iQWN0aXZpdHlfMDI3N2pkYiI+CiAgICAgICAgPGRjOkJvdW5kcyB4PSIyNTAiIHk9IjU5IiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjgwIiAvPgogICAgICA8L2JwbW5kaTpCUE1OU2hhcGU+CiAgICAgIDxicG1uZGk6QlBNTkVkZ2UgaWQ9IkZsb3dfMHI4aDNrMl9kaSIgYnBtbkVsZW1lbnQ9IkZsb3dfMHI4aDNrMiI+CiAgICAgICAgPGRpOndheXBvaW50IHg9IjE5MiIgeT0iOTkiIC8+CiAgICAgICAgPGRpOndheXBvaW50IHg9IjI1MCIgeT0iOTkiIC8+CiAgICAgIDwvYnBtbmRpOkJQTU5FZGdlPgogICAgICA8YnBtbmRpOkJQTU5TaGFwZSBpZD0iQWN0aXZpdHlfMWE4bGp5a19kaSIgYnBtbkVsZW1lbnQ9IkFjdGl2aXR5XzFhOGxqeWsiPgogICAgICAgIDxkYzpCb3VuZHMgeD0iNDEwIiB5PSI1OSIgd2lkdGg9IjEwMCIgaGVpZ2h0PSI4MCIgLz4KICAgICAgPC9icG1uZGk6QlBNTlNoYXBlPgogICAgICA8YnBtbmRpOkJQTU5FZGdlIGlkPSJGbG93XzAwaXh2dnRfZGkiIGJwbW5FbGVtZW50PSJGbG93XzAwaXh2dnQiPgogICAgICAgIDxkaTp3YXlwb2ludCB4PSIzNTAiIHk9Ijk5IiAvPgogICAgICAgIDxkaTp3YXlwb2ludCB4PSI0MTAiIHk9Ijk5IiAvPgogICAgICA8L2JwbW5kaTpCUE1ORWRnZT4KICAgICAgPGJwbW5kaTpCUE1OU2hhcGUgaWQ9IkFjdGl2aXR5XzB6MDZ4Y25fZGkiIGJwbW5FbGVtZW50PSJBY3Rpdml0eV8wejA2eGNuIj4KICAgICAgICA8ZGM6Qm91bmRzIHg9IjU3MCIgeT0iNTkiIHdpZHRoPSIxMDAiIGhlaWdodD0iODAiIC8+CiAgICAgIDwvYnBtbmRpOkJQTU5TaGFwZT4KICAgICAgPGJwbW5kaTpCUE1ORWRnZSBpZD0iRmxvd18xZHh1cWM2X2RpIiBicG1uRWxlbWVudD0iRmxvd18xZHh1cWM2Ij4KICAgICAgICA8ZGk6d2F5cG9pbnQgeD0iNTEwIiB5PSI5OSIgLz4KICAgICAgICA8ZGk6d2F5cG9pbnQgeD0iNTcwIiB5PSI5OSIgLz4KICAgICAgPC9icG1uZGk6QlBNTkVkZ2U+CiAgICAgIDxicG1uZGk6QlBNTlNoYXBlIGlkPSJFdmVudF8wcng1eGV0X2RpIiBicG1uRWxlbWVudD0iRXZlbnRfMHJ4NXhldCI+CiAgICAgICAgPGRjOkJvdW5kcyB4PSI3MzIiIHk9IjgxIiB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIC8+CiAgICAgIDwvYnBtbmRpOkJQTU5TaGFwZT4KICAgICAgPGJwbW5kaTpCUE1ORWRnZSBpZD0iRmxvd18xOXZhemN3X2RpIiBicG1uRWxlbWVudD0iRmxvd18xOXZhemN3Ij4KICAgICAgICA8ZGk6d2F5cG9pbnQgeD0iNjcwIiB5PSI5OSIgLz4KICAgICAgICA8ZGk6d2F5cG9pbnQgeD0iNzMyIiB5PSI5OSIgLz4KICAgICAgPC9icG1uZGk6QlBNTkVkZ2U+CiAgICA8L2JwbW5kaTpCUE1OUGxhbmU+CiAgPC9icG1uZGk6QlBNTkRpYWdyYW0+CjwvYnBtbjpkZWZpbml0aW9ucz4K",
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
    )
    
    

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
  submitDiagramForApproval(){
    let _self = this;
    this.bpmnModel.approverName="vaidehi",
    this.bpmnModel.bpmnJsonNotation= btoa(_self.newXml),
    this.bpmnModel.bpmnModelId=1,
    this.bpmnModel.bpmnNotationAutomationTask=btoa(_self.newXml),
    this.bpmnModel.bpmnNotationHumanTask=btoa(_self.newXml),
    this.bpmnModel.bpmnProcessApproved=0,
    this.bpmnModel.bpmnProcessName="pizza diagram",
    this.bpmnModel.bpmnProcessStatus="open",
    this.bpmnModel.bpmnModelTempId=this.autosaveObj.bpmnModelTempId,
    this.bpmnModel.bpmnXmlNotation=btoa(_self.newXml),
    this.bpmnModel.category= "string",
    this.bpmnModel.emailTo= "swaroop.attaluri@epsoftinc.com",
    this.bpmnModel.id= 5,
    this.bpmnModel.processIntelligenceId= 5,
    this.bpmnModel.bpmnJsonNotationreviewComments ="asdf",
    this.bpmnModel.tenantId=7,
    this.bpmnModel.userName="gopi",
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
  
  saveprocess(){
    let _self=this
      this.bpmnModel.approverName="vaidehi",
      
      this.bpmnModel.bpmnModelId=1,
    this.bpmnModel.bpmnProcessName="aaaaaa",
    this.bpmnModel.bpmnXmlNotation=btoa(_self.newXml),
      
      this.bpmnModel.userName="gopi",
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
  
}
