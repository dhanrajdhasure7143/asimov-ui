import { Component, OnInit } from '@angular/core';
 import * as Highcharts from 'highcharts';
import { RestApiService } from '../../services/rest-api.service';
import HC_more from 'highcharts/highcharts-more' //module
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { DataTransferService } from '../../services/data-transfer.service';
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
  chart1:any;
  verticleGraph:any;
  table1:any=[];
  chart2:any;
  piechart1:any
  piechart2:any;
  isvariantListOpen:boolean=true;
  isEventGraph:boolean=true;
  input1:any=20;
  input2:any=1;
  variant_list:any;
  varaint_data: any;
  select_varaint:any;
  variant_list_options;
  selectedCaseArry:any=[];
  public caselength: number;
  checkboxValue:boolean=false;
  isEditable:boolean=false;
  isEditable1:boolean=false;
  variant_Duration_list:any = [];
  totalMeanDuration:any;
  totalMedianDuration:any;
  bkp_totalMedianDuration:any;
  insight_human_robot_cost:any = [];
  graphIds:any;
  caseIDs:any = [];
  humanCost:any = [];
  robotCost:any = [];
  activityData:any = [];
  flag=0;
  flag1=0;
  flag2=0;
  piechart3:any;
  isstackedbarChart:boolean=false;
  isstackedbarChart1:boolean=false;
  stackedChart: any;
  activity_Metrics:any = [];
  bubbleColor:any;
  activityHumanCost:any = [];
  activityBotCost:any = [];
  list_Activites:any = [];
  
  constructor(
      private rest:RestApiService,
      private route:ActivatedRoute,
      private dt:DataTransferService
      ) { }

  ngOnInit() {
    this.dt.changeParentModule({ "route": "/pages/processIntelligence/upload", "title": "Process Intelligence" });
    this.dt.changeChildModule({ "route": "/pages/processIntelligence/insights", "title": "Insights" });
      var piId;
    this.route.queryParams.subscribe(params => {
        if(params['wpiId']!=undefined){
            let wpiIdNumber = parseInt(params['wpiId']);
            piId=wpiIdNumber;
            this.graphIds = piId;
          }
        });
    this.variant_list = Object.keys(VariantList).filter(val => isNaN(VariantList[val]));
    this.variant_list_options = VariantList;
    this.table1=[{value1:"value1",value2:"value2",value3:"value3"},{value1:"value1",value2:"value2",value3:"value3"},{value1:"value1",value2:"value2",value3:"value3"},{value1:"value1",value2:"value2",value3:"value3"}]
    // this.addcharts();
    // this.addchart2();
    //this.verticleBarGraph();
    this.addpiechart1();
    this.addpiechart2();
    this.getAllVariantList()

    this.getDurationCall();
    this.getActivityMetrics();
    this.getHumanBotCost('fullgraph')
  }

  getDurationCall(){
      var reqObj = {
          //pid: this.graphIds,
          pid:'671229',
          data_type:'variant_metrics'
      }
      this.rest.getPIInsightMeanMedianDuration(reqObj)
        .subscribe((res:any)=>{
            console.log(res);
            this.variant_Duration_list = res.data;
            this.totalMeanDuration = res.totalMeanDuration;
            this.bkp_totalMedianDuration = res["data"]["total"]["median"]
            this.totalMedianDuration = this.bkp_totalMedianDuration;
        },
        (err=>{
            console.log("Internal server error, Please try again later.")
        }))
        
  }

  calculateSavings(){
    if(this.totalMedianDuration && this.input1 && this.input2){
        //assume robo cost per hr is 8$
        let roboCost = this.totalMedianDuration*60*8/(1000 * 100 * 60 * 60);
        let totalCost = (this.totalMedianDuration*this.input1)/(1000 * 60 * 60);
        return '$'+((totalCost - roboCost)*this.input2).toFixed(2);
    }else{
        return '-';
    }
  }
  getHumanBotCost(from:string, varinatArray?:any){
    var reqObj:any;
      if(from == 'fullgraph'){
       reqObj = {
          pid:'610283',
          flag: false,
          data_type:"human_bot",
          //variants:[] //if flag is true
      }
    } else {
         reqObj = {
            pid:'610283',
            flag: true,
            data_type:"human_bot",
            variants:varinatArray //if flag is true
        }
    }
      this.rest.getPIInsightMeanMedianDuration(reqObj)
        .subscribe((res:any)=>{
            this.insight_human_robot_cost = res.data;
            console.log(this.insight_human_robot_cost);
            this.getHumanvsBotCost(this.insight_human_robot_cost)
        })

  }

  getHumanvsBotCost(vData){
    var hCost= [];
    var rCost = [];
    var dateArray = [];
    var t_array = []
     vData.dates_data.forEach(e => {
        var aa = e.date.split('.');
        var  mydate = aa[2]+'-'+aa[1]+'-'+aa[0];
       e.date = mydate;
     });
     vData.dates_data = vData.dates_data.sort(function compare(a, b) {
            var dateA:any = new Date(a.date);
            var dateB:any = new Date(b.date);
            return dateA - dateB;
          });

          console.log(vData.dates_data);
          
        vData.dates_data.forEach(e => {
        
        dateArray.push(moment(new Date(e.date)).format('DD/MM/YYYY'));
        // 
        var humanCost = Math.round(this.getHours(e.median_value)*this.input1);
        hCost.push(humanCost);
        var rDuration = Math.round(this.getHours(e.median_value)*60/100);
        var rHours = Math.round(rDuration);
        var rFinalCost = rHours*2;
        rCost.push(rFinalCost);
    });
    
    //this.caseIDs = this.removeDuplicate(this.caseIDs);
    this.caseIDs = dateArray;
    this.humanCost = hCost;
    this.robotCost = rCost;
    
    this.addcharts()
  }

  getHours(millisec){
     var hours:any = (millisec / (1000 * 60 * 60)).toFixed(1);
     return hours;
  }

  removeDuplicate(dataArray){
    let uniqueChars = [];
dataArray.forEach((c) => {
    if (!uniqueChars.includes(c)) {
        uniqueChars.push(c);
    }
});
console.log
return uniqueChars.sort();
  }

  getPointX(cases){
      console.log(cases);
      
    this.variant_Duration_list.data.forEach(e => {
        if(e.Cases == cases){
            return this.getHours(e.median_duration);
        }
    });
  }

  getActivityMetrics(){
      var reqObj = {
        pid:'920036',
        data_type:'variant_activity_metrics'
      }
      this.rest.getPIVariantActivity(reqObj)
        .subscribe((res:any)=>{
            console.log(res);
            var aData = res.data;
            this.activity_Metrics = aData.data;
            aData.data.forEach(e => {
                this.activityData.push({ x: e.Frequency, y: e.Frequency, z: e.Frequency, name: e.Activity, fullname:e.Activity.split(/\s/).reduce((response,word)=> response+=word.slice(0,1),''), title:'No of Events', event_duration:e.Frequency},);
            });
            console.log(this.activityData);
            this.bubbleColor = '#212F3C';
            this.addchart2();
            this.getActivityWiseHumanvsBotCost(this.activity_Metrics);

        })
        this.isEventGraph = true;
  }

  getActivityWiseHumanvsBotCost(activityMetrics){
    console.log(activityMetrics);
    var hCost= [];
    var rCost = [];
    var ac_list = [];

    activityMetrics.forEach(e => {
        ac_list.push(e.Activity);
        var humanCost = Math.round(this.getHours(e.Median_duration)*this.input1);
        hCost.push(humanCost);
        var rDuration = Math.round(this.getHours(e.Median_duration)*60/100);
        var rHours = Math.round(rDuration);
        var rFinalCost = rHours*2;
        rCost.push(rFinalCost);
    });
    this.activityHumanCost = hCost;
    this.activityBotCost = rCost;
    this.list_Activites = ac_list;
    console.log(this.activityHumanCost);
    console.log(this.activityBotCost);
    this.verticleBarGraph();
    
  }

  getEventBubboleGraph(type){
      this.activityData = [];
    if(type && type == 'event'){
        this.activity_Metrics.forEach(e => {
            this.activityData.push({ x: e.Frequency, y: e.Frequency, z: e.Frequency, name: e.Activity, fullname:e.Activity.split(/\s/).reduce((response,word)=> response+=word.slice(0,1),''),title:'No of Events', event_duration:e.Frequency},);
        });
        console.log(this.activityData);
        this.bubbleColor = '#212F3C';
        this.addchart2();
        this.isEventGraph = true;
    } else {
        this.activity_Metrics.forEach(e => {
            this.activityData.push({ x: Math.round(this.getHours(e.Median_duration)), y: Math.round(this.getHours(e.Median_duration)), z: Math.round(this.getHours(e.Median_duration)), name: e.Activity, fullname:e.Activity.split(/\s/).reduce((response,word)=> response+=word.slice(0,1),''),title:'Duration', event_duration:this.timeConversion(e.Median_duration)},);
        });
        console.log(this.activityData);
        this.bubbleColor = '#008080';
        this.addchart2();
        this.isEventGraph = false;
    }
  }

  addcharts(){
    this.chart1={
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
          categories:this.caseIDs
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
        data:this.humanCost

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

  Highcharts.chart('costprojection',this.chart1);
  }

  verticleBarGraph(){
    this.verticleGraph={
        title: {
            text: 'Activity Based Human and Bot Cost'
        },
        xAxis: {
           // type: 'category',
            categories: this.list_Activites,
            // labels: {
            //     rotation: -45,
            // }
            // type: 'category',
            // labels: {
            //     rotation: -45,
            //     style: {
            //         fontSize: '13px',
            //         fontFamily: 'Verdana, sans-serif'
            //     }
            // }
        },
        yAxis:{
            title:{
                text:'Price'
            }
        },
        tooltip: {
            valuePrefix:'$'
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
        },  {
            type: 'spline',
            name: 'Robot Cost',
            data: this.activityBotCost,
            marker: {
                lineWidth: 2,
                lineColor: Highcharts.getOptions().colors[3],
                fillColor: 'white'
            }
        }
    ]
  };

  Highcharts.chart('barGraph',this.verticleGraph);
  }


  addchart2()
  {
    this.chart2={
        chart: {
            type: 'bubble',
            plotBorderWidth: 1,
            zoomType: 'xy'
        },
    
        legend: {
            enabled: false
        },
    
        title: {
            text: 'Activity vs Occurances'
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
                '<tr><th>{point.title}:</th><td>{point.event_duration}</td></tr>' ,
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
                    color:'#ffffff'
                    
                },
                style:{
                    fontSize:'14px'
                },
                allowDecimals:true,
               
                    color:this.bubbleColor
            //fillColor: '#008080'

                
            }
        },
    
        series: [{
            data:this.activityData,
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
              

  Highcharts.chart('scatter',this.chart2); 
  
  
}

addpiechart1()
{
 this.piechart1= {
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
Highcharts.chart('piechart1', this.piechart1);

}


addpiechart2()
{
  this.piechart2={
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


Highcharts.chart('piechart2', this.piechart2);
          
}
openVariantListNav(){   //variant list open
  document.getElementById("mySidenav").style.width = "310px";
  // document.getElementById("main").style.marginRight = "310px";
  // this.isvariantListOpen=false;
  }

closeNav() { // Variant list Close
  document.getElementById("mySidenav").style.width = "0px";
  // document.getElementById("main").style.marginRight= "0px";
  // this.isvariantListOpen=true;
  }

getAllVariantList(){
  let variantData=localStorage.getItem("variants")
  this.varaint_data=JSON.parse(atob(variantData))
  console.log(this.varaint_data);
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

    getVariantMedianDuration(selectedVariants){
        if(selectedVariants.length){
            let full_median_value = 0;
            this.variant_Duration_list.data.forEach((each)=>{
                for(var i = 0; i<selectedVariants.length; i++){
                    let ind = selectedVariants[i]+1;
                    let variant_name = 'Variant '+ind;
                    if(each.Variant == variant_name){
                        full_median_value += each["median_duration"];
                        break;
                    }
                }
            })
            this.totalMedianDuration = full_median_value;
        }else{
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
        trace_number:selectedData.trace_number,
        case_value:selectedData.case_value,
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
        trace_number:selectedData.trace_number,
        case_value:selectedData.case_value,
        selected: "inactive"
      };
      this.varaint_data.data[index] = select;
    }

    this.selectedCaseArry = [];
    let selectedVariantIds = [];
    // this.selectedTraceNumbers = [];
    for (var i = 0; i < this.varaint_data.data.length; i++) {
      if (this.varaint_data.data[i].selected == "active") {
        // var casevalue = this.varaint_data.data[i].case
        var index_v = i+1;
        this.selectedCaseArry.push('Variant '+ index_v);
        // this.selectedTraceNumbers.push(this.varaint_data.data[i].trace_number)
        selectedVariantIds.push(i);
    }
    };  
    console.log(selectedVariantIds);
    
    this.getVariantMedianDuration(selectedVariantIds);
    this.caselength = this.selectedCaseArry.length;

    // console.log(this.varaint_data.data.length);
    
    if(this.selectedCaseArry.length ==this.varaint_data.data.length){
      this.checkboxValue = true
      // this.options = Object.assign({}, this.options, {disabled: false});
    }else{
      this.checkboxValue = false
      // this.options = Object.assign({}, this.options, {disabled: true});
    }
    if(this.selectedCaseArry.length == 0){
        this.getHumanBotCost('fullgraph');
    }else{
    this.getHumanBotCost('variant', this.selectedCaseArry);
    }
  }
  selectAllVariants() {   // Select all variant list
    let selectedIndices = [];
    if (this.checkboxValue == true) {
      for (var i = 0; i < this.varaint_data.data.length; i++) {
        selectedIndices.push(i);
        this.varaint_data.data[i].selected = "active";
      }
    } else {
      for (var i = 0; i < this.varaint_data.data.length; i++) {
        this.varaint_data.data[i].selected = "inactive";
      }
    }
    this.getVariantMedianDuration(selectedIndices);
    this.getHumanBotCost('fullgraph');
  }

  editInput(){
    this.isEditable=!this.isEditable
  }
  editInput1(){
    this.isEditable1=!this.isEditable1
  }

  switch1(data){
    console.log(data);
    
  if(data=="bar"){
    this.flag1=0
    this.verticleBarGraph();
  }else if(data=="pie"){
    this.flag1=1;
    this.swithToPeiCart()
  }
}

swithToPeiCart(){
 this.piechart3= {
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
switchTostackedBar(value){
  console.log(value);
  if(value=="stackedbar"){
    this.isstackedbarChart=true
    this.scatterBarchart()
  }else{
    this.isstackedbarChart=false
    this.addpiechart1()
  }
}

switchTostackedBar1(value){
  if(value=="stackedbar"){
    this.isstackedbarChart1=true
    this.scatterBarchart1()
  }else{
    this.isstackedbarChart1=false
    this.addpiechart2()
  }
}
scatterBarchart(){
    this.stackedChart={
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
scatterBarchart1(){
  this.stackedChart={
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


}
