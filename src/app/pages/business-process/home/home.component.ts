import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import * as BpmnJS from 'bpmn-js/dist/bpmn-modeler.production.min.js';

import { SharebpmndiagramService } from '../../services/sharebpmndiagram.service';
import { DataTransferService } from '../../services/data-transfer.service';
import { RestApiService } from '../../services/rest-api.service';
import { BpsHints } from '../model/bpmn-module-hints';

@Component({
  selector: 'app-bpshome',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class BpsHomeComponent implements OnInit {
  bpmnModeler: any;
  saved_diagrams:any[] = [];
  bkp_saved_diagrams:any[] = [];
  p: number = 1;
  searchTerm = "";
  isLoading:boolean = false;
  sortedData:any;
  data;
  orderAsc:boolean = true;
  sortIndex:number=2;
  index:number;
  xpandStatus=false;
  autosavedDiagramList = [];
  autosavedDiagramVersion = [];
  pendingStatus='PENDING APPROVAL';
  userRole;
  isButtonVisible:boolean = false;

  constructor(private router:Router, private bpmnservice:SharebpmndiagramService, private dt:DataTransferService,
     private rest:RestApiService, private hints:BpsHints ) { }

  ngOnInit(){
    this.userRole = localStorage.getItem("userRole")
    
    if(this.userRole.includes('SuperAdmin')){
      this.isButtonVisible = true;
    }else if(this.userRole.includes('Admin')){
      this.isButtonVisible = true;
    }else if(this.userRole.includes('Process Architect')){
      this.isButtonVisible = true;
    }else{
      this.isButtonVisible = false;
    }

    this.isLoading = true;
    this.dt.changeParentModule({"route":"/pages/businessProcess/home", "title":"Business Process Studio"});
    this.dt.changeChildModule({"route":"/pages/businessProcess/home","title":"BPMN Upload"});
    this.dt.changeHints(this.hints.bpsHomeHints);
    this.getBPMNList();
    this.getAutoSavedDiagrams();
  }

  async getBPMNList(){
    await this.rest.getUserBpmnsList().subscribe( (res:any[]) =>  {
      this.saved_diagrams = res; 
      this.saved_diagrams.map(item => {item.xpandStatus = false;return item;})
      this.bkp_saved_diagrams = res; 
      this.isLoading = false;
    },
    
    (err) => {
      this.isLoading = false;
    });
  }

  @HostListener('document:click',['$event'])
  clickout(event) {
    if(!document.getElementById("bpmn_list").contains(event.target) && this.index>=0)
      this.saved_diagrams[this.index].xpandStatus=false;
  }

  openDiagram(bpmnDiagram){
    if(bpmnDiagram.bpmnProcessStatus && bpmnDiagram.bpmnProcessStatus =="PENDING" ) return;
    let binaryXMLContent = bpmnDiagram.bpmnXmlNotation; 
    let bpmnModelId = bpmnDiagram.bpmnModelId;
    let bpmnVersion = bpmnDiagram.version;
    this.bpmnservice.uploadBpmn(atob(binaryXMLContent));
    this.router.navigate(['/pages/businessProcess/uploadProcessModel'], { queryParams: { bpsId: bpmnModelId , ver: bpmnVersion}});
  }
  getAutoSavedDiagrams(){
    this.rest.getBPMNTempNotations().subscribe( (res:any) =>  {
      if(Array.isArray(res))
        this.autosavedDiagramList = res; 
    });
   }
   getColor(status) { 
    switch (status) {
      case 'PENDING':
        return 'orange';
      case 'REJECTED':
        return 'red';
      case 'APPROVED':
        return 'green';
      case 'INPROGRESS':
        return 'orange';
    }
  }
   filterAutoSavedDiagrams(modelId){
    this.autosavedDiagramVersion = this.autosavedDiagramList.filter(each_asDiag => {
      return each_asDiag.bpmnModelId == modelId;
    })
   }
  getDiagram(eachBPMN,i){
    let byteBpmn = atob(eachBPMN.bpmnXmlNotation);
    this.index=i;
    if(document.getElementsByClassName('diagram_container'+i)[0].innerHTML.trim() != "") return;
    this.bpmnModeler = new BpmnJS({
      container: '.diagram_container'+i,
      keyboard: {
        bindTo: window
      }
    }); 
    if(eachBPMN.bpmnProcessStatus != "APPROVED" && eachBPMN.bpmnProcessStatus != "REJECTED")
      this.filterAutoSavedDiagrams(eachBPMN.bpmnModelId);
    if(this.autosavedDiagramVersion[0] && this.autosavedDiagramVersion[0]["bpmnProcessMeta"])
      byteBpmn = atob(this.autosavedDiagramVersion[0]["bpmnProcessMeta"]);
      if(byteBpmn == "undefined"){
        this.rest.getBPMNFileContent("assets/resources/newDiagram.bpmn").subscribe(res => {
          this.bpmnModeler.importXML(res, function(err){
            if(err){
              console.error('could not import BPMN 2.0 diagram', err);
            }
          })
        });
      }else{
        this.bpmnModeler.importXML(byteBpmn, function(err){
          if(err){
            console.error('could not import BPMN 2.0 diagram', err);
          }
        })
      }
    // let canvas = this.bpmnModeler.get('canvas');
    // canvas.zoom('fit-viewport');
  }

  loopTrackBy(index, term){
    return index;
  }
  sort(colKey,ind) { // if not asc, desc
    this.sortIndex=ind
    let asc=this.orderAsc
    this.orderAsc=!this.orderAsc
    this.saved_diagrams= this.saved_diagrams.sort(function(a,b){
      if (asc) 
       return (a[colKey] > b[colKey]) ? 1 : -1;
      else 
       return (a[colKey] < b[colKey]) ? 1 : -1;
    });
  }
  
 
}
