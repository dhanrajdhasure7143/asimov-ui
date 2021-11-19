import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userRoles: string;
  showFiller = false;

  constructor() { }

  ngOnInit(): void {
    setTimeout(()=>{
      this.userRoles = localStorage.getItem('userRole');
    },1000);
  }

}
