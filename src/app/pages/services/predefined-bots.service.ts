import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PredefinedBotsService {

  constructor(private http : HttpClient) { }

  getPredefinedBotAttributesList(id, subAgentId){
    return this.http.get<any[]>(`/rpa-service/predefined/fetch-predefind-meta-attribute/${id}/${subAgentId}`)
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

  getAgentAttributeswithData(productid,subagentid){
    // return this.http.get<any[]>(`/rpa-service/predefined/v2/ai-agent?productId=${productid}&botId=${id}`)
    return this.http.get<any[]>(`/rpa-service/predefined/v2/get-agents-configuration?agentId=${subagentid}&productId=${productid}`)
  }

  updatePredefinedAttributesData(botId,body){
    return this.http.post(`/rpa-service/predefined/v2/ai-agent-update/${botId}`,body)
  }

  captureAgentIdandfileIds(agentId: any, body){
    // return this.http.post(`/platform-service/document/updateAIAgentIdToDocs/${agentId}`, body)
    return this.http.post(`/platform-service/document/updateAgentUuidForDocument/${agentId}`, body)
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

  updateSubAgentName(isConfigured,subagentId,subAgentName){
    return this.http.put(`/rpa-service/predefined/update-agent-name/${subagentId}?newName=${subAgentName}&isConfig=${isConfigured}`,'')
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

  loadPredefinedBots(): Observable<any>{
    return this.http.get<any>("/subscriptionservice/v1/stripe/load-predefined-bots")
  }
  
  sendEmailEntrepricePlan(userId:string){
    let headers = new HttpHeaders({});
    let isAiAgents= environment.product =='AiAgents' ? true : false;
    return this.http.post<any>('/api/user/enterprisePlan/'+userId+'?aiAgent='+isAiAgents,{ headers:headers,observe: 'response' })
  }

  getSubAgentHistoryLogs(productId,agent_id){
    return this.http.get(`/rpa-service/predefined/v2/ai-subagent-logs/${productId}/${agent_id}`)
    // return this.http.get(`/rpa-service/predefined/v2/predefinedbot-logs//${agent_id}`)
  }

  getSubAgentFiles(productId,agent_uuid){
    // return this.http.get(`/platform-service/document/fetchPredefinedSubAgentFiles/${productId}/${agent_uuid}`)
    return this.http.get(`/platform-service/document/fetchAIAgentFilesByAIAgentId/${agent_uuid}`)
  }
  
// getDisabledFields(agentUUID,predefinedRunId,productId){
  getDisabledFields(productId,subAgentId,runId){
    return this.http.get(`/rpa-service/predefined/fetch-configuration-by-run-id?agentUUID=${subAgentId}&predefinedRunId=${runId}&productId=${productId}`)
    // return this.http.get(`/rpa-service/predefined/fetch-configuration-by-run-id?agentUUID=b7c94e44-c578-4528-895e-b7e94893cf63&predefinedRunId=2&productId=prod_QbWqFiBJb6rMpb`)
  }

  updateAutoRenew(email,productId,autoRenew){
    return this.http.put(`/subscriptionservice/v1/subscriptions/update-auto-renewal-status?userId=${email}&productId=${productId}&enableAutoRenewal=${autoRenew}`,'')
    
  }

  getSubAgentDetails(productId,agentId){
    return this.http.get(`/rpa-service/predefined/v2/ai-subagent-details/${productId}/${agentId}`)
  }

  renewSubAgent(body){
    return this.http.post(`/subscriptionservice/v1/subscriptions/renew-selected-agents`,body)
  }

  getSubAgentsInprogressList(subAgentId){
    return this.http.get(`/rpa-service/predefined/in-progress-agents/${subAgentId}`)
  }

  getAgentStagesInfo(agentUUID){
    return this.http.get(`/rpa-service/predefined/agent-stages-info/${agentUUID}`)
  }

  deleteSubAgentById(body){
    return this.http.post(`/subscriptionservice/v1/subscriptions/delete-agent`,body)
  }

  getSubscribedAgentsList(){
    return this.http.get(`/rpa-service/predefined/subscribed-agents/`)
  }

  cancelSubAgentsSubscription(body){
    return this.http.put(`/subscriptionservice/v1/subscriptions/cancel-agents`,body)  
  }

  updateUserDetails(userId){
    return this.http.post(`/api/user/v2/registration-continue?userId=${userId}`,{})
  } 
}