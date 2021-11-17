import { Component, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { RestApiService } from '../../services/rest-api.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-process-owner',
  templateUrl: './process-owner.component.html',
  styleUrls: ['./process-owner.component.css']
})
export class ProcessOwnerComponent implements OnInit {

  runtimestatschart: any;
  runtimestats: any[] = [];
  totalTasks: any;
  totalProjects: any;
  processes: any;
  ProjectCompletionDuration: Object;
  pendingApprovals: any[];
  allProjectProgress: Object;
  allProjectStatus: Object;
  projectStatusArray: any[] = [];
  activityStream: any;
  upcomingDueDates: Object;
  expenditureDays: any;
  expenditureResources: any;
  effortExpenditureAnalysis: Object;
  activityStreamRecent: any;
  activityStreamPending: any;
  filterByDays = ['All', '30', '60', '90'];
  isLoading = true;
  userDetails: any;
  topEffortsSpent: Object;
  userRoles: any;
  userEmail: any;
  userName: any;

  constructor(private apiService: RestApiService, private jwtHelper: JwtHelperService) {
    this.userDetails = this.jwtHelper.decodeToken(localStorage.getItem('accessToken'));;
    console.log(this.userDetails);
  }

  ngOnInit(): void {

   this.userRoles = this.userDetails.userDetails.roles[0].roleName;
   this.userEmail = this.userDetails.userDetails.userId;
   this.userName = this.userDetails.userDetails.userName;

    if(this.userRoles === 'Process Owner'){
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
        console.log(res);
        this.isLoading = false;
      });


    this.apiService.getActivityStream(this.userRoles, 'All').subscribe(res => {
      this.activityStreamRecent = res['Recent Approvals : '];
      this.activityStreamPending = res['Pending Approvals : '];
      this.activityStream = res['Recent Approvals : '];
      console.log(res);
    });

    this.apiService.getUpcomingDueDates(this.userRoles, this.userEmail, this.userName)
      .subscribe(res => {
        this.upcomingDueDates = res;
        console.log(this.upcomingDueDates, "UpcomingDueDates");
      });

    this.apiService.gettotalEffortExpenditure(this.userRoles, this.userEmail, this.userName)
      .subscribe(res => {
        this.expenditureDays = res['Total Days'];
        this.expenditureResources = res['Total Resources'];
        console.log(res);
      });

    this.apiService.getEffortExpenditureAnalysis(this.userRoles, this.userEmail, this.userName)
      .subscribe(res => {
        this.effortExpenditureAnalysis = res;
        console.log(res);
      });

    this.apiService.gettopEffortsSpent(this.userRoles, this.userEmail, this.userName).subscribe(res=>{
      console.log(res);
      this.topEffortsSpent = res;
    })
  }
  }

  // Api calls

  getProjectDuration(duration) {
    this.apiService.getProjectCompletionDuration(this.userRoles, this.userEmail, this.userName, duration)
      .subscribe(res => {
        console.log(res);
        this.ProjectCompletionDuration = res;
      });
  }

  getPendingApprovals(duration) {
    this.apiService.getPendingApprovals(this.userRoles, this.userEmail, this.userName, duration).subscribe((res: any) => {
      this.pendingApprovals = res;
      console.log(res);
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
      console.log(this.projectStatusArray);
      this.allProjectStatusChart(this.projectStatusArray);
      this.isLoading = false;
    });
  }

  getProjectProgress(duration) {
    this.apiService.getAllProjectProgress(this.userRoles, this.userEmail, this.userName, duration).subscribe(res => {
      this.allProjectProgress = res;
      for (var i = 0; i < Object.keys(res).length; i++) {
        var data = {
          "name": Object.keys(res)[i],
          "value": Object.values(res)[i],
        }
        this.runtimestats.push(data);
      }
      console.log(this.runtimestats);
      this.allProjectProgressChart();
    });
  }

  // FilterBy

  activityList(name) {
    console.log(name);
    if (name == 'recentApprovals') {
      this.activityStream = this.activityStreamRecent;
    }
    else {
      this.activityStream = this.activityStreamPending;
    }
  }

  projectDuration(name) {
    console.log(name);
    this.getProjectDuration(name);
  }

  projectStatus(name) {
    console.log(name);
    this.getProjectStatus(name);
  }

  projectProgress(name) {
    this.getProjectProgress(name);
  }

  projectPending(name) {
    this.getPendingApprovals(name);
  }

  allProjectStatusChart(data) {
    setTimeout(() => {
      var chart = am4core.create("projectstatus-chart", am4charts.PieChart);
      chart.innerRadius = am4core.percent(30);
      chart.logo.__disabled = true;
      var pieSeries = chart.series.push(new am4charts.PieSeries());
      var colorSet = new am4core.ColorSet();
      colorSet.list = ["#ce3779", "#575fcd", "#d89f59", "##f2dfa7", "#ff5b4f", "#74c7b8"
      ].map(function (color: any) {
        return am4core.color(color);
      });
      pieSeries.colors = colorSet;
      pieSeries.dataFields.value = "value";
      pieSeries.dataFields.category = "project";
      pieSeries.slices.template.propertyFields.fill = "color";
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
      pieSeries.labels.template.padding(0, 0, 0, 0);
      pieSeries.ticks.template.disabled = true;
      pieSeries.alignLabels = false;
      pieSeries.labels.template.text = "{value}";
      pieSeries.labels.template.radius = am4core.percent(-40);
      pieSeries.labels.template.fill = am4core.color("white");
      // Create a base filter effect (as if it's not there) for the hover to return to
      //var shadow = pieSeries.slices.template.filters.push(new am4core.DropShadowFilter);
      //shadow.opacity = 0;

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
      chart.data = data;

      chart.legend = new am4charts.Legend();
      chart.legend.fontSize = 13;
      chart.legend.labels.template.text = "{category} - {value}";
    }, 50);

  }

  allProjectProgressChart() {
    am4core.useTheme(am4themes_animated);

    setTimeout(() => {
      this.runtimestatschart = am4core.create("runtimestatistics-piechart", am4charts.XYChart);
      this.runtimestatschart.hiddenState.properties.opacity = 0; // this creates initial fade-in
      this.runtimestatschart.data = this.runtimestats;
      this.runtimestatschart.zoomOutButton.disabled = true;

      this.runtimestatschart.colors.list = [
        am4core.color("#ff5b4f"),
        am4core.color("#575fcd"),
        am4core.color("#d89f59"),
        am4core.color("#f2dfa7"),
        am4core.color("#ff5b4f"),
        am4core.color("#74c7b8")
      ]
      var categoryAxis = this.runtimestatschart.xAxes.push(new am4charts.CategoryAxis());

      categoryAxis.dataFields.category = "name";
      categoryAxis.title.text = "Projects";
      let label1 = categoryAxis.renderer.labels.template;
      label1.truncate = true;
      label1.maxWidth = 100;
      label1.disabled = false;
      categoryAxis.renderer.minGridDistance = 70;
      var valueAxis = this.runtimestatschart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.inside = false;
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
      columnTemplate.width = 35;
      columnTemplate.column.cornerRadiusTopLeft = 10;
      columnTemplate.column.cornerRadiusTopRight = 10;
      columnTemplate.strokeOpacity = 0;
      let runtimeref = this.runtimestatschart;
      columnTemplate.events.once("inited", function (event) {
        event.target.fill = runtimeref.colors.getIndex(event.target.dataItem.index);
      });
      var cursor = new am4charts.XYCursor();
      cursor.behavior = "panX";
      this.runtimestatschart.cursor = cursor;
      this.runtimestatschart.events.on("datavalidated", function () {
        if (this.runtimestats.length > 5)
          categoryAxis.zoomToIndexes(0, 7, false, true);
        else
          categoryAxis.zoomToIndexes(0, this.runtimestats.length, false, true);
      }, this);
      series.columns.template.events.on("hit", function (ev) {
        let getdata: any = ev.target.dataItem.categories.categoryX
        let data = { name: getdata };
        this.getruns(data);

      }, this);
      var label = this.runtimestatschart.plotContainer.createChild(am4core.Label);
      label.x = 150;
      label.y = 50;
      $("#runtimestatistics-piechart > div > svg > g > g:nth-child(2) > g:nth-child(2)").hide();

    }, 30)

  }
}

