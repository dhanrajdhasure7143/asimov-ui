import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { toastMessages } from 'src/app/shared/model/toast_messages';
import { PredefinedBotsService } from '../../services/predefined-bots.service';
import * as JSZip from "jszip";
import * as FileSaver from "file-saver";
import { saveAs } from "file-saver";

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
  UUID="";
  // selectedFiles = [];

  // Agents List
  agents_list: any[] = [
    { name: 'Dummy AI Agent', agent_id: 'dummy_ai_agent' },
    { name: 'Automation Bot', agent_id: 'automation_bot' },
  ];
  selected_agent:string;

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
    { sl_no: '01',start_date: '2024-07-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Success' , info: 'Successfull execution completed, Successfull execution completed, Successfull execution completed, Successfull execution completed. '},
    { sl_no: '02',start_date: '2024-06-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Failed', info: 'Filed execution completed ' },
    { sl_no: '03',start_date: '2024-06-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Success', info: 'Successfull execution completed ' },
    { sl_no: '04',start_date: '2024-08-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Success', info: 'Successfull execution completed ' },
    { sl_no: '05',start_date: '2024-06-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Success', info: 'Successfull execution completed ' },
    { sl_no: '06',start_date: '2024-05-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Failed',info: 'Failed execution completed '  },
    { sl_no: '07',start_date: '2024-06-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Failed',info: 'Failed execution completed '  },
    { sl_no: '08',start_date: '2024-06-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Failed',info: 'Failed execution completed '  },
    { sl_no: '09',start_date: '2024-06-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Failed',info: 'Failed execution completed '  },
    { sl_no: '05',start_date: '2024-06-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Success', info: 'Successfull execution completed ' },
    { sl_no: '06',start_date: '2024-05-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Failed',info: 'Failed execution completed '  },
    { sl_no: '07',start_date: '2024-06-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Failed',info: 'Failed execution completed '  },
    { sl_no: '08',start_date: '2024-06-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Failed',info: 'Failed execution completed '  },
    { sl_no: '09',start_date: '2024-06-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Failed',info: 'Failed execution completed '  },
    { sl_no: '05',start_date: '2024-06-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Success', info: 'Successfull execution completed ' },
    { sl_no: '06',start_date: '2024-05-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Failed',info: 'Failed execution completed '  },
    { sl_no: '07',start_date: '2024-06-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Failed',info: 'Failed execution completed '  },
    { sl_no: '08',start_date: '2024-06-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Failed',info: 'Failed execution completed '  },
    { sl_no: '09',start_date: '2024-06-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Failed',info: 'Failed execution completed '  },
    { sl_no: '05',start_date: '2024-06-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Success', info: 'Successfull execution completed ' },
    { sl_no: '06',start_date: '2024-05-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Failed',info: 'Failed execution completed '  },
    { sl_no: '07',start_date: '2024-06-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Failed',info: 'Failed execution completed '  },
    { sl_no: '08',start_date: '2024-06-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Failed',info: 'Failed execution completed '  },
    { sl_no: '09',start_date: '2024-06-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Failed',info: 'Failed execution completed '  },
    { sl_no: '05',start_date: '2024-06-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Success', info: 'Successfull execution completed ' },
    { sl_no: '06',start_date: '2024-05-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Failed',info: 'Failed execution completed '  },
    { sl_no: '07',start_date: '2024-06-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Failed',info: 'Failed execution completed '  },
    { sl_no: '08',start_date: '2024-06-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Failed',info: 'Failed execution completed '  },
    { sl_no: '09',start_date: '2024-06-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Failed',info: 'Failed execution completed '  },
    { sl_no: '05',start_date: '2024-06-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Success', info: 'Successfull execution completed ' },
    { sl_no: '06',start_date: '2024-05-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Failed',info: 'Failed execution completed '  },
    { sl_no: '07',start_date: '2024-06-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Failed',info: 'Failed execution completed '  },
    { sl_no: '08',start_date: '2024-06-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Failed',info: 'Failed execution completed '  },
    { sl_no: '09',start_date: '2024-06-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Failed',info: 'Failed execution completed '  },
    { sl_no: '05',start_date: '2024-06-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Success', info: 'Successfull execution completed ' },
    { sl_no: '06',start_date: '2024-05-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Failed',info: 'Failed execution completed '  },
    { sl_no: '07',start_date: '2024-06-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Failed',info: 'Failed execution completed '  },
    { sl_no: '08',start_date: '2024-06-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Failed',info: 'Failed execution completed '  },
    { sl_no: '09',start_date: '2024-06-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Failed',info: 'Failed execution completed '  },
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
  

  // files = [
  //   { name: 'Jr. Software Developer' },
  //   { name: 'Full Stack Java Developer' },
  //   { name: 'Product Manager Senior' },
    
  // ];
  file: any[] = [];

  selectedLogs = [];

  // History Logs Variables
  filteredLogs = [];
  logSearchTerm: string = '';

  // Download files and File Table Variables
  // filteredFiles = [...this.files_full];
  filteredFiles :any[]=[];
  searchTerm: string = '';
  selectedFileType: string = '';
  selectedDate: string = '';
  selectedFiles: any[] = [];


  // Hostory -New code
  filteredLogsData: any[] = [];
  selectedDateLog: string = '';
  selectedStatus: string = '';
  product_id="";

  // Show hide variables 
  showMiniLayout = false;
  showMoreLogs = false;
  showMoreFiles = false;
  dummyBotName="AI Agent - EPSoft"
  dataforbot="This AI Agent assists with various automated tasks and provides insights based on data analysis. It is designed to enhance productivity and streamline workflows and streamline workflows and streamline workflows."

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 6;

  currentPageFiles: number = 1;
  itemsPerPageFiles: number = 5;
  totalPagesFiles: number = 0;
  displayedFiles: any[] = [];

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
        this.product_id=productId
        this.getPredefinedBotsList(this.product_id);
      }
    });

    // this.getAgentFiles();
    this.files_full.sort((a, b) => new Date(b.dateUploaded).getTime() - new Date(a.dateUploaded).getTime());
    // this.filteredFiles = [...this.files_full];

    this.filterLogsData();
    this.getPredefinedBotsList(this.product_id);
    this.updateFilePagination();
    console.log("Agent Selected : ",this.selected_agent)
  }
 
  getPredefinedBotsList(productId: string) {
    this.spinner.show();
    this.rest_api.getPredefinedBotsList().subscribe((res: any) => {
      this.predefined_botsList = res.data.map(bot => ({
        ...bot,
        details: bot.description || 'This AI Agent assists with various automated tasks and provides insights based on data analysis. It is designed to enhance productivity and streamline workflows and streamline workflows.'
      }));
      this.bot = this.predefined_botsList.find(bot => bot.productId === productId);
      this.UUID=this.bot.predefinedUUID
      // console.log("UUID: ",this.bot.predefinedUUID )
      this.getAgentFiles(this.bot.predefinedUUID);
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
      // console.log("All Files Removed: " ,this.selectedFiles)
    } else {
      this.selectedFiles.push(file);
      // console.log("All Files Added: " ,this.selectedFiles)
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
    this.displayedFiles = this.filteredFiles.filter(file => {
      const matchesSearchTerm = this.searchTerm ? file.originalFileName.toLowerCase().includes(this.searchTerm.toLowerCase()) : true;
      const matchesFileType = this.selectedFileType ? file.dataType === this.selectedFileType : true;
      const matchesDate = this.selectedDate ? file.uploadedDate.startsWith(this.selectedDate) : true;
      return matchesSearchTerm && matchesFileType && matchesDate;
    });


  }

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

    filteredLogs.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());

    this.filteredLogsData = filteredLogs;
    // this.currentPage = 1;
    // this.updatePagination();
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

  getAgentFiles(id: string) {
    this.spinner.show();
    this.rest_api.getAgentFiles(id).subscribe((res: any) => {
      // console.log("Date File", res);
      this.file = res.data;
      this.filteredFiles=res.data;
      this.updateFilePagination()
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.toaster.showError(this.toastMessage.apierror);
    });
  }

  deleteAgentFiles(){
    this.spinner.show();
    this.rest_api.deleteAgentFIles(this.selectedFiles).subscribe((res: any) => {
      // console.log("Delete File: ", res);
      this.getPredefinedBotsList(this.product_id);
      this.spinner.hide();
      this.toaster.showSuccess("Delete","delete")
    }, err => {
      this.spinner.hide();
      this.toaster.showError(this.toastMessage.apierror);
    });
  }

  downloadAgentFiles() {
    this.spinner.show();
    this.rest_api.downloadAgentFiles(this.selectedFiles).subscribe(
      (response: any) => {
        // console.log("Download API Call: ", response);
        if (response.code == 4200) {
          const resp_data = response.data;
          if (resp_data.length > 0) {
            if (resp_data.length == 1) {
              const fileName = resp_data[0].fileName;
              const fileData = resp_data[0].downloadedFile;
              const link = document.createElement("a");
              const extension = fileName.split('.').pop();
  
              link.download = fileName;
              link.href =
                extension === "png" || extension === "jpg" || extension === "svg" || extension === "gif"
                  ? `data:image/${extension};base64,${fileData}`
                  : `data:application/${extension};base64,${fileData}`;
  
              link.click();
              this.toaster.showSuccess("Success", "File downloaded successfully");
            } else {
              const zip = new JSZip();
              const fileNames = new Set();
  
              resp_data.forEach((value) => {
                let fileName = value.fileName;
                const fileData = value.downloadedFile;
                const extension = fileName.split('.').pop();
                const baseName = fileName.substring(0, fileName.lastIndexOf('.'));
                let counter = 1;
  
                while (fileNames.has(fileName)) {
                  fileName = `${baseName}_${counter}.${extension}`;
                  counter++;
                }
                fileNames.add(fileName);
                zip.file(fileName, fileData, { base64: true });
              });
  
              zip.generateAsync({ type: "blob" }).then((content) => {
                FileSaver.saveAs(content, `${this.bot.predefinedBotName}_AI_Agent_Files.zip`);
              });
              this.toaster.showSuccess("Success", "Files downloaded successfully");
            }
          } else {
            this.toaster.showError("Error");
          }
        } else {
          this.toaster.showError("Error");
        }
        this.spinner.hide();
      },
      (error) => {
        // console.error("Download API error: ", error);
        this.toaster.showError("Error");
        this.spinner.hide();
      }
    );
  }
  
  totalPages=0

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredLogsData.length / this.itemsPerPage);
    this.filteredLogsData = this.filteredLogsData.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }

  getPageNumbers(): number[] {
    const pageNumbers: number[] = [];
    const previousPage = this.currentPage - 1;
    const nextPage = this.currentPage + 1;

    if (previousPage > 0) {
      pageNumbers.push(previousPage);
    }

    pageNumbers.push(this.currentPage);

    if (nextPage <= this.totalPages) {
      pageNumbers.push(nextPage);
    }

    return pageNumbers;
  }

  getPageNumbersFiles(): number[] {
    const pageNumbers: number[] = [];
    const previousPage = this.currentPageFiles - 1;
    const nextPage = this.currentPageFiles + 1;

    if (previousPage > 0) {
      pageNumbers.push(previousPage);
    }

    pageNumbers.push(this.currentPageFiles);

    if (nextPage <= this.totalPagesFiles) {
      pageNumbers.push(nextPage);
    }

    return pageNumbers;
  }

  goToFirstPageFiles(): void {
    this.currentPageFiles = 1;
    this.updateFilePagination();
  }

  goToPreviousPageFiles(): void {
    if (this.currentPageFiles > 1) {
      this.currentPageFiles--;
      this.updateFilePagination();
    }
  }

  goToPageFiles(pageNumber: number): void {
    this.currentPageFiles = pageNumber;
    this.updateFilePagination();
  }

  goToNextPageFiles(): void {
    if (this.currentPageFiles < this.totalPagesFiles) {
      this.currentPageFiles++;
      this.updateFilePagination();
    }
  }

  goToLastPageFiles(): void {
    this.currentPageFiles = this.totalPagesFiles;
    this.updateFilePagination();
  }

  goToPage(pageNumber: number): void {
      this.currentPage = pageNumber;
  }

  goToFirstPage(): void {
      this.currentPage = 1;
  }

  goToLastPage(): void {
      const totalPages = Math.ceil(this.filteredLogsData.length / this.itemsPerPage);
      this.currentPage = totalPages;
  }

  goToNextPage(): void {
      const totalPages = Math.ceil(this.filteredLogsData.length / this.itemsPerPage);
      if (this.currentPage < totalPages) {
          this.currentPage++;
      }
  }

  goToPreviousPage(): void {
      if (this.currentPage > 1) {
          this.currentPage--;
      }
  }

  getVisibleLogs(): any[] {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.filteredLogsData.slice(startIndex, endIndex);
  }

  renewBtns(){

  }

  updateFilePagination(): void {
    this.totalPagesFiles = Math.ceil(this.filteredFiles.length / this.itemsPerPageFiles);
    const startIndex = (this.currentPageFiles - 1) * this.itemsPerPageFiles;
    const endIndex = this.currentPageFiles * this.itemsPerPageFiles;
    this.displayedFiles = this.filteredFiles.slice(startIndex, endIndex);
  }

  onAgentChange(event: any): void {
    this.selected_agent = event.value;
    console.log('Selected Agent ID:', this.selected_agent);
  }
}
