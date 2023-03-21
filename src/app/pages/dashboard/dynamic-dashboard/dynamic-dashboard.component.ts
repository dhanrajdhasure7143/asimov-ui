import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DataTransferService } from "../../services/data-transfer.service";
import { MenuItem, SelectItem, MessageService, PrimeNGConfig, ConfirmationService} from "primeng/api";
import { RestApiService } from "src/app/pages/services/rest-api.service";
import { LoaderService } from "src/app/services/loader/loader.service";
import { Inplace } from "primeng/inplace";
import { FormGroup, FormControl } from "@angular/forms";
import { ChartDataset, ChartOptions, TooltipItem } from "chart.js";
interface City {
  name: string,
  code: string
}
interface People {
  firstname?: string;
  lastname?: string;
  age?: string;
}

@Component({
  selector: "app-dynamic-dashboard",
  templateUrl: "./dynamic-dashboard.component.html",
  styleUrls: ["./dynamic-dashboard.component.css"],
})
export class DynamicDashboardComponent implements OnInit {
  cities: City[];

    selectedCities: City[];
  tableData: People[] = [];
  cols: any[] = [];
  @ViewChild("inplace") inplace!: Inplace;
  items: MenuItem[];
  menuItems: MenuItem[];
  dynamicDashBoard: any;
  metrics_list: any;
  defaultEmpty_metrics: any;
  widgets: any;
  selectedCar: string;
  dataTransfer: any;
  public allbots: any;
  dashboardName: String = "";
  dashbordlist: any;
  dashboardData: any = {};
  _paramsData: any;
  _dashboardName: any;
  isEditDesc: boolean = false;
  editdashbordnamedata: any;
  active_inplace: any;
  selectedDashBoardName: any;
  selectedDashBoard: any;
  selecteddashboard: any;
  selectedIcon: any;
  configuration_id: any;
  selected_widget: any;
  dynamicFormConfiure: any;
  isDialogShow:boolean=false;
  entered_name:string='';

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private rest: RestApiService,
    private loader: LoaderService,
    private confirmationService: ConfirmationService
  ) {
    this.cities = [
      {name: 'New York', code: 'NY'},
      {name: 'Rome', code: 'RM'},
      {name: 'London', code: 'LDN'},
      {name: 'Istanbul', code: 'IST'},
      {name: 'Paris', code: 'PRS'}
  ];
    this.activeRoute.queryParams.subscribe((res) => {
      this._paramsData = res;
      // this.selectedDashBoardName= this._paramsData.dashboardName
    });
  }

  ngOnInit(): void {
    //     this.cols =[
    //     {
    //       field: 'firstname',
    //       header: 'First Name'
    //   },
    //   {
    //       field: 'lastname',
    //       header: 'Last Name'
    //   },
    //   {
    //       field: 'age',
    //       header: 'Age'
    //   },
    // ];
    // this.tableData = [
    //   {
    //       firstname: 'David',
    //       lastname: 'ace',
    //       age: '40',
    //   },
    //   {
    //       firstname: 'AJne',
    //       lastname: 'west',
    //       age: '40',
    //   },
    //   {
    //       firstname: 'Mak',
    //       lastname: 'Lame',
    //       age: '40',
    //   },
    //   {
    //       firstname: 'Peter',
    //       lastname: 'raw',
    //       age: '40',
    //   },
    //   {
    //       firstname: 'Kane',
    //       lastname: 'James',
    //       age: '40',
    //   },
    //   {
    //       firstname: 'Peter',
    //       lastname: 'raw',
    //       age: '40',
    //   },
    //   {
    //       firstname: 'Kane',
    //       lastname: 'James',
    //       age: '40',
    //   },
    //   {
    //       firstname: 'Peter',
    //       lastname: 'raw',
    //       age: '40',
    //   },
    //   {
    //       firstname: 'Kane',
    //       lastname: 'James',
    //       age: '40',
    //   },
    //   {
    //       firstname: 'Peter',
    //       lastname: 'raw',
    //       age: '40',
    //   },
    //   {
    //       firstname: 'Kane',
    //       lastname: 'James',
    //       age: '40',
    //   },
    //   {
    //       firstname: 'Peter',
    //       lastname: 'raw',
    //       age: '40',
    //   },
    //   {
    //       firstname: 'Kane',
    //       lastname: 'James',
    //       age: '40',
    //   },
    // ];
    this.getDashBoardData(this._paramsData.dashboardId);
    this.primengConfig.ripple = true;
    this.menuItems = [
      {label: "Delete",command: () => { this.deletedashbord()}},
    ];
    this.items = [
      {
        label: "Remove",
        command: (e) => {
          this.onRmoveWidget();
        },
      },
      {
        label: "Configure",
        command: (e) => {
          this.toggleConfigure(e);
        },
      },
    ];

    // this.datatransfer.dynamicscreenObservable.subscribe((response: any) => {
    //   // response=JSON.parse(response);
    //   // console.log(response)
    //   // if(response.find((item:any)=>item.dashboardId==item.dashboardId)!=undefined)
    //   // {
    //   //  let dashboardData=response.find((item:any)=>item.dashboardId==item.dashboardId)

    //   this.dashboardName = response.dashboardName
    //   this.dashboardData = response;
    //   console.log(this.dashboardData)

    //   if (response.widgets) {
    //     this.dashboardData.widgets = response.widgets.map((item: any) => {
    //       item["edit"] = false;
    //       return item;
    //     })
    //     console.log(this.dashboardData)
    //   } else {
    //     // this.dashboardData = {
    //     //   "widgets": [
    //     //     {"id": 1,
    //     //       "widget_type": "pie",
    //     //       "department":"All",
    //     //       "name": "Bot Execution Status",
    //     //       "SampleData": {
    //     //         "labels": ["Success","New","Failure","Stopped"],
    //     //         "datasets": [{
    //     //             "label": 'Bot Execution Status',
    //     //             "data": [79,187,106,2],
    //     //             "backgroundColor": ["#FF6384","#36A2EB","#FFCE56"],
    //     //             "hoverBackgroundColor": ["#FF6384","#36A2EB","#FFCE56"]
    //     //           }
    //     //         ]
    //     //       },
    //     //       "chartOptions": {
    //     //         "plugins": {
    //     //           "legend": {
    //     //             "position": "bottom"
    //     //           }
    //     //         }
    //     //       },
    //     //       "filterOptions": [
    //     //         {"filter":"widget",name:'widget_type',fieldType:"dropdown","types": ["bar","pie","doughnut","line"],label:"Chart Type"},
    //     //         {"filter":"department",name:'department',fieldType:"dropdown","types": ["All","Engineering","QA","Finance"],label:"Department"}
    //     //     ]
    //     //     },
    //     //     {
    //     //       "id": 99,
    //     //       "widget_type": "pie",
    //     //       "name": "Bot Execution Status In Table",
    //     //       "description": "Display the Table Data",
    //     //       "sampleData": {
    //     //           "labels": [
    //     //               {
    //     //                   "field": "firstname",
    //     //                   "header": "First Name"
    //     //               },
    //     //               {
    //     //                   "field": "lastname",
    //     //                   "header": "Last Name"
    //     //               },
    //     //               {
    //     //                   "field": "age",
    //     //                   "header": "Age"
    //     //               }
    //     //           ],
    //     //           "datasets": [
    //     //               {
    //     //                   "data": [
    //     //                       {
    //     //                           "firstname": "David",
    //     //                           "lastname": "ace",
    //     //                           "age": "40"
    //     //                       },
    //     //                       {
    //     //                           "firstname": "AJne",
    //     //                           "lastname": "west",
    //     //                           "age": "40"
    //     //                       }

    //     //                   ],
    //     //                   "backgroundColor": [
    //     //                       "#FF6384",
    //     //                       "#36A2EB",
    //     //                       "#FFCE56"
    //     //                   ],
    //     //                   "hoverBackgroundColor": [
    //     //                       "#FF6384",
    //     //                       "#36A2EB",
    //     //                       "#FFCE56"
    //     //                   ]
    //     //               }
    //     //           ]
    //     //       },
    //     //       "chartOptions": {
    //     //           "plugins": {
    //     //               "legend": {
    //     //               "position": "bottom"
    //     //           }
    //     //       }
    //     //       },
    //     //       "widgetAdded": true,
    //     //       "edit": false,
    //     //       "filterOptions": [{"filter":"widget","widget_type": ["bar","pie","doughnut"]},
    //     //       {"filter":"department","department": ["Engineering","QA","Finance"]},
    //     //     ]

    //     //   }
    //     //   ],
    //     //   "metrics": [
    //     //     {
    //     //       "id": 1,
    //     //       "name": "Total Number of Resources",
    //     //       "description": "Display the total count of resources onboarded into EZFlow for the tenant",
    //     //       "metricAdded": true,
    //     //       "metricValue": 29,
    //     //       "src": "process.svg"
    //     //     },
    //     //     {
    //     //       "id": 2,
    //     //       "name": "Total Processes Documented",
    //     //       "description": "Displays the count of processes across all departments",
    //     //       "metricAdded": true,
    //     //       "metricValue": 38,
    //     //       "src": "process.svg"
    //     //     },
    //     //     {
    //     //       "id": 3,
    //     //       "name": "Total Processes Automated",
    //     //       "description": "Displays the count of processes that has RPA assigned to any of the step",
    //     //       "metricAdded": true,
    //     //       "metricValue": 47,
    //     //       "src": "process.svg"
    //     //     },
    //     //     {
    //     //       "id": 4,
    //     //       "name": "Processes pending approval",
    //     //       "description": "Total list of processes for which approval is pending",
    //     //       "metricAdded": true,
    //     //       "metricValue": 56,
    //     //       "src": "process.svg"
    //     //     }
    //     //   ],
    //     // }

    //   }

    //   //}
    // })

    this.getListOfDashBoards();
  }

  openConfiguration(widget: any) {
    let formData: any = {};
    widget.filterOptions.forEach((item: any) => {
      formData[item.name] = new FormControl(
        widget[item.name] == undefined ? "" : widget[item.name]
      );
    });
    this.dynamicFormConfiure = new FormGroup(formData);
  }

  saveConfigure(index: number) {
    let formDataValue = this.dynamicFormConfiure.value;
    let req_body = [
      {
        childId: this.dashboardData.widgets[index].childId,
        id: this.dashboardData.widgets[index].id,
        name: this.dashboardData.widgets[index].name,
        widgetType: formDataValue.widget_type,
        type: "widget",
        screenId: this.selectedDashBoard.id,
      },
    ];

    this.rest.updateWidgetInDashboard(req_body).subscribe(
      (res) => {
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Updated Successfully !!",
        });
        this.dashboardData.widgets[index].filterOptions = [
          ...this.dashboardData.widgets[index].filterOptions.map(
            (item: any) => {
              item.value = formDataValue[item.name];
              return item;
            }
          ),
        ];
        this.dashboardData.widgets[index] = {
          ...this.dashboardData.widgets[index],
          ...formDataValue,
        };
        this.configuration_id = null;
      },
      (err) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Error...",
        });
      }
    );
  }
  updateDashboardName() {
    this.selectedDashBoardName = this._dashboardName;
    this.selectedDashBoard["dashboardName"] = this.selectedDashBoardName;
    this.rest
      .updateDashBoardNamed(this.selectedDashBoard)
      .subscribe((response: any) => {
      });
    this.inplace.deactivate();
  }

  navigateToConfigure() {
    let _params: any = {};
    _params["dashboardId"] = this._paramsData.dashboardId;
    _params["dashboardName"] = this._paramsData.dashboardName;
    _params["defaultDashboard"] = this.selectedDashBoard.defaultDashboard
    _params["isCreate"] = 0;
    this.router.navigate(["pages/dashboard/configure-dashboard"], {
      queryParams:_params,
    });
  }

  navigateToCreateDashboard() {
    // this.router.navigate(["pages/dashboard/create-dashboard"]);
    this.isDialogShow=true;
  }

  toggleConfigure(e, widget?: any) {
    setTimeout(() => {
      this.openConfiguration(this.selected_widget);
      this.configuration_id = this.selected_widget.id;
    }, 100);
  }

  getItemActionDetails(event, widget) {
    this.selected_widget = widget;
  }

  cancelEdit() {
    this.configuration_id = null;
  }

  // Dash Board list in dropdown
  getListOfDashBoards() {
    this.rest.getDashBoardsList().subscribe((res: any) => {
      this.dashbordlist = res.data;
      this.selectedDashBoard = this.dashbordlist.find(
        (item) => item.id == this._paramsData.dashboardId
      );
      setTimeout(() => {
        this.selecteddashboard = this.selectedDashBoard
      }, 100);
      this.selectedDashBoardName = this.selectedDashBoard.dashboardName;
    });
  }

  onDropdownChange(event) {
    this.selectedDashBoard = event.value;
    this.selectedDashBoardName = this.selectedDashBoard.dashboardName;
    let params1 = {
      dashboardId: this.selectedDashBoard.id,
      dashboardName: this.selectedDashBoard.dashboardName,
    };
    this.router.navigate([], {
      relativeTo: this.activeRoute,
      queryParams: params1,
    });
    if(this.menuItems.length == 2)this.menuItems.splice(1,1)
    if(!this.selectedDashBoard.defaultDashboard){
    let obj = {label: "Set as Default",command: () => { this.setDefaultDashboard()}}
    this.menuItems.push(obj);
    }else{
      this.menuItems.splice(1,1)
    }
    this.getDashBoardData(this.selectedDashBoard.id);
  }

  inplaceActivate() {
    this._dashboardName = this.selectedDashBoardName;
  }

  Space(event: any) {
    if (event.target.selectionStart === 0 && event.code === "Space") {
      event.preventDefault();
    }
  }

  onDeactivate() {
    this.inplace.deactivate();
  }

  setDefaultDashboard() {
    this.selectedDashBoard = this.selectedDashBoard.defaultDashboard;
  }

  deletedashbord() {
    if (this.selectedDashBoard.defaultDashboard) {
      this.confirmationService.confirm({
        message: "Change the default dashboard",
        header: "Info",
        icon: "pi pi-info-circle",
        rejectVisible: false,
        acceptLabel: "Ok",
        accept: () => {},
        key: "positionDialog2",
      });
      return;
    }
    this.confirmationService.confirm({
      message: "Are you sure that you want to proceed?",
      header: "Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.loader.show();
        this.rest
          .getdeleteDashBoard(this.selectedDashBoard.id)
          .subscribe((data) => {
            this.inplace.deactivate();
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: "Deleted Successfully !!",
            });
            this.changeToDefaultDashBoard();
          });
      },
      key: "positionDialog",
    });
  }

  changeToDefaultDashBoard() {
    this.rest.getDashBoardsList().subscribe((res: any) => {
      this.dashbordlist = res.data;
      this.selectedDashBoard = this.dashbordlist.find(
        (item) => item.defaultDashboard == true
      );
      let params1 = {
        dashboardId: this.selectedDashBoard.id,
        dashboardName: this.selectedDashBoard.dashboardName,
      };
      this.router.navigate([], {
        relativeTo: this.activeRoute,
        queryParams: params1,
      });
      setTimeout(() => {
        this.selecteddashboard = this.selectedDashBoard
      }, 100);
      this.selectedDashBoardName = this.selectedDashBoard.dashboardName
      this.getDashBoardData(this.selectedDashBoard.id);
    });
  }

  getDashBoardData(screenId) {
    this.loader.show();
    this.rest.getDashBoardItems(screenId).subscribe((data: any) => {
      this.dashboardData.metrics = data.metrics;
      this.dashboardData.widgets = data.widgets;
      let array = {
        id: 5,
        widget_type: "doughnut",
        name: "Bot Execution Status",
        widgetData: {
          labels: ["Mac", "Windows", "Linux"],
          datasets: [
            {
              data: [30, 70, 60, 8, 9, 9, 7, 6, 4, 3, 4, 6, 8],
              label: "Dataset 1",
            },
          ],
        },
        chartOptions: {
          plugins: {
            legend: {
              display: "false",
            },
            tooltip: {
              callbacks: {
                label: (tooltipItem, data) => {
                  const datasetIndex = tooltipItem.datasetIndex;
                  return (
                    tooltipItem.label + ": " + tooltipItem.formattedValue * 2
                  );
                },
              },
            },
          },
        },
        filterOptions: [{
            filter: "widget",
            name: "widget_type",
            fieldType: "dropdown",
            types: ["bar", "pie", "doughnut", "line"],
            label: "Chart Type",
          },
          {
            filter: "department",
            name: "department",
            fieldType: "dropdown",
            types: ["All", "Engineering", "QA", "Finance"],
            label: "Department",
          },
        ],
      };
      // this.dashboardData.widgets.push(array);
      this.primengConfig.ripple = true;
      this.loader.hide();
    });
  }

  onRmoveWidget() {
    this.confirmationService.confirm({
      message: "Are you sure?, You won't be able to revert this!",
      header: "Info",
      icon: "pi pi-info-circle",
      rejectVisible: false,
      acceptLabel: "Ok",
      accept: () => {
        this.rest.onRemoveSelectedWidget(this.selected_widget.id).subscribe(
          (res) => {
            this.dashboardData.widgets.forEach((element, index) => {
              if (this.selected_widget.childId == element.childId) {
                this.dashboardData.widgets.splice(index, 1);
                this.messageService.add({
                  severity: "success",
                  summary: "Success",
                  detail: "Deleted Successfully !!",
                });
              }
            });
          },
          (err) => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Error...",
            });
          }
        );
      },
      key: "positionDialog3",
    });
  }

  navigateconfigure() {
    let req_data = {
      "dashboardName": this.entered_name,
      "defaultDashboard": false,
      "firstName": localStorage.getItem("firstName"),
      "lastName": localStorage.getItem("lastName"),
    }
    this.rest.createDashBoard(req_data).subscribe((response: any) => {
      if(response.code == 4200){
        let res_data = response.data
        this.router.navigate(["pages/dashboard/configure-dashboard"], { queryParams: {dashboardId:res_data.id,dashboardName:res_data.dashboardName,isCreate:1}});
      }
      if(response.errorCode == 8010){
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: response.errorMessage+' !',
        });
      }
    })
  }
}
