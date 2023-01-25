import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
// import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { DataTransferService } from '../../services/data-transfer.service';
import { RestApiService } from '../../services/rest-api.service';
import { Rpa_Hints } from '../model/RPA-Hints';

@Component({
  selector: 'app-rpa-connection-manager',
  templateUrl: './rpa-connection-manager.component.html',
  styleUrls: ['./rpa-connection-manager.component.css']
})
export class RpaConnectionManagerComponent implements OnInit {

  displayedColumns: string[] = ["check","connectionName","httpMethodType","actionType","authorization_Type","createdTimeStamp","createdBy"];
  public toggle:boolean;
  // dataSource:MatTableDataSource<any>;
  public Credcheckflag:boolean = false;
  categoryList:any;
  // @ViewChild("paginator",{static:false}) paginator: MatPaginator;
  // @ViewChild("sort",{static:false}) sort: MatSort;
  public credentials:any=[];
  public checkeddisabled:boolean =false;
  public Credcheckeddisabled:boolean =false;
    enableCredential: boolean=false;
    public isButtonVisible = false;
    isSearch:boolean=false;
    noDataMessage: boolean;
    connectorTable : any = [];
    representatives:any=[]
    columns_list:any=[]
    Creddeleteflag:boolean=false;
    addflag:boolean;
    checkBoxShow:boolean=true;
    
    constructor(private rest_api:RestApiService, 
      private router:Router,
      private hints:Rpa_Hints, 
      private spinner: NgxSpinnerService
      ) { 
      
    }

  ngOnInit() {
    this.spinner.show();
    this.columns_list = [
      {
        ColumnName: "connectionName",
        DisplayName: "Connector Name",
        ShowGrid: true,
        ShowFilter: true,
        filterWidget: "normal",
        filterType: "text",
        sort: true,
        multi: false,
      },
      {
        ColumnName: "httpMethodType",
        DisplayName: "Connection Name",
        ShowFilter: true,
        ShowGrid: true,
        filterWidget: "normal",
        filterType: "text",
        sort: true,
        multi: false,
      },
      {
        ColumnName: "actionType",
        DisplayName: "Action Type",
        ShowGrid: true,
        ShowFilter: true,
        filterWidget: "normal",
        filterType: "text",
        sort: true,
        multi: false,
      },
      {
        ColumnName: "authorization_Type",
        DisplayName: "Authentication Type",
        ShowGrid: true,
        ShowFilter: true,
        filterWidget: "normal",
        filterType: "text",
        sort: true,
        multi: false,
      },
      {
        ColumnName: "createdDate",
        DisplayName: "Created Date",
        ShowGrid: true,
        ShowFilter: true,
        filterWidget: "normal",
        filterType: "date",
        sort: true,
        multi: false,
      },
      {
        ColumnName: "lastModifiedBy",
        DisplayName: "Created By",
        ShowGrid: true,
        ShowFilter: true,
        filterWidget: "normal",
        filterType: "text",
        sort: true,
        multi: false,
      },
      // {
      //   ColumnName: "action",
      //   DisplayName: "Action",
      //   ShowGrid: true,
      //   ShowFilter: false,
      //   sort: false,
      //   multi: false,
      // },
    ];
    this.getAllConnections();
  }

  getAllConnections(){
    this.rest_api.getConnectionslist().subscribe((data : any)=>{
      this.connectorTable = data;
      console.log(this.connectorTable);
      // this.dataSource = new MatTableDataSource(this.connectorTable);
      this.spinner.hide();
    })  
  }

  viewDetails(event){

  }
deleteById(event){

}
deleteConnection(){

}
}
