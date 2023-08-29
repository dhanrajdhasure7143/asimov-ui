import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import * as BpmnJS from "../../../bpmn-modeler-copilot.development.js";
import { RestApiService } from "../../services/rest-api.service";
import { MessageService } from "primeng/api";
import { DataTransferService } from "../../services/data-transfer.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MessageData, UserMessagePayload } from "../copilot-models";
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
  public bpmnActionDetails: String = "";
  messages: any = [];
  usermessage: any = "";
  showTable: boolean = false;
  tableData: any[] = [];
  minOptions: string[] = Array.from(Array(61).keys(), (num) =>
    num.toString().padStart(2, "0")
  );
  hrsOptions: string[] = Array.from(Array(25).keys(), (num) =>
    num.toString().padStart(2, "0")
  );
  daysOptions: string[] = Array.from(Array(32).keys(), (num) =>
    num.toString().padStart(2, "0")
  );
  loader: boolean = false;
  isChatLoad: boolean = false;
  bpmnModeler: any;
  tableForm: FormGroup
  bpmnId:number;
  constructor(
    private rest_api: RestApiService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private dt: DataTransferService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loader = true;
    this.getConversationId();
    this.route.queryParams.subscribe((params: any) => {
      if (params.templateId) {
        setTimeout(() => {
          this.bpmnModeler = new BpmnJS({
            container: ".diagram_container-copilot",
          });
        }, 300);
        if(params.templateId == "AutomateEmployeeOnboarding")
        this.getAutomatedProcess();

        if (params.templateId != "Others")
          this.getTemplatesByProcessId(params.process_id, params.templateId);
      }
      this.loader = false;
    });
    this.dt.currentMessage2.subscribe((response:any)=>{
      console.log("subject check",response);
    
    })
  }


 

  getTemplatesByProcessId(processId, templateId) {
    this.rest_api.getCopilotTemplatesList(processId).subscribe(
      (response: any) => {
        if (response) {
          let template = response.find(
            (item: any) => item.template_id == templateId
          );
          this.loadBpmnwithXML(atob(template.bpmn_xml));
        }
      });
  }


  sendMessage(value?: any, messageType?: String) {
    this.isChatLoad = true;
        let data = {
          conversationId: localStorage.getItem("conversationId"),
          message: value,
        };
        this.messages.push({
          user: localStorage.getItem("ProfileuserId"),
          message: value,
          messageType: messageType,
        });

        this.usermessage = "";
          this.rest_api.sendMessageToCopilot(data).subscribe((response: any) => {
          this.isChatLoad = false;
          let res = { ...{}, ...response };
          this.messages.push(response);
          setTimeout(() => {
            var objDiv = document.getElementById("chat-box");
            objDiv.scrollTop = objDiv.scrollHeight;
          }, 200)
        });
  }

  loadBpmnwithXML(bpmnActionDetails:any) {
    this.isDialogVisible = false;
    let bpmnPath=atob(bpmnActionDetails.bpmnXml);
    this.bpmnModeler.importXML(bpmnPath, function (err) {
      if (err) {
        console.error("could not import BPMN EZFlow notation", err);
      }
      
    });
    this.messages.push({message:bpmnActionDetails.label,messageSourceType:localStorage.getItem("ProfileuserId")})
    this.sendBpmnAction(bpmnActionDetails.submitValue)
    setTimeout(() => {
      this.notationFittoScreen();
      this.readBpmnModelerXMLdata();
    }, 500);
    this.bpmnModeler.on("element.contextmenu", () => false);
  }

  previewBpmn(bpmnActionDetails:any) {
    let previewMolder = new BpmnJS({ container: ".graph-preview-container" });
    this.bpmnActionDetails = bpmnActionDetails;
    let bpmnXml=atob(bpmnActionDetails.bpmnXml)
    previewMolder.importXML(bpmnXml, function (err) {
      if (err) {
        console.error("could not import BPMN EZFlow notation", err);
      }
    });
    setTimeout(() => {
      let canvas = previewMolder.get("canvas");
      canvas.zoom("fit-viewport");
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

  createForm() {
    const formControls = {};
    for (let i = 0; i < this.tableData.length; i++) {
      formControls[i] = this.fb.group({
        minutes: ['', Validators.required],
        hours: ['', Validators.required],
        days: ['', Validators.required]
      });
    }
    this.tableForm = this.fb.group(formControls);
  }

  onSubmit(){
    if(!this.tableForm.valid)
    {
      this.messageService.add({severity:'error', summary:'Invalid Data', detail:'Please fill all fields'});
    }
    console.log(this.tableForm.value)
  }

  getConversationId(){
    let req_body = {"userId": localStorage.getItem("ProfileuserId")}
    let resdata;
    this.rest_api.initializeConversation(req_body).subscribe(
      (res:any)=>{
        resdata = res
        this.messages.push(resdata);
        localStorage.setItem("conversationId",resdata.conversationId)
      }
    )
  }


  public processMessageAction = (event:any) =>{
    if (event.actionType==='Button'){
        this.messages.push({
            message:event?.data?.label,
            messageSourceType:localStorage.getItem("ProfileuserId")
          })
          this.sendButtonAction(event?.data?.submitValue|| event?.data?.label)
    }else if (event.actionType==='Form'){
      this.messages.push({
        message:event?.data?.label,
        messageSourceType:localStorage.getItem("ProfileuserId")
      })
          this.sendFormAction(event?.data)
    }else if (event.actionType==='Card'){
      this.messages.push({
        message:event?.data?.label,
        messageSourceType:localStorage.getItem("ProfileuserId")
      })
          this.sendCardAction(event?.data?.submitValue)
    }else if (event.actionType==='list'){
      this.messages.push({
        message:event?.data?.label,
        messageSourceType:localStorage.getItem("ProfileuserId")
      })
          this.sendListAction(event?.data?.submitValue)
    }else if (event.actionType=='bpmn'){
      this.isDialogVisible=true;
      setTimeout(()=>{this.previewBpmn(event.data)},500)
    }
    else if (event.actionType=='logsCollection'){
      console.log("log event",event)
      this.tableData = [
        { name: "IT Form Sent To The Manager", hours: "00", minutes: "00", days: "00" },
        { name: "Manager Fills The Form", hours: "00", minutes: "00", days: "00" },
        { name: "IT Team Creates Email ID", minutes: "00", hours: "00", days: "00" },
        { name: "IT Team Assign A System", minutes: "00", hours: "00", days: "00" },
        { name: "System Access For The User", minutes: "00", hours: "00", days: "00" },
      ];
      this.createForm()
    }
  }


  public sendBpmnAction=(value:string)=>{
    this.sendUserAction({message:value})
  }

  public sendButtonAction = (value:string) =>{
    this.sendUserAction({
        message: value
    })
  }


  public sendFormAction = (data:any) =>{
    //TODO: Send request to backend
  }
  public sendCardAction = (data:any) =>{
    this.sendUserAction({
        message: data
    })
  }
  public sendListAction = (data:any) =>{
    this.sendUserAction({
        message: data
    })
  }

  public sendUserAction =(data:any)=>{
    let userMessage: UserMessagePayload={
        conversationId:localStorage.getItem("conversationId"),
        message:data?.message,
        jsonData:data?.jsonData
    }
    let response = this.rest_api.sendMessageToCopilot(userMessage);
    response.subscribe((res:any) =>{
        this.messages.push(res);
        this.usermessage='';
        if (res.data?.components?.includes('logCollection')){
          let values =res.data?.values[ res.data?.components?.indexOf('logCollection')];
          values= JSON.parse( atob(values[0].values));
          values.forEach((item:any)=>{
            this.tableData.push({
              stepName:item.stepName,
              days:"00",
              hours:"00",
              minutes:"00",
            })
          })
          this.createForm();
          setTimeout(()=>{
            this.showTable=true;
          },500)
        }

    }, err =>{

    })
  }

  get checkTable(){
    return this.tableData.length>0?true:false;
  }

  getAutomatedProcess(){
    let req_body={
      "userId":localStorage.getItem("ProfileuserId"),
      "intent":"Employee Onboarding"
  }
    this.rest_api.getAutomatedProcess(req_body).subscribe(res=>{
      console.log()
    })
  }
}
