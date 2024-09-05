import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { StripeService } from 'ngx-stripe';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { PredefinedBotsService } from '../../services/predefined-bots.service';
import { toastMessages } from 'src/app/shared/model/toast_messages';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-ai-agent-add-agents-dialog',
  templateUrl: './ai-agent-add-agents-dialog.component.html',
  styleUrls: ['./ai-agent-add-agents-dialog.component.css']
})
export class AiAgentAddAgentsDialogComponent implements OnInit {
  @Input() selectedAgent: any;
  @Input() botName: string | undefined;
  @Output() agentAdded = new EventEmitter<string>();
  // @Output() close = new EventEmitter<void>();
  @Input() closeDialogCallback: () => void;
  displayAddAgentDialog: boolean = false;
  yearlyPricing: boolean = false;
  agentCount: number = 0;
  selectedPlans:any=[];
  selectedPlan: string = 'Monthly';
  showOrderDetails: boolean = false;

  constructor(
    private spinner: LoaderService,
    private toastService: ToasterService,
    private rest_api: PredefinedBotsService,
    private toastMessage: toastMessages,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    console.log("this.selectedAgent",this.selectedAgent)

  }

  ngOnChanges(){
    // console.log("this.selectedAgent",this.selectedAgent)
  }
  
  proceedToPay() {
    
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
  
    // if (filteredPriceIds.length === 0) {
    //   console.error('No price selected for the chosen interval.');
    //   this.spinner.hide();
    //   return;
    // }
  
  
    let req_body = {
      "userId":localStorage.getItem("ProfileuserId"),
      "productId":this.selectedAgent.productId,
      "quantity":this.agentCount
      }

      this.confirmationService.confirm({
        message: "Are you sure you want to add more agents? The amount will be deducted, and the addition will continue with the current billing cycle.",
        header: "Confirm Addition",
        acceptLabel: "Yes, Add Agents",
        rejectLabel: "No, Cancel",
        rejectButtonStyleClass: 'btn reset-btn',
        acceptButtonStyleClass: 'btn bluebg-button',
        defaultFocus: 'none',
        rejectIcon: 'null',
        acceptIcon: 'null',
        accept: () => {
          this.spinner.show();

          console.log("resrstage", "Agent Deleted Successfully");
          this.rest_api.addMoreSubAgents(req_body).subscribe(
            res => {
              // this.toastService.showSuccess("Redirecting to payment gateway");
              this.toastService.toastSuccess("Agent added successfully");
              // this.onClose();
              // if (this.closeDialogCallback) {
                this.closeDialogCallback();
              // }
              this.spinner.hide();

            },error => {
              this.spinner.hide();
              this.toastService.showError(this.toastMessage.apierror);
              console.error('Error during payment:', error);
            }
          );
        },
        reject: (type) => { }
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

  public onClose(): void {
    // this.close.emit();
    this.agentCount = 0;
  }
}
