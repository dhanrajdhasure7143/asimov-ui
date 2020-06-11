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

// const httpRequest = new XMLHttpRequest();
// // httpRequest.open('POST', url, true);
// httpRequest.setRequestHeader( 'Access-Control-Allow-Origin', '*');
// httpRequest.setRequestHeader( 'Content-Type', 'application/json' );
// httpRequest.setRequestHeader('Authentication','eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJBaW90YWwiLCJzdWIiOiJ2ZW5rYXRhLnNpbWhhZHJpQGVwc29mdGluYy5jb20iLCJ1c2VyRGV0YWlscyI6eyJ1c2VySWQiOiJ2ZW5rYXRhLnNpbWhhZHJpQGVwc29mdGluYy5jb20iLCJpZCI6IjIiLCJkZXBhcnRtZW50IjoiVGVzdGluZyIsInRlbmFudElkIjoiNGUyZDY2ZGItZDE2Yi00OTU4LTg2OGYtN2MzMDZlZjc2NWJjIiwiZG9tYWluIjpudWxsLCJyb2xlcyI6W3siYXBwSWQiOiIyIiwiYXBwTmFtZSI6IjIuMCIsImlkIjoiOCIsInJvbGVOYW1lIjoiQWRtaW4iLCJwZXJtaXNzaW9ucyI6W119XX0sInVzZXJTZXNzaW9uSWQiOiIyMzI3IiwiaWF0IjoxNTkxODA3NDg5LCJleHAiOjE1OTE4MTA0ODl9.4bEKlft70DDFHnp3LJFjI5wpdeJ4sHwisGDEqVTEodfQPAQg_sDCRx3rKoNozRLQg9Ux4FcBY6qT8JeIIHekxBkRq-zQewSWw0fCbD-36DAMHRtkpsOGqFf-NV_hApgQ8suZdKi-lbxUpXa3FMdoWgz1Vn-8Dr1sImdhqWBaVRI6lFRQcFNxv-5g-gskiROBmCqSqD21a-h-4A38Yw_pnf0RnO7etkWK11kVy78t2d8e5j8CwkjvVgM4iXLhBDWaJLOFANgIeIE_mxpbZFJM6hgSiVTSGIeUg0H9w15FUzdNNNCH7Dz5gs0QsAFUGX8A9GgUUWDaXdC4mQypRI4k6w')

const authHttpOptions = {
  headers: new HttpHeaders({
    // 'Authentication': 'Bearer eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJBaW90YWwiLCJzdWIiOiJ2ZW5rYXRhLnNpbWhhZHJpQGVwc29mdGluYy5jb20iLCJ1c2VyRGV0YWlscyI6eyJ1c2VySWQiOiJ2ZW5rYXRhLnNpbWhhZHJpQGVwc29mdGluYy5jb20iLCJpZCI6IjIiLCJkZXBhcnRtZW50IjoiVGVzdGluZyIsInRlbmFudElkIjoiNGUyZDY2ZGItZDE2Yi00OTU4LTg2OGYtN2MzMDZlZjc2NWJjIiwiZG9tYWluIjpudWxsLCJyb2xlcyI6W3siYXBwSWQiOiIyIiwiYXBwTmFtZSI6IjIuMCIsImlkIjoiOCIsInJvbGVOYW1lIjoiQWRtaW4iLCJwZXJtaXNzaW9ucyI6W119XX0sInVzZXJTZXNzaW9uSWQiOiIyMzIyIiwiaWF0IjoxNTkxNzk2NjQ1LCJleHAiOjE1OTE3OTk2NDV9.ti8xzURGep_9Kbc9CMqEgwgpgVq2Gotijo7QmsncI-znUnHeTHC8RbOB2m_ID0NNjGQ3tTQhyN2Y1flw8u0_-tkoHvM5PFIxs08g7AoK7QBvu0pzQcaOCmNBsBoRE57zAowWWVU-ay6kabNiQ9ciHihhGVJTi_UvLrjKrw9mx_Fj05797Vg1qTFGTluM-UIY4NlotaQviB66-zF3I0tRVdBO0pLbKMhgZ2Y-6xKg3yxiHnTq7T-nmvPLdRWbw7H2Ou4rWLKWkBLIj18iXGANaVHNXBYdrv_i5QfhuT1zBOsmyeBR9rA0V1HKwL_PVOTC16QMVvoM7ILTtkcz6sf9lg',
      'Authentication':'Bearer eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJBaW90YWwiLCJzdWIiOiJ2ZW5rYXRhLnNpbWhhZHJpQGVwc29mdGluYy5jb20iLCJ1c2VyRGV0YWlscyI6eyJ1c2VySWQiOiJ2ZW5rYXRhLnNpbWhhZHJpQGVwc29mdGluYy5jb20iLCJpZCI6IjIiLCJkZXBhcnRtZW50IjoiVGVzdGluZyIsInRlbmFudElkIjoiNGUyZDY2ZGItZDE2Yi00OTU4LTg2OGYtN2MzMDZlZjc2NWJjIiwiZG9tYWluIjpudWxsLCJyb2xlcyI6W3siYXBwSWQiOiIyIiwiYXBwTmFtZSI6IjIuMCIsImlkIjoiOCIsInJvbGVOYW1lIjoiQWRtaW4iLCJwZXJtaXNzaW9ucyI6W119XX0sInVzZXJTZXNzaW9uSWQiOiIyMzI3IiwiaWF0IjoxNTkxODA3NDg5LCJleHAiOjE1OTE4MTA0ODl9.4bEKlft70DDFHnp3LJFjI5wpdeJ4sHwisGDEqVTEodfQPAQg_sDCRx3rKoNozRLQg9Ux4FcBY6qT8JeIIHekxBkRq-zQewSWw0fCbD-36DAMHRtkpsOGqFf-NV_hApgQ8suZdKi-lbxUpXa3FMdoWgz1Vn-8Dr1sImdhqWBaVRI6lFRQcFNxv-5g-gskiROBmCqSqD21a-h-4A38Yw_pnf0RnO7etkWK11kVy78t2d8e5j8CwkjvVgM4iXLhBDWaJLOFANgIeIE_mxpbZFJM6hgSiVTSGIeUg0H9w15FUzdNNNCH7Dz5gs0QsAFUGX8A9GgUUWDaXdC4mQypRI4k6w'
  }),
};

const authHttpOptionsone = {
  headers: new HttpHeaders({
    // 'Content-Type': 'application/json',
    // 'Access-Control-Allow-Origin':' *',
    // 'Cache-Control': 'no-cache no-cache, no-store, max-age=0, must-revalidate',
    //   'Connection': 'keep-alive',
    //   'Access-Control-Allow-Methods':'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      ' Authorization':'Bearer eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJBaW90YWwiLCJzdWIiOiJ2ZW5rYXRhLnNpbWhhZHJpQGVwc29mdGluYy5jb20iLCJ1c2VyRGV0YWlscyI6eyJ1c2VySWQiOiJ2ZW5rYXRhLnNpbWhhZHJpQGVwc29mdGluYy5jb20iLCJpZCI6IjIiLCJkZXBhcnRtZW50IjoiVGVzdGluZyIsInRlbmFudElkIjoiNGUyZDY2ZGItZDE2Yi00OTU4LTg2OGYtN2MzMDZlZjc2NWJjIiwiZG9tYWluIjpudWxsLCJyb2xlcyI6W3siYXBwSWQiOiIyIiwiYXBwTmFtZSI6IjIuMCIsImlkIjoiOCIsInJvbGVOYW1lIjoiQWRtaW4iLCJwZXJtaXNzaW9ucyI6W119XX0sInVzZXJTZXNzaW9uSWQiOiIyMzI3IiwiaWF0IjoxNTkxODA3NDg5LCJleHAiOjE1OTE4MTA0ODl9.4bEKlft70DDFHnp3LJFjI5wpdeJ4sHwisGDEqVTEodfQPAQg_sDCRx3rKoNozRLQg9Ux4FcBY6qT8JeIIHekxBkRq-zQewSWw0fCbD-36DAMHRtkpsOGqFf-NV_hApgQ8suZdKi-lbxUpXa3FMdoWgz1Vn-8Dr1sImdhqWBaVRI6lFRQcFNxv-5g-gskiROBmCqSqD21a-h-4A38Yw_pnf0RnO7etkWK11kVy78t2d8e5j8CwkjvVgM4iXLhBDWaJLOFANgIeIE_mxpbZFJM6hgSiVTSGIeUg0H9w15FUzdNNNCH7Dz5gs0QsAFUGX8A9GgUUWDaXdC4mQypRI4k6w'
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
  fileupload(file){
    return this.http.post('/processintelligence/v1/connectorconfiguration/upload',file,authHttpOptionsone)
  }
  getAllPiIds(){
    return this.http.get('/processintelligence/v1/processgraph/piIds',authHttpOptionsone)
  }
  // getAllVaraintList(pid){
  //   const text='eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJBaW90YWwiLCJzdWIiOiJzaWdpcmlyYW5qaXRoQGdtYWlsLmNvbSIsInVzZXJEZXRhaWxzIjp7InVzZXJJZCI6InNpZ2lyaXJhbmppdGhAZ21haWwuY29tIiwiaWQiOiIxNTgiLCJkZXBhcnRtZW50IjoiRmluYW5jZSIsInRlbmFudElkIjoiOGYyOTdhNDEtYjZhMy00YjkxLThiZjgtMTI3ZWE3ZjJiODI0IiwiZG9tYWluIjpudWxsLCJyb2xlcyI6W3siYXBwSWQiOiIyIiwiYXBwTmFtZSI6IjIuMCIsImlkIjoiOCIsInJvbGVOYW1lIjoiQWRtaW4iLCJwZXJtaXNzaW9ucyI6W119XX0sInVzZXJTZXNzaW9uSWQiOiIyMzI2IiwiaWF0IjoxNTkxODA1NTc5LCJleHAiOjE1OTE4MDg1Nzl9.OdRHAYfhn0dsoteUljscgrgMt9yWFHYi0mMnxCOZenHWIjS0Pd9DzGpfxpTzeHVnHAhCatyQ0qzHUT9qSbZYL3J-aGUPaEOnEOj_1JML_581g0gauBIe9SVa5I4xmmn0PrsHyQrajZkzyDbQmjLJ9xpfMP8jQQ8WVxuAiJVpJbP-ynNS4plE8_5r8GR8bAYduX59PJh99eDuY7Yj3mHCU5dO1D-V7jikjORCUkJxOgw3BbK0DXuO3zyx2CgOluUwFCLgYa6wXCmUGa1701mKtrW84NPg-yylRsvzqOLAqo-3GqnxiAnyVFVM_Wp4gbKsfgiNI5rL41d_6-lS4Lx_QQ'
  //     return this.http.get('/processintelligence/v1/processgraph/variantList?pid='+pid,{headers: {observe: 'response',Authentication:text,},responseType:"text",})
  // }
  getAllVaraintList(){
    return this.http.get("/processintelligence/v1/processgraph/variantList?pid=244",authHttpOptionsone)
  }
  getbyVariantfullGraph(){
    return this.http.get("/processintelligence/v1/processgraph/fullGraph?pid=244",authHttpOptionsone)
  }

}

