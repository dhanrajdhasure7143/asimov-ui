import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MenuItem, SelectItem, PrimeNGConfig, ConfirmationService} from "primeng/api";
import { RestApiService } from "src/app/pages/services/rest-api.service";
import { LoaderService } from "src/app/services/loader/loader.service";
import { Inplace } from "primeng/inplace";
import { FormGroup, FormControl } from "@angular/forms";
import { Chart, ChartDataset, ChartOptions, TooltipItem } from "chart.js";
import { ToasterService } from "src/app/shared/service/toaster.service";
import { toastMessages } from "src/app/shared/model/toast_messages";


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
  chartColors:any[] = ["#065B93","#076AAB","#0879C4","#0A8EE6","#0A97F5","#0B8DE4","#149AF4","#2CA5F6","#44AFF7","#5CBAF9","#074169", "#085081","#095F9A","#0A6EB2","#0A7DCB"];
  execution_Status:any[] = ["#1DCD82","#FF4956","#2C97DE","#688090","#CE1919","#EC6D26"];
  charthoverColors:any[]=["#098de6","#9c81e9","#eb6dcb","#ff7d56","#ffa600","#b77322","#66aa00","#b82e2e","#316395","#dc3912","#329262", "#3B3EAC","#16D620","#AAAA11","#2D6677"];
  // Success  #27A871
  // Running  #F2D22B
  // New  #098BE3
  // Failure  #DB3B21
  // Stopped  #FF0131
  // Killed  #AD2626
  interval:any;
  processInfo: any[] = [];
  showTableData: boolean = true;
  widgetClass: any = 'graph1';
  public userRoles: any;
  public name: any;
  email: any;
  showWidgetValue: boolean = false;
  projects_list: any[]=[];
  selected_project:any;
  process_name: any;
  roiProcessName: any;
  correlationID: any;
  showOverlay: boolean;
  isfromDashBoard:boolean = false

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private primengConfig: PrimeNGConfig,
    private rest: RestApiService,
    private loader: LoaderService,
    private confirmationService: ConfirmationService,
    private toastService: ToasterService,
    private toastMessages: toastMessages

  ) {
    this.activeRoute.queryParams.subscribe((res) => {
      this._paramsData = res;
      // this.selectedDashBoardName= this._paramsData.dashboardName
    });
  }

  ngOnInit(): void {
    this.getTable();
    this.getDashBoardData(this._paramsData.dashboardId,true);
    this.primengConfig.ripple = true;
    // this.menuItems = [
    //   {label: "Delete",command: () => { this.deletedashbord()}},
    // ];
    if (this._paramsData.dashboardId === undefined) {
      this.changeToDefaultDashBoard();

    } else {
      this.getListOfDashBoards();
    }
    this.getInterval();
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
        department: formDataValue.department
      },
    ];
    this.loader.show();
    this.rest.updateWidgetInDashboard(req_body).subscribe(
      (res:any) => {
        this.loader.hide()
        this.toastService.showSuccess('Widget','update');
        // this.dashboardData.widgets[index].filterOptions = [
        //   ...this.dashboardData.widgets[index].filterOptions.map(
        //     (item: any) => {
        //       item.value = formDataValue[item.name];
        //       return item;
        //     }
        //   ),
        // ];
        if(res.data[0].childId == 1){
          res.data[0].widgetData.datasets[0]["backgroundColor"] = this.execution_Status

        }else{
          res.data[0].widgetData.datasets[0]["backgroundColor"] = this.chartColors
        }
        // res.data[0].widgetData.datasets[0]["borderWidth"] = 2
        // borderColor: 'white', // color of the stroke
        // var options = {
        //     cutoutPercentage: 80, // adjust the cutout to show the stroke
        //     // additional options for the chart
        // };
        // borderWidth: 2 
        if(res.data[0].widget_type != "Bar"){
          res.data[0]["chartOptions"].onClick = this.handlePieChartClick.bind(this,res.data[0].widgetData.labels,res.data[0].childId)
          res.data[0]["chartOptions"].plugins.legend["labels"] ={
            generateLabels: function(chart) {
              var data = chart.data;
              const datasets = chart.data.datasets;
              if (data.labels.length && data.datasets.length) {
                return data.labels.map(function (label, i) {
                  var ds = data.datasets[0];
                  // let value;
                  // if(res.data[0].childId == 2){
                  //   value = Math.floor(Number(ds.data[i]) / 60) +"Min"
                  // }else value = ds.data[i];
                  let total = ds['data'].reduce((accumulator, currentValue) => accumulator + currentValue);
                  return {
                    text: label + ": " + ((ds.data[i] / total) * 100).toFixed(2)+ '%',
                    fillStyle: datasets[0].backgroundColor[i],
                    strokeStyle: "white",
                    lineWidth: 8,
                    borderColor: "white",
                    borderRadius: 5,
                    usePointStyle: true,
                    index: i,
                  };
                });
              }
              return [];
            }

          }
        }
        if(res.data[0].childId == 2){
          res.data[0].chartOptions.plugins["tooltip"] = {
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
        this.dashboardData.widgets[index] = {
          ...this.dashboardData.widgets[index],
          ...res.data[0],
        };
        if(this.dashboardData.widgets[index].widget_type == "Bar"){
          this.dashboardData.widgets[index]["chartOptions"].plugins.legend["display"]=false
        }
        this.configuration_id = null;
      },
      (err) => {
        this.toastService.showError(this.toastMessages.updateError);
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
          this.toastService.showSuccess(existingdashboard,'update');
          this.replaceURL();
          this.inplace.deactivate();
        }
        if (response.code == 8010) {
          this.selectedDashBoardName = existingdashboard;
          this.selectedDashBoard["dashboardName"] = existingdashboard;
          this.toastService.showError(response.message+'!');
        }
      },err=>{
        this.inplace.deactivate();
        this.toastService.showError(this.toastMessages.updateError);
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
    this.replaceURL();
    this.getDashBoardData(this.selectedDashBoard.id,true);
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
    this.rest.updateDashBoardNamed(dashboard).subscribe((response: any) => {
      this.getListOfDashBoards();
      this.toastService.showSuccess('Dashboard','update');
    },err=>{
      this.toastService.showError(this.toastMessages.updateError);
    });
  }

  deletedashbord() {
    if (this.selectedDashBoard.defaultDashboard && this.dashbordlist.length > 1) {
      this.confirmationService.confirm({
        message: "Change your default dashboard before deleting it.",
        header: "Info",

        rejectVisible: false,
        acceptLabel: "Ok",
        accept: () => {},
        key: "positionDialog2",
      });
      return;
    }
    let confrmMessage=""
    this.dashbordlist.length > 1? confrmMessage="Do you want to delete this dashboard? This can't be undo." : confrmMessage="Are you sure that you are deleting the default dashboard?"
    this.confirmationService.confirm({
      message: confrmMessage,
      header: "Are you sure?",

      accept: () => {
        this.loader.show();
        let dashboardName = this.selectedDashBoard.dashboardName
        this.rest.getdeleteDashBoard(this.selectedDashBoard.id)
          .subscribe((data) => {
            this.toastService.showSuccess(dashboardName,'delete');
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
        this.replaceURL();
        setTimeout(() => {
          this.selecteddashboard = this.selectedDashBoard
        }, 100);
        this.selectedDashBoardName = this.selectedDashBoard.dashboardName
        this.getDashBoardData(this.selectedDashBoard.id,true);
      }else{
        this.loader.hide();
        this.router.navigate(["/pages/dashboard/create-dashboard"])
      }
    });
  }

  getDashBoardData(screenId,isLoader) {
    isLoader?this.loader.show():this.loader.hide();
    this.rest.getDashBoardItems(screenId).subscribe((data: any) => {
      this.dashboardData.metrics = data.metrics;
      this.dashboardData.widgets = data.widgets;
      this.loader.hide();
      this.dashboardData.widgets.forEach(element => {
        if(element.widget_type!= "Table" && element.widget_type!= "table" && element.widget_type != "label"){
          element["chartOptions"].onClick = this.handlePieChartClick.bind(this,element.widgetData.labels,element.childId)
          if(element.childId == 1){
            element.widgetData.datasets[0]["backgroundColor"] = this.execution_Status
          }else{
            element.widgetData.datasets[0]["backgroundColor"] = this.chartColors
          }
          if(element.widget_type != "Bar"){
            element["chartOptions"].plugins.legend["labels"] ={
              generateLabels: function(chart) {
                var data = chart.data;
                const datasets = chart.data.datasets;
                if (data.labels.length && data.datasets.length) {
                  return data.labels.map(function (label, i) {
                    var ds = data.datasets[0];
                    // let value;
                    // if(element.childId == 2){
                    //   value = Math.floor(Number(ds.data[i]) / 60) +"Min"
                    // }else value = ds.data[i];
                    let total = ds['data'].reduce((accumulator, currentValue) => accumulator + currentValue);
                    return {
                      text: label + ": " + ((ds.data[i] / total) * 100).toFixed(2)+ '%',
                      fillStyle: datasets[0].backgroundColor[i],
                      strokeStyle: "white",
                      lineWidth: 8,
                      borderColor: "white",
                      borderRadius: 5,
                      usePointStyle: true,
                      index: i,
                    };
                  });
                }
                return [];
              }

            }
          }
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
          labels: ["Mac", "Windows", "Linux","Mac", "Windows", "Linux"],
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
              data : [28,48,40,19,96,87]
            }
          ]
        },
        chartOptions: {
          plugins: {
            legend: {
              display: "true",
              position: "right",
              labels: {
                generateLabels: function(chart) {
                  var data = chart.data;
                  const datasets = chart.data.datasets;
                  if (data.labels.length && data.datasets.length) {
                    return data.labels.map(function(label, i) {
                      var ds = data.datasets[0];
                      return {
                        text: label + ': ' + ds.data[i],
                        fillStyle: datasets[0].backgroundColor[i],
                        strokeStyle: "white",
                        lineWidth: 8,
                        borderColor:"white",
                        borderRadius:8,
                        usePointStyle: true,
                        // borderWidth: 2,
                        // hidden: isNaN(ds.data[i]) || meta.data[i].hidden,
                        index: i,
                      };
                    });
                  }
                  return [];
                },
                // generateLabels: (chart) => {
                //   const datasets = chart.data.datasets;
                //   return datasets[0].data.map((data, i) => ({
                //     text: `${chart.data.labels[i]} ${data}`,
                //     fillStyle: datasets[0].backgroundColor[i],
                //   }))
                // }
              },
              onClick: function(evt, legendItem) {
                var chart = this.chart;
                var index = legendItem.index;
                var meta = chart.getDatasetMeta(0);
                var arc = meta.data[index];
                arc.hidden = !arc.hidden;
                chart.update();
              }
            },
            //   beforeInit: function(chart, options) {
            //     chart.legendCallback = function(chart) {
            //         var text = [];
            //         text.push('<ul class="' + chart.id + '-legend">');
            //         for (var i = 0; i < chart.data.labels.length; i++) {
            //             text.push('<li>');
            //             // text.push('<span style="background-color:' + chart.data.datasets[0].backgroundColor[i] + '"></span>');
            //             text.push(chart.data.labels[i] + ': ' + chart.data.datasets[0].data[i]);
            //             text.push('</li>');
            //         }
            //         text.push('</ul>');
            //         return text.join('');
            //     };
            // },
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
      message: "You are trying to remove the widget from the dashboard.",
      header: "Are you sure?",
      rejectVisible: false,
      acceptLabel: "Ok",
      accept: () => {
        const id6Exists = this.dashboardData.widgets.some(obj => obj.childId === 6);
        const id5Exists = this.dashboardData.widgets.some(obj => obj.childId === 5);
        let successPopupShown = false;
        if (id6Exists && id5Exists) {
          this.deleteWidgetfromDashBoard(this.selected_widget, () => {
            this.showSuccessPopup(successPopupShown);
          });
        } else if(id6Exists || id5Exists) {
          let deleteList = [this.selected_widget, ...this.dashboardData.widgets.filter(item => item.childId == 7)];
          let deleteCount = 0;
          deleteList.forEach(each=>{
            this.deleteWidgetfromDashBoard(each, () => {
              deleteCount++;
              if (deleteCount === deleteList.length) {
                this.showSuccessPopup(successPopupShown);
              }
            });
          });
        }else{
          this.deleteWidgetfromDashBoard(this.selected_widget, () => {
            this.showSuccessPopup(successPopupShown);
          });
        }
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
        // this.toastService.showSuccess( '','create');
        this.router.navigate(["pages/dashboard/configure-dashboard"], { queryParams: {dashboardId:res_data.id,dashboardName:res_data.dashboardName,isCreate:1}});
      }
      if(response.code == 8010){
        this.toastService.showError(response.message+'!');
      }
    })
  }

  onOpenConfigOptoons(widget){
    if(widget.widget_type == "label" && widget.extraWidget){
      this.items = [
        // {label: "Remove",command: (e) => {this.onRmoveWidget();}},
        {label: "Configure",command: (e) => {this.viewProcessInfo()}},
      ];
    }else if(widget.widget_type =="Table" || (widget.widget_type == "label"  && !widget.extraWidget)){
      this.items = [
        {label: "Remove",command: (e) => {this.onRmoveWidget();}},
      ];
    }else{
      this.items = [
        {label: "Remove",command: (e) => {this.onRmoveWidget();}},
        {label: "Configure",command: (e) => {this.toggleConfigure(e)}},
      ];
    }
  }

  getInterval(){
    this.interval=setInterval(()=>{
      this.getListOfDashBoards();
      this.getDashBoardData(this._paramsData.dashboardId,false);
    },45000)
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  handlePieChartClick(labels,widgetId,data,chartElements): void {
    if (chartElements && chartElements.length > 0) {
      const clickedElementIndex = chartElements[0].index;
      // widgetId == 1 its shold navigate to RPA home
      if(widgetId == 1){
        this.router.navigate(["/pages/rpautomation/home"], {
          queryParams: {status: labels[clickedElementIndex]},
        });
      }
    }
  }
  spaceNotAllow(event: any) {
    if (event.target.selectionStart === 0 && event.code === "Space") {
      event.preventDefault();
    }
  }


  getTable(){
    this.rest.getCostandTimeTable().subscribe((response:any) => {
      this.processInfo = response.processInfo
    })
  }


  getDynamicClasses(widget: any) {
    return {
      'col-md-6': widget.class === undefined,
      [widget.class]: widget.class !== undefined
    };
  }

  showTable(){
    console.log(this.showTableData);
    this.showTableData = !this.showTableData;
    this.widgetClass = this.showTableData ? 'graph1' : 'graph';
  }

  getDynamicClasses_one(widget: any) {
    return {
      'graph': widget.class === undefined,
      [this.widgetClass] : widget.class !== undefined
    };
  }
  isLabelWidget(widget: any): boolean {
    return widget.widget_type === 'label';
  }

  deleteWidgetfromDashBoard(item, callback: () => void = null) {
    this.rest.onRemoveSelectedWidget(item.id).subscribe(
      (res) => {
        this.dashboardData.widgets.forEach((element, index) => {
          if (item.childId == element.childId) {
            this.dashboardData.widgets.splice(index, 1);
            if(callback){
              callback();
            }
          }
        });
      },
      (err) => {
        this.toastService.showError(this.toastMessages.deleteError);
      }
    );
  }

  replaceURL(){
    let params1 = {
      dashboardId: this.selectedDashBoard.id,
      dashboardName: this.selectedDashBoard.dashboardName,
    };
    this.router.navigate([], {relativeTo: this.activeRoute,queryParams: params1});
  }

  showSuccessPopup(successPopupShown: boolean) {
    if (!successPopupShown) {
      this.toastService.showSuccess('Widget', 'delete');
      successPopupShown = true;
    }
  }

  cancelProject() {
    this.showWidgetValue = false;
    this.configuration_id = null;
    this.showOverlay = false;
  }

    viewProcessInfo() {
      this.showOverlay = true;
      this.isfromDashBoard = true; 
    }

    closeOverlay(event) {
      console.log(event)
      // this.processInfo = event;
      this.showOverlay = false;
    }

    onCustomEvent(event){
      console.log(event)
      this.showOverlay = event
      this.getDashBoardData(this._paramsData.dashboardId,true);
      this.getTable();
    }
}
