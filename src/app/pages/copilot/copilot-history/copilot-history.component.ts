import { Component, OnInit } from '@angular/core';
import { CopilotService } from '../../services/copilot.service';

@Component({
  selector: 'app-copilot-history',
  templateUrl: './copilot-history.component.html',
  styleUrls: ['./copilot-history.component.css']
})
export class CopilotHistoryComponent implements OnInit {

  constructor(private rest:CopilotService) { }

  ngOnInit(): void {
    this.getConversations();
  }


  getConversations(){
    let userId:any=localStorage.getItem("userId");
    this.rest.getUserConversations(userId).subscribe((response:any)=>{
      console.log(response);
    })
  }



}
