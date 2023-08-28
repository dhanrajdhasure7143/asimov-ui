import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ChatMessage, MessageAction, MessageData, SelectedItem } from '../copilot-models';
import { DataTransferService } from '../../services/data-transfer.service';

@Component({
  selector: 'app-copilot-message',
  templateUrl: './copilot-message.component.html',
  styleUrls: ['./copilot-message.component.css']
})
export class CopilotMessageComponent implements OnInit {
 @Input() public messages: ChatMessage={} as ChatMessage;
 @Output() messageAction = new EventEmitter<MessageAction>();

 hideActions:boolean = false;
 subscription: any;

 constructor(private data: DataTransferService) { }
 ngOnDestroy() {
   this.subscription.unsubscribe();
 }

 ngOnInit() {
   if (this.messages.data?.components?.includes('logCollection')){
     let values =this.messages.data?.values[ this.messages.data?.components?.indexOf('logCollection')];
     values= JSON.parse( atob(values[0].values));
     this.data.updateProcessStepLogs(values);
   }
 }


 processButtonAction(event:any){
   console.log("received from child "+event)
   this.messageAction.emit({
     actionType:'Button',
     data: event
   });
   this.hideActions= true;
 }

 processFormAction(event:any){
   console.log("processFormAction received from child "+event)
   this.messageAction.emit({
     actionType:'Form',
     data: event
   });
   this.hideActions= true;
 }

 processListAction(event:any){
   console.log("processListAction received from child "+event)
   this.messageAction.emit({
     actionType:'list',
     data: event
   });
   this.hideActions= true;
 }

 processListPreviewAction(event:any){
   console.log("processListPreviewAction received from child "+event)
   this.messageAction.emit({
     actionType:'list',
     data: event
   });
   this.hideActions= true;
 }
 processCardAction(event:SelectedItem){
   console.log("processCardAction received from child "+JSON.stringify(event))
   this.messageAction.emit({
     actionType:'Card',
     data: event
   });
 }

}
