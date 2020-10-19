import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Input,EventEmitter, Output } from '@angular/core';
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
        // if(this.isplay==true){
        //   this.class1="animation animation-fast density-medium weight-medium";
        //   this.class2="animation animation-fast1 density-medium weight-medium"
        //   this.class3="animation animation-fast2 density-medium weight-medium"
        //   this.class4="animation animation-fast3 density-high";
        //   this.class5="animation animation-fast4 density-low weight-high"
        //   this.class6="animation animation-fast5 density-low weight-high"
          this. processGraph();
        // }else{
        this.class1="inactive1"
        this.class2="inactive1"
        this.class3="inactive1"
        this.class4="inactive1"
        this.class5="inactive1"
        this.class6="inactive1"
        // this. processGraph();
        // }
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
    }

    processGraph(){
        // Create a new directed graph
    var g = new dagreD3.graphlib.Graph().setGraph({ ranksep: 100,rankdir: "TB"});

    // nodesep: 30,
    //   ranksep: 150,
    //   rankdir: "TB",
    //   marginx: 0,
    //   marginy: 20
    var me=this
    
const w = 1300;
const h = 1600;
const padding = 20;

d3.select("svg").remove()
// const svg = d3.select("svg")
let svg = d3.select("#exportSVGtoPDF").append("svg")
  .attr("xmlns", "http://www.w3.org/2000/svg")
  .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
  .attr("width", w)
  .attr("height", h)
  // .attr("overflow", 'auto')
  // .attr("viewBox", '0 0 800 800')
  // .attr("preserveAspectRatio", 'none')
  .attr('id','render')
  // .attr("class","target")

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
    // .attr("d", "M 0 0 L 10 5 L 0 10 L 4 5 z")
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
    // .attr("d", "M 0 0 L 10 5 L 0 10 L 4 5 z")
    .style("stroke-width", 1)
    // .style("stroke-dasharray", "1,0");
  
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
      
   var  inner = svg.append("g");
   var defs = svg.append("defs");

   var gradient = defs.append("linearGradient")
   .attr("id", "svgGradient")
   .attr("x1", "10%")
   .attr("x2", "60%")
   .attr("y1", "0%")
   .attr("y2", "100%")
  // .attr("x1", "50%")
  //  .attr("x2", "70%")
  //  .attr("y1", "-16%")
  //  .attr("y2", "20%")
  //  .attr("gradientTransform","rotate(90)");
   
  gradient.append("stop")
    .attr('class', 'stop-left')
    .attr("offset", "3%")
    .attr("stop-color", "#bdbcb5")
    .attr("stop-opacity", 1);
 
 gradient.append("stop")
    .attr('class', 'end')
    .attr("offset", "90%")
    .attr("stop-color", "#1E1E1E")
    .attr("stop-opacity", 1);


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

    // console.log(g);
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
          description: "<p class='metrics-name'>Frequency</p><ul class='left-content'><li><div>Absolute Frequency</div><div>"+this.model1[j].toolCount[0]+"</div></li><li><div>Case Frequency</div><div>"+this.model1[j].toolCount[1]+"</div></li><li><div>Max Repititions</div><div>"+this.model1[j].toolCount[2]+"</div></li><li><div>Start Frequency</div><div>"+this.model1[j].toolCount[3]+"</div></li><li><div>End Frequency</div><div>"+this.model1[j].toolCount[4]+"</div></li></ul><p class='metrics-name'>Performance </p><ul class='left-content'><li><div>Total Duration</div><div>"+performanceCount1+"</div></li><li><div>Median Duration</div><div>"+performanceCount2+"</div></li><li><div>Mean Duration </div><div>"+performanceCount3+"</div></li><li><div>Max Duration </div><div>"+performanceCount4+"</div></li><li><div>Min Duration </div><div>"+performanceCount5+"</div></li></ul>",
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
        // metricValue+='\n\t\t\t\t\t\t\t\t\t\t\t\t'+value.metrics;
        metricValue+='\n'+value.metrics;
        
      }
      
    //   value.label = state+metricValue;
    // //   console.log(state);
    //   value.rx = value.ry = 10;
    //   value.lableStyle = "font-zie: 4em";
    //   g.setNode(state, value);
     
    // });
    if(state == 'Start' || state == 'End'){
      value.label = state;
      value.x = 5;
    }else{
    
    value.label = state+metricValue;
    //value.label = state;
    // console.log(state);
    }
    value.rx = value.ry = 10;
    value.lableStyle = "font-zie: 4em";
    g.setNode(state, value);
   
  });
    
    // Set up the edges
var count=0
var count1
    // console.log("this.model1",this.model1);
    console.log("this.model2",this.model2);
    for(var i2=0;i2<this.model2.length;i2++){
      if(this.model2[i2].days>=0){
        count1=count++
      }
    }

    if(count1>=1){
      const maxCount = this.model2.reduce(function(prev, current) {
        return (prev.days > current.days) ? prev : current
      })
      let maxLinkCount=maxCount.days/5;
      // console.log(maxLinkCount);      
      for(var i=0; i<this.model2.length;i++){
        if(this.model2[i].from=="Start"||this.model2[i].to=="End"){
          var linkTooltip = "<p>"+this.model2[i].from+"-"+this.model2[i].to+"</p><p>Frequency</p><ul><li><div>Absolute Frequency</div><div>"+this.model2[i].toolDataCount[0]+"</div></li><li><div>Case Frequency</div><div>"+this.model2[i].toolDataCount[1]+"</div></li><li><div>Max Repititions</div><div>"+this.model2[i].toolDataCount[2]+"</div></li><li><div>Start Frequency</div><div>"+this.model2[i].toolDataCount[3]+"</div></li><li><div>End Frequency</div><div>"+this.model2[i].toolDataCount[4]+"</div></li></ul>";
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
    
          var linkTooltip = "<p>"+this.model2[i].from+"-"+this.model2[i].to+"</p><p>Frequency</p><ul><li><div>Absolute Frequency</div><div>"+this.model2[i].toolDataCount[0]+"</div></li><li><div>Case Frequency</div><div>"+this.model2[i].toolDataCount[1]+"</div></li><li><div>Max Repititions</div><div>"+this.model2[i].toolDataCount[2]+"</div></li><li><div>Start Frequency</div><div>"+this.model2[i].toolDataCount[3]+"</div></li><li><div>End Frequency</div><div>"+this.model2[i].toolDataCount[4]+"</div></li></ul><p>Performance </p><ul><li><div>Total Duration</div><div>"+performanceLinkCount1+"</div></li><li><div>Median Duration</div><div>"+performanceLinkCount2+"</div></li><li><div>Mean Duration </div><div>"+performanceLinkCount3+"</div></li><li><div>Max Duration </div><div>"+performanceLinkCount4+"</div></li><li><div>Min Duration </div><div>"+performanceLinkCount5+"</div></li></ul>";
        // console.log(this.model2[i].text);
        if(this.model2[i].text.includes('Days')){
          // console.log('Days');
          let v1=this.model2[i].text.split(' ')[0];
          let v2=Number(v1)/7;
          let v3
          if(String(v2).indexOf('.') != -1){
            let value=v2.toString().split('.')[0]+'.'+v2.toString().split('.')[1].slice(0,2)
              v3=value+" Weeks"
            }else{
              v3=v2+" Weeks"
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
        //  else{
        //   g.setEdge(this.model2[i].from,  this.model2[i].to,{ label: this.model2[i].text,  labelType: "html", style: "stroke:#b1080f;stroke-width: 8px; fill: none;marker-end:url(#arrow);", 
        //   arrowheadStyle: "fill: #333", curve: d3.curveBasis,arrowhead: "normal"})
        //  }   
        }
      }
    }else{
      var linkCountArr=[]
      var linkCountArr1=[]
    for(var i1=0;i1<this.model2.length;i1++){
      linkCountArr1.push(this.model2[i1].text)
      if(this.model2[i1].from ==="Start" || this.model2[i1].to ==="End"){  

      }else{
        linkCountArr.push(this.model2[i1].text)
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
        var linkTooltip = "<p>"+this.model2[i].from+"-"+this.model2[i].to+"</p><p>Frequency</p><ul><li><div>Absolute Frequency</div><div>"+this.model2[i].toolDataCount[0]+"</div></li><li><div>Case Frequency</div><div>"+this.model2[i].toolDataCount[1]+"</div></li><li><div>Max Repititions</div><div>"+this.model2[i].toolDataCount[2]+"</div></li><li><div>Start Frequency</div><div>"+this.model2[i].toolDataCount[3]+"</div></li><li><div>End Frequency</div><div>"+this.model2[i].toolDataCount[4]+"</div></li></ul>";
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
      
        var linkTooltip = "<p>"+this.model2[i].from+"-"+this.model2[i].to+"</p><p>Frequency</p><ul><li><div>Absolute Frequency</div><div>"+this.model2[i].toolDataCount[0]+"</div></li><li><div>Case Frequency</div><div>"+this.model2[i].toolDataCount[1]+"</div></li><li><div>Max Repititions</div><div>"+this.model2[i].toolDataCount[2]+"</div></li><li><div>Start Frequency</div><div>"+this.model2[i].toolDataCount[3]+"</div></li><li><div>End Frequency</div><div>"+this.model2[i].toolDataCount[4]+"</div></li></ul><p>Performance </p><ul><li><div>Total Duration</div><div>"+performanceLinkCount1+"</div></li><li><div>Median Duration</div><div>"+performanceLinkCount2+"</div></li><li><div>Mean Duration </div><div>"+performanceLinkCount3+"</div></li><li><div>Max Duration </div><div>"+performanceLinkCount4+"</div></li><li><div>Min Duration </div><div>"+performanceLinkCount5+"</div></li></ul>";
      if(this.model2[i].text <= maxLinkCount){
        g.setEdge(this.model2[i].from,  this.model2[i].to,{ label: this.model2[i].text,  labelType: "html",class: this.class6, style: "stroke: #a8a5a5; stroke-width: 3px;marker-end:url(#arrow3);fill:none;", 
         curve: d3.curveBasis,arrowhead: "normal"})
       }else if(this.model2[i].text > maxLinkCount && this.model2[i].text <= maxLinkCount*2){
        g.setEdge(this.model2[i].from,  this.model2[i].to,{ label: this.model2[i].text,  labelType: "html",class: this.class5, style: "stroke: #8a8787;stroke-width: 4.4px;marker-end:url(#arrow2);fill:none;", 
         curve: d3.curveBasis,arrowhead: "normal"})
       }else if(this.model2[i].text > maxLinkCount*2 && this.model2[i].text <= maxLinkCount*3){
        g.setEdge(this.model2[i].from,  this.model2[i].to,{ label: this.model2[i].text,  labelType: "html",class: this.class4 , style:"stroke:#757272;stroke-width: 5.5px; marker-end:url(#arrow1);fill:none;", 
         curve: d3.curveBasis,arrowhead: "normal"})
       }else if(this.model2[i].text > maxLinkCount*3 && this.model2[i].text <= maxLinkCount*4){
        g.setEdge(this.model2[i].from,  this.model2[i].to,{ label: this.model2[i].text,  labelType: "html", class: this.class3,style:"stroke:url(#svgGradient);stroke-width: 6px; marker-end:url(#arrow);fill:none;", 
         curve: d3.curveBasis,arrowhead: "normal"})
       }else if(this.model2[i].text > maxLinkCount*4 && this.model2[i].text < maxLinkCount*5){
        g.setEdge(this.model2[i].from,  this.model2[i].to,{ label: this.model2[i].text,  labelType: "html",lineInterpolate: 'basis', class:this.class2,style:"stroke:url(#svgGradient);stroke-width: 8px; marker-end:url(#arrow);fill:none;", 
         curve: d3.curveBasis,arrowhead: "normal"})
       }else if(this.model2[i].text == maxCount){
        g.setEdge(this.model2[i].from,  this.model2[i].to,{ label: this.model2[i].text,  labelType: "html",lineInterpolate: 'basis',class:this.class1, style:"stroke:#1E1E1E;stroke-width: 10px;marker-end:url(#arrow);fill:none;", 
        arrowhead: "normal",curve: d3.curveBasis})
       } 
      } 
    }
  } 

    // Set some general styles
let nodesArray= [];
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
  //  node.paddingLeft=5
   node.width=200
  nodesArray.push(node)
 }
  node.rx = node.ry = 5;
  // node.x = node.y = 100;
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
      // console.log(nodesArray[i].label); 

      
      if (Number(nodesArray[i].days) <= maxDivided) {
        var eachLine = nodesArray[i].label.split('\n')[0];
            g.node(eachLine).style = "fill: #f7cb86";
      }
      else if (Number(nodesArray[i].days) > maxDivided && Number(nodesArray[i].days) <= Number(maxDivided*2)) {
        var eachLine = nodesArray[i].label.split('\n')[0];
            g.node(eachLine).style = "fill: #ffbc5e";
      } else if (Number(nodesArray[i].days) > Number(maxDivided*2) && Number(nodesArray[i].days) <= Number(maxDivided*3)) {
        var eachLine = nodesArray[i].label.split('\n')[0];
            g.node(eachLine).style = "fill: #fc8047" ;
      } else if (Number(nodesArray[i].days) > Number(maxDivided*3) && Number(nodesArray[i].days) <= Number(maxDivided*4)) {
        var eachLine = nodesArray[i].label.split('\n')[0];
        g.node(eachLine).style = "fill: #E24A33";   
      }
      else if (Number(nodesArray[i].days) > Number(maxDivided*4) && Number(nodesArray[i].days) <= Number(maxDivided*5)) {
        var eachLine = nodesArray[i].label.split('\n')[0];
        g.node(eachLine).style = "fill: #B40001"; 
      } 
      
      // else if(Number(nodesArray[i].days) == max1){
      //   var eachLine = nodesArray[i].label.split('\n')[0];
      //   g.node(eachLine).style = "fill: #9A0000";
      // }
      // else{
      //   var eachLine = nodesArray[i].label.split('\n')[0];
      //   g.node(eachLine).style = "fill: #9A0000";
      // }
    
    }
    for(var i1 =0;i1<nodesArray.length;i1++){
      if(String(nodesArray[i1].label).includes('Days')){
        let metricValue=nodesArray[i1].label.split('\n')[1].split(' ')[0]
        // console.log("days",metricValue);
        if(Number(metricValue)>=7){
          let metricValueWeek=Number(metricValue)/7;
          let metricinWeeks
          if(String(metricValueWeek).indexOf('.') != -1){
          let value=metricValueWeek.toString().split('.')[0]+'.'+metricValueWeek.toString().split('.')[1].slice(0,2)
            metricinWeeks=value+" Weeks"
          }else{
            metricinWeeks=metricValueWeek+" Weeks"
          }
          // console.log(metricinWeeks);
          nodesArray[i1].label=nodesArray[i1].label.split('\n')[0]+'\n'+metricinWeeks
        }
      }
    }
  }else{        // for frequency metrics
  var maxDivided = max.metrics/5;

for(var i =0;i<nodesArray.length;i++){
  if (nodesArray[i].metrics <= maxDivided) {
    var eachLine = nodesArray[i].label.split('\n')[0];
        g.node(eachLine).style = "fill: #b7aace";
  }
  else if (nodesArray[i].metrics > maxDivided && nodesArray[i].metrics <= Number(maxDivided*2)) {
    var eachLine = nodesArray[i].label.split('\n')[0];
        g.node(eachLine).style = "fill: #ADB9D1";
  } else if (nodesArray[i].metrics > Number(maxDivided*2) && nodesArray[i].metrics <= Number(maxDivided*3)) {
    var eachLine = nodesArray[i].label.split('\n')[0];
        g.node(eachLine).style = "fill: #37607d" ;
  } else if (nodesArray[i].metrics > Number(maxDivided*3) && nodesArray[i].metrics <= Number(maxDivided*4)) {
    var eachLine = nodesArray[i].label.split('\n')[0];  
    g.node(eachLine).style = "fill: #0b629e";    
  }else if (nodesArray[i].metrics > Number(maxDivided*4) && nodesArray[i].metrics <= Number(maxDivided*5)) {
    var eachLine = nodesArray[i].label.split('\n')[0];
    g.node(eachLine).style = "fill: #024C7F"; 
  } 
  // else if(nodesArray[i].metrics == max.metrics){
  //   var eachLine = nodesArray[i].label.split('\n')[0];  
  //   g.node(eachLine).style = "fill: #2d0adb";
  // }
  // else{
  //   var eachLine = nodesArray[i].label.split('\n')[0];
  //   g.node(eachLine).style = "fill: #2d0adb";
  // }

}
  }
// Add some custom colors based on state

g.node('Start').style = "fill: #5AD315; ";
g.node('End').style = "fill: #A93226";
g.node("Start").class="circl"
g.node("End").class="circl"


// const w = 1100;
// const h = 1600; 
// const padding = 20;
// d3.select("svg").remove()
// const svg = d3.select("svg")
// svg = d3.select("#exportSVGtoPDF").append("svg")
//   .attr("xmlns", "http://www.w3.org/2000/svg")
//   .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
//   .attr("width", w)
//   .attr("height", h);
  
  //  var  inner = svg.append("g");
  
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
  text.each(function (a) {
    // console.log((a));
    
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
              // console.log(line);
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
  return "<p class='name node-name'>" + name + '</p><button id="filterBtn" class="fa fa-filter filter-icon"></button>' + description;
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


inner.selectAll('g.node').on('mouseover', function(d){
  
  let selectedNode = d3.select(this)
  // console.log(selectedNode);

  this.hoverNodeName = '';
  let nodeValue = selectedNode['_groups'][0]
  this.hoverNodeName = nodeValue[0]['childNodes'][0].nodeName;
 this.nodeTextPreviousStyle = this.style;
 d3.select(this).select('g.label')
// console.log(nodeValue[0]['childNodes'][0]['attributes']);  

  if(this.hoverNodeName == 'rect'){
    this.style = 'font-size: 1.2rem; font-weight: 600; color: blue;text-align: center, padding: 5px;cursor:pointer;'
    this.rectNodeData  = {
      'x': nodeValue[0]['childNodes'][0]['attributes'][2]['value'] ,
      'y': nodeValue[0]['childNodes'][0]['attributes'][3]['value'],
      'width':  nodeValue[0]['childNodes'][0]['attributes'][4]['value'] ,
      'height' : nodeValue[0]['childNodes'][0]['attributes'][5]['value'] ,
      'stroke':nodeValue[0]['childNodes'][0]['attributes'][7]['value']
    };
    // console.log(nodeValue[0]['childNodes'][0]['attributes'][7]['value']);
    d3.select(this)['_groups'][0][0]['childNodes'][0]['attributes'][3]['value'] = -30;
    d3.select(this)['_groups'][0][0]['childNodes'][0]['attributes'][4]['value'] = this.rectNodeData.width *1;
    d3.select(this)['_groups'][0][0]['childNodes'][0]['attributes'][5]['value'] = this.rectNodeData.height *1.3;
    // d3.select(this)['_groups'][0][0]['childNodes'][0]['attributes'][7]['value'] = this.rectNodeData.stroke+";stroke:red;stroke-width:6";
    d3.select('g.node text tspan')['style']= 'font-size: 30px';
    // console.log(nodeValue[0]['childNodes'][0]['attributes'][7]['value']);
    d3.select(this).select("g text")
      .style('font-size','18')
  }
  // console.log(d3.select(this)['_groups'][0][0]['childNodes'][0]['attributes']);
  
})
.on('mouseout', function(this){
  if(this.hoverNodeName == 'rect'){
    d3.select(this)['_groups'][0][0]['childNodes'][0]['attributes'][3]['value'] = -25;
    d3.select(this)['_groups'][0][0]['childNodes'][0]['attributes'][4]['value'] = this.rectNodeData.width;
    d3.select(this)['_groups'][0][0]['childNodes'][0]['attributes'][5]['value'] = this.rectNodeData.height;
    // d3.select(this)['_groups'][0][0]['childNodes'][0]['attributes'][7]['value'] = this.rectNodeData.stroke;
    
    this.style = this.nodeTextPreviousStyle;
    d3.select(this).select("g text")
  .style('font-size','14')
  }
})


inner.selectAll("g.node")
  .attr("title", function(v) { 
    // console.log(v);
    if(v=="Start"||v=="End"){
    }else{
      return styleTooltip(v, g.node(v).description) }
    })
    
  .each(function(v) { $(this).tipsy({ gravity: "w", opacity: 1, html: true }); 
});

$('#filterBtn').tipsy({​​title: function() {​​
  console.log("test button");
  
   return this.getAttribute('original-title').toUpperCase(); }​​ }​​);
  
//   $('#filterBtn').click(function() {
//     console.log("test button");
// });

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
      var linkTooltip1 = "<p class='node-name'>"+me.model2[i].from+"-"+me.model2[i].to+"</p><p class='metrics-name'>Frequency</p><ul class='left-content'><li><div>Absolute Frequency</div><div>"+me.model2[i].toolDataCount[0]+"</div></li><li><div>Case Frequency</div><div>"+me.model2[i].toolDataCount[1]+"</div></li><li><div>Max Repititions</div><div>"+me.model2[i].toolDataCount[2]+"</div></li><li><div>Start Frequency</div><div>"+me.model2[i].toolDataCount[3]+"</div></li><li><div>End Frequency</div><div>"+me.model2[i].toolDataCount[4]+"</div></li></ul>";
      }else{
        var performanceLinkCount1=me.timeConversion(me.model2[i].toolDataCount[5])
        var performanceLinkCount2=me.timeConversion(me.model2[i].toolDataCount[6])
        var performanceLinkCount3=me.timeConversion(me.model2[i].toolDataCount[7])
        var performanceLinkCount4=me.timeConversion(me.model2[i].toolDataCount[8])
        var performanceLinkCount5=me.timeConversion(me.model2[i].toolDataCount[9])
        var linkTooltip1 = "<p class='node-name'>"+me.model2[i].from+"-"+me.model2[i].to+"</p><p class='metrics-name'>Frequency</p><ul class='left-content'><li><div>Absolute Frequency</div><div>"+me.model2[i].toolDataCount[0]+"</div></li><li><div>Case Frequency</div><div>"+me.model2[i].toolDataCount[1]+"</div></li><li><div>Max Repititions</div><div>"+me.model2[i].toolDataCount[2]+"</div></li><li><div>Start Frequency</div><div>"+me.model2[i].toolDataCount[3]+"</div></li><li><div>End Frequency</div><div>"+me.model2[i].toolDataCount[4]+"</div></li></ul><p class='metrics-name'>Performance </p><ul class='left-content'><li><div>Total Duration</div><div>"+performanceLinkCount1+"</div></li><li><div>Median Duration</div><div>"+performanceLinkCount2+"</div></li><li><div>Mean Duration </div><div>"+performanceLinkCount3+"</div></li><li><div>Max Duration </div><div>"+performanceLinkCount4+"</div></li><li><div>Min Duration </div><div>"+performanceLinkCount5+"</div></li></ul>";
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
  
  // $('.element').tipsy({follow: 'x'});
  // $('.element').tipsy({follow: 'y'});
  // console.log(d3.mouse(this));
  // inner.selectAll('g.edgePath')
  //     .enter().append("text")
  //     .attr("class", "path")
  //     .attr("x", function (d) { return d.parent.px; })
  //     .attr("y", function (d) { return d.parent.py; })
  //     // .text(function(d) {return d.name })
  //     .call(wrap, 30)
  //     .on("mousemove", function(){
  //       tooltip.text() })
  //      .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

// inner.selectAll('g.edgePath')
// .attr('fill', 'none')
// .attr("stroke","black")
// .on('mouseover', function(d){
//   inner.selectAll('g.edgePath').append('title').text(d.v+" - "+d.w+'\n'+

// "Frequency"+'\n'+
// "Absolute Frequency 196"+'\n'+
// "Case Frequency     195"+'\n'+
// "Max Repititions    2"+'\n'+
// "Start Frequency    193"+'\n'+
// "End Frequency      0")
// })


  // For Edge color change on mouse enter
inner.selectAll('g.edgePath path').on('mouseover', function(this){
  this.selectedEdgeCssValue = '';
  let selectedEdge = d3.select(this)
  let edgeValue = selectedEdge['_groups'][0];
  let hoverEdgeCssValue = edgeValue[0]['style']['cssText']
  
  // console.log(edgeValue[0]['style']['cssText'];
  let strokeValue=edgeValue[0]['style']['cssText'].split(';')[1]
  // console.log(edgeValue[0]['style']['cssText'].split(';'));
  
  this.selectedEdgeCssValue = hoverEdgeCssValue;
  let strokeWidthValue=strokeValue.split(':')[1].replace('px', '')
  let strokeWidthValue1=Number(strokeWidthValue)+3+'px'

  // this['style']="fill: none;stroke:red ;marker-end: url(#arrow);"+strokeValue;
  this['style']=hoverEdgeCssValue.split(';')[0]+';'+hoverEdgeCssValue.split(';')[2]+';'+hoverEdgeCssValue.split(';')[3]+";stroke-width:"+strokeWidthValue1+";fill:none";
  }).on('mouseout', function(this){    
  this['style']= this.selectedEdgeCssValue;
})

// console.log(d3.selectAll("g.edgePath path"));

d3.selectAll("g .node")
.style("fill","#fff")
// .attr("text-anchor","middle")
// .attr("x","60")
// .attr("y","75")

// d3.selectAll("g rect")
// .style("width","200")
// .attr("x","-95")
// .style("text-anchor","middle")

// d3.selectAll("g g.label")
// .attr("transform","translate(-5,-15)")

d3.selectAll("g g.label g")
.attr("transform","translate(-5,-15)")

d3.selectAll("g text")
.attr("text-anchor","middle")

d3.selectAll("g text")
.style('font-size','14')

d3.selectAll("g.edgeLabel g.label")
.attr("transform","translate(-30,-10)")
  d3.selectAll("g.circl g.label").attr("transform","translate(0,5)")

  if(me.isplay==true){
    
    d3.selectAll("g.edgePath")
      .append("circle")
      .attr("r",'10')
      .attr("fill","red")
      .append("animateMotion")
      .attr("dur","5s")
      // .attr('keyTimes','0,2')
      // .attr("keySplines",'12')
      // .attr("min",'2')
      // .attr("max",'5')
      // .attr('rotate','1')
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
// console.log("circleList",circleList);

  var labelList=d3.selectAll("g.edgeLabel")['_groups'][0];
  for(var k2=0;k2<labelList.length;k2++){
    var labelValue=labelList[k2]['textContent']
      if(labelList[k2]['textContent']==me.maxLabelValue){
        // circleList[k2]['attributes'][1]['value']='yellow'
        circleList[k2]['childNodes'][0]['attributes'][0]['value']='0.5s';
      }else{
        // circleList[k2]['attributes'][1]['value']='red'
      }    
  }
}else{
  d3.selectAll("g.edgePath circle").remove()
}



 
// Center the graph
var initialScale = 0.42;
svg.call(zoom.transform, d3.zoomIdentity.translate((svg.attr("width") - g.graph().width * initialScale) / 2, 53).scale(initialScale));
svg.attr('height', g.graph().height * initialScale + 53)

var zoom1 = 0.4;
    
$('.zoom').click( function(){ //Zoom In
  zoom1 =zoom1+ 0.1;
svg.call(zoom.transform, d3.zoomIdentity.translate((svg.attr("width") - g.graph().width * zoom1) / 2, 53).scale(zoom1));
  
  // svg.call(zoom.transform, d3.zoomIdentity.translate(146.75359375,53).scale(zoom1));
  svg.attr('height', g.graph().height * zoom1 + 53)

  // $('.target').css('zoom', zoom1);
});
$('.zoom-init').click( function(){ //zoom reset
  // zoom1 = 0.71;
  // svg.call(zoom.transform, d3.zoomIdentity.translate(146.75359375,53).scale(zoom1));
  // svg.attr('height', g.graph().height * zoom1 + 53)
  var initialScale = 0.42;
svg.call(zoom.transform, d3.zoomIdentity.translate((svg.attr("width") - g.graph().width * initialScale) / 2, 53).scale(initialScale));
svg.attr('height', g.graph().height * initialScale + 53)
zoom1 = 0.4
  // $('.target').css('zoom', zoom1);
});
$('.zoom-out').click( function(){   //zoom Out
  zoom1 =zoom1- 0.05;
  svg.call(zoom.transform, d3.zoomIdentity.translate((svg.attr("width") - g.graph().width * zoom1) / 2, 53).scale(zoom1));
  
  svg.attr('height', g.graph().height * zoom1 + 53)
  // svg.call(zoom.transform, d3.zoomIdentity.translate(146.75359375,53).scale(zoom1));
  // svg.attr('height', g.graph().height * zoom1 + 53)
  // $('.target').css('zoom', zoom1);
});
// svg.attr('width', g.graph().width * initialScale + 13);


if(me.isdownloadJpeg==true||this.isdownloadPng==true||this.isdownloadpdf==true||this.isdownloadsvg==true){
  if(g.graph().width>1583 && g.graph().width<3160){
    var initialScale1 = 0.35;
    svg.call(zoom.transform, d3.zoomIdentity.translate((svg.attr("width") - g.graph().width * initialScale1) / 2, 53).scale(initialScale1));
    svg.attr('height', g.graph().height * initialScale1 + 53)
  }else if(g.graph().width>3160){
    var initialScale1 = 0.25;
    svg.call(zoom.transform, d3.zoomIdentity.translate((svg.attr("width") - g.graph().width * initialScale1) / 2, 53).scale(initialScale1));
    svg.attr('height', g.graph().height * initialScale1 + 53)
  }
}
    }
    
    
    exportSVG(fileType){ 
      if(fileType == 'svg'){
        //get svg element.
  // var svg = document.getElementById("render");
  
  // //get svg source.
  // var serializer = new XMLSerializer();
  // var source = serializer.serializeToString(svg);
  
  // //add name spaces.
  // if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
  //     source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  // }
  // // if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
  // //     source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
  // // }
  
  // //add xml declaration
  // source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
  // console.log(source);
  
  // //convert svg source to URI data scheme.
  // var url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);
  
  
  
  
  
  
  // var svgHtml = document.getElementById("render"),
  //     svgData = new XMLSerializer().serializeToString(svgHtml),
  //     svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"}),
  //     bounding = svgHtml.getBoundingClientRect(),
  //     width = bounding.width * 2,
  //     height = bounding.height * 2,
  //     canvas = document.createElement("canvas"),
  //     context = canvas.getContext("2d"),
  //     exportFileName = 'd3-graph-image.png';
  
  // //Set the canvas width and height before loading the new Image
  // canvas.width = width;
  // canvas.height = height;
  
  // var image = new Image();
  // image.onload = function() {
  //     //Clear the context
  //     context.clearRect(0, 0, width, height);
  //     context.drawImage(image, 0, 0, width, height);
  
  //     //Create blob and save if with FileSaver.js
  //     canvas.toBlob(function(blob) {
  //         saveAs(blob, exportFileName);
  //     });     
  // };
  // var svgUrl = URL.createObjectURL(svgBlob);
  // image.src = svgUrl;
  
        var svgEl=document.getElementById('render');
        // console.log("svgEl",svgEl);
        
      //  svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        // var svgData = svgEl.outerHTML;
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
        // html2canvas(this.exportSVGtoPDF.nativeElement, {scrollY: -window.scrollY}).then(function(canvas) {
          // var img = canvas.toDataURL();
          // window.open(img);
      // });
      html2canvas(this.exportSVGtoPDF.nativeElement, { 
        // useCORS: true,
        // foreignObjectRendering: true,
          allowTaint: true,
          scrollY: -window.scrollY,
          useCORS: true,
          logging:true,
          scale:5
    // onrendered: myRenderFunction
          // width:1100
        //   onrendered: function(canvas) {

        //     // restore the old offscreen position
        //    this.exportSVGtoPDF.style.position = 'absolute';
        //    this.exportSVGtoPDF.style.top = 0;
        //    this.exportSVGtoPDF.style.left = "-9999px"
     
        //  }
        }).then(canvas => {
          // this.setpixelated(canvas.getContext('2d'));
        // console.log('canvas.height',canvas.height)
        // console.log('canvas.height',canvas.width)
       
      //   var margin = 10;
      //   var imgWidth = 210 - 2*margin; 
      //   var pageHeight = 295;  
      //   var imgHeight = canvas.height * imgWidth / canvas.width;
      //   var position = 10;
        // console.log('canvas', canvas.toDataURL('image/'+fileType))
        if(fileType == 'png' || fileType == 'jpeg'){
          this.downloadLink.nativeElement.href = canvas.toDataURL('image/'+fileType);
          // console.log(this.processGraphName);
          
          this.downloadLink.nativeElement.download = this.processGraphName;
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
          doc.save(this.processGraphName+'.pdf');
          this.isdownloadpdf=false;
            this.ispdf.emit(this.isdownloadpdf)
        }   
      });
    } 
    }
    // setpixelated(context) {
    //   context['imageSmoothingEnabled'] = false;
    //   context['mozImageSmoothingEnabled'] = false; 
    //   context['oImageSmoothingEnabled'] = false; 
    //   context['webkitImageSmoothingEnabled'] = false; 
    //   context['msImageSmoothingEnabled'] = false;
    //   }
    
    onPlayProcees(){
    //   this.isPlayAnimation = !this.isPlayAnimation;
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
      // console.log(days);
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
          return days + " Weeks"
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
      var itemName = this.searchNode;
  
      if(this.searchNode){
      var UN_MATCH_NODE = d3.selectAll(".node")
      .filter(function(d) {
         return ! d.includes(itemName)
        });
        
        UN_MATCH_NODE.style("opacity","0.1");
        UN_MATCH_NODE.style("zIndex", '9999')
        UN_MATCH_NODE.style("pointer-events", 'none')

        var _MATCHE_NODE = d3.selectAll(".node")
          .filter(function(d) {
                  return d.includes(itemName)
          });
         
          var itemName1=itemName.slice(0,1).toUpperCase()+itemName.slice(1,40)  // camel case search
          var _MATCHE_NODE1 = d3.selectAll(".node")
          .filter(function(d) {
                  return d.includes(itemName1)
          });

          var itemName2=itemName.toUpperCase()  // all Uppercase search
          // console.log(itemName2);
          
          var _MATCHE_NODE2 = d3.selectAll(".node")
          .filter(function(d) {
                  return d.includes(itemName2)
          });

          if(itemName.includes(' ')){
            var item=itemName1.split(' ')
            var itemName3=item[0]+' '+item[1].slice(0,1).toUpperCase()+item[1].slice(1,40)
            // console.log(itemName3);

              var _MATCHE_NODE3 = d3.selectAll(".node")
                      .filter(function(d) {
                        return d.includes(itemName3)
                        });
              _MATCHE_NODE3.style("opacity","1");
              _MATCHE_NODE3.style("pointer-events", 'auto')

              var itemName4=item[0]+' '+item[1].toUpperCase();
              var _MATCHE_NODE4 = d3.selectAll(".node")
                      .filter(function(d) {
                        return d.includes(itemName4)
                        });
              _MATCHE_NODE4.style("opacity","1");
              _MATCHE_NODE4.style("pointer-events", 'auto')
          }
         
          // console.log(_MATCHE_NODE['_groups'][0].length);
          if(_MATCHE_NODE['_groups'][0].length==0 && _MATCHE_NODE1['_groups'][0].length==0 && _MATCHE_NODE2['_groups'][0].length==0 && _MATCHE_NODE3['_groups'][0].length==0 && _MATCHE_NODE4['_groups'][0].length==0){
            this.isnoNode=true;
            }else{
              this.isnoNode=false;
            }
          
          _MATCHE_NODE.style("opacity","1");
          _MATCHE_NODE1.style("opacity","1");
          _MATCHE_NODE2.style("opacity","1");
          _MATCHE_NODE.style("pointer-events", 'auto')
          _MATCHE_NODE1.style("pointer-events", 'auto')
          _MATCHE_NODE2.style("pointer-events", 'auto')
        }else{
          d3.selectAll(".node").style("opacity","1");
          d3.selectAll(".node").style("pointer-events","auto");
          this.isnoNode=false;
        }
      }
      
}
  
  