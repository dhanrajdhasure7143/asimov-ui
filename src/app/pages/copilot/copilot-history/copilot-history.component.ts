import { Component, OnInit } from '@angular/core';
import { CopilotService } from '../../services/copilot.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-copilot-history',
  templateUrl: './copilot-history.component.html',
  styleUrls: ['./copilot-history.component.css']
})
export class CopilotHistoryComponent implements OnInit {

  constructor(
    private rest:CopilotService,
    private router:Router
    ) { }
  conversationCheck:boolean=true;
  conversationPreviewChat:any=[];
  messagesResponse:any=[];  
  teamConversation:any=[];
  getConversationByConversationId:any[];
  user_firstletter="DP";

  ngOnInit(): void {
    this.getConversations("USER");
  }


  getConversations(type:any){
    console.log(type)
    this.conversationCheck=((type=="USER")?true:false);
    let conversationFlag:string=this.conversationCheck?"ezflow.developers@epsoftinc.com":localStorage.getItem("tenantName");
    let conversationObservable:any=(this.conversationCheck)?this.rest.getUserConversations(conversationFlag):this.rest.getConversationByTenantId(conversationFlag);
    conversationObservable?.subscribe((response:any)=>{
        console.log(response);
        this.messagesResponse=response;
    },err=>{
        console.log("check",err)
    });
 
  }

  openCompleteChatPreview(messageConversation:any){
    this.rest.getAllConversationsByConversationId(messageConversation.conversationId).subscribe((response:any)=>{
        this.conversationPreviewChat=response.map((item:any)=>{
            let data=JSON.parse(item["message"]);
            for(let i=0;i<data?.components?.length;i++){
              if(data?.components[i]=="Buttons"){
                  data.values[i]=data?.values[i].map((componentItem)=>{
                      componentItem["disabled"]=true;
                      return componentItem;
                  })
              }
              if(data?.components[i]=="list"){
               data.values[i]=data?.values[i].map((componentItem:any)=>{
                      if(componentItem?.actions)
                          componentItem.actions=componentItem?.actions?.map((componentActionItem:any)=>{
                              componentActionItem["disabled"]=true;
                              return componentActionItem;    
                          });
                          return componentItem;  
                 })
              }
            }
            item["data"]=data;
            return item;
        });
    },err=>{
        console.log("error",err);
    })
  }


  resumeConversation(conversationMessage:any){
    console.log(conversationMessage);
    if(conversationMessage?.conversation?.conversationId)
    this.router.navigate(["./pages/copilot/chat"], {queryParams:{conversationId:conversationMessage?.conversation?.conversationId}});
    //this.router.navigate(["./pages/copilot/chat"], {queryParams:{conversationId:conversationMessage?.conversation?.conversationId}});
  }



}
