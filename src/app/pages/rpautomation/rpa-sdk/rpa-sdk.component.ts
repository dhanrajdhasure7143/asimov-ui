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
import { DataTransferService } from '../../services/data-transfer.service';

@Component({
  selector: 'app-rpa-sdk',
  templateUrl: './rpa-sdk.component.html',
  styleUrls: ['./rpa-sdk.component.css'],
  providers : [columnList]
})
export class RpaSdkComponent implements OnInit {
  hiddenPopUp: boolean;
  columns_list:any =[];
  public customTasks:any[]=[];
  table_searchFields: any[]=[];
  isupdateform:boolean= false;
  updatetaskDetails:any={};
  selectedTab:number=0;
  other_customTasks:any=[];
  users_list:any[]=[];


  constructor(
    private rest : RestApiService,
    private columnList: columnList,
    private spinner: LoaderService,
    private confirmationService:ConfirmationService,
    private toastService: ToasterService,
    private toastMessages: toastMessages,
    private dt: DataTransferService,
    private http:HttpClient) { }

  ngOnInit(){
    this.columns_list = this.columnList.custom_tasks
    this.getUsersList();
  }

  getTaskDetails(){
    this.spinner.show();
    this.rest.getCustomTasks().subscribe((res : any) =>{  
      const customTasks_list = res
      customTasks_list.map(item=>{
        item.createdAt = new Date(item.createdAt)
        item["createdUser"] = this.getUserName(item.createdBy);
        item["approverName"] = this.getUserName(item.approvedBy);
      })
      this.customTasks = customTasks_list.filter(item =>item.status == "Approved");
      this.other_customTasks = customTasks_list.filter(item =>item.status != "Approved");
      this.spinner.hide();
    },err=>{
      this.toastService.showError(this.toastMessages.loadDataErr)
    })

    this.table_searchFields = ["customTaskName","createdUser","languageType", "createdAt", "approverName", "comments", "status"]

  }

  readSelectedData(e){}

  updateCustomTasks(item){
    this.isupdateform = true;
    this.updatetaskDetails = item
    this.hiddenPopUp = true;
  }

  deleteCustomTask(row){
    const selectedCustomTasks=[]
    selectedCustomTasks.push(row.customTaskId);
    const sdkId=[];
    sdkId.push(row.id)
      this.confirmationService.confirm({
        message: this.toastMessages.delete_waring,
        header: 'Are you sure?',
        acceptLabel:'Yes',
        rejectLabel:'No',
        rejectButtonStyleClass: ' btn reset-btn',
        acceptButtonStyleClass: 'btn bluebg-button',
        defaultFocus: 'none',
        rejectIcon: 'null',
        acceptIcon: 'null',
        key:"positionDialog_sdk_delete",
        accept: () => {
        this.spinner.show();
        this.rest.deleteCustomTasksbyId(selectedCustomTasks, sdkId).subscribe( (res:any) =>{ 
          if(res.data.length>0){
            let used_sdk_list = []
            res.data.forEach(element => {
              used_sdk_list.push(element.botName)
            });
            this.spinner.hide();
            let message =  `${this.toastMessages.sdk_delete_usageError}
            <br>
            <div><span class="bold">(${used_sdk_list.join(', ')})</span></div>`;
            this.confirmationService.confirm({   
              header: 'Warning',
              message: message,
              acceptLabel: "Ok",
              rejectVisible:false,
              acceptButtonStyleClass: 'btn bluebg-button',
              defaultFocus: 'none',
              acceptIcon: 'null',
              key: 'positionDialog',
              accept: () => {
              }
            })

          }else{
            this.getTaskDetails();
            let status:any = res;
            this.spinner.hide();
            this.toastService.showSuccess(row.customTaskName,'delete');
          }
        },err=>{
          this.spinner.hide();
          this.toastService.showError(this.toastMessages.deleteError);

        });
      // }
    }
    });
  }

  openCreateCredential(){
    this.hiddenPopUp=true;
    this.isupdateform = false;
  }

  closeOverlay(event){
    this.hiddenPopUp=false;
    // this.getTaskDetails();
  }
  onTaskSaved() {
    this.getTaskDetails();
  }

  onTabChanged(event){
    this.selectedTab=event.index;
    // this.selectedTab == 0?this.getTaskDetails():this.getOtherTaskDetails();
    this.getTaskDetails();
  }

  getUsersList() {
    this.spinner.show()
    this.dt.tenantBased_UsersList.subscribe((res) => {
      if (res) {
        this.users_list = res;
        this.getTaskDetails();
      }
    });
  }

  getUserName(emailId){
    let user = this.users_list.find(item => item.user_email == emailId);
    if(user)
      return user["fullName"]
      else
      return '-';
    }

}
