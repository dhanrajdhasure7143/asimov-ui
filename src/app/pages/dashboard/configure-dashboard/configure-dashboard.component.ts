import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-configure-dashboard',
  templateUrl: './configure-dashboard.component.html',
  styleUrls: ['./configure-dashboard.component.css']
})
export class ConfigureDashboardComponent implements OnInit {

  constructor() { }

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
  ngOnInit(): void {
  }

}
