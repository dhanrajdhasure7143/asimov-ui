import { Component, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import * as moment from 'moment';
import {NgxSpinnerService} from 'ngx-spinner';
import * as Chart from 'chart.js'
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import * as $ from 'jquery'
@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.scss']
})
export class MonitoringComponent implements OnInit {

  constructor(
    private rest:RestApiService,
    private spinner:NgxSpinnerService
  ) { }
    q:any;
  ngOnInit() {

    this.getallbots();

  }
  ongoingbots:any;
  alerts:any;
  executed:any;
  failedbots:any=[];
  chart5:any;
  bots_list:any=[];
  Environments:any;
  envcount:any;
  bots:any;
  runtimestats:any=[];
  runtimestatschart:any=[];
  Performance:any=[]
  runtimeflag:boolean;
  runschart:any;
  getallbots()
  {
    
    this.spinner.show();
    this.rest.getallsobots().subscribe(resp=>{
      this.bots_list=resp;
      this.ongoingbots={
        ready:this.bots_list.filter(item=>item.botStatus=="New").length,
        running:this.bots_list.filter(item=>item.botStatus=="Inprogress"|| item.botStatus=="Running").length,
        pending:this.bots_list.filter(item=>item.botStatus=="Pending").length,
      }
      this.alerts={
        new:this.bots_list.filter(item=>item.botStatus=="New").length,
        inprogress:this.bots_list.filter(item=>item.botStatus=="Inprogress"|| item.botStatus=="Running").length,
      }
      this.executed={
        success:this.bots_list.filter(item=>item.botStatus=="Success").length,
        failure:this.bots_list.filter(item=>item.botStatus=="Failure").length,
        cancelled:this.bots_list.filter(item=>item.botStatus=="Stopped").length,
      }
      this.failedbots=this.bots_list.filter(item=>item.botStatus=="Failed"||item.botStatus=="Failure");
      this.failedbots=this.failedbots.sort(function (var1, var2) { 
        var a= new Date(var1.createdAt), b = new Date(var2.createdAt);
         if (a > b)
           return 1;
         if (a < b)
           return -1;
        
         return 0;
     });
     this.failedbots=this.failedbots.reverse();
      this.status1();
      this.status2();
      this.status4()
      this.spinner.hide();
      this.getbotscount();
      this.botruntimestats();
    })
  }


  bot_data_30:any=[];
  getbotscount1()
  {
      let to=new Date();
      let from=new Date();
      from.setDate(to.getDate()-30);
      let dates:any=this.dateranges(from,to)
      let bot_data_30:any=[];
      dates.forEach(date=>{
        this.bot_data_30.push({
          date:moment(date).format("D-MM-YYYY"),
          success:(this.bots_list.filter(bot_check=>(moment(bot_check.createdAt).format("D-MM-YYYY")==moment(date).format("D-MM-YYYY") && bot_check.botStatus=='Success')).length),
          failed:(this.bots_list.filter(bot_check=>(moment(bot_check.createdAt).format("D-MM-YYYY")==moment(date).format("D-MM-YYYY") && bot_check.botStatus=='Failure')).length),
          stopped:(this.bots_list.filter(bot_check=>(moment(bot_check.createdAt).format("D-MM-YYYY")==moment(date).format("D-MM-YYYY") && bot_check.botStatus=='Stopped')).length),
          total:(this.bots_list.filter(bot_check=>(moment(bot_check.createdAt).format("D-MM-YYYY")==moment(date).format("D-MM-YYYY"))).length)
        })
      });
      setTimeout(()=>{

        this.load_bot_by_time_graph();
      },500)

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



  load_bot_by_time_graph()
  {
    
      // Apply chart themes
      am4core.useTheme(am4themes_animated);

      // Create chart instance
      var chart = am4core.create("load_by_bots_execution", am4charts.XYChart);

      chart.data = this.bot_data_30;

      // Create axes
      var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "date";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.minGridDistance = 20;
      categoryAxis.renderer.labels.template.fontSize = 12;
      categoryAxis.renderer.labels.template.maxWidth = 120;
      categoryAxis.renderer.labels.template.wrap = true;
      // categoryAxis.renderer.labels.template.fontWeight = 500;
      categoryAxis.renderer.labels.template.rotation = -80;

      var  valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.title.text = "No.of Bots";

      // Create series
      var series1 = chart.series.push(new am4charts.ColumnSeries());
      series1.dataFields.valueY = "success";
      series1.dataFields.categoryX = "date";
      series1.name = "success";
      series1.tooltipText = "{name}: [bold]{valueY}[/]";
      series1.stacked = true;
      series1.columns.template.width = am4core.percent(20);
      series1.columns.template.fill = am4core.color("green");
      series1.columns.template.strokeWidth = 0;


      var series2 = chart.series.push(new am4charts.ColumnSeries());
      series2.dataFields.valueY = "failed";
      series2.dataFields.categoryX = "date";
      series2.name = "failed";
      series2.tooltipText = "{name}: [bold]{valueY}[/]";
      series2.stacked = true;
      series2.columns.template.width = am4core.percent(20);
      series2.columns.template.fill = am4core.color("red");
      series2.columns.template.strokeWidth = 0;

      var series3 = chart.series.push(new am4charts.ColumnSeries());
      series3.dataFields.valueY = "stopped";
      series3.dataFields.categoryX = "botnametwo";
      series3.name = "stopped";
      series3.tooltipText = "{name}: [bold]{valueY}[/]";
      series3.stacked = true;
      series3.columns.template.width = am4core.percent(20);
      series3.columns.template.fill = am4core.color("yellow");
      series3.columns.template.strokeWidth = 0;

      var series4 = chart.series.push(new am4charts.ColumnSeries());
      series4.dataFields.valueY = "total";
      series4.dataFields.categoryX = "date";
      series4.name = "total";

      series4.tooltipText = "{name}: [bold]{valueY}[/]";
      series4.stacked = true;
      series4.columns.template.width = am4core.percent(20);
      series4.columns.template.fill = am4core.color("blue");
      series4.columns.template.strokeWidth = 0;
      // Legend
      chart.legend = new am4charts.Legend();
      chart.legend.fontSize = 12;

      let markerTemplate = chart.legend.markers.template;
      markerTemplate.width = 10;
      markerTemplate.height = 10;

      // Add cursor
      chart.cursor = new am4charts.XYCursor();
      

  
  }

 


  status1()
  {
    setTimeout(()=>{

  
    am4core.ready(function() {
        
      // Themes begin
      am4core.useTheme(am4themes_animated);
      // Themes end
      
      // Create chart instance
      var chart = am4core.create("chartdiv3", am4charts.PieChart);
      
      // Add and configure Series
      var pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "litres";
      pieSeries.dataFields.category = "country";
      pieSeries.slices.template.propertyFields.fill = "color";
      // Let's cut a hole in our Pie chart the size of 30% the radius
      chart.innerRadius = am4core.percent(50);
      pieSeries.labels.template.maxWidth = 130;
  pieSeries.labels.template.wrap = true;
  pieSeries.labels.template.fontSize = 15;
      // Put a thick white border around each Slice
      pieSeries.slices.template.stroke = am4core.color("#fff");
      pieSeries.slices.template.strokeWidth = 2;
      pieSeries.slices.template.strokeOpacity = 1;
      pieSeries.slices.template
        // change the cursor on hover to make it apparent the object can be interacted with
        .cursorOverStyle = [
          {
            "property": "cursor",
            "value": "pointer"
          }
        ];
      
      pieSeries.alignLabels = false;
      pieSeries.labels.template.bent = true;
      pieSeries.labels.template.radius = 3;
      pieSeries.labels.template.padding(0,0,0,0);
      
      pieSeries.ticks.template.disabled = true;
      var label = pieSeries.createChild(am4core.Label);
      label.text = "EPSoft-369";
      label.horizontalCenter = "middle";
      label.verticalCenter = "middle";
      label.fontSize = 20;

      // Create a base filter effect (as if it's not there) for the hover to return to
      var shadow = pieSeries.slices.template.filters.push(new am4core.DropShadowFilter);
      shadow.opacity = 0;
      
      // Create hover state
      var hoverState = pieSeries.slices.template.states.getKey("hover"); // normally we have to create the hover state, in this case it already exists
      
      // Slightly shift the shadow and make it more prominent on hover
      var hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter);
      hoverShadow.opacity = 0.7;
      hoverShadow.blur = 5;
      
      // Add a legend
      
      
      chart.data = [{
        "country": "Success",
        "litres": 27,
        "color": am4core.color("#42E174")
      },{
        "country": "Failure",
        "litres": 20,
        "color": am4core.color("#a60e3f")
      },{
        "country": "Stopped",
        "litres": 18,
        "color": am4core.color("#fb5124")
      }];
      
      });  
      $("#chartdiv3 > div > svg > g > g:nth-child(2) > g:nth-child(2) > g").hide()
    },500)
  }



  status2()
  {
    setTimeout(()=>{

  
      am4core.ready(function() {
          
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end
        
        // Create chart instance
        var chart = am4core.create("chartdiv4", am4charts.PieChart);
        
        // Add and configure Series
        var pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "litres";
        pieSeries.dataFields.category = "country";
        pieSeries.slices.template.propertyFields.fill = "color";
        // Let's cut a hole in our Pie chart the size of 30% the radius
        chart.innerRadius = am4core.percent(50);
        pieSeries.labels.template.maxWidth = 130;
    pieSeries.labels.template.wrap = true;
    pieSeries.labels.template.fontSize = 15;
        // Put a thick white border around each Slice
        pieSeries.slices.template.stroke = am4core.color("#fff");
        pieSeries.slices.template.strokeWidth = 2;
        pieSeries.slices.template.strokeOpacity = 1;
        pieSeries.slices.template
          // change the cursor on hover to make it apparent the object can be interacted with
          .cursorOverStyle = [
            {
              "property": "cursor",
              "value": "pointer"
            }
          ];
        
        pieSeries.alignLabels = false;
        pieSeries.labels.template.bent = true;
        pieSeries.labels.template.radius = 3;
        pieSeries.labels.template.padding(0,0,0,0);
        
        pieSeries.ticks.template.disabled = true;
        var label = pieSeries.createChild(am4core.Label);
        label.text = "BluePrism-225";
        label.horizontalCenter = "middle";
        label.verticalCenter = "middle";
        label.fontSize = 20;
  
        // Create a base filter effect (as if it's not there) for the hover to return to
        var shadow = pieSeries.slices.template.filters.push(new am4core.DropShadowFilter);
        shadow.opacity = 0;
        
        // Create hover state
        var hoverState = pieSeries.slices.template.states.getKey("hover"); // normally we have to create the hover state, in this case it already exists
        
        // Slightly shift the shadow and make it more prominent on hover
        var hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter);
        hoverShadow.opacity = 0.7;
        hoverShadow.blur = 5;
        
        // Add a legend
        
        
        chart.data = [{
          "country": "Success",
          "litres": 27,
          "color": am4core.color("#42E174")
        },{
          "country": "Failure",
          "litres": 35,
          "color": am4core.color("#a60e3f")
        }];
        
        });  
        $("#chartdiv4 > div > svg > g > g:nth-child(2) > g:nth-child(2) > g").hide()
      },500)
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
          let filteredCoordinates:any=filteredbot.coordinates
          //.filter(item=>moment(item.startTime,"x").format("D-MM-YYYY")==moment(today).format("D-MM-YYYY")||moment(item.startTime,"x").format("D-MM-YYYY")==moment(yesterday).format("D-MM-YYYY"));
          if(filteredCoordinates.length>0)
          {
              let timedur:any=0;
              filteredCoordinates.forEach(timeseries=>{
                timedur=timedur+timeseries.timeDuration;
              })
              let data:any={
                "name":filteredbot.botName,
                "value":timedur,
                "createdAt":filteredbot.createdAt
              }
              runtimestats.push(data);
          }
        }
      });
      this.runtimestats=runtimestats.sort(function (var1, var2) { 
        var a= new Date(var1.createdAt), b = new Date(var2.createdAt);
         if (a > b)
           return 1;
         if (a < b)
           return -1;
        
         return 0;
     });
     this.runtimestats=this.runtimestats.reverse();
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
      this.runtimestatschart = am4core.create("runtime-stats", am4charts.XYChart);
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
      label1.wrap = true;
      label1.maxWidth = 120;
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
       $("#runtime-stats > div > svg > g > g:nth-child(2) > g:nth-child(2)").hide();

    },30)

  }
  runsschart()
  {
    am4core.useTheme(am4themes_animated);
    setTimeout(()=>{
      this.runschart = am4core.create("runs", am4charts.XYChart);
      this.runschart.hiddenState.properties.opacity = 0; // this creates initial fade-in
      this.runschart.data=this.Performance;
      this.runschart.zoomOutButton.disabled = true;

      this.runtimestatschart.colors.list = [
        am4core.color("#bf9d76"),
        am4core.color("#e99450"),
        am4core.color("#d89f59"),
        am4core.color("#f2dfa7"),
        am4core.color("#ff5b4f"),
        am4core.color("#74c7b8")
      ]
      var categoryAxis = this.runschart.xAxes.push(new am4charts.CategoryAxis());

      categoryAxis.dataFields.category = "name";
      categoryAxis.title.text = "Jobs";
      let label1 = categoryAxis.renderer.labels.template;
      label1.truncate = true;
      label1.maxWidth = 90;
      label1.disabled = false;
      categoryAxis.renderer.minGridDistance = 40;
      var valueAxis = this.runschart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.inside = true;
      valueAxis.renderer.labels.template.fillOpacity = 1;
      valueAxis.renderer.grid.template.strokeOpacity = 0;
      valueAxis.min = 0;
      valueAxis.cursorTooltipEnabled = false;
      valueAxis.renderer.gridContainer.zIndex = 1;
      valueAxis.title.text = "Execution Time (ms)";
      var series = this.runschart.series.push(new am4charts.ColumnSeries);
      series.dataFields.valueY = "value";
      series.dataFields.categoryX = "name";
      series.tooltipText = "{valueY.value}";

      var columnTemplate = series.columns.template;
      columnTemplate.width = 40;
      columnTemplate.column.cornerRadiusTopLeft = 10;
      columnTemplate.column.cornerRadiusTopRight = 10;
      columnTemplate.strokeOpacity = 0;
      let runtimeref=this.runschart;
      columnTemplate.events.once("inited", function(event){
        event.target.fill = runtimeref.colors.getIndex(event.target.dataItem.index);
      });
      var cursor = new am4charts.XYCursor();
      cursor.behavior = "panX";
      this.runschart.cursor = cursor;
      this.runschart.events.on("datavalidated", function () {
        if(this.Performance.length>5)
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
       $("#runs > div > svg > g > g:nth-child(2) > g:nth-child(2)").hide();

    },30)

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
      for(let i=0;i<performances.length;i++)
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
      setTimeout(()=>{
        this.runsschart();
      },200)
    }
  }
  status4()
  {
    setTimeout(()=>{

  
      am4core.ready(function() {
          
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end
        
        // Create chart instance
        var chart = am4core.create("chartdiv5", am4charts.PieChart);
        
        // Add and configure Series
        var pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "litres";
        pieSeries.dataFields.category = "country";
        pieSeries.slices.template.propertyFields.fill = "color";
        // Let's cut a hole in our Pie chart the size of 30% the radius
        chart.innerRadius = am4core.percent(50);
        pieSeries.labels.template.maxWidth = 130;
    pieSeries.labels.template.wrap = true;
    pieSeries.labels.template.fontSize = 15;
        // Put a thick white border around each Slice
        pieSeries.slices.template.stroke = am4core.color("#fff");
        pieSeries.slices.template.strokeWidth = 2;
        pieSeries.slices.template.strokeOpacity = 1;
        pieSeries.slices.template
          // change the cursor on hover to make it apparent the object can be interacted with
          .cursorOverStyle = [
            {
              "property": "cursor",
              "value": "pointer"
            }
          ];
        
        pieSeries.alignLabels = false;
        pieSeries.labels.template.bent = true;
        pieSeries.labels.template.radius = 3;
        pieSeries.labels.template.padding(0,0,0,0);
        
        pieSeries.ticks.template.disabled = true;
        var label = pieSeries.createChild(am4core.Label);
        label.text = "UiPath-122";
        label.horizontalCenter = "middle";
        label.verticalCenter = "middle";
        label.fontSize = 20;
  
        // Create a base filter effect (as if it's not there) for the hover to return to
        var shadow = pieSeries.slices.template.filters.push(new am4core.DropShadowFilter);
        shadow.opacity = 0;
        
        // Create hover state
        var hoverState = pieSeries.slices.template.states.getKey("hover"); // normally we have to create the hover state, in this case it already exists
        
        // Slightly shift the shadow and make it more prominent on hover
        var hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter);
        hoverShadow.opacity = 0.7;
        hoverShadow.blur = 5;
        
        // Add a legend
        
        
        chart.data = [{
          "country": "Success",
          "litres": 27,
          "color": am4core.color("#42E174")
        },{
          "country": "Failure",
          "litres": 35,
          "color": am4core.color("#a60e3f")
        },{
          "country": "Stopped",
          "litres": 15,
          "color": am4core.color("#fb5124")
        }];
        
        });  
        $("#chartdiv5 > div > svg > g > g:nth-child(2) > g:nth-child(2) > g").hide()
      },500)
  }



  
  getbotscount()
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
        labels.push(moment(date).format("D-MMM"));
        success.push((this.bots_list.filter(bot_check=>(moment(bot_check.createdAt).format("D-MM-YYYY")==moment(date).format("D-MM-YYYY") && bot_check.botStatus=='Success')).length))
        failed.push((this.bots_list.filter(bot_check=>(moment(bot_check.createdAt).format("D-MM-YYYY")==moment(date).format("D-MM-YYYY") && bot_check.botStatus=='Failure')).length))
        stopped.push((this.bots_list.filter(bot_check=>(moment(bot_check.createdAt).format("D-MM-YYYY")==moment(date).format("D-MM-YYYY") && bot_check.botStatus=='Stopped')).length))
        total.push((this.bots_list.filter(bot_check=>(moment(bot_check.createdAt).format("D-MM-YYYY")==moment(date).format("D-MM-YYYY"))).length))
      });
      setTimeout(()=>{

        this.linechart(labels,success,failed,stopped,total)
      },500)
      // this.botruntimestats();
      // this.getbotstatistics();
   

  }


  chart6:any;
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
                                 labelString: 'No. Of Bots'
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

  getdate(value,type){
    let currentdate=new Date();
    (type == "1") ? currentdate.setDate(currentdate.getDate() + value) : currentdate.setDate(currentdate.getDate() - value);
    return moment(currentdate).format('MMM-DD-YYYY');
  }

}
