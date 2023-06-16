import {Component, OnInit, ViewChild} from '@angular/core';
import {RestApiService} from '../../../services/rest-api.service';
import { DataTransferService } from "../../../services/data-transfer.service";
import{sohints} from '../model/new-so-hints';
import { ActivatedRoute, Router } from '@angular/router';
// import Swal from 'sweetalert2';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { Table } from 'primeng/table';
import { columnList } from 'src/app/shared/model/table_columns';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-so-inbox',
  templateUrl: './so-inbox.component.html',
  styleUrls: ['./so-inbox.component.css'],
  providers: [columnList]
})
export class SoInboxComponent implements OnInit {
    public respdata1:boolean = false;
    searchinbox:any;
    logflag:Boolean;
    public showaction:boolean = false;
    logresponse:any=[];
    response: any=[];
    columns_list:any[]=[];
    table_searchFields: any =[];
   

    constructor(private route: ActivatedRoute,
      private rest:RestApiService,
      private hints: sohints,
      private dt:DataTransferService,
      private spinner:LoaderService,
      private columnList: columnList,
      private messageService:MessageService
      )
    {}

  ngOnInit() {
    this.dt.changeHints(this.hints.soinboxhints);
    //document.getElementById("showaction").style.display = "none";
    this.spinner.show();
    this.getallbots();
    this.columns_list = this.columnList.schedularInbox_column
  }

  getallbots(){
    let response:any=[];

    //this.rpa_studio.spinner.show()
    //http://192.168.0.7:8080/rpa-service/get-all-bots

    this.rest.getInbox().subscribe(data =>{
      this.response=data; 
      this.table_searchFields = [
        "processName",
        "processRunId",
        "taskName",
        "previousTask",
        "nextSuccessTask",
        "nextFailureTask",
        "status"
      ];
      if(this.response.length >0){
        this.respdata1 = false;
      }else{
        this.respdata1 = true;
      }
      this.spinner.hide(); 
    },(err)=>{
      //this.rpa_studio.spinner.hide();
    })
}

  /*botidshowaction(data){
    document.getElementById("showaction").style.display = "block";
  }*/

  /*showactionclose(){
    document.getElementById("showaction").style.display = "none";
  }
*/
  getapproved(rowData,status){
    this.spinner.show();
    let obj = {
      "processId": rowData.processId,
      "status" : status,
      "taskId" : rowData.taskId,
      "processRunId":rowData.processRunId,
      "envId": rowData.envId
    }
    this.rest.updateInboxstatus(obj).subscribe(data =>{
      this.spinner.hide();
        if(obj.status == "Approved"){
        // Swal.fire({
        //   position: 'center',
        //   icon: 'success',
        //   title: 'Task Approved Successfully !!',
        //   showConfirmButton: false,
        //   timer: 2000
        // });
        this.messageService.add({severity:'success',summary:'Success',detail:'Task approved successfully!'})
      }
      if(obj.status == "Rejected"){
        // Swal.fire({
        //   position: 'center',
        //   icon: 'success',
        //   title: 'Task Rejected Successfully !!',
        //   showConfirmButton: false,
        //   timer: 2000
        // });
        this.messageService.add({severity:'success',summary:'Success',detail:'Task rejected successfully!'})

      }
        /* let res:any= data;
       Swal.fire(res.status, "","success")*/
       this.getallbots();
      });

  }
  applyFilter(filterValue: string) {

    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    // this.dataSource1.filter = filterValue;
    // if(this.dataSource1.filteredData.length == 0){
    //   this.noDataMessage = true;
    // } else{
    //   this.noDataMessage=false;
    // }
  }

  reset(){
    this.searchinbox = '';
    this.applyFilter('');
   }

   refresh(){
    this.spinner.show();
    this.getallbots();
  }

  clear(table: Table) {
    table.clear();
  }
}
