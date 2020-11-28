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
            console.log(datacha);
            if(datacha[0] != 'errorMessage' && datacha[1] != 'errorCode')
            {
              this.chart2 = new Chart('canvas1', {
              type: 'pie',
              // percentageInnerCutout: 90,
              data: {
                labels: ["In Progress","Pending","Approved","Hold","Rejected"],
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
            },

          scales: {
            yAxes: [{
              ticks: {
                precision:0,
              }
            }]
          },
          },

        });

      })

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
          }
          else
          {
            Runs.push(bot_obj2.coordinates[j].timeDuration)
          }
          //console.log(Runs);
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

}


