import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { PredefinedBotsService } from '../../services/predefined-bots.service';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { toastMessages } from 'src/app/shared/model/toast_messages';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-predefined-bots-orchestration',
  templateUrl: './predefined-bots-orchestration.component.html',
  styleUrls: ['./predefined-bots-orchestration.component.css']
})
export class PredefinedBotsOrchestrationComponent implements OnInit {
  @Output() predefinedOrchestrationBotId = new EventEmitter<number>();
  columns_list: any[] = [
    { ColumnName: "automationName", DisplayName: "Automation Name", ShowGrid: true, ShowFilter: true, filterWidget: "normal", filterType: "text", sort: true, multi: false,showTooltip:true },
    { ColumnName: "predefinedBotType", DisplayName: "Type", ShowGrid: true, ShowFilter: true, filterWidget: "normal", filterType: "text", sort: true, multi: false, },
    { ColumnName: "convertedSchedule", DisplayName: "Schedule", ShowGrid: true, ShowFilter: false, filterWidget: "normal", filterType: "text", sort: true, multi: false,width:"flex: 0 0 20rem", showTooltip:true },
    { ColumnName: "action", DisplayName: "Action", ShowGrid: true, ShowFilter: false, filterWidget: "normal", filterType: "text", sort: false, multi: false, }
  ];
  scheduledbots:any[]=[];
  table_searchFields: any = ["automationName","predefinedBotType","convertedSchedule"];
  showOverlay: boolean = false;
  showBotForm: boolean = false;
  viewLogsFlag: boolean = false;
  logsData: any;
  emails = [
    {
      sender: 'Noreply EZFlow',
      subject: 'Candidate Profiles Matched',
      preview: 'Thanks & Regards Aravind Goud ...',
      time: 'Wed 7/3/2024 10:35 AM',
      content: `
        <p>Hi aravind,</p>
        <p>Based on the job description provided, our system identified several suitable profiles from the SheJobs portal. Attached are the detailed profiles of candidates matching the required criteria.</p>

    <h3>Name: Lopadevi Damarla</h3>
    <p><strong>Profile Summary:</strong> Lopadevi Damarla is a dedicated Business Intelligence professional with over 5 years of experience. She has worked cross-functionally to design, develop, and deploy strategies in a business intelligence environment. She specializes in building reports and dashboards using Power Bi and Alteryx. She has been involved in multiple projects across various industries. She is well-versed in identifying business needed management information and developing solutions that drive accuracy, improve efficiency, and reduce operational time. Her current role is a Senior MI Analyst at Shell Business Operations, India. She has previously worked as a BI Analyst at RightPath Computer Technologies, India, and as a Research Analyst at FACTSET Systems Ltd, India.</p>
    <p><strong>Match Percentage:</strong> 40%</p>
    <p><strong>Source:</strong> SheJobs</p>
    <p><strong>Missing Keys & Skills:</strong> Senior Data Scientist, Python, advanced data analysis techniques, complex SQL queries, sophisticated models and algorithms, latest advancements in data science and machine learning techniques</p>

    <h3>Name: K. Sai Lakshmi</h3>
    <p><strong>Profile Summary:</strong> K. Sai Lakshmi is a professional with 1 year and 8 months of experience as a Business Associate. She has worked on a project titled 'IDEA' as an Agent, using Windows XP and Oracle E-business site applications software. She has experience in handling customer complaints & queries, participating in monthly close-out processes, meeting productivity and quality goals, and managing day-to-day activities. She has a diploma in Computer Science and Engineering from VKR & VNB College, JNTU Kakinada. Her technical skills include operating systems like Windows, Windows 7, Window 8 and Microsoft Office tools like MS Office and Excel.</p>
    <p><strong>Match Percentage:</strong> 20%</p>
    <p><strong>Source:</strong> SheJobs</p>
    <p><strong>Missing Keys & Skills:</strong> Senior Data Scientist, data analysis, SQL, Excel, Python, advanced data analysis techniques, large datasets, complex SQL queries, sophisticated models and algorithms, business problems, optimize processes, cross-functional teams, business requirements, data-driven solutions, stakeholders, data science, machine learning techniques</p>

    <h3>Name: R. SANDHYA RANI</h3>
    <p><strong>Profile Summary:</strong> R. Sandhya Rani is a recent graduate with a Bachelor of Technology degree from Pragati Engineering College. She has basic knowledge of C programming and is proficient in MS Office Suite. She has participated in several workshops and technical events, including a workshop on 'Machine Learning Using Python Programming'. However, she does not have the required 6 years of experience for the Senior Data Scientist position at EPSoft Technologies. Her skills and experience do not match the job requirements, which include advanced data analysis, SQL, Excel, and Python expertise.</p>
    <p><strong>Match Percentage:</strong> 20%</p>
    <p><strong>Source:</strong> SheJobs</p>
    <p><strong>Missing Keys & Skills:</strong> Senior Data Scientist, data analysis, SQL, Excel, Python, advanced data analysis techniques, large datasets, complex SQL queries, sophisticated models and algorithms, cross-functional teams, business requirements, data-driven solutions, data science, machine learning techniques</p>

    <h3>Name: Nagalakshmi Meesala</h3>
    <p><strong>Profile Summary:</strong> Nagalakshmi Meesala is a Human Resources Management Professional with experience in staffing, internal program development, and strategic planning. She has worked as an HR-Recruiter at Saachi Informatics Pvt Ltd from June 2015 to December 2021. She is efficient in interviewing and assessing people, recruiting according to company policy, and maintaining employee records. She has experience with MS Excel spreadsheets, accounts payable and receivable, and generating client billings. She holds a Master's degree in Finance and HR and a Bachelor's degree in Computer Application.</p>
    <p><strong>Match Percentage:</strong> 20%</p>
    <p><strong>Source:</strong> SheJobs</p>
    <p><strong>Missing Keys & Skills:</strong> Senior Data Scientist, data analysis, SQL, Excel, Python, advanced data analysis techniques, large datasets, complex SQL queries, sophisticated models and algorithms, business problems, optimize processes, cross-functional teams, business requirements, data-driven solutions, latest advancements in data science, machine learning techniques</p>

    <h3>Name: N SAI KRISHNA</h3>
    <p><strong>Profile Summary:</strong> N SAI KRISHNA is a HR Executive with experience in payroll processing, HR administration, and project staffing. He has worked with Brothers Engineering and Erectors ltd and OPPO Mobiles India Pvt Ltd. He has skills in Management, Ms-office, C++, and Ms-excel. He is a B-Tech (ECE) graduate from TRR College of engineering.</p>
    <p><strong>Match Percentage:</strong> 10%</p>
    <p><strong>Source:</strong> SheJobs</p>
    <p><strong>Missing Keys & Skills:</strong> Senior Data Scientist, data analysis, SQL, Excel, Python, advanced data analysis techniques, large datasets, complex SQL queries, sophisticated models and algorithms, cross-functional teams, business requirements, data-driven solutions, data science, machine learning techniques</p>

      <p>Please review these profiles and let me know if you need any additional information or if you'd like to proceed with any of these candidates.</p>

      <p>Best regards,<br>Aravind Goud Chedurupally</p>
      `,
      attachments: [
        { name: 'Satyanarayana_resume.pdf' },
        { name: 'Sai_Krishna_resume.pdf' },
        { name: 'Aravind_Resume.pdf' },
        { name: 'Pranitha_resume.pdf' },
        { name: 'Deekshitha.pdf' },
        { name: 'Lakshmi.Pdf' },
        { name: 'Satyanarayana_resume.pdf' },
        { name: 'Sai_Krishna_resume.pdf' },
        { name: 'Aravind_Resume.pdf' },
        { name: 'Pranitha_resume.pdf' },
      ]
    },
    {
      sender: 'Noreply EZFlow',
      subject: 'Candidate Profiles Matched',
      preview: 'CAUTION: This email originated f...',
      time: 'Tue 7/2/2024 12:35 PM',
      content: `
        <p>Hi aravind,</p>
        <p>Based on the job description provided, our system identified several suitable profiles from the SheJobs portal. Attached are the detailed profiles of candidates matching the required criteria.</p>

      <h3>Name: EKTA BANGAR</h3>
      <p><strong>Profile Summary:</strong> Ekta Bangar is an Application Consultant at IBM India Pvt Ltd with experience in data fixes, code changes, data cleansing, and converting business requirements into technical solutions. She has a Bachelor's degree in Computer Science.</p>
      <p><strong>Match Percentage:</strong> 75%</p>
      <p><strong>Source:</strong> SheJobs</p>

      <h3>Name: Pruthvi</h3>
      <p><strong>Profile Summary:</strong> Pruthvi is a qualified Information Expert (Level 100) with profound perfection in Salesforce Programming dialect with data quality standards. She has experience in sandboxes, developments, and coding of Apex class models using MVC structure. Pruthvi has a degree in Computer Application and has knowledge in creating ETL Data Load, Java, J-Query techniques, and Sales Computing.</p>
      <p><strong>Match Percentage:</strong> 65%</p>
      <p><strong>Source:</strong> SheJobs</p>

      <h3>Name: Arunadevi A</h3>
      <p><strong>Profile Summary:</strong> Arunadevi A is a professional with good knowledge in Visual Basic and C SQL Server databases, SQL server integration Services(SSIS), Data warehouse concepts, and understanding of online analytical processing(OLAP). She has experience in designing SSIS packages for extracting data from various sources. Her skills include SQL Server 2005/2008, T-SQL, and C#.</p>
      <p><strong>Match Percentage:</strong> 85%</p>
      <p><strong>Source:</strong> SheJobs</p>

      <h3>Name: S GANESH RANI</h3>
      <p><strong>Profile Summary:</strong> S Ganesh Rani has a strong passion as a Backend/Java developer with 3 years of knowledge in C programming and a proficient in SoftSkills Level. She has participated in various activities and technical events related to programming, C#, and machine learning. However, she does not have the required years of experience in the specific skills of data analysis, SQL, Excel, and Python as required for this Senior Data Quality Analyst at EPSoft.</p>
      <p><strong>Match Percentage:</strong> 60%</p>
      <p><strong>Source:</strong> SheJobs</p>

      <h3>Name: T V Sai Santhoshi</h3>
      <p><strong>Profile Summary:</strong> T V Sai Santhoshi is a professional in Human Resource Management with experience in staffing, annual employee performance, and strategy planning. She has worked as an HR Business Partner at Matrix Laboratories for 2 years and has knowledge of HR generalist activities. She holds a Master's degree in Human Resource Management and has completed her HRM from Acharya Nagarjuna University.</p>
      <p><strong>Match Percentage:</strong> 55%</p>
      <p><strong>Source:</strong> SheJobs</p>

      <h3>Name: Shanthini Chenna</h3>
      <p><strong>Profile Summary:</strong> Shantini Chenna is a dedicated Software Testing professional with over 5 years of experience in the software industry. She has worked from Functional to Design, Manual, and Automation testing in a business intelligence environment. Her specialties include SQL, QTP/UFT, QC/ALM, and JIRA. She has worked on data warehouse projects and is familiar with ETL concepts.</p>
      <p><strong>Match Percentage:</strong> 80%</p>
      <p><strong>Source:</strong> SheJobs</p>


      <h3>Name: Sri Laxmi Gopisetty</h3>
      <p><strong>Profile Summary:</strong> Sri Laxmi Gopisetty is a Software Test Engineer with 2 years of experience in manual and automation testing. She has worked with HSBC and JPMC and has experience in Selenium WebDriver with Java and TestNG. Her technical skills include Core Java, Selenium WebDriver, TestNG, Maven, Jenkins, and GIT. She has hands-on experience in writing test scripts using Selenium WebDriver.</p>
      <p><strong>Match Percentage:</strong> 70%</p>
      <p><strong>Source:</strong> SheJobs</p>

      <h3>Name: LAYA NYAPATHY</h3>
      <p><strong>Profile Summary:</strong> LAYA NYAPATHY is a full-stack web developer experienced in Python programming and Django coding. She has worked with Django Framework and Django Rest Framework for API development. She has also done an internship in UI UX and Python development. She has knowledge of JavaScript, React JS, Node.js, and databases.</p>
      <p><strong>Match Percentage:</strong> 68%</p>
      <p><strong>Source:</strong> SheJobs</p>

      <p>Please review these profiles and let me know if you need any additional information or if you'd like to proceed with any of these candidates.</p>

      <p>Best regards,<br>Aravind Goud Chedurupally</p>
      `,
      attachments: [
        { name: 'Satyanarayana_resume.pdf' },
        { name: 'Sai_Krishna_resume.pdf' },
      ]
    },
    {
      sender: 'Noreply EZFlow',
      subject: 'Candidate Profiles Matched',
      preview: 'Thank you for your kind words...',
      time: 'Mon 7/1/2024 10:20 AM',
      content: `
        <p>Hi aravind,</p>
        <p>Based on the job description provided, our system identified several suitable profiles from the SheJobs portal. Attached are the detailed profiles of candidates matching the required criteria.</p>
        
        <h3>Name: G.Bhargavi</h3>
      <p><strong>Profile Summary:</strong> G.Bhargavi is a Bachelor of Engineering graduate in E.C.E from Bharati Institute of Engineering & Technology, Hyderabad. She has experience in Python programming and SQL databases. She has worked on a project titled 'Online Merchant Management System' where she played the role of a developer and tester. She has also developed Graphical User Interfaces (GUI) with PAGE software. She has strong analytical aptitude and problem-solving skills. She has also worked on a project titled 'Environmental monitoring using zigbee technology'.</p>
      <p><strong>Match Percentage:</strong> 70%</p>
      <p><strong>Source:</strong> SheJobs</p>

      <h3>Name: EKTA BANGAR</h3>
      <p><strong>Profile Summary:</strong> Ekta Bangar is an Application Consultant at IBM India Pvt Ltd with experience in data fixes, code changes, data cleansing, and converting business requirements into technical solutions. She has a Bachelor's degree in Computer Science.</p>
      <p><strong>Match Percentage:</strong> 75%</p>
      <p><strong>Source:</strong> SheJobs</p>

      <h3>Name: Shanthini Chenna</h3>
      <p><strong>Profile Summary:</strong> Shantini Chenna is a dedicated Software Testing professional with over 5 years of experience in the software industry. She has worked from Functional to Design, Manual, and Automation testing in a business intelligence environment. Her specialties include SQL, QTP/UFT, QC/ALM, and JIRA. She has worked on data warehouse projects and is familiar with ETL concepts.</p>
      <p><strong>Match Percentage:</strong> 80%</p>
      <p><strong>Source:</strong> SheJobs</p>

      <h3>Name: Pruthvi</h3>
      <p><strong>Profile Summary:</strong> Pruthvi is a qualified Information Expert (Level 100) with profound perfection in Salesforce Programming dialect with data quality standards. She has experience in sandboxes, developments, and coding of Apex class models using MVC structure. Pruthvi has a degree in Computer Application and has knowledge in creating ETL Data Load, Java, J-Query techniques, and Sales Computing.</p>
      <p><strong>Match Percentage:</strong> 65%</p>
      <p><strong>Source:</strong> SheJobs</p>

      <h3>Name: Arunadevi A</h3>
      <p><strong>Profile Summary:</strong> Arunadevi A is a professional with good knowledge in Visual Basic and C SQL Server databases, SQL server integration Services(SSIS), Data warehouse concepts, and understanding of online analytical processing(OLAP). She has experience in designing SSIS packages for extracting data from various sources. Her skills include SQL Server 2005/2008, T-SQL, and C#.</p>
      <p><strong>Match Percentage:</strong> 85%</p>
      <p><strong>Source:</strong> SheJobs</p>

      <p>Please review these profiles and let me know if you need any additional information or if you'd like to proceed with any of these candidates.</p>

      <p>Best regards,<br>Aravind Goud Chedurupally</p>
      `,
      attachments: [
        { name: 'Thank_You_Note.pdf' }
      ]
    },
    {
      sender: 'Noreply EZFlow',
      subject: 'Candidate Profiles Matched',
      preview: 'CAUTION: This email originated f...',
      content: 'Full content of Madhu Parla\'s email...',
      time: 'Wed 7/3/2024 10:35 AM',
      attachments: []
    },
    {
      sender: 'Noreply EZFlow',
      subject: 'Candidate Profiles Matched',
      preview: 'Thank you for your kind words...',
      content: 'Full content of Sandhya Rani Adigerla\'s email...',
      time: 'Wed 7/3/2024 10:35 AM',
      attachments: [
        { name: 'Thank_You_Note.pdf' }
      ]
    },
    {
      sender: 'Noreply EZFlow',
      subject: 'Candidate Profiles Matched',
      preview: 'CAUTION: This email originated f...',
      content: 'Full content of Madhu Parla\'s email...',
      time: 'Wed 7/3/2024 10:35 AM',
      attachments: []
    },
    {
      sender: 'Noreply EZFlow',
      subject: 'Candidate Profiles Matched',
      preview: 'Thank you for your kind words...',
      content: 'Full content of Sandhya Rani Adigerla\'s email...',
      time: 'Wed 7/3/2024 10:35 AM',
      attachments: [
        { name: 'Thank_You_Note.pdf' }
      ]
    }
  ];

  selectedEmail: any = null;

  selectEmail(index: number) {
    this.selectedEmail = this.emails[index];
  }

  deleteEmail(index: number) {
    this.emails.splice(index, 1);
    if (this.selectedEmail === this.emails[index]) {
      this.selectedEmail = null;
    }
  }

  constructor(
    private rest: PredefinedBotsService,
    private spinner: LoaderService,
    private router: Router,
    private rest_api: PredefinedBotsService,
    private toaster : ToasterService,
    private toastMessage: toastMessages,
    private confirmationService: ConfirmationService,

  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.getListOfItems();
    this.selectedEmail = this.emails[0];
  }

  getListOfItems(){
    this.rest_api.getOrchestrationPredefinedBotsList().subscribe((res:any)=>{
      console.log("res",res);
      this.scheduledbots = res.data
      this.scheduledbots.map(item=>{
        item["convertedSchedule"] = this.convertSchedule(item.schedule)
      })
      this.spinner.hide();
    },err=>{
      this.spinner.hide();
    })
  }

    convertSchedule(schedule) {
      try {
        // Try parsing schedule as JSON
        const scheduleData = JSON.parse(schedule);
        // If successful, assume it's a schedule object
        const startDateArray = scheduleData.startDate.split(',').map(Number);
        const endDateArray = scheduleData.endDate.split(',').map(Number);
        const interval = scheduleData.scheduleInterval;

        // Formatting start date
        const startDate = new Date(startDateArray[0], startDateArray[1] - 1, startDateArray[2], startDateArray[3], startDateArray[4]);
        const formattedStartDate = startDate.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });

        // Formatting end date
        const endDate = new Date(endDateArray[0], endDateArray[1] - 1, endDateArray[2], endDateArray[3], endDateArray[4]);
        const formattedEndDate = endDate.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });

        // Converting interval to human-readable format
        const intervalParts = interval.split(' ');
        const frequency = intervalParts[1];

        // Creating a string for the desired format
        return `${formattedStartDate} - ${formattedEndDate}`;
      } catch (error) {

          // If parsing as JSON fails, assume it's just a date
          return schedule;
      }
    }

  ngOnChanges() {

  }

  ngAfterViewInit() {

  }

  deleteById(event: any) {
    let botName = event.automationName
    this.confirmationService.confirm({
      message: "Do you want to delete this bot? This can't be undo.",
      header: "Are you sure?",
      acceptLabel: "Yes",
      rejectLabel: "No",
      rejectButtonStyleClass: 'btn reset-btn',
      acceptButtonStyleClass: 'btn bluebg-button',
      defaultFocus: 'none',
      rejectIcon: 'null',
      acceptIcon: 'null',
      accept: () => {
        this.spinner.show();
        this.rest_api.deletePredefinedBot(event.predefinedOrchestrationBotId).subscribe(res => {
          this.toaster.showSuccess(botName,"delete")
          this.getListOfItems();
        }, err => {
          this.spinner.hide();
          this.toaster.showError(this.toastMessage.apierror)
        });
      },
      reject: (type) => { }
    });
  }

  viewLogsById(event: any) {
    this.viewLogsFlag = true;
    this.logsData = event.predefinedOrchestrationBotId;
    this.predefinedOrchestrationBotId.emit(this.logsData);
  }
  

  editById(item: any) {
    console.log("testing",item)
    return
    this.router.navigate(["/pages/aiagent/forms"],{queryParams:{type:"edit",id:item.predefinedOrchestrationBotId}});
  }

  runById(event: any) {
    console.log(event)
    this.confirmationService.confirm({
      message: "Do you want to execute bot?",
      header: "Confirmation",
      acceptLabel: "Yes",
      rejectLabel: "No",
      rejectButtonStyleClass: 'btn reset-btn',
      acceptButtonStyleClass: 'btn bluebg-button',
      defaultFocus: 'none',
      rejectIcon: 'null',
      acceptIcon: 'null',
      accept: () => {
        this.spinner.show();
        this.rest_api.startPredefinedBot(event.predefinedOrchestrationBotId,'').subscribe(res => {
          this.toaster.toastSuccess(this.toastMessage.botExcecution_success);
          this.spinner.hide();
        }, err => {
          this.spinner.hide();
          this.toaster.showError(this.toastMessage.botExcecution_fail)
        })
      }
    })
  }

  stopById($event: any) {

  }

  closeLogsOverlay(){
    this.viewLogsFlag=false;
  }

  downloadAttachment(attachment: any) {
    // const link = document.createElement('a');
    // link.href = attachment.url;
    // link.download = attachment.name;
    // link.click();
  }

}
