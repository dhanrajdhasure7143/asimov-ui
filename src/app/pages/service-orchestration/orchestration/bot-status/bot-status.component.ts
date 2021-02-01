import {ViewChild, Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import * as Highcharts from 'highcharts';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-bot-status',
  templateUrl: './bot-status.component.html',
  styleUrls: ['./bot-status.component.css']
})
export class BotStatusComponent implements OnInit {
  chart: any;
  processStatus:any;
  BotStatus:any;
  displayedColumns: string[] = ["botName","botType","categoryName","createdBy" ,"createdTS","description"];
  dataSource:MatTableDataSource<any>;
  @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
  @ViewChild(MatSort,{static:false}) sort: MatSort;
  gaugeType = "full";
  activeBots:any=[];
  gaugeValue = 28.3;
  botnames:any=[];
  timestamps:any=[];
  gaugeLabel = "Overall Running";
  gaugeThickness = 20;
  gaugeAppendText = "%";
  indexData = {
    "id" : 1,
    "indexDetails" : [
      {
        "id" :1.1,
        "Messages" : "Onboard Completed",
        "Time" : "11:30AM",
        "Date" : "22/11/2020"
      },
      {
        "id" :1.2,
        "Messages" : "Group Created",
        "Time" : "11:30AM",
        "Date" : "22/11/2020"
      },
      {
        "id" :1.2,
        "Messages" : "Assigned Bots",
        "Time" : "11:30AM",
        "Date" : "22/11/2020"
      }
    ]
  }
  feesDetails = {
    "id": 7,
    "uniqueId": "",
    "version": 0,
    "refNumber": "2018-08-22N1XMN",
    "bookingDate": "2018-08-22",
    "bookingFrom": "2018-08-23",
    "bookingTo": "2018-08-30",
    "rentAmount": 21950,
    "depositAmount": 9180,
    "depositPainOn": null,
    "rentPainOn": null,
    "depositPaid": false,
    "rentPaid": false,
    "bookingDetails": [
      {
        "id": 11,
        "uniqueId": "",
        "version": 0,
        "slot": {
          "id": 81,
          "uniqueId": "",
          "version": 1,
          "start": "2018-08-25 15:01:00",
          "end": "2018-08-25 18:30:00",
          "occupancy": 1,
          "shiftType": "SECOND",
          "occupiedCount": 1,
          "slotStatus": "TEMPORARY_BLOCKED",
          "bookingDetailIdentifier": null
        },
        "rent": 2850,
        "electricCharges": 7500,
        "administrationCharges": 1000,
        "showTax": 100,
        "gstAmount": 0,
        "total": 11450
      },
      {
        "id": 12,
        "uniqueId": "",
        "version": 0,
        "slot": {
          "id": 41,
          "uniqueId": "",
          "version": 1,
          "start": "2018-08-25 09:01:00",
          "end": "2018-08-25 12:30:00",
          "occupancy": 1,
          "shiftType": "FIRST",
          "occupiedCount": 1,
          "slotStatus": "TEMPORARY_BLOCKED",
          "bookingDetailIdentifier": null
        },
        "rent": 1900,
        "electricCharges": 7500,
        "administrationCharges": 1000,
        "showTax": 100,
        "gstAmount": 0,
        "total": 10500
      }
    ]
  }
  performData: any;
  usageData: any;
  constructor(private api:RestApiService, private spinner:NgxSpinnerService) { }
  ngAfterViewInit() {
    this.dataSource.sort=this.sort;
    this.dataSource.paginator=this.paginator;
  }
  ngOnInit() {
    this.spinner.show();
    let labelData:any [] = []
    let botData:any
    let botTime:any [] = []
    let finalObjectData:any [] = []
    this.getprocessStatus();
    this.getBotStatus();
    this.getAllActiveBots();
    this.getgraph();
    setTimeout(() => {
      this.spinner.hide();
      }, 4000);
    this.api.botPerformance().subscribe(data => { this.performData = data;
      this.performData = []
    //   this.performData = [{
    //     'botName' : 'ifugj',
    //     'coordinates' : [
    //       {'timeDuration' : 1},
    //       {'timeDuration' : 3},
    //       {'timeDuration' : 4},
    //       {'timeDuration' : 9}
    //     ]
    //   },
    //   {
    //     'botName' : 'ksdjn',
    //     'coordinates' : [
    //       {'timeDuration' : 4},
    //       {'timeDuration' : 2},
    //       {'timeDuration' : 1},
    //       {'timeDuration' : 8}
    //     ]
    //   },
    //   {
    //     'botName' : 'zdmc',
    //     'coordinates' : [
    //       {'timeDuration' : 9},
    //       {'timeDuration' : 6},
    //       {'timeDuration' : 4},
    //       {'timeDuration' : 3}
    //     ]
    //   },
    // ]
      finalObjectData = []
      botData = [];
      this.performData.forEach((element, ind) => {
        //console.log("==================")
        //console.log(ind)
        //console.log("===================")
        if(ind < 5)
        {
        labelData.push(element.botName)
        element.coordinates.forEach((ele1, index) => {
        botTime.push(ele1.timeDuration)
        })
        botData = {
          label: element.botName,
          data: botTime,
          backgroundColor: '#00000',//+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6,'0'),
          borderColor:'#f2f2f2',
          borderWidth: 1,
        }
        finalObjectData.push(botData)
      }
      });
      var getElementById:any = document.getElementById('myChart');
      var ctx = getElementById.getContext("2d");
      // var ctx = document.getElementById('chart');

      var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labelData,
          //datasets: finalObjectData
          datasets: this.performData,

        },
        options: {
          legend: {
            display: false
          },
          scales: {
            xAxes: [{ stacked: true ,
              ticks: {
                min: 0,
                stepSize: 10,
            },
            scaleLabel: {
              display:true,
              labelString: 'Bot Name'
            },
            }],
            yAxes: [{ stacked: true,
              ticks: {
                min: 0,
                max: 100,
                stepSize: 10,
            },
            scaleLabel: {
              display:true,
              labelString: 'Time(ms)'
            },
           }]
          }
        }
      });
    })

    this.api.botUsage().subscribe(data => { this.usageData = data;
       let datacha = Object.keys(data);
      if(datacha[0] != 'errorMessage' && datacha[1] != 'errorCode'){
      this.chart = new Chart('canvas', {
      type: 'pie',
      // percentageInnerCutout: 90,
      data: {
        labels: Object.keys(this.usageData),
        datasets: [
          {
            data: Object.values(this.usageData),
            backgroundColor: ['rgb(255,106,129)','rgba(255, 0, 0, 0.1)','rgb(58,187,216)','rgba(16, 112, 210, 1)'],
            fill: false,
            borderColor: '#fff',
            borderWidth: '1px',
          },
        ]
      },
      options: {
        // cutoutPercentage	: 65,
        legend: {
          display: true
        },
        tooltips:{
          enabled:true
        }
      }
    });
  }else{
    this.chart = new Chart('canvas', {
      type: 'pie',
      // percentageInnerCutout: 90,
      data: {
        labels:['No Data Found'],
        datasets: [
          {
            data: [0],
            backgroundColor: ['rgba(224,237,255)'],
            fill: false,
            borderColor: '#fff',
            borderWidth: '1px',
          },
        ]

      },
      options: {

        // cutoutPercentage	: 65,
        legend: {
          display: true
        },
        tooltips:{
          enabled:true
        }
      }
    });
  }
  })
    }
new(){
  this.feesDetails = {
    "id": 7,
    "uniqueId": "",
    "version": 0,
    "refNumber": "2018-08-22N1XMN",
    "bookingDate": "2018-08-22",
    "bookingFrom": "2018-08-23",
    "bookingTo": "2018-08-30",
    "rentAmount": 21950,
    "depositAmount": 9180,
    "depositPainOn": null,
    "rentPainOn": null,
    "depositPaid": false,
    "rentPaid": false,
    "bookingDetails": [
      {
        "id": 11,
        "uniqueId": "",
        "version": 0,
        "slot": {
          "id": 81,
          "uniqueId": "",
          "version": 1,
          "start": "2018-08-25 15:01:00",
          "end": "2018-08-25 18:30:00",
          "occupancy": 1,
          "shiftType": "third",
          "occupiedCount": 1,
          "slotStatus": "TEMPORARY_BLOCKED",
          "bookingDetailIdentifier": null
        },
        "rent": 2850,
        "electricCharges": 8500,
        "administrationCharges": 1000,
        "showTax": 100,
        "gstAmount": 0,
        "total": 11450
      },
      {
        "id": 12,
        "uniqueId": "",
        "version": 0,
        "slot": {
          "id": 41,
          "uniqueId": "",
          "version": 1,
          "start": "2018-08-25 09:01:00",
          "end": "2018-08-25 12:30:00",
          "occupancy": 1,
          "shiftType": "fourth",
          "occupiedCount": 1,
          "slotStatus": "TEMPORARY_BLOCKED",
          "bookingDetailIdentifier": null
        },
        "rent": 1900,
        "electricCharges": 7500,
        "administrationCharges": 1000,
        "showTax": 100,
        "gstAmount": 0,
        "total": 10500
      }
    ]
  }
}
active(){
  this.feesDetails = {
    "id": 7,
    "uniqueId": "",
    "version": 0,
    "refNumber": "2018-08-22N1XMN",
    "bookingDate": "2018-08-22",
    "bookingFrom": "2018-08-23",
    "bookingTo": "2018-08-30",
    "rentAmount": 21950,
    "depositAmount": 9180,
    "depositPainOn": null,
    "rentPainOn": null,
    "depositPaid": false,
    "rentPaid": false,
    "bookingDetails": [
      {
        "id": 11,
        "uniqueId": "",
        "version": 0,
        "slot": {
          "id": 81,
          "uniqueId": "",
          "version": 1,
          "start": "2018-08-25 15:01:00",
          "end": "2018-08-25 18:30:00",
          "occupancy": 1,
          "shiftType": "fifth",
          "occupiedCount": 1,
          "slotStatus": "TEMPORARY_BLOCKED",
          "bookingDetailIdentifier": null
        },
        "rent": 2850,
        "electricCharges": 8780,
        "administrationCharges": 4500,
        "showTax": 100,
        "gstAmount": 0,
        "total": 11450
      },
      {
        "id": 12,
        "uniqueId": "",
        "version": 0,
        "slot": {
          "id": 41,
          "uniqueId": "",
          "version": 1,
          "start": "2018-08-25 09:01:00",
          "end": "2018-08-25 12:30:00",
          "occupancy": 1,
          "shiftType": "sixth",
          "occupiedCount": 1,
          "slotStatus": "TEMPORARY_BLOCKED",
          "bookingDetailIdentifier": null
        },
        "rent": 1900,
        "electricCharges": 7500,
        "administrationCharges": 1000,
        "showTax": 100,
        "gstAmount": 0,
        "total": 10500
      }
    ]
  }
}

getprocessStatus()
{
  this.api.getProcessStatistics().subscribe(data=>{
    this.processStatus=data;
    if(this.processStatus.ONHOLD==undefined)
    {
      this.processStatus.ONHOLD="-";
    }
    if(this.processStatus.INPROGRESS==undefined)
    {
      this.processStatus.INPROGRESS="-";
    }
    if(this.processStatus.REJECTED==undefined)
    {
      this.processStatus.REJECTED="-";
    }
  })
}

loopTrackBy(index, term){
  return index;
}

getBotStatus()
{
  this.api.getBotStatistics().subscribe(data=>{
    this.BotStatus=data;

  })
}
  getAllActiveBots()
  {
    let response:any;
    this.api.getAllActiveBots().subscribe(data=>
    {
      this.activeBots=data;
      response=data;
      this.dataSource= new MatTableDataSource(response);

    })
  }

  getgraph()
  {
     let data:any= {

      renderTo: 'container1',
      chart: {
          type: 'column'
      },
      title: {
          text: 'Bot Performance'
      },
      xAxis: {
          //categories: this.botnames,
          categories: ["HttpSeviceDemo","Version_Switching","Sanity_Check","Acounts_payable","Product_Review_Analysis"],
      },
      yAxis: {
          min: 0,
          title: {
              text: 'Time Duration(ms)'
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
          name: 'RunId-3',
          data: [5, 3, 4, 7, 2]
        }, {
          name: 'RunId-2',
          data: [2, 2, 3, 2, 1]
        }, {
          name: 'RunId-1',
          data: [3, 4, 4, 2, 5]
        }]

       // series:this.timestamps,
      }

    Highcharts.chart('container1', data);
  }
}
