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
        
    
  
     let data = [
        
        
          {
              "Activity": "Perform callback",
              "Duration":"23692457695"
          },
          {
              "Activity": "Share proposal to customer",
              "Duration": "1646852790"
          },
          {
              "Activity": "Initiate sales",
              "Duration": "115167289960"
          },
          {
              "Activity": "Perform customer profiling",
              "Duration": "33963703952"
          },
          {
              "Activity": "Request advisor for proposal",
              "Duration": "1308233816"
          },
          {
              "Activity": "Prepare proposal",
              "Duration": "58887650764"
          },
          {
              "Activity": "Prepare documentation",
              "Duration": "74189354852"
          },
          {
              "Activity": "Verify documents",
              "Duration": "21415770932"
          },
          {
              "Activity": "Review documents",
              "Duration": "2650806972"
          },
          {
              "Activity": "Send to dealer for execution",
              "Duration": "3486911962"
          },
          {
              "Activity": "Trade executed and order settlement",
              "Duration": "22566490892"
          },
          {
              "Activity": "Send trade contract",
              "Duration": "8287641976"
          },
          {
              "Activity": "Order allotment performed",
              "Duration": "8668382979"
          },
          {
              "Activity": "Order entered",
              "Duration": "888236964"
          },
          {
              "Activity": "Trade amendment requested",
              "Duration": "8382770880"
          },
          {
              "Activity": "Trade Amended",
              "Duration": "2386391964"
          },
          {
              "Activity": "Check if trade is as per profile",
              "Duration": "649131912"
          },
          {
              "Activity": "Check if product is in recommended list",
              "Duration": "640592901"
          },
          {
              "Activity": "Request proposal amendment",
              "Duration": "11080437972"
          },
          {
              "Activity": "Amend proposal",
              "Duration": "17840208940"
          },
          {
              "Activity": "Order rejected",
              "Duration": "3610611970"
          },
          {
              "Activity": "Order cancelled",
              "Duration": "285758000"
          },
          {
              "Activity": "Request exception approval",
              "Duration": "4431088000"
          },
          {
              "Activity": "Perform exception",
              "Duration": "2296879000"
          }
      
        
      ];


      // let data2=[...data.map(item=>{
      //    let duration=parseInt(item["Duration"]);
      //    item["Duration"]=(this.parseMillisecondsIntoReadableTime(duration)).toString();
      //     return item;
      // })]
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
      
      chart.data=data;


  

      // console.log(data2)
      
      chart.legend.position = "right";
      chart.legend.valign = "middle";
      chart.innerRadius = 70;
      var label = chart.seriesContainer.createChild(am4core.Label);
//label.text = "230,900 Sales";
label.horizontalCenter = "middle";
label.verticalCenter = "middle";
label.fontSize = 18;
      var series = chart.series.push(new am4charts.PieSeries());
      series.dataFields.value = "Duration";
      series.dataFields.category = "Activity";
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
        "country": "10-16",
        "visits": 26
      }, {
        "country": "16-21",
        "visits": 108
      }, {
        "country": "21-27",
        "visits": 40
      }, {
        "country": "27-32",
        "visits": 20
      }, {
        "country": "32-38",
        "visits": 14
      }, {
        "country": "38-43",
        "visits": 21
      }, {
        "country": "43-49",
        "visits": 10
      }, {
        "country": "49-54",
        "visits": 3
      }, {
        "country": "54-60",
        "visits": 2
      }];
      
      // Create axes
  
      var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "country";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.minGridDistance = 30;
      categoryAxis.title.text="Days"
      // categoryAxis.title.fontWeight="bold"
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
      series.columns.template.tooltipText = " Duration : {categoryX} Days\n  Cases : {valueY}[/] ";
      series.columns.template.fillOpacity = 1;
      series.columns.template.adapter.add("fill", function(fill, target) {
          return am4core.color("#4d72be");
        });
      
      // chart.colors.list = [
        
      //   am4core.color("rgba(85, 216, 254, 0.9)"),
      // ];
      
      var columnTemplate = series.columns.template;
      columnTemplate.strokeWidth = 0;
      columnTemplate.strokeOpacity = 1;
      
      }); // end am4core.ready()
    
  }
  parseMillisecondsIntoReadableTime(milliseconds){
    //Get hours from milliseconds
    var hours = milliseconds / (1000*60*60);
    var absoluteHours = Math.floor(hours);
    var h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;
  
    //Get remainder from hours and convert to minutes
    var minutes = (hours - absoluteHours) * 60;
    var absoluteMinutes = Math.floor(minutes);
    var m = absoluteMinutes > 9 ? absoluteMinutes : '0' +  absoluteMinutes;
  
    //Get remainder from minutes and convert to seconds
    var seconds = (minutes - absoluteMinutes) * 60;
    var absoluteSeconds = Math.floor(seconds);
    var s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;
  
  
    return h + '.' + m + '.' + s;
  }
  


}
