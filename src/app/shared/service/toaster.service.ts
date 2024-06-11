import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor(private messageService: MessageService) { }

  showSuccess(message: string, action: string) {
    let type;

    switch (action) {
        case 'create':
            type = 'created';
            break;
        case 'update':
            type = 'updated';
            break;
        case 'delete':
            type = 'deleted';
            break;
        case 'upload':
              type = 'uploaded';
            break;
        case 'save':
              type = 'saved';
            break;
        case 'connect':
              type = 'connected';
            break;
        case 'deploye':
              type = 'deployed';
            break;
        case 'approve':
              type = 'approved';
            break;
        case 'reject':
              type = 'rejected';
            break;
        case 'response':
              type = '';
            break;
        default:
            type = 'performed';
    }
    if(action=='response'){
      this.messageService.add({ severity: 'success', summary: 'Success', detail: message});
    }else{
      this.messageService.add({ severity: 'success', summary: 'Success', detail: message + ' ' + type + ' successfully' });
    }

}


  showInfo(message: string) {
    this.messageService.add({ severity: 'info', summary: 'Info', detail: message}); //+" updated successfully!"
  }

  showError(value?: string) {
    let message = value?value:'Error occured'
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }
  
  showWarn(message:string){
    this.messageService.add({ severity:'warn', summary:'Warning', detail: message })
  }

  toastSuccess(message){
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message});
  }
}
