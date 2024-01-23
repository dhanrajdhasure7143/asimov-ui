import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { columnList } from 'src/app/shared/model/table_columns';
import { toastMessages } from 'src/app/shared/model/toast_messages';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { CopilotService } from '../../services/copilot.service';

enum BotContentType {
  Web = 'WEB',
  Document = 'DOC',
  WebAndDocument = 'Web and Document',
  Public = 'PUB',
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
    // { id: '1', manageBotName: 'Customer Support Bot', greetingMessage: 'Sample Message', primaryPrompt: 'Sample prompt', respPrefix: 'Sample prefix', hallucinationAllowed: false, isActive: true, isDelete: true, botKey: 'SampleKey', customerSupportBotEmbedUrl: 'http://www.google.com', customerSupportBotSource: 'Document', include_sites: '', exclude_sites: '' },
    // { id: '2', manageBotName: 'Agent Support Bot', greetingMessage: 'Sample', primaryPrompt: 'Sample prompt', respPrefix: 'Sample prefix', hallucinationAllowed: true, isActive: true, isDelete: false, botKey: 'SampleKey', customerSupportBotEmbedUrl: 'http://www.google.com', customerSupportBotSource: 'Web', include_sites: 'SampleSite', exclude_sites: 'SampleSite' },
    // { id: '3', manageBotName: 'Employee Support Bot', greetingMessage: 'Sample Greeting', primaryPrompt: 'Sample prompt', respPrefix: 'Sample prefix', hallucinationAllowed: false, isActive: true, isDelete: true, botKey: 'SampleKey', customerSupportBotEmbedUrl: 'http://www.google.com', customerSupportBotSource: 'Document and Web', include_sites: '', exclude_sites: '' },
    // { id: '4', manageBotName: 'Sample Record', greetingMessage: 'Sample Data', primaryPrompt: 'Sample prompt', respPrefix: 'Sample prefix', hallucinationAllowed: true, isActive: true, isDelete: false, botKey: 'SampleKey', customerSupportBotEmbedUrl: 'http://www.google.com', customerSupportBotSource: 'Sample Data', include_sites: '', exclude_sites: '' },
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
    private rest_api: CopilotService,
  ) { }

  ngOnInit(): void {
    this.loader.show();
    this.columns_list = this.columns.manage_cutomer_support_bot_coloumns;
    this.initializeBotForm();
    this.getAllCustomerBots();
    setTimeout(() => {
      this.loader.hide();
    }, 1000);
  }

  private initializeBotForm() {
    const formControls = {
      customerSupportBotName: ['', [Validators.required, Validators.maxLength(50)]],
      greetingMessage: ['', [Validators.required, Validators.maxLength(50)]],
      primaryPrompt: [''],
      respPrefix: [''],
      customerSupportBotEmbedUrl: [''],
      botKey: [''],
      // customerSupportBotEmbedUrl: ['', [Validators.required, Validators.maxLength(50)]],
      // botKey: ['', [Validators.required, Validators.maxLength(50)]],
      hallucinationAllowed: [false],
      isActive: [false],
      isDelete: [false],
      customerSupportBotSource: ['', [Validators.required, Validators.maxLength(50)]],
      // include_sites: [{ value: '', disabled: true }, [Validators.required]],
      // exclude_sites: [{ value: '', disabled: true }, [Validators.required]],
      include_sites: ['', [Validators.required]],
      exclude_sites: ['', [Validators.required]],
    };
    this.manageBotForm = this.formBuilder.group(formControls);
  }

  addNew() {
    this.hiddenPopUp = true;
    this.isCreate = true;
    this.initializeBotForm();
  }

  getAllCustomerBots() {
    this.loader.show();
    this.rest_api.getCustomerBots().subscribe((botlist) => {
      this.manageBotList = botlist;
      this.loader.hide();
      this.table_searchFields = ['customerSupportBotName', 'customerSupportBotSource'];
      console.log("custBots", botlist);
      },
      (err)=>{
        console.error("Error fetching customer bots:", err);
      }
    );
  }
  
  viewDetails(event: any) {
    console.log(event);
    this.router.navigate(["/pages/admin/view-customer-bot-details"], {
      queryParams: { id: event.id, name : event.manageBotName, },
    });
  }
 

  deleteCustomerSupportBot(event) {
    const recordIdToDelete = event.customerSupportBotId;
    const recordName = event.customerSupportBotName;
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
        let response
        // this.loader.show();
        this.rest_api.deleteCustomerBot(recordIdToDelete).subscribe((res:any)=>{
          response = res
          this.toastService.showSuccess(recordName,'delete');
          this.getAllCustomerBots();
        },(err) => {
          this.toastService.showError(response.errorMessage);
          this.loader.hide();
          this.getAllCustomerBots();
        })
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

  saveCustomerSupportBot() {
    this.loader.show();
    let req_body={
        "createdDate": "",
        "customerSupportBotId": "",
        "userId": "",
        "tenantId": "",
        "customerSupportBotName": this.manageBotForm.value.customerSupportBotName,
        "greetingMessage": this.manageBotForm.value.greetingMessage,
        // "primaryPrompt": "You are an AI customer service assistant. Follow these instructions while responding. \\n\\n 1. Response should not mention about \\\"source_content\\\". \\n\\n 2. Response should be informative, visual, logical and actionable. \\n\\n 3. Responses should be positive and engaging. \\n\\n 4. Responses should avoid being vague, off-topic. \\n\\n 5. If you don't find answer in \\\"source_content\\\" then respond only with 'NO_ANSWER', Do not answer with anything else. \\n\\n 6. Only when customer ask for human agent, add text 'AGENT' to the response. \\n\\n 7. Give the response in well formatted HTML format. \\n\\n source_content:",
        "primaryPrompt": this.manageBotForm.value.primaryPrompt,
        "respPrefix": this.manageBotForm.value.respPrefix,
        "customerSupportBotSource": this.manageBotForm.value.customerSupportBotSource,
        "customerSupportBotEmbedUrl": "",
        "botKey": "",
        "customerSupportBotCollection": "",
        "includeSites": this.manageBotForm.value.include_sites,
        "excludeSites": this.manageBotForm.value.exclude_sites,
        "botDisplayName": "Ask DL",
        "hallucinationAllowed": this.manageBotForm.value.hallucinationAllowed,
        "active": this.manageBotForm.value.isActive,
        "deleted": this.manageBotForm.value.isDelete
    }
    this.rest_api.saveCustomerBot(req_body).subscribe((res:any)=>{
      this.loader.hide();
      let bot_Name = req_body.customerSupportBotName
      this.toastService.showSuccess(bot_Name,'save');
      console.log("req_body", req_body);
      console.log("Responce", res);
    })
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
    // this.manageBotForm.get('customerSupportBotEmbedUrl').setValue('http://www.google.com');
    // this.manageBotForm.get('botKey').setValue('SampleKey');
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
