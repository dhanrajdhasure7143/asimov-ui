import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { DataTransferService } from '../../services/data-transfer.service';
import { MenuItem, SelectItem, MessageService, PrimeNGConfig } from 'primeng/api';
import { RestApiService } from 'src/app/pages/services/rest-api.service';



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

 
  dataTransfer: any;



  constructor(private activeRoute: ActivatedRoute, private datatransfer: DataTransferService, private router: Router, private messageService: MessageService,
    private primengConfig: PrimeNGConfig, private rest:RestApiService,
  ) {
    this.cars = [
      { label: 'List of Dashboards', value: 'LOD' },
      { label: 'Analytics dashboard', value: 'AD' },
      { label: 'Performance Dashboard', value: 'PD' },
      { label: 'Revenue Dashbaord', value: 'RD' },
      { label: 'Process Owner Dashboard', value: 'POD' },

    ];

  }
  public allbots:any;
  dashboardName: String = "";
  dashboardData: any = [];
  editDashboardName: boolean = false;
  ngOnInit(): void {
    // this.getUserDetails();
    this.primengConfig.ripple = true;
    this.gfg = [
      { label: 'Delete', },
      { label: 'Set As Background', }

    ];
    this.items = [
      { label: 'Remove', },
      {
        label: 'Configure', command: (e) => this.toggleConfigure(e),
        title: ''
      }
    ];

    this.datatransfer.dynamicscreenObservable.subscribe((response: any) => {
      // response=JSON.parse(response);
      // console.log(response)
      // if(response.find((item:any)=>item.dashboardId==item.dashboardId)!=undefined)
      // {
      //  let dashboardData=response.find((item:any)=>item.dashboardId==item.dashboardId)
      this.dashboardName = response.dashboardName
      this.dashboardData = response;
      this.dashboardData.widgets = response.widgets.map((item: any) => {
        item["edit"] = false;
        return item;
      })
      console.log(this.dashboardData.widgets)
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
  // getallbots()
  // {
  //   am4core.useTheme(am4themes_animated);
  //   this.rest.getallsobots().subscribe((item:any)=>{
     
  //     if(item.errorMessage==undefined){
  //       this.allbots=item;
  //       let data:any=[{
  //         "country": "Failure",
  //         "litres": this.allbots.filter(bot=>bot.botStatus=="Failure").length,
  //         "color": "#BC1D28"
  //       },{
  //         "country": "New",
  //         "litres":  this.allbots.filter(bot=>bot.botStatus=="New").length,
  //         "color": "#00a0e3"
  //       }, {
  //         "country": "Stopped",
  //         "litres":  this.allbots.filter(bot=>bot.botStatus=="Stopped" || bot.botStatus=="Stop").length,
  //         "color": "#FF0000"
  //       },
  //       {
  //         "country": "Success",
  //         "litres":  this.allbots.filter(bot=>bot.botStatus=="Success").length,
  //         "color":"#62C849"
  //       }];
  //       this.chart1(data)
  
  //   }
  
     
      
     
  //     //this.chart2()
     
  //   },
  //  )
  // }
 
  updateDashboardName() {
    this.dashboardData.dashboardName = this.dashboardName;
    this.editDashboardName = false;
  }

  navigateToConfigure() {
    this.datatransfer.setdynamicscreen(this.dashboardData)
    this.router.navigate(["pages/dashboard/configure-dashboard"], { queryParams: { dashboardId: this.dashboardData.dashboardId } });
  }

  navigateToCreateDashboard() {
    this.router.navigate(["pages/dashboard/create-dashboard"])
  }
  toggleConfigure(e, widget?: any) {
  
    this.dashboardData.widgets.
      forEach(element => {
        element.edit=true
        console.log(element, widget)
      });
  }
  getItemActionDetails(widget) {
    console.log(widget);
    return [
      { label: 'Remove', },
      {
        label: 'Configure', command: (e) => {
          console.clear()
          console.log(widget)
        }
      }]

  }
  // getUserDetails(){ // capture the userDatails 
  //   this.dataTransfer.logged_userData.subscribe(res=>{
  //    if(res){
      
  //      this.getallbots();
  //       }
  //     })
  //   }
}


