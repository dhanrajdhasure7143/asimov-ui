import { Component, OnInit } from '@angular/core';
//import * as Highcharts from 'highcharts';
import {RestApiService} from '../../../services/rest-api.service';
//import { Chart } from 'chart.js';
import * as Chart from 'chart.js'
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-so-dashboard',
  templateUrl: './so-dashboard.component.html',
  styleUrls: ['./so-dashboard.component.css']
})
export class SoDashboardComponent implements OnInit {

  constructor(
    private rest:RestApiService,
    private spinner:NgxSpinnerService,
    ) { }
  chart:any
  usageData:any;
  ctx1:any;
  chart2:any;
  chart3:any;
  chart4:any;
  Environments:any;
  Performance:any;
  ngOnInit() {
    this.getbotstatistics();
    this.getprocessstatistics();
    this.getenvironments();
    this.getperformance();
  }

  getbotstatistics(){
    this.rest.botStatistics().subscribe(data => { this.usageData = data;
            console.log(this.usageData);
            let datacha = Object.keys(data);
            if(datacha[0] != 'errorMessage' && datacha[1] != 'errorCode')
            {
              this.chart = new Chart('canvas', {
              type: 'pie',
              // percentageInnerCutout: 90,
              data: {
                labels: Object.keys(this.usageData),
                datasets: [
                  {
                    data: Object.values(this.usageData),
                    backgroundColor: ['rgb(255,106,129)',
                    'rgba(255, 0, 0, 0.1)',
                    'rgb(58,187,216)',
                    'rgba(16, 112, 210, 1)',
                    'blue'
                  ],
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
      });
  }




  getprocessstatistics(){
    this.rest.getProcessStatistics().subscribe(data => { this.usageData = data;
            console.log(this.usageData);
            let datacha = Object.keys(data);
            if(datacha[0] != 'errorMessage' && datacha[1] != 'errorCode')
            {
              this.chart2 = new Chart('canvas1', {
              type: 'pie',
              // percentageInnerCutout: 90,
              data: {
                labels: Object.keys(this.usageData),
                datasets: [
                  {
                    data: Object.values(this.usageData),
                    label: 'Environments',
                    backgroundColor: ['rgb(255,106,129)',
                    'rgba(255, 0, 0, 0.1)',
                    'rgb(58,187,216)',
                    'rgba(16, 112, 210, 1)',
                    'blue'
                  ],
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
      });
  }



  getenvironments()
  {
    this.rest.listEnvironments().subscribe(data=>{
      this.Environments=data;
      console.log(this.Environments);
      let Linux=this.Environments.filter(Data=>Data.environmentType=="Linux").length;
      let Mac=this.Environments.filter(Data=>Data.environmentType=="Mac").length;
      let Windows=this.Environments.filter(Data=>Data.environmentType=="Windows").length;

      let data2={
        "wiindows":Windows,
        "Mac":Mac,
        "Linux":Linux,
      }
      this.chart3 = new Chart('canvas2', {
        type: 'bar',
        data: {
          labels: Object.keys(data2),
          datasets: [
            {
              data: Object.values(data2),
              label: 'Environments',
              backgroundColor: [
                "blue",
              'blue',
              'blue',

            ],
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



  getperformance()
  {

    this.rest.getautomatedtasks(0).subscribe((tasks)=>{
      let TaskData:any=tasks;
      let task_array=TaskData.automationTasks

      let data_array=  task_array.filter( (thing, i, arr) => arr.findIndex(t => t.processId === thing.processId) === i);
      let obj_array:any=[];
      let obj:any={}
      let i=0;
      this.rest.getprocessnames().subscribe(processnames=>{
        let process_arr:any=[];
        process_arr=processnames;
        process_arr.forEach(element => {
          obj[element.processName]=task_array.filter(p=>(p.processId==element.processId) && (p.botId!='0')).length;
          obj_array[i++]='green';
        });
        this.chart4 = new Chart('canvas3', {
          type: 'bar',
          data: {
            labels: Object.keys(obj),
            datasets: [
              {
                data: Object.values(obj),
                label: 'Processes',
                backgroundColor: obj_array,
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
      /*data_array.forEach(process=>{
          obj[process.processName]=task_array.filter(count=>count.processId == process.processId).length;
          obj_array[i++]='green';
      })*/

      })
  }

}





/*

  getgraph()
  {

    let data:any= {
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

    Highcharts.chart('mybotdata', data);
  }


  getgraph2()
  {

    let data:any= {
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


    Highcharts.chart("issue", data);
  }
*/

