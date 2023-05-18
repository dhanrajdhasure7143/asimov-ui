import { Component, OnInit,Output,EventEmitter,ViewChild,Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem,ConfirmationService,MessageService  } from 'primeng/api';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { RestApiService } from '../../services/rest-api.service';
import { Inplace } from 'primeng/inplace';

@Component({
  selector: 'app-configure-dashboard',
  templateUrl: './configure-dashboard.component.html',
  styleUrls: ['./configure-dashboard.component.css']
})

export class ConfigureDashboardComponent implements OnInit {
  
  public panelSizes = [75, 25];
  isShowExpand: boolean = false;
  @Output() closeOverlay:any= new EventEmitter<boolean>();
  @ViewChild("inplace") inplace!: Inplace;
  items: MenuItem[];
  metrics_list: any[] = [];
  draggedProduct: any;
  defaultEmpty_metrics: any[] = [];
  widgets: any[] = [];
  defaultEmpty_widgets: any[] = [];
  public dynamicDashBoard: any = {
    dashboardName: '',
    widgets: [],
    metrics: [],
  }
  chartOptions: any;
  metricslist: any;
  widgetslist: any;
  metricsitem: any;
  addedMetrics: any[] = [];
  addedWidgets: any[] = [];
  _paramsData: any;
  draggedProduct1: any;
  isShow: boolean;
  isCreate:any
  screenId: any;
  isdefaultDashboard:any;
  searchText_metrics:any;
  searchText:any;
  chartColors:any[] = ["#065B93","#076AAB","#0879C4","#0A8EE6","#0A97F5","#0B8DE4","#149AF4","#2CA5F6","#44AFF7","#5CBAF9","#074169", "#085081","#095F9A","#0A6EB2","#0A7DCB"];
  execution_Status:any[] = ["#1DCD82","#FF4956","#2C97DE","#688090","#CE1919","#EC6D26"];

  constructor(private activeRoute: ActivatedRoute,
    private router: Router,
    private rest_api: RestApiService,
    private loader : LoaderService, 
    private confirmationService: ConfirmationService,
    private messageService: MessageService) {
    
    this.activeRoute.queryParams.subscribe((params: any) => {
      this._paramsData = params
      this.screenId=params.dashboardId
      this.dynamicDashBoard.dashboardName = params.dashboardName
      this.isCreate = this._paramsData.isCreate
      this.isdefaultDashboard = params.defaultDashboard
    })
  }

  ngOnInit(): void {
    this.loader.show();
    // this.items = [{label: 'Delete',command: () => {this.deletedashbord()}}]
    // this.loader.show();
    this.chartOptions = {
      "plugins": {
            "legend": {
          "position": "bottom",
          "display" : false
      }
  }
};
    this.getListOfWidgets();
    this.getListOfMetrics();

    this.defaultEmpty_metrics = [
      { metricId: "00", metric_name: "Drag And Drop", src: "process.svg", metricAdded: false },
      { metricId: "00", metric_name: "Drag And Drop", src: "round-settings.svg", metricAdded: false },
      { metricId: "00", metric_name: "Drag And Drop", src: "schedules.svg", metricAdded: false },
      { metricId: "00", metric_name: "Drag And Drop", src: "Thumbup.svg", metricAdded: false }
    ]
  }

  dragStart(item) {
    if (item.metricAdded == false) {
      this.draggedProduct = item;
    }
  }

  widgetDragStart(widget){
    if (widget.widgetAdded == false) {
      this.draggedProduct1 = widget;
    }
  }

  drop() {
    if (this.draggedProduct) {
      this.metrics_list.find(item => item.id == this.draggedProduct.id).metricAdded = true;
      this.addedMetrics.push(this.draggedProduct);
      if (this.defaultEmpty_metrics.find(item => item.metricAdded == false) != undefined)
        this.defaultEmpty_metrics.find(item => item.metricAdded == false).metricAdded = true
    }
  }
  dropWidget() {
    if (this.draggedProduct1) {
      this.widgetslist.find(item => item.id == this.draggedProduct1.id).widgetAdded = true;
      this.addedWidgets.push(this.draggedProduct1);
      if (this.defaultEmpty_widgets.find(item => item.widgetAdded == false) != undefined)
        this.defaultEmpty_widgets.find(item => item.widgetAdded == false).widgetAdded = true
    }
  }

  dragEnd() {
    this.draggedProduct = null;
  }
  widgetDragEnd() {
    this.draggedProduct1 = null;
  }

  onSelectMetric(metric, index) {
    if (metric.metricAdded == false) {
      this.metrics_list[index].metricAdded = true;
      this.addedMetrics.push(metric);
      // this.dynamicDashBoard.metrics.push(this.metrics_list[index]);
      if (this.defaultEmpty_metrics.find(item => item.metricAdded == false) != undefined)
        this.defaultEmpty_metrics.find(item => item.metricAdded == false).metricAdded = true
    }else{
      let itemId=metric.childId? metric.childId: metric.id
      let findIndex:number
      this.addedMetrics.forEach((item,i)=> {
       if(item.childId)
       if(item.childId== itemId)findIndex = i
       else{
         if(item.id== itemId)findIndex = i
       }
      })
   this.addedMetrics.splice(findIndex, 1);

      // this.addedMetrics.splice(this.addedMetrics.findIndex(item=> item.id == itemId), 1);
      this.metrics_list.find(item => item.id == itemId).metricAdded = false;
      if (this.defaultEmpty_metrics.find((item) => item.metricAdded == true))
      this.defaultEmpty_metrics.find((item) => item.metricAdded == true).metricAdded = false;
    }
  }


  onDeactivate(data, index, type) {
    if (type == 'metrics') {
      this.addedMetrics.splice(index, 1);
      // this.dynamicDashBoard.metrics.splice(index, 1);
      let itemId=data.childId? data.childId: data.id
      this.metrics_list.find(item => item.id == itemId).metricAdded = false;
      if (this.defaultEmpty_metrics.find((item) => item.metricAdded == true))
        this.defaultEmpty_metrics.find((item) => item.metricAdded == true).metricAdded = false;
    }
    if (type == 'widgets') {
      this.addedWidgets.splice(index, 1)
      let itemId2=data.childId? data.childId: data.id
      //this.dynamicDashBoard.widgets.splice(index, 1);
      this.widgetslist.find(item => item.id == itemId2).widgetAdded = false;
      // if (this.widgetslist.find((item) => item.widgetAdded == true))
      //   this.widgetslist.find((item) => item.widgetAdded == true).widgetAdded = false;
    }
  }


  addWidget(widget: any, index) {
    if (widget.widgetAdded == false) {
      this.widgetslist[index].widgetAdded = true;
      if (this.widgetslist.find((item: any) => item.id == widget.id) != undefined) {
        this.widgetslist.find((item: any) => item.id == widget.id).widgetAdded = true;
        let obj = {};
        // const widgetData = widgetOptions.widgets;
        // this.tabledata = this.addedWidgets[0].sampleData;

        // obj = widgetData.filter(_widget => _widget.id == widget.id)[0];
        if(widget["widget_type"] != "Table" && widget["widget_type"] != "table")
        widget.chartOptions.plugins.legend["display"]=true;
        this.addedWidgets.push(widget);
      }
    }else{
      let itemId=widget.childId? widget.childId: widget.id
         let findIndex:number
         this.addedWidgets.forEach((item,i)=> {
          if(item.childId)
          if(item.childId== itemId)findIndex = i
          else{
            if(item.id== itemId)findIndex = i
          }
         })
      this.addedWidgets.splice(findIndex, 1);
      this.widgetslist.find(item => item.id == itemId).widgetAdded = false;
    }
  }

  get defaultMetricsData(): any[] {
    return this.defaultEmpty_metrics.filter(item => item.metricAdded == false);
  }

  saveDashBoard() {
    let req_array: any = [];
    this.addedMetrics.forEach(item => {
      let req_body = {
        childId: item.id,
        screenId: this._paramsData.dashboardId,
        type: "metric",
        widgetType: "",
        name: item.name
      }
      req_array.push(req_body)
    })

    this.addedWidgets.forEach(element => {
      let req_body = {
        childId: element.id,
        screenId: Number(this._paramsData.dashboardId),
        type: "widget",
        widgetType: element.widget_type,
        name: element.name,
        department:element.department
      }
      req_array.push(req_body)
    });
    this.rest_api.SaveDashBoardData(req_array).subscribe(res => {
      this.loader.hide();
      this.router.navigate(['/pages/dashboard/dynamicdashboard'], { queryParams: this._paramsData })
    });
  }
  getListOfMetrics(): void {
    this.rest_api.getMetricsList().subscribe((data: any): void => {
      this.metrics_list = data.data;
      this.metrics_list = this.metrics_list.map((item: any, index: number) => {
        item["metricAdded"] = false;
        return item
      })
    })
  }

  getListOfWidgets() {
    this.rest_api.getWidgetsList().subscribe((data: any) => {
      this.widgetslist = data.widgetData;
      this.widgetslist = this.widgetslist.map((item: any, index: number) => {
        item["widgetAdded"] = false
        if(item["widget_type"] != "Table" && item["widget_type"] != "table"){
        if(item.id == 1){
          item.widgetData.datasets[0]["backgroundColor"] = this.execution_Status
        }else{
          item.widgetData.datasets[0]["backgroundColor"] = this.chartColors
        }
        // item.widgetData.datasets[0]["hoverBackgroundColor"] = this.charthoverColors
        if(item.widget_type != "Bar"){
              item["chartOptions"] = this.chartOptions
              item["chartOptions"].plugins.legend["labels"] ={
                generateLabels: function(chart) {
                  var data = chart.data;
                  const datasets = chart.data.datasets;
                  if (data.labels.length && data.datasets.length) {
                    return data.labels.map(function (label, i) {
                      var ds = data.datasets[0];
                      return {
                        text: label + ": " + ds.data[i],
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
        }else{
            item["chartOptions"] = {
              "plugins": {
                    "legend": {
                  "position": "bottom",
                  "display" : false
              },
              tooltip: {
                callbacks: {
                  label: (tooltipItem, data) => {
                    let str
                      if(tooltipItem.formattedValue.includes(',')){
                        str = tooltipItem.formattedValue.replace(',','')
                      }else{
                        str = tooltipItem.formattedValue
                      }
                      return (
                        tooltipItem.label + ": " + Math.floor(Number(str) / 60) +"Min"
                      );
                  },
                },
              },
          }
        }
      }
    }
        return item
      });
      if(this._paramsData.isCreate==0){
        this.getDashBoardData(this._paramsData.dashboardId)
      }else{
        this.loader.hide();
      }
    })
  }

  getDashBoardData(screenId){
    this.loader.show();
    this.rest_api.getDashBoardItems(screenId).subscribe((data:any)=>{
      this.dynamicDashBoard.metrics=data.metrics;
      this.dynamicDashBoard.widgets = data.widgets;
      this.addedMetrics = this.dynamicDashBoard.metrics
      this.addedMetrics = this.addedMetrics.map((item: any, index: number) => {
        item["metricAdded"] = true
        return item
      })

      this.loader.hide();
      this.addedMetrics.forEach((item: any) => {
        this.metrics_list.find((metric_item: any) => metric_item.id == item.childId).metricAdded = true;
        if (this.defaultEmpty_metrics.find(item => item.metricAdded == false) != undefined)
        this.defaultEmpty_metrics.find(item => item.metricAdded == false).metricAdded = true
      })
      this.addedWidgets = this.dynamicDashBoard.widgets
      this.addedWidgets.forEach((item: any) => {
        this.widgetslist.find((widget_item: any) => widget_item.id == item.childId).widgetAdded = true;
        if(item["widget_type"] != "Table" && item["widget_type"] != "table"){
          if(item.childId == 1){
            item.widgetData.datasets[0]["backgroundColor"] = this.execution_Status
          }else{
            item.widgetData.datasets[0]["backgroundColor"] = this.chartColors
          }
          if(item["widget_type"] != "Bar"){
            item["chartOptions"].plugins.legend["labels"] ={
              generateLabels: function(chart) {
                var data = chart.data;
                const datasets = chart.data.datasets;
                if (data.labels.length && data.datasets.length) {
                  return data.labels.map(function (label, i) {
                    var ds = data.datasets[0];
                    let value;
                  // if(item.childId == 2){
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
        if(item.childId == 2){
          item.chartOptions.plugins["tooltip"] = {
            callbacks: {
              label: (tooltipItem, data) => {
                let str
                if(tooltipItem.formattedValue.includes(',')){
                  str = tooltipItem.formattedValue.replace(',','')
                }else{
                  str = tooltipItem.formattedValue
                }
                return (
                  tooltipItem.label + ": " + Math.floor(Number(str) / 60) +"Min"
                );
              },
            },
          }
        }
      })
    });
  }

  Updatedconfiguration(){
    let req_array: any = [];
    this.loader.show();
    this.addedMetrics.forEach(item => {
      let req_body = {
       childId: item.childId? item.childId: item.id,
        screenId: Number(this._paramsData.dashboardId),
        type: "metric",
        widgetType: "",
        name: item.name
      }
      req_array.push(req_body)
    })

    this.addedWidgets.forEach(element => {
      let req_body = {
        childId: element.childId? element.childId: element.id,
        screenId: Number(this._paramsData.dashboardId),
        type: "widget",
        widgetType: element.widget_type,
        name: element.name,
        department:element.department
      }
      req_array.push(req_body)
    });

    this.rest_api.updateDashboardConfiguration(req_array,this._paramsData.dashboardId).subscribe(res => {
      this.loader.hide();
      this.router.navigate(['/pages/dashboard/dynamicdashboard'], { queryParams: this._paramsData })
    }
    )}
  
    deletedashbord(){
    
      if (this.isdefaultDashboard == "true") {
        this.confirmationService.confirm({
          message: "Change your default dashboard before deleting.",
          header: "Info",
          
          rejectVisible: false,
          acceptLabel: "Ok",
          accept: () => {},
          key: "positionDialog",
        });
        return;
      }
    this.confirmationService.confirm({
      message: "Do you really want to delete this dashboard? This process cannot be undone.",
      header: "Are you Sure?",
     
      accept: () => {
        this.loader.show();
        this.rest_api.getdeleteDashBoard(this._paramsData.dashboardId).subscribe(data=>{
          this.messageService.add({
            severity: "success",
            summary: "Success",
            
            detail: "Deleted Successfully !",
          });
        });
        this.loader.hide();
        this.router.navigate(['/pages/dashboard/dynamicdashboard'])
      },
      key: "positionDialog",
    });
    }

    canelUpdate(){
      this.router.navigate(['/pages/dashboard/dynamicdashboard'], { queryParams: this._paramsData })
    }

}
