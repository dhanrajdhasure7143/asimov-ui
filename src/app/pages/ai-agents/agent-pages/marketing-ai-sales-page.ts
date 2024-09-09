import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StripeService } from 'ngx-stripe';
import { MessageService } from 'primeng/api';
import { switchMap } from 'rxjs/operators';
import { CryptoService } from 'src/app/services/crypto.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { PredefinedBotsService } from '../../services/predefined-bots.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { toastMessages } from 'src/app/shared/model/toast_messages';
import { ToasterService } from 'src/app/shared/service/toaster.service';

@Component({
  selector: 'app-recruitment-ai-sales-page',
  template: `
    <div class="sales-page-container">
      <div class="hero">
        <div class="container">
          <div class="hero-content">
            <div class="hero-text">
              <h1>Boost Your Marketing Efficiency by 5X</h1>
              <p>Automate outreach, Streamline collaboration, and watch your team thrive.</p>
              <ul>
                <li *ngFor="let feature of heroFeatures">{{ feature }}</li>
              </ul>
            </div>
            <div class="hero-pricing">
              <div class="pricing-controls">

              <div class="billing-cycle">
                  <span [class.active]="!isYearly">Monthly</span>
                  <label class="switch">
                    <input type="checkbox" [(ngModel)]="isYearly">
                    <span class="slider round"></span>
                  </label>
                  <span [class.active]="isYearly">Yearly</span>
                </div>
              </div>

                <div class="agents">
                  <label>Select no of Agents</label>
                  <div class='d-flex'>
                    <div class="counter">
                      <button (click)="decrementAgents()">-</button>
                      <span>{{ agentsQuantity }}</span>
                      <button (click)="incrementAgents()">+</button>
                    </div> 
                    <div class='prc-btn'>
                      <button class="btn pay-button rounded-pill" (click)="proceedToPay()">Proceed To Pay</button>
                    </div>
                  </div>

                </div>
                
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="container">
          <h2 class="section-title">Key Features</h2>
          <p class="section-description">The Marketing AI Agent combines the power of generative AI and Robotic  Process Automation (RPA) to automate and enhance your marketing efforts.  This sophisticated tool ensures your marketing activities are  efficient, effective, and tailored to your target audience.</p>
          <div class="grid">
            <div class="card" *ngFor="let feature of keyFeatures">
              <div class="card-image">
                <img [src]="feature.image" [alt]="feature.title">
              </div>
              <div class="card-content">
                <h3>{{ feature.title }}</h3>
                <p>{{ feature.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="section benefits">
        <div class="container">
          <h2 class="section-title1">Benefits</h2>
          <div class="grid-benefits">
            <div class="card icon-card" *ngFor="let benefit of benefits">
              <div class="icon-placeholder icon-placeholder-benefits">
                <img [src]="benefit.icon" [alt]="benefit.title">
              </div>
              <h3>{{ benefit.title }}</h3>
              <p>{{ benefit.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="section how-it-works">
        <div class="container">
          <h2 class="section-title">How Does Our Recruitment AI Agent Work?</h2>
          <div class="grid">
            <div class="card icon-card" *ngFor="let step of workingSteps">
              <div class="icon-placeholder">
                <img [src]="step.icon" [alt]="step.title">
              </div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="cta">
        <div class="container">
          <h2>Unlock Exceptional Talent with Unmatched AI Precision</h2>
          <a href="#" class="btn">Get Started</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    :host {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      display: block;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    .hero {
      background-image: url('/assets/images/agent/sales/marketing-head.png');
      background-size: cover;
      background-position: center;
      color: white;
      padding: 70px 0;
    }
    .agents {
        justify-content: space-between;
        align-items: baseline;
        margin-left: 6px;
    }

    .agents label {
      display: block;
      margin-bottom: 0.5rem;
      color: white;
      font-size: 14px;
    }

    .counter {
      display: flex;
      align-items: center;
      background-color: #f0f0f0;
      width: fit-content;
      border-radius: 5px;
    }
    .counter button {
      background-color: #B1BBC6;
      border: none;
      color: #fff;
      font-size: 18px;
      width: 30px;
      height: 34px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.3s ease;
    }
    .counter button:first-child {
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
    }
    .counter button:last-child {
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
    }
    .counter button:active {
      background-color: #b0b0b0;
    }
    .counter span {
      font-size: 16px;
      color: #333;
      margin: 0 15px;
      min-width: 20px;
      text-align: center;
    }
    :host ::ng-deep.active {
      background-color: transparent !important;
    }
    .hero-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .hero-text {
      flex: 1;
      margin-right: 2rem;
    }
    .hero h1 {
      font-size: 2.8em;
      margin-bottom: 10px;
      font-weight: bold;
    }
    .hero p {
      font-size: 18px;
      margin-bottom: 20px;
    }
    .hero ul {
      list-style-type: none;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0px 30px;
      margin-bottom: 30px;
      width: 620px;
    }
    .hero li {
      display: flex;
      align-items: center;
      font-size: 15px;
      font-weight: bold;
    }
    .hero li:before {
      content: "•";
      color: #4a90e2;
      font-size: 1.5em;
      margin-right: 10px;
    }
    .hero-pricing {
      background-color: #FFFFFF33;
      padding: 1.5rem;
      border-radius: 10px;
      width: 375px;
    }
    .pricing-controls {
      margin-bottom: 1rem;
    }
    .agents {
      margin-bottom: 1rem;
    }
    .agents label {
      display: block;
      margin-bottom: 0.5rem;
      color: white;
    }
    .billing-cycle {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
    }
    .billing-cycle span {
      color: white;
      margin: 0 0.5rem;
    }
    .switch {
      position: relative;
      display: inline-block;
      width: 65px;
      height: 24px;
    }
    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #f0f0f0;
      transition: .4s;
      border-radius: 24px;
    }
    .slider:before {
      position: absolute;
      content: "";
      height: 16px;
      width: 16px;
      left: 4px;
      bottom: 4px;
      background-color: #3199ff;
      transition: .4s;
      border-radius: 50%;
    }
   
    input:checked + .slider:before {
      transform: translateX(26px);
    }
    .btn {
      background-color: #3199ff;
      color: white;
      padding: 5px 13px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      display: inline-block;
      font-size: 15px;
      margin-left: 5px;
    }
    .pay-button {
      text-align: center;
      float: right;
    }
    .section {
      padding: 100px 0;
      background-color: #f8f9fa;
    }
    .section-title {
      text-align: center;
      font-size: 2.2em;
      margin-bottom: 5px;
      color: #001c47;
      font-weight: 700;
      margin-top: -60px;
      margin-bottom: 30px;
    }
    .section-title1 {
      text-align: center;
      font-size: 2.2em;
      margin-bottom: 40px;
      color: #fff;
      font-weight: 700;
      margin-top: -18px;
    }
    .section-description {
      text-align: center;
      max-width: 890px;
      margin: 0 auto 50px;
      font-size: 1.1em;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: -45px;
    }
    .grid-benefits {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: -45px;
    }
    .card {
      background-color: white;
      border-radius: 14px;
      overflow: hidden;
    }
    .card-image {
      height: 200px;
      background-color: #e0e0e0;
    }
    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .card-content {
      padding: 14px;
      border-right: 1px solid #b5b3b3;
      border-left: 1px solid #b5b3b3;
      border-bottom: 1px solid #b5b3b3;
      border-bottom-left-radius: 14px;
      border-bottom-right-radius: 14px;
      min-height: 171px;
    }
    .card h3 {
      margin-bottom: 10px;
      font-size: 17px;
      font-weight: bold;
    }
    .icon-card {
      text-align: center;
      padding: 12px 10px;
      border: 1px solid #b5b3b3;
    }
    .how-it-works .card h3 {
      color: #3199ff;
    }
    .icon-placeholder {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
    }
    .icon-placeholder-benefits{
      margin: 0 auto 0px !important;
      }
    .icon-placeholder img {
      max-width: 100%;
      max-height: 100%;
    }
    .benefits {
      background-image: url('/assets/images/agent/sales/benfits.png');
      background-size: cover;
      background-position: center;
      padding: 80px 0;
    }
    .cta {
      background-image: url('/assets/images/agent/sales/get-started.png');
      background-size: cover;
      background-position: center;
      color: white;
      text-align: center;
      padding: 80px 0;
    }
    .cta h2 {
      font-size: 2.5em;
      margin-bottom: 30px;
    }
    .prc-btn{
      margin-left: 15%
    }
  `]
})
export class MarketingAiSalesPageComponent {
    email:any;
    selectedAgent:any;
    agentsQuantity: number = 1;
    isYearly: boolean = true;
    selectedAgentId:any;

    heroFeatures = [
      'Dynamic Campaign Management',
      'Instant Analytics',
      'Tailored Marketing Solution',
      'Seamless Platform Integration',
    ];
  
    keyFeatures = [
      {
        image:"assets/images/agent/sales/marketing-content 1.png",
        title: 'Content Creation',
        description: 'Generates high-quality text and images tailored to your brand, ensuring a consistent voice and audience engagement.'
      },
      {
        image:"assets/images/agent/sales/marketing-content 2.png",
        title: 'Automated Promotion',
        description: 'Seamlessly distributes content across platforms, expanding reach and boosting visibility with minimal effort.'
      },
      {
        image:"assets/images/agent/sales/marketing-content 3.png",
        title: 'Sentiment Analysis',
        description: 'Monitors customer reactions in real-time, refining strategies for better resonance and effectiveness.'
      },
      {
        image:"assets/images/agent/sales/marketing-content 4.png",
        title: 'A/B Testing',
        description: 'Optimizes content by testing different versions, improving the impact of your marketing campaigns.'
      }
    ];
  
    benefits = [
      {
        icon: 'assets/images/agent/sales/marketing-effeiciency.svg',
        title: 'Efficiency',
        description: 'Automates content creation and promotion, freeing your team for strategic planning and high-value tasks.'
      },
      {
        icon: 'assets/images/agent/sales/marketing-quality.svg',
        title: 'Quality',
        description: 'Produces engaging content that drives attention, builds brand loyalty, and increases conversions.'
      },
      {
        icon: 'assets/images/agent/sales/marketing-reach.svg',
        title: 'Reach',
        description: 'Maximizes exposure by effortlessly promoting content across multiple platforms, attracting a larger audience.'
      },
      {
        icon: 'assets/images/agent/sales/marketing-insights.svg',
        title: 'Insights',
        description: 'Provides valuable data on customer sentiments and campaign performance for informed, personalized strategies.'
      },
      {
        icon: 'assets/images/agent/sales/marketing-optimization.svg',
        title: 'Optimization',
        description: 'Continuously refines marketing efforts through A/B testing and real-time feedback for sustained effectiveness.'
      }
    ];
  
    workingSteps = [
      {
        icon: 'assets/images/agent/sales/bell-icon.svg',
        title: 'Subscribe Easily',
        description: 'Start with a simple subscription process — no hidden fees or complexities.'
      },
      {
        icon: 'assets/images/agent/sales/preferences.svg',
        title: 'Set Your Preferences',
        description: 'Customize the AI Agent’s interactions, optimizations, and communications to match your specific needs.'
      },
      {
        icon: 'assets/images/agent/sales/automate.svg',
        title: 'Automate',
        description: 'Relax as our AI Agent autonomously handles your manual marketing activities pipeline.'
      }
    ];

  constructor(private route : ActivatedRoute,
    private crypto: CryptoService,
    private service : PredefinedBotsService,
              private spinner : LoaderService,
              private router: Router,
              private stripeService: StripeService,
              private messageService: MessageService,
              private toaster: ToasterService,
              private toastMessages: toastMessages
) { 
    this.route.queryParams.subscribe(data => {
        console.log("queryParams",data);
        if (data && data.token) {
        this.email = this.crypto.decrypt(data.token);
        } else {
        console.log("Invalid token");
        }
        if (data && data.id) this.selectedAgentId = data.id;
        if (data && data.quantity) this.agentsQuantity = data.quantity;
        if (data && data.isYearly) this.isYearly = data.isYearly === 'true';
        console.log("selectedAgent",this.selectedAgentId);
        console.log("email",this.email);
    })
    this.loadPredefinedBots();
}

ngOnInit() {
}

loadPredefinedBots() {
    this.spinner.show();
    this.service.loadPredefinedBots().subscribe((response: any) => {
        this.spinner.hide();
        if (response) {
            console.log("response",response);
            response.forEach((agent) => {
                if(agent.product.id == this.selectedAgentId){
                this.selectedAgent = agent.product;
                this.selectedAgent["priceCollection"] = agent.priceCollection;
                }
            });
            console.log("selectedAgent",this.selectedAgent);
        }
    }, err => {
        this.spinner.hide();
        Swal.fire({
            title: 'Error!',
            text: 'Failed to load',
            icon: 'error',
            showCancelButton: false,
            allowOutsideClick: true
        }).then((result) => {
            if (result.value) {
                this.router.navigate(['/signup']);
            }
        });
    });
}

  incrementAgents() {
    this.agentsQuantity++;
  }

  decrementAgents() {
    if (this.agentsQuantity > 1) {
      this.agentsQuantity--;
    }
  }

  proceedToPay() {
    // console.log(`Proceeding to pay for ${this.agentsQuantity} agents on ${this.isYearly ? 'yearly' : 'monthly'} plan`);
    // Implement payment logic here
    this.spinner.show();
  
    // let selectedInterval = (this.selectedPlan === 'Monthly') ? 'month' : 'year';
    let filteredPriceIds = [];
  console.log("selectedAgent",this.selectedAgent);
      let selectedTire = !this.isYearly ? 'month' : 'year'
      this.selectedAgent.priceCollection.forEach((price) => {
        if (price.recurring.interval === selectedTire) {
          let obj = {};
          obj["id"] = price.id;
          obj["quantity"] = this.agentsQuantity;
          filteredPriceIds.push(obj);
        }
      });

  
  
    if (filteredPriceIds.length === 0) {
      // Handle the case when no price is selected for the chosen interval
      // console.error('No price selected for the chosen interval.');
      this.spinner.hide();
      return;
    }
    
    let filteredUrls = this.router.url.split('&');
    let req_body = {
      // "price": filteredPriceIds,
      "priceData": filteredPriceIds.map(price => ({
        "price": price.id,
        "quantity": price.quantity
      })),
      "customerEmail": this.email,
      "successUrl": environment.paymentSuccessURL,
      // "cancelUrl": environment.paymentFailuerURL+"?token="+this.crypto.encrypt(this.userEmail)
    //   "cancelUrl": environment.paymentFailuerURL+"?token="+this.email+"&id="+this.selectedAgentId+"&quantity="+this.agentsQuantity+"&isYearly="+this.isYearly
      // "cancelUrl": environment.paymentFailuerURL+this.router.url+"&quantity="+this.agentsQuantity+"&isYearly="+this.isYearly
      "cancelUrl": environment.paymentFailuerURL+filteredUrls[0]+'&'+filteredUrls[1]+"&quantity="+this.agentsQuantity+"&isYearly="+this.isYearly
    };
    // console.log("PLAN_ID's", req_body);
    
    this.service.getCheckoutScreen(req_body).pipe(
        switchMap((session: any) => {
          this.spinner.hide();
          return this.stripeService.redirectToCheckout({ sessionId: session.id });
        })
      ).subscribe(
        res => {
          this.spinner.hide();
        },error => {
          this.spinner.hide();
          this.toaster.showError(this.toastMessages.apierror);
          console.error('Error during payment:', error);
        }
      );
  }
}