import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup} from '@angular/forms';
import Swal from 'sweetalert2';
import { RestApiService } from '../../services/rest-api.service';
import { DataTransferService } from "../../services/data-transfer.service";
import { Rpa_Hints } from "../model/RPA-Hints";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import * as moment from 'moment';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { columnList } from 'src/app/shared/model/table_columns';
@Component({
  selector: 'app-rpa-database-connections',
  templateUrl: './rpa-database-connections.component.html',
  styleUrls: ['./rpa-database-connections.component.css'],
  providers: [columnList]
})

export class RpaDatabaseConnectionsComponent implements OnInit {
  public databaselist: any[]=[];
  public toggle: boolean;
  public dbupdateflag: boolean = false;
  public submitted: Boolean;
  public button: string;
  public dbconnections: any = []
  public dbupdatedata: any;
  public insertdbForm: FormGroup;
  public updatedbForm: FormGroup;
  public DBupdateflag: Boolean;
  public DBdeleteflag: Boolean;
  public passwordtype1: Boolean;
  public passwordtype2: Boolean;
  public snowflakeflag: boolean = true;
  public categoryList: any = [];
  customUserRole: any;
  enableDbconnection: boolean = false;
  userRole: any;
  public isButtonVisible = false;
  pwdflag: boolean = false;
  addflag: boolean = false;
  isDatabase: boolean = false;
  h2flag: boolean = false;
  noDataMessage: boolean;
  selectedData: any;
  categories_list: any=[];
  table_searchFields: any[]=[];
  hiddenPopUp:boolean=false;
  overlayClose:boolean = false;
  columns_list:any[] =[];
  hideLables:boolean = true

  constructor(private api: RestApiService,
    private router: Router,
    private hints: Rpa_Hints,
    private dt: DataTransferService,
    private spinner: LoaderService,
    private columnList : columnList
  ) {
    const ipPattern ="(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)";
    this.DBupdateflag = false;
    this.DBdeleteflag = false;
  }

  ngOnInit() {
    //   //     document.getElementById("filters").style.display='block';
    //this.getallDBConnection();
    this.getCategories();
    this.columns_list= this.columnList.databaseConnections_column
    this.spinner.show();
    this.passwordtype1 = false;
    this.passwordtype2 = false;
    this.userRole = localStorage.getItem("userRole")
    this.userRole = this.userRole.split(',');
    this.isButtonVisible = this.userRole.includes('SuperAdmin') || this.userRole.includes('Admin') || this.userRole.includes('RPA Admin') || this.userRole.includes('RPA Designer')
      || this.userRole.includes('Process Owner') || this.userRole.includes('Process Architect') || this.userRole.includes('Process Analyst') || this.userRole.includes('RPA Developer') || this.userRole.includes('Process Architect') || this.userRole.includes("System Admin") || this.userRole.includes('User');

    this.api.getCustomUserRole(2).subscribe(role => {
      this.customUserRole = role.message[0].permission;
      this.customUserRole.forEach(element => {
        if (element.permissionName.includes('RPA_DbConnection_full')) {
          this.enableDbconnection = true;
        }
      }
      );
    })
  }


  async getallDBConnection() {
    this.dbconnections = [];
    this.addflag = false
    await this.api.listDBConnection().subscribe(data1 => {
      if (Array.isArray(data1)) {
        this.dbconnections = data1;
        this.dbconnections.sort((a, b) => a.connectionId > b.connectionId ? -1 : 1);
        this.dbconnections = this.dbconnections.map(item => {
          item["categoryName"] = this.categoryList.find(item2 => item2.categoryId == item.categoryId).categoryName;
          item["password_new"]=("*").repeat(10);
          item["createdTimeStamp_converted"] = new Date(item.createdTimeStamp?item.createdTimeStamp:item.modifiedTimestamp)
          item["status"] = item.activeStatus==7?"Active":"Inactive"
          return item;
        })
      }      

      this.table_searchFields=["connectiontName","categoryName","dataBaseType","databasename","hostAddress","portNumber","activeStatus","createdTimeStamp_converted","schemaName","createdBy"]

      this.spinner.hide();
    });
  }


  opencreatedbconnection() {
    this.hiddenPopUp=true;
    this.isDatabase = true;
    this.hideLables = false
    // document.getElementById("createdbconnection").style.display = 'block';
    // this.insertdbForm.get("categoryId").setValue(this.categoryList.length==1?this.categoryList[0].categoryId:"0")
    // document.getElementById("Updatedbconnection").style.display='none';
  }

  Updatedbconnection() {
    // document.getElementById("createdbconnection").style.display = 'none';
    // document.getElementById("Updatedbconnection").style.display='block';
  }


  async testConnection(data) {
    this.spinner.show();
    let formdata: any;
    if (data == "insert") {
      formdata = this.insertdbForm;
    } else {
      formdata = this.updatedbForm;
    }
    if (formdata.valid) {
      if (formdata.value.activeStatus == true) {
        formdata.value.activeStatus = 7
      } else {
        formdata.value.activeStatus = 8
      }
      await this.api.testdbconnections(formdata.value).subscribe(res => {
        this.spinner.hide();
        if (res.errorMessage == undefined) {
          Swal.fire("Success", "Successfully Connected", "success")
        } else {
          Swal.fire("Error", "Connection Failed", "error")
        }
      }, err => {
        this.spinner.hide();
        Swal.fire("Error", "Unable to test connection details", "error")
      });
      this.activestatus();
    }
    else {
      this.spinner.hide();
      this.activestatus();
    }

  }

  activestatus() {
    if (this.insertdbForm.value.activeStatus == 7) {
      this.insertdbForm.value.activeStatus = true;
    } else {
      this.insertdbForm.value.activeStatus = false;
    }

    if (this.updatedbForm.value.activeStatus == 7) {
      this.updatedbForm.value.activeStatus = true;
    } else {
      this.updatedbForm.value.activeStatus = false;
    }
  }

  updatedbdata() {
    this.hiddenPopUp=true;
    document.getElementById('createdbconnection');
    this.isDatabase = false;
    this.dbupdatedata = this.selectedData[0];
  }

  deletedbconnection() {
    const selecteddbconnection = this.selectedData.map(p => p.connectionId);
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      customClass: {
        confirmButton: 'btn bluebg-button',
        cancelButton:  'btn new-cancelbtn',
      },
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.api.deleteDBConnection(selecteddbconnection).subscribe(res => {
          let status: any = res;
          this.spinner.hide();
          if (status.errorMessage == undefined) {
            Swal.fire("Success", status.status, "success")
            this.getallDBConnection();
          }
          else
            Swal.fire("Error", status.errorMessage, "error")

        }, err => {
          this.spinner.hide();
          Swal.fire("Error", "Unable to delete database connections", "error")
        });
      }
    });

  }

 

  applyFilter1(filterValue: string) {

    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    // this.dataSource2.filter = filterValue;
    // console.log(this.dataSource2.filteredData.length);
    // if (this.dataSource2.filteredData.length === 0) {
    //   this.noDataMessage = true;
    // }
    // else {
    //   this.noDataMessage = false;
    // }
  }

  getCategories() {
    this.api.getCategoriesList().subscribe(data => {
      let response: any = data;
      if (response.errorMessage == undefined) {
        this.categoryList = response.data;
        let sortedList=this.categoryList.sort((a, b) => (a.categoryName.toLowerCase() > b.categoryName.toLowerCase()) ? 1 : ((b.categoryName.toLowerCase() > a.categoryName.toLowerCase()) ? -1 : 0));
    sortedList.forEach(element => {
      this.categories_list.push(element.categoryName)
    });
    this.columns_list.map(item=>{
      if(item.ColumnName === "categoryName"){
        item["dropdownList"]=this.categories_list
      }
    })
        this.getListofDBConnections();
        this.getallDBConnection();
      }
    })
  }

  refreshDataBaseList(event) {
    if (event) {
      this.overlayClose = true;
      this.getallDBConnection()
    }
  }

  loopTrackBy(index, term) {
    return index;
  }

  readSelectedData(data) {
    this.selectedData =data;
    this.selectedData.length > 0 ?this.addflag =true :this.addflag =false
    this.selectedData.length > 0 ?this.DBdeleteflag =true :this.DBdeleteflag =false
    this.selectedData.length == 1 ?this.DBupdateflag =true :this.DBupdateflag =false
  }

  closeOverlay(event){
    this.hiddenPopUp=event;
  }

  getListofDBConnections(){
    this.api.getDatabaselist().subscribe((res:any)=>{
      this.databaselist=res;
      let _databaseList=[];
      this.databaselist.forEach(e=>{
        _databaseList.push(e.databaseName)
      });
      this.columns_list[2]["dropdownList"]=_databaseList;
    })
  }

  updatedbConnection(data){
    this.hiddenPopUp=true;
    this.isDatabase = false;
    this.dbupdatedata = data;
  }

  deletedbconnectionByRow(row) {
    const selecteddbconnection=[]
    selecteddbconnection.push(row.connectionId);
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      customClass: {
        confirmButton: 'btn bluebg-button',
        cancelButton:  'btn new-cancelbtn',
      },
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.api.deleteDBConnection(selecteddbconnection).subscribe(res => {
          let status: any = res;
          this.spinner.hide();
          if (status.errorMessage == undefined) {
            Swal.fire("Success", status.status, "success")
            this.getallDBConnection();
          }
          else
            Swal.fire("Error", status.errorMessage, "error")

        }, err => {
          this.spinner.hide();
          Swal.fire("Error", "Unable to delete database connections", "error")
        });
      }
    });

  }
}
