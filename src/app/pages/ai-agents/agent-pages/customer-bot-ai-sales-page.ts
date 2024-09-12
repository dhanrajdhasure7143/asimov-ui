import { Component } from '@angular/core';

@Component({
  selector: 'app-recruitment-ai-sales-page',
  template: `
  <div class="sales-page-container">
    <div class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <h1>Elevate Your Customer Support with AI Automation</h1>
            <p>Boost your Support Efficiency By 5x</p>
            <ul>
              <li *ngFor="let feature of heroFeatures">{{ feature }}</li>
            </ul>
          </div>
          <div class="hero-pricing">
           <app-payment-collection></app-payment-collection>
            
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="container">
        <h2 class="section-title">Key Features</h2>
        <p class="section-description">The Customer Support AI Agent enhances your support operations by  automating query handling and leveraging RPA for efficient task  completion. Trained on your company's content, it delivers accurate,  24/7 customer support, significantly reducing team workload. Boost  customer satisfaction and free your team to tackle more complex issues.</p>
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
        <h2 class="section-title">How Does Our Customer Support AI Agent Work?</h2>
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
    background-image: url('/assets/images/agent/sales/CS-head.png');
    background-size: cover;
    background-position: center;
    color: white;
    padding: 70px 0;
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
    background-color: #fff;
    padding: 20px;
    border-radius: 20px;
  }
  .pricing-controls {
    margin-bottom: 1rem;
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
export class CustomerBotAiSalesPageComponent {
    email:any;
    selectedAgent:any;
    agentsQuantity: number = 1;
    isYearly: boolean = true;
    selectedAgentId:any;

    heroFeatures = [
      'Instant Customer Assistance',
      'Predictive Issue Resolution',
      'Tailored Customer Interactions',
      'Custom AI for Your Support'
    ];
  
    keyFeatures = [
      {
        image:"assets/images/agent/sales/CS-content 1.png",
        title: 'Automated Query Handling',
        description: 'The AI interacts with customers via chat, gathering information and providing prompt, accurate responses to enhance their experience.'
      },
      {
        image:"assets/images/agent/sales/CS-content 2.png",
        title: 'RPA Integration',
        description: 'Automate tasks like onboarding and troubleshooting with minimal intervention, reducing support team workload and boosting efficiency.'
      },
      {
        image:"assets/images/agent/sales/CS-content 3.png",
        title: '24/7 Support',
        description: 'Offer continuous customer support, improving satisfaction and loyalty across time zones.'
      },
      {
        image:"assets/images/agent/sales/CS-content 4.png",
        title: 'Scalability',
        description: 'Efficiently manage growing support demands without needing more staff, maintaining high support quality.'
      }
    ];
  
    benefits = [
      {
        icon: 'assets/images/agent/sales/CS-reduces.svg',
        title: 'Reduced Workload',
        description: 'Automates routine queries and tasks, allowing your team to focus on complex and high-priority issues.'
      },
      {
        icon: 'assets/images/agent/sales/CS-efficiency.svg',
        title: 'Efficiency',
        description: 'Speeds up processes like customer onboarding, reducing time and effort, improving satisfaction, and accelerating the customer journey.'
      },
      {
        icon: 'assets/images/agent/sales/CS-accuracy.svg',
        title: 'Accuracy',
        description: 'Ensures consistent and accurate responses to customer inquiries, enhancing the customer experience and building trust.'
      },
      {
        icon: 'assets/images/agent/sales/CS-scal.svg',
        title: 'Scalability',
        description: 'Manages growing support demands efficiently without additional staffing costs, handling peak times and growth effectively.'
      },
      {
        icon: 'assets/images/agent/sales/CS-satisfaction.svg',
        title: 'Customer Satisfaction',
        description: 'Improves satisfaction and loyalty by providing timely and accurate support, encouraging repeat customers and brand advocacy.'
      }
    ];
  
    workingSteps = [
      {
        icon: 'assets/images/agent/sales/bell-icon.svg',
        title: 'Subscribe Easily',
        description: 'Begin with a straightforward subscription—no hidden fees or complications.'
      },
      {
        icon: 'assets/images/agent/sales/preferences.svg',
        title: 'Set Your Preferences',
        description: 'Customize the AI Agent’s interactions, optimizations, and communications to match your specific needs.'
      },
      {
        icon: 'assets/images/agent/sales/automate.svg',
        title: 'Automate',
        description: 'Relax as our AI Agent autonomously handles your manual customer support activities pipeline.'
      }
    ];

    constructor() { }

    ngOnInit() { }

}