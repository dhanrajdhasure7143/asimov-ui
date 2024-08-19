import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { RestApiService } from '../../services/rest-api.service';
import { switchMap } from 'rxjs/operators';
import { StripeService } from 'ngx-stripe';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { PredefinedBotsService } from '../../services/predefined-bots.service';
import { toastMessages } from 'src/app/shared/model/toast_messages';

@Component({
  selector: 'app-ai-agent-add-agents-dialog',
  templateUrl: './ai-agent-add-agents-dialog.component.html',
  styleUrls: ['./ai-agent-add-agents-dialog.component.css']
})
export class AiAgentAddAgentsDialogComponent implements OnInit {
  @Input() selectedAgent: any;
  @Input() botName: string | undefined;
  @Output() agentAdded = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();
  displayAddAgentDialog: boolean = false;
  yearlyPricing: boolean = false;
  agentCount: number = 0;
  selectedPlans:any=[];
  selectedPlan: string = 'Monthly';
  showOrderDetails: boolean = false;

  constructor(
    private spinner: LoaderService,
    private rest_api_service: RestApiService,
    private stripeService: StripeService,
    private toastService: ToasterService,
    private rest_api: PredefinedBotsService,
    private toastMessage: toastMessages
  ) { }

  ngOnInit(): void {
  }
  
  proceedToPay() {
    this.spinner.show();
    // const agentName = this.selectedAgent?.predefinedBotName;
    // this.agentAdded.emit(agentName);
    this.displayAddAgentDialog = false;
    // let selectedInterval = (this.selectedPlan === 'Monthly') ? 'month' : 'year';
    let filteredPriceIds = [];
    this.selectedPlans.forEach((element) => {
      element.priceCollection.forEach((price) => {
        // if (price.recurring.interval === selectedInterval) {
          let obj={}
          obj["id"]=price.id
          obj["quantity"]=element.quantity
          filteredPriceIds.push(obj);
        // }
      });
    });
  
    if (filteredPriceIds.length === 0) {
      console.error('No price selected for the chosen interval.');
      this.spinner.hide();
      return;
    }
  
    let req_body = {
      //"price": filteredPriceIds,
      "priceData": filteredPriceIds.map(price => ({
        "price": price.id,
        "quantity": price.quantity
      })),
      // "customerEmail": this.userEmail,
      // "successUrl": environment.paymentSuccessURL,
      // // "cancelUrl": environment.paymentFailuerURL,
      // "paymentMethodId": this.selectedCard,
    };
    // if(this.isbillingInfoDisble){
    //   req_body["cancelUrl"]= environment.paymentFailuerURL+"?index=4"
    // }else{
    //   req_body["cancelUrl"]= environment.paymentFailuerURL+"?index=2"
    // }
    
    this.rest_api_service.getCheckoutScreen(req_body).pipe(
        switchMap((session: any) => {
          this.spinner.hide();
          return this.stripeService.redirectToCheckout({ sessionId: session.id });
        })
      ).subscribe(
        res => {
          this.spinner.hide();
        },error => {
          this.spinner.hide();
          this.toastService.showError("Failed to redirect to payment gateway");
          console.error('Error during payment:', error);
        }
      );
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

  
  showAddAgentDialog(event: Event) {
    // console.log(agent);
    event.stopPropagation(); // Prevent the click from bubbling up to the parent elements
    // this.selectedAgent = agent;
    this.displayAddAgentDialog = true;
  }

  incrementAgentCount() {
    this.agentCount++;
  }

  decrementAgentCount() {
    if (this.agentCount > 0) {
      this.agentCount--;
    }
  }

  calculateTotalPrice(): string {
    const basePrice = this.yearlyPricing ? 100 : 10;
    return (basePrice * this.agentCount).toFixed(2);
  }
  // proceedToPay() {
  //   console.log('Proceeding to payment...');
  //   // Implement payment logic here
  //   this.displayAddAgentDialog = false;
  // }
  
  
  
  // getSubAgents() {
  //   this.spinner.show();
  //   let tenant_id = localStorage.getItem("tenantName");
  //   this.rest_api.getSubAiAgent(this.product_id, tenant_id).subscribe((res: any) => {
  //     this.agent_drop_list = res;
  
  //     const today = new Date();
  //     const twoDaysBeforeToday = new Date(today.setDate(today.getDate() - 2));
  
  //     this.agent_drop_list.forEach(async agent => {
  //       const shouldExpire = Math.random() < 0.3;
  
  //       if (shouldExpire) {
  //         let randomDate = new Date();
  //         randomDate.setDate(today.getDate() - Math.floor(Math.random() * 30));
  //         agent.isExpired = true;
  //         agent.expiryDate = twoDaysBeforeToday.toISOString();
  //         // agent.lastRunDate = "July 31 2024";
  //         const lastRunDate = await this.getSubAgentsLastExeDate(agent.agentId);
  //         agent.lastRunDate = lastRunDate ? lastRunDate : null;
  //         console.log("Agnet Id", agent.agentId,"Last Run Date: ",lastRunDate)
  //       } else {
  //         // agent.lastRunDate =null;
  //         const lastRunDate = await this.getSubAgentsLastExeDate(agent.agentId);
  //         agent.lastRunDate = lastRunDate ? lastRunDate : null;
  //         console.log("Agnet Id", agent.agentId,"Last Run Date: ",lastRunDate)
  //       }
  //     });
  
  //     this.spinner.hide();
  //   }, err => {
  //     this.spinner.hide();
  //     this.toastService.showError(this.toastMessage.apierror);
  //   });
  // }
  onClose(): void {
    this.close.emit();
    this.agentCount = 0;
  }
}
