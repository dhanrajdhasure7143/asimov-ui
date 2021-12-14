import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { element } from 'protractor';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  users: any;
  userslist = [];
  dataSource2:MatTableDataSource<any>;
  displayedColumns: string[] = ["firstName","email","designation","department","roles","created_at","status","action"];
  loggedinUser: string;

  constructor(private api: RestApiService, private router: Router,private spinner:NgxSpinnerService){ }

  ngOnInit(): void {
    this.getUsers();
  }
  getUsers(){
    this.loggedinUser = localStorage.getItem('ProfileuserId');
    this.api.getuserslist(localStorage.getItem("tenantName")).subscribe(resp => {
      this.users = resp
      this.userslist = [];
      this.users.forEach(element => {
        let roles=[];
        let roleslist=[];
        roles = element.rolesEntityList;
        roles.forEach(element1 => {
          roleslist.push(element1.name);
        })
        let name = null;
        if(element.userId.firstName!=null&&element.userId.lastName!=null){
          name = element.userId.firstName+" "+element.userId.lastName;
        }
        let userdata={
          "firstName": name,
          "email":element.userId.userId,
          "designation":element.userId.designation,
          "department":element.departmentsList,
          // "product": "EZFlow",
          "roles": roleslist,
          // "roles": "Admin",
          "created_at": element.created_at,
          "status":element.user_role_status
        }
        this.userslist.push(userdata);
       });
       this.dataSource2 = new MatTableDataSource(this.userslist);
       this.dataSource2.paginator=this.paginator;
       this.dataSource2.sort = this.sort;  
   
          })   
   }

  deleteUser(data) {

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      heightAuto: false,
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
      this.spinner.show();
      this.api.deleteSelectedUser(data.email).subscribe(resp => {
          let value: any = resp
        if (value.message === "User Deleted Successfully") {
          this.getUsers();
          // Swal.fire("Success", "User Deleted Successfully!!", "success")
          Swal.fire({
            title: 'Success',
            text: "User Deleted Successfully!!",
            position: 'center',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#007bff',
            cancelButtonColor: '#d33',
            heightAuto: false,
            confirmButtonText: 'Ok'
        })
        }
        else {
          Swal.fire("Error", "Failed to delete user", "error");
        }
        this.spinner.hide();
      })
    }
    })

  }

  modifyUser(data){
    console.log("userdata====",data)
    let depts=[];
    depts=data.department;
     let userroles=[];
     userroles=data.roles
    this.router.navigate(['/pages/admin/modify-user'], { queryParams: {id:data.email,role:userroles, dept:depts} });

  }

}
