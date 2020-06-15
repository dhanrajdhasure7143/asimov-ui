import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import * as go from 'gojs';
import {ZoomSlider} from '../../../zoomSlider';
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
  @Input() public isdownload;
  public model:go.Model;
  @Output()
    public nodeClicked = new EventEmitter();
    public myDiagram: go.Diagram ;
    public isfrequency:boolean=false;


  constructor() { }

  ngOnInit() {
  //      this.spinner.show();
  // var me=this;
  // setTimeout(function(){
  //   me.spinner.hide()},5000);
    
    this.flowGraph();
    this.zoomSlider();
  }
  ngOnChanges(){
      this.myDiagram.div = null;
      this.flowGraph();
      
    this.zoomSlider();
    if(this.isplay == true){
      this.playAnimation();
    };
    if(this.isdownload == true){
      this.makeSvg();
    }

    $(".zoomSlider").nextAll().remove();
     
  }

  flowGraph() {
 
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
              initialContentAlignment: go.Spot.TopCenter,
                initialAutoScale: go.Diagram.Uniform,
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
        rows += obj.data.toolCount[i]+"<br>";
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
        rowsone += obj.data.toolCount[i]+"<br>";
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
                obj.scale = 1.8 ;
    }
  
    function hideToolTip(obj) {
      var node = obj.part;
     var toolTipDIV = document.getElementById('toolTipDIV');
     toolTipDIV.style.display = "none";
      var nodetext=obj.findObject("NodeTEXT")
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
         toShortLength: 7 },
        new go.Binding("points").makeTwoWay(),
        new go.Binding("curviness"),
        new go.Binding("zOrder"),
      // mark each Shape to get the link geometry with isPanelMain: true
      $(go.Shape, { isPanelMain: true, stroke: "black", strokeWidth: 7 },
              new go.Binding('strokeWidth','extraNode',function(progress) {
          return progress ? 0 : 7;
        }),
        new go.Binding('strokeWidth','highData',function(highData) {
          return highData ? 7 : 7;
        }),
        ),
      $(go.Shape, { isPanelMain: true, stroke: "blue", strokeWidth: 5 },
      new go.Binding('strokeWidth','extraNode',function(extraNode) {
        return extraNode ? 0 : 7;
      }),
        // new go.Binding('stroke','progress',function(progress) {
        //   return progress ? "green" : 'blue';
        // }), 
        new go.Binding('stroke', 'highData', function(highData) {
          return highData ? "red"  : 'blue';
        }),
        new go.Binding('strokeWidth','redColor',function(highData) {
          return highData ? 7 : 7;
        }),
      ),
      $(go.Shape, { isPanelMain: true, stroke: "white", strokeWidth: 3, name: "PIPE", strokeDashArray: [10, 10] },
      new go.Binding('stroke','extraNode',function(progress) {
        return progress ? "purple" : "white";
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
                    new go.Binding("text").makeTwoWay()),
                    {
                      // toolTip:
                      mouseEnter:function(e,obj,diagram) {
                        var data=e.diagram
                        // new go.Binding("text").makeTwoWay();
                        showLinkToolTip(e,obj,data);
                      },
                      mouseLeave:function(){
                        hideLinkToolTip()
                      }


                      }
        );

        function showLinkToolTip(e,obj,diagram) {
          var toolTipDIV = document.getElementById('linkToolTipDIV');
          var node = obj.part;
          console.log(obj.port,obj.fromNode.Bp);
          // resizable
            // node.port.fill="#0162cb";
            // node.port.stroke='#0162cb';
            var pt = diagram.lastInput.viewPoint;
          toolTipDIV.style.left =(pt.x + 110) + "px";
          toolTipDIV.style.top = (pt.y +  150) + "px";
    
          //   var pt = obj.location;
          // toolTipDIV.style.left = (pt.x) + "px";
          // toolTipDIV.style.top = (pt.y+330) + "px";
        
          var toolData="";
          var rows="";
          var name=obj.data.name;
          console.log('obj',obj.part.data.toolData);
          
          for( var i=0; i<obj.part.data.toolData.length-4; i++ ){
            toolData += obj.data.toolData[i]+"<br>";
          }
          for( var i=0; i<obj.data.toolDataCount.length-4; i++ ){
            rows += obj.data.toolDataCount[i]+"<br>";
          }
          // document.getElementById('nodename').innerHTML=name;
          document.getElementById('linktoolTipParagraph').innerHTML =  toolData;
          document.getElementById('linktoolTipText').innerHTML = '<br>'+ rows;
    
          var toolDataone="";
          var rowsone="";
          console.log('objData',obj.data);
          
          for( var i=4; i<obj.data.toolData.length; i++){
            toolDataone += obj.data.toolData[i]+"<br>";
          }
          for( var i=4; i<obj.data.toolDataCount.length; i++ ){
            rowsone += obj.data.toolDataCount[i]+"<br>";
          }
          document.getElementById('linktoolTipParagraphone').innerHTML =  toolDataone;
          document.getElementById('linktoolTipTextone').innerHTML = '<br>'+ rowsone;
          toolTipDIV.style.display = "block";
              // var nodetext=obj.findObject("NodeTEXT")
              // var textNode = obj.findObject("TEXT");
              // var countNode= node.findObject("countNode");
              //       textNode.stroke="rgba(0, 0, 0, .87)";
              //       nodetext.stroke="white"
              //       countNode.fill='white';
              //       obj.scale = 1.8 ;
        }
        function hideLinkToolTip(){
          var toolTipDIV = document.getElementById('linkToolTipDIV');
     toolTipDIV.style.display = "none";
        }
        
    this.myDiagram.model = new go.GraphLinksModel(this.model1, this.model2);
  }
  zoomSlider(){
    new ZoomSlider(this.myDiagram).remove();

    var zoomSlider = new ZoomSlider(this.myDiagram,
      {
          alignment: go.Spot.BottomCenter, alignmentFocus: go.Spot.BottomCenter,
           size: 200,orientation: 'horizontal'
         }
         );
  }
  playAnimation(){
    
    var animation = new go.Animation();
      animation.easing = go.Animation.EaseLinear;
      this.myDiagram.links.each(function(link) {
        animation.add(link.findObject("PIPE"), "strokeDashOffset", 20, 0)},);
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
    this.isdownload=false;
  }

  makeSvg() {
    var svg = this.myDiagram.makeSvg({ scale: 1, background: "white" });
    var svgstr = new XMLSerializer().serializeToString(svg);
    var blob = new Blob([svgstr], { type: "image/svg+xml" });
    this.myCallback(blob);
  }


}