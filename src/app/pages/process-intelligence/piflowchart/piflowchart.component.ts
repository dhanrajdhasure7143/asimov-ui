import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import * as go from 'gojs';
import * as jsPDF from 'jspdf'
// import {ZoomSlider} from '../../../zoomSlider';
// import { NgxSpinnerService } from 'ngx-spinner';

declare var $:any;
@Component({
  selector: 'app-piflowchart',
  templateUrl: './piflowchart.component.html',
  styleUrls: ['./piflowchart.component.css']
})
export class PiflowchartComponent implements OnInit {

  @Input()  public model1 ;
  @Input()  public model2 ;
  @Input() public isplay;
  @Input() public isdownloadsvg;
  @Input() public isdownloadpdf;
  @Input() public spinMetrics0;
  public model:go.Model;
  @Output()
    public nodeClicked = new EventEmitter();
    @Output() myOutputVal = new EventEmitter<boolean>();
    @Output() issvg=new EventEmitter<boolean>()
    @Output() ispdf=new EventEmitter<boolean>()
    public myDiagram: go.Diagram ;
    public isfrequency:boolean=false;
    toolData1:any=[];
    isstartLink:boolean=true;

  constructor() { }

  ngOnInit() {
  //      this.spinner.show();
  // var me=this;
  // setTimeout(function(){
  //   me.spinner.hide()},5000);
    
    this.flowGraph();
    // this.zoomSlider();
  }
  ngOnChanges(){
      this.myDiagram.div = null;
      this.flowGraph();
      
    // this.zoomSlider();
    if(this.isplay == true){
      this.playAnimation();
    };
   
    if(this.isdownloadsvg == true){
      this.makeSvg();
    }
    if(this.isdownloadpdf==true){
      console.log(this.isdownloadpdf);
      
      this.generateImages (2000,2000)
    }

    // $(".zoomSlider").nextAll().remove();
     
  }

  flowGraph() {
    var me=this;
 
    var $ = go.GraphObject.make; // for conciseness in defining templates
    // some constants that will be reused within templates
    var roundedRectangleParams = {
        parameter1: 2, // set the rounded corner
        // spot1: go.Spot.TopLeft,
        // spot2: go.Spot.BottomRight // make content go all the way to inside edges of rounded corners
    };
    this.myDiagram =
        $(go.Diagram, "myDiagramDiv", // must name or refer to the DIV HTML element
            {
              initialContentAlignment: go.Spot.Center,
                initialAutoScale: go.Diagram.UniformToFill,
                hasHorizontalScrollbar: true,
                hasVerticalScrollbar: true,
                // have mouse wheel events zoom in and out instead of scroll up and down
                "toolManager.mouseWheelBehavior": go.ToolManager.WheelScroll,
                // enable undo & redo
                "undoManager.isEnabled": true,
	"PartResized": function(e) { e.diagram.layoutDiagram(true); },

          });
    // when the document is modified, add a "*" to the title and enable the "Save" button
    // this.myDiagram.addDiagramListener("Modified", function(e) {});

    function showToolTip(e,obj, diagram) {
      var toolTipDIV = document.getElementById('toolTipDIV');
      var node = obj.part;
        node.port.fill="#0162cb";
        node.port.stroke='#0162cb';
        var pt = diagram.lastInput.viewPoint;
      toolTipDIV.style.left =(pt.x + 130) + "px";
      toolTipDIV.style.top = (pt.y +  150) + "px";

      //   var pt = obj.location;
      // toolTipDIV.style.left = (pt.x) + "px";
      // toolTipDIV.style.top = (pt.y+330) + "px";
    
      var toolData="";
      var rows="";
      var name=obj.data.name;
      
      for( var i=0; i<obj.data.tool.length-5; i++ ){
        toolData += obj.data.tool[i]+"<br>";
      }
      for( var i=0; i<obj.data.toolCount.length-5; i++ ){
        rows +=obj.data.toolCount[i]+"<br>";
      }
      document.getElementById('nodename').innerHTML=name;
      document.getElementById('toolTipParagraph').innerHTML =  toolData;
      document.getElementById('toolTipText').innerHTML = '<br>'+ rows;

      var toolDataone="";
      var rowsone="";
      // console.log('objData',obj.data);
      
      for( var i=5; i<obj.data.tool.length; i++){
        toolDataone += obj.data.tool[i]+"<br>";
      }
      for( var i=5; i<obj.data.toolCount.length; i++ ){
        rowsone += timeConversion(obj.data.toolCount[i])+"<br>";
      }
      document.getElementById('toolTipParagraphone').innerHTML =  toolDataone;
      document.getElementById('toolTipTextone').innerHTML = '<br>'+ rowsone;
      toolTipDIV.style.display = "block";
          var nodetext=obj.findObject("NodeTEXT")
          var textNode = obj.findObject("TEXT");
          var countNode= node.findObject("countNode");
                textNode.stroke="rgba(0, 0, 0, .87)";
                nodetext.stroke="white"
                countNode.fill='white';
                obj.scale = 1.5 ;
    }
  
    function hideToolTip(obj) {
      var node = obj.part;
     var toolTipDIV = document.getElementById('toolTipDIV');
     toolTipDIV.style.display = "none";
      var nodetext=obj.findObject("NodeTEXT");
      var textNode = obj.findObject("TEXT");
      var countNode= node.findObject("countNode");
            node.port.fill="white";
            node.port.stroke='black';
            textNode.stroke="white";
            nodetext.stroke="rgba(0, 0, 0, .87)";
            countNode.fill='#0162cb';
            obj.scale = 1;
        }
    var myToolTip = $(go.HTMLInfo, {
      show: showToolTip,
      hide: hideToolTip
  
    });

    // define the Node template
    this.myDiagram.nodeTemplate =
        $(go.Node, "Auto", {
                isShadowed: true,
                shadowBlur: 2,
                shadowOffset: new go.Point(0, 1),
                shadowColor: "rgba(0, 0, 0, .14)" ,
                width:180,
                height:40,

            },
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            new go.Binding("zOrder"),
            // define the node's outer shape, which will surround the TextBlock
            $(go.Shape, "RoundedRectangle", roundedRectangleParams, {
                name: "SHAPE",
                fill: "white",
                strokeWidth: 0.5,
                stroke: "black",
                portId: "", // this Shape is the Node's port, not the whole Node
                fromLinkable: false,
                fromLinkableSelfNode: false,
                fromLinkableDuplicates: false,
                toLinkable: false,
                toLinkableSelfNode: false,
                toLinkableDuplicates: false,
            }),

              $(go.Panel,
            $(go.TextBlock, {
                    font: "bold 8pt helvetica, bold, ",
                    margin: 4,
                    stroke: "rgba(0, 0, 0, .87)",
                    editable: false,
                    name: "NodeTEXT",
                    alignment: go.Spot.TopCenter,
                    position: new go.Point(0, -30),
                },
                new go.Binding("text","name").makeTwoWay()),),

                $(go.Shape, "RoundedRectangle", roundedRectangleParams,
                      { name: "countNode",
                      width: 40, 
                      height: 15, 
                      fill: "#0162cb",
                      alignment: go.Spot.BottomCenter, 
                      margin: 2,
                      stroke:null,
                        },
                      ),
                $(go.Panel,
                  $(go.TextBlock , {
                    name: "TEXT",
                    font: "bold 7pt helvetica, bold ,",
                    stroke: "white",
                    position: new go.Point(0, 20),
                    editable: false,
          },new go.Binding("text","count").makeTwoWay()),
              ),
              
            {
                selectionChanged: function(obj) { 
                  var shape = obj.part.elt(0);                     
                    shape.fill = obj.part.isSelected ? "#0162cb" : "white";
                    // hideToolTip(obj);
                    var data=obj.part.data
                    data.clickCount=0;
                  // var nodetext=obj.findObject("NodeTEXT");
                  var node = obj.part;
                    // nodetext.stroke="rgba(0, 0, 0, .87)";
                    node.part.port.stroke='black';
                  },
                mouseEnter:function(e,obj) {
                      var data=e.diagram
                      // zoomIN_node(obj,data)
                      showToolTip(e,obj,data);
                      
                  },
                mouseLeave:function(e,obj) {
                      var data=e.diagram
                      // zoomOUT_node(obj,data)
                      hideToolTip(obj)
                      go.TextBlock.UniformToFill
                    },
            },
        );
 
    // unlike the normal selection Adornment, this one includes a Button
    this.myDiagram.nodeTemplate.selectionAdornmentTemplate =
        $(go.Adornment, "Spot",
            $(go.Panel, "Auto",
                $(go.Shape, "RoundedRectangle", roundedRectangleParams, {
                    fill: null,
                    stroke: "lightgray",
                    strokeWidth: 3,
                }),
            ),
        );
  
    this.myDiagram.nodeTemplateMap.add("Start",
        $(go.Node, "Spot", {
                desiredSize: new go.Size(35, 35),
            },
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            $(go.Shape, "Circle", {
                fill: "#52ce60",
                stroke: null,
                portId: "",
                fromLinkable: false,
                fromLinkableSelfNode: false,
                fromLinkableDuplicates: false,
                toLinkable: false,
                toLinkableSelfNode: false,
                toLinkableDuplicates: false,
                alignment: go.Spot.Bottom,
                // cursor: "pointer"
            }),
            $(go.TextBlock, "Start", {
                font: "bold 8pt helvetica, bold arial, sans-serif",
                stroke: "whitesmoke"
            }),
        ),
    );
  
    this.myDiagram.nodeTemplateMap.add("End",
        $(go.Node, "Spot", {
                desiredSize: new go.Size(35, 35)
            },
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            $(go.Shape, "Circle", {
                fill: "maroon",
                stroke: null,
                portId: "",
                fromLinkable: false,
                fromLinkableSelfNode: false,
                fromLinkableDuplicates: false,
                toLinkable: false,
                toLinkableSelfNode: false,
                toLinkableDuplicates: false,
                // cursor: "pointer"
            }),
            // $(go.Shape, "Circle", { fill: null, desiredSize: new go.Size(65, 65), strokeWidth: 2, stroke: "whitesmoke" }),
            $(go.TextBlock, "End", {
                font: "bold 8pt helvetica, bold arial, sans-serif",
                stroke: "whitesmoke"
            })
        )
    );
    // replace the default Link template in the linkTemplateMap
  this.myDiagram.linkTemplate =$(go.Link,
      { curve: go.Link.Bezier,
        //  corner: 10,
        //  adjusting: go.Link.Stretch, 
         reshapable: true, 
         toShortLength: 7 ,
         name: "LINK",},
        new go.Binding("points").makeTwoWay(),
        new go.Binding("curviness"),
        new go.Binding("zOrder"),
      // mark each Shape to get the link geometry with isPanelMain: true
      $(go.Shape, { isPanelMain: true, stroke: "blue", strokeWidth: 0,name: "LINK1", },
        //       new go.Binding('strokeWidth','extraNode',function(extraNode) {
        //   return extraNode ? 0 : 7;
        // }),
        new go.Binding('strokeWidth','highData',function(highData) {
          return highData ? 0 : 7;
        }),
        ),
      $(go.Shape, { isPanelMain: true, stroke: "rgb(44,62,80)", strokeWidth: 5,name:"LINK2" },
      new go.Binding('strokeWidth','extraNode',function(extraNode) {
        return extraNode ? 0 : 7;
      }), 
        new go.Binding('stroke', 'highData', function(highData) {
          return highData ? "red"  : 'blue';
        }),
        new go.Binding('strokeWidth','redColor',function(highData) {
          return highData ? 4 : 5;
        }),
      ),
      $(go.Shape, { isPanelMain: true, stroke: "white", strokeWidth: 3, name: "PIPE", strokeDashArray: [10, 10] },
      new go.Binding('stroke','extraNode',function(extraNode) {
        return extraNode ? "purple" : "white";
      })
      ,
      // new go.Binding('strokeDashArray', 'inprogress', function(inprogress) {
      //   return inprogress ? [5,5] /* green */ : [10,10];
      // }),
      ),
      $(go.Shape, { toArrow: "Triangle", scale: 1.3, fill: "black", stroke: null }),
      $(go.TextBlock,{ segmentOffset: new go.Point(0, 20) }, // the label text
                    {
                        textAlign: "center",
                        font: "12pt helvetica, arial, sans-serif",
                        margin: 0,
                        editable:false
                    },
                    // editing the text automatically updates the model data
                    new go.Binding("text").makeTwoWay()
                    ),
                    $(go.TextBlock, { segmentIndex: NaN, segmentFraction: 0.43,segmentOffset: new go.Point(0, -10),alignmentFocus: new go.Spot(1, 0.5, 5, 0)  }, // the label text
                    {
                        // textAlign: "right",
                        font: "8pt robot, arial, sans-serif,bold",
                        stroke: "#919191",
                        margin: 4,
                        editable:false
                    },
                    // editing the text automatically updates the model data
                    new go.Binding("text","textOne").makeTwoWay()
                    ),
                    {
                      // toolTip:
                      mouseEnter:function(e,obj,diagram) {
                        var data=e.diagram
                        // new go.Binding("text").makeTwoWay();
                        // console.log("R",e.diagram['Eb'].Xt);
                        // console.log("R",e.diagram.commandHandler.showContextMenu);
                        // console.log(e.diagram.commit);
                        
                        
                        showLinkToolTip(e,obj,data);
                      },
                      mouseLeave:function(e,obj){
                        hideLinkToolTip(obj)
                      }
                      }
        );

        function showLinkToolTip(e,obj,diagram) {
          var node = obj.part;
          var toolTipDIV = document.getElementById('linkToolTipDIV');
          var shape = obj.findObject("LINK");
          var shape1 = obj.findObject("LINK1");
          var shape2 = obj.findObject("PIPE");
          console.log();
          if(shape.fromNode.hb.key==-1||shape.toNode.hb.key==-2){
            // console.log(shape1);
            
            // shape1.shadowOffset=10
            // shape1.strokeWidth=10
            shape2.stroke="blue"
            shape2.strokeWidth=6;
          }else{
            shape1.strokeWidth=10;
            // shape2.stroke="green"
            // shape2.strokeWidth=10;


          }

          if((shape.fromNode.hb.key==-1&&me.spinMetrics0=="absoluteFrequency")||(shape.fromNode.hb.key==-1&&me.spinMetrics0=="caseFrequency")||(shape.toNode.hb.key===-2 && me.spinMetrics0=="absoluteFrequency")||(shape.toNode.hb.key===-2 && me.spinMetrics0=="caseFrequency")||(shape.fromNode.hb.key>=0&&shape.toNode.hb.key>=0)){

            // console.log("spinMetrics0",me.spinMetrics0);
            toolTipDIV.style.display = "block";
            document.getElementById('linkname').innerHTML=truncate(shape.fromNode.hb.name, '1')+"-"+truncate(shape.toNode.hb.name, '2')
            var pt = diagram.lastInput.viewPoint;
            toolTipDIV.style.left =(pt.x + 60) + "px";
            toolTipDIV.style.top = (pt.y+210) + "px";
            // console.log("show");
          }else{
            // console.log("hide");
            // me.mytoolTip.emit(false)
            // toolTipDIV.style.display = "none";
          }
          if(shape.fromNode.hb == undefined){
            // console.log("in iffff");
            shape.fromNode.hb.name = "Start";
          }
          if(shape.toNode.hb == undefined){
            // console.log("in iffffelseee");
            shape.toNode.hb.name = "End";
          }
          // console.log("from",shape.fromNode.hb);
          //  console.log("to",shape.toNode.hb);
           if(shape.fromNode.hb == undefined){
            // console.log("in iffff");
            shape.fromNode.hb.name = "Start";
          }
          if(shape.toNode.hb == undefined){
            // console.log("in iffffelseee");
            shape.toNode.hb.name = "End";
          }
          // console.log(shape);
          // console.log(shape.part.Animation);
          // e.diagram['Eb'].Xt='#0162cf'
          // shape.strokeWidth = 50;
            // shape.strokeWidth = 50;
          // var toolTipDIV = document.getElementById('linkToolTipDIV');
          //  document.getElementById('linkname').innerHTML=truncate(shape.fromNode.hb.name, '1')+"-"+truncate(shape.toNode.hb.name, '2')
          var node = obj.part;
          // console.log(obj.port,obj.fromNode.Bp);
          //   var pt = diagram.lastInput.viewPoint;
          // toolTipDIV.style.left =(pt.x + 60) + "px";
          // toolTipDIV.style.top = (pt.y+210) + "px";
    
          //   var pt = obj.location;
          // toolTipDIV.style.left = (pt.x) + "px";
          // toolTipDIV.style.top = (pt.y+330) + "px";
        
          var toolData="";
          var rows="";
          var toolDataone="";
          var rowsone="";
          var name=obj.data.name;
          // console.log("");
          if(shape.fromNode.hb.key==-1 || shape.fromNode.hb.key==-2){
            // me.isfrequency=true
             if(me.spinMetrics0=="absoluteFrequency"||me.spinMetrics0=="caseFrequency"){
              for( var j=0; j<shape.toNode.hb.tool.length-5; j++ ){
                toolData += shape.toNode.hb.tool[j]+"<br>";
                rows += shape.toNode.hb.toolCount[j]+"<br>";
              }
            }
            // me.toolData1=(toolDataone)
            me.isstartLink=false
            me.myOutputVal.emit(me.isstartLink)
            // for( var a=5; a<shape.toNode.hb.tool.length; a++ ){
            //   toolDataone += shape.toNode.hb.tool[a]+"<br>";
            //   rowsone += shape.toNode.hb.toolCount[a]+"<br>";
            // }
          }else if(shape.toNode.hb.key==-1 || shape.toNode.hb.key==-2){
            me.isstartLink=false
            me.myOutputVal.emit(me.isstartLink)
            // me.isfrequency=true
            // console.log("end",shape.fromNode.hb.tool);
			 
            if(me.spinMetrics0=="absoluteFrequency"||me.spinMetrics0=="caseFrequency"){
              for( var k=0; k<=shape.fromNode.hb.tool.length-6; k++ ){
                toolData += shape.fromNode.hb.tool[k]+"<br>";
                rows += shape.fromNode.hb.toolCount[k]+"<br>";
              }
            }
            // for( var b=5; b<=shape.fromNode.hb.tool.length; b++ ){
            //   toolDataone += shape.fromNode.hb.tool[b]+"<br>";
            //   rowsone += shape.fromNode.hb.toolCount[b]+"<br>";
            //   }
          }else{
            me.isstartLink=true;
            me.myOutputVal.emit(me.isstartLink)
          for( var i=0; i<obj.part.data.toolData.length; i++ ){

            // if(obj.part.data.toolData[i]=='Absolute Frequency'){}
            switch(obj.part.data.toolData[i]){
                  case "Absolute Frequency":
                  toolData += obj.data.toolData[i]+"<br>";
                  rows += obj.data.toolDataCount[i]+"<br>";
                  break;
                  case "Case Frequency":
                  toolData += obj.data.toolData[i]+"<br>";
                  rows += obj.data.toolDataCount[i]+"<br>";
                  break;
                  case "Max Repititons":
                  toolData += obj.data.toolData[i]+"<br>";
                  rows += obj.data.toolDataCount[i]+"<br>";
                  break;
                  case "Start Frequency":
                  toolData += obj.data.toolData[i]+"<br>";
                  rows += obj.data.toolDataCount[i]+"<br>";
                  break;
                  case "End Frequency":
                  toolData += obj.data.toolData[i]+"<br>";
                  rows += obj.data.toolDataCount[i]+"<br>";
                  break;
                  case "Total Duration":
                  toolDataone += obj.data.toolData[i]+"<br>";
                  
              rowsone += timeConversion(obj.data.toolDataCount[i])+"<br>";
              break;
              case "Median Duration":
                  toolDataone += obj.data.toolData[i]+"<br>";
              rowsone +=timeConversion(obj.data.toolDataCount[i])+"<br>";
              break;
              case "Mean Duration":
                  toolDataone += obj.data.toolData[i]+"<br>";
              rowsone +=timeConversion(obj.data.toolDataCount[i])+"<br>";
              break;
              case "Max Duration":
                  toolDataone += obj.data.toolData[i]+"<br>";
              rowsone +=timeConversion(obj.data.toolDataCount[i])+"<br>";
              break;
              case "Min Duration":
                  toolDataone += obj.data.toolData[i]+"<br>";
              rowsone +=timeConversion(obj.data.toolDataCount[i])+"<br>";
              break;
            }
            // console.log(toolDataone);
            // toolData += obj.data.toolData[i]+"<br>";
          }
        }
          // for( var i=0; i<obj.data.toolDataCount.length-5; i++ ){
          //   rows += obj.data.toolDataCount[i]+"<br>";
          // }
          // document.getElementById('nodename').innerHTML=name;
          document.getElementById('linktoolTipParagraph').innerHTML =  toolData;
          document.getElementById('linktoolTipText').innerHTML = '<br>'+ rows;
  
          // console.log('objData',obj.data);
          
        //   for( var i=0; i<obj.data.toolData.length; i++){
        //     // toolDataone += obj.data.toolData[i]+"<br>";
        //     switch(obj.data.toolData[i]){
        //       case "Total Duration":
        //           toolDataone += obj.data.toolData[i]+"<br>";
        //       rowsone += obj.data.toolDataCount[i]+"<br>";
        //       break;
        //       case "Median Duration":
        //           toolDataone += obj.data.toolData[i]+"<br>";
        //       rowsone += obj.data.toolDataCount[i]+"<br>";
        //       break;
        //       case "Mean Duration":
        //           toolDataone += obj.data.toolData[i]+"<br>";
        //       rowsone += obj.data.toolDataCount[i]+"<br>";
        //       break;
        //       case "Max Duration":
        //           toolDataone += obj.data.toolData[i]+"<br>";
        //       rowsone += obj.data.toolDataCount[i]+"<br>";
        //       break;
        //       case "Min Duration":
        //           toolDataone += obj.data.toolData[i]+"<br>";
        //       rowsone += obj.data.toolDataCount[i]+"<br>";
        //       break;
        // }
        //   }
          // for( var i=3; i<obj.data.toolDataCount.length; i++ ){
          //   rowsone += obj.data.toolDataCount[i]+"<br>";
          // }
          document.getElementById('linktoolTipParagraphone').innerHTML =  toolDataone;
          document.getElementById('linktoolTipTextone').innerHTML = '<br>'+ rowsone;
          // toolTipDIV.style.display = "block";
              // var nodetext=obj.findObject("NodeTEXT")
              // var textNode = obj.findObject("TEXT");
              // var countNode= node.findObject("countNode");
              //       textNode.stroke="rgba(0, 0, 0, .87)";
              //       nodetext.stroke="white"
              //       countNode.fill='white';
              //       obj.scale = 1.8 ;
        }

        function truncate(input, type) {
          
          if(type == 1 && input == undefined){
            input ="Start";
          }
          if(type == 2 && input == undefined){
            input = "End"
          }
         
          if (input.length > 11)
             return input.substring(0,11) + '...';
          else
             return input;
      
      }
        function hideLinkToolTip(obj){
          var toolTipDIV = document.getElementById('linkToolTipDIV');
          toolTipDIV.style.display = "none";
          var shape = obj.findObject("LINK");
          // var node = obj.part;
          var shape1 = obj.findObject("LINK1");
          var shape2 = obj.findObject("PIPE");
          if(shape.fromNode.hb.key==-1||shape.toNode.hb.key==-2){
            // console.log(shape1);
            
            // shape1.shadowOffset=10
            // shape1.strokeWidth=10
            shape2.stroke="purple"
            shape2.strokeWidth=3;
          }else{
            shape1.strokeWidth=0;
            // shape2.stroke="white"
          }
        }
        function timeConversion(millisec) {
         
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
        
    this.myDiagram.model = new go.GraphLinksModel(this.model1, this.model2);
    // this.myDiagram.commandHandler.increaseZoom
  }
  // zoomSlider(){
  //   new ZoomSlider(this.myDiagram).remove();

  //   var zoomSlider = new ZoomSlider(this.myDiagram,
  //     {
  //         alignment: go.Spot.BottomCenter, alignmentFocus: go.Spot.BottomCenter,
  //          size: 200,orientation: 'horizontal'
  //        }
  //        );
  // }
  playAnimation(){
    var animation = new go.Animation();
      animation.easing = go.Animation.EaseLinear;
      this.myDiagram.links.each(function(link) {
        animation.add(link.findObject("PIPE"), "strokeDashOffset", 20, 10)
        // animation.add(link.findObject("LINK1"), "strokeWidth",7,7)
        // animation.add(link.findObject("PIPE"), "strokeWidth",7,9)
        // animation.add(link.findObject("PIPE"), "stroke","red","green")
        // animation.add(link.findObject("LINK2"), "strokeWidth",5,5)
        // animation.add(link.findObject("LINK2"), "stroke",'red','red')
        // animation.add(link.findObject("LINK1"), "strokeWidth",7,7)
        // var shape2 = this.myDiagram.link.findObject("LINK1");
        // console.log(shape2.strokeWidth);
      },);
      // Run indefinitely
      animation.runCount = Infinity;
      animation.start();
  }

  // performance(){
  //   this.isfrequency=true;
    
  // }
  // frequency(){
  //   this.isfrequency=false;
  // }
  
  myCallback(blob) {
    var url = window.URL.createObjectURL(blob);
    var filename = "mySVGFile.svg";
    var a = document.createElement("a")
    // a.style = "display: none";
    a.href = url;
    a.download = filename;

    // IE 11
    if (window.navigator.msSaveBlob !== undefined) {
      window.navigator.msSaveBlob(blob, filename);
      return;
    }
    document.body.appendChild(a);
    requestAnimationFrame(function() {
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
    this.isdownloadsvg=false;
    // this.isdownloadpdf=false
      this.issvg.emit(this.isdownloadsvg)
   
  
  }

  makeSvg() {
    var svg = this.myDiagram.makeSvg({ scale: 1, background: "white" });
    var svgstr = new XMLSerializer().serializeToString(svg);
    var blob = new Blob([svgstr], { type: "image/svg+xml" });
    this.myCallback(blob);
  }
//   timeConversion(millisec) {
//     console.log("millisec",millisec);
    
//     var seconds:any = (millisec / 1000).toFixed(1);
//     var minutes:any = (millisec / (1000 * 60)).toFixed(1);
//     var hours:any = (millisec / (1000 * 60 * 60)).toFixed(1);
//     var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);
//     if (seconds < 60) {
//         return seconds + " Sec";
//     } else if (minutes < 60) {
//         return minutes + " Min";
//     } else if (hours < 24) {
//         return hours + " Hrs";
//     } else {
//         return days + " Days"
//     }
// }
zoomIn(){
  this.myDiagram.commandHandler.increaseZoom();
}
zoomOut(){
  this.myDiagram.commandHandler.decreaseZoom();
}
restZoom(){
  this.myDiagram.commandHandler.resetZoom();
}
generateImages (width:any, height:any) {
  // console.log(width);
  // console.log(height);
  // sanitize input
  width = parseInt(width);
  height = parseInt(height);
  if (isNaN(width)) width = 100;
  if (isNaN(height)) height = 100;
  // Give a minimum size of 50x50
  // width = Math.max(width, 50);
  // height = Math.max(height, 50);
  var imgDiv = document.getElementById('myDiagramDiv');
  // console.log(imgDiv)
  //imgDiv.innerHTML = ''; // clear out the old images, if any
  var db = this.myDiagram.documentBounds;
  // console.log(db);
  var boundswidth = db.width;
  var boundsheight = db.height;
  var imgWidth = width;
  var imgHeight = height;
  //var p = db.position.copy();
  var d = this.myDiagram.documentBounds;
  //making images
  // for (var i = 0; i< boundsheight; i += imgHeight) {
  var img:any
  //for (var j = 0; j < boundswidth; j += imgWidth) {
  img= this.myDiagram.makeImage({
  scale: 0,
  type: "image/jpeg",
  background: "white",
  //position: new go.Point(db.x, db.y),
  size: new go.Size(2000, 2000)
  });
  //}
  //}
  // console.log(img);
  var doc = new jsPDF();
  doc.addImage(img.src, 'JPEG', 15, 40, 180, 160);
  //if you need more page use addPage();
  // doc.addPage();
  doc.save("diagram.pdf");
  this.isdownloadpdf=false;
  this.ispdf.emit(this.isdownloadpdf);
  }

}