import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataTransferService } from '../../services/data-transfer.service';
import * as BpmnJS from "../../../bpmn-modeler-copilot.development.js";
import { RestApiService } from '../../services/rest-api.service';
import { MessageService } from 'primeng/api';
import { CopilotService } from '../../services/copilot.service';

@Component({
  selector: 'app-copilot-home',
  templateUrl: './copilot-home.component.html',
  styleUrls: ['./copilot-home.component.css']
})
export class CopilotHomeComponent implements OnInit {
  display: boolean = false;
  historyOpen: boolean = false;
  historyList: any = []
  message: any
  nextFlag: any = ""
  funtionsList: any = [];
  processList: any = [];
  templates: any = [];
  selectedProcess: any = {};
  selectedFunction: any = {};
  bpmnModeler: any;
  copilotFlag: string = "FUNCTIONS";
  intentData:any="";
  constructor(private router: Router, 
    private dt: DataTransferService,
    private rest_api:CopilotService ,
    private messageService:MessageService,
    private restService: RestApiService
    ) { }

  ngOnInit(): void {
  }

  showDialog() {
    this.nextFlag = "";
    this.display = true;
  }

  navigateToCopilotChatScreen(template: any) {
    if(template=='Others')
      this.router.navigate(["./pages/copilot/chat"], { queryParams: { templateId: 'Others' } })
    else{
      const templateData:any =  { templateId: template.templateId, templateName:template.templateName,isTemplate:true,processId:template.processId };
      this.router.navigate(["./pages/copilot/chat"], { queryParams:{templateId:  btoa(JSON.stringify(templateData))}});
    }
  }

  sendMessage() {
    this.historyList.push({ label: this.message })
    this.message = ""
  }

  getFunctionsList() {
    this.restService.getCopilotFunctionsList().subscribe((res)=>{
      console.log(res)
    })
    this.rest_api.getCopilotFunctionsList().subscribe((response: any) => {
      this.copilotFlag = "FUNCTIONS"
      this.display = true;
      this.funtionsList = response;
    },(err:any)=>{
      console.log(err);
      this.messageService.add({severity:'error', summary:'Error', detail:'Unable to get Functions!'});
    })
  }

  getProcessesByFunctionId(functionItem: any) {
    console.log(functionItem)
    this.rest_api.getCopilotProcessesList(functionItem.functionId).subscribe((response: any) => {
      this.selectedProcess = functionItem;
      console.log(response)
      this.copilotFlag = "PROCESS"
      this.processList = response;
    },err=>{
      console.log(err);
      this.messageService.add({severity:'error', summary:'Error', detail:'Unable to get Processes!'});
    })
  }

  getTemplatesByProcess(item: any) {
    this.rest_api.getCopilotTemplatesList(item.process_id).subscribe((response: any) => {
      this.selectedFunction = item;
      this.copilotFlag = "TEMPLATES"
      this.templates = response;
      this.processResponse(this.templates);
    },(err:any)=>{
      console.log(err);
      this.messageService.add({severity:'error', summary:'Error', detail:'Unable to get Templates!'});
    })
  }

  async processResponse(response) {
    for (let index = 0; index < response.length; index++) {
      const item = response[index];
      await new Promise(resolve => setTimeout(resolve, 2000));
      this.loadBpmnInTemplate(item, index);
    }
  }

  openHumanResource() {
    this.nextFlag = "Human Resource"
  }

  openRecruiting() {
    this.nextFlag = "Recruiting"
  }

  loadBpmnInTemplate(template?, index?) {
    let notationJson = {
      container: '.diagram_copilot' + index,
      keyboard: {
        bindTo: window,
      }
    };
    this.bpmnModeler = new BpmnJS(notationJson);
    setTimeout(() => {
      this.bpmnModeler.importXML(atob(template.bpmnXml), function (err) {
        if (err) {
          console.error("could not import BPMN EZFlow notation", err);
        }
      });
      setTimeout(() => {
        let canvas = this.bpmnModeler.get('canvas');
        canvas.zoom('fit-viewport');
      }, 200)
      this.templates[index]["isExicuted"] = true;
    }, 1500);
  }
  navigateToCopilotChatScreenWithIntent(intent:any) {
    this.router.navigate(["./pages/copilot/chat"],{ queryParams: { templateId: btoa(intent)}})
  }

  navigateToProjects(){
    this.router.navigate(["./pages/projects/listOfProjects"])
  }

  navigateToChatScreenWithMessage()
  {
    this.router.navigate(["./pages/copilot/chat"],{queryParams:{templateId:btoa(JSON.stringify({type:'message',message:this.intentData}))}}); 
  }
}
