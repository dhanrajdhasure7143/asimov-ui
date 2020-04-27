import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
};
const API_URL = environment.bps_url;

@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  xmlheaderOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'text/xml',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method',
    }),
    responseType: 'text'
  }
  constructor(private http:HttpClient) { }

  getBPMNFileContent(filePath){
    // return this.http.post(filePath, this.xmlheaderOptions);
    return this.http.get(filePath, {headers: {observe: 'response'}, responseType: 'text'});
  }

  autoSaveBPMNFileContent(bpmnModel){
    return this.http.post("/bpsprocess/temp/bpms/notation", bpmnModel);
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
    return this.http.get("/bpsprocess/fetchByUser/mounika"); // "target" : "http://10.11.1.236:8080",
  }
  toolSet(){
    return this.http.get("/load-toolset");
  }
  bpmnlist(user){
      //GET /bpsprocess/approver/info/{roleName} 
  return this.http.get<any[]>(API_URL+'bpsprocess/approvalTnfoByUser/'+user);
  }

  approve_producemessage(bpmnProcessInfo){
    return this.http.post<any[]>(API_URL+'bpsprocess/produceMessage',bpmnProcessInfo,httpOptions);
  }
  approve_savedb(bpmndata){
    return this.http.post<any[]>(API_URL+'bpsprocess/save/bpms/notation/approval/workflow',bpmndata,httpOptions);
  }
denyDiagram(msg_obj){
 // POST /bpsprocess/save/bpms/notation/approval/workflow
 
  return this.http.post<any[]>(API_URL+'bpsprocess/save/bpms/notation/approval/workflow',msg_obj,httpOptions);
}
}
