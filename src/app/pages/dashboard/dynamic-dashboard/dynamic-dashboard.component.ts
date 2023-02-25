import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuItem, SelectItem, MessageService, PrimeNGConfig } from 'primeng/api';
import { DataTransferService } from '../../services/data-transfer.service';
interface City {
  name: string,
  code: string
}


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
 
 
 
 


  constructor(private activeRoute:ActivatedRoute, private datatransfer:DataTransferService,  private messageService: MessageService,
    private primengConfig: PrimeNGConfig) {
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
    // this.gfg = [
    //   {
    //     label: 'HTML',
    //     items: [
    //       {
    //         label: 'HTML 1'
    //       },
    //       {
    //         label: 'HTML 2'
    //       }
    //     ]
    //   },
    //   {
    //     label: 'Angular',
  
    //     items: [
    //       {
    //         label: 'Angular 1'
    //       },
    //       {
    //         label: 'Angular 2'
    //       }
    //     ]
    //   }
    // ];
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


