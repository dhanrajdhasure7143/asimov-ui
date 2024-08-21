import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ai-agent-subscription',
  templateUrl: './ai-agent-subscription.component.html',
  styleUrls: ['./ai-agent-subscription.component.css']
})
export class AiAgentSubscriptionComponent implements OnInit {

  
  subscriptions = [
    {
      name: 'Marketing Agent',
      noOfAgents: 5,
      nextBillEstimate: 600,
      paymentDue: '2024-11-01',
      expanded: false,
      currentPage: 1,
      subAgents: [
        { name: 'Agent 01', status: 'Active', expiryOn: '2025-03-01', purchaseOn: '2024-03-01', pricing: '$18', autoRenew: true, billingCycle: 'Monthly' },
        { name: 'Agent 02', status: 'Active', expiryOn: '2025-04-01', purchaseOn: '2024-04-01', pricing: '$20', autoRenew: true, billingCycle: 'Monthly' },
        { name: 'Agent 03', status: 'Inactive', expiryOn: '2024-08-01', purchaseOn: '2023-08-01', pricing: '$13', autoRenew: false, billingCycle: 'Yearly' },
        { name: 'Sub Agent Delta', status: 'Active', expiryOn: '2025-05-01', purchaseOn: '2024-05-01', pricing: '$11', autoRenew: true, billingCycle: 'Monthly' },
        { name: 'Agent 05', status: 'Active', expiryOn: '2025-06-01', purchaseOn: '2024-06-01', pricing: '$17', autoRenew: true, billingCycle: 'Monthly' },
        { name: 'Agent 06', status: 'Active', expiryOn: '2025-03-01', purchaseOn: '2024-03-01', pricing: '$18', autoRenew: true, billingCycle: 'Monthly' },
        { name: 'Agent 07', status: 'Active', expiryOn: '2025-04-01', purchaseOn: '2024-04-01', pricing: '$20', autoRenew: true, billingCycle: 'Monthly' }
      ]
    },
    {
      name: 'Development Agent',
      noOfAgents: 5,
      nextBillEstimate: 600,
      paymentDue: '2024-09-01',
      expanded: false,
      currentPage: 1,
      subAgents: [
        { name: 'Agent 01', status: 'Active', expiryOn: '2025-03-01', purchaseOn: '2024-03-01', pricing: '$18', autoRenew: true, billingCycle: 'Monthly' },
        { name: 'Agent 02', status: 'Active', expiryOn: '2025-04-01', purchaseOn: '2024-04-01', pricing: '$20', autoRenew: true, billingCycle: 'Monthly' },
        { name: 'Agent 03', status: 'Inactive', expiryOn: '2024-08-01', purchaseOn: '2023-08-01', pricing: '$13', autoRenew: false, billingCycle: 'Yearly' },
        { name: 'Agent 04', status: 'Active', expiryOn: '2025-05-01', purchaseOn: '2024-05-01', pricing: '$11', autoRenew: true, billingCycle: 'Monthly' },
        { name: 'Agent 05', status: 'Active', expiryOn: '2025-06-01', purchaseOn: '2024-06-01', pricing: '$17', autoRenew: true, billingCycle: 'Monthly' }
      ]
    },
    {
      name: 'Recruitment Agent',
      noOfAgents: 7,
      nextBillEstimate: 350,
      paymentDue: '2024-12-01',
      expanded: false,
      currentPage: 1,
      subAgents: [
        { name: 'Agent 01', status: 'Inactive', expiryOn: '2024-08-01', purchaseOn: '2023-08-01', pricing: '$13', autoRenew: false, billingCycle: 'Yearly' },
        { name: 'Agent 02', status: 'Active', expiryOn: '2025-05-01', purchaseOn: '2024-05-01', pricing: '$11', autoRenew: true, billingCycle: 'Monthly' },
        { name: 'Sub Agent Zeta', status: 'Active', expiryOn: '2025-07-01', purchaseOn: '2024-07-01', pricing: '$19', autoRenew: true, billingCycle: 'Monthly' }
      ]
    },
    {
      name: 'RFP Agent',
      noOfAgents: 12,
      nextBillEstimate: 600,
      paymentDue: '2024-08-25',
      expanded: false,
      currentPage: 1,
      subAgents: [
        { name: 'Agent 01', status: 'Active', expiryOn: '2025-03-01', purchaseOn: '2024-03-01', pricing: '$18', autoRenew: true, billingCycle: 'Monthly' },
        { name: 'Agent 02', status: 'Active', expiryOn: '2025-04-01', purchaseOn: '2024-04-01', pricing: '$20', autoRenew: true, billingCycle: 'Monthly' },
        { name: 'Agent 03', status: 'Inactive', expiryOn: '2024-08-01', purchaseOn: '2023-08-01', pricing: '$13', autoRenew: false, billingCycle: 'Yearly' },
        { name: 'Agent 04', status: 'Active', expiryOn: '2025-05-01', purchaseOn: '2024-05-01', pricing: '$11', autoRenew: true, billingCycle: 'Monthly' },
        { name: 'Agent 05', status: 'Active', expiryOn: '2025-06-01', purchaseOn: '2024-06-01', pricing: '$17', autoRenew: true, billingCycle: 'Monthly' }
      ]
    },
    {
      name: 'Testing Agent',
      noOfAgents: 12,
      nextBillEstimate: 600,
      paymentDue: '2024-11-01',
      expanded: false,
      currentPage: 1,
      subAgents: [
        { name: 'Agent 01', status: 'Active', expiryOn: '2025-03-01', purchaseOn: '2024-03-01', pricing: '$18', autoRenew: true, billingCycle: 'Monthly' },
        { name: 'Agent 02', status: 'Active', expiryOn: '2025-04-01', purchaseOn: '2024-04-01', pricing: '$20', autoRenew: true, billingCycle: 'Monthly' },
        { name: 'Agent 03', status: 'Inactive', expiryOn: '2024-08-01', purchaseOn: '2023-08-01', pricing: '$13', autoRenew: false, billingCycle: 'Yearly' },
        { name: 'Agent 04', status: 'Active', expiryOn: '2025-05-01', purchaseOn: '2024-05-01', pricing: '$11', autoRenew: true, billingCycle: 'Monthly' },
        { name: 'Agent 05', status: 'Active', expiryOn: '2025-06-01', purchaseOn: '2024-06-01', pricing: '$17', autoRenew: true, billingCycle: 'Monthly' }
      ]
    },
  ];

  itemsPerPage = 4;

  constructor() {}

  ngOnInit(): void {}

  toggleAccordion(agent: any) {
    agent.expanded = !agent.expanded;
  }

  selectAll(agent: any) {
    const isAllSelected = agent.subAgents.every((subAgent: any) => subAgent.selected);
    agent.subAgents.forEach((subAgent: any) => subAgent.selected = !isAllSelected);
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

}

