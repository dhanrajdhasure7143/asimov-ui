import { Component, OnInit, ViewChild } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { RestApiService } from '../../services/rest-api.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LoaderService } from 'src/app/services/loader/loader.service';


@Component({
  selector: 'app-process-analyst',
  templateUrl: './process-analyst.component.html',
  styleUrls: ['./process-analyst.component.css']
})
export class ProcessAnalystComponent implements OnInit {


  runtimestatschart: any;
  runtimestats: any[] = [];
  totalTasks: any;
  totalProjects: any;
  Processes: any;
  ProjectCompletionDuration: Object;
  pendingApprovals: any[];
  allProjectProgress: any;
  allProjectStatus: Object;
  projectStatusArray: any[] = [];
  activityStream: any;
  upcomingDueDates: any;
  expenditureDays: any;
  expenditureProjects: any;
  effortExpenditureAnalysis: Object;
  activityStreamRecent: any;
  activityStreamPending: any;
  filterByDays = ['All', '30', '60', '90'];
  userDetails: any;
  userRoles: any;
  userEmail: any;
  userName: any;
  t:any;
  topEffortsSpent: any[]=[];
  displayedColumns1=['Process Name','Created Date','Submitted by','Approver Name'];
  displayedColumns3=['projectName','daysSpent'];
  @ViewChild("sort1",{static:false}) sort1: MatSort;
  @ViewChild("paginator1",{static:false}) paginator1: MatPaginator;
  pendingApprovalsdataSource:MatTableDataSource<any>;
  @ViewChild("sort3",{static:false}) sort3: MatSort;
  @ViewChild("paginator3",{static:false}) paginator3: MatPaginator;
  topEffortsSpentdataSource:MatTableDataSource<any>;

  constructor(private apiService: RestApiService, private jwtHelper: JwtHelperService,
    private loader: LoaderService) {
    this.userDetails = this.jwtHelper.decodeToken(localStorage.getItem('accessToken'));;
  }

  ngOnInit(): void {
    this.loader.show();
    this.userRoles = this.userDetails.userDetails.roles[0].roleName;
    this.userEmail = this.userDetails.userDetails.userId;
    this.userName = this.userDetails.userDetails.userName;

    if (this.userRoles === 'Process Analyst' || this.userRoles === "RPA Developer") {
      this.getTasksStatus('All');
      this.getProjectProgress('All');
      this.getPendingApprovals('All');

      // Api calss
      this.apiService.getProjectsTasksProcessChanged(this.userEmail, this.userName, this.userRoles)
        .subscribe(res => {
          this.totalProjects = res['Total Projects'];
          this.totalTasks = res['Tasks'];
          this.Processes = res['Processes'];
          this.loader.hide();
        });

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
          this.expenditureProjects = res['Total Projects'];
        });

      this.apiService.getEffortExpenditureAnalysis(this.userRoles, this.userEmail, this.userName)
        .subscribe(res => {
          this.effortExpenditureAnalysis = res;
        });
        let res_data;
      this.apiService.gettopEffortsSpent(this.userRoles, this.userEmail, this.userName).subscribe(res => {
            res_data = res;
        for (let [key, value] of Object.entries(res_data)) {
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
        this.loader.hide();
      })
    }
  }

  // Api calls

  getPendingApprovals(duration) {
    this.apiService.getPendingApprovals(this.userRoles, this.userEmail, this.userName, duration).subscribe((res: any) => {
      this.pendingApprovals = res;
      this.loader.hide();
      this.pendingApprovalsdataSource= new MatTableDataSource(this.pendingApprovals);
      this.pendingApprovalsdataSource.sort=this.sort1;
      this.pendingApprovalsdataSource.paginator=this.paginator1;
    });
  }

  getTasksStatus(duration) {
    this.apiService.getAllTaskStatus(this.userRoles, this.userEmail, this.userName, duration).subscribe(res => {
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
      this.loader.hide();
    });
  }

  getProjectProgress(duration) {
    this.apiService.getAllTasksProgress(this.userRoles, this.userEmail, this.userName, duration).subscribe(res => {
      this.allProjectProgress = res;
      this.runtimestats = this.allProjectProgress;
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


  projectStatus(name) {
    this.getTasksStatus(name);
  }

  projectProgress(name) {
    this.getProjectProgress(name);
  }

  projectPending(name) {
    this.getPendingApprovals(name);
  }

  allProjectStatusChart(data) {
    setTimeout(() => {
    this.status_donutChart(data);
    }, 500);
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
      chart.data=data;
      chart.legend.position = "right";
      chart.legend.valign = "middle";
      chart.innerRadius = 70;
      var label = chart.seriesContainer.createChild(am4core.Label);
      label.horizontalCenter = "middle";
      label.verticalCenter = "middle";
      label.fontSize = 18;
      var series = chart.series.push(new am4charts.PieSeries());
      series.dataFields.value = "value";
      series.dataFields.category = "project";
      series.labels.template.disabled = true;
      var _self=this;
      series.slices.template.adapter.add("tooltipText", function(text, target) {
        return "Tasks: {value} \n {project} : {value.percent.formatNumber('#.#')}% [/]"
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
    categoryAxis.dataFields.category = "id";
    categoryAxis.title.text = "Tasks";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.tooltipText = "{_dataContext.name}";

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Percentage Completed";
    valueAxis.min = 0;
    valueAxis.max = 100;
    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "id";
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
          name: column.dataItem['_dataContext']['name'],
          fill: column.fill
        })
      });
      chart.legend.data = legenddata;
    });
    chart.legend.scrollable = true;
    
    chart.cursor = new am4charts.XYCursor();
  }

}