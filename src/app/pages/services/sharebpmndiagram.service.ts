import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class SharebpmndiagramService {
  public bpmnData= new BehaviorSubject(null);
  sendBpmnData=this.bpmnData.asObservable();
  
  public showConfirmancedata = new BehaviorSubject('');
  sendBpmnConfdata=this.showConfirmancedata.asObservable();

  public bpmnDifferences = new BehaviorSubject({});
  sendDiff=this.bpmnDifferences.asObservable();

  public confBpmnXMLDef = new BehaviorSubject({});
  sendConfBpmnXMLDef=this.confBpmnXMLDef.asObservable();

  public isConfNav = new BehaviorSubject(false);
  confNav = this.isConfNav.asObservable();
  
  public newDiagName = new BehaviorSubject('');
  new_DiagName = this.newDiagName.asObservable();

  public bpmnCategory = new BehaviorSubject('');
  bpmn_Category = this.newDiagName.asObservable();

  constructor() { }

  setNewDiagName(name){
    this.newDiagName.next(name)
  }

  setBpmnCategory(category){
    this.bpmnCategory.next(category)
  }

  uploadBpmn(diagram){
    this.bpmnData.next(diagram)
  }
  uploadConfirmanceBpmn(sentDiagram){
    this.showConfirmancedata.next(sentDiagram)
  }
  uploadConfirmanceBpmnXMLDef(confXML){
    this.confBpmnXMLDef.next(confXML)
  }
  updateDifferences(diff){
    this.bpmnDifferences.next(diff);
  }
  getConformanceNav(){
    return this.isConfNav.value;
  }
  getBpmnData(){
    return this.bpmnData.value;
  }
  getConfBpmnData(){
    return this.showConfirmancedata.value;
  }
  getConfBpmnXMLDef(){
    return this.confBpmnXMLDef.value;
  }
  changeConfNav(yesNo){
    this.isConfNav.next(yesNo);
  }
}
