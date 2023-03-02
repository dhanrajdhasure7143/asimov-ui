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
  selectedCar: string;
  dataTransfer: any;
  public allbots:any;
  dashboardName: String = "";
  editDashboardName: boolean = false;
  dashbordlist:any;
  dashboardData: any = {
    "dashboardName":"testing",
    "widgets":[
       {
          "widgetId":"01",
          "widget_type":"DONUT_WITHOUT_LEGENDS",
          "widget_title":"Process Exectuin Rate",
          "widget_description":"Lists Recent activity in a single project, or in all projects",
          "sampleData":{
             "labels":[
                "A",
                "B",
                "C"
             ],
             "datasets":[
                {
                   "data":[
                      300,
                      50,
                      100
                   ],
                   "backgroundColor":[
                      "#FF6384",
                      "#36A2EB",
                      "#FFCE56"
                   ],
                   "hoverBackgroundColor":[
                      "#FF6384",
                      "#36A2EB",
                      "#FFCE56"
                   ]
                }
             ]
          },
          "chartSrc":"chart1.png",
          "chartOptions":{
             
          },
          "widgetAdded":true,
          "api":"none",
          "edit":false
       },
       {
          "widgetId":"02",
          "widget_type":"HORIZANTAL_BAR_CHART",
          "widget_title":"Automation Rate",
          "widget_description":"Lists Recent activity in a single project, or in all projects",
          "sampleData":{
             "labels":[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July"
             ],
             "datasets":[
                {
                   "label":"My First dataset",
                   "backgroundColor":"#42A5F5",
                   "data":[
                      65,
                      59,
                      80,
                      81,
                      56,
                      55,
                      40
                   ]
                },
                {
                   "label":"My Second dataset",
                   "backgroundColor":"#FFA726",
                   "data":[
                      28,
                      48,
                      40,
                      19,
                      86,
                      27,
                      90
                   ]
                }
             ]
          },
          "chartSrc":"chart2.png",
          "chartOptions":{
             "indexAxis":"y",
             "plugins":{
                "legend":{
                   "labels":{
                      "color":"#495057"
                   }
                }
             },
             "scales":{
                "x":{
                   "axis":"x",
                   "ticks":{
                      "color":"#495057",
                      "minRotation":0,
                      "maxRotation":50,
                      "mirror":false,
                      "textStrokeWidth":0,
                      "textStrokeColor":"",
                      "padding":3,
                      "display":true,
                      "autoSkip":true,
                      "autoSkipPadding":3,
                      "labelOffset":0,
                      "minor":{
                         
                      },
                      "major":{
                         
                      },
                      "align":"center",
                      "crossAlign":"near",
                      "showLabelBackdrop":false,
                      "backdropColor":"rgba(255, 255, 255, 0.75)",
                      "backdropPadding":2
                   },
                   "grid":{
                      "color":"#ebedef",
                      "display":true,
                      "lineWidth":1,
                      "drawBorder":true,
                      "drawOnChartArea":true,
                      "drawTicks":true,
                      "tickLength":8,
                      "offset":false,
                      "borderDash":[
                         
                      ],
                      "borderDashOffset":0,
                      "borderWidth":1,
                      "borderColor":"rgba(0,0,0,0.1)"
                   },
                   "type":"linear",
                   "beginAtZero":true,
                   "display":true,
                   "offset":false,
                   "reverse":false,
                   "bounds":"ticks",
                   "grace":0,
                   "title":{
                      "display":false,
                      "text":"",
                      "padding":{
                         "top":4,
                         "bottom":4
                      },
                      "color":"#666"
                   },
                   "id":"x",
                   "position":"bottom"
                },
                "y":{
                   "axis":"y",
                   "ticks":{
                      "color":"#495057",
                      "minRotation":0,
                      "maxRotation":50,
                      "mirror":false,
                      "textStrokeWidth":0,
                      "textStrokeColor":"",
                      "padding":3,
                      "display":true,
                      "autoSkip":true,
                      "autoSkipPadding":3,
                      "labelOffset":0,
                      "minor":{
                         
                      },
                      "major":{
                         
                      },
                      "align":"center",
                      "crossAlign":"near",
                      "showLabelBackdrop":false,
                      "backdropColor":"rgba(255, 255, 255, 0.75)",
                      "backdropPadding":2
                   },
                   "grid":{
                      "color":"#ebedef",
                      "offset":true,
                      "display":true,
                      "lineWidth":1,
                      "drawBorder":true,
                      "drawOnChartArea":true,
                      "drawTicks":true,
                      "tickLength":8,
                      "borderDash":[
                         
                      ],
                      "borderDashOffset":0,
                      "borderWidth":1,
                      "borderColor":"rgba(0,0,0,0.1)"
                   },
                   "type":"category",
                   "offset":true,
                   "display":true,
                   "reverse":false,
                   "beginAtZero":false,
                   "bounds":"ticks",
                   "grace":0,
                   "title":{
                      "display":false,
                      "text":"",
                      "padding":{
                         "top":4,
                         "bottom":4
                      },
                      "color":"#666"
                   },
                   "id":"y",
                   "position":"left"
                }
             },
             "responsive":true,
             "maintainAspectRatio":false
          },
          "widgetAdded":true,
          "api":"none",
          "edit":false
       },
       {
          "widgetId":"03",
          "widget_type":"VERTICAL_BAR_CHART",
          "widget_title":"Scheduled Fields",
          "widget_description":"Lists Recent activity in a single project, or in all projects",
          "sampleData":{
             "labels":[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July"
             ],
             "datasets":[
                {
                   "label":"My First dataset",
                   "backgroundColor":"#42A5F5",
                   "data":[
                      65,
                      59,
                      80,
                      81,
                      56,
                      55,
                      40
                   ]
                },
                {
                   "label":"My Second dataset",
                   "backgroundColor":"#FFA726",
                   "data":[
                      28,
                      48,
                      40,
                      19,
                      86,
                      27,
                      90
                   ]
                }
             ]
          },
          "chartSrc":"chart3.png",
          "chartOptions":{
             
          },
          "widgetAdded":true,
          "api":"none",
          "edit":false
       },
       {
          "widgetId":"08",
          "widget_type":"DONUT_WITH_LEGENDS_CHART",
          "widget_title":"Environments",
          "widget_description":"Lists Recent activity in a single project, or in all projects",
          "sampleData":{
             "labels":[
                "Mac",
                "Windows",
                "Linux"
             ],
             "datasets":[
                {
                   "data":[
                      0,
                      9,
                      2
                   ],
                   "backgroundColor":[
                      "#c2b280",
                      "#838381",
                      "#be0032"
                   ]
                }
             ]
          },
          "chartSrc":"chart1.png",
          "chartOptions":{
             
          },
          "widgetAdded":true,
          "api":"/rpa-service/agent/get-environments",
          "edit":false
       }
    ],
    "metrics":[
       {
          "metricId":"01",
          "metric_name":"Process Execution Rate",
          "metric_desc":"Lists Recent activity in a single project, or in all projects",
          "src":"process.svg",
          "metricAdded":true,
          "value":10
       },
       {
          "metricId":"02",
          "metric_name":"Automation Rate",
          "metric_desc":"Lists Recent activity in a single project, or in all projects",
          "src":"round-settings.svg",
          "metricAdded":true,
          "value":10
       },
       {
          "metricId":"03",
          "metric_name":"Schedules Failed",
          "metric_desc":"Lists Recent activity in a single project, or in all projects",
          "src":"schedules.svg",
          "metricAdded":true,
          "value":10
       },
       {
          "metricId":"04",
          "metric_name":"Pending Approvals",
          "metric_desc":"Lists Recent activity in a single project, or in all projects",
          "src":"Thumbup.svg",
          "metricAdded":true,
          "value":10
       }
    ]
 }


  constructor(private activeRoute: ActivatedRoute, private datatransfer: DataTransferService, private router: Router, private messageService: MessageService,
    private primengConfig: PrimeNGConfig, private rest:RestApiService,
  ) {

  }

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
      // this.dashboardName = response.dashboardName
      // this.dashboardData = response;
      // this.dashboardData.widgets = response.widgets.map((item: any) => {
      //   item["edit"] = false;
      //   return item;
      // })
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
// Dash Board list in dropdown 
  getListOfDashBoards(){
    this.rest.getDashBoardsList().subscribe((data:any)=>{
      this.dashbordlist=data.dataList;
      console.log( this.dashbordlist)
        })
  }
  // getUserDetails(){ // capture the userDatails 
  //   this.dataTransfer.logged_userData.subscribe(res=>{
  //    if(res){
      
  //      this.getallbots();
  //       }
  //     })
  //   }
}


