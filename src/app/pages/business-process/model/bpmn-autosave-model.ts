export class BpmnModel{
    bpmnModelId:number;
    bpmnModelModifiedBy:string = "Vaidehi"; // localStorage.getItem("userName")
    // bpmnModelModifiedTime:Date;
    createdTimestamp:Date;
    modifiedTimestamp:Date;
    bpmnModelTempId:number;
    bpmnModelTempStatus:string = "Initial";
    bpmnModelTempVersion:string;
    bpmnProcessMeta:string;
    approverName:string = "";
    bpmnJsonNotation:string;
    bpmnNotationAutomationTask:string;
    bpmnNotationHumanTask:string;
    bpmnProcessApproved:number;
    userName:string = "gopi"; // localStorage.getItem("userName")
    tenantId:number;
    processIntelligenceId:number;
    id:number;
    emailTo:string = "saivijaya.malladi@epsoftinc.com"; // email of logged user
    category:string;
    bpmnXmlNotation:string;
    bpmnProcessStatus:string;
    bpmnProcessName:string;
    reviewComments:string = "";
    version:string;
    versionId:number
}