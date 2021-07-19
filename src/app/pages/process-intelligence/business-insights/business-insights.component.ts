import { Component, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
@Component({
  selector: 'app-business-insights',
  templateUrl: './business-insights.component.html',
  styleUrls: ['./business-insights.component.css']
})
export class BusinessInsightsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    setTimeout(()=>{
      this.sales_distribution_chart();
      this.thoughtput_time_chart();
    },500)
  }



  sales_distribution_chart()
  {
    am4core.ready(function() {
        
      // Themes begin
      am4core.useTheme(am4themes_animated);
      // Themes end
      
      var chart = am4core.create("chartdiv", am4charts.PieChart);
      chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
      chart.legend = new am4charts.Legend();
      chart.legend.useDefaultMarker = true;
      var marker = chart.legend.markers.template.children.getIndex(0);
      //marker.cornerRadius(12, 12, 12, 12);
      marker.strokeWidth = 2;
      marker.strokeOpacity = 1;
      marker.stroke = am4core.color("#ccc");
      chart.legend.scrollable = true;
      chart.legend.fontSize = 12;
  
      chart.data = [
        {
          country: "Perform Callback with customer",
          litres: 22.41
        },
        {
          country: "Initiate sales",
          litres: 12.48
        },
        {
          country: "Perform Customer profiling",
          litres: 59.16
        },
        {
          country: "Request advisor for proposal",
          litres: 2.13
        },
        {
          country: "Prepare proposal",
          litres: 71.27
        },
        {
          country: "Share proposal to customer",
          litres: 2.11
        },
        {
          country: "Request Instructions and Documents",
          litres: 70.36
        },
        {
          country: "Verify documents",
          litres: 35.94
        },
        {
          country: "Review Dcouments",
          litres: 3
        },
        {
          country: "Check if trade is as per profile",
          litres: 1.54
        },
        {
          country: "Check if product is in recommended list",
          litres: 1.52
        },
        {
          country: "Order entered",
          litres: 1.97
        },
        {
          country: "send it to dealer for execution",
          litres: 5.54
        },
        {
          country: "Trade executed",
          litres: 24.06
        },
        {
          country: "Trade settlement",
          litres: 4.51
        },
        {
          country: "Order allotment performed",
          litres: 3.32
        },
        {
          country: "Send Trade contract",
          litres: 2.95
        },
        {
          country: "Order Rejected",
          litres: 14.33
        },
        {
          country: "Order Cancelled",
          litres: 1.98
        },
        {
          country: "Request exception approval",
          litres: 61.54
        },
        {
          country: "Perform exception",
          litres: 31.9
        }
        
      ];
      
      chart.legend.position = "right";
      chart.legend.valign = "middle";
      chart.innerRadius = 70;
      var label = chart.seriesContainer.createChild(am4core.Label);
//label.text = "230,900 Sales";
label.horizontalCenter = "middle";
label.verticalCenter = "middle";
label.fontSize = 18;
      var series = chart.series.push(new am4charts.PieSeries());
      series.dataFields.value = "litres";
      series.dataFields.category = "country";
      series.labels.template.disabled = true;
      series.slices.template.cornerRadius = 0;
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
      }); // end am4core.ready()
  }


  thoughtput_time_chart()
  {
    am4core.ready(function() {
    
      // Themes begin
      am4core.useTheme(am4themes_animated);
      // Themes end
      
      // Create chart instance
      var chart = am4core.create("chartdiv2", am4charts.XYChart);
      
      // Add data
      chart.data = [{
        "country": "1",
        "visits": 5
      }, {
        "country": "2",
        "visits": 8
      }, {
        "country": "3",
        "visits": 11
      }, {
        "country": "4",
        "visits": 14
      }, {
        "country": "5",
        "visits": 17
      }, {
        "country": "6",
        "visits": 20
      }, {
        "country": "7",
        "visits": 23
      }, {
        "country": "8",
        "visits": 26
      }, {
        "country": "9",
        "visits": 29
      }, {
        "country": "10",
        "visits": 56
      }];
      
      // Create axes
      
      var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "country";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.minGridDistance = 30;
      categoryAxis.title.text="Weeks"
      //categoryAxis.title.fontWeight="bold"
      // categoryAxis.renderer.labels.template.adapter.add("dy", function(dy, target) {
      //   if (target.dataItem && target.dataItem.index && 2 == 2) {
      //     return dy + 25;
      //   }
      //   return dy;
      // });
      
      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.title.text = "No.of.Cases";
      //valueAxis.title.fontWeight="bold"
      // Create series
      var series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = "visits";
      series.dataFields.categoryX = "country";
      series.name = "Visits";
      series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
      series.columns.template.fillOpacity = 1;
      var columnTemplate = series.columns.template;
      columnTemplate.strokeWidth = 2;
      columnTemplate.strokeOpacity = 1;
      
      }); // end am4core.ready()
    
  }

}
