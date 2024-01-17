import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { columnList } from 'src/app/shared/model/table_columns';
import { toastMessages } from 'src/app/shared/model/toast_messages';
import { ToasterService } from 'src/app/shared/service/toaster.service';

enum BotContentType {
  Web = 'Web',
  Document = 'Document',
  WebAndDocument = 'Web and Document',
  Public = 'Public',
}

@Component({
  selector: 'app-manage-customer-bot',
  templateUrl: './manage-customer-bot.component.html',
  styleUrls: ['./manage-customer-bot.component.css'],
  providers: [columnList],
})
export class ManageCustomerBotComponent implements OnInit {
  columns_list: any[] = [];
  hiddenPopUp = false;
  manageBotForm: FormGroup;
  isCreate = false;
  updateOverlayData: any;
  nextRecordId = 1;

  manageBotList = [
    { id: '1', manageBotName: 'Customer Support Bot', botGreetingMessage: 'Sample Message', primaryPrompt: 'Sample prompt', responsePrefix: 'Sample prefix', isHallucination: false, isActive: true, isDelete: true, botKey: 'SampleKey', embedUrl: 'http://www.google.com', botContentType: 'Document', include_sites: '', exclude_sites: '' },
    { id: '2', manageBotName: 'Agent Support Bot', botGreetingMessage: 'Sample', primaryPrompt: 'Sample prompt', responsePrefix: 'Sample prefix', isHallucination: true, isActive: true, isDelete: false, botKey: 'SampleKey', embedUrl: 'http://www.google.com', botContentType: 'Web', include_sites: 'SampleSite', exclude_sites: 'SampleSite' },
    { id: '3', manageBotName: 'Employee Support Bot', botGreetingMessage: 'Sample Greeting', primaryPrompt: 'Sample prompt', responsePrefix: 'Sample prefix', isHallucination: false, isActive: true, isDelete: true, botKey: 'SampleKey', embedUrl: 'http://www.google.com', botContentType: 'Document and Web', include_sites: '', exclude_sites: '' },
    { id: '4', manageBotName: 'Sample Record', botGreetingMessage: 'Sample Data', primaryPrompt: 'Sample prompt', responsePrefix: 'Sample prefix', isHallucination: true, isActive: true, isDelete: false, botKey: 'SampleKey', embedUrl: 'http://www.google.com', botContentType: 'Sample Data', include_sites: '', exclude_sites: '' },
  ];

  botContentOptions: SelectItem[] = Object.values(BotContentType).map((value) => ({ label: value, value }));
  table_searchFields: string[];

  constructor(
    private columns: columnList,
    private formBuilder: FormBuilder,
    private loader: LoaderService,
    private toastService: ToasterService,
    private toastMessages: toastMessages,
    private confirmationService: ConfirmationService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loader.show();
    this.columns_list = this.columns.manage_cutomer_support_bot_coloumns;
    this.table_searchFields = ['manageBotName', 'botContentType'];
    this.initializeBotForm();
    setTimeout(() => {
      this.loader.hide();
    }, 1000);
  }

  private initializeBotForm() {
    const formControls = {
      manageBotName: ['', [Validators.required, Validators.maxLength(50)]],
      botGreetingMessage: ['', [Validators.required, Validators.maxLength(50)]],
      primaryPrompt: [''],
      responsePrefix: [''],
      embedUrl: ['www.google.com', [Validators.required, Validators.maxLength(50)]],
      botKey: ['SampleKey', [Validators.required, Validators.maxLength(50)]],
      isHallucination: [false],
      isActive: [false],
      isDelete: [false],
      botContentType: ['', [Validators.required, Validators.maxLength(50)]],
      include_sites: [{ value: '', disabled: true }, [Validators.required]],
      exclude_sites: [{ value: '', disabled: true }, [Validators.required]],
    };
    this.manageBotForm = this.formBuilder.group(formControls);
  }

  addNew() {
    this.hiddenPopUp = true;
    this.isCreate = true;
    this.initializeBotForm();
  }

  viewDetails(event: any) {
    console.log(event);
    this.router.navigate(["/pages/admin/view-customer-bot-details"], {
      queryParams: { id: event.id, name : event.manageBotName, },
    });
  }
 

  deleteBot(event) {
    const recordIdToDelete = event.id;
    this.confirmationService.confirm({
      message: 'Do you want to delete this record? This can\'t be undone.',
      header: 'Are you sure?',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      rejectButtonStyleClass: 'btn reset-btn',
      acceptButtonStyleClass: 'btn bluebg-button',
      defaultFocus: 'none',
      rejectIcon: 'null',
      acceptIcon: 'null',
      key: 'positionDialog',
      accept: () => {
        this.loader.show();
        this.manageBotList = this.manageBotList.filter((record) => record.id !== recordIdToDelete);
        this.loader.hide();
        this.toastService.showSuccess('Deleted Successfully', 'response');
      },
      reject: () => { },
    });
  }

  openUpdateOverlay(event: any) {
    this.hiddenPopUp = true;
    this.isCreate = false;
    this.updateOverlayData = event;
    // this.manageBotForm.patchValue(this.updateOverlayData);
    if (this.updateOverlayData) {
      this.manageBotForm.patchValue(this.updateOverlayData);
    } else {
      console.error('updateOverlayData is undefined or null.');
    }
  }

  formSubmit() {
    this.loader.show();
    const recordId = Date.now();
    const sampleObj = {
      id: recordId,
      ...this.manageBotForm.value,
    };
    console.log("SamplePayload",sampleObj);
    
    this.manageBotList.push(sampleObj);
    this.toastService.showSuccess('Saved Successfully', 'response');
    setTimeout(() => {
      this.loader.hide();
    }, 1000);
    this.nextRecordId++;
    this.hiddenPopUp = false;
    this.manageBotForm.reset();
  }


  // formSubmit() {
  //   this.loader.show();
  
  //   const excludeSitesControl = this.manageBotForm.get('exclude_sites');
  //   const excludeSitesArray = excludeSitesControl.value || [];
  
  //   // Join the array elements with a semicolon for logging or display
  //   const excludeSitesString = excludeSitesArray.join(';');
  
  //   // Create the payload with the original array
  //   const recordId = Date.now();
  //   const sampleObj = {
  //     id: recordId,
  //     ...this.manageBotForm.value,
  //     exclude_sites: excludeSitesArray,
  //   };
  
  //   console.log("SamplePayload", sampleObj);
  //   console.log("Exclude Sites String", excludeSitesString);
  
  //   this.manageBotList.push(sampleObj);
  //   this.toastService.showSuccess('Saved Successfully', 'response');
  //   setTimeout(() => {
  //     this.loader.hide();
  //   }, 1000);
  
  //   this.nextRecordId++;
  //   this.hiddenPopUp = false;
  //   this.manageBotForm.reset();
  // }
  
  
  updateDatails() {
    this.loader.show();
    const updatedRecordId = this.updateOverlayData.id;
    const updatedRecordIndex = this.manageBotList.findIndex((record) => record.id === updatedRecordId);
    if (updatedRecordIndex !== -1) {
      this.manageBotList[updatedRecordIndex] = { ...this.manageBotForm.value, id: updatedRecordId };
      this.hiddenPopUp = false;
      this.manageBotForm.reset();
      this.toastService.showSuccess('Updated Successfully', 'response');
      setTimeout(() => {
        this.loader.hide();
      }, 1000);
    } else {
      console.error('Record not found for update.');
    }
  }

  resetbotform() {
    this.manageBotForm.reset();
    this.manageBotForm.get('embedUrl').setValue('http://www.google.com');
    this.manageBotForm.get('botKey').setValue('SampleKey');
  }

  closeOverlay(event: any) {
    this.hiddenPopUp = event;
    this.manageBotForm.reset();
  }

  onBotContentTypeChange(selectedValue: any) {
    const includeSitesControl = this.manageBotForm.get('include_sites');
    const excludeSitesControl = this.manageBotForm.get('exclude_sites');
    const isWebContentType = selectedValue === BotContentType.Web;

    if (isWebContentType) {
      includeSitesControl.enable();
      excludeSitesControl.enable();
      includeSitesControl.setValidators([Validators.required]);
      excludeSitesControl.setValidators([Validators.required]);
    } else {
      includeSitesControl.disable();
      excludeSitesControl.disable();
      includeSitesControl.clearValidators();
      excludeSitesControl.clearValidators();
      includeSitesControl.reset();
      excludeSitesControl.reset();
    }

    includeSitesControl.updateValueAndValidity();
    excludeSitesControl.updateValueAndValidity();
  }

  openEzAsk_Chat(rowData: any) {
    window.location.href = '<iframe src="https://ezflowezask.dev.epsoftinc.com/?q=0RsxA5iDRyJg2kIJF91sHykOFng0qfQo5WnfLahWspb%20C7QCS5JXREVmQoNxazwVDgcsKyI%202%2FzjdI5p9GgnxYHS91V%20NBNXtNg%3D%27" width="800" height="600" style="border:none;"></iframe>';
  }  

semicolumn(event: KeyboardEvent) {
  if (event.key === ";") {
    event.preventDefault();
    const element = event.target as HTMLElement;
    element.blur();
    element.focus();
  }
}
}
