import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { PredefinedBotsService } from '../../services/predefined-bots.service';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { toastMessages } from 'src/app/shared/model/toast_messages';
import {SkeletonModule} from 'primeng/skeleton';
import { RestApiService } from '../../services/rest-api.service';
import { StripeService } from 'ngx-stripe';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-ai-agent-home',
  templateUrl: './ai-agent-home.component.html',
  styleUrls: ['./ai-agent-home.component.css']
})
export class AiAgentHomeComponent implements OnInit {
  predefined_botsList: any[] = [];
  filteredBotsList: any[] = [];
  searchTerm: string = '';
  unsubscribed_agents:any[]=[];
  displayModal: boolean = false;
  selectedBot: any;
  showSkeleton:boolean = true;
  displayAddAgentDialog: boolean = false;
  selectedAgent: any;
  yearlyPricing: boolean = false;
  agentCount: number = 1;
  selectedPlans:any=[];
  selectedPlan: string = 'Monthly';

  constructor(private router: Router,
    private spinner: LoaderService,
    private rest_api: PredefinedBotsService,
    private toaster: ToasterService,
    private toastMessage: toastMessages,
    private rest_api_service:RestApiService,
    private stripeService: StripeService,
    private toastService: ToasterService,) { }

  ngOnInit(): void {
    this.getPredefinedBotsList();
  }

  getPredefinedBotsList() {
    this.spinner.show();
    this.rest_api.getPredefinedBotsList().subscribe((res: any) => {
        res.data.forEach(bot => {
            const botDetails = {
                ...bot,
                details: bot.description || 'No Description Found'
            };
            if (bot.subscribed) {
                this.predefined_botsList.push(botDetails);
            } else {
                this.unsubscribed_agents.push(botDetails)
                this.filteredBotsList.push(botDetails);
            }
            
        });
        this.showSkeleton=!this.showSkeleton
        this.spinner.hide();
    }, err => {
        this.spinner.hide();
        this.toaster.showError(this.toastMessage.apierror);
    });
}

  onclickBot(item) {
    // this.router.navigate(["/pages/aiagent/forms"], { queryParams: { type: "create", id: item.productId} });
    // this.router.navigate(['/pages/aiagent/details'], { state: { bot: item } });
    // this.router.navigate(['/pages/aiagent/details'],{ queryParams: { id: item.productId } });
    this.router.navigate(['/pages/aiagent/sub-agents'],{ queryParams: { id: item.productId, botName: item.predefinedBotName } });
  }

  onSearch(): void {
    this.filteredBotsList = [...this.unsubscribed_agents];

    if (this.searchTerm.trim() !== '') {
      this.filteredBotsList = this.filteredBotsList.filter(bot =>
        bot.predefinedBotName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  onclickBot2(item): void {
    // this.router.navigate(['/pages/aiagent/predefinedconfig'], { state: { bot: item } });
    this.router.navigate(['/pages/aiagent/predefinedconfig'],  { queryParams: { type: "create", id: item.productId, name: item.predefinedBotName, desc: item.details, isVisible:"true" } });
  }

  onclickBot3(item): void {
    // this.router.navigate(['/pages/aiagent/predefinedconfig'], { state: { bot: item } });
    // this.router.navigate(['/pages/aiagent/predefinedconfig'],  { queryParams: { type: "create", id: item.productId, name: item.predefinedBotName, desc: item.details, isVisible:"false" } });
  }

  showMore(event: Event, bot: any) {
    event.stopPropagation();
    this.selectedBot = bot;
    this.displayModal = true;
  }

  closeModal() {
    this.displayModal = false;
  }

  createBot() {
    this.closeModal();
  }

  toggleDetails(event: Event,bot: any, detailsWrapper: HTMLElement) {
    event.stopPropagation();
    bot.showMore = !bot.showMore;

    if (!bot.showMore) {
      setTimeout(() => {
        detailsWrapper.scrollTo({
          top: 0,
          behavior: 'smooth'
      });
      }, 0);
    }
  }

  showAddAgentDialog(event: Event, agent: any) {
    console.log(agent);
    
    event.stopPropagation(); // Prevent the click from bubbling up to the parent elements
    this.selectedAgent = agent;
    this.displayAddAgentDialog = true;
  }

  closeDialog() {
    this.displayAddAgentDialog = false;
  }

  decreaseAgentCount(agent: any) {
    if (agent.selectedCount && agent.selectedCount > 0) {
      agent.selectedCount--;
    }
  }

  increaseAgentCount(agent: any) {
    if (!agent.selectedCount) {
      agent.selectedCount = 0;
    }
    agent.selectedCount++;
  }

  getTotalSelectedAgents(): number {
    return this.unsubscribed_agents.reduce((total, agent) => total + (agent.selectedCount || 0), 0);
  }

  proceedToPay() {
    console.log('Proceeding to pay: $' + this.getTotalPrice().toFixed(2));
  }

  getTotalPrice(): number {
    return this.getTotalSelectedAgents() * 10; // Assuming $10 per agent
  }

}
