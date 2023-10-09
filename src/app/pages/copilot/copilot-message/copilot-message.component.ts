import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef,SimpleChanges,OnChanges,ViewChild,ElementRef } from '@angular/core';
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
  loadedComponents: string[] = []; // Initialize as an empty array
  componentIndex: number = 0;
  @ViewChild('subChat', { static: false }) subChat: ElementRef;

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


 processProcessLog(buttonData:any){
  this.messageAction.emit({
    actionType:"ProcessLogAction",
    data:buttonData
  })
 }

 simulateTypingEffect(messages: string[], response: any) {
  let messageIndex = 0;
  let charIndex = 0;
  const typingInterval = setInterval(() => {
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
      this.scrollToBottom();
      console.log("this.systemResponse",this.systemResponse)
      this.loadComponents(this.messagesList[this.currentMessageIndex-1]);
      setTimeout(() => {
        this.displayNextMessage();
      }, 1000); // Add a delay before displaying the next system message
    }
    this.scrollToBottom();
  }, this.typingSpeed);
}


displayNextMessage() {
  if (this.currentMessageIndex < this.messagesList.length) {
    const message = this.messagesList[this.currentMessageIndex];
    // console.log(message)
    if (message.messageSourceType === "SYSTEM") {
      const messages = message.data.message;
      const response = { message: '', messageSourceType: 'SYSTEM',data:message };
      this.systemResponse.push(response); // Create a new object for this system message
      this.simulateTypingEffect(messages, response);
      this.currentMessageIndex++;
    } else {
      // Skip non-SYSTEM messages
      // console.log("testing",this.currentMessageIndex)
      this.systemResponse[this.currentMessageIndex]={ message: message.message,data:message, messageSourceType: 'MESSAGE' };
      this.currentMessageIndex++;
      this.displayNextMessage();
    }
  }else{
    // console.log("testing end case", this.systemResponse);
    // console.log("latestIndex",this.currentMessageIndex)

  }
}


loadComponents(item) {
  console.log("data",item)
  const components = item?.data?.components?item.data.components:[];
  console.log("components",components)
  this.loadNextComponent(components,item);
}

loadNextComponent(components,item) {
  if (this.componentIndex < components.length) {
    const componentName = components[this.componentIndex];
    this.loadedComponents.push(componentName);
    this.componentIndex++;

    // Continue loading the next component with a delay
    setTimeout(() => {
      // this.loadNextComponent(components,item);
      this.scrollToBottom();
    }, 500); // Add a delay before loading the next component
  } else {
    this.scrollToBottom();
    // All components have been loaded
    // console.log('All components loaded.',this.loadedComponents);
  }
}

isScrollAtBottom() {
  const objDiv = this.subChat.nativeElement;
  return objDiv.scrollTop === objDiv.scrollHeight - objDiv.clientHeight;
}

scrollHandler() {
  if (this.isScrollAtBottom()) {
    const objDiv = this.subChat.nativeElement;
    objDiv.scrollTop = objDiv.scrollHeight;
    // The scroll is at the bottom, do something
  } else {
    console.log("test2")
    // The scroll is not at the bottom
  }
}

scrollToBottom() {
  const objDiv = this.subChat.nativeElement;
  objDiv.scrollTop = objDiv.scrollHeight;
}


}
