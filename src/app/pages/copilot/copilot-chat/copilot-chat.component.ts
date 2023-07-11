import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api/menuitem';


@Component({
  selector: 'app-copilot-chat',
  templateUrl: './copilot-chat.component.html',
  styleUrls: ['./copilot-chat.component.css']
})
export class CopilotChatComponent implements OnInit {
  display: boolean = false;
  historyOpen:boolean = false;

  constructor(private router:Router) { }

  ngOnInit(): void {
  
}  

showDialog() {
  this.display = true;
}

openHistory(){
  this.historyOpen = true
}

openChat2()
{
  this.router.navigate(["./pages/copilot/copilot-chat"]) 
}


}
