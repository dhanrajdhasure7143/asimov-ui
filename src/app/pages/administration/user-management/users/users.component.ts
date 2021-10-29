import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
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

  constructor(private api: RestApiService, private router: Router) { }

  ngOnInit(): void {
    this.getUsers();
  }
  getUsers(){
    this.api.getuserslist(localStorage.getItem("tenantName")).subscribe(resp => {
      this.users = resp
      this.users.forEach(element => {
        let roles=[];
        let roleslist=[];
        roles = element.rolesEntityList;
        roles.forEach(element1 => {
          roleslist.push(element1.name);
        })
        let userdata={
          "firstName": element.userId.firstName+" "+element.userId.lastName,
          "email":element.userId.userId,
          "designation":element.userId.designation,
          "department":element.userId.department,
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
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
      this.api.deleteSelectedUser(data.email).subscribe(resp => {
       console.log("del resp===", resp)
        let value: any = resp
        this.getUsers();
        if (value.message === "User Deleted Successfully") {
          Swal.fire("Success", "User Deleted Sucessfully!!", "success")
          
        }
        else {
          Swal.fire("Error", "Failed to delete user", "error");
        }
      })
    }
    })

  }

  modifyUser(data){
    this.router.navigate(['/pages/admin/modify-user'], { queryParams: {id:data.email} });

  }

}
