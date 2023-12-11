import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef,SimpleChanges,ViewChild,ElementRef } from '@angular/core';
import { ChatMessage, MessageAction, MessageData, SelectedItem } from '../copilot-models';
import { DataTransferService } from '../../services/data-transfer.service';

@Component({
  selector: 'app-copilot-message',
  templateUrl: './copilot-message.component.html',
  styleUrls: ['./copilot-message.component.css']
})
export class CopilotMessageComponent implements OnInit {
 @Input() public messages:any[];
 @Output() messageAction = new EventEmitter<MessageAction>();
@Output() logAction=new EventEmitter();
 hideActions:boolean = false;
 user_firstletter:any;
 messagesList:any=[];
  messageLoaded:boolean=false;
  private previousArrayLength: number = 0;
  currentConversationIndex: number = 0; // Index of the current conversation
  currentMessageIndex: number = 0; // Index of the current message within the conversation
  systemResponse: any[] = []; // Array to store the system response text for each conversation
  typingSpeed: number = 10;
  loadedComponents: string[] = []; // Initialize as an empty array
  componentIndex: number = 0;
  variancePercentage = 20; // 20% variance
  finalSpeedValue = 0;
  @ViewChild('subChat', { static: false }) subChat: ElementRef;
 constructor(private data: DataTransferService,
            private cd:ChangeDetectorRef) 
            { }


 ngOnInit() {
  this.user_firstletter = localStorage.getItem("firstName").charAt(0) + localStorage.getItem("lastName").charAt(0);
}

 ngAfterViewInit() {
  this.cd.detectChanges();
 }

 ngDoCheck() {
  if (this.messages.length > this.previousArrayLength) {
    this.previousArrayLength = this.messages.length;
    this.messagesList = this.messages
    this.displayNextMessage();
  }
}
ngOnChanges(changes: SimpleChanges): void {
  // Your code to handle input property changes
}

 processButtonAction(event:any){
   this.messageAction.emit({
     actionType:'Button',
     data: event
   });
   this.hideActions= true;
 }

 processFormAction(event:any){
   let eventData={
    actionType:"Form",
    data:{
          message:event.message,
          jsonData:JSON.stringify(event?.data)
      }
    }
   this.messageAction.emit(eventData);
   this.hideActions= true;
 }

 processListAction(event:any){
   this.messageAction.emit({
     actionType:'list',
     data: event
   });
   this.hideActions= true;
 }

 processListPreviewAction(event:any){
   this.messageAction.emit({
     actionType:event.bpmnXml?'bpmn':'list',
     data: event
   });
   this.hideActions= true;
 }

 processCardAction(event:SelectedItem){
   this.messageAction.emit({
     actionType:'Card',
     data: event
   });
 }

 processUploadFileAction(event:any, buttonData:any){
    this.messageAction.emit({
      actionType:"UploadFileAction",
      data:buttonData,
      fileDataEvent:event,
    })
 }

 processProcessLog(buttonData:any){
  this.messageAction.emit({
    actionType:"ProcessLogAction",
    data:buttonData
  })
 }

 simulateTypingEffect(messages: string[], response: any,data) {
  let messageIndex = 0;
  let charIndex = 0;
  this.messageLoaded=true; 
  const typingInterval = setInterval(() => {
    this.finalSpeedValue =  this.typingSpeed * (1 - this.variancePercentage / 100);
    if (messageIndex < messages.length) {
      const text = messages[messageIndex];
      if (charIndex < text.length) {
        response.message += text.charAt(charIndex);
        charIndex++;
      } else {
        messageIndex++;
        charIndex = 0;
        if (messageIndex < messages.length) {
          response.message += '<br><br>'; // Add a newline for the next message
        }
      }
    } else {
      clearInterval(typingInterval);
      this.systemResponse[this.currentMessageIndex-1]["data"]=data;
      this.scrollToBottom();
      if(data.data.components.includes("logCollection")) this.logAction.emit(data)
      setTimeout(() => {
        this.displayNextMessage();
      }, 1000); // Add a delay before displaying the next system message
      setTimeout(()=>{
        this.scrollToBottom();
      },this.typingSpeed)
    }
    this.scrollToBottom();
  }, this.typingSpeed);
}


displayNextMessage() {
  if (this.currentMessageIndex < this.messagesList.length) {
    const message = this.messagesList[this.currentMessageIndex];
    if (message.messageSourceType === "SYSTEM") {
      const messages = message.data.message;
      const response = { message: '', messageSourceType: 'SYSTEM'};
      this.systemResponse.push(response); // Create a new object for this system message
      this.simulateTypingEffect(messages, response,message);
      this.currentMessageIndex++;
    } else {
      // Skip non-SYSTEM messages
      this.systemResponse[this.currentMessageIndex]={message: message.message,data:message, messageSourceType: 'MESSAGE' };
      this.currentMessageIndex++;
      this.displayNextMessage();
    }
  }else{

  }
}

isScrollAtBottom() {
  const objDiv = this.subChat.nativeElement;
  return objDiv.scrollTop === (objDiv.scrollHeight - objDiv.clientHeight);
}

scrollHandler() {
  if (this.isScrollAtBottom()) {
    const objDiv = this.subChat.nativeElement;
    objDiv.scrollTop = objDiv.scrollHeight;
    // The scroll is at the bottom, do something
  } else {
    // The scroll is not at the bottom
  }
}

  scrollToBottom() {
    const objDiv = this.subChat.nativeElement;
    if(objDiv.scrollTop>(objDiv.scrollHeight-(objDiv.clientHeight*2)))
      objDiv.scrollTop = objDiv.scrollHeight;
  }
}
