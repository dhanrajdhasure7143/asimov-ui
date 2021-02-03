import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {RestApiService} from '../../../services/rest-api.service';
import { DataTransferService } from "../../../services/data-transfer.service";
import{sohints} from '../model/so-hints';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-so-inbox',
  templateUrl: './so-inbox.component.html',
  styleUrls: ['./so-inbox.component.css']
})
export class SoInboxComponent implements OnInit {
    displayedColumns: any[] = ["processRunId","processName","taskName","previousTask", "nextSuccessTask","nextFailureTask", "status", "Action"];
    dataSource1:MatTableDataSource<any>;
    public respdata1:boolean = false;
    searchinbox:any;
    logflag:Boolean;
    public showaction:boolean = false;
    logresponse:any=[];
    @ViewChild("paginator1",{static:false}) paginator1: MatPaginator;
    @ViewChild("sort1",{static:false}) sort1: MatSort;

    constructor(private route: ActivatedRoute,
      private rest:RestApiService,
      private hints: sohints,
      private dt:DataTransferService,
      )
    {}

  ngOnInit() {
    this.dt.changeHints(this.hints.soinboxhints);
    //document.getElementById("showaction").style.display = "none";
    this.getallbots();
  }

  getallbots()
  {
    let response:any=[];

    //this.rpa_studio.spinner.show()
    //http://192.168.0.7:8080/rpa-service/get-all-bots

    this.rest.getInbox().subscribe(data =>
    {
      response=data;
      if(response.length >0)
      {
        this.respdata1 = false;
      }else
      {
        this.respdata1 = true;
      }
      this.dataSource1= new MatTableDataSource(response);
      this.dataSource1.sort=this.sort1;
      this.dataSource1.paginator=this.paginator1;
      this.dataSource1.data = response;

    },(err)=>{
      //this.rpa_studio.spinner.hide();
    })
}

  /*botidshowaction(data){
    console.log(data);
    document.getElementById("showaction").style.display = "block";
  }*/

  /*showactionclose(){
    document.getElementById("showaction").style.display = "none";
  }
*/
  getapproved(processId,status, taskId,runId, envId){
    let obj = {
      "processId": processId,
      "status" : status,
      "taskId" : taskId,
      "processRunId":runId,
      "envId": envId
    }

    this.rest.updateInboxstatus(obj).subscribe(data =>
      {
        if(obj.status == "Approved"){
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Task Approved Successfully !!',
          showConfirmButton: false,
          timer: 2000
        });
      }
      if(obj.status == "Rejected"){
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Task Rejected Successfully !!',
          showConfirmButton: false,
          timer: 2000
        });
      }
        /* let res:any= data;
       Swal.fire(res.status, "","success")*/
       this.getallbots();
      });

  }
  applyFilter(filterValue: string) {

    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource1.filter = filterValue;
  }

  reset(){
    this.searchinbox = '';
    this.applyFilter('');
   }
}
