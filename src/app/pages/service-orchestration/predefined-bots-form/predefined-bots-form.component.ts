import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { StepsModule } from 'primeng/steps';

@Component({
  selector: 'app-predefined-bots-form',
  templateUrl: './predefined-bots-form.component.html',
  styleUrls: ['./predefined-bots-form.component.css']
})
export class PredefinedBotsFormComponent implements OnInit, OnDestroy {
  processName = "Automate your recruitment process";
  currentPage = 1;
  fieldsPerPage = 4;
  allFields = [];
  form: FormGroup;
  pages: number[] = [];
  nodes: number[] = [];
  isShowForm:boolean=false;
  items: MenuItem[];
  activeIndex: number = 0;
  private subscription: Subscription;


  constructor(private fb: FormBuilder) {}

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
    // Dummy data
    this.allFields = [
      { label: "What is your name?", name: "name", type: "text" },
      { label: "How old are you?", name: "age", type: "number" },
      { label: "What is your email address?", name: "email", type: "email" },
      { label: "What country do you live in?", name: "country", type: "text" },
      { label: "What is your job title?", name: "jobTitle", type: "text" },
      { label: "How did you hear about us?", name: "referralSource", type: "text" },
      { label: "What country do you live in?", name: "country", type: "text" },
      { label: "What is your job title?", name: "jobTitle", type: "text" },
      { label: "How did you hear about us?", name: "referralSource", type: "text" },
      { label: "Would you recommend us to a friend?", name: "recommendation", type: "text" }
    ];

    const fieldsGroup = {};
    this.allFields.forEach(field => {
      fieldsGroup[field.name] = ['', Validators.required];
    });
    this.form.setControl('fields', this.fb.group(fieldsGroup));

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

  goBackToOrchestration(){
    this.isShowForm=!this.isShowForm;
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
