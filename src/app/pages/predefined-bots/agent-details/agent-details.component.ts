import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { toastMessages } from 'src/app/shared/model/toast_messages';
import { PredefinedBotsService } from '../../services/predefined-bots.service';

@Component({
  selector: 'app-agent-details',
  templateUrl: './agent-details.component.html',
  styleUrls: ['./agent-details.component.css']
})
export class AgentDetailsComponent implements OnInit {
  bot: any;
  botId: string | null = null;
  params:any={};
  predefinedBot_id:any;
  desc:any;
  isVisible:boolean=true;
  runPlayer: boolean = false;
  isAccordionExpanded: boolean = false;
  predefined_botsList: any[] = [];
  remaining_exe="5"
  // selectedFiles = [];

  items: any[]= [
    {
      subscriptionHeading: "Subscription",
      warningMessage: "Your Subscription expiring soon!",
      expanded: false,
      date: "2024-06-05",
      expirationDate: "2024-07-05",
      amount: "$10.00",
      purchase: "Online Store",
      remaining_exe:"5"
    }
  ];
  logs = [
    { date: 'Executed on 2024-06-01 07:37 AM', status: 'Success' },
    { date: 'Executed on 2024-06-01 07:37 AM', status: 'Failed' },
    { date: 'Executed on 2024-06-01 07:37 AM', status: 'Success' },
    { date: 'Executed on 2024-06-01 07:37 AM', status: 'Failed' },
    
  ];


  logs_full = [
    { sl_no: '01',start_date: '2024-07-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Success' , info: 'Successfull execution completed '},
    { sl_no: '02',start_date: '2024-06-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Failed', info: 'Filed execution completed ' },
    { sl_no: '03',start_date: '2024-06-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Success', info: 'Successfull execution completed ' },
    { sl_no: '04',start_date: '2024-08-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Success', info: 'Successfull execution completed ' },
    { sl_no: '05',start_date: '2024-06-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Success', info: 'Successfull execution completed ' },
    { sl_no: '06',start_date: '2024-05-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Failed',info: 'Failed execution completed '  },
    { sl_no: '07',start_date: '2024-06-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Failed',info: 'Failed execution completed '  },
    { sl_no: '08',start_date: '2024-06-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Failed',info: 'Failed execution completed '  },
    { sl_no: '09',start_date: '2024-06-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Failed',info: 'Failed execution completed '  },
    
  ];

  files_full= [
      {
        "fileName": "Invoice_Processing_Bot_Log.pdf",
        "fileType": "pdf",
        "fileSize": "1.2MB",
        "dateUploaded": "2024-06-01 10:15 AM (Saturday)"
      },
      {
        "fileName": "Customer_Service_Chat_Log.jpg",
        "fileType": "jpg",
        "fileSize": "2.5MB",
        "dateUploaded": "2024-06-02 11:20 AM (Sunday)"
      },
      {
        "fileName": "Sales_Data_Bot_Report.xlsx",
        "fileType": "xlsx",
        "fileSize": "3.0MB",
        "dateUploaded": "2024-06-03 12:25 PM (Monday)"
      },
      {
        "fileName": "HR_Onboarding_Presentation.pptx",
        "fileType": "pptx",
        "fileSize": "5.5MB",
        "dateUploaded": "2024-06-04 01:30 PM (Tuesday)"
      },
      {
        "fileName": "Marketing_Automation_Audio.mp3",
        "fileType": "mp3",
        "fileSize": "4.8MB",
        "dateUploaded": "2024-06-05 02:35 PM (Wednesday)"
      }
    ]
  

  files = [
    { name: 'Jr. Software Developer' },
    { name: 'Full Stack Java Developer' },
    { name: 'Product Manager Senior' },
    
  ];

  selectedLogs = [];

  // History Logs Variables
  filteredLogs = [];
  logSearchTerm: string = '';

  // Download files and File Table Variables
  filteredFiles = [...this.files_full];
  searchTerm: string = '';
  selectedFileType: string = '';
  selectedDate: string = '';
  selectedFiles: any[] = [];


  // Hostory -New code
  filteredLogsData: any[] = [];
  selectedDateLog: string = '';
  selectedStatus: string = '';

  // Show hide variables 
  showMiniLayout = false;
  showMoreLogs = false;
  showMoreFiles = false;
  dummyBotName="AI Agent - EPSoft"
  dataforbot="This AI Agent assists with various automated tasks and provides insights based on data analysis. It is designed to enhance productivity and streamline workflows and streamline workflows and streamline workflows."

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private spinner: LoaderService,
    private rest_api: PredefinedBotsService,
    private toaster: ToasterService,
    private toastMessage: toastMessages
    
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.bot = navigation?.extras.state?.bot;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const productId = params['id'];
      if (productId) {
        this.getPredefinedBotsList(productId);
      }
    });

    this.files_full.sort((a, b) => new Date(b.dateUploaded).getTime() - new Date(a.dateUploaded).getTime());
    this.filteredFiles = [...this.files_full];

    this.filterLogsData();
  }
 
  getPredefinedBotsList(productId: string) {
    this.spinner.show();
    this.rest_api.getPredefinedBotsList().subscribe((res: any) => {
      this.predefined_botsList = res.data.map(bot => ({
        ...bot,
        details: bot.description || 'This AI Agent assists with various automated tasks and provides insights based on data analysis. It is designed to enhance productivity and streamline workflows and streamline workflows.'
      }));
      this.bot = this.predefined_botsList.find(bot => bot.productId === productId);
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.toaster.showError(this.toastMessage.apierror);
    });
  }

  onclickBot() {
    // this.router.navigate(["/pages/predefinedbot/predefinedforms"], { queryParams: { type: "update", id: "7896" } });
    // this.router.navigate(["/pages/predefinedbot/predefinedforms"], { queryParams: { type: "create", id: item.productId } });
    // this.router.navigate(["/pages/predefinedbot/predefinedforms"], { queryParams: { type: "create", id: "prod_PdiLNkF4ZbHkgj" } });
    this.router.navigate(["/pages/predefinedbot/predefinedforms"], { queryParams: { type: "create", id: this.bot?.productId } });
        // this.router.navigate(["/pages/predefinedbot/predefinedforms"], { queryParams: { type: "create", id: item.productId, name: item.predefinedBotName, desc: item.details } });

  }

  toggleFileSelection(file: any): void {
    const index = this.selectedFiles.indexOf(file);
    if (index > -1) {
      this.selectedFiles.splice(index, 1);
      console.log("All Files Removed: " ,this.selectedFiles)
    } else {
      this.selectedFiles.push(file);
      console.log("All Files Added: " ,this.selectedFiles)
    }
  }

  selectAllFiles(event: any): void {
    if (event.target.checked) {
      this.selectedFiles = [...this.filteredFiles];
      console.log("All Files Selected" ,this.selectedFiles)
    } else {
      this.selectedFiles = [];
    }
  }

  isFileSelected(file: any): boolean {
    return this.selectedFiles.includes(file);
  }

  // File Method
  applyFilters(): void {
    this.filteredFiles = this.files_full.filter(file => {
      const matchesSearchTerm = this.searchTerm ? file.fileName.toLowerCase().includes(this.searchTerm.toLowerCase()) : true;
      const matchesFileType = this.selectedFileType ? file.fileType === this.selectedFileType : true;
      const matchesDate = this.selectedDate ? file.dateUploaded.startsWith(this.selectedDate) : true;
      return matchesSearchTerm && matchesFileType && matchesDate;
    });
  }

  downloadSelectedFiles(){

  }

  // filterLogsData(): void {
  //   if (this.selectedDateLog) {
  //     this.filteredLogsData = this.logs_full.filter(log =>
  //       log.start_date.startsWith(this.selectedDateLog)
  //     );
  //   } else {
  //     this.filteredLogsData = [...this.logs_full];
  //   }
  // }

  filterLogsData(): void {
    let filteredLogs = [...this.logs_full];

    if (this.selectedDateLog) {
      filteredLogs = filteredLogs.filter(log =>
        log.start_date.startsWith(this.selectedDateLog)
      );
    }

    if (this.selectedStatus) {
      filteredLogs = filteredLogs.filter(log =>
        log.status === this.selectedStatus
      );
    }

    // Sort the filtered logs in decreasing order based on start date
    filteredLogs.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());

    this.filteredLogsData = filteredLogs;
  }

  downloadLogs(){

  }

  handleBotPlayer () {
    this.runPlayer = !this.runPlayer
  }
 
  toggleAccordion() {
    this.isAccordionExpanded = !this.isAccordionExpanded;
  }

  toggleItem(item: any) {
    item.expanded = !item.expanded;
  }

  showLessLogs(){
    this.showMiniLayout=!this.showMiniLayout
    this.showMoreLogs=!this.showMoreLogs
  }

  showLessFiles(){
    this.showMiniLayout=!this.showMiniLayout
    this.showMoreFiles=!this.showMoreFiles
  }

  loadMoreLogs(): void {
    this.showMiniLayout=!this.showMiniLayout
    this.showMoreLogs=!this.showMoreLogs
  }

  loadMoreFiles(): void {
    this.showMiniLayout=!this.showMiniLayout
    this.showMoreFiles=!this.showMoreFiles

  }

  uploadData(): void {
  }

  deleteData(): void {
  }

  renewBtns(){
  }
}
