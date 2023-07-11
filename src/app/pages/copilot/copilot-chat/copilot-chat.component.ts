import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-copilot-chat',
  templateUrl: './copilot-chat.component.html',
  styleUrls: ['./copilot-chat.component.css']
})
export class CopilotChatComponent implements OnInit {
  display: boolean = false;
  historyOpen:boolean = false;
  constructor() { }

  ngOnInit(): void {
  
}  

showDialog() {
  this.display = true;
}
openHistory(){
  this.historyOpen = true
}
}
