import { Component, OnInit, ViewChild } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { RestApiService } from '../../services/rest-api.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-process-architect',
  templateUrl: './process-architect.component.html',
  styleUrls: ['./process-architect.component.css']
})
export class ProcessArchitectComponent implements OnInit {

  runtimestatschart: any;
  runtimestats: any[] = [];
  totalTasks: any;
  totalProjects: any;
  processes: any;
  ProjectCompletionDuration: Object;
  pendingApprovals: any[]=[];
  allProjectProgress: Object;
  allProjectStatus: Object;
  projectStatusArray: any[] = [];
  activityStream: any;
  upcomingDueDates: Object;
  expenditureDays: any;
  expenditureResources: any;
  effortExpenditureAnalysis: any=[];
  activityStreamRecent: any;
  activityStreamPending: any;
  filterByDays = ['All', '30', '60', '90'];
  isLoading = true;
  userDetails: any;
  topEffortsSpent: any=[];
  userRoles: any;
  userEmail: any;
  userName: any;
  p1=0;

  displayedColumns1=['Process Name','Created Date','Submitted by'];
  displayedColumns2=['resource_name','days'];
  displayedColumns3=['projectName','daysSpent'];
  @ViewChild("sort1",{static:false}) sort1: MatSort;
  @ViewChild("paginator1",{static:false}) paginator1: MatPaginator;
  pendingApprovalsdataSource:MatTableDataSource<any>;
  @ViewChild("sort2",{static:false}) sort2: MatSort;
  @ViewChild("paginator2",{static:false}) paginator2: MatPaginator;
  effortExpenditureAnalysisDatasource:MatTableDataSource<any>;
  @ViewChild("sort3",{static:false}) sort3: MatSort;
  @ViewChild("paginator3",{static:false}) paginator3: MatPaginator;
  topEffortsSpentdataSource:MatTableDataSource<any>;

  constructor(private apiService: RestApiService, private jwtHelper: JwtHelperService) {
    this.userDetails = this.jwtHelper.decodeToken(localStorage.getItem('accessToken'));;
  }

  ngOnInit(): void {

    this.userRoles = this.userDetails.userDetails.roles[0].roleName;
    this.userEmail = this.userDetails.userDetails.userId;
    this.userName = this.userDetails.userDetails.userName;

    if (this.userRoles === 'Process Architect') {
      this.getProjectDuration('All');
      this.getProjectStatus('All');
      this.getProjectProgress('All');
      this.getPendingApprovals('All');

      // Api calss
      this.apiService.getProjectsTasksProcessChanged(this.userEmail, this.userName, this.userRoles)
        .subscribe(res => {
          this.totalProjects = res['Total Projects'];
          this.totalTasks = res['Tasks'];
          this.processes = res['Processes'];
          this.isLoading = false;
        });


      // this.apiService.getActivityStream(this.userRoles,this.userEmail,this.userName).subscribe(res => {
      //   this.activityStreamRecent = res['Recent Approvals : '];
      //   this.activityStreamPending = res['Pending Approvals : '];
      //   this.activityStream = res['Recent Approvals : '];
      //   console.log(res);
      // });

      this.apiService.getUpcomingDueDates(this.userRoles, this.userEmail, this.userName)
      .subscribe(res => {
        this.upcomingDueDates = res;
        var currentDate = new Date().getTime();
        for (var i = 0; i < Object.keys(res).length; i++) {
          var dueDate = (new Date(res[i]['End Date']).getTime() - currentDate);
          var result = Math.round(dueDate / (1000 * 3600 * 24));
          if(result > 0){
            this.upcomingDueDates[i]['dueDate']  = `Due in  ${result}  days` ;
          }
          else{
            this.upcomingDueDates[i]['dueDate']  =  `${- + result} days ago` ;;
          }
          
        }
      });


      this.apiService.gettotalEffortExpenditure(this.userRoles, this.userEmail, this.userName)
        .subscribe(res => {
          this.expenditureDays = res['Total Days'];
          this.expenditureResources = res['Total Resources'];
        });
        let res_data;
      this.apiService.getEffortExpenditureAnalysis(this.userRoles, this.userEmail, this.userName)
        .subscribe(res => {
          res_data = res;
          for (let [key, value] of Object.entries(res_data)) {
            if(value != 0){
            var obj={'resource_name':key,'days':value}
            this.effortExpenditureAnalysis.push(obj)
            }
          }
          this.effortExpenditureAnalysis.sort(function (a, b) {
            return b.days - a.days;
          });
          this.effortExpenditureAnalysisDatasource= new MatTableDataSource(this.effortExpenditureAnalysis);
          this.effortExpenditureAnalysisDatasource.sort=this.sort2;
          this.effortExpenditureAnalysisDatasource.paginator=this.paginator2;
        });
        let res_data1:any;
      this.apiService.gettopEffortsSpent(this.userRoles, this.userEmail, this.userName).subscribe(res => {
        res_data1 = res;
        for (let [key, value] of Object.entries(res_data1)) {
          if (value != 0) {
            var obj = { 'projectName': key, 'daysSpent': value }
            this.topEffortsSpent.push(obj);
          }
        }
        this.topEffortsSpent.sort(function (a, b) {
          return b.days - a.days;
        });
        this.topEffortsSpentdataSource= new MatTableDataSource(this.topEffortsSpent);
        this.topEffortsSpentdataSource.sort=this.sort3;
        this.topEffortsSpentdataSource.paginator=this.paginator3;
      })
    }
  }

  // Api calls

  getProjectDuration(duration) {
    this.apiService.getProjectCompletionDuration(this.userRoles, this.userEmail, this.userName, duration)
      .subscribe(res => {
        this.ProjectCompletionDuration = res;
        let projectCompletionArray = [];
        for (var i = 0; i < Object.keys(res).length; i++) {
          var data = {
            "projects": Object.keys(res)[i],
            "days": Object.values(res)[i],
          }
          projectCompletionArray.push(data);
        }
        this.projectDurationChart(projectCompletionArray);
        this.isLoading = false;
      });
  }

  getPendingApprovals(duration) {
    this.apiService.getPendingApprovals(this.userRoles, this.userEmail, this.userName, duration).subscribe((res: any) => {
      this.pendingApprovals = res;
      this.pendingApprovalsdataSource= new MatTableDataSource(res);
      this.pendingApprovalsdataSource.sort=this.sort1;
      this.pendingApprovalsdataSource.paginator=this.paginator1;
    });
  }

  getProjectStatus(duration) {
    this.apiService.getAllProjectStatus(this.userRoles, this.userEmail, this.userName, duration).subscribe(res => {
      this.allProjectStatus = res;
      this.projectStatusArray = [];
      for (var i = 0; i < Object.keys(res).length; i++) {
        var data = {
          "project": Object.keys(res)[i],
          "value": Object.values(res)[i]
        }
        this.projectStatusArray.push(data);

      }
      this.allProjectStatusChart(this.projectStatusArray);
      this.isLoading = false;
    });
  }

  getProjectProgress(duration) {
    this.apiService.getAllProjectProgress(this.userRoles, this.userEmail, this.userName, duration).subscribe(res => {
      this.allProjectProgress = res;
      this.runtimestats = [];
      for (var i = 0; i < Object.keys(res).length; i++) {
        var data = {
          "name": Object.keys(res)[i],
          "value": Object.values(res)[i],
        }
        this.runtimestats.push(data);
      }
      this.allProjectProgressChart();
    });
  }

  // FilterBy

  activityList(name) {
    if (name == 'recentApprovals') {
      this.activityStream = this.activityStreamRecent;
    }
    else {
      this.activityStream = this.activityStreamPending;
    }
  }

  projectDuration(name) {
    this.getProjectDuration(name);
  }

  projectStatus(name) {
    this.getProjectStatus(name);
  }

  projectProgress(name) {
    this.getProjectProgress(name);
  }

  projectPending(name) {
    this.getPendingApprovals(name);
  }

  allProjectStatusChart(data) {
    // setTimeout(() => {
    //   var chart = am4core.create("projectstatus-chart", am4charts.PieChart);
    //   chart.innerRadius = am4core.percent(30);
    //   chart.logo.__disabled = true;
    //   var pieSeries = chart.series.push(new am4charts.PieSeries());
    //   var colorSet = new am4core.ColorSet();
    //   colorSet.list = ["#ce3779", "#575fcd", "#d89f59", "#ff5b4f", "#74c7b8"
    //   ].map(function (color: any) {
    //     return am4core.color(color);
    //   });
    //   pieSeries.colors = colorSet;
    //   pieSeries.dataFields.value = "value";
    //   pieSeries.dataFields.category = "project";
    //   pieSeries.slices.template.propertyFields.fill = "color";
    //   pieSeries.slices.template.stroke = am4core.color("#fff");
    //   pieSeries.slices.template.strokeWidth = 2;
    //   pieSeries.slices.template.strokeOpacity = 1;
    //   pieSeries.slices.template
    //     // change the cursor on hover to make it apparent the object can be interacted with
    //     .cursorOverStyle = [
    //       {
    //         "property": "cursor",
    //         "value": "pointer"
    //       }
    //     ];
    //   pieSeries.labels.template.maxWidth = 130;
    //   pieSeries.labels.template.wrap = true;
    //   pieSeries.labels.template.fontSize = 18;
    //   pieSeries.labels.template.bent = false;
    //   pieSeries.labels.template.padding(0, 0, 0, 0);
    //   pieSeries.ticks.template.disabled = true;
    //   pieSeries.alignLabels = false;
    //   pieSeries.labels.template.text = "{value}";
    //   pieSeries.labels.template.radius = am4core.percent(-40);
    //   pieSeries.labels.template.fill = am4core.color("white");
    //   // Create a base filter effect (as if it's not there) for the hover to return to
    //   //var shadow = pieSeries.slices.template.filters.push(new am4core.DropShadowFilter);
    //   //shadow.opacity = 0;

    //   // Create hover state
    //   var hoverState = pieSeries.slices.template.states.getKey("hover"); // normally we have to create the hover state, in this case it already exists

    //   // Slightly shift the shadow and make it more prominent on hover
    //   var hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter);
    //   hoverShadow.opacity = 0.7;
    //   hoverShadow.blur = 5;

    //   // Add a legend

    //   chart.legend = new am4charts.Legend();
    //   chart.legend.fontSize = 13;
    //   let markerTemplate = chart.legend.markers.template;
    //   markerTemplate.width = 10;
    //   markerTemplate.height = 10;
    //   chart.innerRadius = am4core.percent(0);
    //   chart.data = data;

    //   chart.legend = new am4charts.Legend();
    //   chart.legend.fontSize = 13;
    //   chart.legend.labels.template.text = "{category} - {value}";
    // }, 50);

      setTimeout(() => {
        this.status_donutChart(data)
      }, 100);
  }
  
  status_donutChart(data){
    data.sort(function (a, b) {
      return b.value - a.value;
    });

      am4core.useTheme(am4themes_animated);
      // Themes end
      
      var chart = am4core.create("projectstatus-chart", am4charts.PieChart);
      chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
      chart.legend = new am4charts.Legend();
      chart.legend.useDefaultMarker = true;
      var marker = chart.legend.markers.template.children.getIndex(0);
      marker.strokeWidth = 2;
      marker.strokeOpacity = 1;
      marker.stroke = am4core.color("#ccc");
      chart.legend.scrollable = true;
      chart.legend.fontSize = 12;
      chart.legend.reverseOrder = false;
      // chart.data=data;
      chart.data=data;

      chart.legend.position = "right";
      chart.legend.valign = "middle";
      chart.innerRadius = 70;
      // chart.tooltip="test";
      var label = chart.seriesContainer.createChild(am4core.Label);
        // label.text = "230,900 Sales";
      label.horizontalCenter = "middle";
      label.verticalCenter = "middle";
      label.fontSize = 18;
      var series = chart.series.push(new am4charts.PieSeries());
      series.dataFields.value = "value";
      series.dataFields.category = "project";
      series.labels.template.disabled = true;
      var _self=this;
      series.slices.template.adapter.add("tooltipText", function(text, target) {
        // var text=_self.getTimeConversion('{_dataContext.totalDuration}');
        //return "{_dataContext.activity} \n {_dataContext.convertedDuration}";
        return "Projects: {value} \n {project} : {value.percent.formatNumber('#.#')}% [/]"
      });
      $('g:has(> g[stroke="#3cabff"])').hide();
      series.colors.list = [
          am4core.color("rgba(85, 216, 254, 0.9)"),
          am4core.color("rgba(255, 131, 115, 0.9)"),
          am4core.color("rgba(255, 218, 131, 0.9)"),
          am4core.color("rgba(163, 160, 251, 0.9)"),
          am4core.color("rgba(156, 39, 176, 0.9)"),
          am4core.color("rgba(103, 58, 183, 0.9)"),
          am4core.color("rgba(63, 81, 181, 0.9)"),
          am4core.color("rgba(33, 150, 243, 0.9)"),
          am4core.color("rgba(3, 169, 244, 0.9)"),
          am4core.color("rgba(0, 188, 212, 0.9)"),
          am4core.color("rgba(244, 67, 54, 0.9)"),
          am4core.color("rgba(233, 33, 97, 0.9)"),
          am4core.color("rgba(220, 103, 171, 0.9)"),
          am4core.color("rgba(220, 103, 206, 0.9)"),
          am4core.color("rgba(199, 103, 220, 0.9)"),
          am4core.color("rgba(163, 103, 220, 0.9)"),
          am4core.color("rgba(103, 113, 220, 0.9)"),
          am4core.color("rgba(0, 136, 86, 0.9)"),
          am4core.color("rgba(243, 195, 0, 0.9)"),
          am4core.color("rgba(243, 132, 0, 0.9)"),
          am4core.color("rgba(143, 13, 20, 0.9)"),
      ];
  }

  allProjectProgressChart() {
    var chart = am4core.create("prjchartdiv", am4charts.XYChart);
    // Add data
    chart.data = this.runtimestats
    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "name";
    categoryAxis.title.text = "Projects";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Percentage Completed";
    valueAxis.min = 0;
    valueAxis.max = 100;
    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "name";
    series.tooltipText = "{valueY.value}%";
    valueAxis.renderer.labels.template.adapter.add("text", function (text) {
      return text + "%";
    });
    var columnTemplate = series.columns.template;
    // columnTemplate.width = 45;
    columnTemplate.column.cornerRadiusTopLeft = 10;
    columnTemplate.column.cornerRadiusTopRight = 10;
    columnTemplate.strokeOpacity = 0;
    let runtimeref = chart;
    columnTemplate.events.once("inited", function (event) {
      event.target.fill = runtimeref.colors.getIndex(event.target.dataItem.index);
    });
    categoryAxis.renderer.labels.template.disabled = true;

    chart.legend = new am4charts.Legend();
    /* Create a separate container to put legend in */
    var legendContainer = am4core.create("legenddiv", am4core.Container);
    legendContainer.width = am4core.percent(100);
    legendContainer.height = am4core.percent(100);
    chart.legend.parent = legendContainer;
    chart.legend.fontSize = 12;
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 10;
    markerTemplate.height = 10;
    series.events.on("ready", function (ev) {
      let legenddata = [];
      series.columns.each(function (column) {
        legenddata.push({
          name: column.dataItem.categories.categoryX,
          fill: column.fill
        })
      });
      chart.legend.data = legenddata;
    });

    chart.legend.scrollable = true;
    chart.cursor = new am4charts.XYCursor();
  }

  projectDurationChart(data) {
    am4core.useTheme(am4themes_animated);

    setTimeout(() => {
      var chart = am4core.create("project-completion-duration", am4charts.XYChart);
      chart.scrollbarX = new am4core.Scrollbar();
      chart.logo.disabled = true;

      // Add data
      chart.data = data

      // Create axes
      var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "projects";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.minGridDistance = 30;
      categoryAxis.renderer.labels.template.horizontalCenter = "right";
      categoryAxis.renderer.labels.template.verticalCenter = "middle";
      // categoryAxis.renderer.labels.template.rotation = 270;
      categoryAxis.tooltip.disabled = true;
      // categoryAxis.renderer.minHeight = 110;
      categoryAxis.title.text = "Projects";


      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.minWidth = 50;
      valueAxis.title.text = "Project Completion Days";

      // Create series
      var series = chart.series.push(new am4charts.ColumnSeries());
      series.sequencedInterpolation = true;
      series.dataFields.valueY = "days";
      series.dataFields.categoryX = "projects";
      series.tooltipText = "[{categoryX}: bold]{valueY}[/] days";
      series.columns.template.strokeWidth = 0;

      series.tooltip.pointerOrientation = "vertical";

      series.columns.template.column.cornerRadiusTopLeft = 10;
      series.columns.template.column.cornerRadiusTopRight = 10;
      series.columns.template.column.fillOpacity = 0.8;

      // on hover, make corner radiuses bigger
      var hoverState = series.columns.template.column.states.create("hover");
      hoverState.properties.cornerRadiusTopLeft = 0;
      hoverState.properties.cornerRadiusTopRight = 0;
      hoverState.properties.fillOpacity = 1;

      series.columns.template.adapter.add("fill", function (fill, target) {
        return chart.colors.getIndex(target.dataItem.index);
      });
      categoryAxis.renderer.labels.template.disabled = true;
      var legend = new am4charts.Legend();
      legend.parent = chart.chartContainer;
      legend.itemContainers.template.togglable = false;
      legend.marginTop = 20;
      legend.fontSize = 12;
      let markerTemplate = legend.markers.template;
      markerTemplate.width = 10;
      markerTemplate.height = 10;
      series.events.on("ready", function (ev) {
        let legenddata = [];
        series.columns.each(function (column) {
          legenddata.push({
            name: column.dataItem.categories.categoryX,
            fill: column.fill
          })
        });
        legend.data = legenddata;
      });
      // Cursor
      chart.cursor = new am4charts.XYCursor();

    }, 50);
  }
}