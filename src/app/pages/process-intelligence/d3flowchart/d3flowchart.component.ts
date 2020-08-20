import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Input,EventEmitter, Output } from '@angular/core';
import * as dagreD3 from 'dagre-d3';
import * as d3 from 'd3';
declare var $: any;
import html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';

@Component({
  selector: 'app-d3flowchart',
  templateUrl: './d3flowchart.component.html',
  styleUrls: ['./d3flowchart.component.css']
})
export class D3flowchartComponent {
    title = 'PIwithD3';
    isPlayAnimation: boolean = false;
    @Input()  public model1:any=[] ;
    @Input()  public model2:any=[] ; 
    @Input()  public isplay:boolean;
    @Input()  public isdownloadpdf:boolean;
    @Input()  public isdownloadPng:boolean;
    @Input()  public isdownloadJpeg:boolean;
    @Output() ispdf=new EventEmitter<boolean>()
    @Output() isjpeg=new EventEmitter<boolean>()
    @Output() ispng=new EventEmitter<boolean>()

  
//     model2=[{from:"Start",  to:"Enter in SAP",text: 51,toolData: ["Absolute Frequency","Case Frequency","Max Repititons","Start Frequency", "End Frequency","Total Duration","Median Duration","Mean Duration","Max Duration","Min Duration"],toolDataCount:[51, 50, 2, 0, 0, 2780760000, 63780000, 54524705, 89700000, 3180000]},
//   {from:"Vendor Creates Invoice", to:"Due Date Passed",text: 145,toolData: ["Absolute Frequency","Case Frequency","Max Repititons","Start Frequency", "End Frequency","Total Duration","Median Duration","Mean Duration","Max Duration","Min Duration"],toolDataCount:[145, 145, 1, 0, 0, 6418980000, 40560000, 44268827, 88140000, 840000]},
//   {from:"Vendor Creates Invoice", to:"Scan Invoice",text:193,toolData: ["Absolute Frequency","Case Frequency","Max Repititons","Start Frequency", "End Frequency","Total Duration","Median Duration","Mean Duration","Max Duration","Min Duration"],toolDataCount:[194, 193, 2, 0, 0, 70398420000, 20070000, 362878453, 5962500000, 180000]},
//   {from:"Start",to:"Vendor Creates Invoice",text:194,toolData: ["Absolute Frequency","Case Frequency","Max Repititons","Start Frequency", "End Frequency","Total Duration","Median Duration","Mean Duration","Max Duration","Min Duration"],toolDataCount:[2, 2, 1, 0, 0, 620640000, 310320000, 310320000, 310320000, 310320000]},
//   {from:"Scan Invoice", to:"Enter in SAP",text: 51,toolData: ["Absolute Frequency","Case Frequency","Max Repititons","Start Frequency", "End Frequency","Total Duration","Median Duration","Mean Duration","Max Duration","Min Duration"],toolDataCount:[20, 20, 1, 0, 0, 5959020000, 73560000, 297951000, 3262920000, 2520000]},
//   {from:"Scan Invoice",  to:"Change Baseline Date",text: 2,toolData: ["Absolute Frequency","Case Frequency","Max Repititons","Start Frequency", "End Frequency","Total Duration","Median Duration","Mean Duration","Max Duration","Min Duration"],toolDataCount:[176, 175, 2, 0, 0, 34604100000, 48780000, 196614204, 6687300000, 240000]},
//   {from:"Enter in SAP", to:"Clear Invoice",text: 20,toolData: ["Absolute Frequency","Case Frequency","Max Repititons","Start Frequency", "End Frequency","Total Duration","Median Duration","Mean Duration","Max Duration","Min Duration"],toolDataCount:[106, 105, 2, 0, 0, 7692360000, 3660000, 72569433, 1628820000, 360000]},
//   {from:"Enter in SAP",  to:"Book Invoice",text:176,toolData: ["Absolute Frequency","Case Frequency","Max Repititons","Start Frequency", "End Frequency","Total Duration","Median Duration","Mean Duration","Max Duration","Min Duration"],toolDataCount:[145, 145, 1, 0, 0, 6418980000, 40560000, 44268827, 88140000, 840000]},
//   {from:"Book Invoice", to:"Clear Invoice",text:2,toolData: ["Absolute Frequency","Case Frequency","Max Repititons","Start Frequency", "End Frequency","Total Duration","Median Duration","Mean Duration","Max Duration","Min Duration"],toolDataCount:[145, 145, 1, 0, 0, 6418980000, 40560000, 44268827, 88140000, 840000]},
//   {from:"Book Invoice",to:"Change Baseline Date",text: 106,toolData: ["Absolute Frequency","Case Frequency","Max Repititons","Start Frequency", "End Frequency","Total Duration","Median Duration","Mean Duration","Max Duration","Min Duration"],toolDataCount:[145, 145, 1, 0, 0, 6418980000, 40560000, 44268827, 88140000, 840000]},
//   {from:"Book Invoice",  to:"Cancel Invoice Receipt",text: 53,toolData: ["Absolute Frequency","Case Frequency","Max Repititons","Start Frequency", "End Frequency","Total Duration","Median Duration","Mean Duration","Max Duration","Min Duration"],toolDataCount:[145, 145, 1, 0, 0, 6418980000, 40560000, 44268827, 88140000, 840000]},
//   {from:"Book Invoice", to:"Vendor Creates Invoice",text: 15,toolData: ["Absolute Frequency","Case Frequency","Max Repititons","Start Frequency", "End Frequency","Total Duration","Median Duration","Mean Duration","Max Duration","Min Duration"],toolDataCount:[145, 145, 1, 0, 0, 6418980000, 40560000, 44268827, 88140000, 840000]},
//   {from:"Book Invoice", to:"End",text: 2,toolData: ["Absolute Frequency","Case Frequency","Max Repititons","Start Frequency", "End Frequency","Total Duration","Median Duration","Mean Duration","Max Duration","Min Duration"],toolDataCount:[145, 145, 1, 0, 0, 6418980000, 40560000, 44268827, 88140000, 840000]},
//   {from:"Clear Invoice", to:"Vendor Creates Invoice",text: 20,toolData: ["Absolute Frequency","Case Frequency","Max Repititons","Start Frequency", "End Frequency","Total Duration","Median Duration","Mean Duration","Max Duration","Min Duration"],toolDataCount:[145, 145, 1, 0, 0, 6418980000, 40560000, 44268827, 88140000, 840000]},
//   {from:"Clear Invoice", to:"Due Date Passed",text: 1,toolData: ["Absolute Frequency","Case Frequency","Max Repititons","Start Frequency", "End Frequency","Total Duration","Median Duration","Mean Duration","Max Duration","Min Duration"],toolDataCount:[145, 145, 1, 0, 0, 6418980000, 40560000, 44268827, 88140000, 840000]},
//   {from:"Clear Invoice", to:"End",text: 130,toolData: ["Absolute Frequency","Case Frequency","Max Repititons","Start Frequency", "End Frequency","Total Duration","Median Duration","Mean Duration","Max Duration","Min Duration"],toolDataCount:[145, 145, 1, 0, 0, 6418980000, 40560000, 44268827, 88140000, 840000]},
//   {from:"Due Date Passed", to:"Scan Invoice",text: 51,toolData: ["Absolute Frequency","Case Frequency","Max Repititons","Start Frequency", "End Frequency","Total Duration","Median Duration","Mean Duration","Max Duration","Min Duration"],toolDataCount:[145, 145, 1, 0, 0, 6418980000, 40560000, 44268827, 88140000, 840000]},
//   {from:"Due Date Passed", to:"Book Invoice",text: 55,toolData: ["Absolute Frequency","Case Frequency","Max Repititons","Start Frequency", "End Frequency","Total Duration","Median Duration","Mean Duration","Max Duration","Min Duration"],toolDataCount:[145, 145, 1, 0, 0, 6418980000, 40560000, 44268827, 88140000, 840000]},
//   {from:"Due Date Passed", to:"End",text: 110,toolData: ["Absolute Frequency","Case Frequency","Max Repititons","Start Frequency", "End Frequency","Total Duration","Median Duration","Mean Duration","Max Duration","Min Duration"],toolDataCount:[145, 145, 1, 0, 0, 6418980000, 40560000, 44268827, 88140000, 840000]},
//   {from:"Change Baseline Date",to:"Clear Invoice",text: 2,toolData: ["Absolute Frequency","Case Frequency","Max Repititons","Start Frequency", "End Frequency","Total Duration","Median Duration","Mean Duration","Max Duration","Min Duration"],toolDataCount:[145, 145, 1, 0, 0, 6418980000, 40560000, 44268827, 88140000, 840000]},
//   {from:"Cancel Invoice Receipt", to:"End",text: 21,toolData: ["Absolute Frequency","Case Frequency","Max Repititons","Start Frequency", "End Frequency","Total Duration","Median Duration","Mean Duration","Max Duration","Min Duration"],toolDataCount:[145, 145, 1, 0, 0, 6418980000, 40560000, 44268827, 88140000, 840000]},
//   ]
  
//   model1= [
//     {"key": -1, "category": "Start", "count": 80 },
//     {"key":0,"name":"Vendor Creates Invoice","count":80,"tool":["Absolute Frequency","Case Frequency","Max Repititons","Start Frequency","End Frequency","Total Duration","Median Duration","Mean Duration","Max Duration","Min Duration"],"toolCount":[196,195,2,193,0,372120000,2040000,1898571,3360000,360000]},
//     {"key":1,"name":"Scan Invoice","count":80,"tool":["Absolute Frequency","Case Frequency","Max Repititons","Start Frequency","End Frequency","Total Duration","Median Duration","Mean Duration","Max Duration","Min Duration"],"toolCount":[196,195,2,0,0,192060000,420000,979897,7500000,60000]},
//     {"key":2,"name":"Enter in SAP","count":80,"tool":["Absolute Frequency","Case Frequency","Max Repititons","Start Frequency","End Frequency","Total Duration","Median Duration","Mean Duration","Max Duration","Min Duration"],"toolCount":[196,195,2,2,0,147960000,420000,754897,2700000,60000]},
//     {"key":3,"name":"Book Invoice","count":80,"tool":["Absolute Frequency","Case Frequency","Max Repititons","Start Frequency","End Frequency","Total Duration","Median Duration","Mean Duration","Max Duration","Min Duration"],"toolCount":[196,195,2,0,20,386100000,840000,1969897,21420000,120000]},
//     {"key":4,"name":"Clear Invoice","count":80,"tool":["Absolute Frequency","Case Frequency","Max Repititons","Start Frequency","End Frequency","Total Duration","Median Duration","Mean Duration","Max Duration","Min Duration"],"toolCount":[181,180,2,0,50,688740000,1140000,3805193,21120000,0]},
//     {"key":5,"name":"Due Date Passed","count":80,"tool":["Absolute Frequency","Case Frequency","Max Repititons","Start Frequency","End Frequency","Total Duration","Median Duration","Mean Duration","Max Duration","Min Duration"],"toolCount":[181,180,2,0,110,263100000,1020000,1453591,20220000,240000]},
//     {"key":6,"name":"Change Baseline Date","count":80,"tool":["Absolute Frequency","Case Frequency","Max Repititons","Start Frequency","End Frequency","Total Duration","Median Duration","Mean Duration","Max Duration","Min Duration"],"toolCount":[55,55,1,0,0,211380000,1440000,3843272,17820000,60000]},
//     {"key":7,"name":"Cancel Invoice Receipt","count":80,"tool":["Absolute Frequency","Case Frequency","Max Repititons","Start Frequency","End Frequency","Total Duration","Median Duration","Mean Duration","Max Duration","Min Duration"],"toolCount":[15,15,1,0,15,36060000,960000,2404000,15900000,300000]}, 
//     { "key": -2, "category": "End", "count": 80 }] 
      
  
    constructor(){
  
    }
  
    @ViewChild('exportSVGtoPDF', {static: false}) exportSVGtoPDF: ElementRef;
    @ViewChild('canvas',{static: false}) canvas: ElementRef;
    @ViewChild('downloadLink',{static: false}) downloadLink: ElementRef;
    @ViewChild('render',{static: false}) render: ElementRef;
    ngOnInit(){
        this. processGraph();
    }



    ngOnChanges(){
        console.log(this.model1);
        console.log(this.model2);
        
        this. processGraph();
            this.onPlayProcees();
            if(this.isdownloadpdf==true){
                this.exportSVG('pdf')
            }else if(this.isdownloadPng==true){
                this.exportSVG('png')
            }else if(this.isdownloadJpeg==true){
                this.exportSVG('jpeg')
            }
    }

    processGraph(){
        // Create a new directed graph
    var g = new dagreD3.graphlib.Graph().setGraph({});
    // console.log(g);
    var states:any={}
    for(var j=0;j<this.model1.length;j++){
      if(this.model1[j].key==-1||this.model1[j].key==-2){
        var nodeName=this.model1[j].category
        states[nodeName]={
          description: "represents no connection state at all.",style: "fill: #f77"}
      }else{
        var performanceCount1=this.timeConversion(this.model1[j].toolCount[5])
        var performanceCount2=this.timeConversion(this.model1[j].toolCount[6])
        var performanceCount3=this.timeConversion(this.model1[j].toolCount[7])
        var performanceCount4=this.timeConversion(this.model1[j].toolCount[8])
        var performanceCount5=this.timeConversion(this.model1[j].toolCount[9])
    
        var nodeName=this.model1[j].name
        states[nodeName]={
          description: "<p>Frequency</p><ul><li><div>Absolute Frequency</div><div>"+this.model1[j].toolCount[0]+"</div></li><li><div>Case Frequency</div><div>"+this.model1[j].toolCount[1]+"</div></li><li><div>Max Repititions</div><div>"+this.model1[j].toolCount[2]+"</div></li><li><div>Start Frequency</div><div>"+this.model1[j].toolCount[3]+"</div></li><li><div>End Frequency</div><div>"+this.model1[j].toolCount[4]+"</div></li></ul><p>Performance </p><ul><li><div>Total Duration</div><div>"+performanceCount1+"</div></li><li><div>Median Duration</div><div>"+performanceCount2+"</div></li><li><div>Mean Duration </div><div>"+performanceCount3+"</div></li><li><div>Max Duration </div><div>"+performanceCount4+"</div></li><li><div>Min Duration </div><div>"+performanceCount5+"Min</div></li></ul>",
        metrics: this.model1[j].count
        }
      }
    }
    // Automatically label each of the nodes
    
    Object.keys(states).forEach(function(state) {
      var value = states[state];
      let metricValue="";
      if(value.metrics!=undefined){
        metricValue+='\n\t\t\t\t\t\t\t\t\t\t\t\t'+value.metrics;
        
      }
      
      value.label = state+metricValue;
    //   console.log(state);
      value.rx = value.ry = 10;
      value.lableStyle = "font-zie: 4em";
      g.setNode(state, value);
     
    });
    
    // Set up the edges
    
    for(var i=0; i<this.model2.length;i++){
      if(this.model2[i].from=="Start"||this.model2[i].to=="End"){
        var linkTooltip = "<p>"+this.model2[i].from+"-"+this.model2[i].to+"</p><p>Frequency</p><ul><li><div>Absolute Frequency</div><div>"+this.model2[i].toolDataCount[0]+"</div></li><li><div>Case Frequency</div><div>"+this.model2[i].toolDataCount[1]+"</div></li><li><div>Max Repititions</div><div>"+this.model2[i].toolDataCount[2]+"</div></li><li><div>Start Frequency</div><div>"+this.model2[i].toolDataCount[3]+"</div></li><li><div>End Frequency</div><div>"+this.model2[i].toolDataCount[4]+"</div></li></ul>";

        g.setEdge(this.model2[i].from,  this.model2[i].to,{ label: "<span onmouseover='(function(){ return $(\"#tooltip_template\").css(\"visibility\", \"visible\"); })()' onmouseout='(function(){ return $(\"#tooltip_template\").css(\"visibility\", \"hidden\"); })()'  onmousemove='(function(){ $(\"#tooltip_template\").html(\"<span>"+linkTooltip+"</span>\").css(\"top\", (event.pageY-10)+\"px\").css(\"left\",(event.pageX+10)+\"px\"); })()'>"+this.model2[i].text+"</span>", labelType: "html", style: "stroke: #333; stroke-width: 5px; stroke-dasharray: 5, 5;",
        arrowheadStyle: "fill: #333", curve: d3.curveBasis})
      }else{
        var performanceLinkCount1=this.timeConversion(this.model2[i].toolDataCount[5])
        var performanceLinkCount2=this.timeConversion(this.model2[i].toolDataCount[6])
        var performanceLinkCount3=this.timeConversion(this.model2[i].toolDataCount[7])
        var performanceLinkCount4=this.timeConversion(this.model2[i].toolDataCount[8])
        var performanceLinkCount5=this.timeConversion(this.model2[i].toolDataCount[9])
      
        var linkTooltip = "<p>"+this.model2[i].from+"-"+this.model2[i].to+"</p><p>Frequency</p><ul><li><div>Absolute Frequency</div><div>"+this.model2[i].toolDataCount[0]+"</div></li><li><div>Case Frequency</div><div>"+this.model2[i].toolDataCount[1]+"</div></li><li><div>Max Repititions</div><div>"+this.model2[i].toolDataCount[2]+"</div></li><li><div>Start Frequency</div><div>"+this.model2[i].toolDataCount[3]+"</div></li><li><div>End Frequency</div><div>"+this.model2[i].toolDataCount[4]+"</div></li></ul><p>Performance </p><ul><li><div>Total Duration</div><div>"+performanceLinkCount1+"</div></li><li><div>Median Duration</div><div>"+performanceLinkCount2+"</div></li><li><div>Mean Duration </div><div>"+performanceLinkCount3+"</div></li><li><div>Max Duration </div><div>"+performanceLinkCount4+"</div></li><li><div>Min Duration </div><div>"+performanceLinkCount5+"Min</div></li></ul>";
        g.setEdge(this.model2[i].from,  this.model2[i].to,{ label: "<span onmouseover='(function(){ return $(\"#tooltip_template\").css(\"visibility\", \"visible\"); })()' onmouseout='(function(){ return $(\"#tooltip_template\").css(\"visibility\", \"hidden\"); })()' onmousemove='(function(){ $(\"#tooltip_template\").html(\"<span>"+linkTooltip+"</span>\").css(\"top\", (event.pageY-10)+\"px\").css(\"left\",(event.pageX+10)+\"px\"); })()'>"+this.model2[i].text+"</span>",  labelType: "html", style: "stroke: #121112; stroke-width: 4px; transform: translate(23px,1px); fill: none;", 
        arrowheadStyle: "fill: #333", curve: d3.curveBasis})
      }
      
    }
    
    
    
    // Set some general styles
let nodesArray= [];
g.nodes().forEach(function(v) {
  
  var node = g.node(v);
  console.log(node);
 
  if(node.label == 'Start' || node.label == 'End'){
    node.shape = "circle";
    
  }
  
 else{
  nodesArray.push(node)
  console.log(node.label)
 }
 
  node.rx = node.ry = 5;
  node.x = node.y = 100;
});
const max = nodesArray.reduce(function(prev, current) {
  return (prev.metrics > current.metrics) ? prev : current
})

let maxDivided = max.metrics/5;
console.log(max.metrics);
for(var i =0;i<nodesArray.length;i++){


  if (nodesArray[i].metrics <= maxDivided) {
    console.log("1111111111111",maxDivided <= nodesArray[i].metrics);
    var eachLine = nodesArray[i].label.split('\n')[0];
    console.log(nodesArray[i].metrics);
        g.node(eachLine).style = "fill: #b7aace";
  }
  else if (nodesArray[i].metrics > maxDivided && nodesArray[i].metrics <= Number(maxDivided*2)) {
    var eachLine = nodesArray[i].label.split('\n')[0];
    console.log(nodesArray[i].metrics);
    console.log("22222222222");
        g.node(eachLine).style = "fill: #ADB9D1";
   
    
  } else if (nodesArray[i].metrics > Number(maxDivided*2) && nodesArray[i].metrics <= Number(maxDivided*3)) {
    var eachLine = nodesArray[i].label.split('\n')[0];
    console.log(nodesArray[i].metrics);
    console.log("333333333");
        g.node(eachLine).style = "fill: #5b21db" ;
    
    
  } else if (nodesArray[i].metrics > Number(maxDivided*3) && nodesArray[i].metrics <= Number(maxDivided*4)) {
    var eachLine = nodesArray[i].label.split('\n')[0];
    console.log(nodesArray[i].metrics);    
    g.node(eachLine).style = "fill: #4b1edb";
       
  }
  else if (nodesArray[i].metrics > Number(maxDivided*4) && nodesArray[i].metrics <= Number(maxDivided*5)) {
    var eachLine = nodesArray[i].label.split('\n')[0];
    console.log(nodesArray[i].metrics);   
    g.node(eachLine).style = "fill: #024C7F";
    
  } else if(nodesArray[i].metrics == max.metrics && nodesArray[i].metrics > max.metrics){
    var eachLine = nodesArray[i].label.split('\n')[0];
    console.log(nodesArray[i].metrics);   
    g.node(eachLine).style = "fill: #2d0adb";
  }


}
// Add some custom colors based on state
g.node('Start').style = "fill: #5AD315; ";
g.node('End').style = "fill: #A93226";


const w = 1100;
const h = 1600; 
const padding = 20;
d3.select("svg").remove()
// const svg = d3.select("svg")
const svg = d3.select("#exportSVGtoPDF").append("svg")

  .attr("width", w)
  .attr("height", h);
  
   var  inner = svg.append("g");
  
// Set up zoom support
var zoom = d3.zoom().on("zoom", function() {
      inner.attr("transform", d3.event.transform);
    });
svg.call(zoom);



// Create the renderer
var render = new dagreD3.render();
// Add our custom arrow (a hollow-point)
// var id1 = "arrow";
// render.arrows().normal = function normal(parent, id, edge, type) {
//   console.log(id);
//   var marker = parent.append("marker")
//     .data(['arrow'])
//     .attr("id", id)
//     .attr("viewBox", "0 0 10 10")
//     .attr("refX", 9)
//     .attr("refY", 5)
//     .attr("markerUnits", "strokeWidth")
//     .attr("markerWidth", 9)
//     .attr("markerHeight", 5)
//     .attr("orient", "auto")
//     //.attr("fill", 'red')
    

//   var path = marker.append("path")
//    .attr("d", "M 0 0 L 10 5 L 0 10 z")
//     .style("stroke-width", 1)
//     .style("stroke-dasharray", "1,0")
//      .style("fill", "#333")
//      .style("stroke", "none")
//     .attr("marker-end", "url(#arrow)");
//     console.log(path)
 

//   dagreD3.util.applyStyle(path, edge[type+" Style"]);
  
 //};



var wrap = function(text, width) {
   console.log(text);
  text.each(function (a) {
    console.log((a));
    
      var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          x = text.attr("x"),
          y = text.attr("y"),
          dy = 0, //parseFloat(text.attr("dy")),
          tspan = text.text(null)
                      .append("tspan")
                      .attr("x", 6)
                      .attr("y", y)
                      .attr("dy", dy + "em");
      while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              tspan = text.append("tspan")
                          .attr("x", 6)
                          .attr("y", y)
                          .attr("dy", ++lineNumber * lineHeight + dy + "em")
                          .text(word);
          }
      }
  });
}





// Simple function to style the tooltip for the given node.
var styleTooltip = function(name, description) {
  return "<p class='name'>" + name + "</p>" + description;

};

var tooltip = d3.select("body")
	.append("div")
  .attr('id', 'tooltip_template').attr('class', 'tooltip-panel')
	.style("position", "absolute")
  .style("background-color", "#fff")
  .style("color", "#0162cb")
  .style("font-size", "10.5px")
  .style("font-weight", "bold")
  .style("border", "solid #333")
  .style("border-width", "2px")
  .style("border-radius", "5px")  
  
  .style("text-align", "left")
	.style("z-index", "10")
	.style("visibility", "hidden")
  .text("Simple Tooltip...");
render(inner, g);
inner.selectAll("g.node")
  .attr("title", function(v) { return styleTooltip(v, g.node(v).description) })
  .each(function(v) { $(this).tipsy({ gravity: "w", opacity: 1, html: true }); });
inner.selectAll('g.node')
.enter().append("text")
    .attr("class", "node")
    .attr("x", function (d) { return d.parent.px; })
    .attr("y", function (d) { return d.parent.py; })
    .text(function(d) {return d.name })
    .call(wrap, 30)

.on("mousemove", function(){ 
 tooltip.text(this.dataset.description)   
 
})
.on("mouseout", function(){return tooltip.style("visibility", "hidden");});

// console.log(inner.selectAll('g.edgePath'));
// inner.selectAll('g.edgePath')
// console.log(inner.selectAll('g.edgePath'));
inner.selectAll('g.edgePath')
.on('mouseover', function(d){
  console.log('edgepath', d)
  inner.selectAll('g.edgePath').append('title').text(d.v+" - "+d.w+'\n'+

"Frequency"+'\n'+
"Absolute Frequency 196"+'\n'+
"Case Frequency     195"+'\n'+
"Max Repititions    2"+'\n'+
"Start Frequency    193"+'\n'+
"End Frequency      0")
})

// Center the graph
var initialScale = 0.90;
svg.call(zoom.transform, d3.zoomIdentity.translate((svg.attr("width") - g.graph().width * initialScale) / 2, 53).scale(initialScale));

svg.attr('height', g.graph().height * initialScale + 53);
    }
    
    
    exportSVG(fileType){
      html2canvas(this.exportSVGtoPDF.nativeElement, { useCORS: true, foreignObjectRendering: true, allowTaint: true }).then(canvas => {
        console.log('canvas.height',canvas.height)
        console.log('canvas.height',canvas.width)
       
        var margin = 10;
        var imgWidth = 210 - 2*margin; 
        var pageHeight = 295;  
        var imgHeight = canvas.height * imgWidth / canvas.width;
        var position = 10;
     
        if(fileType == 'png' || fileType == 'jpeg'){
          this.downloadLink.nativeElement.href = canvas.toDataURL('image/'+fileType);
          this.downloadLink.nativeElement.download = 'marble-diagram.'+fileType;
          this.downloadLink.nativeElement.click();

          this.isdownloadJpeg=false;
            this.isjpeg.emit(this.isdownloadJpeg)
            this.isdownloadPng=false;
            this.ispng.emit(this.isdownloadPng)
          
        }
        if(fileType == 'pdf'){
          var contentDataURL = canvas.toDataURL("image/png");
          var doc = new jsPDF('l','pt',[1020, 768]);
          doc.setFontSize(18)
          doc.addImage(contentDataURL, 'PNG',10, 10, 1020, 500);
          doc.save('postres.pdf');
          this.isdownloadpdf=false;
            this.ispdf.emit(this.isdownloadpdf)
        }   
      });
      
    }
  
    
    onPlayProcees(){
    //   this.isPlayAnimation = !this.isPlayAnimation;
      if(this.isplay==true){
        var s = d3.select('svg').selectAll('g.edgePath path.path').classed('animationFlow', true)
      }else{
        var s = d3.select('svg').selectAll('g.edgePath path.path').attr('class', 'path');     
      }
    }
  
    timeConversion(millisec) {
      var seconds:any = (millisec / 1000).toFixed(1);
      var minutes:any = (millisec / (1000 * 60)).toFixed(1);
      var hours:any = (millisec / (1000 * 60 * 60)).toFixed(1);
      var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);
      if (seconds < 60) {
          return seconds + " Sec";
      } else if (minutes < 60) {
          return minutes + " Min";
      } else if (hours < 24) {
          return hours + " Hrs";
      } else {
          return days + " Days"
      }
    }
}
  
  