import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class SharebpmndiagramService {
  private Bpmndata= new BehaviorSubject(null);
  send=this.Bpmndata.asObservable();
  private showConfirmancedata=new BehaviorSubject('');
  sendConfdata=this.showConfirmancedata.asObservable();

  constructor() { }

  uploadBpmn(diagram){
    this.Bpmndata.next(diagram)
  }
  onSelect(sentDiagram){
    this.showConfirmancedata.next(sentDiagram)
  }
}
