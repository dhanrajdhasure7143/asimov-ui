import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Options } from 'ng5-slider';
import { Router } from '@angular/router';
import { ZoomSlider } from '../../../zoomSlider';
import { ProcessGraphModel } from '../model/process-graph-flowchart-model';
import { DataTransferService } from '../../services/data-transfer.service';
import { SharebpmndiagramService } from '../../services/sharebpmndiagram.service';
import { PiHints } from '../model/process-intelligence-module-hints';
import { createLoweredSymbol, ThrowStmt } from '@angular/compiler';
import { NgControl } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";

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
  public test: any;
  public test1: any;
  // public mymodel= this.pgModel.testdata[0].nodeDataArraycase1;
  public data = (this.pgModel.data);
  public reports = this.pgModel.reports;
  public filterLength: number;
  public dataValues: any[];
  public varaint_data: any[];
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
  process_graph_list;
  process_graph_options;
  variant_list_options;
  variant_list;
  constructor(private dt: DataTransferService, private router: Router, private bpmnservice: SharebpmndiagramService,
    private pgModel: ProcessGraphModel, private hints: PiHints,
    private spinner: NgxSpinnerService) {
    // this.spinner.show();
  }

  ngOnInit() {
    // this.model1 = this.pgModel.defaultmodel.nodeDataArraycase;
    // this.model2 = this.pgModel.defaultmodel.linkarraycase;
    this.dt.changeParentModule({ "route": "/pages/processIntelligence/upload", "title": "Process Intelligence" });
    this.dt.changeChildModule({ "route": "/pages/processIntelligence/flowChart", "title": "Process Graph" });
    this.dt.changeHints(this.hints.processGraphHints);
    this.varaint_data = this.data;
    this.process_graph_options = ProcessGraphList;
    this.process_graph_list = Object.keys(ProcessGraphList).filter(val => isNaN(ProcessGraphList[val]));
    this.variant_list_options = VariantList;
    this.variant_list = Object.keys(VariantList).filter(val => isNaN(VariantList[val]));
  }

  ngAfterContentChecked() {
    this.rangevalue = ZoomSlider.rangeValue;
  }

  onchangeVaraint(datavariant) {
    // console.log("variantdata",datavariant);
    switch (datavariant) {
      case "0":
        this.varaint_data = this.data;
        this.varaint_data.sort(function (a, b) {
          return b.casepercent - a.casepercent;
        });
        break;
      case "1":
        this.varaint_data = this.data;
        this.varaint_data.sort(function (a, b) {
          return a.casepercent - b.casepercent;
        });
        break;
      case "2":
        this.varaint_data = this.data;
        this.varaint_data.sort(function (a, b) {
          return b.Days - a.Days;
        });
        break;
      case "3":
        this.varaint_data = this.data;
        this.varaint_data.sort(function (a, b) {
          return a.Days - b.Days;
        });
        break;
    }

  }

  slideup() {
    document.getElementById("foot").classList.remove("slide-down");
    document.getElementById("foot").classList.add("slide-up");
  }

  generateBpmn() {
    this.bpmnservice.uploadBpmn("pizza-collaboration.bpmn");
    this.router.navigate(['/pages/businessProcess/uploadProcessModel'])
  }

  loopTrackBy(index, term) {
    return index;
  }

  caseIdSelect(selectedData, index) {
    this.isplay = false;
    // this.isselected=index;
    // const element = this.pgModel.flowchartData[selectedData.case];
    // this.model1 = element.nodeDataArraycase;
    // this.model2 = element.linkarraycase;

    console.log("data1", selectedData);
    // console.log("model1",this.model1);


    if (this.varaint_data[index].selected == "inactive") {
      var select = {
        case: selectedData.case,
        casepercent: selectedData.casepercent,
        name: selectedData.name,
        detail: selectedData.detail,
        Days: selectedData.Days,
        varaintDetails: selectedData.varaintDetails,
        casesCovred: selectedData.casesCovred,
        selected: "active"
      };
      this.varaint_data[index] = select;
    } else {
      var select = {
        case: selectedData.case,
        casepercent: selectedData.casepercent,
        name: selectedData.name,
        detail: selectedData.detail,
        Days: selectedData.Days,
        varaintDetails: selectedData.varaintDetails,
        casesCovred: selectedData.casesCovred,
        selected: "inactive"
      };
      this.varaint_data[index] = select;
    }
    this.selectedCaseArry = [];
    for (var i = 0; i < this.varaint_data.length; i++) {
      if (this.varaint_data[i].selected == "active") {
        var casevalue = this.varaint_data[i].casepercent
        this.selectedCaseArry.push(casevalue);
      }
    };
    console.log("selectedcase", this.selectedCaseArry)
    // console.log("selectedcase.lentgh",this.selectedCaseArry.length)
    this.caselength = this.selectedCaseArry.length;

    if (this.selectedCaseArry.length == 1) {
      // const element = this.pgModel.flowchartData[casevalue];
      // this.model1 = element.nodeDataArraycase;
      // this.model2 = element.linkarraycase;
      // this.model1=this.pgModel.allData.nodeDataArraycase;
      // this.model2=this.flowchartData(this.pgModel.nodeDataArraycase)
      this.isDefaultData = false;
      // console.log('selectedCaseArry',this.selectedCaseArry)

      if (this.keyExists(this.selectedCaseArry[0], this.pgModel.flowchartData) == true) {
        var modalData = this.pgModel.flowchartData[0][selectedData.casepercent]
        this.model1 = modalData.nodeDataArraycase
        this.model2 = this.flowchartData(this.model1)
      }
    }
    else {
      var modelDataArray = []
      for (var i = 0; i < this.selectedCaseArry.length; i++) {
        // console.log('key',this.keyExists(this.selectedCaseArry[i],this.pgModel.flowchartData)==true);
        // console.log("selectedCaseArry",this.selectedCaseArry);

        if (this.keyExists(this.selectedCaseArry[i], this.pgModel.flowchartData) == true) {
          var modalData = this.pgModel.flowchartData[0][this.selectedCaseArry[i]]
          modelDataArray.push(modalData)

          // console.log('modalData[0]',modalData);


          // this.model1=result
          // this.model1=this.model1.nodeDataArraycase
          // this.model2=this.flowchartData(this.model1)
        }

      }
      console.log('modalData[0]', modelDataArray);

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
              console.log(value.linkArray.length);
              if (value.linkArray.length != 0 && value1.linkArray.length != 0) {
                value.linkArray.forEach(e1 => {
                  console.log(e1 + "::::");
                  value1.linkArray.forEach(e2 => {
                    if (e1 != e2) {
  
                      value.linkArray.push(e2);
                      console.log(value);
  
                      value.linkArray = m.removeDuplicates(value.linkArray);
                    }
                  });
                });
              } else {
                if (value.linkArray.length == 0) {
                  value1.linkArray.forEach(e2 => {
                    value.linkArray.push(e2);
                    console.log(value);
                  });
                } else {
                  value.linkArray.forEach(e1 => {
                    value.linkArray.push(e1);
                    console.log(value);
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
console.log('outArr1',outArr);

      if(this.selectedCaseArry.length > 2){
var modalData = this.pgModel.flowchartData[0][this.selectedCaseArry[2]]
console.log('outArr12',outArr);

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
    console.log('outArraym',outArray);
    console.log('modeaValuem',modeaValue);
    
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
    console.log('test')
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
    console.log('obj1', obj1.nodeDataArraycase)
    console.log('obj2', obj2)
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
    for (var i = 0; i < this.nodeArray.length; i++) {
      //console.log(this.nodeArray[i]);
      var link = this.nodeArray[i].linkArray;
      // this.linkdata.push(link);
      var label = this.nodeArray[i].name;
      if (link != undefined) {
        for (var a = 0; a < link.length; a++) {
          var obj = {};
          obj['from'] = this.getFromKey(label);
          obj['to'] = this.getFromKey(link[a]);
          obj['text'] = this.nodeArray[i].toolCount[0]
          this.linkdataArray.push(obj);
        }

        if (this.nodeArray[i].tool.includes('Start Frequency')) {
          // console.log(this.nodeArray[i].name)
          var obj = {};
          this.nodeArray[i].count = this.nodeArray[i].toolCount[0];
          obj['from'] = -1;
          obj['to'] = this.getFromKey(this.nodeArray[i].name);
          obj['text'] = this.nodeArray[i].toolCount[3]
          obj["extraNode"] = 'true';
          this.linkdataArray.push(obj);
        }
        if (this.nodeArray[i].tool.includes('End Frequency')) {
          // console.log(this.nodeArray[i].name)
          var obj = {};
          this.nodeArray[i].count = this.nodeArray[i].toolCount[0];
          obj['from'] = this.getFromKey(this.nodeArray[i].name);
          obj['to'] = -2;
          obj['text'] = this.nodeArray[i].toolCount[4]
          obj["extraNode"] = 'true';
          this.linkdataArray.push(obj);
        }
        // console.log('node',this.nodeArray);

      }
    }
    // this.model1=this.pgModel.allData.nodeDataArraycase;

    // this.model2=this.linkdataArray;
    // console.log('linkarray', this.linkdataArray)
    return this.linkdataArray;
  }

  getFromKey(name) {
    for (var i = 0; i < this.nodeArray.length; i++) {
      if (name == this.nodeArray[i].name) {
        // console.log(this.nodeArray[i].key);
        return this.nodeArray[i].key;
      }
    }
  }

}
