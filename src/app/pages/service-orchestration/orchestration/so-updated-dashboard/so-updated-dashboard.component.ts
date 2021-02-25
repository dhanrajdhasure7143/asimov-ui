import {Inject,Input, Component, OnInit ,Pipe, PipeTransform } from '@angular/core';
import {RestApiService} from '../../../services/rest-api.service';
import * as Chart from 'chart.js'
import { NgxSpinnerService } from "ngx-spinner";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as moment from 'moment';
import * as $ from 'jquery';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import {sohints} from '../model/so-hints';
import { DataTransferService } from '../../../services/data-transfer.service';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import {FilterBy} from '../so-dashboard/so-dashboard.component'
import { FixedSizeVirtualScrollStrategy } from '@angular/cdk/scrolling';
@Component({
  selector: 'app-so-updated-dashboard',
  templateUrl: './so-updated-dashboard.component.html',
  styleUrls: ['./so-updated-dashboard.component.css']
})
export class SoUpdatedDashboardComponent implements OnInit {

  constructor(
    private rest:RestApiService,
    private spinner:NgxSpinnerService,
    private dialog:MatDialog,
    private http:HttpClient,
    private hints: sohints,
    private dt : DataTransferService,

    ) {}

  all_humans_list:any=[]
  humans_list:any=[]
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
  q:number;
  r:number;
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
  runtimestatschart:any;
  botsvshumanschart:any;
  colorScheme = {
    domain: ['#bf9d76', '#e99450', '#d89f59', '#f2dfa7', '#ff5b4f','#74c7b8']
  };
  botcolorScheme = {
    domain: ['#bf9d76', '#e99450', '#d89f59', '#f2dfa7', '#ff5b4f','#74c7b8']
  };
  ngOnInit() {
    am4core.useTheme(am4themes_animated);
    function am4themes_myTheme(target) {
      if (target instanceof am4core.ColorSet) {
        target.list = [
          am4core.color("#bf9d76"),
          am4core.color("#e99450"),
          am4core.color("#d89f59"),
          am4core.color("#f2dfa7"),
          am4core.color("#ff5b4f"),
          am4core.color("#74c7b8")
        ];
      }
    }

    am4core.useTheme(am4themes_myTheme);

    this.dt.changeHints(this.hints.sodashboardhints);
    this.spinner.show();
    this.getheaders();
    this.getbotscount();
    this.getenvironments()
    this.getCategoryList();
    //this.getprocessruns();
  }
  ngAfterViewInit(): void {

  }
  /* TO get Bot statistics*/
  /*
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
  */
//  getbotstatistics()
//  {
//    this.botstatistics=[];
//    let data=[
//               {
//                 name:"Success",
//                 value:this.bots_list.filter(item=>item.botStatus=="Success").length
//               },
//               {
//                 name:"New",
//                 value:this.bots_list.filter(item=>item.botStatus=="New").length
//               },
//               {
//                 name:"Paused",
//                 value:this.bots_list.filter(item=>item.botStatus=="Paused").length
//               },
//               {
//                 name:"Stop",
//                 value:this.bots_list.filter(item=>item.botStatus=="Stop").length
//               },

//               {
//                 name:"Failure",
//                 value:this.bots_list.filter(item=>item.botStatus=="Failure").length
//               },
//               {
//                 name:"Scheduled",
//                 value:this.bots_list.filter(item=>item.schedulerId!=null).length
//               },

//               {
//                 name:"Running",
//                 value:this.bots_list.filter(item=>item.botStatus=="Running").length
//               }
//             ]
//         if(data[0].value==0 && data[1].value==0 && data[2].value==0 && data[3].value==0 && data[4].value==0)
//           this.botstatistics=[];
//         else
//           this.botstatistics=data;
//         setTimeout(() => {
//           $('.chart-legend>div').css({width : '100%'});
//           this.spinner.hide()
//         }, 2000);
//         this.spinner.hide();
//  }

  getbotstatistics()
  {
    let data=[
      {
        name:"Success",
        value:this.bots_list.filter(item=>item.botStatus=="Success").length
      },
      {
        name:"New",
        value:this.bots_list.filter(item=>item.botStatus=="New").length
      },
      {
        name:"Paused",
        value:this.bots_list.filter(item=>item.botStatus=="Paused").length
      },
      {
        name:"Stop",
        value:this.bots_list.filter(item=>item.botStatus=="Stop").length
      },

      {
        name:"Failure",
        value:this.bots_list.filter(item=>item.botStatus=="Failure").length
      },
      {
        name:"Scheduled",
        value:this.bots_list.filter(item=>item.schedulerId!=null).length
      },

      {
        name:"Running",
        value:this.bots_list.filter(item=>item.botStatus=="Running").length
      }
    ];
    if(data[0].value==0 && data[1].value==0 && data[2].value==0 && data[3].value==0 && data[4].value==0)
      this.botstatistics=[];
    else
      this.botstatistics=data;
    this.spinner.hide();
    setTimeout(()=>{
      var chart = am4core.create("botstatistics-piechart", am4charts.PieChart);
      chart.data = this.botstatistics
      var pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "value";
      pieSeries.dataFields.category = "name";
      pieSeries.labels.template.text="{name}"
      pieSeries.slices.template.tooltipText = "{name}-{value}";
      pieSeries.hiddenState.properties.endAngle = -90;
      pieSeries.legendSettings.itemValueText = "{''}";
      chart.legend = new am4charts.Legend();
      chart.legend.position = "bottom";
      chart.innerRadius = am4core.percent(40);
      var label = pieSeries.createChild(am4core.Label);
      label.text = "{values.value.sum}";
      label.horizontalCenter = "middle";
      label.verticalCenter = "middle";
      label.fontSize = 20;
      $("#botstatistics-piechart > div > svg > g > g:nth-child(2) > g:nth-child(2) > g > g:nth-child(3)").hide();
      pieSeries.slices.template.events.on("hit", function(ev) {
        let getdata:any=ev.target.dataItem
        let data={name:getdata.category}
        this.botchart(data);
      },this);
    },50)
  }

  botchart(event:any)
  {
    this.botstat=false;
    this.q=1;
    if(event.name=="Scheduled")
      this.botstatisticstable=this.bots_list.filter(data=>data.schedulerId!=null)
    else
      this.botstatisticstable=this.bots_list.filter(data=>data.botStatus==event.name);

  }
  backtobotstatistics()
  {
    this.botstat=true;

  }

  loadcss()
  {
    setTimeout(() => {
      $('.chart-legend>div').css({width : '100%'});
      this.spinner.hide()
    }, 2000);
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
          this.getprocessstatistics();
        })
    })

    let token={​​​​​
      headers: new HttpHeaders().set('Authorization', 'Bearer '+ localStorage.getItem('accessToken')),
    }​​​​
    this.http.get("http://authdev.epsoftinc.in/authorizationservice/api/v1/application/2/usercount",token).subscribe(data=>{
      this.users=data;
    })

    let tenant=localStorage.getItem("tenantName");
    this.rest.getuserslist(tenant).subscribe(data=>
    {
        this.humans_list=data;
        this.all_humans_list=data;
    })


  }



 /* getprocessstatistics(){
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

  }*/

  getprocessstatistics(){
         let data=[

                  {
                    "name":"Pending",
                    "value":this.processnames.filter(item=>item.status=="PENDING").length
                  },
                  {
                    "name":"Inprogress",
                    "value":this.processnames.filter(item=>item.status=="INPROGRESS").length
                  },

                  {
                    "name":"Hold",
                    "value":this.processnames.filter(item=>item.status=="HOLD").length
                  },
                  {
                    "name":"Approved",
                    "value":this.processnames.filter(item=>item.status=="APPROVED").length
                  },
                  {
                    "name":"Rejected",
                    "value":this.processnames.filter(item=>item.status=="REJECTED").length
                  },
                ]

        if(data[0].value==0 && data[1].value==0 && data[2].value==0 && data[3].value==0)
          this.processstatistics=[];
        else
          this.processstatistics=data;
        setTimeout(() => {
          var chart = am4core.create("processstatistics-piechart", am4charts.PieChart);
          chart.data = this.processstatistics;
          var pieSeries = chart.series.push(new am4charts.PieSeries());
          pieSeries.dataFields.value = "value";
          pieSeries.dataFields.category = "name";
          pieSeries.labels.template.text="{name}"
          pieSeries.slices.template.tooltipText = "{name}-{value}";
          pieSeries.hiddenState.properties.endAngle = -90;
          pieSeries.legendSettings.itemValueText = "{''}";
          chart.legend = new am4charts.Legend();
          chart.legend.position = "bottom";
          chart.innerRadius = am4core.percent(40);
          var label = pieSeries.createChild(am4core.Label);
          label.text = "{values.value.sum}";
          label.horizontalCenter = "middle";
          label.verticalCenter = "middle";
          label.fontSize = 20;
          $("#processstatistics-piechart > div > svg > g > g:nth-child(2) > g:nth-child(2) > g > g:nth-child(3)").hide();
          pieSeries.slices.template.events.on("hit", function(ev) {
            let getdata:any=ev.target.dataItem
            let data={name:getdata.category}
            this.processstatstable(data);

          },this);
        }, 50);
  }


  processstatstable(event)
  {
      this.processstats_table=this.processnames.filter(item=>item.status==event.name.toUpperCase());
      this.r=1
      this.processflag=false;

  }


  getenvironments()
  {
    this.plugin();
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
              text: this.Environments.length
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
    let tasks_array=(this.processnames.filter(item=>item.status=="APPROVED")).reverse();
      tasks_array.forEach((data,index)=>{
        let value_data= {
              "process":data.processName,
              "bots":this.automatedtasks.filter(taskdata=>taskdata.processId==data.processId && (taskdata.taskType=="Bot"|| taskdata.taskType=="Automated")).length,
              "humans":this.automatedtasks.filter(taskdata=>taskdata.processId==data.processId && taskdata.taskType=="Human").length
            }
          //if(index < 7)
          this.botvshuman.push(value_data);
      })
      console.log("data charts",this.botvshuman)
      this.botsvshumansstats();
  }

  botsvshumansstats()
  {

    am4core.useTheme(am4themes_animated);
    setTimeout(()=>{
      this.botsvshumanschart = am4core.create("botsvshumans-chart", am4charts.XYChart);
      this.botsvshumanschart.legend = new am4charts.Legend()
      this.botsvshumanschart.legend.position = 'bottom'
      this.botsvshumanschart.legend.paddingBottom = 20

      this.botsvshumanschart.zoomOutButton.disabled = true;
      //this.botsvshumanschart.legend.labels.template.maxWidth = 95
      var xAxis = this.botsvshumanschart.xAxes.push(new am4charts.CategoryAxis())
      xAxis.dataFields.category = 'process'
      xAxis.title.text = "Process";
      xAxis.renderer.cellStartLocation = 0.1
      xAxis.renderer.cellEndLocation = 0.9
      xAxis.renderer.grid.template.location = 0;
      xAxis.renderer.minGridDistance = 40;
      let label1 = xAxis.renderer.labels.template;
      label1.truncate = true;
      label1.maxWidth = 90;
      label1.wrap = true;
      label1.disabled = false;
      var yAxis = this.botsvshumanschart.yAxes.push(new am4charts.ValueAxis());
      yAxis.min = 0;
      yAxis.title.text = "No of Resources";
      this.botsvshumanschart.data=this.botvshuman;
      let botvshumanschartref=this.botsvshumanschart;
      function createSeries(value, name)
      {
        var series = botvshumanschartref.series.push(new am4charts.ColumnSeries())
        series.dataFields.valueY = value
        series.dataFields.categoryX = 'process'
        series.name = name
        series.events.on("hidden", arrangeColumns);
        series.events.on("shown", arrangeColumns);
        var columnTemplate = series.columns.template;
        columnTemplate.column.cornerRadiusTopLeft = 10;
        columnTemplate.column.cornerRadiusTopRight = 10;
        var bullet = series.bullets.push(new am4charts.LabelBullet())
        bullet.interactionsEnabled = false
        bullet.dy = 30;
        bullet.label.text = '{valueY}'
        bullet.label.fill = am4core.color('#ffffff')
        return series;
      }
      createSeries('bots', 'Bots');
      createSeries('humans', 'Humans');

      function arrangeColumns()
      {

        var series =botvshumanschartref.series.getIndex(0);

        var w = 1 - xAxis.renderer.cellStartLocation - (1 - xAxis.renderer.cellEndLocation);
        if (series.dataItems.length > 1)
        {
            var x0 = xAxis.getX(series.dataItems.getIndex(0), "categoryX");
            var x1 = xAxis.getX(series.dataItems.getIndex(1), "categoryX");
            var delta = ((x1 - x0) / botvshumanschartref.series.length) * w;
            if (am4core.isNumber(delta))
            {
                var middle =botvshumanschartref.series.length / 2;

                var newIndex = 0;
                botvshumanschartref.series.each(function(series) {
                    if (!series.isHidden && !series.isHiding)
                    {
                        series.dummyData = newIndex;
                        newIndex++;
                    }
                    else
                    {
                        series.dummyData =botvshumanschartref.series.indexOf(series);
                    }
                })
                var visibleCount = newIndex;
                var newMiddle = visibleCount / 2;

                botvshumanschartref.series.each(function(series)
              {
                    var trueIndex = botvshumanschartref.series.indexOf(series);
                    var newIndex = series.dummyData;

                    var dx = (newIndex - trueIndex + middle - newMiddle) * delta

                    series.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
                    series.bulletsContainer.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
                })
            }
        }
      }


      var cursor = new am4charts.XYCursor();
      cursor.behavior = "panX";
      this.botsvshumanschart.cursor = cursor;
      this.botsvshumanschart.events.on("datavalidated", function () {
        if(this.botvshuman.length>5)
          xAxis.zoomToIndexes(0,5,false,true);
        else
          xAxis.zoomToIndexes(0,this.botvshuman.length,false,true);
      },this);

      $("#botsvshumans-chart > div > svg > g > g:nth-child(2) > g:nth-child(2) > g > g:nth-child(3) > g").hide();

    },50)
  }
  getruns(event)
  {
    let botName=event.name;
    if(this.bots.find(botc=>botc.botName==botName) != undefined)
    {
      let bot_check =this.bots.filter(botc=>botc.botName==botName);
      let performances=bot_check[0].coordinates;
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
      if(runtimestats.length!=0)
      {
        this.statschart();
      }
      this.runtimeflag=true;
    })
  }



  statschart()
  {
    am4core.useTheme(am4themes_animated);
    setTimeout(()=>{
      this.runtimestatschart = am4core.create("runtimestatistics-piechart", am4charts.XYChart);
      this.runtimestatschart.hiddenState.properties.opacity = 0; // this creates initial fade-in
      this.runtimestatschart.data=this.runtimestats;
      this.runtimestatschart.zoomOutButton.disabled = true;

      this.runtimestatschart.colors.list = [
        am4core.color("#bf9d76"),
        am4core.color("#e99450"),
        am4core.color("#d89f59"),
        am4core.color("#f2dfa7"),
        am4core.color("#ff5b4f"),
        am4core.color("#74c7b8")
      ]
      var categoryAxis = this.runtimestatschart.xAxes.push(new am4charts.CategoryAxis());

      categoryAxis.dataFields.category = "name";
      categoryAxis.title.text = "Bots";
      let label1 = categoryAxis.renderer.labels.template;
      label1.truncate = true;
      label1.maxWidth = 90;
      label1.disabled = false;
      categoryAxis.renderer.minGridDistance = 40;
      var valueAxis = this.runtimestatschart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.inside = true;
      valueAxis.renderer.labels.template.fillOpacity = 1;
      valueAxis.renderer.grid.template.strokeOpacity = 0;
      valueAxis.min = 0;
      valueAxis.cursorTooltipEnabled = false;
      valueAxis.renderer.gridContainer.zIndex = 1;
      valueAxis.title.text = "Total Execution Time (ms)";
      var series = this.runtimestatschart.series.push(new am4charts.ColumnSeries);
      series.dataFields.valueY = "value";
      series.dataFields.categoryX = "name";
      series.tooltipText = "{valueY.value}";

      var columnTemplate = series.columns.template;
      columnTemplate.width = 40;
      columnTemplate.column.cornerRadiusTopLeft = 10;
      columnTemplate.column.cornerRadiusTopRight = 10;
      columnTemplate.strokeOpacity = 0;
      let runtimeref=this.runtimestatschart;
      columnTemplate.events.once("inited", function(event){
        event.target.fill = runtimeref.colors.getIndex(event.target.dataItem.index);
      });
      var cursor = new am4charts.XYCursor();
      cursor.behavior = "panX";
      this.runtimestatschart.cursor = cursor;
      this.runtimestatschart.events.on("datavalidated", function () {
        if(this.runtimestats.length>5)
          categoryAxis.zoomToIndexes(0,7,false,true);
        else
          categoryAxis.zoomToIndexes(0,this.runtimestats.length,false,true);
      },this);
      series.columns.template.events.on("hit", function(ev) {
        let getdata:any=ev.target.dataItem.categories.categoryX
        let data={name:getdata};
        this.getruns(data);

      },this);


      var label = this.runtimestatschart.plotContainer.createChild(am4core.Label);
       label.x = 90;
       label.y = 50;
       $("#runtimestatistics-piechart > div > svg > g > g:nth-child(2) > g:nth-child(2)").hide();

    },30)

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
      });

      this.runtimestats=runtimestats;
      console.log("daata",this.runtimestats)
      this.statschart();
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
            failed.push((this.main_bot_list.filter(bot_check=>(moment(bot_check.createdAt).format("D-MM-YYYY")==moment(date).format("D-MM-YYYY") && bot_check.botStatus=='Failure')).length))
            stopped.push((this.main_bot_list.filter(bot_check=>(moment(bot_check.createdAt).format("D-MM-YYYY")==moment(date).format("D-MM-YYYY") && bot_check.botStatus=='Stopped')).length))
            total.push((this.main_bot_list.filter(bot_check=>(moment(bot_check.createdAt).format("D-MM-YYYY")==moment(date).format("D-MM-YYYY"))).length))
          });
          this.linechart(labels,success,failed,stopped,total)
        }
        else if(filterType== "month")
        {
          let year=filterdata[0];
          let from_month=filterdata[1];
          let to_month=filterdata[2];
          let months=["January","February","March","April","May","June","July",
          "August","September","October","November","December"];
          let finalmonths:any=months.slice(months.indexOf(from_month),months.indexOf(to_month)+1);
          finalmonths.forEach(date=>{
            labels.push(date+"-"+year);
            success.push((this.main_bot_list.filter(bot_check=>(moment(bot_check.createdAt).format("MMMM-YYYY")==(date+"-"+year) && bot_check.botStatus=='Success')).length))
            failed.push((this.main_bot_list.filter(bot_check=>(moment(bot_check.createdAt).format("MMMM-YYYY")== (date+"-"+year) && bot_check.botStatus=='Failure')).length))
            stopped.push((this.main_bot_list.filter(bot_check=>(moment(bot_check.createdAt).format("MMMM-YYYY")== (date+"-"+year) && bot_check.botStatus=='Stopped')).length))
            total.push((this.main_bot_list.filter(bot_check=>(moment(bot_check.createdAt).format("MMMM-YYYY")==(date+"-"+year))).length))
          });
          this.linechart(labels,success,failed,stopped,total)
        }
        else if(filterType== "year")
        {
          let from_year=filterdata[0];
          let to_year=filterdata[1];
          let years:any=[];
          for(let p=1; from_year<=to_year;p++)
            years.push(from_year++);

          years.forEach(date=>{
            labels.push(date);
            success.push((this.main_bot_list.filter(bot_check=>(moment(bot_check.createdAt).format("YYYY")==(date) && bot_check.botStatus=='Success')).length))
            failed.push((this.main_bot_list.filter(bot_check=>(moment(bot_check.createdAt).format("YYYY")== (date) && bot_check.botStatus=='Failure')).length))
            stopped.push((this.main_bot_list.filter(bot_check=>(moment(bot_check.createdAt).format("YYYY")== (date) && bot_check.botStatus=='Stopped')).length))
            total.push((this.main_bot_list.filter(bot_check=>(moment(bot_check.createdAt).format("YYYY")==(date))).length))
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
        failed.push((resp.filter(bot_check=>(moment(bot_check.createdAt).format("D-MM-YYYY")==moment(date).format("D-MM-YYYY") && bot_check.botStatus=='Failure')).length))
        stopped.push((resp.filter(bot_check=>(moment(bot_check.createdAt).format("D-MM-YYYY")==moment(date).format("D-MM-YYYY") && bot_check.botStatus=='Stopped')).length))
        total.push((resp.filter(bot_check=>(moment(bot_check.createdAt).format("D-MM-YYYY")==moment(date).format("D-MM-YYYY"))).length))
      });
      this.linechart(labels,success,failed,stopped,total)
      this.botruntimestats();
      this.getbotstatistics();
    });

  }



  resetbottransactions()
  {
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
        success.push((this.main_bot_list.filter(bot_check=>(moment(bot_check.createdAt).format("D-MM-YYYY")==moment(date).format("D-MM-YYYY") && bot_check.botStatus=='Success')).length))
        failed.push((this.main_bot_list.filter(bot_check=>(moment(bot_check.createdAt).format("D-MM-YYYY")==moment(date).format("D-MM-YYYY") && bot_check.botStatus=='Failure')).length))
        stopped.push((this.main_bot_list.filter(bot_check=>(moment(bot_check.createdAt).format("D-MM-YYYY")==moment(date).format("D-MM-YYYY") && bot_check.botStatus=='Stopped')).length))
        total.push((this.main_bot_list.filter(bot_check=>(moment(bot_check.createdAt).format("D-MM-YYYY")==moment(date).format("D-MM-YYYY"))).length))
      });
      this.linechart(labels,success,failed,stopped,total)

  }




  public pop:Boolean=true;
  linechart(labels,success,failed,stopped,total)
  {

      if(this.chart6!=undefined)
      {
        this.chart6.destroy();
        $("#linechart").remove();
        $("#linechart_data").append(" <canvas id='linechart' style='width:100% !important ;height:300px !important;'></canvas>");
      }
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
                  this.chart6.update();
  }




  sortbycat()
  {
    let bot_list_check:any=[];
    this.botstat=true;
    bot_list_check=this.main_bot_list.filter(item=>item.department==this.selectedcat);
    let category:any;
    category=this.categaoriesList.find(item=>item.categoryId==this.selectedcat);
    this.humans_list=this.all_humans_list.filter(item=>item.userId.department==category.categoryName);
    this.bots_list=bot_list_check;
    this.botruntimestats()
    /*
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
    })*/;
    this.processnames=this.allprocessnames.filter(item=>item.categoryId==this.selectedcat);
    this.automatedtasks=this.mainautomatedtasks.filter(item=>item.categoryId==this.selectedcat)
    this.getbotsvshumans();
    this.getprocessstatistics();
    this.getbotstatistics();
  }

  reset_all()
  {
    this.selectedcat="";
    this.ngOnInit();
  }


  plugin()
  {
    Chart.pluginService.register({
      beforeDraw: function(chart) {
        if (chart.config.options.elements.center) {
          // Get ctx from string
          var ctx = chart.chart.ctx;

          // Get options from the center object in options
          var centerConfig = chart.config.options.elements.center;
          var fontStyle = centerConfig.fontStyle || 'Arial';
          var txt = centerConfig.text;
          var color = centerConfig.color || '#000';
          var maxFontSize = centerConfig.maxFontSize || 75;
          var sidePadding = centerConfig.sidePadding || 20;
          var sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
          // Start with a base font of 30px
          ctx.font = "30px " + fontStyle;

          // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
          var stringWidth = ctx.measureText(txt).width;
          var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

          // Find out how much the font can grow in width.
          var widthRatio = elementWidth / stringWidth;
          var newFontSize = Math.floor(30 * widthRatio);
          var elementHeight = (chart.innerRadius * 2);

          // Pick a new font size so it will not be larger than the height of label.
          var fontSizeToUse = Math.min(newFontSize, elementHeight, maxFontSize);
          var minFontSize = centerConfig.minFontSize;
          var lineHeight = centerConfig.lineHeight || 25;
          var wrapText = false;

          if (minFontSize === undefined) {
            minFontSize = 15;
          }

          if (minFontSize && fontSizeToUse < minFontSize) {
            fontSizeToUse = 15;
            wrapText = true;
          }

          // Set font settings to draw it correctly.
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
          var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
          ctx.font = "15px";
          ctx.fillStyle = "black";

          if (!wrapText) {
            ctx.fillText(txt, centerX, centerY);
            return;
          }

          var words = txt.split(' ');
          var line = '';
          var lines = [];

          // Break words up into multiple lines if necessary
          for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = ctx.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > elementWidth && n > 0) {
              lines.push(line);
              line = words[n] + ' ';
            } else {
              line = testLine;
            }
          }

          // Move the center up depending on line height and number of lines
          centerY -= (lines.length / 2) * lineHeight;

          for (var n = 0; n < lines.length; n++) {
            ctx.fillText(lines[n], centerX, centerY);
            centerY += lineHeight;
          }
          //Draw text in center
          ctx.fillText(line, centerX, centerY);
        }
      }
    });
  }


}





// =================================Dailog Box======================================//






/*

@Component({
    selector: 'dailogbox',
    templateUrl: 'dailog.html',
})
export class FilterBy{
  startdate:any= new Date();
  from_date:any;
  to_date:any
  today:any;
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
    this.today=currentdate;
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




*/



@Pipe({name: 'Category'})
export class CategoryUpdate implements PipeTransform {
  transform(value: any,arg:any)
  {
    let categories:any=[];
    categories=arg;
    return categories.find(item=>item.categoryId==value).categoryName;
  }
}



@Pipe({name: 'Slicedate'})
export class SlicedateUpdate implements PipeTransform {
  transform(value: any,arg:any)
  {
    let selectedArray:any=[]
    selectedArray=value;
    return selectedArray.slice(selectedArray.indexOf(arg),selectedArray.length);
  }
}



