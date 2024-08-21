import { Component } from '@angular/core';

@Component({
  selector: 'app-recruitment-ai-sales-page',
  template: `
  <div class="sales-page-container">
    <div class="hero">
      <div class="container">
        <h1>Source Smarter To Hire Faster</h1>
        <p>Match the right talent 5X faster, automate outreach and collaborate on candidates</p>
        <ul>
          <li *ngFor="let feature of heroFeatures">{{ feature }}</li>
        </ul>
        <a href="#" class="btn">Purchase Now</a>
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
        <h2 class="section-title">Benefits</h2>
        <div class="grid">
          <div class="card icon-card" *ngFor="let benefit of benefits">
            <div class="icon-placeholder">
              // <i [class]="benefit.icon"></i>
            <img [src]="benefit.icon" [alt]="benefit.title">    

            </div>
            <h3>{{ benefit.title }}</h3>
            <p>{{ benefit.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="container">
        <h2 class="section-title">How Does Our Recruitment AI Agent Work?</h2>
        <div class="grid">
          <div class="card icon-card" *ngFor="let step of workingSteps">
            <div class="icon-placeholder">
              <i [class]="step.icon"></i>
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
        <a href="" class="btn">Get Started</a>
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
      padding: 80px 0;
    }
    .hero h1 {
      font-size: 2.8em;
      margin-bottom: 10px;
      font-weight: bold;
    }
    .hero p {
      font-size: 1.2em;
      margin-bottom: 30px;
    }
    .hero ul {
      list-style-type: none;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px 30px;
      margin-bottom: 30px;
    }
    .hero li {
      display: flex;
      align-items: center;
    }
    .hero li:before {
      content: "•";
      color: #4a90e2;
      font-size: 1.5em;
      margin-right: 10px;
    }
    .btn {
      background-color: #4a90e2;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      display: inline-block;
    }
    .section {
      padding: 80px 0;
      background-color: #f8f9fa;
    }
    .section-title {
      text-align: center;
      font-size: 2.2em;
      margin-bottom: 20px;
      color: #333;
    }
    .section-description {
      text-align: center;
      max-width: 800px;
      margin: 0 auto 50px;
      color: #666;
      font-size: 1.1em;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;
    }
    .card {
      background-color: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .card-image {
      height: 200px;
      background-color: #e0e0e0;
    }
    .card-content {
      padding: 20px;
    }
    .card h3 {
      color: #4a90e2;
      margin-bottom: 10px;
      font-size: 1.3em;
    }
    .card p {
      color: #666;
    }
    .icon-card {
      text-align: center;
      padding: 30px 20px;
    }
    .icon-placeholder {
      width: 80px;
      height: 80px;
      background-color: #e6f3ff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
    }
    .icon-placeholder i {
      font-size: 2.5em;
      color: #4a90e2;
    }
    .benefits {
      background-image: url('/assets/images/agent/sales/benfits.png');
      background-size: cover;
      background-position: center;
      color: white;
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
      .sales-page-container {
      overflow-y: auto;
      height: 100vh;
      scroll-behavior: smooth;
    }
      /* Scrollbar Styles */
    .sales-page-container::-webkit-scrollbar {
      width: 10px;
    }
    .sales-page-container::-webkit-scrollbar-track {
      background: #f1f1f1;
    }
    .sales-page-container::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 5px;
    }
    .sales-page-container::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  `]
})
export class RecruitmentAiSalesPageComponent {
  heroFeatures = [
    'Automated Candidate Sourcing',
    'Smart Resume Screening',
    'AI Powered Candidate Matching',
    'Seamless Integration with HR Systems'
  ];

  keyFeatures = [
    {
      image:"../../../assets/images/agent/sales/content 1.png",
      title: 'Accurate Job Descriptions',
      description: 'Automatically refine job descriptions to ensure clarity, reducing errors and improving candidate quality.'
    },
    {
      image:"../../../assets/images/agent/sales/content 2.png",
      title: 'Candidate Sourcing',
      description: 'The AI scans job portals to find and summarize resumes that match your JDs, saving manual effort.'
    },
    {
      image:"../../../assets/images/agent/sales/content 3.png",
      title: 'Matching Percentage',
      description: 'Assigns a matching score to resumes, helping prioritize candidates and streamline shortlisting.'
    },
    {
      image:"../../../assets/images/agent/sales/content 4.png",
      title: 'Automated Job Posting',
      description: 'Uses RPA to post JDs across job portals, maximizing reach and applicant numbers.'
    }
  ];

  benefits = [
    {
      icon: '../../../assets/images/agent/sales/time-efficiency.svg',
      title: 'Time Efficiency',
      description: 'Reduces time spent on sourcing and shortlisting candidates, allowing recruiters to focus on interviewing and hiring.'
    },
    {
      icon: '../../../assets/images/agent/sales/improved-qulity.svg',
      title: 'Improved Quality',
      description: 'Enhances the accuracy and completeness of JDs to attract the right talent. Well-crafted JDs set clear expectations.'
    },
    {
      icon: '../../../assets/images/agent/sales/decision-making.svg',
      title: 'Enhanced Decision-Making',
      description: 'Provides a matching percentage for each resume, helping recruiters quickly identify top candidates.'
    },
    {
      icon: '../../../assets/images/agent/sales/streamline-process.svg',
      title: 'Streamlined Processes',
      description: 'Automates job posting and profile summarization, making recruitment more efficient and less time-intensive.'
    }
  ];

  workingSteps = [
    {
      icon: 'pi pi-user-plus',
      title: 'Subscribe Easily',
      description: 'Start with a simple subscription process—no hidden fees or complexities.'
    },
    {
      icon: 'pi pi-cog',
      title: 'Set Your Preferences',
      description: 'Customize how the AI Agent interacts, screens and communicates based on your specific requirements.'
    },
    {
      icon: 'pi pi-refresh',
      title: 'Automate',
      description: 'Sit back as our AI Agent autonomously manages the recruitment pipeline.'
    }
  ];
}