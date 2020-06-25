import { Component, OnInit, AfterViewInit } from '@angular/core';
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
  public select_varaint: any = 0;
  public model1;
  public model2;
  // public mymodel= this.pgModel.testdata[0].nodeDataArraycase1;
  public data = (this.pgModel.data);
  public reports = this.pgModel.reports;
  public filterLength: number;
  public dataValues: any[];
  public varaint_data: any=[];
  public rangevalue: any;
  pathvalue: number = 0;
  public isplay: boolean = false;
  isselected: number;
  activityValue: number = 0;
  public checkboxValue: boolean = false;
  public selectedCaseArry: any[];
  public isfrequency: boolean = false;
  public caselength: number;
  public isdownload: boolean = false;
  public isDefaultData: boolean = true;
  public nodeArray: any[];
  public linkdata: any;
  public arrayLink: any;
  linkData = [];
  linkdataArray = [];
  public nestedArray:any[]=[];
  options: Options = {
    floor: 0,
    ceil: 100,
    translate: (value: number): string => `${value}%`,
    hideLimitLabels: false,
    hidePointerLabels: true,
    vertical: true,
  }
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
  linkToolTip:boolean;

  
  constructor(private dt: DataTransferService,
    private router: Router,
    private bpmnservice: SharebpmndiagramService,
    private pgModel: ProcessGraphModel,
    private hints: PiHints,
    private spinner: NgxSpinnerService,
    private rest:RestApiService,
    private route:ActivatedRoute) {
  }

  readOutputValueEmitted(val){
    this.startLinkvalue = val;
  }

  ngOnInit() {
    this.spinner.show();

    // this.model1 = this.pgModel.defaultmodel.nodeDataArraycase;
    // this.model2 = this.pgModel.defaultmodel.linkarraycase;
    this.dt.changeParentModule({ "route": "/pages/processIntelligence/upload", "title": "Process Intelligence" });
    this.dt.changeChildModule({ "route": "/pages/processIntelligence/flowChart", "title": "Process Graph" });
    this.dt.changeHints(this.hints.processGraphHints);
    // this.varaint_data = this.data;
    this.process_graph_options = ProcessGraphList;
    // this.process_graph_list = Object.keys(ProcessGraphList).filter(val => isNaN(ProcessGraphList[val]));
    this.variant_list_options = VariantList;
    this.variant_list = Object.keys(VariantList).filter(val => isNaN(VariantList[val]));
    this.getAlluserProcessPiIds();
    
    // var piId=localStorage.getItem('piId')
    var piId;
    // this.rest.getfullGraph(piId).subscribe(data=>{this.fullgraph=data
    //   let fullgraphOne=JSON.parse(this.fullgraph.data);
    //   this.model1 = fullgraphOne.allSelectData.nodeDataArraycase
    //   console.log('this.model1',this.model1);
    //   this.model2 = this.flowchartData(this.model1)
    //   let loction=''
    //   for(var i=0;i<this.model1.length;i++){
    //     let loc1=455
    //     let loc2=Math.floor((Math.random()*100))*j
    //     loction=loc1+' '+loc2;
    //     this.model1[i].loc=loction
    //   }
      
     
    //   for(var j=0;j<this.model2.length;j++){
    //     let loc1=-Math.floor((Math.random()*10))
    //     // let loc2=-150+i*70
    //     // loction=loc1+' '+loc2;
    //     this.model2[j].curviness=loc1
    //   }
      
    // })
    this.route.queryParams.subscribe(params => {
      if(params['wpiId']!=undefined){
        this.wpiIdNumber = parseInt(params['wpiId']);
        piId=this.wpiIdNumber;
        this.graphIds = piId;
        setTimeout(() => {
          this.onchangegraphId(piId);
      }, 500);
      }
      if(params['piId']!=undefined){
        this.piIdNumber = parseInt(params['piId']);
        piId=this.piIdNumber;
        this.graphIds = piId;
        setTimeout(() => {
          this.onchangegraphId(piId);
        }, 6*60*1000); //3*60*1000
      }
    });
    
  //   setTimeout(() => {
  //     this.onchangegraphId(piId);
  //   // }, 3*60*1000);
  // }, 300);
    
  }

  ngAfterContentChecked() {
    this.rangevalue = ZoomSlider.rangeValue;
  }
  getAlluserProcessPiIds(){
    this.rest.getAlluserProcessPiIds().subscribe(data=>{this.process_graph_list=data
      console.log('data',data);})
  }
  onchangegraphId(selectedpiId){
    let piId=selectedpiId
    this.rest.getAllVaraintList(piId).subscribe(data=>{this.varaint_data=data // variant List call
      console.log('this.varaint_data',data);
      
      for(var i=0; i<this.varaint_data.data.length; i++){
          this.varaint_data.data[i].selected= "inactive";
          // this.varaint_data.data[i].days=this.timeConversion(this.varaint_data.data[i].days);
          // console.log( this.varaint_data.data[i].days);
          
      }
      this.onchangeVaraint("0");
      })
      this.rest.getfullGraph(piId).subscribe(data=>{this.fullgraph=data //process graph full data call
        if(this.fullgraph.hasOwnProperty('display_msg')){
          Swal.fire(
            'Oops!',
            'It is Not You it is Us, Please try again after some time',
            'error'
          );
          this.spinner.hide();
        } else{
         let fullgraphOne=this.fullgraph.data;
        //let fullgraphOne=this.gResponse.data;
        // console.log("fullgraphOne",fullgraphOne);

        this.model1 = fullgraphOne.allSelectData.nodeDataArraycase;

        console.log('this.model1',this.model1);
        let loction=''
        for(var i=0;i<this.model1.length;i++){
          if(this.model1[i].key==-1||this.model1[i].key==-2){
            let loc1=530
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
        
        this.model2 = this.flowchartData(this.model1)
        for(var j=0;j<this.model2.length;j++){
          // for (let [key, value] of Object.entries(this.model2[j])) {
            console.log(this.model2[j].from);

                            // this.model2[j].to ==-1||this.model2[j].to==-2 //conditions
                // this.model2[j].from>0 && this.model2[j].to<0
                // this.model2[j].from ==-2||this.model2[j].to==-2
                if(j==0 && this.model2[j].to>1 ){
                  let loc3=160
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
              }else{
                let loc3=20*j
                this.model2[j].curviness=loc3
              }
                
          }else if(this.model2[j].from+1==this.model2[j].to){
            let loc3=0
            this.model2[j].curviness=loc3
          }else{
              let loc3=30*j
            this.model2[j].curviness=loc3
            }
        }
      }
        console.log(this.model2);
        
        this.spinner.hide();
    }
        });

        
        // this.rest.getvaraintGraph(piId).subscribe(data=>{this.varaint_GraphData=data //variant api call
        // // console.log('varaint_GraphData',JSON.parse(this.varaint_GraphData.data));
        // this.varaint_GraphDataArray=JSON.parse(this.varaint_GraphData.data)
        // console.log('varaint_GraphData',this.varaint_GraphDataArray);
        // })
  }

  onchangeVaraint(datavariant) {
    // console.log("variantdata",datavariant);
    switch (datavariant) {
      case "0":
        // this.varaint_data = this.varaint_dat;
        this.varaint_data.data.sort(function (a, b) {
          return b.casepercent - a.casepercent;
        });
        break;
      case "1":
        // this.varaint_data = this.data;
        this.varaint_data.data.sort(function (a, b) {
          return a.casepercent - b.casepercent;
        });
        break;
      case "2":
        // this.varaint_data = this.data;
        this.varaint_data.data.sort(function (a, b) {
          return a.days - b.days;
        });
        break;
      case "3":
        // this.varaint_data = this.data;
        this.varaint_data.data.sort(function (a, b) {
          return b.days - a.days;
        });
        break;
    }

  }

  slideup() {
    document.getElementById("foot").classList.remove("slide-down");
    document.getElementById("foot").classList.add("slide-up");
  }

  // generateBpmn() {
  //   this.bpmnservice.uploadBpmn("pizza-collaboration.bpmn");
  //   this.router.navigate(['/pages/businessProcess/uploadProcessModel'])
  // }

  // loopTrackBy(index, term) {
  //   return index;
  // }

  caseIdSelect(selectedData, index) {
    this.isplay = false;
    // this.isselected=index;
    // const element = this.pgModel.flowchartData[selectedData.case];
    // this.model1 = element.nodeDataArraycase;
    // this.model2 = element.linkarraycase;

    // console.log("data1", selectedData);
    // console.log("model1",this.model1);


    if (this.varaint_data.data[index].selected == "inactive") {
      var select = {
        case: selectedData.case,
        casepercent: selectedData.casepercent,
        name: selectedData.name,
        detail: selectedData.detail,
        days: selectedData.days,
        varaintDetails: selectedData.varaintDetails,
        casesCovred: selectedData.casesCovred,
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
        selected: "inactive"
      };
      this.isvaraintPlay=false;
      this.varaint_data.data[index] = select;
    }
    this.selectedCaseArry = [];
    for (var i = 0; i < this.varaint_data.data.length; i++) {
      if (this.varaint_data.data[i].selected == "active") {
        var casevalue = this.varaint_data.data[i].case
        this.selectedCaseArry.push(casevalue);
      }
    };
    console.log("selectedcase", this.selectedCaseArry)
    // console.log("selectedcase.length",this.selectedCaseArry.length)
    this.caselength = this.selectedCaseArry.length;

    if (this.selectedCaseArry.length == 1) {
      // const element = this.pgModel.flowchartData[casevalue];
      // this.model1 = element.nodeDataArraycase;
      // this.model2 = element.linkarraycase;
      // this.model1=this.pgModel.allData.nodeDataArraycase;
      // this.model2=this.flowchartData(this.pgModel.nodeDataArraycase)
      this.isDefaultData = false;
    //   console.log("selectedcase", this.selectedCaseArry)
    // console.log("selectedData.case",selectedData.case);
    
      if (this.keyExists(this.selectedCaseArry[0], this.varaint_GraphDataArray) == true) {
        // console.log('log',this.selectedCaseArry[0], this.pgModel.flowchartData);
        
        var modalData = this.varaint_GraphDataArray[this.selectedCaseArry[0]]
        console.log('modalData',modalData);
        
        this.model1 = modalData.nodeDataArraycase
        this.model2 = this.flowchartData(this.model1)
      }
    }
    else {
      var modelDataArray = []
      for (var i = 0; i < this.selectedCaseArry.length; i++) {
        // console.log('key',this.keyExists(this.selectedCaseArry[i],this.pgModel.flowchartData)==true);
        // console.log("selectedCaseArry",this.selectedCaseArry);

        if (this.keyExists(this.selectedCaseArry[i], this.varaint_GraphDataArray) == true) {
          var modalData = this.varaint_GraphData.data[this.selectedCaseArry[i]]
          modelDataArray.push(modalData)

          // console.log('modalData[0]',modalData);


          // this.model1=result
          // this.model1=this.model1.nodeDataArraycase
          // this.model2=this.flowchartData(this.model1)
        }

      }
      // console.log('modalData[0]', modelDataArray);

      // var combine_obj={};
      // for(var key in modelDataArray[0].nodeDataArraycase) combine_obj[key]=modelDataArray[0].nodeDataArraycase[key];
      // for(var key in modelDataArray[1].nodeDataArraycase) combine_obj[key]=modelDataArray[1].nodeDataArraycase[key];
      // // var diffirence= modelDataArray[0].nodeDataArraycase.filter(x=>!modelDataArray[1].nodeDataArraycase.includes(x));
      // // var compare= this.compareJSON(modelDataArray[0],modelDataArray[1])
      // console.log('combine_obj',combine_obj);

      var outArr = [];
      var m = this

      modelDataArray[0].nodeDataArraycase.forEach(function (value, i) {
        // console.log(value);
        modelDataArray[1].nodeDataArraycase.forEach(function (value1, j) {
          //console.log(value1)
          if (value.name === value1.name) {
            if (value.hasOwnProperty('linkArray') && value1.hasOwnProperty('linkArray')) {
              // console.log(value.linkArray.length);
              if (value.linkArray.length != 0 && value1.linkArray.length != 0) {
                value.linkArray.forEach(e1 => {
                  // console.log(e1 + "::::");
                  value1.linkArray.forEach(e2 => {
                    if (e1 != e2) {
  
                      value.linkArray.push(e2);
                      // console.log(value);
  
                      value.linkArray = m.removeDuplicates(value.linkArray);
                    }
                  });
                });
              } else {
                if (value.linkArray.length == 0) {
                  value1.linkArray.forEach(e2 => {
                    value.linkArray.push(e2);
                    // console.log(value);
                  });
                } else {
                  value.linkArray.forEach(e1 => {
                    value.linkArray.push(e1);
                    // console.log(value);
                  });
                }
  
              }
  
            }
            if (value.hasOwnProperty('toolCount') && value1.hasOwnProperty('toolCount')){
            var sum = value.toolCount.map(function (num, idx) {
              return num + value1.toolCount[idx];
            });
            value.toolCount=sum
          }
          // value.toolCount=sum
            outArr.push(value);
          }
        });
      });
// console.log('outArr1',outArr);

      if(this.selectedCaseArry.length > 2){
var modalData = this.pgModel.flowchartData[0][this.selectedCaseArry[2]]
// console.log('outArr12',outArr);

        this.multynodeArray(outArr,modalData)
      }
    // this.nestedArray=outArr;

      // if(this.selectedCaseArry.length >2){
      //   console.log(this.selectedCaseArry);
        
      // for(var i=2; i < this.selectedCaseArry.length; i++){
      //   // var k=2;
      //   // while(this.selectedCaseArry.length ){

      //     console.log('nestedArray',this.nestedArray,this.selectedCaseArry[i]);
        
      //   if (this.keyExists(this.selectedCaseArry[i], this.pgModel.flowchartData) == true) {
      //     var modalData = this.pgModel.flowchartData[0][this.selectedCaseArry[i]]
      //     // console.log('modalData',modalData);
          
      //   this.multynodeArray(this.nestedArray,modalData)
        
      //     // k+1;
      //   }

      //   }

      // }

    // }
    

          this.model1=outArr
          this.model2=this.flowchartData(this.model1)

      this.isDefaultData = false;
    }
  }

  multynodeArray(outArray,modeaValue){
    var outArr=[];
    var m=this
    // console.log('outArraym',outArray);
    // console.log('modeaValuem',modeaValue);
    
    outArray.forEach(function (value, i) {
      // console.log(value);
      modeaValue.nodeDataArraycase.forEach(function (value1, j) {
        //console.log(value1)
        if (value.name === value1.name) {
          if (value.hasOwnProperty('linkArray') && value1.hasOwnProperty('linkArray')) {
            // console.log(value.linkArray.length);
            if (value.linkArray.length != 0 && value1.linkArray.length != 0) {
              value.linkArray.forEach(e1 => {
                // console.log(e1 + "::::");
                value1.linkArray.forEach(e2 => {
                  if (e1 != e2) {

                    value.linkArray.push(e2);
                    // console.log(value);

                    value.linkArray = m.removeDuplicates(value.linkArray);
                  }
                });
              });
            } else {
              if (value.linkArray.length == 0) {
                value1.linkArray.forEach(e2 => {
                  value.linkArray.push(e2);
                  // console.log(value);
                });
              } else {
                value.linkArray.forEach(e1 => {
                  value.linkArray.push(e1);
                  // console.log(value);
                });
              }

            }

          }
          if (value.hasOwnProperty('toolCount') && value1.hasOwnProperty('toolCount')){
          var sum = value.toolCount.map(function (num, idx) {
            return num + value1.toolCount[idx];
          });
          value.toolCount=sum
        }
        // value.toolCount=sum
          outArr.push(value);
          console.log('outarraynested',outArr);
        }
      });
    });
    // this.nestedArray=outArr;
  }
  removeDuplicates(array) {
    return array.filter((a, b) => array.indexOf(a) === b)
   };
  keyExists(key, search) {
    console.log('test',key, search)
    var existingObj = search.find(function (element) {
      return typeof element[key] !== 'undefined';
    });
    if (existingObj[key]) {
      // console.log('was found');
      return true
    } else {
      // console.log('not-found');
      return false
    }
  }
  compareJSON(obj1, obj2) {
    // console.log('obj1', obj1.nodeDataArraycase)
    // console.log('obj2', obj2)
    var ret = {};
    for (var i in obj2) {
      if (!obj1.hasOwnProperty(i) || obj2[i] !== obj1[i]) {
        ret[i] = obj2[i];
      }
    }
    return ret;
  };

  playAnimation() {
    this.isplay = !this.isplay
  }

  downloadsvg() {
    this.isdownload = true;
  }

  seleceAllVariants() {
    this.isplay = false;
    // console.log("checkboxValue",this.checkboxValue);

    if (this.checkboxValue == true) {
      for (var i = 0; i < this.varaint_data.length; i++) {
        this.varaint_data[i].selected = "active"
        // this.model1=this.pgModel.allSelectData.nodeDataArraycase
        // this.model2=this.pgModel.allSelectData.linkarraycase;
        this.isDefaultData = false;
      }
    } else {
      for (var i = 0; i < this.varaint_data.length; i++) {
        this.varaint_data[i].selected = "inactive";
      }
      // this.model1 = this.pgModel.defaultmodel.nodeDataArraycase;
      // this.model2 = this.pgModel.defaultmodel.linkarraycase;
      this.isDefaultData = true;
    }
  }

  performance() {
    this.isfrequency = true;
  }
  frequency() {
    this.isfrequency = false;
  }
  

  flowchartData(dataArray) {
    this.linkData = [];
    this.linkdataArray = [];
    this.nodeArray = dataArray;
     var linkToolArray=[];
    for (var i = 1; i < this.nodeArray.length-1; i++) {
      // console.log('linkArray',this.nodeArray[i].linkArray);
      var datalink = this.nodeArray[i].linkArray;
      // console.log('datalink',datalink);
      var link=[]
      var linktool=[]
      var label = this.nodeArray[i].name;
      
      for(var j=0; j< datalink.length; j++){
        // link.push(datalink[j].linkNode)
        // console.log('datalink.length',datalink[j].length);
        
        // if(link != undefined ||link != null){
        var obj = {};
          obj['from'] = this.getFromKey(label);
          obj['to'] = this.getFromKey(datalink[j].linkNode);
          obj['text'] = datalink[j].toolCount[0];

          //let testedg=label+' --> '+datalink[j].linkNode
          //obj['textOne'] = testedg;

          obj['toolData']=datalink[j].tool
           obj['toolDataCount']=datalink[j].toolCount

          this.linkdataArray.push(obj);
      // }
    }
          
      // var label = this.nodeArray[i].name;
      // if (link != undefined) {
        // for (var a = 0; a < link.length; a++) {
        //   var obj = {};
        //   obj['from'] = this.getFromKey(label);
        //   obj['to'] = this.getFromKey(link[a]);
        //   obj['text'] = this.nodeArray[i].toolCount[0];
        //   // obj['linktool'] = linkToolArray[l]
        //   this.linkdataArray.push(obj);
        // }

        // console.log('linkdataArray',this.linkdataArray);
        if (this.nodeArray[i].tool.includes('Start Frequency')) {
          var obj = {};
          this.nodeArray[i].count = this.nodeArray[i].toolCount[0];
          if(this.nodeArray[i].toolCount[3]!=0){
          obj['from'] = -1;
          obj['to'] = this.getFromKey(this.nodeArray[i].name);
          obj['text'] = this.nodeArray[i].toolCount[3];
          
          //let testedg="Start --> "+this.nodeArray[i].name
          //obj['textOne'] = testedg;
          obj["extraNode"] = 'true';
          this.linkdataArray.push(obj);
          }
        }
        if (this.nodeArray[i].tool.includes('End Frequency')) {
          var obj = {};
          this.nodeArray[i].count = this.nodeArray[i].toolCount[0];
          if(this.nodeArray[i].toolCount[4]!=0){
          obj['from'] = this.getFromKey(this.nodeArray[i].name);
          obj['to'] = -2;
          obj['text'] = this.nodeArray[i].toolCount[4];

          //let testedg=this.nodeArray[i].name+' --> End'
          //obj['textOne'] = testedg;

          obj["extraNode"] = 'true';
          this.linkdataArray.push(obj);
          }
        }

      // }
    }
    // for(var x=0; x<link.length; x++){
    //   var obj = {};
    //   obj['from'] = this.getFromKey(link[x].linkNode);
    //       obj['to'] = this.getFromKey(link[x].linkNode);
    //       obj['toolData']=link[x].tool
    //       obj['toolDataCount']=link[x].toolCount
    //       this.linkdataArray.push(obj);
    // }
    // this.model1=this.pgModel.allData.nodeDataArraycase;

    // this.model2=this.linkdataArray;
    console.log('linkarray', this.linkdataArray)
    return this.linkdataArray;
  }

  getFromKey(name) {
    for (var i = 0; i < this.nodeArray.length; i++) {
      if (name == this.nodeArray[i].name) {
        return this.nodeArray[i].key;
      }
    }
  }

  onfrequency(){
    this.isfrequencymetrics= !this.isfrequencymetrics;
    this.isperformancemetrics=false;
  }
  onPerformance(){
    this.isperformancemetrics= !this.isperformancemetrics;
    this.isfrequencymetrics=false;

  }
  spinnermetrics(){
    this.isedgespinner= !this.isedgespinner;
    // if(this.isedgespinner==false){
    //   this.isfrequencymetrics=false;
    //   this.isperformancemetrics=false;
    //   // this.model2 = this.flowchartData(this.model1)
    // }
  }

generateBpmn(){
  // this.bpmnservice.uploadBpmn("pizza-collaboration.bpmn");  
  this.bpmnservice.setNewDiagName('pizza-collaboration');
  this.bpmnservice.changeConfNav(false);
  this.router.navigate(['/pages/businessProcess/uploadProcessModel'],{queryParams: {isShowConformance: true}})
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

selectedMetric(selectedValue){
  console.log('spinMetrics0',this.spinMetrics0);
  console.log("selectedValue",selectedValue);
 
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
  // console.log(index);
  for(var i=1;i<this.model1.length-1;i++){
    // console.log(this.model1[i].count);
    if(index==5||index==6||index==7||index==8||index==9){
      this.model1[i].count=this.timeConversion(this.model1[i].toolCount[index])
    }else{
      this.model1[i].count=this.model1[i].toolCount[index]
      this.model1=this.model1
      // this.model1[i].countOne=this.model1[i].toolCount[index]
    }

  }
  console.log("model",this.model1);

  this.model2 = this.flowchartDataOne(this.model1,index)
  for(var j=0;j<this.model2.length;j++){
    if(j==0 && this.model2[j].to>1 ){
      let loc3=160
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
      }else{
        let loc3=20*j
        this.model2[j].curviness=loc3
      }
  }else if(this.model2[j].from+1==this.model2[j].to){
    let loc3=0
    this.model2[j].curviness=loc3
  }else{
      let loc3=30*j
    this.model2[j].curviness=loc3
    }
  }
}
  
}
flowchartDataOne(dataArray,index) {
  // console.log('index',index);
  
  this.linkData = [];
  this.linkdataArray = [];
  this.nodeArray = dataArray;
   var linkToolArray=[];
  for (var i = 1; i < this.nodeArray.length-1; i++) {
    // console.log('linkArray',this.nodeArray[i].linkArray);
    var datalink = this.nodeArray[i].linkArray;
    //  console.log('datalink',datalink);
    var link=[]
    var linktool=[]
    var label = this.nodeArray[i].name;
    
    for(var j=0; j< datalink.length; j++){
      // link.push(datalink[j].linkNode)
      // console.log('datalink.length',datalink[j].length);
      
      // if(link != undefined ||link != null){
        
      // console.log(index);
      var obj = {};
        obj['from'] = this.getFromKey(label);
        obj['to'] = this.getFromKey(datalink[j].linkNode);
        if(index==5||index==6||index==7||index==8||index==9){
          obj['text'] = this.timeConversion(datalink[j].toolCount[index]);
        }else{
        
          obj['text'] = datalink[j].toolCount[index];
        }
        // let testedg=label+' --> '+datalink[j].linkNode
        // obj['textOne'] = testedg;

        obj['toolData']=datalink[j].tool
         obj['toolDataCount']=datalink[j].toolCount

        this.linkdataArray.push(obj);
  }
      if (this.nodeArray[i].tool.includes('Start Frequency')) {
        var obj = {};
        // this.nodeArray[i].count = this.nodeArray[i].toolCount[0];
        // obj['from'] = -1;
        // obj['to'] = this.getFromKey(this.nodeArray[i].name);
        if(this.nodeArray[i].toolCount[3]!=0){
          obj['from'] = -1;
          obj['to'] = this.getFromKey(this.nodeArray[i].name);
          if(index==0||index==1){
          obj['text'] = this.nodeArray[i].toolCount[3];
          }
          obj["extraNode"] = 'true';
          this.linkdataArray.push(obj);
        }
        // obj['text'] = this.nodeArray[i].toolCount[3]
        // let testedg="Start --> "+this.nodeArray[i].name
        // obj['textOne'] = testedg;

      }
      if (this.nodeArray[i].tool.includes('End Frequency')) {
        var obj = {};
        // this.nodeArray[i].count = this.nodeArray[i].toolCount[0];
        // obj['from'] = this.getFromKey(this.nodeArray[i].name);
        // obj['to'] = -2;
        if(this.nodeArray[i].toolCount[4]!=0){
          obj['from'] = this.getFromKey(this.nodeArray[i].name);
          obj['to'] = -2;
          if(index==0||index==1){
          obj['text'] = this.nodeArray[i].toolCount[4]
          }
          obj["extraNode"] = 'true';
        this.linkdataArray.push(obj);
        }
        // let testedg=this.nodeArray[i].name+" --> End"
        // obj['textOne'] = testedg;

        // obj['text'] = this.nodeArray[i].toolCount[4]
        
      }
  }
console.log('this.linkdataArray',this.linkdataArray);

  return this.linkdataArray;
}
openNav(){
  document.getElementById("mySidenav").style.width = "310px";
  document.getElementById("main").style.marginRight = "310px";
  }
closeNav() {
  document.getElementById("mySidenav").style.width = "0px";
  document.getElementById("main").style.marginRight= "0px";
  }
  resetspinnermetrics(){
    this.model2 = this.flowchartData(this.model1)
    for(var j=0;j<this.model2.length;j++){
      // for (let [key, value] of Object.entries(this.model2[j])) {
        // console.log(this.model2[j].from);

                        // this.model2[j].to ==-1||this.model2[j].to==-2 //conditions
            // this.model2[j].from>0 && this.model2[j].to<0
            // this.model2[j].from ==-2||this.model2[j].to==-2
      if(j==0 && this.model2[j].to>1 ){
        let loc3=160
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
          }else{
            let loc3=20*j
            this.model2[j].curviness=loc3
          }
      }else if(this.model2[j].from+1==this.model2[j].to){
        let loc3=0
        this.model2[j].curviness=loc3
      }else{
          let loc3=30*j
        this.model2[j].curviness=loc3
        }
    }
  }
  this.spinMetrics0="";
    this.spinMetrics0="absoluteFrequency";
  console.log('spinMetrics0',this.spinMetrics0);
  
  }
  caseParcent(parcent){
    let perc=parcent.toString().split('.')
  // return parcent.toString().slice(0,5);
  return perc[0]+'.'+perc[1].slice(0,2);
  }
  readOutputValueEmittedOne(toolTipValue){
    console.log("toolTipValue",toolTipValue);
    this.linkToolTip=toolTipValue
  }
  
}
