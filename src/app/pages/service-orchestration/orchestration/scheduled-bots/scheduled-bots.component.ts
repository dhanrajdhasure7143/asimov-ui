import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {RestApiService} from '../../../services/rest-api.service';
import { NgxSpinnerService } from "ngx-spinner";
import * as moment from 'moment';

@Component({
  selector: 'app-scheduled-bots',
  templateUrl: './scheduled-bots.component.html',
  styleUrls: ['./scheduled-bots.component.css']
})
export class ScheduledBotsComponent implements OnInit {
  displayedblueprismcolums: string[] = ['botName','botSource','scheduleInterval','timezone','lastRunTS','nextRunTS','status'];
  dataSource5:MatTableDataSource<any>;
  public log:any=[];
  public tabledata: boolean = false;
  @ViewChild("paginator4",{static:false}) paginator4: MatPaginator;
  @ViewChild("sort4",{static:false}) sort4: MatSort;
  public blueprimslogs: any = [];
  constructor(
      private rest:RestApiService,
      private spinner:NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.viewlogdata();
    this.spinner.hide();
  }

  ngAfterViewInit() {
    
  }

  applyFilter2(filterValue: string) {

    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.blueprimslogs.filter = filterValue;
    console.log(this.blueprimslogs.filter);
    console.log(this.blueprimslogs.filteredData.length);
    this.tabledata = this.blueprimslogs.filteredData.length <= '0'  ? false: true;
  }

  viewlogdata(){
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
    this.blueprimslogs = new MatTableDataSource(this.log);  
    this.blueprimslogs.paginator=this.paginator4;
    this.blueprimslogs.sort=this.sort4;
   //  });
     this.spinner.hide(); 
   });
  }
}
