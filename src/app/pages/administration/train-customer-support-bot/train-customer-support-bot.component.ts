import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { columnList } from 'src/app/shared/model/table_columns';
import { toastMessages } from 'src/app/shared/model/toast_messages';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { HttpClient } from '@angular/common/http';
import { RestApiService } from '../../services/rest-api.service';
import { CopilotService } from '../../services/copilot.service';

enum TrainBotOptions {
  TrainModel = 'TRAIN-MODEL',
  Document = 'DOC',
}
@Component({
  selector: 'app-train-customer-support-bot',
  templateUrl: './train-customer-support-bot.component.html',
  styleUrls: ['./train-customer-support-bot.component.css']
})
export class TrainCustomerSupportBotComponent implements OnInit {
  table_searchFields: any = [];
  columns_list: any[] = [];
  hiddenPopUp: boolean = false;
  trainBotForm: FormGroup;
  isCreate: boolean = false;
  sampleObj: any = {};
  updateOverlayData: any;
  nextRecordId: number = 1;
  filteredModelsList:any=[]
  trainBotList: any = [];


   
  trainBotOptions = [
    { label: 'TrainModel', value: 'TRAIN-MODEL' },
    { label: 'Document', value: 'DOC' },
  ];

  // trainModelOptions = [
    //   { label: "Invoice Finetune Model", value: "Invoice" },
    //   { label: "RPA Finetune Model", value: "RPA" },
    //   { label: "Story Finetune Model", value: "Story" },
    // ];
    
  selectedFiles: any[] = [];  
  trainModelOptions: { label: string; value: any }[] = []; 
  botKey: any;
  tenantName: any;

  constructor(
    private columns: columnList,
    private formBuilder: FormBuilder,
    private loader: LoaderService,
    private toastService: ToasterService,
    private toastMessages: toastMessages,
    private confirmationService: ConfirmationService,
    private rest_service: RestApiService,
    private http: HttpClient,
    private rest_api: CopilotService,
  ) { }


  ngOnInit(): void {
    this.loader.show();
    this.columns_list = this.columns.train_cutomer_support_bot_coloumns;
    this.trainBotForm = this.formBuilder.group({
      trainBotName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      // trainModelFile: ['', Validators.required], 
      // trainModel: [''], 
      trainFile: ['', Validators.required] 
    });
    this.getTableData(this.trainBotList);
    this.table_searchFields=["trainBotName","trainData"];
    this.fetchPredefinedModels()
  }

  fetchPredefinedModels() {
    this.rest_api.getPredefinedModels(localStorage.getItem("tenantName")).subscribe(
      (modelsList) => {
        console.log(modelsList, "modelsList");
  
        this.filteredModelsList = modelsList.filter(model => model.tenantName === localStorage.getItem("tenantName"));

        this.trainBotList = this.filteredModelsList.map((model) => ({
         
            id: model.id, trainBotName:model.modelName, trainData: model.fileName
          
        }));
      },
      (error) => {
        console.error('Error loading models:', error);
      }
    );
  }

  onModelChange(value:any){
    localStorage.setItem("TrainedModel",JSON.stringify(value))
  }

  getTableData(userdata) {
    userdata = this.trainBotList;
    setTimeout(() => {
      this.loader.hide();
    }, 1000);
  }

  addNew() {
    this.hiddenPopUp = true;
    this.isCreate = true;
    this.updateOverlayData="";
  }

  viewDetails(event: any) {
    console.log(event);
  }

  deleteBot(event) {
    const recordIdToDelete = event.id;
    this.confirmationService.confirm({
      message: "Do you want to delete this record? This can't be undone.",
      header: "Are you sure?",
      acceptLabel: "Yes",
      rejectLabel: "No",
      rejectButtonStyleClass: 'btn reset-btn',
      acceptButtonStyleClass: 'btn bluebg-button',
      defaultFocus: 'none',
      rejectIcon: 'null',
      acceptIcon: 'null',
      key:'positionDialog',
      accept: () => {
        this.loader.show();
        const indexToDelete = this.trainBotList.findIndex(record => record.id === recordIdToDelete);
        if (indexToDelete !== -1) {
          this.trainBotList.splice(indexToDelete, 1);
        }
        // Perform API delete operation here if needed
        // this.api.delete_Project(delete_data).subscribe((res) => {...});
        this.loader.hide();
        this.toastService.showSuccess("Deleted Successfully","response")
      },
      reject: (type) => {}
    });
  }
  
  openUpdateOverlay(event: any) {
    console.log("ID",event.id);
    this.hiddenPopUp = true;
    this.isCreate = false;
    this.updateOverlayData = event
    this.trainBotForm.get("trainBotName").setValue(this.updateOverlayData["trainBotName"]);
    this.trainBotForm.get("trainModelFile").setValue(this.updateOverlayData["trainModelFile"]);
    this.trainBotForm.get("trainFile").setValue(this.updateOverlayData["trainFile"]);
  }

  // saveTrainedModelInfoIntoDataBase(){
  //   this.loader.show();
  //   const filePath = this.trainBotForm.get('trainFile').value;
  //   const fileNameWithExtension = filePath.split('\\').pop();
  //   let req_body={
  //     "modelName": this.trainBotForm.value.trainBotName,
  //     "fileName":fileNameWithExtension,
  //     "tenantName":localStorage.getItem("tenantName"),
  //     "modelPath":"dummy",
  //     "botKey":"dummy"
  //   }
    
  //   this.rest_api.saveTrinedModel(req_body).subscribe(
  //     (res: any) => {
  //       let response = res;
  //      if(response.status === 'success'){
  //       this.loader.hide();
  //       this.trainBotForm.reset();
  //       this.toastService.showSuccess(response.data.modelName, 'save');
  //       this.trainBotList.push({
  //         id:response.data.id, trainBotName:response.data.modelName, trainData: response.data.fileName
  //       })
  //       this.hiddenPopUp = false;
  //      }
  //     },(error:any) => {
  //       console.error('Error saving trained model in data base:', error);
  //       this.loader.hide();
  //     }
  //   );
  // }
  // saveDetails() {
  //   //call this method in this.trainTheModel() method after getting the response
  //   this.uploadFileAndSave()
  //   this.trainTheModel()
  //   this.saveTrainedModelInfoIntoDataBase()
    
  // }

  saveTrainModel() {
    this.uploadFilesandSaveOrUpldate();
  }

  updateTrainModel() {
    this.uploadFilesandSaveOrUpldate();
  }

  resetbotform() {
    this.trainBotForm.reset();
  }

  closeOverlay(event: any) {
    this.hiddenPopUp = event;
    this.trainBotForm.reset();
  }

  onFileSelected(event: any) {
    this.selectedFiles = event.target.files;
   
  }

  // trainTheModel() {
  //   const formData = new FormData();
  //   formData.append('modelName',this.trainBotForm.value.trainBotName);
  //   formData.append('tenantName',localStorage.getItem("tenantName"));
  //   this.rest_api.getTrainedModel(formData).subscribe((response) => {
  //         console.log('Response from train molde ', response);
  //         this.saveTrainedModelInfoIntoDataBase()
  //       },
  //       (error) => {
  //         console.error('Upload error', error);
  //       }
  //     );
  // }

  uploadFileAndSave() {
    const formData: FormData = new FormData();
    formData.append('file', this.selectedFiles[0]);
    formData.append('modelName', this.trainBotForm.value.trainBotName);
    formData.append('tenantName', localStorage.getItem("tenantName"));
    return this.rest_api.trainUploads(formData);
  }

  trainTheModel() {
    const formData = new FormData();
    formData.append('modelName', this.trainBotForm.value.trainBotName);
    formData.append('tenantName', localStorage.getItem("tenantName"));
    return this.rest_api.getTrainedModel(formData);
  }

  saveTrainedModelInfoIntoDataBase() {
    const filePath = this.trainBotForm.get('trainFile').value;
    const fileNameWithExtension = filePath.split('\\').pop();
    let req_body = {
      "modelName": this.trainBotForm.value.trainBotName,
      "fileName": fileNameWithExtension,
      "tenantName": localStorage.getItem("tenantName"),
      "modelPath": "dummy",
      "botKey": "dummy",
      "id": this.updateOverlayData.id
    }
    if (this.updateOverlayData) {
      req_body["id"] = this.updateOverlayData.id;
    }
    return this.rest_api.saveTrinedModel(req_body);
  }

  uploadFilesandSaveOrUpldate() {
    this.loader.show();
    this.uploadFileAndSave().subscribe((res: any) => {
      console.log("res", res);
      this.trainTheModel().subscribe((response) => {
        console.log('Response from train model ', response);
        this.saveTrainedModelInfoIntoDataBase().subscribe((res: any) => {
          let response = res;
          if (response.status === 'success') {
            this.loader.hide();
            this.trainBotForm.reset();
            const action = this.updateOverlayData && this.updateOverlayData.id ? 'update' : 'save';
            this.toastService.showSuccess(response.data.modelName, action);
            this.fetchPredefinedModels()
            this.hiddenPopUp = false;
          }
        }, (error: any) => {
          this.toastService.showError(this.toastMessages.saveError);
          this.loader.hide();
        })
      }, (error: any) => {
        this.loader.hide();
        this.toastService.showError(this.toastMessages.saveError);
      })
    }, (error: any) => {
      this.loader.hide();
      this.toastService.showError(this.toastMessages.uploadError)
    });
  }
}
