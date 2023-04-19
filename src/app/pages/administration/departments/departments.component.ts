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

  constructor(private rest_api: RestApiService,
    private loader: LoaderService,
    private router: Router,
    private dataTransfer: DataTransferService) 
    { 
      this.getUsersList();
    }

  ngOnInit(): void {
    this.loader.show();
    this.Departmentdeleteflag=false;
    this.columns_list = [
      {ColumnName: "categoryName",DisplayName: "Department",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true},
      {ColumnName: "created_user",DisplayName: "Owner",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "text",sort: true},
      {ColumnName: "createdBy",DisplayName: "Created By",ShowFilter: true,ShowGrid: true,filterWidget: "normal",filterType: "text",sort: true},
      {ColumnName: "createdTimeStamp_converted",DisplayName: "Created At",ShowGrid: true,ShowFilter: true,filterWidget: "normal",filterType: "date",sort: true},
      {ColumnName: "action",DisplayName: "Action",ShowGrid: true,ShowFilter: false,sort: false},
    ];
    this.table_searchFields=["department","owner","createdBy","createdTimeStamp_converted"]
  }

  getAllDepartments(){
    this.rest_api.getDepartmentsList().subscribe(resp => {
      this.departments = resp
      this.departments.data.map(item=>{
        item["createdTimeStamp_converted"] = moment(new Date(item.createdAt)).format('lll')
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
    this.router.navigate(['/pages/admin/edit-department'], { queryParams: {id:element.categoryId } });
  }

  getUsersList() {
    this.dataTransfer.tenantBased_UsersList.subscribe((res) => {
      if (res) {
        this.users_list = res;
        console.log(res)
        this.getAllDepartments();
      }
    });
  }

  readSelectedData(data) {
    this.selected_list = data
    this.selected_list.length > 0 ? this.Departmentdeleteflag =true :this.Departmentdeleteflag =false;
  }
}