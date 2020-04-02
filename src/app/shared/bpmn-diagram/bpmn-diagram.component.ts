import { Component, OnInit, Input } from '@angular/core';
import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import { Router } from '@angular/router';

import { DataTransferService } from '../../pages/services/data-transfer.service';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BpmnModel } from 'src/app/pages/business-process/model/bpmn-autosave-model';
import { GlobalScript } from '../global-script';

@Component({
  selector: 'bpmn-diagram',
  templateUrl: './bpmn-diagram.component.html',
  styleUrls: ['./bpmn-diagram.component.css']
})
export class BpmnDiagramComponent implements OnInit {

  @Input() bpmnXmlNotation;
  @Input() viewMode:boolean;
  @Input() id;
  last_updated_time = new Date().getTime();
  bpmnModel:BpmnModel = new BpmnModel();
  counter:number = 0;
  bpmnModeler:any;
  updated_date_time;
  oldXml;
  newXml;

  constructor(private rest:RestApiService, private spinner:NgxSpinnerService, private router:Router, 
    private dt:DataTransferService, private global: GlobalScript) { }

  ngOnInit() {
    
  }

  initializeDiag(canvasId, xml){
    this.id = canvasId;
    this.bpmnXmlNotation = xml;
    let canvas_el = document.getElementById(this.id);
    if(canvas_el)
      canvas_el.innerHTML = "";
    this.bpmnModeler = new BpmnJS({
      container: '#'+this.id
    });
    let canvas = this.bpmnModeler.get('canvas');
    canvas.zoom('fit-viewport');
    let _self = this;
    this.bpmnModeler.importXML(this.bpmnXmlNotation, function(err){
      if(err)
        _self.global.notify("Something went wrong!","error");
    });
    if(!this.viewMode){
      let _self = this;
      this.bpmnModeler.on('element.changed', function(){
        let now = new Date().getTime();
        if(now - _self.last_updated_time > 10*1000){
          _self.autoSaveBpmnDiagram();
          _self.last_updated_time = now;
        }
      })
    }
  }

  openDiagram(){
    this.dt.changePiData(this.bpmnXmlNotation);
    this.router.navigateByUrl("/pages/businessProcess/uploadProcessModel");
  }

  autoSaveBpmnDiagram(){
    this.spinner.show();
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
      this.spinner.hide();
    },
    err => {
      this.spinner.hide();
    })
  }

}
