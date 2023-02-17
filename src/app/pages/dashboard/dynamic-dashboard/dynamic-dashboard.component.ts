import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-dynamic-dashboard',
  templateUrl: './dynamic-dashboard.component.html',
  styleUrls: ['./dynamic-dashboard.component.css']
})
export class DynamicDashboardComponent implements OnInit {
 
 
 


  constructor(private activeRoute:ActivatedRoute) { }

  dashboardName:String="";
  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe((params:any)=>{
      this.dashboardName=params.dashboardName
    })
  
}


  }


