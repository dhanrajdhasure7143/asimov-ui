import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CopilotService {
  public http: any;
  token=localStorage.getItem('accessToken');
  encryptedaKey= localStorage.getItem('authKey');
  ipAddress = '192.168.0.1';
  timezone=Intl.DateTimeFormat().resolvedOptions().timeZone;
  headers=  new HttpHeaders({'Authorization': 'Bearer '+this.token, 'ip-address': this.ipAddress,'timezone':this.timezone,'authKey': this.encryptedaKey})

  constructor(private httpBackend: HttpBackend) {
    this.http = new HttpClient(this.httpBackend);
  }

  // getCopilotFunctionsList(){
  //   return this.http.get(environment.asquare+"/a-square/v1/functions");
  // }

  //Copilot Rest-Api's
getCopilotFunctionsList(){
  return this.http.get(environment.asquare+"/a-square/v1/functions", {headers:this.headers});
}

getCopilotProcessesList(id){
  return this.http.get(environment.asquare+"/a-square/v1/processes/function/"+id, {headers:this.headers})
}

getCopilotTemplatesList(id){
  return this.http.get(environment.asquare+"/a-square/v1/template/process/"+id, {headers:this.headers});
}

getCopilotConversation(){
  return this.http.get(environment.asquare+"/a-square/v1/conversation", {headers:this.headers})
}

sendMessageToCopilot(messageBody:any){
  return this.http.post(environment.asquare+"/a-square/v1/conversation/message", messageBody, {headers:this.headers})
}

initializeConversation(body) {
  return this.http.post(environment.asquare+"/a-square/v1/conversation/",body,{headers: new HttpHeaders().set('x-api-key', 'FyNw9kKOupVIz5joICubvWlVUW8m2K0yNEgX'),});
}

getAutomatedProcess(messageBody){
  return this.http.post(environment.asquare+"/a-square/v1/conversation/modify-template", messageBody, {headers:this.headers})
}

updateProcessLogGraph(data:any){
  return this.http.post(environment.asquare+"/a-square/v1/conversation/update-process-bpmn", data);
}

}
