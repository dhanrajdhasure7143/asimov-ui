import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DataTransferService } from 'src/app/pages/services/data-transfer.service';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.css']
})
export class ChatBotComponent implements OnInit {
  @Output() closeOverlay:any= new EventEmitter<boolean>();
  logsArray=[];
  chatValue:any;
  chatHistory:any=[];
  isProcessStart:boolean = false;
  // buttonsHTML:any=[];
  constructor(private router: Router,
    private dt: DataTransferService) { }
  
    ngOnInit(): void {
// this.chatHistory = [
  //   {
  //     "uuid": "text_uuid1",
  //     "message": "This is sample text response",
  //     "components": ["Buttons"],
  //     "values": [
  //       [
  //         {
  //           "label": "button label",
  //           "submitValue": "submit value"
  //         },
  //         {
  //           "label": "button label2",
  //           "submitValue": "submit value2"
  //         }
  //       ]
  //     ]
  //   },
  //   {
  //     "uuid": "text_uuid2",
  //     "message": ["This is sample text response2"],
  //     "components": ["Buttons"],
  //     "values": [
  //       [
  //         {
  //           "label": "button label"
  //         },
  //         {
  //           "label": "button label2"
  //         }
  //       ]
  //     ]
  //   },
  //   {
  //     "uuid":"text_uuid1",
  //     "message":"This is sample text response"
  //   },
  //   {
  //     "uuid":"text_uuid2",
  //     "message":["This is sample text response"]
  //   },
  //   {
  //     "uuid":"text_uuid3",
  //     "message":[" <b>This</b> is sample text response2, <a href='www.epsoftinc.com' target='_blank'> click here </a>" ]
  //   }
  // ];

}

  closeSplitOverlay(){ 
    this.closeOverlay.emit(false)
  }

  sendMessage(value){
    let url=this.router.url;
    let obj ={}
    obj["uuid"]=UUID.UUID();
    obj["message"]=value;
    this.chatHistory.push(obj)
    if(url == "/pages/processIntelligence/automate"){
      if(this.isProcessStart == true){
        this.logsArray.push(this.chatValue);
        let processLogs = [];
        this.logsArray.forEach(e=>{
          let obj1={}
          obj1["name"]=e
          obj1["key"]=""
          processLogs.push(obj1)
        })
        this.dt.setProcessLogs(processLogs);
      }

      if(this.isProcessStart == false){
        let processLogs = [];
        this.dt.setProcessLogs(processLogs);
      }

      if(value.includes("Describe") ){
        this.isProcessStart = true;
        let processLogs = [];
        this.dt.setProcessLogs(processLogs);
      }

      if(value == "End process" || value.includes("end") || value.includes("End")){
        this.logsArray=[];
        this.isProcessStart = false;
      }
      this.chatValue='';
    }else{
      this.logsArray=[];
      this.chatValue='';
    }

  }

  submitButton(item){
    console.log(item)
  }
}

