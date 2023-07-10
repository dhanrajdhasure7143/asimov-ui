import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';


@Component({
  selector: 'app-copilot-chat',
  templateUrl: './copilot-chat.component.html',
  styleUrls: ['./copilot-chat.component.css']
})
export class CopilotChatComponent implements OnInit {
  items: MenuItem[];
  display: boolean = false;
  constructor() { }

  ngOnInit(): void {
    this.items = [{
      items: [{
          label: 'History',
          command: () => {
          }
        },
        {
          label: 'Client Service Reporting',
          command: () => {
          }
      }]}]
}  

showDialog() {
  this.display = true;
}
}
