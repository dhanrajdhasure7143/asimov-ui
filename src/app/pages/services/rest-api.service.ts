import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import {observableToBeFn} from "rxjs/internal/testing/TestScheduler";
import { DataTransferService } from './data-transfer.service';

import { BpmnModel } from '../business-process/model/bpmn-autosave-model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
};

const authHttpOptions = {
  headers: new HttpHeaders({
    'Authorization': 'Bearer eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJBaW90YWwiLCJzdWIiOiJnb3BpLnBhbGxhQGVwc29mdGluYy5jb20iLCJ1c2VyRGV0YWlscyI6eyJ1c2VySWQiOiJnb3BpLnBhbGxhQGVwc29mdGluYy5jb20iLCJpZCI6IjEwMyIsImRlcGFydG1lbnQiOm51bGwsInRlbmFudElkIjoiZWFjYTAwMDItMzNhZC00ZDFmLTk2MDEtMWU4ZjMzOGRkNWI5IiwiZG9tYWluIjpudWxsLCJyb2xlcyI6W3siYXBwSWQiOiIyIiwiYXBwTmFtZSI6IjIuMCIsImlkIjoiMiIsInJvbGVOYW1lIjoiUlBBIEFkbWluIiwicGVybWlzc2lvbnMiOlsiYm90LWRlc2lnbmVyLXZpZXciLCJib3QtbGlzdCIsImJvdC1jcmVhdGUiLCJib3QtZGVzaWduZXItdmlldyIsImJvdC1kZXNpZ25lci12aWV3IiwiYm90LXVwZGF0ZSIsImJvdC1kZWxldGUiLCJib3Qtc2NoZWR1bGUiLCJib3QtZGVwbG95IiwiYm90LXN0YXJ0IiwiYm90LXN0b3AiLCJib3QtcGF1c2UiLCJib3QtcmVzdW1lIiwiYm90LXBhdXNlIiwiZW52aXJvbm1lbnQtc2F2ZSIsImVudmlyb25tZW50LXVwZGF0ZSIsImVudmlyb25tZW50LWRlbGV0ZSIsImVudmlyb25tZW50LWxpc3QiLCJodW1hbi1saXN0IiwicHJvY2Vzcy1saXN0IiwiZGFzaGJvYXJkLXZpZXciLCJib3QtbWFuYWdlbWVudCIsInByb2Nlc3MtbWFuYWdlbWVudCIsImJvdC10b3VyLWd1aWRlIl19XX0sInVzZXJTZXNzaW9uSWQiOiIyNDU4IiwiaWF0IjoxNTkxOTQ3MDk4LCJleHAiOjE1OTE5NTAwOTh9.FO4n-RrJZ6VC539aiLbr_ldl8-3ee_E8ervKKOIB24PpbLrbeCzXY-JvpLfHOhPHonYB2WRWSazolmPDDnrtgCz0gxQ2TNWe0UatoTVhhPwiBxDioTEygumqv2RHjJC2uKhJvYLBVK_gDFCN1vsiOQewEP30DhUHBrVqt6Pyvv6t1UwHgm9JXn43gXTXwL_GJJOz_rKk_kG3G5c1ela5rJOwBzOizU8r-QLqFXs7jkTDRffGWAhrgA3fW3TSbGHNezt9YnnZIpaUKQPV2TuNpcaQ6-xboHkKy2Ik8vMoCwn4yCJZM0pWcs9BBomMp893h0V0hjasq0b6-AFLn2EVRg',
  }),
};

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
return this.http.get<any[]>('/bpsprocess/approvalTnfoByUser/'+user);
}

approve_producemessage(bpmnProcessInfo){
  return this.http.post<any[]>('/bpsprocess/produceMessage',bpmnProcessInfo,httpOptions);
}
approve_savedb(bpmndata){
  return this.http.post<any[]>('/bpsprocess/save/bpms/notation/approval/workflow',bpmndata,httpOptions);
}

denyDiagram(msg_obj){
// POST /bpsprocess/save/bpms/notation/approval/workflow

return this.http.post<any[]>('/bpsprocess/save/bpms/notation/approval/workflow',msg_obj,httpOptions);
}


  getBPMNFileContent(filePath){
    // return this.http.post(filePath, this.xmlheaderOptions);
    return this.http.get(filePath, {headers: {observe: 'response'}, responseType: 'text'});
  }

  

  
getApproverforuser(){
  return this.http.get("/bpsprocess/approver/info/{roleName}")//first api call
}
getBpsprocessinfobyuser(){
  return this.http.get("/bpsprocess/fetchByUser/{userName}")}//second api call
saveBPMNprocessinfofromtemp(){
  return this.http.post("/bpsprocess/save/bpms/notation/from/temp",BpmnModel,authHttpOptions)//third api call
}
submitBPMNforApproval(bpmnModel){
  return this.http.post("/bpsprocess/submit/bpms/notation/approve", bpmnModel,authHttpOptions)//fourth api call
}
getBPMNtempnotations(){
  return this.http.get("/bpsprocess/temp/bpmn/{bpmnModelTempId}/notation/")//fifth api call
}
autoSaveBPMNFileContent(bpmnModel){
  return this.http.post("/bpsprocess/temp/bpms/notation", bpmnModel, authHttpOptions)//sixth api call
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
}
