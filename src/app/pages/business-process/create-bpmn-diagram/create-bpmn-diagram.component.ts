import { Component, AfterViewInit } from '@angular/core';
import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import { NgxSpinnerService } from "ngx-spinner"; 

import { RestApiService } from '../../services/rest-api.service';

@Component({
  selector: 'app-create-bpmn-diagram',
  templateUrl: './create-bpmn-diagram.component.html',
  styleUrls: ['./create-bpmn-diagram.component.css']
})
export class CreateBpmnDiagramComponent implements AfterViewInit {

  bpmnModeler:any;
  oldXml;
  newXml;
  updated_date_time;

  constructor(private rest:RestApiService, private spinner:NgxSpinnerService) {}

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
    setInterval(() => {
      this.autoSaveBpmnDiagram();
    }, 1*60*1000); //auto save for every 1 min
  }

  autoSaveBpmnDiagram(){
    let _self = this;
    this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
      _self.oldXml = _self.newXml;
      _self.newXml = xml;
      if(_self.oldXml != _self.newXml){
        _self.spinner.show();
        setTimeout(()=>{
          _self.updated_date_time = new Date();
          _self.spinner.hide();
        },1000);    
      }
    });
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

}
