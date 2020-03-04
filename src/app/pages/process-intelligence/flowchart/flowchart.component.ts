import { Component, OnInit } from '@angular/core';
import { Options, PointerType} from 'ng5-slider';

import * as d3 from "d3";
declare var $: any;
@Component({
  selector: 'app-flowchart',
  templateUrl: './flowchart.component.html',
  styleUrls: ['./flowchart.component.css']
})
export class FlowchartComponent implements OnInit {
  gaugemap: any = {};
  showXAxisLabel;
  showYAxisLabel;
  yAxisLabel;
  xScaleMax;

  multi:any[] = [
    {
      "name": "500",
      "series": [
        {
          "name": "success",
          "value": 23
        },
        {
          "name": "failuer",
          "value": 9
        }
      ]
    },
  
    {
      "name": "400",
      "series": [
        {
          "name": "success",
          "value": 3
        },
        {
          "name": "failuer",
  
          "value": 52
        }
      ]
    },
  
    {
      "name": "300",
      "series": [
        {
          "name": "success",
          "value": 19
        },
        {
          "name": "failuer",
          "value": 8
        }
      ]
    },
     {
      "name": "200",
      "series": [
        {
          "name": "success",
          "value": 22,
        },
        {
          "name": "failuer",
          "value": 48
        }
      ]
    },
     {
      "name": "100",
      "series": [
        {
          "name": "success",
          "value": 25
        },
        {
          "name": "failuer",
          "value": 8
        }
      ]
    }
  ];

  view: any[] = [300, 150];

  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  trimXAxisTicks:boolean=true;
  trimYAxisTicks:boolean=true;
  maxXAxisTickLength:number=16;
  maxYAxisTickLength:number=16;
  xAxis:boolean=true;
  // xScaleMax:number=80;
  // autoScale:boolean=true;
  tooltipDisabled:boolean=false;
  xAxisTicks = [
    10,20,30,40,50,60,70,80
    ]
  colorScheme = {
    domain: ['#5AA454', 'red',]
  };
  // public barChartType:any = 'horizontalBar';
  // public barChartLegend = true;

  // public barChartData:any[] = [
    // { data: [1, 2, 3], label: 'Approved', stack: 'a' },
    // { data: [1, 2, 3], label: 'Accepted', stack: 'a' },
    // { data: [1, 2, 3], label: 'Open', stack: 'a' },
    // { data: [1, 9, 3], label: 'In Progress', stack: 'a' },
  // ];
  // public barChartLabels: string[] = ['P', 'R', 'B'];
  value: number = 20;
  trackValue: number = 60;
  options: Options = {
    floor: 0,
    ceil: 100,
     translate: (value: number): string => `${value}%`,
    //  step: 50,
     hideLimitLabels: true,
    //  hidePointerLabels: true,
    //  showSelectionBarFromValue: -10
    }

    zoomValue:number=120;
    zoomOptions: Options = {
      floor: 100,
      ceil: 200,
       translate: (value: number): string => `${value}%`,
       hideLimitLabels: true,
      }
  
  constructor() { }

  ngOnInit() {
    this.pursuitGauge();
    this.trackGauge();
    // this.test()
  }

  onclick(){
    
  }
 
  pursuitGauge() {
    var self = this;
   var gauge = function (container, configuration) {
   
     var config = {
       size: 710,
       size1:300,
       arcInset: 150,
       arcWidth: 60,
       clipWidth: 150,
       clipHeight: 90,
       ringInset: 20,
       ringWidth: 20,
       labelFont: "Helvetica",
       labelFontSize: 25,

       pointerWidth: 10,
       pointerTailLength: 8,
       pointerHeadLengthPercent: 0.7,

       minValue: 0,
       translate: (minValue: number): string => `${minValue}%`,
       maxValue: 100,


       minAngle: -90,
       maxAngle: 90,

       transitionMs: 750,

       majorTicks: 1,
       labelFormat: d3.format('d'),
       labelInset:10,


       arcColorFn: d3.interpolateHsl(d3.rgb('#e07809'))
     };
     var range = undefined;
     var r = undefined;
     var pointerHeadLength = undefined;
     var value = 0;

     var svg = undefined;
     var arc = undefined;
     var scale = undefined;
     var ticks = undefined;
     var tickData = undefined;
     var pointer = undefined;
     var oR = config.size1 - config.arcInset;
     var iR = config.size1 - oR - config.arcWidth;
     var donut = d3.pie();

     function deg2rad(deg) {
       return deg * Math.PI / 180;
     }

     function configure(configuration) {
       var prop = undefined;
       for (prop in configuration) {
         config[prop] = configuration[prop];
       }

       range = config.maxAngle - config.minAngle;
       r = config.size / 2;
       pointerHeadLength = Math.round(r * config.pointerHeadLengthPercent);

       // a linear scale this.gaugemap maps domain values to a percent from 0..1
       scale = d3.scaleLinear()
         .range([0, 1])
         .domain([config.minValue, config.maxValue]);

       ticks = scale.ticks(config.majorTicks);
       tickData = d3.range(config.majorTicks).map(function () { return 1 / config.majorTicks; });

       arc = d3.arc()
         .innerRadius(r - config.ringWidth - config.ringInset)
         .outerRadius(r - config.ringInset)
         .startAngle(function (d, i) {
           var ratio = d * i;
           return deg2rad(config.minAngle + (ratio * range));
         })
         .endAngle(function (d, i) {
           var ratio = d * (i + 1);
           return deg2rad(config.minAngle + (ratio * range));
         });
     }
     self.gaugemap.configure = configure;

     function centerTranslation() {
       return 'translate(' + r + ',' + r + ')';
     }

     function isRendered() {
       return (svg !== undefined);
     }
     self.gaugemap.isRendered = isRendered;

     function render(newValue) {
       svg = d3.select(container)
         .append('svg:svg')
         .attr('class', 'gauge')
         .attr('width', config.clipWidth)
         .attr('height', config.clipHeight);

       var centerTx = centerTranslation();

       var arcs = svg.append('g')
         .attr('class', 'arc')
         .attr('transform', centerTx);

       arcs.selectAll('path')
         .data(tickData)
         .enter().append('path')
         .attr('fill', function (d, i) {
           return config.arcColorFn(d * i);
         })
         .attr('d', arc);

          // Display Max value
         var max = svg.append("text")
         .attr("transform", "translate(" + (iR + ((oR - iR) / 2)) + ",90)") // Set between inner and outer Radius
         .attr("text-anchor", "middle")
         .style("font-size", 13)
         .text(config.labelFormat(config.maxValue) + "%")
   
       // Display Min value
       var min = svg.append("text")
         .attr("transform", "translate(" + 30 + ",90)") // Set between inner and outer Radius
         .attr("text-anchor", "middle")
         .style("font-size", 13)
        //  .style("font-family", config.labelFont)
        .text(config.labelFormat(config.minValue) + "%")

      //  var lg = svg.append('g')
      //    .attr('class', 'label')
      //    .attr('transform',centerTx);
        // lg.selectAll('text')
        //  .data(ticks)
        //  .enter().append('text')
        //  .attr('transform',centerTx)
        //  .attr('transform', function (d) {
        //    var ratio = scale(d);
        //    var angle=360;
        //    var newAngle = config.minAngle + (ratio * range) ;
        //    return 'rotate(' + newAngle + ') translate(0' + (config.labelInset - r) + ')'
           
        //  })
        // .text(config.labelFormat)

       var lineData = [[config.pointerWidth / 2, 0],
       [0, -pointerHeadLength],
       [-(config.pointerWidth / 2), 0],
       [0, config.pointerTailLength],
       [config.pointerWidth / 2, 0]];
       var pointerLine = d3.line().curve(d3.curveLinear)
       var pg = svg.append('g').data([lineData])
         .attr('class', 'pointer')
         .attr('transform', centerTx);

       pointer = pg.append('path')
         .attr('d', pointerLine/*function(d) { return pointerLine(d) +'Z';}*/)
         .attr('transform', 'rotate(' + config.minAngle + ')');

       update(newValue === undefined ? 0 : newValue);
     }
     self.gaugemap.render = render;
     function update(newValue, newConfiguration?) {
       if (newConfiguration !== undefined) {
         configure(newConfiguration);
       }
       var ratio = scale(newValue);
       var newAngle = config.minAngle + (ratio * range);
       pointer.transition()
         .duration(config.transitionMs)
         .ease(d3.easeElastic)
         .attr('transform', 'rotate(' + newAngle + ')');
     }
     self.gaugemap.update = update;

     configure(configuration);

     return self.gaugemap;
   };

   var powerGauge = gauge('#power-gauge', {
     size: 150,
     clipWidth: 138,
     clipHeight: 90,
     ringWidth: 20,
     maxValue: 100,
     translate: (maxValue: number): string => `${maxValue}%`,
     transitionMs: 4000,
   });
   powerGauge.render(this.value);

 

//  var powerGauge = gauge('#powerauge', {
//   size: 150,
//   clipWidth: 300,
//   clipHeight: 300,
//   ringWidth: 20,
//   maxValue: 100,
//   translate: (maxValue: number): string => `${maxValue}%`,
//   transitionMs: 4000,
//   arcColorFn: d3.interpolateHsl(d3.rgb('#0ec7c7'))
// });
// powerGauge.render(this.trackValue);

}


 trackGauge() {
      var self = this;
    var gauge = function (container, configuration) {
 
   var config = {
     size: 710,
     size1:300,
     arcInset: 150,
     arcWidth: 60,
     clipWidth: 150,
     clipHeight: 90,
     ringInset: 20,
     ringWidth: 20,

     pointerWidth: 10,
     pointerTailLength: 8,
     pointerHeadLengthPercent: 0.7,

     minValue: 0,
     translate: (minValue: number): string => `${minValue}%`,
     maxValue: 100,
     minAngle: -90,
     maxAngle: 90,

     transitionMs: 750,

     majorTicks: 1,
     labelFormat: d3.format('d'),
     labelInset: 10,

     arcColorFn: d3.interpolateHsl(d3.rgb('#0ec7c7'))
   };
   var range = undefined;
   var r = undefined;
   var pointerHeadLength = undefined;
   var value = 0;

   var svg = undefined;
   var arc = undefined;
   var scale = undefined;
   var ticks = undefined;
   var tickData = undefined;
   var pointer = undefined;
   var oR = config.size1 - config.arcInset;
   var iR = config.size1 - oR - config.arcWidth;
   var donut = d3.pie();

   function deg2rad(deg) {
     return deg * Math.PI / 180;
   }

   // function newAngle(d) {
   //   var ratio = scale(d);
   //   var newAngle = config.minAngle + (ratio * range);
   //   return newAngle;
   // }

   function configure(configuration) {
     var prop = undefined;
     for (prop in configuration) {
       config[prop] = configuration[prop];
     }

     range = config.maxAngle - config.minAngle;
     r = config.size / 2;
     pointerHeadLength = Math.round(r * config.pointerHeadLengthPercent);

     // a linear scale this.gaugemap maps domain values to a percent from 0..1
     scale = d3.scaleLinear()
       .range([0, 1])
       .domain([config.minValue, config.maxValue]);

     ticks = scale.ticks(config.majorTicks);
     tickData = d3.range(config.majorTicks).map(function () { return 1 / config.majorTicks; });

     arc = d3.arc()
       .innerRadius(r - config.ringWidth - config.ringInset)
       .outerRadius(r - config.ringInset)
       .startAngle(function (d, i) {
         var ratio = d * i;
         return deg2rad(config.minAngle + (ratio * range));
       })
       .endAngle(function (d, i) {
         var ratio = d * (i + 1);
         return deg2rad(config.minAngle + (ratio * range));
       });
   }
   self.gaugemap.configure = configure;

   function centerTranslation() {
     return 'translate(' + r + ',' + r + ')';
   }

   function isRendered() {
     return (svg !== undefined);
   }
   self.gaugemap.isRendered = isRendered;

   function render(newValue) {
     svg = d3.select(container)
       .append('svg:svg')
       .attr('class', 'gauge')
       .attr('width', config.clipWidth)
       .attr('height', config.clipHeight);

     var centerTx = centerTranslation();

     var arcs = svg.append('g')
       .attr('class', 'arc')
       .attr('transform', centerTx);

     arcs.selectAll('path')
       .data(tickData)
       .enter().append('path')
       .attr('fill', function (d, i) {
         return config.arcColorFn(d * i);
       })
       .attr('d', arc);

    // Display Max value
    var max = svg.append("text")
    .attr("transform", "translate(" + (iR + ((oR - iR) / 2)) + ",90)") // Set between inner and outer Radius
    .attr("text-anchor", "middle")
    .style("font-size", 13)
    .text(config.labelFormat(config.maxValue) +"%")

    // Display Min value
    var min = svg.append("text")
    .attr("transform", "translate(" + 30 + ",90)") // Set between inner and outer Radius
    .attr("text-anchor", "middle")
    .style("font-size", 13)
    //  .style("font-family", config.labelFont)
    .text(config.labelFormat(config.minValue) +"%")

     var lineData = [[config.pointerWidth / 2, 0],
     [0, -pointerHeadLength],
     [-(config.pointerWidth / 2), 0],
     [0, config.pointerTailLength],
     [config.pointerWidth / 2, 0]];
     var pointerLine = d3.line().curve(d3.curveLinear)
     var pg = svg.append('g').data([lineData])
       .attr('class', 'pointer')
       .attr('transform', centerTx);

     pointer = pg.append('path')
       .attr('d', pointerLine/*function(d) { return pointerLine(d) +'Z';}*/)
       .attr('transform', 'rotate(' + config.minAngle + ')');

     update(newValue === undefined ? 0 : newValue);
   }
   self.gaugemap.render = render;
   function update(newValue, newConfiguration?) {
     if (newConfiguration !== undefined) {
       configure(newConfiguration);
     }
     var ratio = scale(newValue);
     var newAngle = config.minAngle + (ratio * range);
     pointer.transition()
       .duration(config.transitionMs)
       .ease(d3.easeElastic)
       .attr('transform', 'rotate(' + newAngle + ')');
   }
   self.gaugemap.update = update;

   configure(configuration);

   return self.gaugemap;
 };

 var powerauge = gauge('#powerauge', {
  size: 150,
  clipWidth: 150,
  clipHeight: 90,
  ringWidth: 20,
  // maxValue: 100,
  translate: (maxValue: number): string => `${maxValue}%`,
  transitionMs: 4000,
});
powerauge.render(this.trackValue);

}

test2(){
  this.trackValue=this.trackValue
  // this.trackGauge();
  

}


}
