import { Component, OnInit } from '@angular/core';

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
    localStorage.removeItem('department_search');
    this.userRoles = localStorage.getItem("userRole")
  }

  onTabChanged(event)
  {
    this.check_tab=event.index;
  }
}
