import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CopilotService {
  public http: any;
  constructor(private httpBackend: HttpBackend) {
    this.http = new HttpClient(this.httpBackend);
  }

  // getCopilotFunctionsList(){
  //   return this.http.get(environment.asquare+"/a-square/v1/functions");
  // }

  //Copilot Rest-Api's
getCopilotFunctionsList(){
  return this.http.get(environment.asquare+"/a-square/v1/functions");
}

getCopilotProcessesList(id){
  return this.http.get(environment.asquare+"/a-square/v1/processes/function/"+id)
}

getCopilotTemplatesList(id){
  return this.http.get(environment.asquare+"/a-square/v1/template/process/"+id);
}

getCopilotConversation(){
  return this.http.get(environment.asquare+"/a-square/v1/conversation")
}

sendMessageToCopilot(messageBody:any){
  return this.http.post(environment.asquare+"/a-square/v1/conversation/message", messageBody)
}

initializeConversation(body) {
  return this.http.post(environment.asquare+"/a-square/v1/conversation/",body,{headers: new HttpHeaders().set('x-api-key', 'FyNw9kKOupVIz5joICubvWlVUW8m2K0yNEgX'),});
}

getAutomatedProcess(messageBody){
  return this.http.post(environment.asquare+"/a-square/v1/conversation/modify-template", messageBody)
}


}
