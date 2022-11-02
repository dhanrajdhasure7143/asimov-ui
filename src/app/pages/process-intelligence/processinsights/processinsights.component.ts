import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { RestApiService } from '../../services/rest-api.service';
import HC_more from 'highcharts/highcharts-more' //module
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { DataTransferService } from '../../services/data-transfer.service';
import { PiHints } from '../model/process-intelligence-module-hints';
import { GlobalScript } from 'src/app/shared/global-script';
import { NgxSpinnerService } from "ngx-spinner";
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import * as $ from 'jquery'
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
    input1: any = 100;
    input2: any = 1;
    robotinput:any = 5;
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
  view1:any[] = [600, 340]

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
bubbleData1:any[]=[];
isevents_chart:boolean=true;
isduration_chart:boolean=false;
xAxisLabel_duration: string = 'Activity';
yAxisLabel_duration: string = 'Duration(Hrs)';
// maxRadius_duration: number = 1000;
minRadius_duration: number = 0;
yScaleMin_duration: number = 0;
// yScaleMax: number = 200;


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
        if(localStorage.getItem("humanCost")){
            this.input1 = localStorage.getItem("humanCost");
        }
        if(localStorage.getItem("robotCost")){
            this.robotinput = localStorage.getItem("robotCost");
        }
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
            data_type: 'variant_metrics',
            "workingHours": this.workingHours.formDay+"-"+this.workingHours.toDay+" "+this.workingHours.shiftStartTime+":00-"+this.workingHours.shiftEndTime+":00"
        }
        this.rest.getPIInsightMeanMedianDuration(reqObj)
            .subscribe((res: any) => {
                this.variant_Duration_list = res.data;
                this.totalMeanDuration = res.totalMeanDuration;
                this.bkp_totalMedianDuration = res["data"]["total"]["totalDuration"];
                this.totalMedianDuration = this.bkp_totalMedianDuration;
            },
                (err => {
                }))

    }

    calculateSavings(val) {
        if (val && this.input1 && this.input2) {
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
        var dd = this.timeConversion(7187760000);
    }

    getHumanBotCost(from: string, varinatArray?: any) {
        var reqObj: any;
        if (from == 'fullgraph') {
            reqObj = {
                pid: this.graphIds,
                flag: false,
                data_type: "human_bot",
                "workingHours": this.workingHours.formDay+"-"+this.workingHours.toDay+" "+this.workingHours.shiftStartTime+":00-"+this.workingHours.shiftEndTime+":00"
            }
        } else {
            reqObj = {
                pid: this.graphIds,
                flag: true,
                data_type: "human_bot",
                variants: varinatArray //if flag is true
            }
        }
        this.rest.getPIInsightMeanMedianDuration(reqObj)
            .subscribe((res: any) => {
                this.insight_human_robot_cost = res.data;
                this.getHumanvsBotCost(this.insight_human_robot_cost);
                if (from == 'fullgraph') {
                    this.getResources(this.insight_human_robot_cost);
                }
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
        resources.sort(function(a, b){
            if(a.item_text < b.item_text) { return -1; }
            if(a.item_text > b.item_text) { return 1; }
            return 0;
        })
        this.resourcesList = resources;
    }

    onResourceSelect(isAllSelect?: boolean) {
        var r_flag = 'SINGLE';
        let selected_resources = [];
        let aResources = this.selectedResources;
        if (isAllSelect == true){
            r_flag = 'ALL';
         aResources = this.resourcesList;
        } 
        if (aResources.length == 0 || isAllSelect == false) {
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
                "resourceFlag": r_flag,
                "variants": selected_variants,
                "resources": selected_resources,
                "workingHours": this.workingHours.formDay+"-"+this.workingHours.toDay+" "+this.workingHours.shiftStartTime+":00-"+this.workingHours.shiftEndTime+":00"
            }
            this.rest.getPIInsightResourceSelection(reqObj)
                .subscribe((res: any) => {
                    this.totalMedianDuration = res.data.total.totalDuration;
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
                        this.activityData = adata;
                        this.bubbleData = [{name:"", series: this.activityData}];
                        this.colorScheme1 = {
                            domain: ['#fc8d45']
                          };
                        this.yAxisLabel1="Occurences";
                        this.getEventBubboleGraph('event')
                        activityDuration = tmp;
                        activityCost = tmp2;
                        this.dChart1 = activityDuration;
                        this.dChart2 = activityCost;
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

        vData.dates_data.forEach(e => {
            dateArray.push(moment(new Date(e.date)).format('DD/MM/YYYY'));
            var humanCost = Math.round(this.getHours(e.median_value) * this.input1);
            hCost.push(humanCost);
            var rDuration = Math.round(this.getHours(e.median_value) * 60 / 100);
            var rHours = Math.round(rDuration);
            var rFinalCost = rHours * this.robotinput;
            rCost.push(rFinalCost);
            d1.push({ name: moment(new Date(e.date)).format('DD/MM/YYYY'), value: humanCost })
            d2.push({ name: moment(new Date(e.date)).format('DD/MM/YYYY'), value: rFinalCost })
            d3.push({ value1: humanCost, name1: "Human Cost", name2: "Bot Cost", value2: rFinalCost, date: moment(new Date(e.date)).format('yyyy,MM,DD'), date1: moment(new Date(e.date)).format('DD/MM/YYYY'), })
        });

        this.caseIDs = dateArray;
        this.humanCost = hCost;
        this.robotCost = rCost;

        this.multi = [{ name: "Human Cost", series: d1 }, { name: 'Bot Cost', series: d2 }];
        let chart = am4core.create("linechart1", am4charts.XYChart);

        // Add data
        chart.data = d3
        // Create axes
        let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.minGridDistance = 50;
        dateAxis.renderer.labels.template.text = "date1"
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
        series2.stroke = series.stroke;
        // Add cursor
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.xAxis = dateAxis;
        series2.stroke = am4core.color("#fc8d45");
        $('g:has(> g[stroke="#3cabff"])').hide();
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
                pid: this.graphIds,
                data_type: 'variant_activity_metrics',
                flag: false,
                "workingHours": this.workingHours.formDay+"-"+this.workingHours.toDay+" "+this.workingHours.shiftStartTime+":00-"+this.workingHours.shiftEndTime+":00"
            }
        } else {
            reqObj = {
                pid: this.graphIds,
                data_type: 'variant_activity_metrics',
                flag: true,
                variants: selected_variants //if flag is true
            }
        }
        this.rest.getPIVariantActivity(reqObj)
            .subscribe((res: any) => {
                var aData = res.data;
                this.activity_Metrics = aData.data;
                let activityDuration = [];
                let activityCost = [];
                let obj1 = {}
                let pieArray=[]
                let obj3 = {}
                aData.data.forEach((e, m) => {
                    let duration = e.Duration_range / (1000 * 60 * 60);
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
                });
                this.bubbleData = [{name:"", series: this.activityData}];
                this.colorScheme1 = {
                    domain: ['#fc8d45']
                  };
                this.dChart1 = activityDuration;
                this.dChart2 = activityCost;
                this.ActivityTimeChart();
                this.resourceCostByActivity();
                this.getActivityWiseHumanvsBotCost(this.activity_Metrics);
                this.getActivityTableData(this.activity_Metrics);
                this.isEventGraph = true;
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
        var hCost = [];
        var rCost = [];
        var ac_list = [];
        activityMetrics.forEach(e => {
            ac_list.push(e.Activity);
            var humanCost = Math.round(this.getHours(e.Duration_range) * this.input1);
            hCost.push({name:e.Activity, value:humanCost});
            var rDuration = Math.round(this.getHours(e.Duration_range) * 60 / 100);
            var rHours = Math.round(rDuration);
            var rFinalCost = rHours * this.robotinput;
            rCost.push({name:e.Activity, value:rFinalCost});
        });
        this.barChart = hCost;
        this.lineChartSeries = [{name:"Bot Cost",series:rCost}];
    }

    getEventBubboleGraph(type) {
        this.activityData = [];
        if (type && type == 'event') {
            this.isduration_chart=false;
            this.isevents_chart=true;
        this.activity_Metrics.forEach((e, m) => {
                this.activityData.push({ x: e.Activity, y: e.Frequency, r: e.Frequency, name: e.Activity, fullname: e.Activity.split(/\s/).reduce((response, word) => response += word.slice(0, 1), ''), title: 'No of Events', event_duration: e.Frequency });
                this.bubbleColor = '#212F3C';
                this.isEventGraph = true;
                this.bubbleData = [{name:"", series: this.activityData}];
                this.colorScheme1 = {
                    domain: ['#fc8d45']
                  };
                  this.yAxisLabel1 = 'Occurences';
            })
            } else {
                this.isduration_chart=true;
                this.isevents_chart=false;
                this.activity_Metrics.forEach((e, m) => {
                this.activityData.push({ x: e.Activity, y: Number(this.getHours(e.Duration_range)), r: Number(this.getHours(e.Duration_range)), name: e.Activity, fullname: e.Activity.split(/\s/).reduce((response, word) => response += word.slice(0, 1), ''), title: 'Duration', event_duration: this.timeConversion(e.Duration_range) });
                this.bubbleColor = '#008080';
                this.isEventGraph = false;
                this.colorScheme1 = {
                    domain: ['#3EC1A4']
                  };
                  this.yAxisLabel1 = 'Duration(Hrs)';
                });                
                setTimeout(() => {
                this.bubbleData1 = [{name:"", series: this.activityData}];
                }, 500);
            }
    }

    getHours3(millisec) {
        var hours: any = (millisec / (1000 * 60 * 60)).toFixed(1);
        if (String(hours).indexOf('.') != -1) {
            let week = hours.toString().split('.')
            hours = week[0];
        } else {
            hours = hours;
        }
        return hours;
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
            this.totalVariantList.forEach(e => {
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


    openVariantListNav() {   //variant list open
        document.getElementById("mySidenav").style.width = "310px";
    }

    closeNav() { // Variant list Close
        document.getElementById("mySidenav").style.width = "0px";
    }

    getAllVariantList() {
        let variantData = localStorage.getItem("variants")
        this.varaint_data = JSON.parse(atob(variantData));
        this.finalVariants = JSON.parse(atob(localStorage.getItem("variants")))
        this.onchangeVaraint('0');
        this.updatePartialVariantData();
    }

    caseParcent(parcent) {       // case persent value in variant list
        if (String(parcent).indexOf('.') != -1) {
            let perc = parcent.toString().split('.')
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
            return seconds + " sec";
        } else if (minutes < 60) {
            return minutes + " min";
        } else if (hours < 24) {
            return hours + " hrs";
        } else {
            return days + " days"
        }
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
    }

    getVariantMedianDuration(selectedVariants) {
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
        for (var i = 0; i < this.varaint_data.data.length; i++) {
            if (this.varaint_data.data[i].selected == "active") {
                this.totalVariantList.push(this.varaint_data.data[i]);
                var index_v = i;
                var index_v2 = i+1;
                this.s_variants.push('Variant ' +index_v2);
                this.selectedCaseArry.push('Variant ' + index_v);
                selectedVariantIds.push(this.varaint_data.data[i]);
            }
        };
        this.getVariantMedianDuration(selectedVariantIds);
        this.caselength = this.selectedCaseArry.length;
        if (this.selectedCaseArry.length == this.varaint_data.data.length) {
            this.checkboxValue = true
        } else {
            this.checkboxValue = false
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
        localStorage.setItem("humanCost",this.input1)
        localStorage.setItem("robotCost",this.robotinput)
        this.getTotalNoOfCases('fullgraph');
        this.getActivityMetrics('fullgraph');
        this.getHumanBotCost('fullgraph');
        this.selectedResources=[];
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
        this.rest.getBIinsights(reqObj).subscribe((res: any) => {
        bi_data=res
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
            
        })
    }

    ActivityTimeChart(){
        this.dChart1.sort(function (a,b){
            return b.value - a.value
        })
        am4core.useTheme(am4themes_animated);
        // Themes end
        var chart = am4core.create("pie_chart1", am4charts.PieChart);
        chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
        chart.legend = new am4charts.Legend();
        chart.legend.useDefaultMarker = true;
        var marker = chart.legend.markers.template.children.getIndex(0);
        marker.width = 18;
        marker.height = 18;
        marker.strokeWidth = 2;
        marker.strokeOpacity = 1;        
        marker.stroke = am4core.color("#ccc");
        chart.legend.scrollable = true;
        chart.legend.fontSize = 12;
        chart.data=this.dChart1;
        chart.legend.position = "right";
        chart.legend.valign = "middle";
        chart.innerRadius = 70;
        var label = chart.seriesContainer.createChild(am4core.Label);
        label.fontSize = 18;
        var series = chart.series.push(new am4charts.PieSeries());
        series.dataFields.value = "value";
        series.dataFields.category = "name";
        series.labels.template.disabled = true;
        var _self=this;
        series.slices.template.adapter.add("tooltipText", function(text, target) {
          return "{_dataContext.name} \n {_dataContext.label}";
        });
        $('g:has(> g[stroke="#3cabff"])').hide();
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
        this.dChart2.sort(function(a,b){
            return b.value-a.value
        })
        am4core.useTheme(am4themes_animated);
        // Themes end
        var chart = am4core.create("pie_chart2", am4charts.PieChart);
        chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
        chart.legend = new am4charts.Legend();
        chart.legend.useDefaultMarker = true;
        var marker = chart.legend.markers.template.children.getIndex(0);
        marker.width = 18;
        marker.height = 18;
        marker.strokeWidth = 2;        
        marker.strokeOpacity = 1;
        marker.stroke = am4core.color("#fff");
        chart.legend.scrollable = true;
        chart.legend.fontSize = 12;
        chart.data=this.dChart2;
        chart.legend.position = "right";
        chart.legend.valign = "middle";
        chart.innerRadius = 70;
        var label = chart.seriesContainer.createChild(am4core.Label);
        label.fontSize = 18;
        var series = chart.series.push(new am4charts.PieSeries());
        series.dataFields.value = "value";
        series.dataFields.category = "name";
        series.labels.template.disabled = true;
        var _self=this;
        series.slices.template.adapter.add("tooltipText", function(text, target) {
          return "{_dataContext.name} \n {_dataContext.label}";
        });
        series.labels.template.text = "{_dataContext.label}";
        $('g:has(> g[stroke="#3cabff"])').hide();
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

    loopTrackBy(index, term) {
        return index;
      }
  
}
