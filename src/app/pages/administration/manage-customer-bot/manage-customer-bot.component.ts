import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { columnList } from 'src/app/shared/model/table_columns';
import { toastMessages } from 'src/app/shared/model/toast_messages';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { CopilotService } from '../../services/copilot.service';
import { HttpClient } from '@angular/common/http';
import { RestApiService } from '../../services/rest-api.service';

enum BotContentType {
  Web = 'WEB',
  Document = 'DOC',
  WebandDocument = 'WEB_DOC',
  Public = 'PUB',
}
enum TrainBotOptions {
  TrainModel = 'TRAIN-MODEL',
  Document = 'DOC'

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
  manageBotList = [];
  table_searchFields: string[];
  botContentOptions = [
    { label: 'Document', value: 'DOC' },
    { label: 'Web', value: 'WEB' },
    { label: 'Public', value: 'PUB' },
    { label: 'Train Model', value: 'MODEL' },
    { label: 'Hybrid', value: 'HYBRID' }
  ];
  selectedFiles: any[] = [];
  botKey: any;
  tenantName: any;
  trainedModel:any;
  trainModelOptions: any[] = [];
  filteredModelsList:any[]=[];
  trainBotOptions = [
  { label: 'TrainModel', value: 'TRAIN-MODEL' },
  { label: 'Document', value: 'DOC' },
];
  constructor(
    private columns: columnList,
    private formBuilder: FormBuilder,
    private loader: LoaderService,
    private toastService: ToasterService,
    private toastMessages: toastMessages,
    private confirmationService: ConfirmationService,
    private router: Router,
    private rest_api: CopilotService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.loader.show();
    this.columns_list = this.columns.manage_cutomer_support_bot_coloumns;
    this.initializeBotForm();
    this.getAllCustomerBots();
    setTimeout(() => {
      this.loader.hide();
    }, 1000);
    this.fetchPredefinedModels();
    this.loadePreDefinedMOdels()
  }

  loadePreDefinedMOdels(){
    this.fetchPredefinedModels()
  }
 
 
  private initializeBotForm() {
    const formControls = {
      customerSupportBotName: ['', [Validators.required, Validators.maxLength(50)]],
      greetingMessage: ['', [Validators.required, Validators.maxLength(50)]],
      primaryPrompt: [''],
      respPrefix: [''],
      customerSupportBotEmbedUrl: [''],
      botKey: [''],
      hallucinationAllowed: [false],
      active: [false],
      deleted: [false],
      customerSupportBotSource: ['', [Validators.required]],
      includeSites: ['', [Validators.required]],
      excludeSites: ['', [Validators.required]],
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
      },
      (err)=>{
        this.toastService.showError("Error fetching customer bots");
      }
    );
  }

  fetchPredefinedModels() {
  this.rest_api.getPredefinedModels().subscribe(
    (modelsList) => {
      console.log(modelsList, "modelsList");
// Assuming modelsList is an array of objects containing the model information
 this.filteredModelsList = modelsList.filter(model => model.tenantName === localStorage.getItem("tenantName"));
      this.trainModelOptions = this.filteredModelsList.map((model) => ({
        label: model.modelName,
        value: model.modelName 
      }));
    },
    (error) => {
      console.error('Error loading models:', error);
    }
  );
}

  viewDetails(event: any) {
    this.router.navigate(["/pages/admin/view-customer-bot-details"], {
      queryParams: { id: event.customerSupportBotId, name : event.customerSupportBotName, },
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
        this.loader.show();
        this.rest_api.deleteCustomerBot(recordIdToDelete).subscribe((res: any) => {
          this.loader.hide();
          if (res.errorMessage == undefined) {
            this.toastService.showSuccess(recordName, 'delete');
            this.getAllCustomerBots();
          } else {
            this.loader.hide();
            this.toastService.showError(res.errorMessage);
          }
        }, (err) => {
          this.loader.hide();
          this.toastService.showError(this.toastMessages.deleteError);
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
    const includeSitesControl = this.manageBotForm.get('includeSites');
    const excludeSitesControl = this.manageBotForm.get('excludeSites');
    if (this.updateOverlayData.customerSupportBotSource == 'WEB') {
      this.manageBotForm.get('includeSites').enable();
      this.manageBotForm.get('excludeSites').enable();
      includeSitesControl.setValidators([Validators.required]);
      excludeSitesControl.setValidators([Validators.required]);
    }
   
    else {
      this.manageBotForm.get('includeSites').disable();
      this.manageBotForm.get('excludeSites').disable();
      includeSitesControl.clearValidators();
      excludeSitesControl.clearValidators();
      includeSitesControl.reset();
      excludeSitesControl.reset();
    }
    includeSitesControl.updateValueAndValidity();
    excludeSitesControl.updateValueAndValidity();
    if (this.updateOverlayData) {
      if (typeof this.updateOverlayData.excludeSites === 'string') {
        this.updateOverlayData.excludeSites = this.updateOverlayData.excludeSites.split(';');
        this.updateOverlayData.includeSites = this.updateOverlayData.includeSites.split(';');
      } else {
        // Handle the case where excludeSites is not a string (e.g., set it to an empty array)
        this.updateOverlayData.excludeSitesArray = [];
        this.updateOverlayData.includeSitesArray = [];
      }
      this.manageBotForm.patchValue(this.updateOverlayData);
    } else {
      console.error('update Overlay Data is undefined or null.');
    }
  }

  saveCustomerSupportBot() {
    this.loader.show();
    const includeSites = this.manageBotForm.value.includeSites ? this.manageBotForm.value.includeSites.join(';'):null;
    const excludeSites = this.manageBotForm.value.excludeSites ? this.manageBotForm.value.excludeSites.join(';'):null;
    let req_body={
        "createdDate": "",
        "customerSupportBotId": "",
        "userId": "",
        "tenantId": "",
        "customerSupportBotName": this.manageBotForm.value.customerSupportBotName,
        "greetingMessage": this.manageBotForm.value.greetingMessage,
        "primaryPrompt": this.manageBotForm.value.primaryPrompt,
        // "respPrefix": this.manageBotForm.value.respPrefix,
        "respPrefix": this.trainedModel,
        "customerSupportBotSource": this.manageBotForm.value.customerSupportBotSource,
        "customerSupportBotEmbedUrl": "",
        "botKey": "",
        "customerSupportBotCollection": "",
        "includeSites": includeSites,
        "excludeSites": excludeSites,
        "botDisplayName": this.manageBotForm.value.customerSupportBotName,
        "hallucinationAllowed": this.manageBotForm.value.hallucinationAllowed,
        "active": this.manageBotForm.value.active,
        "deleted": this.manageBotForm.value.deleted
      }
      this.rest_api.saveCustomerBot(req_body).subscribe((res: any) => {
        let response = res;
        let bot_Name = req_body.customerSupportBotName;
      
        if (response.errorMessage == undefined) {
          this.botKey = res.botKey,
          this.tenantName = res.tenantId,
          this.trainedModel=res.respPrefix
          //here based on the condition call file uploade api or model and file uploade

          //1.if is only file
          if(req_body.customerSupportBotSource=="DOC"){
            this.onUploadDoc();
            this.getAllCustomerBots();
          }
       
        //2.pytho api m ==> model name and file
        if(req_body.customerSupportBotSource=="HYBRID"){
          this.onUploadeModelAndFile(bot_Name)
        
        }
        if(req_body.customerSupportBotSource=="MODEL"){
          this.onUploadeMode(bot_Name)
         
        }else {
          this.loader.hide();
          this.manageBotForm.reset();
          this.hiddenPopUp = false;
          } 
         
        } 
        this.getAllCustomerBots();
               
      },(err: any) => {
          this.loader.hide();
          this.toastService.showError(this.toastMessages.saveError);
        })
        this.manageBotForm.reset();
  }
    
  updateCustomerSupportBot() {
    this.loader.show();
    const includeSites = this.manageBotForm.value.includeSites ? this.manageBotForm.value.includeSites.join(';'):null;
    const excludeSites = this.manageBotForm.value.excludeSites ? this.manageBotForm.value.excludeSites.join(';'):null;
    let cutomerBotId = this.updateOverlayData.customerSupportBotId
    let req_body={
        "customerSupportBotId": cutomerBotId,
        "userId": "",
        "tenantId": "",
        "customerSupportBotName": this.manageBotForm.value.customerSupportBotName,
        "greetingMessage": this.manageBotForm.value.greetingMessage,
        "primaryPrompt": this.manageBotForm.value.primaryPrompt,
        "respPrefix": this.manageBotForm.value.respPrefix,
        "customerSupportBotSource": this.manageBotForm.value.customerSupportBotSource,
        "customerSupportBotEmbedUrl": this.manageBotForm.value.customerSupportBotEmbedUrl,
        "botKey": this.manageBotForm.value.botKey,
        "customerSupportBotCollection": "",
        "includeSites": includeSites,
        "excludeSites": excludeSites,
        "botDisplayName": this.manageBotForm.value.customerSupportBotName,
        "hallucinationAllowed": this.manageBotForm.value.hallucinationAllowed,
        "active": this.manageBotForm.value.active,
        "deleted": this.manageBotForm.value.deleted
      }
      this.rest_api.updateCustomerBot(cutomerBotId, req_body).subscribe((res: any) => {
        let response = res;
        let bot_Name = req_body.customerSupportBotName;
        this.loader.hide();
        if (response.errorMessage == undefined) {
          if(req_body.customerSupportBotSource=="DOC"){
            this.botKey = res.botKey,
            this.tenantName = res.tenantId,
            this.onUploadDoc();
          }
          this.toastService.showSuccess(bot_Name, 'update');
          this.manageBotForm.reset();
          this.hiddenPopUp = false;
          this.getAllCustomerBots();
        } else {
          this.toastService.showError(response.errorMessage);
        }        
      },(err: any) => {
          this.loader.hide();
          this.toastService.showError(this.toastMessages.updateError);
        })
  }

  resetBotForm() {
    const embedUrlValue = this.manageBotForm.get('customerSupportBotEmbedUrl').value;
    const botKeyValue = this.manageBotForm.get('botKey').value;
    this.manageBotForm.reset();
    this.manageBotForm.get('customerSupportBotEmbedUrl').setValue(embedUrlValue);
    this.manageBotForm.get('botKey').setValue(botKeyValue);
  }

  closeOverlay(event: any) {
    this.hiddenPopUp = event;
    this.manageBotForm.reset();
  }

  onBotContentTypeChange(selectedValue: any) {
    const includeSitesControl = this.manageBotForm.get('includeSites');
    const excludeSitesControl = this.manageBotForm.get('excludeSites');
    if (selectedValue == "WEB"){
      this.manageBotForm.get('includeSites').enable();
      this.manageBotForm.get('excludeSites').enable();
      includeSitesControl.setValidators([Validators.required]);
      excludeSitesControl.setValidators([Validators.required]);
    }else{
      this.manageBotForm.get('includeSites').disable();
      this.manageBotForm.get('excludeSites').disable();
      includeSitesControl.clearValidators();
      excludeSitesControl.clearValidators();
      includeSitesControl.reset();
      excludeSitesControl.reset();
    }
    includeSitesControl.updateValueAndValidity();
    excludeSitesControl.updateValueAndValidity();
  }

  openEzAsk_Chat(rowData: any) {
    // const embedUrl = rowData.customerSupportBotEmbedUrl;
    const embedUrl = rowData.botKey;
   
    const fullUrl = `https://ezflowezask.dev.epsoftinc.com/?q=${encodeURIComponent(embedUrl)}`;
    window.open(fullUrl);
  }

semicolumn(event: KeyboardEvent) {
  if (event.key === ";") {
    event.preventDefault();
    const element = event.target as HTMLElement;
    element.blur();
    element.focus();
  }
}

onFileSelected(event: any) {
  this.selectedFiles = event.target.files;
}
onModelChange(value:any){
  this.trainedModel=value
}

onUploadDoc() {
  const formData = new FormData();
  // for (const file of this.selectedFiles) {
  //   formData.append('files[]', file);
  // }
  formData.append('file', this.selectedFiles[0]);
  formData.append('botKey', this.botKey);
  formData.append('tenantName',this.tenantName);
  formData.append('type',"DOC");
  // formData.append('tenantName',localStorage.getItem("tenantName"));
  // this.http.post('https://llm-python:5006/uploads', formData)
  this.http.post('https://ezflowllm.dev.epsoftinc.com/uploads', formData)
    .subscribe(
      (response) => {
        this.loader.hide();
        this.manageBotForm.reset();
        this.hiddenPopUp = false;

      },
      (error) => {
        console.error('Upload error', error);
      }
    );
}

onUploadeModelAndFile(botName:any) {

  const modelAndFormData = new FormData();
  // for (const file of this.selectedFiles) {
  //   formData.append('files[]', file);
  // }
  modelAndFormData.append('file', this.selectedFiles[0]);
  modelAndFormData.append('botKey', this.botKey);
  modelAndFormData.append('tenantName',this.tenantName);
  modelAndFormData.append('model',this.trainedModel);
  this.http.post('https://ezflowllm.dev.epsoftinc.com/uploads', modelAndFormData)
  // this.http.post('http://llm-python:5006/uploads', modelAndFormData)
    .subscribe(
      (response) => {
        console.log('model and file uploaded successfully successful', response);
        this.toastService.showSuccess(botName, 'save');
        this.manageBotForm.reset();
        this.hiddenPopUp = false;
      },
      (error) => {
        console.error('Failed to uploade  model mand file', error);
      }
    );
}




onUploadeMode(botName:any) {
  const modelData = {
    botKey: this.botKey,
    tenantName: this.tenantName,
    model: this.trainedModel

};
  // this.http.post('http://llm-python:5006/uploads/uploads', modelData)
  this.http.post('https://ezflowllm.dev.epsoftinc.com/uploads', modelData)
    .subscribe(
      (response) => {
        console.log('model uploaded successfully', response);
        this.toastService.showSuccess(botName, 'save');
        this.loader.hide();
        this.manageBotForm.reset();
        this.hiddenPopUp = false;
      },
      (error) => {
        console.error('Failed to uploade  model mand file', error);
      }
    );
}}
