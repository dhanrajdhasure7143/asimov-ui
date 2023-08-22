import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataTransferService } from '../../services/data-transfer.service';
import * as BpmnJS from "../../../bpmn-modeler-copilot.development.js";
import { RestApiService } from '../../services/rest-api.service';

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

  constructor(private router: Router, 
    private dt: DataTransferService,
    private rest_api: RestApiService) { }

  ngOnInit(): void {
  }

  showDialog() {
    this.nextFlag = "";
    this.display = true;
  }

  navigateToCopilotChatScreen(template: any) {

    console.log(this.selectedFunction)
    if(template=='Others')
      this.router.navigate(["./pages/copilot/chat"], { queryParams: { templateId: 'Others' } })
    else
      this.router.navigate(["./pages/copilot/chat"], { queryParams: { templateId: template.template_id, process_id:this.selectedFunction.process_id } })
  }

  sendMessage() {
    this.historyList.push({ label: this.message })
    this.message = ""
  }

  getFunctionsList() {
    this.rest_api.getCopilotFunctionsList().subscribe((response: any) => {
      this.copilotFlag = "FUNCTIONS"
      this.display = true;
      this.funtionsList = response;
    })
  }

  getProcessesByFunctionId(functionItem: any) {
    console.log(functionItem)
    this.rest_api.getCopilotProcessesList(functionItem.functionId).subscribe((response: any) => {
      this.selectedProcess = functionItem;
      console.log(response)
      this.copilotFlag = "PROCESS"
      this.processList = response;
    })
  }

  getTemplatesByProcess(item: any) {
    this.rest_api.getCopilotTemplatesList(item.process_id).subscribe((response: any) => {
      this.selectedFunction = item;
      this.copilotFlag = "TEMPLATES"
      this.templates = response;
      this.processResponse(this.templates);
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
      this.bpmnModeler.importXML(atob(template.bpmn_xml), function (err) {
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

}
