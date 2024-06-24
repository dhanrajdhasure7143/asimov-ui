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
  return this.http.get(environment.asquare+"/v1/functions", {headers:this.headers});
}

getCopilotProcessesList(id){
  return this.http.get(environment.asquare+"/v1/processes/function/"+id, {headers:this.headers})
}

getCopilotTemplatesList(id){
  return this.http.get(environment.asquare+"/v1/template/process/"+id, {headers:this.headers});
}

initializeConversation(body) {
  return this.http.post(environment.asquare+"/v1/conversation/",body,{headers:this.headers});
}

sendMessageToCopilot(messageBody:any){
  let headers_new=  new HttpHeaders({'Authorization': 'Bearer '+this.token, 'ip-address': this.ipAddress,'timezone':this.timezone,'authKey': this.encryptedaKey,'x-api-conversationId':localStorage.getItem('conversationId')})
  return this.http.post(environment.asquare+"/v1/conversation/message", messageBody, {headers:headers_new})
}

getAutomatedProcess(messageBody){
  let headers_new=  new HttpHeaders({'Authorization': 'Bearer '+this.token, 'ip-address': this.ipAddress,'timezone':this.timezone,'authKey': this.encryptedaKey,'x-api-conversationId':localStorage.getItem('conversationId')})
  return this.http.post(environment.asquare+"/v1/conversation/modify-template", messageBody, {headers:this.headers})
}

updateProcessLogGraph(data:any){
  let headers_new=  new HttpHeaders({'Authorization': 'Bearer '+this.token, 'ip-address': this.ipAddress,'timezone':this.timezone,'authKey': this.encryptedaKey,'x-api-conversationId':localStorage.getItem('conversationId')})
  return this.http.post(environment.asquare+"/v1/conversation/update-process-bpmn", data,{headers:headers_new});
}

getUserConversations(userId:any){
  return this.http.get(environment.asquare+`/v1/conversation/getLastConversationByUserId/${userId}`,{headers:this.headers});
}

getConversationByTenantId(tenantId:any){
  return this.http.get(environment.asquare+`/v1/conversation/getLastConversationByTenantId/${tenantId}`,{headers:this.headers});
}


getAllConversationsByConversationId(conversationId){
  return this.http.get(environment.asquare+`/v1/conversation/getAllConversationsByConversationId/${conversationId}`,{headers:this.headers});
}

deleteConversation(data){
  return this.http.post(environment.asquare+"/v1/conversation/purge", data, {headers:this.headers})
}

getCustomerBots(tenantId:any){
  return this.http.get(environment.asquare+"/admin/v1/customer-support-bot/byTenantId/"+`${tenantId}`, {headers:this.headers})
}

saveCustomerBot(body:any){
  return this.http.post(environment.asquare+"/admin/v1/customer-support-bot", body, {headers:this.headers})
}

getPredefinedModels(tenantName:any){
  return this.http.get(environment.asquare+"/v1/external/conversation/models/"+tenantName, {headers:this.headers})

}

saveTrinedModel(body:any){
  return this.http.post(environment.asquare+"/v1/external/conversation/models",body, {headers:this.headers})
}
deleteCustomerBot(botId:any){
  const url = `${environment.asquare}/admin/v1/customer-support-bot/${botId}`;
  return this.http.delete(url, { headers: this.headers });
}

updateCustomerBot(botId:any, requestBody: any){
  const url = `${environment.asquare}/admin/v1/customer-support-bot/${botId}`;
  return this.http.put(url,requestBody, { headers: this.headers });
}
getUploadDocs(formData){
  return this.http.post(environment.python_llm+"/uploads", formData)
}

getTrainedModel(formData){
  return this.http.post(environment.python_llm+"/train", formData)
}

  checkCustomerBotName(botname) {
    return this.http.get(environment.asquare + "/admin/v1/customer-support-bot/check-bot?botName=" + botname + "&tenantId=" + localStorage.getItem('tenantName'), { headers: this.headers });
  }

}
