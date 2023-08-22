import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataTransferService } from '../../services/data-transfer.service';
import { BehaviorSubject } from 'rxjs';
import * as BpmnJS from "./../../../bpmn-modeler-copilot.development.js";
import { RestApiService } from '../../services/rest-api.service';

@Component({
  selector: 'app-copilot-chat',
  templateUrl: './copilot-chat.component.html',
  styleUrls: ['./copilot-chat.component.css']
})
export class CopilotChatComponent implements OnInit {
  display: boolean = false;
  historyOpen:boolean = false;
  historyList:any=[]
  message:any
  nextFlag:any=""
  processesList:any=[];
  functions:any=[];
  templates:any=[];
  selectedProcess:any={};
  selectedFunction:any={};
  bpmnModeler: any;

  constructor(private router:Router, private dt:DataTransferService,
              private rest_api: RestApiService) { }
  rest:any={
    getProcesses:new BehaviorSubject([
      {
          "processName": "Quote to Cash"
      },
      {
          "processName": "Finance & Accounting"
      },
      {
          "processName": "Production"
      },
      {
          "processName": "Business\nWarehouse"
      },
      {
          "processName": "Demand to Pay"
      },
      {
          "processName": "CRM"
      },
      {
          "processName": "Master Date Management"
      },
      {
          "processName": "Human\nResource"
      }
  ]
  ),
    getFunctions:new BehaviorSubject([
      {
        functionName:"Recruiting (7)",
      },
      {
        functionName:"Learning & Development (10)",
      },
      {
        functionName:"Training (2)",
      },
      {
        functionName:"Talent Management (12)",
      },
      {
        functionName:"Payroll (12)",
      },
      {
        functionName:"Seperation (12)",
      },
      {
        functionName:"benifits (3)",
      },
      {
        functionName:"Retirement (12)",
      },
      
    ]),
    getTemplates:new BehaviorSubject([
      {
          "id": 1,
          "templateTitle": "Workforce Planning",
          "templatePreviewImage": "../../../../assets/images-n/co-pilot/template-1.png",
          "xml":"assets/resources/Copilot- 3.bpmn"
      },
      {
          "id": 2,
          "templateTitle": "Job Analysis and Job Posting",
          "templatePreviewImage": "../../../../assets/images-n/co-pilot/template-2.png",
          "xml":"assets/resources/Copilot-1.bpmn"
      },
      {
          "id": 3,
          "templateTitle": "Assessment and Testing",
          "templatePreviewImage": "../../../../assets/images-n/co-pilot/template-3.png",
          "xml":"assets/resources/Copilot- 2.bpmn"
      },
      {
          "id": 4,
          "templateTitle": "Talent Pipeline Management",
          "templatePreviewImage": "../../../../assets/copilot/Talentpipeline.png"
      },
      {
          "id": 5,
          "templateTitle": "Compliance and Legal Considerations",
          "templatePreviewImage": "../../../../assets/copilot/Compliance.png"
      },
      // // {
      // //     "id": 6,
      // //     "templateTitle": "Candidate Experience",
      // //     "templatePreviewImage": "../../../../assets/copilot/Candidatexp.png"
      // // },
      // {
      //     "id": 7,
      //     "templateTitle": "Applicant Tracking System (ATS) Management",
      //     "templatePreviewImage": "../../../../assets/copilot/ATSmgmt.png"
      // }
  ])
  }
  copilotFlag:string="FUNCTIONS";



   
  ngOnInit(): void {
    this.historyList=[
      {label:"Process Graph"},
      {label:"RPA"},
      {label:"BPS"},
      {label:"PI"}
    ]
    this.dt.setCopilotData(undefined)


   // this.getProcessNames();
  
}  

showDialog() {
  this.nextFlag="";
  this.display = true;
}

openChat2(template:any){
  this.router.navigate(["./pages/copilot/copilot-chat"],{queryParams:{template:template}}) 
}

sendMessage(){
  console.log(this.message);
  this.historyList.push({label:this.message})
  this.message=""
}


getFunctionsList(){
  this.rest_api.getCopilotFunctionsList().subscribe((response:any)=>{
    this.copilotFlag="FUNCTIONS"
    this.display=true;
    this.processesList=response;
  })
}

getProcessesByFunctionId(functionItem:any){
  console.log(functionItem)
  this.rest_api.getCopilotProcessesList(functionItem.functionId).subscribe((response:any)=>{
    this.selectedProcess=functionItem;
    console.log(response)
    this.copilotFlag="PROCESS"
    this.functions=response;
  })
  // this.getTemplatesByFunction(functionItem);
}


getTemplatesByProcess(item:any){
  console.log(item)
  this.rest_api.getCopilotTemplatesList(item.process_id).subscribe((response:any)=>{
    console.log(response)
    this.selectedFunction=item;
    this.copilotFlag="TEMPLATES"
    this.templates=response;
    this.processResponse(this.templates);
  })
}

async processResponse(response) {
  for (let index = 0; index < response.length; index++) {
    const item = response[index];
    await new Promise(resolve => setTimeout(resolve, 2000));
    this.loadBpmnInTemplate(item, index);
  }
  // for (let index = 0; index < this.templates.length; index++) {
  //   const item = this.templates[index];
  //   // Process the first item immediately
  //   if (index === 0) {
  //     setTimeout(() => {
  //     this.loadBpmnInTemplate(item, index);
  //     }, 2000);
  //   } else {
  //     await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for 3 seconds
  //     this.loadBpmnInTemplate(item, index);
  //   }
  // }
}

openHumanResource(){
  this.nextFlag="Human Resource"
}

openRecruiting(){
  this.nextFlag="Recruiting"
}


loadBpmnInTemplate(template?,index?) {
  console.log(template,"testing",index)
    let xml = ""
    let notationJson = {
      container: '.diagram_copilot'+index,
      keyboard: {
        bindTo: window,
      }
    };

    this.bpmnModeler = new BpmnJS(notationJson);
    // let path = "assets/resources/copilot_bpmn_chatgpt.bpmn"
    let path = template.xml
    setTimeout(() => {
      this.rest_api.getBPMNFileContent(path).subscribe((res) => {
        this.bpmnModeler.importXML(res, function (err) {
          if (err) {
            console.error("could not import BPMN EZFlow notation", err);
          }
        });
        setTimeout(() => {
          let canvas = this.bpmnModeler.get('canvas');
          canvas.zoom('fit-viewport');
        }, 200)

        // this.bpmnModeler.on('element.contextmenu', () => false);
        // this.bpmnModeler.on('contextPad.destroy', event => {
        //   console.log("check")
        //   const contextPadContainer = event.contextPad._container;
        //   contextPadContainer.parentNode.removeChild(contextPadContainer);
        // });
      });
  this.templates[index]["isExicuted"]= true;

    }, 1500);
}



}
