import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { environmentobservable } from '../model/environmentobservable';
import Swal from 'sweetalert2';
import { RestApiService } from '../../services/rest-api.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NgxSpinnerService } from "ngx-spinner";
import * as moment from 'moment';
import { LoaderService } from 'src/app/services/loader/loader.service';

@Component({
  selector: 'app-environments',
  templateUrl: './rpa-environments.component.html',
  styleUrls: ['./rpa-environments.component.css']
})
export class RpaenvironmentsComponent implements OnInit {
  displayedColumns: string[] = ["check", "environmentName", "environmentType", "agentPath", "categoryName", "hostAddress", "portNumber", "username", "password", "activeStatus", "deployStatus", "createdTimeStamp", "createdBy"]; //,"connectionType"
  dataSource: MatTableDataSource<any>;
  @ViewChild("paginator1") paginator1: MatPaginator;
  @ViewChild("sort1") sort1: MatSort;
  @Output()
  title: EventEmitter<string> = new EventEmitter<string>();
  public environments: any = [];
  public checkeddisabled: boolean = false;
  public updateenvdata: any;
  public updateflag: Boolean;
  public deleteflag: Boolean;
  private updateid: number;
  public checkflag: Boolean = false;
  customUserRole: any;
  enableEnvironment: boolean = false;
  public isButtonVisible = false;
  public userRole: any = [];
  public categoryList: any = [];
  public isKeyValuePair: Boolean = false;
  public password: any = "";
  public keyValueFile: File;
  addflag: boolean = false;
  isCreate: boolean = true;
  noDataMessage: boolean = false;
  filterValue: number;
  variableforapplyfilter:any;
  filteredData: number;
  columns_list:any[]=[];
  table_searchFields:any[]=[];
  selectedData:any[]=[];
  loading:boolean=false;
  selected_list:any[]=[];
  categories_list:any[]=[];

  constructor(private rest_api: RestApiService,
    private spinner: LoaderService) {
    this.updateflag = false;
    this.deleteflag = false;
  }

  ngOnInit() {
    this.spinner.show();
    this.getCategories();
    this.userRole = localStorage.getItem("userRole")
    this.userRole = this.userRole.split(',');
    this.isButtonVisible = this.userRole.includes('SuperAdmin') || this.userRole.includes('Admin') || this.userRole.includes('RPA Admin') || this.userRole.includes('RPA Designer')
      || this.userRole.includes('Process Owner') || this.userRole.includes('Process Architect') || this.userRole.includes('Process Analyst') || this.userRole.includes('RPA Developer') || this.userRole.includes('Process Architect') || this.userRole.includes("System Admin") || this.userRole.includes("User");
    this.rest_api.getCustomUserRole(2).subscribe(role => {
      this.customUserRole = role.message[0].permission;
      this.customUserRole.forEach(element => {
        if (element.permissionName.includes('RPA_Environmet_full')) {
          this.enableEnvironment = true;
        }
      }
      );
      
    })
    this.columns_list = [
      {ColumnName: "environmentName",DisplayName: "Name",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true},
      {ColumnName: "environmentType",DisplayName: "Type",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true},
      {ColumnName: "agentPath",DisplayName: "Agent Path",ShowFilter: true,ShowGrid: true,filterWidget: "normal",filterType: "text",sort: true},
      {ColumnName: "categoryName",DisplayName: "Category",ShowGrid: true,ShowFilter: true,filterWidget: "dropdown",filterType: "text",sort: true,"dropdownList":this.categories_list},
      {ColumnName: "hostAddress",DisplayName: "IP Address / Host",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "number",sort: true},
      {ColumnName: "portNumber",DisplayName: "Port",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "number",sort: true},
      {ColumnName: "username",DisplayName: "Username",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true},
      {ColumnName: "password_new",DisplayName: "Password / Key",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "date",sort: true},
      {ColumnName: "activeStatus_new",DisplayName: "Status",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true},
      {ColumnName: "deploy_status_new",DisplayName: "Deployed",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true},
      {ColumnName: "createdTimeStamp_converted",DisplayName: "Created Date",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "date",sort: true},
      {ColumnName: "createdBy",DisplayName: "Created By",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true},
    ];
    this.table_searchFields=["environmentName","environmentType","agentPath","categoryName","hostAddress","portNumber","username","activeStatus_new","deploy_status_new","createdTimeStamp_converted","createdBy"]
  }

  async getallData() {
    this.spinner.show();
    this.environments = [];
    await this.rest_api.listEnvironments().subscribe(
      data => {
        console.log(data);
        let response: any = data;
        this.variableforapplyfilter=data;
        if (response.length > 0) {
          this.checkeddisabled = false;
        } else {
          this.noDataMessage=true
          this.checkeddisabled = true;
        }
       
        // this.environments.sort((a, b) => a.activeTimeStamp > b.activeTimeStamp ? -1 : 1);
        this.environments = response.map(item => {
          item["checked"] = false;
          item["categoryName"] = this.categoryList.find(item2 => item2.categoryId == item.categoryId).categoryName;
          item["createdTimeStamp_converted"] = moment(new Date(item.createdTimeStamp)).format('lll')
          item["deploy_status_new"] = item.deployStatus == true?"Yes":"No"
          item["activeStatus_new"] = item.activeStatus == 7? "Active":"Inactive"
          item["password_new"] = "******"
          if (item.keyValue != null) {
            item["password"] = {
              key: ""
            }
          } else {
            item["password"] = {
              password: item.password
            }
          }
          return item;
        })
        this.environments.sort(function (a, b) {
          a = new Date(a.activeTimeStamp);
          b = new Date(b.activeTimeStamp);
          return a > b ? -1 : a < b ? 1 : 0;
        });
        // this.dataSource = new MatTableDataSource(this.environments);
        // this.dataSource.sort = this.sort1;
        // this.dataSource.paginator = this.paginator1;
        this.spinner.hide();
      });

  }

  // length(){
    
  // }

  checkAllCheckBox(ev) {
    this.environments.forEach(x => x.checked = ev.target.checked)
    if (this.environments.filter(data => data.checked == true).length == this.environments.length) {
      this.checkflag = true;
    } else {
      this.checkflag = false;
    }
    this.checktoupdate();
    this.checktodelete();
  }

  isAllCheckBoxChecked() {
    this.environments.forEach(data => {
      if (data.checked == false) {
        return false;
      }
    })
    return true;
  }

  openCreateEnvOverlay() {
    this.isCreate = true;
    document.getElementById("createenvironment").style.display = 'block';
    // document.getElementById("update-popup").style.display = 'none';
  }

  downloadOption(environmentName, fileData) {
    if (fileData != null) {
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileData));
      element.setAttribute('download', `${environmentName}-Key.ppk`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
    } else {
      Swal.fire("Error", "Unable to download .ppk file", "error")
    }
  }

  openUpdateEnvOverlay() {
    this.isCreate = false;
    document.getElementById("createenvironment").style.display = 'block';
    // document.getElementById('update-popup').style.display = 'block';
    for (let data of this.environments) {
      if (data.environmentId == this.updateid) {
        if (data.password.password == undefined) {
          this.isKeyValuePair = true
          this.password = ""
        } else {
          this.password = data.password.password;
          this.isKeyValuePair = false;
        }
        if (data.keyValue != null) {
          this.keyValueFile = data.keyValue
        } else {
          this.keyValueFile = undefined
        }
        this.updateenvdata = data
      }
    }
  }

  keypair(event) {
    this.isKeyValuePair = !this.isKeyValuePair;
    if (event.target.checked == true) {
      if (this.updateenvdata.password.password != undefined) {
        this.password = this.updateenvdata.password.password
      } else {
        this.password = ''
      }
      if (this.keyValueFile == undefined) {
        this.keyValueFile = undefined
      } else {
        this.keyValueFile = this.updateenvdata.keyValue
      }
    } else {
      if (this.keyValueFile == undefined) {
        this.keyValueFile = undefined
      }
      if (this.updateenvdata.password.password != undefined) {
        this.password = this.updateenvdata.password.password
      } else {
        this.password = ''
      }
    }
  }

  async deleteEnvironments() {
    const selectedEnvironments = this.environments.filter(product => product.checked == true).map(p => p.environmentId);
    if (selectedEnvironments.length != 0) {
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
          this.rest_api.deleteenvironment(selectedEnvironments).subscribe((res: any) => {
            this.spinner.hide();
            if (res.errorMessage == undefined) {
              Swal.fire("Success", res.status, "success")
              this.removeallchecks();
              this.getallData();
              this.checktoupdate();
              this.checktodelete();
            } else {
              Swal.fire("Error", res.errorMessage, "error")
            }
          }, err => {
            this.spinner.hide();
            Swal.fire("Error", "Unable to delete environment", "error")
          })
        }
      })
    }
  }

  checktoupdate() {
    const selectedEnvironments = this.environments.filter(product => product.checked == true);
    if (selectedEnvironments.length > 0) {
      this.addflag = true;
    } else {
      this.addflag = false;
    }
    if (selectedEnvironments.length == 1) {
      this.updateflag = true;
      this.updateid = selectedEnvironments[0].environmentId;
    } else {
      this.updateflag = false;
    }
  }

  checktodelete() {
    const selectedEnvironments = this.environments.filter(product => product.checked).map(p => p.environmentId);
    if (selectedEnvironments.length > 0) {
      this.deleteflag = true;
    } else {
      this.deleteflag = false;
    }
  }

  checkEnableDisableBtn(id, event) {
    this.environments.find(data => data.environmentId == id).checked = event.target.checked;
    if (this.environments.filter(data => data.checked == true).length == this.environments.length) {
      this.checkflag = true;
    } else {
      this.checkflag = false;
    }
    this.checktoupdate();
    this.checktodelete();
  }

  deploybotenvironment() {
    const selectedEnvironments = this.environments.filter(product => product.checked).map(p => p.environmentId);
    if (selectedEnvironments.length != 0) {
      this.spinner.show();
      this.rest_api.deployenvironment(selectedEnvironments).subscribe(res => {
        let data: any = res
        this.spinner.hide();
        if (data[0].errorMessage == undefined) {
          Swal.fire("Success", data[0].status, "success")
        } else {
          Swal.fire("Error", data[0].errorMessage, "error")
        }
        this.removeallchecks();
        this.getallData();
        this.checktoupdate();
        this.checktodelete();
      }, err => {
        Swal.fire("Success", "Agent Deployed Successfully !!", "success");
        this.removeallchecks();
        this.getallData();
        this.checktoupdate();
        this.checktodelete();
        this.spinner.hide();
      })
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    if(this.dataSource.filteredData.length == 0){
      this.noDataMessage = true;
    }
    else{
      this.noDataMessage=false;
    }
  }

  removeallchecks() {
    for (let i = 0; i < this.environments.length; i++) {
      this.environments[i].checked = false;
    }
    this.checkflag = false;
  }

  getCategories() {
    this.rest_api.getCategoriesList().subscribe(data => {
      let response: any = data;
      if (response.errorMessage == undefined) {
        this.categoryList = response.data;
    let sortedList=this.categoryList.sort((a, b) => (a.categoryName.toLowerCase() > b.categoryName.toLowerCase()) ? 1 : ((b.categoryName.toLowerCase() > a.categoryName.toLowerCase()) ? -1 : 0));
    sortedList.forEach(element => {
      this.categories_list.push(element.categoryName)
    });
        this.getallData();
      }
    })
  }

  refreshEnvironmentList(event){
    if(event)
    this.getallData();
    console.log(this.environments) 
  }

  readSelectedData(data) {
    this.selected_list = data
    // this.selected_list.length > 0 ? this.Departmentdeleteflag =true :this.Departmentdeleteflag =false;
  }
}