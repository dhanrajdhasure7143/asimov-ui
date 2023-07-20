import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataTransferService } from '../../services/data-transfer.service';



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
  constructor(private router:Router, private dt:DataTransferService) { }

  ngOnInit(): void {
    this.historyList=[
      {label:"Process Graph"},
      {label:"RPA"},
      {label:"BPS"},
      {label:"PI"}
    ]
    this.dt.setCopilotData(undefined)
  
}  

showDialog() {
  this.nextFlag="";
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
