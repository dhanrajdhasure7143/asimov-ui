import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from "angular-notifier";
import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';

import { SharebpmndiagramService } from '../../services/sharebpmndiagram.service';
import { DataTransferService } from '../../services/data-transfer.service';
import { RestApiService } from '../../services/rest-api.service';

@Component({
  selector: 'app-bpshome',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class BpsHomeComponent implements OnInit {
  bpmnModeler: any;
  notifier: NotifierService;
  uploadedBpmnfile:any
  saved_diagrams:any[] = [];
  bkp_saved_diagrams:any[] = [];
  hints:any[];
  constructor(private router:Router, private bpmnservice:SharebpmndiagramService, private dt:DataTransferService,
     private rest:RestApiService, private notifierService: NotifierService ) { }

  ngOnInit(){
    this.notifier = this.notifierService;
    this.dt.changeParentModule({"route":"/pages/businessProcess/home", "title":"Business Process Studio"});
    this.dt.changeChildModule("");
    this.hints = [
      { selector:'#upload_bpmn', description:'Drag/Drop or Upload BPMN File', showNext:true },
      { selector:'#create_bpmn', description:'Create BPMN diagram', showNext:true },
      { selector:'#bpmn_list', description:'List of saved BPMN files for user', showNext:true },
      { selector:'#bpmn_list_item0', event:'click', description:'Click on each record to display it as diagram' },
      { selector:'.diagram_container0', description:'BPMN Diagram of the clicked record' },
    ];
    this.dt.changeHints(this.hints);
    this.rest.getUserBpmnsList().subscribe( (res:any[]) =>  {
      // this.saved_diagrams = res; 
      this.saved_diagrams.push(res[0]);
      this.saved_diagrams.push(res[0]);
      this.saved_diagrams.push(res[0]);
      this.bkp_saved_diagrams = res; 
    });
  }
  getDiagram(byteBpmn,i){
    this.bpmnModeler = new BpmnJS({
      container: '.diagram_container'+i,
      keyboard: {
        bindTo: window
      }
    });
    this.bpmnModeler.clear();
    this.bpmnModeler.importXML(atob(byteBpmn), function(err){
      if(err){
        this.notifier.show({
          type: "error",
          message: "Could not import Bpmn diagram!",
          id: "ae12" 
        });
      }
    })
    let canvas = this.bpmnModeler.get('canvas');
    canvas.zoom('fit-viewport');
  }
  onSelect(e){
    if(e.addedFiles.length == 1 && e.rejectedFiles.length == 0){
      this.uploadedBpmnfile = e.addedFiles[0].name;
      this.router.navigate(['/pages/businessProcess/uploadProcessModel'])
      this.bpmnservice.uploadBpmn(this.uploadedBpmnfile)
    }else{
      let message = "Oops! Something went wrong";
      if(e.rejectedFiles[0].reason == "type")
        message = "Please upload proper *.bpmn file";
      this.notifier.show({
        type: "error",
        message: message,
        id: "ae12" 
      });
    }
  }

  
}
