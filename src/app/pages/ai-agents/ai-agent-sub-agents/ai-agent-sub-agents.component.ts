import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { PredefinedBotsService } from '../../services/predefined-bots.service';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { toastMessages } from 'src/app/shared/model/toast_messages';
import { ConfirmationService } from 'primeng/api';
import { RestApiService } from '../../services/rest-api.service';
import { StripeService } from 'ngx-stripe';
import { AiAgentAddAgentsDialogComponent } from '../ai-agent-add-agents-dialog/ai-agent-add-agents-dialog.component';

@Component({
  selector: 'app-ai-agent-sub-agents',
  templateUrl: './ai-agent-sub-agents.component.html',
  styleUrls: ['./ai-agent-sub-agents.component.css']
})
export class AiAgentSubAgentsComponent implements OnInit {
  @ViewChild('addAgentsDialog') addAgentsDialog: AiAgentAddAgentsDialogComponent;
  product_id="";
  agentList: any[] = [];
  agentName: string='';
  subAgentList: any[] = [];
  selectedAgent: any;
  displayAddAgentDialog: boolean = false;
  showSkeleton:boolean = true;
  agentExpire: any;
  searchTerm:string;
  filterAgentsList:any;
  isAscending: boolean = false;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private spinner: LoaderService,
    private rest_api: PredefinedBotsService,
    private toaster: ToasterService,
    private toastMessage: toastMessages,
    private confirmationService: ConfirmationService,
    private rest_api_service:RestApiService,
    private stripeService: StripeService,
    private toastService: ToasterService,
  ) { 
    this.route.queryParams.subscribe(params => {
      // this.agentName = params['botName'] ? params['botName'] : null;
      const productId = params['id'];
      if (productId) {
        this.product_id=productId
        this.getPredefinedBotsList(this.product_id);
        this.getSubAgents();
      }
    });
    // const navigation = this.router.getCurrentNavigation();
    // this.bot = navigation?.extras.state?.bot;
  }

  ngOnInit(): void {
  }

  getPredefinedBotsList(productId: string) {
    this.spinner.show();
    this.rest_api.getPredefinedBotsList().subscribe((res: any) => {
      this.agentList = res.data.map(bot => ({
        ...bot,
        details: bot.description || 'No Description Found.'
      }));
      console.log("Agent List",this.agentList)
      this.agentName = this.agentList.find(bot => bot.productId === productId).predefinedBotName;
      // this.UUID=this.agentName.predefinedUUID
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.toaster.showError(this.toastMessage.apierror);
    });
  }

  getSubAgents() {
    this.spinner.show();
    // let tenant_id = localStorage.getItem("tenantName");
    this.rest_api.getSubAiAgent(this.product_id).subscribe((res: any) => {
      this.spinner.hide();
      this.subAgentList = res.data;
      // this.subAgentList = this.data__data.data;
      this.filterAgentsList = res.data;
      // this.filterAgentsList = this.data__data.data;
      if(res.code == 4200){
        this.agentExpire = res.expiryDate;
        // this.agentName = res.agentName;
      }
      this.showSkeleton= false;
      const today = new Date();
      const twoDaysBeforeToday = new Date(today.setDate(today.getDate() - 2));
      this.subAgentList.forEach(async agent => {
        // const shouldExpire = Math.random() < 0.3;
        // if (shouldExpire) {
        //   let randomDate = new Date();
        //   randomDate.setDate(today.getDate() - Math.floor(Math.random() * 30));
        //   agent.isExpired = true;
        //   agent.expiryDate = twoDaysBeforeToday.toISOString();
        //   // agent.lastRunDate = "July 31 2024";
        //   const lastRunDate = await this.getSubAgentsLastExeDate(agent.agentId);
        //   agent.lastRunDate = lastRunDate ? lastRunDate : null;
        //   console.log("Agnet Id", agent.agentId,"Last Run Date: ",lastRunDate)
        // } else {
          // const lastRunDate = await this.getSubAgentsLastExeDate(agent.agentId);
          // agent.lastRunDate = lastRunDate ? lastRunDate : null;
          // console.log("Agnet Id", agent.agentId,"Last Run Date: ",lastRunDate)
        // }
      });
  
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.toaster.showError(this.toastMessage.apierror);
    });
  }
  
  getSubAgentsLastExeDate(agent_id): Promise<Date | null> {
    this.spinner.show();
    return new Promise((resolve) => {
      this.rest_api.subAgentLastExecution(agent_id).subscribe(
        (res: any) => {
          this.spinner.hide();
          console.log("API Response for agent_id", agent_id, ":", res); // Log the raw response
          resolve(res ? res.data ?? new Date(res.data) : null);
        },
        (error) => {
          this.spinner.hide();
          console.error("API Error for agent_id", agent_id, ":", error); // Log the error
          resolve(null);
        }
      );
    });
  }

  showAddAgentDialog( ) {

    this.selectedAgent = this.agentList.find(bot => bot.productId === this.product_id);
    this.displayAddAgentDialog = true;
  }

  onDialogHide() {
    this.displayAddAgentDialog = false;
    if (this.addAgentsDialog) {
      this.addAgentsDialog.onClose();
    }
    this.getSubAgents();
  }
  
  closeDialogFromChild() {
    this.onDialogHide();
  }

  handleRenewBtn(agent: any) {
    this.selectedAgent = agent;

    console.log("RENEW", this.selectedAgent);
    console.log('Renewing agent', agent);
    let req_body = {
      "userId": localStorage.getItem('ProfileuserId'),
      "productId": this.product_id,
      "agentIds": [agent.subAgentId]
    }

    this.spinner.show();
        this.rest_api.renewSubAgent(req_body).subscribe((res:any) => {
          console.log('Agent renewed successfully', res);
          if(res.code == 4200){
            this.spinner.hide();
            this.toastService.showSuccess("The agent has been renewed successfully! The amount will be deducted, and the renewal will continue with the current billing cycle.",'response');
            this.getSubAgents()
          }else{
            this.spinner.hide();
            this.toastService.showError(this.toastMessage.apierror);
          }
        }, (err) => {
          this.spinner.hide();
          this.toastService.showError(this.toastMessage.apierror);
        });



    // this.confirmationService.confirm({
    //   message: "Would you like to renew this agent? The amount will be deducted, and the renewal will continue with the current billing cycle.",
    //   header: "Renew Agent",
    //   acceptLabel: "Yes, Renew",
    //   rejectLabel: "No, Cancel",
    //   rejectButtonStyleClass: 'btn reset-btn',
    //   acceptButtonStyleClass: 'btn bluebg-button',
    //   defaultFocus: 'none',
    //   rejectIcon: 'null',
    //   acceptIcon: 'null',
    //   accept: () => {
    //     this.selectedAgent = agent;
    //     console.log("RENEW", this.selectedAgent);
    //     console.log('Renewing agent', agent);
    //     let req_body = {
    //       "userId": localStorage.getItem('ProfileuserId'),
    //       "productId": this.product_id,
    //       "agentIds": [agent.subAgentId]
    //     }
    //     this.spinner.show();
    //     this.rest_api.renewSubAgent(req_body).subscribe((res:any) => {
    //       console.log('Agent renewed successfully', res);
    //       if(res.code == 4200){
    //         this.spinner.hide();
    //         this.toastService.showSuccess("The agent has been successfully renewed!",'response');
    //         this.getSubAgents()
    //       }else{
    //         this.spinner.hide();
    //         this.toastService.showError(this.toastMessage.apierror);
    //       }
    //     }, (err) => {
    //       this.spinner.hide();
    //       this.toastService.showError(this.toastMessage.apierror);
    //     });
    //   },
    //   reject: (type) => { }
    // });
    // this.displayAddAgentDialog = true;
  }


  viewAgentDetails(agent: any) {
    console.log("Agent Details", agent);
    // return
    if(agent.isConfigured){
      this.router.navigate(["/pages/aiagent/form"], { queryParams: { type: "edit", id: agent.agentId, agentId : agent.subAgentId} });
      // this.router.navigate(["/pages/aiagent/form"], { queryParams: { type: "edit", id: this.bot?.productId, agent_id:this.selected_drop_agent.predefinedOrchestrationBotId } });

    }else{
      this.router.navigate(["/pages/aiagent/form"], { queryParams: { type: "create", id: agent.agentId, agentId : agent.subAgentId} });

    }
    
      // this.router.navigate(["/pages/aiagent/form"], { queryParams: { type: "create", id: agent.agentId, agentId : agent.subAgentId} });
  } 

  navigateManageSubscription() {
    this.router.navigate(["/pages/subscriptions"],{
      queryParams:{index:0}
    })
  }
  deleteSubSgent(agent:any){
    this.confirmationService.confirm({
      message: "Are you sure you want to delete this agent? This action cannot be undone.",
      header: "Confirm Deletion",
      acceptLabel: "Yes, Delete",
      rejectLabel: "No",
      rejectButtonStyleClass: 'btn reset-btn',
      acceptButtonStyleClass: 'btn bluebg-button',
      defaultFocus: 'none',
      rejectIcon: 'null',
      acceptIcon: 'null',
      accept: () => {
        let req_body = {
          "userId": localStorage.getItem('ProfileuserId'),
          "productId": this.product_id,
          "agentIds": [agent.subAgentId]
        }
        this.spinner.show()
        this.rest_api.deleteSubAgentById(req_body).subscribe((res: any) => {
          if(res.code == 4200){
            this.spinner.hide();
            this.toaster.showSuccess("The agent has been deleted successfully.", 'response');
            this.getSubAgents();
          }else{
            this.spinner.hide();
            this.toaster.showError(this.toastMessage.deleteError)
          }
        }, err => {
          this.spinner.hide();
          this.toaster.showError(this.toastMessage.apierror);
        });
      },
      reject: (type) => { }
    });
  }

  // sortAgents(){
  //   this.isAscending = !this.isAscending;
  //   this.filterAgentsList.sort((a, b) => {
  //     const nameA = a.subAgentName.toUpperCase();
  //     const nameB = b.subAgentName.toUpperCase();
  //     if (nameA < nameB) {
  //     return -1;
  //     }
  //     if (nameA > nameB) {
  //     return 1;
  //     }
  //     return 0;
  //   });
  // }

  sortAgents() {
    this.isAscending = !this.isAscending;
    
    this.filterAgentsList.sort((a, b) => {
      const nameA = a.subAgentName.toUpperCase();
      const nameB = b.subAgentName.toUpperCase();
      
      // Extract numeric part if it exists
      const numA = parseInt(nameA.match(/\d+/)?.[0] || '0');
      const numB = parseInt(nameB.match(/\d+/)?.[0] || '0');
      
      if (numA !== numB) {
        // If numeric parts are different, sort by number
        return this.isAscending ? numA - numB : numB - numA;
      } else {
        // If numeric parts are the same or don't exist, sort alphabetically
        if (nameA < nameB) {
          return this.isAscending ? -1 : 1;
        }
        if (nameA > nameB) {
          return this.isAscending ? 1 : -1;
        }
        return 0;
      }
    });
  }

  descendingOrder(){
    this.filterAgentsList.reverse();
    this.isAscending = !this.isAscending;
  }

  filterAgents(){
    if(this.searchTerm == ""){
      this.filterAgentsList = this.subAgentList;
    }else{
      this.filterAgentsList = this.subAgentList.filter(agent => agent.subAgentName.toLowerCase().includes(this.searchTerm.toLowerCase()));}
  }

  backToHome(){
    this.router.navigate(['/pages/aiagent/home'])
  }
}
