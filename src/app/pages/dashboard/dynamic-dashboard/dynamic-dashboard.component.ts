import { Component, OnInit, ViewChild } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { DataTransferService } from '../../services/data-transfer.service';
import { MenuItem, SelectItem, MessageService, PrimeNGConfig } from 'primeng/api';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { Inplace } from 'primeng/inplace';



@Component({
  selector: 'app-dynamic-dashboard',
  templateUrl: './dynamic-dashboard.component.html',
  styleUrls: ['./dynamic-dashboard.component.css']
})
export class DynamicDashboardComponent implements OnInit {
  @ViewChild("inplace") inplace!: Inplace;
  items: MenuItem[];
  gfg: MenuItem[];
  dynamicDashBoard: any;
  metrics_list: any;
  defaultEmpty_metrics: any;
  widgets: any;
  selectedCar: string;
  dataTransfer: any;
  public allbots: any;
  dashboardName: String = "";
  dashbordlist:any;
  dashboardData:any;
  _paramsData:any;
  _dashboardName:any
  isEditDesc:boolean=false;
  editdashbordnamedata: any;
  active_inplace: any;
 selectedDashBoardName:any;
 selectedDashBoard:any;
  

  constructor(private activeRoute: ActivatedRoute,
    private datatransfer: DataTransferService,
    private router: Router,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig, 
    private rest:RestApiService,
    private spinner: LoaderService,
    private loader:LoaderService
  ) {
    this.activeRoute.queryParams.subscribe(res => {
      console.log(res)
      this._paramsData = res
      this.selectedDashBoardName= this._paramsData.dashboardName
    })
  }

  ngOnInit(): void {

    // this.getUserDetails();
    this.primengConfig.ripple = true;
    this.gfg = [
      { 
        label: 'Delete',
        command: () => {
          this.deletedashbord();
      }
     },
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
      console.log(this.dashboardData)

      if (response.widgets) {
        this.dashboardData.widgets = response.widgets.map((item: any) => {
          item["edit"] = false;
          return item;
        })
        console.log(this.dashboardData)
      } else {
        this.dashboardData = {
          "dashboardName": "testing",
          "widgets": [
            {
              "id": 1,
              "widget_type": "pie",
              "name": "Bot Execution Status",
              "description": "Provides the execution status of the bots - failed ones vs successfully executed ones",
              "sampleData": {


                "labels": [
                  "Mac",
                  "Windows",
                  "Linux"
                ],

                "datasets": [
                  {
                    "data": [
                      300,
                      50,
                      100
                    ],
                    "backgroundColor": [
                      "#FF6384",
                      "#36A2EB",
                      "#FFCE56"
                    ],
                    "hoverBackgroundColor": [
                      "#FF6384",
                      "#36A2EB",
                      "#FFCE56"
                    ]
                  }
                ]
              },
              "chartOptions": {
                "plugins": {
                  "legend": {
                    "position": "bottom"
                  }
                }
              },

              "widgetAdded": true,
              "edit": false,
              "filterOptions": {
                "widgetTypes": [
                  "pie",
                  "bar"
                ]
              }
            },

          ],
          "metrics": [
            {
              "id": 1,
              "name": "Total Number of Resources",
              "description": "Display the total count of resources onboarded into EZFlow for the tenant",
              "metricAdded": true,
              "metricValue": 29,
              "src": "process.svg"
            },
            {
              "id": 2,
              "name": "Total Processes Documented",
              "description": "Displays the count of processes across all departments",
              "metricAdded": true,
              "metricValue": 38,
              "src": "process.svg"
            },
            {
              "id": 3,
              "name": "Total Processes Automated",
              "description": "Displays the count of processes that has RPA assigned to any of the step",
              "metricAdded": true,
              "metricValue": 47,
              "src": "process.svg"
            },
            {
              "id": 4,
              "name": "Processes pending approval",
              "description": "Total list of processes for which approval is pending",
              "metricAdded": true,
              "metricValue": 56,
              "src": "process.svg"
            }
          ]
        }
      }

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

    this.getListOfDashBoards();

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
    this.selectedDashBoardName=this._dashboardName
    this.selectedDashBoard["dashboardName"]= this.selectedDashBoardName
    this.rest.updateDashBoardNamed(this.selectedDashBoard).subscribe((response:any)=>{
      console.log('update bot details=================',response)
    })
  }

  navigateToConfigure() {
    this.datatransfer.setdynamicscreen(this.dashboardData)
    this.router.navigate(["pages/dashboard/configure-dashboard"], { queryParams: this._paramsData });
  }

  navigateToCreateDashboard() {
    this.router.navigate(["pages/dashboard/create-dashboard"])
  }

  toggleConfigure(e, widget?: any) {
    console.log(e, widget)
    this.dashboardData.widgets.
      forEach(element => {
        element.edit = true
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
          console.log(e)
        }
      }]

  }

  cancelEdit() {
    this.dashboardData.widgets.
      forEach(element => {
        element.edit = false
      });
    console.log(this.dashboardData.widgets)
  }

// Dash Board list in dropdown 
  getListOfDashBoards(){
    this.rest.getDashBoardsList().subscribe((res:any)=>{
      this.dashbordlist=res.data;
      this.selectedDashBoard = this.dashbordlist.find(item=>item.id == this._paramsData.dashboardId);
    })     
  }

  onDropdownChange(event){
    this.selectedDashBoard = event.value
    this.selectedDashBoardName = this.selectedDashBoard.dashboardName
   console.log('this is dropdownselected data',event);
   let params1= {dashboardId:this.selectedDashBoard.id,dashboardName:this.selectedDashBoard.dashboardName};
   this.router.navigate([],{ relativeTo:this.activeRoute, queryParams:params1 });
  }

  inplaceActivate() {
    this._dashboardName = this.selectedDashBoardName
  }

    Space(event:any){
      if(event.target.selectionStart === 0 && event.code === "Space"){
        event.preventDefault();
      }
      }


  onDeactivate(){
    this.inplace.deactivate();
   }
       
  deletedashbord(){
  this.rest.getdeleteDashBoard(this.selectedDashBoard.id).subscribe(data=>{
    this.inplace.deactivate();
  });
  }

 }


