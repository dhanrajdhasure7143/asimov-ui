import { Component, OnInit, Input } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { DataTransferService } from 'src/app/pages/services/data-transfer.service';
import {NgxSpinnerService} from 'ngx-spinner';
import * as moment from 'moment';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import {sohints} from '../model/new-so-hints';
import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';

@Component({
  selector: 'app-new-so-dashboard',
  templateUrl: './new-so-dashboard.component.html',
  styleUrls: ['./new-so-dashboard.component.css']
})
export class NewSoDashboardComponent implements OnInit {

  constructor(
    private dt:DataTransferService,
    private spinner:NgxSpinnerService,
    //private hints:sohints,
    private rest:RestApiService
    ) { }

  public automatedtasks:any=[];
  public categories:any=[];
  public accountsArray:any[];
  isAccounts:boolean=false;
  isWealth:boolean=false;
  isInsurance:boolean=false;
  isAcquisitions:boolean=false;
  isConsumer:boolean=false;

  isAccounts1:boolean=false;
  isWealth1:boolean=false;
  isInsurance1:boolean=false;
  isAcquisitions1:boolean=false;
  isConsumer1:boolean=false;
  selectedcat:any="";
  chartflag:Boolean=false;
  processtable:any=[];
  tasksTable:any=[];
  processtableflag:Boolean=false;
  taskstableflag:Boolean=false;
  count:any={
    incidentCount:"",
    human:"",
    bots:"",
    processCount:""
  }

  processCount:any={
    incident:"",
    bots:"",
    humans:""
  }

  ngOnInit() {
    localStorage.setItem('project_id',null);
    this.spinner.show();
    //this.dt.changeHints(this.hints.sodashboard1);
    setTimeout(()=>{
      this.getdepartments();
      this.getprocessnames()
      // this.loadBarChart();
      // this.loadBarChart1();
      // this.chart2();
      this.spinner.hide();
    },500)
    ////console.log('test');
    // this.dt.current_tab.subscribe(res=>{
    //   ////console.log(res);
    //   if(res=='Dashboard'){
    //     $('.dashboardchart_shownnxt').hide();
    // $('.dashboardchart_show').show();
    // $('.lob-sec').hide();
    // $('.botsbyprocess-sec').hide();
    // $('.botsbyprocess-sec2').hide();
    //   }
    // })

  }


  getautomatedtasks()
  {
    this.rest.getautomatedtasks(0).subscribe(resp=>{
      let response:any=resp;
      if(response.errorMessage==undefined)
      {
        this.automatedtasks=response.automationTasks;
        this.getprocessnames();
        
      }
    })
  }


  processnames:any=[];
  getprocessnames()
  {
    this.rest.getprocessnames().subscribe(processnames=>{
      this.processnames=processnames
      this.generategraphs();
    })
  }

  incindents:any=[];
  getincindents()
  {
    this.rest.getincidenttickets().subscribe(incidents=>{
      //console.log(incidents);
    })
  }
  getdepartments()
  {
    this.rest.getCategoriesList().subscribe(resp=>{
      let response:any=resp;
      if(response.errorMessage==undefined)
      {
        this.categories=response.data;
        this.getautomatedtasks();
        this.getincindents();
      }
      else{

      }
    })
  }


  generategraphs()
  {
    let processgroup=[]
    this.categories.forEach(item=>{
      processgroup.push({
        country:item.categoryName.charAt(0).toUpperCase()+ item.categoryName.slice(1),
        research:this.processnames.filter(item2=>item2.categoryId==item.categoryId && item2.status=="APPROVED").length
      })
      //console.log(this.processnames.filter(item2=>item2.categoryId==item.categoryId && item2.status=="APPROVED"))
    })
    this.loadChart1(processgroup)
    let botscount:any=[];
    this.processnames.forEach(item=>{
        if(item.status=="APPROVED")
          botscount.push({
            botnametwo:item.processName.charAt(0).toUpperCase()+ item.processName.slice(1),
            "UiPath": this.automatedtasks.filter(item2=>item2.processId==item.processId && item2.sourceType=="UiPath" ).length,
            "EPSoft":  this.automatedtasks.filter(item2=>item2.processId==item.processId && item2.sourceType=="EPSoft").length,
            "BluePrism":  this.automatedtasks.filter(item2=>item2.processId==item.processId && item2.sourceType=="BluePrism").length,
          })
    })
    this.chart2(botscount)
  }


  loadChart1(data){
          am4core.useTheme(am4themes_animated);
          // Create chart instance
          var chart = am4core.create("dashboardchart1", am4charts.XYChart);
          // Add data
         

          chart.data = data;
          // Create axes
          var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
          categoryAxis.dataFields.category = "country";
          categoryAxis.renderer.grid.template.location = 0;
          categoryAxis.renderer.minGridDistance = 10;
          categoryAxis.interpolationDuration = 2000;
          categoryAxis.renderer.cellStartLocation = 0.5;
          categoryAxis.renderer.cellEndLocation = 0.9;
          categoryAxis.renderer.labels.template.fontSize = 12;
          categoryAxis.renderer.labels.template.maxWidth = 150;
          categoryAxis.renderer.labels.template.wrap = true;
          // categoryAxis.renderer.labels.template.fontWeight = 500;



          var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
          valueAxis.renderer.labels.template.fontSize = 11;
          valueAxis.title.text = "Automated Process";
          // Create series

            var series = chart.series.push(new am4charts.ColumnSeries());
            series.columns.template.width = am4core.percent(10);
            series.dataFields.valueX = "research";
            series.dataFields.categoryY = "country";
            series.columns.template.tooltipText = "[bold]{valueX}[/]";
            series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
            series.columns.template.width = am4core.percent(10);
            series.columns.template.events.on(
          "hit",
          ev => {
          let a = ev.target;
         

          
            this.chartflag=true;
            let chartdata=[]
            let category=this.categories.find(item=>item.categoryName==ev.target._dataItem.dataContext["country"])
            this.selectedcat=category;
            let selectedprocesses:any=this.processnames.filter(item=>item.categoryId==category.categoryId  && item.status=="APPROVED");
            let loadchart=[]
            selectedprocesses.forEach(item=>{
              loadchart.push({
                "botname": item.processName,
                "UiPath": this.automatedtasks.filter(task=>task.processId==item.processId && task.sourceType=="UiPath").length,
                "EPSoft":this.automatedtasks.filter(task=>task.processId==item.processId && task.sourceType=="EPSoft").length,
                "BluePrism":this.automatedtasks.filter(task=>task.processId==item.processId && task.sourceType=="BluePrism").length,
              })
            })
          
            
            let botsvshumans=[]
            selectedprocesses.forEach(item=>{
              botsvshumans.push({
                "botname":item.processName,
                "Bots": this.automatedtasks.filter(item2=>item.processId==item2.processId && item2.taskType=="Automated").length,
                "Human Task": this.automatedtasks.filter(item2=>item.processId==item2.processId && item2.taskType=="Human").length,
              })
            })

           //console.log(selectedprocesses)
            this.processtable=[];
            this.processtableflag=true;
            this.taskstableflag=false;
            let botscount=0;
            let humancount=0;
            selectedprocesses.forEach(item=>{
              humancount=humancount+this.automatedtasks.filter(item2=>item2.processId==item.processId&&item2.taskType=="Human").length;
              botscount=botscount+this.automatedtasks.filter(item2=>item2.processId==item.processId&&item2.taskType=="Automated").length;
              this.processtable.push({
                processName:item.processName,
                bots:this.automatedtasks.filter(item2=>item2.processId==item.processId&&item2.taskType=="Automated").length,
                incidents:0,
                processOwner:"Karthik Peddinti",
                nextRun:"",
                currentStatus:"success",

                // currentStatus:this.automatedtasks.filter(item3=>item3.processId==item.processId && item3.status=="Failed")
              })
            })

            this.count.processCount=selectedprocesses.length
            this.count.bots=botscount
            this.count.human=humancount
            setTimeout(()=>{
              this.loadBarChart(loadchart);
              this.loadBarChart1(botsvshumans)
            },100)
         
          },
          this
          );


  }


  loadBarChart(data){

      am4core.useTheme(am4themes_animated);

      // Create chart instance
      var chart = am4core.create("botsbyprocess", am4charts.XYChart);

      // Add data
      chart.data =data;

      // Create axes
      var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "botname";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.minGridDistance = 10;
      categoryAxis.renderer.labels.template.fontSize = 12;
      // categoryAxis.renderer.labels.template.maxWidth = 100;
      categoryAxis.renderer.labels.template.wrap = true;
      categoryAxis.renderer.labels.template.rotation=270;
      // categoryAxis.renderer.labels.template.fontWeight=500;
      // categoryAxis.renderer.labels.template.rotation = -80;

      var  valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.title.text = "No.of Tasks";

      // Create series
      var series1 = chart.series.push(new am4charts.ColumnSeries());
      series1.dataFields.valueY = "UiPath";
      series1.dataFields.categoryX = "botname";
      series1.name = "UiPath";
      series1.tooltipText = "{name}: [bold]{valueY}[/]";
      series1.stacked = true;
      series1.columns.template.width = am4core.percent(20);
      series1.columns.template.fill = am4core.color("#DFBD4F");
      series1.columns.template.strokeWidth = 0;
      series1.columns.template.events.on(
        "hit",
        ev => {
        let a = ev.target;
    var idOfPie = ev.target._dataItem.dataContext["botname"];
   //console.log(idOfPie);
    this.processtableflag=false;
    this.taskstableflag=true
    this.tasksTable=this.automatedtasks.filter(item2=>item2.processName==idOfPie)
    this.processCount.incident=0
    this.processCount.bots=this.tasksTable.filter(item=>item.taskType=="Automated").length;
    
    this.processCount.human=this.tasksTable.filter(item=>item.taskType=="Human").length;
   //console.log(this.tasksTable)


     },
      this
    );
      var series2 = chart.series.push(new am4charts.ColumnSeries());
      series2.dataFields.valueY = "EPSoft";
      series2.dataFields.categoryX = "botname";
      series2.name = "EPSoft";
      series2.tooltipText = "{name}: [bold]{valueY}[/]";
      series2.stacked = true;
      series2.columns.template.width = am4core.percent(20);
      series2.columns.template.fill = am4core.color("#4F7ADF");
      series2.columns.template.strokeWidth = 0;
      series2.columns.template.events.on(
  "hit",
  ev => {
  let a = ev.target;
  var idOfPie = ev.target._dataItem.dataContext["botname"];
  this.processtableflag=false;
  this.taskstableflag=true
  this.tasksTable=this.automatedtasks.filter(item2=>item2.processName==idOfPie)
  this.processCount.incident=0
  this.processCount.bots=this.tasksTable.filter(item=>item.taskType=="Automated").length
  this.processCount.human=this.tasksTable.filter(item=>item.taskType=="Human").length
  },
  this
  );

      var series3 = chart.series.push(new am4charts.ColumnSeries());
      series3.dataFields.valueY = "BluePrism";
      series3.dataFields.categoryX = "botname";
      series3.name = "BluePrism";
      series3.tooltipText = "{name}: [bold]{valueY}[/]";
      series3.stacked = true;
      series3.columns.template.width = am4core.percent(20);
      series3.columns.template.fill = am4core.color("#76C0DC");
      series3.columns.template.strokeWidth = 0;
     series3.columns.template.events.on(
 "hit",
 ev => {
 let a = ev.target;
 var idOfPie = ev.target._dataItem.dataContext["botname"];
 this.processtableflag=false;
  this.taskstableflag=true
 this.tasksTable=this.automatedtasks.filter(item2=>item2.processName==idOfPie)
 this.processCount.incident=0
 this.processCount.bots=this.tasksTable.filter(item=>item.taskType=="Automated").length
 
 this.processCount.human=this.tasksTable.filter(item=>item.taskType=="Human").length
 },
 this
 );

      chart.colors.list = [
          am4core.color("#DFBD4F"),
          am4core.color("#4F7ADF"),
          am4core.color("#76C0DC"),
      ];
      // Legend
      chart.legend = new am4charts.Legend();
      chart.legend.fontSize = 12;
      let markerTemplate = chart.legend.markers.template;
      markerTemplate.width = 10;
      markerTemplate.height = 10;

      // Add cursor
      chart.cursor = new am4charts.XYCursor();

  }
  loadBarChart1(data){


    am4core.useTheme(am4themes_animated);
// Themes end
// Create chart instance
var chart = am4core.create("bothumantask", am4charts.XYChart);
// Add data
chart.data =data 
// Create axes
var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
categoryAxis.dataFields.category = "botname";
categoryAxis.renderer.grid.template.location = 0;
categoryAxis.renderer.labels.template.fontSize = 12;
categoryAxis.renderer.labels.template.wrap = true;
categoryAxis.renderer.labels.template.rotation=270;
// categoryAxis.renderer.labels.template.fontWeight = 500;
categoryAxis.renderer.minGridDistance = 10;

var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
valueAxis.renderer.inside = true;
valueAxis.renderer.labels.template.disabled = true;
valueAxis.renderer.labels.template.fontSize = 12;
valueAxis.min = 0;
// Create series
	function createSeries(field, name) {
	  // Set up series
	  var series = chart.series.push(new am4charts.ColumnSeries());
	  series.name = name;
	  series.dataFields.valueY = field;
	  series.dataFields.categoryX = "botname";
	  series.sequencedInterpolation = true;

	  // Make it stacked
	  series.stacked = true;

	  // Configure columns
	  series.columns.template.width = am4core.percent(20);
	  series.columns.template.tooltipText = "[normal]{name}[/]\n[font-size:12px]{categoryX}: {valueY}";
  
	  // Add label
	  var labelBullet = series.bullets.push(new am4charts.LabelBullet());
	  labelBullet.label.text = "{valueY}";
	  labelBullet.locationY = 0.5;
	  labelBullet.label.hideOversized = true;
    
	  return series;
	}
	chart.colors.list = [
        am4core.color("#BDE9A4"),
        am4core.color("#87D2EE"),
    ];
	createSeries("Bots", "Bots");
	createSeries("Human Task", "Human Task");

	// Legend
	chart.legend = new am4charts.Legend();
	chart.legend.fontSize = 12;
	let markerTemplate = chart.legend.markers.template;
	markerTemplate.width = 10;
	markerTemplate.height = 10;

  }

  chart2(data){
    $("#dashboardchart2").ready(function() {
      // Apply chart themes
      am4core.useTheme(am4themes_animated);

      // Create chart instance
      var chart = am4core.create("dashboardchart2", am4charts.XYChart);

      chart.data = data

      // Create axes
      var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "botnametwo";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.minGridDistance = 10;
      categoryAxis.renderer.labels.template.fontSize = 12;
      categoryAxis.renderer.labels.template.wrap = true;
      categoryAxis.renderer.labels.template.truncate=true;
      categoryAxis.renderer.labels.template.height=10;
      // categoryAxis.renderer.labels.template.fontWeight = 500;
      
      categoryAxis.renderer.labels.template.rotation=270;

      var  valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.title.text = "No. Of Bots";

      // Create series
      var series1 = chart.series.push(new am4charts.ColumnSeries());
      series1.dataFields.valueY = "UiPath";
      series1.dataFields.categoryX = "botnametwo";
      series1.name = "UiPath";
      series1.tooltipText = "{name}: [bold]{valueY}[/]";
      series1.stacked = true;
      series1.columns.template.width = am4core.percent(20);
      series1.columns.template.fill = am4core.color("#DFBD4F");
      series1.columns.template.strokeWidth = 0;


      var series2 = chart.series.push(new am4charts.ColumnSeries());
      series2.dataFields.valueY = "EPSoft";
      series2.dataFields.categoryX = "botnametwo";
      series2.name = "EPSoft";
      series2.tooltipText = "{name}: [bold]{valueY}[/]";
      series2.stacked = true;
      series2.columns.template.width = am4core.percent(20);
      series2.columns.template.fill = am4core.color("#4F7ADF");
      series2.columns.template.strokeWidth = 0;

      var series3 = chart.series.push(new am4charts.ColumnSeries());
      series3.dataFields.valueY = "Blue Prism";
      series3.dataFields.categoryX = "botnametwo";
      series3.name = "Blue Prism";
      series3.tooltipText = "{name}: [bold]{valueY}[/]";
      series3.stacked = true;
      series3.columns.template.width = am4core.percent(20);
      series3.columns.template.fill = am4core.color("#76C0DC");
      series3.columns.template.strokeWidth = 0;

      // Legend
      chart.legend = new am4charts.Legend();
      chart.legend.fontSize = 12;
      let markerTemplate = chart.legend.markers.template;
      markerTemplate.width = 10;
      markerTemplate.height = 10;

      // Add cursor
      chart.cursor = new am4charts.XYCursor();
      })

  }

  onchange(value){
    var bgchange =value;

  }
  // getdate(value,type){
  //   let currentdate=new Date();
  //   (type == "1") ? currentdate.setDate(currentdate.getDate() + value) : currentdate.setDate(currentdate.getDate() - value);
  //   return moment(currentdate).format('DD/MM/YYYY');
  // }
}
