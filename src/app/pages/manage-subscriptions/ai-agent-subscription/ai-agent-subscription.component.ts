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
  selectedAgentType: 'Active' | 'Expired' | null = null;

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

  renewAgent(agent) {
    console.log('Renewing agent', agent);
    let req_body = {
      "userId": localStorage.getItem('ProfileuserId'),
      "productId": "prod_QbY7q8db8Hj3XC",
      "agentIds": [
        "a59319d7-058c-42e2-87ef-db8fdf2d653a"   
      ]
    }

    // to be send multiple agentId's
    this.spinner.show();
    this.rest_api.renewSubAgent(req_body).subscribe((res) => {
      console.log('Agent renewed successfully', res);
      // this.toastService.toastSuccess();
      this.spinner.hide();
    }, (err) => {
      console.error('Error renewing agent', err);
      this.toastService.showError(this.toastMessages.apierror);
      this.spinner.hide();
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

  subagentRenew(agent: any, subAgent: any) {
    console.log('Renewing', subAgent, 'for agent', agent);
    this.toastService.showSuccess('Success',`Renewed ${subAgent.name}`)

  }

  subagentCancel(agent: any, subAgent: any) {
    console.log('Cancelling', subAgent, 'for agent', agent);
    this.toastService.showSuccess('Success',`Cancelled ${subAgent.name}`)
  }

  getSubAgentsByStatus(agent: any, status: string): any[] {
    return agent.subAgents.filter((subAgent: any) => subAgent.status === status);
  }

  subagentRenewAll(agent: any) {
    const selectedInactiveSubAgents = this.getSelectedSubAgentsByStatus(agent, 'Inactive');

    if (selectedInactiveSubAgents.length === 0) {
      this.toastService.showWarn('No sub-agents selected for renewal.');
      return;
    }

    selectedInactiveSubAgents.forEach(subAgent => this.subagentRenew(agent, subAgent));
    this.toastService.showSuccess('Success', `Renewed all selected inactive agents for ${agent.name}`);
  }

  subagentCancelAll(agent: any) {
    const selectedActiveSubAgents = this.getSelectedSubAgentsByStatus(agent, 'Active');

    if (selectedActiveSubAgents.length === 0) {
      this.toastService.showWarn('No sub-agents selected for cancellation.');
      return;
    }

    selectedActiveSubAgents.forEach(subAgent => this.subagentCancel(agent, subAgent));
    this.toastService.showSuccess('Success', `Cancelled all selected active agents for ${agent.name}`);
  }


  subagentDelete(agent: any) {
    const selectedInactiveSubAgents = this.getSelectedSubAgentsByStatus(agent, 'Inactive');

    if (selectedInactiveSubAgents.length === 0) {
      this.toastService.showWarn('No sub-agents selected for deletion.');
      return;
    }

    // selectedInactiveSubAgents.forEach(subAgent => {
    //   console.log('Deleting sub-agent', subAgent);
    // });

    this.toastService.showSuccess('Success', `Deleted all selected inactive agents for ${agent.name}`);
  }


  getSelectedSubAgentsByStatus(agent: any, status: string): any[] {
    return agent.subAgents.filter((subAgent: any) => subAgent.status === status && subAgent.selected);
  }


  expiredSubagentRenew(agent: any, subAgent: any) {
    console.log('Renewing sub-agent', subAgent);
    this.toastService.showSuccess('Success', `Renewed sub-agent ${subAgent.name} for ${agent.name}`);
  }

  expiredSubagentRenewAll(agent: any) {
    const selectedSubAgents = this.getSelectedSubAgentsByStatus(agent, 'Inactive');
    if (selectedSubAgents.length === 0) {
      this.toastService.showWarn('No sub-agents selected for renewal.');
      return;
    }
    selectedSubAgents.forEach(subAgent => this.expiredSubagentRenew(agent, subAgent));
    this.toastService.showSuccess('Success', `Renewed all selected inactive agents for ${agent.name}`);
  }

  expiredSubagentDelete(agent: any) {
    const selectedSubAgents = this.getSelectedSubAgentsByStatus(agent, 'Inactive');
    if (selectedSubAgents.length === 0) {
      this.toastService.showWarn('No sub-agents selected for deletion.');
      return;
    }
    selectedSubAgents.forEach(subAgent => {
      console.log('Deleting sub-agent', subAgent);
    });
    this.toastService.showSuccess('Success', `Deleted all selected inactive agents for ${agent.name}`);
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
      this.subscribedAgentsList = this.subscriptions.filter(agent => !agent.isExpired);

      this.spinner.hide();
    }, (err) => {
      console.error('Error renewing agent', err);
      this.toastService.showError(this.toastMessages.apierror);
      this.spinner.hide();
    });
  }

}

