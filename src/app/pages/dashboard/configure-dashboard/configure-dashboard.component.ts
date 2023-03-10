import { Component, OnInit,Output,EventEmitter,ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MenuItem,ConfirmationService  } from 'primeng/api';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { DataTransferService } from '../../services/data-transfer.service';
import { RestApiService } from '../../services/rest-api.service';
import { Inplace } from 'primeng/inplace';
import widgetOptions from './widgetdetails.json';

@Component({
  selector: 'app-configure-dashboard',
  templateUrl: './configure-dashboard.component.html',
  styleUrls: ['./configure-dashboard.component.css']
})
export class ConfigureDashboardComponent implements OnInit {
  public panelSizes = [70, 30];
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

  chartOptions: { legend: { position: string; }; };
  metricslist: any;
  widgetslist: any;
  tablelist: any;
  metricslistimg: { src: string; }[];
  result: any;
  metricsitem: any;
  addedMetrics: any[] = [];
  addedWidgets: any[] = [];
  _paramsData: any;
  draggedProduct1: any;
  isShow: boolean;
  isCreate:any
 // items: { label: string; }[];
  screenId: any;
  
 // childId: any;
  selectedDashBoard: any;
  

  constructor(private activeRoute: ActivatedRoute,
    private datatransfer: DataTransferService,
    private router: Router,
    private rest_api: RestApiService,
    private loader : LoaderService, private confirmationService: ConfirmationService) {
    this.activeRoute.queryParams.subscribe((params: any) => {
      this._paramsData = params
      this.screenId=params.dashboardId
     
      this.dynamicDashBoard.dashboardName = params.dashboardName
      this.isCreate = this._paramsData.isCreate

    })
  }
  ngOnInit(): void {
    this.items = [
      { 
        label: 'Delete',
        command: () => {
          this.deletedashbord();
      }
     },
    ]
    // this.loader.show();
    this.chartOptions = {
      legend: { position: "bottom" },

    };
    this.getListOfWidgets();
    this.getListOfMetrics();
    this.metricslistimg = [
      { src: "process.svg" },
      { src: "round-settings.svg" },
      { src: "schedules.svg" },
      { src: "Thumbup.svg" },
    ]

    // this.result = this.metricslist.map(metricslists => {
    //   this.metricsitem = this.metricslistimg.find(name => name)

    //   this.result.address = this.metricsitem
    //   ? this.metricsitem.address
    //   : null

    //   return this.result
    // })
    // console.log(this.result)

    // this.metrics_list=[
    //   {metricId:"01",metric_name:"Process Execution Rate",metric_desc:"Lists Recent activity in a single project, or in all projects",src:"process.svg",metricAdded:false,value:10},
    //   {metricId:"02",metric_name:"Automation Rate",metric_desc:"Lists Recent activity in a single project, or in all projects",src:"round-settings.svg",metricAdded:false,value:10},
    //   {metricId:"03",metric_name:"Schedules Failed",metric_desc:"Lists Recent activity in a single project, or in all projects",src:"schedules.svg",metricAdded:false,value:10},
    //   {metricId:"04",metric_name:"Pending Approvals",metric_desc:"Lists Recent activity in a single project, or in all projects",src:"Thumbup.svg",metricAdded:false,value:10},
    //   {metricId:"05",metric_name:"Tasks Overdue",metric_desc:"Lists Recent activity in a single project, or in all projects",src:"tasksoverdue.svg",metricAdded:false,value:10},
    //   {metricId:"06",metric_name:"Process On Hold",metric_desc:"Lists Recent activity in a single project, or in all projects",src:"processonhold.svg",metricAdded:false,value:10}
    // ]
    // this.widgets = [
    //   { widgetId: "01", widget_type: "DONUT_WITHOUT_LEGENDS", widget_title: 'Process Exectuin Rate', widget_description: 'Lists Recent activity in a single project, or in all projects', sampleData: [], chartSrc: 'chart1.png', chartOptions: {}, widgetAdded: false, api: 'none' },
    //   { widgetId: "02", widget_type: "HORIZANTAL_BAR_CHART", widget_title: 'Automation Rate', widget_description: 'Lists Recent activity in a single project, or in all projects', sampleData: [], chartSrc: 'chart2.png', chartOptions: {}, widgetAdded: false, api: 'none' },
    //   { widgetId: "03", widget_type: "VERTICAL_BAR_CHART", widget_title: 'Scheduled Fields', widget_description: 'Lists Recent activity in a single project, or in all projects', sampleData: [], chartSrc: 'chart3.png', chartOptions: {}, widgetAdded: false, api: 'none' },
    //   { widgetId: "04", widget_type: "TABLE", widget_title: 'Pending Approvals', widget_description: 'Lists Recent activity in a single project, or in all projects', sampleData: [], chartSrc: 'chart4.png', chartOptions: {}, widgetAdded: false, api: 'none' },
    //   { widgetId: "05", widget_type: "DONUT_WITH_LEGENDS_CHART", widget_title: 'Task Overdue', widget_description: 'Lists Recent activity in a single project, or in all projects', sampleData: [], chartSrc: 'chart5.png', chartOptions: {}, widgetAdded: false, api: 'none' },
    //   { widgetId: "06", widget_type: "LINE_CHART", widget_title: 'Process on hold', widget_description: 'Lists Recent activity in a single project, or in all projects', sampleData: [], chartSrc: 'chart6.png', chartOptions: {}, widgetAdded: false, api: 'none' },
    //   { widgetId: "07", widget_type: "DONUT_WITHOUT_LEGENDS", widget_title: 'Bot Status', widget_description: 'Lists Recent activity in a single project, or in all projects', sampleData: [], chartSrc: 'chart1.png', chartOptions: {}, widgetAdded: false, api: '/rpa-service/management/all-bots' },
    //   { widgetId: "08", widget_type: "DONUT_WITH_LEGENDS_CHART", widget_title: 'Environments', widget_description: 'Lists Recent activity in a single project, or in all projects', sampleData: [], chartSrc: 'chart1.png', chartOptions: {}, widgetAdded: false, api: '/rpa-service/agent/get-environments' },
    //   { widgetId: "09", widget_type: "DONUT_WITHOUT_LEGENDS", widget_title: 'Total Automations', widget_description: 'Lists Recent activity in a single project, or in all projects', sampleData: [], chartSrc: 'chart1.png', chartOptions: {}, widgetAdded: false, api: '/rpa-service/management/get-automations' },
    //   // {widgetId:"10", widget_type:"HORIZANTAL_BAR_CHART", widget_title:'Long Running Bots', widget_description:'Lists Recent activity in a single project, or in all projects', sampleData:[], chartSrc:'chart2.png', chartOptions:{}, widgetAdded:false, api:'get-bot-runtimes'},
    // ]
    // this.widgets[0].sampleData = {
    //   labels: ['A', 'B', 'C'],
    //   datasets: [
    //     {
    //       data: [300, 50, 100],
    //       backgroundColor: [
    //         "#FF6384",
    //         "#36A2EB",
    //         "#FFCE56"
    //       ],
    //       hoverBackgroundColor: [
    //         "#FF6384",
    //         "#36A2EB",
    //         "#FFCE56"
    //       ]
    //     }
    //   ]
    // };
    // this.widgets[1].sampleData = {
    //   labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    //   datasets: [
    //     {
    //       label: 'My First dataset',
    //       backgroundColor: '#42A5F5',
    //       data: [65, 59, 80, 81, 56, 55, 40]
    //     },
    //     {
    //       label: 'My Second dataset',
    //       backgroundColor: '#FFA726',
    //       data: [28, 48, 40, 19, 86, 27, 90]
    //     }
    //   ]
    // };

    // this.widgets[1].chartOptions = {
    //   indexAxis: 'y',
    //   plugins: {
    //     legend: {
    //       labels: {
    //         color: '#495057'
    //       }
    //     }
    //   },
    //   scales: {
    //     x: {
    //       ticks: {
    //         color: '#495057'
    //       },
    //       grid: {
    //         color: '#ebedef'
    //       }
    //     },
    //     y: {
    //       ticks: {
    //         color: '#495057'
    //       },
    //       grid: {
    //         color: '#ebedef'
    //       }
    //     }
    //   }
    // };
    // this.widgets[2].sampleData = {
    //   labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    //   datasets: [
    //     {
    //       label: 'My First dataset',
    //       backgroundColor: '#42A5F5',
    //       data: [65, 59, 80, 81, 56, 55, 40]
    //     },
    //     {
    //       label: 'My Second dataset',
    //       backgroundColor: '#FFA726',
    //       data: [28, 48, 40, 19, 86, 27, 90]
    //     }
    //   ]
    // };

    // this.widgets[4].sampleData = {
    //   labels: ['A', 'B', 'C'],
    //   datasets: [
    //     {
    //       data: [300, 50, 100],
    //       backgroundColor: [
    //         "#FF6384",
    //         "#36A2EB",
    //         "#FFCE56"
    //       ],
    //       hoverBackgroundColor: [
    //         "#FF6384",
    //         "#36A2EB",
    //         "#FFCE56"
    //       ]
    //     }
    //   ]
    // };
    // this.widgets[5].sampleData = {
    //   labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    //   datasets: [
    //     {
    //       label: 'First Dataset',
    //       data: [65, 59, 80, 81, 56, 55, 40]
    //     },
    //     {
    //       label: 'Second Dataset',
    //       data: [28, 48, 40, 19, 86, 27, 90]
    //     }
    //   ]
    // }
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
  // dragStart1(widget){
  //   if (widget.widgetAdded == false) {
  //     this.draggedProduct1 = widget;
  //   }
  // }

  drop() {
    if (this.draggedProduct) {
      this.metrics_list.find(item => item.id == this.draggedProduct.id).metricAdded = true;
      this.addedMetrics.push(this.draggedProduct);
      if (this.defaultEmpty_metrics.find(item => item.metricAdded == false) != undefined)
        this.defaultEmpty_metrics.find(item => item.metricAdded == false).metricAdded = true
    }
  }
  // drop1() {
  //   if (this.draggedProduct1) {
  //     this.widgetslist.find(item => item.id == this.draggedProduct1.id).widgetAdded = true;
  //     this.addedMetrics.push(this.draggedProduct1);
  //     if (this.widgetslist.find(item => item.widgetAdded == false) != undefined)
  //       this.widgetslist.find(item => item.widgetAdded == false).widgetAdded = true
  //   }
  // }

  dragEnd() {
    this.draggedProduct = null;
  }
  // dragEnd1() {
  //   this.draggedProduct1 = null;
  // }

  onSelectMetric(metric, index) {
    if (metric.metricAdded == false) {
      this.metrics_list[index].metricAdded = true;
      this.addedMetrics.push(metric);
      // this.dynamicDashBoard.metrics.push(this.metrics_list[index]);
      if (this.defaultEmpty_metrics.find(item => item.metricAdded == false) != undefined)
        this.defaultEmpty_metrics.find(item => item.metricAdded == false).metricAdded = true
    }
    console.log("addedMetrics", this.addedMetrics)
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
      //this.dynamicDashBoard.widgets.splice(index, 1);
      this.widgetslist.find(item => item.id == data.id).widgetAdded = false;``
      if (this.widgetslist.find((item) => item.widgetAdded == true))
        this.widgetslist.find((item) => item.id == data.id).widgetAdded = false;
    }
  }


  addWidget(widget: any, index) {
    console.log(this.addedWidgets)

    if (widget.widgetAdded == false) {
      this.widgetslist[index].widgetAdded = true;
      if (this.widgetslist.find((item: any) => item.id == widget.id) != undefined) {
        this.widgetslist.find((item: any) => item.id == widget.id).widgetAdded = true;
        let obj = {};
        const widgetData = widgetOptions.widgets;
        // this.tabledata = this.addedWidgets[0].sampleData;
        // console.log(this.tabledata);

        obj = widgetData.filter(_widget => _widget.id == widget.id)[0];

        this.addedWidgets.push(obj);

        this.dynamicDashBoard.widgets = this.addedWidgets;
        console.log(this.addedWidgets)

      }
    }
  }



  // getChartData(widget: any) {
  //   let methodType: any = ""
  //   if (widget.widget_title == 'Bot Status')
  //     methodType = "POST"
  //   else
  //     methodType = "GET"
  //   this.rest.getWidgetData(widget.api, methodType).subscribe((response: any) => {
  //     if (response.errorMessage == undefined) {
  //       if (widget.widget_title == 'Bot Status') {
  //         widget.sampleData = {
  //           datasets: [{
  //             data: [
  //               response.filter(bot => bot.botStatus == "Failure").length,
  //               response.filter(bot => bot.botStatus == "New").length,
  //               response.filter(bot => bot.botStatus == "Stopped" || bot.botStatus == "Stop").length,
  //               response.filter(bot => bot.botStatus == "Success").length,
  //             ],
  //             backgroundColor: [
  //               "#bc1d28",
  //               "#00a0e3",
  //               "#ff0000",
  //               "#62c849"
  //             ],
  //           }],
  //           labels: ["Failure", "New", "Stopped", "Success"],
  //         }
  //         this.dynamicDashBoard.widgets.push(widget);
  //         console.log(this.dynamicDashBoard);
  //       }
  //       else if (widget.widget_title == 'Environments') {
  //         widget.sampleData = {
  //           labels: ["Mac", "Windows", "Linux"],
  //           datasets: [{
  //             data: [
  //               response.filter(Environment => Environment.environmentType == "Mac").length,
  //               response.filter(Environment => Environment.environmentType == "Windows").length,
  //               response.filter(Environment => Environment.environmentType == "Linux").length,


  //             ],
  //             backgroundColor: [
  //               "#c2b280",
  //               "#838381",
  //               "#be0032"

  //             ],
  //           }]
  //         }
  //         console.log(response)
  //         this.dynamicDashBoard.widgets.push(widget);
  //       }

  //       else if (widget.widget_title == 'Automation') {
  //         widget.sampleData = {
  //           labels: ["Approved Processes", "Bots"],
  //           datasets: [{
  //             data: [
  //               response.filter(automation => automation.automationStatus == "Approved Processes").length,
  //               response.filter(automation => automation.automationStatu == "Bots").length,
  //             ],
  //             backgroundColor: [
  //               "#ce3779",
  //               "#575fcd"


  //             ],
  //           }]
  //         }
  //         console.log(response)
  //         this.dynamicDashBoard.widgets.push(widget);
  //       }
  //       //  else if(widget.widget_title=='Long Running Bots')
  //       //  {
  //       //    widget.sampleData={
  //       //      labels:["Approved Processes", "Bots"],
  //       //      datasets:[{
  //       //        data:[
  //       //          response.filter(bots=>bots.longrunningbotstype=="Approved Processes").length,
  //       //         response.filter(Environment=>Environment.environmentType=="Bots").length,
  //       //        ],
  //       //        backgroundColor:[
  //       //          "#ce3779",
  //       //          "#575fcd"


  //       //        ],
  //       //      }]
  //       //    } 
  //       //    console.log(response)
  //       //    this.dynamicDashBoard.widgets.push(widget);
  //       // }

  //     }
  //   })
  // }


  get defaultMetricsData(): any[] {
    return this.defaultEmpty_metrics.filter(item => item.metricAdded == false);
  }

  saveDashBoard() {
    let req_array: any = [];
    //this.loader.show();
    console.log(this.addedMetrics);
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

    this.dynamicDashBoard.widgets.forEach(element => {
      let req_body = {
        childId: element.id,
        screenId: Number(this._paramsData.dashboardId),
        type: "widget",
        widgetType: element.widget_type,
        name: element.name
      }
      req_array.push(req_body)
    });
    console.log(this.dynamicDashBoard, req_array)

    this.rest_api.SaveDashBoardData(req_array).subscribe(res => {
      console.log(res)
      this.loader.hide();
      this.router.navigate(['/pages/dashboard/dynamicdashboard'], { queryParams: this._paramsData })
    })

    // this.datatransfer.dynamicscreenObservable.subscribe((response:any)=>{
    // if(this.dynamicDashBoard.dashboardId==undefined)
    // {
    //   this.dynamicDashBoard.dashboardId=(new Date()).getTime();
    //   if(!Array.isArray(response))
    //     response=[this.dynamicDashBoard];
    //   else
    //   {
    //     response.push(this.dynamicDashBoard)
    //   }
    //   this.datatransfer.setdynamicscreen(JSON.stringify(response));
    //   this.router.navigate(['/pages/dashboard/dynamicdashboard'])
    // }
    // else
    // {
    //   if(typeof(response)=="string")
    //   {
    //     response=JSON.parse(response)
    //   }
    //   let index=response.findIndex((item:any)=>item.dashboardId==this.dynamicDashBoard.dashboardId);
    //   response[index]=this.dynamicDashBoard;
    //   this.datatransfer.setdynamicscreen(JSON.stringify(response)); 
    //   this.router.navigate(['/pages/dashboard/dynamicdashboard'])
    // }
    // console.log(this.addedMetrics);
    // this.dynamicDashBoard.metrics = this.addedMetrics;

    // this.datatransfer.setdynamicscreen(this.dynamicDashBoard);
    // this.router.navigate(['/pages/dashboard/dynamicdashboard'], { queryParams: this._paramsData })
    //})
  }
  getListOfMetrics() {
    this.rest_api.getMetricsList().subscribe((data: any) => {
      this.metrics_list = data.data;
      this.metrics_list = this.metrics_list.map((item: any, index: number) => {
        item["metricAdded"] = false
        item["src"] = "process.svg"
        return item
      })
      if(this._paramsData.isCreate==0){
        this.getDashBoardData(this._paramsData.dashboardId)
      }else{
        this.loader.hide();
      }
      this.datatransfer.dynamicscreenObservable.subscribe((res: any) => {
        console.log(res.widgets)
        if (res.metrics) {
          this.dynamicDashBoard = res;
          // this.addedMetrics = this.dynamicDashBoard.metrics
          // res.metrics.forEach((item: any) => {
          //   this.metrics_list.find((metric_item: any) => metric_item.id == item.id).metricAdded = true;
          //   // this.defaultEmpty_metrics.find((metric_item:any)=>metric_item.id==item.id).metricAdded=true;
          // })


        }
      })
      console.log("this.metrics_list", this.metrics_list)
    })
  }
  getListOfWidgets() {
    this.rest_api.getWidgetsList().subscribe((data: any) => {
      this.widgetslist = data.data;
      this.widgetslist = this.widgetslist.map((item: any, index: number) => {
        item["widgetAdded"] = false
        item["chartSrc"] = "chart4.png'"
        return item
      })
      this.widgetslist.push({
        "chartSrc":
          "chart4.png'",
        "description"
          :
          "Display the Table Data",
        "id"
          :
          99,
        "name"
          :
          "Bot Execution Status In Table",
        "widgetAdded"
          :
          false
      })
      this.datatransfer.dynamicscreenObservable.subscribe((res: any) => {
        console.log(res.metrics)
        if (res.widgets) {
          this.dynamicDashBoard = res;
          this.addedWidgets = this.dynamicDashBoard.widgets
          // res.widgets.forEach((item: any) => {
          //   this.widgets.find((widget_item: any) => widget_item.id === item.id).widgetAdded = true;

          //   // this.defaultEmpty_metrics.find((metric_item:any)=>metric_item.id==item.id).metricAdded=true;
          // })
          res.widgets.forEach((item: any) => {
            this.widgetslist.find((widget_item: any) => widget_item.id == item.id).widgetAdded = true;
          })
        }
      })
      console.log("this.widgetslist", this.widgetslist)
    })
  }

  addtable(){
    console.log("click successful")
    this.isShow = !this.isShow; 
  }

  getDashBoardData(screenId){
    this.rest_api.getDashBoardItems(screenId).subscribe((data:any)=>{
      console.log(data)
      this.dynamicDashBoard.metrics=data.metrics
      this.addedMetrics = this.dynamicDashBoard.metrics

      this.addedMetrics = this.addedMetrics.map((item: any, index: number) => {
        item["metricAdded"] = true
        return item
      })
      this.addedMetrics.forEach((item: any) => {
        this.metrics_list.find((metric_item: any) => metric_item.id == item.childId).metricAdded = true;
        if (this.defaultEmpty_metrics.find(item => item.metricAdded == false) != undefined)
        this.defaultEmpty_metrics.find(item => item.metricAdded == false).metricAdded = true
      })

      this.loader.hide();
    });
  }
  minimizeFullScreen(){
    this.isShowExpand = false;
   
    this.panelSizes = [70, 30];
  }
  expandFullScreen(){
    this.isShowExpand = true;
   
    this.panelSizes = [30, 70];
  }
  closeSplitOverlay(){
    this.minimizeFullScreen();
   this.closeOverlay.emit(false)
  }
  Updatedconfiguration(){
    let req_array: any = [];
    console.log(this.addedMetrics)
    this.loader.show();
    this.addedMetrics.forEach(item => {
      let req_body = {
       childId: item.childId? item.childId: item.id,
        screenId: this._paramsData.dashboardId,
        type: "metric",
        widgetType: "",
        name: item.name
      }
      req_array.push(req_body)
    })
    console.log("this.addedMetrics,req_array")
    this.rest_api.updateDashboardConfiguration(req_array,this._paramsData.dashboardId).subscribe(res => {
      console.log(res)
      this.loader.hide();
      this.router.navigate(['/pages/dashboard/dynamicdashboard'], { queryParams: this._paramsData })
    }
    )}
  
    deletedashbord(){
      console.log("on delete")
    this.confirmationService.confirm({
      message: "Are you sure that you want to proceed?",
      header: "Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.loader.show();
        this.rest_api.getdeleteDashBoard(this._paramsData.dashboardId).subscribe(data=>{
          this.inplace.deactivate();
          this.loader.hide();
         
        });
      },
      key: "positionDialog",
    });
  
    }

}
