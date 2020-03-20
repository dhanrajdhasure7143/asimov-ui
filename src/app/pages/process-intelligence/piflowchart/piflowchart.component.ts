import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import * as go from 'gojs';
import {ZoomSlider} from '../../../zoomSlider';

@Component({
  selector: 'app-piflowchart',
  templateUrl: './piflowchart.component.html',
  styleUrls: ['./piflowchart.component.css']
})
export class PiflowchartComponent implements OnInit {

  @Input()  public model1 ;
  @Input()  public model2 ;
  public model:go.Model;
  @Output()
    public nodeClicked = new EventEmitter();
    public myDiagram: go.Diagram ;

  constructor() { }

  ngOnInit() {
    this.model = new go.GraphLinksModel(this.model1, this.model2);
    this.flowGraph();
  }

  flowGraph() {
    var $ = go.GraphObject.make; // for conciseness in defining templates
    // some constants that will be reused within templates
    var roundedRectangleParams = {
        parameter1: 2, // set the rounded corner
        spot1: go.Spot.TopLeft,
        spot2: go.Spot.BottomRight // make content go all the way to inside edges of rounded corners
    };
    this.myDiagram =
        $(go.Diagram, "myDiagramDiv", // must name or refer to the DIV HTML element
            {
                // initialContentAlignment: go.Spot.Center,
                // autoScale: go.Diagram.UniformToFill,
                maxSelectionCount: 1,
                hasHorizontalScrollbar: false,
                hasVerticalScrollbar: false,
                "animationManager.initialAnimationStyle": go.AnimationManager.None,
                "InitialAnimationStarting": function(e) {
                    var animation = e.subject.defaultAnimation;
                    animation.easing = go.Animation.EaseOutExpo;
                    animation.duration = 900;
                    animation.add(e.diagram, 'scale', 0.1, 1);
                    animation.add(e.diagram, 'opacity', 0, 1);
                },
                // have mouse wheel events zoom in and out instead of scroll up and down
                "toolManager.mouseWheelBehavior": go.ToolManager.WheelScroll,
                // support double-click in background creating a new node
                // "clickCreatingTool.archetypeNodeData": {
                //     text: "new node"
                // },
                // enable undo & redo
                "undoManager.isEnabled": true,
                positionComputation: function(diagram, pt) {
                    return new go.Point(Math.floor(pt.x), Math.floor(pt.y));
                }
            });
    // when the document is modified, add a "*" to the title and enable the "Save" button
    // this.myDiagram.addDiagramListener("Modified", function(e) {});

    function showToolTip(obj, diagram) {
      var toolTipDIV = document.getElementById('toolTipDIV');
      var pt = obj.location;
      toolTipDIV.style.left = (pt.x+120) + "px";
      toolTipDIV.style.top = (pt.y+330) + "px";
      var toolData=""
      var rows="";
      for( var i=0; i<obj.data.tool.length; i++ ){
        toolData += obj.data.tool[i]+"<br>";
      }
      for( var i=0; i<obj.data.toolCount.length; i++ ){
        rows += obj.data.toolCount[i]+"<br>";
      }
      document.getElementById('toolTipParagraph').innerHTML =  toolData;
      document.getElementById('toolTipText').innerHTML = '<br>'+ rows;
      toolTipDIV.style.display = "block";
    }
  
    function hideToolTip() {
     var toolTipDIV = document.getElementById('toolTipDIV');
     toolTipDIV.style.display = "none";
    }

    function incrementCounter(e, obj) {
      var node = obj.part;
      var data = node.data;
      if (data && typeof(data.clickCount) === "number") {
        node.diagram.model.commit(function(m) {
          m.set(data, "clickCount", data.clickCount + 1);
        }, "clicked");
          if ( data.clickCount % 2 == 0){
              hideToolTip();
            node.part.port.fill="white";
            node.part.port.stroke='black';
          }else{
            var data = e.diagram;
            showToolTip(obj , data);
            node.part.port.fill="#0162cb"
            node.part.port.stroke='#0162cb';
          }
        
      }
    }

    // define the Node template
    this.myDiagram.nodeTemplate =
        $(go.Node, "Auto", {
                isShadowed: false,
                shadowBlur: 1,
                shadowOffset: new go.Point(0, 1),
                shadowColor: "rgba(0, 0, 0, .14)"
            },
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
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
                // cursor: "pointer",
                width:120,
            }),

              $(go.Panel, go.Panel.Vertical,
            $(go.TextBlock, {
                    font: "bold 8pt helvetica, bold arial, sans-serif",
                    margin: 2,
                    stroke: "rgba(0, 0, 0, .87)",
                    // alignment: go.Spot.Center ,
                    editable: false,
                },
                new go.Binding("text","name").makeTwoWay()),

            $(go.TextBlock ,{
              font: "bold 7pt helvetica, bold arial, sans-serif",
              margin: 2,
              background:"#0162cb",
              width:30,
              height: 15,
              stroke: "rgba(0, 0, 0, .87)",
              alignment: go.Spot.Center ,
              verticalAlignment: go.Spot.Center,
              textAlign: "center",
              editable: false,
          },new go.Binding("text","count").makeTwoWay()),
              ),
              
            {
              click: incrementCounter,
                // click: function(e, obj) {
                //   var data = e.diagram;
                //   showToolTip(obj , data);
                // },
                selectionChanged: function(part) {
                    var shape = part.elt(0);                     
                    shape.fill = part.isSelected ? "#0162cb" : "white";
                    hideToolTip();
                    var data=part.data
                    data.clickCount=0;
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
                    strokeWidth: 3
                }),
                // $(go.Placeholder) // a Placeholder sizes itself to the selected Node
            ),
        );
  
    this.myDiagram.nodeTemplateMap.add("Start",
        $(go.Node, "Spot", {
                desiredSize: new go.Size(35, 35)
            },
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            $(go.Shape, "Circle", {
                fill: "#52ce60",
                stroke: null,
                portId: "",
                fromLinkable: true,
                fromLinkableSelfNode: true,
                fromLinkableDuplicates: true,
                toLinkable: true,
                toLinkableSelfNode: true,
                toLinkableDuplicates: true,
                cursor: "pointer"
            }),
            $(go.TextBlock, "Start", {
                font: "bold 8pt helvetica, bold arial, sans-serif",
                stroke: "whitesmoke"
            })
        )
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
                fromLinkable: true,
                fromLinkableSelfNode: true,
                fromLinkableDuplicates: true,
                toLinkable: true,
                toLinkableSelfNode: true,
                toLinkableDuplicates: true,
                cursor: "pointer"
            }),
            // $(go.Shape, "Circle", { fill: null, desiredSize: new go.Size(65, 65), strokeWidth: 2, stroke: "whitesmoke" }),
            $(go.TextBlock, "End", {
                font: "bold 8pt helvetica, bold arial, sans-serif",
                stroke: "whitesmoke"
            })
        )
    );
    // replace the default Link template in the linkTemplateMap
    this.myDiagram.linkTemplate =
        $(go.Link, // the whole link panel
            {
                curve: go.Link.Bezier,
                adjusting: go.Link.Stretch,
                reshapable: true,
                relinkableFrom: true,
                relinkableTo: false,
                toShortLength: 3
            },
            new go.Binding("points").makeTwoWay(),
            new go.Binding("curviness"),
            $(go.Shape, // the link shape
                {
                    strokeWidth: 2,
                    stroke: "darkblue",
                },
            ),
            $(go.Shape, // the arrowhead
                {
                    toArrow: "standard",
                    stroke: "darkblue",
                    strokeWidth: 2.5,
                },
                new go.Binding('fill',"darkblue"),
            ),
                $(go.TextBlock,{ segmentOffset: new go.Point(0, 10) }, // the label text
                    {
                        textAlign: "center",
                        font: "9pt helvetica, arial, sans-serif",
                        margin: 0,
                        editable:false 

                    },
                    // editing the text automatically updates the model data
                    new go.Binding("text").makeTwoWay())
        );
        var zoomSlider = new ZoomSlider(this.myDiagram,
          {
              alignment: go.Spot.BottomCenter, alignmentFocus: go.Spot.BottomCenter,
               size: 200,orientation: 'horizontal'
             });

    this.myDiagram.model = this.model;
  }

}