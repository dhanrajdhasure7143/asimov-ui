import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import moment from "moment";
import { NgxSpinnerService } from "ngx-spinner";
import { RestApiService } from "src/app/pages/services/rest-api.service";
import Swal from "sweetalert2";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
@Component({
  selector: "app-so-incident-management",
  templateUrl: "./so-incident-management.component.html",
  styleUrls: ["./so-incident-management.component.css"],
})
export class SoIncidentManagementComponent implements OnInit {
  incidentFlag: boolean = false;
  loadingFlag: boolean = true;
  seachInput: string = "";
  @ViewChild("incidentTablePaginator")
  incidentTablePaginator: MatPaginator;
  @ViewChild("incidentTableSort") incidentTableSort: MatSort;
  incidentTableDisplayedColumns: any[] = [
    "incidentId",
    "convertedCreatedTime",
    "assignedTo",
    "description",
    "priority",
    "incidentStatus",
  ];
  incidentTableDataSource: MatTableDataSource<any>;
  objincidentId:any=[]
  constructor(
    private rest: RestApiService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getIncidents();
  }

  getIncidents() { // to get all incidents
    this.spinner.show();
    this.rest.getIncident().subscribe(
      (response: any) => {
        this.loadingFlag = false;
        if (response.errorMessage == undefined) {
          this.incidentFlag = response.configuration;
          if (response.configuration == true) {
            let modifiedResponse = response.incidents.map((item: any) => {
              item["convertedCreatedTime"] = moment(item.createdAt).format(
                "MMM, DD, yyyy, hh:mm A"
              );
              return item;
            }).sort((a,b)=>Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0,50);
            let statusBasedPieData:any=[{
              "country": "Solved Remotely (Permanently)",
              "litres":  modifiedResponse.filter(bot=>bot.incidentStatus=="Solved Remotely (Permanently)").length,
              "color": am4core.color("#9e9e9e")
            },  
            {
              "country": "New",
              "litres":  modifiedResponse.filter(bot=>bot.incidentStatus=="New").length,
              "color": am4core.color("#00bfff")
            }, {
              "country": "Solved (Work Around)",
              "litres":  modifiedResponse.filter(bot=>bot.incidentStatus=="Solved (Work Around)").length,
              "color": am4core.color("#aa28eb")
            },
            {
              country:"Solved (Permanently)",
              "litres":  modifiedResponse.filter(bot=>bot.incidentStatus=="Solved (Permanently)").length,
              "color": am4core.color("#00c45f")
            },
            {
              "country": "Closed/Resolved by Caller",
              "litres":  modifiedResponse.filter(bot=>bot.incidentStatus=="Closed/Resolved by Caller").length,
              "color": am4core.color("#ff6361")
            }];

            let priorityBasedPieData=[{
              "country": "High",
              "litres": modifiedResponse.filter(item=>item.priority=='High').length
            }, {
              "country": "Medium",
              "litres":  modifiedResponse.filter(item=>item.priority=='Medium').length
            }, {
              "country": "Low",
              "litres":  modifiedResponse.filter(item=>item.priority=='Low').length
            }];


            let ticketsByDate:any=[];
            modifiedResponse.forEach((item:any)=>{
              if(ticketsByDate.find((ticket:any)=>ticket.date==moment(item.createdAt).format("DD-MM-YYYY"))==undefined)
                ticketsByDate.push({
                  date:moment(item.createdAt).format("DD-MM-YYYY"),
                  ticketsCount:modifiedResponse.filter((item2:any)=>moment(item2.createdAt).format("DD-MM-YYYY")==moment(item.createdAt).format("DD-MM-YYYY")).length,
                })
            })
            setTimeout(() => {
              this.getChartByStatus(statusBasedPieData);
              this.getChartByPriority(priorityBasedPieData);
              this.incidentTableDataSource = new MatTableDataSource(
                modifiedResponse
              );
              this.incidentTableDataSource.sort = this.incidentTableSort;
              this.incidentTableDataSource.paginator = this.incidentTablePaginator;
              this.getChartByBots(ticketsByDate)
              this.spinner.hide();
            }, 100);
          }
        } else {
           this.spinner.hide(); 
          // Swal.fire("Error", response.errorMessage, "error")
        };
      },
      (err) => {
        this.loadingFlag = false;
        this.spinner.hide();
        Swal.fire("Error", "Unable to get incidents", "error");
      }
    );
  }

  searchIncidentTable() { // search table data
    let searchText = this.seachInput.trim();
    searchText = searchText.toLowerCase();
    this.incidentTableDataSource.filter = searchText;
  }

  reset() { // reset search input field
    this.seachInput = "";
    this.incidentTableDataSource.filter = "";
  }

 
  getChartByStatus(pieData){
    let data:any=pieData
    am4core.useTheme(am4themes_animated);
    // Themes end
    
    // Create chart instance
    var chart = am4core.create("chartByStatus", am4charts.PieChart);
    
    // Add and configure Series
    var pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "litres";
    pieSeries.dataFields.category = "country";
    pieSeries.slices.template.propertyFields.fill = "color";
    // Let's cut a hole in our Pie chart the size of 30% the radius
    chart.innerRadius = am4core.percent(30);
    pieSeries.slices.template.events.on(
      "hit",
      ev => {
      let a = ev.target;
      var idOfPie = ev.target._dataItem.dataContext["country"];
      },
    this
    );
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
    //pieSeries.labels.template.text = "{value.percent.formatNumber('#.')}";
    pieSeries.labels.template.text = "{value}";
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
    chart.legend.labels.template.text = "{category} - {value}";
    chart.legend.maxHeight = 70;
    chart.legend.scrollable = true;
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 10;
    markerTemplate.height = 10;
    chart.innerRadius = am4core.percent(0);
    chart.data = data;

    // hide zero values in chart
     pieSeries.events.on("datavalidated", function(ev) {
      ev.target.dataItems.each((di) => {
          if (di.values.value.value === 0 ) {
            di.hide();
          }
      })
    })

  }

  getChartByPriority(data)
  {


    am4core.useTheme(am4themes_animated);
    // Themes end
    
    // Create chart instance
    var chart = am4core.create("chartByPriority", am4charts.PieChart);
    
    // Add and configure Series
    var pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "litres";
    pieSeries.dataFields.category = "country";
    pieSeries.slices.template.propertyFields.fill = "color";
    // Let's cut a hole in our Pie chart the size of 30% the radius
    chart.innerRadius = am4core.percent(30);
    pieSeries.slices.template.events.on(
      "hit",
      ev => {
      let a = ev.target;
      var idOfPie = ev.target._dataItem.dataContext["country"];
      },
    this
    );
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
    //pieSeries.labels.template.text = "{value.percent.formatNumber('#.')}";
    pieSeries.labels.template.text = "{value}";
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
    chart.legend.labels.template.text = "{category} - {value}";
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 10;
    markerTemplate.height = 10;
    chart.innerRadius = am4core.percent(0);
    chart.data = data;

    // hide zero values in chart
     pieSeries.events.on("datavalidated", function(ev) {
      ev.target.dataItems.each((di) => {
          if (di.values.value.value === 0 ) {
            di.hide();
          }
      })
    })

  }




  getChartByBots(chartData)
  {
    let chart = am4core.create("chartdiv3", am4charts.XYChart);
    chart.data = chartData;
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "date";
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
    series.dataFields.valueY = "ticketsCount";
    series.dataFields.categoryX = "date";
    series.columns.template.tooltipText = "{date}:{ticketsCount}" 
    series.name = "Date";
    var columnTemplate = series.columns.template;
    columnTemplate.width = 5;
    columnTemplate.column.cornerRadiusTopLeft = 0;
    columnTemplate.column.cornerRadiusTopRight = 0;
    columnTemplate.strokeOpacity = 0;

    // Legend
    chart.legend = new am4charts.Legend();
    chart.legend.fontSize = 12;
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 10;
    markerTemplate.height = 10;

    // Add cursor
    chart.cursor = new am4charts.XYCursor();

  
    
  }
}
