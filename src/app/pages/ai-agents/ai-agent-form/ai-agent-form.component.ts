import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { PredefinedBotsService } from '../../services/predefined-bots.service';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { toastMessages } from 'src/app/shared/model/toast_messages';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { Inplace } from "primeng/inplace";
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AiAgentConfigOverlayComponent } from '../ai-agent-config-overlay/ai-agent-config-overlay.component';
import * as JSZip from "jszip";
import * as FileSaver from "file-saver";
import { saveAs } from "file-saver";
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-ai-agent-form',
  templateUrl: './ai-agent-form.component.html',
  styleUrls: ['./ai-agent-form.component.css'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        height: '*',
        opacity: 1
      })),
      state('out', style({
        height: '0px',
        opacity: 0
      })),
      transition('in <=> out', animate('300ms ease-in-out'))
    ])
  ]
})
export class AiAgentFormComponent implements OnInit {
  @ViewChild("inplace") inplace!: Inplace;
  @ViewChild('aiAgentsConfig') aiAgentsConfig: AiAgentConfigOverlayComponent;
  processName:string;
  currentPage = 1;
  fieldsPerPage = 30;
  formFields = [];
  predefinedBotsForm: FormGroup;
  pages: number[] = [];
  nodes: number[] = [];
  isShowForm:boolean=false;
  items: MenuItem[]=[];
  activeIndex: number = undefined;
  params:any={};
  scheduleOverlayFlag: Boolean = false;
  schedulerComponentInput: any;
  private subscription: Subscription;
  private predefinedBot_id:any;
  public predefinedBot_name:any;
  public scheduler_data :any;
  duplicateAttributes:any=[];
  isJobDescrption_error:boolean = false;
  validate_errorMessage=[];
  isValidateLoader:boolean = false;
  job_Descrption_error:boolean = false;
  isJobDescrptionValid:boolean= false;
  description_type:string='textarea';
  selectedFiles:any[]=[];
  jobDescription:any={};
  predefinedBot_uuid:any;
  selectedOption:any={};
  predefinedBot_schedulerRequired:boolean;
  filePathValues:any[]=[];
  checkedOptions: string[] = [];
  agent_uuid:any;
  isEdit:boolean = false;
  attachmentMap:any[]=[]
  schedulerValue:any;
  fieldInputKey:any;
  capturedFileIds:any=[];
  _agentName:any;
  subAgentName:any;
  isSubAgentNameEdit:boolean = false;
  isExpanded:boolean = true;
  currentStage: number = -1;
  isRunning: boolean = false;
  processInterval: any;
  startTime: Date | null = null;
  stepTimes: Date[] = [];
  showProgress: boolean = false;
  agentUUIDCapture:any;
  configurationOverlay:boolean = false;
  progressBarItems = [
    { label: 'Intiated' },
    { label: 'Agent In Progress' },
    { label: 'Generating Output' },
    { label: 'Completed' }
  ];
  inProgressAgents:any[]=[];
  getStagesInterval: any;


  // Agent in Progress
  // inProgressAgents = [
  //   { startDate: '2023-05-22', progress: 50 },
  //   { startDate: '2023-06-01', progress: 70 },
  //   { startDate: '2023-07-15', progress: 80 },
  //   { startDate: '2023-08-10', progress: 60 },
  //   { startDate: '2023-09-05', progress: 90 },
  //   { startDate: '2023-10-02', progress: 70 },
  //   { startDate: '2023-11-20', progress: 50 },
  //   { startDate: '2023-07-15', progress: 80 },
  //   { startDate: '2023-08-10', progress: 60 },
  //   { startDate: '2023-09-05', progress: 90 },
  //   { startDate: '2023-10-02', progress: 70 },
  //   { startDate: '2023-11-20', progress: 50 },
  // ];

  @ViewChild('cardContainer', { static: false }) cardContainer: ElementRef;
  currentActivePage = 1;
  itemsPerPageCount = 4;
  totalNumberOfPages: number;
  pageDotNumbers: number[];
  status: string = 'Agent In Progress';
  stages = [];
  currentStage_new = -1;

  // Agent History Data Starts
  subAgentHistory = [];

  // Pagination related variables
  subAgentCurrentPage = 1;
  subAgentItemsPerPage = 8;
  subAgentTotalPagesArray: number[] = [];
  searchQuery: string = '';
  isFilterPopupVisible = false;
  availableStages = ['Success', 'Failed', 'Running'];
  filterStage: string = '';
  dummyFilterStage: string = ''
  sortOrder: string = '';
  historyToDownload=[]
  activeTabMode: string ='history';
  // Agent History Data Ends

  // Agent Files Tab
  subAgentFileHistory = [];
  subAgentFileCurrentPage = 1;
  subAgentFileItemsPerPage = 8;
  subAgentFileTotalPagesArray: number[] = [];
  searchFileQuery: string = '';
  subAgentFileSortColumn: string = '';
  subAgentFileSortDirection: number = 1;
  isCommonForm:boolean = true;

  constructor(private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private rest_service : PredefinedBotsService,
    private toaster: ToasterService,
    private toastMessages: toastMessages,
    private spinner : LoaderService,
    private confirmationService: ConfirmationService,
    private toastMessage:toastMessages

    ) {
      this.route.queryParams.subscribe(params=>{
        this.params=params
        this.predefinedBot_id= this.params.id
        if(this.params.type == "create"){
          this.subAgentName = this.params.agentName;
        }
      })

      this.initializePaginationDots()
      this.initializePagination()
      this.initializeSubAgentPagination();
    }



  ngOnInit(): void {
    this.spinner.show();
    this.predefinedBotsForm = this.fb.group({
      fields: this.fb.group({}),
      isScheduleBot: [false],
      schedule: [{value: '', disabled: true}],
      scheduleTime:[{value: '', disabled: true}]
    });
    if(this.params.type == "create"){
      this.fetchAllFields();
      this.isEdit = false;
    }else{
      this.fetchAllFieldsToUpdateData();
      this.getSubAgentsInprogressList();
      this.isEdit = true;
    }

    this.initializePagination();
    this.getSubAgentHistoryLogs();
    this.getSubAgentFileHistoryLogs();
    this.initializeSubAgentFilePagination()

    console.log(this.predefinedBot_name,"Name of the Bot.....")
    console.log(this.processName,"---------------veqrverve")
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    clearInterval(this.getStagesInterval);
    this.stopProcess();
  }

  fetchAllFields() {
    this.rest_service.getPredefinedBotAttributesList(this.params.id).subscribe((res:any)=>{
      console.log("res: ", res)
      this.agent_uuid = res.predefinedBotUUID
      // this.subAgentName = res.aiAgentName;
      this.subAgentName = this.params.agentName;

      this.isCommonForm = res.formType === 'common'? true : false;
      this.fieldInputKey = {};
      console.log("Form Attributes: ", res.data)
    // this.rest_service.getPredefinedBotAttributesList("1234").subscribe((res:any)=>{
      this.spinner.hide();
      // let obj = { attributeRequired: true, maxNumber: 100, minMumber: 0, placeholder: "Enter Agent Name", preAttributeLable: "Automation Agent Name", preAttributeName: "botName", preAttributeType: "text", visibility: true }
      // this.formFields.push(obj);
      res.data.forEach(item => {
        if (item.preAttributeType === 'file') {
          this.fieldInputKey[item.preAttributeName] = item.preAttributeName;
        }
      });
      // this.formFields.push(...res.data.filter(item=>  !item.duplicate))
      this.formFields.push(...res.data
        .filter(item => !item.duplicate)
        .map(item => {
            if (item.preAttributeName === 'RecruitmentOne_email_jobDescrption') {
                return { ...item, isValidateRequired: true };
            } else {
                return item;
            }
        })
    );
      this.duplicateAttributes.push(...res.data.filter(item=>  item.duplicate))
      // res.data.forEach(element => {
      //   this.formFields.push(element)
      // });
      // this.formFields ={...res.data};
      // this.formFields={...{},...res.data};
      this.predefinedBot_name = res.predefinedBotName;
      this.processName = this.predefinedBot_name +" Agent"
      this.predefinedBot_uuid = res.predefinedBotUUID
      // this.predefinedBot_schedulerRequired = res.isSchedulerRequired
      this.predefinedBot_schedulerRequired = false
      this.generateDynamicForm();      
    },err=>{
      this.spinner.hide();
      this.toaster.showError(this.toastMessages.apierror)
    })
    
  }

  onSave() {
    
  }

  generateDynamicForm(){
    const fieldsGroup = {};
    this.formFields.forEach(field => {
      console.log("field",field)
      if(field.attributeRequired){
        if(field.preAttributeType == "checkbox"){
          fieldsGroup[field.preAttributeName] = [false, Validators.required];
        }else{
          fieldsGroup[field.preAttributeName] = ["", Validators.required];
        }
      }else{
        if(field.preAttributeType == "checkbox"){
          fieldsGroup[field.preAttributeName] = [false];
        }else{
          fieldsGroup[field.preAttributeName] = [''];
        }
      }

      // Condition to add a method to check the Agent Name is present or not.
      if (field.preAttributeType === 'text' && field.preAttributeLable === 'Automation Agent Name' && !this.isEdit) {
        fieldsGroup[field.preAttributeName] = ["", [this.agentNameCheck.bind(this)]];
      }
    });
    this.predefinedBotsForm.setControl('fields', this.fb.group(fieldsGroup));
    console.log("predefinedBotsForm",this.predefinedBotsForm)
    // const totalPages = Math.ceil(this.formFields.length / this.fieldsPerPage);
    // this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    //   this.pages.forEach(element => {
    //     let obj ={label:" ",command: () => { this.goToPage(element)}}
    //       this.items.push(obj)
    //   }); 
    // setTimeout(() => {

    //   this.activeIndex = 0 
    // }, 200);
    this.subscription = this.predefinedBotsForm.get('isScheduleBot').valueChanges.subscribe(checked => {
          this.predefinedBotsForm.get('schedule').enable({onlySelf: checked, emitEvent: false});
      });
  }

  fetchAllFieldsToUpdateData() {
    // this.spinner.show();
    this.rest_service.getAgentAttributeswithData(this.params.id,this.params.agentId).subscribe((res:any)=>{
      const keyMap = res.data.reduce((acc, field) => ({ ...acc, [field.preAttributeName]: field.preAttributeName }), {});
      res.attachments.forEach((attachment) => {
        const fieldName = keyMap[attachment.key];
        this.attachmentMap[fieldName] = [...(this.attachmentMap[fieldName] || []), ...attachment.attList.map((att) => ({ key: fieldName, originalFileName: att.originalFileName, attachmentId: att.id }))];
      });
      this.spinner.hide();
      this.agent_uuid = res.predefinedBotUUID
      this.subAgentName = res.aiAgentName;
      this.isCommonForm = res.formType === 'common'? true : false;
      console.log("Form Attributes: ", res.data)
      this.spinner.hide();
      // let obj = { attributeRequired: true, maxNumber: 100, minMumber: 0, placeholder: "Enter Agent Name", preAttributeLable: "Automation Agent Name", preAttributeName: "botName", 
      //             preAttributeType: "text", visibility: true, preAttributeValue: res.aiAgentName}
      // this.formFields.push(obj);
      // this.formFields.push(...res.data.filter(item=>  !item.duplicate))
      this.formFields.push(...res.data
        .filter(item => !item.duplicate)
        .map(item => {
            if (item.preAttributeName === 'RecruitmentOne_email_jobDescrption') {
                return { ...item, isValidateRequired: true };
            } else {
                return item;
            }
        })
    );
      this.duplicateAttributes.push(...res.data.filter(item=>  item.duplicate))
      this.predefinedBot_name = res.predefinedBotName;
      this.processName =this.predefinedBot_name +" Agent"
      this.predefinedBot_uuid = res.predefinedBotUUID
      // this.predefinedBot_schedulerRequired = res.isSchedulerRequired
      this.predefinedBot_schedulerRequired = false
      this.predefinedBotsForm.get('isScheduleBot').setValue(this.predefinedBot_schedulerRequired)
      if(this.predefinedBot_schedulerRequired) this.schedulerValue = res.schedule
      // this.generateDynamicForm();
      this.generateDynamicFormUpdate();
      if (this.predefinedBot_schedulerRequired) {
        this.predefinedBotsForm.get("scheduleTime").setValue(this.convertSchedule(this.schedulerValue,true))
      }
    
    // const fieldsGroup = {};
    // this.formFields.forEach(field => {
    //   fieldsGroup[field.name] = ['', Validators.required];
    // }); 
    // this.predefinedBotsForm.setControl('fields', this.fb.group(fieldsGroup));

    // const totalPages = Math.ceil(this.formFields.length / this.fieldsPerPage);
    // this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    // this.pages.forEach(element => {
    //   let obj ={label:" ",command: () => { this.goToPage(element)}}
    //     this.items.push(obj)
    // });

    // this.subscription = this.predefinedBotsForm.get('isScheduleBot').valueChanges.subscribe(checked => {
    //       this.predefinedBotsForm.get('schedule').enable({onlySelf: checked, emitEvent: false});
    //     });
      })
  }

  calculateNodes(): void {
    const totalPages = Math.ceil(this.formFields.length / this.fieldsPerPage);
    // this.nodes = Array.from({ length: totalPages }, (_, index) => index * 100 / (totalPages - 1));
  }


  calculatePages(): void {
    const totalPages = Math.ceil(this.formFields.length / this.fieldsPerPage);
    this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  goToPage(num: number) {
    this.currentPage = num;
    this.activeIndex = num - 1;
  }

  nextPage() {
    console.log(this.formFields)
    // console.log(this.currentPage,this.predefinedBot_name,this.isJobDescrption_error)
    if(!this.isJobDescrptionValid && this.predefinedBot_name =="Recruitment" && this.currentPage ==1 ){
      this.toaster.showError(this.toastMessages.jd_error)
      return
    }

    if (this.currentPage < this.pages.length) {
      this.currentPage++;
      this.activeIndex = this.currentPage - 1;  // Ensure activeIndex is updated
    }
  }
  
  previousPage() {
    console.log(this.currentPage)
    if (this.currentPage > 1) {
      this.currentPage--;
      this.activeIndex = this.currentPage - 1;  // Ensure activeIndex is updated
    }
  }

  goBack() {
    console.log(this.currentPage)
    if (this.currentPage > 1) {
      this.currentPage--;
      this.activeIndex = this.currentPage - 1;
    }
  }

  get currentPageFields() {
    const startIndex = (this.currentPage - 1) * this.fieldsPerPage;
    const endIndex = startIndex + this.fieldsPerPage;
    return this.formFields.slice(startIndex, endIndex);
  }

  get isLastPage(): boolean {
    return this.currentPage === this.pages.length;
  }

  get progress(): number {
    return (this.currentPage / this.pages.length) * 100;
  }

  goBackList(){
    // if(this.params.type == "create"){
    //   this.router.navigate(["/pages/aiagent/home"]);
    // }else{
    //   this.router.navigate(["/pages/aiagent/list"]);
    // }

    // Navigat to the Agent Details Screen.
    this.router.navigate(['/pages/aiagent/details'],{ queryParams: { id: this.predefinedBot_id } });
  }

  navigateForm(){
    this.isShowForm=!this.isShowForm;
  }

  updateProgress() {
    if (this.activeIndex < this.items.length - 1) {
      this.activeIndex++;
    } else {
      this.activeIndex = 0; // Reset or stop as needed
    }
  }

  openScheduler() {
    this.scheduleOverlayFlag = true;
  }

  closeOverlay(event) {
    this.scheduleOverlayFlag = event;
  }

  // createBot() {
  //   console.log(this.selectedOption , this.predefinedBotsForm)
  //   if(this.predefinedBot_uuid =='Pred_RFP'){
  //     this.rfpbotCreate('create')
  //   }else if(this.predefinedBot_uuid =='Pred_Recruitment'){
  //     this.recruitmentbotCreate('create');
  //   }else{
  //     this.botCreate('create');
  //   }
  // }

  rfpbotCreate(type){
    if (this.predefinedBotsForm.valid) {
      this.spinner.show();
      // const formData = new FormData();
      // formData.append('filePath', this.selectedFiles[0]);
      // this.rest_service.rfpFileUpload(formData).subscribe((res:any)=>{
        // console.log("test", res)
        let botName = this.predefinedBotsForm.value.fields.botName
        let req_body = this.predefinedBotsForm.value;
        req_body["automationName"] = this.subAgentName
        req_body["agentUUID"] = this.params.agentId
        // req_body["automationName"] = this.predefinedBotsForm.value.fields.botName
        req_body["predefinedBotType"] = this.predefinedBot_name
        req_body["productId"] = this.predefinedBot_id
        req_body["schedule"] = this.scheduler_data ? JSON.stringify(this.scheduler_data) : '';
        // req_body.fields[this.selectedOption.preAttributeName] = res.fileName
        this.filePathValues.forEach(element => {
          req_body.fields[element.attributName] = element.filePath
        });
        this.formFields.forEach(e => {
          if (e.preAttributeName === 'RFP_dropdown') {
            e.options.forEach(item => {
              const key = item.value === 'RFP_Summarizer' ? (this.checkedOptions.includes('RFP_Summarizer') ? item.ifTrue : item.ifFalse) :
                (item.value === 'Proposal_Generator' ? (this.checkedOptions.includes('Proposal_Generator') ? item.ifTrue : item.ifFalse) : null);
              if (key) {
                const [fieldName, fieldValue] = key.split(':');
                req_body.fields[fieldName] = fieldValue;
              }
            });
          }
        });

        delete req_body.fields.botName
        if(this.duplicateAttributes.length >0){
          this.duplicateAttributes.forEach(element => {
            let v_key = element.preAttributeName.split("_")
            for (const key in req_body.fields) {
            const parts = key.split('_');
            if(parts[2]+"_"+parts[3] == v_key[2]+"_"+v_key[3]){
                req_body.fields[element.preAttributeName] = req_body.fields[key]
            }
            }
          });
        }
        console.log('req_body------:', req_body);
        this.saveBot(req_body,botName,type)
      // })
      } else {
        this.toaster.showInfo("Fill All fields")
      }
  }

  recruitmentbotCreate(type){
    if (this.predefinedBotsForm.valid) {
      this.spinner.show();
      if(this.predefinedBotsForm.get("fields."+this.jobDescription.fieldName)){
        this.jobDescription.response["inputJobDescrption"]= this.jobDescription.data
        // this.predefinedBotsForm.get("fields."+this.jobDescription.fieldName)?.setValue(JSON.stringify(this.jobDescription.response))    
      }
        let botName = this.predefinedBotsForm.value.fields.botName
        let req_body = this.predefinedBotsForm.value;
          let appendValuesList =  this.getArrayValues(this.selectedOption.append_values)
          console.log(appendValuesList)
          appendValuesList.forEach(e=>{
            req_body.fields[e] = JSON.stringify(this.jobDescription.response)
          })
        req_body.fields[this.jobDescription.fieldName] = JSON.stringify(this.jobDescription.response)
        // req_body["automationName"] = this.predefinedBotsForm.value.fields.botName
        req_body["automationName"] = this.subAgentName
        req_body["predefinedBotType"] = this.predefinedBot_name
        req_body["productId"] = this.predefinedBot_id
        req_body["agentUUID"] = this.params.agentId
        req_body["schedule"] = this.scheduler_data ? JSON.stringify(this.scheduler_data) : '';
        delete req_body.fields.botName
        console.log(this.duplicateAttributes)
        if(this.duplicateAttributes.length >0){
          // this.duplicateAttributes.forEach(element => {
          //   let v_key = element.preAttributeName.split("_")
  
  
          //   for (const key in req_body.fields) {
          //   const parts = key.split('_');
            
          //   if(parts[2]+"_"+parts[3] == v_key[2]+"_"+v_key[3]){
          //       req_body.fields[element.preAttributeName] = req_body.fields[key]
          //   }
          //   }
          // });
          this.duplicateAttributes.forEach(ele=>{
            if(ele.options){
              req_body.fields[ele.preAttributeName] = req_body.fields[ele.options[0].duplicatesTo]
            }
          })
        }
        console.log('req_body---:', req_body);
        this.saveBot(req_body,botName,type)
      } else {
        this.toaster.showInfo("Fill All fields")
      }
  }

  botCreate(type){
    if (this.predefinedBotsForm.valid) {
      this.spinner.show();
        let botName = this.predefinedBotsForm.value.fields.botName
        let req_body = this.predefinedBotsForm.value;
        
        // req_body["automationName"] = this.predefinedBotsForm.value.fields.botName
        req_body["automationName"] = this.subAgentName
        req_body["predefinedBotType"] = this.predefinedBot_name
        req_body["productId"] = this.predefinedBot_id
        req_body["agentUUID"] = this.params.agentId
        req_body["schedule"] = this.scheduler_data ? JSON.stringify(this.scheduler_data) : '';
        delete req_body.fields.botName
        console.log(this.duplicateAttributes)
        if(this.duplicateAttributes.length >0){
          this.duplicateAttributes.forEach(ele=>{
            if(ele.options){
              req_body.fields[ele.preAttributeName] = req_body.fields[ele.options[0].duplicatesTo]
            }
          })
        }
        this.saveBot(req_body,botName,type)
        console.log('req_body---:', req_body);
      } else {
        this.toaster.showInfo("Fill All fields")
      }
  }

  saveBot(req_body,botName,type) {
    if(type == "create"){
    this.rest_service.savePredefinedAttributesData(req_body).subscribe((res:any)=>{
      const agentUUID = res.data[0].agentUUID;
      this.agentUUIDCapture = res.data[0].agentUUID;
        this.captureAgentIdAndFileIds(agentUUID, this.capturedFileIds);
      this.spinner.hide();
      // this.goBackAgentHome(); // temporarly commented this line
      this.toaster.showSuccess(botName,"create")
    },err=>{
      this.spinner.hide();
      this.toaster.showError(this.toastMessages.apierror)
    })
  }else{
    this.rest_service.updatePredefinedAttributesData(this.predefinedBot_id,this.params.agent_id,req_body).subscribe(res=>{
        const agentId = this.params.agent_id;
        this.captureAgentIdAndFileIds(agentId, this.capturedFileIds);
      this.spinner.hide();
      this.goBackAgentHome();
      this.toaster.showSuccess(botName,"update")
    },err=>{
      this.spinner.hide();
      this.toaster.showError(this.toastMessages.apierror)
    })
  }
  }

  captureAgentIdAndFileIds(agentId: number, fileIds: number[]) {
    const payload = {
      ids: fileIds
    };
    this.rest_service.captureAgentIdandfileIds(agentId, payload).subscribe(res => {
      console.log("Captured agent ID and file IDs:", res);
    }, err => {
      this.spinner.hide();
      this.toaster.showError(this.toastMessages.apierror);
      console.error("Error capturing agent ID and file IDs:", err);
    });
  }

  onUpdateForm(){
    if (this.predefinedBotsForm.valid) {
      console.log(this.selectedOption , this.predefinedBotsForm)
      if(this.predefinedBot_uuid =='Pred_RFP'){
        this.rfpbotCreate('update')
      }else if(this.predefinedBot_uuid =='Pred_Recruitment'){
        this.recruitmentbotCreate('update');
      }else{
        this.botCreate('update');
      }
    } else {
      console.log('Form is not valid!');
    }
  }

  readEmitValue(data){
    this.scheduler_data = data;
    this.scheduleOverlayFlag = false;
    data.processName = this.predefinedBotsForm.value.fields.botName
    this.predefinedBotsForm.get("scheduleTime").setValue(this.convertSchedule(data,false))
  }

  convertSchedule(scheduleData1,isEdit: boolean ) {
    let scheduleData = scheduleData1;
    if(isEdit) {
      scheduleData = JSON.parse(scheduleData1);
    }

    // this.describeScheduleType(scheduleData[0]);
    const startDateArray = scheduleData[0]?.startDate?.split(',').map(Number);
    const endDateArray = scheduleData[0]?.endDate?.split(',').map(Number);
    const interval = scheduleData[0]?.scheduleInterval;

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
  } 

  clearScheduleTime() {
    if (!this.predefinedBotsForm.get('isScheduleBot').value) {
        this.predefinedBotsForm.get('scheduleTime').setValue('');
    }
  }

  validateJobDescription(type){
    console.log("type",type)
    if(this.predefinedBot_name == 'Recruitment'){
      console.log(this.predefinedBotsForm)
      const formData = new FormData();
        formData.append('inputType', "ceipal");
      if(type.preAttributeType == "textarea"){
        formData.append('type', "text");
        formData.append('inputReference', this.predefinedBotsForm.value.fields[type.preAttributeName]);
      }else{
        const selectedFiles = this.selectedFiles[type.preAttributeName];
        if (selectedFiles && selectedFiles.length > 0) {
          formData.append('type', "file");
          formData.append('filePath', selectedFiles[0]);
        }
      }

    this.validate_errorMessage = [];
    this.isValidateLoader  = true;
    this.job_Descrption_error = false;
    this.isJobDescrptionValid = false;
    this.rest_service.validateRecruitmentBotData(formData).subscribe((res:any)=>{
      console.log("response",res)
      this.isValidateLoader = false;
      this.isJobDescrption_error = false;
      this.validate_errorMessage = [];
      if(res.code == 404){
        if(res.is_fields_missing){
          this.validate_errorMessage = res.missing;
          this.isJobDescrption_error = res.is_fields_missing;
        }
      }
      if(res.code == 200){
        this.isJobDescrption_error = false;
          this.validate_errorMessage = ["Valid"]
          this.isJobDescrptionValid = true;
          this.jobDescription = res
          this.jobDescription["fieldName"]= type.preAttributeName
          // this.predefinedBotsForm.get("fields."+type.preAttributeName).setValue(JSON.stringify(res.response))    
      }
      if(res.code == 500){
        this.validate_errorMessage = ["Error"];
        this.job_Descrption_error = true;
      }
    })
  }
  }

  // onFileSelected(event: any,field) {
  //   this.selectedFiles = event.target.files;
  //   console.log(this.selectedFiles)
  //   this.selectedOption = field
  //   console.log("this.selectedOption",this.selectedOption)
  //   // if(this.predefinedBot_uuid =='Pred_RFP'){
  //     const formData = new FormData();
  //     // this.selectedFiles.forEach(e=>{
  //     //   formData.append('filePath', e);
  //     // })

  //     for (let i = 0; i < this.selectedFiles.length; i++) {
  //       formData.append("file", this.selectedFiles[i]);
  //     }
  //     formData.append("filePath", this.predefinedBot_name);
  //     formData.append("predefinedAgentUUID", this.predefinedBot_uuid );
  //     formData.append("productId", this.predefinedBot_id);

  //     this.rest_service.rfpFileUpload(formData).subscribe((res:any)=>{
  //       console.log("res",res)
  //       let obj = {filePath:res.fileName,
  //         attributName:field.preAttributeName
  //         }
  //       this.filePathValues.push(obj)
  //     })
  //   // }
  // }
  onFileSelected(event: any, field: any) {
    const selectedFiles = event.target.files;
    this.selectedFiles[field.preAttributeName] = selectedFiles;
    console.log("Selected files for " + field.preAttributeName, selectedFiles);

    const selectedFile = event.target.files[0];
    const fileName = selectedFile.name;
    const fileNameElement = document.querySelector('.custom-file-name');
    fileNameElement.textContent = fileName;
  }

  uploadFilesAndCreateBot(action: string) {
    this.spinner.show();
    const fileKeys = Object.keys(this.selectedFiles);
    const totalKeys = fileKeys.length;
    let currentIndex = 0;
    const uploadNextFile = () => {
      if (currentIndex < totalKeys) {
        const key = fileKeys[currentIndex];
        const files = this.selectedFiles[key];

        if (files.length > 0) {
          const formData = new FormData();
          formData.append("filePath", this.predefinedBot_name);
          formData.append("predefinedAgentUUID", this.predefinedBot_uuid);
          formData.append("productId", this.predefinedBot_id);
          formData.append("inputKey", this.fieldInputKey[key]);

          for (let i = 0; i < files.length; i++) {
            formData.append("file", files[i]);
          }

          const uploadPromise = this.rest_service.agentFileUpload(formData).toPromise();
          uploadPromise.then((res: any) => {
            // this.capturedFileIds = res.data.map((item: any) => item.id).join(',');
            const ids = res.data.map((item: any) => item.id);
            this.capturedFileIds.push(...ids);
            console.log("Uploaded file for key:", key, "Response:", res);
            let obj = {
              filePath: res.fileName,
              attributName: key
            };
            this.filePathValues.push(obj);
            currentIndex++;
            uploadNextFile();
          }).catch((error) => {
            this.spinner.hide();
            this.toaster.showError(this.toastMessages.uploadError,)
            // console.error("File upload error for key:", key, error);
          });
        } else {
          currentIndex++;
          uploadNextFile();
        }
      } else {
        if (this.predefinedBot_uuid === 'Pred_RFP') {
          this.rfpbotCreate(action);
        } else if (this.predefinedBot_uuid === 'Pred_Recruitment') {
          this.recruitmentbotCreate(action);
        }
      }
    };
    uploadNextFile();
  }
  
 createBot() {
    console.log(this.predefinedBotsForm.value);
    if (this.predefinedBot_uuid === 'Pred_RFP' || this.predefinedBot_uuid === 'Pred_Recruitment') {
      this.uploadFilesAndCreateBot('create');
    } else {
      this.botCreate('create');
    }
    this.showProgress = true;
    this.currentStage = 0;
  }
  onRadioChange(value: string,option_item) {
    console.log(value,option_item)
    this.selectedOption = option_item
    let array = this.getArrayValues(option_item.field)
    array.forEach(each=>{
      this.predefinedBotsForm.get("fields."+each).setValue("")
      this.formFields.find(item=>item.preAttributeName == each && item.preAttributeType != value).visibility =false
      this.formFields.find(item=>item.preAttributeName == each && item.preAttributeType == value).visibility =true
    })
    this.clearValidationStatus();
    // console.log("field",field)
      // this.description_type =value;

    // const fd = new FormData();
    // fd.append('file', this.selectedFile),
    //   fd.append('permissionStatus', 'yes'),
  }

  onKeydown(e,field){
    this.isJobDescrptionValid = false;
    this.isJobDescrption_error = true;
    this.isValidateLoader = false;
    this.validate_errorMessage=[];
  }

  onCheckboxChange(event, option:any,type:any) {
    let checkbox:any
    let checkValue:any
    if(type == "onchange"){
        checkbox = event.target as HTMLInputElement;
        checkValue = checkbox.checked;
    }else{
      checkValue = event;
    }
    const validJsonStr = option.field.replace(/'/g, '"');
    // const array = JSON.parse(validJsonStr);
    let array;
    try {
      array = JSON.parse(validJsonStr);
    } catch (e) {
      console.error("Parsing error:", e);
    }

    if (checkValue) {
      this.checkedOptions.push(option.value);
    } else {
      const index = this.checkedOptions.indexOf(option.value);
      if (index !== -1) {
        this.checkedOptions.splice(index, 1);
      }
    }
    console.log(this.checkedOptions);


    if (Array.isArray(array)) {
      if (checkValue) {
        // formArray.push(this.fb.control(label));
        array.forEach((element: any) => {
          const field = this.formFields.find(item => item.preAttributeName === element);
          if (field) {
            field.visibility = true;
            field.attributeRequired =true;
            this.updateValidators(element)
          }
        });
      } else {
        array.forEach(element => {
          const field = this.formFields.find(item => item.preAttributeName === element);
          if (field) {
            field.visibility = false;
            field.attributeRequired =false;
            this.clearValidators(element);
          }
        });
        // let arrayList = this.getArrayValues(option.disableFields)
        // arrayList.forEach(element1 => {
        //   const field1 = this.formFields.find(item => item.preAttributeName === element1);
        //   if (field1) {
        //     field1.visibility = false;
        //   }
        // });
        // const index = formArray.controls.findIndex(x => x.value === label);
        // formArray.removeAt(index);
      }
    }
  }

  onDropdownChange(event: any,options:any) {
    console.log(event,options)
    const selectedValue = event.value;
    const selectedObject = options.find(option => option.value === selectedValue);
    const validJsonStr = selectedObject.field.replace(/'/g, '"');
    const array = JSON.parse(validJsonStr);
    if (Array.isArray(array))
    array.forEach((element: any) => {
      const field = this.formFields.find(item => item.preAttributeName === element);
      if (field) {
        field.visibility = true;
      }
    })
    // Add your custom logic here
  }

  getArrayValues(option){
    const validJsonStr = option.replace(/'/g, '"');
    // const array = JSON.parse(validJsonStr);
    let array = [];
    try {
      array = JSON.parse(validJsonStr);
    } catch (e) {
      console.error("Parsing error:", e);
    }
    return array;
  }

  updateValidators(item){
    this.predefinedBotsForm.get("fields."+item).setValidators(Validators.compose([Validators.required]));
    this.predefinedBotsForm.get("fields."+item).updateValueAndValidity(); 
  }

  clearValidators(item){
    this.predefinedBotsForm.get("fields."+item).clearValidators(); 
    this.predefinedBotsForm.get("fields."+item).updateValueAndValidity();
  }

  generateDynamicFormUpdate(){
    const fieldsGroup = {};
    // console.log("formFields",this.formFields)
    this.formFields.forEach(field => {
      // if(field.attributeRequired){
        if(field.preAttributeType === "checkbox"){
          if(field.options.length ==0 || field.options == null){
            fieldsGroup[field.preAttributeName] = [field.preAttributeValue]
          }else{
            field.options.forEach(option => {
            let array = this.getArrayValues(option.field);
            if (array.length > 0) {
              console.log("array", array);
              const filteredFields = this.formFields.find(field => field.preAttributeName === array[0]);
              if (filteredFields.preAttributeValue) {
                  fieldsGroup[option.value] = [true, Validators.required];
                // this.onCheckboxChange(true, option, "onUpdate");
                this.onCheckboxChangeOnUpdate(true, option);
              } else {
                fieldsGroup[option.value] = [false, Validators.required];
              }
            }
            });
          }
          }else if(field.preAttributeType == "radio"){
            fieldsGroup[field.preAttributeName] = [field.preAttributeValue, Validators.required]
            this.onRadioChangeUpdateFlow(field.preAttributeValue , field.options.find(option => option.value == field.preAttributeValue))
          }else if(field.preAttributeType == "dropdown"){
            fieldsGroup[field.preAttributeName] = [field.preAttributeValue, Validators.required]
            if (field.preAttributeValue) {
              fieldsGroup[field.preAttributeName] = [field.preAttributeValue, Validators.required];
              this.onDropdownChange({value: field.preAttributeValue}, field.options)
            } else {
              fieldsGroup[field.preAttributeName] = [''];
            }
          }else if(field.preAttributeType == "textarea"){
            if(this.predefinedBot_uuid =='Pred_Recruitment'){
              let jobDesc= JSON.parse(field.preAttributeValue).inputJobDescrption
                fieldsGroup['RecruitmentOne_email_jobDescrption'] = [String(jobDesc), Validators.required]                
            }else{
              fieldsGroup[field.preAttributeName] = [field.preAttributeValue, Validators.required]
            }
           } else{
            if(field.preAttributeType == "file"){
              fieldsGroup[field.preAttributeName] = [''];
            }else{
              fieldsGroup[field.preAttributeName] = [field.preAttributeValue, Validators.required];
            }
            // field.preAttributeType != "file" ? fieldsGroup[field.preAttributeName] = [field.preAttributeValue, Validators.required] : fieldsGroup[field.preAttributeName] = ['', Validators.required];
            // fieldsGroup[field.preAttributeName] = [field.preAttributeValue, Validators.required];
        }
      // }else{
      //   fieldsGroup[field.preAttributeName] = [''];
      // }
    });
    this.predefinedBotsForm.setControl('fields', this.fb.group(fieldsGroup));
    console.log("predefinedBotsForm",this.predefinedBotsForm)

  //   this.subscription = this.predefinedBotsForm.get('isScheduleBot').valueChanges.subscribe(checked => {
  //     this.predefinedBotsForm.get('schedule').enable({onlySelf: checked, emitEvent: false});
  // });
  }

  onCheckboxChangeOnUpdate(event, option:any) {
    // console.log("test....................")
    const checkbox = event;
    const validJsonStr = option.field.replace(/'/g, '"');
    // const array = JSON.parse(validJsonStr);
    let array;
    try {
      array = JSON.parse(validJsonStr);
    } catch (e) {
      console.error("Parsing error:", e);
    }

    if (checkbox) {
      this.checkedOptions.push(option.value);
    } else {
      const index = this.checkedOptions.indexOf(option.value);
      if (index !== -1) {
        this.checkedOptions.splice(index, 1);
      }
    }
    if (Array.isArray(array)) {
      if (checkbox) {
        // formArray.push(this.fb.control(label));
        array.forEach((element: any) => {
          const field = this.formFields.find(item => item.preAttributeName === element);
          if (field) {
            field.visibility = true;
            field.attributeRequired =true;
            setTimeout(() => {
              this.updateValidators(element)
            }, 500);
          }
        });
      } else {
        array.forEach(element => {
          const field = this.formFields.find(item => item.preAttributeName === element);
          if (field) {
            field.visibility = false;
            field.attributeRequired =false;
            this.clearValidators(element);
          }
        });
      }
    }
  }

  goBackAgentHome(){
    // this.router.navigate(['/pages/aiagent/details'],{ queryParams: { id: this.predefinedBot_id } });
    this.router.navigate(['/pages/aiagent/sub-agents'],{ queryParams: { id: this.predefinedBot_id } });
  }

  onRadioChangeUpdateFlow(value: string,option_item) {
    console.log(value,option_item)
    this.selectedOption = option_item
    let array = this.getArrayValues(option_item.field)
    array.forEach(each=>{
      this.formFields.find(item=>item.preAttributeName == each && item.preAttributeType != value).visibility =false
      this.formFields.find(item=>item.preAttributeName == each && item.preAttributeType == value).visibility =true
    })
  }

  isFormValidAndJobDescriptionValid(): boolean {
    const isFormValid = this.predefinedBotsForm.valid;
    const jobDescriptionField = this.currentPageFields.find(field => field.preAttributeLable === 'Job Description');

    if (jobDescriptionField && jobDescriptionField.isValidateRequired) {
      return isFormValid && this.isJobDescrptionValid;
    }
    return isFormValid;
  }
  
  isValidateDisabled(field: any): boolean {
    if (field.preAttributeLable !== 'Job Description') {
      return false;
    }
    if (field.preAttributeType === 'textarea') {
      const value = this.predefinedBotsForm.get('fields.' + field.preAttributeName)?.value;
      return !value || value.trim().length === 0;
    } else if (field.preAttributeType === 'file') {
      const fileInput = document.getElementById(field.preAttributeName) as HTMLInputElement;
      return !fileInput || fileInput.files.length === 0;
    }
    return false;
  }

  clearValidationStatus() {
    this.validate_errorMessage = [];
    this.isValidateLoader = false;
    this.job_Descrption_error = false;
    this.isJobDescrptionValid = false;
    this.isJobDescrption_error = false;
    this.jobDescription = null;
  }

  agentNameCheck(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value || this.isEdit) {
      return null;
    }

    this.rest_service.checkAiAgentName(value).subscribe(
      (data: any) => {
        if (data.code === 4200 && data.data === true) {
          control.setErrors({ nameTaken: true });
        }
      },
      error => {
        console.log("falied to check agent name")
      }
    );
    return null;
  }

  deleteAttachment(attachmentId: any) {

  }

  downloadAttachment(attachmentId: any) {
    console.log("downloadAttachment", attachmentId);

  }

  getAttachements(key){
    return this.attachmentMap[key]
  }

  loopTrackBy(index, term) {
    return index;
  }

  inplaceActivate() {
    this._agentName = this.processName
  }
  onClicksubAgentName() {
    this.isSubAgentNameEdit = true;
    this._agentName = this.subAgentName
  }

  Space(event: any) {
    if (event.target.selectionStart === 0 && event.code === "Space") {
      event.preventDefault();
    }
  }

  updateDashboardName(){
    // this.inplace.deactivate();
    this.spinner.show();
    this.rest_service.updateSubAgentName(this.params.agentId,this._agentName).subscribe(res=>{
      this.toaster.showSuccess("Agent Name","update");
      this.spinner.hide();
      this.isSubAgentNameEdit = false;
      this.subAgentName = this._agentName;
    }, err=>{
      this.spinner.hide();
      this.toaster.showError(this.toastMessages.apierror);
    })
  }

  onDeactivate(){
    // this.inplace.deactivate();
    this.isSubAgentNameEdit = false;

  }

  toggleItem() {
    this.isExpanded = !this.isExpanded;
  }
  
// prgress bar code methods for AI agents execution Starts
  get progressWidth(): string {
    return `${(this.currentStage / (this.progressBarItems.length - 1)) * 80}%`;
  }

  get displayStage(): string {
    return `${Math.max(0, this.currentStage + 1)}/${this.progressBarItems.length}`;
  }

  get completedWidth(): string {
    return `${(Math.max(0, this.currentStage) / (this.progressBarItems.length - 1)) * 100}%`;
  }

  get currentWidth(): string {
    if (this.currentStage < 0) return '0%';
    return `${(1 / (this.progressBarItems.length - 1)) * 100}%`;
  }

  // toggleProcess() {
  //   if (this.isRunning) {
  //     this.stopProcess();
  //   } else {
  //     this.startProcess();
  //     // this.runAiAgent();
  //   }
  // }

  startAiAgent() {
    this.confirmationService.confirm({
      message: "Ready to get started? Launching this agent will begin the process. ",
      header: "Ready to Go?",
      acceptLabel: "Let's Do It!",
      rejectLabel: "Not Now",
      rejectButtonStyleClass: 'btn reset-btn',
      acceptButtonStyleClass: 'btn bluebg-button',
      defaultFocus: 'none',
      rejectIcon: 'null',
      acceptIcon: 'null',
      accept: () => {
        this.spinner.show()
        // this.rest_service.startPredefinedBot(this.params.agentId).subscribe((res: any) => {
          
        this.rest_service.startPredefinedBot(this.params.agentId).subscribe((res: any) => {
          console.log("resrstage",res);
        this.spinner.hide();
        if(res.errorCode)
        if(res.errorCode == 3054){
          this.toaster.showError("You've reached today's limit. Please try again tomorrow. Thank you for your understanding!");
          return;
        }
        this.toaster.toastSuccess("Success! The agent has started executing.");
          this.getAgentStages();
        
        }, err => {
          this.spinner.hide();
          this.toaster.showError(this.toastMessage.apierror);
        });
        this.startProcess();
      },
      reject: (type) => { }
    });
  }

  getAgentStages() {
    const intervalTime = 6000; 
    const agentUUID = this.params.agentId
    this.getStagesInterval = setInterval(() => {
      this.rest_service.getAgentStagesInfo(agentUUID).subscribe((stagesInfo: any) => {
        this.stages = stagesInfo;
        if (stagesInfo.some(stage => stage.status === 'Completed')) {
          clearInterval(this.getStagesInterval);
          this.toaster.toastSuccess("Agent Execution Completed");
        }
      }, err => {
        // clearInterval(intervalId);
        this.toaster.showError("Error fetching agent stages info");
      });
    }, intervalTime);
  }
  startProcess() {
    this.isRunning = true;
    this.currentStage = 0;
    this.startTime = new Date();
    this.stepTimes = [this.startTime];
    this.processInterval = setInterval(() => {
      if (this.currentStage < this.progressBarItems.length - 1) {
        this.currentStage++;
        this.stepTimes.push(new Date());
      } else {
        this.stopProcess();
      }
    }, 2000); // Change stage every 2 seconds
  }

  stopProcess() {
    this.isRunning = false;
    clearInterval(this.processInterval);
  }

  getStepClass(index: number): string {
    if (this.currentStage < 0) return '';
    if (index < this.currentStage) return 'completed';
    if (index === this.currentStage) return 'active';
    return '';
  }

  getStepTime(index: number): string {
    if (!this.stepTimes[index]) return '';
    return this.stepTimes[index].toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  }

  createBot1(){
    this.showProgress = true;
    this.currentStage = 0;
  }

  // prgress bar code methods for AI agents execution Ends

  initializePaginationDots() {
    const totalAgentsCount = this.inProgressAgents.length;
    this.totalNumberOfPages = Math.ceil(totalAgentsCount / this.itemsPerPageCount);
    this.pageDotNumbers = Array.from({ length: this.totalNumberOfPages }, (_, index) => index + 1);
  }

  initializePagination() {
    const totalAgentsCount = this.inProgressAgents.length;
    this.totalNumberOfPages = Math.ceil(totalAgentsCount / this.itemsPerPageCount);
    this.pageDotNumbers = Array.from({ length: this.totalNumberOfPages }, (_, index) => index + 1);
  }

  navigateToPage(pageNumber: number) {
    this.currentActivePage = pageNumber;
    this.scrollToPage(pageNumber);
  }

  scrollToPage(pageNumber: number) {
    if (this.cardContainer) {
      const container = this.cardContainer.nativeElement;
      const pageWidth = container.clientWidth;
      container.scrollTo({
        left: (pageNumber - 1) * pageWidth,
        behavior: 'smooth'
      });
    }
  }

  scrollLeft() {
    if (this.cardContainer) {
      const container = this.cardContainer.nativeElement;
      const containerWidth = container.clientWidth;
      const newScrollPosition = container.scrollLeft - containerWidth;
      const newPageNumber = Math.max(1, Math.floor(newScrollPosition / containerWidth) + 1);
      this.currentActivePage = newPageNumber;
      this.scrollToPage(newPageNumber);
    }
  }

  scrollRight() {
    if (this.cardContainer) {
      const container = this.cardContainer.nativeElement;
      const containerWidth = container.clientWidth;
      const newScrollPosition = container.scrollLeft + containerWidth;
      const newPageNumber = Math.min(this.totalNumberOfPages, Math.ceil(newScrollPosition / containerWidth) + 1);
      this.currentActivePage = newPageNumber;
      this.scrollToPage(newPageNumber);
    }

  }

  handlePageDotClick(pageNumber: number) {
    this.currentActivePage = pageNumber;
  }

initializeSubAgentPagination() {
  this.updateFilteredData();
}

subAgentGoToPage(page: number | string) {
  if (page === 'prev' && this.subAgentCurrentPage > 1) {
    this.subAgentCurrentPage--;
  } else if (page === 'next' && this.subAgentCurrentPage < this.subAgentTotalPagesArray.length) {
    this.subAgentCurrentPage++;
  } else if (typeof page === 'number') {
    this.subAgentCurrentPage = page;
  }
  this.updateFilteredData();
}

scrollSubAgentLeft() {
  if (this.subAgentCurrentPage > 1) {
    this.subAgentGoToPage('prev');
  }
}

scrollSubAgentRight() {
  if (this.subAgentCurrentPage < this.subAgentTotalPagesArray.length) {
    this.subAgentGoToPage('next');
  }
}

updateFilteredData() {
  const totalPages = Math.ceil(this.filteredSubAgentHistory.length / this.subAgentItemsPerPage);
  this.subAgentTotalPagesArray = Array.from({ length: totalPages }, (_, i) => i + 1);
}

getSubAgentHistoryPaginatedData() {
  const startIndex = (this.subAgentCurrentPage - 1) * this.subAgentItemsPerPage;
  const endIndex = startIndex + this.subAgentItemsPerPage;
  return this.filteredSubAgentHistory.slice(startIndex, endIndex);
}

toggleFilterPopup() {
  this.isFilterPopupVisible = !this.isFilterPopupVisible;
}

applyFilter() {
  this.subAgentCurrentPage = 1;
  this.updateFilteredData();
  this.toggleFilterPopup();
}

get filteredSubAgentHistory() {
  let filteredData = this.subAgentHistory;

  // Date filtering
  if (this.searchQuery) {
    const queryDate = new Date(this.searchQuery);
    filteredData = filteredData.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.toDateString() === queryDate.toDateString();
    });
  }

  // Stage filtering
  if (this.filterStage) {
    filteredData = filteredData.filter(record => record.stage === this.filterStage);
  }

  // Sorting
  filteredData = filteredData.sort((a, b) => {
    if (this.sortOrder) {
      if (this.sortOrder === 'asc') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    }
  });

  return filteredData;
}

onSearchChange(event: Event) {
  const input = event.target as HTMLInputElement;
  this.searchQuery = input.value;
  this.subAgentCurrentPage = 1;
  this.updateFilteredData();
}

getSubAgentHistoryLogs() {
  this.spinner.show();
  // this.rest_service.getSubAgentHistoryLogs(this.params.id, "a8e1f0cb-c8b1-4760-af8c-8a6a1507a2f4")
  this.rest_service.getSubAgentHistoryLogs(this.params.id, this.params.agentId)
    .subscribe((res: any) => {
      this.historyToDownload=res.data.reverse();
      this.subAgentHistory = this.mapResponseToTableData(res.data);
      // this.subAgentHistory = [...this.subAgentHistory,...this.subAgentHistory,...this.subAgentHistory,...this.subAgentHistory]
      this.subAgentHistory = [...this.subAgentHistory]
      this.initializeSubAgentPagination();
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.toaster.showError(this.toastMessages.apierror);
    });
}

mapResponseToTableData(data: any[]): any[] {
  return data.map((item, index) => ({
    date: item.startTS,
    stage: item.status,
    // information: `Run ID: ${item.agentRunId}, Agent: ${item.agentName}`,
    information: item.description,
  }));
}

handleStages(stage){
  this.filterStage = '';
  this.dummyFilterStage = '';
  this.isFilterPopupVisible = false
  this.sortOrder = stage;
}

handleStageOption(stage){
  this.sortOrder = '';
  this.isFilterPopupVisible = false;
  this.dummyFilterStage = stage
  this.filterStage = stage;
}


handleHistoryTab (hist) {
  this.activeTabMode = hist
  if (hist === 'files') {
    this.getSubAgentFileHistoryLogs();
  }else{
    this.getSubAgentHistoryLogs()
  }
}

  initializeSubAgentFilePagination() {
    this.updateFileFilteredData();
  }

  subAgentFileGoToPage(page: number | string) {
    if (page === 'prev' && this.subAgentFileCurrentPage > 1) {
      this.subAgentFileCurrentPage--;
    } else if (page === 'next' && this.subAgentFileCurrentPage < this.subAgentFileTotalPagesArray.length) {
      this.subAgentFileCurrentPage++;
    } else if (typeof page === 'number') {
      this.subAgentFileCurrentPage = page;
    }
    this.updateFileFilteredData();
  }

  scrollSubAgentFileLeft() {
    if (this.subAgentFileCurrentPage > 1) {
      this.subAgentFileGoToPage('prev');
    }
  }

  scrollSubAgentFileRight() {
    if (this.subAgentFileCurrentPage < this.subAgentFileTotalPagesArray.length) {
      this.subAgentFileGoToPage('next');
    }
  }

  updateFileFilteredData() {
    const totalPages = Math.ceil(this.filteredSubAgentFileHistory.length / this.subAgentFileItemsPerPage);
    this.subAgentFileTotalPagesArray = Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  getSubAgentFilePaginatedData() {
    const startIndex = (this.subAgentFileCurrentPage - 1) * this.subAgentFileItemsPerPage;
    const endIndex = startIndex + this.subAgentFileItemsPerPage;
    return this.filteredSubAgentFileHistory.slice(startIndex, endIndex);
  }

  get filteredSubAgentFileHistory() {
    if (!this.searchFileQuery) {
      return this.subAgentFileHistory;
    }
    return this.subAgentFileHistory.filter(record =>
      record.originalFileName.toLowerCase().includes(this.searchFileQuery.toLowerCase())
    );
  }

  onFileSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchFileQuery = input.value;
    this.subAgentFileCurrentPage = 1;
    this.updateFileFilteredData();
  }

  getSubAgentFileHistoryLogs() {
    this.spinner.show();
    this.rest_service.getSubAgentFiles(this.params.id, this.params.agentId)
    // this.rest_service.getSubAgentFiles("Pred_RFP", "7c3d4e5d-f6ec-49d0-b086-20d7e29e96fd")
      .subscribe((res: any) => {
        this.subAgentFileHistory = res.data;
        // this.subAgentFileHistory = [...this.subAgentFileHistory, ...this.subAgentFileHistory, ...this.subAgentFileHistory, ...this.subAgentFileHistory, ...this.subAgentFileHistory, ...this.subAgentFileHistory]
        this.initializeSubAgentFilePagination();
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        this.toaster.showError(this.toastMessages.apierror);
      });
  }

  convertToMB(bytes: number): string {
    const mb = bytes / (1024 * 1024);
    return mb.toFixed(2) + ' MB';
  }

  removeFileExtension(fileName: string): string {
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1) {
        return fileName;
    }
    return fileName.substring(0, lastDotIndex);
  }

  viewOverlayForm(inprogressAgent){
    console.log("inprogressAgent",inprogressAgent)
    this.configurationOverlay = true
    this.aiAgentsConfig.getData(this.params.id,this.params.agentId,inprogressAgent.predefinedRunId);
  }

  subAgentFileSortBy(column: string) {
    if (this.subAgentFileSortColumn === column) {
      this.subAgentFileSortDirection = -this.subAgentFileSortDirection;
    } else {
      this.subAgentFileSortColumn = column;
      this.subAgentFileSortDirection = 1;
    }

    this.subAgentFileHistory.sort((a, b) => {
      let valueA = a[column];
      let valueB = b[column];

      if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (valueA < valueB) {
        return -1 * this.subAgentFileSortDirection;
      } else if (valueA > valueB) {
        return 1 * this.subAgentFileSortDirection;
      } else {
        return 0;
      }
    });

    this.updateFileFilteredData();
  }

  subAgentFileToggleSelectAll(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.subAgentFileHistory.forEach(file => file.selected = isChecked);
    const selectedFiles = this.subAgentFileHistory.filter(file => file.selected);
    console.log("selectedFiles :",selectedFiles);
  }

  subAgentFileHasSelectedFiles(): boolean {
    return this.subAgentFileHistory.some(file => file.selected);
  }


  subAgentFileDownloadSelectedFiles() {
    const selectedFiles = this.subAgentFileHistory.filter(file => file.selected);

    if (selectedFiles.length >= 1) {
      this.spinner.show();
      this.rest_service.downloadAgentFiles(selectedFiles).subscribe(
        (response: any) => {
          if (response.code == 4200) {
            const resp_data = response.data;
            const currentDate = new Date().toISOString().split('T')[0];

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
                this.toaster.toastSuccess(`Files downloaded successfully.`);
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
                  const saveFileName = `AI_Agent_Files_${currentDate}.zip`;
                  FileSaver.saveAs(content, saveFileName);
                });
                this.toaster.toastSuccess(`Files downloaded successfully.`);
                this.subAgentFileHistory.forEach(file => file.selected = false);
              }
            } else {
              this.toaster.showError("Error downloading files.");
            }
          } else {
            this.toaster.showError("Error downloading files.");
          }
          this.spinner.hide();
        },
        (error) => {
          this.toaster.showError("Error");
          this.spinner.hide();
        }
      );
    } else {
      this.toaster.showWarn("Please select the files.");
    }
  }

  subAgentFileDeleteSelectedFiles() {
    const selectedFiles = this.subAgentFileHistory.filter(file => file.selected);

    if (selectedFiles.length >= 1) {
      this.spinner.show();
      this.rest_service.deleteAgentFIles(selectedFiles).subscribe(
        (res: any) => {
          this.getSubAgentFileHistoryLogs();
          this.subAgentFileHistory.forEach(file => file.selected = false);
          this.spinner.hide();
          this.toaster.toastSuccess("Files deleted successfully.");
        },
        (err) => {
          this.spinner.hide();
          this.toaster.showError(this.toastMessages.apierror);
        }
      );
    } else {
      this.toaster.showWarn("Please select the files.");
    }
  }


  downloadSubAgentHistoryAsExcel() {
    const historyData = this.historyToDownload;
    console.log("EXCEL STARTED ");

    if (!historyData || historyData.length === 0) {
      this.toaster.showWarn("No data available to download.");
      return;
    }

    try {
      const headers = ['Agent ID', 'Agent Run ID', 'Agent Name', 'Start Time', 'End Time', 'Status'];

      const worksheetData = [
        headers,
        ...historyData.map(record => [
          record.agentId,
          record.agentRunId,
          record.agentName,
          record.startTS,
          record.endTS,
          record.status
        ])
      ];

      const ws = XLSX.utils.aoa_to_sheet(worksheetData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'History');

      const fileName = `${this.subAgentHistory[0].agentName}_History_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);

      this.toaster.toastSuccess(" Agent History downloaded successfully.");

    } catch (error) {
      this.toaster.showError("Error downloading history.");
    }
    console.log("EXCEL STARTED ");

  }

  getSubAgentsInprogressList() {
    this.spinner.show();
    this.rest_service.getSubAgentsInprogressList(this.params.agentId)
      .subscribe((res: any) => {
        let data = res.data.reverse();
        data.forEach((item: any) => {
          item.percentage = item.percentage+"%"
        })
        this.inProgressAgents = data;
        console.log("inProgressAgents", this.inProgressAgents);
        // this.inProgressAgents = res.data.reverse();
        this.initializePaginationDots();
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        this.toaster.showError(this.toastMessages.apierror);
      });
  }

}
