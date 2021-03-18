import { Component, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {NgxSpinnerService} from 'ngx-spinner'
@Component({
  selector: 'app-new-so-bots',
  templateUrl: './new-so-bots.component.html',
  styleUrls: ['./new-so-bots.component.css']
})
export class NewSoBotsComponent implements OnInit {
    isActiveBot:boolean=false;
    isActiveException:boolean=false;

    public selectedTab=0;
    public check_tab=0;

    url: string = "http://10.11.0.129:8080/knowage/servlet/AdapterHTTP?ACTION_NAME=EXECUTE_DOCUMENT_ACTION&OBJECT_LABEL=Bots Tab&TOOLBAR_VISIBLE=false&ORGANIZATION=DEMO&NEW_SESSION=false";
    url1: string = "http://10.11.0.129:8080/knowage/servlet/AdapterHTTP?ACTION_NAME=EXECUTE_DOCUMENT_ACTION&OBJECT_LABEL=Monitoring tab&TOOLBAR_VISIBLE=false&ORGANIZATION=DEMO&NEW_SESSION=false";
    urlSafe: SafeResourceUrl;
    urlSafe1: SafeResourceUrl;

  constructor(public sanitizer: DomSanitizer, private spinner:NgxSpinnerService) { }

  ngOnInit(){
    this.spinner.show();
    this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    this.urlSafe1= this.sanitizer.bypassSecurityTrustResourceUrl(this.url1);
this.chart1();
this.chart2();
this.chart3();
this.chart4();
this.chart5();
this.modelChart();
  }
  onTabChanged(event)
  {
    this.selectedTab=event.index;
    this.check_tab=event.index;
  }
  chart1(){
    
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end
    
    // Create chart instance
    var chart = am4core.create("chartdiv", am4charts.PieChart);
    
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
        switch(idOfPie) {
          case 'Active':
              $('.botstatusactive').show();
              $('.botactive.except').hide();
              document.querySelector('.botstatusactive').scrollIntoView({
                behavior: 'smooth'
            });
            //   $('html,body').animate({
            //     scrollTop: $(".botstatusactive").offset().top},
            //     'slow');
              break;
          case 'Exception':
              $('.botactive.except').show();
              $('.botstatusactive').hide();
              document.querySelector('.except').scrollIntoView({
                behavior: 'smooth'
            });
            //   $('html,body').animate({
            //     scrollTop: $(".botactive.except").offset().top},
            //     'slow');
              break;
          default:
              $('.botstatusactive').hide();
              $('.botactive.except').hide();
        }
        
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
      "country": "Exception",
      "litres": 12,
      "color": am4core.color("#BC1D28")
    },{
      "country": "Idle",
      "litres": 21,
      "color": am4core.color("#6E6E6E")
    }, {
      "country": "Active",
      "litres": 84.8,
      "color": am4core.color("#62C849")
    }];


  }
  chart2(){
    am4core.useTheme(am4themes_animated);

// Create chart instance
var chart = am4core.create("chartdiv2", am4charts.XYChart);

// Add data
chart.data = [{
"date": new Date(2018, 0, 1),
"value": 450,
"value2": 362,
"value3": 699
}, {
"date": new Date(2018, 0, 2),
"value": 269,
"value2": 450,
"value3": 841
}, {
"date": new Date(2018, 0, 3),
"value": 700,
"value2": 358,
"value3": 699
}, {
"date": new Date(2018, 0, 4),
"value": 490,
"value2": 367,
"value3": 500
}, {
"date": new Date(2018, 0, 5),
"value": 500,
"value2": 485,
"value3": 369
}, {
"date": new Date(2018, 0, 6),
"value": 550,
"value2": 354,
"value3": 250
}, {
"date": new Date(2018, 0, 7),
"value": 420,
"value2": 350,
"value3": 600
}];

// Create axes
var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
dateAxis.renderer.grid.template.location = 0;

var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
valueAxis.renderer.labels.template.fontSize = 11;
// Create series
function createSeries(field, name, hiddenInLegend) {
var series = chart.series.push(new am4charts.LineSeries());
series.dataFields.valueY = field;
series.dataFields.dateX = "date";
series.name = name;
series.tooltipText = "{dateX}: [b]{valueY}[/]";
series.strokeWidth = 2;
if (hiddenInLegend) {
series.hiddenInLegend = true;
}

var bullet = series.bullets.push(new am4charts.CircleBullet());
bullet.circle.stroke = am4core.color("#fff");
bullet.circle.strokeWidth = 2;

return series;
}

var series1 = createSeries("value", "Series #1",true);// change
var series2 = createSeries("value2", "Series #2", true);
var series3 = createSeries("value3", "Series #3", true);

series1.events.on("hidden", function() {
series2.hide();
series3.hide();
});

series1.events.on("shown", function() {
series2.show();
series3.show();
});


chart.cursor = new am4charts.XYCursor();
// chart.legend.fontSize = 11;
  }
  chart3(){

    am4core.ready(function() {
        
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end
        
        // Create chart instance
        var chart = am4core.create("chartdiv3", am4charts.PieChart);
        
        // Add and configure Series
        var pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "litres";
        pieSeries.dataFields.category = "country";
        pieSeries.slices.template.propertyFields.fill = "color";
        // Let's cut a hole in our Pie chart the size of 30% the radius
        chart.innerRadius = am4core.percent(50);
        pieSeries.labels.template.maxWidth = 130;
    pieSeries.labels.template.wrap = true;
    pieSeries.labels.template.fontSize = 15;
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
        
        pieSeries.alignLabels = false;
        pieSeries.labels.template.bent = true;
        pieSeries.labels.template.radius = 3;
        pieSeries.labels.template.padding(0,0,0,0);
        
        pieSeries.ticks.template.disabled = true;
        
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
        
        
        chart.data = [{
          "country": "UiPath",
          "litres": 27,
          "color": am4core.color("#ffda83")
        },{
          "country": "IAP",
          "litres": 35,
          "color": am4core.color("#55d8fe")
        }];
        
        });  

  }
  chart4(){

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end
    
    /**
     * Chart design taken from Samsung health app
     */
    
    var chart = am4core.create("chartdiv4", am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
    
    chart.data = [
      {
        "date": "2018-01-01",
        "steps": 2
    }, {
        "date": "2018-01-02",
        "steps": 3
    }, {
        "date": "2018-01-03",
        "steps": 1
    }, {
        "date": "2018-01-04",
        "steps": 4
    }, {
        "date": "2018-01-05",
        "steps": 5
    }, {
        "date": "2018-01-06",
        "steps": 1
    }, {
        "date": "2018-01-07",
        "steps": 3
    }, {
        "date": "2018-01-08",
        "steps": 2
    }, {
        "date": "2018-01-09",
        "steps": 4
    }, {
        "date": "2018-01-10",
        "steps": 2
    }, {
        "date": "2018-01-11",
        "steps": 0
    }, {
      "date": "2018-01-12",
      "steps": 0
  }, {
      "date": "2018-01-13",
      "steps": 0
  }, {
      "date": "2018-01-14",
      "steps": 0
  }, {
      "date": "2018-01-15",
      "steps": 0
  }, {
      "date": "2018-01-16",
      "steps": 0
  }, {
      "date": "2018-01-17",
      "steps": 0
  }, {
      "date": "2018-01-18",
      "steps": 0
  }, {
      "date": "2018-01-19",
      "steps": 0
  }, {
      "date": "2018-01-20",
      "steps": 0
  }, {
      "date": "2018-01-21",
      "steps": 0
  }, {
      "date": "2018-01-22",
      "steps": 0
  }, {
      "date": "2018-01-23",
      "steps": 0
  }, {
      "date": "2018-01-24",
      "steps": 0
  }, {
      "date": "2018-01-25",
      "steps": 0
  }, {
      "date": "2018-01-26",
      "steps": 0
  }, {
      "date": "2018-01-27",
      "steps": 0
  }, {
      "date": "2018-01-28",
      "steps": 0
  }, {
      "date": "2018-01-29",
      "steps": 0
  }, {
      "date": "2018-01-30",
      "steps": 0
  }, {
      "date": "2018-01-31",
      "steps": 0
  }
    ];
    
    chart.dateFormatter.inputDateFormat = "YYYY-MM-dd";
    chart.zoomOutButton.disabled = true;
    
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.strokeOpacity = 0;
    dateAxis.renderer.minGridDistance = 10;
    dateAxis.dateFormats.setKey("day", "d");
    dateAxis.tooltip.hiddenState.properties.opacity = 1;
    dateAxis.tooltip.hiddenState.properties.visible = true;
    
    
    dateAxis.tooltip.adapter.add("x", function (x, target) {
        return am4core.utils.spritePointToSvg({ x: chart.plotContainer.pixelX, y: 0 }, chart.plotContainer).x + chart.plotContainer.pixelWidth / 2;
    })
    
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.inside = true;
    valueAxis.renderer.labels.template.fillOpacity = 0.3;
    valueAxis.renderer.grid.template.strokeOpacity = 0;
    valueAxis.min = 0;
    valueAxis.cursorTooltipEnabled = false;
    valueAxis.renderer.labels.template.fontSize = 11;
    // goal guides
    var axisRange = valueAxis.axisRanges.create();
    axisRange.value = 3;
    axisRange.grid.strokeOpacity = 0.1;
    axisRange.label.text = "";
    axisRange.label.align = "right";
    axisRange.label.verticalCenter = "bottom";
    axisRange.label.fillOpacity = 0.8;
    
    valueAxis.renderer.gridContainer.zIndex = 1;
    valueAxis.renderer.labels.template.fontSize = 11;
    var axisRange2 = valueAxis.axisRanges.create();
    axisRange2.value = 5;
    axisRange2.grid.strokeOpacity = 0.1;
    axisRange2.label.text = "";
    axisRange2.label.align = "right";
    axisRange2.label.verticalCenter = "bottom";
    axisRange2.label.fillOpacity = 0.8;
    
    var series = chart.series.push(new am4charts.ColumnSeries);
    series.dataFields.valueY = "steps";
    series.dataFields.dateX = "date";
    series.tooltipText = "{valueY.value}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.hiddenState.properties.opacity = 1;
    series.tooltip.hiddenState.properties.visible = true;
    series.tooltip.adapter.add("x", function (x, target) {
        return am4core.utils.spritePointToSvg({ x: chart.plotContainer.pixelX, y: 0 }, chart.plotContainer).x + chart.plotContainer.pixelWidth / 2;
    })
    
    var columnTemplate = series.columns.template;
    columnTemplate.width = 25;
    columnTemplate.column.cornerRadiusTopLeft = 20;
    columnTemplate.column.cornerRadiusTopRight = 20;
    columnTemplate.strokeOpacity = 0;
    
    columnTemplate.adapter.add("fill", function (fill, target) {
        let dataItem:any = target.dataItem;
        if (dataItem.valueY > 3) {
            return chart.colors.getIndex(0);
        }
        else {
            return am4core.color("#a8b3b7");
        }
    })
    
    var cursor = new am4charts.XYCursor();
    cursor.behavior = "panX";
    chart.cursor = cursor;
    cursor.lineX.disabled = true;
    
    chart.events.on("ready", function () {
        dateAxis.zoomToDates(new Date(2018, 0, 5), new Date(2018, 0, 12), false, true);
    });
    
    var middleLine = chart.plotContainer.createChild(am4core.Line);
    middleLine.strokeOpacity = 1;
    middleLine.stroke = am4core.color("#000000");
    middleLine.strokeDasharray = "2,2";
    middleLine.align = "center";
    middleLine.zIndex = 1;
    middleLine.adapter.add("y2", function (y2, target) {
        return target.parent.pixelHeight;
    })
    
    cursor.events.on("cursorpositionchanged", updateTooltip);
    dateAxis.events.on("datarangechanged", updateTooltip);
    
    function updateTooltip() {
        dateAxis.showTooltipAtPosition(0.5);
        series.showTooltipAtPosition(0.5, 0);
        series.tooltip.validate(); // otherwise will show other columns values for a second
    }
    
    
    var label = chart.plotContainer.createChild(am4core.Label);
    label.text = "";
    label.x = 90;
    label.y = 50;
  }
  chart5(){
    
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end
    
    // Create chart instance
    var chart = am4core.create("chartdiv5", am4charts.XYChart);
    
    // Add data
    var data = [
      
      {
        country: "Email Reconciliation Report",
        research: 301.9
      },
      {
        country: "Process Payment",
        research: 361.9
      },
      {
        country: "Invoice Check",
        research: 271.1
      },
      {
        country: "Extract Invoice",
        research: 271.1
      }
    ];
    
    chart.data = data;
    // Create axes
    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "country";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 10;
    categoryAxis.interpolationDuration = 2000;
    
    var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.labels.template.fontSize = 11;
    // Create series
    function createSeries(field, name) {
      var series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueX = "research";
      series.dataFields.categoryY = "country";
      series.columns.template.tooltipText = "[bold]{valueX}[/]";
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    
      var hs = series.columns.template.states.create("hover");
      hs.properties.fillOpacity = 0.7;
    
      var columnTemplate = series.columns.template;
      columnTemplate.maxX = 0;
      columnTemplate.draggable = true;
    
      columnTemplate.events.on("dragstart", function (ev) {
        var dataItem = ev.target.dataItem;
    
        // var axislabelItem = categoryAxis.dataItemsByCategory.getKey(
        //   dataItem.categoryY
        // )._label;
        // axislabelItem.isMeasured = false;
        // axislabelItem.minX = axislabelItem.pixelX;
        // axislabelItem.maxX = axislabelItem.pixelX;
    
        // axislabelItem.dragStart(ev.target.interactions.downPointers.getIndex(0));
        // axislabelItem.dragStart(ev.pointer);
      });
      columnTemplate.events.on("dragstop", function (ev) {
        var dataItem = ev.target.dataItem;
        // var axislabelItem = categoryAxis.dataItemsByCategory.getKey(
        //   dataItem.categoryY
        // )._label;
        // axislabelItem.dragStop();
        handleDragStop(ev);
      });
    }
    createSeries("research", "Research");
    
    function handleDragStop(ev) {
      data = [];
      chart.series.each(function (series) {
        if (series instanceof am4charts.ColumnSeries) {
          series.dataItems.values.sort(compare);
    
          var indexes = {};
          series.dataItems.each(function (seriesItem, index) {
            indexes[seriesItem.categoryY] = index;
          });
    
          categoryAxis.dataItems.values.sort(function (a, b) {
            var ai = indexes[a.category];
            var bi = indexes[b.category];
            if (ai == bi) {
              return 0;
            } else if (ai < bi) {
              return -1;
            } else {
              return 1;
            }
          });
    
          var i = 0;
          categoryAxis.dataItems.each(function (dataItem) {
            dataItem._index = i;
            i++;
          });
    
          categoryAxis.validateDataItems();
          series.validateDataItems();
        }
      });
    }
    
    function compare(a, b) {
      if (a.column.pixelY < b.column.pixelY) {
        return 1;
      }
      if (a.column.pixelY > b.column.pixelY) {
        return -1;
      }
      return 0;
    }
    
  }
  modelChart(){

    am4core.useTheme(am4themes_animated);
    
    // Create chart instance
    var chart = am4core.create("modalchartdiv", am4charts.XYChart);
    
    // Add data
    chart.data = [{
    "date": new Date(2021, 0, 7),
    "value": 1
    }, {
    "date": new Date(2021, 0, 8),
    "value": 0
    }, {
    "date": new Date(2021, 0, 9),
    "value": 8
    }, {
    "date": new Date(2021, 0, 10),
    "value": 25
    }, {
    "date": new Date(2021, 0, 11),
    "value": 15
    }];
    
    // Create axes
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.labels.template.fontSize = 11;
    // Create series
    function createSeries(field, name, hiddenInLegend) {
    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = field;
    series.dataFields.dateX = "date";
    series.name = name;
    series.tooltipText = "{dateX}: [b]{valueY}[/]";
    series.strokeWidth = 2;
    if (hiddenInLegend) {
    series.hiddenInLegend = true;
    }
    
    var bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.circle.stroke = am4core.color("#fff");
    bullet.circle.strokeWidth = 2;
    
    return series;
    }
    
    var series1 = createSeries("value", "Series #1",true);
    var series2 = createSeries("value2", "Series #2", true);
    var series3 = createSeries("value3", "Series #3", true);
    
    series1.events.on("hidden", function() {
    series2.hide();
    series3.hide();
    });
    
    series1.events.on("shown", function() {
    series2.show();
    series3.show();
    });
    
    chart.cursor = new am4charts.XYCursor();
    chart.legend = new am4charts.Legend();
    chart.legend.fontSize = 11;

  }
  

}