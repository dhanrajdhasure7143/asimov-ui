import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-configure-dashboard',
  templateUrl: './configure-dashboard.component.html',
  styleUrls: ['./configure-dashboard.component.css']
})
export class ConfigureDashboardComponent implements OnInit {
 
  
    
  constructor(private activeRoute:ActivatedRoute) { }
 

  public metrics:any=[
    {
      id:1,
      title:"Metric-1",
      icon:""
    }
  ]

  public widgets:any=[
    {
      id:1,
      title:'Process Chart',
      widgetType:"Pi-Chart",
      sampleData:[],
    }
  ]

  dashboardName:String="";
  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe((params:any)=>{
      this.dashboardName=params.dashboardName
    })
  
}
  }





