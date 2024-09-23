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
import * as XLSX from 'xlsx';
import { ConfirmationService } from 'primeng/api';

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
      expanded: false
    }
  ];

  logs_full:any[]=[]
  
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
  itemsPerPage: number = 7;

  currentPageFiles: number = 1;
  itemsPerPageFiles: number = 5;
  totalPagesFiles: number = 0;
  displayedFiles: any[] = [];

  // Subscription- Dates 
  subscription_dates;
  rem_days=''

  agent_drop_list:any;
  current_agent_details:any;

  // New response Data 
  newResponseData:any[]=[];

  // Run, Configure and Stop
  isConfig:boolean=false;
  enabledRun:boolean=false;
  loading: boolean = false;
  isScheduled: boolean = false;
  isAgentSelected: boolean = false ;
  remaining_agents: any;
  // FileTypes for the Agent Files DOwnload 
  sortOrder: boolean = true;
  fileTypes = [
    { value: '', label: 'All Types' },
    { value: 'pdf', label: 'PDF' },
    { value: 'jpg', label: 'JPG' },
    { value: 'jpeg', label: 'JPEG' },
    { value: 'png', label: 'PNG' },
    { value: 'gif', label: 'GIF' },
    { value: 'xlsx', label: 'XLSX' },
    { value: 'xls', label: 'XLS' },
    { value: 'pptx', label: 'PPTX' },
    { value: 'ppt', label: 'PPT' },
    { value: 'mp3', label: 'MP3' },
    { value: 'mp4', label: 'MP4' },
    { value: 'wav', label: 'WAV' },
    { value: 'zip', label: 'ZIP' },
    { value: 'rar', label: 'RAR' },
    { value: 'tar', label: 'TAR' },
    { value: 'gz', label: 'GZ' },
    { value: 'py', label: 'PY' },
    { value: 'epub', label: 'EPUB' },
    { value: 'docx', label: 'DOCX' },
    { value: 'doc', label: 'DOC' },
    { value: 'txt', label: 'TXT' },
    { value: 'csv', label: 'CSV' },
    { value: 'xml', label: 'XML' },
    { value: 'html', label: 'HTML' },
    { value: 'json', label: 'JSON' }
  ];


  // changes for btn view
  btn_style: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private spinner: LoaderService,
    private rest_api: PredefinedBotsService,
    private toaster: ToasterService,
    private toastMessage: toastMessages,
    private confirmationService: ConfirmationService
    
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.bot = navigation?.extras.state?.bot;

    // Added params for Buttons DEMO
    this.route.queryParams.subscribe(params => {
      this.btn_style = params['style'] || "type1";

      if (!params['style']) {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { style: 'type1' },
          queryParamsHandling: 'merge'
        });
      }
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const productId = params['id'];
      if (productId) {
        this.product_id=productId
        this.getPredefinedBotsList(this.product_id);
      }
    });

    // this.getAiAgentUpdateForm();
    this.updateFilePagination();
  }

  refreshAgentDashboard(){
    this.getPredefinedBotsList(this.product_id);
  }

  aiAgentDetails(){
    this.spinner.show();
    this.rest_api.aiAgentDetails().subscribe((res: any) => {
      this.newResponseData=res.data
      const agent = this.newResponseData.find(agent => agent.productId === this.product_id);

      if (agent) {
        this.current_agent_details = agent;
        this.remaining_exe = agent.remaining_executions;
        this.remaining_agents = agent.remaining_agents;
        this.isConfig=this.current_agent_details.is_config_enable
        const subscriptionDate = agent.subscriptionData[0];
        this.subscription_dates = subscriptionDate;
        this.rem_days = this.daysBetweenPlan(
          subscriptionDate.subscription_created_at, 
          subscriptionDate.subscription_expiry_at
        );

        this.getAIAgentHistory(this.product_id)
        this.agentDropdownList(this.current_agent_details);
      } else {
        this.current_agent_details = undefined; 
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.toaster.showError(this.toastMessage.apierror);
    });
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
      this.aiAgentDetails()
      this.getAgentFiles(this.bot.predefinedUUID);
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.toaster.showError(this.toastMessage.apierror);
    });
  }

  onclickBot() {
    console.log("Selected Drop Agent: ", this.selected_drop_agent)

    if(this.isConfig && (this.selected_drop_agent === null || this.selected_drop_agent === undefined)){
      this.router.navigate(["/pages/aiagent/form"], { queryParams: { type: "create", id: this.bot?.productId } });
    }
    else{
      this.router.navigate(["/pages/aiagent/form"], { queryParams: { type: "edit", id: this.bot?.productId, agent_id:this.selected_drop_agent.predefinedOrchestrationBotId } });
      // this.toaster.toastSuccess(`Navigating to Update Agent${this.selected_drop_agent.predefinedOrchestrationBotId}`)
    }
    
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
            log.startTS.startsWith(this.selectedDateLog)
        );
    }

    if (this.selectedStatus) {
        filteredLogs = filteredLogs.filter(log =>
            log.status === this.selectedStatus
        );
    }

    filteredLogs.sort((a, b) => new Date(b.startTS).getTime() - new Date(a.startTS).getTime());
    this.filteredLogsData = filteredLogs;
    this.currentPage = 1;
    this.updateVisibleLogs();
  }

  sortLogs(): void {
    this.filteredLogsData.sort((a, b) => {
      if (this.sortOrder) {
        return a.agentName.localeCompare(b.agentName);
      } else {
        return b.agentName.localeCompare(a.agentName);
      }
    });
    this.updateVisibleLogs();
    this.sortOrder = !this.sortOrder;
    
  }

  toggleAgentOrder(): void {
    this.sortLogs();
  }

downloadLogs(): void {
  this.spinner.show();
  try {
      const logs = this.filteredLogsData;
      const data = logs.map(log => ({
          Agent: log.agentName,
          'Start Date': new Date(log.startTS).toLocaleString(),
          'End Date': new Date(log.endTS).toLocaleString(),
          Status: log.status,
          Info: log.info ?? 'No Info Found'
      }));

      // excel creating for history 
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const wb: XLSX.WorkBook = { Sheets: { 'history': ws }, SheetNames: ['history'] };
      const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, `${this.bot.predefinedBotName}-history`);

      this.toaster.toastSuccess(`${this.bot.predefinedBotName} - Agent History Downloaded Successfully`);
  } catch (error) {
      this.toaster.showError("Failed to Download History");
  } finally {
      this.spinner.hide();
  }
}

saveAsExcelFile(buffer: any, fileName: string): void {
  try {
      const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
      FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  } catch (error) {
      throw error;
  }
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
      console.log("Agent Files: ", res)
      this.file = res.data?res.data:[];
      this.filteredFiles=res.data;
      this.updateFilePagination()
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.toaster.showError(this.toastMessage.apierror);
    });
  }

  deleteAgentFiles(){
    if (this.selectedFiles.length>=1) {
      this.spinner.show();
      this.rest_api.deleteAgentFIles(this.selectedFiles).subscribe((res: any) => {
        this.getPredefinedBotsList(this.product_id);
        this.selectedFiles=[];
        this.spinner.hide();
        this.toaster.toastSuccess(`${this.bot.predefinedBotName} - Agent files Deleted Successfully..`)
      }, err => {
        this.spinner.hide();
        this.toaster.showError(this.toastMessage.apierror);
      });
    } else {
      this.toaster.showWarn("Please select the Files.")
    }
  }

  downloadAgentFiles() {
    if (this.selectedFiles.length>=1) {
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
                this.toaster.toastSuccess(`${this.bot.predefinedBotName} - Agent files Downloaded Successfully..`);
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
                this.toaster.toastSuccess(`${this.bot.predefinedBotName} - Agent files Downloaded Successfully..`);
              }
            } else {
              this.toaster.showError("Error Downloading Files.");
            }
          } else {
            this.toaster.showError("Error Downloading Files.");
          }
          this.spinner.hide();
        },
        (error) => {
          this.toaster.showError("Error");
          this.spinner.hide();
        }
      );
    } else {
      this.toaster.showWarn("Please select the Files.")
    }
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
    this.updateVisibleLogs();
}

goToFirstPage(): void {
    this.currentPage = 1;
    this.updateVisibleLogs();
}

goToLastPage(): void {
    const totalPages = Math.ceil(this.filteredLogsData.length / this.itemsPerPage);
    this.currentPage = totalPages;
    this.updateVisibleLogs();
}

goToNextPage(): void {
    const totalPages = Math.ceil(this.filteredLogsData.length / this.itemsPerPage);
    if (this.currentPage < totalPages) {
        this.currentPage++;
        this.updateVisibleLogs();
    }
}

goToPreviousPage(): void {
    if (this.currentPage > 1) {
        this.currentPage--;
        this.updateVisibleLogs();
    }
}

  new_array:any[]=[];

  getVisibleLogs(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredLogsData.slice(startIndex, endIndex);
  }

  updateVisibleLogs(): void {
    this.new_array = this.getVisibleLogs();
  }

  renewBtns(){
    this.toaster.toastSuccess("Please contact EPsoft")
  }

  updateFilePagination(): void {
    this.totalPagesFiles = Math.ceil(this.filteredFiles.length / this.itemsPerPageFiles);
    const startIndex = (this.currentPageFiles - 1) * this.itemsPerPageFiles;
    const endIndex = this.currentPageFiles * this.itemsPerPageFiles;
    this.displayedFiles = this.filteredFiles.slice(startIndex, endIndex);
  }

  onAgentChange(event: any): void {
    this.isConfig=true
    this.selected_drop_agent = event.value;
    this.enabledRun=true
    this.isScheduled = this.selected_drop_agent.scheduleBot;
    this.isAgentSelected = true;
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

  getAIAgentHistory(id) {
    this.spinner.show();
    this.rest_api.aiAgentHistory(id).subscribe((res: any) => {

        this.logs_full = res.data;
        this.logs_full.sort((a, b) => {
            return new Date(b.startTS).getTime() - new Date(a.startTS).getTime();
        });

        this.filteredLogsData = this.logs_full.slice(); 
        this.new_array = this.logs_full.slice(0, this.itemsPerPage); 

        this.spinner.hide();
    }, err => {
        this.spinner.hide();
        this.toaster.showError(this.toastMessage.apierror);
    });
  }

  runAiAgent(event){
    this.spinner.show()
    let id=this.selected_drop_agent.predefinedOrchestrationBotId
    this.rest_api.startPredefinedBot(id,'').subscribe((res: any) => {
    this.spinner.hide();
      if (res.errorCode==4200) {
        this.toaster.toastSuccess("Agent Execution Started")
        this.remaining_exe=""
        this.new_array=[]
        this.logs_full=[]
         this.loadAgentDetails()
      }
      else if(res.status){
        this.toaster.toastSuccess(res.status)
        this.remaining_exe=""
        this.new_array=[]
        this.logs_full=[]
        this.loadAgentDetails()
      }
      else{
        this.toaster.showInfo(res.errorMessage)
      }
    }, err => {
      this.spinner.hide();
      this.toaster.showError(this.toastMessage.apierror);
    });
  } 

  // getAiAgentUpdateForm(){
  //   this.spinner.show()
  //   this.rest_api.getAiAgentUpdateForm().subscribe((res: any) => {
  //     this.spinner.hide(); 
  //   }, err => {
  //     this.spinner.hide();
  //     this.toaster.showError(this.toastMessage.apierror);
  //   });
  // }

  loadAgentDetails() {
    this.getPredefinedBotsList(this.product_id)
    this.loading = true;
    this.isConfig=false
    this.enabledRun=false
    this.isAgentSelected = false;
    setTimeout(() => {
      this.aiAgentDetails();
      this.getAIAgentHistory(this.product_id);
      this.loading = false;
    }, 6000);
  }


  deleteAiAgent() {
    console.log(this.selected_drop_agent)
    let botName = this.selected_drop_agent.automationName
    this.confirmationService.confirm({
      message: "Do you want to delete this agent? This can't be undo.",
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
        this.rest_api.deletePredefinedBot(this.selected_drop_agent.predefinedOrchestrationBotId).subscribe(res => {
          this.spinner.hide();
          this.toaster.showSuccess(botName,"delete")
          // this.getListOfItems();
          this.selected_drop_agent = null;
          this.agent_drop_list=""
          this.isConfig=false
          this.enabledRun=false
          this.isAgentSelected = false;
          this.loadAgentDetails();
          this.agentDropdownList(this.current_agent_details);
        }, err => {
          this.spinner.hide();
          this.toaster.showError(this.toastMessage.apierror)
        });
      },
      reject: (type) => { }
    });
  }

  clearDropdown() {
    this.selected_drop_agent = null;
    this.isAgentSelected = false;
  }
  
}
