export class BpmnModel{
    bpmnModelId:string;
    createdTimestamp:Date = new Date();
    modifiedTimestamp:Date = new Date();
    bpmnTempId:number;
    approverName:string = "";
    bpmnJsonNotation:string;
    bpmnNotationAutomationTask:string;
    bpmnNotationHumanTask:string;
    bpmnProcessApproved:number;
    userName:string = "gopi"; // localStorage.getItem("userName")
    tenantId:number;
    processIntelligenceId:number;
    id:number;
    //emailTo:string = "saivijaya.malladi@epsoftinc.com"; // email of logged user
    userEmail:string="";
    approverEmail:string="";
    
    category:string;
    bpmnXmlNotation:string;
    bpmnProcessStatus:string;
    bpmnProcessName:string;
    reviewComments:string = "";
}