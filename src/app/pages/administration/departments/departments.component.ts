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

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
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
  editDepartmentForm:FormGroup;
  departmentowner: any;

  constructor(private rest_api: RestApiService,
    private loader: LoaderService,
    private router: Router,
    private dataTransfer: DataTransferService,
    private formBuilder: FormBuilder
    ){ 
      this.getUsersList();
    }

  ngOnInit(): void {
    this.loader.show();
    this.Departmentdeleteflag=false;
    this.columns_list = [
      {ColumnName: "categoryName",DisplayName: "Department",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true},
      {ColumnName: "created_user",DisplayName: "Owner",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true},
      {ColumnName: "createdBy",DisplayName: "Created By",ShowFilter: true,ShowGrid: true,filterWidget: "normal",filterType: "text",sort: true},
      {ColumnName: "createdAt",DisplayName: "Created At",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "date",sort: true},
      {ColumnName: "action",DisplayName: "Action",ShowGrid: true,ShowFilter: false,sort: false},
    ];
    this.table_searchFields=["categoryName","created_user","createdBy","createdAt"]

    this.createDepartmentForm=this.formBuilder.group({
      departmentName: ["", Validators.compose([Validators.required, Validators.maxLength(50),Validators.pattern("^[a-zA-Z0-9_-]*$")])],
      owner: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      })
      this.editDepartmentForm=this.formBuilder.group({
        departmentName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        owner: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      })
  }

  getAllDepartments(){
    this.rest_api.getDepartmentsList().subscribe(resp => {
      this.departments = resp
      this.departments.data.map(item=>{
        item["createdAt"] = new Date(item.createdAt);
        const userPipe = new UserPipePipe();
        item["created_user"] = userPipe.transform(item.owner,this.users_list);
        return item
      })
      this.departments_list = this.departments.data  
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
    // this.router.navigate(['/pages/admin/edit-department'], { queryParams: {id:element.categoryId } });
    this.hiddenUpdatePopUp= true;
   let data =  this.departments_list.find(item=>item.categoryId == element.categoryId )
    this.departmentowner=data.owner
      this.editDepartmentForm.get("departmentName").setValue(data.categoryName);
      this.editDepartmentForm.get("owner").setValue(this.departmentowner);
  }

  getUsersList() {
    this.users_list=[];
    this.dataTransfer.tenantBased_UsersList.subscribe((res) => {
      if (res) {
        let users:any=res;
        users.forEach(e=>{
          if(e.user_role_status != "INACTIVE"){
            this.users_list.push(e);
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

  onCreate(){
    this.hiddenPopUp = true;
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
      "categoryId": this.departmentdata,
      "categoryName": this.editDepartmentForm.get("departmentName").value,
      "owner":this.editDepartmentForm.get("owner").value
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
      }else if(resp.message==="Category already exists"){
        Swal.fire("Error","Department already exists","error");
      }
      else {
        Swal.fire("Error",resp.message,"error");
      }
    })
}

reseteditdepartment(){
  this.editDepartmentForm.reset();
  this.editDepartmentForm.get("departmentName").setValue("");
  this.editDepartmentForm.get("owner").setValue("");
}
}