import {Inject, Component, OnInit } from '@angular/core';
import {RestApiService} from '../../../services/rest-api.service';
import * as Chart from 'chart.js'
import { NgxSpinnerService } from "ngx-spinner";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as moment from 'moment';
@Component({
  selector: 'app-so-dashboard',
  templateUrl: './so-dashboard.component.html',
  styleUrls: ['./so-dashboard.component.css']
})
export class SoDashboardComponent implements OnInit {

  constructor(
    private rest:RestApiService,
    private spinner:NgxSpinnerService,
    private dialog:MatDialog
    ) {


    }

  categaoriesList:any
  processnames:any
  automatedtasks:any
  users:any;
  bots_list:any;
  bots:any;
  transactions:any;
  chart:any
  usageData:any;
  chart5:any;
  chart6:any;
  data_sets:any=[];
  Environments:any;
  Performance:any;

  view: any[] = [700, 400];

  processstatistics:any;
  botstatistics:any;
  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  xAxisLabel = 'runs';
  showYAxisLabel = true;
  yAxisLabel = 'timeseries(ms)';
  gradient: boolean = false;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  /*grouped=[
    {
      "name": "Germany",
      "series": [
        {
          "name": "2010",
          "value": 7300000
        },
        {
          "name": "2011",
          "value": 8940000
        }
      ]
    },

    {
      "name": "USA",
      "series": [
        {
          "name": "2010",
          "value": 7870000
        },
        {
          "name": "2011",
          "value": 8270000
        }
      ]
    },

    {
      "name": "France",
      "series": [
        {
          "name": "2010",
          "value": 5000002
        },
        {
          "name": "2011",
          "value": 5800000
        }
      ]
    },
    {
      "name": "Cance",
      "series": [
        {
          "name": "2010",
          "value": 5000002
        },
        {
          "name": "2011",
          "value": 5800000
        }
      ]
    },

  ];*/
  colorScheme = {
    domain: ['#bf9d76', '#e99450', '#d89f59', '#f2dfa7', '#ff5b4f']
  };
  ngOnInit() {
    this.getbotstatistics();
    this.getprocessstatistics();
    this.getenvironments()
    this.getCategoryList();
    this.getprocessruns();
    this.linechart();
    this.getheaders();
  }
  /* TO get Bot statistics*/
  getbotstatistics()
  {
    this.rest.botStatistics().subscribe(data => { this.usageData = data;
            console.log(this.usageData);
            let datacha = Object.keys(data);
            let values=Object.values(this.usageData)
            let dataset:any=[];

            datacha.forEach((data,index)=>{
              dataset.push({
                "name":data,
                "value":values[index]
                })
            })
            this.botstatistics=dataset;
      });
  }

  getheaders()
  {
    this.rest.getprocessnames().subscribe(data=>{
      this.processnames=data;
    })
    this.rest.getautomatedtasks(0).subscribe(data=>{
      let resp:any=data;
      this.automatedtasks=resp.automationTasks;
    })
  }

  getprocessstatistics(){
    this.rest.getProcessStatistics().subscribe(data => { this.usageData = data;
      let datacha = Object.keys(data);
      let values=Object.values(this.usageData)
      let dataset:any=[];
      datacha.forEach((data,index)=>{
        dataset.push({
          "name":data,
          "value":values[index]
          })
      })
      this.processstatistics=dataset;
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
      this.chart5 = new Chart('environmets', {
        type: 'doughnut',
        data: {
          labels: Object.keys(data2),
          datasets: [
            {
              data: Object.values(data2),
              label: 'Environments',
              backgroundColor: [
                "grey",
              'green',
              'red',

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
            display: true,
            position:'bottom',
            labels: {
              padding:10,
            }
          },
          tooltips:{
            enabled:true
          }
        }
      });

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
      let bots:any=[];
      this.Performance=[];
      bots=data;
      bots=bots.reverse();
      this.bots=bots;
      let performance:any=[];
      performance=bots[0].coordinates
      performance=performance.reverse();
      for(let i=0;i<5;i++)
      {
        if(performance[i]!=undefined)
        {
            this.Performance.push({"name":"RunId "+performance[i].runId,"value":performance[i].timeDuration})
        }
        else
        {
          this.Performance.push({
            "name":" No Run"+i,
            "value":0
          })
        }
      }
    });
  }


  getruns(botid)
  {
    if(this.bots.find(botc=>botc.botId==botid) != undefined)
    {
      console.log(this.bots);
      let bot_check =this.bots.filter(botc=>botc.botId==botid)
      console.log(bot_check);
      let performances=bot_check[1].coordinates
      console.log(performances)
      performances=performances.reverse();
      this.Performance=[];
      for(let i=0;i<5;i++)
      {
        if(performances[i]!=undefined)
        {
            this.Performance.push({
              "name":"RunId "+performances[i].runId,
              "value":performances[i].timeDuration
            })
        }
        else
        {
          this.Performance.push({
            "name":"No Run"+i,
            "value":0
          })
        }
      }
    }
  }


  openDialog(filterType) {
      const dialogRef = this.dialog.open(FilterBy,{
        width: '300px',
        data: {type:filterType}
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
      });
  }

  dateranges(from , to)
  {
    var arr = new Array(), dt = new Date(from);
    while (dt <= to) {
      arr.push(new Date(dt));
      dt.setDate(dt.getDate() + 1);
    }
    return arr;
  }



  linechart()
  {
    this.rest.getAllActiveBots().subscribe(response=>{
      let resp:any=response;
      this.bots_list=resp;
      let to=new Date();
      let from=new Date();
      from.setDate(to.getDate()-30);
      let dates:any=this.dateranges(from,to)
      let labels:any=[];
      let success:any=[];
      let failed:any=[];
      let stopped:any=[];
      let total:any=[];
      dates.forEach(date=>{
        labels.push(moment(date).format("D-MM-YYYY"));
        resp.forEach(mircle=>{
          console.log(moment(mircle.createdAt).format("D-MM-YYYY"));
        })
        success.push((resp.filter(bot_check=>(moment(bot_check.createdAt).format("D-MM-YYYY")==moment(date).format("D-MM-YYYY") && bot_check.botStatus=='Success')).length))
        failed.push((resp.filter(bot_check=>(moment(bot_check.createdAt).format("D-MM-YYYY")==moment(date).format("D-MM-YYYY") && bot_check.botStatus=='Failed')).length))
        stopped.push((resp.filter(bot_check=>(moment(bot_check.createdAt).format("D-MM-YYYY")==moment(date).format("D-MM-YYYY") && bot_check.botStatus=='Stopped')).length))
        total.push((resp.filter(bot_check=>(moment(bot_check.createdAt).format("D-MM-YYYY")==moment(date).format("D-MM-YYYY"))).length))
      });

                  this.chart6 = new Chart('linechart', {
                    type: 'line',
                      data: {
                        labels: labels,
                        datasets: [
                        {
                          label: 'Success',
                          borderColor: "#2eb82e",
                          pointBackgroundColor: "#2eb82e",
                          backgroundColor: "rgba(0,255,0,0.2)",
                          fill: true,
                          data: success,
                        },
                        {
                          label: 'Failure',
                          borderColor: "#ff3300",
                          pointBackgroundColor: "#ff3300",
                          backgroundColor: "rgba(255,0,0,0.2)",
                          fill: true,
                          data: failed,
                        },
                        {
                          label: 'Stopped',
                          borderColor: "orange",
                          pointBackgroundColor:"orange",
                          backgroundColor: "rgba(255,255,0,0.2)",
                          fill: true,
                          data: stopped,
                        },
                        {
                          label: 'Total',
                          borderColor: "#00ace6",
                          pointBackgroundColor: "#00ace6",
                          backgroundColor: "rgba(0,0,255,0.2)",
                          fill: true,
                          data: total,
                        }
                      ]
                      },


                      options: {
                        responsive: true,
                        hoverMode: 'index',
                        stacked: false,
                        legend: {
                          display: true,
                          position:'bottom',
                          labels: {
                            padding:10,
                          }
                        },
                        scales: {
                          yAxes: [
                            {
                              display: true,
                              position: 'left',
                              ticks:{
                                  beginAtZero:true,
                                  userCallback: function(label, index, labels)
                                          {
                                            if (Math.floor(label) === label) {
                                                return label;
                                              }
                                          }
                                      }
                          }
                        ],
                          xAxes: [{
                            ticks: {
                                 autoSkip: false,
                                 maxRotation: 90,
                                 minRotation: 90
                             }
                           }]
                         }
                      }
                  });
                });
  }
}










@Component({
    selector: 'dailogbox',
    templateUrl: 'dailog.html',
})
export class FilterBy{
  startdate:any= new Date();
  from_date:any;
  to_date:any
  monthf_year:any;
  from_month:any;
  to_month:any
  from_year:any;
  to_year:any;
  years:any=[];
  months:any=["January","February","March","April","May","June","July",
            "August","September","October","November","December"];
  constructor(
    public dialogRef: MatDialogRef<FilterBy>,
    @Inject(MAT_DIALOG_DATA) public data:any){}
  ngOnInit() {
    this.startdate=this.startdate.getDate()-30;
    let years=[];
    let currentdate=new Date();
    let year=currentdate.getFullYear()-10;
    for(var i=1;i<11;i++)
      years.push(year+i)
    this.years=years;
  }


  apply()
  {
    this.dialogRef.close();
  }
}
