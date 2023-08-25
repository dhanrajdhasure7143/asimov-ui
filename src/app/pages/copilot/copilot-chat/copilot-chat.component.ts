import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import * as BpmnJS from "../../../bpmn-modeler-copilot.development.js";
import { RestApiService } from "../../services/rest-api.service";
import { MessageService } from "primeng/api";
import { DataTransferService } from "../../../pages/services/data-transfer.service";
interface City {
  name: string;
  code: string;
}
@Component({
  selector: "app-copilot-chat",
  templateUrl: "./copilot-chat.component.html",
  styleUrls: ["./copilot-chat.component.css"],
})
export class CopilotChatComponent implements OnInit {
  selectedCity: City;
  isPlayAnimation: boolean = false;
  public model: any = [];
  isDialogVisible: boolean = false;
  isLoadGraphImage: boolean = false;
  @ViewChild("op", { static: false }) overlayModel;
  @ViewChild("popupMenu", { static: false }) popupMenuOverlay;
  staticData: Boolean = false;
  copilotJson: any = [];
  @ViewChild("exportSVGtoPDF") exportSVGtoPDF: ElementRef;
  @ViewChild("canvas") canvas: ElementRef;
  @ViewChild("render") render: ElementRef;
  public model2: any;
  public bpmnPath: String = "";
  messages: any = [];
  message: any = "";
  showTable: boolean = false;
  tableData: any[] = [];
  minOptins: string[] = Array.from(Array(61).keys(), (num) =>
    num.toString().padStart(2, "0")
  );
  hrsOptins: string[] = Array.from(Array(25).keys(), (num) =>
    num.toString().padStart(2, "0")
  );
  daysOptins: string[] = Array.from(Array(32).keys(), (num) =>
    num.toString().padStart(2, "0")
  );
  loader: boolean = false;
  isChatLoad: boolean = false;
  bpmnModeler: any;

  constructor(
    private rest_api: RestApiService,
    private activatedRouter: ActivatedRoute,
    private messageService: MessageService,
    private dt: DataTransferService
  ) {}

  ngOnInit(): void {
    this.loader = true;
    this.tableData = [
      { name: "IT Form Sent To The Manager", min: "00", hrs: "00", days: "00" },
      { name: "Manager Fills The Form", min: "00", hrs: "00", days: "00" },
      { name: "IT Team Creates Email ID", min: "00", hrs: "00", days: "00" },
      { name: "IT Team Assign A System", min: "00", hrs: "00", days: "00" },
      { name: "System Access For The User", min: "00", hrs: "00", days: "00" },
    ];

    this.activatedRouter.queryParams.subscribe((params: any) => {
      if (params.templateId) {
        setTimeout(() => {
          this.bpmnModeler = new BpmnJS({
            container: ".diagram_container-copilot",
          });
        }, 300);
        if (params.templateId != "Others")
          this.getTemplatesByProcessId(params.process_id, params.templateId);
        if (!this.staticData) this.getConversation();
        //(!(localStorage.getItem("conversationId")))?this.getConversation():undefined;
        //(!(localStorage.getItem("conversationId")))?this.createConversationSessionId():this.getConversation();
      }
      this.loader = false;
    });
  }

  getTemplatesByProcessId(processId, templateId) {
    this.rest_api
      .getCopilotTemplatesList(processId)
      .subscribe((response: any) => {
        if (response) {
          let template = response.find(
            (item: any) => item.template_id == templateId
          );
          this.loadBpmnwithXML(
            atob(template.bpmn_xml),
            ".diagram_container-copilot"
          );
        }
      });
  }

  getConversation() {
    // this.rest_api.getCopilotConversation().subscribe((response:any)=>{
    //   if(response.conversationId)
    //   {
    //     localStorage.setItem("conversationId",response.conversationId);
    //     this.messages.push({
    //       message:response.data,
    //       user:"SYSTEM",
    //       steps:[]
    //     })
    //   }
    // }, err=>{
    //   console.log(err)
    //   this.messageService.add({severity:'error', summary:'Rejected', detail:'Unable to get conversation details!'});
    // })
    this.dt
      .createConversation({ userId: localStorage.getItem("userId") })
      .subscribe((response: any) => {
        console.log(response);
        //localStorage.setItem("conversationId", response.conversationId);
        this.messages.push(response);
      });
  }

  templateDetails: any = [];
  loadTemplate(template: any) {
    if (template.bpmnXml) {
      this.templateDetails = template;
      if (this.bpmnPath == "") this.isDialogVisible = true;
      setTimeout(() => {
        let bpmn = atob(template.bpmnXml);
        if (this.bpmnPath == "") this.previewBpmn(bpmn);
        else this.loadBpmnwithXML(bpmn, "");
      }, 1000);
    }
  }

  actionDispatch(message: any, action: any) {
    if (action.submitValue == "submit") {
      if (this.templateDetails) {
        this.sendMessage("1", "input");
      } else {
        alert("No template selected");
      }
    } else {
      this.sendMessage(action.submitValue, "input");
    }
  }

  sendMessage(value?: any, messageType?: String) {
    this.isChatLoad = true;
    if (!this.staticData) {
      setTimeout(() => {
        let data = {
          conversationId: localStorage.getItem("conversationId"),
          message: value,
        };
        this.messages.push({
          user: localStorage.getItem("ProfileuserId"),
          message: value,
          messageType: messageType,
        });

        this.message = "";
        this.dt.sendMessage(data).subscribe((response: any) => {
          this.isChatLoad = false;
          let res = { ...{}, ...response };
          response.data.values = response.data.values.map((item: any) => {
            item = item.map((valueItem: any) => {
              valueItem.values = valueItem.encoded
                ? JSON.parse(atob(valueItem.values))
                : valueItem.values;
              return valueItem;
            });
            return item;
          });
          console.log("------sample--", response);
          this.messages.push(response);
        });
        // this.rest_api.sendMessageToCopilot(data).subscribe((response:any)=>{
        //   this.isChatLoad=false;
        //   if(response.data)
        //   {
        //     if(response.data.find((item:any)=>item.template.type=="BPMN"))
        //     {
        //       let encryptedBpmn = response.data.find((item:any)=>item.template.type=="BPMN")?.template?.payload??undefined;
        //       if(encryptedBpmn)
        //       {
        //         let bpmn=atob(encryptedBpmn);
        //         this.isLoadGraphImage = false;
        //         this.isDialogVisible = true;
        //         this.bpmnPath=bpmn
        //         setTimeout(() => {
        //           this.loadBpmnwithXML(bpmn,".graph-preview-container");
        //         }, 500);
        //       }
        //       else
        //       {

        //       }
        //     }
        //   }
        // })
        // this.rest_api.getdata1().subscribe(res=>{
        //   console.log(res)
        // })
      }, 1000);
    }
    if (this.staticData) {
      // if (value == "Onboard Users") {
      //   this.isChatLoad = false;
      //   this.isLoadGraphImage = true;
      //   this.isDialogVisible = true;
      //   return;
      // }
      // setTimeout(() => {
      //   let message = {
      //     id: (new Date()).getTime(),
      //     message: value,
      //     user: localStorage.getItem("ProfileuserId")
      //   }
      //   if (messageType != 'LABEL')
      //     this.messages.push(message);
      //   let response = this.copilotJson.find((item: any) => item.message == (value))?.response ?? undefined;
      //   if (response) {
      //     let systemMessage = {
      //       id: (new Date()).getTime(),
      //       user: "SYSTEM",
      //       message: response.message,
      //       steps: response.steps
      //     }
      //     if (response.steps.find((item: any) => item.type == "LOAD-GRAPH")) {
      //       let responseData=response.steps.find((item: any) => item.type == "LOAD-GRAPH").xml;
      //       this.isLoadGraphImage = false;
      //       this.isDialogVisible = true;
      //       this.bpmnPath=responseData
      //       setTimeout(() => {
      //         this.loadBpmnwithXML(responseData,".graph-preview-container");
      //       }, 500);
      //     }
      //     else if (response.steps.find((item: any) => item.type == "LOAD-STEPS-TABLE")) {
      //       // this.loadGraphIntiate("Load Form")
      //     }
      //     else if (response.steps.find((item: any) => item.type == "ADD-NODE")) {
      //       //  this.loadGraphIntiate("Load Node");
      //     }
      //     else if (response.steps.find((item: any) => item.type == "UPDATE-NODE-1")) {
      //       let responseData=response.steps.find((item: any) => item.type == "UPDATE-NODE-1").xml;
      //       this.loadupdatedBpmn(responseData);
      //       // this.loadGraphIntiate("Update Node 1");
      //     }
      //     else if (response.steps.find((item: any) => item.type == "UPDATE-NODE-2")) {
      //       let responseData=response.steps.find((item: any) => item.type == "UPDATE-NODE-2").xml;
      //     }
      //     else if (response.steps.find((item: any) => item.type == "REDIRECT-PI")) {
      //       this.loader = true;
      //       setTimeout(() => {
      //         this.loader = false
      //         this.dt.setCopilotData({ messages: this.messages, isGrpahLoaded: this.isGraphLoaded, isNodeLoaded: this.isNodeLoaded, isNodesUpdated: this.isNodesUpdates, isTableLoaded: this.showTable, tableData: this.tableData })
      //         this.router.navigate(["/pages/processIntelligence/flowChart"], { queryParams: { wpiId: "159884", redirect: "copilot" } });
      //       }, 3000)
      //     }
      //     else if (response.steps.find((item: any) => item.type == "REDIRECT-RPA")) {
      //       this.dt.setCopilotData({ messages: this.messages, isGrpahLoaded: this.isGraphLoaded, isNodeLoaded: this.isNodeLoaded, isNodesUpdated: this.isNodesUpdates, isTableLoaded: this.showTable, tableData: this.tableData })
      //       this.loader = true;
      //       setTimeout(() => {
      //         this.loader = false
      //         this.router.navigate(["/pages/rpautomation/designer"], { queryParams: { botId: "4495", redirect: "copilot" } });
      //       }, 2000)
      //     }
      //     this.messages.push(systemMessage);
      //     let chatGridElement = document.getElementById("chat-grid");
      //     chatGridElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
      //     this.message = "";
      //     setTimeout(() => {
      //       var objDiv = document.getElementById("chat-grid");
      //       objDiv.scrollTop = objDiv.scrollHeight;
      //     }, 200)
      //   } else {
      //     this.message = "";
      //     setTimeout(() => {
      //       var objDiv = document.getElementById("chat-grid");
      //       objDiv.scrollTop = objDiv.scrollHeight;
      //     }, 100)
      //   }
      //   this.isChatLoad = false;
      // }, 2000);
    }
  }

  loadGraph(template) {
    if (template != "Others") {
      this.isDialogVisible = false;
      let path = "assets/resources/copilot_bpmn_chatgpt.bpmn";
      if (template == "Workforce Planning")
        path = "assets/resources/Copilot- 3.bpmn";
      if (template == "Job Analysis and Job Posting")
        path = "assets/resources/Copilot-1.bpmn";
      if (template == "Assessment and Testing")
        path = "assets/resources/Copilot- 2.bpmn";
      setTimeout(() => {
        this.loadBpmnwithXML(path, ".diagram_container-copilot");
      }, 1500);
    }
  }

  loadupdatedBpmn(BpmnPath) {
    this.bpmnModeler.importXML(BpmnPath, function (err) {
      if (err) {
        console.error("could not import BPMN EZFlow notation", err);
      }
    });
    setTimeout(() => {
      this.notationFittoScreen();
      this.readBpmnModelerXMLdata();
    }, 500);
  }

  loadBpmnwithXML(responseData, element) {
    this.isDialogVisible = false;

    // this.bpmnModeler = new BpmnJS({container: ".graph-preview-container"});
    // if(this.staticData)
    // {
    //   this.rest_api.getBPMNFileContent(responseData).subscribe((res) => {
    //     this.bpmnModeler.importXML(res, function (err) {
    //       if (err) {
    //         console.error("could not import BPMN EZFlow notation", err);
    //       }
    //     });
    //     setTimeout(() => {
    //           this.notationFittoScreen();
    //         if(element !='.graph-preview-container')
    //           this.readBpmnModelerXMLdata();
    //     }, 500)
    //     this.bpmnModeler.on('element.contextmenu', () => false);
    //   });
    // }
    // else
    // {
    this.bpmnPath = responseData;
    this.bpmnModeler.importXML(responseData, function (err) {
      if (err) {
        console.error("could not import BPMN EZFlow notation", err);
      }
    });
    setTimeout(() => {
      this.notationFittoScreen();
      this.readBpmnModelerXMLdata();
    }, 500);
    this.bpmnModeler.on("element.contextmenu", () => false);
    //}
  }

  previewBpmn(responseData) {
    let previewMolder = new BpmnJS({ container: ".graph-preview-container" });
    this.bpmnPath = responseData;
    previewMolder.importXML(responseData, function (err) {
      if (err) {
        console.error("could not import BPMN EZFlow notation", err);
      }
    });
    setTimeout(() => {
      let canvas = previewMolder.get("canvas");
      canvas.zoom("fit-viewport");
      previewMolder.on("element.changed", function () {
        previewMolder.saveXML({ format: true }, function (err, xml) {
          console.log("xml", xml); // xml data will get for every change
        });
      });
    }, 500);
  }

  notationFittoScreen() {
    let canvas = this.bpmnModeler.get("canvas");
    canvas.zoom("fit-viewport");
  }

  readBpmnModelerXMLdata() {
    var self = this;
    self.bpmnModeler.on("element.changed", function () {
      self.bpmnModeler.saveXML({ format: true }, function (err, xml) {
        console.log("xml", xml); // xml data will get for every change
      });
    });
  }
}
