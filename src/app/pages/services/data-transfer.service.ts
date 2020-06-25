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

  private isLoading:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  is_loading = this.isLoading.asObservable();

  displayLoader(yesNo:boolean){
    this.isLoading.next(yesNo);
  }

}
