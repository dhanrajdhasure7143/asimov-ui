import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class SharebpmndiagramService {

  constructor() { }
  private Bpmndata= new BehaviorSubject(null)
  send=this.Bpmndata.asObservable()
  uploadBpmn(diagram){
    this.Bpmndata.next(diagram)
}
}
