import { Component, OnInit } from '@angular/core';
 import * as Highcharts from 'highcharts';
import { RestApiService } from '../../services/rest-api.service';
import HC_more from 'highcharts/highcharts-more' //module
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
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
  input1:any=20;
  input2:any=10;
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
  graphIds:any;
  caseIDs:any = [];
  humanCost:any = [];
  robotCost:any = [];
  activityData:any = [];

  constructor(
      private rest:RestApiService,
      private route:ActivatedRoute
      ) { }

  ngOnInit() {
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
    //this.addcharts();
    //this.addchart2();
    this.verticleBarGraph();
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
            this.totalMeanDuration = res.totalMeanDuration;
            this.totalMedianDuration = res.totalMedianDuration; 
                      
        },
        (err=>{
            console.log("Internal server error, Please try again later.")
        }))
        
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
            this.variant_Duration_list = res.data;
            console.log(this.variant_Duration_list);
            this.getHumanvsBotCost(this.variant_Duration_list)
        })

  }

  getHumanvsBotCost(vData){
    var hCost= [];
    var rCost = [];
    var dateArray = [];
     vData.dates_data.forEach(e => {
        var aa = e.date.split('.');
        var  mydate = aa[0]+'/'+aa[1]+'/'+aa[2];
        dateArray.push(mydate);
        var humanCost = Math.round(this.getHours(e.median_value)* 20);
        hCost.push(humanCost);
        var rDuration = Math.round(this.getHours(e.median_value)*60/100);
        var rHours = Math.round(rDuration);
        var rFinalCost = rHours*10;
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
            aData.data.forEach(e => {
                this.activityData.push({ x: e.Frequency, y: e.Frequency, z: e.Frequency, name: e.Activity, fullname:e.Activity.split(/\s/).reduce((response,word)=> response+=word.slice(0,1),'')},);
            });
            console.log(this.activityData);
            this.addchart2();

        })
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
      chart: {
          type: 'column'
      },
      title: {
          text: 'Monthly Average Rainfall'
      },
      xAxis: {
          categories: [
              'Jan',
              'Feb',
              'Mar',
              'Apr',
              'May',
              'Jun',
              'Jul',
              'Aug',
              'Sep',
              'Oct',
              'Nov',
              'Dec'
          ],
          crosshair: true
      },
      yAxis: {
          min: 0,
          title: {
              text:'Rainfall'
          }
      },
      tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
              '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true
      },
      plotOptions: {
          column: {
              pointPadding: 0.2,
              borderWidth: 0
          }
      },
      series: [{
          name: 'London',
          data: [48, 38, 39, 41, 47]
  
      }, {
          name: 'Berlin',
          data: [42, 33, 34, 39, 52]
  
      }]
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
            enabled: true
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
        //},
    
        xAxis: {
           // gridLineWidth: 1,
            title: {
                text: 'Activity'
            },
            // labels: {
            //     format: '{value} gr'
            // },
            plotLines: [{
                //color: 'black',
                //dashStyle: 'dot',
                width: 2,
                //value: 65,
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
            //     format: '{value}'
            // },
            maxPadding: 0.2,
            plotLines: [{
                color: 'black',
               // dashStyle: 'dot',
                width: 2,
                //value: 50,
                label: {
                    align: 'right',
                    style: {
                        fontStyle: 'italic'
                    },
                    //text: 'Safe sugar intake 50g/day',
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
                '<tr><th>Events:</th><td>{point.x}</td></tr>' ,
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
               
                    color:"#212F3C"
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
    // this.selectedTraceNumbers = [];
    for (var i = 0; i < this.varaint_data.data.length; i++) {
      if (this.varaint_data.data[i].selected == "active") {
        //var casevalue = this.varaint_data.data[i].case
        this.selectedCaseArry.push('Variant '+ i);
        // this.selectedTraceNumbers.push(this.varaint_data.data[i].trace_number)
      }
    };
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
    if (this.checkboxValue == true) {
      for (var i = 0; i < this.varaint_data.data.length; i++) {
        this.varaint_data.data[i].selected = "active"
      }
    } else {
      for (var i = 0; i < this.varaint_data.data.length; i++) {
        this.varaint_data.data[i].selected = "inactive";
      }
    }
  }

  editInput(){
    this.isEditable=!this.isEditable
  }
  editInput1(){
    this.isEditable1=!this.isEditable1
  }


}
