import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { RestApiService } from 'src/app/pages/services/rest-api.service';


@Component({
  selector: 'app-bot-status',
  templateUrl: './bot-status.component.html',
  styleUrls: ['./bot-status.component.css']
})
export class BotStatusComponent implements OnInit {
  processStatus:any;
  gaugeType = "full";
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
  constructor(private api:RestApiService) { }
  ngOnInit() {
   var getElementById:any = document.getElementById('myChart');
    var ctx = getElementById.getContext("2d");
  this.getprocessStatus();
  var gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
  gradientStroke.addColorStop(0, '#dce9fd');
  gradientStroke.addColorStop(1, '#a3a0fb');
  
  var gradientFill = ctx.createLinearGradient(500, 0, 100, 0);
  // gradientFill.addColorStop(0, "rgb(84, 216, 255,0.6)");
  // gradientFill.addColorStop(1, "rgb(163, 160, 251,0.6)");
  var myChart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL"],
          datasets: [{
              label: "",
              borderColor: '#dce9fd',
              pointBorderColor: gradientStroke,
              pointBackgroundColor: gradientStroke,
             pointHoverBackgroundColor: gradientStroke,
              pointHoverBorderColor: gradientStroke,
              pointBorderWidth: 10,
              pointHoverRadius: 10,
              pointHoverBorderWidth: 1,
              pointRadius: 3,
              fill: true,
              backgroundColor: gradientFill,
              borderWidth: 4,
              data: [60,24,10,20,10,20,10]
          },
          {
            label: "",
            borderColor: '#0062cf',
            pointBorderColor: gradientStroke,
            pointBackgroundColor: gradientStroke,
           pointHoverBackgroundColor: gradientStroke,
            pointHoverBorderColor: gradientStroke,
            pointBorderWidth: 10,
            pointHoverRadius: 10,
            pointHoverBorderWidth: 1,
            pointRadius: 3,
            fill: true,
            backgroundColor: gradientFill,
            borderWidth: 4,
            data: [10, 60, 50, 70, 80, 70, 60]
        }]
      },
      options: {
          legend: {
              position: "bottom",
              display:false
          },
          scales: {
              yAxes: [{
                  ticks: {
                      fontColor: "rgba(0,0,0,0.5)",
                      fontStyle: "bold",
                      beginAtZero: true,
                      maxTicksLimit: 5,
                      padding: 20
                  },
                  gridLines: {
                      drawTicks: false,
                      display: false
                  }
  
              }],
              xAxes: [{
                  gridLines: {
                      zeroLineColor: "transparent"
                  },
                  ticks: {
                      padding: 20,
                      fontColor: "rgba(0,0,0,0.5)",
                      fontStyle: "bold"
                  }
              }]
          }
      }
  });
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
  })
}

loopTrackBy(index, term){
  return index;
}
}
