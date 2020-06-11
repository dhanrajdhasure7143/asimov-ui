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

  public confBpmnXMLData = new BehaviorSubject({});
  sendConfBpmnXMLData=this.confBpmnXMLData.asObservable();

  public isConfNav = new BehaviorSubject(false);
  confNav = this.isConfNav.asObservable();

  constructor() { }

  uploadBpmn(diagram){
    this.bpmnData.next(diagram)
  }
  uploadConfirmanceBpmn(sentDiagram){
    this.showConfirmancedata.next(sentDiagram)
  }
  uploadConfirmanceBpmnXML(confXML){
    this.confBpmnXMLData.next(confXML)
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
  getConfBpmnXML(){
    return this.confBpmnXMLData.value;
  }
  changeConfNav(yesNo){
    this.isConfNav.next(yesNo);
  }
}
