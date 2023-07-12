import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';



@Component({
  selector: 'app-copilot-chat',
  templateUrl: './copilot-chat.component.html',
  styleUrls: ['./copilot-chat.component.css']
})
export class CopilotChatComponent implements OnInit {
  display: boolean = false;
  historyOpen:boolean = false;
  historyList:any=[]
  message:any
  nextFlag:any=""
  constructor(private router:Router) { }

  ngOnInit(): void {
    this.historyList=[
      {label:"Process Graph"},
      {label:"RPA"},
      {label:"BPS"},
      {label:"PI"}
    ]
  
}  

showDialog() {
  this.display = true;
}

openChat2(){
  this.router.navigate(["./pages/copilot/copilot-chat"]) 
}

sendMessage(){
  console.log(this.message);
  this.historyList.push({label:this.message})
  this.message=""
}
openHumanResource()
{
  this.nextFlag="Human Resource"
}

openRecruiting()
{
  this.nextFlag="Recruiting"
}

}
