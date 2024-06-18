import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { PredefinedBotsService } from '../../services/predefined-bots.service';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { toastMessages } from 'src/app/shared/model/toast_messages';
import { LoaderService } from 'src/app/services/loader/loader.service';

@Component({
  selector: 'app-predefined-bots-forms',
  templateUrl: './predefined-bots-forms.component.html',
  styleUrls: ['./predefined-bots-forms.component.css']
})
export class PredefinedBotsFormsComponent implements OnInit {

  processName:string;
  currentPage = 1;
  fieldsPerPage = 20;
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

  constructor(private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private rest_service : PredefinedBotsService,
    private toaster: ToasterService,
    private toastMessages: toastMessages,
    private spinner : LoaderService
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
      // this.calculateNodes();
    }else{
      this.fetchAllFieldsToUpdateData();
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  fetchAllFields() {
    this.rest_service.getPredefinedBotAttributesList(this.params.id).subscribe((res:any)=>{
      console.log("res: ", res)
      this.agent_uuid = res.predefinedBotUUID
      console.log("Form Attributes: ", res.data)
    // this.rest_service.getPredefinedBotAttributesList("1234").subscribe((res:any)=>{
      this.spinner.hide();
      let obj = { attributeRequired: true, maxNumber: 100, minMumber: 0, placeholder: "Enter Agent Name", preAttributeLable: "Automation Agent Name", preAttributeName: "botName", preAttributeType: "text", visibility: true }
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
      if(field.attributeRequired){
        fieldsGroup[field.preAttributeName] = ['', Validators.required];
      }else{
        fieldsGroup[field.preAttributeName] = [''];
      }
    });
    this.predefinedBotsForm.setControl('fields', this.fb.group(fieldsGroup));
    const totalPages = Math.ceil(this.formFields.length / this.fieldsPerPage);
    this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
      this.pages.forEach(element => {
        let obj ={label:" ",command: () => { this.goToPage(element)}}
          this.items.push(obj)
      }); 
    setTimeout(() => {

      this.activeIndex = 0 
      // this.activeIndex = 0 
    }, 200);
    this.subscription = this.predefinedBotsForm.get('isScheduleBot').valueChanges.subscribe(checked => {
          this.predefinedBotsForm.get('schedule').enable({onlySelf: checked, emitEvent: false});
        });
  }

  fetchAllFieldsToUpdateData() {
    this.spinner.show();
    // this.rest_service.getPredefinedBotAttributesListToUpdate(this.params.id).subscribe(res=>{
    //   this.spinner.hide();
    // },err=>{
    //   this.spinner.hide();
    //   this.toaster.showError(this.toastMessages.apierror)
    // })
    this.formFields = [
      { label: "Bot Name", name: "botName", type: "text", placeholder: "Enter bot name" },
      { label: "SharePoint URL", name: "sharePointUrl", type: "text", placeholder: "Enter SharePoint URL" },
      { label: "Tenant ID", name: "tenantId", type: "number", placeholder: "Enter tenant ID" },
      { label: "Client ID", name: "clientId", type: "email", placeholder: "Enter client ID" },
      { label: "Client Secret", name: "clientSecret", type: "text", placeholder: "Enter client secret" },
      { label: "Web Driver Type", name: "webDriverType", type: "dropdown", options: ['Google Chrome', 'Microsoft Edge'], placeholder: "Select web driver type" },
      { label: "URL", name: "url", type: "text", placeholder: "Enter URL" },
      { label: "Web Element Type", name: "webElementType", type: "dropdown", options: ['X-Path', 'CSS Selector'], placeholder: "Select web element type" },
      { label: "Web Element Value", name: "webElementValue", type: "text", placeholder: "Enter web element value" },
      { label: "Value Type", name: "valueType", type: "dropdown", options: ['Text Box', 'Dropdown', 'Date Picker'], placeholder: "Select value type" },
      { label: "Value", name: "value", type: "text", placeholder: "Enter value" },
      { label: "Standard Dropdown Value", name: "standardDropdownValue", type: "text", placeholder: "Enter dropdown value" },
      { label: "Click", name: "clickAction", type: "text", placeholder: "Enter click action" },
      { label: "View", name: "viewType", type: "dropdown", options: ['Full Page', 'Default View'], placeholder: "Select view" },
      { label: "Variable", name: "variable", type: "text", placeholder: "Define variable" },
      { label: "Assignment", name: "assignment", type: "text", placeholder: "Describe assignment" },
      { label: "Email/Organization Name", name: "emailOrganization", type: "dropdown", options: ['EPSoft', 'Microsoft'], placeholder: "Select organization" },
      { label: "Email Reference", name: "emailReference", type: "text", placeholder: "Enter email reference" },
      { label: "Recipient Email", name: "recipientEmail", type: "text", placeholder: "Enter recipient's email" },
      { label: "Subject", name: "emailSubject", type: "text", placeholder: "Enter email subject" },
      { label: "Mail Message", name: "mailMessage", type: "textarea", placeholder: "Type your message" },
      { label: "File", name: "file", type: "text", placeholder: "Specify file path" },
      { label: "Signature", name: "signature", type: "text", placeholder: "Enter signature details" },
      { label: "Set Importance", name: "setImportance", type: "dropdown", options: ['Normal', 'Low', 'High'], placeholder: "Select importance level" },
      { label: "CC Recipient", name: "ccRecipient", type: "text", placeholder: "Enter CC recipient's email" },
      { label: "BCC Recipient", name: "bccRecipient", type: "text", placeholder: "Enter BCC recipient's email" }
    ];
    
    const fieldsGroup = {};
    this.formFields.forEach(field => {
      fieldsGroup[field.name] = ['', Validators.required];
    }); 
    this.predefinedBotsForm.setControl('fields', this.fb.group(fieldsGroup));

if(this.params.type =='edit'){
  const existingBotData = {
    botName: 'Marketing Bot',
    sharePointUrl: 'https://example.sharepoint.com',
    tenantId: 12345,
    clientId: 'example-client-id',
    clientSecret: 'secret-value',
    webDriverType: 'Google Chrome',
    url: 'https://example.com',
    webElementType: 'CSS Selector',
    webElementValue: '#example',
    valueType: 'Text Box',
    value: 'Hello, World!',
    standardDropdownValue: 'Option 1',
    clickAction: 'Click Here',
    viewType: 'Full Page',
    variable: 'varExample',
    assignment: 'Assign Example',
    emailOrganization: 'EPSoft',
    emailReference: 'Reference Example',
    recipientEmail: 'example@example.com',
    emailSubject: 'Subject Example',
    mailMessage: 'This is an email message example.',
    file: '/path/to/file.txt',
    signature: 'Best Regards',
    setImportance: 'Normal',
    ccRecipient: 'cc@example.com',
    bccRecipient: 'bcc@example.com'
  };
    this.formFields.forEach(field => {
      fieldsGroup[field.name] = [existingBotData[field.name] || '', Validators.required];
    });
    this.predefinedBotsForm.setControl('fields', this.fb.group(fieldsGroup));
    }
    const totalPages = Math.ceil(this.formFields.length / this.fieldsPerPage);
    this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    this.pages.forEach(element => {
      let obj ={label:" ",command: () => { this.goToPage(element)}}
        this.items.push(obj)
    });

    this.subscription = this.predefinedBotsForm.get('isScheduleBot').valueChanges.subscribe(checked => {
          this.predefinedBotsForm.get('schedule').enable({onlySelf: checked, emitEvent: false});
        });
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
    if(this.params.type == "create"){
      this.router.navigate(["/pages/predefinedbot/home"]);
    }else{
      this.router.navigate(["/pages/predefinedbot/list"]);
    }
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

  createBot() {
    console.log(this.selectedOption , this.predefinedBot_uuid)
    if(this.predefinedBot_uuid =='Pred_RFP'){
      this.rfpbotCreate()
    }else if(this.predefinedBot_uuid =='Pred_Recruitment'){
      this.recruitmentbotCreate();
    }else{
      this.botCreate();

    }
  }

  rfpbotCreate(){
    

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
        this.rest_service.savePredefinedAttributesData(req_body).subscribe(res=>{
          this.spinner.hide();
          this.router.navigate(["/pages/predefinedbot/home"]);
          this.toaster.showSuccess(botName,"create")
        },err=>{
          this.spinner.hide();
          this.toaster.showError(this.toastMessages.apierror)
        })
      // })
      } else {
        this.toaster.showInfo("Fill All fields")
      }
  }

  recruitmentbotCreate(){
    if (this.predefinedBotsForm.valid) {
      this.spinner.show();
      if(this.predefinedBotsForm.get("fields."+this.jobDescription.fieldName)){
        this.jobDescription.response["inputJobDescrption"]= this.jobDescription.data
        this.predefinedBotsForm.get("fields."+this.jobDescription.fieldName)?.setValue(JSON.stringify(this.jobDescription.response))    
      }
        let botName = this.predefinedBotsForm.value.fields.botName
        let req_body = this.predefinedBotsForm.value;
          let appendValuesList =  this.getArrayValues(this.selectedOption.append_values)
          console.log(appendValuesList)
          appendValuesList.forEach(e=>{
            req_body.fields[e] = JSON.stringify(this.jobDescription.response)
          })
        
        req_body["automationName"] = this.predefinedBotsForm.value.fields.botName
        req_body["predefinedBotType"] = this.predefinedBot_name
        req_body["productId"] = this.predefinedBot_id
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
        this.rest_service.savePredefinedAttributesData(req_body).subscribe(res=>{
          this.spinner.hide();
          this.router.navigate(["/pages/predefinedbot/home"]);
          this.toaster.showSuccess(botName,"create")
        },err=>{
          this.spinner.hide();
          this.toaster.showError(this.toastMessages.apierror)
        })
      } else {
        this.toaster.showInfo("Fill All fields")
      }
  }

  botCreate(){
    if (this.predefinedBotsForm.valid) {
      this.spinner.show();
        let botName = this.predefinedBotsForm.value.fields.botName
        let req_body = this.predefinedBotsForm.value;
        
        req_body["automationName"] = this.predefinedBotsForm.value.fields.botName
        req_body["predefinedBotType"] = this.predefinedBot_name
        req_body["productId"] = this.predefinedBot_id
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
        this.rest_service.savePredefinedAttributesData(req_body).subscribe(res=>{
          this.spinner.hide();
          this.router.navigate(["/pages/predefinedbot/home"]);
          this.toaster.showSuccess(botName,"create")
        },err=>{
          this.spinner.hide();
          this.toaster.showError(this.toastMessages.apierror)
        })
      } else {
        this.toaster.showInfo("Fill All fields")
      }
  }

  onUpdateForm(){
    if (this.predefinedBotsForm.valid) {
      console.log('Form Data:', this.predefinedBotsForm.value);
    } else {
      console.log('Form is not valid!');
    }
  }

  readEmitValue(data){
    this.scheduler_data = data;
    this.scheduleOverlayFlag = false;
    data.processName = this.predefinedBotsForm.value.fields.botName
    this.predefinedBotsForm.get("scheduleTime").setValue(this.convertSchedule(data))
  }

  convertSchedule(scheduleData) {
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
        formData.append('type', "file");
        formData.append('filePath', this.selectedFiles[0]);
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

  onFileSelected(event: any,field) {
    this.selectedFiles = event.target.files;
    console.log(this.selectedFiles)
    this.selectedOption = field
    console.log("this.selectedOption",this.selectedOption)
    // if(this.predefinedBot_uuid =='Pred_RFP'){
      const formData = new FormData();
      // this.selectedFiles.forEach(e=>{
      //   formData.append('filePath', e);
      // })

      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append("file", this.selectedFiles[i]);
      }
      formData.append("filePath", this.predefinedBot_name);
      formData.append("predefinedAgentUUID", this.predefinedBot_uuid );
      formData.append("productId", this.predefinedBot_id);

      this.rest_service.rfpFileUpload(formData).subscribe((res:any)=>{
        console.log("res",res)
        let obj = {filePath:res.fileName,
          attributName:field.preAttributeName
          }
        this.filePathValues.push(obj)
      })
    // }
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

  onCheckboxChange(event: Event, option:any) {
    const checkbox = event.target as HTMLInputElement;
    const validJsonStr = option.field.replace(/'/g, '"');
    // const array = JSON.parse(validJsonStr);
    let array;
    try {
      array = JSON.parse(validJsonStr);
    } catch (e) {
      console.error("Parsing error:", e);
    }

    if (checkbox.checked) {
      this.checkedOptions.push(option.value);
    } else {
      const index = this.checkedOptions.indexOf(option.value);
      if (index !== -1) {
        this.checkedOptions.splice(index, 1);
      }
    }
    console.log(this.checkedOptions);


    if (Array.isArray(array)) {
      if (checkbox.checked) {
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
    console.log(event)
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
}
