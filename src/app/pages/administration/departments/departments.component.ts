import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import * as moment from 'moment';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { DataTransferService } from '../../services/data-transfer.service';
import { UserPipePipe } from './../pipes/user-pipe.pipe';
// import { UserPipePipe } from './pipes/user-pipe.pipe';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { columnList } from 'src/app/shared/model/table_columns';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css'],
  providers : [columnList]
})
export class DepartmentsComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("paginator") paginator: MatPaginator;
  dataSource2:MatTableDataSource<any>;
  displayedColumns: string[] = ["check","categoryName","owner","createdBy","createdAt","action"];
  public departments:any=[];
  public Departmentcheckflag:boolean = false;
  departments_list: any=[];
  public Departmentdeleteflag:Boolean;
  departmentName: any;
  department: string;
  users_list:any=[];
  columns_list:any[]=[];
  table_searchFields:any[]=[];
  selected_list:any[]=[];
  hiddenPopUp:boolean= false;
  createDepartmentForm:FormGroup;
  hiddenUpdatePopUp:boolean = false;
  departmentdata: any;
  departmentowner: any;
  fullName: any;
  userEmail: any;
  categoryId: any;
  isCreate:boolean=false;

  constructor(private rest_api: RestApiService,
    private loader: LoaderService,
    private router: Router,
    private dataTransfer: DataTransferService,
    private formBuilder: FormBuilder,
    public columnList : columnList
    ){ 
      this.getUsersList();
    }

  ngOnInit(): void {
    this.loader.show();
    this.Departmentdeleteflag=false;
    this.columns_list = this.columnList.department_column
    this.table_searchFields=["categoryName","created_user","createdBy","createdAt"]

    this.createDepartmentForm=this.formBuilder.group({
      departmentName: ["", Validators.compose([Validators.required, Validators.maxLength(50),Validators.pattern("^[a-zA-Z0-9_-]*$")])],
      owner: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      });
  }

  getAllDepartments(){
    this.rest_api.getDepartmentsList().subscribe(resp => {
      this.departments = resp
      this.selected_list=[]
      this.departments.data.map(item=>{
        item["createdAt"] = new Date(item.createdAt);
        const userPipe = new UserPipePipe();
        item["created_user"] = userPipe.transform(item.owner,this.users_list);
        return item
      })
      this.departments_list = this.departments.data 
      let categories_list=[];
      this.departments_list.forEach(element => {
        categories_list.push(element.categoryName)
      });
      this.columns_list.map(item=>{
        if(item.ColumnName === "categoryName"){
          item["dropdownList"]=categories_list
        }
      })
      this.loader.hide(); 
      let selected_department=localStorage.getItem("department_search");
      this.department=selected_department?selected_department:'alldepartments';
    })
   }

   onDeleteSelectedProcess(data){
    this.selected_list=[];
    this.selected_list.push(data);
    this.deleteDepartment()
   }

  deleteDepartment() {
    const delbody = this.selected_list.map(p=>{
      return{
        "categoryId": p.categoryId
      }
      });
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      customClass: {
        confirmButton: 'btn bluebg-button',
        cancelButton:  'btn new-cancelbtn',
      },
      heightAuto: false,
      
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
      this.rest_api.deleteDepartments(delbody).subscribe(resp => {
        let value: any = resp
        if (value.message === "Successfully deleted the category") {
          Swal.fire({
            title: 'Success',
            text: "Department Deleted Successfully!!",
            position: 'center',
            icon: 'success',
            showCancelButton: false,
            customClass: {
              confirmButton: 'btn bluebg-button',
              cancelButton:  'btn new-cancelbtn',
            },
    
            heightAuto: false,
            confirmButtonText: 'Ok'
        })
          this.getAllDepartments();
        } else {
          Swal.fire("Error", value.message, "error");
        }
      })
    }
    })
  }

  editdepartment(element) {
    this.isCreate = false;
    this.categoryId= element.categoryId
    this.hiddenPopUp= true;
   let data =  this.departments_list.find(item=>item.categoryId == element.categoryId )
    this.departmentowner=data.owner
      this.createDepartmentForm.get("departmentName").setValue(data.categoryName);
        this.createDepartmentForm.get("owner").setValue(element.owner);
  }

  getUsersList() {
    this.users_list=[];
    this.dataTransfer.tenantBased_UsersList.subscribe((res) => {
      if (res) {
        let users:any=res;
        let firstName:any;
        let lastName:any;
        users.forEach(e=>{
          if(e.user_role_status != "INACTIVE"){
            this.users_list.push(e);
            firstName = e.userId.firstName 
            lastName=e.userId.lastName 
          this.fullName= firstName + lastName
          }
        })
        this.getAllDepartments();
        this.loader.hide();
      }
      })
        // this.users_list = res;
      }

  readSelectedData(data) {
    this.selected_list = data
    this.selected_list.length > 0 ? this.Departmentdeleteflag =true :this.Departmentdeleteflag =false;
  }

  openDepartmentOverlay(){
    this.createDepartmentForm.reset()
    this.hiddenPopUp = true;
    this.isCreate=true;
  }

  closeOverlay(event) {
    this.hiddenPopUp = event;
    this.hiddenUpdatePopUp= event
  }

  savedepartments(){
    let body = {
      "categoryName": this.createDepartmentForm.value.departmentName,
      "owner":this.createDepartmentForm.value.owner
    }
    this.loader.show();
    this.rest_api.createDepartment(body).subscribe(resp => {
      if(resp.message === "Successfully created the category"){
        Swal.fire({
          title: 'Success',
          text: "Department Created Successfully !!",
          position: 'center',
          icon: 'success',
          showCancelButton: false,
          customClass: {
            confirmButton: 'btn bluebg-button',
            cancelButton:  'btn new-cancelbtn',
          },
          heightAuto: false,
          confirmButtonText: 'Ok'
      })
      this.hiddenPopUp = false;
      this.createDepartmentForm.reset();
      this.getAllDepartments();
      }else if(resp.message==="Category already exists"){
        Swal.fire("Error","Department already exists","error");
      } else {
        Swal.fire("Error",resp.message,"error");
      }
      this.loader.hide();
    },err=>{
      Swal.fire("Error","Failed to Save","error");
      this.loader.hide();
    })
  }

  resetdepartment(){
    this.createDepartmentForm.reset();
    this.createDepartmentForm.get("departmentName").setValue("");
    this.createDepartmentForm.get("owner").setValue("");
  }

  updateDepartment(){
    let body = {
      "categoryId": this.categoryId,
      "categoryName": this.createDepartmentForm.get("departmentName").value,
      "owner":this.createDepartmentForm.get("owner").value
    }
    this.rest_api.updateDepartment(body).subscribe(resp => {
      if(resp.message === "Successfully updated the category"){
        Swal.fire({
          title: 'Success',
          text: "Department Updated Successfully !!",
          position: 'center',
          icon: 'success',
          showCancelButton: false,
          customClass: {
            confirmButton: 'btn bluebg-button',
            cancelButton:  'btn new-cancelbtn',
          },
          heightAuto: false,
          confirmButtonText: 'Ok'
      })
      this.hiddenPopUp = false;
      this.getAllDepartments();
      }else if(resp.message==="Category already exists"){
        Swal.fire("Error","Department already exists","error");
      } else {
        Swal.fire("Error",resp.message,"error");
      }
    })
}

onChangeDepeartment(event){
this.userEmail = event.value.user_email

}
}