import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PredefinedBotsService {

  constructor(private http : HttpClient) { }

  getPredefinedBotAttributesList(id){
    return this.http.get<any[]>(`/rpa-service/predefined/fetch-predefind-meta-attribute/${id}`)
  }

  getPredefinedBotsList(){
    return this.http.get(`/rpa-service/predefined/get-predefined-bots`)
  }

  getOrchestrationPredefinedBotsList(){
    return this.http.get(`/rpa-service/predefined/get-orchestration-predefined-bots`)
  }

  savePredefinedAttributesData(body){
    return this.http.post(`/rpa-service/predefined/save-predefined-bot`,body)
  }

  startPredefinedBot(id){
    return this.http.post(`/rpa-service/predefined/start-predefinedbot/${id}`,{})
  }

  stopPredefinedBot(id){
    return this.http.post(`/rpa-service/predefined/stop-predefined-bot/${id}`,{})
  }

  deletePredefinedBot(id){
    return this.http.post(`/rpa-service/predefined/delete-predefined-bot/${id}`,{})
  }
  
  // getPredefinedBotAttributesListToUpdate(id){
  //   return this.http.get<any[]>(`/rpa-service/predefined/fetch-predefind-meta-attribute/${id}`)
  // }

  getPredefinedBotLogs(id){
    return this.http.get("/rpa-service/predefined/predefinedbot-logs/"+id)
  }

  validateRecruitmentBotData(body){
    return this.http.post("/rpa-service/predefined/validate-predefined-inputs",body)
  }

  agentFileUpload(body:any){
    // return this.http.post("/platform-service/document/uploadPredefinedRFPFile",body)
    // return this.http.post("/platform-service/document/uploadMultiplePredefinedRFPFile",body)
    return this.http.post("/platform-service/document/uploadMultiplePredefinedAgentFiles",body)
  }

  getAgentFiles(UUID){
    return this.http.get("/platform-service/document/fetchPredefinedAgentFiles/"+UUID)
  }

  deleteAgentFIles(body:any){
    return this.http.post("/platform-service/document/deleteMultiplePredefinedAgentFiles",body)
  }

  downloadAgentFiles(body:any){
    return this.http.post("/platform-service/document/downloadMultiplePredefinedAgentFiles",body)
  }

  uploadAgentFIles(body:any){
    return this.http.post("/platform-service/document/uploadMultiplePredefinedAgentFiles",body)
  }

  aiAgentDetails(){
    return this.http.get("/rpa-service/predefined/v2/ai-agents-details")
  }

  aiAgentHistory(id){
    return this.http.get("/rpa-service/predefined/v2/ai-agents-logs/"+id)
  }

  getAiAgentUpdateForm(){
    return this.http.get("/rpa-service/predefined/v2/ai-agent?productId=prod_PdiLNkF4ZbHkgj&botId=474")
  }

  getAgentAttributeswithData(productid,id){
    return this.http.get<any[]>(`/rpa-service/predefined/v2/ai-agent?productId=${productid}&botId=${id}`)
  }

  updatePredefinedAttributesData(agentId,botId,body){
    return this.http.post(`/rpa-service/predefined/v2/ai-agent-update/${botId}`,body)
  }

  captureAgentIdandfileIds(agentId: any, body){
    return this.http.post(`/platform-service/document/updateAIAgentIdToDocs/${agentId}`, body)
  }

  checkAiAgentName(agent_name){
    return this.http.get(`/rpa-service/predefined/uniqu-agent-name/${agent_name}`)
  }

  uploadAIAgentFilesUpdate(body:any){
    return this.http.get("platform-service/document/uploadAIAgentFilesUpdate",body)
  }

  getSubAiAgent(product_id){
    // return this.http.get(`/subscriptionservice/v1/subscriptions/api/agents?productId=${product_id}&tenantId=${tenant_id}`)
    return this.http.get(`/rpa-service/predefined/sub-agents/${product_id}`)
  } 

  subAgentLastExecution(id){
    return this.http.get("/rpa-service/predefined/last-execution-date/"+id)
  }

  updateSubAgentName(subagentId,subAgentName){
    return this.http.put(`/rpa-service/predefined/update-agent-name/${subagentId}?newName=${subAgentName}`,'')
  }

  getPlansList(){
    return this.http.get("/subscriptionservice/v1/stripe/load-predefined-bots")
  }

  getCheckoutScreen(body){
    return this.http.post("/subscriptionservice/v1/subscriptions/re-subscribe",body)
  }

  addMoreSubAgents(body){
    return this.http.post("/subscriptionservice/v1/subscriptions/add-more-agents",body)
  }
}
