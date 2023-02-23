import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataTransferService } from '../../services/data-transfer.service';



@Component({
  selector: 'app-dynamic-dashboard',
  templateUrl: './dynamic-dashboard.component.html',
  styleUrls: ['./dynamic-dashboard.component.css']
})
export class DynamicDashboardComponent implements OnInit {
 
 
 


  constructor(private activeRoute:ActivatedRoute, private datatransfer:DataTransferService) { }

  dashboardName:String="";
  data:any=[];
  
  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe((params:any)=>{
      this.dashboardName=params.dashboardName
    })

    this.datatransfer.dynamicscreenObservable.subscribe((response:any)=>
    {
     this.data=response;
      console.log(this.data)
      
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


  }


