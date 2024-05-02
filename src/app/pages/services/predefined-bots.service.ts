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
    return this.http.get("/rpa-service/predefined/predefinedbotLogs/"+id)
  }

}
