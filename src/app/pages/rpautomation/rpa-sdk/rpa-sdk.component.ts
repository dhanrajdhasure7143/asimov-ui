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


  constructor(
    private rest : RestApiService,
    private columnList: columnList,
    private spinner: LoaderService,
    private confirmationService:ConfirmationService,
    private toastService: ToasterService,
    private toastMessages: toastMessages,
    private http:HttpClient) { }

  ngOnInit(){
    this.columns_list = this.columnList.custom_tasks
    this.getTaskDetails();
  }

  getTaskDetails(){
    this.spinner.show();
    // this.rest.getCustomTasks().subscribe((res : any) =>{
      const headers = new HttpHeaders().set("Authorization",`Bearer ${localStorage.accessToken}`)
    .set("Refresh-Token", localStorage.refreshToken)
    .set("Timezone", "Asia/Calcutta");
    // this.api.createSdkCustomTasks(reqBody).subscribe((data : any) =>{
      this.http.get("http://localhost:8080/rpa-service/sdk-custom/get-sdk-tasks",{headers}).subscribe((res:any)=>{
      
      this.customTasks = res
      this.customTasks.map(item=>{
        item.createdAt = new Date(item.createdAt)
      })
      this.spinner.hide();
    },err=>{
      this.toastService.showError(this.toastMessages.loadDataErr)
    })

    this.table_searchFields=["customTaskName","languageType","createdAt"]

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
        this.rest.deleteCustomTasksbyId(selectedCustomTasks).subscribe( (res:any) =>{ 
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
    this.getTaskDetails();
  }

}
