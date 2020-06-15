import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import {observableToBeFn} from "rxjs/internal/testing/TestScheduler";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

const authHttpOptions = {
  headers: new HttpHeaders({
      'Authorization':'Bearer eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJBaW90YWwiLCJzdWIiOiJ2ZW5rYXRhLnNpbWhhZHJpQGVwc29mdGluYy5jb20iLCJ1c2VyRGV0YWlscyI6eyJ1c2VySWQiOiJ2ZW5rYXRhLnNpbWhhZHJpQGVwc29mdGluYy5jb20iLCJpZCI6IjIiLCJkZXBhcnRtZW50IjoiZGV2ZWxvcG1lbnQiLCJ0ZW5hbnRJZCI6IjRlMmQ2NmRiLWQxNmItNDk1OC04NjhmLTdjMzA2ZWY3NjViYyIsImRvbWFpbiI6bnVsbCwicm9sZXMiOlt7ImFwcElkIjoiMiIsImFwcE5hbWUiOiIyLjAiLCJpZCI6IjgiLCJyb2xlTmFtZSI6IkFkbWluIiwicGVybWlzc2lvbnMiOltdfV19LCJ1c2VyU2Vzc2lvbklkIjoiMjY4MSIsImlhdCI6MTU5MjE5NTczNCwiZXhwIjoxNTkyMTk4NzM0fQ.24b3MZohVUe4i3qLQIJwkgaQ9WsHlteXL09nbIqvdt-WSx4kQwnEEjsDAk9cxYAfNTZcx_rdLOowqH48HIPz_atL2cU0DUNKLt8ka2Sn-5wqQ6uVxk2k11Mu6cmPNXC0tN0QJc5A0wKyf_QRa8FFeMSArrwu6a5P61oFklVRWCMmMJ91b2UJRqcMg6kJdbUtDIFeH-WdcARkndHzGZrcDcVfxOR__6xV0UqFaz7lN64ODu0j0mPe8qrfJjGPF2bCeLPPMZJbJBgUYXoEi3h5kWCBrnOtmrg6pscP8Agf-z2PlQ2H9DBmyYarkc7WJ29PzWwXu-GswEzVkLsKIraUhA'
  }),
};

// const authHttpOptions = {
//   headers: new HttpHeaders({
//       'Authorization':'Bearer eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJBaW90YWwiLCJzdWIiOiJ2ZW5rYXRhLnNpbWhhZHJpQGVwc29mdGluYy5jb20iLCJ1c2VyRGV0YWlscyI6eyJ1c2VySWQiOiJ2ZW5rYXRhLnNpbWhhZHJpQGVwc29mdGluYy5jb20iLCJpZCI6IjIiLCJkZXBhcnRtZW50IjoiZGV2ZWxvcG1lbnQiLCJ0ZW5hbnRJZCI6IjRlMmQ2NmRiLWQxNmItNDk1OC04NjhmLTdjMzA2ZWY3NjViYyIsImRvbWFpbiI6bnVsbCwicm9sZXMiOlt7ImFwcElkIjoiMiIsImFwcE5hbWUiOiIyLjAiLCJpZCI6IjgiLCJyb2xlTmFtZSI6IkFkbWluIiwicGVybWlzc2lvbnMiOltdfV19LCJ1c2VyU2Vzc2lvbklkIjoiMjU1OCIsImlhdCI6MTU5MjAyMTkzMiwiZXhwIjoxNTkyMDI0OTMyfQ.C--xgyNDzc-m55_ilQhnZbuhJ63gqzNQOCafo9tknUCcp147vBTrlh6zg10qq-0aJ61X8RJEFCz0GUHON-W9o7F04BzPDchOPMVO4gFMzh6BOFzeW_PdAZvmXGmtjDouUw4HaW8JWSBmdnRKE1QkIMNixXXxxbC3hv9Ja-o_RD0RZfKnJi11cLKosjFFkGniUhVMiH8vy1b9SeULzeDVmmguibPtxqAylUl9lGq8814WgtPs9OzvuxcG1WBQ1FHVkXWtg5dSmLvOWJdCf8qlkh0XC_J8NtS6RbVQH2SwL2hYFgGKib4N_wuwm_ZeYU0INubI-p3W2Sqc_s27iPH7KQ'
//   }),
// };


@Injectable({
  providedIn: 'root'
})
export class RestApiService {
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

  bpmnlist(user){
    //GET /bpsprocess/approver/info/{roleName} 
return this.http.get<any[]>('bpsprocess/approvalTnfoByUser/'+user);
}

approve_producemessage(bpmnProcessInfo){
  return this.http.post<any[]>('bpsprocess/produceMessage',bpmnProcessInfo,httpOptions);
}
approve_savedb(bpmndata){
  return this.http.post<any[]>('bpsprocess/save/bpms/notation/approval/workflow',bpmndata,httpOptions);
}
denyDiagram(msg_obj){
// POST /bpsprocess/save/bpms/notation/approval/workflow

return this.http.post<any[]>('bpsprocess/save/bpms/notation/approval/workflow',msg_obj,httpOptions);
}


  getBPMNFileContent(filePath){
    // return this.http.post(filePath, this.xmlheaderOptions);
    return this.http.get(filePath, {headers: {observe: 'response'}, responseType: 'text'});
  }

  autoSaveBPMNFileContent(bpmnModel){
    return this.http.post("/bpsprocess/temp/bpms/notation", bpmnModel, authHttpOptions);
  }

  submitBPMNforApproval(bpmnModel){
    return this.http.post("/bpsprocess/submit/bpms/notation/approve", bpmnModel)
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

  getUserBpmnsList(){
    return this.http.get("/bpsprocess/fetchByUser/mounika"); //authHttpOptions
  }
  toolSet(){
    return this.http.get("/rpa-service/load-toolset");
  }
  attribute(data:any){
  return this.http.get('/rpa-service/get-attributes/'+data)
  }
  saveBot(data:any):Observable<any>{
    return this.http.post('/rpa-service/save-bot',data)
    }
  getUserPause(botId):Observable<any> {
    return this.http.post('/rpa-service/pause-bot/',botId)
  }
  getUserResume(botId):Observable<any> {
    return this.http.post('/rpa-service/resume-bot/',botId)
  }
  botStatistics(){
    return this.http.get("/rpa-service/bot-statistics")
  }
  listEnvironments(){
    return this.http.get("/rpa-service/agent/get-environments")
  }
  execution(data:any):Observable<any>{
    return this.http.post('/rpa-service/start-bot/',data)
  }
  deployremotemachine(botId){
    return this.http.post('/rpa-service/agent/deploy-bot/',botId)
  }
  getpredefinedbots(){
    return this.http.get("/assets/definebots.json")/*jitendra: need to replace URL*/
  }
  scheduleList(data:any):Observable<any>{
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

  deleteenvironment(data:any):Observable<any>
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


  // PI module rest api's

  fileupload(file){
    return this.http.post('/processintelligence/v1/connectorconfiguration/upload',file,authHttpOptions)
  }
  getCategoriesList(){
    return this.http.get('/processintelligence/v1/processgraph/categories',authHttpOptions)
  }
  addCategory(data){
    return this.http.post('/processintelligence/v1/processgraph/categories',data,authHttpOptions)
  }
  getAlluserProcessPiIds(){
    return this.http.get('/processintelligence/v1/processgraph/userProcess',authHttpOptions)
  }
  getAllVaraintList(piId){
    return this.http.get("/processintelligence/v1/processgraph/variantList?pid="+piId,authHttpOptions)
  }
  getfullGraph(piId){
    return this.http.get("/processintelligence/v1/processgraph/fullGraph?pid="+piId,authHttpOptions)
  }
  // toSaveconnectorConfig(body,categoryName,piId,processName){
  //   return this.http.post('/processintelligence/v1/connectorconfiguration/?categoryName='+categoryName+'&piId='+piId+'&piName='+processName,body,authHttpOptions)
  // }
  getvaraintGraph(piId){
    return this.http.get('/processintelligence/v1/processgraph/variantGraph?pid='+piId,authHttpOptions)
  }
  saveConnectorConfig(body,categoryName,processName,piId){
    return this.http.post('/processintelligence/v1/connectorconfiguration/?categoryName='+categoryName+'&piId='+processName+'&piName='+piId,body,authHttpOptions)
  }

}

