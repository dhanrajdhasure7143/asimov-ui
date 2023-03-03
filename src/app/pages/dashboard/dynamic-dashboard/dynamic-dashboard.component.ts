import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { DataTransferService } from '../../services/data-transfer.service';
import { MenuItem, SelectItem, MessageService, PrimeNGConfig } from 'primeng/api';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import { LoaderService } from 'src/app/services/loader/loader.service';



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
  dashboardData:any;
  _paramsData:any;
  drpdwndashboard: any;
  dashbordatadashboardName:any
  isEditDesc:boolean=false;
  editdashbordnamedata: any;
  active_inplace: any;
 public  currentdashbord_id: any;
  

  constructor(private activeRoute: ActivatedRoute, 
    private datatransfer: DataTransferService, 
    private router: Router, 
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig, 
    private rest:RestApiService,
    private spinner: LoaderService,
    private loader:LoaderService
  ) {
    this.activeRoute.queryParams.subscribe(res=>{
      console.log(res)
      this._paramsData = res
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

      if(response.widgets){
      this.dashboardData.widgets = response.widgets.map((item: any) => {
        item["edit"] = false;
        return item;
      })
      console.log(JSON.stringify(this.dashboardData))
    }else{
      this.dashboardData= {
        "dashboardName":"testing",
        "widgets":[
           {
              "widgetId":"01",
              "widget_type":"pie",
              "widget_title":"Process Exectuin Rate",
              "sampleData":{
                 "labels":["Mac","Windows","Linux"],
                 "datasets":[
                    {
                       "data":[300,50,100],
                       "backgroundColor":["#FF6384","#36A2EB","#FFCE56"],
                       "hoverBackgroundColor":["#FF6384","#36A2EB","#FFCE56"]
                    }
                 ]
              },
              "chartOptions":{ },
              "widgetAdded":true,
              "edit":false,
              filterOptions:{
                widgetTypes:["pie","bar"]
              }
           }
        ],
        "metrics":[
          {
             "id":1,
             "name":"Total Number of Resources",
             "description":"Display the total count of resources onboarded into EZFlow for the tenant",
             "metricAdded":true,
             "metricValue":29,
             "src":"process.svg"
          },
          {
             "id":2,
             "name":"Total Processes Documented",
             "description":"Displays the count of processes across all departments",
             "metricAdded":true,
             "metricValue":38,
             "src":"process.svg"
          },
          {
             "id":3,
             "name":"Total Processes Automated",
             "description":"Displays the count of processes that has RPA assigned to any of the step",
             "metricAdded":true,
             "metricValue":47,
             "src":"process.svg"
          },
          {
             "id":4,
             "name":"Processes pending approval",
             "description":"Total list of processes for which approval is pending",
             "metricAdded":true,
             "metricValue":56,
             "src":"process.svg"
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

    this.currentdashbord_id=this.drpdwndashboard.id;
// localStorage.setItem('currentdashbord_id', JSON.stringify(this.drpdwndashboard.id));
    
    let req_data={
      "dashboardName":this.editdashbordnamedata,
       "defaultDashboard": true,
        "firstName": localStorage.getItem('firstName'),
        "id": this.currentdashbord_id,
        "lastName":localStorage.getItem('lastName')
    }
    this.rest.updateDashBoardNamed(req_data).subscribe((reasons:any)=>{
      console.log('update bot details=================',reasons)

    })
    this.editDashboardName = false;
  }
  // onDeactivateEdit(){
  //   this.isEditDesc = false;
  //   }

  navigateToConfigure() {
    this.datatransfer.setdynamicscreen(this.dashboardData)
    this.router.navigate(["pages/dashboard/configure-dashboard"], { queryParams:this._paramsData });
  }

  navigateToCreateDashboard() {
    this.router.navigate(["pages/dashboard/create-dashboard"])
  }
  toggleConfigure(e, widget?: any) {
  console.log(e, widget)
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

  cancelEdit() {
      this.dashboardData.widgets.
        forEach(element => {
          element.edit=false
        });
      console.log(this.dashboardData.widgets)
    }

// Dash Board list in dropdown 
  getListOfDashBoards(){
    this.rest.getDashBoardsList().subscribe((data:any)=>{
      this.dashbordlist=data.dataList;
      console.log( this.dashbordlist)
        })     
  }
  onDropdownChange(event){

   this.drpdwndashboard=event.value
   let dashboard=this.drpdwndashboard.dashboardName
   this.currentdashbord_id=this.drpdwndashboard.id
   localStorage.setItem('currentdashbord_id', JSON.stringify(this.drpdwndashboard.id));
   this.dashbordatadashboardName=dashboard
   console.log('this is dropdownselected data',this._paramsData.dashboardName);
   this.editDashboardName = true;
 
  }

  inplaceActivate(field:any,activeField) {
    
    if(activeField != this.active_inplace)
    if(this.active_inplace) this[this.active_inplace].deactivate()
    // this.active_inplace='';
    this.active_inplace = activeField
      // this[activeField].activate();
    this[field] = this.dashbordatadashboardName
    this.isEditDesc = false;
}

    Space(event:any){
      if(event.target.selectionStart === 0 && event.code === "Space"){
        event.preventDefault();
      }
      }
  onUpdateDetails(field){

    this.editdashbordnamedata=this[field]
    this.updateDashboardName();
  // this.onDeactivate(field);
  // this[this.active_inplace].deactivate();
  // this.isEditDesc = true;

   }
  onDeactivate(field){
    this[field].deactivate();
   }
       
   deletedashbord(){
 
   this.currentdashbord_id
   this.rest.getdeleteDashBoard(this.currentdashbord_id).subscribe(data=>{
    console.log('reponse data',data)
    
    window.location.reload();
  })
  }

 }


