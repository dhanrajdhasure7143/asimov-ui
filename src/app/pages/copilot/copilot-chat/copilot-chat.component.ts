import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataTransferService } from '../../services/data-transfer.service';
import { BehaviorSubject } from 'rxjs';
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
  processes:any=[];
  functions:any=[];
  templates:any=[];
  selectedProcess:any={};
  selectedFunction:any={};
  constructor(private router:Router, private dt:DataTransferService) { }
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
          "templatePreviewImage": "../../../../assets/images-n/co-pilot/template-1.png"
      },
      {
          "id": 2,
          "templateTitle": "Job Analysis and Job Posting",
          "templatePreviewImage": "../../../../assets/images-n/co-pilot/template-2.png"
      },
      {
          "id": 3,
          "templateTitle": "Assessment and Testing",
          "templatePreviewImage": "../../../../assets/images-n/co-pilot/template-3.png"
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
      // {
      //     "id": 6,
      //     "templateTitle": "Candidate Experience",
      //     "templatePreviewImage": "../../../../assets/copilot/Candidatexp.png"
      // },
      {
          "id": 7,
          "templateTitle": "Applicant Tracking System (ATS) Management",
          "templatePreviewImage": "../../../../assets/copilot/ATSmgmt.png"
      }
  ])
  }
  copilotFlag:string="PROCESS";



   
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


getProcessNames()
{
  this.rest.getProcesses.subscribe((response:any)=>{
    this.copilotFlag="PROCESS"
    this.display=true;
    this.processes=response;
  })
}

getFunctionsByProcessId(processItem:any)
{
  this.rest.getFunctions.subscribe((response:any)=>{
    this.selectedProcess=processItem;
    this.copilotFlag="FUNCTIONS"
    this.functions=response;
  })
}


getTemplatesByFunction(functionItem:any)
{
  this.rest.getTemplates.subscribe((response:any)=>{
    this.selectedFunction=functionItem;
    this.copilotFlag="TEMPLATES"
    this.templates=response;
  })
}
openHumanResource()

{
  this.nextFlag="Human Resource"
}

openRecruiting()
{
  this.nextFlag="Recruiting"
}




}
