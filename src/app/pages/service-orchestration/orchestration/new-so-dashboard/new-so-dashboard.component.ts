import { Component, OnInit, Input } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { DataTransferService } from 'src/app/pages/services/data-transfer.service';
import {NgxSpinnerService} from 'ngx-spinner';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-new-so-dashboard',
  templateUrl: './new-so-dashboard.component.html',
  styleUrls: ['./new-so-dashboard.component.css']
})
export class NewSoDashboardComponent implements OnInit {
  url: string = "http://10.11.0.129:8080/knowage/servlet/AdapterHTTP?ACTION_NAME=EXECUTE_DOCUMENT_ACTION&OBJECT_LABEL=query_dashboard&TOOLBAR_VISIBLE=false&ORGANIZATION=DEMO&NEW_SESSION=false";
  urlSafe: SafeResourceUrl;

  constructor(
    private dt:DataTransferService,
    private spinner:NgxSpinnerService,public sanitizer: DomSanitizer
    ) { }
  public accountsArray:any[];
  isAccounts:boolean=false;
  isWealth:boolean=false;
  isInsurance:boolean=false;
  isAcquisitions:boolean=false;
  isConsumer:boolean=false;

  isAccounts1:boolean=false;
  isWealth1:boolean=false;
  isInsurance1:boolean=false;
  isAcquisitions1:boolean=false;
  isConsumer1:boolean=false;


  ngOnInit() {
    this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    this.spinner.show();
    setTimeout(()=>{

      // this.loadChart1();
      // this.loadBarChart();
      // this.loadBarChart1();
      // this.chart2();
      this.spinner.hide();
    },500)
    // console.log('test');
    // this.dt.current_tab.subscribe(res=>{
    //   // console.log(res);
    //   if(res=='Dashboard'){
    //     $('.dashboardchart_shownnxt').hide();
    // $('.dashboardchart_show').show();
    // $('.lob-sec').hide();
    // $('.botsbyprocess-sec').hide();
    // $('.botsbyprocess-sec2').hide();
    //   }
    // })

  }


  loadChart1(){
          am4core.useTheme(am4themes_animated);
          // Create chart instance
          var chart = am4core.create("dashboardchart1", am4charts.XYChart);
          // Add data
          var data = [

            {
              country: "Insurance",
              research: 47.9
            },
            {
              country: "Consumer banking",
              research: 71.1
            },
            {
              country: "Mergers & Acquisitions",
              research: 31.9
            },
            {
              country: "Accounts Mgmt",
              research: 90.1
            },
            {
              country: "Wealth Mgmt",
              research: 51.1
            }
          ];

          chart.data = data;
          // Create axes
          var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
          categoryAxis.dataFields.category = "country";
          categoryAxis.renderer.grid.template.location = 0;
          categoryAxis.renderer.minGridDistance = 20;
          categoryAxis.interpolationDuration = 2000;
          categoryAxis.renderer.cellStartLocation = 0.5;
          categoryAxis.renderer.cellEndLocation = 0.9;
          categoryAxis.renderer.labels.template.fontSize = 12;
          categoryAxis.renderer.labels.template.maxWidth = 150;
          categoryAxis.renderer.labels.template.wrap = true;
          // categoryAxis.renderer.labels.template.fontWeight = 500;



          var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
          valueAxis.renderer.labels.template.fontSize = 11;
          valueAxis.title.text = "Automated Process";
          // Create series

            var series = chart.series.push(new am4charts.ColumnSeries());
            series.columns.template.width = am4core.percent(10);
            series.dataFields.valueX = "research";
            series.dataFields.categoryY = "country";
            series.columns.template.tooltipText = "[bold]{valueX}[/]";
            series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
            series.columns.template.width = am4core.percent(10);
            series.columns.template.events.on(
          "hit",
          ev => {
          let a = ev.target;
          // alert(ev.target._dataItem.dataContext["country"]);
          var idOfPie = ev.target._dataItem.dataContext["country"];
          console.log(idOfPie,"test1");
          $('.botsbyprocess-sec').hide();
          $('.botsbyprocess-sec2').hide();
          switch(idOfPie) {
                  case 'Insurance':
                      $('.lob-sec.accounts-management').hide();
                      $('.lob-sec.wealth-management').hide();
                      $('.lob-sec.insurance').show();
                      $('.lob-sec.mergers-acquisitions').hide();
                      $('.lob-sec.consumer-banking').hide();
                      $('.dashboardchart_shownnxt').show();
                      $('.dashboardchart_show').hide();
                      break;
                  case 'Consumer banking':
                      $('.lob-sec.wealth-management').hide();
                      $('.lob-sec.accounts-management').hide();
                      $('.lob-sec.insurance').hide();
                      $('.lob-sec.mergers-acquisitions').hide();
                      $('.lob-sec.consumer-banking').show();
                      $('.dashboardchart_shownnxt').show();
                      $('.dashboardchart_show').hide();
                      break;
                  case 'Mergers & Acquisitions':
                      $('.lob-sec.insurance').hide();
                      $('.lob-sec.wealth-management').hide();
                      $('.lob-sec.mergers-acquisitions').show();
                      $('.lob-sec.consumer-banking').hide();
                      $('.lob-sec.accounts-management').hide();
                      $('.dashboardchart_shownnxt').show();
                      $('.dashboardchart_show').hide();
                      break;
                  case 'Accounts Mgmt':
                      $('.lob-sec.mergers-acquisitions').hide();
                      $('.lob-sec.consumer-banking').hide();
                      $('.lob-sec.accounts-management').show();
                      $('.lob-sec.insurance').hide();
                      $('.lob-sec.wealth-management').hide();
                      $('.dashboardchart_shownnxt').show();
                      $('.dashboardchart_show').hide();
                      break;
                  case 'Wealth Mgmt':
                      $('.lob-sec.consumer-banking').hide();
                      $('.lob-sec.accounts-management').hide();
                      $('.lob-sec.mergers-acquisitions').hide();
                      $('.lob-sec.insurance').hide();
                      $('.lob-sec.wealth-management').show();
                      $('.dashboardchart_shownnxt').show();
                      $('.dashboardchart_show').hide();
                      break;
                  default:
                      $('.lob-sec').hide();
                      $('.botsbyprocess-sec').hide();
                      $('.botsbyprocess-sec2').hide();
              }

          },
          this
          );


  }


  loadBarChart(){

      am4core.useTheme(am4themes_animated);

      // Create chart instance
      var chart = am4core.create("botsbyprocess", am4charts.XYChart);

      // Add data
      chart.data = [{
          "botname": "Accounts Payable",
          "UiPath": 1,
          "IAP": 3,
          }, {
          "botname": "Order to cash",
          "UiPath":8,
          "IAP": 5
          }, {
          "botname": "Invoice Processing",
          "UiPath": 2,
          "IAP": 2
          }, {
          "botname": "Accounts Receivable",
          "UiPath": 2,
          "IAP": 5
          }, {
          "botname": "Clients Processing",
          "UiPath": 4,
          "IAP": 3
          }];

      // Create axes
      var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "botname";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.minGridDistance = 20;
      categoryAxis.renderer.labels.template.fontSize = 12;
      categoryAxis.renderer.labels.template.maxWidth = 100;
      categoryAxis.renderer.labels.template.wrap = true;
      // categoryAxis.renderer.labels.template.fontWeight=500;
      // categoryAxis.renderer.labels.template.rotation = -80;

      var  valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.title.text = "No.of Tasks";

      // Create series
      var series1 = chart.series.push(new am4charts.ColumnSeries());
      series1.dataFields.valueY = "UiPath";
      series1.dataFields.categoryX = "botname";
      series1.name = "UiPath";
      series1.tooltipText = "{name}: [bold]{valueY}[/]";
      series1.stacked = true;
      series1.columns.template.width = am4core.percent(20);
      series1.columns.template.fill = am4core.color("#DFBD4F");
      series1.columns.template.strokeWidth = 0;
      series1.columns.template.events.on(
  "hit",
  ev => {
  let a = ev.target;
  // alert(ev.target._dataItem.dataContext["country"]);
  var idOfPie = ev.target._dataItem.dataContext["botname"];
  console.log(idOfPie);
  $('.lob-sec').hide();
  $('.botsbyprocess-sec').hide();
switch(idOfPie) {
  case 'Accounts Payable':
    $('.botsbyprocess-sec2.accounts-payble').show();
    $('.botsbyprocess-sec2.ordertocash').hide();
    $('.botsbyprocess-sec2.invoice-pro').hide();
    $('.botsbyprocess-sec2.account-receive').hide();
        $('.botsbyprocess-sec2.clients-pro').hide();
      break;
  case 'Order to cash':
    $('.botsbyprocess-sec2.accounts-payble').hide();
    $('.botsbyprocess-sec2.ordertocash').show();
    $('.botsbyprocess-sec2.invoice-pro').hide();
    $('.botsbyprocess-sec2.account-receive').hide();
        $('.botsbyprocess-sec2.clients-pro').hide();
      break;
  case 'Invoice Processing':
    $('.botsbyprocess-sec2.accounts-payble').hide();
    $('.botsbyprocess-sec2.ordertocash').hide();
    $('.botsbyprocess-sec2.invoice-pro').show();
    $('.botsbyprocess-sec2.account-receive').hide();
        $('.botsbyprocess-sec2.clients-pro').hide();
      break;
  case 'Accounts Receivable':
    $('.botsbyprocess-sec2.accounts-payble').hide();
    $('.botsbyprocess-sec2.ordertocash').hide();
    $('.botsbyprocess-sec2.invoice-pro').hide();
    $('.botsbyprocess-sec2.account-receive').show();
        $('.botsbyprocess-sec2.clients-pro').hide();
      break;
  case 'Clients Processing':
    $('.botsbyprocess-sec2.accounts-payble').hide();
    $('.botsbyprocess-sec2.ordertocash').hide();
    $('.botsbyprocess-sec2.invoice-pro').hide();
    $('.botsbyprocess-sec2.account-receive').hide();
    $('.botsbyprocess-sec2.clients-pro').show();
      break;
  default:
      $('.lob-sec').hide();
          $('.botsbyprocess-sec').hide();
          $('.botsbyprocess-sec2').hide();
}

  },
  this
  );
      var series2 = chart.series.push(new am4charts.ColumnSeries());
      series2.dataFields.valueY = "IAP";
      series2.dataFields.categoryX = "botname";
      series2.name = "IAP";
      series2.tooltipText = "{name}: [bold]{valueY}[/]";
      series2.stacked = true;
      series2.columns.template.width = am4core.percent(20);
      series2.columns.template.fill = am4core.color("#4F7ADF");
      series2.columns.template.strokeWidth = 0;
      series2.columns.template.events.on(
  "hit",
  ev => {
  let a = ev.target;
  // alert(ev.target._dataItem.dataContext["country"]);
  var idOfPie = ev.target._dataItem.dataContext["botname"];
  console.log(idOfPie);
  $('.lob-sec').hide();
  $('.botsbyprocess-sec').hide();
switch(idOfPie) {
  case 'Accounts Payable':
    $('.botsbyprocess-sec2.accounts-payble').show();
    $('.botsbyprocess-sec2.ordertocash').hide();
    $('.botsbyprocess-sec2.invoice-pro').hide();
    $('.botsbyprocess-sec2.account-receive').hide();
    $('.botsbyprocess-sec2.clients-pro').hide();
      break;
  case 'Order to cash':
    $('.botsbyprocess-sec2.accounts-payble').hide();
    $('.botsbyprocess-sec2.ordertocash').show();
    $('.botsbyprocess-sec2.invoice-pro').hide();
    $('.botsbyprocess-sec2.account-receive').hide();
    $('.botsbyprocess-sec2.clients-pro').hide();
      break;
  case 'Invoice Processing':
    $('.botsbyprocess-sec2.accounts-payble').hide();
    $('.botsbyprocess-sec2.ordertocash').hide();
    $('.botsbyprocess-sec2.invoice-pro').show();
    $('.botsbyprocess-sec2.account-receive').hide();
    $('.botsbyprocess-sec2.clients-pro').hide();
      break;
  case 'Accounts Receivable':
    $('.botsbyprocess-sec2.accounts-payble').hide();
    $('.botsbyprocess-sec2.ordertocash').hide();
    $('.botsbyprocess-sec2.invoice-pro').hide();
    $('.botsbyprocess-sec2.account-receive').show();
    $('.botsbyprocess-sec2.clients-pro').hide();
      break;
  case 'Clients Processing':
    $('.botsbyprocess-sec2.accounts-payble').hide();
    $('.botsbyprocess-sec2.ordertocash').hide();
    $('.botsbyprocess-sec2.invoice-pro').hide();
    $('.botsbyprocess-sec2.account-receive').hide();
    $('.botsbyprocess-sec2.clients-pro').show();
      break;
  default:
      $('.lob-sec').hide();
          $('.botsbyprocess-sec').hide();
          $('.botsbyprocess-sec2').hide();
}

  },
  this
  );

//       var series3 = chart.series.push(new am4charts.ColumnSeries());
//       series3.dataFields.valueY = "Ui Path";
//       series3.dataFields.categoryX = "botname";
//       series3.name = "Ui Path";
//       series3.tooltipText = "{name}: [bold]{valueY}[/]";
//       series3.stacked = true;
//       series3.columns.template.column.cornerRadiusTopLeft = 10;
//       series3.columns.template.column.cornerRadiusTopRight = 10;
//       series3.columns.template.width = am4core.percent(20);
//       series3.columns.template.fill = am4core.color("#76C0DC");
//       series3.columns.template.strokeWidth = 0;
//       series3.columns.template.events.on(
//   "hit",
//   ev => {
//   let a = ev.target;
//   // alert(ev.target._dataItem.dataContext["country"]);
//   var idOfPie = ev.target._dataItem.dataContext["botname"];
//   console.log(idOfPie);
//   $('.lob-sec').hide();
//   $('.botsbyprocess-sec').hide();
// switch(idOfPie) {
//   case 'Accounts Payable':
//     $('.botsbyprocess-sec2.accounts-payble').show();
//     $('.botsbyprocess-sec2.ordertocash').hide();
//     $('.botsbyprocess-sec2.invoice-pro').hide();
//     $('.botsbyprocess-sec2.account-receive').hide();
//     $('.botsbyprocess-sec2.clients-pro').hide();
//       break;
//   case 'Order to cash':
//     $('.botsbyprocess-sec2.accounts-payble').hide();
//     $('.botsbyprocess-sec2.ordertocash').show();
//     $('.botsbyprocess-sec2.invoice-pro').hide();
//     $('.botsbyprocess-sec2.account-receive').hide();
//     $('.botsbyprocess-sec2.clients-pro').hide();
//       break;
//   case 'Invoice Processing':
//     $('.botsbyprocess-sec2.accounts-payble').hide();
//     $('.botsbyprocess-sec2.ordertocash').hide();
//     $('.botsbyprocess-sec2.invoice-pro').show();
//     $('.botsbyprocess-sec2.account-receive').hide();
//     $('.botsbyprocess-sec2.clients-pro').hide();
//       break;
//   case 'Accounts Receivable':
//     $('.botsbyprocess-sec2.accounts-payble').hide();
//     $('.botsbyprocess-sec2.ordertocash').hide();
//     $('.botsbyprocess-sec2.invoice-pro').hide();
//     $('.botsbyprocess-sec2.account-receive').show();
//     $('.botsbyprocess-sec2.clients-pro').hide();
//       break;
//   case 'Clients Processing':
//     $('.botsbyprocess-sec2.accounts-payble').hide();
//     $('.botsbyprocess-sec2.ordertocash').hide();
//     $('.botsbyprocess-sec2.invoice-pro').hide();
//     $('.botsbyprocess-sec2.account-receive').hide();
//     $('.botsbyprocess-sec2.clients-pro').show();
//       break;
//   default:
//       $('.lob-sec').hide();
//           $('.botsbyprocess-sec').hide();
//           $('.botsbyprocess-sec2').hide();
// }

//   },
//   this
//   );

      chart.colors.list = [
          am4core.color("#DFBD4F"),
          am4core.color("#4F7ADF"),
          am4core.color("#76C0DC"),
      ];
      // Legend
      chart.legend = new am4charts.Legend();
      chart.legend.fontSize = 12;
      let markerTemplate = chart.legend.markers.template;
      markerTemplate.width = 10;
      markerTemplate.height = 10;

      // Add cursor
      chart.cursor = new am4charts.XYCursor();

  }
  loadBarChart1(){
    am4core.useTheme(am4themes_animated);
// Themes end
// Create chart instance
var chart = am4core.create("bothumantask", am4charts.XYChart);
// Add data
chart.data = [{
  "botname": "Accounts Payable",
  "Bots": 2.5,
  "Human Task": 2.5
}, {
  "botname": "Order to cash",
  "Bots": 0.5,
  "Human Task": 2.5
}, {
  "botname": "Invoice Processing",
  "Bots": 2.1,
  "Human Task": 0.3
}, {
  "botname": "Accounts Receivable",
  "Bots": 2.1,
  "Human Task": 2.7
}, {
  "botname": "Clients Processing",
  "Bots": 2.2,
  "Human Task": 2.5
}];

// Create axes
var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
categoryAxis.dataFields.category = "botname";
categoryAxis.renderer.grid.template.location = 0;
categoryAxis.renderer.labels.template.fontSize = 12;
categoryAxis.renderer.labels.template.maxWidth = 100;
categoryAxis.renderer.labels.template.wrap = true;
// categoryAxis.renderer.labels.template.fontWeight = 500;
categoryAxis.renderer.minGridDistance = 10;

var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
valueAxis.renderer.inside = true;
valueAxis.renderer.labels.template.disabled = true;
valueAxis.renderer.labels.template.fontSize = 12;
valueAxis.min = 0;
// Create series
	function createSeries(field, name) {
	  // Set up series
	  var series = chart.series.push(new am4charts.ColumnSeries());
	  series.name = name;
	  series.dataFields.valueY = field;
	  series.dataFields.categoryX = "botname";
	  series.sequencedInterpolation = true;

	  // Make it stacked
	  series.stacked = true;

	  // Configure columns
	  series.columns.template.width = am4core.percent(20);
	  series.columns.template.tooltipText = "[normal]{name}[/]\n[font-size:12px]{categoryX}: {valueY}";

	  // Add label
	  var labelBullet = series.bullets.push(new am4charts.LabelBullet());
	  labelBullet.label.text = "{valueY}";
	  labelBullet.locationY = 0.5;
	  labelBullet.label.hideOversized = true;

	  return series;
	}
	chart.colors.list = [
        am4core.color("#BDE9A4"),
        am4core.color("#87D2EE"),
    ];
	createSeries("Bots", "Bots");
	createSeries("Human Task", "Human Task");

	// Legend
	chart.legend = new am4charts.Legend();
	chart.legend.fontSize = 12;
	let markerTemplate = chart.legend.markers.template;
	markerTemplate.width = 10;
	markerTemplate.height = 10;

  }

  chart2(){
    $("#dashboardchart2").ready(function() {
      // Apply chart themes
      am4core.useTheme(am4themes_animated);

      // Create chart instance
      var chart = am4core.create("dashboardchart2", am4charts.XYChart);

      chart.data = [{
        "botnametwo": "Accounts Payable",
        "UiPath": 2,
        "IAP": 5

      }, {
        "botnametwo": "Receive Invoice",
        "UiPath": 5,
        "IAP": 2
      }, {
        "botnametwo": "Download Invoice",
        "UiPath": 1,
        "IAP": 8
      }, {
        "botnametwo": "Payment Initiate",
        "UiPath": 2,
        "IAP": 7
      }, {
        "botnametwo": "Scan Doc",
        "UiPath": 2,
        "IAP": 5
      }, {
        "botnametwo": "Verify Doc",
        "UiPath": 9,
        "IAP": 5
      }, {
        "botnametwo": "Send Receipt",
        "UiPath": 8,
        "IAP": 2
      }, {
        "botnametwo": "Customer Verify",
        "UiPath": 5,
        "IAP": 3
      }, {
        "botnametwo": "Cycle Re-check",
        "UiPath": 4,
        "IAP": 2
      }, {
        "botnametwo": "Quality Chk",
        "UiPath": 2,
        "IAP": 2
      }, {
        "botnametwo": "Test Account",
        "UiPath": 4,
        "IAP": 5
      }, {
        "botnametwo": "Pricing Adjust",
        "UiPath": 4,
        "IAP": 2
      }, {
        "botnametwo": "Distribution",
        "UiPath": 9,
        "IAP": 4
      }, {
        "botnametwo": "Generate Licences",
        "UiPath": 7,
        "IAP": 2
      }, {
        "botnametwo": "Capture Screenshot",
        "UiPath": 5,
        "IAP": 2
      }, {
        "botnametwo": "Regulatory Check",
        "UiPath": 5,
        "IAP": 3
      }, {
        "botnametwo": "Approval Info scan",
        "UiPath": 9,
        "IAP": 3,

      }, {
        "botnametwo": "Update Approvals",
        "UiPath": 5,
        "IAP": 4
      }, {
        "botnametwo": "PO Issue",
        "UiPath": 9,
        "IAP": 6,
      }, {
        "botnametwo": "Receive Docs",
        "UiPath":6,
        "IAP": 5,
      }, {
        "botnametwo": "Invoice Verify",
        "UiPath": 2,
        "IAP": 2
      }, {
        "botnametwo": "Vendor Selection",
        "UiPath": 4,
        "IAP": 3
      }, {
        "botnametwo": "Send Invoice",
        "UiPath": 6,
        "IAP": 3
      }, {
        "botnametwo": "Receive Invoice",
        "UiPath": 7,
        "IAP": 5,
      }, {
        "botnametwo": "Order Check",
        "UiPath": 6,
        "IAP": 3
      }];

      // Create axes
      var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "botnametwo";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.minGridDistance = 20;
      categoryAxis.renderer.labels.template.fontSize = 12;
      categoryAxis.renderer.labels.template.maxWidth = 120;
      categoryAxis.renderer.labels.template.wrap = true;
      // categoryAxis.renderer.labels.template.fontWeight = 500;
      categoryAxis.renderer.labels.template.rotation = -80;

      var  valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.title.text = "No.of Bots";

      // Create series
      var series1 = chart.series.push(new am4charts.ColumnSeries());
      series1.dataFields.valueY = "UiPath";
      series1.dataFields.categoryX = "botnametwo";
      series1.name = "UiPath";
      series1.tooltipText = "{name}: [bold]{valueY}[/]";
      series1.stacked = true;
      series1.columns.template.width = am4core.percent(20);
      series1.columns.template.fill = am4core.color("#DFBD4F");
      series1.columns.template.strokeWidth = 0;


      var series2 = chart.series.push(new am4charts.ColumnSeries());
      series2.dataFields.valueY = "IAP";
      series2.dataFields.categoryX = "botnametwo";
      series2.name = "IAP";
      series2.tooltipText = "{name}: [bold]{valueY}[/]";
      series2.stacked = true;
      series2.columns.template.width = am4core.percent(20);
      series2.columns.template.fill = am4core.color("#4F7ADF");
      series2.columns.template.strokeWidth = 0;

      // var series3 = chart.series.push(new am4charts.ColumnSeries());
      // series3.dataFields.valueY = "Ui Path";
      // series3.dataFields.categoryX = "botnametwo";
      // series3.name = "Ui Path";
      // series3.tooltipText = "{name}: [bold]{valueY}[/]";
      // series3.stacked = true;
      // series3.columns.template.width = am4core.percent(20);
      // series3.columns.template.column.cornerRadiusTopLeft = 10;
      // series3.columns.template.column.cornerRadiusTopRight = 10;
      // series3.columns.template.fill = am4core.color("#76C0DC");
      // series3.columns.template.strokeWidth = 0;

      // Legend
      chart.legend = new am4charts.Legend();
      chart.legend.fontSize = 12;
      let markerTemplate = chart.legend.markers.template;
      markerTemplate.width = 10;
      markerTemplate.height = 10;

      // Add cursor
      chart.cursor = new am4charts.XYCursor();
      })

  }

  onchange(value){
    var bgchange =value;
    $('.lob-sec').hide();
    $('.botsbyprocess-sec').hide();
    $('.botsbyprocess-sec2').hide();
switch(bgchange) {
    case 'Accounts Management':
        $('.botsbyprocess-sec.accounts-management').show();
        $('.botsbyprocess-sec.wealth-management').hide();
        $('.botsbyprocess-sec.insurance').hide();
        $('.botsbyprocess-sec.mergers-acquisitions').hide();
        $('.botsbyprocess-sec.consumer-banking').hide();
        break;
    case 'Wealth Management':
        $('.botsbyprocess-sec.wealth-management').show();
        $('.botsbyprocess-sec.accounts-management').hide();
        $('.botsbyprocess-sec.insurance').hide();
        $('.botsbyprocess-sec.mergers-acquisitions').hide();
        $('.botsbyprocess-sec.consumer-banking').hide();
        break;
    case 'Insurance':
        $('.botsbyprocess-sec.insurance').show();
        $('.botsbyprocess-sec.wealth-management').hide();
        $('.botsbyprocess-sec.mergers-acquisitions').hide();
        $('.botsbyprocess-sec.consumer-banking').hide();
        $('.botsbyprocess-sec.accounts-management').hide();
        break;
    case 'Mergers & Acquisitions':
        $('.botsbyprocess-sec.mergers-acquisitions').show();
        $('.botsbyprocess-sec.consumer-banking').hide();
        $('.botsbyprocess-sec.accounts-management').hide();
        $('.botsbyprocess-sec.insurance').hide();
        $('.botsbyprocess-sec.wealth-management').hide();
        break;
    case 'Consumer banking':
        $('.botsbyprocess-sec.consumer-banking').show();
        $('.botsbyprocess-sec.accounts-management').hide();
        $('.botsbyprocess-sec.mergers-acquisitions').hide();
        $('.botsbyprocess-sec.insurance').hide();
        $('.botsbyprocess-sec.wealth-management').hide();
        break;
    default:
        $('.lob-sec').hide();
            $('.botsbyprocess-sec').hide();
            $('.botsbyprocess-sec2').hide();
}
  }

}
