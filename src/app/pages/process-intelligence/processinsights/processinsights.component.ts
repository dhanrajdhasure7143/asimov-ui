import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { RestApiService } from '../../services/rest-api.service';
import HC_more from 'highcharts/highcharts-more' //module
import { IDropdownSettings } from 'ng-multiselect-dropdown';

import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import * as d3 from 'd3';
import {curveBasis} from 'd3-shape';
import { DataTransferService } from '../../services/data-transfer.service';
import { PiHints } from '../model/process-intelligence-module-hints';
import { GlobalScript } from 'src/app/shared/global-script';
import { NgxSpinnerService } from "ngx-spinner";
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
HC_more(Highcharts)
enum VariantList {
    'Most Common',
    'Least Common',
    'Fastest Throughput',
    'Slowest Throughput'
}
@Component({
    selector: 'app-processinsights',
    templateUrl: './processinsights.component.html',
    styleUrls: ['./processinsights.component.css']
})
export class ProcessinsightsComponent implements OnInit {
    chart1: any;
    verticleGraph: any;
    table1: any = [];
    chart2: any;
    piechart1: any
    piechart2: any;
    isvariantListOpen: boolean = true;
    isEventGraph: boolean = true;
    input1: any = 20;
    input2: any = 1;
    robotinput:any = 8;
    workingHours:any = {
        formDay:'Mon',
        toDay: 'Sun',
        shiftStartTime:"00:00",
        shiftEndTime:"23:59"

    };
    variant_list: any;
    varaint_data: any;
    select_varaint: any = 0;
    variant_list_options;
    selectedCaseArry: any = [];
    public caselength: number;
    checkboxValue: boolean = false;
    isEditable: boolean = false;
    isEditable1: boolean = false;
    variant_Duration_list: any = [];
    totalMeanDuration: any;
    totalMedianDuration: any;
    bkp_totalMedianDuration: any;
    insight_human_robot_cost: any = [];
    graphIds: any;
    caseIDs: any = [];
    humanCost: any = [];
    robotCost: any = [];
    activityData: any = [];
    flag = 0;
    flag1 = 0;
    flag2 = 0;
    piechart3: any;
    isstackedbarChart: boolean = false;
    isstackedbarChart1: boolean = false;
    stackedChart: any;
    activity_Metrics: any = [];
    bubbleColor: any;
    activityHumanCost: any = [];
    activityBotCost: any = [];
    list_Activites: any = [];
    actual_activityData: any = [];
    top10_activityData: any = [];
    partialVariants: any = [];
    totalCases: any = 0;
    totalVariantList: any = [];
    resourcesList: any = [];
    selectedResources: any = [];
    dropdownSettings: IDropdownSettings = {};
    finalVariants: any = {};
    s_variants:any = [];
    dChart1:any = [];
    dChart2:any = [];
    isAddHrs:boolean=false;
    value:any='23:11';
    time:any

    // NGX Charts
    multi: any = [];

    bubbleData:any =[];
  view: any[] = [800, 420];
  view1:any[] = [500, 340]

  // options
  legend: boolean = false;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Duration';
  yAxisLabel: string = 'Price';
  timeline: boolean = true;
  rotateXAxisTicks:boolean = true;
  trimXAxisTicks:boolean = true;
  autoScale: boolean = true;
  curve:any = curveBasis;


//   bubble chart
legend1: boolean = false;
legendTitle = "Activity vs Occurences"
maxRadius: number = 20;
minRadius: number = 5;
yScaleMin: number = 0;
//yScaleMax: number = 1000;
showXAxis:boolean = true;
showYAxis:boolean = true;
xAxisLabel1: string = 'Activity';
yAxisLabel1: string = 'Occurences';
  colorScheme = {
    domain: ['#E44D25', '#5AA454', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };
  colorScheme1 = {
    domain: ['#fc8d45']
  };


//   combo chart
view2 = [500,400];
gradient = false;
showLegend = false;
legendPosition = 'right';
showXAxisLabel1 = true;
xAxisLabel2 = 'Activity';
showYAxisLabel1 = true;
yAxisLabel2 = 'Human Cost';
showGridLines = true;
innerPadding = '5%';
barChart: any[] = [];
lineChartSeries: any[] = [];

lineChartScheme = {
  name: 'coolthree',
  selectable: true,
  group: 'linear',
  domain: ['#212F3C']
};

comboBarScheme = {
  name: 'singleLightBlue',
  selectable: true,
  group: 'linear',
  domain: ['#098DE6']
};

showRightYAxisLabel: boolean = false;
yAxisLabelRight: string = 'Bot Cost';
biDataMaxPerct:any;
biDataMinPerct:any;
biDataMaxDays:any;
biDataMinDays:any;
isselected: number;
xScaleMin:number;
xScaleMax:number;
top;
yLeftTickFormat;
yRightTickFormat;
yLeftAxisScale:number;
robotValue:number;


    constructor(
        private rest: RestApiService,
        private route: ActivatedRoute,
        private dt: DataTransferService,
        private hints: PiHints,
        private global:GlobalScript
        // private spinner:NgxSpinnerService
    ) {
       // Object.assign(this, { multi });
      // Object.assign(this.bubbleData,  this.bubbleData );
     }
     ngAfterViewInit(){
         let res_data
         this.dt.processInsights_headerChanges.subscribe(res=>{
             console.log(res)
             res_data=res
             if(res_data instanceof Object){
                 this.workingHours=res_data
                this.addWorkingHours();
             }else if(res_data=="open_Varaint"){
                this.openVariantListNav();
            }
         })
     }

    ngOnInit() {
        this.dt.changeParentModule({ "route": "/pages/processIntelligence/upload", "title": "Process Intelligence" });
        this.dt.changeChildModule({ "route": "/pages/processIntelligence/insights", "title": "Insights" });
        this.dt.changeHints(this.hints.insightsHints);
        var piId;
        this.route.queryParams.subscribe(params => {
            if (params['wpid'] != undefined) {
                let wpiIdNumber = parseInt(params['wpid']);
                piId = wpiIdNumber;
                this.graphIds = piId;
            }
        });
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'item_id',
            textField: 'item_text',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 1,
            allowSearchFilter: true
        };
        this.variant_list = Object.keys(VariantList).filter(val => isNaN(VariantList[val]));
        this.variant_list_options = VariantList;
        this.table1 = [{ value1: "value1", value2: "value2", value3: "value3" }, { value1: "value1", value2: "value2", value3: "value3" }, { value1: "value1", value2: "value2", value3: "value3" }, { value1: "value1", value2: "value2", value3: "value3" }]
        // this.addcharts();
        // this.addchart2();
        //this.verticleBarGraph();
        // this.addpiechart1([]);
        // this.addpiechart2([]);
        //this.getDonutChart();
        this.getBusinessInsights();
        this.getAllVariantList()
        this.getDurationCall();
        this.getTotalNoOfCases('fullgraph');
        this.getActivityMetrics('fullgraph');
        this.getHumanBotCost('fullgraph');
    }

    addWorkingHours(){
        if(!this.workingHours.formDay){
            this.global.notify("Please select from working day", "error");
            return;
        }
        if(!this.workingHours.toDay){
            this.global.notify("Please select to working day", "error");
            return;
        }
        if(!this.workingHours.shiftStartTime){
            this.global.notify("Please select shift start time", "error");
            return;
        }
        if(!this.workingHours.shiftEndTime){
            this.global.notify("Please select shift end time", "error");
            return;
        }
        this.getTotalNoOfCases('fullgraph');
        //this.getActivityMetrics('fullgraph');
        //this.getHumanBotCost('fullgraph');
        this.onResourceSelect(false);
        this.getDurationCall();
        this.canceladdHrs();
        this.getBusinessInsights();

    }

    resetWorkingHours(){    
        this.workingHours.formDay = "Mon";
        this.workingHours.toDay = "Fri";
        this.workingHours.shiftStartTime="00:00";
        this.workingHours.shiftEndTime="23:59"
    }

    getDurationCall() {
        var reqObj = {
            pid: this.graphIds,
            //pid:'671229',
            data_type: 'variant_metrics',
            "workingHours": this.workingHours.formDay+"-"+this.workingHours.toDay+" "+this.workingHours.shiftStartTime+":00-"+this.workingHours.shiftEndTime+":00"
        }
       // this.spinner.show();
        this.rest.getPIInsightMeanMedianDuration(reqObj)
            .subscribe((res: any) => {
                this.variant_Duration_list = res.data;
                this.totalMeanDuration = res.totalMeanDuration;
                this.bkp_totalMedianDuration = res["data"]["total"]["totalDuration"];
                //this.bkp_totalMedianDuration = res["data"]["total"]["totalDuration"]/3;
                this.totalMedianDuration = this.bkp_totalMedianDuration;
             //   this.spinner.hide();

            },
                (err => {
                 //   this.spinner.hide();
                    // console.log("Internal server error, Please try again later.")
                }))

    }

    calculateSavings(val) {
        if (val && this.input1 && this.input2) {
            //assume robo cost per hr is 4$
            //let roboCost = val*60*8/(1000 * 100 * 60 * 60);
            //let totalCost = (val*this.input1)/(1000 * 60 * 60);
            let roboCost = Math.round(this.getHours(val) * 60 / 100 * this.robotinput);
            let totalCost = Math.round(this.getHours(val) * this.input1);
            return Number((totalCost - roboCost));
        } else {
            return 0;
        }
    }

    getHumanTotalCost(val) {
        if (val) {
            let vv =  Math.round(Number(val))
            return vv;
            //return (vv).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');  // 12,345.67
        }
    }

    getActivityTableData(data) {
        this.actual_activityData = data;
        this.actual_activityData.sort(function (a, b) {
            return b.Duration_range - a.Duration_range;
        });
        let tmp = [];
        this.actual_activityData.forEach(each => {
            if (each.Duration_range > 10 * 60 * 1000) tmp.push(each)
        })
        this.top10_activityData = tmp.slice(0, 5);
         console.log(this.top10_activityData);
        var dd = this.timeConversion(7187760000);
        // console.log(dd);

    }

    //   getSlowestThroughPut(){
    //     let actual_data = this.varaint_data.data;
    //     let percent = Math.floor(actual_data.length*20/100);
    //     return actual_data.splice(0,percent-1);
    //   }
    getHumanBotCost(from: string, varinatArray?: any) {
        var reqObj: any;
        if (from == 'fullgraph') {
            reqObj = {
                //pid:'610283',
                pid: this.graphIds,
                flag: false,
                data_type: "human_bot",
                "workingHours": this.workingHours.formDay+"-"+this.workingHours.toDay+" "+this.workingHours.shiftStartTime+":00-"+this.workingHours.shiftEndTime+":00"
                //variants:[] //if flag is true
            }
        } else {
            reqObj = {
                //pid:'610283',
                pid: this.graphIds,
                flag: true,
                data_type: "human_bot",
                variants: varinatArray //if flag is true
            }
        }
       // this.spinner.show();
        this.rest.getPIInsightMeanMedianDuration(reqObj)
            .subscribe((res: any) => {
                this.insight_human_robot_cost = res.data;
                // console.log(this.insight_human_robot_cost);
                this.getHumanvsBotCost(this.insight_human_robot_cost);
                if (from == 'fullgraph') {
                    this.getResources(this.insight_human_robot_cost);
                }
              //  this.spinner.hide();
            })

    }

    showTop10Rec() {
        (<HTMLElement>document.getElementById("top10Activities")).scrollIntoView();
    }

    getResources(vData) {
        let resources = [];
        let tmp = [];
        let tmp2 = [];
        vData.rwa_data.forEach(each => {
            if (tmp.indexOf(each.Resource_Name) == -1) {
                resources.push({ item_id: resources.length, item_text: each.Resource_Name })
                tmp.push(each.Resource_Name)
            }
        });
        this.resourcesList = resources;
        // this.selectedResources.forEach(each_sel => {
        //     if(tmp.indexOf(each_sel) != -1) tmp2.push(each_sel)
        // })
        // this.selectedResources = tmp2;
    }

    onResourceSelect(isAllSelect?: boolean) {
        //   console.log("in resource")
        var r_flag = 'SINGLE';
        let selected_resources = [];
        let aResources = this.selectedResources;
        if (isAllSelect == true){
            r_flag = 'ALL';
         aResources = this.resourcesList;
        } 
        if (aResources.length == 0 || isAllSelect == false) {
            //   console.log("in shs");

            this.totalMedianDuration = this.bkp_totalMedianDuration;
            this.getActivityMetrics('fullgraph');
            this.getHumanBotCost('fullgraph');
        } else {
            aResources.forEach(each => {
                selected_resources.push(each.item_text);
            })
            let selected_variants = this.s_variants;
            var reqObj: any = {
                "data_type": "metrics_resources",
                "pid": this.graphIds,
                //"pid":610283,
                "resourceFlag": r_flag,
                "variants": selected_variants,
                "resources": selected_resources,
                "workingHours": this.workingHours.formDay+"-"+this.workingHours.toDay+" "+this.workingHours.shiftStartTime+":00-"+this.workingHours.shiftEndTime+":00"
            }
           // this.spinner.show();
            this.rest.getPIInsightResourceSelection(reqObj)
                .subscribe((res: any) => {
                    // console.log(res)
                    //dashboard metrics
                    //this.totalMedianDuration = res.data.total.totalDuration / 3;
                    this.totalMedianDuration = res.data.total.totalDuration;
                    //activity data
                    this.activity_Metrics = res.data.activiees;
                    let adata = [];
                    let activityCost = [];
                    let activityDuration = [];
                    this.isEventGraph = true;
                    if (this.activity_Metrics.length) {
                        let tmp = [];
                        let tmp2 = [];
                        let obj1 = {}
                            var pieArray=[]
                            let obj3 = {}
                        this.activity_Metrics.forEach((e, m) => {
                            let duration = e.Duration_range / (1000 * 60 * 60);
                            // let obj = {
                            //     name: e.Activity,
                            //     y: duration
                            // }
                            // let obj2 = {
                            //     name: e.Activity,
                            //     y: duration * this.input1
                            // }

                            let obj = {
                                name: e.Activity,
                                value: Math.round(duration),
                                label: Math.round(duration)+"hrs"
                            }
                            let obj2 = {
                                name: e.Activity,
                                value: Math.round(duration * this.input1),
                                label: "$"+Math.round(duration * this.input1)
                            }
                            if (m == 0) {
                                obj["sliced"] = true;
                                obj["selected"] = true;
                                obj2["sliced"] = true;
                                obj2["selected"] = true;
                            }
                            tmp.push(obj);
                            tmp2.push(obj2);
                            adata.push({ x: e.Activity, y: e.Frequency, r: e.Frequency, name: e.Activity, fullname: e.Activity.split(/\s/).reduce((response, word) => response += word.slice(0, 1), ''), title: 'No of Events', event_duration: e.Frequency });
                        });
                         //tmp.push(obj1);

                         //   tmp2.push(obj3);
                        this.activityData = adata;
                        this.bubbleData = [{name:"", series: this.activityData}];
                        this.colorScheme1 = {
                            domain: ['#fc8d45']
                          };
                        this.yAxisLabel1="Occurences";
                        activityDuration = tmp;
                        activityCost = tmp2;
                        this.dChart1 = activityDuration;
                        this.dChart2 = activityCost;
                        //this.addchart2();
                        console.log(this.dChart2)
                        this.ActivityTimeChart();
                        this.resourceCostByActivity();
                        this.getActivityWiseHumanvsBotCost(this.activity_Metrics);
                        this.getActivityTableData(this.activity_Metrics);
                    } else {
                        this.totalMedianDuration = this.bkp_totalMedianDuration;
                        this.getActivityMetrics('fullgraph');
                        this.getHumanBotCost('fullgraph');
                    }

                    //human vs bot
                    this.getHumanvsBotCost(res.data)

                    //Activity - Duration Pie chart
                    // this.addpiechart1(activityDuration);
                    // this.addpiechart2(activityCost);
                    //this.getDonutChart1(activityDuration);
                    //this.getDonutChart2(activityCost);
                 //   this.spinner.hide();
                })
        }
    }

    getHumanvsBotCost(vData) {
        var hCost = [];
        var rCost = [];
        var d1 = [];
        var d2 = [];
        var d3 = [];
        var dateArray = [];
        var t_array = []
        vData.dates_data.forEach(e => {
            var aa = e.date.split('.');
            var mydate = aa[2] + '-' + aa[1] + '-' + aa[0];
            e.date = mydate;
        });
        vData.dates_data = vData.dates_data.sort(function compare(a, b) {
            var dateA: any = new Date(a.date);
            var dateB: any = new Date(b.date);
            return dateA - dateB;
        });

        //    console.log(vData.dates_data);
       
        vData.dates_data.forEach(e => {

            dateArray.push(moment(new Date(e.date)).format('DD/MM/YYYY'));
            // 
            var humanCost = Math.round(this.getHours(e.median_value) * this.input1);
            hCost.push(humanCost);
            var rDuration = Math.round(this.getHours(e.median_value) * 60 / 100);
            var rHours = Math.round(rDuration);
            var rFinalCost = rHours * this.robotinput;
            rCost.push(rFinalCost);
            d1.push({name:moment(new Date(e.date)).format('DD/MM/YYYY'), value:humanCost})
            d2.push({name:moment(new Date(e.date)).format('DD/MM/YYYY'), value:rFinalCost})
            d3.push({value1:humanCost,name1:"Human Cost",name2:"Bot Cost", value2:rFinalCost, date:moment(new Date(e.date)).format('yyyy,MM,DD'),date1:moment(new Date(e.date)).format('DD/MM/YYYY'),})
        });

        //this.caseIDs = this.removeDuplicate(this.caseIDs);
        this.caseIDs = dateArray;
        this.humanCost = hCost;
        this.robotCost = rCost;

        this.multi = [{name:"Human Cost", series: d1},{name:'Bot Cost', series:d2}];
// console.log(d3)

    //    this.addcharts();
    let chart = am4core.create("linechart1", am4charts.XYChart);

// Add data
chart.data = d3

// Create axes
let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
// dateAxis.renderer.minGridDistance = 10;
// dateAxis.renderer.labels.template.rotation=270;
dateAxis.title.text = "Duration";
let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
valueAxis.title.text = "Price";
// Create series
let series = chart.series.push(new am4charts.LineSeries());
series.dataFields.valueY = "value1";
series.dataFields.dateX = "date";
series.strokeWidth = 2;
series.minBulletDistance = 3;
series.tooltipText = "[bold]Date: {date1}[/]\n{name1}: {value1}\n{name2}:{value2}";
series.tooltip.pointerOrientation = "vertical";

// Create series
let series2 = chart.series.push(new am4charts.LineSeries());
series2.dataFields.valueY = "value2";
series2.dataFields.dateX = "date";
series2.strokeWidth = 2;
series2.strokeDasharray = "3,4";
// series2.tooltipText = "[bold]{date.formatDate()}:[/]\n{name1}: {value1}\n{name1}:{value2}";
series2.stroke = series.stroke;

// Add cursor
chart.cursor = new am4charts.XYCursor();
chart.cursor.xAxis = dateAxis;
    }

    getHours(millisec) {
        var hours: any = (millisec / (1000 * 60 * 60)).toFixed(1);       
        return hours;
    }

    getHours2(millisec) {
        var hours: any = (millisec / (1000 * 60 * 60)).toFixed(1);
        var minutes:any = (millisec / (1000 * 60)).toFixed(1);
        if(minutes < 60){
        return Math.round(minutes);
        } else{
        return Math.round(hours);
        }
    }
    getHours1(millisec) {
        var hours: any = Math.round(millisec / (1000 * 60 * 60));
        return hours;
    }

    removeDuplicate(dataArray) {
        let uniqueChars = [];
        dataArray.forEach((c) => {
            if (!uniqueChars.includes(c)) {
                uniqueChars.push(c);
            }
        });
        return uniqueChars.sort();
    }

    getPointX(cases) {
        //   console.log(cases);

        this.variant_Duration_list.data.forEach(e => {
            if (e.Cases == cases) {
                return this.getHours(e.median_duration);
            }
        });
    }

    getActivityMetrics(type: any, selected_variants?: any) {
        var reqObj: any;
        this.activityData = [];
        if (type == 'fullgraph') {
            reqObj = {
                //pid:'920036',
                pid: this.graphIds,
                data_type: 'variant_activity_metrics',
                flag: false,
                "workingHours": this.workingHours.formDay+"-"+this.workingHours.toDay+" "+this.workingHours.shiftStartTime+":00-"+this.workingHours.shiftEndTime+":00"
            }
        } else {
            reqObj = {
                // pid:'920036',
                pid: this.graphIds,
                data_type: 'variant_activity_metrics',
                flag: true,
                variants: selected_variants //if flag is true
            }

        }
      //  this.spinner.show();
        this.rest.getPIVariantActivity(reqObj)
            .subscribe((res: any) => {
                // console.log(JSON.stringify(res));
                var aData = res.data;
                this.activity_Metrics = aData.data;
                let activityDuration = [];
                let activityCost = [];
                let obj1 = {}
                let pieArray=[]
                let obj3 = {}
                aData.data.forEach((e, m) => {
                    let duration = e.Duration_range / (1000 * 60 * 60);
                    // let obj = {
                    //     name: e.Activity,
                    //     y: duration
                    // }
                    let obj = {
                         name:e.Activity,
                         value:Math.round(duration),
                         label:Math.round(duration)+"hrs"
                    } 
                    let obj2 = {
                        name: e.Activity,
                        value: Math.round(duration * this.input1),
                        label: "$"+Math.round(duration * this.input1)
                    }
                    
                    if (m == 0) {
                        obj["sliced"] = true;
                        obj["selected"] = true;
                        obj2["sliced"] = true;
                        obj2["selected"] = true;
                    }
                    activityDuration.push(obj);
                    activityCost.push(obj2);

                  

                    this.activityData.push({ x: e.Activity, y: e.Frequency, r: e.Frequency, name: e.Activity, fullname: e.Activity.split(/\s/).reduce((response, word) => response += word.slice(0, 1), ''), title: 'No of Events', event_duration: e.Frequency });
                    //this.activityData.push({name: e.Activity, x: Number(e.Frequency), y: Number(e.Frequency), r: Number(e.Frequency)});
                   
                });
                this.bubbleData = [{name:"", series: this.activityData}];
                this.colorScheme1 = {
                    domain: ['#fc8d45']
                  };

                this.dChart1 = activityDuration;
                this.dChart2 = activityCost;
                console.log(this.dChart2)
                this.ActivityTimeChart();
                this.resourceCostByActivity();
                //this.addchart2();
                this.getActivityWiseHumanvsBotCost(this.activity_Metrics);
                this.getActivityTableData(this.activity_Metrics);
                this.isEventGraph = true;
                //this.addpiechart1(activityDuration);
                //this.addpiechart2(activityCost);
                //this.getDonutChart1(activityDuration);
                //this.getDonutChart2(activityCost);
              //  this.spinner.hide();
            })

    }

    pieChartLabel(series: any, name: string): string {
        const item = series.filter(data => data.name === name);
        if (item.length > 0) {
            return item[0].label;
        }
        return name;
    }
    pieChartLabel1(series: any, name: string): string {
        const item = series.filter(data => data.name === name);
        if (item.length > 0) {
            return item[0].label;
        }
        return name;
    }

    getActivityWiseHumanvsBotCost(activityMetrics) {
        // console.log(activityMetrics);
        var hCost = [];
        var rCost = [];
        var ac_list = [];

        activityMetrics.forEach(e => {
            ac_list.push(e.Activity);
            var humanCost = Math.round(this.getHours(e.Duration_range) * this.input1);
            //hCost.push(humanCost);
            // var length = 20;
            // var trimmedString = e.Activity.length > length ? 
            // e.Activity.substring(0, length - 3) + "..." : 
            // e.Activity;
            hCost.push({name:e.Activity, value:humanCost});
            var rDuration = Math.round(this.getHours(e.Duration_range) * 60 / 100);
            var rHours = Math.round(rDuration);
            var rFinalCost = rHours * this.robotinput;
            //rCost.push(rFinalCost);
            rCost.push({name:e.Activity, value:rFinalCost});
        });
        // this.activityHumanCost = hCost;
        // this.activityBotCost = rCost;
        // this.list_Activites = ac_list;
        //this.verticleBarGraph();
        this.barChart = hCost;
        this.lineChartSeries = [{name:"Bot Cost",series:rCost}];

    }

    getEventBubboleGraph(type) {
        this.activityData = [];
        this.activity_Metrics.forEach((e, m) => {
            if (type && type == 'event') {
                this.activityData.push({ x: e.Activity, y: e.Frequency, r: e.Frequency, name: e.Activity, fullname: e.Activity.split(/\s/).reduce((response, word) => response += word.slice(0, 1), ''), title: 'No of Events', event_duration: e.Frequency });
                this.bubbleColor = '#212F3C';
                this.isEventGraph = true;
                this.bubbleData = [{name:"", series: this.activityData}];
                this.colorScheme1 = {
                    domain: ['#fc8d45']
                  };
                  this.yAxisLabel1 = 'Occurences';
            } else {

                this.activityData.push({ x: e.Activity, y: this.getHours2(e.Duration_range), r: this.getHours2(e.Duration_range), name: e.Activity, fullname: e.Activity.split(/\s/).reduce((response, word) => response += word.slice(0, 1), ''), title: 'Duration', event_duration: this.timeConversion(e.Duration_range) });
                this.bubbleColor = '#008080';
                this.isEventGraph = false;
                this.bubbleData = [{name:"", series: this.activityData}];
                this.colorScheme1 = {
                    domain: ['#3EC1A4']
                  };
                  this.yAxisLabel1 = 'Duration(Hrs)';
            }
            console.log(this.bubbleData);
           // this.addchart2();
        });
    }

    getTotalNoOfCases(type) {
        var noofcases = 0;
        this.totalCases = 0;

        if (type == 'fullgraph') {
            this.varaint_data.data.forEach(e => {

                noofcases += e.case_value;
            });
            
            
            this.totalCases = noofcases;
            return this.totalCases;
        } else {
            noofcases = 0;
            this.totalCases = 0;
            //   console.log(this.totalVariantList);

            this.totalVariantList.forEach(e => {
                //   console.log(e);
                noofcases = noofcases + e.case_value;
            });
            this.totalCases = noofcases;
            return this.totalCases;
        }
    }

    convertHourstoMiliseconds(hrs){
        var milliseconds = hrs * 60 * 60 *1000;
        return this.timeConversion(milliseconds);
    }

    addcharts() {
        this.chart1 = {
            chart: {
                type: 'spline',
                scrollablePlotArea: {
                    minWidth: 600,
                    scrollPositionX: 1
                }
            },
            title: {
                text: 'Human Cost Vs Bot Cost',
                align: 'center'
            },
            xAxis: {
                // type: 'number',
                labels: {
                    overflow: 'justify'
                },
                categories: this.caseIDs
                //   categories: [
                //    10,50,100,150,200,250,300,350,400,450,500]
            },
            yAxis: {
                title: {
                    text: '',
                    labels: {
                        overflow: 'justify'
                    }
                },
                minorGridLineWidth: 0,
                gridLineWidth: 1,
                alternateGridColor: null,
                // left:1,
                // plotBands: []
            },
            tooltip: {
                //valueSuffix: '$',
                valuePrefix: '$',
                crosshairs: true,
                shared: true,
                // headerFormat: '<b>{series.name}</b><br />',
                //pointFormat: 'x = {this.getPointX(point.x)}, y = {point.y}'
            },
            plotOptions: {
                spline: {
                    lineWidth: 4,
                    states: {
                        hover: {
                            lineWidth: 5
                        }
                    },
                    marker: {
                        enabled: true
                    },
                    // pointInterval: 3600000, // one hour
                    // pointStart: Date.UTC(2018, 1, 13, 0, 0, 0)
                }
            },
            series: [{
                name: 'Human Cost',
                //data: [20, 50, 100, 250, 280, 320, 370, 430,500]
                data: this.humanCost

            }, {
                name: 'Bot Cost',
                data: this.robotCost
                //data: [10, 70, 180, 250, 290, 300, 390, 460,500]
            }],
            navigation: {
                menuItemStyle: {
                    fontSize: '10px'
                }
            }
        }

        Highcharts.chart('costprojection', this.chart1);
    }

    verticleBarGraph() {
        this.verticleGraph = {
            title: {
                text: 'Activity Based Human and Bot Cost'
            },
            xAxis: {
                type: 'category',
                categories: this.list_Activites,

                labels: {
                    // rotation: -45,
                    //skew3d:true
                    staggerLines: 2

                }
                // type: 'category',
                // labels: {
                //     rotation: -45,
                //     style: {
                //         fontSize: '13px',
                //         fontFamily: 'Verdana, sans-serif'
                //     }
                // }
            },
            yAxis: {
                title: {
                    text: 'Price'
                }
            },
            tooltip: {
                valuePrefix: '$'
            },
            labels: {
                items: [{
                    //html: 'Total fruit consumption',
                    style: {
                        left: '50px',
                        top: '18px',
                        color: ( // theme
                            Highcharts.defaultOptions.title.style &&
                            Highcharts.defaultOptions.title.style.color
                        ) || 'black'
                    }
                }]
            },
            series: [{
                type: 'column',
                name: 'Human Cost',
                data: this.activityHumanCost
            }, {
                type: 'spline',
                name: 'Bot Cost',
                data: this.activityBotCost,
                marker: {
                    lineWidth: 2,
                    lineColor: Highcharts.getOptions().colors[3],
                    fillColor: 'white'
                }
            }
            ]
        };

        Highcharts.chart('barGraph', this.verticleGraph);
    }


    addchart2() {
        this.chart2 = {
            chart: {
                type: 'bubble',
                plotBorderWidth: 1,
                zoomType: 'xy'
            },

            legend: {
                enabled: false
            },

            title: {
                text: 'Activity vs Occurences'
            },

            subtitle: {
                // text: 'Source: <a href="http://www.euromonitor.com/">Euromonitor</a> and <a href="https://data.oecd.org/">OECD</a>'
            },

            // accessibility: {
            //     point: {
            //       //  valueDescriptionFormat: '{index}. {point.name}, fat: {point.x}g, sugar: {point.y}g, obesity: {point.z}%.'
            //     }
            // },

            xAxis: {
                // gridLineWidth: 1,
                title: {
                    text: 'Activity'
                },
                // labels: {
                //     format: '{value} gr'
                // },
                plotLines: [{
                    // color: 'black',
                    // dashStyle: 'dot',
                    width: 2,
                    // value: 65,
                    label: {
                        rotation: 0,
                        y: 15,
                        style: {
                            fontStyle: 'italic'
                        },
                        // text: 'Safe fat intake 65g/day'
                    },
                    zIndex: 3
                }],
                // accessibility: {
                //     rangeDescription: 'Range: 60 to 100 grams.'
                // }
            },

            yAxis: {
                startOnTick: false,
                endOnTick: false,
                title: {
                    text: 'Occurance'
                },
                // labels: {
                //     format: '{value} gr'
                // },
                maxPadding: 0.2,
                plotLines: [{
                    color: 'black',
                    // dashStyle: 'dot',
                    width: 2,
                    // value: 50,
                    label: {
                        align: 'right',
                        style: {
                            fontStyle: 'italic'
                        },
                        // text: 'Safe sugar intake 50g/day',
                        x: -10
                    },
                    zIndex: 3
                }],
                // accessibility: {
                //     rangeDescription: 'Range: 0 to 160 grams.'
                // }
            },

            tooltip: {
                useHTML: true,
                headerFormat: '<table>',
                pointFormat: '<tr><th colspan="2"><small>{point.name}</small></th></tr>' +
                    '<tr><th>{point.title}:</th><td>{point.event_duration}</td></tr>',
                // '<tr><th>Sugar intake:</th><td>{point.y}g</td></tr>' +
                // '<tr><th>Obesity (adults):</th><td>{point.z}%</td></tr>',
                footerFormat: '</table>',
                followPointer: true
            },

            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        format: '<small>{point.fullname}</small>',
                        color: '#ffffff'

                    },
                    style: {
                        fontSize: '14px'
                    },
                    allowDecimals: true,

                    color: this.bubbleColor
                    //fillColor: '#008080'


                }
            },

            series: [{
                data: this.activityData,
                // data: [
                //     { x: 95, y: 95, z: 13.8, name: 'BE', country: 'Belgium' },
                //     { x: 86.5, y: 102.9, z: 14.7, name: 'DE', country: 'Germany' },
                //     { x: 80.8, y: 91.5, z: 15.8, name: 'FI', country: 'Finland' },
                //     { x: 80.4, y: 102.5, z: 12, name: 'NL', country: 'Netherlands' },
                //     { x: 80.3, y: 86.1, z: 11.8, name: 'SE', country: 'Sweden' },
                //     { x: 78.4, y: 70.1, z: 16.6, name: 'ES', country: 'Spain' },
                //     { x: 74.2, y: 68.5, z: 14.5, name: 'FR', country: 'France' },
                //     { x: 73.5, y: 83.1, z: 10, name: 'NO', country: 'Norway' },
                //     { x: 71, y: 93.2, z: 24.7, name: 'UK', country: 'United Kingdom' },
                //     { x: 69.2, y: 57.6, z: 10.4, name: 'IT', country: 'Italy' },
                //     { x: 68.6, y: 20, z: 16, name: 'RU', country: 'Russia' },
                //     { x: 65.5, y: 126.4, z: 35.3, name: 'US', country: 'United States' },
                //     { x: 65.4, y: 50.8, z: 28.5, name: 'HU', country: 'Hungary' },
                //     { x: 63.4, y: 51.8, z: 15.4, name: 'PT', country: 'Portugal' },
                //     { x: 64, y: 82.9, z: 31.3, name: 'NZ', country: 'New Zealand' }
                // ]
            }
            ]

        }


        Highcharts.chart('scatter', this.chart2);


    }

    addpiechart1(content) {
        this.piechart1 = {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Total Resource Duration By Activity'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y:.1f} Hrs</b>'
            },
            accessibility: {
                point: {
                    valueSuffix: '%'
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.y:.1f} Hrs'
                    }
                }
            },
            series: [{
                name: 'Activity Frequency',
                colorByPoint: true,
                data: content
            }]
        }
        Highcharts.chart('piechart1', this.piechart1);

    }


    addpiechart2(content) {
        this.piechart2 = {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Total Resource Cost By Activity',
                center: true
            },
            tooltip: {
                pointFormat: '{series.name}: <b>${point.y:.1f}</b>'
            },
            accessibility: {
                point: {
                    valueSuffix: '%'
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: ${point.y:.1f}'
                    }
                }
            },
            series: [{
                name: 'Activity Cost',
                colorByPoint: true,
                data: content
            }]
        }


        //Highcharts.chart('piechart2', this.piechart2);

    }
    openVariantListNav() {   //variant list open
        document.getElementById("mySidenav").style.width = "310px";
        // document.getElementById("main").style.marginRight = "310px";
        // this.isvariantListOpen=false;
    }

    closeNav() { // Variant list Close
        document.getElementById("mySidenav").style.width = "0px";
        // document.getElementById("main").style.marginRight= "0px";
        // this.isvariantListOpen=true;
    }

    getAllVariantList() {
        let variantData = localStorage.getItem("variants")
        this.varaint_data = JSON.parse(atob(variantData));
        console.log(this.varaint_data);
        this.finalVariants = JSON.parse(atob(localStorage.getItem("variants")))
        this.onchangeVaraint('0');
        this.updatePartialVariantData();

    }

    caseParcent(parcent) {       // case persent value in variant list
        if (String(parcent).indexOf('.') != -1) {
            let perc = parcent.toString().split('.')
            // return parcent.toString().slice(0,5);
            return perc[0] + '.' + perc[1].slice(0, 2);
        } else {
            return parcent;
        }
    }
    timeConversion(millisec) {
        var seconds: any = (millisec / 1000).toFixed(1);
        var minutes: any = (millisec / (1000 * 60)).toFixed(1);
        var hours: any = (millisec / (1000 * 60 * 60)).toFixed(1);
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
    onchangeVaraint(datavariant) {      // Variant List sorting 
        // console.log(datavariant);
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
        //this.updatePartialVariantData();
    }

    updatePartialVariantData() {
        let vdata = this.finalVariants.data;

        vdata.sort(function (a, b) {
            return b.days - a.days;
        });


        let cutoff = Math.floor(vdata.length * 40 / 100);


        let pVData = [];
        for (var i = 0; i < vdata.length; i++) {
            if (cutoff <= i) break;
            pVData.push(vdata[i])
        }
        this.partialVariants = pVData.slice(0, 10);
        // console.log(this.partialVariants);
    }

    getVariantMedianDuration(selectedVariants) {
        // console.log(selectedVariants)
        if (selectedVariants.length == 0) {
            this.totalMedianDuration = this.bkp_totalMedianDuration;
        }
        else if (selectedVariants.length != this.varaint_data.data.length) {
            let full_median_value = 0;


            for (var i = 0; i < selectedVariants.length; i++) {
                var milliseconds = selectedVariants[i]["total_duration"] * 60 * 60 * 1000;
                full_median_value += milliseconds;
            }

            this.totalMedianDuration = full_median_value;
        } else {
            this.totalMedianDuration = this.bkp_totalMedianDuration;
        }
    }

    caseIdSelect(selectedData, index) { // Case selection on Variant list

        if (this.varaint_data.data[index].selected == "inactive") {
            var select = {
                case: selectedData.case,
                casepercent: selectedData.casepercent,
                name: selectedData.name,
                detail: selectedData.detail,
                days: selectedData.days,
                varaintDetails: selectedData.varaintDetails,
                casesCovred: selectedData.casesCovred,
                trace_number: selectedData.trace_number,
                case_value: selectedData.case_value,
                total_duration: selectedData.total_duration,
                selected: "active"
            };
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
                trace_number: selectedData.trace_number,
                case_value: selectedData.case_value,
                total_duration: selectedData.total_duration,
                selected: "inactive"
            };
            this.varaint_data.data[index] = select;
        }

        this.selectedCaseArry = [];
        let selectedVariantIds = [];
        this.totalVariantList = [];
        this.s_variants = [];
        // this.selectedTraceNumbers = [];
        for (var i = 0; i < this.varaint_data.data.length; i++) {
            if (this.varaint_data.data[i].selected == "active") {
                // var casevalue = this.varaint_data.data[i].case
                this.totalVariantList.push(this.varaint_data.data[i]);
                var index_v = i;
                var index_v2 = i+1;
                this.s_variants.push('Variant ' +index_v2);
                this.selectedCaseArry.push('Variant ' + index_v);
                // this.selectedTraceNumbers.push(this.varaint_data.data[i].trace_number)
                // console.log(this.varaint_data.data[i]);

                selectedVariantIds.push(this.varaint_data.data[i]);
            }
        };
        // console.log(selectedVariantIds)
        this.getVariantMedianDuration(selectedVariantIds);
        this.caselength = this.selectedCaseArry.length;

        // console.log(this.varaint_data.data.length);

        if (this.selectedCaseArry.length == this.varaint_data.data.length) {
            this.checkboxValue = true
            // this.options = Object.assign({}, this.options, {disabled: false});
        } else {
            this.checkboxValue = false
            // this.options = Object.assign({}, this.options, {disabled: true});
        }
        this.selectedResources = [];
        if (this.selectedCaseArry.length == 0) {
            this.getHumanBotCost('fullgraph');
            this.getActivityMetrics('fullgraph');
            this.getTotalNoOfCases('fullgraph');
        } else {
            this.getHumanBotCost('variant', this.s_variants);
            this.getActivityMetrics('variant', this.selectedCaseArry);
            this.getTotalNoOfCases('variant');
            //this.onResourceSelect();
        }
    }
    selectAllVariants() {   // Select all variant list
        let selectedIndices = [];
        if (this.checkboxValue == true) {
            for (var i = 0; i < this.varaint_data.data.length; i++) {

                selectedIndices.push(this.varaint_data.data[i]);
                this.varaint_data.data[i].selected = "active";
            }
        } else {
            for (var i = 0; i < this.varaint_data.data.length; i++) {
                this.varaint_data.data[i].selected = "inactive";

            }
        }
        this.getVariantMedianDuration(selectedIndices);
        this.getHumanBotCost('fullgraph');
        this.getActivityMetrics('fullgraph');
        this.getTotalNoOfCases('fullgraph');
    }

    editInput() {
        this.isEditable = !this.isEditable
    }
    editInput1() {
        this.isEditable1 = !this.isEditable1
    }

    getAllGraphsPriceCalculation() {
        this.getTotalNoOfCases('fullgraph');
        this.getActivityMetrics('fullgraph');
        this.getHumanBotCost('fullgraph');
    }

    switch1(data) {
        if (data == "bar") {
            this.flag1 = 0
            this.verticleBarGraph();
        } else if (data == "pie") {
            this.flag1 = 1;
            this.swithToPeiCart()
        }
    }

    swithToPeiCart() {
        this.piechart3 = {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Browser market shares in January, 2018'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            accessibility: {
                point: {
                    valueSuffix: '%'
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                    }
                }
            },
            series: [{
                name: 'Brands',
                colorByPoint: true,
                data: [{
                    name: 'Chrome',
                    y: 61.41,
                    sliced: true,
                    selected: true
                }, {
                    name: 'Internet Explorer',
                    y: 11.84
                }, {
                    name: 'Firefox',
                    y: 10.85
                }, {
                    name: 'Edge',
                    y: 4.67
                }, {
                    name: 'Safari',
                    y: 4.18
                }, {
                    name: 'Sogou Explorer',
                    y: 1.64
                }, {
                    name: 'Opera',
                    y: 1.6
                }, {
                    name: 'QQ',
                    y: 1.2
                }, {
                    name: 'Other',
                    y: 2.61
                }]
            }]
        }
        Highcharts.chart('barGraph', this.piechart3);
    }
    switchTostackedBar(value) {
        //   console.log(value);
        if (value == "stackedbar") {
            this.isstackedbarChart = true
            this.scatterBarchart()
        } else {
            this.isstackedbarChart = false
            // this.addpiechart1([])
        }
    }

    switchTostackedBar1(value) {
        if (value == "stackedbar") {
            this.isstackedbarChart1 = true
            this.scatterBarchart1()
        } else {
            this.isstackedbarChart1 = false
            // this.addpiechart2([])
        }
    }
    scatterBarchart() {
        this.stackedChart = {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Stacked column chart'
            },
            xAxis: {
                categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Total fruit consumption'
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: ( // theme
                            Highcharts.defaultOptions.title.style &&
                            Highcharts.defaultOptions.title.style.color
                        ) || 'gray'
                    }
                }
            },
            legend: {
                align: 'right',
                x: -30,
                verticalAlign: 'top',
                y: 25,
                floating: true,
                backgroundColor:
                    Highcharts.defaultOptions.legend.backgroundColor || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: [{
                name: 'John',
                data: [5, 3, 4, 7, 2]
            }, {
                name: 'Jane',
                data: [2, 2, 3, 2, 1]
            }, {
                name: 'Joe',
                data: [3, 4, 4, 2, 5]
            }]
        }
        Highcharts.chart('piechart1', this.stackedChart);
    }
    scatterBarchart1() {
        this.stackedChart = {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Stacked column chart'
            },
            xAxis: {
                categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Total fruit consumption'
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: ( // theme
                            Highcharts.defaultOptions.title.style &&
                            Highcharts.defaultOptions.title.style.color
                        ) || 'gray'
                    }
                }
            },
            legend: {
                align: 'right',
                x: -30,
                verticalAlign: 'top',
                y: 25,
                floating: true,
                backgroundColor:
                    Highcharts.defaultOptions.legend.backgroundColor || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: [{
                name: 'John',
                data: [5, 3, 4, 7, 2]
            }, {
                name: 'Jane',
                data: [2, 2, 3, 2, 1]
            }, {
                name: 'Joe',
                data: [3, 4, 4, 2, 5]
            }]
        }
        Highcharts.chart('piechart2', this.stackedChart);
    }


    getDonutChart2(data){
        this.dChart2 = {
            chart: {
                type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 45
                }
            },
            title: {
                text: 'Total Resource Cost By Activity'
            },
            subtitle: {
                text: ''
            },
            plotOptions: {
                pie: {
                    innerSize: 60,
                    depth: 45
                }
            },
            series: [{
                name: 'Activity Cost',
                data: data
            }]
        }
        Highcharts.chart('piechart2', this.dChart2);
    }

    getDonutChart1(data){
        this.dChart1 = {
            chart: {
                type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 45
                }
            },
            title: {
                text: 'Total Resource Duration By Activity'
            },
            subtitle: {
                text: ''
            },
            plotOptions: {
                pie: {
                    innerSize: 60,
                    depth: 45
                }
            },
            series: [{
                name: 'Activity Duration(hrs)',
                data: data
            }]
        }
        Highcharts.chart('piechart1', this.dChart1);
    }

    loadPeiChart1(data1,colorValues){
        console.log(data1, colorValues);
        
        var width = 450
        var height = 350
        var margin = 80
    
    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius = Math.min(width, height) / 2 - margin
    
    // append the svg object to the div called 'my_dataviz'
    d3.select("#piechart1").select('svg').remove()
    var svg = d3.select("#piechart1")
      .append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    
    // Create dummy data
    var data = data1[0]
    
    // set the color scale
    var color = d3.scaleOrdinal()
      .domain(colorValues)
      .range(d3.schemeDark2);
    
    // Compute the position of each group on the pie:
    var pie = d3.pie()
      .sort(null) // Do not sort group by size
      .value(function(d) {return d.value; })
    var data_ready = pie(d3.entries(data))
    
    // The arc generator
    var arc = d3.arc()
      .innerRadius(radius * 0.5)         // This is the size of the donut hole
      .outerRadius(radius * 0.8)
    
    // Another arc that won't be drawn. Just for labels positioning
    var outerArc = d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9)
    
    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
      .selectAll('allSlices')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', function(d){ return(color(d.data.key)) })
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.7)
      .on("mouseover", function (d) {
        console.log(d);
        
    d3.select("#pietooltip")
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY) + "px")
        .style("display", "block")
        .select("#value")
        .text(d.data.value);

         d3.select("#tooltip_head")
        .text(d.data.key)
    })
    .on("mouseout", function () {
    // Hide the tooltip
    d3.select("#pietooltip")
        .style("display", "none");
    });
    
    // Add the polylines between chart and labels:
    svg
      .selectAll('allPolylines')
      .data(data_ready)
      .enter()
      .append('polyline')
        .attr("stroke", "black")
        .style("fill", "none")
        .attr("stroke-width", 1)
        .attr('points', function(d) {
          var posA = arc.centroid(d) // line insertion in the slice
          var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
          var posC = outerArc.centroid(d); // Label position = almost the same as posB
          var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
          posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
          return [posA, posB, posC]
        })
    
    // Add the polylines between chart and labels:
    svg
      .selectAll('allLabels')
      .data(data_ready)
      .enter()
      .append('text')
        .text( function(d) { console.log(d.data.key) ; return d.data.key } )
        .attr('transform', function(d) {
            var pos = outerArc.centroid(d);
            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
            return 'translate(' + pos + ')';
        })
        .style('text-anchor', function(d) {
            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            return (midangle < Math.PI ? 'start' : 'end')
        }).on("mouseover", function (d) {
            console.log(d3.event);
            
        d3.select("#pietooltip")
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY) + "px")
            .style("display", "block")
            .select("#value")
            .text(d.data.value);

             d3.select("#tooltip_head")
            .text(d.data.key)
        })
        .on("mouseout", function () {
        // Hide the tooltip
        d3.select("#pietooltip")
            .style("display", "none");
        });
        
            }

loadPeiChart2(data1,colorValues){
    console.log(data1);
    
    var width = 450
    var height = 340
    var margin = 80

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(width, height) / 2 - margin

// append the svg object to the div called 'my_dataviz'
d3.select("#piechart2").select('svg').remove()
var svg = d3.select("#piechart2")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// Create dummy data
var data = data1[0]

// set the color scale
var color = d3.scaleOrdinal()
  .domain(colorValues)
  .range(d3.schemeDark2);

// Compute the position of each group on the pie:
var pie = d3.pie()
  .sort(null) // Do not sort group by size
  .value(function(d) {return d.value; })
var data_ready = pie(d3.entries(data))

// The arc generator
var arc = d3.arc()
  .innerRadius(radius * 0.5)         // This is the size of the donut hole
  .outerRadius(radius * 0.8)

// Another arc that won't be drawn. Just for labels positioning
var outerArc = d3.arc()
  .innerRadius(radius * 0.9)
  .outerRadius(radius * 0.9)

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
svg
  .selectAll('allSlices')
  .data(data_ready)
  .enter()
  .append('path')
  .attr('d', arc)
  .attr('fill', function(d){ return(color(d.data.key)) })
  .attr("stroke", "white")
  .style("stroke-width", "2px")
  .style("opacity", 0.7)
  .on("mouseover", function (d) {
    console.log(d);  
    d3.select("#pietooltip1")
    .style("left", (d3.event.pageX) + "px")
    .style("top", (d3.event.pageY) + "px")
    .style("display", "block")
    .select("#value1")
    .text(d.data.value);

     d3.select("#tooltip_head1")
    .text(d.data.key)
})
.on("mouseout", function () {
// Hide the tooltip
d3.select("#pietooltip1")
    .style("display", "none");
});

// Add the polylines between chart and labels:
svg
  .selectAll('allPolylines')
  .data(data_ready)
  .enter()
  .append('polyline')
    .attr("stroke", "black")
    .style("fill", "none")
    .attr("stroke-width", 1)
    .attr('points', function(d) {
      var posA = arc.centroid(d) // line insertion in the slice
      var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
      var posC = outerArc.centroid(d); // Label position = almost the same as posB
      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
      posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
      return [posA, posB, posC]
    })

// Add the polylines between chart and labels:
svg
  .selectAll('allLabels')
  .data(data_ready)
  .enter()
  .append('text')
    .text( function(d) { console.log(d.data.key) ; return d.data.key } )
    .attr('transform', function(d) {
        var pos = outerArc.centroid(d);
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
        return 'translate(' + pos + ')';
    })
    .style('text-anchor', function(d) {
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        return (midangle < Math.PI ? 'start' : 'end')
    })
    .on("mouseover", function (d) {
        console.log(d);  
        d3.select("#pietooltip1")
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY) + "px")
        .style("display", "block")
        .select("#value1")
        .text(d.data.value);
    
         d3.select("#tooltip_head1")
        .text(d.data.key)
        })
        .on("mouseout", function () {
        // Hide the tooltip
        d3.select("#pietooltip1")
            .style("display", "none");
        });
    }
    openHrsOverLay(){
        this.isAddHrs=!this.isAddHrs
    }
    canceladdHrs(){
         this.isAddHrs=!this.isAddHrs;
    }

    getBusinessInsights(){
        let reqObj={};
        reqObj={
            "data_type":"bussiness_insights",
            "pid":this.graphIds,
            "workingHours": this.workingHours.formDay+"-"+this.workingHours.toDay+" "+this.workingHours.shiftStartTime+":00-"+this.workingHours.shiftEndTime+":00"
            }
            let bi_data:any
           // this.spinner.show();
        this.rest.getBIinsights(reqObj).subscribe((res: any) => {
        bi_data=res
        // if(bi_data.data){
            let bi_data1=bi_data.data.maximumDays;
            let bi_data2=bi_data.data.minimumDays;
            this.biDataMaxDays=bi_data1.max_days
            this.biDataMinDays=bi_data2.min_days
            if(String(bi_data1.max_percent).indexOf('.') != -1){
                let perc=bi_data1.max_percent.toString().split('.')
                this.biDataMaxPerct=perc[0]+'.'+perc[1].slice(0,2);
            }else{
                this.biDataMaxPerct=bi_data1.max_percent
            }

            if(String(bi_data2.min_percent).indexOf('.') != -1){
                let perc=bi_data2.min_percent.toString().split('.')
                this.biDataMinPerct=perc[0]+'.'+perc[1].slice(0,2);
            }else{
                this.biDataMinPerct=bi_data2.min_percent
            }
        // }
       // this.spinner.hide();
            
        })
    }

    // loopTrackBy(index, term){
    //     return index;
    //   }
    ActivityTimeChart(){
        am4core.useTheme(am4themes_animated);
        // Themes end
        
        var chart = am4core.create("pie_chart1", am4charts.PieChart);
        chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
        chart.legend = new am4charts.Legend();
        chart.legend.useDefaultMarker = true;
        var marker = chart.legend.markers.template.children.getIndex(0);
        marker.strokeWidth = 2;
        marker.strokeOpacity = 1;
        marker.stroke = am4core.color("#ccc");
        chart.legend.scrollable = true;
        chart.legend.fontSize = 12;
  
        // chart.data=data;
        chart.data=this.dChart1;
  
        chart.legend.position = "right";
        chart.legend.valign = "middle";
        chart.innerRadius = 70;
        var label = chart.seriesContainer.createChild(am4core.Label);
          // label.text = "230,900 Sales";
        // label.horizontalCenter = "middle";
        // label.verticalCenter = "middle";
        label.fontSize = 18;
        var series = chart.series.push(new am4charts.PieSeries());
        series.dataFields.value = "value";
        series.dataFields.category = "name";
        series.labels.template.disabled = false;
        // series.slices.template.cornerRadius = 0;
        series.tooltip.horizontalCenter = "middle";
        // series.tooltip.verticalCenter = "middle";
        // series.tooltip.fontSize=18;
        // series.tooltipText = ' {name} ({_dataContext.totalDuration1})';
        // series.slices.template.tooltipText = "{parent.parent.name} {parent.name} > {name} ({value})";
        // series.columns.template.tooltipText = " caseId : {categoryX} \n  Duration : {valueY}[/] ";
        // series.tooltip.text = " caseId";
        // series.adapter.add("tooltipText", function(text, target) {
        //   console.log(text,target.dataItem)
        //   return "{_dataContext.activity} \n {_dataContext.totalDuration1}";
        // });
        var _self=this;
        series.slices.template.adapter.add("tooltipText", function(text, target) {
          // var text=_self.getTimeConversion('{_dataContext.totalDuration}');
          return "{_dataContext.name} \n {_dataContext.value}";
        });
        series.labels.template.text = "{_dataContext.label}";
        series.colors.list = [
            am4core.color("rgba(85, 216, 254, 0.9)"),
            am4core.color("rgba(255, 131, 115, 0.9)"),
            am4core.color("rgba(255, 218, 131, 0.9)"),
            am4core.color("rgba(163, 160, 251, 0.9)"),
            am4core.color("rgba(156, 39, 176, 0.9)"),
            am4core.color("rgba(103, 58, 183, 0.9)"),
            am4core.color("rgba(63, 81, 181, 0.9)"),
            am4core.color("rgba(33, 150, 243, 0.9)"),
            am4core.color("rgba(3, 169, 244, 0.9)"),
            am4core.color("rgba(0, 188, 212, 0.9)"),
            am4core.color("rgba(244, 67, 54, 0.9)"),
            am4core.color("rgba(233, 33, 97, 0.9)"),
            am4core.color("rgba(220, 103, 171, 0.9)"),
            am4core.color("rgba(220, 103, 206, 0.9)"),
            am4core.color("rgba(199, 103, 220, 0.9)"),
            am4core.color("rgba(163, 103, 220, 0.9)"),
            am4core.color("rgba(103, 113, 220, 0.9)"),
            am4core.color("rgba(0, 136, 86, 0.9)"),
            am4core.color("rgba(243, 195, 0, 0.9)"),
            am4core.color("rgba(243, 132, 0, 0.9)"),
            am4core.color("rgba(143, 13, 20, 0.9)"),
        ];
    }

    resourceCostByActivity(){
        am4core.useTheme(am4themes_animated);
        // Themes end
        
        var chart = am4core.create("pie_chart2", am4charts.PieChart);
        chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
        chart.legend = new am4charts.Legend();
        chart.legend.useDefaultMarker = true;
        var marker = chart.legend.markers.template.children.getIndex(0);
        marker.strokeWidth = 2;
        marker.strokeOpacity = 1;
        marker.stroke = am4core.color("#ccc");
        chart.legend.scrollable = true;
        chart.legend.fontSize = 12;
  
        // chart.data=data;
        chart.data=this.dChart2;
  
        chart.legend.position = "right";
        chart.legend.valign = "middle";
        chart.innerRadius = 70;
        var label = chart.seriesContainer.createChild(am4core.Label);
          // label.text = "230,900 Sales";
        // label.horizontalCenter = "middle";
        // label.verticalCenter = "middle";
        label.fontSize = 18;
        var series = chart.series.push(new am4charts.PieSeries());
        series.dataFields.value = "value";
        series.dataFields.category = "name";
        series.labels.template.disabled = false;
        // series.slices.template.cornerRadius = 0;
        series.tooltip.horizontalCenter = "middle";
        // series.tooltip.verticalCenter = "middle";
        // series.tooltip.fontSize=18;
        // series.tooltipText = ' {name} ({_dataContext.totalDuration1})';
        // series.slices.template.tooltipText = "{parent.parent.name} {parent.name} > {name} ({value})";
        // series.columns.template.tooltipText = " caseId : {categoryX} \n  Duration : {valueY}[/] ";
        // series.tooltip.text = " caseId";
        // series.adapter.add("tooltipText", function(text, target) {
        //   console.log(text,target.dataItem)
        //   return "{_dataContext.activity} \n {_dataContext.totalDuration1}";
        // });
        var _self=this;
        series.slices.template.adapter.add("tooltipText", function(text, target) {
          // var text=_self.getTimeConversion('{_dataContext.totalDuration}');
          return "{_dataContext.name} \n {_dataContext.value}";
        });
        series.labels.template.text = "{_dataContext.label}";
        series.colors.list = [
            am4core.color("rgba(85, 216, 254, 0.9)"),
            am4core.color("rgba(255, 131, 115, 0.9)"),
            am4core.color("rgba(255, 218, 131, 0.9)"),
            am4core.color("rgba(163, 160, 251, 0.9)"),
            am4core.color("rgba(156, 39, 176, 0.9)"),
            am4core.color("rgba(103, 58, 183, 0.9)"),
            am4core.color("rgba(63, 81, 181, 0.9)"),
            am4core.color("rgba(33, 150, 243, 0.9)"),
            am4core.color("rgba(3, 169, 244, 0.9)"),
            am4core.color("rgba(0, 188, 212, 0.9)"),
            am4core.color("rgba(244, 67, 54, 0.9)"),
            am4core.color("rgba(233, 33, 97, 0.9)"),
            am4core.color("rgba(220, 103, 171, 0.9)"),
            am4core.color("rgba(220, 103, 206, 0.9)"),
            am4core.color("rgba(199, 103, 220, 0.9)"),
            am4core.color("rgba(163, 103, 220, 0.9)"),
            am4core.color("rgba(103, 113, 220, 0.9)"),
            am4core.color("rgba(0, 136, 86, 0.9)"),
            am4core.color("rgba(243, 195, 0, 0.9)"),
            am4core.color("rgba(243, 132, 0, 0.9)"),
            am4core.color("rgba(143, 13, 20, 0.9)"),
        ];   
    }
  

}
