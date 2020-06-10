import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import {observableToBeFn} from "rxjs/internal/testing/TestScheduler";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
};

const authHttpOptions = {
  headers: new HttpHeaders({
    'Authentication': 'Bearer eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJBaW90YWwiLCJzdWIiOiJnb3BpLnBhbGxhQGVwc29mdGluYy5jb20iLCJ1c2VyRGV0YWlscyI6eyJ1c2VySWQiOiJnb3BpLnBhbGxhQGVwc29mdGluYy5jb20iLCJpZCI6IjEwMyIsImRlcGFydG1lbnQiOm51bGwsInRlbmFudElkIjoiZWFjYTAwMDItMzNhZC00ZDFmLTk2MDEtMWU4ZjMzOGRkNWI5IiwiZG9tYWluIjpudWxsLCJyb2xlcyI6W3siYXBwSWQiOiIyIiwiYXBwTmFtZSI6IjIuMCIsImlkIjoiNSIsInJvbGVOYW1lIjoiUHJvY2VzcyBBcmNoaXRlY3QiLCJwZXJtaXNzaW9ucyI6WyJ1cGxvYWQtcHJvY2VzcyIsImRlc2lnbi1wcm9jZXNzIiwiYnBzLXdvcmtzcGFjZS12aWV3IiwiYnBzLWRlc2lnbmVyLXZpZXciLCJicHMtcmV1cGxvYWQiLCJicHMtc2F2ZSIsImJwcy1kb3dubG9hZCIsImJwcy1zdWJtaXQiLCJicHMtdG91ci1ndWlkZSIsImJwcy13b3JrZmxvdy12aWV3IiwiYnBzLXdvcmtmbG93LXVwZGF0ZSJdfV19LCJ1c2VyU2Vzc2lvbklkIjoiMjI3MSIsImlhdCI6MTU5MTY5MjY1MSwiZXhwIjoxNTkxNjk1NjUxfQ.pIeOKzz-4eAByF8IYKe-ZAmXgocxB471KJFAVT_2TCDJlpgn0WyYM28LUjC9VMuMxz4eUq1OMHMw5MD7GcC1tQ6TWjOJFdTTLEsy7CVZS0IabZcOQ4_Bf17U2GLkYjHOTwQ_12MrXd7ZGnH55L6VfHC-OzybE43I7VwM7GG_Z3uwZx32S5vWqiz1eWHBwnHnKmI0SQ0WvVZr8jCAduf9RbAJlXphrEhJ23xjmwUJUioH0C8YGDe8Z79BEkMLoBsf4BSpSbJMR2yr7yUXX6ESBHMA8jXXP7Gaed6xaOaxbBDrNph3y9htZV1T2okZY0Kdiw2aw7j8gPhuurn1ia0Nlw',
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
}
