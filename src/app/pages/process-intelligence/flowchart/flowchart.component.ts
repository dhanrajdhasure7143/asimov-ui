import { Component, OnInit } from '@angular/core';
import { Options} from 'ng5-slider';
import { Router } from '@angular/router';
import {ZoomSlider} from '../../../zoomSlider';

import { ProcessGraphModel } from '../model/process-graph-flowchart-model';
import { DataTransferService } from '../../services/data-transfer.service';
import { SharebpmndiagramService } from '../../services/sharebpmndiagram.service';
import { PiHints } from '../model/process-intelligence-module-hints';

enum ProcessGraphList{
  'Sales_work_04-03-2020',
  'Sales_work_05-03-2020',
  'Sales_work_06-03-2020',
  'Sales_work_07-03-2020'
}

enum VariantList{
  'Most Common Varaint',
  'In Active',
  'Active'
}

@Component({
  selector: 'app-flowchart',
  templateUrl: './flowchart.component.html',
  styleUrls: ['./flowchart.component.css'],
  providers: [ProcessGraphModel]
})
export class FlowchartComponent implements OnInit {
  public select_varaint:any=0;
  public model1 = this.pgModel.model1;
  public model2 = this.pgModel.model2;
  public data = (this.pgModel.data);
  public inactive_data = this.pgModel.inactive_data;
  public active_data = this.pgModel.active_data;
  public reports= this.pgModel.reports;
  public filterLength:number;
  public dataValues:any[];
  public varaint_data:any[];
  public rangevalue:any;
  value: number = 20;
  trackValue: number = 60;
  options: Options = {
    floor: 0,
    ceil: 100,
     translate: (value: number): string => `${value}%`,
     hideLimitLabels: false,
     hidePointerLabels:true,
     vertical:true,
    }
    fetchData : any = [];
    process_graph_list;
    process_graph_options;
    variant_list_options;
    variant_list;
  constructor(private dt:DataTransferService, private router:Router, private bpmnservice:SharebpmndiagramService,
     private pgModel:ProcessGraphModel, private hints:PiHints) { }

  ngOnInit() {
    this.dt.changeParentModule({"route":"/pages/processIntelligence/upload", "title":"Process Intelligence"});
    this.dt.changeChildModule({"route":"/pages/processIntelligence/flowChart", "title":"Process Graph"});
    this.dt.changeHints(this.hints.processGraphHints);
    this.varaint_data=this.data;
    //this.dataValuesFilter();
    this.process_graph_options = ProcessGraphList;
    this.process_graph_list = Object.keys(ProcessGraphList).filter(val => isNaN(ProcessGraphList[val]));
    this.variant_list_options = VariantList;
    this.variant_list = Object.keys(VariantList).filter(val => isNaN(VariantList[val]));
  }

  ngAfterContentChecked(){
    this.rangevalue=ZoomSlider.rangeValue
}

 
  // dataValuesFilter(){
  //   this.filterLength=this.model.nodeDataArray.length-2;
  //   this.dataValues=this.model.nodeDataArray.splice(1,this.filterLength);
  // }
  
  onchangeVaraint(){
    
    if(this.select_varaint == 0){
      this.varaint_data=this.data;
    }
    if(this.select_varaint == 1){
      this.varaint_data=this.inactive_data;
    }
    if(this.select_varaint == 2){
      this.varaint_data=this.active_data
    }
}

slideup(){
  document.getElementById("foot").classList.remove("slide-down");
  document.getElementById("foot").classList.add("slide-up");
}

generateBpmn(){
  this.bpmnservice.uploadBpmn("pizza-collaboration.bpmn");  
  this.router.navigate(['/pages/businessProcess/uploadProcessModel'])
}
  
loopTrackBy(index, term){
  return index;
}
}
