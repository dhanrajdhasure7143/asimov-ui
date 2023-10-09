import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef,SimpleChanges,OnChanges } from '@angular/core';
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

 hideActions:boolean = false;
 subscription: any;
 user_firstletter:any;
 messagesList:any=[];
 constructor(private data: DataTransferService,
  private cd:ChangeDetectorRef
  ) { }
//  ngOnDestroy() {
//    this.subscription.unsubscribe();
//  }
private previousArrayLength: number = 0;

  currentConversationIndex: number = 0; // Index of the current conversation
  currentMessageIndex: number = 0; // Index of the current message within the conversation
  systemResponse: any[] = []; // Array to store the system response text for each conversation
  typingSpeed: number = 30;

 ngOnInit() {
  this.user_firstletter = localStorage.getItem("firstName").charAt(0) + localStorage.getItem("lastName").charAt(0);
}

 ngAfterViewInit() {
  this.cd.detectChanges();
 }

 ngDoCheck() {
  if (this.messages.length > this.previousArrayLength) {
    this.previousArrayLength = this.messages.length;
    // this.messagesList = this.messages.filter(item=> item.messageSourceType == "SYSTEM")
    this.messagesList = this.messages
    this.displayNextMessage();

    // console.log(JSON.stringify(this.messages))
  }
}
ngOnChanges(changes: SimpleChanges): void {
  // Your code to handle input property changes
  console.log("changes",this.messages);
}


 processButtonAction(event:any){
   this.messageAction.emit({
     actionType:'Button',
     data: event
   });
   this.hideActions= true;
 }

 processFormAction(event:any){
   console.log("processFormAction received from child ",event)
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
     actionType:event.bpmnXml?'bpmn':'list',
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


 processUploadFileAction(event:any, buttonData:any){
    this.messageAction.emit({
      actionType:"UploadFileAction",
      data:buttonData,
      fileDataEvent:event,
    })
 }


 processProcessLog(buttonData:any)
 {
  this.messageAction.emit({
    actionType:"ProcessLogAction",
    data:buttonData
  })
 }

 simulateTypingEffect(text: string) {
  let index = 0;
  let conversationIndex = this.currentConversationIndex;

  const typingInterval = setInterval(() => {
    // Check if the conversation index has changed (new conversation)
    if (conversationIndex !== this.currentConversationIndex) {
      clearInterval(typingInterval);
      console.log("testing2")
      setTimeout(() => {
        this.displayNextMessage();
      }, 1000); // Add a delay before displaying the next conversation
    } else {
      if (!this.systemResponse[conversationIndex]) {
        this.systemResponse[conversationIndex] = {
          message: '',
          messageSourceType: 'SYSTEM'
        };
      }
      this.systemResponse[conversationIndex].message += text.charAt(index);
      index++;

      if (index > text.length) {
        clearInterval(typingInterval);
        console.log("TypingEffectEnd")
        setTimeout(() => {
          this.displayNextMessage();
        }, 1000); // Add a delay before displaying the next message
      }
    }
  }, this.typingSpeed);

  setTimeout(() => {
    console.log("this.systemResponse",this.systemResponse)
  }, 5000);
}


displayNextMessage() {
  if (this.currentConversationIndex < this.messagesList.length) {
    const conversation = this.messagesList[this.currentConversationIndex];
    if (conversation.messageSourceType === "SYSTEM") {
      const messages = conversation.data.message;
      if (this.currentMessageIndex < messages.length) {
        this.simulateTypingEffect(messages[this.currentMessageIndex]);
        this.currentMessageIndex++;
      } else {
        // Move to the next conversation when all messages are displayed
        this.currentConversationIndex++;
        this.currentMessageIndex = 0;
        setTimeout(() => {
          this.displayNextMessage();
        }, 1000); // Add a delay before displaying the next conversation
      }
    } else {
      this.currentConversationIndex++;

      console.log(this.currentConversationIndex)
      console.log(conversation)
      this.systemResponse[this.currentConversationIndex-1] = {
        message: conversation.message,
        messageSourceType: 'MESSAGE'
      };
      // Skip non-SYSTEM messages
      this.displayNextMessage();
    }
  }
}


}
