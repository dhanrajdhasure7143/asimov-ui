import { Component, OnInit } from '@angular/core';
// import * as am4core from '@amcharts/amcharts4/core';
// import * as am4charts from '@amcharts/amcharts4/charts';
// import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTransferService } from '../../services/data-transfer.service';
import { MenuItem, SelectItem, MessageService, PrimeNGConfig } from 'primeng/api';
// import { RestApiService } from 'src/app/pages/services/rest-api.service';



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
  cars: SelectItem[];

  selectedCar: string;





  constructor(private activeRoute: ActivatedRoute, private datatransfer: DataTransferService, private router: Router, private messageService: MessageService,
    private primengConfig: PrimeNGConfig, 
  ) {
    this.cars = [
      { label: 'List of Dashboards', value: 'LOD' },
      { label: 'Analytics dashboard', value: 'AD' },
      { label: 'Performance Dashboard', value: 'PD' },
      { label: 'Revenue Dashbaord', value: 'RD' },
      { label: 'Process Owner Dashboard', value: 'POD' },

    ];

  }

  dashboardName: String = "";
  dashboardData: any = [];
  editDashboardName: boolean = false;
  ngOnInit(): void {
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
      this.dashboardName = response.dashboardName
      this.dashboardData = response;
      this.dashboardData.widgets = response.widgets.map((item: any) => {
        item["edit"] = false;
        return item;
      })
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

  }

  // chart1(pieData){
  //   let data:any=pieData
  //   // let data:any=pieData.map((item:any)=>{
  //   //   if(item.litres=0)
  //   //   {
  //   //     return item;
  //   //   }
  //   // })
  //   // Themes begin
  //   am4core.useTheme(am4themes_animated);
  //   // Themes end
    
  //   // Create chart instance
  //   var chart = am4core.create("chartdiv", am4charts.PieChart);
    
  //   // Add and configure Series
  //   var pieSeries = chart.series.push(new am4charts.PieSeries());
  //   pieSeries.dataFields.value = "litres";
  //   pieSeries.dataFields.category = "country";
  //   pieSeries.slices.template.propertyFields.fill = "color";
  //   // Let's cut a hole in our Pie chart the size of 30% the radius
  //   chart.innerRadius = am4core.percent(30);
  //   pieSeries.slices.template.events.on(
  //     "hit",
  //     ev => {
  //     let a = ev.target;
  //     var idOfPie = ev.target._dataItem.dataContext["country"];
  //       // switch(idOfPie) {
  //       //   case 'Active':
  //       //       $('.botstatusactive').show();
  //       //       $('.botactive.except').hide();
  //       //     //   document.querySelector('.botstatusactive').scrollIntoView({
  //       //     //     behavior: 'smooth'
  //       //     // });
  //       //     //   $('html,body').animate({
  //       //     //     scrollTop: $(".botstatusactive").offset().top},
  //       //     //     'slow');
  //       //       break;
  //       //   case 'Exception':
  //       //       $('.botactive.except').show();
  //       //       $('.botstatusactive').hide();
  //       //     //   document.querySelector('.except').scrollIntoView({
  //       //     //     behavior: 'smooth'
  //       //     // });
  //       //     //   $('html,body').animate({
  //       //     //     scrollTop: $(".botactive.except").offset().top},
  //       //     //     'slow');
  //       //       break;
  //       //   default:
  //       //       $('.botstatusactive').hide();
  //       //       $('.botactive.except').hide();
  //       // }
        
  //     },
  //   this
  //   );
  //   // Put a thick white border around each Slice
  //   pieSeries.slices.template.stroke = am4core.color("#fff");
  //   pieSeries.slices.template.strokeWidth = 2;
  //   pieSeries.slices.template.strokeOpacity = 1;
  //   pieSeries.slices.template
  //     // change the cursor on hover to make it apparent the object can be interacted with
  //     .cursorOverStyle = [
  //       {
  //         "property": "cursor",
  //         "value": "pointer"
  //       }
  //     ];
  //   pieSeries.labels.template.maxWidth = 130;
  //   pieSeries.labels.template.wrap = true;
  //   pieSeries.labels.template.fontSize = 18;
  //   pieSeries.labels.template.bent = false;
  //   pieSeries.labels.template.padding(0,0,0,0);
  //   pieSeries.ticks.template.disabled = true;
  //   pieSeries.alignLabels = false;
  //   //pieSeries.labels.template.text = "{value.percent.formatNumber('#.')}";
  //   pieSeries.labels.template.text = "{value}";
  //   pieSeries.labels.template.radius = am4core.percent(-40);
  //   pieSeries.labels.template.fill = am4core.color("white");
  //   // Create a base filter effect (as if it's not there) for the hover to return to
  //   var shadow = pieSeries.slices.template.filters.push(new am4core.DropShadowFilter);
  //   shadow.opacity = 0;
    
  //   // Create hover state
  //   var hoverState = pieSeries.slices.template.states.getKey("hover"); // normally we have to create the hover state, in this case it already exists
    
  //   // Slightly shift the shadow and make it more prominent on hover
  //   var hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter);
  //   hoverShadow.opacity = 0.7;
  //   hoverShadow.blur = 5;
    
  //   // Add a legend

  //   chart.legend = new am4charts.Legend();
  //   chart.legend.fontSize = 13;
  //   chart.legend.labels.template.text = "{category} - {value}";
  //   let markerTemplate = chart.legend.markers.template;
  //   markerTemplate.width = 10;
  //   markerTemplate.height = 10;
  //   chart.innerRadius = am4core.percent(0);
  //   chart.data = data;

  //   // hide zero values in chart
  //    pieSeries.events.on("datavalidated", function(ev) {
  //     ev.target.dataItems.each((di) => {
  //         if (di.values.value.value === 0 ) {
  //           di.hide();
  //         }
  //     })
  //   })

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

}


