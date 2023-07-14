import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { jsPlumb, jsPlumbInstance } from "jsplumb";
import { HttpClient, HttpBackend } from '@angular/common/http';
//import * as copilot from '../../../../assets/jsons/copilot-req-res.json';
@Component({
  selector: 'app-copilot-chat-two',
  templateUrl: './copilot-chat-two.component.html',
  styleUrls: ['./copilot-chat-two.component.css']
})
export class CopilotChatTwoComponent implements OnInit {

  isPlayAnimation: boolean = false;
  public model: any = [];
  jsPlumbInstance: any;
  copilotJson:any={};
  constructor() {
    //this.copilotJson=copilot;
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
  //  console.log("check",this.copilotJson)
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




  sendMessage(value?:any){
    let message={
      id:(new Date()).getTime(),
      message:this.message,
      user:localStorage.getItem("ProfileuserId")
    }
    this.messages.push(message);
    // let response=copilot.find((item:any)=>item.message.includes(this.message)).response;
    // if(response)
    // {
    //   console.log(response)
    //   let systemMessage={
    //     id:(new Date()).getTime(),
    //     user:"SYSTEM",
    //     message:response.message,
    //     steps:response.steps
    //   }
    //   this.messages.push(systemMessage);
    //   this.message = "";
    // }
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
              "label": "Load Graph"
            },
            {
              "label": "Load Form"
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
    // let systemMessage={
    //   id:(new Date()).getTime(),
    //   message:"Hi Kiran Mudili",
    //   user:"SYSTEM"
    // }


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

  isGraphLoaded:boolean=false;
  submitButton(value?:any){
    this.showTable=false;
    if(value.label=="Load Graph")
    {
      if(!this.isGraphLoaded)
        this.loadGraph()
    }
    else if(value.label=="Load Form")
      this.showTable=true;
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
      this.isGraphLoaded=true;
    }, 200)
  }

}

