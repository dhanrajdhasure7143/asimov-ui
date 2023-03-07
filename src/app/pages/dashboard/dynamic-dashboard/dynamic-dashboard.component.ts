import { Component, OnInit, ViewChild } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { DataTransferService } from '../../services/data-transfer.service';
import { MenuItem, SelectItem, MessageService, PrimeNGConfig, ConfirmationService } from 'primeng/api';
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
 selecteddashboard:any
  

  constructor(private activeRoute: ActivatedRoute,
    private datatransfer: DataTransferService,
    private router: Router,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig, 
    private rest:RestApiService,
    private spinner: LoaderService,
    private loader:LoaderService,
    private confirmationService: ConfirmationService
  ) {
    this.activeRoute.queryParams.subscribe(res => {
      console.log(res)
      this._paramsData = res
      this.selectedDashBoardName= this._paramsData.dashboardName
    })
  }

  ngOnInit(): void {
    this.getDashBoardData(this._paramsData.dashboardId);
    // this.getUserDetails();
    this.primengConfig.ripple = true;
    this.gfg = [
      { 
        label: 'Delete',
        command: () => {
          this.deletedashbord();
      }
     },
      // { label: 'Set As Background', }

    ];
    this.items = [
      { label: 'Remove', },
      { label: 'Configure', command: (e) =>{
          this.toggleConfigure(e)
          console.log("testing",e)
        } 
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
          "widgets": [
            {"id": 1,
              "widget_type": "pie",
              "name": "Bot Execution Status",
              "data": {"labels": ["Mac","Windows","Linux"],
                "datasets": [
                  {
                    "data": [300,50,100],
                    "backgroundColor": ["#FF6384","#36A2EB","#FFCE56"],
                    "hoverBackgroundColor": ["#FF6384","#36A2EB","#FFCE56"]
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
              "filterOptions": {
                "widgetTypes": ["pie","bar"]
              }
            },
          ],
          "metrics": []
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
    let _params:any={}
    _params["dashboardId"]=this._paramsData.dashboardId
    _params["dashboardName"]=this._paramsData.dashboardName
    _params["isCreate"]=0
    this.router.navigate(["pages/dashboard/configure-dashboard"], { queryParams: _params });
  }

  navigateToCreateDashboard() {
    this.router.navigate(["pages/dashboard/create-dashboard"])
  }

  toggleConfigure(e, widget?: any) {
    console.log(e, widget)
    this.dashboardData.widgets.
      forEach(element => {
        element.edit = true
      });
  }

  getItemActionDetails(event,widget) {
    console.log(widget,event);
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
    console.log(this.selecteddashboard)
    this.selectedDashBoard = event.value
    this.selectedDashBoardName = this.selectedDashBoard.dashboardName
   console.log('this is dropdownselected data',event);
   let params1= {dashboardId:this.selectedDashBoard.id,dashboardName:this.selectedDashBoard.dashboardName};
   this.router.navigate([],{ relativeTo:this.activeRoute, queryParams:params1 });
   this.getDashBoardData(this.selectedDashBoard.id)
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
    console.log(this.selectedDashBoard)
    if(this.selectedDashBoard.defaultDashboard){
    this.confirmationService.confirm({
      message: "Change the default dashboard",
      header: "Info",
      icon: "pi pi-info-circle",
      rejectVisible:false,
      acceptLabel:"Ok",
      accept: () => {
        // this.spinner.show();
      },
      key: "positionDialog2",
    });
    return
  }
  this.confirmationService.confirm({
    message: "Are you sure that you want to proceed?",
    header: "Confirmation",
    icon: "pi pi-info-circle",
    accept: () => {
      this.loader.show();
      this.rest.getdeleteDashBoard(this.selectedDashBoard.id).subscribe(data=>{
        this.inplace.deactivate();
        this.loader.hide();
        this.getListOfDashBoards()
      });
    },
    key: "positionDialog",
  });

  }

  getDashBoardData(screenId){
    this.rest.getDashBoardItems(screenId).subscribe((data:any)=>{
      console.log(data)
      this.dashboardData.metrics=data.metrics
    });
  }

  icons="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTkiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA1OSA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxjaXJjbGUgY3g9IjI5LjUiIGN5PSIyOS41IiByPSIyOC41IiBzdHJva2U9IiM5Nzk3OTciIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMzIuMjEwNCAxMi43OTMxSDI3LjcwNjdDMjYuMTU1MSAxMi43OTMxIDI0Ljg5MTggMTQuMDU1MyAyNC44OTE4IDE1LjYwNzlWMjAuMTExNkMyNC44OTE4IDIxLjY2NDMgMjYuMTU1MSAyMi45MjY0IDI3LjcwNjcgMjIuOTI2NEgzMi4yMTA0QzMzLjc2MTkgMjIuOTI2NCAzNS4wMjUyIDIxLjY2NDIgMzUuMDI1MiAyMC4xMTE2VjE1LjYwNzlDMzUuMDI1MiAxNC4wNTUzIDMzLjc2MTkgMTIuNzkzMSAzMi4yMTA0IDEyLjc5MzFaIiBzdHJva2U9IiM5Nzk3OTciIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjxwYXRoIGQ9Ik0yOS45NTg1IDIyLjkyNjRMMjkuOTU4NSAyOS44OTMxIiBzdHJva2U9IiM5Nzk3OTciIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjxwYXRoIGQ9Ik0xOS44MjUyIDM1LjU5MzFMMjAuMjYwOCAzMS42NzIyQzIwLjM3MzQgMzAuNjU5NCAyMS4yMjk1IDI5Ljg5MzEgMjIuMjQ4NiAyOS44OTMxSDM2LjU4NzVDMzcuNTI0OSAyOS44OTMxIDM4LjMzNjUgMzAuNTQ0MiAzOC41Mzk5IDMxLjQ1OTNMMzkuNDU4NSAzNS41OTMxIiBzdHJva2U9IiM5Nzk3OTciIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjxnIGZpbHRlcj0idXJsKCNmaWx0ZXIwX2RfMjk0XzI0MzQpIj4NCjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNDIuNTIzOCAzNS41OTMxSDM3LjY1OThDMzYuMjA2NyAzNS41OTMxIDM1LjAyNTEgMzYuNzc0NiAzNS4wMjUxIDM4LjIyNzhWNDMuMDkxOEMzNS4wMjUxIDQ0LjU0NDkgMzYuMjA2NyA0NS43MjY0IDM3LjY1OTggNDUuNzI2NEg0Mi41MjM4QzQzLjk3NyA0NS43MjY0IDQ1LjE1ODUgNDQuNTQ0OSA0NS4xNTg1IDQzLjA5MThWMzguMjI3OEM0NS4xNTg2IDM2Ljc3NDYgNDMuOTc3IDM1LjU5MzEgNDIuNTIzOCAzNS41OTMxWiIgZmlsbD0iIzA5OERFNiIvPg0KPC9nPg0KPGcgZmlsdGVyPSJ1cmwoI2ZpbHRlcjFfZF8yOTRfMjQzNCkiPg0KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yMi4yNTcyIDM1LjU5MzFIMTcuMzkzMkMxNS45NDAxIDM1LjU5MzEgMTQuNzU4NSAzNi43NzQ2IDE0Ljc1ODUgMzguMjI3OFY0My4wOTE4QzE0Ljc1ODUgNDQuNTQ0OSAxNS45NDAxIDQ1LjcyNjQgMTcuMzkzMiA0NS43MjY0SDIyLjI1NzJDMjMuNzEwNCA0NS43MjY0IDI0Ljg5MTkgNDQuNTQ0OSAyNC44OTE5IDQzLjA5MThWMzguMjI3OEMyNC44OTIgMzYuNzc0NiAyMy43MTA0IDM1LjU5MzEgMjIuMjU3MiAzNS41OTMxWiIgZmlsbD0iIzA5OERFNiIvPg0KPC9nPg0KPGRlZnM+DQo8ZmlsdGVyIGlkPSJmaWx0ZXIwX2RfMjk0XzI0MzQiIHg9IjI1LjAyNTEiIHk9IjI5LjU5MzEiIHdpZHRoPSIzMC4xMzMzIiBoZWlnaHQ9IjMwLjEzMzMiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4NCjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+DQo8ZmVDb2xvck1hdHJpeCBpbj0iU291cmNlQWxwaGEiIHR5cGU9Im1hdHJpeCIgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAxMjcgMCIgcmVzdWx0PSJoYXJkQWxwaGEiLz4NCjxmZU9mZnNldCBkeT0iNCIvPg0KPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iNSIvPg0KPGZlQ29tcG9zaXRlIGluMj0iaGFyZEFscGhhIiBvcGVyYXRvcj0ib3V0Ii8+DQo8ZmVDb2xvck1hdHJpeCB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwLjAzNTI5NDEgMCAwIDAgMCAwLjU1Mjk0MSAwIDAgMCAwIDAuOTAxOTYxIDAgMCAwIDAuMiAwIi8+DQo8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9ImVmZmVjdDFfZHJvcFNoYWRvd18yOTRfMjQzNCIvPg0KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJlZmZlY3QxX2Ryb3BTaGFkb3dfMjk0XzI0MzQiIHJlc3VsdD0ic2hhcGUiLz4NCjwvZmlsdGVyPg0KPGZpbHRlciBpZD0iZmlsdGVyMV9kXzI5NF8yNDM0IiB4PSI0Ljc1ODU0IiB5PSIyOS41OTMxIiB3aWR0aD0iMzAuMTMzMyIgaGVpZ2h0PSIzMC4xMzMzIiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+DQo8ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPg0KPGZlQ29sb3JNYXRyaXggaW49IlNvdXJjZUFscGhhIiB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiIHJlc3VsdD0iaGFyZEFscGhhIi8+DQo8ZmVPZmZzZXQgZHk9IjQiLz4NCjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjUiLz4NCjxmZUNvbXBvc2l0ZSBpbjI9ImhhcmRBbHBoYSIgb3BlcmF0b3I9Im91dCIvPg0KPGZlQ29sb3JNYXRyaXggdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMC4wMzUyOTQxIDAgMCAwIDAgMC41NTI5NDEgMCAwIDAgMCAwLjkwMTk2MSAwIDAgMCAwLjIgMCIvPg0KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJlZmZlY3QxX2Ryb3BTaGFkb3dfMjk0XzI0MzQiLz4NCjxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iZWZmZWN0MV9kcm9wU2hhZG93XzI5NF8yNDM0IiByZXN1bHQ9InNoYXBlIi8+DQo8L2ZpbHRlcj4NCjwvZGVmcz4NCjwvc3ZnPg0K"
  

 }


