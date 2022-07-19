import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { element } from 'protractor';
import { APP_CONFIG } from 'src/app/app.config';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';

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
  freetrail: string;

  constructor(private api: RestApiService, private router: Router,
    private spinner:NgxSpinnerService,@Inject(APP_CONFIG) private config){ }

  ngOnInit(): void {
    this.getUsers();
    this.freetrail=localStorage.getItem('freetrail')
  }
  getUsers(){
    this.loggedinUser = localStorage.getItem('ProfileuserId');
    this.api.getuserslist(localStorage.getItem("tenantName")).subscribe(resp => {
      this.users = resp
      this.userslist = [];
      this.users.forEach(element => {
        let roles:any;
        let roleslist:any;
        roles = element.rolesEntityList;
        roles.forEach(element1 => {
          roles=element1.name;
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
          "roles": roles,
          // "roles": "Admin",
          // "created_at": element.created_at,
          "created_at": moment(new Date(element.created_at)).format('LLL'),
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

  inviteUser(){
    if (this.freetrail == 'true') {
      if (this.users.length == this.config.inviteUserfreetraillimit) {
        Swal.fire({
          title: 'Error',
          text: "You have limited access to this product. Please contact EZFlow support team for more details.",
          position: 'center',
          icon: 'error',
          showCancelButton: false,
          confirmButtonColor: '#007bff',
          cancelButtonColor: '#d33',
          heightAuto: false,
          confirmButtonText: 'Ok'
        })

      }
      else {
        this.router.navigate(["/pages/admin/invite-user"])
      }
    }
    else{
    this.router.navigate(["/pages/admin/invite-user"])
  }
  }

  modifyUser(data){
  
    let depts=[];
    depts=data.department;
     let userroles:any;
     userroles=data.roles
    this.router.navigate(['/pages/admin/modify-user'], { queryParams: {id:data.email,role:userroles, dept:depts} });

  }
  applyFilter(filterValue: string) {
    this.dataSource2.filter = filterValue.trim().toLowerCase();
    //console.log(this.dataSource2.filter);
    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }

  getreducedValue(value) {​​​​​​​​
    if (value.length > 15)
    return value.substring(0,16) + '...';
    else
    return value;
  }​​​​​​​​
}
