import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MenuItem, SelectItem, MessageService, PrimeNGConfig, ConfirmationService} from "primeng/api";
import { RestApiService } from "src/app/pages/services/rest-api.service";
import { LoaderService } from "src/app/services/loader/loader.service";
import { Inplace } from "primeng/inplace";
import { FormGroup, FormControl } from "@angular/forms";
import { ChartDataset, ChartOptions, TooltipItem } from "chart.js";


@Component({
  selector: "app-dynamic-dashboard",
  templateUrl: "./dynamic-dashboard.component.html",
  styleUrls: ["./dynamic-dashboard.component.css"],
})
export class DynamicDashboardComponent implements OnInit {
  @ViewChild("inplace") inplace!: Inplace;
  items: MenuItem[];
  menuItems: MenuItem[];
  dashbordlist: any;
  dashboardData: any = {};
  _paramsData: any;
  _dashboardName: any;
  selectedDashBoardName: any;
  selectedDashBoard: any;
  selecteddashboard: any;
  configuration_id: any;
  selected_widget: any;
  dynamicFormConfiure: any;
  isDialogShow:boolean=false;
  entered_name:string='';
  chartColors:any[] = ["#50ADEB","#B7A4ED","#EE96D8","#FCA186","#FCBE4A","#CD9D64","#94C34D","#CD6D6D","#6F92B5","#E77459","#6DB08F", "#7375C2","#59E060","#C1C156","#5A8795"];
  charthoverColors:any[]=["#098de6","#9c81e9","#eb6dcb","#ff7d56","#ffa600","#b77322","#66aa00","#b82e2e","#316395","#dc3912","#329262", "#3B3EAC","#16D620","#AAAA11","#2D6677"]

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private rest: RestApiService,
    private loader: LoaderService,
    private confirmationService: ConfirmationService
  ) {
    this.activeRoute.queryParams.subscribe((res) => {
      this._paramsData = res;
      // this.selectedDashBoardName= this._paramsData.dashboardName
    });
  }

  ngOnInit(): void {
    this.getDashBoardData(this._paramsData.dashboardId);
    this.primengConfig.ripple = true;
    this.menuItems = [
      {label: "Delete",command: () => { this.deletedashbord()}},
    ];
    this.items = [
      {label: "Remove",command: (e) => {this.onRmoveWidget();}},
      {label: "Configure",command: (e) => {this.toggleConfigure(e)}},
    ];
    if (this._paramsData.dashboardId === undefined) {
      setTimeout(() => {
        this.changeToDefaultDashBoard();
      }, 300);

    } else {
         this.getListOfDashBoards();
    }
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
    let existingdashboard =this.selectedDashBoardName;
    this.selectedDashBoardName = this._dashboardName;
    this.selectedDashBoard["dashboardName"] = this.selectedDashBoardName;
    this.rest.updateDashBoardNamed(this.selectedDashBoard)
      .subscribe((response: any) => {
        if (response.code == 4200) {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: response.message + '!',
          });
        this.inplace.deactivate();
        }
        if (response.code == 8010) {
          this.selectedDashBoardName = existingdashboard;
          this.selectedDashBoard["dashboardName"] = existingdashboard;
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.message + ' !',
          });
        }
      },err=>{
    this.inplace.deactivate();
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to Update !",
        });
      });
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
    this.inplace.deactivate();
    this.entered_name="";
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
    this.selectedDashBoard = event;
    this.selectedDashBoardName = this.selectedDashBoard.dashboardName;
    let params1 = {
      dashboardId: this.selectedDashBoard.id,
      dashboardName: this.selectedDashBoard.dashboardName,
    };
    this.router.navigate([], {
      relativeTo: this.activeRoute,
      queryParams: params1,
    });
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

  setDefaultDashboard(dashboard) {
    // this.selectedDashBoard = this.selectedDashBoard.defaultDashboard;
    dashboard["defaultDashboard"] = true;
    this.rest
      .updateDashBoardNamed(dashboard)
      .subscribe((response: any) => {
        this.getListOfDashBoards();
        this.messageService.add({severity: "success",summary: "Success",detail: "Updated Successfully !!"});
      },err=>{
        this.messageService.add({severity: "error",summary: "Error",detail: "Failed to Update !"});
      });
  }

  deletedashbord() {
    if (this.selectedDashBoard.defaultDashboard && this.dashbordlist.length > 1) {
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
    let confrmMessage=""
    this.dashbordlist.length > 1? confrmMessage="Are you sure that you want to proceed?": confrmMessage="Are you sure that you are deleting default dashboard?"
    this.confirmationService.confirm({
      message: confrmMessage,
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
      if(this.dashbordlist.length>=1){
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
    }else{
      this.loader.hide();
      this.router.navigate(["/pages/dashboard/create-dashboard"])
    }
    });
  }

  getDashBoardData(screenId) {
    this.loader.show();
    this.rest.getDashBoardItems(screenId).subscribe((data: any) => {
      this.dashboardData.metrics = data.metrics;
      this.dashboardData.widgets = data.widgets;
      this.loader.hide();
      this.dashboardData.widgets.forEach(element => {
        if(element.widget_type!= "Table" && element.widget_type!= "table"){
          element.widgetData.datasets[0]["backgroundColor"] = this.chartColors
          element.widgetData.datasets[0]["hoverBackgroundColor"] = this.charthoverColors
          // element.widgetData.datasets[0]["fillColor"] = this.chartColors
          // element.widgetData.datasets[0]["strokeColor"] = this.chartColors
          // element.widgetData.datasets[0]["highlightFill"] = this.chartColors
          // element.widgetData.datasets[0]["highlightStroke"] = this.chartColors
        }
        if(element.widget_type == "Bar"){
          element["chartOptions"].plugins.legend["display"]=false
        }
        
        if(element.childId == 2){
          element.chartOptions.plugins["tooltip"] = {
            callbacks: {
              label: (tooltipItem, data) => {
                let str
                if(tooltipItem.formattedValue.includes(',')){
                  str = tooltipItem.formattedValue.replace(',','')
                }else{
                  str = tooltipItem.formattedValue
                }
                return ( tooltipItem.label + ": " + Math.floor(Number(str) / 60) +"Min");
              },
            },
          }
        }
      });
      let array = {
        id: 5,
        widget_type: "doughnut",
        name: "Bot Execution Status",
        widgetData: {
          labels: ["Mac", "Windows", "Linux","Mac", "Windows", "Linux","Mac", "Windows", "Linux","Mac", "Windows", "Linux","Mac", "Windows", "Linux","Mac", "Windows", "Linux"],
          datasets : [
              {
                label: "My First dataset",
                // backgroundColor: this.poolColors(20),
                // // "hoverBackgroundColor": this.poolColors(10),
                // fillColor: this.poolColors(20), 
                // strokeColor: this.poolColors(20), 
                // highlightFill: this.poolColors(20),
                // highlightStroke: this.poolColors(20),
                backgroundColor: ['#3B55E6', '#EB4E36', '#43D29E', '#32CBD8', '#E8C63B', '#28C63B', '#38C63B', '#48C63B', '#58C63B', '#68C63B', '#78C63B'],
                  data : [28,48,40,19,96,87,66,97,92,85,28,48,40,19,96,87,66,97,92,85]
              }
          ]
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
        filterValue:[
          {filterId:"123",filtername:"department",value:"Engineering"},
          {filterId:"123",filtername:"department",value:"Engineering"}
      ],
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
      if(response.code == 8010){
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: response.message+' !',
        });
      }
    })
  }
}
