import { Component, OnInit, ViewChild } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { RestApiService } from '../../services/rest-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { fromMatPaginator, paginateRows } from './../../business-process/model/datasource-utils';
import { Observable  } from 'rxjs/Observable';
import { of  } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';
import { LoaderService } from 'src/app/services/loader/loader.service';
@Component({
  selector: 'app-business-insights',
  templateUrl: './business-insights.component.html',
  styleUrls: ['./business-insights.component.css']
})
export class BusinessInsightsComponent implements OnInit {
  processId:any;
  activitytime_data:any[]=[];
  throughtime_data:any[]=[];
  b_metrics:any={};
  variant_list:any[]=[];
  displayedRows$: Observable<any[]>;
  totalRows$: Observable<number>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  valueType:any;

  constructor(private rest:RestApiService,
    private route:ActivatedRoute,
    private router: Router,
    private loader: LoaderService
    ) { 
    let queryParamsResp
    this.route.queryParams.subscribe(res=>{queryParamsResp=res
      this.processId=queryParamsResp.wpid
    })
  }

  ngOnInit() {
    this.getActivityData();
    this.getThroughputTimeData();
    this.getBusinessMetricsData();
    this.getVariantsData();
  }

  getActivityData(){
    let res_data:any
    this.loader.show()
    this.rest.getBIActivityTime(this.processId)
              .subscribe(res=>{
                    res_data=res
                    res_data.data.forEach(element => {
                      element['convertedDuration']=this.getTimeConversion(element.totalDuration);
                      this.activitytime_data.push(element);
                    });
                  this.ActivityTimeChart();
                  this.loader.hide();
                  });
  }

   async getThroughputTimeData(){
     let res_data:any
     this.loader.show();
    await this.rest.getBIThroughputTime(this.processId).subscribe(res=>{res_data=res
      if(res_data.data[0].value==0){
        res_data.data.splice(0,1)
      }
      this.throughtime_data=res_data.data
      this.thoughtputTimeChart();
      this.loader.hide();
    });
  }

  async getBusinessMetricsData(){
    let res_data:any;
    this.loader.show()
    await this.rest.getBusinessMetrics(this.processId).subscribe(res=>{res_data=res
      this.b_metrics=res_data.data[0];
      this.loader.hide()
    });
  }

  async getVariantsData(){
    let res_data:any
    this.loader.show()
    await this.rest.getBIVariantsData(this.processId).subscribe(res=>{res_data=res
      for(var i=0; i<res_data.data.length; i++){
        res_data.data[i]['variantNumber']=i+1
        this.variant_list.push(res_data.data[i])
      }
      this.assignPagenation(this.variant_list);
      this.loader.hide()
    });
  }

  ActivityTimeChart(){
    this.activitytime_data.sort(function (a, b) {
      return b.totalDuration - a.totalDuration;
    });

      am4core.useTheme(am4themes_animated);
      // Themes end
      
      var chart = am4core.create("chartdiv", am4charts.PieChart);
      chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
      chart.legend = new am4charts.Legend();
      chart.legend.useDefaultMarker = true;
      var marker = chart.legend.markers.template.children.getIndex(0);
      //marker.cornerRadius(12, 12, 12, 12);
      marker.strokeWidth = 2;
      marker.strokeOpacity = 1;
      marker.stroke = am4core.color("#ccc");
      chart.legend.scrollable = true;
      chart.legend.fontSize = 12;
      chart.legend.reverseOrder = false;
      chart.data=this.activitytime_data;
      chart.legend.position = "right";
      chart.legend.valign = "middle";
      chart.innerRadius = 70;
      var label = chart.seriesContainer.createChild(am4core.Label);
      label.horizontalCenter = "middle";
      label.verticalCenter = "middle";
      label.fontSize = 18;
      var series = chart.series.push(new am4charts.PieSeries());
      series.dataFields.value = "totalDuration";
      series.dataFields.category = "activity";
      series.labels.template.disabled = true;
      var _self=this;
      series.slices.template.adapter.add("tooltipText", function(text, target) {
        return "{_dataContext.activity} \n {value.percent.formatNumber('#.#')}% [/]"
      });
      $('g:has(> g[stroke="#3cabff"])').hide();
      series.colors.list = [
          am4core.color("rgba(85, 216, 254, 0.9)"),
          am4core.color("rgba(255, 131, 115, 0.9)"),
          am4core.color("rgba(255, 218, 131, 0.9)"),
          am4core.color("rgba(163, 160, 251, 0.9)"),
          am4core.color("rgba(156, 39, 176, 0.9)"),
          am4core.color("rgba(103, 58, 183, 0.9)"),
          am4core.color("rgba(63, 81, 181, 0.9)"),
          am4core.color("rgba(33, 150, 243, 0.9)"),
          am4core.color("rgba(3, 169, 244, 0.9)"),
          am4core.color("rgba(0, 188, 212, 0.9)"),
          am4core.color("rgba(244, 67, 54, 0.9)"),
          am4core.color("rgba(233, 33, 97, 0.9)"),
          am4core.color("rgba(220, 103, 171, 0.9)"),
          am4core.color("rgba(220, 103, 206, 0.9)"),
          am4core.color("rgba(199, 103, 220, 0.9)"),
          am4core.color("rgba(163, 103, 220, 0.9)"),
          am4core.color("rgba(103, 113, 220, 0.9)"),
          am4core.color("rgba(0, 136, 86, 0.9)"),
          am4core.color("rgba(243, 195, 0, 0.9)"),
          am4core.color("rgba(243, 132, 0, 0.9)"),
          am4core.color("rgba(143, 13, 20, 0.9)"),
      ];
  }

  thoughtputTimeChart() {
    this.valueType = this.throughtime_data[0].unitOfTime
    let _me = this
    am4core.useTheme(am4themes_animated);
    // Create chart instance
    var chart = am4core.create("chartdiv2", am4charts.XYChart);
    chart.data = _me.throughtime_data
    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "param";
    categoryAxis.renderer.grid.template.location = 1;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.title.text = "Throughput Time (" + _me.valueType + ")"
    var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "No of Cases"
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueX = "value";
    series.dataFields.categoryY = "param";
    series.columns.template.tooltipText = " Duration : {categoryY} \n  No of Cases : {valueX}[/] ";
    var valueLabel = series.bullets.push(new am4charts.LabelBullet());
    series.columns.template.adapter.add("fill", function (fill, target) {
      return am4core.color("#4d72be");
    });
    valueLabel.label.fontSize = 20;
    $('g:has(> g[stroke="#3cabff"])').hide();
  }

  parseMillisecondsIntoReadableTime(milliseconds){
    //Get hours from milliseconds
    var hours = milliseconds / (1000*60*60);
    var absoluteHours = Math.floor(hours);
    var h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;
    //Get remainder from hours and convert to minutes
    var minutes = (hours - absoluteHours) * 60;
    var absoluteMinutes = Math.floor(minutes);
    var m = absoluteMinutes > 9 ? absoluteMinutes : '0' +  absoluteMinutes;
    //Get remainder from minutes and convert to seconds
    var seconds = (minutes - absoluteMinutes) * 60;
    var absoluteSeconds = Math.floor(seconds);
    var s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;
    return h + '.' + m + '.' + s;
  }

  getTimeConversion(millisec) {    //convert time duration millisec to proper formate
    var seconds:any = (millisec / 1000).toFixed(1);
    var minutes:any = (millisec / (1000 * 60)).toFixed(1);
    var hours:any = (millisec / (1000 * 60 * 60)).toFixed(1);
    var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);
    var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);
    if (seconds < 60) {
        return seconds + " Sec";
    } else if (minutes < 60) {
        return minutes + " Min";
    } else if (hours < 24) {
        return this.convertedValue(hours) + " Hrs";
    } else {
        // if(Number(days)>7){
        //   return this.convertedValue(Number(days)/7) +" Weeks"
        // }else if(Number(days)==7){
        //   return  "1 Week";
        // }else{
          return days + " Days"
        // }
    }
  }

  convertedValue(value){       
    if(String(value).indexOf('.') != -1){
      let perc=value.toString().split('.')
      return perc[0]+'.'+perc[1].slice(0,2);
    }else{
      return value;
    }
  }

  assignPagenation(data){
    const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator);
    const rows$ = of(data);
    this.totalRows$ = rows$.pipe(map(rows => rows.length));
    this.displayedRows$ = rows$.pipe(paginateRows(pageEvents$));
  }

  loopTrackBy(index, term) {
    return index;
  }

  gotoProcessgraph() {
    this.router.navigate(["/pages/processIntelligence/flowChart"], {
      queryParams: { wpiId: this.processId },
    });
  }

}