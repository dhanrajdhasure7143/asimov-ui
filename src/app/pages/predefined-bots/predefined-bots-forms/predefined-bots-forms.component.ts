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
  fieldsPerPage = 5;
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
  private predefinedBot_name:any;
  public scheduler_data :any;

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
      this.spinner.hide();
      let obj = { attributeRequired: true, maxNumber: 100, minMumber: 0, placeholder: "Enter Bot Name", preAttributeLable: "Automation Bot Name", preAttributeName: "botName", preAttributeType: "text", visibility: true }
      this.formFields.push(obj);
      this.formFields.push(...res.data);
      // res.data.forEach(element => {
      //   this.formFields.push(element)
      // });
      // this.formFields ={...res.data};
      // this.formFields={...{},...res.data};
      this.predefinedBot_name = res.predefinedBotName;
      this.processName = "Automate your "+ this.predefinedBot_name +" Process"
      // this.formFields = [
      //   { attributeRequired: true, id: 3, maxNumber: 100, minMumber: 0, placeholder: "Enter Email", preAttributeLabel: "Enter Email", name: "Email", preAttributeType: "text", predefinedBotId: 2, productId: "prod_PdiLNkF4ZbHkgj", visibility: true },
      //   { attributeRequired: true, id: 3, maxNumber: 100, minMumber: 0, placeholder: "Enter Email", preAttributeLabel: "Enter Email", name: "Email", preAttributeType: "text", predefinedBotId: 2, productId: "prod_PdiLNkF4ZbHkgj", visibility: true },
      //   { attributeRequired: true, id: 3, maxNumber: 100, minMumber: 0, placeholder: "Enter Email", preAttributeLabel: "Enter Email", name: "Email", preAttributeType: "number", predefinedBotId: 2, productId: "prod_PdiLNkF4ZbHkgj", visibility: true },
      //   { attributeRequired: true, id: 3, maxNumber: 100, minMumber: 0, placeholder: "Enter Email", preAttributeLabel: "Enter Email", name: "Email", preAttributeType: "email", predefinedBotId: 2, productId: "prod_PdiLNkF4ZbHkgj", visibility: true },
      //   { attributeRequired: true, id: 3, maxNumber: 100, minMumber: 0, placeholder: "Enter Email", preAttributeLabel: "Enter Email", name: "Email", preAttributeType: "text", predefinedBotId: 2, productId: "prod_PdiLNkF4ZbHkgj", visibility: true },
      //   { attributeRequired: true, id: 3, maxNumber: 100, minMumber: 0, placeholder: "Enter Email", preAttributeLabel: "Enter Email", name: "Email", preAttributeType: "dropdown", predefinedBotId: 2, productId: "prod_PdiLNkF4ZbHkgj", visibility: true },
      //   { attributeRequired: true, id: 3, maxNumber: 100, minMumber: 0, placeholder: "Enter Email", preAttributeLabel: "Enter Email", name: "Email", preAttributeType: "text", predefinedBotId: 2, productId: "prod_PdiLNkF4ZbHkgj", visibility: true },
      //   { attributeRequired: true, id: 3, maxNumber: 100, minMumber: 0, placeholder: "Enter Email", preAttributeLabel: "Enter Email", name: "Email", preAttributeType: "dropdown", predefinedBotId: 2, productId: "prod_PdiLNkF4ZbHkgj", visibility: true },
      //   { attributeRequired: true, id: 3, maxNumber: 100, minMumber: 0, placeholder: "Enter Email", preAttributeLabel: "Enter Email", name: "Email", preAttributeType: "text", predefinedBotId: 2, productId: "prod_PdiLNkF4ZbHkgj", visibility: true },
      //   { attributeRequired: true, id: 3, maxNumber: 100, minMumber: 0, placeholder: "Enter Email", preAttributeLabel: "Enter Email", name: "Email", preAttributeType: "dropdown", predefinedBotId: 2, productId: "prod_PdiLNkF4ZbHkgj", visibility: true },
      //   { attributeRequired: true, id: 3, maxNumber: 100, minMumber: 0, placeholder: "Enter Email", preAttributeLabel: "Enter Email", name: "Email", preAttributeType: "text", predefinedBotId: 2, productId: "prod_PdiLNkF4ZbHkgj", visibility: true },
      //   { attributeRequired: true, id: 3, maxNumber: 100, minMumber: 0, placeholder: "Enter Email", preAttributeLabel: "Enter Email", name: "Email", preAttributeType: "text", predefinedBotId: 2, productId: "prod_PdiLNkF4ZbHkgj", visibility: true },
      //   { attributeRequired: true, id: 3, maxNumber: 100, minMumber: 0, placeholder: "Enter Email", preAttributeLabel: "Enter Email", name: "Email", preAttributeType: "text", predefinedBotId: 2, productId: "prod_PdiLNkF4ZbHkgj", visibility: true },
      // ]
    
    //   this.formFields = [
    //   { label: "Bot Name", name: "botName", type: "text", placeholder: "Enter bot name" },
    //   { label: "SharePoint URL", name: "sharePointUrl", type: "text", placeholder: "Enter SharePoint URL" },
    //   { label: "Tenant ID", name: "tenantId", type: "number", placeholder: "Enter tenant ID" },
    //   { label: "Client ID", name: "clientId", type: "email", placeholder: "Enter client ID" },
    //   { label: "Client Secret", name: "clientSecret", type: "text", placeholder: "Enter client secret" },
    //   { label: "Web Driver Type", name: "webDriverType", type: "dropdown", options: ['Google Chrome', 'Microsoft Edge'], placeholder: "Select web driver type" },
    //   { label: "URL", name: "url", type: "text", placeholder: "Enter URL" },
    //   { label: "Web Element Type", name: "webElementType", type: "dropdown", options: ['X-Path', 'CSS Selector'], placeholder: "Select web element type" },
    //   { label: "Web Element Value", name: "webElementValue", type: "text", placeholder: "Enter web element value" },
    //   { label: "Value Type", name: "valueType", type: "dropdown", options: ['Text Box', 'Dropdown', 'Date Picker'], placeholder: "Select value type" },
    //   { label: "Value", name: "value", type: "text", placeholder: "Enter value" },
    //   { label: "Standard Dropdown Value", name: "standardDropdownValue", type: "text", placeholder: "Enter dropdown value" },
    //   { label: "Click", name: "clickAction", type: "text", placeholder: "Enter click action" },
    //   { label: "View", name: "viewType", type: "dropdown", options: ['Full Page', 'Default View'], placeholder: "Select view" },
    //   { label: "Variable", name: "variable", type: "text", placeholder: "Define variable" },
    //   { label: "Assignment", name: "assignment", type: "text", placeholder: "Describe assignment" },
    //   { label: "Email/Organization Name", name: "emailOrganization", type: "dropdown", options: ['EPSoft', 'Microsoft'], placeholder: "Select organization" },
    //   { label: "Email Reference", name: "emailReference", type: "text", placeholder: "Enter email reference" },
    //   { label: "Recipient Email", name: "recipientEmail", type: "text", placeholder: "Enter recipient's email" },
    //   { label: "Subject", name: "emailSubject", type: "text", placeholder: "Enter email subject" },
    //   { label: "Mail Message", name: "mailMessage", type: "textarea", placeholder: "Type your message" },
    //   { label: "File", name: "file", type: "text", placeholder: "Specify file path" },
    //   { label: "Signature", name: "signature", type: "text", placeholder: "Enter signature details" },
    //   { label: "Set Importance", name: "setImportance", type: "dropdown", options: ['Normal', 'Low', 'High'], placeholder: "Select importance level" },
    //   { label: "CC Recipient", name: "ccRecipient", type: "text", placeholder: "Enter CC recipient's email" },
    //   { label: "BCC Recipient", name: "bccRecipient", type: "text", placeholder: "Enter BCC recipient's email" }
    // ];
      this.generateDynamicForm();      
    },err=>{
      this.spinner.hide();
      this.toaster.showError(this.toastMessages.apierror)
    })
    
  }

  generateDynamicForm(){
    const fieldsGroup = {};
    this.formFields.forEach(field => {
      fieldsGroup[field.preAttributeName] = ['', Validators.required];
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
    console.log(this.pages)
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
    this.spinner.show();
    if (this.predefinedBotsForm.valid) {
      let botName = this.predefinedBotsForm.value.fields.botName
      let req_body = this.predefinedBotsForm.value
      req_body["automationName"] = this.predefinedBotsForm.value.fields.botName
      req_body["predefinedBotType"] = this.predefinedBot_name
      req_body["productId"] = this.predefinedBot_id
      req_body["schedule"] = this.scheduler_data ? JSON.stringify(this.scheduler_data) : '';
      delete req_body.fields.botName
      console.log('req_body---:', req_body);
      this.rest_service.savePredefinedAttributesData(req_body).subscribe(res=>{
        this.spinner.hide();
        this.router.navigate(["/pages/predefinedbot/list"]);
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

}
