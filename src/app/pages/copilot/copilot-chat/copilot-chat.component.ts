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
  public bpmnPath: String = "";
  messages: any = [];
  usermessage: any = "I would like to automate associate joining process";
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

  constructor(
    private rest_api: RestApiService,
    private activatedRouter: ActivatedRoute,
    private messageService: MessageService,
    private dt: DataTransferService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loader = true;
    this.getConversationId();
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
        // this.dt.sendMessage(data).subscribe((response: any) => {
          this.rest_api.sendMessageToCopilot(data).subscribe((response: any) => {
          this.isChatLoad = false;
          let res = { ...{}, ...response };
          // response.data.values = response.data.values.map((item: any) => {
          //   item = item.map((valueItem: any) => {
          //     valueItem.values = valueItem.encoded ? JSON.parse(atob(valueItem.values))
          //       : valueItem.values;
          //     return valueItem;
          //   });
          //   return item;
          // });
            this.messages.push(response);
          //       let chatGridElement = document.getElementById("chat-box");
          // chatGridElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
         
          setTimeout(() => {
            var objDiv = document.getElementById("chat-box");
            objDiv.scrollTop = objDiv.scrollHeight;
          }, 200)
        });
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

  createForm() {
    const formControls = {};
    for (let i = 0; i < this.tableData.length; i++) {
      formControls[i] = this.fb.group({
        min: ['', Validators.required],
        hrs: ['', Validators.required],
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
        console.log(res)
        localStorage.setItem("conversationId",resdata.conversationId)
      }
    )
  }


  public processMessageAction = (event:any) =>{
    console.log('processMessageAction '+ JSON.stringify(event))
    if (event.actionType==='Button'){
        this.messages.push({
            data: {message:event?.data?.label} as MessageData,
            messageSourceType:'INPUT'
          })
        //   if (event?.data?.submitValue==='infoBot'){
        //     this.botType = 'infoBot';
        //     this.conversationId='';
        //   }
          this.sendButtonAction(event?.data?.submitValue|| event?.data?.label)
    }else if (event.actionType==='Form'){
        this.messages.push({
            data: {message:event?.data?.label} as MessageData,
            messageSourceType:'INPUT'
          })
          this.sendFormAction(event?.data)
    }else if (event.actionType==='Card'){
        this.messages.push({
            data: {message:event?.data?.label} as MessageData,
            messageSourceType:'INPUT'
          })
          this.sendCardAction(event?.data?.submitValue)
    }else if (event.actionType==='list'){
        this.messages.push({
            data: {message:event?.data?.label} as MessageData,
            messageSourceType:'INPUT'
          })
          console.log("list data",event?.data)
          this.sendListAction(event?.data?.submitValue)
    }else if (event.actionType=='bpmn'){
      let decodedBpmn=atob(event.data.bpmnXml)
      this.isDialogVisible=true;
      setTimeout(()=>{this.previewBpmn(decodedBpmn)},500)
    }
    else if (event.actionType=='logsCollection'){
      console.log("log event",event)
      this.tableData = [
        { name: "IT Form Sent To The Manager", min: "00", hrs: "00", days: "00" },
        { name: "Manager Fills The Form", min: "00", hrs: "00", days: "00" },
        { name: "IT Team Creates Email ID", min: "00", hrs: "00", days: "00" },
        { name: "IT Team Assign A System", min: "00", hrs: "00", days: "00" },
        { name: "System Access For The User", min: "00", hrs: "00", days: "00" },
      ];
      this.createForm()
    }
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
          console.log("meta check",values)
          values.forEach((item:any)=>{
            this.tableData.push({
              stepName:item.stepName,
              days:"00",
              hrs:"00",
              min:"00",
            })
          })
          this.createForm();
          // let chatGridElement = document.getElementById("chat-box");
          // chatGridElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });  
          setTimeout(() => {
            var objDiv = document.getElementById("chat-box");
            objDiv.scrollTop = objDiv.scrollHeight;
          }, 200)

          setTimeout(()=>{
            this.showTable=true;
          },500)
        }

    }, err =>{

    })
  }


  get checkTable()
  {
    return this.tableData.length>0?true:false;
  }
}
