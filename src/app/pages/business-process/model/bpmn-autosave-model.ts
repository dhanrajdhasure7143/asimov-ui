export class BpmnModel{
    bpmnModelId:string;
    createdTimestamp:Date = new Date();
    modifiedTimestamp:Date = new Date();
    bpmnTempId:number;
    approverName:string = "";
    // bpmnJsonNotation:string;
    bpmnNotationAutomationTask:string;
    bpmnNotationHumanTask:string;
    bpmnProcessApproved:number;
    userName:string; 
    tenantId:string;
    processIntelligenceId:number;
    id:number;
    userEmail:string;
    approverEmail:string;
    category:string;
    bpmnXmlNotation:string;
    bpmnProcessStatus:string;
    bpmnProcessName:string;
    reviewComments:string = "";
}