import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTransferService } from '../../services/data-transfer.service';

@Component({
  selector: 'app-configure-dashboard',
  templateUrl: './configure-dashboard.component.html',
  styleUrls: ['./configure-dashboard.component.css']
})
export class ConfigureDashboardComponent implements OnInit {
  metrics_list:any[]=[];
  draggedProduct:any;
  defaultEmpty_metrics:any[]=[];
  widgets:any[]=[];
  defaultEmpty_widgets:any[]=[];
  public dynamicDashBoard:any={
    dashboardName:'',
    widgets:[],
    metrics:[]
  }
  constructor(private activeRoute:ActivatedRoute, private datatransfer:DataTransferService, private router:Router) { }
  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe((params:any)=>{
      this.dynamicDashBoard.dashboardName=params.dashboardName
    })
    this.metrics_list=[
      {metricId:"01",metric_name:"Process Execution Rate",metric_desc:"Lists Recent activity in a single project, or in all projects",src:"process.svg",metricAdded:false,value:10},
      {metricId:"02",metric_name:"Automation Rate",metric_desc:"Lists Recent activity in a single project, or in all projects",src:"round-settings.svg",metricAdded:false,value:10},
      {metricId:"03",metric_name:"Schedules Failed",metric_desc:"Lists Recent activity in a single project, or in all projects",src:"schedules.svg",metricAdded:false,value:10},
      {metricId:"04",metric_name:"Pending Approvals",metric_desc:"Lists Recent activity in a single project, or in all projects",src:"Thumbup.svg",metricAdded:false,value:10},
      {metricId:"05",metric_name:"Tasks Overdue",metric_desc:"Lists Recent activity in a single project, or in all projects",src:"tasksoverdue.svg",metricAdded:false,value:10},
      {metricId:"06",metric_name:"Process On Hold",metric_desc:"Lists Recent activity in a single project, or in all projects",src:"processonhold.svg",metricAdded:false,value:10}
    ]
    this.widgets=[
      {widgetId:"01", widget_type:"DONUT_WITHOUT_LEGENDS", widget_title:'Process Exectuin Rate', widget_description:'Lists Recent activity in a single project, or in all projects', sampleData:[], chartSrc:'chart1.png', chartOptions:{}, widgetAdded:false},
      {widgetId:"02",  widget_type:"HORIZANTAL_BAR_CHART", widget_title:'Automation Rate', widget_description:'Lists Recent activity in a single project, or in all projects', sampleData:[], chartSrc:'chart2.png',chartOptions:{}, widgetAdded:false},
      {widgetId:"03", widget_type:"VERTICAL_BAR_CHART", widget_title:'Scheduled Fields', widget_description:'Lists Recent activity in a single project, or in all projects', sampleData:[], chartSrc:'chart3.png',chartOptions:{}, widgetAdded:false},
      {widgetId:"04", widget_type:"TABLE", widget_title:'Pending Approvals', widget_description:'Lists Recent activity in a single project, or in all projects', sampleData:[], chartSrc:'chart4.png',chartOptions:{}, widgetAdded:false},
      {widgetId:"05", widget_type:"DONUT_WITH_LEGENDS_CHART",   widget_title:'Task Overdue', widget_description:'Lists Recent activity in a single project, or in all projects', sampleData:[], chartSrc:'chart5.png',chartOptions:{}, widgetAdded:false},
      {widgetId:"06" , widget_type:"LINE_CHART" ,widget_title:'Process on hold', widget_description:'Lists Recent activity in a single project, or in all projects', sampleData:[], chartSrc:'chart6.png',chartOptions:{}, widgetAdded:false},
    ]
    this.widgets[0].sampleData={
      labels: ['A','B','C'],
      datasets: [
          {
              data: [300, 50, 100],
              backgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56"
              ],
              hoverBackgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56"
              ]
          }
      ]
  };
    this.widgets[1].sampleData={
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
          {
              label: 'My First dataset',
              backgroundColor: '#42A5F5',
              data: [65, 59, 80, 81, 56, 55, 40]
          },
          {
              label: 'My Second dataset',
              backgroundColor: '#FFA726',
              data: [28, 48, 40, 19, 86, 27, 90]
          }
      ]
  };

  this.widgets[1].chartOptions= {
    indexAxis: 'y',
    plugins: {
        legend: {
            labels: {
                color: '#495057'
            }
        }
    },
    scales: {
        x: {
            ticks: {
                color: '#495057'
            },
            grid: {
                color: '#ebedef'
            }
        },
        y: {
            ticks: {
                color: '#495057'
            },
            grid: {
                color: '#ebedef'
            }
        }
    }
};
  this.widgets[2].sampleData={
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'My First dataset',
            backgroundColor: '#42A5F5',
            data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
            label: 'My Second dataset',
            backgroundColor: '#FFA726',
            data: [28, 48, 40, 19, 86, 27, 90]
        }
    ]
};

  this.widgets[4].sampleData={
    labels: ['A','B','C'],
    datasets: [
        {
            data: [300, 50, 100],
            backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ],
            hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ]
        }
    ]
};
    this.widgets[5].sampleData={
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
          {
              label: 'First Dataset',
              data: [65, 59, 80, 81, 56, 55, 40]
          },
          {
              label: 'Second Dataset',
              data: [28, 48, 40, 19, 86, 27, 90]
          }
      ]
  }
    this.defaultEmpty_metrics=[
      {metricId:"00",metric_name:"Drag And Drop",src:"process.svg",metricAdded:false},
      {metricId:"00",metric_name:"Drag And Drop",src:"round-settings.svg",metricAdded:false},
      {metricId:"00",metric_name:"Drag And Drop",src:"schedules.svg",metricAdded:false},
      {metricId:"00",metric_name:"Drag And Drop",src:"Thumbup.svg",metricAdded:false}
   ]

  }

  dragStart(item) {
    if(item.metricAdded== false){
    this.draggedProduct = item;
    }
}

drop() {
    if (this.draggedProduct) {
        this.metrics_list.find(item=>item.metricId==this.draggedProduct.metricId).metricAdded=true;
        this.dynamicDashBoard.metrics.push(this.draggedProduct);
        if(this.defaultEmpty_metrics.find(item=>item.metricAdded == false)!=undefined)
          this.defaultEmpty_metrics.find(item=>item.metricAdded == false).metricAdded=true
    }
  }

dragEnd() {
    this.draggedProduct = null;
}

  onSelectMetric(event,index){
      if(event.metricAdded== false){
        this.metrics_list[index].metricAdded=true;
        this.dynamicDashBoard.metrics.push(this.metrics_list[index]);
        if(this.defaultEmpty_metrics.find(item=>item.metricAdded == false)!=undefined)
          this.defaultEmpty_metrics.find(item=>item.metricAdded == false).metricAdded=true
    }
  }

  onEnter(){
  }

  onDeactivate(data,index, type){
    if(type=='metrics')
    {
      this.dynamicDashBoard.metrics.splice(index, 1);
      this.metrics_list.find(item=>item.metricId==data.metricId).metricAdded=false;
      if(this.defaultEmpty_metrics.find((item)=>item.metricAdded==true))
      this.defaultEmpty_metrics.find((item)=>item.metricAdded==true).metricAdded=false;
    }
    if(type=='widgets')
    {
      this.dynamicDashBoard.widgets.splice(index, 1);
      if(this.widgets.find(item=>item.widgetId==data.widgetId)!= undefined)
        this.widgets.find(item=>item.widgetId==data.widgetId).widgetAdded=false;
    }
  }


  addWidget(widget:any)
  {
    if(widget.widgetAdded==false)
    {
      this.dynamicDashBoard.widgets.push(widget);
      console.log(this.widgets.find((item:any)=>item.widgetId==widget.widgetId))
      if(this.widgets.find((item:any)=>item.widgetId==widget.widgetId)!=undefined)
        this.widgets.find((item:any)=>item.widgetId==widget.widgetId).widgetAdded=true;
    }
  }


get defaultMetricsData():any[]{
  return this.defaultEmpty_metrics.filter(item=>item.metricAdded==false);
}

dynamicdatatransfer(){
this.datatransfer.setdynamicscreen(this.dynamicDashBoard);
this.router.navigate(['/pages/dashboard/dynamicdashboard'])

}

}
