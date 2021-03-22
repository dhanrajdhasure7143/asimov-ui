

import { Component, OnInit, AfterViewInit,ViewChild,EventEmitter,ElementRef, Renderer2,Output ,HostListener} from '@angular/core';
import { Options } from 'ng5-slider';
import { Router, ActivatedRoute } from '@angular/router';
import { ZoomSlider } from '../../../zoomSlider';
import { ProcessGraphModel } from '../model/process-graph-flowchart-model';
import { DataTransferService } from '../../services/data-transfer.service';
import { SharebpmndiagramService } from '../../services/sharebpmndiagram.service';
import { PiHints } from '../model/process-intelligence-module-hints';
import { createLoweredSymbol, ThrowStmt } from '@angular/compiler';
import { NgControl } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { RestApiService } from '../../services/rest-api.service';
import Swal from 'sweetalert2';
import { Location} from '@angular/common'
import { GlobalScript } from 'src/app/shared/global-script';

enum ProcessGraphList {
  'Accounts_payable_04-07-2020',
  'Accounts_payable_03-07-2020',
  'Accounts_payable_02-07-2020',
  'Accounts_payable_01-07-2020'
}

enum VariantList {
  'Most Common',
  'Least Common',
  'Fastest Throughput',
  'Slowest Throughput'
}

@Component({
  selector: 'app-flowchart',
  templateUrl: './flowchart.component.html',
  styleUrls: ['./flowchart.component.css'],
  providers: [ProcessGraphModel]
})
export class FlowchartComponent implements OnInit {
  // @ViewChild('toggleButton') toggleButton: ElementRef;

  public select_varaint: any = 0;
  public model1;
  public model2;
  public data = (this.pgModel.data);
  public reports = this.pgModel.reports;
  public filterLength: number;
  public dataValues: any=[];
  public varaint_data: any=[];
  public rangevalue: any;
  pathvalue: number = 1;
  public isplay: boolean = false;
  isselected: number;
  activityValue: number = 1;
  public checkboxValue: boolean = false;
  public selectedCaseArry: any[];
  // public isfrequency: boolean = false;
  public caselength: number;
  public isdownloadsvg: boolean = false;
  public isdownloadpdf: boolean = false;
  public isdownloadJpeg: boolean = false;
  public isdownloadPng: boolean = false;
  public isDefaultData: boolean = true;
  public nodeArray: any[];
  public linkdata: any;
  public arrayLink: any;
  linkData = [];
  linkdataArray = [];
  public nestedArray:any[]=[];
  options: Options = {
    step:0.1,
    floor: 0,
    ceil: 1,
    // translate: (value: number): string => `${value}%`,
    translate: (value: number): string => `${value*100}`,
    hideLimitLabels: true,
    hidePointerLabels: false,
    vertical: true,
  }
  filterPerformData:any =[]; 
  process_graph_list:any=[];
  process_graph_options;
  variant_list_options;
  variant_list;
  public isfrequencymetrics:boolean=false;
  public isperformancemetrics:boolean=false;
  fullgraph:any;
  graphIds:any;
  isvaraintPlay:boolean=false;
  varaint_GraphData:any=[];
  varaint_GraphDataArray:any[]=[];
  piIdNumber:any;
  public isedgespinner:boolean=false;
  spinMetrics0:any="absoluteFrequency";
  wpiIdNumber:any;
  startLinkvalue:boolean;
  issvg:boolean;
  @ViewChild("toogleBtn",{static: false}) toogleBtn;
  sliderVariant:any=[];  
  isActivity_dropdwn:boolean=false;
  activity_value:any=[];
  selectedActivity:any=[];
  activity_list:any=[];
  fullgraph_model:any;
  isNodata:boolean=true;
  @ViewChild('activitySelect',{static: false}) activitySelect;
  variantCombo:any=[];
  isvariantSelectedOne:boolean=false;
  sliderGraphData:any=[];
  startPoint:boolean=false;
  endPoint:boolean=false;
  isEndpoint_dropdwn:boolean=false;
  performanceValue1:any;
  performanceValue2:any;
  performanceValue3:any;
  timeRangeArray:any=[];
  isFilterComponent:boolean=false;
  overLayHide:boolean=false;
  isvariantListOpen:boolean=true;
  issliderDisabled:boolean=false;
  startArray: any=[];
  endArray: any=[];
  filterModelArray: any[]=[];
  filterModel2Array: any=[];
  linkmodel2: any[]=[];
  linkArraymodel:any=[];
  resetFilter:boolean=false;
  filtermodel3:any=[];
  fullgraph_model1:any=[];
  isFullGraphBPMN:boolean = false;
  isSingleTraceBPMN:boolean = false;
  isMultiTraceBPMN:boolean = false;
  isSliderBPMN:boolean = false;
  performanceValue: boolean;
  processGraphName:any;
  selectedTraceNumbers:any = [];
  loaderImgSrc:string;
  graphgenetaionInterval: any;
  isPerformance:boolean=false;
  selectedPerformancevalue:any
  filterdNodes:any[];
  isClearFilter:boolean=false;
  isFilterApplied:boolean=false;
  isAddHrs:boolean=false;
  workingHours:any = {
    formDay:'Mon',
    toDay: 'Sun',
    shiftStartTime:"00:00",
    shiftEndTime:"23:59"
};
isWorkingHrsBtn:boolean=true;
allVaraintsCases:any[]=[];
isTimeChange:boolean=false;

  constructor(private dt: DataTransferService,
    private router: Router,
    private bpmnservice: SharebpmndiagramService,
    private pgModel: ProcessGraphModel,
    private hints: PiHints,
    private spinner: NgxSpinnerService,
    private rest:RestApiService,
    private route:ActivatedRoute,
    private renderer: Renderer2,
    private location:Location,
    private global:GlobalScript) {  }

  @HostListener('document:click', ['$event.target'])  // spinner overlay hide on out side click
  public onClick(targetElement) {
      const clickedInside = this.toogleBtn.nativeElement.contains(targetElement);
      if (!clickedInside) {
        this.isedgespinner=false
          // console.log("outside");  
      }else{
        // console.log("Inside");
      }
  }

  readOutputValueEmitted(val){
    this.startLinkvalue = val;
  }
  

  ngOnInit() {
   
    this.dt.changeParentModule({ "route": "/pages/processIntelligence/upload", "title": "Process Intelligence" });
    this.dt.changeChildModule({ "route": "/pages/processIntelligence/flowChart", "title": "Process Graph" });
    this.dt.changeHints(this.hints.processGraphHints);
    this.process_graph_options = ProcessGraphList;
    this.variant_list_options = VariantList;
    this.variant_list = Object.keys(VariantList).filter(val => isNaN(VariantList[val]));
    
    var piId;
    this.route.queryParams.subscribe(params => {
      if(params['wpiId']!=undefined){
          this.wpiIdNumber = parseInt(params['wpiId']);
          piId=this.wpiIdNumber;
          this.graphIds = piId;
          
          this.loaderImgSrc = "/assets/images/PI/loader_anim.gif";
          this.spinner.show();
          setTimeout(() => {
            this.onchangegraphId(piId);
            }, 500);
        }
      if(params['piId']!=undefined){
        this.piIdNumber = parseInt(params['piId']);
        piId=this.piIdNumber;
        this.graphIds = piId;        
        this.loaderImgSrc = "/assets/images/PI/loader_vr_1.gif"; 
        this.spinner.show();
        //setTimeout(() => {
           this.graphgenetaionInterval = setInterval(() => {
             this.onchangegenerategraphId(piId);
           }, 10*1000);
         // this.onchangegraphId(piId);
        //}, 1.5*60*1000);
      }
    });
    this.getAlluserProcessPiIds();

  }
  // ngAfterContentChecked() {
  //   this.rangevalue = ZoomSlider.rangeValue;
  // }

  getAlluserProcessPiIds(){ // List of Process graphs
    this.rest.getAlluserProcessPiIds().subscribe(data=>{this.process_graph_list=data
        setTimeout(() => {
          this.process_graph_list.data.forEach(e => {
            if(e.piId==this.graphIds){
              this.processGraphName=e.piName;
            }
          })
        }, 5000);
    })
  }
  onchangegraphId(selectedpiId){  // change process  graps in dropdown
    this.isNodata=true;
    let self = this;
    this.route.queryParams.subscribe(params => {
      let token = params['wpiId'];
      if (token) {
          let url=this.router.url.split('?')
          this.location.replaceState(url[0]+'?wpiId='+selectedpiId);
      }else{
        let url=this.router.url.split('?')
        this.location.replaceState(url[0]+'?piId='+selectedpiId);

      }
  });

    let piId=selectedpiId
    let endTime:any
    if(this.workingHours.shiftEndTime=='23:59'){
      endTime="24:00"
    }else{
      endTime=this.workingHours.shiftEndTime
    }
    const variantListbody= { 
      "data_type":"varients_list", 
       "pid":selectedpiId,
       'timeChange':this.isTimeChange,
    "workingHours": this.workingHours.formDay+"-"+this.workingHours.toDay+" "+this.workingHours.shiftStartTime+":00-"+endTime+":00"
       } 
    this.rest.getAllVaraintList(variantListbody).subscribe(data=>{this.varaint_data=data // variant List call
      for(var i=0; i<this.varaint_data.data.length; i++){
          this.varaint_data.data[i].selected= "inactive";
      }

      localStorage.setItem("variants",btoa(JSON.stringify(this.varaint_data)));
      this.onchangeVaraint("0");
      })
      const fullGraphbody= { 
        "data_type":"full_graph", 
        "pid":selectedpiId,
        'timeChange':this.isTimeChange,
        "workingHours": this.workingHours.formDay+"-"+this.workingHours.toDay+" "+this.workingHours.shiftStartTime+":00-"+endTime+":00"
         }
      this.rest.getfullGraph(fullGraphbody).subscribe(data=>{this.fullgraph=data //process graph full data call
        if(this.fullgraph.hasOwnProperty('display_msg')){
          // Swal.fire(
          //   'Oops!',
          //   'It is Not You it is Us, Please try again after some time',
          //   'error'
          // );
          Swal.fire({
            title: 'Oops!',
            text: "It is Not You it is Us, Please try again after some time",
            icon: 'error',
            showCancelButton: false,
            confirmButtonColor: '#007bff',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Okay'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                position: 'center',
                icon: 'info',
                title: 'Please wait, Redirecting to workspace',
                showConfirmButton: false,
                timer: 1500
              })
              setTimeout(() => {
                self.router.navigate(['pages/processIntelligence/upload'])
              }, 1500);
            }
          })

          this.spinner.hide();
         // this.redirectToWorkspace()
          this.model1=[];
          this.model2=[];
        } else{
         let fullgraphOne=this.fullgraph.data;
          this.activity_list=fullgraphOne.allSelectData.nodeDataArraycase.slice(1,-1)
          this.fullgraph_model=fullgraphOne.allSelectData.nodeDataArraycase
          this.fullgraph_model1=this.fullgraph_model
        this.model1 = fullgraphOne.allSelectData.nodeDataArraycase;
        this.filterPerformData = this.fullgraph_model;
        this.nodeAlignment();       
        this.model2 = this.flowchartData(this.model1)
        let fullModel2=this.model2
        this.startArray=[]
        this.endArray=[]
        fullModel2.forEach(element => {
          if(element.from=="Start"){
            this.startArray.push(element.to)
          }
          if(element.to=="End"){
            this.endArray.push(element.from)
          }
        });
        
        this.linkCurvinessGenerate();
        this.spinner.hide();
        this.linkmodel2 = this.model2;
        this.isFullGraphBPMN = true;
        this.isSingleTraceBPMN = false;
        this.isMultiTraceBPMN = false;
        this.isSliderBPMN = false;
        this.filterOverlay()

    }
        },(err =>{
          this.spinner.hide();
        }));
        const variantGraphbody= { 
          "data_type":"variant_graph", 
          "pid":selectedpiId,
          'timeChange':this.isTimeChange,
          "cases":[],
          "workingHours": this.workingHours.formDay+"-"+this.workingHours.toDay+" "+this.workingHours.shiftStartTime+":00-"+endTime+":00"
             }
        this.rest.getvaraintGraph(variantGraphbody).subscribe(data=>{this.varaint_GraphData=data //variant api call
        })
        const sliderGraphbody= { 
          "data_type":"slider_graph",
          "pid":selectedpiId,
          'timeChange':this.isTimeChange,
          "workingHours": this.workingHours.formDay+"-"+this.workingHours.toDay+" "+this.workingHours.shiftStartTime+":00-"+endTime+":00"
               }
        this.rest.getSliderVariantGraph(sliderGraphbody).subscribe(data=>{this.sliderVariant=data
        })

        setTimeout(() => {
          this.process_graph_list.data.forEach(e => {
          if(e.piId==selectedpiId){
            this.processGraphName=e.piName;
            }
          })
        // this.filterOverlay()

        }, 7000);

  }

  onchangegenerategraphId(selectedpiId){  // change process  graps in dropdown
    //this.spinner.show();
    this.isNodata=true;
    this.route.queryParams.subscribe(params => {
      let token = params['wpiId'];
      if (token) {
          let url=this.router.url.split('?')
          this.location.replaceState(url[0]+'?wpiId='+selectedpiId);
      }else{
        let url=this.router.url.split('?')
        this.location.replaceState(url[0]+'?piId='+selectedpiId);

      }
  });
  let endTime:any;
  if(this.workingHours.shiftEndTime=='23:59'){
    endTime="24:00"
  }else{
    endTime=this.workingHours.shiftEndTime
  }

    let piId=selectedpiId
    const variantListbody= { 
      "data_type":"varients_list", 
       "pid":selectedpiId,
       'timeChange':this.isTimeChange,
       "workingHours": this.workingHours.formDay+"-"+this.workingHours.toDay+" "+this.workingHours.shiftStartTime+":00-"+endTime+":00"
       } 
    this.rest.getAllVaraintList(variantListbody).subscribe(data=>{this.varaint_data=data // variant List call
      if(this.varaint_data.data){ 
      for(var i=0; i<this.varaint_data.data.length; i++){
          this.varaint_data.data[i].selected= "inactive";
      }
      localStorage.setItem("variants",btoa(JSON.stringify(this.varaint_data)));
      this.onchangeVaraint("0");
      }
      })
      const fullGraphbody= { 
        "data_type":"full_graph", 
         "pid":selectedpiId,
         'timeChange':this.isTimeChange,
       "workingHours": this.workingHours.formDay+"-"+this.workingHours.toDay+" "+this.workingHours.shiftStartTime+":00-"+endTime+":00"
         }
      this.rest.getfullGraph(fullGraphbody).subscribe(data=>{this.fullgraph=data //process graph full data call
        if(this.fullgraph.hasOwnProperty('display_msg')){
          // Swal.fire(
          //   'Oops!',
          //   'It is Not You it is Us, Please try again after some time',
          //   'error'
          // );
          this.spinner.show();
          this.model1=[];
          this.model2=[];
        } else{
          if(this.graphgenetaionInterval){
            clearInterval(this.graphgenetaionInterval);
          }
         let fullgraphOne=this.fullgraph.data;
          this.activity_list=fullgraphOne.allSelectData.nodeDataArraycase.slice(1,-1)
          this.fullgraph_model=fullgraphOne.allSelectData.nodeDataArraycase
          this.fullgraph_model1=this.fullgraph_model
        this.model1 = fullgraphOne.allSelectData.nodeDataArraycase;
        this.filterPerformData = this.fullgraph_model;
        this.nodeAlignment();       
        this.model2 = this.flowchartData(this.model1)
        this.startArray=[]
        this.endArray=[]
        let fullModel2=this.model2
        fullModel2.forEach(element => {
          if(element.from=="Start"){
            this.startArray.push(element.to)
          }
          if(element.to=="End"){
            this.endArray.push(element.from)
          }
        });
        
        this.linkCurvinessGenerate();
          this.spinner.hide();
        this.linkmodel2 = this.model2;
        this.isFullGraphBPMN = true;
        this.isSingleTraceBPMN = false;
        this.isMultiTraceBPMN = false;
        this.isSliderBPMN = false;
        this.filterOverlay()
    }
        },(err =>{
          this.spinner.hide();
        }));
        const variantGraphbody= { 
          "data_type":"variant_graph", 
          "pid":selectedpiId,
          "cases":[],
          'timeChange':true,
          "workingHours": this.workingHours.formDay+"-"+this.workingHours.toDay+" "+this.workingHours.shiftStartTime+":00-"+endTime+":00"
             }
        this.rest.getvaraintGraph(variantGraphbody).subscribe(data=>{this.varaint_GraphData=data //variant api call
        })
        const sliderGraphbody= { 
          "data_type":"slider_graph", 
           "pid":selectedpiId,
           'timeChange':this.isTimeChange,
          "workingHours": this.workingHours.formDay+"-"+this.workingHours.toDay+" "+this.workingHours.shiftStartTime+":00-"+endTime+":00"
               }
        this.rest.getSliderVariantGraph(sliderGraphbody).subscribe(data=>{this.sliderVariant=data
        })
        setTimeout(() => {
        // this.filterOverlay()
          
        }, 7000);
  }

  onchangeVaraint(datavariant) {      // Variant List sorting 
    switch (datavariant) {
      case "0":
        this.varaint_data.data.sort(function (a, b) {
          return b.casepercent - a.casepercent;
        });
        break;
      case "1":
        this.varaint_data.data.sort(function (a, b) {
          return a.casepercent - b.casepercent;
        });
        break;
      case "2":
        this.varaint_data.data.sort(function (a, b) {
          return a.days - b.days;
        });
        break;
      case "3":
        this.varaint_data.data.sort(function (a, b) {
          return b.days - a.days;
        });
        break;
    }
  }

  caseIdSelect(selectedData, index) { // Case selection on Variant list
    this.performanceValue=false
    this.activityValue=1;
    this.pathvalue=1;
    this.activity_value=[];
    this.isNodata=true;
    this.isplay = false;
    if (this.varaint_data.data[index].selected == "inactive") {
      var select = {
        case: selectedData.case,
        casepercent: selectedData.casepercent,
        name: selectedData.name,
        detail: selectedData.detail,
        days: selectedData.days,
        varaintDetails: selectedData.varaintDetails,
        casesCovred: selectedData.casesCovred,
        trace_number:selectedData.trace_number,
        case_value:selectedData.case_value,
        selected: "active"
      };
      this.isvaraintPlay=true;
      this.varaint_data.data[index] = select;
    } else {
      var select = {
        case: selectedData.case,
        casepercent: selectedData.casepercent,
        name: selectedData.name,
        detail: selectedData.detail,
        days: selectedData.days,
        varaintDetails: selectedData.varaintDetails,
        casesCovred: selectedData.casesCovred,
        trace_number:selectedData.trace_number,
        case_value:selectedData.case_value,
        selected: "inactive"
      };
      this.isvaraintPlay=false;
      this.varaint_data.data[index] = select;
    }

    this.selectedCaseArry = [];
    this.selectedTraceNumbers = [];
    for (var i = 0; i < this.varaint_data.data.length; i++) {
      if (this.varaint_data.data[i].selected == "active") {
        var casevalue = this.varaint_data.data[i].case
        this.selectedCaseArry.push(casevalue);
        this.selectedTraceNumbers.push(this.varaint_data.data[i].trace_number)
      }
    };
    this.caselength = this.selectedCaseArry.length;
    if(this.selectedCaseArry.length == 0){
      this.issliderDisabled=false;
      // this.options = Object.assign({}, this.options, {disabled: false});
        let fullgraphOne=this.fullgraph.data;
            this.model1 = fullgraphOne.allSelectData.nodeDataArraycase;
                // this.nodeAlignment();
            this.model2 = this.flowchartData(this.model1);
            // this.gradientApplyforLinks()
            // this.gradientApplyforNode()
                // this.linkCurvinessGenerate();
                // variant_playOne
                this.isvariantSelectedOne=false;
                this.spinMetrics0="";
                this.spinMetrics0="absoluteFrequency";

      /**
       * BPMN Boolean Variables
       */
      this.isFullGraphBPMN = true;
      this.isSingleTraceBPMN = false;
      this.isMultiTraceBPMN = false;
      this.isSliderBPMN = false;
      this.isWorkingHrsBtn=true;

    }else if (this.selectedCaseArry.length == 1) {
      this.isvariantSelectedOne=true;
      this.issliderDisabled=true;
      this.isDefaultData = false;
      // this.options = Object.assign({}, this.options, {disabled: true});
      if (this.keyExists(this.selectedCaseArry[0], this.varaint_GraphData.data) == true) {
        var modalData = this.varaint_GraphData.data[0][this.selectedCaseArry[0]] 
        this.model1 = modalData.nodeDataArraycase

        if(this.isPerformance==true){
          if(this.selectedPerformancevalue==5||this.selectedPerformancevalue==6||this.selectedPerformancevalue==7||this.selectedPerformancevalue==8||this.selectedPerformancevalue==9){
          var modelArray3=[]
            modelArray3=this.model1
                for(var i=1;i<modelArray3.length-1;i++){
                    modelArray3[i].count=this.timeConversion(modelArray3[i].toolCount[this.selectedPerformancevalue])
                  }
                this.model1=modelArray3
            }
                this.model2 = this.flowchartDataOne(this.model1,this.selectedPerformancevalue)
                
            }else{                
              this.model2 = this.flowchartData(this.model1)
            }
        // this.nodeAlignment();
        // this.gradientApplyforLinks()
        // this.gradientApplyforNode();
        // this.linkCurvinessGenerate();
      }

           /**
       * BPMN Boolean Variables
       */
      this.isFullGraphBPMN = false;
      this.isSingleTraceBPMN = true;
      this.isMultiTraceBPMN = false;
      this.isSliderBPMN = false;
      this.isWorkingHrsBtn=false;
    }else{
      this.issliderDisabled=true;
      // this.options = Object.assign({}, this.options, {disabled: true});
      this.isvariantSelectedOne=false;

      let endTime:any
      if(this.workingHours.shiftEndTime=='23:59'){
        endTime="24:00"
      }else{
        endTime=this.workingHours.shiftEndTime
      }
      this.loaderImgSrc = "/assets/images/PI/loader_anim.gif";
      this.spinner.show();
      const variantComboBody={
        "data_type":"variant_combo",
        "pid":this.graphIds,
        "cases" : this.selectedCaseArry,
        'timeChange':this.isTimeChange,
        "workingHours": this.workingHours.formDay+"-"+this.workingHours.toDay+" "+this.workingHours.shiftStartTime+":00-"+endTime+":00"
          }
    this.rest.getVariantGraphCombo(variantComboBody).subscribe(res=>{this.variantCombo=res
      this.model1=this.variantCombo.data[0].nodeDataArraycase;
      this.filterPerformData = this.variantCombo.data[0].nodeDataArraycase;
      // this.nodeAlignment();
      if(this.isPerformance==true){
        if(this.selectedPerformancevalue==5||this.selectedPerformancevalue==6||this.selectedPerformancevalue==7||this.selectedPerformancevalue==8||this.selectedPerformancevalue==9){
        
        var modelArray3=[]
          modelArray3=this.model1
              for(var i=1;i<modelArray3.length-1;i++){
                  modelArray3[i].count=this.timeConversion(modelArray3[i].toolCount[this.selectedPerformancevalue])
                }
              this.model1=modelArray3
        }
              this.model2 = this.flowchartDataOne(this.model1,this.selectedPerformancevalue)
          }else{                
            this.model2 = this.flowchartData(this.model1);
          }
          this.spinner.hide();

    })

         /**
       * BPMN Boolean Variables
       */
      this.isFullGraphBPMN = false;
      this.isSingleTraceBPMN = false;
      this.isMultiTraceBPMN = true;
      this.isSliderBPMN = false;
      this.isWorkingHrsBtn=false;
    }
    // console.log(this.varaint_data.data.length);
    
    if(this.selectedCaseArry.length ==this.varaint_data.data.length||this.selectedCaseArry.length==0){
      // this.checkboxValue = true
      this.options = Object.assign({}, this.options, {disabled: false});
    }else{
      // this.checkboxValue = false
      this.options = Object.assign({}, this.options, {disabled: true});
    }
	
	  if(this.selectedCaseArry.length ==this.varaint_data.data.length){
      this.checkboxValue = true
    }else{
      this.checkboxValue = false
    }
  }
  removeDuplicates(array) {
    return array.filter((a, b) => array.indexOf(a) === b)
   };
  keyExists(key, search) {
    var existingObj = search.find(function (element) {
      return typeof element[key] !== 'undefined';
    });
    if (existingObj[key]) {
      return true
    } else {
      return false
    }
  }
  compareJSON(obj1, obj2) {
    var ret = {};
    for (var i in obj2) {
      if (!obj1.hasOwnProperty(i) || obj2[i] !== obj1[i]) {
        ret[i] = obj2[i];
      }
    }
    return ret;
  };

  playAnimation() {   // Process graph animation
    this.isplay = !this.isplay
  }

  downloadSvg() { // Process graph download as SVG
    this.isdownloadsvg = true;
  }
  svgValueEmitted(isSvg){
    setTimeout(()=> {
      this.isdownloadsvg=isSvg;
    }, 1000);
  }
  downloadPdf(){ // Process graph download as PDF
    this.isdownloadpdf= true;
  }
  pdfValueEmitted(isPdf){
    setTimeout(()=> {
      this.isdownloadpdf=isPdf
    }, 1000);  
  }
  downloadjpeg(){   // Process graph download as JPEG
    this.isdownloadJpeg= true;
  }
  jpegValueEmitted(isJpeg){
    setTimeout(()=> {
      this.isdownloadJpeg=isJpeg
    }, 1000);  
  }  
  downloadpng(){  // Process graph download as PNG
    this.isdownloadPng= true;
  }
  pngValueEmitted(isPng){
    setTimeout(()=> {
      this.isdownloadPng=isPng
    }, 1000);  
  }
  selectAllVariants() {   // Select all variant list
    this.activity_value=[];
    this.activityValue=1;
    this.pathvalue=1;
    this.isNodata=true;
    this.isplay = false;
    this.options = Object.assign({}, this.options, {disabled: false});
    if (this.checkboxValue == true) {
      this.issliderDisabled=false;
      this.isvariantSelectedOne=false;
      for (var i = 0; i < this.varaint_data.data.length; i++) {
        this.varaint_data.data[i].selected = "active"
        // let fullgraphOne=this.fullgraph.data;
        // this.model1 = fullgraphOne.allSelectData.nodeDataArraycase;
        // this.nodeAlignment();
        // this.model2 = this.flowchartData(this.model1);
        // this.gradientApplyforLinks()
        // this.gradientApplyforNode();
        // this.linkCurvinessGenerate();
        this.isDefaultData = false;
      }
      let fullgraphOne=this.fullgraph.data;
      this.model1 = fullgraphOne.allSelectData.nodeDataArraycase;
      if(this.isPerformance==true){
      
        if(this.selectedPerformancevalue==5||this.selectedPerformancevalue==6||this.selectedPerformancevalue==7||this.selectedPerformancevalue==8||this.selectedPerformancevalue==9){
          var modelArray3=[]
          modelArray3=this.model1
          for(var i=1;i<modelArray3.length-1;i++){
            modelArray3[i].count=this.timeConversion(modelArray3[i].toolCount[this.selectedPerformancevalue])
            }
            this.model1=modelArray3
        }
            
            this.model2 = this.flowchartDataOne(this.model1,this.selectedPerformancevalue)
        }else{
          this.model2 = this.flowchartData(this.model1);
        }

           /**
       * BPMN Boolean Variables
       */
      this.isFullGraphBPMN = true;
      this.isSingleTraceBPMN = false;
      this.isMultiTraceBPMN = false;
      this.isSliderBPMN = false;
    } else {
      for (var i = 0; i < this.varaint_data.data.length; i++) {
        this.varaint_data.data[i].selected = "inactive";
      }
      this.isDefaultData = true;
      this.isWorkingHrsBtn=true;
    }
    this.performanceValue=false
  }
  flowchartData(dataArray) {
    this.linkData = [];
    this.linkdataArray = [];
    this.nodeArray = dataArray;
    //  var linkToolArray=[];
    for (var i = 1; i < this.nodeArray.length-1; i++) {
      var datalink = this.nodeArray[i].linkArray;
      var link=[]
      var linktool=[]
      var label = this.nodeArray[i].name;
      
      for(var j=0; j< datalink.length; j++){
        var obj = {};
        if ( this.nodeArray.some(e => e.name === datalink[j].linkNode)) {​​
          /* vendors contains the element we're looking for */
        
          // obj['from'] = this.getFromKey(label);
          // obj['to'] = this.getFromKey(datalink[j].linkNode);
          obj['from'] = label;
          obj['to'] =datalink[j].linkNode
          obj['text'] = datalink[j].toolCount[0];
          // highData
          obj['toolData']=datalink[j].tool
           obj['toolDataCount']=datalink[j].toolCount
           if(datalink[j].toolCount[0]>100){
            obj['highData']=true
           }

          this.linkdataArray.push(obj);
    }
  }
        if (this.nodeArray[i].tool.includes('Start Frequency')) {
          var obj = {};
          this.nodeArray[i].count = this.nodeArray[i].toolCount[0];
          if(this.nodeArray[i].toolCount[3]!=0){

          // obj['from'] = -1;
          // obj['to'] = this.getFromKey(this.nodeArray[i].name);
          obj['from'] = "Start";
          obj['to'] = this.nodeArray[i].name;
          obj['text'] = this.nodeArray[i].toolCount[3];
          obj["extraNode"] = 'true';
          obj["toolDataCount"]=this.nodeArray[i].toolCount;
          this.linkdataArray.push(obj);
          }
        }
        if (this.nodeArray[i].tool.includes('End Frequency')) {
          var obj = {};
          this.nodeArray[i].count = this.nodeArray[i].toolCount[0];
          if(this.nodeArray[i].toolCount[4]!=0){
          // obj['from'] = this.getFromKey(this.nodeArray[i].name);
          // obj['to'] = -2;
          obj['from'] = this.nodeArray[i].name;
          obj['to'] = "End";
          obj['text'] = this.nodeArray[i].toolCount[4];
          obj["toolDataCount"]=this.nodeArray[i].toolCount;
          obj["extraNode"] = 'true';
          this.linkdataArray.push(obj);
          }
        }
    }

    
    return this.linkdataArray;
  }

  getFromKey(name) {
    for (var i = 0; i < this.nodeArray.length; i++) {
      if (name == this.nodeArray[i].name) {
        return this.nodeArray[i].key;
      }
    }
  }

  onfrequency(){  // show or hide frequency metrics on spinner
    this.isfrequencymetrics= !this.isfrequencymetrics;
    this.isperformancemetrics=false;
  }
  onPerformance(){  // show or hide performance metrics on spinner
    this.isperformancemetrics= !this.isperformancemetrics;
    this.isfrequencymetrics=false;
  }
  spinnermetrics(){
    this.isedgespinner= !this.isedgespinner;
  }

  generateBpmn() {
    let categoryName = this.getPCategoryFromPID(this.graphIds)
    if (this.isFullGraphBPMN == true) {
      var reqObj = {
        pid: this.graphIds,
        pname: this.getPNameFromPID(this.graphIds)
      }
      this.rest.getFullGraphBPMN(reqObj)
        .subscribe((res:any) => {          
          if(res.data != null){
          this.router.navigate(['/pages/businessProcess/uploadProcessModel'],{queryParams: {isShowConformance: true,pid:this.graphIds,category:categoryName, processName:reqObj.pname}})
          } else{
            Swal.fire(
              'Oops!',
              'Failed to generate BPM Notation, Please try again later.',
              'error'
            );
          }
        },
        (err =>{
          Swal.fire(
            '',
            'Meaningful BPM notation cannot be derived from the 100% graph as this may result in duplication of activities, Please try generating BPM notation with the combination of cases under variants ',
            'info'
          );
        }))

    } else if (this.isSingleTraceBPMN == true) {
      var reqObj1 = {
        pid: this.graphIds,
        pname: this.getPNameFromPID(this.graphIds),
        traceNumber: this.selectedTraceNumbers[0]
      }
      this.rest.getSingleTraceBPMN(reqObj1)
        .subscribe((res:any) => {
          if(res.data != null){
            this.router.navigate(['/pages/businessProcess/uploadProcessModel'],{queryParams: {isShowConformance: true,pid:this.graphIds,category:categoryName, processName:reqObj1.pname}})
            } else{
              Swal.fire(
                'Oops!',
                'Failed to generate BPM Notation, Please try again later.',
                'error'
              );
            }
        },
        (err =>{
          Swal.fire(
            '',
            'Internal server error, Please try again later.',
            'error'
          );
        }))

    } else if (this.isMultiTraceBPMN == true) {
      var reqObj2 = {
        pid: this.graphIds,
        pname: this.getPNameFromPID(this.graphIds),
        traceNumberList: this.selectedTraceNumbers
      }
      this.rest.getMultiTraceBPMN(reqObj2)
        .subscribe((res:any) => {
          if(res.data != null){
            this.router.navigate(['/pages/businessProcess/uploadProcessModel'],{queryParams: {isShowConformance: true,pid:this.graphIds,category:categoryName, processName:reqObj2.pname}})
            } else{
              Swal.fire(
                'Oops!',
                'Failed to generate BPM Notation, Please try again later.',
                'error'
              );
            }
        },
        (err =>{
          Swal.fire(
            '',
            'Internal server error, Please try again later.',
            'error'
          );
        }))

    } else if (this.isSliderBPMN == true) {
      var reqObj3 = {
        pid: this.graphIds,
        pname: this.getPNameFromPID(this.graphIds),
        activitySlider: this.activityValue,
        pathSlider: this.pathvalue
      }
      this.rest.getSliderTraceBPMN(reqObj3)
        .subscribe((res:any) => {
          if(res.data != null){
            this.router.navigate(['/pages/businessProcess/uploadProcessModel'],{queryParams: {isShowConformance: true,pid:this.graphIds,category:categoryName, processName:reqObj3.pname}})
            } else{
              Swal.fire(
                'Oops!',
                'Failed to generate BPM Notation, Please try again later.',
                'error'
              );
            }
        },
        (err =>{
          Swal.fire(
            '',
            'Internal server error, Please try again later.',
            'error'
          );
        }))
    }
  } 
  

getPNameFromPID(pnumber){
  var piname = '';
  this.process_graph_list.data.forEach(pData => {
    if(pData.piId == pnumber){
      piname = pData.piName
    }
  });
  return piname;
}

getPCategoryFromPID(pnumber){
  var piCategory = '';
  this.process_graph_list.data.forEach(pData => {
    if(pData.piId == pnumber){
      piCategory = pData.categoryName
    }
  });
  return piCategory;
}


loopTrackBy(index, term){
  return index;
}
timeConversion(millisec) {
  var seconds:any = (millisec / 1000).toFixed(1);
  var minutes:any = (millisec / (1000 * 60)).toFixed(1);
  var hours:any = (millisec / (1000 * 60 * 60)).toFixed(1);
  var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);
  if (seconds < 60) {
      return seconds + " Sec";
  } else if (minutes < 60) {
      return minutes + " Min";
  } else if (hours < 24) {
      return hours + " Hrs";
  } else {
      return days + " Days"
  }
}

selectedMetric(selectedValue){    //metrics selection in spinner
  let index;
  switch(selectedValue){
    case "absoluteFrequency":
        index=0;
    break;
    case "caseFrequency":
        index=1;
    break;
    case "maxRepititons":
        index=2;
    break;
    case "startFrequency":
        index=3;
    break;
    case "endFrequency":
        index=4;
    break;
    case "totalDuration":
        index=5;
    break;
    case "medianDuration":
        index=6;
    break;
    case "meanDuration":
        index=7;
    break;
    case "maxDuration":
        index=8;
    break;
    case "minDuration":
        index=9;
    break;
  }
  if(index==2||index==5||index==6||index==7||index==8||index==9){
    this.performanceValue=true
  }else{
    this.performanceValue=false
  }
  var modelArray3=[]
  modelArray3=this.model1
  for(var i=1;i<modelArray3.length-1;i++){
    if(index==5||index==6||index==7||index==8||index==9){
      modelArray3[i].count=this.timeConversion(modelArray3[i].toolCount[index])
      this.isPerformance=true
      // this.model1=modelArray3
      // this.model1[i].days=this.timeConversionDays(this.model1[i].toolCount[index])
    }else{
      this.isPerformance=false;
      modelArray3[i].count=modelArray3[i].toolCount[index]
    }
  }

  if(index==1||index==2||index==5||index==6||index==7||index==8||index==9){
    this.isPerformance=true
  }else{
    this.isPerformance=false;
  }
  
  this.selectedPerformancevalue=index
  this.model1=modelArray3

  // if(index==2){
  //   for(var i=1;i<this.model1.length-1;i++){
  //       this.model1[i].days=this.model1[i].toolCount[index]
  //     }
  // }
  this.model2 = this.flowchartDataOne(this.model1,index)
  // if(index==2||index==5||index==6||index==7||index==8||index==9){
  //   this.gradientApplyforLinksOne();
  //   this.gradientApplyforNodeOne();
    
  // }else{
  //   this.gradientApplyforLinks()
  //   this.gradientApplyforNode()
  // }
  // // this.gradientApplyforNode();
  // this.linkCurvinessGenerate();
}

flowchartDataOne(dataArray,index) {
  
  this.linkData = [];
  this.linkdataArray = [];
  this.nodeArray = dataArray;
  //  var linkToolArray=[];
  for (var i = 1; i < this.nodeArray.length-1; i++) {
    var datalink = this.nodeArray[i].linkArray;
    // console.log("dayalink",datalink);
    
    var link=[]
    var linktool=[]
    var label = this.nodeArray[i].name;
    
    for(var j=0; j< datalink.length; j++){
      var obj = {};
        // obj['from'] = this.getFromKey(label);
        // obj['to'] = this.getFromKey(datalink[j].linkNode);
        obj['from'] = label;
        obj['to'] = datalink[j].linkNode;
        if(index==5||index==6||index==7||index==8||index==9){
          obj['text'] = this.timeConversion(datalink[j].toolCount[index]);
          obj['days'] = Number(this.timeConversionDays(datalink[j].toolCount[index]));
        }else{
          obj['text'] = datalink[j].toolCount[index];
          // obj['days'] = datalink[j].toolCount[index];
          // if(datalink[j].toolCount[index]>100){
          //   obj['highData']=true
          // }
        }
        obj['toolData']=datalink[j].tool
         obj['toolDataCount']=datalink[j].toolCount

        this.linkdataArray.push(obj);
  }
      if (this.nodeArray[i].tool.includes('Start Frequency')) {
        var obj = {};
        if(this.nodeArray[i].toolCount[3]!=0){
          // obj['from'] = -1;
          // obj['to'] = this.getFromKey(this.nodeArray[i].name);
          obj['from'] = "Start";
          obj['to'] = this.nodeArray[i].name;
          if(index==0||index==1){
          obj['text'] = this.nodeArray[i].toolCount[3];
          }
          // else{
          //   obj['text'] = null;
          // }
          // obj["extraNode"] = 'true';
          obj["toolDataCount"]=this.nodeArray[i].toolCount;
          if(index==5||index==6||index==7||index==8||index==9){
          obj['days'] = 0;
          }
          this.linkdataArray.push(obj);
        }
        

      }
      if (this.nodeArray[i].tool.includes('End Frequency')) {
        var obj = {};
        
        if(this.nodeArray[i].toolCount[4]!=0){
          // obj['from'] = this.getFromKey(this.nodeArray[i].name);
          // obj['to'] = -2;
          obj['from'] = this.nodeArray[i].name;
          obj['to'] = "End";
          if(index==0||index==1){
          obj['text'] = this.nodeArray[i].toolCount[4]
          }
          obj["toolDataCount"]=this.nodeArray[i].toolCount;
          // obj["extraNode"] = 'true';
          if(index==5||index==6||index==7||index==8||index==9){
          obj['days'] = 0;
          }
        this.linkdataArray.push(obj);
        }        
      }
  }
  return this.linkdataArray;
}
openVariantListNav(){   //variant list open
  document.getElementById("mySidenav").style.width = "310px";
  document.getElementById("main").style.marginRight = "310px";
  this.isvariantListOpen=false;
  }
closeNav() { // Variant list Close
  document.getElementById("mySidenav").style.width = "0px";
  document.getElementById("main").style.marginRight= "0px";
  this.isvariantListOpen=true;
  }
  resetspinnermetrics(){        //process graph reset in leftside  spinner metrics
    this.resetFilter=true;
    this.isClearFilter=true;
    this.checkboxValue=false;
    this.model1 = this.fullgraph_model;
    this.filterPerformData = this.fullgraph_model;
    // this.nodeAlignment();
    this.model2 = this.flowchartData(this.model1)
    // end points update in filter overlay
    this.isFilterApplied=true;
    this.startArray=[];
    this.endArray=[];
    let fullModel2=this.model2
    fullModel2.forEach(element => {
      if(element.from=="Start"){
        this.startArray.push(element.to)
      }
      if(element.to=="End"){
        this.endArray.push(element.from)
      }
    });

    this.spinMetrics0="";
    this.spinMetrics0="absoluteFrequency";
    this.activityValue=1;
    this.pathvalue=1;
    for (var i = 0; i < this.varaint_data.data.length; i++) {
      this.varaint_data.data[i].selected = "inactive";
    }
    this.isPerformance=false;
    // console.log("rest",this.model1);

         /**
       * BPMN Boolean Variables
       */
      this.isFullGraphBPMN = true;
      this.isSingleTraceBPMN = false;
      this.isMultiTraceBPMN = false;
      this.isSliderBPMN = false;
      this.performanceValue=false;
      this.options = Object.assign({}, this.options, {disabled: false});
      this.isWorkingHrsBtn=true;
  }

  resetActivityFiltermetrics(){        //process graph reset in leftside  spinner metrics
    this.resetFilter=true;
    this.model1 = this.filterPerformData;
    this.nodeAlignment();
    this.model2 = this.flowchartData(this.model1)
    this.linkCurvinessGenerate();
    this.spinMetrics0="";
    this.spinMetrics0="absoluteFrequency";
         /**
       * BPMN Boolean Variables
       */
      this.isFullGraphBPMN = false;
      this.isSingleTraceBPMN = false;
      this.isMultiTraceBPMN = true;
      this.isSliderBPMN = false;
    
  }
  caseParcent(parcent){       // case persent value in variant list
  
    if(String(parcent).indexOf('.') != -1){
    let perc=parcent.toString().split('.')
  // return parcent.toString().slice(0,5);
  return perc[0]+'.'+perc[1].slice(0,2);
    }else{
      return parcent;
    }
  }

  nodeAlignment(){      //add location to nodes in process graph
    let loction=''
    for(var i=0;i<this.model1.length;i++){
      if(this.model1[i].key==-1||this.model1[i].key==-2){
        let loc1=440
      let loc2=-150+i*80
      loction=loc1+' '+loc2;
      this.model1[i].loc=loction
      }else{
      let loc1=455
      let loc2=-150+i*80
      loction=loc1+' '+loc2;
      this.model1[i].loc=loction
      }
    }
  }

  linkCurvinessGenerate(){          //generate Curviness for links between nodes in graph
    for(var j=0;j<this.model2.length;j++){
      if(j==0 && this.model2[j].to>1){
        let loc3=200
      this.model2[j].curviness=loc3
      }else{
        if(this.model2[j].from ==-1||this.model2[j].from==-2){
          if(this.model2[j].from==-1 && this.model2[j].to==0){
            let loc3=0
            this.model2[j].curviness=loc3
          }else{
          let loc3=-25*j
        this.model2[j].curviness=loc3
        }
        }else if(this.model2[j].to ==-1||this.model2[j].to==-2){
          if(this.model2[j].from==this.model1.length-3 && this.model2[j].to==-2){
            let loc3=0
            this.model2[j].curviness=loc3
          }
          else{
            let loc3=20*j
            this.model2[j].curviness=loc3
          }
      }else if(this.model2[j].from+1==this.model2[j].to){
        let loc3=0
        this.model2[j].curviness=loc3
      }else if(this.model2[j].from==0&&this.model2[j].to>2){
        let loc3=160
        this.model2[j].curviness=loc3
      }else if(j<4){
        let loc3=170
        this.model2[j].curviness=loc3
      }else{
          let loc3=30*j
        this.model2[j].curviness=loc3
        }
    }
  }
  }
  
  onchangeActivity(value){ //change activity slider  value
    this.isClearFilter=true;
    this.sliderGraphResponse(this.sliderVariant,this.activityValue,this.pathvalue)
  }
  onChangePath(value){      //change path slider  value
    this.sliderGraphResponse(this.sliderVariant,this.activityValue,this.pathvalue)
    this.isClearFilter=true;
  }
                                
sliderGraphResponse(graphData,activity_slider,path_slider) {      //based on activity and path value filter the graph values
    // end points update in filter overlay
  let modelA2 = this.flowchartData(this.fullgraph_model)
  // end points update in filter overlay
  this.isFilterApplied=true;
  this.startArray=[];
  this.endArray=[];
  let fullModel2=modelA2
  fullModel2.forEach(element => {
    if(element.from=="Start"){
      this.startArray.push(element.to)
    }
    if(element.to=="End"){
      this.endArray.push(element.from)
    }
  });

  this.activity_value=[];
  this.performanceValue=false;
  if(activity_slider==1&&path_slider==1){
    this.isWorkingHrsBtn=true;
    this.isNodata=true;
    this.model1=this.fullgraph_model;
    this.filterPerformData = this.fullgraph_model;

    if(this.isPerformance==true){
      
        if(this.selectedPerformancevalue==5||this.selectedPerformancevalue==6||this.selectedPerformancevalue==7||this.selectedPerformancevalue==8||this.selectedPerformancevalue==9){
          var modelArray3=[]
          modelArray3=this.model1
          for(var i=1;i<modelArray3.length-1;i++){
            modelArray3[i].count=this.timeConversion(modelArray3[i].toolCount[this.selectedPerformancevalue])
            }
            this.model1=modelArray3
        }
            
            this.model2 = this.flowchartDataOne(this.model1,this.selectedPerformancevalue)
        }else{ 
        // this.nodeAlignment()
        this.model2 = this.flowchartData(this.model1);
        }

    // this.gradientApplyforLinks()
    // this.gradientApplyforNode()
    // this.linkCurvinessGenerate();

         /**
       * BPMN Boolean Variables
       */
      this.isFullGraphBPMN = true;
      this.isSingleTraceBPMN = false;
      this.isMultiTraceBPMN = false;
      this.isSliderBPMN = false;
  }else{
    this.isWorkingHrsBtn=false;
  var sliderGraphArray = [];
    graphData.data.allSelectData.nodeDataArraycase.filter(function (item) {
      if (activity_slider == item.ActivitySlider && path_slider == item.PathSlider) {
          sliderGraphArray.push(item);
      }
  });
  
  this.sliderGraphData=sliderGraphArray;
  this.isNodata=true;
    var obj={"key": -1,"category": "Start","count": 80,"extraNode":'true'}
    var obj1={"key": -2,"category": "End","count": 80,"extraNode":'true'}
    var modelOne=[]
    modelOne[0]=obj
        for(var i=0;i<sliderGraphArray.length;i++){
            modelOne.push(sliderGraphArray[i]);
        }
    modelOne.push(obj1)
    this.model1=modelOne;
    if(this.isPerformance==true){
      if(this.selectedPerformancevalue==5||this.selectedPerformancevalue==6||this.selectedPerformancevalue==7||this.selectedPerformancevalue==8||this.selectedPerformancevalue==9){
      var modelArray3=[]
        modelArray3=this.model1
            for(var i=1;i<modelArray3.length-1;i++){
                modelArray3[i].count=this.timeConversion(modelArray3[i].toolCount[this.selectedPerformancevalue])
              }
            this.model1=modelArray3
      }
            this.model2 = this.flowchartDataOne(this.model1,this.selectedPerformancevalue)
        }else{ 
          // this.nodeAlignment()
          this.model2 = this.flowchartData(this.model1);
        }
    this.linkCurvinessGenerate();
         /**
       * BPMN Boolean Variables
       */
      this.isFullGraphBPMN = false;
      this.isSingleTraceBPMN = false;
      this.isMultiTraceBPMN = false;
      this.isSliderBPMN = true;
      }
    }

  readselectedNodes(SelectedActivities){
 
    if(SelectedActivities.length==0){
      this.resetActivityFiltermetrics();
     
    }else{
      this.filterByActivity(SelectedActivities)
    }
  }
  filterByActivity(SelectedActivities){   // filter process graph based on selected Activity (Node)
    this.spinner.show();
    this.activity_value=SelectedActivities;
    this.model1=[]
    this.model2=[]
    var totalarrayList = [];
    this.isNodata=true;
    var reqObj = {};
    if (this.selectedCaseArry && this.selectedCaseArry.length !=0) {
      reqObj = {
        "data_type": "activity_filter",
        "pid": this.graphIds,
        "cases": this.selectedCaseArry,
        "activities": SelectedActivities
      }
    } else {
      for(var i=0; i<this.varaint_data.data.length; i++){
        totalarrayList.push(this.varaint_data.data[i].case);
    }
      reqObj= {
        "data_type": "activity_filter",
        "pid": this.graphIds,
        "cases": totalarrayList,
        "activities": SelectedActivities
      }
    }
    this.rest.getVariantActivityFilter(reqObj)
      .subscribe(data => {
        let activityFilterGraph:any = data;
        this.model1 = activityFilterGraph.data[0].nodeDataArraycase;
        this.nodeAlignment();       
        this.model2 = this.flowchartData(this.model1);
        
        this.linkCurvinessGenerate();
        this.spinner.hide();
      },(err =>{
        this.spinner.hide();
      }));
    // var model3=[]
    // model3[0]=this.fullgraph_model[0]
    // for(var i=0;i<this.activity_value.length;i++){
    //   for(var j=0;j<this.fullgraph_model.length;j++){
        
    //     if(this.activity_value[i]==this.fullgraph_model[j].name){
    //       model3.push(this.fullgraph_model[j])
    //     }
    //   }
    // }
    // model3.push(this.fullgraph_model[this.fullgraph_model.length-1])
    // this.model1=model3
    // this.nodeAlignment();
    // this.model2 = this.flowchartData(this.model1);
    // this.gradientApplyforLinks()
    // this.gradientApplyforNode()
    // this.linkCurvinessGenerateOne();
    // this.isActivity_dropdwn=false;
  }
  linkCurvinessGenerateOne(){
    for(var j=0;j<this.model2.length;j++){
      if(j==0){
        let loc3=140
        this.model2[j].curviness=loc3
      }else{
      let loc3=25*j
        this.model2[j].curviness=loc3
      }
    }
  }

  cancel(){
    this.isActivity_dropdwn=false;
  }
  cancelByEndpoints(){
    this.startPoint=false;
    this.endPoint=false;
    this.isEndpoint_dropdwn=false;
  }
  closePopup(){   // close filter overlay
      var modal = document.getElementById('filterModal');
      modal.style.display="none";
    }

  onChangeTimeType(){
  if (this.performanceValue2=="minutes") {
    this.timeRangeArray=['0-100',"100-1000","1000-10000","10000 above"]
  } else if (this.performanceValue2=="hours") {
    this.timeRangeArray=['0-100',"100-500","500-1000","1000 above"]
  } else if (this.performanceValue2=="days") {
    this.timeRangeArray=['0-10',"10-100","100-200","200 above"]
  }
  }
  filterByPerformance(){
    let index;
    switch(this.performanceValue1){
      case "totalDuration":
          index=5;
      break;
      case "medianDuration":
          index=6;
      break;
      case "meanDuration":
          index=7;
      break;
      case "maxDuration":
          index=8;
      break;
      case "minDuration":
          index=9;
      break;
    }
    for(var i=1;i<this.model1.length-1;i++){
      if(index==5||index==6||index==7||index==8||index==9){
        this.model1[i].count=this.timeConversionOne(this.model1[i].toolCount[index])
      }
    }
    this.model2 = this.flowchartDataTwo(this.model1,index)
    this.linkCurvinessGenerate();
  }
  flowchartDataTwo(dataArray,index) {
    this.linkData = [];
    this.linkdataArray = [];
    this.nodeArray = dataArray;
    //  var linkToolArray=[];
    for (var i = 1; i < this.nodeArray.length-1; i++) {
      var datalink = this.nodeArray[i].linkArray;
      var link=[]
      var linktool=[]
      var label = this.nodeArray[i].name;
      
      for(var j=0; j< datalink.length; j++){
        var obj = {};
          obj['from'] = this.getFromKey(label);
          obj['to'] = this.getFromKey(datalink[j].linkNode);
          if(index==5||index==6||index==7||index==8||index==9){
            obj['text'] = this.timeConversionOne(datalink[j].toolCount[index]);
          }else{
            obj['text'] = datalink[j].toolCount[index];
            if(datalink[j].toolCount[index]>100){
              obj['highData']=true
            }
          }
          obj['toolData']=datalink[j].tool
           obj['toolDataCount']=datalink[j].toolCount
          this.linkdataArray.push(obj);
    }
        if (this.nodeArray[i].tool.includes('Start Frequency')) {
          var obj = {};
          if(this.nodeArray[i].toolCount[3]!=0){
            obj['from'] = -1;
            obj['to'] = this.getFromKey(this.nodeArray[i].name);
            obj["extraNode"] = 'true';
            this.linkdataArray.push(obj);
          }  
        }
        if (this.nodeArray[i].tool.includes('End Frequency')) {
          var obj = {};
          if(this.nodeArray[i].toolCount[4]!=0){
            obj['from'] = this.getFromKey(this.nodeArray[i].name);
            obj['to'] = -2;
            obj["extraNode"] = 'true';
          this.linkdataArray.push(obj);
          }
        }
    }
    return this.linkdataArray;
  }
  timeConversionOne(millisec) {   //Node and edge metrics values convert to time
    var seconds:any = (millisec / 1000).toFixed(1);
    var minutes:any = (millisec / (1000 * 60)).toFixed(1);
    var hours:any = (millisec / (1000 * 60 * 60)).toFixed(1);
    var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);
    if (this.performanceValue2=="minutes") {
        return minutes + " Min";
    } else if (this.performanceValue2=="hours") {
        return hours + " Hrs";
    } else if (this.performanceValue2=="days") {
        return days + " Days"
    }
  }
  
timeConversionDays(millisec) { 
  var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(4);
      return days
}


filterOverlay(){  
  this.dataValues = [];
  let vv = this.filterPerformData;
  
    //Filter overlay open on filter icon click
  for(var i=1;i<vv.length-1;i++){
    this.dataValues.push(vv[i])
    }
    
    // localStorage.setItem("datavalues",this.dataValues)
  this.isFilterComponent=true;
  // var modal = document.getElementById('myModal');
  // modal.style.display="block";
  // var toolTipDIV = document.getElementById('toolTipDIV');
  //   toolTipDIV.style.display = "none";
  }

  readOverlayValue(value){  //Filter overlay close on cross button click
    if(value==true){
      this.closePopup();
    }
  }
  readSelectedFilterValues(object){
    this.isFilterApplied=true;
    if(object.startPoint==null && object.endPoint==null && object.activity==null && object.variants.length==this.varaint_data.data.length){
      this.isWorkingHrsBtn=true;
      this.model1 = this.fullgraph_model;
      this.model2 = this.flowchartData(this.model1); 
            this.startArray=[];
            this.endArray=[];
            let fullModel2=this.model2
            fullModel2.forEach(element => {
              if(element.from=="Start"){
                this.startArray.push(element.to)
              }
              if(element.to=="End"){
                this.endArray.push(element.from)
              }
            });
    }else{
        this.isWorkingHrsBtn=false;
        let endTime:any
        if(this.workingHours.shiftEndTime=='23:59'){
          endTime="24:00"
        }else{
          endTime=this.workingHours.shiftEndTime
        }
        this.loaderImgSrc = "/assets/images/PI/loader_anim.gif";
        this.spinner.show();

          var reqObj={
            "data_type":"endpoint_activity_filter",
            "pid":this.graphIds,
            "cases" :object.variants,
            "startpoints":object.startPoint,
            "Endpoints":object.endPoint,
            "activities" : object.activity,
            'timeChange':this.isTimeChange,
          "workingHours": this.workingHours.formDay+"-"+this.workingHours.toDay+" "+this.workingHours.shiftStartTime+":00-"+endTime+":00"
            }
          this.rest.getVariantGraphCombo(reqObj).subscribe(res => {
          this.variantCombo = res
            this.model1 = this.variantCombo.data[0].nodeDataArraycase;
            this.filterPerformData = this.variantCombo.data[0].nodeDataArraycase;
            this.nodeAlignment();
            this.model2 = this.flowchartData(this.model1);
            this.startArray=[];
            this.endArray=[];
            let fullModel2=this.model2;
            this.getselectedVariantList(object.variants);
            fullModel2.forEach(element => {
              if(element.from=="Start"){
                this.startArray.push(element.to)
              }
              if(element.to=="End"){
                this.endArray.push(element.from)
              }
            });
          this.spinner.hide();
      })
    }
  }


  readselectedEndpoint(selectedEndPoints){
    let modelArray2=this.linkmodel2
    if(selectedEndPoints.length==0){
      modelArray2.forEach(element => {
        if(element.to==-2){
          this.linkArraymodel.push(element)
        }
      });
    }else{  
    modelArray2.forEach(element => {
      for(var j=0;j<selectedEndPoints.length;j++){
        if(element.from==this.getFromKeyOne(selectedEndPoints[j])&& element.to==-2){
          this.linkArraymodel.push(element)
        }
      }
    });
  }
    this.model2=this.linkArraymodel
      this.linkCurvinessGenerate(); 
  }

  getFromKeyOne(name) {
    for (var i = 0; i < this.nodeArray.length; i++) {
      if (name == this.nodeArray[i].name) {
        return this.nodeArray[i].key;
      }
    }
  }

  getselectedVariantList(e?) {
    let filtered_Variants = [];
    let decryptedVariants: any = {};
    if (e.length == 0) {
      var varint = localStorage.getItem("variants");
      if (varint != null) {
        decryptedVariants = JSON.parse(atob(varint));
      }
      decryptedVariants.data.forEach(original_variant => {
        filtered_Variants.push(original_variant);
      });
      this.varaint_data.data = filtered_Variants;
      for (var i = 0; i < this.varaint_data.data.length; i++) {
        this.varaint_data.data[i].selected = "inactive";
      }
      // this.resetspinnermetrics();
      this.spinMetrics0="absoluteFrequency";
      var seletedVariant1=[];
      var reqObj={}
      for (var i = 0; i < this.varaint_data.data.length; i++){
              seletedVariant1.push(this.varaint_data.data[i].name)
          }
          reqObj= {
            "data_type": "activity_filter",
            "pid": this.graphIds,
            "cases": seletedVariant1,
            "activities": this.filterdNodes
            }

    } else {
      reqObj = {
        "data_type": "activity_filter",
        "pid": this.graphIds,
        "cases": e,
        "activities": this.filterdNodes
      }

      var varint = localStorage.getItem("variants");
      if (varint != null) {
        decryptedVariants = JSON.parse(atob(varint));
      }
      e.forEach(selected_variant => {
        decryptedVariants.data.forEach(original_variant => {
          if (selected_variant == original_variant.case) {
              filtered_Variants.push(original_variant);
          }
        });
      });
      this.varaint_data.data = filtered_Variants;
     let totalVariantSum = this.getVariantCasePercentage(this.varaint_data.data);
      for (var i = 0; i < this.varaint_data.data.length; i++) {
      this.varaint_data.data[i].casepercent = ((this.varaint_data.data[i].case_value/totalVariantSum)*100).toFixed(2);
      if(decryptedVariants.data.length == filtered_Variants.length){
        this.varaint_data.data[i].selected = "inactive";
      } else { 
      this.varaint_data.data[i].selected = "active";
      }
      }
    }
      // this.rest.getVariantGraphCombo(reqObj).subscribe(res => {
      // this.variantCombo = res
      //   this.model1 = this.variantCombo.data[0].nodeDataArraycase;
      //   this.filterPerformData = this.variantCombo.data[0].nodeDataArraycase;
      //   this.nodeAlignment();
      //   this.model2 = this.flowchartData(this.model1);
      //   this.linkCurvinessGenerate();
      // })

      /**
    * BPMN Boolean Variables
    */
      this.isFullGraphBPMN = false;
      this.isSingleTraceBPMN = false;
      this.isMultiTraceBPMN = true;
      this.isSliderBPMN = false;
    
  }

  getVariantCasePercentage(varia_list){
    var calculatePercent = 0;
    var variant_percent = 0;
    for(var i=0;i<varia_list.length;i++){
      calculatePercent += varia_list[i].case_value;
    }

    return calculatePercent;
  }

  ngOnDestroy(){
    if(this.graphgenetaionInterval){
      clearInterval(this.graphgenetaionInterval);
    }
  }

  viewInsights(){
    //var token=localStorage.getItem('accessToken');
    //window.location.href="http://localhost:8080/camunda/app/welcome/424d2067/#!/login?accessToken="+token+"&userID=karthik.peddinti@epsoftinc.com&tenentID=424d2067-41dc-44c1-b9a3-221efda06681"
    this.router.navigate(["/pages/processIntelligence/insights"],{queryParams:{wpid:this.graphIds}})
  }
  readselectedNodes1(activies){    
    this.filterdNodes=[]
    this.filterdNodes=activies
    this.isClearFilter=false;
       
  }
  openHersOverLay(){
    this.isAddHrs=!this.isAddHrs
}

addWorkingHours(){  
  let _self = this;
  if(this.workingHours.formDay=='Mon' && this.workingHours.toDay=='Sun'&& this.workingHours.shiftStartTime=='00:00' && this.workingHours.shiftEndTime=='23:59'){
    this.isTimeChange=false;
  }else{
    this.isTimeChange=true;
  }

    let endTime:any;
  if(this.workingHours.shiftEndTime=='23:59'){
    endTime="24:00"
  }else{
    endTime=this.workingHours.shiftEndTime
  }
  this.loaderImgSrc = "/assets/images/PI/loader_anim.gif";
  this.spinner.show();
  const fullGraphbody= { 
    "data_type":"full_graph", 
     "pid":this.graphIds,
     'timeChange':this.isTimeChange,
   "workingHours": this.workingHours.formDay+"-"+this.workingHours.toDay+" "+this.workingHours.shiftStartTime+":00-"+endTime+":00"
     }
  this.rest.getfullGraph(fullGraphbody).subscribe(data=>{this.fullgraph=data //process graph full data call
    if(this.fullgraph.hasOwnProperty('display_msg')){
        // Swal.fire(
        //   'Oops!',
        //   'It is Not You it is Us, Please try again after some time',
        //   'error'
        // );
        Swal.fire({
          title: 'Oops!',
          text: "It is Not You it is Us, Please try again after some time",
          icon: 'error',
          showCancelButton: false,
          confirmButtonColor: '#007bff',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Okay'
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              position: 'center',
              icon: 'info',
              title: 'Please wait, Redirecting to workspace',
              showConfirmButton: false,
              timer: 1500
            })
            setTimeout(() => {
              _self.router.navigate(['pages/processIntelligence/upload'])
            }, 1500);
          }
        })
        this.spinner.hide();
        this.model1=[];
        this.model2=[];
    } else{
        let fullgraphOne=this.fullgraph.data;
        this.activity_list=fullgraphOne.allSelectData.nodeDataArraycase.slice(1,-1)
        this.fullgraph_model=fullgraphOne.allSelectData.nodeDataArraycase
        this.fullgraph_model1=this.fullgraph_model
        this.model1 = fullgraphOne.allSelectData.nodeDataArraycase;
        this.filterPerformData = this.fullgraph_model;
        this.nodeAlignment();       
        this.model2 = this.flowchartData(this.model1)
        let fullModel2=this.model2
        this.startArray=[]
        this.endArray=[]
        fullModel2.forEach(element => {
            if(element.from=="Start"){
              this.startArray.push(element.to)
            }
            if(element.to=="End"){
              this.endArray.push(element.from)
            }
          });
          this.linkCurvinessGenerate();
          this.spinner.hide();
          this.linkmodel2 = this.model2;
          this.isFullGraphBPMN = true;
          this.isSingleTraceBPMN = false;
          this.isMultiTraceBPMN = false;
          this.isSliderBPMN = false;
          this.filterOverlay()
      }
    },(err =>{
      this.spinner.hide();
    }));
    const variantGraphbody= { 
      "data_type":"variant_graph", 
      "pid":this.graphIds,
      'timeChange':this.isTimeChange,
      "cases":[],
      "workingHours": this.workingHours.formDay+"-"+this.workingHours.toDay+" "+this.workingHours.shiftStartTime+":00-"+endTime+":00"
         }
    this.rest.getvaraintGraph(variantGraphbody).subscribe(data=>{this.varaint_GraphData=data //variant api call
    })
  this.canceladdHrs();
}

resetWorkingHours(){    
  this.workingHours.formDay = "Mon";
  this.workingHours.toDay = "Sun";
  this.workingHours.shiftStartTime="00:00";
  this.workingHours.shiftEndTime="23:59"
}
canceladdHrs(){
  this.isAddHrs=!this.isAddHrs;
}
redirectToWorkspace(){
  let timerInterval
Swal.fire({
  title: 'Auto close alert!',
  html: 'I will close in <b></b> milliseconds.',
  timer: 2000,
  timerProgressBar: true,
}).then((result) => {
  /* Read more about handling dismissals below */
  if (result.dismiss === Swal.DismissReason.timer) {
    console.log('I was closed by the timer')
  }
})
}
 
}
