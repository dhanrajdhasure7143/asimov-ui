export class BpmnModel{
    bpmnModelId:string;
    createdTimestamp:Date = new Date();
    modifiedTimestamp:Date = new Date();
    bpmnTempId:number;
    approverName:string = "";
    bpmnNotationAutomationTask:string;
    bpmnNotationHumanTask:string;
    bpmnProcessApproved:number;
    userName:string;
    tenantId:string;
    processIntelligenceId:number;
    id:number;
    ntype:string;
    userEmail:string;
    approverEmail:string;
    category:string;
    bpmnXmlNotation:string;
    bpmnProcessStatus:string;
    bpmnProcessName:string;
    reviewComments:string = "";
    notationFromPI:boolean = false;
    hasConformance:boolean = false;
    bpmnConfProcessMeta:string = "";
}