import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CopilotService } from '../../services/copilot.service';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import * as BpmnJS from "../../../bpmn-modeler-copilot.development.js";
import { ConfirmationService, MenuItem } from 'primeng/api';

@Component({
  selector: 'app-copilot-history',
  templateUrl: './copilot-history.component.html',
  styleUrls: ['./copilot-history.component.css']
})
export class CopilotHistoryComponent implements OnInit {

  constructor(
    private rest:CopilotService,
    private router:Router,
    private toastService:ToasterService,
    private confirmationService: ConfirmationService,
    ) { }
  conversationCheck:boolean=true;
  conversationPreviewChat:any=[];
  messagesResponse:any=[];  
  teamConversation:any=[];
  getConversationByConversationId:any[];
  user_firstletter="DP";
  bpmnModeler:any;
  isDialogVisible:boolean=false;
  items: MenuItem[];
  @ViewChild('diagramContainer', { static: false }) diagramContainer: ElementRef;
  ngOnInit(): void {
    this.loadBpmnContainer();
    this.getConversations("USER");
  }


  getConversations(type:any){
    this.conversationCheck=((type=="USER")?true:false);
    let conversationFlag:string=this.conversationCheck?localStorage.getItem("ProfileuserId"):localStorage.getItem("tenantName");
    let conversationObservable:any=(this.conversationCheck)?this.rest.getUserConversations(conversationFlag):this.rest.getConversationByTenantId(conversationFlag);
    conversationObservable?.subscribe((response:any)=>{
        this.messagesResponse=response;
    },err=>{
        this.toastService.showError("Unable to get conversations");
        console.log(err)
    });
 
  }

  openCompleteChatPreview(messageConversation:any){
    this.rest.getAllConversationsByConversationId(messageConversation.conversationId).subscribe((response:any)=>{
      if(response?.data){
        let bpmnActionDetails=JSON.parse(response?.data);
        this.loadBpmnwithXML(bpmnActionDetails[0])
      }
      else{
        this.bpmnModeler.clear();
      }
      this.conversationPreviewChat=response?.conversationHistory?.map((item:any)=>{
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
        this.toastService.showError("Unable to get conversation chat")
        console.log(err);
    })
  }


  resumeConversation(conversationMessage:any){
    if(conversationMessage?.conversation?.conversationId)
    this.router.navigate(["./pages/copilot/chat"], {queryParams:{conversationId:conversationMessage?.conversation?.conversationId}});
    //this.router.navigate(["./pages/copilot/chat"], {queryParams:{conversationId:conversationMessage?.conversation?.conversationId}});
  }


  loadBpmnContainer(){
    let container:any=this.diagramContainer?.nativeElement;
    (!container)?setTimeout(() => this.loadBpmnContainer(), 100):this.bpmnModeler = new BpmnJS({container});
  }

  loadBpmnwithXML(bpmnActionDetails:any) {
    console.log("bpmn action details", bpmnActionDetails);
    this.isDialogVisible = false;
    let bpmnPath=atob(bpmnActionDetails.bpmnXml);
    this.bpmnModeler.importXML(bpmnPath, function (err) {
      if (err) {
        console.error("could not import BPMN EZFlow notation", err);
      }
    });
    setTimeout(() => {
      this.notationFittoScreen();
    }, 500);
    this.bpmnModeler.on("element.contextmenu", () => false);
  }

  notationFittoScreen() {
    let canvas = this.bpmnModeler.get("canvas");
    canvas.zoom("fit-viewport");
  }

  deleteChat(conversationId: any){
        let data :any = {
          "conversationIds": [  
            conversationId
          ]
        }
        this.confirmationService.confirm({
          message: "Do you want to delete this conversation? This can't be undo.",
          header: "Are you sure?",
          acceptLabel: "Yes",
          rejectLabel: "No",
          rejectButtonStyleClass: 'btn reset-btn',
          acceptButtonStyleClass: 'btn bluebg-button',
          defaultFocus: 'none',
          rejectIcon: 'null',
          acceptIcon: 'null',
          accept: () => {
            this.rest.deleteConversation(data).subscribe(() => {
              this.toastService.showSuccess('Conversation deleted successfully.',"response");
              this.getConversations(this.conversationCheck ? "USER" : "TEAM");
              this.conversationPreviewChat = [];
              this.bpmnModeler.clear();
            },
            (err) => {
              this.toastService.showError('Unable to delete conversation.');
              console.error("consoleError",err);
            }
          );
          },
          reject: (type) => {}
        })
      }
  

  openContextMenu(event: Event,conversationId: any) {
    this.items= [
      {label: 'Delete', command: () => this.deleteChat(conversationId)}
    ];
  }

}
