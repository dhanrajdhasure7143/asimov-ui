import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class SharebpmndiagramService {
  private Bpmndata= new BehaviorSubject(null);
  send=this.Bpmndata.asObservable();

  constructor() { }

  uploadBpmn(diagram){
    this.Bpmndata.next(diagram)
  }
}
