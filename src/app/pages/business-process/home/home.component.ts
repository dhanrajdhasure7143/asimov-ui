import { Component, OnInit, HostListener} from '@angular/core';
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
  searchTerm;
  isLoading:boolean = false;

  bplist:any[] = [];
   xpandStatus=false;
  index: any;
  constructor(private router:Router, private bpmnservice:SharebpmndiagramService, private dt:DataTransferService,
     private rest:RestApiService, private hints:BpsHints ) { }

  ngOnInit(){
    this.isLoading = true;
    this.dt.changeParentModule({"route":"/pages/businessProcess/home", "title":"Business Process Studio"});
    this.dt.changeChildModule("");
    this.dt.changeHints(this.hints.bpsHomeHints);
    this.getBPMNList();
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
  openDiagram(binaryXMLContent, i){
    this.bpmnservice.uploadBpmn(atob(binaryXMLContent));
    this.router.navigate(['/pages/businessProcess/uploadProcessModel'], { queryParams: { bpsId: i }});
  }

getDiagram(byteBpmn,i){
    this.index=i;
    if(document.getElementsByClassName('diagram_container'+i)[0].innerHTML.trim() != "") return;
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

  loopTrackBy(index, term){
    return index;
  }

}
