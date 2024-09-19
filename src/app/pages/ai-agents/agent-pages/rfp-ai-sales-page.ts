import { Component } from '@angular/core';

@Component({
  selector: 'app-recruitment-ai-sales-page',
  template: `
  <div class="sales-page-container">
  <div class="hero">
    <div class="container">
      <div class="hero-content">
        <div class="hero-text">
          <h1>Revolutionize Your RFP Process With AI Automation</h1>
          <p>Enhance your RFP efficiency by 5X automate document generation, streamline collaboration, and empower your team to excel.</p>
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
      <p class="section-description">The RFP AI Agent is designed to simplify and expedite the response  process to Requests for Proposals (RFPs). This advanced tool improves  the quality of your submissions and enhances your chances of winning  proposals by automating key aspects of the RFP response process.</p>
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
      <h2 class="section-title">How Does Our RFP AI Agent Work?</h2>
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
      background-image: url('src/assets/images/agent/sales/RFP-head.png');
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
    .icon-placeholder-benefits{
      margin: 0 auto 0px !important;
      }
    .icon-placeholder img {
      max-width: 100%;
      max-height: 100%;
    }
    .benefits {
      background-image: url('src/assets/images/agent/sales/benfits.png');
      background-size: cover;
      background-position: center;
      padding: 80px 0;
    }
    .cta {
      background-image: url('src/assets/images/agent/sales/get-started.png');
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
export class RfpAiSalesPageComponent {
    email:any;
    selectedAgent:any;
    agentsQuantity: number = 1;
    isYearly: boolean = true;
    selectedAgentId:any;

    heroFeatures = [
      'Smart RFP Management',
      'Instant Analysis',
      'Customized RFP Solutions',
      'Effortless Integration'
    ];
  
    keyFeatures = [
      {
        image:"assets/images/agent/sales/rfp-content 1.png",
        title: 'Concise Summaries',
        description: 'Upload your RFP and previous responses for concise summaries, ensuring no key information is missed and saving time by summarizing extensive RFPs.'
      },
      {
        image:"assets/images/agent/sales/rfp-content 2.png",
        title: 'Comprehensive Responses',
        description: 'Generate detailed responses based on your uploaded documents, maintaining a high standard in your proposal submissions.'
      },
      {
        image:"assets/images/agent/sales/rfp-content 3.png",
        title: 'Template Customization',
        description: 'Customize the response templates to match your company’s branding and  formatting guidelines, ensuring a professional appearance.'
      },
      {
        image:"assets/images/agent/sales/rfp-content 4.png",
        title: 'Automated Workflow',
        description: 'The AI Agent automates the entire process of RFP response creation, from  summarization to final response generation.'
      }
    ];
  
    benefits = [
      {
        icon: 'assets/images/agent/sales/time-efficiency.svg',
        title: 'Time Savings',
        description: 'Significantly reduce the time required to read & respond to  RFPs, allowing your team to focus on strategic activities.'
      },
      {
        icon: 'assets/images/agent/sales/improved-qulity.svg',
        title: 'Improved Quality',
        description: 'Enhance the quality and accuracy of your RFP responses, ensuring they  are thorough and professionally presented.'
      },
      {
        icon: 'assets/images/agent/sales/decision-making.svg',
        title: 'Timely Submissions',
        description: 'Ensure timely submissions by automating the response creation  process.'
      },
      {
        icon: 'assets/images/agent/sales/marketing-effeiciency.svg',
        title: 'Efficiency',
        description: 'Streamline your RFP response workflow, making it more efficient and  less labor-intensive.'
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
        description: 'Customize the AI Agent’s functionalities, optimizations, and communications to suit your specific requirements.'
      },
      {
        icon: 'assets/images/agent/sales/automate.svg',
        title: 'Automate',
        description: 'Sit back as our AI Agent autonomously manages your RFP activities, from start to finish.'
      }
    ];

  constructor() { }

  ngOnInit() { }

}