import {Inject,Input, Component, OnInit ,Pipe, PipeTransform } from '@angular/core';
import {RestApiService} from '../../../services/rest-api.service';
import * as Chart from 'chart.js'
import { NgxSpinnerService } from "ngx-spinner";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as moment from 'moment';
import * as $ from 'jquery';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { noUndefined } from '@angular/compiler/src/util';
@Component({
  selector: 'app-so-dashboard',
  templateUrl: './so-dashboard.component.html',
  styleUrls: ['./so-dashboard.component.css']
})
export class SoDashboardComponent implements OnInit {

  constructor(
    private rest:RestApiService,
    private spinner:NgxSpinnerService,
    private dialog:MatDialog,
    private http:HttpClient
    ) {}
  botstat:Boolean=true;
  runtimeflag:Boolean=true;
  processflag:Boolean=true;
  public selectedcat:any;
  processstats_table:any=[]
  categaoriesList:any
  allprocessnames:any;
  processnames:any
  automatedtasks:any
  bots_list:any;
  main_bot_list;
  bots:any;
  transactions:any;
  chart:any
  usageData:any;
  chart5:any;
  chart6:any;
  data_sets:any=[];
  Environments:any;
  envcount:any;
  Performance:any=[];
  users:any;
  runtimestats:any=[]
  mainautomatedtasks:any=[];
  botflag:Boolean=false;
  view: any[] = [700, 400];

  processstatistics:any=[];
  botstatistics:any=[];
  botstatisticstable:any=[];
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
  botvshuman:any=[];
  colorScheme = {
    domain: ['#bf9d76', '#e99450', '#d89f59', '#f2dfa7', '#ff5b4f']
  };
  ngOnInit() {
    this.spinner.show();
    this.getheaders();
    this.getbotstatistics();
    this.getprocessstatistics();
    this.getenvironments()
    this.getCategoryList();
    //this.getprocessruns();
    this.getbotscount();
    this.botruntimestats();
  }
  ngAfterViewInit(): void {

  }
  /* TO get Bot statistics*/
  getbotstatistics()
  {
    this.botstatistics=[];
    this.rest.botStatistics().subscribe(data => { this.usageData = data;
          let resp:any=data;
          if(resp.errorMessage==undefined)
          {
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
            setTimeout(() => {
              $('.chart-legend>div').css({width : '100%'});
              this.spinner.hide()
            }, 2000);
          }
      },(err)=>{
        console.log(err)
        this.spinner.hide();
      });
  }


  botchart(event:any)
  {
    this.botstat=false;
    this.botstatisticstable=this.bots_list.filter(data=>data.botStatus==event.name);

  }
  backtobotstatistics()
  {
    this.botstat=true;
  }

  getheaders()
  {
    this.rest.getautomatedtasks(0).subscribe(data=>{
      let resp:any=data;
      this.automatedtasks=resp.automationTasks;
      this.mainautomatedtasks=resp.automationTasks;
        this.rest.getprocessnames().subscribe(data=>{
          this.processnames=data;
          this.allprocessnames=data;
          this.getbotsvshumans()
        })
    })

    let token={​​​​​
      headers: new HttpHeaders().set('Authorization', 'Bearer '+ localStorage.getItem('accessToken')),
    }​​​​
    this.http.get("http://authdev.epsoftinc.in/authorizationservice/api/v1/application/2/usercount",token).subscribe(data=>{
      this.users=data;
      console.log(this.users)
    })

  }



  getprocessstatistics(){
    this.rest.getProcessStatistics().subscribe(data => { this.usageData = data;
      let resp:any=data
      if(resp.errorMessage==undefined)
      {
        let datacha = Object.keys(data);
        let values=Object.values(this.usageData)
        let dataset:any=[];
        datacha.forEach((data,index)=>{
          dataset.push({
            "name":this.titleCaseWord(data),
            "value":values[index]
            })
        })
        this.processstatistics=dataset;
        setTimeout(() => {
          $('.chart-legend>div').css({width : '100%'});
        }, 2000);
      }
    });

  }
  processstatstable(event)
  {
    console.log(this.processflag)
      this.processstats_table=this.processnames.filter(item=>item.status==event.name.toUpperCase());
      console.log(this.processstats_table);
      this.processflag=false;
  }


  getenvironments()
  {
    this.rest.listEnvironments().subscribe(data=>{
      this.Environments=data;
      let Linux=this.Environments.filter(Data=>Data.environmentType=="Linux").length;
      let Mac=this.Environments.filter(Data=>Data.environmentType=="Mac").length;
      let Windows=this.Environments.filter(Data=>Data.environmentType=="Windows").length;
      this.envcount=this.Environments.length;
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
                '#5AA454',
              '#820263',
              '#A10A28',

            ],
              fill: false,
              borderColor: '#fff',
              borderWidth: '1px',
            },
          ]
        },
        options: {
          // cutoutPercentage	: 65,
          elements: {
            center: {
              text: 'Red is 2/3 of the total numbers'
            },
          },
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
      for(let i=0;i<10;i++)
      {
        if(performance[i]!=undefined)
        {
            this.Performance.push({"name":""+performance[i].runId,"value":performance[i].timeDuration})
        }
      }
    });
  }

  getbotsvshumans()
  {
    this.botvshuman=[]
    let tasks_array=this.processnames.reverse();
      tasks_array.forEach((data,index)=>{
        let value_data={
          "name": data.processName,
          "series":[
            {
              "name":"Bots",
              "value":this.automatedtasks.filter(taskdata=>taskdata.processId==data.processId && taskdata.taskType=="Bot").length,
            },
            {
              "name":"Humans",
              "value":this.automatedtasks.filter(taskdata=>taskdata.processId==data.processId && taskdata.taskType=="Human").length,
            }]
          };
          if(index < 7)
          this.botvshuman.push(value_data);
      })
      console.log(this.botvshuman);
  }


  getruns(event)
  {
    let botName=event.name;
    if(this.bots.find(botc=>botc.botName==botName) != undefined)
    {
      console.log(this.bots);
      let bot_check =this.bots.filter(botc=>botc.botName==botName)
      console.log(bot_check);
      let performances=bot_check[0].coordinates
      console.log(performances)
      performances=performances.reverse();
      this.Performance=[];
      for(let i=0;i<10;i++)
      {
        if(performances[i]!=undefined)
        {
            this.Performance.push({
              "name":""+performances[i].runId,
              "value":performances[i].timeDuration
            })
        }
      }
      this.runtimeflag=false;
    }
  }


  botruntimestats()
  {
    this.rest.botPerformance().subscribe(data=>{
      let botperformances:any=[]
      botperformances=data;
      this.bots=botperformances;
      let today=new Date();
      let yesterday=new Date();
      let runtimestats:any=[]
      yesterday.setDate(today.getDate()-1);
      this.bots_list.forEach(bot => {
        let filteredbot:any;
        filteredbot=botperformances.find(item=>item.botId==bot.botId);
        if(filteredbot != undefined)
        {
          let filteredCoordinates:any=filteredbot.coordinates.filter(item=>moment(item.startTime,"x").format("D-MM-YYYY")==moment(today).format("D-MM-YYYY")||moment(item.startTime,"x").format("D-MM-YYYY")==moment(yesterday).format("D-MM-YYYY"));
          if(filteredCoordinates.length>0)
          {
              let timedur:any=0;
              filteredCoordinates.forEach(timeseries=>{
                timedur=timedur+timeseries.timeDuration;
              })
              let data:any={
                //id:filteredbot.botId,
                "name":filteredbot.botName,
                "value":timedur
              }
              runtimestats.push(data);
              //console.log(this.Performance);
          }
        }
      });
      this.runtimestats=runtimestats;
      console.log(runtimestats);
      this.runtimeflag=true;
    })
  }


  openbotstatfilter()
  {
    const dialogRef = this.dialog.open(FilterBy,{
      width: '300px',
      data: {type:"date"}
    });

    dialogRef.afterClosed().subscribe(result => {
      let filterdata:any=[];
      filterdata=result;
      console.log("------------from date-----------",new Date(filterdata[0]));
      console.log("------------to date-----------",new Date(filterdata[1]));
      let start_date:any=new Date(filterdata[0]);
      let end_date:any=new Date(filterdata[1]);
      let runtimestats:any=[];
      this.bots_list.forEach(bot => {
        let filteredbot:any;
        filteredbot=this.bots.find(item=>item.botId==bot.botId);
        if(filteredbot != undefined)
        {
          let filteredCoordinates:any=[];
          filteredbot.coordinates.forEach((item,index)=>{
            let check_date=moment(item.startTime,"x").format("YYYY-MM-D");
            let s_date=moment(start_date).format("YYYY-MM-D")
            let e_date=moment(end_date).format("YYYY-MM-D");
            if((moment(check_date).isSameOrBefore(e_date) && moment(check_date).isSameOrAfter(s_date)))
            {
              filteredCoordinates.push(item);
            }
          });
          if(filteredCoordinates.length>0)
          {
              let timedur:any=0;
              filteredCoordinates.forEach(timeseries=>{
                timedur=timedur+timeseries.timeDuration;
              })
              let data:any={
                //id:filteredbot.botId,
                "name":filteredbot.botName,
                "value":timedur
              }
              runtimestats.push(data);
              //console.log(this.Performance);
          }
        }
        this.runtimestats=runtimestats;
      });
    });
  }

  openDialog(filterType)
  {
      const dialogRef = this.dialog.open(FilterBy,{
        width: '300px',
        data: {type:filterType}
      });

      dialogRef.afterClosed().subscribe(result => {
        let filterdata:any=[];
        filterdata=result;
        let success:any=[];
        let failed:any=[];
        let stopped:any=[];
        let total:any=[];
        let labels:any=[];
        if(filterType== "date")
        {
          let from:any=filterdata[0];
          let to:any=filterdata[1];
          let date_array=this.dateranges(from,to);
          date_array.forEach(date=>{
            labels.push(moment(date).format("D-MM-YYYY"));
            success.push((this.main_bot_list.filter(bot_check=>(moment(bot_check.createdAt).format("D-MM-YYYY")==moment(date).format("D-MM-YYYY") && bot_check.botStatus=='Success')).length))
            failed.push((this.main_bot_list.filter(bot_check=>(moment(bot_check.createdAt).format("D-MM-YYYY")==moment(date).format("D-MM-YYYY") && bot_check.botStatus=='Failed')).length))
            stopped.push((this.main_bot_list.filter(bot_check=>(moment(bot_check.createdAt).format("D-MM-YYYY")==moment(date).format("D-MM-YYYY") && bot_check.botStatus=='Stopped')).length))
            total.push((this.main_bot_list.filter(bot_check=>(moment(bot_check.createdAt).format("D-MM-YYYY")==moment(date).format("D-MM-YYYY"))).length))
          });
          this.linechart(labels,success,failed,stopped,total)
        }
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



  titleCaseWord(word: string) {
    if (!word) return word;
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }

  getbotscount()
  {
    this.rest.getAllActiveBots().subscribe(response=>{
      let resp:any=response;
      this.main_bot_list=resp;
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
        success.push((resp.filter(bot_check=>(moment(bot_check.createdAt).format("D-MM-YYYY")==moment(date).format("D-MM-YYYY") && bot_check.botStatus=='Success')).length))
        failed.push((resp.filter(bot_check=>(moment(bot_check.createdAt).format("D-MM-YYYY")==moment(date).format("D-MM-YYYY") && bot_check.botStatus=='Failed')).length))
        stopped.push((resp.filter(bot_check=>(moment(bot_check.createdAt).format("D-MM-YYYY")==moment(date).format("D-MM-YYYY") && bot_check.botStatus=='Stopped')).length))
        total.push((resp.filter(bot_check=>(moment(bot_check.createdAt).format("D-MM-YYYY")==moment(date).format("D-MM-YYYY"))).length))
      });
      this.linechart(labels,success,failed,stopped,total)
    });

  }

  linechart(labels,success,failed,stopped,total)
  {

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
                          yAxes: [{
                            scaleLabel: {
                                 display: true,
                                 labelString: 'No of Bots'
                               },
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
                            scaleLabel: {
                                 display: true,
                                 labelString: 'Transaction Date'
                               },
                            ticks: {
                                 autoSkip: false,
                                 maxRotation: 90,
                                 minRotation: 90
                             }
                           }]
                         }
                      }
                  });

  }




  sortbycat()
  {
    let bot_list_check:any=[];
    this.botstat=true;
    bot_list_check=this.main_bot_list.filter(item=>item.department==this.selectedcat);
    console.log(bot_list_check);

    this.bots_list=bot_list_check;
    this.botruntimestats()

    this.rest.getProcessStatisticsbycat(this.selectedcat).subscribe(data => {
    let response:any=data;
    if(response.errorMessage==undefined)
    {
      this.usageData = response;
      let datacha = Object.keys(data);
      let values=Object.values(this.usageData)
      let dataset:any=[];
      datacha.forEach((data,index)=>{
        dataset.push({
          "name":this.titleCaseWord(data),
          "value":values[index]
          })
      })
      this.processstatistics=dataset;
    }
    else
    {
      this.processstatistics=[];
    }

    });
    this.rest.botStatisticsbycat(this.selectedcat).subscribe(data => {
      let resp:any=data;
      if(resp.errorMessage ==undefined)
      {
        this.usageData = data;
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
        setTimeout(() => {
          $('.chart-legend>div').css({width : '100%'});
          this.spinner.hide()
        }, 2000);
      }
      else
      {
        this.botstatistics=[];
      }
    },(err)=>{
      console.log(err)
      this.spinner.hide();
    });
    this.processnames=this.allprocessnames.filter(item=>item.categoryId==this.selectedcat);
    this.automatedtasks=this.mainautomatedtasks.filter(item=>item.categoryId==this.selectedcat)
    this.getbotsvshumans();
  }

  reset_all()
  {
    this.selectedcat="";
    this.ngOnInit();
  }


}





// =================================Dailog Box======================================//








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








@Pipe({name: 'Category'})
export class Category implements PipeTransform {
  transform(value: any,arg:any)
  {
    let categories:any=[];
    categories=arg;
    console.log("departments",categories);
    console.log("id",value);
    return categories.find(item=>item.categoryId==value).categoryName;
  }
}
