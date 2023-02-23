import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataTransferService } from '../../services/data-transfer.service';



@Component({
  selector: 'app-dynamic-dashboard',
  templateUrl: './dynamic-dashboard.component.html',
  styleUrls: ['./dynamic-dashboard.component.css']
})
export class DynamicDashboardComponent implements OnInit {
  dynamicDashBoard: any;
  metrics_list: any;
  defaultEmpty_metrics: any;
  widgets: any;
 
 
 


  constructor(private activeRoute:ActivatedRoute, private datatransfer:DataTransferService) { }

  dashboardName:String="";
  dashboardData:any=[];
  editDashboardName:boolean=false;
  ngOnInit(): void {
    
    this.datatransfer.dynamicscreenObservable.subscribe((response:any)=>
    {
    this.dashboardName=response.dashboardName
     this.dashboardData=response;
    }
    )
    
  // getPortalNames() {
  //   this.datatransfer.screelistObservable.subscribe((data: any) => {
  //     this.tableData = data;
  //     this.rest.getPortalName(this.tableData.ScreenType).subscribe((data) => {
  //       this.portalnames = data;
  //     });
  //   });
  // }
  
}

updateDashboardName()
{
  this.dashboardData.dashboardName=this.dashboardName;
  this.editDashboardName=false;
}


  }


