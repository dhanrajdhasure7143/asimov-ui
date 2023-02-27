import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTransferService } from '../../services/data-transfer.service';
import { MenuItem, SelectItem, MessageService, PrimeNGConfig } from 'primeng/api';



@Component({
  selector: 'app-dynamic-dashboard',
  templateUrl: './dynamic-dashboard.component.html',
  styleUrls: ['./dynamic-dashboard.component.css']
})
export class DynamicDashboardComponent implements OnInit {
  items: MenuItem[];
  gfg: MenuItem[];

  dynamicDashBoard: any;
  metrics_list: any;
  defaultEmpty_metrics: any;
  widgets: any;
  cars: SelectItem[];

  selectedCar: string;

 
 


  constructor(private activeRoute:ActivatedRoute, private datatransfer:DataTransferService, private router:Router, private messageService: MessageService,
    private primengConfig: PrimeNGConfig
) { 
  this.cars = [
    {label: 'List of Dashboards', value: 'Audi'},
    {label: 'Analytics dashboard', value: 'BMW'},
    {label: 'Performance Dashboard', value: 'Fiat'},
    {label: 'Revenue Dashbaord', value: 'Ford'},
    {label: 'Process Owner Dashboard', value: 'Honda'},
   
];

}

  dashboardName:String="";
  dashboardData:any=[];
  editDashboardName:boolean=false;
  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.gfg = [
      {label: 'Delete', },
      {label: 'Set As Background', }
      
  ];
    this.items = [
      {label: 'Remove', },
      {label: 'Configure', }
  ];

    this.datatransfer.dynamicscreenObservable.subscribe((response:any)=>{
      // response=JSON.parse(response);
      // console.log(response)
      // if(response.find((item:any)=>item.dashboardId==item.dashboardId)!=undefined)
      // {
      //  let dashboardData=response.find((item:any)=>item.dashboardId==item.dashboardId)
        this.dashboardName=response.dashboardName
        this.dashboardData=response;
        this.dashboardData.widgets=response.widgets.map((item:any)=>{
          item["edit"]=false;
          return item;
        })
      //}
    })

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

navigateToConfigure()
{
  this.datatransfer.setdynamicscreen(this.dashboardData)
  this.router.navigate(["pages/dashboard/configure-dashboard"],{queryParams:{dashboardId:this.dashboardData.dashboardId}});
}

navigateToCreateDashboard()
{
  this.router.navigate(["pages/dashboard/create-dashboard"])
}

}


