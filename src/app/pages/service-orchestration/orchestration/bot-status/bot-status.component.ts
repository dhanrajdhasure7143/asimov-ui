import {ViewChild, Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';

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
  gaugeLabel = "Overall Running";
  gaugeThickness = 20;
  gaugeAppendText = "%";
  indexData = {
    "id" : 1,
    "indexDetails" : [
      {
        "id" :1.1,
        "Messages" : "on-Board completed",
        "Time" : "11:30AM",
        "Date" : "22/11/2020"
      },
      {
        "id" :1.2,
        "Messages" : "Group created",
        "Time" : "11:30AM",
        "Date" : "22/11/2020"
      },
      {
        "id" :1.2,
        "Messages" : "Assigned Deals",
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
  constructor(private api:RestApiService) { }
  ngOnInit() {
    let labelData:any [] = []
    let botData:any
    let botTime:any [] = []
    let finalObjectData:any [] = []
    this.getprocessStatus();
    this.getBotStatus();
    this.getAllActiveBots();

    this.api.botPerformance().subscribe(data => { this.performData = data;
      console.log(this.performData);
      finalObjectData = []
      botData = [];
      this.performData.forEach((element, ind) => {
        if(ind < 5){
        labelData.push(element.botName)
        element.coordinates.forEach((ele1, index) => {
        botTime.push(ele1.timeDuration)
        })
        botData = {
          label: element.botName,
          data: botTime,
          backgroundColor: ['#4BB7FF',],
          borderColor:'#f2f2f2',
          borderWidth: 1,
        }
        finalObjectData.push(botData)
      }
      });

      console.log(finalObjectData);
      var getElementById:any = document.getElementById('myChart');
      var ctx = getElementById.getContext("2d");
      // var ctx = document.getElementById('chart');

      var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labelData,
          datasets: finalObjectData
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
      console.log(this.usageData);
 
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
    this.processStatus=data
    console.log(data)
    if(this.processStatus.ONHOLD==undefined)
    {
      this.processStatus.ONHOLD="NA";
    }
    if(this.processStatus.INPROGRESS==undefined)
    {
      this.processStatus.INPROGRESS="NA";
    }
    if(this.processStatus.REJECTED==undefined)
    {
      this.processStatus.REJECTED="NA";
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
    console.log(data)
  
  })
}
  getAllActiveBots()
  {
    let response:any;
    this.api.getAllActiveBots().subscribe(data=>
    {
      this.activeBots=data;
      response=data;
      console.log(response)
      this.dataSource= new MatTableDataSource(response);
      this.dataSource.sort=this.sort;
      this.dataSource.paginator=this.paginator;
    })
  }

}
