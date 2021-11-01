import { Component, OnInit } from '@angular/core';
import { DepartmentsComponent } from '../departments/departments.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  public selectedTab=0;
  public check_tab=0;
  userRoles: any;
  constructor() { }

  ngOnInit(): void {
    this.userRoles = localStorage.getItem("userRole")

    if(localStorage.getItem("department_tab")){
      this.selectedTab = Number(localStorage.getItem("department_tab"));
      this.check_tab = Number(localStorage.getItem("department_tab"));
      }
  }

  onTabChanged(event)
  {
    localStorage.setItem("department_tab", event.index)
    this.check_tab=event.index;
    if(this.check_tab==1){
      localStorage.removeItem('department_search');
    }
  }


}
