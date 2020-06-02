export interface environmentobservable{
     environmentId   : number,
     orgId           : number,
     environmentName : String,
     comments        : String,
     activeTimeStamp : String,
     createdTimeStamp: String,
     deployStatus    : Boolean,
     environmentType : String ,
     hostAddress     : String,
     userName        : String,
     password        : String,
     agentPath       : String,
     activeStatus    : number,
     connectionType  : String ,
     portNumber      : number,
     checked?: boolean;
}
