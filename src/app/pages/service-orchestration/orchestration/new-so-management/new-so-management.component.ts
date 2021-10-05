import { Component, ViewChild, OnInit } from '@angular/core';
import {RestApiService} from '../../../services/rest-api.service';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

import { throwMatDuplicatedDrawerError } from '@angular/material';
import { NotifierService } from 'angular-notifier';
@Component({
  selector: 'app-new-so-management',
  templateUrl: './new-so-management.component.html',
  styleUrls: ['./new-so-management.component.css']
})
export class NewSoManagementComponent implements OnInit {
  url: string = "http://10.11.0.129:8080/knowage/servlet/AdapterHTTP?ACTION_NAME=EXECUTE_DOCUMENT_ACTION&OBJECT_LABEL=Incident_Mngmt Tab&TOOLBAR_VISIBLE=false&ORGANIZATION=DEMO&NEW_SESSION=false";
  urlSafe: SafeResourceUrl;
  constructor(
    private rest:RestApiService,
    private spinner:NgxSpinnerService,
    private notifier: NotifierService,
    public sanitizer: DomSanitizer
  ) { }
  public botstatistics: any = 0;
  public select:any;
  public datasource: any;
  public New : any = 0;
  public SolvedRemo : any = 0;
  public SolvedWA : any = 0;
  public ClosedRes : any = 0;
  public SolvedPer : any = 0;
  public activestatusSolvedPer : any = [];
  public inactivestatusClosedRes : any = [];
  public inactivestatusSolvedWA : any = [];
  public inactivestatusSolvedRemo : any = [];
  public inactivestatusNew : any = [];
  public obj : any = [];
  public objpriority : any = [];
  public PriMedium : any = 0;
	public PriLow : any = 0;
	public PriHigh : any = 0;
  public priorityHigh : any = [];
  public priorityMedium : any = [];
  public priorityLow : any = [];
  public objincidentId:any = [];
  displayedColumns: string[] = [
  "incidentId",
  "short_description" ,
  "description",
  "createdAt",
  "incidentStatus",
  "assignedTo"
];
  //@ViewChild("paginator1",{static:false}) paginator1: MatPaginator;
  //@ViewChild("sort1",{static:false}) sort1: MatSort;
  dataSource1:any;
  isTableHasData:Boolean=false;
  nodata:Boolean=false;
  ngOnInit(){
    this.spinner.show();

     $(".left_arrow_chart1").hide();
              $('.chartdivbody').hide();
              $('.ASSolvedPer').hide();
              $('.AsClosedRes').hide();
              $('.ASSolvedWA').hide();
              $('.ASSolvedRemo').hide();
              $('.ASNew').hide();
    
    //this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    $('.ASSolvedPer').hide();
    $('.AsClosedRes').hide();
    $('.ASSolvedWA').hide();
    $('.ASSolvedRemo').hide();
    $('.ASNew').hide();
    $('.left_arrow_chart4').hide();
    $('.chart_div_High_4').hide();
    $('.chart_div_Medium_4').hide();
    $('.chart_div_Low_4').hide();
    this.rest.loadChart1().subscribe( data =>{
      this.spinner.show();
      this.chart2();
      console.log(data);
      this.datasource = data;
      console.log(this.datasource);
      if(this.datasource.errorMessage!=undefined)
        {
        this.botstatistics = 0 ;
          this.spinner.hide();
          //Swal.fire(resp.errorMessage,"","warning");
        }
      else{
        this.botstatistics = 1;
      setTimeout(() => {
        this.chart1();    
        this.chart3();
        this.chart4();
      }, 500);
    }
    });
  
    //this.gettickets();
  }

  selectchart1(){
    this.spinner.show();
    this.chart1();
    $(".left_arrow_chart1").hide();
    $('.chartdivbody').show();
    $('.ASSolvedPer').hide();
    $('.AsClosedRes').hide();
    $('.ASSolvedWA').hide();
    $('.ASSolvedRemo').hide();
    $('.ASNew').hide();
    this.spinner.hide();
  }

  selectchart4(){
    this.spinner.show();
    this.chart4();
    $('.chart_div_4').show();
    $(".left_arrow_chart4").hide();
    $('.chart_div_High_4').hide();
    $('.chart_div_Medium_4').hide();
    $('.chart_div_Low_4').hide();
    this.spinner.hide();
  }
  
  chart1(){

    this.spinner.show();
    $('.chartdivbody').show();
    $('.ASSolvedPer').hide();
    $('.AsClosedRes').hide();
    $('.ASSolvedWA').hide();
    $('.ASSolvedRemo').hide();
    $('.ASNew').hide();
    this.activestatusSolvedPer = [];
    this.inactivestatusClosedRes = [];
    this.inactivestatusSolvedWA = [];
    this.inactivestatusSolvedRemo = [];
    this.inactivestatusNew = [];
    
    am4core.useTheme(am4themes_animated);
    let chart = am4core.create("chartdiv", am4charts.PieChart);
    
        
    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "litres";
    pieSeries.dataFields.category = "country";
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.labels.template.maxWidth = 130;
    pieSeries.labels.template.bent = false;
    pieSeries.labels.template.wrap = true;
    pieSeries.labels.template.fontSize = 11;
    pieSeries.labels.template.padding(0,0,0,0);
    pieSeries.ticks.template.disabled = false;
    chart.innerRadius = am4core.percent(40);
    
    pieSeries.slices.template.events.on(
      "hit",
      ev => {
      let a = ev.target;
      var idOfPie = ev.target._dataItem.dataContext["country"];
        switch(idOfPie) {
          case 'Closed/Resolved by Caller':
              $(".left_arrow_chart1").show();
              $('.chartdivbody').hide();
              $('.ASSolvedPer').hide();
              $('.AsClosedRes').show();
              $('.ASSolvedWA').hide();
              $('.ASSolvedRemo').hide();
              $('.ASNew').hide();
              /*document.querySelector('.AsClosedRes').scrollIntoView({
                behavior: 'smooth'
            });*/
              break;
          case 'Solved (Permanently)':
            $(".left_arrow_chart1").show();
            $('.chartdivbody').hide();
            $('.ASSolvedPer').show();
            $('.AsClosedRes').hide();
            $('.ASSolvedWA').hide();
            $('.ASSolvedRemo').hide();
            $('.ASNew').hide();
            /*  document.querySelector('.ASSolvedPer').scrollIntoView({
                behavior: 'smooth'
            });*/
              break;
            //Solved Remotely (Permanently)
            case 'Solved Remotely (Permanently)':
              $(".left_arrow_chart1").show();
              $('.chartdivbody').hide();
              $('.ASSolvedPer').hide();
              $('.AsClosedRes').hide();
              $('.ASSolvedWA').hide();
              $('.ASSolvedRemo').show();
              $('.ASNew').hide();
          
               /* document.querySelector('.ASSolvedRemo').scrollIntoView({
                  behavior: 'smooth'
              });*/
                break;

              //New  
              case 'New':
                $(".left_arrow_chart1").show();
                $('.chartdivbody').hide();
                $('.ASSolvedPer').hide();
                $('.AsClosedRes').hide();
                $('.ASSolvedWA').hide();
                $('.ASSolvedRemo').hide();
                $('.ASNew').show();
            
                 /* document.querySelector('.ASNew').scrollIntoView({
                    behavior: 'smooth'
                });*/
                break;
              
              case 'Solved (Work Around)':
                $(".left_arrow_chart1").show();
                $('.chartdivbody').hide();
                $('.ASSolvedPer').hide();
                $('.AsClosedRes').hide();
                $('.ASSolvedWA').show();
                $('.ASSolvedRemo').hide();
                $('.ASNew').hide();
            
                  /*document.querySelector('.ASSolvedWA').scrollIntoView({
                    behavior: 'smooth'
                });*/
                break;
              
                case 'Solved (Work Around)':
                  $(".left_arrow_chart1").show();
                  $('.chartdivbody').hide();
                  $('.ASSolvedPer').hide();
                  $('.AsClosedRes').hide();
                  $('.ASSolvedWA').show();
                  $('.ASSolvedRemo').hide();
                  $('.ASNew').hide();
              
                    /*document.querySelector('.ASSolvedWA').scrollIntoView({
                      behavior: 'smooth'
                  });*/
                  break;
          default:
              $('.chartdivbody').show();
              $('.ASSolvedPer').hide();
              $('.AsClosedRes').hide();
              $('.ASSolvedWA').hide();
              $('.ASSolvedRemo').hide();
              $('.ASNew').hide();
        }
      },
    this
    );

    //label
    var label = pieSeries.createChild(am4core.Label);
    label.text = this.datasource.length;
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 20;


    // This creates initial animation
    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;
    
    //chart.hiddenState.properties.radius = am4core.percent(-15);
    // Add a legend
    chart.legend = new am4charts.Legend();
    chart.legend.fontSize = 13;
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 10;
    markerTemplate.height = 10;

    this.SolvedPer = 0;
    this.ClosedRes = 0;
    this.SolvedWA = 0;
    this.SolvedRemo = 0;
    this.New = 0;
    for(let i = 0; i< this.datasource.length ; i++ )
    {
        this.obj.push(this.datasource[i].incidentStatus);
    }
    this.obj = [...new Set(this.obj)];
    console.log(this.obj);
    let seriesName =this.obj;
    for(let i=0 ; i< this.obj.length ;i++){
      for(let j = 0; j < this.datasource.length; j++){
        if(seriesName[i] == this.datasource[j].incidentStatus){
        if(seriesName[i] == "Solved (Permanently)"){
        this.SolvedPer = this.SolvedPer+1; 
        }
        else if(seriesName[i] == "Closed/Resolved by Caller"){
        this.ClosedRes = this.ClosedRes+1;
        }
        else if(seriesName[i] == "Solved (Work Around)"){
        this.SolvedWA = this.SolvedWA+1;
        }
        else if(seriesName[i] == "Solved Remotely (Permanently)"){
        this.SolvedRemo = this.SolvedRemo+1;
        }
        else if(seriesName[i] == "New"){
        this.New = this.New+1;
        }
        }
      }
    }
    let data1 : any;
    for( data1 of this.datasource){
       if(data1.incidentStatus == "Solved (Permanently)"){
        this.activestatusSolvedPer.push(data1);
       }
       if(data1.incidentStatus == "Closed/Resolved by Caller"){
        this.inactivestatusClosedRes.push(data1);
       }
       if(data1.incidentStatus == "Solved (Work Around)"){
        this.inactivestatusSolvedWA.push(data1);
       }
       if(data1.incidentStatus == "Solved Remotely (Permanently)"){
        this.inactivestatusSolvedRemo.push(data1);
       }
       if(data1.incidentStatus == "New"){
        this.inactivestatusNew.push(data1);
       }
    }
    
    chart.data = [{
      "country": "Solved (Permanently)",
      "litres": this.SolvedPer,
      "color": am4core.color("#00c45f")
    },{
      "country": "Closed/Resolved by Caller",
      "litres": this.ClosedRes,
      "color": am4core.color("#ff6361")
    }, {
      "country": "Solved (Work Around)",
      "litres": this.SolvedWA,
      "color": am4core.color("#aa28eb")
    }, {
      "country": "Solved Remotely (Permanently)",
      "litres": this.SolvedRemo,
      "color": am4core.color("#9e9e9e")
    }, {
      "country": "New",
      "litres": this.New,
      "color": am4core.color("#00bfff")
    }];
    this.spinner.hide();
  }


  chart2(){

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end
    
    // Create chart instance
    var chart = am4core.create("chartdiv2", am4charts.PieChart);
    // Add and configure Series
    var pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "litres";
    pieSeries.dataFields.category = "country";
    pieSeries.slices.template.propertyFields.fill = "color";
    // Let's cut a hole in our Pie chart the size of 30% the radius
    chart.innerRadius = am4core.percent(30);
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
    pieSeries.labels.template.maxWidth = 130;
    pieSeries.labels.template.wrap = true;
    pieSeries.labels.template.fontSize = 18;
    pieSeries.labels.template.bent = false;
    pieSeries.labels.template.padding(0,0,0,0);
    pieSeries.ticks.template.disabled = true;
    pieSeries.alignLabels = false;
    pieSeries.labels.template.text = "{value.percent.formatNumber('#.')}";
    pieSeries.labels.template.radius = am4core.percent(-40);
    pieSeries.labels.template.fill = am4core.color("white");
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

    chart.legend = new am4charts.Legend();
    chart.legend.fontSize = 13;
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 10;
    markerTemplate.height = 10;
    chart.innerRadius = am4core.percent(0);
       
    chart.data = [{
      "country": "HR",
      "litres": 50,
      "color": am4core.color("#32cd32")
    },{
      "country": "Finance",
      "litres": 35,
      "color": am4core.color("#ff6361")
    }, {
      "country": "Support",
      "litres": 28,
      "color": am4core.color("#f5c71a")
    }, {
      "country": "Admin",
      "litres": 12,
      "color": am4core.color("#00b7eb")
    }, {
      "country": "Infra",
      "litres": 20,
      "color": am4core.color("#bf00ff")
    }, {
      "country": "Marketing",
      "litres": 17,
      "color": am4core.color("#bcb88a")
    }, {
      "country": "Sales",
      "litres": 18,
      "color": am4core.color("#c0c0c0")
    }
  ];

  }
  
  //Chart 3

  chart3(){
    this.spinner.show();

    var chart = am4core.create("chartdiv3", am4charts.XYChart);

    let value: any = 0;
  
let incidentarra : any = [];
let arra : any = [];
for(let i = 0; i< this.datasource.length ; i++ )
{
    this.objincidentId.push(this.datasource[i].incidentId);
}
this.objincidentId = [...new Set(this.objincidentId)];
console.log("this.objincidentId",this.objincidentId);
console.log(this.datasource[0].incidentId);
for(let i = 0 ; i < this.objincidentId.length ; i++ )
{
  arra = [];
  value = 0;
  for(let j = 0; j < this.datasource.length ; j++)
  {
    
    if(this.objincidentId[i] == this.datasource[j].incidentId)
      {
        console.log(this.objincidentId[i],this.datasource[j].incidentId);
        value++;
        console.log(value);
      }      
  }
  console.log(value);
  console.log(this.objincidentId[i]);
  if(value >= 2){
   arra =  {
      incidentId : this.objincidentId[i],
      value : value,
    };
  }
    console.log(arra);
  incidentarra.push(arra);  
}
console.log(incidentarra)
chart.data = incidentarra;
/*
// Create axes
var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
categoryAxis.dataFields.category = "incidentId";
categoryAxis.renderer.grid.template.strokeOpacity = 0;
categoryAxis.renderer.minGridDistance = 10;
//dateAxis.dateFormats.setKey("day", "d");
categoryAxis.tooltip.hiddenState.properties.opacity = 1;
categoryAxis.tooltip.hiddenState.properties.visible = true;
categoryAxis.renderer.labels.template.rotation = -70;
categoryAxis.renderer.labels.template.horizontalCenter = "right";

var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
valueAxis.renderer.inside = false;
    valueAxis.renderer.labels.template.fillOpacity = 0.3;
    valueAxis.renderer.grid.template.strokeOpacity = 0;
valueAxis.min = 0;
valueAxis.max = 40;
valueAxis.strictMinMax = true;
valueAxis.cursorTooltipEnabled = false;
    valueAxis.renderer.labels.template.fontSize = 11;

    valueAxis.renderer.grid.template.location = 0;
    valueAxis.renderer.minGridDistance = 30;
    valueAxis.startLocation = 0.5;
    valueAxis.endLocation = 0.5;

*/

// Create axes
var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
categoryAxis.dataFields.category = "incidentId";
categoryAxis.renderer.grid.template.location = 0;
categoryAxis.renderer.minGridDistance = 20;
categoryAxis.renderer.labels.template.fontSize = 12;
categoryAxis.renderer.labels.template.maxWidth = 120;
categoryAxis.renderer.labels.template.wrap = true;
// categoryAxis.renderer.labels.template.fontWeight = 500;
categoryAxis.renderer.labels.template.rotation = -60;
categoryAxis.renderer.labels.template.horizontalCenter = "right";
categoryAxis.tooltip.hiddenState.properties.visible = true;

var  valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
valueAxis.renderer.labels.template.fontSize = 11;
valueAxis.renderer.grid.template.location = 0;
valueAxis.renderer.minGridDistance = 30;


// Create series
var series = chart.series.push(new am4charts.ColumnSeries());
series.dataFields.valueY = "value";
series.dataFields.categoryX = "incidentId";
series.columns.template.tooltipText = "{incidentId}:{value}" 
series.name = "Ticket ID";
var columnTemplate = series.columns.template;
columnTemplate.width = 25;
columnTemplate.column.cornerRadiusTopLeft = 20;
columnTemplate.column.cornerRadiusTopRight = 20;
columnTemplate.strokeOpacity = 0;

// Legend
chart.legend = new am4charts.Legend();
chart.legend.fontSize = 12;
let markerTemplate = chart.legend.markers.template;
markerTemplate.width = 10;
markerTemplate.height = 10;

// Add cursor
chart.cursor = new am4charts.XYCursor();

    this.spinner.hide();

  }



chart4(){
  // Themes begin
  this.spinner.show();

    $('.chart_div_4').show();
    $(".left_arrow_chart4").hide();
    $('.chart_div_High_4').hide();
    $('.chart_div_Medium_4').hide();
    $('.chart_div_Low_4').hide();
    

am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance
var chart = am4core.create("chartdiv4", am4charts.XYChart);
this.SolvedPer = 0;
this.ClosedRes = 0;
this.SolvedWA = 0;
this.SolvedRemo = 0;
this.New = 0;
this.PriHigh=0;
this.PriMedium=0;
this.PriLow=0;
for(let i = 0; i< this.datasource.length ; i++ )
{
    this.objpriority.push(this.datasource[i].priority);
}
this.objpriority = [...new Set(this.objpriority)];
let seriesName =this.objpriority;
for(let i=0 ; i< this.objpriority.length ;i++){
  for(let j = 0; j < this.datasource.length; j++){
    if(seriesName[i] == this.datasource[j].priority){
    if(seriesName[i] == "Medium"){
    this.PriMedium = this.PriMedium+1; 
    }
    else if(seriesName[i] == "Low"){
    this.PriLow = this.PriLow+1;
    }
    else if(seriesName[i] == "High"){
    this.PriHigh = this.PriHigh+1;
    }
    }
  }
}
let data1 : any;
this.priorityHigh = [];
this.priorityMedium = [];
this.priorityLow = [];
for( data1 of this.datasource){
   if(data1.priority == "High"){
    this.priorityHigh.push(data1);
   }
   if(data1.priority == "Medium"){
    this.priorityMedium.push(data1);
   }
   if(data1.priority == "Low"){
    this.priorityLow.push(data1);
   }
}
console.log(this.PriHigh);
console.log(this.PriMedium);
console.log(this.PriLow);
console.log(this.priorityHigh);
console.log(this.priorityMedium);
console.log(this.priorityLow);


// Add data
chart.data = [{
  "category": "High",
  "value": this.PriHigh
}, {
  "category": "Medium",
  "value": this.PriMedium
}, {
  "category": "Low",
  "value": this.PriLow
}];

// Create axes

var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
categoryAxis.dataFields.category = "category";
categoryAxis.renderer.grid.template.location = 0;
categoryAxis.renderer.minGridDistance = 10;
categoryAxis.renderer.labels.template.fontSize = 12;
categoryAxis.renderer.labels.template.maxWidth = 120;
categoryAxis.tooltip.hiddenState.properties.visible = true;
var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
valueAxis.renderer.inside = false;
valueAxis.min = 0;
valueAxis.max = 100;
//valueAxis.renderer.labels.template.fillOpacity = 0.3;
//valueAxis.renderer.grid.template.strokeOpacity = 1;
valueAxis.cursorTooltipEnabled = false;
valueAxis.renderer.labels.template.fontSize = 11;
// Create series
var series = chart.series.push(new am4charts.ColumnSeries());
series.dataFields.valueY = "value";
series.dataFields.categoryX = "category";
series.name = "Severity";
series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
series.columns.template.fillOpacity = .8;
var columnTemplate = series.columns.template;
columnTemplate.strokeWidth = 2;
columnTemplate.strokeOpacity = 1;
series.columns.template.events.on(
  "hit",
  ev => {
  let a = ev.target;
  // alert(ev.target._dataItem.dataContext["country"]);
  var idOfPie = ev.target._dataItem.dataContext["category"];
  console.log(idOfPie,"test1");
  switch(idOfPie) {
          case 'High':
              $(".left_arrow_chart4").show();
              $('.chart_div_4').hide();
              $('.chart_div_High_4').show();
              $('.chart_div_Medium_4').hide();
              $('.chart_div_Low_4').hide();
              break;
          case 'Medium':
            $(".left_arrow_chart4").show();
            $('.chart_div_4').hide();
            $('.chart_div_High_4').hide();
            $('.chart_div_Medium_4').show();
            $('.chart_div_Low_4').hide();
              break;
          case 'Low':
            $(".left_arrow_chart4").show();
            $('.chart_div_4').hide();
            $('.chart_div_High_4').hide();
            $('.chart_div_Medium_4').hide();
            $('.chart_div_Low_4').show();
              break;
         
              default:
                $(".left_arrow_chart4").hide();
                $('.chart_div_High_4').hide();
                $('.chart_div_Medium_4').hide();
                $('.chart_div_Low_4').hide();
      }

  },
  this
  );
  var columnTemplate = series.columns.template;
    columnTemplate.width = 25;
    columnTemplate.column.cornerRadiusTopLeft = 20;
    columnTemplate.column.cornerRadiusTopRight = 20;
    columnTemplate.strokeOpacity = 0;

    /*columnTemplate.adapter.add("fill", function (fill, target) {
      let dataItem:any = target.dataItem;
      if (dataItem.valueY > 20) {
          return chart.colors.getIndex(0);
      }
      else {
          return am4core.color("#a8b3b7");
      }
    });*/
    // Add cursor
    chart.cursor = new am4charts.XYCursor();

    chart.legend = new am4charts.Legend();
    chart.legend.fontSize = 13;
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 10;
    markerTemplate.height = 10;
    this.spinner.hide();
}


  /*gettickets()
  {
    this.spinner.show();
    this.rest.getincidenttickets().subscribe(data=>{
      let response:any=data;
      if(response.errorMessage==undefined)
      {
        this.dataSource1= new MatTableDataSource(response);

       // this.dataSource1.paginator=this.paginator1;
       // this.dataSource1.sort=this.sort1;
        this.isTableHasData=true;
        this.nodata=true;
       this.spinner.hide();
      }
      else
      {
        this.spinner.hide();
        this.nodata=true;
        Swal.fire(response.errorMessage,"","error")
      }
    })
  }



  applyFilter2(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource1.filter = filterValue;
  }*/
}
