import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../../services/rest-api.service';
import { columnList } from 'src/app/shared/model/table_columns';
import { ConfirmationService } from 'primeng/api';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { CryptoService } from '../../services/crypto.service';
import { toastMessages } from 'src/app/shared/model/toast_messages';
import { LoaderService } from 'src/app/services/loader/loader.service';

@Component({
  selector: 'app-rpa-sdk',
  templateUrl: './rpa-sdk.component.html',
  styleUrls: ['./rpa-sdk.component.css'],
  providers : [columnList]
})
export class RpaSdkComponent implements OnInit {
  isCreateForm: boolean;
  hideLables: boolean;
  hiddenPopUp: boolean;
  columns_list:any =[];
  public customTasks:any[]=[];
  table_searchFields: any[]=[];



  constructor(
    private rest : RestApiService,
    private columnList: columnList,
    private spinner: LoaderService,
    private confirmationService:ConfirmationService,
    private cryptoService:CryptoService,
    private toastService: ToasterService,
    private toastMessages: toastMessages) { }

  ngOnInit(){
    this.columns_list = this.columnList.custom_tasks
    this.getTaskDetails();
  }

  getTaskDetails(){
    this.rest.getCustomTasks().subscribe((res : any) =>{
      console.log(res,"res")
      this.customTasks = res
    })
    this.table_searchFields=["customTaskName","languageType","inputReference","outputReference"]

  }

  readSelectedData(e){}

  updateCustomTasks(e){
    console.log(e)
    this.rest.getCustomTasksbyId(e.customTaskId).subscribe((response : any) =>{
      console.log(response)
    })
  }

  deleteCustomTask(row){
    console.log(row)
    const selectedCustomTasks=[]
    selectedCustomTasks.push(row.customTaskId);
      this.confirmationService.confirm({
        message: "You won't be able to revert this!",
        header: 'Are you sure?',
        acceptLabel:'Yes',
        rejectLabel:'No',
        rejectButtonStyleClass: ' btn reset-btn',
        acceptButtonStyleClass: 'btn bluebg-button',
        defaultFocus: 'none',
        rejectIcon: 'null',
        acceptIcon: 'null',
        key:"positionDialog",
      accept: () => {
        this.spinner.show();
        this.rest.deleteCustomTasksbyId(selectedCustomTasks).subscribe( (res:any) =>{ 
          console.log(res,"say")
          this.getTaskDetails();
          let status:any = res;
          console.log(status)
          this.spinner.hide();
        },err=>{
          this.spinner.hide();
          // this.messageService.add({severity:'error',summary:'Error',detail:'Unable to delete credentails.'})
          this.toastService.showError(this.toastMessages.deleteError);

        });
      // }
    }
    });
  }

  openCreateCredential(){
    this.isCreateForm = true;
    this.hideLables = false
    this.hiddenPopUp=true;
  }

  refreshCredentialList(event){
    if(event){
      this.hiddenPopUp=false;
    }
  }

  closeOverlay(event){
    this.hiddenPopUp=false;
  }

}
