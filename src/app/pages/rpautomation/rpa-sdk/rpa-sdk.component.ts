import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../../services/rest-api.service';
import { columnList } from 'src/app/shared/model/table_columns';

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
    private columnList: columnList) { }

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

  updateCredential(e){}

  deleteEmailByRow(e){}

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
