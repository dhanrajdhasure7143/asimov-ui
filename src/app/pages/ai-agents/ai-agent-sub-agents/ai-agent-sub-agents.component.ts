import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { PredefinedBotsService } from '../../services/predefined-bots.service';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { toastMessages } from 'src/app/shared/model/toast_messages';
import { ConfirmationService } from 'primeng/api';
import { RestApiService } from '../../services/rest-api.service';
import { StripeService } from 'ngx-stripe';

@Component({
  selector: 'app-ai-agent-sub-agents',
  templateUrl: './ai-agent-sub-agents.component.html',
  styleUrls: ['./ai-agent-sub-agents.component.css']
})
export class AiAgentSubAgentsComponent implements OnInit {
  product_id="";
  agentList: any[] = [];
  bot: any;
  UUID="";
  subAgentList: any[] = [];
  dummyBotName:any;
  
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
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const productId = params['id'];
      if (productId) {
        this.product_id=productId
        this.getPredefinedBotsList(this.product_id);
        this.getSubAgents();
      }
    });
  }

  getPredefinedBotsList(productId: string) {
    this.spinner.show();
    this.rest_api.getPredefinedBotsList().subscribe((res: any) => {
      this.agentList = res.data.map(bot => ({
        ...bot,
        details: bot.description || 'No Description Found.'
      }));
      this.bot = this.agentList.find(bot => bot.productId === productId);
      this.UUID=this.bot.predefinedUUID
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.toaster.showError(this.toastMessage.apierror);
    });
  }

  getSubAgents() {
    this.spinner.show();
    let tenant_id = localStorage.getItem("tenantName");
    this.rest_api.getSubAiAgent(this.product_id, tenant_id).subscribe((res: any) => {
      this.subAgentList = res;
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
          const lastRunDate = await this.getSubAgentsLastExeDate(agent.agentId);
          agent.lastRunDate = lastRunDate ? lastRunDate : null;
          console.log("Agnet Id", agent.agentId,"Last Run Date: ",lastRunDate)
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

  showAddAgentDialog(event){

  }

  handleRenewBtn(){

  }

  viewAgentDetails(agent: any) {
    console.log('Viewing agent details:', agent);
        this.router.navigate(["/pages/aiagent/form"], { queryParams: { type: "create", id: agent.agentType, agentId : agent.agentId} });
  } 
}
