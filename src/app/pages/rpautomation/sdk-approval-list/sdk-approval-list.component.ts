import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../../services/rest-api.service';
import { columnList } from 'src/app/shared/model/table_columns';
import { ConfirmationService } from 'primeng/api';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { CryptoService } from '../../services/crypto.service';
import { toastMessages } from 'src/app/shared/model/toast_messages';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sdk-approval-list',
  templateUrl: './sdk-approval-list.component.html',
  styleUrls: ['./sdk-approval-list.component.css'],
  providers: [columnList]

})
export class SdkApprovalListComponent implements OnInit {
  hiddenPopUp: boolean;
  columns_list: any = [];
  public customTasks: any[] = [];
  table_searchFields: any[] = [];
  isupdateform: boolean = false;
  updatetaskDetails: any = {};


  constructor(
    private rest: RestApiService,
    private columnList: columnList,
    private spinner: LoaderService,
    private confirmationService: ConfirmationService,
    private toastService: ToasterService,
    private toastMessages: toastMessages,
    private http: HttpClient) { }

  ngOnInit() {
    this.columns_list = this.columnList.sdk_approval_list
    this.getApprovalList();
  }

  getApprovalList() {
    this.spinner.show();
    this.rest.getApprovalList().subscribe((res: any) => {
      this.customTasks = res
      console.log("Response", res);
      this.customTasks.map(item => {
        item.createdAt = new Date(item.createdAt)
      })
      this.spinner.hide();
    }, err => {
      this.toastService.showError(this.toastMessages.loadDataErr)
    })

    this.table_searchFields = ["customTaskName", "languageType", "createdAt", "createdBy", "comments", "status"]

  }

  readSelectedData(e) { }

  updateCustomTasks(item) {
    this.isupdateform = true;
    this.updatetaskDetails = item
    this.hiddenPopUp = true;
  }

  deleteCustomTask(row) {
    const selectedCustomTasks = []
    selectedCustomTasks.push(row.customTaskId);
    const sdkId=[];
    sdkId.push(row.id)
    this.confirmationService.confirm({
      message: this.toastMessages.delete_waring,
      header: 'Are you sure?',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      rejectButtonStyleClass: ' btn reset-btn',
      acceptButtonStyleClass: 'btn bluebg-button',
      defaultFocus: 'none',
      rejectIcon: 'null',
      acceptIcon: 'null',
      key: "positionDialog_sdk_delete",
      accept: () => {
        this.spinner.show();
        this.rest.deleteCustomTasksbyId(selectedCustomTasks, sdkId).subscribe((res: any) => {
          if (res.data.length > 0) {
            let used_sdk_list = []
            res.data.forEach(element => {
              used_sdk_list.push(element.botName)
            });
            this.spinner.hide();
            let message = `${this.toastMessages.sdk_delete_usageError}
            <br>
            <div><span class="bold">(${used_sdk_list.join(', ')})</span></div>`;
            this.confirmationService.confirm({
              header: 'Warning',
              message: message,
              acceptLabel: "Ok",
              rejectVisible: false,
              acceptButtonStyleClass: 'btn bluebg-button',
              defaultFocus: 'none',
              acceptIcon: 'null',
              key: 'positionDialog',
              accept: () => {
              }
            })

          } else {
            this.getApprovalList();
            let status: any = res;
            this.spinner.hide();
            this.toastService.showSuccess(row.customTaskName, 'delete');
          }
        }, err => {
          this.spinner.hide();
          this.toastService.showError(this.toastMessages.deleteError);
        });
      }
    });
  }

  openCreateCredential() {
    this.hiddenPopUp = true;
    this.isupdateform = false;
  }

  closeOverlay(event) {
    this.hiddenPopUp = false;
    this.getApprovalList();
  }

  onApproveItem(data: any, status: string) {
    const action = status === 'Approved' ? 'approve' : 'reject';
    this.confirmationService.confirm({
      message: `Do you want to ${action.toLowerCase()} this item? This can't be undone.`,
      header: 'Confirmation',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      rejectButtonStyleClass: 'btn reset-btn',
      acceptButtonStyleClass: 'btn bluebg-button',
      defaultFocus: 'none',
      rejectIcon: null,
      acceptIcon: null,
      key: 'positionDialog_sdk_delete',
      accept: () => {
        const payload = { ...data, status: status };
        console.log("Payload to be sent:", payload);
        this.spinner.show();
        this.rest.approveRejectRequest(payload).subscribe((res: any) => {
          if (res.code == 4200) {
            console.log('Payload sent successfully', res);
            this.spinner.hide();
            this.toastService.showSuccess(res.message, 'response');
            this.getApprovalList();
          } else {
            this.spinner.hide();
            this.toastService.showError(res.message);
          }
        }, (error: any) => {
          this.spinner.hide();
          this.toastService.showError("Error occurred");
        }
        );
      },
    });
  }

}