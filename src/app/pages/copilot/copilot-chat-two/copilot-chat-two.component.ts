import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-copilot-chat-two',
  templateUrl: './copilot-chat-two.component.html',
  styleUrls: ['./copilot-chat-two.component.css']
})
export class CopilotChatTwoComponent implements OnInit {

  constructor() { }

  items: MenuItem[];
  messages:any=[];
  message:any="";
  ngOnInit(): void {
    this.items = [{
      label: 'History',
      items: [{
          label: 'Client Service Reporting',
          command: () => {
          }
      }]}]
  }

  sendMessage()
  {
    let message={
      id:(new Date()).getTime(),
      message:this.message,
      user:localStorage.getItem("ProfileuserId")
    }
    this.messages.push(message);
    this.message=""
    let systemMessage={
      id:(new Date()).getTime(),
      message:"Hi Kiran Mudili",
      user:"SYSTEM"
    }
    this.messages.push(systemMessage)
  }
}
