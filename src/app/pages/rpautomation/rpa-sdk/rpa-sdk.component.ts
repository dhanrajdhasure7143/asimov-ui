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
    private toastMessages: toastMessages) { }

  ngOnInit(){
    this.columns_list = this.columnList.custom_tasks
    this.getTaskDetails();
  }

  getTaskDetails(){
    this.spinner.show();
    this.rest.getCustomTasks().subscribe((res : any) =>{
      this.customTasks = res
      this.spinner.hide();
    })

    this.table_searchFields=["customTaskName","languageType","inputReference","outputReference"]

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
          this.getTaskDetails();
          let status:any = res;
          this.spinner.hide();
          this.toastService.showSuccess(row.customTaskName,'delete');

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
