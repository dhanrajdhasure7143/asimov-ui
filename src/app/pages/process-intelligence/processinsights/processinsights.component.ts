import { Component, OnInit } from '@angular/core';
 import * as Highcharts from 'highcharts';
import { RestApiService } from '../../services/rest-api.service';

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
  checkboxValue:boolean=false

  constructor(private rest:RestApiService) { }

  ngOnInit() {
    this.variant_list = Object.keys(VariantList).filter(val => isNaN(VariantList[val]));
    this.variant_list_options = VariantList;
    this.table1=[{value1:"value1",value2:"value2",value3:"value3"},{value1:"value1",value2:"value2",value3:"value3"},{value1:"value1",value2:"value2",value3:"value3"},{value1:"value1",value2:"value2",value3:"value3"}]
    this.addcharts();
    this.addchart2();
    this.verticleBarGraph();
    this.addpiechart1();
    this.addpiechart2();
    this.getAllVariantList()
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
          text: 'Wind speed during two days',
          align: 'center'
      },
      xAxis: {
          type: 'datetime',
          labels: {
              overflow: 'justify'
          }
      },
      yAxis: {
          title: {
              text: 'Wind speed'
          },
          minorGridLineWidth: 0,
          gridLineWidth: 1,
          alternateGridColor: null,
          // left:1,
          // plotBands: []
      },
      tooltip: {
          valueSuffix: 'm/s'
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
                  enabled: false
              },
              // pointInterval: 3600000, // one hour
              // pointStart: Date.UTC(2018, 1, 13, 0, 0, 0)
          }
      },
      series: [{
          name: 'Hestavollane',
          data: [0, 3, 9, 4, 5, 8, 4.0, 10,6.9]
  
      }, {
          name: 'Vik',
          data: [0, 3.5, 1, 5, 8, 10, 11,9,11]
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
          type: 'scatter',
          zoomType: 'xy'
      },
      title: {
          text: 'Height Versus Weight of 507 Individuals by Gender'
      },
      subtitle: {
          text: 'Source: Heinz  2003'
      },
      xAxis: {
          title: {
              enabled: true,
              text: 'Height (cm)'
          },
          startOnTick: true,
          endOnTick: true,
          showLastLabel: true
      },
      yAxis: {
          title: {
              text: 'Weight (kg)'
          }
      },
      legend: {
          layout: 'vertical',
          align: 'left',
          verticalAlign: 'top',
          x: 100,
          y: 70,
          floating: true,
          backgroundColor: Highcharts.defaultOptions.chart.backgroundColor,
          borderWidth: 1
      },
      plotOptions: {
          scatter: {
              marker: {
                  radius: 5,
                  states: {
                      hover: {
                          enabled: true,
                          lineColor: 'rgb(100,100,100)'
                      }
                  }
              },
              states: {
                  hover: {
                      marker: {
                          enabled: false
                      }
                  }
              },
              tooltip: {
                  headerFormat: '<b>{series.name}</b><br>',
                  pointFormat: '{point.x} cm, {point.y} kg'
              }
          }
      },
      series: [{
          name: 'Female',
          color: 'rgba(223, 83, 83, .5)',
          data: [[161.2, 51.6], [167.5, 59.0], [159.5, 49.2], [157.0, 63.0], ]
  
      }, {
          name: 'Male',
          color: 'rgba(119, 152, 191, .5)',
          data: [[174.0, 65.6]]
      }]
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
        var casevalue = this.varaint_data.data[i].case
        this.selectedCaseArry.push(casevalue);
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


}
