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

  categaoriesList:any
  processnames:any
  automatedtasks:any
  chart:any
  usageData:any;
  ctx1:any;
  chart2:any;
  chart3:any;
  chart4:any;
  chart5:any;
  data_sets:any=[];
  Environments:any;
  Performance:any;
  ngOnInit() {
    this.getbotstatistics();
    this.getprocessstatistics();
    this.getenvironments();
    this.getperformance();
    this.getCategoryList();
    this.getprocessruns();
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
        "Windows":Windows,
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
      this.automatedtasks=TaskData.automationTasks;
      let data_array=  task_array.filter( (thing, i, arr) => arr.findIndex(t => t.processId === thing.processId) === i);
      let obj_array:any=[];
      let obj:any={}
      let i=0;
      this.rest.getprocessnames().subscribe(processnames=>{
        let process_arr:any=[];
        process_arr=processnames;
        this.processnames=processnames;
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





  getCategoryList()
  {
    this.rest.getCategoriesList().subscribe(data=>{
      let catResponse : any;
      catResponse=data
      this.categaoriesList=catResponse.data;
    });
  }


  getprocessruns(){
    this.rest.botPerformance().subscribe(data=>{
      let check:any=[];
      check=data;
      let data_labels:any=[];
      console.log(check.length)
      for(let i=(check.length-1);i>((check.length-1)-5);i--)
      {
        let bot_obj:any=check[i];
        console.log(bot_obj);
        data_labels.push(check[i].botName);
      }
      for(let j=0;j<=5;j++)
      {
        let Runs:any=[];
        for(let i=(check.length-1);i>((check.length-1)-5);i--)
        {
          let bot_obj2:any=check[i];
          if(bot_obj2.coordinates[j]==undefined)
          {
            Runs.push(0)
          }else
          {
            Runs.push(bot_obj2.coordinates[j].timeDuration)
          }
          console.log(Runs);
        }
        let data_set:any={
          label:"R"+(j+1),
          data:Runs,
          backgroundColor:'#'+Math.floor(Math.random()*16777215).toString(16),
        }
        this.data_sets.push(data_set);

      }
      setTimeout(()=>{
      this.chart5 = new Chart('canvas4', {
        type: 'bar',
        data: {
          labels: data_labels,
          datasets: this.data_sets
        },
        options: {
          responsive: false,
          legend: {
             position: 'right' // place legend on the right side of chart
          },
          scales: {
             xAxes: [{
                stacked: true // this should be set to make the bars stacked
             }],
             yAxes: [{
                stacked: true // this also..
             }]
          }
       }
      }
       );

    },2000)


  });

  }


/*
  getprocessruntime()
  {
    console.log("=======================================================================|===========================")
    var chart = new Chart('canvas4', {
      type: 'bar',
      data: {
         labels: ['Standing costs', 'Running costs'], // responsible for how many bars are gonna show on the chart
         // create 12 datasets, since we have 12 items
         // data[0] = labels[0] (data for first bar - 'Standing costs') | data[1] = labels[1] (data for second bar - 'Running costs')
         // put 0, if there is no data for the particular bar
         datasets: [{
            label: 'Washing and cleaning',
            data: [0, 8],
            backgroundColor: '#22aa99'
         }, {
            label: 'Traffic tickets',
            data: [0, 2],
            backgroundColor: '#994499'
         }, {
            label: 'Tolls',
            data: [0, 1],
            backgroundColor: '#316395'
         }, {
            label: 'Parking',
            data: [5, 2],
            backgroundColor: '#b82e2e'
         }, {
            label: 'Car tax',
            data: [0, 1],
            backgroundColor: '#66aa00'
         }, {
            label: 'Repairs and improvements',
            data: [0, 2],
            backgroundColor: '#dd4477'
         }, {
            label: 'Maintenance',
            data: [6, 1],
            backgroundColor: '#0099c6'
         }, {
            label: 'Inspection',
            data: [0, 2],
            backgroundColor: '#990099'
         }, {
            label: 'Loan interest',
            data: [0, 3],
            backgroundColor: '#109618'
         }, {
            label: 'Depreciation of the vehicle',
            data: [0, 2],
            backgroundColor: '#109618'
         }, {
            label: 'Fuel',
            data: [0, 1],
            backgroundColor: '#dc3912'
         }, {
            label: 'Insurance and Breakdown cover',
            data: [4, 0],
            backgroundColor: '#3366cc'
         }]
      },
      options: {
         responsive: false,
         legend: {
            position: 'right' // place legend on the right side of chart
         },
         scales: {
            xAxes: [{
               stacked: true // this should be set to make the bars stacked
            }],
            yAxes: [{
               stacked: true // this also..
            }]
         }
      }
   });

  }
*/

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

