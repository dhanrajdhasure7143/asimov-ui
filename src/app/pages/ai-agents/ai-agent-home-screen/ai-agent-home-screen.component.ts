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
  selector: 'app-ai-agent-home-screen',
  templateUrl: './ai-agent-home-screen.component.html',
  styleUrls: ['./ai-agent-home-screen.component.css']
})
export class AiAgentHomeScreenComponent implements OnInit {

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
  selectedPlan: string = 'Yearly';
  isDisabled : boolean = true;
  totalAmount : number = 0;
  isPopupVisible = false;

  botPlans : any[] = [
    {
        "lastResponse": null,
        "rawJsonObject": null,
        "active": true,
        "created": 1722841645,
        "defaultPrice": "price_1PkL0sJZCEXZ8ZrcFmSrrmtH",
        "deleted": null,
        "description": null,
        "id": "prod_QbY7q8db8Hj3XC",
        "images": [],
        "livemode": false,
        "marketingFeatures": [],
        "metadata": {
            "product_features": "[\"Resource Optimization\", \"Parallel Processing\", \"User Role-Based Access Control\"]"
        },
        "name": "RFP",
        "object": "product",
        "packageDimensions": null,
        "shippable": null,
        "statementDescriptor": null,
        "taxCode": "txcd_10103001",
        "type": "service",
        "unitLabel": null,
        "updated": 1722841718,
        "url": null,
        "defaultPriceObject": null,
        "taxCodeObject": null,
        "priceCollection": [
            {
                "lastResponse": null,
                "rawJsonObject": null,
                "active": true,
                "billingScheme": "per_unit",
                "created": 1722841675,
                "currency": "usd",
                "currencyOptions": null,
                "customUnitAmount": null,
                "deleted": null,
                "id": "price_1PkL1LJZCEXZ8ZrcKklUHAFS",
                "livemode": false,
                "lookupKey": null,
                "metadata": {},
                "nickname": null,
                "object": "price",
                "product": "prod_QbY7q8db8Hj3XC",
                "recurring": {
                    "lastResponse": null,
                    "rawJsonObject": null,
                    "aggregateUsage": null,
                    "interval": "year",
                    "intervalCount": 1,
                    "meter": null,
                    "trialPeriodDays": null,
                    "usageType": "licensed"
                },
                "taxBehavior": "unspecified",
                "tiers": null,
                "tiersMode": "year",
                "transformQuantity": null,
                "type": "recurring",
                "unitAmount": 115,
                "unitAmountDecimal": 115,
                "productObject": null,
                "isPlanSubscribed": false
            },
            {
                "lastResponse": null,
                "rawJsonObject": null,
                "active": true,
                "billingScheme": "per_unit",
                "created": 1722841646,
                "currency": "usd",
                "currencyOptions": null,
                "customUnitAmount": null,
                "deleted": null,
                "id": "price_1PkL0sJZCEXZ8ZrcFmSrrmtH",
                "livemode": false,
                "lookupKey": null,
                "metadata": {},
                "nickname": null,
                "object": "price",
                "product": "prod_QbY7q8db8Hj3XC",
                "recurring": {
                    "lastResponse": null,
                    "rawJsonObject": null,
                    "aggregateUsage": null,
                    "interval": "month",
                    "intervalCount": 1,
                    "meter": null,
                    "trialPeriodDays": null,
                    "usageType": "licensed"
                },
                "taxBehavior": "unspecified",
                "tiers": null,
                "tiersMode": "month",
                "transformQuantity": null,
                "type": "recurring",
                "unitAmount": 10,
                "unitAmountDecimal": 10,
                "productObject": null,
                "isPlanSubscribed": false
            }
        ],
        "features": [
            "Resource Optimization",
            "Parallel Processing",
            "User Role-Based Access Control"
        ],
        "image": "data:image/jpeg;base64,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",
        "isYearlySubscribed": false,
        "isMonthlySubscribed": false,
        "doPlanDisabled": false,
        "quantity": 0,
        "showAllSpecs": false,
        "selectedTire": "Yearly"
    },
    {
        "lastResponse": null,
        "rawJsonObject": null,
        "active": true,
        "created": 1722837159,
        "defaultPrice": "price_1PkJqWJZCEXZ8ZrcUYyzMgF8",
        "deleted": null,
        "description": null,
        "id": "prod_QbWuRYn93ySWJm",
        "images": [],
        "livemode": false,
        "marketingFeatures": [],
        "metadata": {
            "product_features": "[\"Resource Optimization\", \"Parallel Processing\", \"User Role-Based Access Control\"]"
        },
        "name": "Testing Agent",
        "object": "product",
        "packageDimensions": null,
        "shippable": null,
        "statementDescriptor": null,
        "taxCode": "txcd_10103001",
        "type": "service",
        "unitLabel": null,
        "updated": 1722837181,
        "url": null,
        "defaultPriceObject": null,
        "taxCodeObject": null,
        "priceCollection": [
            {
                "lastResponse": null,
                "rawJsonObject": null,
                "active": true,
                "billingScheme": "per_unit",
                "created": 1722837202,
                "currency": "usd",
                "currencyOptions": null,
                "customUnitAmount": null,
                "deleted": null,
                "id": "price_1PkJrCJZCEXZ8Zrcv2oHlhyM",
                "livemode": false,
                "lookupKey": null,
                "metadata": {},
                "nickname": null,
                "object": "price",
                "product": "prod_QbWuRYn93ySWJm",
                "recurring": {
                    "lastResponse": null,
                    "rawJsonObject": null,
                    "aggregateUsage": null,
                    "interval": "year",
                    "intervalCount": 1,
                    "meter": null,
                    "trialPeriodDays": null,
                    "usageType": "licensed"
                },
                "taxBehavior": "unspecified",
                "tiers": null,
                "tiersMode": "year",
                "transformQuantity": null,
                "type": "recurring",
                "unitAmount": 120,
                "unitAmountDecimal": 120,
                "productObject": null,
                "isPlanSubscribed": false
            },
            {
                "lastResponse": null,
                "rawJsonObject": null,
                "active": true,
                "billingScheme": "per_unit",
                "created": 1722837160,
                "currency": "usd",
                "currencyOptions": null,
                "customUnitAmount": null,
                "deleted": null,
                "id": "price_1PkJqWJZCEXZ8ZrcUYyzMgF8",
                "livemode": false,
                "lookupKey": null,
                "metadata": {},
                "nickname": null,
                "object": "price",
                "product": "prod_QbWuRYn93ySWJm",
                "recurring": {
                    "lastResponse": null,
                    "rawJsonObject": null,
                    "aggregateUsage": null,
                    "interval": "month",
                    "intervalCount": 1,
                    "meter": null,
                    "trialPeriodDays": null,
                    "usageType": "licensed"
                },
                "taxBehavior": "unspecified",
                "tiers": null,
                "tiersMode": "month",
                "transformQuantity": null,
                "type": "recurring",
                "unitAmount": 12,
                "unitAmountDecimal": 12,
                "productObject": null,
                "isPlanSubscribed": false
            }
        ],
        "features": [
            "Resource Optimization",
            "Parallel Processing",
            "User Role-Based Access Control"
        ],
        "image": "data:image/jpeg;base64,null",
        "isYearlySubscribed": false,
        "isMonthlySubscribed": false,
        "doPlanDisabled": false,
        "quantity": 0,
        "showAllSpecs": false,
        "selectedTire": "Yearly"
    },
    {
        "lastResponse": null,
        "rawJsonObject": null,
        "active": true,
        "created": 1722837092,
        "defaultPrice": "price_1PkJpRJZCEXZ8Zrccu6T22Mt",
        "deleted": null,
        "description": null,
        "id": "prod_QbWtvV9TUgG6Xw",
        "images": [],
        "livemode": false,
        "marketingFeatures": [],
        "metadata": {
            "product_features": "[\"Resource Optimization\", \"Parallel Processing\", \"User Role-Based Access Control\"]"
        },
        "name": "Developer Agent",
        "object": "product",
        "packageDimensions": null,
        "shippable": null,
        "statementDescriptor": null,
        "taxCode": "txcd_10103001",
        "type": "service",
        "unitLabel": null,
        "updated": 1722837134,
        "url": null,
        "defaultPriceObject": null,
        "taxCodeObject": null,
        "priceCollection": [
            {
                "lastResponse": null,
                "rawJsonObject": null,
                "active": true,
                "billingScheme": "per_unit",
                "created": 1722837117,
                "currency": "usd",
                "currencyOptions": null,
                "customUnitAmount": null,
                "deleted": null,
                "id": "price_1PkJppJZCEXZ8ZrcEHVgIvgQ",
                "livemode": false,
                "lookupKey": null,
                "metadata": {},
                "nickname": null,
                "object": "price",
                "product": "prod_QbWtvV9TUgG6Xw",
                "recurring": {
                    "lastResponse": null,
                    "rawJsonObject": null,
                    "aggregateUsage": null,
                    "interval": "year",
                    "intervalCount": 1,
                    "meter": null,
                    "trialPeriodDays": null,
                    "usageType": "licensed"
                },
                "taxBehavior": "unspecified",
                "tiers": null,
                "tiersMode": "year",
                "transformQuantity": null,
                "type": "recurring",
                "unitAmount": 110,
                "unitAmountDecimal": 110,
                "productObject": null,
                "isPlanSubscribed": false
            },
            {
                "lastResponse": null,
                "rawJsonObject": null,
                "active": true,
                "billingScheme": "per_unit",
                "created": 1722837093,
                "currency": "usd",
                "currencyOptions": null,
                "customUnitAmount": null,
                "deleted": null,
                "id": "price_1PkJpRJZCEXZ8Zrccu6T22Mt",
                "livemode": false,
                "lookupKey": null,
                "metadata": {},
                "nickname": null,
                "object": "price",
                "product": "prod_QbWtvV9TUgG6Xw",
                "recurring": {
                    "lastResponse": null,
                    "rawJsonObject": null,
                    "aggregateUsage": null,
                    "interval": "month",
                    "intervalCount": 1,
                    "meter": null,
                    "trialPeriodDays": null,
                    "usageType": "licensed"
                },
                "taxBehavior": "unspecified",
                "tiers": null,
                "tiersMode": "month",
                "transformQuantity": null,
                "type": "recurring",
                "unitAmount": 12,
                "unitAmountDecimal": 12,
                "productObject": null,
                "isPlanSubscribed": false
            }
        ],
        "features": [
            "Resource Optimization",
            "Parallel Processing",
            "User Role-Based Access Control"
        ],
        "image": "data:image/jpeg;base64,null",
        "isYearlySubscribed": false,
        "isMonthlySubscribed": false,
        "doPlanDisabled": false,
        "quantity": 0,
        "showAllSpecs": false,
        "selectedTire": "Yearly"
    },
    {
        "lastResponse": null,
        "rawJsonObject": null,
        "active": true,
        "created": 1722836915,
        "defaultPrice": "price_1PkJmaJZCEXZ8ZrcbTVuWytf",
        "deleted": null,
        "description": null,
        "id": "prod_QbWqFiBJb6rMpb",
        "images": [],
        "livemode": false,
        "marketingFeatures": [],
        "metadata": {
            "product_features": "[\"Resource Optimization\", \"Parallel Processing\", \"User Role-Based Access Control\"]"
        },
        "name": "Marketing",
        "object": "product",
        "packageDimensions": null,
        "shippable": null,
        "statementDescriptor": null,
        "taxCode": "txcd_10103001",
        "type": "service",
        "unitLabel": null,
        "updated": 1722836980,
        "url": null,
        "defaultPriceObject": null,
        "taxCodeObject": null,
        "priceCollection": [
            {
                "lastResponse": null,
                "rawJsonObject": null,
                "active": true,
                "billingScheme": "per_unit",
                "created": 1722836953,
                "currency": "usd",
                "currencyOptions": null,
                "customUnitAmount": null,
                "deleted": null,
                "id": "price_1PkJnBJZCEXZ8Zrc7Y5lPz9J",
                "livemode": false,
                "lookupKey": null,
                "metadata": {},
                "nickname": null,
                "object": "price",
                "product": "prod_QbWqFiBJb6rMpb",
                "recurring": {
                    "lastResponse": null,
                    "rawJsonObject": null,
                    "aggregateUsage": null,
                    "interval": "year",
                    "intervalCount": 1,
                    "meter": null,
                    "trialPeriodDays": null,
                    "usageType": "licensed"
                },
                "taxBehavior": "unspecified",
                "tiers": null,
                "tiersMode": "year",
                "transformQuantity": null,
                "type": "recurring",
                "unitAmount": 100,
                "unitAmountDecimal": 100,
                "productObject": null,
                "isPlanSubscribed": false
            },
            {
                "lastResponse": null,
                "rawJsonObject": null,
                "active": true,
                "billingScheme": "per_unit",
                "created": 1722836916,
                "currency": "usd",
                "currencyOptions": null,
                "customUnitAmount": null,
                "deleted": null,
                "id": "price_1PkJmaJZCEXZ8ZrcbTVuWytf",
                "livemode": false,
                "lookupKey": null,
                "metadata": {},
                "nickname": null,
                "object": "price",
                "product": "prod_QbWqFiBJb6rMpb",
                "recurring": {
                    "lastResponse": null,
                    "rawJsonObject": null,
                    "aggregateUsage": null,
                    "interval": "month",
                    "intervalCount": 1,
                    "meter": null,
                    "trialPeriodDays": null,
                    "usageType": "licensed"
                },
                "taxBehavior": "unspecified",
                "tiers": null,
                "tiersMode": "month",
                "transformQuantity": null,
                "type": "recurring",
                "unitAmount": 12,
                "unitAmountDecimal": 12,
                "productObject": null,
                "isPlanSubscribed": false
            }
        ],
        "features": [
            "Resource Optimization",
            "Parallel Processing",
            "User Role-Based Access Control"
        ],
        "image": "data:image/jpeg;base64,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",
        "isYearlySubscribed": false,
        "isMonthlySubscribed": false,
        "doPlanDisabled": false,
        "quantity": 0,
        "showAllSpecs": false,
        "selectedTire": "Yearly"
    },
    {
        "lastResponse": null,
        "rawJsonObject": null,
        "active": true,
        "created": 1722836821,
        "defaultPrice": "price_1PkJl4JZCEXZ8Zrcfuoa6vIP",
        "deleted": null,
        "description": null,
        "id": "prod_QbWoZ18c7BApMK",
        "images": [],
        "livemode": false,
        "marketingFeatures": [],
        "metadata": {
            "product_features": "[\"Resource Optimization\", \"Parallel Processing\", \"User Role-Based Access Control\"]"
        },
        "name": "Recruitment",
        "object": "product",
        "packageDimensions": null,
        "shippable": null,
        "statementDescriptor": null,
        "taxCode": "txcd_10103001",
        "type": "service",
        "unitLabel": null,
        "updated": 1722836873,
        "url": null,
        "defaultPriceObject": null,
        "taxCodeObject": null,
        "priceCollection": [
            {
                "lastResponse": null,
                "rawJsonObject": null,
                "active": true,
                "billingScheme": "per_unit",
                "created": 1722836852,
                "currency": "usd",
                "currencyOptions": null,
                "customUnitAmount": null,
                "deleted": null,
                "id": "price_1PkJlYJZCEXZ8Zrccd8bdgKy",
                "livemode": false,
                "lookupKey": null,
                "metadata": {},
                "nickname": null,
                "object": "price",
                "product": "prod_QbWoZ18c7BApMK",
                "recurring": {
                    "lastResponse": null,
                    "rawJsonObject": null,
                    "aggregateUsage": null,
                    "interval": "year",
                    "intervalCount": 1,
                    "meter": null,
                    "trialPeriodDays": null,
                    "usageType": "licensed"
                },
                "taxBehavior": "unspecified",
                "tiers": null,
                "tiersMode": "year",
                "transformQuantity": null,
                "type": "recurring",
                "unitAmount": 95,
                "unitAmountDecimal": 95,
                "productObject": null,
                "isPlanSubscribed": false
            },
            {
                "lastResponse": null,
                "rawJsonObject": null,
                "active": true,
                "billingScheme": "per_unit",
                "created": 1722836822,
                "currency": "usd",
                "currencyOptions": null,
                "customUnitAmount": null,
                "deleted": null,
                "id": "price_1PkJl4JZCEXZ8Zrcfuoa6vIP",
                "livemode": false,
                "lookupKey": null,
                "metadata": {},
                "nickname": null,
                "object": "price",
                "product": "prod_QbWoZ18c7BApMK",
                "recurring": {
                    "lastResponse": null,
                    "rawJsonObject": null,
                    "aggregateUsage": null,
                    "interval": "month",
                    "intervalCount": 1,
                    "meter": null,
                    "trialPeriodDays": null,
                    "usageType": "licensed"
                },
                "taxBehavior": "unspecified",
                "tiers": null,
                "tiersMode": "month",
                "transformQuantity": null,
                "type": "recurring",
                "unitAmount": 10,
                "unitAmountDecimal": 10,
                "productObject": null,
                "isPlanSubscribed": false
            }
        ],
        "features": [
            "Resource Optimization",
            "Parallel Processing",
            "User Role-Based Access Control"
        ],
        "image": "data:image/jpeg;base64,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",
        "isYearlySubscribed": false,
        "isMonthlySubscribed": false,
        "doPlanDisabled": false,
        "quantity": 0,
        "showAllSpecs": false,
        "selectedTire": "Yearly"
    }
];

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

  onSelectPredefinedBot(plan:any, index) {
    plan.quantity = 1
    console.log("Selected Plan:", plan)
    this.selectedPlans = [];
    this.botPlans[index].isSelected = !this.botPlans[index].isSelected;
    this.isDisabled = this.botPlans.every(item => !item.isSelected);
    this.botPlans.forEach(item => {
      if (item.isSelected) {
        this.selectedPlans.push(item);
      }
    })
    this.isDisabled = this.selectedPlans.length === 0;
    this.planSelection(this.selectedPlan);
  }

  planSelection(interval: string) {

    let plansData = [];
    this.selectedPlans.forEach((item) => {
    let selectedInterval = (item.selectedTire === 'Monthly') ? 'month' : 'year';

    item.priceCollection.forEach((price) => {
        if (price.recurring.interval === selectedInterval) {
          plansData.push(price.unitAmount*Number(item.quantity));
        }
      });
    });

    console.log(plansData)
    this.totalAmount = plansData.reduce((sum, amount) => sum + amount, 0);
    console.log("Toal Fone Amount : ", this.totalAmount);
  }

  incrementQuantity(plan: any, index) {
    plan.quantity++;
    const selectedPlan = this.selectedPlans.find(sp => sp.id === plan.id);
    if (!plan.isSelected) {
      this.onSelectPredefinedBot(plan,index);  
    }
    if (selectedPlan) {
      selectedPlan.quantity = plan.quantity;
    }
    console.log("selectedPlan",this.selectedPlan)
    this.planSelection(plan.selectedTire)
  }

  decrementQuantity(plan: any, index) {
      if (plan.quantity >= 1) {
          plan.quantity--;
      const selectedPlan = this.selectedPlans.find(sp => sp.id === plan.id);
      if (!plan.isSelected) {
        this.onSelectPredefinedBot(plan,index);
      }

      if (selectedPlan) {
        selectedPlan.quantity = plan.quantity;
      }
      
      this.planSelection(this.selectedPlan)
      }
  }

  formatFeatures(features: string[]): string {
    if (!features || features.length === 0) {
      return '';
    }
    if (features.length === 1) {
      return features[0];
    }
    const all_word = features.slice(0, -1).join(', ');
    const last_word = features[features.length - 1];
    return `${all_word} and ${last_word}`;
  }

  changePlan(tire,plan) {
    console.log(`Selected plan: ${tire}`,plan);
    plan.selectedTire= tire=='monthly' ? "Monthly" : "Yearly";
    this.planSelection(plan.selectedTire)
    console.log(this.selectedPlans)
  }

  showPopup() {
    this.isPopupVisible = true;
  }

  hidePopup() {
    this.isPopupVisible = false;
  }
}
