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
  remaining_exe="";
  UUID="";
  selected_agent:string;
  selected_drop_agent:any;

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
    { sl_no: '09',start_date: '2024-06-01 07:37 AM', end_date: '2024-06-01 08:37 AM', status: 'Failed',info: 'Failed execution completed '  },
    ];
  
  file: any[] = [];
  selectedLogs = [];

  // History Logs Variables
  filteredLogs = [];
  logSearchTerm: string = '';

  // Download files and File Table Variables
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
  dummyBotName=""
  dataforbot=""

  // Pagination
  totalPages=0
  currentPage: number = 1;
  itemsPerPage: number = 6;

  currentPageFiles: number = 1;
  itemsPerPageFiles: number = 5;
  totalPagesFiles: number = 0;
  displayedFiles: any[] = [];

  // Subscription- Dates 
  subscription_dates;
  rem_days=''

  agent_drop_list:any;
  current_agent_details:any;

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
        this.current_agent_details=this.getAgentDetailsByProductId(this.product_id)
        console.log("New Agent Details: ",this.current_agent_details)

        // Remaining Agents
        this.remaining_exe=this.current_agent_details.remaining_agents

        // Subscription Dates 
        this.subscription_dates=this.current_agent_details.subscriptionData[0]
        this.rem_days=this.daysBetweenPlan(this.subscription_dates?.subscription_created_at,this.subscription_dates?.subscription_expiry_at)
        this.agentDropdownList(this.current_agent_details)
      }
    });

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
        details: bot.description || 'No Description Found.'
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
    this.router.navigate(["/pages/predefinedbot/predefinedforms"], { queryParams: { type: "create", id: this.bot?.productId } });
  }

  toggleFileSelection(file: any): void {
    const index = this.selectedFiles.indexOf(file);
    if (index > -1) {
      this.selectedFiles.splice(index, 1);
    } else {
      this.selectedFiles.push(file);
    }
  }

  selectAllFiles(event: any): void {
    if (event.target.checked) {
      this.selectedFiles = [...this.filteredFiles];
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
        this.toaster.showError("Error");
        this.spinner.hide();
      }
    );
  }

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
    this.selected_drop_agent = event.value;
    console.log('Selected Drop Agent Details:', this.selected_drop_agent);
  }
 
  responseData=
  {
    "data": [
      {
        "productId": "prod_Q7bUSFihJEtZYR",
        "subscriptionData": [
          {
            "subscription_id": "sub_1PHOoISGPu394velCwhpJZ40",
            "subscription_created_at": "2024-05-17 11:19:20.956",
            "subscription_expiry_at": "2025-05-17 11:18:50"
          }
        ],
        "total_agents": 10,
        "remaining_agents": 6,
        "agentBotDetails": [
          {
            "predefinedOrchestrationBotId": 384,
            "automationName": "Ajaystest",
            "predefinedBotType": "RFP",
            "schedule": "",
            "productId": "prod_Q7bUSFihJEtZYR",
            "quantity": 2,
            "rpaPredefinedBotDetails": [
              {
                "botId": 8691,
                "botName": "RFPBotOne__Ajaystest",
                "bot_order": 1
              }
            ],
            "scheduleBot": false
          },
          {
            "predefinedOrchestrationBotId": 411,
            "automationName": "agents",
            "predefinedBotType": "RFP",
            "schedule": "",
            "productId": "prod_Q7bUSFihJEtZYR",
            "quantity": 2,
            "rpaPredefinedBotDetails": [
              {
                "botId": 8737,
                "botName": "RFPBotOne__agents",
                "bot_order": 1
              }
            ],
            "scheduleBot": false
          },
          {
            "predefinedOrchestrationBotId": 412,
            "automationName": "RFP",
            "predefinedBotType": "RFP",
            "schedule": "",
            "productId": "prod_Q7bUSFihJEtZYR",
            "quantity": 2,
            "rpaPredefinedBotDetails": [
              {
                "botId": 8738,
                "botName": "RFPBotOne__RFP",
                "bot_order": 1
              }
            ],
            "scheduleBot": false
          },
          {
            "predefinedOrchestrationBotId": 414,
            "automationName": "RFP_Upload",
            "predefinedBotType": "RFP",
            "schedule": "",
            "productId": "prod_Q7bUSFihJEtZYR",
            "quantity": 2,
            "rpaPredefinedBotDetails": [
              {
                "botId": 8741,
                "botName": "RFPBotOne__RFP_Upload",
                "bot_order": 1
              }
            ],
            "scheduleBot": false
          }
        ],
        "is_config_enable": true,
        "agentUUID": "Pred_RFP",
        "agentName": "RFP",
        "description": "Request for Proposal (RFP) is a document issued by an organization to solicit proposals from potential vendors or service providers for a specific project or service. It outlines the project's requirements, objectives, and evaluation criteria, providing detailed information to help vendors understand what is needed and how to respond. The RFP process helps organizations compare different proposals to select the best supplier based on criteria such as cost, experience, and quality."
      },
      {
        "productId": "prod_PdiLNkF4ZbHkgj",
        "subscriptionData": [
          {
            "subscription_id": "sub_1PBW2fSGPu394velyvN4FnZV",
            "subscription_created_at": "2024-05-01 05:49:46.526",
            "subscription_expiry_at": "2025-05-01 05:49:21"
          }
        ],
        "total_agents": 0,
        "remaining_agents": 0,
        "agentBotDetails": [],
        "is_config_enable": false,
        "agentUUID": "Pred_Recruitment",
        "agentName": "Recruitment",
        "description": "Recruitment is the process of finding and hiring the best-qualified candidates for job openings. It involves advertising, interviewing, and selecting individuals to join an organization."
      },
      {
        "productId": "prod_PdiMYXuWmxy9dt",
        "subscriptionData": [
          {
            "subscription_id": "sub_1PDVOCSGPu394velOQZARt5u",
            "subscription_created_at": "2024-05-06 17:32:09.544",
            "subscription_expiry_at": "2025-05-06 17:31:48"
          }
        ],
        "total_agents": 3,
        "remaining_agents": 0,
        "agentBotDetails": [
          {
            "predefinedOrchestrationBotId": 419,
            "automationName": "WithScheduler",
            "predefinedBotType": "Marketing",
            "schedule": "[{\"intervalId\":\"6bc68ef8-4c7f-4b68-0743-789f7063f058\",\"scheduleInterval\":\"*/2 * * * *\",\"startDate\":\"2024,6,10,10,38\",\"endDate\":\"2024,6,10,23,59\",\"timezone\":\"Asia/Kolkata\",\"save_status\":\"unsaved\",\"processId\":null,\"processName\":\"\",\"envId\":\"\",\"check\":false}]",
            "productId": "prod_PdiMYXuWmxy9dt",
            "quantity": 1,
            "rpaPredefinedBotDetails": [
              {
                "botId": 8756,
                "botName": "MarketingOne__WithScheduler",
                "bot_order": 1
              },
              {
                "botId": 8755,
                "botName": "MarketingTwo__WithScheduler",
                "bot_order": 2
              }
            ],
            "scheduleBot": true
          },
          {
            "predefinedOrchestrationBotId": 437,
            "automationName": "aaaaa",
            "predefinedBotType": "Marketing",
            "schedule": "",
            "productId": "prod_PdiMYXuWmxy9dt",
            "quantity": 1,
            "rpaPredefinedBotDetails": [
              {
                "botId": 8807,
                "botName": "MarketingTwo__aaaaa",
                "bot_order": 2
              },
              {
                "botId": 8808,
                "botName": "MarketingOne__aaaaa",
                "bot_order": 1
              }
            ],
            "scheduleBot": false
          },
          {
            "predefinedOrchestrationBotId": 418,
            "automationName": "WithOutScheduler",
            "predefinedBotType": "Marketing",
            "schedule": "",
            "productId": "prod_PdiMYXuWmxy9dt",
            "quantity": 1,
            "rpaPredefinedBotDetails": [
              {
                "botId": 8754,
                "botName": "MarketingOne__WithOutScheduler",
                "bot_order": 1
              },
              {
                "botId": 8753,
                "botName": "MarketingTwo__WithOutScheduler",
                "bot_order": 2
              }
            ],
            "scheduleBot": false
          }
        ],
        "is_config_enable": false,
        "agentUUID": "Pred_Marketing",
        "agentName": "Marketing",
        "description": "Marketing involves promoting products or services to attract and retain customers. It includes advertising, market research, and strategic communication efforts."
      },
      {
        "productId": "prod_Q6W12nAKwKf07R",
        "subscriptionData": [
          {
            "subscription_id": "sub_1PL0u0SGPu394veltLNiRjqc",
            "subscription_created_at": "2024-05-27 10:35:53.513",
            "subscription_expiry_at": "2024-06-27 10:35:40"
          }
        ],
        "total_agents": 10,
        "remaining_agents": 1,
        "agentBotDetails": [
          {
            "predefinedOrchestrationBotId": 404,
            "automationName": "Finance",
            "predefinedBotType": "ClientOnbording",
            "schedule": "",
            "productId": "prod_Q6W12nAKwKf07R",
            "quantity": 2,
            "rpaPredefinedBotDetails": [
              {
                "botId": 8725,
                "botName": "ClientOnbording__Finance",
                "bot_order": 1
              }
            ],
            "scheduleBot": false
          },
          {
            "predefinedOrchestrationBotId": 405,
            "automationName": "Finance",
            "predefinedBotType": "ClientOnbording",
            "schedule": "",
            "productId": "prod_Q6W12nAKwKf07R",
            "quantity": 2,
            "rpaPredefinedBotDetails": [
              {
                "botId": 8726,
                "botName": "ClientOnbording__Finance",
                "bot_order": 1
              }
            ],
            "scheduleBot": false
          },
          {
            "predefinedOrchestrationBotId": 407,
            "automationName": "Finance",
            "predefinedBotType": "ClientOnbording",
            "schedule": "",
            "productId": "prod_Q6W12nAKwKf07R",
            "quantity": 2,
            "rpaPredefinedBotDetails": [
              {
                "botId": 8729,
                "botName": "ClientOnbording__Finance",
                "bot_order": 1
              }
            ],
            "scheduleBot": false
          },
          {
            "predefinedOrchestrationBotId": 408,
            "automationName": "Finance",
            "predefinedBotType": "ClientOnbording",
            "schedule": "",
            "productId": "prod_Q6W12nAKwKf07R",
            "quantity": 2,
            "rpaPredefinedBotDetails": [
              {
                "botId": 8730,
                "botName": "ClientOnbording__Finance",
                "bot_order": 1
              }
            ],
            "scheduleBot": false
          },
          {
            "predefinedOrchestrationBotId": 399,
            "automationName": "Finance",
            "predefinedBotType": "ClientOnbording",
            "schedule": "",
            "productId": "prod_Q6W12nAKwKf07R",
            "quantity": 2,
            "rpaPredefinedBotDetails": [
              {
                "botId": 8720,
                "botName": "ClientOnbording__Finance",
                "bot_order": 1
              }
            ],
            "scheduleBot": false
          },
          {
            "predefinedOrchestrationBotId": 400,
            "automationName": "Finance",
            "predefinedBotType": "ClientOnbording",
            "schedule": "",
            "productId": "prod_Q6W12nAKwKf07R",
            "quantity": 2,
            "rpaPredefinedBotDetails": [
              {
                "botId": 8721,
                "botName": "ClientOnbording__Finance",
                "bot_order": 1
              }
            ],
            "scheduleBot": false
          },
          {
            "predefinedOrchestrationBotId": 401,
            "automationName": "Finance",
            "predefinedBotType": "ClientOnbording",
            "schedule": "",
            "productId": "prod_Q6W12nAKwKf07R",
            "quantity": 2,
            "rpaPredefinedBotDetails": [
              {
                "botId": 8722,
                "botName": "ClientOnbording__Finance",
                "bot_order": 1
              }
            ],
            "scheduleBot": false
          },
          {
            "predefinedOrchestrationBotId": 402,
            "automationName": "Finance",
            "predefinedBotType": "ClientOnbording",
            "schedule": "",
            "productId": "prod_Q6W12nAKwKf07R",
            "quantity": 2,
            "rpaPredefinedBotDetails": [
              {
                "botId": 8723,
                "botName": "ClientOnbording__Finance",
                "bot_order": 1
              }
            ],
            "scheduleBot": false
          },
          {
            "predefinedOrchestrationBotId": 403,
            "automationName": "Finance",
            "predefinedBotType": "ClientOnbording",
            "schedule": "",
            "productId": "prod_Q6W12nAKwKf07R",
            "quantity": 2,
            "rpaPredefinedBotDetails": [
              {
                "botId": 8724,
                "botName": "ClientOnbording__Finance",
                "bot_order": 1
              }
            ],
            "scheduleBot": false
          }
        ],
        "is_config_enable": true,
        "agentUUID": "Pred_ClientOnboarding",
        "agentName": "Client Onboarding",
        "description": "Client onboarding is the process of welcoming new clients and integrating them into a company's services. It includes initial setup, training, and providing necessary information to ensure a smooth start."
      }
    ]
  }

  getAgentDetailsByProductId(productId: string) {
    for (const agent of this.responseData.data) {
      if (agent.productId === productId) {
        return agent;
      }
    }
    return null;
  }

  agentDropdownList(agent_details){
    this.agent_drop_list = agent_details.agentBotDetails.map(bot => ({
      label: bot.automationName,
      value: bot
    }));
  }

  daysBetweenPlan(startDate: string, endDate: string): string {
    const today = new Date();
    const end = new Date(endDate);

    const diffTime = Math.abs(end.getTime() - today.getTime());
    let totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const years = Math.floor(totalDays / 365);
    totalDays %= 365;
    const months = Math.floor(totalDays / 30);
    const days = totalDays % 30;

    let result = '';
    if (years > 0) {
      result += `${years} year${years > 1 ? 's' : ''} `;
    }
    if (months > 0) {
      result += `${months} month${months > 1 ? 's' : ''} `;
    }
    if (days > 0) {
      result += `${days} day${days > 1 ? 's' : ''}`;
    }
    return result.trim();
  }

}
