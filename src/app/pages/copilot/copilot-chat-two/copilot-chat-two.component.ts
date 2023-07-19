import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { jsPlumb, jsPlumbInstance } from "jsplumb";
import { HttpClient, HttpBackend } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataTransferService } from '../../services/data-transfer.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
interface City {
  name: string,
  code: string
}
//import * as copilot from '../../../../assets/jsons/copilot-req-res.json';
@Component({
  selector: 'app-copilot-chat-two',
  templateUrl: './copilot-chat-two.component.html',
  styleUrls: ['./copilot-chat-two.component.css']
})
export class CopilotChatTwoComponent implements OnInit {
  cities: City[];

  selectedCity: City;
  isPlayAnimation: boolean = false;
  public model: any = [];
  jsPlumbInstance: any;
  @ViewChild('op', {static: false}) overlayModel;
  @ViewChild('popupMenu', {static:false}) popupMenuOverlay;
  copilotJson: any = [
    {
      "message": "Provisioning Users",
      "response": {
        "message": "Sure, here are a few examples of onboarding users process flow. You can choose one that matches or ‘closely’ matches your organization’s process. If none of them match, please tell us more about the process you would like to automate.",
        "steps": [
          {
            "id": 1,
            "type": "PROCESS-IMAGE",
            "label": "Onboard Users"
          },
          {
            "id": 2,
            "type": "PROCESS-IMAGE",
            "label": "Account Creation"
          },
          {
            "id": 3,
            "type": "PROCESS-IMAGE",
            "label": "Employee Onboarding"
          }
        ]
      }
    },
    {
      "message": "Employee Onboarding",
      "response": {
        "message": "Would you prefer modifying these steps to match your organization’s flow?",
        "steps": [
          {
            "id": 4,
            "type": "LOAD-GRAPH"
          }
        ]
      }
    },
    {
      "message": "Yes. Along with sending pre-boarding form, my team sends the onboarding form to the designated Reporting Manager. Both these tasks happen in parallel.",
      "response": {
        "message": "Your workflow has been updated with the additional step. Would you like to make any further modifications?",
        "steps": [
          {
            "id": 5,
            "type": "ADD-NODE"
          },
          {
            "id": 51,
            "type": "BUTTON",
            "label": "Yes, I want to",
            "disable":false
          },
          {
            "type": "BUTTON",
            "label": "No, contintue to next step",
            "disable":false
          }
        ]
      }
    },
    {
      "message": "No, contintue to next step",
      "response": {
        "message": "What are the systems you use in this process?",
        "steps": [
          {
            "id": 6,
            "type": "IMG-BUTTON",
            "label": "Workday",
            "disable":false
          },
          {
            "id": 6,
            "type": "IMG-BUTTON",
            "label": "SAP SuccessFactors",
            "disable":false
          },
          {
            "id": 6,
            "type": "BUTTON",
            "label": "None of the above",
            "disable":false
          }
        ]
      }
    },
    {
      "message": "Zoho",
      "response": {
        "message": "What is the Email system that you use in your organization?",
        "steps": [
          {
            "type": "UPDATE-NODE-1",
          },
          {
            "type": "BUTTON",
            "label": "Outlook by Microsoft",
            "disable":false
          },
          {
            "type": "BUTTON",
            "label": "Gmail from Google",
            "disable":false
          }
        ]
      }
    },
    {
      "message": "Outlook by Microsoft",
      "response": {
        "message": "Systems are updated in your workflow. Select an option from here to proceed further:",
        "steps": [
          {
            "type":"UPDATE-NODE-2"
          },
          {
            "type": "BUTTON",
            "label": "Save as Draft",
            "disable":false
          },
          {
            "type": "BUTTON",
            "label": "Analyse this Process",
            "disable":false
          },
          {
            "type": "OUTLINE-BUTTON",
            "label": "Generate Bot Design",
            "disable":false
          },
          {
            "type": "MESSAGE",
            "label": "If you're still uncertain, we can arrange for our customer executive to contact you",
          },
          {
            "type": "OUTLINE-BUTTON",
            "label": "Have our executive contact you",
            "disable":false
          }
        ]
      }
    },
    {
      "message": "Analyse this Process",
      "response": {
        "message": "Fill the form with time taken for each of the manual steps in the process. This will allow us to calculate the overall time taken for the entire workflow. Once you are done, click on submit below to create the process graph.",
        "steps": [
          {
            "type": "LOAD-STEPS-TABLE"
          },
          {
            "type": "BUTTON",
            "label": "Submit",
            "disable":false
          },
          {
            "type": "BUTTON",
            "label": "Save as Draft",
            "disable":false
          },
          {
            "type": "MESSAGE",
            "label": "If you're still uncertain, we can arrange for our customer executive to contact you",
          },
          {
            "type": "OUTLINE-BUTTON",
            "label": "Have our executive contact you",
            "disable":false
          }
        ]
      }
    },
    {
      "message": "Submit",
      "response": {
        "message": "",
        "steps": [
          {
            "id": 4,
            "type": "REDIRECT-PI"
          }
        ]
      }
    },
    {
      "message": "Open in Bot Designer",
      "response": {
        "message": "",
        "steps": [
          {
            "id": 4,
            "type": "REDIRECT-RPA"
          }
        ]
      }
    },
  ];
  constructor(private router:Router, 
    private dt:DataTransferService,
    private loaderService:LoaderService
    ) {
      this.cities = [
        {name: '00', code: 'NY'},
        {name: '01', code: 'RM'},
        {name: '02', code: 'LDN'},
        {name: '03', code: 'IST'},
        {name: '04', code: 'PRS'},
        {name: '05', code: 'NY'},
        {name: '06', code: 'RM'},
        {name: '07', code: 'LDN'},
        {name: '08', code: 'IST'},
        {name: '09', code: 'PRS'}
    ];
    //this.copilotJson=copilot;
  }

  @ViewChild('exportSVGtoPDF') exportSVGtoPDF: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('render') render: ElementRef;
  @ViewChild('nodeImage', { read: ElementRef }) nodeImage: ElementRef;
  public model2: any;

  nodeMenuItems: MenuItem[];
  messages: any = [];
  message: any = "";
  nodes: any = [];
  graphJsonData: any = [{
    id: "1",
    selectedNodeTask: "Pre Boarding Form Sent",
    x: "100px",
    y: "100px",
    path: "../../../../assets/copilot/graph-icons/General.png",
    updated:false
  },
  {
    id: "2",
    selectedNodeTask: "Gather and Organize Responses",
    x: "100px",
    y: "200px",
    path: "../../../../assets/copilot/graph-icons/General.png",
    updated:false

  },
  {
    id: 3,
    selectedNodeTask: "Enter employee details",
    x: "100px",
    y: "300px",
    path: "../../../../assets/copilot/graph-icons/General.png",
    updated:false

  },
  {
    id: 4,
    selectedNodeTask: "Create Email account",
    x: "100px",
    y: "400px",
    path: "../../../../assets/copilot/graph-icons/General.png",
    updated:false
  },
  {
    id: 5,
    selectedNodeTask: "Trigger, Welcome Email",
    x: "100px",
    y: "500px",
    path: "../../../../assets/copilot/graph-icons/General.png",
    updated:false

  }]
  showTable: boolean = false;
  tableData: any[] = [];
  // minOptins: number[]  = Array.from({length :60 }, (_, index)=> index+1)
  minOptins: string[] = Array.from(Array(61).keys(), num => (num).toString().padStart(2, '0'));
  hrsOptins: string[]  = Array.from(Array(25).keys(), num =>num.toString().padStart(2,"0"))
  daysOptins: string[]  = Array.from(Array(32).keys(), num =>num.toString().padStart(2,"0"))
  loader:boolean=false;
  isChatLoad:boolean = false;

  ngOnInit(): void {
    this.loader=true;
    this.jsPlumbInstance = jsPlumb.getInstance();
    this.jsPlumbInstance.importDefaults({
      Connector: ["Flowchart", { curviness: 200, cornerRadius: 5 }],
      overlays: [
        ["Arrow", { width: 6, length: 6, location: 0.5 }],
        ["Label", { label: "FOO" }],
      ],
    })
    this.nodeMenuItems = [
      {
          label: 'Options',
          items: [
              {
                  label: 'AddNode',
                  icon: 'pi pi-refresh',
                  command: () => {
                      this.addNode({});
                  }
              },
              {
                  label: 'Delete',
                  icon: 'pi pi-times',
                  command: () => {
                      //this.delete();
                  }
              }
          ]
      },
      {
          label: 'Navigate',
          items: [
              {
                  label: 'Angular',
                  icon: 'pi pi-external-link',
                  url: 'http://angular.io'
              },
              {
                  label: 'Router',
                  icon: 'pi pi-upload',
                  routerLink: '/fileupload'
              }
          ]
      }
  ];

  
    this.tableData = [
      { name: "IT from sent to the manager",min:"00",hrs:"00",days:"00"},
      { name: "Manager fills the form",min:"00",hrs:"00",days:"00" },
      { name: "IT team create Email ID",min:"00",hrs:"00",days:"00" },
      { name: "IT team assign a system",min:"00",hrs:"00",days:"00" },
      { name: "System Access for the user",min:"00",hrs:"00",days:"00" },
    ],

    this.dt.getCoplilotData.subscribe((response:any)=>{
      if(response!=undefined)
      {
        setTimeout(()=>{
          this.messages=response.messages;
          if(response.isGraphLoaded)
          {
            this.loadGraphIntiate("Load Graph");
          }
          if (response.isNodeLoaded) {
            setTimeout(()=>{
              this.loadGraphIntiate("Load Node");
            },300)
          }
          if (response.isNodeUpdated) {
              this.loadGraphIntiate("Update Node 1");
              this.loadGraphIntiate("Update Node 2");
          }
          if (response.isTableLoaded) {
            this.tableData=response.tableData;
            setTimeout(()=>{
              this.loadGraphIntiate("Load Form");
              this.loader=false;
            },500)
          }
          setTimeout(()=>{
            var objDiv = document.getElementById("chat-grid");
            objDiv.scrollTop = objDiv.scrollHeight;
          },200)
          //this.dt.setCopilotData(undefined)
        
        },1000)
      }
      else
      {
        this.loader=false
        this.messages.push({
          id: (new Date()).getTime(),
          user: "SYSTEM",
          message: "Hi, what process would you like to automate?",
          steps: []
        })
    
      }
    })
  }






  sendMessage(value?: any, messageType?:String) {
    this.isChatLoad = true;
    setTimeout(() => { 
    let message = {
      id: (new Date()).getTime(),
      message: value,
      user: localStorage.getItem("ProfileuserId")
    }
    if(messageType != 'LABEL')
      this.messages.push(message);
    let response = this.copilotJson.find((item: any) => item.message == (value))?.response ?? undefined;
    if (response) {
      let systemMessage = {
        id: (new Date()).getTime(),
        user: "SYSTEM",
        message: response.message,
        steps: response.steps
      }
      if (response.steps.find((item: any) => item.type == "LOAD-GRAPH")) {
        this.loadGraphIntiate("Load Graph");
      }
      else if (response.steps.find((item: any) => item.type == "LOAD-STEPS-TABLE")) {
        this.loadGraphIntiate("Load Form")
      }
      else if (response.steps.find((item: any) => item.type == "ADD-NODE")) {
        this.loadGraphIntiate("Load Node");
      }
      else if (response.steps.find((item: any) => item.type == "UPDATE-NODE-1")) {
        this.loadGraphIntiate("Update Node 1");
      }
      else if (response.steps.find((item: any) => item.type == "UPDATE-NODE-2")) {
        this.loadGraphIntiate("Update Node 2");
      }
      else if (response.steps.find((item: any) => item.type == "REDIRECT-PI")) {
        this.dt.setCopilotData({messages:this.messages, isGrpahLoaded:this.isGraphLoaded, isNodeLoaded:this.isNodeLoaded, isNodesUpdated:this.isNodesUpdates, isTableLoaded:this.showTable, tableData:this.tableData})
        this.router.navigate(["/pages/processIntelligence/flowChart"], { queryParams: { wpiId: "159884", redirect:"copilot" } });
      }
      else if(response.steps.find((item:any)=>item.type=="REDIRECT-RPA"))
      {
        this.dt.setCopilotData({messages:this.messages, isGrpahLoaded:this.isGraphLoaded, isNodeLoaded:this.isNodeLoaded, isNodesUpdated:this.isNodesUpdates, isTableLoaded:this.showTable, tableData:this.tableData})
        this.router.navigate(["/pages/rpautomation/designer"], { queryParams: { botId: "4495", redirect:"copilot" } });
      }
      this.messages.push(systemMessage);
      let chatGridElement=document.getElementById("chat-grid");
      chatGridElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
      this.message = "";
      setTimeout(()=>{
        var objDiv = document.getElementById("chat-grid");
        objDiv.scrollTop = objDiv.scrollHeight;
      },200)
    } else{
    this.message = "";
    setTimeout(()=>{
      var objDiv = document.getElementById("chat-grid");
      objDiv.scrollTop = objDiv.scrollHeight;
    },100)
  }
  this.isChatLoad = false;
  }, 2000);
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
          width: 2,
          height: 2,
        },
      ],

      paintStyle: { stroke: "#d7eaff", fill: "#d7eaff", strokeWidth: 1 },
      isSource: true,
      connectorStyle: { stroke: "#404040", strokeWidth: 2 },
      anchor: "Right",
      maxConnections: -1,
      cssClass: "path",
      Connector: ["Flowchart", { curviness: 90, cornerRadius: 5 }],
      connectorClass: "path",
      connectorOverlays: [["Arrow", { width: 5, length: 6, location: 1 }]],
    };
    const leftEndPointOptions = {
      endpoint: [
        "Dot",
        {
          radius: 2,
          cssClass: "myEndpoint",
          width: 2,
          height: 2,
        },
      ],
      paintStyle: { stroke: "#d7eaff", fill: "#d7eaff", strokeWidth: 1 },
      isTarget: true,
      connectorStyle: { stroke: "#404040", strokeWidth: 1 },
      anchor: "Left",
      maxConnections: -1,
      Connector: ["Flowchart", { curviness: 90, cornerRadius: 5 }],
      cssClass: "path",
      connectorClass: "path",
      connectorOverlays: [["Arrow", { width: 5, length: 6, location: 1 }]],
    };
    if (nodeData.selectedNodeTask != "STOP")
      this.jsPlumbInstance.addEndpoint(nodeData.id, rightEndPointOptions);
    if (nodeData.selectedNodeTask != "START")
      this.jsPlumbInstance.addEndpoint(nodeData.id, leftEndPointOptions);
  }

  
  addConnection(source: String, target: String) {
    this.jsPlumbInstance.connect({
      endpoint: [
        "Dot",
        {
          radius: 2,
          cssClass: "myEndpoint",
          width: 2,
          height: 2,
        },
      ],
      source: source,
      target: target,
      anchors: ["Right", "Left"],
      detachable: true,
      paintStyle: { stroke: "#404040", strokeWidth: 1 },
      overlays: [["Arrow", { width: 5, length: 6, location: 1 }]],
    });
  }


  updateCoordinates(dragNode) {
    var nodeIndex = this.nodes.findIndex((node) => {
      return node.id == dragNode.id;
    });
    this.nodes[nodeIndex].x = dragNode.x;
    this.nodes[nodeIndex].y = dragNode.y;
  }

  isGraphLoaded: boolean = false;
  isNodeLoaded: boolean = false;
  isNodesUpdates:boolean=false;
  loadGraphIntiate(value?: any) {
    this.showTable = false;
    if (value == "Load Graph" || value == "Load Node" || value=="Update Node 1" || value=="Update Node 2") {
      if (!this.isGraphLoaded) {
        this.loadGraph()
      }
      else if (!this.isNodeLoaded) {
        this.isNodeLoaded = true
        let node = {
          id: "22",
          selectedNodeTask: "IT form sent to Reporting Manager",
          x: "100px",
          y: "30px",
          path: "../../../../assets/copilot/graph-icons/General.png",
          updated:false
        }
        this.nodes.push(node);
        setTimeout(() => {
          this.populateNodes(node);
          this.addConnection("START", "22");
          this.addConnection("22", "2");
        }, 200)
      }
      else if(!this.isNodesUpdates)
      {
        if(value=='Update Node 1')
        {
          this.nodes.find((item:any)=>item.id=="3").selectedNodeTask="Login to Zoho";
          this.nodes.find((item:any)=>item.id=="3").updated=true;
        }
        if(value=='Update Node 2'){
          // this.nodes.find((item:any)=>item.id=="5").selectedNodeTask="Create O365 Account";
          // this.nodes.find((item:any)=>item.id=="5").updated=true;
          this.addExtraNode();
          this.isNodesUpdates=true;
        }

      }
    }
    else if (value == "Load Form")
      this.showTable = true;
  }

  addNode(node)
  {
    let nodeData={
      id:this.nodes.length+1,
      selectedTaskName:"New Node",
      path: "../../../../assets/copilot/graph-icons/General.png",
      updated:false,
      x:"",
      y:""
    }

    this.jsPlumbInstance.
    this.nodes.push(nodeData);
    setTimeout(()=>{
      this.populateNodes(nodeData);
      this.addConnection(node.id,nodeData.id);
      this.addConnection(node.id, nodeData.id);
    },200);
    

  }

  loadGraph() {
    this.jsPlumbInstance.reset(); // This will remove all existing connections and endpoints.
    this.jsPlumbInstance.deleteEveryEndpoint(); // This will delete all endpoints.
    this.nodes=[];
    let startNode = {
      id: "START",
      selectedNodeTask: "START",
      x: "0px",
      y: "200px",
      path: "../../../../assets/copilot/graph-icons/start.png",
      updated:false
    }
    this.nodes.push(startNode);
    setTimeout(() => {
      this.populateNodes(startNode);
    }, 200)
    for (let i = 0; i < this.graphJsonData.length; i++) {
      this.graphJsonData[i]["id"] = String(i + 1);
      this.graphJsonData[i]["x"] = ((i + 1) * 100) + "px";
      this.graphJsonData[i]["y"] = "200px";
      this.graphJsonData[i]["comments"]="";
      this.nodes.push(this.graphJsonData[i]);
      setTimeout(() => {
        this.populateNodes(this.graphJsonData[i]);
      }, 200)

    }
    let stopnode = {
      id: "STOP",
      selectedNodeTask: "STOP",
      x: ((this.graphJsonData.length + 1) * 100) + "px",
      y: "200px",
      path: "../../../../assets/copilot/graph-icons/stop.png",
      updated:false
    }
    this.nodes.push(stopnode);

    setTimeout(() => {
      this.populateNodes(stopnode);
    }, 200)
    setTimeout(() => {
      this.addConnection("START", this.graphJsonData[0].id)
      for (let j = 0; j < this.graphJsonData.length - 1; j++) {
        this.addConnection(this.graphJsonData[j].id, this.graphJsonData[j + 1].id)
      }
      this.addConnection(this.graphJsonData[this.graphJsonData.length - 1].id, "STOP");
      this.isGraphLoaded = true;
      this.loader = false;
    }, 200)
  }

  public nodeData:any={};
  openOverlay(event:any, nodeData:any)
  {
    this.nodeData=nodeData
    this.overlayModel.show(event);
  }

  openMenuItem(menuRef:any, event:any, nodeData:any)
  {
    this.nodeData=nodeData;
    this.popupMenuOverlay.show(event)
  }
  saveNodeComment()
  {
    this.nodes.find((item:any)=>item.id==this.nodeData.id).comment=this.nodeData.comment;
    this.overlayModel.hide();
  }
  onChange(){
    console.log(this.tableData)
  }

  addExtraNode(){
    this.graphJsonData = [];
    this.loader = true;
    this.graphJsonData = [{
      id: "1",
      selectedNodeTask: "Pre Boarding Form Sent",
      x: "100px",
      y: "100px",
      path: "../../../../assets/copilot/graph-icons/General.png",
      updated:false
    },
    {
      id: "2",
      selectedNodeTask: "Gather and Organize Responses",
      x: "100px",
      y: "200px",
      path: "../../../../assets/copilot/graph-icons/General.png",
      updated:false
  
    },
    {
      id: 3,
      selectedNodeTask: "Enter employee details",
      x: "100px",
      y: "300px",
      path: "../../../../assets/copilot/graph-icons/General.png",
      updated:false
    },
    {
      id: 4,
      selectedNodeTask: "Create O365 Account",
      x: "100px",
      y: "400px",
      path: "../../../../assets/copilot/graph-icons/General.png",
      updated:true
    },
    {
      id: 5,
      selectedNodeTask: "Create Email account",
      x: "100px",
      y: "500px",
      path: "../../../../assets/copilot/graph-icons/General.png",
      updated:false
    },
    {
      id: 6,
      selectedNodeTask: "Trigger, Welcome Email",
      x: "100px",
      y: "600px",
      path: "../../../../assets/copilot/graph-icons/General.png",
      updated:false
  
    }]
    setTimeout(() => {
      this.loadGraph();
    }, 1000);
  }

}

