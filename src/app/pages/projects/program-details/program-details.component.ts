import { Component, OnInit } from '@angular/core';
import { RestApiService} from '../../services/rest-api.service'
import { NgxSpinnerService} from 'ngx-spinner'
import {  ActivatedRoute, Router } from '@angular/router';
import { Base64 } from 'js-base64';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
@Component({
  selector: 'app-program-details',
  templateUrl: './program-details.component.html',
  styleUrls: ['./program-details.component.css']
})
export class ProgramDetailsComponent implements OnInit {

  constructor(
    private rest:RestApiService,
    private spinner:NgxSpinnerService,
    private route:ActivatedRoute,
    private router:Router
    ) { }

    projects_and_programs_list:any=[];
    program_detials:any;
    linked_projects:any=[];
    users_list:any=[];

  ngOnInit() {
    this.getprojects_and_programs();
    this.getallusers();
  }

  getprojects_and_programs()
  {
    this.spinner.show()
    this.rest.getAllProjects().subscribe(data=>{
      this.spinner.hide()
      this.projects_and_programs_list=data;
      this.getprogramdetails();
    })
  }


  getprogramdetails(){
    
    this.route.params.subscribe(data=>{
      let program_id=data.id;
      this.program_detials=this.projects_and_programs_list[0].find(item=>item.id==program_id);
      console.log("program details",this.program_detials)
      this.get_linked_projects();
    });
  }


  get_linked_projects()
  {
    let linked_projects=this.program_detials.project;
    this.linked_projects=linked_projects.map(item=>{
      return this.projects_and_programs_list[1].find(item2=>item2.id==item.id);
    })
    setTimeout(()=>{

      this.getpiechart();
      this.get_project_duration_chart();
      this.getlinechart();

    },500)
    console.log("linked projects list", this.linked_projects)
  }



  getpiechart()
  {
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    let chart = am4core.create("project-cost", am4charts.PieChart);

    // Add data
    chart.data = [ {
      "country": "Lithuania",
      "litres": 501.9
    }, {
      "country": "Czechia",
      "litres": 301.9
    }, {
      "country": "Ireland",
      "litres": 201.1
    }];

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "litres";
    pieSeries.dataFields.category = "country";
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.ticks.template.disabled = true;
    pieSeries.alignLabels = false;
    // This creates initial animation
    
    pieSeries.labels.template.text = "{value.percent.formatNumber('#.0')}%";
    pieSeries.labels.template.radius = am4core.percent(-40);
    pieSeries.labels.template.fill = am4core.color("white");
    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;

  }


  get_project_duration_chart()
  {
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    let chart = am4core.create("project-duration", am4charts.XYChart);


    // Add data
    chart.data = [{
      "year": "Category 1",
      "europe": 2.5,
      "namerica": 2.5,
      "asia": 2.1,
     
    }, {
      "year": "Category 2",
      "europe": 2.6,
      "namerica": 2.7,
      "asia": 2.2,
  
    }, {
      "year": "Category 3",
      "europe": 2.8,
      "namerica": 2.9,
      "asia": 2.4,
   
    }];

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "year";
    categoryAxis.renderer.grid.template.location = 0;


    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    
    valueAxis.renderer.labels.template.disabled = false;
    valueAxis.min = 0;
    //valueAxis.renderer.labels.template.hide();
    // Create series
    function createSeries(field, name) {
      
      // Set up series
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.name = name;
      series.dataFields.valueY = field;
      series.dataFields.categoryX = "year";
      series.sequencedInterpolation = true;
      
      // Make it stacked
      series.stacked = true;
      
      // Configure columns
      series.columns.template.width = am4core.percent(60);
      series.columns.template.tooltipText = "[bold]{name}[/]\n[font-size:14px]{categoryX}: {valueY}";
      
      // Add label
      let labelBullet = series.bullets.push(new am4charts.LabelBullet());
      labelBullet.label.text = "{valueY}";
      labelBullet.locationY = 0.5;
      labelBullet.label.hideOversized = true;
      
      return series;
    }

    createSeries("europe", "Europe");
    createSeries("namerica", "North America");
    createSeries("asia", "Asia-Pacific");
    createSeries("lamerica", "Latin America");
    createSeries("meast", "Middle-East");
    createSeries("africa", "Africa");

    // Legend
    chart.legend = new am4charts.Legend();
    chart.legend.disabled=true;
  }



  getlinechart()
  {
    /* Chart code */
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    let chart = am4core.create("line-chart", am4charts.XYChart);

    // Add data
    chart.data = [{
      "year": "Catrgory 1",
      "italy": 1,
      "germany": 5,
      "uk": 3
    }, {
      "year": "categorty 2",
      "italy": 1,
      "germany": 2,
      "uk": 6
    }, {
      "year": "category 3",
      "italy": 2,
      "germany": 3,
      "uk": 1
    }, {
      "year": "category 4",
      "italy": 3,
      "germany": 4,
      "uk": 1
    }];

    // Create category axis
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "year";
    categoryAxis.renderer.opposite = true;

    // Create value axis
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.inversed = true;
    valueAxis.title.text = "Place taken";
    valueAxis.renderer.minLabelPosition = 0.01;

    // Create series
    let series1 = chart.series.push(new am4charts.LineSeries());
    series1.dataFields.valueY = "italy";
    series1.dataFields.categoryX = "year";
    series1.name = "Italy";
    series1.bullets.push(new am4charts.CircleBullet());
    series1.tooltipText = "Place taken by {name} in {categoryX}: {valueY}";
    series1.legendSettings.valueText = "{valueY}";
    series1.visible  = false;

    let series2 = chart.series.push(new am4charts.LineSeries());
    series2.dataFields.valueY = "germany";
    series2.dataFields.categoryX = "year";
    series2.name = 'Germany';
    series2.bullets.push(new am4charts.CircleBullet());
    series2.tooltipText = "Place taken by {name} in {categoryX}: {valueY}";
    series2.legendSettings.valueText = "{valueY}";

    let series3 = chart.series.push(new am4charts.LineSeries());
    series3.dataFields.valueY = "uk";
    series3.dataFields.categoryX = "year";
    series3.name = 'United Kingdom';
    series3.bullets.push(new am4charts.CircleBullet());
    series3.tooltipText = "Place taken by {name} in {categoryX}: {valueY}";
    series3.legendSettings.valueText = "{valueY}";

    // Add chart cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "zoomY";


    let hs1 = series1.segments.template.states.create("hover")
    hs1.properties.strokeWidth = 5;
    series1.segments.template.strokeWidth = 1;

    let hs2 = series2.segments.template.states.create("hover")
    hs2.properties.strokeWidth = 5;
    series2.segments.template.strokeWidth = 1;

    let hs3 = series3.segments.template.states.create("hover")
    hs3.properties.strokeWidth = 5;
    series3.segments.template.strokeWidth = 1;

    // Add legend
    chart.legend = new am4charts.Legend();
    chart.legend.disabled=true;
    // chart.legend.itemContainers.template.events.on("over", function(event){
    //   let segments = event.target.dataItem.dataContext.segments;
    //   segments.each(function(segment){
    //     segment.isHover = true;
    //   })
    // })

    // chart.legend.itemContainers.template.events.on("out", function(event){
    //   let segments = event.target.dataItem.dataContext.segments;
    //   segments.each(function(segment){
    //     segment.isHover = false;
    //   })
    // })
  }

  getallusers()
  {
    let tenantid=localStorage.getItem("tenantName")
    this.rest.getuserslist(tenantid).subscribe(data=>{
       this.users_list=data;
    })
  }

  
  projectDetailsbyId(id){

    this.rest.getProjectDetailsById(id).subscribe( res =>{
      let project=res;
      this.navigatetodetailspage(project)
    })
  }


  navigatetodetailspage(detials){
    let encoded=Base64.encode(JSON.stringify(detials));
    let project={id:encoded}
    this.router.navigate(['/pages/projects/projectdetails',project])
  }

}
