import {Component, OnInit, ViewChild, Input} from '@angular/core';
import * as moment from 'moment';
import { Table } from 'primeng/table';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import { LoaderService } from 'src/app/services/loader/loader.service';

@Component({
  selector: 'app-bots',
  templateUrl: './bots.component.html',
  styleUrls: ['./bots.component.css']
})
export class BotsComponent implements OnInit {  
  public log:any=[];
  public tabledata: boolean = false;
  public scheduledbots: any = [];
  search:any;
  @Input("categoriesList") public categoriesList: any[] = [];
  columnList=[
    {field:"botName",DisplayName:"Bot Name",ShowFilter: true,filterType:"text"},
    {field:"botSource",DisplayName:"Bot Source",ShowFilter: true,filterType:"text"},
    {field:"category",DisplayName:"Category",ShowFilter: true,filterType:"text"},
    {field:"lastRunTS",DisplayName:"Previous Run",ShowFilter: true,filterType:"date"},
    {field:"nextRunTS",DisplayName:"Next Run",ShowFilter: true,filterType:"date"},
    {field:"scheduleInterval",DisplayName:"Schedule Interval",ShowFilter: true,filterType:"text"},
    {field:"status",DisplayName:"Status",ShowFilter: true,filterType:"text"},
    {field:"timezone",DisplayName:"Time Zone",ShowFilter: true,filterType:"text"},
  ];

  constructor(
      private rest:RestApiService,
      private spinner:LoaderService,
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.getSchedulebots();
    this.spinner.hide();
  }

  ngAfterViewInit() {
    
  }

  applyFilter2(filterValue: string) {

    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.scheduledbots.filter = filterValue;
   
    this.tabledata = this.scheduledbots.filteredData.length <= '0'  ? false: true;
  }

  getSchedulebots(){
    this.spinner.show();
    function getdate(value,type){
      let currentdate=new Date();
      (type == "1") ? currentdate.setDate(currentdate.getDate() + value) : currentdate.setDate(currentdate.getDate() - value);
      return moment(currentdate).format('DD-MM-YYYY');
    }

    this.rest.get_scheduled_bots().subscribe(data1=>{
    //  let data= [
    //   {botName:'Send_Test_Mail', botSource:'Blueprism',lastRunTS:(getdate(1,"0"))+' 11:00',nextRunTS:(getdate(1,"1"))+' 11:00',scheduleInterval:'Every 2 Days',status:'Success',timezone:'Asia/Kolkata'},
    //    {botName:'SLA_Test_Bot', botSource:'EPSoft',lastRunTS: (getdate(0,"0"))+' 18:30',nextRunTS:(getdate(1,"1"))+' 18:30',scheduleInterval:'Every Day',status:'Success',timezone:'UTC'},
    //    {botName:'RetryConfig', botSource:'EPSoft',lastRunTS: (getdate(2,"0"))+' 12:15',nextRunTS:(getdate(2,"1"))+' 12:15',scheduleInterval:'Every 4 Days',status:'Success',timezone:'GMT'},
    //    {botName:'TestMail', botSource:'UiPath',lastRunTS: (getdate(1,"0"))+' 13:00',nextRunTS:(getdate(1,"1"))+' 13:00',scheduleInterval:'Every 2 Days',status:'Success',timezone:'UTC'},
    //    {botName:'Test-Mail', botSource:'BluePrism',lastRunTS: (getdate(2,"0"))+' 07:00',nextRunTS:(getdate(2,"1"))+' 07:00',scheduleInterval:'Every 4 Days',status:'Failure',timezone:'UTC'},
    //    {botName:'Invoice-Payment', botSource:'EPSoft',lastRunTS: (getdate(0,"0"))+' 02:00',nextRunTS:(getdate(1,"1"))+' 02:00',scheduleInterval:'Every Day',status:'Failure',timezone:'GMT'},
    //    {botName:'Invoice-Check', botSource:'EPSoft',lastRunTS: (getdate(0,"0"))+' 21:00',nextRunTS:(getdate(1,"1"))+' 21:00',scheduleInterval:'Every Day',status:'Success',timezone:'Asia/Kolkata'},
    //  ];
    this.log  = data1;
    this.tabledata = this.log.length <= '0'  ? false: true;
    this.scheduledbots = this.log
    // this.scheduledbots = new MatTableDataSource(this.log);  
    // this.scheduledbots.paginator=this.paginator4;
    // this.scheduledbots.sort=this.sort4;
   //  });
     this.spinner.hide(); 
   });
  }
  
  clear(table: Table) {
    table.clear();
  }
}