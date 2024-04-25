import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dynamic-from-new',
  templateUrl: './dynamic-from-new.component.html',
  styleUrls: ['./dynamic-from-new.component.css']
})
export class DynamicFromNewComponent implements OnInit {
  processName = "Automate your Marketing Process";
  currentPage = 1;
  fieldsPerPage = 5;
  allFields = [];
  form: FormGroup;
  pages: number[] = [];
  nodes: number[] = [];
  isShowForm:boolean=false;
  items: MenuItem[];
  activeIndex: number = 0;
  params:any={};
  private subscription: Subscription;


  constructor(private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {
      this.route.queryParams.subscribe(params=>{
        this.params=params
      })
    }

  ngOnInit(): void {

    this.form = this.fb.group({
      fields: this.fb.group({}),
      scheduleBot: [false],
      scheduleTime: [{value: '', disabled: true}]
    });
    this.fetchAllFields();
    this.calculateNodes();

this.items = [{
                label: 'Personal',
                routerLink: 'personal'
            },
            {
                label: 'Seat',
                routerLink: 'seat'
            },
            {
                label: 'Payment',
                routerLink: 'payment'
            },
            {
                label: 'Confirmation',
                routerLink: 'confirmation'
            }
        ];
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  fetchAllFields() {
    // if(this.params.type =='create'){
    //   let obj={ label: "Bot Name", name: "botName", type: "text", placeholder: "Enter bot name" }
    //   this.allFields.push(obj)
    // }
    this.allFields = [
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
    this.allFields.forEach(field => {
      fieldsGroup[field.name] = ['', Validators.required];
    }); 
    this.form.setControl('fields', this.fb.group(fieldsGroup));

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
this.allFields.forEach(field => {
  fieldsGroup[field.name] = [existingBotData[field.name] || '', Validators.required];
});
this.form.setControl('fields', this.fb.group(fieldsGroup));
  
}


    const totalPages = Math.ceil(this.allFields.length / this.fieldsPerPage);
    this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    this.subscription = this.form.get('scheduleBot').valueChanges.subscribe(checked => {
          this.form.get('scheduleTime').enable({onlySelf: checked, emitEvent: false});
        });
  }

  calculateNodes(): void {
    const totalPages = Math.ceil(this.allFields.length / this.fieldsPerPage);
    // this.nodes = Array.from({ length: totalPages }, (_, index) => index * 100 / (totalPages - 1));
  }

  nextPage() {
    if (this.currentPage < this.pages.length) {
      this.currentPage++;
    }
  }

  goToPage(num: number) {
    this.currentPage = num;
  }

  createBot() {
    if (this.form.valid) {
      console.log('Form Data:', this.form.value);
      alert('Bot created ')
    } else {
      console.log('Form is not valid!');
    }
  }

  goBack() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  get currentPageFields() {
    const startIndex = (this.currentPage - 1) * this.fieldsPerPage;
    const endIndex = startIndex + this.fieldsPerPage;
    return this.allFields.slice(startIndex, endIndex);
  }

  get isLastPage(): boolean {
    return this.currentPage === this.pages.length;
  }

  get progress(): number {
    return (this.currentPage / this.pages.length) * 100;
  }

  goBackList(){
    if(this.params.type == "create"){
      this.router.navigate(["/pages/serviceOrchestration/predefinedBots"]);
    }else{
      this.router.navigate(["/pages/serviceOrchestration/home"]);
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
}
