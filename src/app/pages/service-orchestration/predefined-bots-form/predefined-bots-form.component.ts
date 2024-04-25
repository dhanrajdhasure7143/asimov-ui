import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { StepsModule } from 'primeng/steps';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-predefined-bots-form',
  templateUrl: './predefined-bots-form.component.html',
  styleUrls: ['./predefined-bots-form.component.css']
})
export class PredefinedBotsFormComponent implements OnInit, OnDestroy {
  processName = "Automate your Recruitment Process";
  currentPage = 1;
  fieldsPerPage = 5;
  allFields = [];
  form: FormGroup;
  pages: number[] = [];
  nodes: number[] = [];
  isShowForm:boolean=false;
  items: MenuItem[];
  activeIndex = 0;
  params:any={}
  private subscription: Subscription;


  constructor(private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {
      this.route.queryParams.subscribe(parms=>{
        this.params=parms
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

    this.items = [
      {label: 'Personal'},
      {label: 'Seat Selection'},
      {label: 'Payment'},
      {label: 'Confirmation'}
    ];
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  fetchAllFields() {
    this.allFields = [
      { label: "Bot Name", name: "botname", type: "text", placeholder: "Enter bot name" },
      { label: "SharePoint URL", name: "sharePointUrl", type: "text", placeholder: "Enter SharePoint URL" },
      { label: "Tenant ID", name: "tenantId", type: "number", placeholder: "Enter tenant ID" },
      { label: "Client ID", name: "clientId", type: "email", placeholder: "Enter client ID" },
      { label: "Client Secret", name: "clientSecret", type: "text", placeholder: "Enter client secret" },
      { label: "SharePoint Login Reference", name: "sharePointLoginReference", type: "text", placeholder: "Enter login reference" },
      { label: "Download Type", name: "downloadType", type: "dropdown", options: ['File', 'Folder'], placeholder: "Select download type" },
      { label: "File/Folder Check", name: "fileFolderCheck", type: "text", placeholder: "Enter file/folder check" },
      { label: "Library Name", name: "libraryName", type: "text", placeholder: "Enter library name" },
      { label: "Email/Organization Name", name: "emailOrgName", type: "dropdown", options: ['EPSoft', 'Microsoft'], placeholder: "Select organization" }
  ]; 



    const fieldsGroup = {};
    this.allFields.forEach(field => {
      fieldsGroup[field.name] = ['', Validators.required];
    });
    this.form.setControl('fields', this.fb.group(fieldsGroup));
    if(this.params.type =='edit'){
      const existingBotData = {
        botname: "Recruitment Bot",
        sharePointUrl: "https://mycompany.sharepoint.com",
        tenantId: 123456789,
        clientId: "abcdef-12345-xyz-kljvij",
        clientSecret: "s3cr3t-jhfuhe74t-kwhfuhf7-khefuhf",
        sharePointLoginReference: "Ref12345",
        downloadType: "File",
        fileFolderCheck: "Check passed",
        libraryName: "Main Library",
        emailOrgName: "EPSoft"
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

        this.calculatePages();
        // this.initForm();
  }

  calculatePages() {
    const numberOfPages = Math.ceil(this.allFields.length / this.fieldsPerPage);
    this.pages = Array.from({ length: numberOfPages }, (_, i) => i + 1);
  }

  initForm() {
    const controls = this.allFields.reduce((acc, field, index) => {
      acc[field] = new FormControl('', Validators.required);
      return acc;
    }, {});
    this.form = this.fb.group(controls);
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
    this.activeIndex = num - 1;
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

  goBackToList(){
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
