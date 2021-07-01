import { Component, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  selector: 'app-projects-dashboard',
  templateUrl: './projects-dashboard.component.html',
  styleUrls: ['./projects-dashboard.component.css']
})
export class ProjectsDashboardComponent implements OnInit {
  projects_toggle:Boolean=false;
  public selectedTab=0;
  public check_tab=0;
  constructor() { }

  ngOnInit() {
    
  }

  ngAfterViewInit(): void {
    this.loadchart();
  }

  onTabChanged(event)
  {
    this.check_tab=event.index;
  }
  loadchart(){
    am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance
let chart = am4core.create("projectdashboard", am4charts.XYChart);

// Add data
chart.data = [{
  "country": "HR",
  "visits": 50
},{
  "country": "Finance",
  "visits": 35
}, {
  "country": "Support",
  "visits": 28
},  {
  "country": "Sales",
  "visits": 18
}
];
// Create axes

let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
categoryAxis.dataFields.category = "country";
categoryAxis.renderer.grid.template.location = 0;
categoryAxis.renderer.minGridDistance = 30;

categoryAxis.renderer.labels.template.adapter.add("dy", function(dy, target) {
  // if (target.dataItem && target.dataItem.index & 2 == 2) {
  //   return dy + 25;
  // }
  return dy;
});

let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

// Create series
let series = chart.series.push(new am4charts.ColumnSeries());
series.dataFields.valueY = "visits";
series.dataFields.categoryX = "country";
series.name = "Visits";
series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
series.columns.template.fillOpacity = .8;

let columnTemplate = series.columns.template;
columnTemplate.strokeWidth = 2;
columnTemplate.strokeOpacity = 1;
}

}