import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api/menuitem';


@Component({
  selector: 'app-copilot-chat',
  templateUrl: './copilot-chat.component.html',
  styleUrls: ['./copilot-chat.component.css']
})
export class CopilotChatComponent implements OnInit {
  items: MenuItem[];
  display: boolean = false;

  constructor(private router:Router) { }

  ngOnInit(): void {
    this.items = [{
      label: 'History',
      items: [{
          label: 'Client Service Reporting',
          command: () => {
          }
      }]}]
}  

showDialog() {
  this.display = true;
}

openChat2()
{
  console.log("sample test")
  this.router.navigate(["./pages/copilot/copilot-chat"]) 
}


}
