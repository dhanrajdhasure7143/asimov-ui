import { Component, OnInit, ViewChild } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { RestApiService } from '../../services/rest-api.service';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material';
import { fromMatPaginator, paginateRows } from './../../business-process/model/datasource-utils';
import { Observable  } from 'rxjs/Observable';
import { of  } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';
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

  @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
  constructor(private rest:RestApiService,private route:ActivatedRoute) { 
    let queryParamsResp
    this.route.queryParams.subscribe(res=>{queryParamsResp=res
      console.log(res)
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
    this.rest.getBIActivityTime(this.processId)
              .subscribe(res=>{
                    res_data=res
                    res_data.data.forEach(element => {
                      element['convertedDuration']=this.getTimeConversion(element.totalDuration);
                      this.activitytime_data.push(element);
                    });
                    // console.log(this.activitytime_data);
                  this.ActivityTimeChart();
                  });
  }

   async getThroughputTimeData(){
     let res_data:any
    await this.rest.getBIThroughputTime(this.processId).subscribe(res=>{res_data=res
      this.throughtime_data=res_data.data
      console.log(this.throughtime_data)
      this.thoughtputTimeChart();
    });
  }

  async getBusinessMetricsData(){
    let res_data:any
    await this.rest.getBusinessMetrics(this.processId).subscribe(res=>{res_data=res
      // console.log(this.b_metrics);
      this.b_metrics=res_data.data[0];
    });
  }

  async getVariantsData(){
    let res_data:any
    await this.rest.getBIVariantsData(this.processId).subscribe(res=>{res_data=res
      for(var i=0; i<res_data.data.length; i++){
        res_data.data[i]['variantNumber']=i+1
        this.variant_list.push(res_data.data[i])
      }
      // console.log(this.variant_list)
      this.assignPagenation(this.variant_list);
    });
  }

  ActivityTimeChart(){
      // let data2=[...data.map(item=>{
      //    let duration=parseInt(item["Duration"]);
      //    item["totalDuration"]=(this.parseMillisecondsIntoReadableTime(duration)).toString();
      //     return item;
      // })]
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

      // chart.data=data;
      chart.data=this.activitytime_data;

      chart.legend.position = "right";
      chart.legend.valign = "middle";
      chart.innerRadius = 70;
      // chart.tooltip="test";
      var label = chart.seriesContainer.createChild(am4core.Label);
        // label.text = "230,900 Sales";
      label.horizontalCenter = "middle";
      label.verticalCenter = "middle";
      label.fontSize = 18;
      var series = chart.series.push(new am4charts.PieSeries());
      series.dataFields.value = "totalDuration";
      series.dataFields.category = "activity";
      series.labels.template.disabled = true;
      series.slices.template.cornerRadius = 0;
      series.tooltip.horizontalCenter = "middle";
      // series.tooltip.verticalCenter = "middle";
      // series.tooltip.fontSize=18;
      // series.tooltipText = ' {name} ({_dataContext.totalDuration1})';
      // series.slices.template.tooltipText = "{parent.parent.name} {parent.name} > {name} ({value})";
      // series.columns.template.tooltipText = " caseId : {categoryX} \n  Duration : {valueY}[/] ";
      // series.tooltip.text = " caseId";
      // series.adapter.add("tooltipText", function(text, target) {
      //   console.log(text,target.dataItem)
      //   return "{_dataContext.activity} \n {_dataContext.totalDuration1}";
      // });
      var _self=this;
      series.slices.template.adapter.add("tooltipText", function(text, target) {
        // var text=_self.getTimeConversion('{_dataContext.totalDuration}');
        return "{_dataContext.activity} \n {_dataContext.convertedDuration}";
      });
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


  thoughtputTimeChart(){
    let _me=this
    am4core.ready(function() {
      // Themes begin
      am4core.useTheme(am4themes_animated);
      // Themes end
      // Create chart instance
      var chart = am4core.create("chartdiv2", am4charts.XYChart);
      // Add data

      chart.data=_me.throughtime_data
      
      // Create axes
  
      var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      // categoryAxis.dataFields.category = "country";
      categoryAxis.dataFields.category = "param";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.minGridDistance = 30;
      // categoryAxis.title.text="Days"
      // categoryAxis.title.text="Median Activity Duration"
      // categoryAxis.title.fontWeight="bold"
      // categoryAxis.renderer.labels.template.adapter.add("dy", function(dy, target) {
      //   if (target.dataItem && target.dataItem.index && 2 == 2) {
      //     return dy + 25;
      //   }
      //   return dy;
      // });


    
      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      // valueAxis.title.text = "No.of.Cases";
      valueAxis.title.text = "No of Cases";
      //valueAxis.title.fontWeight="bold"
      // Create series
      var series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = "value";
      series.dataFields.categoryX = "param";
      // series.dataFields.valueY = "medianActivityDuration";
      // series.dataFields.categoryX = "caseId";
      series.name = "value";
      series.columns.template.tooltipText = " Duration : {categoryX} \n  No of Cases : {valueY}[/] ";
      series.columns.template.fillOpacity = 1;
      series.columns.template.adapter.add("fill", function(fill, target) {
          return am4core.color("#4d72be");
        });
      
      // chart.colors.list = [
        
      //   am4core.color("rgba(85, 216, 254, 0.9)"),
      // ];
      
      var columnTemplate = series.columns.template;
      columnTemplate.strokeWidth = 0;
      columnTemplate.strokeOpacity = 1;
      
      }); // end am4core.ready()
    
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

}