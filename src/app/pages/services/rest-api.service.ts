import { Injectable, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BpmnModel } from '../business-process/model/bpmn-autosave-model';

// const httpOptions = {
//   headers: new HttpHeaders({
//     // 'Content-Type': 'application/json',
//     'Authorization': 'Bearer '+localStorage.getItem("accessToken")
//   }),
// };

@Injectable({
  providedIn: 'root'
})
export class RestApiService{
  authHttpOptions;

  xmlheaderOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'text/xml',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Origin': '/*',
      'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method',
    }),
    responseType: 'text'
  }
  constructor(private http:HttpClient) { }
  getAccessToken(){
    let data = {"userId":"venkata.simhadri@epsoftinc.com",
                "password":"Welcome@123"};
    return this.http.post('/api/login/beta/accessToken',data);
  }
  bpmnlist(user){
    //GET /bpsprocess/approver/info/{roleName} 
return this.http.get<any[]>('/bpsprocess/approvalTnfoByUser/'+user);
}

approve_producemessage(bpmnProcessInfo){
  return this.http.post<any[]>('/bpsprocess/produceMessage',bpmnProcessInfo);
}
approve_savedb(bpmndata){
  return this.http.post<any[]>('/bpsprocess/save/bpms/notation/approval/workflow',bpmndata);
}
denyDiagram(msg_obj){
// POST /bpsprocess/save/bpms/notation/approval/workflow

return this.http.post<any[]>('/bpsprocess/save/bpms/notation/approval/workflow',msg_obj);
}


  getBPMNFileContent(filePath){
    // return this.http.post(filePath, this.xmlheaderOptions);
    return this.http.get(filePath, {headers: {observe: 'response'}, responseType: 'text'});
  }

  getApproverforuser(role){
    return this.http.get("/bpsprocess/approver/info/"+role)//first api call
  }
  getUserBpmnsList(){
    return this.http.get("/bpsprocess/fetchByUser/gopi"); 
  }
  saveBPMNprocessinfofromtemp(bpmnModel){
    return this.http.post("/bpsprocess/save/bpms/notation/from/temp",bpmnModel)//third api call
  }
  submitBPMNforApproval(bpmnModel){
    return this.http.post("/bpsprocess/submit/bpms/notation/approve", bpmnModel)//fourth api call
  }
  getBPMNtempnotations(){
    return this.http.get("/bpsprocess/temp/bpmn/{bpmnModelTempId}/notation/")//fifth api call
  }
  autoSaveBPMNFileContent(bpmnModel){
    return this.http.post("/bpsprocess/temp/bpms/notation", bpmnModel)//sixth api call
  }

  sendUploadedFile(file:FormData, uid){
    let api_method_call = "";
    switch(uid){
      case 1: api_method_call = 'uploadExcel'; break;
      case 2: api_method_call = 'uploadCSV'; break;
      case 3: api_method_call = 'uploadXes'; break;
    }
    return api_method_call != ""?this.http.post('/'+api_method_call, file, {responseType: 'text'}):null;// "target" : "http://10.11.1.189:8080",
  }

  
  toolSet(){
    return this.http.get("/rpa-service/load-toolset");
  }
  attribute(data:any){
  return this.http.get('/rpa-service/get-attributes/'+data)
  }
    saveBot(data:any):Observable<any>
    {
      return this.http.post('/rpa-service/save-bot',data)
    }

    updateBot(data:any)
    {
      return this.http.post('/rpa-service/update-bot',data)
    }
  
  getUserPause(botId){
    return this.http.post('/rpa-service/pause-bot/',botId)
  }
  getUserResume(botId){
    return this.http.post('/rpa-service/resume-bot/',botId)
  }
  botStatistics(){
    return this.http.get("/rpa-service/bot-statistics")
  }
  listEnvironments(){
    return this.http.get("/rpa-service/agent/get-environments")
  }
  execution(botid:number,data:any){
    let url='/rpa-service/start-bot/'+botid;
    console.log(url);
    return this.http.post(url,data)
  }

  deployremotemachine(botId){
    let data=null;
    return this.http.post('/rpa-service/agent/deploy-bot?botId='+botId,data);
  }
  
  getpredefinedbots(){
    return this.http.get("/rpa-service/getall-predefinedbots")/*jitendra: need to replace URL*/
  }

  scheduleList(data:any){
    return this.http.post('/rpa-service/getschedulesintervals-bot/'+42,data)
  }

  addenvironment(data:any):Observable<any>
  {
    const requestOptions: Object = {
      responseType: 'text'
    }
    console.log(data)
    return this.http.post<any>("/rpa-service/agent/save-environment",data, requestOptions);
  }

  deleteenvironment(data:any) :Observable<any>
  {
    const requestOptions: Object = {
      responseType: 'text'
    }
    return this.http.post<any>("/rpa-service/agent/delete-environment",data, requestOptions);
  
  }
  updateenvironment(data:any):Observable<any>
  {
    const requestOptions: Object = {
      responseType: 'text'
    }
    return this.http.put<any>("/rpa-service/agent/update-environment",data, requestOptions);
  }

  getAllRpaWorkSpaces(id:any)
  {
    if(id==0)
    {
      return this.http.get('/rpa-service/load-process-info/'+0);
    }
    else{ 
      return this.http.get('/rpa-service/load-process-info/processid='+id);    
    }
  }
  getAllOrcRpaWorkSpaces()
  {
      return this.http.get('/rpa-service/process-name');
   
  }
  saveConnectorConfig(body,categoryName,processName,piId){
    return this.http.post('/processintelligence/v1/connectorconfiguration/?categoryName='+categoryName+'&piId='+processName+'&piName='+piId,body)
  }
  getBotVersion(botid)
  {
   return this.http.get("/rpa-service/bot-version?botId="+botid);
  }


  // PI module rest api's

  fileupload(file){
    return this.http.post('/processintelligence/v1/connectorconfiguration/upload',file)
  }
  getCategoriesList(){
    return this.http.get('/processintelligence/v1/processgraph/categories')
  }
  addCategory(data){
    return this.http.post('/processintelligence/v1/processgraph/categories',data)
  }
  getAlluserProcessPiIds(){
    return this.http.get('/processintelligence/v1/processgraph/userProcess')
  }
  getAllVaraintList(piId){
    return this.http.get("/processintelligence/v1/processgraph/variantList?pid="+piId)
  }
  getfullGraph(piId){
    return this.http.get("/processintelligence/v1/processgraph/fullGraph?pid="+piId)
  }
  getvaraintGraph(piId){
    return this.http.get('/processintelligence/v1/processgraph/variantGraph?pid='+piId)
  }

  getProcessStatistics()
  { 
    return this.http.get("/rpa-service/process-statistics")
  }
}

