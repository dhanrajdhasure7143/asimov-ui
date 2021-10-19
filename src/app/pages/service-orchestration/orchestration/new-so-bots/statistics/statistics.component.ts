import { Component, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import * as moment from 'moment';
import {NgxSpinnerService} from 'ngx-spinner';
import { RestApiService } from 'src/app/pages/services/rest-api.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
    isActiveBot:boolean=false;
    isActiveException:boolean=false;
    environments:any=[];
    runtimestats:any=[];
    runtimestatschart:any;
    runtimeflag:boolean;
    bots:any;
    processnames:any=[];
    processstatistics:any;
    approved_processes:any;
  constructor(
    private spinner:NgxSpinnerService,
    private rest:RestApiService
    ) { }

    public allbots:any;
  ngOnInit(){
    this.spinner.show();
    this.getallbots();
    //this.getslametrics();
    this.getprocesses();
    setTimeout(()=>{

//this.chart1();
this.slachart();
//this.chart5();
this.modelChart();
this.getEnvironments();
    },500)
  }




  getslametrics()
  {
    this.rest.getslametrics().subscribe(metrics=>{
     //console.log(metrics);
    
    })
  }
  getallbots()
  {
    am4core.useTheme(am4themes_animated);
    this.rest.getallsobots().subscribe(item=>{
       this.allbots=item;
       let data:any=[{
        "country": "Failure",
        "litres": this.allbots.filter(bot=>bot.botStatus=="Failure").length,
        "color": "#BC1D28"
      },{
        "country": "New",
        "litres":  this.allbots.filter(bot=>bot.botStatus=="New").length,
        "color": "#00a0e3"
      }, {
        "country": "Stopped",
        "litres":  this.allbots.filter(bot=>bot.botStatus=="Stopped").length,
        "color": "#FF0000"
      },
      {
        "country": "Success",
        "litres":  this.allbots.filter(bot=>bot.botStatus=="Success").length,
        "color":"#62C849"
      }];

      
      this.chart1(data)
      //this.chart2()
      let sourceType=[{
        "country": "UiPath",
        "litres": this.allbots.filter(item=>item.sourceType=="UiPath").length,
        "color": "#fa4616"
      },{
        "country": "Blue Prism",
        "litres":  this.allbots.filter(item=>item.sourceType=="BluePrism").length,
        "color": "#001c47"
      },{
        "country": "EPSoft",
        "litres":this.allbots.filter(item=>item.sourceType=="EPSoft").length,
        "color": "#00a0e3"
      }];
      
      this.chart3(sourceType, this.allbots.length);
      //this.chart4();
      
      this.getprocesses();
      this.getBpmnApprovedProcesses();
      this.botruntimestats();
      this.spinner.hide();
      
    })
  }


  chart1(data){
    
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
        // switch(idOfPie) {
        //   case 'Active':
        //       $('.botstatusactive').show();
        //       $('.botactive.except').hide();
        //     //   document.querySelector('.botstatusactive').scrollIntoView({
        //     //     behavior: 'smooth'
        //     // });
        //     //   $('html,body').animate({
        //     //     scrollTop: $(".botstatusactive").offset().top},
        //     //     'slow');
        //       break;
        //   case 'Exception':
        //       $('.botactive.except').show();
        //       $('.botstatusactive').hide();
        //     //   document.querySelector('.except').scrollIntoView({
        //     //     behavior: 'smooth'
        //     // });
        //     //   $('html,body').animate({
        //     //     scrollTop: $(".botactive.except").offset().top},
        //     //     'slow');
        //       break;
        //   default:
        //       $('.botstatusactive').hide();
        //       $('.botactive.except').hide();
        // }
        
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


  }

  chart2(){
    am4core.useTheme(am4themes_animated);

// Create chart instance
var chart = am4core.create("chartdiv2", am4charts.XYChart);
function getDate(value,type){
  let currentdate=new Date();
    (type == "1") ? currentdate.setDate(currentdate.getDate() + value) : currentdate.setDate(currentdate.getDate() - value);
    return moment(currentdate).format('YYYY,MM,DD');

}

// Add data
chart.data = [{
"date": new Date(getDate(0,"0")),
"value": 450,
"value2": 362,
"value3": 699
}, {
"date": new Date(getDate(1,"0")),
"value": 269,
"value2": 450,
"value3": 841
}, {
"date": new Date(getDate(2,"0")),
"value": 700,
"value2": 358,
"value3": 699
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
  chart3(data, length){

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
        chart.innerRadius = am4core.percent(40);
        pieSeries.labels.template.maxWidth = 130;
    pieSeries.labels.template.wrap = false;
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
        pieSeries.labels.template.bent = false;
        pieSeries.labels.template.radius = 3;
        pieSeries.labels.template.padding(0,0,0,0);
        pieSeries.labels.template.disabled=true;
        pieSeries.ticks.template.disabled = true;
        var label = pieSeries.createChild(am4core.Label);

        label.text = length;
        label.horizontalCenter = "middle";
        label.verticalCenter = "middle";
        label.fontSize = 50;
  
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
        
        chart.data = data
        });  

  }
  slachart(){
    
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end
    
    // Create chart instance
    var chart = am4core.create("slachartdiv", am4charts.PieChart);
    
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
      "country": "SLA Breach",
      "litres": 16,
      "color": am4core.color("#BC1D28")
    },{
      "country": "Alerts Triggered",
      "litres": 21,
      "color": am4core.color("#F9AF03")
    }, {
      "country": "Within SLA",
      "litres": 50.7,
      "color": am4core.color("#62C849")
    }];


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
  getdate(value,type){
    let currentdate=new Date();
    (type == "1") ? currentdate.setDate(currentdate.getDate() + value) : currentdate.setDate(currentdate.getDate() - value);
    return moment(currentdate).format('DD/MM/YYYY');
  }


  getEnvironments()
  {
    this.rest.listEnvironments().subscribe(data=>{
      let response:any=data;
      if(response.errorMessage == undefined)
      {
        this.environments=response;
        let data=[{
          "country": "Mac",
          "litres": this.environments.filter(item=>item.environmentType=="Mac").length,
          "color": "#C2B280"
        },{
          "country": "Windows",
          "litres":  this.environments.filter(item=>item.environmentType=="Windows").length,
          "color": "#848482"
        },{
          "country": "Linux",
          "litres":this.environments.filter(item=>item.environmentType=="Linux").length,
          "color": "#BE0032"
        }];

        setTimeout(()=>{

          this.getEnvironmentsChart(data, this.environments.length)
        },500)
      }
    })
  }


  getEnvironmentsChart(data, length)
  {
    am4core.ready(function() {
        
      // Themes begin
      am4core.useTheme(am4themes_animated);
      // Themes end
      
      // Create chart instance
      var chart = am4core.create("environments-chart", am4charts.PieChart);
      
      // Add and configure Series
      var pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "litres";
      pieSeries.dataFields.category = "country";
      pieSeries.slices.template.propertyFields.fill = "color";
      // Let's cut a hole in our Pie chart the size of 30% the radius
      chart.innerRadius = am4core.percent(40);
      pieSeries.labels.template.maxWidth = 130;
  pieSeries.labels.template.wrap = false;
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
      
      pieSeries.labels.template.text = "{category} - {value}";
      pieSeries.labels.template.padding(0,0,0,0);
      pieSeries.labels.template.disabled=true;
      pieSeries.ticks.template.disabled = true;
      var label = pieSeries.createChild(am4core.Label);
      //label.text = "122";
      label.text = length;
      label.horizontalCenter = "middle";
      label.verticalCenter = "middle";
      label.fontSize = 50;
      // Create a base filter effect (as if it's not there) for the hover to return to
      var shadow = pieSeries.slices.template.filters.push(new am4core.DropShadowFilter);
      shadow.opacity = 0;
      
      // Create hover state
      var hoverState = pieSeries.slices.template.states.getKey("hover"); // normally we have to create the hover state, in this case it already exists
      
      // Slightly shift the shadow and make it more prominent on hover
      var hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter);
      hoverShadow.opacity = 0.7;
      hoverShadow.blur = 5;
      


      chart.legend = new am4charts.Legend();
      chart.legend.fontSize = 13;
      chart.legend.labels.template.text = "{category}-{value}";
      let markerTemplate = chart.legend.markers.template;
      markerTemplate.width = 10;
      markerTemplate.height = 10;

      
      chart.data = data
      });  
  }




  botruntimestats()
  {
    this.rest.botPerformance().subscribe(data=>{
      let botperformances:any=[]
      botperformances=data;
      this.bots=botperformances;
      let today=new Date();
      let yesterday=new Date();
      let runtimestats:any=[]
      yesterday.setDate(today.getDate()-1);
      this.allbots.forEach(bot => {
        let filteredbot:any;
        filteredbot=botperformances.find(item=>item.botId==bot.botId);
        if(filteredbot != undefined)
        {
          let filteredCoordinates:any=filteredbot.coordinates;
          //.filter(item=>moment(item.startTime,"x").format("D-MM-YYYY")==moment(today).format("D-MM-YYYY")||moment(item.startTime,"x").format("D-MM-YYYY")==moment(yesterday).format("D-MM-YYYY"));
         //console.log("---------check--------",filteredCoordinates)
          if(filteredCoordinates.length>0)
          {
              let timedur:any=0;
              filteredCoordinates.forEach(timeseries=>{
                timedur=timedur+timeseries.timeDuration;
              })
              let data:any={
                "name":filteredbot.botName,
                "value":timedur
              }
              runtimestats.push(data);

          }
        }
      });
     //console.log(this.runtimestats)
      this.runtimestats=runtimestats.sort(function(a, b){return b.value - a.value});
     //console.log(this.runtimestats)
      if(runtimestats.length!=0)
      {
        this.statschart();
      }
      this.runtimeflag=true;
    })
  }



  statschart()
  {
    am4core.useTheme(am4themes_animated);
    setTimeout(()=>{
      this.runtimestatschart = am4core.create("runtimestatistics-piechart", am4charts.XYChart);
      this.runtimestatschart.hiddenState.properties.opacity = 0; // this creates initial fade-in
      this.runtimestatschart.data=this.runtimestats;
      this.runtimestatschart.zoomOutButton.disabled = true;

      this.runtimestatschart.colors.list = [
        am4core.color("#bf9d76"),
        am4core.color("#e99450"),
        am4core.color("#d89f59"),
        am4core.color("#f2dfa7"),
        am4core.color("#ff5b4f"),
        am4core.color("#74c7b8")
      ]
      var categoryAxis = this.runtimestatschart.xAxes.push(new am4charts.CategoryAxis());

      categoryAxis.dataFields.category = "name";
      categoryAxis.title.text = "Bots";
      let label1 = categoryAxis.renderer.labels.template;
      label1.wrap = true;
      label1.maxWidth = 120;
      categoryAxis.renderer.minGridDistance = 30;
      var valueAxis = this.runtimestatschart.yAxes.push(new am4charts.ValueAxis());
      // valueAxis.renderer.inside = true;
      // valueAxis.renderer.labels.template.fillOpacity = 1;
      // valueAxis.renderer.grid.template.strokeOpacity = 0;
      // valueAxis.min = 0;
      // valueAxis.cursorTooltipEnabled = false;
      // valueAxis.renderer.gridContainer.zIndex = 1;
      valueAxis.renderer.labels.template.fontSize = 11;
      valueAxis.renderer.labels.template.fillOpacity = 1;
      valueAxis.renderer.grid.template.location = 0;
      valueAxis.renderer.minGridDistance = 30;

      valueAxis.title.text = "Total Execution Time (ms)";
      var series = this.runtimestatschart.series.push(new am4charts.ColumnSeries);
      series.dataFields.valueY = "value";
      series.dataFields.categoryX = "name";
      series.tooltipText = "{valueY.value}";

      var columnTemplate = series.columns.template;
      columnTemplate.width = 40;
      columnTemplate.column.cornerRadiusTopLeft = 10;
      columnTemplate.column.cornerRadiusTopRight = 10;
      columnTemplate.strokeOpacity = 0;
      let runtimeref=this.runtimestatschart;
      columnTemplate.events.once("inited", function(event){
        event.target.fill = runtimeref.colors.getIndex(event.target.dataItem.index);
      });
      var cursor = new am4charts.XYCursor();
      cursor.behavior = "panX";
      this.runtimestatschart.cursor = cursor;
      this.runtimestatschart.events.on("datavalidated", function () {
        if(this.runtimestats.length>5)
          categoryAxis.zoomToIndexes(0,7,false,true);
        else
          categoryAxis.zoomToIndexes(0,this.runtimestats.length,false,true);
      },this);
      series.columns.template.events.on("hit", function(ev) {
        let getdata:any=ev.target.dataItem.categories.categoryX
        let data={name:getdata};
        this.getruns(data);

      },this);

      

      var label = this.runtimestatschart.plotContainer.createChild(am4core.Label);
       label.x = 90;
       label.y = 50;
       $("#runtimestatistics-piechart > div > svg > g > g:nth-child(2) > g:nth-child(2)").hide();

    },30)

  }
  
  getBpmnApprovedProcesses()
  {
    this.rest.getUserBpmnsList().subscribe(data=>{
      let response:any=data;
      //console.log(response);
      this.approved_processes=response.filter(data=>data.bpmnProcessStatus=="APPROVED");
      this.getprocessstatistics();
    })
  }
  getprocesses()
  {
    this.rest.getautomatedtasks(0).subscribe(data=>{
      let resp:any=data;
        this.rest.getprocessnames().subscribe(data=>{
          this.processnames=data;
          //this.getbotsvshumans()
          //this.getprocessstatistics();
        })
    })
  }
  
  getprocessstatistics(){
    let data=[
             {
               "country":"Processes",
               "litres":this.approved_processes.length,
               "color": "#ce3779"

             },
             {
               "country":"Bots",
               "litres":this.allbots.length,
               "color": "#575fcd"
               
             }
           ]
   this.processstatistics=data;
   setTimeout(() => {
     var chart = am4core.create("processstatistics-piechart", am4charts.PieChart);
     chart.innerRadius = am4core.percent(30);
     var pieSeries = chart.series.push(new am4charts.PieSeries());
     pieSeries.dataFields.value = "litres";
     pieSeries.dataFields.category = "country";
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
     pieSeries.labels.template.padding(0,0,0,0);
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
     chart.data = this.processstatistics;

     chart.legend = new am4charts.Legend();
     chart.legend.fontSize = 13;
     chart.legend.labels.template.text = "{category} - {value}";
   }, 50);
}


}