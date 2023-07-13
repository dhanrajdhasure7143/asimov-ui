import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MenuItem } from 'primeng/api';
import * as dagreD3 from 'dagre-d3';
import * as d3 from 'd3';
import { jsPlumb, jsPlumbInstance } from "jsplumb";

@Component({
  selector: 'app-copilot-chat-two',
  templateUrl: './copilot-chat-two.component.html',
  styleUrls: ['./copilot-chat-two.component.css']
})
export class CopilotChatTwoComponent implements OnInit {

  isPlayAnimation: boolean = false;
  public model: any = [];
  jsPlumbInstance:any;
  constructor() {
    
  }

  @ViewChild('exportSVGtoPDF') exportSVGtoPDF: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('render') render: ElementRef;
  public model2:any;

  items: MenuItem[];
  messages:any=[];
  message:any="";
  nodes:any=[];
  ngOnInit(): void {
    this.jsPlumbInstance = jsPlumb.getInstance();
    this.jsPlumbInstance.importDefaults({
      Connector: ["Flowchart", { curviness: 200, cornerRadius: 5 }],
      overlays: [
        ["Arrow", { width: 12, length: 12, location: 0.5 }],
        ["Label", { label: "FOO" }],
      ],})
      this.items = [{
      label: 'History',
      items: [{
          label: 'Client Service Reporting',
          command: () => {
          }
      }]}]


      this.model=[
        {"key":0,"name":"Vendor Creates Invoice"},
        {"key":1,"name":"Scan Invoice"},
        {"key":2,"name":"Enter in SAP"},
        {"key":3,"name":"Book Invoice"},
        {"key":4,"name":"Clear Invoice"},
        {"key":5,"name":"Due Date Passed"}
      ]
     // this.processGraph();
      this.model2 =[{
          "from": "Vendor Creates Invoice","to": "Scan Invoice","text": 1,},
        {
          "from": "Scan Invoice",
          "to": "Enter in SAP",
          "text": 1,
        },
        {
          "from": "Enter in SAP",
          "to": "Book Invoice",
          "text": 1,
        },
        {
          "from": "Book Invoice",
          "to": "Clear Invoice",
          "text": 1,
        },
        {
          "from": "Clear Invoice",
          "to": "Due Date Passed",
          "text": 1,
        },
      ]
      for(let i=0;i<10;i++)
      {

        let node={
          id:i+"bot",
          selectedNodeTask:"Sample", 
          x:((i+2)*100)+"px",
          y:"10px",
          
        }
        console.log(node)
        this.nodes.push(node);
        setTimeout(()=>{
          this.populateNodes(node);
        },200)

      }

        for(let j=0;j<10;j++)
        {
          if(j<10){
  
            this.jsPlumbInstance.connect({
              endpoint: [
                "Dot",
                {
                  radius: 3,
                  cssClass: "myEndpoint",
                  width: 8,
                  height: 8,
                },
              ],
              source:j+"bot",
              target:(j+1)+"bot",
              anchors: ["Right", "Left"],
              detachable: true,
              paintStyle: { stroke: "#404040", strokeWidth: 2 },
              overlays: [["Arrow", { width: 12, length: 12, location: 1 }]],
            });
          }
        }

      
    }


  generateFlowChart()
  {

  }
  processGraph() {
    if (this.model.length > 0) {
      var g = new dagreD3.graphlib.Graph().setGraph({ ranksep: 100, rankdir: "TB" });
      var me = this
      const w = 1300;
      d3.select("svg").remove()
      let svg = d3.select("#exportSVGtoPDF").append("svg")
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
        .attr("width", w)
        .attr('id', 'render')
        .attr("class", "pisvg")

      d3.select("marker").append("path")
        .attr("d", "M 0 0 L 10 5 L 0 10 z")
        .style("stroke-width", 1)

      d3.select("svg").append("marker")
        .attr("id", "arrow3")
        .attr("class", "marker3")
        .attr("viewBox", "5 5 5 5")
        .attr("refX", "8")
        .attr("refY", "5")
        .attr("markerWidth", "5")
        .attr("markerHeight", "5")
        .attr("orient", "auto")
        .attr("fill", "black")
        .append("path")
        .attr("d", "M 0 0 L 10 5 L 0 10 z")
        .style("stroke-width", 2)

      var inner = svg.append("g");
      var states: any = {}
        for (var j = 0; j < this.model.length; j++) {
            var nodeName = this.model[j].name
            states[nodeName] = { 
            }
          }

      Object.keys(states).forEach(function (state) {
        var value = states[state];
        value.rx = value.ry = 10;
        value.lableStyle = "font-zie: 4em";
        g.setNode(state, value);
      });

      // Set up the edges
        for (var i = 0; i < this.model.length-1; i++) {
            g.setEdge(this.model[i].name, this.model[i+1].name, {  labelType: "html", style: "stroke: black; stroke-width: 5px;marker-end:url(#arrow3);fill:none;",
              curve: d3.curveBasis, arrowhead: "normal"
            })
        }

      g.nodes().forEach(function (v) {
        var node = g.node(v);
            node.width = 400
            node.height = 50
            node.style  = "fill: #bab7bf";
          // nodesArray.push(node)
        node.rx = node.ry = 5;
      });

     const handleZoom = (e) => inner.attr('transform', e.transform);
      const zoom = d3.zoom().on('zoom', handleZoom);

      svg.call(zoom);
      var render = new dagreD3.render();

       d3.select("body")
        .append("div")
      render(inner, g);

      // let nodes_Array = d3.selectAll("g.node rect")['_groups'][0];
      // console.log(nodes_Array)
      // // let nodes= inner.selectAll('g.node')
      // // console.log(nodes)
      // nodes_Array.forEach((element, i) => {
      //   console.log(nodes_Array[i]['attributes'])
      //   // nodes_Array[i]['attributes'][1].value = "font-size: 13px;fill: #fff"

      // });


      d3.selectAll("g g.label g")
        .attr("transform", "translate(-5,-15)")

      d3.selectAll("g text")
        .attr("text-anchor", "middle")

      d3.selectAll("g text")
        .style('font-size', '25')
        .style('font-weight', '600')

      // graph auto adjust to the screen
      var initialScale = 0.42;
      svg.call(zoom.transform, d3.zoomIdentity.translate((svg.attr("width") - g.graph().width * initialScale) / 4, 53).scale(initialScale));
      svg.attr('height', g.graph().height * initialScale + 53);
    }
  }


  sendMessage(){
    let message={
      id:(new Date()).getTime(),
      message:this.message,
      user:localStorage.getItem("ProfileuserId")
    }
    this.messages.push(message);
    this.messages = [
      {
        "uuid": "text_uuid1",
        "message": "This is sample text response",
        "components": ["Buttons"],
        "values": [
          [
            {
              "label": "button label",
              "submitValue": "submit value"
            },
            {
              "label": "button label2",
              "submitValue": "submit value2"
            }
          ]
        ]
      },
      {
        "uuid": "text_uuid2",
        "message": ["This is sample text response2"],
        "components": ["Buttons"],
        "values": [
          [
            {
              "label": "button label"
            },
            {
              "label": "button label2"
            }
          ]
        ]
      },
      {
        "uuid":"text_uuid1",
        "message":"This is sample text response"
      },
      {
        "uuid":"text_uuid2",
        "message":["This is sample text response"]
      },
      {
        "uuid":"text_uuid3",
        "message":[" <b>This</b> is sample text response2, <a href='www.epsoftinc.com' target='_blank'> click here </a>" ]
      }
    ];
    let systemMessage={
      id:(new Date()).getTime(),
      message:"Hi Kiran Mudili",
      user:"SYSTEM"
    }
    this.model.push({
      key:this.model.length,
      name:this.message
    })
    this.model2.push({
      from:this.model[this.model.length-1].name,
      to:this.message,
      text:1
    })
    this.processGraph();
    this.message=""
    this.messages.push(systemMessage);

  }


  populateNodes(nodeData) {
    const nodeIds = this.nodes.map(function (obj) {
      return obj.id;
    });
    var self = this;
    this.jsPlumbInstance.draggable(nodeIds, {
      containment: true,
      stop: function (element) {
        self.updateCoordinates(element);
      },
    });

    const rightEndPointOptions = {
      endpoint: [
        "Dot",
        {
          radius: 2,
          cssClass: "myEndpoint",
          width: 8,
          height: 8,
        },
      ],

      paintStyle: { stroke: "#d7eaff", fill: "#d7eaff", strokeWidth: 2 },
      isSource: true,
      connectorStyle: { stroke: "#404040", strokeWidth: 2 },
      anchor: "Right",
      maxConnections: -1,
      cssClass: "path",
      Connector: ["Flowchart", { curviness: 90, cornerRadius: 5 }],
      connectorClass: "path",
      connectorOverlays: [["Arrow", { width: 10, length: 10, location: 1 }]],
    };
    const leftEndPointOptions = {
      endpoint: [
        "Dot",
        {
          radius: 2,
          cssClass: "myEndpoint",
          width: 8,
          height: 8,
        },
      ],
      paintStyle: { stroke: "#d7eaff", fill: "#d7eaff", strokeWidth: 2 },
      isTarget: true,
      connectorStyle: { stroke: "#404040", strokeWidth: 2 },
      anchor: "Left",
      maxConnections: -1,
      Connector: ["Flowchart", { curviness: 90, cornerRadius: 5 }],
      cssClass: "path",
      connectorClass: "path",
      connectorOverlays: [["Arrow", { width: 10, length: 10, location: 1 }]],
    };
    if (nodeData.name != "STOP")
      this.jsPlumbInstance.addEndpoint(nodeData.id, rightEndPointOptions);
    if (nodeData.name != "START")
      this.jsPlumbInstance.addEndpoint(nodeData.id, leftEndPointOptions);
  }
  updateCoordinates(dragNode) {
    var nodeIndex = this.nodes.findIndex((node) => {
      return node.id == dragNode.id;
    });
    this.nodes[nodeIndex].x = dragNode.x;
    this.nodes[nodeIndex].y = dragNode.y;
  }

  submitButton(value){

  }

}

