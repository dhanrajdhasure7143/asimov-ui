import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { PredefinedBotsService } from '../../services/predefined-bots.service';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { toastMessages } from 'src/app/shared/model/toast_messages';
import {SkeletonModule} from 'primeng/skeleton';
import { RestApiService } from '../../services/rest-api.service';
import { StripeService } from 'ngx-stripe';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { CryptoService } from '../../services/crypto.service';
import { AiAgentAddAgentsDialogComponent } from '../ai-agent-add-agents-dialog/ai-agent-add-agents-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-ai-agent-home-screen',
  templateUrl: './ai-agent-home-screen.component.html',
  styleUrls: ['./ai-agent-home-screen.component.css']
})
export class AiAgentHomeScreenComponent implements OnInit {
  @ViewChild('addAgentsDialog') addAgentsDialog: AiAgentAddAgentsDialogComponent;

  predefined_botsList: any[] = [];
  filteredBotsList: any[] = [];
  searchTerm: string = '';
  unsubscribed_agents:any[]=[];
  unsubscribed_agent_ids:any[]=[];
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
  isHovered: boolean = false;
  botPlans:any[]=[];
  totalAiAgents:any[]=[];
  unfilteredAgentsList:any[]=[];
  isOpenEnterprice = false;
  isOpenThankyou = false;
  isOpensuccessDialog = false;
  userEmail : any;
  enterPrise_plan:any={};
  enterpriseFeatures = [];
  isAddedAgentsPopup = false;
  showContactUs: boolean = false;
  contactForm: FormGroup;
  messageTooShort: boolean = true;

  constructor(private router: Router,
    private spinner: LoaderService,
    private rest_api: PredefinedBotsService,
    private toaster: ToasterService,
    private toastMessage: toastMessages,
    private rest_api_service:RestApiService,
    private stripeService: StripeService,
    private toastService: ToasterService,
    private crypto: CryptoService,
    private fb: FormBuilder,
) {
      this.userEmail = localStorage.getItem('ProfileuserId');
     }

  ngOnInit(): void {
    this.getPredefinedBotsList();
    this.contactForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      userEmail: [''],
      message: ['', Validators.required]
    });
  }

  getPredefinedBotsList() {
    this.spinner.show();
    this.rest_api.getPredefinedBotsList().subscribe((res: any) => {
      this.totalAiAgents = res.data;
        res.data.forEach(bot => {
            const botDetails = {
                ...bot,
                details: bot.description || 'No Description Found',
                isHovered: false
            };
            if (bot.subscribed) {
                this.predefined_botsList.push(botDetails);
            } else {
                // this.unsubscribed_agents.push(botDetails);
                this.unsubscribed_agent_ids.push(botDetails.productId);
                // this.filteredBotsList.push(botDetails);
            }
        });
        this.showSkeleton=!this.showSkeleton
        this.loadAiAgentBots();
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
    this.unsubscribed_agents = [...this.unfilteredAgentsList];
console.log("this.unsubscribed_agents",this.unsubscribed_agents)
    if (this.searchTerm.trim() !== '') {
      this.unsubscribed_agents = this.unsubscribed_agents.filter(each =>
        each.name.toLowerCase().includes(this.searchTerm.toLowerCase())
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
    event.stopPropagation(); // Prevent the click from bubbling up to the parent elements
    this.selectedAgent = agent;
    this.displayAddAgentDialog = true;
  }

  onDialogHide() {
    this.displayAddAgentDialog = false;
    this.isAddedAgentsPopup = true;
    if (this.addAgentsDialog) {
      this.addAgentsDialog.onClose();
    }
  }
  
  closeDialogFromChild() {
    this.onDialogHide();
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
      // this.spinner.show();
    
      let validPlans = this.selectedPlans.filter(plan => plan.quantity > 0);
      console.log("selectedPlans",validPlans)
      
      // Extract the selectedTire values
    let tireTypes = validPlans.map(plan => plan.selectedTire);
    
    // Check if both "Monthly" and "Yearly" are present
    let hasMonthly = tireTypes.includes("Monthly");
    let hasYearly = tireTypes.includes("Yearly");
    
    if (hasMonthly && hasYearly) {
      this.toaster.showError("Please select all agents of the same interval type.");
      this.spinner.hide();
      return;
    }
    
      // let selectedInterval = (this.selectedPlan === 'Monthly') ? 'month' : 'year';
      let filteredPriceIds = [];
    
      validPlans.forEach((element) => {
        let selectedTire =element.selectedTire=== 'Monthly' ? 'month' : 'year'
        element.priceCollection.forEach((price) => {
          if (price.recurring.interval === selectedTire) {
            let obj = {};
            obj["id"] = price.id;
            obj["quantity"] = element.quantity;
            filteredPriceIds.push(obj);
          }
        });
      });
    
    
      if (filteredPriceIds.length === 0) {
        // Handle the case when no price is selected for the chosen interval
        console.error('No price selected for the chosen interval.');
        this.spinner.hide();
        return;
      }
      
      localStorage.setItem('selectedPlans', JSON.stringify(validPlans));
      localStorage.setItem('selectedInterval', this.selectedPlan);
      let req_body = {
        // "price": filteredPriceIds,
        "priceData": filteredPriceIds.map(price => ({
          "price": price.id,
          "quantity": price.quantity
        })),
        "customerEmail": this.userEmail,
        "successUrl": environment.paymentSuccessURL,
        // "cancelUrl": environment.paymentFailuerURL+"?token="+this.crypto.encrypt(this.userEmail)
        "cancelUrl": environment.paymentFailuerURL
      };
      console.log("PLAN_ID's", req_body);
      this.rest_api.getCheckoutScreen(req_body).pipe(
          switchMap((session: any) => {
          this.spinner.hide();
            return this.stripeService.redirectToCheckout({ sessionId: session.id });
          })
        ).subscribe(
          res => {
            this.spinner.hide();
          },error => {
            this.spinner.hide();
            console.error('Error during payment:', error);
          }
        );
    
  }

  getTotalPrice(): number {
    return this.getTotalSelectedAgents() * 10; // Assuming $10 per agent
  }

  onSelectPredefinedBot(plan:any, index) {
    plan.quantity = 1
    console.log("Selected Plan:", plan)
    this.selectedPlans = [];
    this.unsubscribed_agents[index].isSelected = !this.unsubscribed_agents[index].isSelected;
    this.isDisabled = this.unsubscribed_agents.every(item => !item.isSelected);
    this.unsubscribed_agents.forEach(item => {
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

  loadAiAgentBots() {
    this.rest_api.getPlansList().subscribe((response: any) => {
        this.spinner.hide();
        if (response) {
            response.forEach(element => {
                let obj = element.product;
                let isSubscribed=false;
                let isYearlySubscribed=false;
                let isMonthlySubscribed=false;
                obj["priceCollection"] = element.priceCollection;
                let data = element.product.metadata?.product_features ? element.product.metadata.product_features : [];
                // let features = data ? JSON.parse(data) : [];
                obj["isYearlySubscribed"] = isYearlySubscribed;
                obj["isMonthlySubscribed"] = isMonthlySubscribed;
                obj["doPlanDisabled"] = isSubscribed;
                obj['quantity'] = 0
                obj['showAllSpecs']=false
                obj['selectedTire']='Yearly'
                this.botPlans.push(obj);
            });

            this.enterPrise_plan= this.botPlans.find((element) => { return element.name == "Enterprise"});
            this.enterpriseFeatures = JSON.parse(this.enterPrise_plan.metadata.product_features);

            this.unsubscribed_agent_ids.forEach((id) => {
              if(this.botPlans.find((bot) => bot.id == id)){
                let obj = this.botPlans.find((bot) => bot.id == id);
                obj["isHovered"] = false;
                // obj["description"] = this.totalAiAgents.find((bot) => bot.productId == id).description;
                this.unfilteredAgentsList.push(obj);
                this.unsubscribed_agents = this.unfilteredAgentsList
              }
            });
            console.log("unsubscribed_agents",this.unsubscribed_agents);
        }
    }, err => {
        this.spinner.hide();
        this.toaster.showError(this.toastMessage.apierror);
    });
}

proceedToSubscribe() {
  this.spinner.show();
  let selectedInterval = (this.selectedPlan === 'Monthly') ? 'month' : 'year';
  let filteredPriceIds = [];
  this.selectedPlans.forEach((element) => {
    element.priceCollection.forEach((price) => {
      if (price.recurring.interval === selectedInterval) {
        let obj={}
        obj["id"]=price.id
        obj["quantity"]=element.quantity
        filteredPriceIds.push(obj);
      }
    });
  });

  if (filteredPriceIds.length === 0) {
    // Handle the case when no price is selected for the chosen interval
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
    "customerEmail": localStorage.getItem('ProfileuserId'),
    "successUrl": environment.paymentSuccessURL,
    "cancelUrl": environment.paymentFailuerURL,
    // "paymentMethodId": this.selectedCard,
  };

  
  this.rest_api.getCheckoutScreen(req_body).pipe(
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

  showEnterpriceModel(){
    this.isOpenEnterprice = !this.isOpenEnterprice;
  }

  showThankyouModal() {
    this.isOpenEnterprice = false
    this.isOpenThankyou = !this.isOpenThankyou
  }

  popUpHider (value) {
    this.isAddedAgentsPopup = false;
    if (value === 'Navigate') {
      this.onclickBot(this.selectedAgent);
    }
  }
  
  showPopupDailogue() {
    this.isPopupVisible = true;
  }

  hidePopupDailogue() {
    this.isPopupVisible = false;
  }

  closePopup(){
    this.isOpenEnterprice = false;
    this.isOpensuccessDialog = false;
  }

  sendEmailEnterPrisePlan(){
    this.spinner.show();
    this.rest_api.sendEmailEntrepricePlan(this.userEmail).subscribe((res : any)=>{
      if(res.errorMessage !="User not present"){
        this.isOpensuccessDialog = true;
        this.isOpenEnterprice = false
        this.isOpenThankyou = !this.isOpenThankyou
      }
        this.spinner.hide();
    },err=>{
      Swal.fire("Error","Failed to send","error")
      this.spinner.hide();
      this.isOpensuccessDialog = true;
      this.isOpenEnterprice = false
      this.isOpenThankyou = !this.isOpenThankyou
    })
  }

  navigateToPurchaseAgent(plan){
    console.log("plan",plan)
    let emailToken= this.crypto.encrypt(localStorage.getItem('ProfileuserId'));

    if(plan.name =="RFP"){
      this.router.navigate(['/pages/aiagent/subscription/rfp'], { queryParams: { token: emailToken,id:plan.id } });
      return
      }
    if(plan.name =="Developer Agent"){
      this.router.navigate(['/pages/aiagent/subscription/dev'], { queryParams: { token: emailToken,id:plan.id } });
      return
    }
    if(plan.name =="Recruitment"){
      this.router.navigate(['/pages/aiagent/subscription/recruitment'], { queryParams: { token: emailToken,id:plan.id } });
      return
    }
    if(plan.name == "Customer Support"){
      this.router.navigate(['/pages/aiagent/subscription/chatbot'], { queryParams: { token: emailToken,id:plan.id } });
      return
    }
    if(plan.name =="Testing Agent"){
      this.router.navigate(['/pages/aiagent/subscription/testing'], { queryParams: { token:emailToken,id:plan.id } });
      return
    }
    if(plan.name =="Marketing"){
      this.router.navigate(['/pages/aiagent/subscription/marketing'], { queryParams: { token: emailToken,id:plan.id } });
      return
    }

    this.router.navigate(['/subscription/recruitment'], { queryParams: { token: emailToken,id:plan.id } });
  }

  getBotURL(item){
    if(item.predefinedBotName == 'Recruitment'){
      return 'https://epsoft.ai/pages/recruitment.html';
    }
    if(item.predefinedBotName == 'Marketing'){
      return 'https://epsoft.ai/pages/marketing.html';
    }
    if(item.predefinedBotName == 'RFP'){
      return 'https://epsoft.ai/pages/rfp.html';
    }
    if(item.predefinedBotName == 'Customer Support'){
      return 'https://epsoft.ai/pages/customer-support.html';
    }
    if(item.predefinedBotName == 'Developer'){
      return 'https://epsoft.ai/pages/developer.html';
    }
    if(item.predefinedBotName == 'Testing'){
      return 'https://epsoft.ai/pages/testing.html';
    }

    return 'https://epsoft.ai/pages/recruitment.html';

  } 
  showDialog() {
    this.showContactUs = true;
    this.messageTooShort = true;
  }

  resetForm() {
    this.contactForm.reset()
  }

  contactUs() {
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    const userEmail = localStorage.getItem('ProfileuserId');
    this.contactForm.patchValue({
      firstName: firstName,
      lastName: lastName,
      userEmail: userEmail
    });
    this.spinner.show();
      const payload = this.contactForm.value;
      this.rest_api.contactUs(payload).subscribe((response: any) => {
        this.spinner.hide();
        if (response.code == 4200) {
          this.toastService.showSuccess(this.toastMessage.contactUsSuccess, 'response')
          this.showContactUs = false;
        } else {
          this.toastService.showError(this.toastMessage.contactUsError)
        }
      }, error => {
        this.spinner.hide();
        this.toastService.showError(this.toastMessage.apierror)
      });
  }
  onMessageInput() {
    const message = this.contactForm.get('message').value || '';
    this.messageTooShort = message.length < 150;
  }
}
