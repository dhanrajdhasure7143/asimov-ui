import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Subscription, timer } from 'rxjs';
import { PredefinedBotsService } from '../../services/predefined-bots.service';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { toastMessages } from 'src/app/shared/model/toast_messages';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AiAgentConfigOverlayComponent } from '../ai-agent-config-overlay/ai-agent-config-overlay.component';
import * as JSZip from "jszip";
import * as FileSaver from "file-saver";
import { saveAs } from "file-saver";
import * as XLSX from 'xlsx';
import { takeWhile } from 'rxjs/operators';

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
  @ViewChild('aiAgentsConfig') aiAgentsConfig: AiAgentConfigOverlayComponent;
  formFields = [];
  predefinedBotsForm: FormGroup;
  pages: number[] = [];
  nodes: number[] = [];
  items: MenuItem[]=[];
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
  configurationOverlay:boolean = false;
  isMarketingAgent: boolean = false;
  marketingfieldValues:any;
  isConfigEdit:boolean= false;
  outputOverlay:boolean = false;
  outputOverlayRFP:boolean = false;

  progressBarItems = [
    { label: 'Intiated' },
    { label: 'Agent In Progress' },
    { label: 'Generating Output' },
    { label: 'Completed' }
  ];
  inProgressAgents:any[]=[];
  getStagesInterval: any;
  isConfigered:boolean = false;

  
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
  stages: any[] = [
    { name: "Initiated", status: "pending" },
    { name: "Agent In Progress", status: "pending" },
    { name: "Generating Output", status: "pending" },
    { name: "Completed", status: "pending" }
  ];
  currentStageIndex: number = -1;
  completedStages: number = -1;
  private stageSubscription: Subscription;
  isProcessing: boolean = false;
  stageFailed: boolean = false;
  agentStarted: boolean = false;

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
  activeTabMode: string ='';
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

  inboxContent: any []= [];
  selectedInBoxContent: any={};
  selectedContentIndex: number = 0;
  isOutputView:boolean = false;
  isOutputTabEnabled:boolean = false;
  
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
        this.predefinedBot_id= this.params.id;
        this.getSubAgentConfigStatus();
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
  }

  getSubAgentConfigStatus(){
    this.spinner.show();
    this.rest_service.getSubAgentConfigStatus(this.params.agentId).subscribe((res: any) => {
      console.log("isConfigered-------------------",res);
      this.isConfigered = res.isConfigured;
      // console.log("isConfigered",this.isConfigered);  
      if(this.isConfigered){
        this.fetchAllFieldsWithValue();
        this.initializePagination();
        this.getSubAgentHistoryLogs();
        this.getSubAgentFileHistoryLogs();
        this.initializeSubAgentFilePagination();
        this.getSubAgentsInprogressList();
      this.isEdit = true;
      }else{
        this.fetchAllFields();
        this.isEdit = false;
      }
      // this.isConfigered = res.data;
    }, err => {
      this.toaster.showError(this.toastMessages.apierror);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    clearInterval(this.getStagesInterval);
    this.stopProcess();
    this.stopTracking();
  }

  fetchAllFields() {
    this.rest_service.getPredefinedBotAttributesList(this.params.id, this.params.agentId).subscribe((res:any)=>{
      console.log("res: ", res)
      this.agent_uuid = res.predefinedBotUUID
      this.isMarketingAgent = this.agent_uuid === 'Pred_Marketing' ? true : false;
      if(this.agent_uuid =='pred_CustomerSupport' || this.agent_uuid == 'Pred_RFP'){
        this.activeTabMode = 'content';
        this.isOutputView = true;
        this.isOutputTabEnabled = true;
        this.getInboxConent();
      }else{
        this.activeTabMode = 'history';
        this.isOutputView = false;
        this.isOutputTabEnabled = false;
      }
      this.subAgentName = res.subAgentName;
      // this.subAgentName = this.params.agentName;

      this.isCommonForm = res.formType === 'common'? true : false;
      this.fieldInputKey = {};
      // console.log("Form Attributes: ", res.data)
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
      this.predefinedBot_uuid = res.predefinedBotUUID
      // this.predefinedBot_schedulerRequired = res.isSchedulerRequired
      this.predefinedBot_schedulerRequired = false
      this.generateDynamicForm();      
    },err=>{
      this.spinner.hide();
      this.toaster.showError(this.toastMessages.apierror)
    })
    
  }

  generateDynamicForm(){
    const fieldsGroup = {};
    this.formFields.forEach(field => {
      if(field.preAttributeType === "checkbox") {
        const checkboxGroup = this.fb.group({});
        field.options.forEach(option => {
          checkboxGroup.addControl(option.value, this.fb.control(false));
        });
        fieldsGroup[field.preAttributeName] = checkboxGroup;
        // if (field.attributeRequired) {
        //   // Add a custom validator to ensure at least one checkbox is checked
        //   fieldsGroup[field.preAttributeName] = [checkboxGroup, [this.checkboxGroupRequiredValidator()]];
        // } else {
        //   fieldsGroup[field.preAttributeName] = checkboxGroup;
        // }
      } else {
        // Handle other types of form controls
        if (field.attributeRequired) {
          fieldsGroup[field.preAttributeName] = ["", Validators.required];
        } else {
          fieldsGroup[field.preAttributeName] = [""];
        }
        // if (field.preAttributeType === 'text' && field.preAttributeLable === 'Automation Agent Name' && !this.isEdit) {
        //   fieldsGroup[field.preAttributeName] = ["", [this.agentNameCheck.bind(this)]];
        // }
      }
    });
    this.predefinedBotsForm.setControl('fields', this.fb.group(fieldsGroup));
    console.log("predefinedBotsForm",this.predefinedBotsForm.value)
    this.subscription = this.predefinedBotsForm.get('isScheduleBot').valueChanges.subscribe(checked => {
          this.predefinedBotsForm.get('schedule').enable({onlySelf: checked, emitEvent: false});
      });
  }

  fetchAllFieldsWithValue() {
    // this.spinner.show();
    this.rest_service.getAgentAttributeswithData(this.params.id,this.params.agentId).subscribe((res:any)=>{
      const keyMap = res.data.reduce((acc, field) => ({ ...acc, [field.preAttributeName]: field.preAttributeName }), {});
      this.attachmentMap = [];
      res.attachments.forEach((attachment) => {
        const fieldName = keyMap[attachment.key];
        // this.attachmentMap[fieldName] = [...(this.attachmentMap[fieldName] || []), ...attachment.attList.map((att) => ({ key: fieldName, originalFileName: att.originalFileName, attachmentId: att.id }))];
          // this.attachmentMap[fieldName] = [...(this.attachmentMap[fieldName] || []), ...attachment.attList.map((att) => ({ key: fieldName, originalFileName: att.originalFileName, attachmentId: att.id }))];
          this.attachmentMap[fieldName] = [
            ...(this.attachmentMap[fieldName] || []),
            ...attachment.attList.map((att) => ({
              ...att,  // Spread existing properties from `att`
              key: fieldName,  // Add your custom properties
              originalFileName: att.originalFileName,  // Ensure custom mapping if needed
              attachmentId: att.id
            }))
          ];
          
          // console.log('Updated attachment map:ks', this.attachmentMap[fieldName]);
      });
      this.formFields=[];

      this.fieldInputKey = {};

      res.data.forEach(item => {
        if (item.preAttributeType === 'file') {
          this.fieldInputKey[item.preAttributeName] = item.preAttributeName;
        }
      });
      this.spinner.hide();
      this.agent_uuid = res.predefinedBotUUID
      this.isMarketingAgent = this.agent_uuid === 'Pred_Marketing' ? true : false;
      if(this.agent_uuid =='pred_CustomerSupport'|| this.agent_uuid == 'Pred_RFP'){
        this.activeTabMode = 'content';
        this.isOutputView = true;
        this.isOutputTabEnabled = true;
        this.getInboxConent();
      }else{
        this.activeTabMode = 'history';
        this.isOutputView = false;
        this.isOutputTabEnabled = false;
      }
      if (this.agent_uuid === 'Pred_Marketing') {
        this.marketingfieldValues = res.data.reduce((acc, field) => ({ ...acc, [field.preAttributeName]: field.preAttributeValue }), {});
      }
      this.subAgentName = res.subAgentName;
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
      this.predefinedBot_uuid = res.predefinedBotUUID
      // this.predefinedBot_schedulerRequired = res.isSchedulerRequired
      this.predefinedBot_schedulerRequired = false
      this.predefinedBotsForm.get('isScheduleBot').setValue(this.predefinedBot_schedulerRequired)
      if(this.predefinedBot_schedulerRequired) this.schedulerValue = res.schedule
      this.generateDynamicFormUpdate();
      if (this.predefinedBot_schedulerRequired) {
        this.predefinedBotsForm.get("scheduleTime").setValue(this.convertSchedule(this.schedulerValue,true))
      }
    
    // const fieldsGroup = {};
    // this.formFields.forEach(field => {
    //   fieldsGroup[field.name] = ['', Validators.required];
    // }); 
    // this.predefinedBotsForm.setControl('fields', this.fb.group(fieldsGroup));

    // this.subscription = this.predefinedBotsForm.get('isScheduleBot').valueChanges.subscribe(checked => {
    //       this.predefinedBotsForm.get('schedule').enable({onlySelf: checked, emitEvent: false});
    //     });
      })
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

  openScheduler() {
    this.scheduleOverlayFlag = true;
  }

  closeOverlay(event) {
    this.scheduleOverlayFlag = event;
  }

  rfpAgentCreate(type){
    // if (this.predefinedBotsForm.valid) {
      this.spinner.show();
      // const formData = new FormData();
      // formData.append('filePath', this.selectedFiles[0]);
      // this.rest_service.rfpFileUpload(formData).subscribe((res:any)=>{
        // console.log("test", res)
        let botName = this.predefinedBotsForm.value.fields.botName
        let req_body = this.predefinedBotsForm.value;
        req_body["automationName"] = this.subAgentName
        req_body["agentUUID"] = this.params.agentId
        req_body["predefinedBotType"] = this.predefinedBot_name
        req_body["productId"] = this.predefinedBot_id
        req_body["schedule"] = this.scheduler_data ? JSON.stringify(this.scheduler_data) : '';
        // req_body.fields[this.selectedOption.preAttributeName] = res.fileName
        console.log("this.attachmentMap.",this.attachmentMap)
        console.log("this.filePathValuesthis.",this.filePathValues)
                
        this.filePathValues.forEach(element => {
          req_body.fields[element.attributName] = element.filePath
        });
        const allKeys = Object.keys(this.attachmentMap);
        console.log("allKeys",allKeys)
        allKeys.forEach(key => {
          let filePath = '';
          const attachments = this.attachmentMap[key];
          attachments.forEach((att, index) => {
            filePath += att.filePath + '/' + att.fileNameWithUUID;
            if (index < attachments.length - 1) {
              filePath += ',';
            }
          });
          // Push the generated filePath into the paths array
          req_body.fields[key]= req_body.fields[key]?req_body.fields[key]+','+filePath:filePath;
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
        this.saveAgentApi(req_body,type)
      // })
      // } else {
      //   this.toaster.showInfo("Fill All fields")
      // }
  }

  recruitmentAgentCreate(type){
    if (this.predefinedBotsForm.valid) {
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
        this.saveAgentApi(req_body,type)
      } else {
        this.toaster.showInfo("Fill All fields")
      }
  }

  generatePayloadToSaveUpdateAgent(type){
    // if (this.predefinedBotsForm.valid) {
        let botName = this.predefinedBotsForm.value.fields.botName
        let req_body = this.predefinedBotsForm.value;
        
        // req_body["automationName"] = this.predefinedBotsForm.value.fields.botName
        req_body["automationName"] = this.subAgentName
        req_body["predefinedBotType"] = this.predefinedBot_name
        req_body["productId"] = this.predefinedBot_id
        req_body["agentUUID"] = this.params.agentId
        req_body["schedule"] = this.scheduler_data ? JSON.stringify(this.scheduler_data) : '';
        if(this.predefinedBot_uuid == 'pred_CustomerSupport'){
            const keys = Object.keys(req_body.fields);
            const tenantIdKey = keys.find(key => key.includes('TenantId'));
            const userIdKey = keys.find(key => key.includes('UserId'));
            if (tenantIdKey) {
              req_body.fields[tenantIdKey] = localStorage.getItem('tenantName');
            }
            if (userIdKey) {
              req_body.fields[userIdKey]  = localStorage.getItem('ProfileuserId');
            }
          // .includes('CustomerSupport_dropdown') ? 'Yes' : 'No';
          this.filePathValues.forEach(element => {
            req_body.fields[element.attributName] = element.filePath
          });
          const allKeys = Object.keys(this.attachmentMap);

        allKeys.forEach(key => {
          let filePath = '';
          const attachments = this.attachmentMap[key];
          attachments.forEach((att, index) => {
            filePath += att.filePath + '/' + att.fileNameWithUUID;
            if (index < attachments.length - 1) {
              filePath += ',';
            }
          });
          // Push the generated filePath into the paths array
          req_body.fields[key]= req_body.fields[key]?req_body.fields[key]+','+filePath:filePath;
        });
        }
        console.log("Manikanta--- > "+req_body);
        delete req_body.fields.botName
        console.log(this.duplicateAttributes)
        if(this.duplicateAttributes.length >0){
          this.duplicateAttributes.forEach(ele=>{
            if(ele.options){
              req_body.fields[ele.preAttributeName] = req_body.fields[ele.options[0].duplicatesTo]
            }
          })
        }
        this.saveAgentApi(req_body,type)
        console.log('req_body---:', req_body);
      // } else {
      //   this.toaster.showInfo("Fill All fields")
      // }
  }

  saveAgentApi(req_body,type) {
    if(type == "create"){
    this.rest_service.savePredefinedAttributesData(req_body).subscribe((res:any)=>{
      const agentId = this.params.agentId;
      this.isConfigered = true;
      this.showProgress = true;
      // console.log("Agent ID and File IDs:", agentId, this.capturedFileIds);
      if(this.capturedFileIds.length > 0) {
        this.captureAgentIdAndFileIds(agentId, this.capturedFileIds);
      }
      this.spinner.hide();
      // this.goBackAgentHome(); // temporarly commented this line
      this.toaster.showSuccess(this.subAgentName,"save")
    },err=>{
      this.spinner.hide();
      this.toaster.showError(this.toastMessages.apierror)
    })
  }else{
    this.rest_service.updatePredefinedAttributesData(this.params.agentId,req_body).subscribe(res=>{
        const agentId = this.params.agentId;
        this.isConfigered = true;
        this.showProgress = true;
        this.isConfigEdit = false;
        // console.log("Agent ID and File IDs:", agentId, this.capturedFileIds);
        this.captureAgentIdAndFileIds(agentId, this.capturedFileIds);
      this.spinner.hide();
      this.toaster.showSuccess(this.subAgentName,"update")
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
      this.fetchAllFieldsWithValue();
      this.filePathValues = [];
      this.capturedFileIds = [];
    }, err => {
      this.spinner.hide();
      this.toaster.showError(this.toastMessages.apierror);
      console.error("Error capturing agent ID and file IDs:", err);
    });
  }



  initiateUpdateAgent(){
    // if (this.predefinedBotsForm.valid) {
    //   console.log(this.selectedOption , this.predefinedBotsForm)
    //   if(this.predefinedBot_uuid =='Pred_RFP' || this.predefinedBot_uuid =='Pred_Recruitment'){
    //     this.uploadFilesAndCreateBot('update')
    //   }else{
    //     this.botCreate('update');
    //   }
    // } else {
    //   console.log(this.predefinedBotsForm.controls.fields['controls'])
    //   console.log('Form is not valid!',this.attachmentMap);
    //   this.toaster.showInfo("Please fill required fields");
    // }
    if(this.validateForm() && this.validateFormForTypeFileFields()){
      this.spinner.show();
      if(this.predefinedBot_uuid =='Pred_RFP' || this.predefinedBot_uuid =='Pred_Recruitment' || this.predefinedBot_uuid === 'pred_CustomerSupport'){
        this.uploadFilesAndSaveAgent('update')
      }else{
        this.generatePayloadToSaveUpdateAgent('update');
      }
    } else {
      this.toaster.showInfo("Please fill required fields");
    }
  }

  validateForm(){
    let isValid = true;
    Object.keys(this.predefinedBotsForm.controls.fields['controls']).forEach(field => {
      const control = this.predefinedBotsForm.controls.fields.get(field);
      if (control && control.invalid) {
       let selectedField = this.formFields.find(item => item.preAttributeName === field);
       if(selectedField.preAttributeType != "file" && selectedField.attributeRequired){
        // this.toaster.showInfo("Please fill required fields");
        isValid = false;
       }
      }
    });
    return isValid
  }

  validateFormForTypeFileFields() {
    let isValid = true;
    // console.log(this.predefinedBotsForm.controls.fields.value)
    let emptyInputs = this.getEmptyFileTypeFields(this.formFields,this.predefinedBotsForm.controls.fields.value)
    console.log("emptyInputs",emptyInputs)
    emptyInputs.forEach(element => {
    const attachments = this.attachmentMap[element] ? this.attachmentMap[element]:[];
    // console.log("element",element)
    // console.log("attachments",attachments)
      if (attachments.length == 0)    isValid = false;
    })

    return isValid

    // Find all form fields where preAttributeType == 'file'
    const fileFields = this.formFields.filter(field => field.preAttributeType === 'file');
    console.log('File type fields:', fileFields);
    // console.log('File type fields11111111:', this.attachmentMap);
    fileFields.forEach(fileField => {
      if(fileField.attributeRequired){
        // console.log('File type field attributeRequired:', fileField);
      const attachments = this.attachmentMap[fileField.preAttributeName];
      if (attachments && attachments.length > 0) {
        // console.log(`Attachments found for ${fileField.preAttributeName}:`, attachments);
        isValid = true;
      } else {
        // console.log(`No attachments found for ${fileField.preAttributeName}`);
        isValid = false;
      }
    }
    });
  
    return isValid;
  }

  getEmptyFileTypeFields(fields, data) {
    const emptyFileFields = [];
    fields.forEach(field => {
      if (field.preAttributeType === 'file' && field.attributeRequired && data[field.preAttributeName] === "") {
        emptyFileFields.push(field.preAttributeName);
      }
    });
    return emptyFileFields;
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

  onFileSelected(event: any, field: any) {
    const selectedFiles = event.target.files;
    this.selectedFiles[field.preAttributeName] = selectedFiles;
    console.log("Selected files for " + field.preAttributeName, selectedFiles);

    const selectedFile = event.target.files[0];
    const fileName = selectedFile.name;
    const fileNameElement = document.querySelector('.custom-file-name');
    if(fileNameElement)
    fileNameElement.textContent = fileName;
  }

  initiateSaveAgent() {
    this.spinner.show();
    console.log("predefinedBotsForm.value",this.predefinedBotsForm.value)
    if (this.predefinedBot_uuid === 'Pred_RFP' || this.predefinedBot_uuid === 'Pred_Recruitment' || this.predefinedBot_uuid === 'pred_CustomerSupport') {
      this.uploadFilesAndSaveAgent('create');
    } else {
      this.generatePayloadToSaveUpdateAgent('create');
    }
    this.currentStage = 0;
  }

  uploadFilesAndSaveAgent(action: string) {
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
          this.rfpAgentCreate(action);
        } else if (this.predefinedBot_uuid === 'Pred_Recruitment') {
          this.recruitmentAgentCreate(action);
        }else if(this.predefinedBot_uuid === 'pred_CustomerSupport'){
          this.generatePayloadToSaveUpdateAgent(action);
        }
      }
    };
    uploadNextFile();
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

  onCheckboxChange(event, option:any,field) {
    let checkbox:any
    let checkValue:any
        checkbox = event.target as HTMLInputElement;
        checkValue = checkbox.checked;
        console.log(this.predefinedBotsForm.get('fields.' + field.preAttributeName))
      this.predefinedBotsForm.get('fields.' + field.preAttributeName).get(option.value).setValue(checkbox.checked);
    
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

      }
    }
  }

  async onDropdownChange(event: any,options:any) {
    await this.visibilityHide(options);
    const selectedValue = event.value;
    const selectedObject = options.find(option => option.value === selectedValue);
    const validJsonStr = selectedObject.field.replace(/'/g, '"');
    const array = JSON.parse(validJsonStr);
    if (Array.isArray(array))
    this.updateFieldVisibility(array, true);
  }

  visibilityHide(options){
    options.forEach(each => {;
      const validJsonStr = each.field.replace(/'/g, '"');
      const array = JSON.parse(validJsonStr);
      if (Array.isArray(array))
      this.updateFieldVisibility(array, false);
    })
  }

  updateFieldVisibility(array, value) {
    array.forEach((element: any) => {
      const field = this.formFields.find(item => item.preAttributeName === element);
      if (field) {
        field.visibility = value;
        field.attributeRequired =value;
        if(value){  
          this.updateValidators(element)
        }else{
          this.clearValidators(element);
          this.fieldRest(element);
        }
      }
    })
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

  fieldRest(item){
    this.predefinedBotsForm.get("fields."+item).reset();
  }

  generateDynamicFormUpdate(){
    const fieldsGroup = {};
    // console.log("formFields",this.formFields)
    this.formFields.forEach(field => {
      // if(field.attributeRequired){
        if(field.preAttributeType === "checkbox"){
            const checkboxGroup = this.fb.group({});
            const checkboxValues = this.parseCheckboxValues(field.preAttributeValue || "{}");
            field.options.forEach(option => {
              const isChecked = checkboxValues[option.value] || false;
              if(isChecked) this.onCheckboxChangeOnUpdate(true, option);
              checkboxGroup.addControl(option.value, this.fb.control(isChecked));
            });
            fieldsGroup[field.preAttributeName] = checkboxGroup;
          // if(field.options.length ==0 || field.options == null){
          //   fieldsGroup[field.preAttributeName] = [field.preAttributeValue]
          // }else{
          //   field.options.forEach(option => {
          //   let array = this.getArrayValues(option.field);
          //   if (array.length > 0) {
          //     console.log("array", array);
          //     const filteredFields = this.formFields.find(field => field.preAttributeName === array[0]);
          //     if (filteredFields.preAttributeValue) {
          //         fieldsGroup[option.value] = [true, Validators.required];
          //       // this.onCheckboxChange(true, option, "onUpdate");
          //       this.onCheckboxChangeOnUpdate(true, option);
          //     } else {
          //       fieldsGroup[option.value] = [false, Validators.required];
          //     }
          //   }
          //   });
          // }
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
              field.attributeRequired ? fieldsGroup[field.preAttributeName] = [field.preAttributeValue, Validators.required] : fieldsGroup[field.preAttributeName] = [field.preAttributeValue];
              // fieldsGroup[field.preAttributeName] = [field.preAttributeValue, Validators.required];
            }
            // field.preAttributeType != "file" ? fieldsGroup[field.preAttributeName] = [field.preAttributeValue, Validators.required] : fieldsGroup[field.preAttributeName] = ['', Validators.required];
            // fieldsGroup[field.preAttributeName] = [field.preAttributeValue, Validators.required];
        }
      // }else{
      //   fieldsGroup[field.preAttributeName] = [''];
      // }
    });
    this.predefinedBotsForm.setControl('fields', this.fb.group(fieldsGroup));
    console.log("predefinedBotsForm",this.predefinedBotsForm.value)

  //   this.subscription = this.predefinedBotsForm.get('isScheduleBot').valueChanges.subscribe(checked => {
  //     this.predefinedBotsForm.get('schedule').enable({onlySelf: checked, emitEvent: false});
  // });
  }

  parseCheckboxValues(preAttributeValue: string): { [key: string]: boolean } {
    const result = {};
    // Remove curly braces and split into key-value pairs
    const keyValuePairs = preAttributeValue.replace(/[{}]/g, "").split(",");
    keyValuePairs.forEach(pair => {
      const [key, value] = pair.split("=");
      // Trim and convert the value to boolean
      result[key.trim()] = value.trim() === "true";
    });
    return result;
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
    // const jobDescriptionField = this.currentPageFields.find(field => field.preAttributeLable === 'Job Description');

    // if (jobDescriptionField && jobDescriptionField.isValidateRequired) {
    //   return isFormValid && this.isJobDescrptionValid;
    // }
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
  deleteAttachment(attachment: any) {
    console.log("attachmentMap",this.attachmentMap[attachment.inputKey],attachment);

    this.subAgentFileDeleteSelectedFiles(attachment);
  }

  downloadAttachment(attachment: any) {
    this.subAgentFileDownloadSelectedFiles(attachment)
  }

  getAttachements(key){
    return this.attachmentMap[key]
  }

  loopTrackBy(index, term) {
    return index;
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

  updateSubAgentName(){
    this.spinner.show();
    this.rest_service.updateSubAgentName(!this.isConfigered,this.params.agentId,this._agentName).subscribe(res=>{
      // this.toaster.showSuccess("Agent Name","update");
      this.toaster.toastSuccess("The agent's name has been  updated successfully!");
      this.spinner.hide();
      this.isSubAgentNameEdit = false;
      this.subAgentName = this._agentName;
    }, err=>{
      this.spinner.hide();
      this.toaster.showError(this.toastMessages.apierror);
    })
  }

  onDeactivate(){
    this.isSubAgentNameEdit = false;

  }

  toggleItem() {
    this.isExpanded = !this.isExpanded;
  }
  
// prgress bar code methods for AI agents execution Starts

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
      message: `Clicking "Start Agent" will initiate the process.`,
      header: "Start Agent?",
      acceptLabel: "Start Agent",
      rejectLabel: "Cancel",
      rejectButtonStyleClass: 'btn reset-btn',
      acceptButtonStyleClass: 'btn bluebg-button',
      defaultFocus: 'none',
      rejectIcon: 'null',
      acceptIcon: 'null',
      accept: () => {
        this.spinner.show();
        this.isProcessing = true;
        this.currentStageIndex = 0;
        this.completedStages = -1;
        this.stageFailed = false;
        this.agentStarted = false;  // Reset agent started flag
        this.stages.forEach(stage => stage.status = 'pending');
        this.rest_service.startPredefinedBot(this.params.agentId).subscribe(
          (res: any) => {
            this.spinner.hide();
            if (res.errorCode == 3054) {
              this.toaster.showError("You've reached today's limit. Please try again tomorrow.");
              this.isProcessing = false;
              return;
            }
            if(res.errorCode == 3009){
              this.toaster.showError("Failed to Start Agent. Please try again later.");
              this.isProcessing = false;
              return;
            }
            if(res.status =='error'){
              this.toaster.showError("Failed to Start Agent. Please try again later.");
              this.isProcessing = false;
              return;
            }
            this.toaster.toastSuccess("The agent has been successfully initiated.");
            this.showProgress = true;
            this.agentStarted = true;  // Set agent started flag to true
            setTimeout(() => {
              this.startTracking();
            }, 5000);
          },
          err => {
            this.spinner.hide();
            this.isProcessing = false;
            this.toaster.showError(this.toastMessage.apierror);
          }
        );
      },
      reject: () => {}
    });
  }

  startTracking() {
    this.checkCurrentStage(); // Immediate first check
    this.stageSubscription = timer(6000, 6000)
      .pipe(
        takeWhile(() => this.isProcessing && !this.stageFailed && this.currentStageIndex < this.stages.length)
      )
      .subscribe(() => {
        this.checkCurrentStage();
      });
  }

  checkCurrentStage() {
    this.rest_service.getAgentStagesInfo(this.params.agentId).subscribe(
      (response: any) => {
        if (response && response.stages && response.stages.length > this.currentStageIndex) {
          const currentStageStatus = response.stages[this.currentStageIndex].status;
          this.updateCurrentStage(currentStageStatus);
        }
      },
      err => {
        console.error("Error fetching agent stages info:", err);
      }
    );
  }

  updateCurrentStage(status: string) {
    if (this.agentStarted) {  // Only update stages if agent has started
      switch (status) {
        case 'success':
          this.stages[this.currentStageIndex].status = 'success';
          this.completedStages++;
          this.currentStageIndex++;
          if (this.currentStageIndex >= this.stages.length) {
            this.stopTracking();
            this.getInboxConent();
            this.getSubAgentHistoryLogs();
            // this.toaster.toastSuccess("Agent Execution Successfully!");
          }
          break;
        case 'failure':
          this.stages[this.currentStageIndex].status = 'failure';
          this.completedStages++;
          this.stageFailed = true;
          this.stopTracking();
          this.getSubAgentHistoryLogs();
          // this.toaster.showError(`Stage '${this.stages[this.currentStageIndex].name}' failed. You can start again.`);
          this.toaster.showError(`Stage '${this.stages[this.currentStageIndex].name}' has failed. You can try starting again.`);

          break;
        // For 'running' or 'pending', we do nothing and continue tracking
      }
    }
  }

  stopTracking() {
    if (this.stageSubscription) {
      this.stageSubscription.unsubscribe();
    }
    this.isProcessing = false;
  }

  get displayStage(): string {
    if (!this.agentStarted) return '0/4';
    return `${this.completedStages + 1}/${this.stages.length}`;
  }


  stopProcess() {
    this.isRunning = false;
    clearInterval(this.processInterval);
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
      this.historyToDownload=res.data;
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
    errorMsg: item.errorLog?item.errorLog:"",
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
  this.filterStage = '';
  this.dummyFilterStage = '';
  this.sortOrder = '';
  this.searchQuery = '';
  this.subAgentCurrentPage = 1;
  this.updateFilteredData();

  this.subAgentFileCurrentPage = 1;
  this.subAgentFileItemsPerPage = 8;
  this.searchFileQuery = '';
  this.subAgentFileSortColumn = '';
  this.subAgentFileSortDirection = 1;


  this.activeTabMode = hist
  if (hist === 'files') {
    this.getSubAgentFileHistoryLogs();
  }else if(hist === 'content'){
    this.getInboxConent();
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


  subAgentFileDownloadSelectedFiles(input: string | object) {
    let selectedFiles: any[];

    if (typeof input === 'string') {
        if (input === 'Files') {
            selectedFiles = this.subAgentFileHistory.filter(file => file.selected);
        }
    } else if (typeof input === 'object') {
        selectedFiles = [input];
    } else {
        this.toaster.showWarn("Please select the files.");
        return;
    }

    if (selectedFiles.length >= 1) {
        this.confirmationService.confirm({
            message: `Are you sure you want to download file(s)?`,
            header: "Download Files",
            acceptLabel: "Yes, Download",
            rejectLabel: "No, Cancel",
            rejectButtonStyleClass: 'btn reset-btn',
            acceptButtonStyleClass: 'btn bluebg-button',
            defaultFocus: 'none',
            rejectIcon: 'null',
            acceptIcon: 'null',
            accept: () => {
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
            },
            reject: () => {
            }
        });
    } else {
        this.toaster.showWarn("Please select the files.");
    }
}


  subAgentFileDeleteSelectedFiles(input?: string | object) {
    let selectedFiles: any[];

    if (typeof input === 'string' && input === 'Files') {
        selectedFiles = this.subAgentFileHistory.filter(file => file.selected);
    } else if (typeof input === 'object') {
        selectedFiles = [input];
    } else {
        this.toaster.showWarn("Please select the files.");
        return;
    }

    if (selectedFiles.length >= 1) {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete file(s)?`,
            header: "Delete Files",
            acceptLabel: "Yes, Delete",
            rejectLabel: "No, Cancel",
            rejectButtonStyleClass: 'btn reset-btn',
            acceptButtonStyleClass: 'btn bluebg-button',
            defaultFocus: 'none',
            rejectIcon: 'null',
            acceptIcon: 'null',
            accept: () => {
                this.spinner.show();
                this.rest_service.deleteAgentFIles(selectedFiles).subscribe(
                    (res: any) => {
                        this.getSubAgentFileHistoryLogs();
                        this.subAgentFileHistory.forEach(file => file.selected = false);                       
                        this.spinner.hide();
                        this.toaster.toastSuccess("Files deleted successfully.");
                        if (typeof input === 'object') {
                          this.removeFilesFromForm(input);
                        }
                    },
                    (err) => {
                        this.spinner.hide();
                        this.toaster.showError(this.toastMessages.apierror);
                    }
                );
            },
            reject: () => {
            }
        });
    } else {
        this.toaster.showWarn("Please select the files.");
    }
}

removeFilesFromForm(deletedFile:any){
  this.attachmentMap[deletedFile.inputKey].forEach(file=>{
    if(file.fileNameWithUUID == deletedFile.fileNameWithUUID){
      this.attachmentMap[deletedFile.inputKey].splice(this.attachmentMap[deletedFile.inputKey].indexOf(file),1);
    }
  }) 
}

  downloadSubAgentHistoryAsExcel() {
    const historyData = this.historyToDownload;
    console.log("EXCEL STARTED ");

    if (!historyData || historyData.length === 0) {
      this.toaster.showWarn("No data available to download.");
      return;
    }

    try {
      const headers = ['Agent Name', 'Agent ID', 'Agent Run ID', 'Start Time', 'End Time', 'Status','Information'];

      const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleString('en-GB', { hour12: false });

      const worksheetData = [
        headers,
        ...historyData.map(record => [
          record.agentName,
          record.agentId,
          record.agentRunId,
          formatDate(record.startTS),
          formatDate(record.endTS),
          record.status,
          record.description
        ])
      ];

      const ws = XLSX.utils.aoa_to_sheet(worksheetData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'History');

      const fileName = `${this.subAgentName}_History_${new Date().toISOString().split('T')[0]}.xlsx`;
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

  backToSubAgent() {
    this.router.navigate(['/pages/aiagent/sub-agents'],{ queryParams: { id: this.params.id, botName: this.predefinedBot_name } });
  }

  getInboxConent(){
    this.rest_service.getInboxConent(this.params.agentId).subscribe((res: any) => {
      console.log("res",res)
      // this.subAgentContent = res.data;
      if(res && res.data && res.data.length > 0){
        this.inboxContent = res.data
        this.inboxContent.forEach(element => {
          element['attachments']=[{fileName:"Instruction Document.docx",fileSize:"1.2 MB"}]
        });
        this.selectedInBoxContent = this.inboxContent[0];
      }
    } , err => {  
      // this.toaster.showError(this.toastMessages.apierror);
     });
  }

  checkboxGroupRequiredValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const group = control as FormGroup;
      const isChecked = Object.values(group.controls).some(ctrl => ctrl.value === true);
      return isChecked ? null : { checkboxGroupRequired: true };
    };
  }

  resetForm(){
    this.predefinedBotsForm.reset();
  }

  downloadEmailAttachment(attachment:any){
    this.spinner.show();
    let req_body = ["predefined/Customer Support/Instruction Document.docx"]
    this.rest_service.downloadCustomerSupportFiles(req_body).subscribe((res: any) => {
      console.log("res",res);
      this.spinner.hide();
      if(res && res.length > 0){
      const fileName = attachment.fileName;
      const fileData = res[0];
      const link = document.createElement("a");
      const extension = fileName.split('.').pop();
      link.download = fileName;
      link.href =
          extension === "png" || extension === "jpg" || extension === "svg" || extension === "gif"
              ? `data:image/${extension};base64,${fileData}`
              : `data:application/${extension};base64,${fileData}`;

      link.click();
      this.toaster.toastSuccess(`Files downloaded successfully.`);
      }
      this.spinner.hide();
    },err=>{
      this.spinner.hide();
      this.toaster.showError(this.toastMessages.apierror);
    })

  }
  selectInboxOut(item,index){
    this.selectedInBoxContent = item;
    this.selectedContentIndex = index;
  }
  
  toggleConfigEdit() {
    this.isConfigEdit = !this.isConfigEdit;
  }
  
  refreshInprogressAgent(){
    this.getSubAgentConfigStatus();
  }

  getOutputOverlay(i){
    this.selectedInBoxContent = this.inboxContent[i];
    this.outputOverlay = true;
  }

  getOutputOverlayRFP(i){
    this.outputOverlayRFP =true;
  }
}
