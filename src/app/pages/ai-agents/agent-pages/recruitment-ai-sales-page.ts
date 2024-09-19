import { Component } from '@angular/core';

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
          <app-payment-collection></app-payment-collection>
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

  <!-- <div class="cta">
    <div class="container">
      <h2>Unlock Exceptional Talent with Unmatched AI Precision</h2>
      <a href="#" class="btn">Get Started</a>
    </div>
  </div> -->
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
      background-image: url('src/assets/images/agent/sales/Rectangle 2667.png');
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
      padding: 12px 24px;
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
  `]
})
export class RecruitmentAiSalesPageComponent {
    email:any;
    selectedAgent:any;
    agentsQuantity: number = 1;
    isYearly: boolean = true;
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

  constructor() { }

  ngOnInit() { }

}