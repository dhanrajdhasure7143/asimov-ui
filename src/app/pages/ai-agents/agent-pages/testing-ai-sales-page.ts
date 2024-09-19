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

@Component({
  selector: 'app-recruitment-ai-sales-page',
  template: `
    <div class="sales-page-container">
      <div class="hero">
        <div class="container">
          <div class="hero-content">
            <div class="hero-text">
              <h1>Source Smarter To Hire Faster</h1>
              <p>Match the right talent 5X faster, automate outreach and collaborate on candidates</p>
              <ul>
                <li *ngFor="let feature of heroFeatures">{{ feature }}</li>
              </ul>
            </div>
            <div class="hero-pricing">
              <div class="pricing-controls">
                <div class="agents">
                  <label>Select no of Agents</label>
                  <div class="counter">
                    <button (click)="decrementAgents()">-</button>
                    <span>{{ agentsQuantity }}</span>
                    <button (click)="incrementAgents()">+</button>
                  </div>
                </div>
                
                <div class="billing-cycle">
                  <span [class.active]="!isYearly">Monthly</span>
                  <label class="switch">
                    <input type="checkbox" [(ngModel)]="isYearly">
                    <span class="slider round"></span>
                  </label>
                  <span [class.active]="isYearly">Yearly</span>
                </div>
              </div>
              
              <button class="btn pay-button" (click)="proceedToPay()">Proceed To Pay</button>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="container">
          <h2 class="section-title">Key Features</h2>
          <p class="section-description">The Recruitment AI Agent is designed to revolutionize the hiring process by automating and enhancing various recruitment tasks. This intelligent tool ensures that you find the perfect candidates quickly and efficiently, transforming the way you manage recruitment.</p>
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
          <div class="grid">
            <div class="card icon-card" *ngFor="let benefit of benefits">
              <div class="icon-placeholder">
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
          <h2 class="section-title">How Does Our Testing AI Agent Work?</h2>
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
      background-image: url('/assets/images/agent/sales/Rectangle 2667.png');
      background-size: cover;
      background-position: center;
      color: white;
      padding: 70px 0;
    }
    .agents {
        display: flex;
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
      background-color: rgba(255, 255, 255, 0.1);
      padding: 1.5rem;
      border-radius: 10px;
      width: 300px;
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
      margin-bottom: 1.5rem;
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
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      display: inline-block;
      font-size: 15px;
      margin-left: 5px;
    }
    .pay-button {
      text-align: center;
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
  `]
})
export class TestingAiSalesPageComponent {
    email:any;
    selectedAgent:any;
    agentsQuantity: number = 1;
    isYearly: boolean = false;
    selectedAgentId:any;

  heroFeatures = [
    'Automated Candidate Sourcing',
    'Smart Resume Screening',
    'AI Powered Candidate Matching',
    'Seamless Integration with HR Systems'
  ];

  keyFeatures = [
    {
      image:"assets/images/agent/sales/content 1.png",
      title: 'Accurate Job Descriptions',
      description: 'Automatically refine job descriptions to ensure clarity, reducing errors and improving candidate quality.'
    },
    {
      image:"assets/images/agent/sales/content 2.png",
      title: 'Candidate Sourcing',
      description: 'The AI scans job portals to find and summarize resumes that match your JDs, saving manual effort.'
    },
    {
      image:"assets/images/agent/sales/content 3.png",
      title: 'Matching Percentage',
      description: 'Assigns a matching score to resumes, helping prioritize candidates and streamline shortlisting.'
    },
    {
      image:"assets/images/agent/sales/content 4.png",
      title: 'Automated Job Posting',
      description: 'Uses RPA to post JDs across job portals, maximizing reach and applicant numbers.'
    }
  ];

  benefits = [
    {
      icon: 'assets/images/agent/sales/time-efficiency.svg',
      title: 'Time Efficiency',
      description: ' Reduces time spent on sourcing and shortlisting candidates, allowing recruiters to focus on interviewing and hiring. This speeds up onboarding and reduces vacancy periods.'
    },
    {
      icon: 'assets/images/agent/sales/improved-qulity.svg',
      title: 'Improved Quality',
      description: 'Enhances the accuracy and completeness of JDs to attract the right talent. Well-crafted JDs set clear expectations and attract candidates who closely match the job requirements.'
    },
    {
      icon: 'assets/images/agent/sales/decision-making.svg',
      title: 'Enhanced Decision-Making',
      description: 'Provides a matching percentage for each resume, helping recruiters quickly identify top candidates. This supports data-driven decisions, making the recruitment process more objective.'
    },
    {
      icon: 'assets/images/agent/sales/streamline-process.svg',
      title: 'Streamlined Processes',
      description: 'Automates job posting and profile summarization, making recruitment more efficient and less labor-intensive. Automation reduces human error and ensures consistency.'
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
      description: 'Customize how the AI Agent interacts, screens and communicates based on your specific requirements.'
    },
    {
      icon: 'assets/images/agent/sales/automate.svg',
      title: 'Automate',
      description: 'Sit back as our AI Agent autonomously manages the recruitment pipeline.'
    }
  ];

  constructor(private route : ActivatedRoute,
    private crypto: CryptoService,
    private service : PredefinedBotsService,
              private spinner : LoaderService,
              private router: Router,
              private stripeService: StripeService,
              private messageService: MessageService
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
          console.error('Error during payment:', error);
        }
      );
  }
}