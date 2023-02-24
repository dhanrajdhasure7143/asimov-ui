import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  selected_tab_index:number=0;
  constructor(
    private route:ActivatedRoute,
    private router:Router
    ) {
    this.route.queryParams.subscribe((data) => {
      if(data){
      this.selected_tab_index = data.index
      this.check_tab = data.index;
    }else this.selected_tab_index=0;
    });
   }

  ngOnInit(): void {
    this.userRoles = localStorage.getItem("userRole")

    if(localStorage.getItem("department_tab")){
      this.selectedTab = Number(localStorage.getItem("department_tab"));
      this.check_tab = Number(localStorage.getItem("department_tab"));
      }
  }

  onTabChanged(event,tabView){
    const tab = tabView.tabs[event.index].header;
    this.selected_tab_index = event.index;
    this.check_tab = event.index;
    this.router.navigate([],{ relativeTo:this.route, queryParams:{index:event.index} });
  }


}
