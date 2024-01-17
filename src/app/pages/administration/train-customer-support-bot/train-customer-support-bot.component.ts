import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { columnList } from 'src/app/shared/model/table_columns';
import { toastMessages } from 'src/app/shared/model/toast_messages';
import { ToasterService } from 'src/app/shared/service/toaster.service';

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
  trainBotList: any = [
    { id: "1", trainBotName: "Customer Support Bot", trainData: "Document" },
    { id: "2", trainBotName: "Agent Support Bot", trainData: "Web" },
    { id: "3", trainBotName: "Employee Support Bot", trainData: "Document and Web" },
    { id: "4", trainBotName: "Sample Record", trainData: "Sample Data" },
  ];
  constructor(
    private columns: columnList,
    private formBuilder: FormBuilder,
    private loader: LoaderService,
    private toastService: ToasterService,
    private toastMessages: toastMessages,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    this.loader.show();
    this.columns_list = this.columns.train_cutomer_support_bot_coloumns;
    this.trainBotForm = this.formBuilder.group({
      trainBotName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      trainData: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    });
    this.getTableData(this.trainBotList);
    this.table_searchFields=["trainBotName","trainData"]
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
    this.hiddenPopUp = true;
    this.isCreate = false;
    this.updateOverlayData = event
    this.trainBotForm.get("trainBotName").setValue(this.updateOverlayData["trainBotName"]);
    this.trainBotForm.get("trainData").setValue(this.updateOverlayData["trainData"]);
  }

  formSubmit() {
    this.loader.show();
    const recordId = Date.now();
    this.sampleObj = {
      "id": recordId,
      "trainBotName": this.trainBotForm.value.trainBotName,
      "trainData": this.trainBotForm.value.trainData,
    }
    this.trainBotList.push(this.sampleObj)
    this.toastService.showSuccess("Saved Successfully","response")
    setTimeout(() => {
      this.loader.hide();
    }, 1000);
    this.nextRecordId++;
    this.hiddenPopUp = false;
    this.trainBotForm.reset();
  }

  updateDatails() {
    this.loader.show();
    const updatedRecordId = this.updateOverlayData.id;
    const updatedRecordIndex = this.trainBotList.findIndex(record => record.id === updatedRecordId);
    if (updatedRecordIndex !== -1) {
      this.trainBotList[updatedRecordIndex].trainBotName = this.trainBotForm.value.trainBotName;
      this.trainBotList[updatedRecordIndex].trainData = this.trainBotForm.value.trainData;
      this.hiddenPopUp = false;
      this.trainBotForm.reset();
      this.toastService.showSuccess("updated Successfully","response")
      setTimeout(() => {
        this.loader.hide();
      }, 1000);
    } else {
      console.error("Record not found for update.");
    }
  }

  resetbotform() {
    this.trainBotForm.reset();
  }

  closeOverlay(event: any) {
    this.hiddenPopUp = event;
    this.trainBotForm.reset();
  }
}
