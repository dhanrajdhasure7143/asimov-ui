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
@Component({
  selector: 'app-rpa-database-connections',
  templateUrl: './rpa-database-connections.component.html',
  styleUrls: ['./rpa-database-connections.component.css']
})

export class RpaDatabaseConnectionsComponent implements OnInit {
  public databaselist: any;
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
  columns_list:any =[]
  selectedData: any;
  categories_list: any=[];
  table_searchFields: any[]=[];

  constructor(private api: RestApiService,
    private router: Router,
    private hints: Rpa_Hints,
    private dt: DataTransferService,
    private spinner: LoaderService
  ) {
    const ipPattern =
      "(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)";

    this.DBupdateflag = false;
    this.DBdeleteflag = false;

  }

  ngOnInit() {
    this.api.getDatabaselist().subscribe(res => {
      this.databaselist = res;
    })
    //   //     document.getElementById("filters").style.display='block';
    //this.getallDBConnection();
    this.getCategories()
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
    await this.api.listDBConnection().subscribe(data1 => {
      if (Array.isArray(data1)) {
        this.dbconnections = data1;
        this.dbconnections.sort((a, b) => a.connectionId > b.connectionId ? -1 : 1);
        this.dbconnections = this.dbconnections.map(item => {
          item["categoryName"] = this.categoryList.find(item2 => item2.categoryId == item.categoryId).categoryName;
          item["createdTimeStamp_converted"] = moment(new Date(item.createdTimeStamp)).format('lll')
          return item;
        })
      }      
      this.columns_list = [
        {
          ColumnName: "connectiontName",
          DisplayName: "Connection Name",
          ShowGrid: true,
          ShowFilter: true,
          filterWidget: "normal",
          filterType: "text",
          sort: true,
          multi: false,
        },
        {
          ColumnName: "categoryName",
          DisplayName: "Category",
          ShowFilter: true,
          ShowGrid: true,
          filterWidget: "dropdown",
          filterType: "text",
          sort: true,
          multi: false,
        "dropdownList":this.categories_list
        },
        {
          ColumnName: "password",
          DisplayName: "Password",
          ShowGrid: true,
          ShowFilter: true,
          filterWidget: "normal",
          filterType: "text",
          sort: true,
          multi: false,
        },
        {
          ColumnName: "dataBaseType",
          DisplayName: "Database Type",
          ShowGrid: true,
          ShowFilter: true,
          filterWidget: "normal",
          filterType: "text",
          sort: true,
          multi: false,
        },
        {
          ColumnName: "databasename",
          DisplayName: "Database Name",
          ShowGrid: true,
          ShowFilter: true,
          filterWidget: "normal",
          filterType: "date",
          sort: true,
          multi: false,
        },
        {
          ColumnName: "hostAddress",
          DisplayName: "IP Address / Host",
          ShowGrid: true,
          ShowFilter: true,
          filterWidget: "normal",
          filterType: "text",
          sort: true,
          multi: false,
        },
        {
          ColumnName: "portNumber",
          DisplayName: "Port",
          ShowGrid: true,
          ShowFilter: true,
          filterWidget: "normal",
          filterType: "text",
          sort: true,
          multi: false,
        },
        {
          ColumnName: "username",
          DisplayName: "Username",
          ShowGrid: true,
          ShowFilter: true,
          filterWidget: "normal",
          filterType: "text",
          sort: true,
          multi: false,
        },
        {
          ColumnName: "schemaName",
          DisplayName: "Schema",
          ShowGrid: true,
          ShowFilter: true,
          filterWidget: "normal",
          filterType: "text",
          sort: true,
          multi: false,
        },
        {
          ColumnName: "createdBy",
          DisplayName: "Created By",
          ShowGrid: true,
          ShowFilter: true,
          filterWidget: "normal",
          filterType: "text",
          sort: true,
          multi: false,
        },
        {
          ColumnName: "activeStatus",
          DisplayName: "Status",
          ShowGrid: true,
          ShowFilter: true,
          filterWidget: "normal",
          filterType: "text",
          sort: true,
          multi: false,
        },
        {
          ColumnName: "createdTimeStamp_converted",
          DisplayName: "Created Date",
          ShowGrid: true,
          ShowFilter: true,
          filterWidget: "normal",
          filterType: "text",
          sort: true,
          multi: false,
        },
      ]
      this.table_searchFields=["connectiontName","dataBaseType","databasename","hostAddress","hostAddress","portNumber","username","activeStatus","createdTimeStamp_converted"]

      this.spinner.hide();
    });
  }


  opencreatedbconnection() {
    this.isDatabase = true;
    document.getElementById("createdbconnection").style.display = 'block';
    // this.insertdbForm.get("categoryId").setValue(this.categoryList.length==1?this.categoryList[0].categoryId:"0")
    // document.getElementById("Updatedbconnection").style.display='none';
  }

  Updatedbconnection() {
    document.getElementById("createdbconnection").style.display = 'none';
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
    document.getElementById('createdbconnection').style.display = 'block';
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
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
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
        this.getallDBConnection();
      }
    })
  }

  refreshDataBaseList(event) {
    if (event) {
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
}
