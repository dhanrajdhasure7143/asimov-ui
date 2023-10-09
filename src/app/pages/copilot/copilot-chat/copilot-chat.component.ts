import { Component, OnInit, ViewChild, ElementRef, Inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import * as BpmnJS from "../../../bpmn-modeler-copilot.development.js";
import { RestApiService } from "../../services/rest-api.service";
import { MessageService } from "primeng/api";
import { DataTransferService } from "../../services/data-transfer.service";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MessageData, UserMessagePayload } from "../copilot-models";
import { CopilotService } from "../../services/copilot.service";
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
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
  @ViewChild("popupMenu", { static: false }) popupMenuOverlay;
  @ViewChild('diagramContainer', { static: false }) diagramContainer: ElementRef;
  isDialogVisible: boolean = false;
  bpmnActionDetails: any;
  messages: any = [];
  usermessage: any = "";
  showTable: boolean = false;
  processLogsData: any[] = [];
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
  tableForm: FormArray;
  currentMessage:any;
  isGraphLoaded:boolean=false;
  isTableLoaded:boolean=false;
  previewLabel:any="";
  constructor(
    private rest_api: CopilotService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private dt: DataTransferService,
    private fb: FormBuilder,
    private main_rest:RestApiService
  ) {}

  ngOnInit() {
    this.loader = true;
    this.createForm();
    this.route.queryParams.subscribe((params: any) => {
      if (params.templateId) {
        this.loadBpmnContainer();
        (isNaN(params.templateId) && params.templateId != "Others")?this.getAutomatedProcess(atob(params.templateId)):this.getConversationId();
      }
    });
  }

  loadBpmnContainer(){
    let container:any=this.diagramContainer?.nativeElement;
    (!container)?setTimeout(() => this.loadBpmnContainer(), 100):this.bpmnModeler = new BpmnJS({container});
  }


 

  getTemplatesByProcessId(processId, templateId) {
    this.rest_api.getCopilotTemplatesList(processId).subscribe((response: any) => {
        let template:any;
        if(response) (template = response.find((item: any) => item.templateId == templateId),this.loadBpmnwithXML({bpmnXml:template.bpmnXml,isUpdate:true}));
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
        this.updateCurrentMessageButtonState("DISABLED");
        this.usermessage = "";
          this.rest_api.sendMessageToCopilot(data).subscribe((response: any) => {
          this.isChatLoad = false;
          let res = { ...{}, ...response };
          this.updateTemplateFlag(res);
          this.currentMessage=res;
          this.updateCurrentMessageButtonState("ENABLED")
          this.messages.push(this.currentMessage);
          console.log(this.messages)
          var objDiv = document.getElementById("chat-grid");
          setTimeout(() => {
            objDiv.scrollTop = objDiv.scrollHeight;
          }, 500)
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
    if(!(bpmnActionDetails?.isUpdate)){
      this.messages.push({message:bpmnActionDetails.label,messageSourceType:localStorage.getItem("ProfileuserId")})
      this.sendBpmnAction(bpmnActionDetails.submitValue)
    }
    setTimeout(() => {
      this.notationFittoScreen();
      this.readBpmnModelerXMLdata();
    }, 500);
    this.bpmnModeler.on("element.contextmenu", () => false);
  }

  previewBpmn(bpmnActionDetails:any) {
    let previewMolder = new BpmnJS({ container: ".graph-preview-container" });
    this.bpmnActionDetails = bpmnActionDetails;
    let bpmnXml=atob(bpmnActionDetails.bpmnXml);
    this.isGraphLoaded=true;
    previewMolder.importXML(bpmnXml, function (err) {
      if (err) {
        console.error("could not import BPMN EZFlow notation", err);
      }
    });
    setTimeout(() => {
      let canvas = previewMolder.get("canvas");
      canvas.zoom("fit-viewport");
    }, 200);
  }

  notationFittoScreen() {
    let canvas = this.bpmnModeler.get("canvas");
    canvas.zoom("fit-viewport");
  }

  readBpmnModelerXMLdata() {
    var self = this;
    self.bpmnModeler.on("element.changed", function () {
      self.bpmnModeler.saveXML({ format: true }, function (err, xml) {
        let payload={
          conversationId:localStorage.getItem("conversationId"),
          message:xml
        }
        self.rest_api.updateProcessLogGraph(payload).subscribe((response:any)=>{
        },err=>{
        })
      });
    });
  }

  createForm() {
    const formControls = [];
    for (let i = 0; i < this.processLogsData.length; i++) {
      formControls[i] = this.fb.group({
        minutes: ['', Validators.required],
        hours: ['', Validators.required],
        days: ['', Validators.required],
        stepId:this.processLogsData[i]["stepId"],
        stepName:this.processLogsData[i]["stepName"]
      });
    }
    this.tableForm = this.fb.array(formControls);
  }



  updateFormEvent(index, fieldName)
  {
    (["minutes", "hours", "days"]).forEach((item)=>{
      if(item==fieldName)
      {
        this.tableForm.at(index).get(item).setValidators(Validators.compose([Validators.required]));
        this.tableForm.at(index).get(item).updateValueAndValidity();   
      }
      else
      {
        this.tableForm.at(index).get(item).clearValidators(); 
        this.tableForm.at(index).get(item).updateValueAndValidity();
      }
    })
  }

  onSubmit(){
    console.log(this.tableForm. valid)
    if(!this.tableForm.valid){
      this.messageService.add({severity:'error', summary:'Invalid Data', detail:'Please fill all fields'});
    }
    console.log(this.tableForm.value)
  }

  getConversationId(){
    let req_body = {"userId": localStorage.getItem("ProfileuserId")}
    let resdata;
    this.loader=true;
    this.rest_api.initializeConversation(req_body).subscribe(
      (res:any)=>{
        this.loader=false
        resdata = res
        this.currentMessage=res;
        this.messages.push(resdata); 
        localStorage.setItem("conversationId", res.conversationId)
      },err=>{
        this.loader=false;
      }
    )
  }

  processMessageAction = (event:any) =>{
    if (event.actionType==='Button'){
        this.messages.push({
            message:event?.data?.label,
            messageSourceType:localStorage.getItem("ProfileuserId")
          })
          this.sendButtonAction(event?.data?.submitValue|| event?.data?.label)
    }else if (event.actionType==='Form'){
      this.messages.push({
        message:event?.data?.message,
        messageSourceType:localStorage.getItem("ProfileuserId")
      })
      this.sendFormAction(event.data)
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
      this.previewLabel=event.data.label;
      setTimeout(()=>{this.previewBpmn(event.data)},500)
    }
    else if (event.actionType=='UploadFileAction'){
      this.changefileUploadForm(event.fileDataEvent, event.data)
    }
    else if(event.actionType=='ProcessLogAction'){
      this.sendProcessLogs(event.data);
    }
  }

  sendProcessLogs(buttonData:any){
    if(this.tableForm.valid){
      let tableData=[...this.tableForm.value];
      tableData=tableData.map((item:any)=>{
        (["days", "minutes", "hours"]).forEach((attr:any)=>{
          if(item[attr]=='')
          {
            item[attr]="00";
          }
        })
        return item;
      })
      let data={
        conversationId:localStorage.getItem("conversationId"),
        message:buttonData?.submitValue,
        jsonData:tableData
      }
      this.messages.push(data);

      this.updateCurrentMessageButtonState("DISABLED");
      this.rest_api.sendMessageToCopilot(data).subscribe((response:any)=>{
        this.currentMessage=response;
        this.updateCurrentMessageButtonState("ENABLED");
        this.messages.push(this.currentMessage)
        var objDiv = document.getElementById("chat-grid");
        setTimeout(() => {
          objDiv.scrollTop = objDiv.scrollHeight;
        }, 500)
      })
    }
    else
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please fill time in all fields "
      });
    
  }
  

  public sendBpmnAction=(value:string)=>{
    this.sendUserAction({message:value})
  }

  public sendButtonAction = (value:string) =>{
    this.sendUserAction({
        message: value
    })
  }


  public sendFormAction = (event:any) =>{
    this.sendUserAction(event)
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
    this.updateCurrentMessageButtonState("DISABLED");
    this.isChatLoad=true;
    let response = this.rest_api.sendMessageToCopilot(userMessage);
    response.subscribe((res:any) =>{
        this.currentMessage=res;
        this.updateCurrentMessageButtonState("ENABLED");
        this.updateTemplateFlag(res);
        this.messages.push(this.currentMessage);
        this.usermessage='';
        var objDiv = document.getElementById("chat-grid");
        setTimeout(() => {
          objDiv.scrollTop = objDiv.scrollHeight;
          this.isChatLoad=false;
        }, 500)
        if (res.data?.components?.includes('logCollection')) this.displaylogCollectionForm(res);
    }, err =>{
      console.log(err);
    })
  }

  displaylogCollectionForm(res:any){
    let values =res.data?.values[ res.data?.components?.indexOf('logCollection')];
    values= JSON.parse( atob(values[0].values));
    values.forEach((item:any)=>{
      this.processLogsData.push({
        stepName:item.stepName,
        stepId:item.stepId,
        days:"00",
        hours:"00",
        minutes:"00",
      })
    })
    this.createForm();
    setTimeout(()=>{
      this.showTable=true;
      this.isTableLoaded=true;
    },500)
  }


  getAutomatedProcess(intent:any){
    let req_body:any= {
      "userId":localStorage.getItem("ProfileuserId"),
      "tenantId":localStorage.getItem("tenantName")
    }

    if(this.validateJson(intent)){
      let parsedData=JSON.parse(intent);
      if(parsedData.isTemplate){
        this.getTemplatesByProcessId(parsedData.processId,parsedData.templateId)
        req_body["intent"]=parsedData.templateName
        req_body["templateId"]=parsedData.templateId;
      }else{
        req_body["message"]=parsedData.message
      }
    }else{
      req_body["intent"]=intent
    }
    this.loader=true;
    this.rest_api.getAutomatedProcess(req_body).subscribe(res=>{
      this.loader=false;
      this.currentMessage=res;
      localStorage.setItem("conversationId", res.conversationId);
      this.messages.push(res);
    },err=>{
      this.loader=false;
    })
  }

  changefileUploadForm(event:any, buttonData:any){
    let selectedFile = <File>event.target.files[0];
    this.isChatLoad=true;
    let fileName = selectedFile.name.split('.');
    buttonData.fileType=fileName[fileName.length-1];
    if(fileName[fileName.length-1]=="xlsx") this.readExcelFile(selectedFile, buttonData);
    if(fileName[fileName.length-1]=="csv") this.readCSVFile(selectedFile ,buttonData);
    if(fileName[fileName.length-1]=="xes" || fileName[fileName.length-1]=="gz") this.uploadProcessLogsFile(selectedFile, {...buttonData, ...{fileType:fileName[fileName.length-1]}})
  }

  updateCurrentMessageButtonState(state){
    if(this.currentMessage.data.components){
      if(this.currentMessage.data.components?.includes("Buttons")){
        let componentIndex=this.currentMessage.data.components?.findIndex((item)=>item=="Buttons");
        this.currentMessage.data.values[componentIndex]=this.currentMessage.data?.values[componentIndex].map((item:any)=>{
          item['disabled']=(state=="ENABLED"?false:true);
          return item;
        })
      }
      if(this.currentMessage.data.components.includes("list")){
        let componentIndex=this.currentMessage.data.components.findIndex((item)=>item=="list");
        if(this.currentMessage.data.values[componentIndex].filter((item)=>item.type=="bpmnList").length>0){
          this.currentMessage.data.values[componentIndex]=this.currentMessage.data.values[componentIndex].map((item)=>{
            if(item?.type=="bpmnList")
              if(item?.actions)
                item.actions=item.actions.map((actionItems)=>{
                  actionItems["disabled"]=(state=="ENABLED"?false:true);
                  return actionItems;
                })
              return item;
          })
        }
        if(state=="DISABLED")
          if(this.messages.find((item:any)=>item?.data?.uuid==this.currentMessage?.data?.uuid))
            this.messages.find((item:any)=>item?.data?.uuid==this.currentMessage?.data?.uuid).data=this.currentMessage.data;
      }
    }

  }


  updateTemplateFlag(currentMessage)
  {
    if(currentMessage.data.components?.find((item:any)=>item=="list"))
    {
      let index=(currentMessage.data.components?.findIndex((item:any)=>item=="list"))
      currentMessage.data.values[index].forEach((item:any)=>{
        if(item.type)
          if(item.type=='bpmnList'){
            if(item.hide)
            {
              let bpmnData=JSON.parse(atob(item.values));
              let bpmnActionDetails={
                bpmnXml:bpmnData[0].bpmnXml,
                label:bpmnData[0].templateName,
                isUpdate:true
              }
              this.loadBpmnwithXML(bpmnActionDetails);
            }
          }
      })
    }
  }


  validateJson(intentDetails:any){
    try{
      let data=JSON.parse(intentDetails);
      return data;
    }catch(e){
      return false;
    }
  }

  autoGrowTextZone(e) {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }

  readExcelFile(evt, buttonData) {    // read xls files
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr,  { type: 'binary', cellText: false, cellDates:true });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      let excelfile:any[] = <any[][]>(XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, defval: '', blankrows: true, range: 0, dateNF:'YYYY-MM-DD HH:mm:ss' }));
      if(excelfile.length<=2||excelfile[0].length==0||(excelfile[1].length==0&&excelfile[2].length==0)||excelfile[1].length==1){
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "No data was found in the uploaded file!",
        })
      } else{
        buttonData.headers=excelfile[0];
        this.uploadProcessLogsFile(evt,buttonData);
      }
    };
    reader.readAsBinaryString(evt);
  }

  readCSVFile(e, buttonData) {        //  read CSV files
    let reader = new FileReader();
    reader.readAsText(e);
    let _self = this;
    reader.onload = () => {
      let csvRecordsArray: string[][] = [];
      (<string>reader.result).split(/\r\n|\n/).forEach((each, i) => {
        if(each)
        csvRecordsArray.push(each.split(','));
      })   
      let excelfile = [];
      excelfile = csvRecordsArray;
      if(excelfile.length<=2||excelfile[0].length==0||(excelfile[1].length==0&&excelfile[2].length==0)||excelfile[1].length==1){
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "No data was found in the uploaded file!",
        })
      } else{
        buttonData.headers=excelfile[0];
        this.uploadProcessLogsFile(e,buttonData);
      }
    };
  }

  uploadProcessLogsFile(selectedFile,buttonData){
    const fd = new FormData();
    fd.append('file', selectedFile),
    fd.append('permissionStatus', 'yes');
    this.main_rest.fileupload(fd).subscribe((res:any) => {
      if(res){
        const dataValue = res.data;
        const fileName = dataValue.split(':')[1].trim();
        this.isChatLoad=false;
        this.sendUserAction({
          message:buttonData.submitValue,
          jsonData:JSON.stringify({fileName:fileName, headers:buttonData.headers,fileType:buttonData.fileType})
        })
      }
    },err=>{
      this.isChatLoad=false;
    })
  }
}
