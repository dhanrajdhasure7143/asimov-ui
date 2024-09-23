import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { PredefinedBotsService } from '../../services/predefined-bots.service';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { toastMessages } from 'src/app/shared/model/toast_messages';
import { LoaderService } from 'src/app/services/loader/loader.service';

@Component({
  selector: 'app-ai-agent-form-old',
  templateUrl: './ai-agent-form-old.component.html',
  styleUrls: ['./ai-agent-form-old.component.css']
})
export class AiAgentFormOldComponent implements OnInit {

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
  isSaved:boolean = false;
  agentUUIDCapture:any

  constructor(private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private rest_service : PredefinedBotsService,
    private toaster: ToasterService,
    private toastMessages: toastMessages,
    private spinner : LoaderService,
    private toastMessage: toastMessages
    ) {
      this.route.queryParams.subscribe(params=>{
        this.params=params
        this.predefinedBot_id= this.params.id
      })
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
      this.isEdit = true;
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  fetchAllFields() {
    this.rest_service.getPredefinedBotAttributesList(this.params.id, this.params.agentId).subscribe((res:any)=>{
      console.log("res: ", res)
      this.agent_uuid = res.predefinedBotUUID
      this.fieldInputKey = {};
      console.log("Form Attributes: ", res.data)
    // this.rest_service.getPredefinedBotAttributesList("1234").subscribe((res:any)=>{
      this.spinner.hide();
      let obj = { attributeRequired: true, maxNumber: 100, minMumber: 0, placeholder: "Enter Agent Name", preAttributeLable: "Automation Agent Name", preAttributeName: "botName", preAttributeType: "text", visibility: true }
      this.formFields.push(obj);
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
      this.processName = "Automate your "+ this.predefinedBot_name +" Agent"
      this.predefinedBot_uuid = res.predefinedBotUUID
      this.predefinedBot_schedulerRequired = res.isSchedulerRequired
      this.generateDynamicForm();      
    },err=>{
      this.spinner.hide();
      this.toaster.showError(this.toastMessages.apierror)
    })
    
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
      console.log("Form Attributes: ", res.data)
      this.spinner.hide();
      let obj = { attributeRequired: true, maxNumber: 100, minMumber: 0, placeholder: "Enter Agent Name", preAttributeLable: "Automation Agent Name", preAttributeName: "botName", 
                  preAttributeType: "text", visibility: true, preAttributeValue: res.aiAgentName}
      this.formFields.push(obj);
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
      this.processName = "Automate your "+ this.predefinedBot_name +" Agent"
      this.predefinedBot_uuid = res.predefinedBotUUID
      this.predefinedBot_schedulerRequired = res.isSchedulerRequired
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
        req_body["automationName"] = this.predefinedBotsForm.value.fields.botName
        req_body["predefinedBotType"] = this.predefinedBot_name
        req_body["productId"] = this.predefinedBot_id
        req_body["agentUUID"] = this.params.agentId
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
        // this.toaster.showInfo("Fill All fields")
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
        req_body["automationName"] = this.predefinedBotsForm.value.fields.botName
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
        
        req_body["automationName"] = this.predefinedBotsForm.value.fields.botName
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
      console.log("AGENT-ID", this.agentUUIDCapture);
        this.captureAgentIdAndFileIds(agentUUID, this.capturedFileIds);
      this.spinner.hide();
      this.goBackAgentHome();
      this.toaster.showSuccess(botName,"create")
    },err=>{
      this.spinner.hide();
      this.toaster.showError(this.toastMessages.apierror)
    })
  }else{
    this.rest_service.updatePredefinedAttributesData(this.params.agentId,req_body).subscribe(res=>{
        const agentId = this.params.agentId;
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
    this.isSaved = true
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
  this.isSaved = true;
    console.log(this.predefinedBotsForm.value);
    if (this.predefinedBot_uuid === 'Pred_RFP' || this.predefinedBot_uuid === 'Pred_Recruitment') {
      this.uploadFilesAndCreateBot('create');
    } else {
      this.botCreate('create');
    }
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
    // this.router.navigate(['/pages/aiagent/sub-agents'],{ queryParams: { id: this.predefinedBot_id } });
  }
  goBackAgent(){
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

  runAiAgent(){
    this.spinner.show()
      console.log("AGENT-ID", this.agentUUIDCapture);
    this.rest_service.startPredefinedBot(this.params.agentId,'').subscribe((res: any) => {
    this.spinner.hide();
    this.toaster.toastSuccess("Agent Execution Started")
    }, err => {
      this.spinner.hide();
      this.toaster.showError(this.toastMessage.apierror);
    });
  }
}
