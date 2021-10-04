import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Input,EventEmitter, Output, HostListener } from '@angular/core';
import * as dagreD3 from 'dagre-d3';
import * as d3 from 'd3';
declare var $: any;
import html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';
import * as svg from 'save-svg-as-png';
// import { cursorTo } from 'readline';

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
    @Input()  public isdownloadsvg:boolean;
    @Input()  public processGraphName:any;
    @Input()  public performanceValue:boolean;
    @Input() private isSlider:boolean;
    @Output() ispdf=new EventEmitter<boolean>()
    @Output() isjpeg=new EventEmitter<boolean>()
    @Output() ispng=new EventEmitter<boolean>()
    @Output() issvg=new EventEmitter<boolean>();
    class1:any;
  class2: any;
  class3: any;
  class4: any;
  class5: string;
  class6: string;
  maxLabelValue: any;
  searchNode: any;
  isnoNode:boolean=false;
  activeCssStyle = "stroke";
  graph_height:any;
  graph_width:any;
  
    constructor(){
  
    }
  
    @ViewChild('exportSVGtoPDF', {static: false}) exportSVGtoPDF: ElementRef;
    @ViewChild('canvas',{static: false}) canvas: ElementRef;
    @ViewChild('downloadLink',{static: false}) downloadLink: ElementRef;
    @ViewChild('render',{static: false}) render: ElementRef;
    // @ViewChild("exportSVGtoPDF",{static: false}) graph_canvas:ElementRef;
    // @HostListener('document:mouseover', ['$event.target'])
    // public onmouseover(targetElement) {
    //     const hovered = this.exportSVGtoPDF.nativeElement.contains(targetElement);
    //     if (!hovered) {
    //        let element=document.getElementById("tipsy_div");
    //         if(element){
    //           element.style.display = "none";
    //           element.style.visibility = "hidden";
    //         }
    //     }else{
    //       console.log("test")
    //     }
    // }

    ngOnInit(){
        this. processGraph();
    }



    ngOnChanges(){
          this. processGraph();
        this.class1="inactive1"
        this.class2="inactive1"
        this.class3="inactive1"
        this.class4="inactive1"
        this.class5="inactive1"
        this.class6="inactive1"
            this.onPlayProcees();
            if(this.isdownloadpdf==true){
                this.exportSVG('pdf')
            }else if(this.isdownloadPng==true){
                this.exportSVG('png')
            }else if(this.isdownloadJpeg==true){
                this.exportSVG('jpeg')
            }
            else if(this.isdownloadsvg==true){
              this.exportSVG('svg')
          }
      // if (this.isSlider == true) {
      //   this.activeCssStyle = "fill";
      // } else {
      //   this.activeCssStyle = "stroke";
      // }
    }

    processGraph(){
      if(this.model2){
        if(this.model2.length>0&&this.model1.length>0){
        // Create a new directed graph
    var g = new dagreD3.graphlib.Graph().setGraph({ ranksep: 100,rankdir: "TB"});
    var me=this
    
const w = 1300;
const h = 1600;
const padding = 20;

d3.select("svg").remove()
let svg = d3.select("#exportSVGtoPDF").append("svg")
  .attr("xmlns", "http://www.w3.org/2000/svg")
  .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
  .attr("width", w)
  // .attr("height", h)
  // .attr("overflow", 'auto')
  // .attr("viewBox", '0 0 800 800')
  // .attr("preserveAspectRatio", 'none')
  .attr('id','render')
  .attr("class","pisvg")

  d3.select("svg").append("marker")
  .attr("id","arrow")
  .attr("viewBox","0 0 10 10")
  .attr("refX","8")
  .attr("refY","5")
  .attr("markerWidth","3.5")
  .attr("markerHeight","5")
  .attr("orient","auto")
  .attr("fill","black")

  d3.select("marker").append("path")
    .attr("d","M 0 0 L 10 5 L 0 10 z")
    .style("stroke-width", 1)
    // .style("stroke-dasharray", "1,0");

    d3.select("svg").append("marker")
    .attr("id","arrow1")
    .attr("class","marker1")
    .attr("viewBox","0 0 10 10")
    .attr("refX","8")
    .attr("refY","5")
    .attr("markerWidth","4")
    .attr("markerHeight","5")
    .attr("orient","auto")
    .attr("fill","#757272")
    .append("path")
    .attr("d","M 0 0 L 10 5 L 0 10 z")
    .style("stroke-width", 1)
  
      d3.select("svg").append("marker")
      .attr("id","arrow2")
      .attr("class","marker2")
      .attr("viewBox","0 0 10 10")
      .attr("refX","8")
      .attr("refY","5")
      .attr("markerWidth","4")
      .attr("markerHeight","5")
      .attr("orient","auto")
      .attr("fill","#8a8787")
      .append("path")
      .attr("d","M 0 0 L 10 5 L 0 10 z")
      .style("stroke-width", 1)

        d3.select("svg").append("marker")
        .attr("id","arrow3")
        .attr("class","marker3")
        .attr("viewBox","0 0 10 10")
        .attr("refX","8")
        .attr("refY","5")
        .attr("markerWidth","5")
        .attr("markerHeight","5")
        .attr("orient","auto")
        .attr("fill","#a8a5a5")
        .append("path")
        .attr("d","M 0 0 L 10 5 L 0 10 z")
        .style("stroke-width", 1)

        d3.select("svg").append("marker")
        .attr("id","arrow4")
        .attr("class","marker4")
        .attr("viewBox","0 0 10 10")
        .attr("refX","8")
        .attr("refY","5")
        .attr("markerWidth","5")
        .attr("markerHeight","5")
        .attr("orient","auto")
        .attr("fill","#736f6f")
        .append("path")
        .attr("d","M 0 0 L 10 5 L 0 10 z")
        .style("stroke-width", 1)
      
   var  inner = svg.append("g");
   var defs = svg.append("defs");

   var gradient = defs.append("linearGradient")
   .attr("id", "svgGradient")
   .attr("x1", "10%")
   .attr("x2", "60%")
   .attr("y1", "0%")
   .attr("y2", "100%")
   .attr("spreadMethod", "reflect")
   .attr("gradientUnits","userSpaceOnUse");
   
  gradient.append("stop")
    .attr('class', 'stop-left')
    .attr("offset", "3%")
    .attr("stop-color", "#bdbcb5")
    .attr("stop-opacity", 0.9);
 
 gradient.append("stop")
    .attr('class', 'end')
  .attr("offset", "97%")
    .attr("stop-color", "#1E1E1E")
    .attr("stop-opacity", 1.5);


//    gradient.attr("id", "performanceGradient")
//    .attr("x1", "10%")
//    .attr("x2", "60%")
//    .attr("y1", "0%")
//    .attr("y2", "100%");

//    gradient.append("stop")
//   .attr('class', 'stop-left')
//    .attr("offset", "3%")
//    .attr("stop-color", "red")
//    .attr("stop-opacity", 1);

// gradient.append("stop")
//    .attr('class', 'end')
//    .attr("offset", "100%")
//    .attr("stop-color", "blue")
//    .attr("stop-opacity", 1);

    var states:any={}
    if(this.model1){
    for(var j=0;j<this.model1.length;j++){
      if(this.model1[j].key==-1){
        var nodeName=this.model1[j].category
        states[nodeName]={
          description: "Process start",style: "fill: #f77"}
      }else if(this.model1[j].key==-2){
        var nodeName=this.model1[j].category
          states[nodeName]={
            description: "Process end",style: "fill: #f77"}
      }else{
        var performanceCount1=this.timeConversion(this.model1[j].toolCount[5])
        var performanceCount2=this.timeConversion(this.model1[j].toolCount[6])
        var performanceCount3=this.timeConversion(this.model1[j].toolCount[7])
        var performanceCount4=this.timeConversion(this.model1[j].toolCount[8])
        var performanceCount5=this.timeConversion(this.model1[j].toolCount[9])
    
        var nodeName=this.model1[j].name
        states[nodeName]={
          description: "<p class='metrics-name'>Frequency</p><ul class='left-content'><li><div>Absolute Frequency</div><div>"+this.model1[j].toolCount[0]+"</div></li><li><div>Case Frequency</div><div>"+this.model1[j].toolCount[1]+"</div></li><li><div>Max Repetition</div><div>"+this.model1[j].toolCount[2]+"</div></li><li><div>Start Frequency</div><div>"+this.model1[j].toolCount[3]+"</div></li><li><div>End Frequency</div><div>"+this.model1[j].toolCount[4]+"</div></li></ul><p class='metrics-name'>Performance </p><ul class='left-content'><li><div>Total Duration</div><div>"+performanceCount1+"</div></li><li><div>Median Duration</div><div>"+performanceCount2+"</div></li><li><div>Mean Duration </div><div>"+performanceCount3+"</div></li><li><div>Max Duration </div><div>"+performanceCount4+"</div></li><li><div>Min Duration </div><div>"+performanceCount5+"</div></li></ul>",
        metrics: this.model1[j].count
        }
      }
    }
  }
    
    // Automatically label each of the nodes
    
    Object.keys(states).forEach(function(state) {
      var value = states[state];
      let metricValue="";
      if(value.metrics!=undefined){
        metricValue+='\n'+value.metrics;
        
      }
      
    if(state == 'Start' || state == 'End'){
      value.label = state;
      value.x = 5;
    }else{
    value.label = state+metricValue;
    }
    value.rx = value.ry = 10;
    value.lableStyle = "font-zie: 4em";
    g.setNode(state, value);
   
  });
    
    // Set up the edges
var count=0
var count1
  if (this.model2) {
    for(var i2=0;i2<this.model2.length;i2++){
      if(this.model2[i2].days>=0){
        count1=count++
      }
    }
  }


    if(count1>=1){
      const maxCount = this.model2.reduce(function(prev, current) {
        return (prev.days > current.days) ? prev : current
      })
      let maxLinkCount=maxCount.days/5;
      for(var i=0; i<this.model2.length;i++){
        if(this.model2[i].from=="Start"||this.model2[i].to=="End"){
          var linkTooltip = "<p>"+this.model2[i].from+" - "+this.model2[i].to+"</p><p>Frequency</p><ul><li><div>Absolute Frequency</div><div>"+this.model2[i].toolDataCount[0]+"</div></li><li><div>Case Frequency</div><div>"+this.model2[i].toolDataCount[1]+"</div></li><li><div>Max Repetition</div><div>"+this.model2[i].toolDataCount[2]+"</div></li><li><div>Start Frequency</div><div>"+this.model2[i].toolDataCount[3]+"</div></li><li><div>End Frequency</div><div>"+this.model2[i].toolDataCount[4]+"</div></li></ul>";
              if(this.performanceValue==true){
                g.setEdge(this.model2[i].from,  this.model2[i].to,{ label: '', labelType: "html", style: "stroke: #333; stroke-width: 3px;stroke-dasharray: 5, 5;marker-end:url(#arrow);fill:none;",
                arrowheadStyle: "fill: #333", curve: d3.curveBasis,arrowhead: "normal"})
              }else{
                g.setEdge(this.model2[i].from,  this.model2[i].to,{ label: this.model2[i].text, labelType: "html", style: "stroke: #333; stroke-width: 3px; stroke-dasharray: 5, 5;marker-end:url(#arrow);fill:none;",
                arrowheadStyle: "fill: #333", curve: d3.curveBasis,arrowhead: "normal"})
              } 
        }else{
          var performanceLinkCount1=this.timeConversion(this.model2[i].toolDataCount[5])
          var performanceLinkCount2=this.timeConversion(this.model2[i].toolDataCount[6])
          var performanceLinkCount3=this.timeConversion(this.model2[i].toolDataCount[7])
          var performanceLinkCount4=this.timeConversion(this.model2[i].toolDataCount[8])
          var performanceLinkCount5=this.timeConversion(this.model2[i].toolDataCount[9])
    
          var linkTooltip = "<p>"+this.model2[i].from+"-"+this.model2[i].to+"</p><p>Frequency</p><ul><li><div>Absolute Frequency</div><div>"+this.model2[i].toolDataCount[0]+"</div></li><li><div>Case Frequency</div><div>"+this.model2[i].toolDataCount[1]+"</div></li><li><div>Max Repetition</div><div>"+this.model2[i].toolDataCount[2]+"</div></li><li><div>Start Frequency</div><div>"+this.model2[i].toolDataCount[3]+"</div></li><li><div>End Frequency</div><div>"+this.model2[i].toolDataCount[4]+"</div></li></ul><p>Performance </p><ul><li><div>Total Duration</div><div>"+performanceLinkCount1+"</div></li><li><div>Median Duration</div><div>"+performanceLinkCount2+"</div></li><li><div>Mean Duration </div><div>"+performanceLinkCount3+"</div></li><li><div>Max Duration </div><div>"+performanceLinkCount4+"</div></li><li><div>Min Duration </div><div>"+performanceLinkCount5+"</div></li></ul>";
        if(this.model2[i].text.includes('Days')){
          let v1=this.model2[i].text.split(' ')[0];
          let v3
          if(v1>=7){
            let v2=Number(v1)/7;
            if(String(v2).indexOf('.') != -1){
              let value=v2.toString().split('.')[0]+'.'+v2.toString().split('.')[1].slice(0,2)
                v3=value+" Weeks"
              }else{
                v3=v2+" Weeks"
              }
          }else{
            v3=v1+" Days"
          }
          this.model2[i].text=v3
        }
        
        if(this.model2[i].days <= maxLinkCount){
          g.setEdge(this.model2[i].from,  this.model2[i].to,{ label: this.model2[i].text,  labelType: "html", style: "stroke:#a8a5a5; stroke-width: 3px; fill: none;marker-end:url(#arrow3);", 
          arrowheadStyle: "fill: #333", curve: d3.curveBasis,arrowhead: "normal"})
         }else if(this.model2[i].days > maxLinkCount && this.model2[i].days <= maxLinkCount*2){
          g.setEdge(this.model2[i].from,  this.model2[i].to,{ label: this.model2[i].text,  labelType: "html", style: "stroke:#8a8787; stroke-width: 4.4px; fill: none;marker-end:url(#arrow2);", 
          arrowheadStyle: "fill: #333", curve: d3.curveBasis,arrowhead: "normal"})
         }else if(this.model2[i].days > maxLinkCount*2 && this.model2[i].days <= maxLinkCount*3){
          g.setEdge(this.model2[i].from,  this.model2[i].to,{ label: this.model2[i].text,  labelType: "html", style: "stroke:#757272;stroke-width: 5.5px; fill: none;marker-end:url(#arrow1);", 
          arrowheadStyle: "fill: #333", curve: d3.curveBasis,arrowhead: "normal"})
         }else if(this.model2[i].days > maxLinkCount*3 && this.model2[i].days <= maxLinkCount*4){
          g.setEdge(this.model2[i].from,  this.model2[i].to,{ label: this.model2[i].text,  labelType: "html", style: "stroke:#993736;stroke-width: 6px; fill: none;marker-end:url(#arrow);", 
          arrowheadStyle: "fill: #333", curve: d3.curveBasis,arrowhead: "normal"})
         }else if(this.model2[i].days > maxLinkCount*4 && this.model2[i].days < maxLinkCount*5){
          g.setEdge(this.model2[i].from,  this.model2[i].to,{ label: this.model2[i].text,  labelType: "html", style: "stroke:#a01010;stroke-width: 8px; fill: none;marker-end:url(#arrow);", 
          arrowheadStyle: "fill: #333", curve: d3.curveBasis,arrowhead: "normal"})
         }else if(this.model2[i].days == maxCount.days){
          g.setEdge(this.model2[i].from,  this.model2[i].to,{ label: this.model2[i].text,  labelType: "html", style: "stroke:#b1080f;stroke-width: 10px; fill: none;marker-end:url(#arrow);", 
          arrowheadStyle: "fill: #333", curve: d3.curveBasis,arrowhead: "normal"})
         }  
        }
      }
    }else{
      var linkCountArr=[]
      var linkCountArr1=[]
      if(this.model2){
    for(var i1=0;i1<this.model2.length;i1++){
      linkCountArr1.push(this.model2[i1].text)
      if(this.model2[i1].from ==="Start" || this.model2[i1].to ==="End"){  

      }else{
        linkCountArr.push(this.model2[i1].text)
      }
    }
  }
    let maxCount = linkCountArr.reduce(function(prev, current) {
      return (prev > current) ? prev : current
    })
    let maxCount2 = linkCountArr1.reduce(function(prev, current) {
      return (prev > current) ? prev : current
    })
    me.maxLabelValue=maxCount2
    let maxLinkCount=maxCount/5;
    for(var i=0; i<this.model2.length;i++){
      if(this.model2[i].from=="Start"||this.model2[i].to=="End"){
        var linkTooltip = "<p>"+this.model2[i].from+"-"+this.model2[i].to+"</p><p>Frequency</p><ul><li><div>Absolute Frequency</div><div>"+this.model2[i].toolDataCount[0]+"</div></li><li><div>Case Frequency</div><div>"+this.model2[i].toolDataCount[1]+"</div></li><li><div>Max Repetition</div><div>"+this.model2[i].toolDataCount[2]+"</div></li><li><div>Start Frequency</div><div>"+this.model2[i].toolDataCount[3]+"</div></li><li><div>End Frequency</div><div>"+this.model2[i].toolDataCount[4]+"</div></li></ul>";
        if(this.performanceValue==true){
          g.setEdge(this.model2[i].from,  this.model2[i].to,{ label: '', labelType: "html", style: "stroke: #333; stroke-width: 3px;stroke-dasharray: 5, 5;marker-end:url(#arrow);fill:none;",
           curve: d3.curveBasis,arrowhead: "normal"})
        }else{
          g.setEdge(this.model2[i].from,  this.model2[i].to,{ label: this.model2[i].text, labelType: "html", style: "stroke: #333; stroke-width: 3px; stroke-dasharray: 5, 5;marker-end:url(#arrow);fill:none;",
           curve: d3.curveBasis,arrowhead: "normal"})
        }
        
      }else{
        var performanceLinkCount1=this.timeConversion(this.model2[i].toolDataCount[5])
        var performanceLinkCount2=this.timeConversion(this.model2[i].toolDataCount[6])
        var performanceLinkCount3=this.timeConversion(this.model2[i].toolDataCount[7])
        var performanceLinkCount4=this.timeConversion(this.model2[i].toolDataCount[8])
        var performanceLinkCount5=this.timeConversion(this.model2[i].toolDataCount[9])
      
        var linkTooltip = "<p>"+this.model2[i].from+"-"+this.model2[i].to+"</p><p>Frequency</p><ul><li><div>Absolute Frequency</div><div>"+this.model2[i].toolDataCount[0]+"</div></li><li><div>Case Frequency</div><div>"+this.model2[i].toolDataCount[1]+"</div></li><li><div>Max Repetition</div><div>"+this.model2[i].toolDataCount[2]+"</div></li><li><div>Start Frequency</div><div>"+this.model2[i].toolDataCount[3]+"</div></li><li><div>End Frequency</div><div>"+this.model2[i].toolDataCount[4]+"</div></li></ul><p>Performance </p><ul><li><div>Total Duration</div><div>"+performanceLinkCount1+"</div></li><li><div>Median Duration</div><div>"+performanceLinkCount2+"</div></li><li><div>Mean Duration </div><div>"+performanceLinkCount3+"</div></li><li><div>Max Duration </div><div>"+performanceLinkCount4+"</div></li><li><div>Min Duration </div><div>"+performanceLinkCount5+"</div></li></ul>";
      if(this.model2[i].text <= maxLinkCount){
        g.setEdge(this.model2[i].from,  this.model2[i].to,{ label: this.model2[i].text,  labelType: "html",class: this.class6, style: "stroke: #a8a5a5; stroke-width: 3px;marker-end:url(#arrow3);fill:none;", 
         curve: d3.curveBasis,arrowhead: "normal"})
       }else if(this.model2[i].text > maxLinkCount && this.model2[i].text <= maxLinkCount*2){
        g.setEdge(this.model2[i].from,  this.model2[i].to,{ label: this.model2[i].text,  labelType: "html",class: this.class5, style: "stroke: #8a8787;stroke-width: 4.4px;marker-end:url(#arrow2);fill:none;", 
         curve: d3.curveBasis,arrowhead: "normal"})
       }else if(this.model2[i].text > maxLinkCount*2 && this.model2[i].text <= maxLinkCount*3){
        g.setEdge(this.model2[i].from,  this.model2[i].to,{ label: this.model2[i].text,  labelType: "html",class: this.class4 , style:"stroke:url(#svgGradient);stroke-width: 5.5px; marker-end:url(#arrow1);fill:none;", 
         curve: d3.curveBasis,arrowhead: "normal"})
       }else if(this.model2[i].text > maxLinkCount*3 && this.model2[i].text <= maxLinkCount*4){
        g.setEdge(this.model2[i].from,  this.model2[i].to,{ label: this.model2[i].text,  labelType: "html", class: this.class3,style:"stroke:url(#svgGradient);stroke-width: 6px; marker-end:url(#arrow4);fill:none;", 
         curve: d3.curveBasis,arrowhead: "normal"})
       }else if(this.model2[i].text > maxLinkCount*4 && this.model2[i].text < maxLinkCount*5){
        g.setEdge(this.model2[i].from,  this.model2[i].to,{ label: this.model2[i].text,  labelType: "html", class:this.class2, style:"stroke:url(#svgGradient);stroke-width: 8px; marker-end:url(#arrow);fill:none;", 
        curve: d3.curveBasis,arrowhead: "normal"})
       }else if(this.model2[i].text == maxCount){
        g.setEdge(this.model2[i].from,  this.model2[i].to,{ label: this.model2[i].text,  labelType: "html",class:this.class1, style:"stroke:#1E1E1E;stroke-width: 10px;marker-end:url(#arrow);fill:none;", 
        arrowhead: "normal",curve: d3.curveBasis})
       } 
      } 
    }
  } 

    // Set some general styles
let nodesArray= [];
let node_textLength_array=[];
g.nodes().forEach(element => {
  var node = g.node(element);
  node_textLength_array.push(node.label.length)
});
const max_length = node_textLength_array.reduce(function(prev, current) {
  return (prev > current) ? prev : current
})
// console.log(max_length);

g.nodes().forEach(function(v) {
  var node = g.node(v);
  if(node.label == 'Start' || node.label == 'End'){
    node.width=38
    node.shape = "circle";
    node.paddingBottom=10
    node.paddingLeft=5
    node.paddingTop=5
    node.paddingRight=10
  }
 else{
   if(max_length>30 && max_length<=40){
    node.width=300
   }else if(max_length>40 && max_length<=50){
    node.width=330
   }else if(max_length>50 && max_length<=60){
    node.width=360
   }else if(max_length>60){
    node.width=400
   }else{
    node.width=200
   }
  nodesArray.push(node)
 }
  node.rx = node.ry = 5;
});

const max = nodesArray.reduce(function(prev, current) {
  return (prev.metrics > current.metrics) ? prev : current
})
  if(String(max.metrics).includes("Days")||String(max.metrics).includes("Sec")||String(max.metrics).includes("Min")||String(max.metrics).includes("Hrs")){
    var timeMetricArray=[]
    for(var i =0;i<nodesArray.length;i++){
      timeMetricArray.push(nodesArray[i].metrics)
      if(nodesArray[i].metrics.includes("Days")){
        nodesArray[i]["days"]=nodesArray[i].metrics.split(' ')[0]
      }else if(nodesArray[i].metrics.includes("Min")){
        var min=nodesArray[i].metrics.split(' ')[0];
        nodesArray[i]["days"]=min/(60*24)
      }else if(nodesArray[i].metrics.includes("Hrs")){
        var hrs=nodesArray[i].metrics.split(' ')[0];
        nodesArray[i]["days"]=hrs/24
      } else if(nodesArray[i].metrics.includes("Sec")){
        var sec=nodesArray[i].metrics.split(' ')[0];
        nodesArray[i]["days"]=sec/(60*60*24)
      }
    }
        var timeMetricArray1=[]
    for(var j=0;j<timeMetricArray.length;j++){
      if(timeMetricArray[j].includes("Days")){
          timeMetricArray1.push(Number(timeMetricArray[j].split(' ')[0]))
      }else if(timeMetricArray[j].includes("Sec")){
        var secs=timeMetricArray[j].split(' ')[0];
          timeMetricArray1.push(secs/(60*60*24))
      }else if(timeMetricArray[j].includes("Min")){
        var min=timeMetricArray[j].split(' ')[0];
          timeMetricArray1.push(min/(60*24))
      }else if(timeMetricArray[j].includes("Hrs")){
        var hrs=timeMetricArray[j].split(' ')[0];
          timeMetricArray1.push(hrs/24)
      }
    }
    const max1 = timeMetricArray1.reduce(function(prev, current) {
      return (prev > current) ? prev : current
    })
    const maxDivided = max1/5;

    for(var i =0;i<nodesArray.length;i++){  // for performance metrics
      if (Number(nodesArray[i].days) <= maxDivided) {
        var eachLine = nodesArray[i].label.split('\n')[0];
            g.node(eachLine).style = "fill: #eddfc8";
      }
      else if (Number(nodesArray[i].days) > maxDivided && Number(nodesArray[i].days) <= Number(maxDivided*2)) {
        var eachLine = nodesArray[i].label.split('\n')[0];
            g.node(eachLine).style = "fill: #eab977";
      } else if (Number(nodesArray[i].days) > Number(maxDivided*2) && Number(nodesArray[i].days) <= Number(maxDivided*3)) {
        var eachLine = nodesArray[i].label.split('\n')[0];
            g.node(eachLine).style = "fill: #f48551" ;
      } else if (Number(nodesArray[i].days) > Number(maxDivided*3) && Number(nodesArray[i].days) <= Number(maxDivided*4)) {
        var eachLine = nodesArray[i].label.split('\n')[0];
        g.node(eachLine).style = "fill: #d94029";   
      }
      else if (Number(nodesArray[i].days) > Number(maxDivided*4) && Number(nodesArray[i].days) <= Number(maxDivided*5)) {
        var eachLine = nodesArray[i].label.split('\n')[0];
        g.node(eachLine).style = "fill: #a40000"; 
      }else{
        var eachLine = nodesArray[i].label.split('\n')[0];
        g.node(eachLine).style = "fill: #a40000";
      }
    
    }
    for(var i1 =0;i1<nodesArray.length;i1++){
      if(String(nodesArray[i1].label).includes('Days')){
        let metricValue=nodesArray[i1].label.split('\n')[1].split(' ')[0]
        if(Number(metricValue)>=7){
          let metricValueWeek=Number(metricValue)/7;
          let metricinWeeks
          if(String(metricValueWeek).indexOf('.') != -1){
          let value=metricValueWeek.toString().split('.')[0]+'.'+metricValueWeek.toString().split('.')[1].slice(0,2)
            metricinWeeks=value+" Weeks"
          }else{
            metricinWeeks=metricValueWeek+" Weeks"
          }
          nodesArray[i1].label=nodesArray[i1].label.split('\n')[0]+'\n'+metricinWeeks
        }
      }
    }
  }else{        // for frequency metrics
  var maxDivided = max.metrics/5;

for(var i =0;i<nodesArray.length;i++){
  if (nodesArray[i].metrics <= maxDivided) {
    var eachLine = nodesArray[i].label.split('\n')[0];
        g.node(eachLine).style = "fill: #e6e3eb";
  }
  else if (nodesArray[i].metrics > maxDivided && nodesArray[i].metrics <= Number(maxDivided*2)) {
    var eachLine = nodesArray[i].label.split('\n')[0];
        g.node(eachLine).style = "fill: #aebad2";
  } else if (nodesArray[i].metrics > Number(maxDivided*2) && nodesArray[i].metrics <= Number(maxDivided*3)) {
    var eachLine = nodesArray[i].label.split('\n')[0];
        g.node(eachLine).style = "fill: #679cc2" ;
  } else if (nodesArray[i].metrics > Number(maxDivided*3) && nodesArray[i].metrics <= Number(maxDivided*4)) {
    var eachLine = nodesArray[i].label.split('\n')[0];  
    g.node(eachLine).style = "fill: #2182b4";    
  }else if (nodesArray[i].metrics > Number(maxDivided*4) && nodesArray[i].metrics <= Number(maxDivided*5)) {
    var eachLine = nodesArray[i].label.split('\n')[0];
    g.node(eachLine).style = "fill: #035386"; 
  }

}
  }
// Add some custom colors based on state

g.node('Start').style = "fill: #5AD315; ";
g.node('End').style = "fill: #A93226";
g.node("Start").class="circl"
g.node("End").class="circl"
  
// Set up zoom support
var zoom = d3.zoom().on("zoom", function() {
      inner.attr("transform", d3.event.transform);
    });
svg.call(zoom);



// Create the renderer
var render = new dagreD3.render();

var wrap = function(text, width) {
  text.each(function (a) {
    
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
  return "<div class='filter-overlayheader'><p class='name node-name'>" + name + '</p><button id="filterBtn" class="btn-filter"><img src="../../../../assets/images/PI/filter.svg" alt="" class="default-img"><img src="../../../../assets/images/PI/filter-blue.svg" alt="" class="hover-img"></button></div>' + description;
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

var fontSize
inner.selectAll('g.node').on('mouseover', function(d){

  let selectedNode = d3.select(this)

  this.hoverNodeName = '';
  let nodeValue = selectedNode['_groups'][0]
  this.hoverNodeName = nodeValue[0]['childNodes'][0].nodeName;
 this.nodeTextPreviousStyle = this.style;
 d3.select(this).select('g.label')

  if(this.hoverNodeName == 'rect'){
    this.style = 'font-size: 1.2rem; font-weight: 600; color: blue;text-align: center, padding: 5px;cursor:pointer;'
    this.rectNodeData  = {
      'x': nodeValue[0]['childNodes'][0]['attributes'][2]['value'] ,
      'y': nodeValue[0]['childNodes'][0]['attributes'][3]['value'],
      'width':  nodeValue[0]['childNodes'][0]['attributes'][4]['value'] ,
      'height' : nodeValue[0]['childNodes'][0]['attributes'][5]['value'] ,
      'stroke':nodeValue[0]['childNodes'][0]['attributes'][7]['value']
    };
    d3.select(this)['_groups'][0][0]['childNodes'][0]['attributes'][3]['value'] = -30;
    d3.select(this)['_groups'][0][0]['childNodes'][0]['attributes'][4]['value'] = this.rectNodeData.width *1;
    d3.select(this)['_groups'][0][0]['childNodes'][0]['attributes'][5]['value'] = this.rectNodeData.height *1.4;
    d3.select('g.node text tspan')['style']= 'font-size: 30px';
    fontSize=d3.select(this).select("g text")['_groups'][0][0]['attributes'][1]['value']
    // d3.select(this).select("g text")
    //   .style('font-size','18px')
    d3.select(this).select("g text")
      .style('font-weight','600')

  }
  
})
.on('mouseout', function(this){
  if(this.hoverNodeName == 'rect'){
    d3.select(this)['_groups'][0][0]['childNodes'][0]['attributes'][3]['value'] = -25;
    d3.select(this)['_groups'][0][0]['childNodes'][0]['attributes'][4]['value'] = this.rectNodeData.width;
    d3.select(this)['_groups'][0][0]['childNodes'][0]['attributes'][5]['value'] = this.rectNodeData.height;
    
    this.style = this.nodeTextPreviousStyle;
   d3.select(this).select("g text")['_groups'][0][0]['attributes'][1]['value']=fontSize;
   d3.select(this).select("g text").style('font-weight','400')
  }
})


inner.selectAll("g.node")
  .attr("title", function(v) { 
    if(v=="Start"||v=="End"){
    }else{
      return styleTooltip(v, g.node(v).description) }
    })
    
  .each(function(v) { $(this).tipsy({ gravity: "w", opacity: 1, html: true }); 
});

$('#filterBtn').tipsy({​​title: function() {​​
  
   return this.getAttribute('original-title').toUpperCase(); }​​ }​​);

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


//edge tooltip

var styleTooltip1 = function(name) {  
  for( var i=0;i<me.model2.length;i++){
    if(me.model2[i].from==name.v&&me.model2[i].to==name.w){
      if(name.v=="Start"||name.w=="End"||name.v=="End"||name.w=="Start"){
      var linkTooltip1 = "<p class='node-name'>"+me.model2[i].from+"-"+me.model2[i].to+"</p><p class='metrics-name'>Frequency</p><ul class='left-content'><li><div>Absolute Frequency</div><div>"+me.model2[i].toolDataCount[0]+"</div></li><li><div>Case Frequency</div><div>"+me.model2[i].toolDataCount[1]+"</div></li><li><div>Max Repetition</div><div>"+me.model2[i].toolDataCount[2]+"</div></li><li><div>Start Frequency</div><div>"+me.model2[i].toolDataCount[3]+"</div></li><li><div>End Frequency</div><div>"+me.model2[i].toolDataCount[4]+"</div></li></ul>";
      }else{
        var performanceLinkCount1=me.timeConversion(me.model2[i].toolDataCount[5])
        var performanceLinkCount2=me.timeConversion(me.model2[i].toolDataCount[6])
        var performanceLinkCount3=me.timeConversion(me.model2[i].toolDataCount[7])
        var performanceLinkCount4=me.timeConversion(me.model2[i].toolDataCount[8])
        var performanceLinkCount5=me.timeConversion(me.model2[i].toolDataCount[9])
        var linkTooltip1 = "<p class='node-name'>"+me.model2[i].from+"-"+me.model2[i].to+"</p><p class='metrics-name'>Frequency</p><ul class='left-content'><li><div>Absolute Frequency</div><div>"+me.model2[i].toolDataCount[0]+"</div></li><li><div>Case Frequency</div><div>"+me.model2[i].toolDataCount[1]+"</div></li><li><div>Max Repetition</div><div>"+me.model2[i].toolDataCount[2]+"</div></li><li><div>Start Frequency</div><div>"+me.model2[i].toolDataCount[3]+"</div></li><li><div>End Frequency</div><div>"+me.model2[i].toolDataCount[4]+"</div></li></ul><p class='metrics-name'>Performance </p><ul class='left-content'><li><div>Total Duration</div><div>"+performanceLinkCount1+"</div></li><li><div>Median Duration</div><div>"+performanceLinkCount2+"</div></li><li><div>Mean Duration </div><div>"+performanceLinkCount3+"</div></li><li><div>Max Duration </div><div>"+performanceLinkCount4+"</div></li><li><div>Min Duration </div><div>"+performanceLinkCount5+"</div></li></ul>";
        }
      }
}
  return linkTooltip1;
};
inner.selectAll('g.edgePath')
.attr("title", function(v) { 
  if(me.performanceValue==true&&v.v=="Start"||me.performanceValue==true&&v.w=="End"){

 }else{
  return styleTooltip1(v)
 }
 })
  .each(function(v) { $(this).tipsy({ gravity:"e", opacity: 1, html: true}); });

  // For Edge color change on mouse enter
inner.selectAll('g.edgePath path').on('mouseover', function(this){
  this.selectedEdgeCssValue = '';
  let selectedEdge = d3.select(this)
  let edgeValue = selectedEdge['_groups'][0];
  let hoverEdgeCssValue = edgeValue[0]['style']['cssText']
  
  let strokeValue=edgeValue[0]['style']['cssText'].split(';')[1]
  
  this.selectedEdgeCssValue = hoverEdgeCssValue;
  let strokeWidthValue=strokeValue.split(':')[1].replace('px', '')
  let strokeWidthValue1=Number(strokeWidthValue)+3+'px'

  this['style']=hoverEdgeCssValue.split(';')[0]+';'+hoverEdgeCssValue.split(';')[2]+';'+hoverEdgeCssValue.split(';')[3]+";stroke-width:"+strokeWidthValue1+";fill:none";
  }).on('mouseout', function(this){    
  this['style']= this.selectedEdgeCssValue;
})



// d3.selectAll("g .node")
// .style("fill","#fff")

d3.selectAll("g g.label g")
.attr("transform","translate(-5,-15)")

d3.selectAll("g text")
.attr("text-anchor","middle")

d3.selectAll("g text")
.style('font-size','14')

d3.selectAll("g.edgeLabel g.label")
.attr("transform","translate(-50,-10)")
  d3.selectAll("g.circl g.label").attr("transform","translate(0,5)")

  if(me.isplay==true){ 
       
    d3.selectAll("g.edgePath")
      .append("circle")
      .attr("r",'10')
      .attr("fill","red")
      .append("animateMotion")
      .attr("dur","5s")
      .attr("repeatCount","indefinite")
      .attr("path","M182.5,573L182.5,579.6666666666666C182.5,586.3333333333334,182.5,599.6666666666666,182.5,617.1666666666666C182.5,634.6666666666666,182.5,656.3333333333334,182.5,678C182.5,699.6666666666666,182.5,721.3333333333334,182.5,743C182.5,764.6666666666666,182.5,786.3333333333334,182.5,808C182.5,829.6666666666666,182.5,851.3333333333334,220,869.4427860696518C257.5,887.5522388059702,332.5,902.1044776119403,370,909.3805970149255L407.5,936.656716")

    var pathList=d3.selectAll("g.edgePath path.path")['_groups'][0]
    var circleList=d3.selectAll("g.edgePath circle")['_groups'][0]

  for(var k=0;k<pathList.length;k++){
      var pathValue=pathList[k]['attributes'][1]['value']
    for(var k1=0;k1<circleList.length;k1++){
      if(pathList[k1]['__data__'].v==circleList[k1]['__data__'].v){
        circleList[k]['childNodes'][0]['attributes'][2]['value']=pathValue
      }
    }
  }

  var labelList=d3.selectAll("g.edgeLabel")['_groups'][0];
  for(var k2=0;k2<labelList.length;k2++){
    var labelValue=labelList[k2]['textContent']
      if(labelList[k2]['textContent']==me.maxLabelValue){
        circleList[k2]['childNodes'][0]['attributes'][0]['value']='0.5s';
      }else{
        // circleList[k2]['attributes'][1]['value']='red'
      }    
  }
}else{
  d3.selectAll("g.edgePath circle").remove()
}

// inner.selectAll('g.node')['_groups'][0][1]['attributes'][2].value="opacity: 1;fill: rgb(209, 54, 54)"
  
let nodes_Array=d3.selectAll("g.node text")['_groups'][0];

nodes_Array.forEach((element,i) => {
if(g.node(element['parentNode'].__data__).label){
  if((g.node(element['parentNode'].__data__).label !='Start') && (g.node(element['parentNode'].__data__).label!='End')){
    let node_width=g.node(element['parentNode'].__data__)['width']
    let node_textLength=g.node(element['parentNode'].__data__).label.split('\n')[0].length;
    let node_color=g.node(element['parentNode'].__data__)['style'].split(':')[1].trim();
  if(node_width!=200 && node_textLength >=30){
    if(node_color=="#035386" || node_color=="#2182b4"|| node_color=="#a40000"){
      nodes_Array[i]['attributes'][1].value="font-size: 13px;fill: #fff"
      // inner.selectAll('g.node')['_groups'][0][i]['attributes'][2].value="opacity: 1;fill: #030303"
     }else{
      nodes_Array[i]['attributes'][1].value="font-size: 13px;fill: #030303"
      // inner.selectAll('g.node')['_groups'][0][i]['attributes'][2].value="opacity: 1;fill: #fff"
     }
  }else if(node_width==200 ){
    if(node_color=="#035386" || node_color=="#2182b4"|| node_color=="#a40000"){
      nodes_Array[i]['attributes'][1].value="font-size: 14px;fill: #fff"
      // inner.selectAll('g.node')['_groups'][0][i]['attributes'][2].value="opacity: 1;fill: #030303"
     }else{
      nodes_Array[i]['attributes'][1].value="font-size: 14px;fill: #030303"
      // inner.selectAll('g.node')['_groups'][0][i]['attributes'][2].value="opacity: 1;fill: #fff"
     }
  }else{
    if(node_color=="#035386" || node_color=="#2182b4"|| node_color=="#a40000"){
      nodes_Array[i]['attributes'][1].value="font-size: 18px;fill: #fff"
      // inner.selectAll('g.node')['_groups'][0][i]['attributes'][2].value="opacity: 1;fill: #030303"
     }else{
      nodes_Array[i]['attributes'][1].value="font-size: 18px;fill: #030303"
      // inner.selectAll('g.node')['_groups'][0][i]['attributes'][2].value="opacity: 1;fill: #fff"
     }
  }
 }
}
});
 
// Center the graph
var initialScale = 0.42;
svg.call(zoom.transform, d3.zoomIdentity.translate((svg.attr("width") - g.graph().width * initialScale) / 2, 53).scale(initialScale));
svg.attr('height', g.graph().height * initialScale + 53)

var zoom1 = 0.4;
    
$('.zoom').click( function(){ //Zoom In
  zoom1 =zoom1+ 0.1;
svg.call(zoom.transform, d3.zoomIdentity.translate((svg.attr("width") - g.graph().width * zoom1) / 2, 53).scale(zoom1));
  
  svg.attr('height', g.graph().height * zoom1 + 53)

});
$('.zoom-init').click( function(){ //zoom reset

  var initialScale = 0.42;
svg.call(zoom.transform, d3.zoomIdentity.translate((svg.attr("width") - g.graph().width * initialScale) / 2, 53).scale(initialScale));
svg.attr('height', g.graph().height * initialScale + 53)
zoom1 = 0.4
});
$('.zoom-out').click( function(){   //zoom Out
  zoom1 =zoom1- 0.05;
  svg.call(zoom.transform, d3.zoomIdentity.translate((svg.attr("width") - g.graph().width * zoom1) / 2, 53).scale(zoom1));
  
  svg.attr('height', g.graph().height * zoom1 + 53)

});


this.graph_height=g.graph().height;
this.graph_width=g.graph().width;
if(me.isdownloadJpeg==true||this.isdownloadPng==true||this.isdownloadpdf==true||this.isdownloadsvg==true){
  if(this.graph_width>1403){
    var initialScale1 = 0.30;
    svg.call(zoom.transform, d3.zoomIdentity.translate((svg.attr("width") - g.graph().width * initialScale1) / 2, 53).scale(initialScale1));
    svg.attr('height', g.graph().height * initialScale1 + 53)
  }
  // if(g.graph().width>1583 && g.graph().width<3160){
  //   var initialScale1 = 0.30;
  //   svg.call(zoom.transform, d3.zoomIdentity.translate((svg.attr("width") - g.graph().width * initialScale1) / 2, 53).scale(initialScale1));
  //   svg.attr('height', g.graph().height * initialScale1 + 53)
  // }else if(g.graph().width>3160){
  //   var initialScale1 = 0.22;
  //   svg.call(zoom.transform, d3.zoomIdentity.translate((svg.attr("width") - g.graph().width * initialScale1) / 2, 53).scale(initialScale1));
  //   svg.attr('height', g.graph().height * initialScale1 + 53)
  // }
}
}
}
}
    
    
   exportSVG(fileType){ 
      if(fileType == 'svg'){
        //get svg element.
  
        var svgEl=document.getElementById('render');
        var serializer = new XMLSerializer();
   var source = serializer.serializeToString(svgEl);
  
  // //add name spaces.
  if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
   if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
       source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
   }
        var preface = '<?xml version="1.0" standalone="no"?>\r\n';
        var svgBlob = new Blob([preface, source], {type:"image/svg+xml;charset=utf-8"});
        var svgUrl = URL.createObjectURL(svgBlob);
        var downloadLink = document.createElement("a");
        downloadLink.href = svgUrl;
        downloadLink.download = this.processGraphName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        this.isdownloadsvg=false;
        this.issvg.emit(this.isdownloadsvg)
      }else{

    html2canvas(this.exportSVGtoPDF.nativeElement, {
          allowTaint: true,
          scrollY: -window.scrollY,
          useCORS: true,
          logging:true,
          scale:5,
          height: this.graph_height/2+100,
          // width:this.graph_width+100100
          // windowHeight: window.outerHeight + window.innerHeight
        }).then(canvas => {
        if(fileType == 'png' || fileType == 'jpeg'){
          this.downloadLink.nativeElement.href = canvas.toDataURL('image/'+fileType);
          this.downloadLink.nativeElement.download = this.processGraphName;
          this.downloadLink.nativeElement.click();
          this.isdownloadJpeg=false;
            this.isjpeg.emit(this.isdownloadJpeg)
            this.isdownloadPng=false;
            this.ispng.emit(this.isdownloadPng)
          
        }
        if(fileType == 'pdf'){
          var contentDataURL = canvas.toDataURL("image/png",0.3);
          // var doc = new jsPDF('l','pt',[700,600],{compress: true}); --final
          //var doc = new jsPDF('p', 'mm', 'a4', true);
          var doc = new jsPDF('p', 'pt', 'a4', true);
          // var doc = new jsPDF('l','pt',[this.graph_height,1100],'a4',{compress: true});
          // var doc = new jsPDF('1', 'pt', 'a4', true);--final
          // doc.setFontSize(20)
          // doc.addImage(contentDataURL, 'PNG',10, 10, 1620, 600);
          // doc.addImage(contentDataURL, 'PNG', 0, 0, 1000, 1400, undefined,'FAST')
          // doc.addImage(contentDataURL, 'PNG', 0, 0, 700, 600,undefined,'FAST')--final
          // doc.addImage(contentDataURL, 'PNG', -10,0, 250, 297,undefined,'FAST')
          doc.addImage(contentDataURL, 'PNG', 0, 0, 400, 400,undefined,'FAST')
          // doc.addImage(contentDataURL, "PNG", 0, 0, canvas.width * ratio, canvas.height * ratio,);
          doc.save(this.processGraphName+'.pdf');
          this.isdownloadpdf=false;
            this.ispdf.emit(this.isdownloadpdf)
        }   
      });
    } 
    }
    
    onPlayProcees(){
      if(this.isplay==true){
        // var s = d3.select('svg').selectAll('g.edgePath path.path').classed('animationFlow', true)
      }else{
        // var s = d3.select('svg').selectAll('g.edgePath path.path').attr('class', 'path');     
      }
    }
  
    timeConversion(millisec) {
      var seconds:any = (millisec / 1000).toFixed(1);
      var minutes:any = (millisec / (1000 * 60)).toFixed(1);
      var hours:any = (millisec / (1000 * 60 * 60)).toFixed(1);
      // var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);

      var days1:any = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);
      if(days1 >= 7){
        let t=days1/7
        var days:any
            if(String(t).indexOf('.') != -1){
              let week=t.toString().split('.')
                days=week[0]+'.'+week[1].slice(0,2);
              }else{
                days=t;
              }
        }else{
          var days:any=days1
        }

      if (seconds < 60) {
          return seconds + " Sec";
      } else if (minutes < 60) {
          return minutes + " Min";
      } else if (hours < 24) {
          return hours + " Hrs";
      } else {
        if(days1 >= 7){
          return days + " Wks"
        }else{
          return days + " Days"
        }
        
          // return days + " Days"
      }
    }

    onSearch(){
      const svg = d3.select("svg")
      var  inner = svg.append("g");
      inner.selectAll('g.node');
      var item = this.searchNode;
  
      if(this.searchNode){
        var itemName=item.toLowerCase();
        var _MATCHED_NODE_Array=[]
      
      d3.selectAll(".node").style("opacity","0.6");
            d3.selectAll(".node").style("pointer-events","none");
            d3.selectAll(".node").selectAll("g text").style('font-size','14')
            
            var allnodesArray=[]
            allnodesArray=d3.selectAll(".node")['_groups'][0]
            for(var j=1; j<allnodesArray.length-1;j++){
              
              allnodesArray[j]['childNodes'][0]['attributes'][5]['value']=50
            }
        var _MATCHE_NODE = d3.selectAll(".node") // all LowerCase search
                              .filter(function(d) {
                                  return d.includes(itemName)
                              });
         if(_MATCHE_NODE['_groups'][0].length>=1){
          _MATCHED_NODE_Array.push(_MATCHE_NODE)
         }
          var itemName1=itemName.charAt(0).toUpperCase()+itemName.substring(1)  // camel case search
          var _MATCHE_NODE1 = d3.selectAll(".node")
                                .filter(function(d) {
                                    return d.includes(itemName1)
                                });
            if(_MATCHE_NODE1['_groups'][0].length>=1){
              _MATCHED_NODE_Array.push(_MATCHE_NODE1)
            }

          var itemName2=itemName.toUpperCase()  // all Uppercase search
              var _MATCHE_NODE2 = d3.selectAll(".node")
                                  .filter(function(d) {
                                          return d.includes(itemName2)
                                    });
              if(_MATCHE_NODE2['_groups'][0].length>=1){
                _MATCHED_NODE_Array.push(_MATCHE_NODE2)
                }
          
          if(itemName.includes(' ')){
            var item=itemName
            var separateWord = item.toLowerCase().split(' ');
                for(var i = 0; i < separateWord.length; i++) {
                    separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
                    separateWord[i].substring(1);
                  }
                var itemName3= separateWord.join(' ');
                var _MATCHE_NODE3 = d3.selectAll(".node")
                                      .filter(function(d) {
                                        return d.includes(itemName3)
                                        });
                    if(_MATCHE_NODE3['_groups'][0].length>=1){
                        _MATCHED_NODE_Array.push(_MATCHE_NODE3)
                      }
              }

            if(_MATCHED_NODE_Array.length==0){
                this.isnoNode=true;
              }else{
                this.isnoNode=false;
                  for(var i=0;i<_MATCHED_NODE_Array.length;i++){
                    _MATCHED_NODE_Array[i].style("opacity","1");
                    _MATCHED_NODE_Array[i].style("pointer-events", 'auto');
                    _MATCHED_NODE_Array[i].selectAll("g text").style('font-size','18')
                      if(_MATCHED_NODE_Array[i]['_groups'][0][0]['childNodes'][0]['localName']!='circle')
                        _MATCHED_NODE_Array[i]['_groups'][0][0]['childNodes'][0]['attributes'][5]['value']=60

                  }
              }
        }else{
            d3.selectAll(".node").style("opacity","1");
            d3.selectAll(".node").style("pointer-events","auto");
            d3.selectAll(".node").selectAll("g text").style('font-size','14')
              var allnodesArray=[]
              allnodesArray=d3.selectAll(".node")['_groups'][0]
              for(var j=1; j<allnodesArray.length-1;j++){
                allnodesArray[j]['childNodes'][0]['attributes'][5]['value']=50
              }
          this.isnoNode=false;
        }
      }
      
}
  
  