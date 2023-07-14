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
  jsPlumbInstance: any;
  constructor() {

  }

  @ViewChild('exportSVGtoPDF') exportSVGtoPDF: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('render') render: ElementRef;
  public model2: any;

  items: MenuItem[];
  messages: any = [];
  message: any = "";
  nodes: any = [];
  graphJsonData: any = [{
    id: "1",
    selectedNodeTask: "Pre-Boarding From Sent To Candidate",
    x: "100px",
    y: "100px",
    path: "../../../../assets/circle.png",
  },
  {
    id: "2",
    selectedNodeTask: "Gather and Organize Responses",
    x: "100px",
    y: "200px",
    path: "../../../../assets/circle.png"
  },
  {
    id: 3,
    selectedNodeTask: "Enter gathered details as employee details",
    x: "100px",
    y: "300px",
    path: "../../../../assets/circle.png"
  },
  {
    id: 4,
    selectedNodeTask: "Create Email account",
    x: "100px",
    y: "400px",
    path: "../../../../assets/circle.png"
  },
  {
    id: 5,
    selectedNodeTask: "Trigger, Welcome Email",
    x: "100px",
    y: "500px",
    path: "../../../../assets/circle.png"
  }]
  showTable:boolean = false;
  tableData:any[] = [];

  ngOnInit(): void {
    this.jsPlumbInstance = jsPlumb.getInstance();
    this.jsPlumbInstance.importDefaults({
      Connector: ["Flowchart", { curviness: 200, cornerRadius: 5 }],
      overlays: [
        ["Arrow", { width: 12, length: 12, location: 0.5 }],
        ["Label", { label: "FOO" }],
      ],
    })
    this.items = [{
      label: 'History',
      items: [{
        label: 'Client Service Reporting',
        command: () => {
        }
      }]
    }]
   this.tableData = [
    {name:"IT from sent to the manager"},
    {name:"Manager fills the form"},
    {name:"IT team create Email ID"},
    {name:"IT team assign a system"},
    {name:"System Access for the user"},
   ]
  

  }


  addConnection(source:String, target:String)
  {
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
      source:source,
      target: target,
      anchors: ["Right", "Left"],
      detachable: true,
      paintStyle: { stroke: "#404040", strokeWidth: 2 },
      overlays: [["Arrow", { width: 12, length: 12, location: 1 }]],
    });
  }


  generateFlowChart() {

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
      for (var i = 0; i < this.model.length - 1; i++) {
        g.setEdge(this.model[i].name, this.model[i + 1].name, {
          labelType: "html", style: "stroke: black; stroke-width: 5px;marker-end:url(#arrow3);fill:none;",
          curve: d3.curveBasis, arrowhead: "normal"
        })
      }

      g.nodes().forEach(function (v) {
        var node = g.node(v);
        node.width = 400
        node.height = 50
        node.style = "fill: #bab7bf";
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


  sendMessage(value?:any){
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
        "user" :'SYSTEM',
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
        "user" :'SYSTEM',
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
    this.message=""
    this.messages.push(systemMessage);
    this.message = "";

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
    if (nodeData.selectedNodeTask != "STOP")
      this.jsPlumbInstance.addEndpoint(nodeData.id, rightEndPointOptions);
    if (nodeData.selectedNodeTask != "START")
      this.jsPlumbInstance.addEndpoint(nodeData.id, leftEndPointOptions);
  }
  updateCoordinates(dragNode) {
    var nodeIndex = this.nodes.findIndex((node) => {
      return node.id == dragNode.id;
    });
    this.nodes[nodeIndex].x = dragNode.x;
    this.nodes[nodeIndex].y = dragNode.y;
  }

  submitButton(value?:any){
    this.loadGraph()
  }


  addNewStep()
  {
  }
  loadGraph()
  {

    let startNode = {
      id: "START",
      selectedNodeTask: "START",
      x:  "0px",
      y:"200px",
      path: "../../../../assets/images/RPA/Start.png"

    }
    this.nodes.push(startNode);
    setTimeout(() => {
      this.populateNodes(startNode);
    }, 200)
    for (let i = 0; i < this.graphJsonData.length; i++) {
      this.graphJsonData[i]["id"]=String(i+1);
      this.graphJsonData[i]["x"]=((i+1)*120)+"px";
      this.graphJsonData[i]["y"]="200px";
      this.nodes.push(this.graphJsonData[i]);
      setTimeout(() => {
        this.populateNodes(this.graphJsonData[i]);
      }, 200)

    }
    let stopnode = {
      id: "STOP",
      selectedNodeTask: "STOP",
      x:((this.graphJsonData.length+1)*120)+"px",
      y:"200px",
      path: "../../../../assets/images/RPA/Stop.png"

    }
    this.nodes.push(stopnode);

    setTimeout(() => {
      this.populateNodes(stopnode);
    }, 200)
    setTimeout(() => {
      this.addConnection("START", this.graphJsonData[0].id)
      for (let j = 0; j < this.graphJsonData.length-1; j++) {
        this.addConnection(this.graphJsonData[j].id, this.graphJsonData[j+1].id)
      }
      this.addConnection(this.graphJsonData[this.graphJsonData.length-1].id,"STOP");
    }, 200)
  }

}

