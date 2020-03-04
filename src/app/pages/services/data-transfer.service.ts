import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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

  private fileData:BehaviorSubject<any> = new BehaviorSubject<any>("");
  current_file_data = this.fileData.asObservable();

  changeFileData(data:any){
    this.fileData.next(data);
  }
//Vaidehi:: for reading file contents 
  // getFileContents(file){
  //   if (!file) {
  //     console.error('No file to read.');
  //     return null;
  //   }
  //   const reader = new FileReader();
  //   reader.onload = e => {
    // this.changeFileData((e.target as FileReader).result)
  //     return (e.target as FileReader).result;
  //   };
  //   reader.onerror = e => {
  //     console.error(`FileReader failed on file {{file.name}}.`);
  //     return null;
  //   };
  //   // reader.readAsDataURL(file);
  // }
}
