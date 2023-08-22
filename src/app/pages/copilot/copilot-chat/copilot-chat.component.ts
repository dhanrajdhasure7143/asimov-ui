import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { jsPlumb, jsPlumbInstance } from "jsplumb";
import { HttpClient, HttpBackend } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTransferService } from '../../services/data-transfer.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import * as BpmnJS from "../../../bpmn-modeler-copilot.development.js";
import { SharebpmndiagramService } from "../../services/sharebpmndiagram.service";
import { RestApiService } from '../../services/rest-api.service';
interface City {
  name: string,
  code: string
}
//import * as copilot from '../../../../assets/jsons/copilot-req-res.json';
@Component({
  selector: 'app-copilot-chat',
  templateUrl: './copilot-chat.component.html',
  styleUrls: ['./copilot-chat.component.css']
})
export class CopilotChatComponent implements OnInit {
  cities: City[];

  selectedCity: City;
  isPlayAnimation: boolean = false;
  public model: any = [];
  jsPlumbInstance: any;
  isDialogVisible: boolean = false;
  isLoadGraphImage: boolean = false;
  @ViewChild('op', { static: false }) overlayModel;
  @ViewChild('popupMenu', { static: false }) popupMenuOverlay;
  staticData:Boolean=true;
  copilotJson: any = [
    {
      "message": "Provisioning Users",
      "response": {
        "message": "Sure, here are a few examples of onboarding users process flow. You can choose one that matches or ‘closely’ matches your organization’s process. If none of them match, please tell us more about the process you would like to automate.",
        "steps": [
          {
            "id": 1,
            "type": "PROCESS-IMAGE",
            "label": "Onboard Users",
            "ImagePath": "./../../../assets/copilot/chart-image-1.svg"

          },
          {
            "id": 2,
            "type": "PROCESS-IMAGE",
            "label": "Account Creation",
            "ImagePath": "./../../../assets/copilot/chart-image-2.svg"
          },
          {
            "id": 3,
            "type": "PROCESS-IMAGE",
            "label": "Employee Onboarding",
            "ImagePath": "./../../../assets/copilot/chart-employee.svg"
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
            "type": "LOAD-GRAPH",
            "xml":"assets/resources/Copilot- 2.bpmn"
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
            "disable": false
          },
          {
            "type": "BUTTON",
            "label": "No, contintue to next step",
            "disable": false
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
            "disable": false
          },
          {
            "id": 6,
            "type": "IMG-BUTTON",
            "label": "SAP SuccessFactors",
            "disable": false
          },
          {
            "id": 6,
            "type": "BUTTON",
            "label": "None of the above",
            "disable": false
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
            "xml":"assets/resources/Copilot-1.bpmn"
          },
          {
            "type": "BUTTON",
            "label": "Outlook by Microsoft",
            "disable": false
          },
          {
            "type": "BUTTON",
            "label": "Gmail from Google",
            "disable": false
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
            "type": "UPDATE-NODE-2",
            "xml":""
          },
          {
            "type": "BUTTON",
            "label": "Save as Draft",
            "disable": false
          },
          {
            "type": "BUTTON",
            "label": "Analyse this Process",
            "disable": false
          },
          {
            "type": "OUTLINE-BUTTON",
            "label": "Generate Bot Design",
            "disable": false
          },
          {
            "type": "MESSAGE",
            "label": "If you're still uncertain, we can arrange for our customer executive to contact you",
          },
          {
            "type": "OUTLINE-BUTTON",
            "label": "Have our executive contact you",
            "disable": false
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
            "disable": false
          },
          {
            "type": "BUTTON",
            "label": "Save as Draft",
            "disable": false
          },
          {
            "type": "MESSAGE",
            "label": "If you're still uncertain, we can arrange for our customer executive to contact you",
          },
          {
            "type": "OUTLINE-BUTTON",
            "label": "Have our executive contact you",
            "disable": false
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
      "message": "Generate Bot Design",
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
  constructor(private router: Router,
    private dt: DataTransferService,
    private loaderService: LoaderService,
    private confirmationService: ConfirmationService,
    private bpmnservice: SharebpmndiagramService,
    private rest_api: RestApiService,
    private activatedRouter: ActivatedRoute,
  ) {
    this.cities = [
      { name: '00', code: 'NY' },
      { name: '01', code: 'RM' },
      { name: '02', code: 'LDN' },
      { name: '03', code: 'IST' },
      { name: '04', code: 'PRS' },
      { name: '05', code: 'NY' },
      { name: '06', code: 'RM' },
      { name: '07', code: 'LDN' },
      { name: '08', code: 'IST' },
      { name: '09', code: 'PRS' }
    ];
    //this.copilotJson=copilot;
  }

  @ViewChild('exportSVGtoPDF') exportSVGtoPDF: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('render') render: ElementRef;
  @ViewChild('nodeImage', { read: ElementRef }) nodeImage: ElementRef;
  public model2: any;
  public bpmnPath:String=""
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
    updated: false
  },
  {
    id: "2",
    selectedNodeTask: "Gather and Organize Responses",
    x: "100px",
    y: "200px",
    path: "../../../../assets/copilot/graph-icons/General.png",
    updated: false

  },
  {
    id: 5,
    selectedNodeTask: "Login to HRA",
    x: "100px",
    y: "400px",
    path: "../../../../assets/copilot/graph-icons/General.png",
    updated: false
  },
  {
    id: 4,
    selectedNodeTask: "Enter Employee Details",
    x: "100px",
    y: "400px",
    path: "../../../../assets/copilot/graph-icons/General.png",
    updated: false
  },
  {
    id: 4,
    selectedNodeTask: "Create Email Account",
    x: "100px",
    y: "400px",
    path: "../../../../assets/copilot/graph-icons/General.png",
    updated: false
  },
  {
    id: 6,
    selectedNodeTask: "Trigger, Welcome Email",
    x: "100px",
    y: "500px",
    path: "../../../../assets/copilot/graph-icons/General.png",
    updated: false

  }]
  showTable: boolean = false;
  tableData: any[] = [];
  // minOptins: number[]  = Array.from({length :60 }, (_, index)=> index+1)
  minOptins: string[] = Array.from(Array(61).keys(), num => (num).toString().padStart(2, '0'));
  hrsOptins: string[] = Array.from(Array(25).keys(), num => num.toString().padStart(2, "0"))
  daysOptins: string[] = Array.from(Array(32).keys(), num => num.toString().padStart(2, "0"))
  loader: boolean = false;
  isChatLoad: boolean = false;
  bpmnModeler: any;
  isGraphLoaded: boolean = false;
  isNodeLoaded: boolean = false;
  isNodesUpdates: boolean = false;

  ngOnInit(): void {
    this.loader = true;
    this.tableData = [
      { name: "IT Form Sent To The Manager",min:"00",hrs:"00",days:"00"},
      { name: "Manager Fills The Form",min:"00",hrs:"00",days:"00" },
      { name: "IT Team Creates Email ID",min:"00",hrs:"00",days:"00" },
      { name: "IT Team Assign A System",min:"00",hrs:"00",days:"00" },
      { name: "System Access For The User",min:"00",hrs:"00",days:"00" },
    ];


    this.activatedRouter.queryParams.subscribe((params: any) => {
      if (params.template)
        this.loadGraph(params.template)
      if(!this.staticData)
        (!(localStorage.getItem("conversationId")))?this.createConversationSessionId():this.getConversation();
      this.loader = false;
    })
  }

  // use to create conversation session id
  createConversationSessionId()
  {
    let payload:any={
      userId:localStorage.getItem("ProfileuserId"),
      tenantId:localStorage.getItem("tenantName")
    }
    this.rest_api.createCopilotConversationSessionId(payload).subscribe((response:any)=>{
      console.log("tenant",response);
      this.getConversation();
    },err=>{
      console.log(err);
    })
  }


  getConversation()
  {
    this.rest_api.getCopilotConversation().subscribe((response:any)=>{
      this.messages.push({
        message:response.data,
        user:"SYSTEM",
        steps:[]
      })
    }, err=>{
      console.log(err)
    })
  }

  sendMessage(value?: any, messageType?: String) {
    this.isChatLoad = true;
    if(!this.staticData){  
      setTimeout(() => {
        let data ={
          "conversationId": "b4d32511-1c79-4fe7-8b7f-0dfb9fbd9bcb",    
          "message": value
      }
       this.messages.push({
        user:localStorage.getItem("ProfileuserId"),
        message:value,

       }) 

       this.message="";
        this.rest_api.sendMessageToCopilot(data).subscribe((response:any)=>{
          this.isChatLoad=false;
          if(response.data)
          {
            if(response.data.find((item:any)=>item.template.type=="BPMN"))
            {
              let encryptedBpmn = response.data.find((item:any)=>item.template.type=="BPMN")?.template?.payload??undefined;
              if(encryptedBpmn)
              {
                let bpmn=atob(encryptedBpmn);
                this.isLoadGraphImage = false;
                this.isDialogVisible = true;
                this.bpmnPath=bpmn
                setTimeout(() => {
                  this.loadBpmnwithXML(bpmn,".graph-preview-container");
                }, 500);
              }
              else
              {
              
    
              }
            }
          }
        })
        // this.rest_api.getdata1().subscribe(res=>{
        //   console.log(res)
        // })
      }, 1000);
    }
    if(this.staticData)
    {
      if (value == "Onboard Users") {
        this.isChatLoad = false;
        this.isLoadGraphImage = true;
        this.isDialogVisible = true;
        return;
      }
      setTimeout(() => {
        let message = {
          id: (new Date()).getTime(),
          message: value,
          user: localStorage.getItem("ProfileuserId")
        }
        if (messageType != 'LABEL')
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
            let responseData=response.steps.find((item: any) => item.type == "LOAD-GRAPH").xml;
            this.isLoadGraphImage = false;
            this.isDialogVisible = true;
            this.bpmnPath=responseData
            setTimeout(() => {
              this.loadBpmnwithXML(responseData,".graph-preview-container");
            }, 500);

          }
          else if (response.steps.find((item: any) => item.type == "LOAD-STEPS-TABLE")) {
            // this.loadGraphIntiate("Load Form")
          }
          else if (response.steps.find((item: any) => item.type == "ADD-NODE")) {
            //  this.loadGraphIntiate("Load Node");
          }
          else if (response.steps.find((item: any) => item.type == "UPDATE-NODE-1")) {
            let responseData=response.steps.find((item: any) => item.type == "UPDATE-NODE-1").xml;
            this.loadupdatedBpmn(responseData);
            // this.loadGraphIntiate("Update Node 1");
          }
          else if (response.steps.find((item: any) => item.type == "UPDATE-NODE-2")) {
            let responseData=response.steps.find((item: any) => item.type == "UPDATE-NODE-2").xml;
          }
          else if (response.steps.find((item: any) => item.type == "REDIRECT-PI")) {
            this.loader = true;
            setTimeout(() => {
              this.loader = false
              this.dt.setCopilotData({ messages: this.messages, isGrpahLoaded: this.isGraphLoaded, isNodeLoaded: this.isNodeLoaded, isNodesUpdated: this.isNodesUpdates, isTableLoaded: this.showTable, tableData: this.tableData })
              this.router.navigate(["/pages/processIntelligence/flowChart"], { queryParams: { wpiId: "159884", redirect: "copilot" } });
            }, 3000)
          }
          else if (response.steps.find((item: any) => item.type == "REDIRECT-RPA")) {
            this.dt.setCopilotData({ messages: this.messages, isGrpahLoaded: this.isGraphLoaded, isNodeLoaded: this.isNodeLoaded, isNodesUpdated: this.isNodesUpdates, isTableLoaded: this.showTable, tableData: this.tableData })
            this.loader = true;
            setTimeout(() => {
              this.loader = false
              this.router.navigate(["/pages/rpautomation/designer"], { queryParams: { botId: "4495", redirect: "copilot" } });
            }, 2000)
          }
          this.messages.push(systemMessage);
          let chatGridElement = document.getElementById("chat-grid");
          chatGridElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
          this.message = "";
          setTimeout(() => {
            var objDiv = document.getElementById("chat-grid");
            objDiv.scrollTop = objDiv.scrollHeight;
          }, 200)
        } else {
          this.message = "";
          setTimeout(() => {
            var objDiv = document.getElementById("chat-grid");
            objDiv.scrollTop = objDiv.scrollHeight;
          }, 100)
        }
        this.isChatLoad = false;
      }, 2000);
    }
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


  updateCoordinates(dragNode) {
    var nodeIndex = this.nodes.findIndex((node) => {
      return node.id == dragNode.id;
    });
    this.nodes[nodeIndex].x = dragNode.x;
    this.nodes[nodeIndex].y = dragNode.y;
  }

  loadGraph(template) {
    if (template != "Others") {
      this.isDialogVisible=false;
      let path = "assets/resources/copilot_bpmn_chatgpt.bpmn"
      if (template == 'Workforce Planning')
        path = "assets/resources/Copilot- 3.bpmn"
      if (template == "Job Analysis and Job Posting")
        path = "assets/resources/Copilot-1.bpmn"
      if (template == "Assessment and Testing")
        path = "assets/resources/Copilot- 2.bpmn"
      setTimeout(() => {
        this.loadBpmnwithXML(path,".diagram_container-copilot");
      }, 1500);
    }
  }

  loadupdatedBpmn(BpmnPath){
    this.rest_api.getBPMNFileContent(BpmnPath).subscribe((res) => {
      this.bpmnModeler.importXML(res, function (err) {
        if (err) {
          console.error("could not import BPMN EZFlow notation", err);
        }
      });
      setTimeout(() => {
        this.notationFittoScreen();
        this.readBpmnModelerXMLdata();
      }, 500);
    });
  }


  loadBpmnwithXML(responseData,element){
    if(element==".diagram_container-copilot")
      this.isDialogVisible=false;

    
    // this.bpmnModeler = new BpmnJS({container: ".graph-preview-container"});
    this.bpmnModeler = new BpmnJS({container: element});
    if(this.staticData)
    {
      this.rest_api.getBPMNFileContent(responseData).subscribe((res) => {
        this.bpmnModeler.importXML(res, function (err) {
          if (err) {
            console.error("could not import BPMN EZFlow notation", err);
          }
        });
        setTimeout(() => {
              this.notationFittoScreen();
            if(element !='.graph-preview-container')
              this.readBpmnModelerXMLdata();
        }, 500)
        this.bpmnModeler.on('element.contextmenu', () => false);
      });
    }
    else
    {
      this.bpmnModeler.importXML(responseData, function (err) {
        if (err) {
          console.error("could not import BPMN EZFlow notation", err);
        }
      });
      setTimeout(() => {
            this.notationFittoScreen();
          if(element !='.graph-preview-container')
            this.readBpmnModelerXMLdata();
      }, 500)
      this.bpmnModeler.on('element.contextmenu', () => false);
    }

  }

  notationFittoScreen(){
    let canvas = this.bpmnModeler.get('canvas');
    canvas.zoom('fit-viewport');
  }

  readBpmnModelerXMLdata(){
    var self = this
    self.bpmnModeler.on('element.changed', function(){
     self.bpmnModeler.saveXML({ format: true }, function(err, xml) {
        console.log("xml",xml)// xml data will get for every change
      })
      })
  }

  onChange() {
    console.log(this.tableData)
  }

}

