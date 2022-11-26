import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { environmentobservable } from '../model/environmentobservable';
import Swal from 'sweetalert2';
import { RestApiService } from '../../services/rest-api.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NgxSpinnerService } from "ngx-spinner";
import * as moment from 'moment';

@Component({
  selector: 'app-environments',
  templateUrl: './rpa-environments.component.html',
  styleUrls: ['./rpa-environments.component.css']
})
export class RpaenvironmentsComponent implements OnInit {
  displayedColumns: string[] = ["check", "environmentName", "environmentType", "agentPath", "categoryName", "hostAddress", "portNumber", "username", "password", "activeStatus", "deployStatus", "createdTimeStamp", "createdBy"]; //,"connectionType"
  dataSource: MatTableDataSource<any>;
  @ViewChild("paginator1", { static: false }) paginator1: MatPaginator;
  @ViewChild("sort1", { static: false }) sort1: MatSort;
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

  constructor(private api: RestApiService,
    private spinner: NgxSpinnerService) {
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
    this.api.getCustomUserRole(2).subscribe(role => {
      this.customUserRole = role.message[0].permission;
      this.customUserRole.forEach(element => {
        if (element.permissionName.includes('RPA_Environmet_full')) {
          this.enableEnvironment = true;
        }
      }
      );
    })
  }

  async getallData() {
    this.spinner.show();
    this.environments = [];
    await this.api.listEnvironments().subscribe(
      data => {
        let response: any = data;
        if (response.length > 0) {
          this.checkeddisabled = false;
        } else {
          this.checkeddisabled = true;
        }
        // this.environments.sort((a, b) => a.activeTimeStamp > b.activeTimeStamp ? -1 : 1);
        this.environments = response.map(item => {
          item["checked"] = false;
          item["categoryName"] = this.categoryList.find(item2 => item2.categoryId == item.categoryId).categoryName;
          item["createdTimeStamp_converted"] = moment(new Date(item.createdTimeStamp)).format('lll')
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
        this.dataSource = new MatTableDataSource(this.environments);
        this.dataSource.sort = this.sort1;
        this.dataSource.paginator = this.paginator1;
        this.spinner.hide();
      });
  }

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
          this.api.deleteenvironment(selectedEnvironments).subscribe((res: any) => {
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
      this.api.deployenvironment(selectedEnvironments).subscribe(res => {
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
  }

  removeallchecks() {
    for (let i = 0; i < this.environments.length; i++) {
      this.environments[i].checked = false;
    }
    this.checkflag = false;
  }

  getCategories() {
    this.api.getCategoriesList().subscribe(data => {
      let response: any = data;
      if (response.errorMessage == undefined) {
        this.categoryList = response.data;
        this.getallData();
      }
    })
  }

  refreshEnvironmentList(event){
    if(event)
    this.getallData();
  }

}