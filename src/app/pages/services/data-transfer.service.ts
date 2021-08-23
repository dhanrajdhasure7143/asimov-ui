import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification{
  id ?:string;
  type:string;
  message:string;
}

@Injectable({
  providedIn: 'root'
})
export class DataTransferService {

  private parentModule:BehaviorSubject<any> = new BehaviorSubject<any>({});

  current_parent_module = this.parentModule.asObservable();

  changeParentModule(module:any){
    this.parentModule.next(module);
  }

  private childModule:BehaviorSubject<any> = new BehaviorSubject<any>({});
  current_child_module = this.childModule.asObservable();

  changeChildModule(module:any){
    this.childModule.next(module);
  }

  private hints:BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  current_hints = this.hints.asObservable();

  changeHints(hints:any[]){
    this.hints.next(hints);
  }

  private piData:BehaviorSubject<any> = new BehaviorSubject<any>(null);
  current_piData = this.piData.asObservable();

  changePiData(piData:any){
    this.piData.next(piData);
  }

  private notation_startprocess:BehaviorSubject<any> = new BehaviorSubject<any>(null);
  current_startProcessValues = this.notation_startprocess.asObservable();
  
  deployNotationValue(notation_startprocess:any){
    this.notation_startprocess.next(notation_startprocess);
  }
  private downloadNotation:BehaviorSubject<any> = new BehaviorSubject<any>(null);
  download_notation = this.downloadNotation.asObservable();
  
  downloadNotationValue(download_Notation:any){
    this.downloadNotation.next(download_Notation);
  }
 
  private headerButton_value:BehaviorSubject<any> =new BehaviorSubject<any>(null);
  header_value =this.headerButton_value.asObservable();
 
  bpsHeaderValues(buttonValue:any){
    this.headerButton_value.next(buttonValue)
  }
 
  private notationScreenValues:BehaviorSubject<any>=new BehaviorSubject<any>(null);
  notation_ScreenValues=this.notationScreenValues.asObservable();
 
  bpsNotationaScreenValues(values:any){
    this.notationScreenValues.next(values)
  }
  private submitApproval:BehaviorSubject<any>=new BehaviorSubject<any>(null);
  subMitApprovalValues=this.submitApproval.asObservable();
 
  submitForApproval(values:any){
    this.submitApproval.next(values)
  }

  private pi_headerValues:BehaviorSubject<any>=new BehaviorSubject<any>(null);
  pi_headerChanges=this.pi_headerValues.asObservable();
 
  piHeaderValues(values:any){
    this.pi_headerValues.next(values);
  }

  private process_insightsHeader:BehaviorSubject<any>=new BehaviorSubject<any>(null);
  processInsights_headerChanges=this.process_insightsHeader.asObservable();
 
  process_insightsHeaderValues(values:any){
    this.process_insightsHeader.next(values);
  }

}
