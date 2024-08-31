import { Component, OnInit } from '@angular/core';
import { PredefinedBotsService } from '../../services/predefined-bots.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { toastMessages } from 'src/app/shared/model/toast_messages';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-ai-agent-subscription',
  templateUrl: './ai-agent-subscription.component.html',
  styleUrls: ['./ai-agent-subscription.component.css']
})
export class AiAgentSubscriptionComponent implements OnInit {

  aiAgentColumns = [
    { header: 'AI Agents', flex: 2, field: 'name', class: 'agent-parent-name', isCheckbox: false },
    { header: 'No. of Agents', flex: 1, field: 'noOfAgents', class: '', isCheckbox: false },
    { header: 'Next Bill Estimates', flex: 1, field: 'nextBillEstimate', class: 'next-bill-est', isCheckbox: false },
    { header: 'Billing Date', flex: 1, field: 'billingDate', class: 'next-bill-est', isCheckbox: false },
    { header: 'Expires On', flex: 1, field: 'expiresOn', class: 'next-bill-est', isCheckbox: false },
    { header: 'Auto Renew', flex: 1, field: 'autoRenew', class: '', isCheckbox: false }
  ];

  subAgentColumns = [
    { header: 'Ai Agent Name', flex: 1.5, field: 'name', class: 'asub-agent-column-header', isCheckbox: true  , isExpiredTab: true },
    { header: 'Status', flex: 1, field: 'status', class: '', isCheckbox: false , isExpiredTab: false },
    { header: 'Purchase On', flex: 1, field: 'purchaseOn', class: '', isCheckbox: false , isExpiredTab: false },
    { header: 'Pricing', flex: 1, field: 'pricing', class: '', isCheckbox: false , isExpiredTab: false },
    // { header: 'Last Used', flex: 1, field: 'lastUsed', class: '', isCheckbox: false , isExpiredTab: false },
    { header: 'Action', flex: 1, field: 'action', class: '', isCheckbox: false , isExpiredTab: false }
  ];

  expiredAgentsList : any[]=[];
  itemsPerPage = 4;
  subscribedAgentsList : any[] = [];
  selectedAgentType: 'ACTIVE' | 'INACTIVE' | null = null;

  subscriptions =[]

  constructor(
    private rest_api: PredefinedBotsService,
    private spinner : LoaderService,
    private toastService: ToasterService,
    private toastMessages: toastMessages,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getSubscribedAgentsList()

    // this.expiredAgentsList=this.subscriptions.filter(agent => agent.isExpired);
    //   this.subscribedAgentsList=this.subscriptions.filter(agent => !agent.isExpired);
  }

  toggleAccordion(agent: any) {
    agent.expanded = !agent.expanded;
  }


  getSubAgentsForPage(agent: any): any[] {
    const startIndex = (agent.currentPage - 1) * this.itemsPerPage;
    return agent.subAgents.slice(startIndex, startIndex + this.itemsPerPage);
  }

  getPages(agent: any): number[] {
    return Array(Math.ceil(agent.subAgents.length / this.itemsPerPage)).fill(0).map((_, i) => i + 1);
  }
  
  setPage(agent: any, pageNumber: number) {
    const totalPages = this.getPages(agent).length;
  
    if (pageNumber < 1 || pageNumber > totalPages) {
      return; 
    }
  
    agent.currentPage = pageNumber;
  }

  getRemainingDays(paymentDue: string): number {
    const today = new Date();
    const paymentDate = new Date(paymentDue);
    const diffTime = paymentDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  getRemainingDaysClass(paymentDue: string): string {
    const days = this.getRemainingDays(paymentDue);
    if (days < 15) {
      return 'less-than-15';
    } else if (days < 30) {
      return 'less-than-30';
    }
    return 'default-color';
  }

  onChangeAutoRenew(event,agent) {
    console.log('Auto Renew changed', event, agent);
    let user_email = localStorage.getItem('ProfileuserId');
    this.confirmationService.confirm({
      message: 'Are you sure you want to update the auto renew status?',
      accept: () => {
      this.spinner.show();
      this.rest_api.updateAutoRenew(user_email, agent.name, agent.autoRenew).subscribe((res) => {
        console.log('Auto Renew updated successfully', res);
        this.toastService.toastSuccess(this.toastMessages.autoRenewUpdated);
        this.spinner.hide();
      }, (err) => {
        console.error('Error updating auto renew', err);
        this.toastService.showError(this.toastMessages.apierror);
        this.spinner.hide();
      });
      },
      reject: () => {
        agent.autoRenew = !agent.autoRenew;
      }
    });
  }

  subagentSelect(event: Event, subAgent: any, agent: any) {
    const isSelected = subAgent.selected;
    const selectedStatuses = agent.subAgents.filter((a: any) => a.selected).map((a: any) => a.status);

    if (selectedStatuses.length === 0) {
      this.selectedAgentType = null;
    }

    if (this.selectedAgentType === null) {
      this.selectedAgentType = subAgent.status;
      subAgent.selected = !isSelected;
    } else if (this.selectedAgentType !== subAgent.status) {
      if (selectedStatuses.length > 0) {
        subAgent.selected = false;
        this.toastService.showWarn("Please select one type (either Active or Expired).");
        (event.target as HTMLInputElement).checked = false;
      }
    } else {
      subAgent.selected = !isSelected;
    }
  }  

  subagentCancelSubscription(agent: any, subAgent: any) {
    this.cancelAiAgentSubscription(agent,subAgent);
  }

  getSubAgentsByStatus(agent: any, status: string): any[] {
    return agent.subAgents.filter((subAgent: any) => subAgent.status === status);
  }
 

  subagentCancelAllSubscription(agent: any) {
    const selectedActiveSubAgents = this.getSelectedSubAgentsByStatus(agent, 'ACTIVE');
  
    if (selectedActiveSubAgents.length === 0) {
      this.toastService.showWarn('No sub-agents selected for cancellation.');
      return;
    }
  
    selectedActiveSubAgents.forEach(subAgent => this.subagentCancelSubscription(agent, subAgent));
    this.cancelAiAgentSubscription(agent.productId,selectedActiveSubAgents);
  }
  
  getSelectedSubAgentsByStatus(agent: any, status: string): any[] {
    return agent.subAgents.filter((subAgent: any) => subAgent.status === status && subAgent.selected);
  }

  selectAll(agent: any, checked: boolean) {
    agent.subAgents.forEach((subAgent: any) => {
        subAgent.selected = checked;
    });
  }

  getSubscribedAgentsList() {
    this.spinner.show();
    this.rest_api.getSubscribedAgentsList().subscribe((res: any) => {
      console.log('Agent Subscription List', res);

      this.subscriptions = res.map((agent: any) => ({
        ...agent,
        expanded: false,
        currentPage: 1
      }));

      this.expiredAgentsList = this.subscriptions.filter(agent => agent.IsExpired);
      this.subscribedAgentsList = this.subscriptions.filter(agent => !agent.IsExpired);

      this.spinner.hide();
    }, (err) => {
      console.error('Error renewing agent', err);
      this.toastService.showError(this.toastMessages.apierror);
      this.spinner.hide();
    });
  }

  cancelAiAgentSubscription(productId: string, subAgents: any | any[]) {
    this.confirmationService.confirm({
      message: `Are you sure you want to cancel Subscription ?`,
      header: "Cancel Subscription",
      acceptLabel: "Yes, Cancel",
      rejectLabel: "No, Keep",
      rejectButtonStyleClass: 'btn reset-btn',
      acceptButtonStyleClass: 'btn bluebg-button',
      defaultFocus: 'none',
      rejectIcon: 'null',
      acceptIcon: 'null',
      accept: () => {
        const agentIds = Array.isArray(subAgents) 
          ? subAgents.map((subAgent: any) => subAgent.agentUUID) 
          : [subAgents.agentUUID];
        
        const body = {
          userId: localStorage.getItem('ProfileuserId'),
          productId: productId,
          agentIds: agentIds
        };

        console.log("Product ID :", productId , "UUID's :",agentIds  )
  
        this.spinner.show();
        this.rest_api.cancelSubAgentsSubscription(body).subscribe(
          (res: any) => {
            this.toastService.showSuccess('Success', 'Cancelled Subscription.');
            this.spinner.hide();
            this.getSubscribedAgentsList();
          },
          (err) => {
            this.toastService.showError(this.toastMessages.apierror);
            this.spinner.hide();
          }
        );
      },
      reject: () => {
        console.log('Cancellation cancelled');
      }
    });
  }

  deleteAiAgentSubAgents(agent: any, status: string) {
    const selectedSubAgents = this.getSelectedSubAgentsByStatus(agent, status);
  
    if (selectedSubAgents.length === 0) {
      this.toastService.showWarn('No sub-agents selected for deletion.');
      return;
    }
  
    this.confirmationService.confirm({
      message: `Are you sure you want to delete all selected ${status.toLowerCase()} sub-agents for ${agent.name}?`,
      header: "Delete Sub-Agent",
      acceptLabel: "Yes, Delete",
      rejectLabel: "No, Cancel",
      rejectButtonStyleClass: 'btn reset-btn',
      acceptButtonStyleClass: 'btn bluebg-button',
      defaultFocus: 'none',
      rejectIcon: 'null',
      acceptIcon: 'null',
      accept: () => {
        selectedSubAgents.forEach(subAgent => {
          console.log('Deleting sub-agent', subAgent);
        });
        this.toastService.showSuccess('Success', `Deleted all selected ${status.toLowerCase()} agents for ${agent.name}`);
      },
    });
  }
  

  handleRenewal(actionType: 'individual' | 'bulk', agent: any, subAgents: any | any[]) {
    this.confirmationService.confirm({
      message: "Are you sure you want to Renew Subscription ? ",
      header: 'Renew',
      acceptLabel: 'Yes, Renew',
      rejectLabel: 'No, Cancel',
      rejectButtonStyleClass: 'btn reset-btn',
      acceptButtonStyleClass: 'btn bluebg-button',
      defaultFocus: 'none',
      rejectIcon: 'null',
      acceptIcon: 'null',
      accept: () => {
        const agentIds = actionType === 'bulk'
          ? subAgents.map(subAgent => subAgent.agentUUID)
          : [subAgents.agentUUID];
        
        const req_body = {
          userId: localStorage.getItem('ProfileuserId'),
          productId: agent.productId,
          agentIds: agentIds
        };

        console.log("RENEWAL INFORMATION: ", agent.productId, "UUID's :", agentIds)
  
        this.spinner.show();
        this.rest_api.renewSubAgent(req_body).subscribe(
          (res) => {
            this.toastService.showSuccess('Success', 'Renewed successfully.');
            this.spinner.hide();
            this.getSubscribedAgentsList();
          },
          (err) => {
            console.error('Error renewing agent', err);
            this.toastService.showError(this.toastMessages.apierror);
            this.spinner.hide();
          }
        );
      },
    });
  }

}

