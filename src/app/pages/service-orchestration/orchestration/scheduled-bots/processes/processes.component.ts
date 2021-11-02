import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { NgxSpinnerService } from "ngx-spinner";
import * as moment from 'moment';
import { RestApiService } from 'src/app/pages/services/rest-api.service';

@Component({
  selector: 'app-processes',
  templateUrl: './processes.component.html',
  styleUrls: ['./processes.component.css']
})
export class ProcessesComponent implements OnInit {

  displaycolumns: string[] = ['processName','category','environment','scheduleInterval','timezone','lastRunTS','nextRunTS','status'];
  dataSource5:MatTableDataSource<any>;
  public log:any=[];
  public tabledata: boolean = false;
  @ViewChild("paginator4",{static:false}) paginator4: MatPaginator;
  @ViewChild("sort4",{static:false}) sort4: MatSort;
  public processschedule: any = [];
  environment: any;
  enivornmentname: any;
  constructor(
      private rest:RestApiService,
      private spinner:NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.getEnvironmentlist();
    
  //  this.getEnvironmentlist();
    this.spinner.hide();
  }

  ngAfterViewInit() {
    
  }

  applyFilter2(filterValue: string) {

    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.processschedule.filter = filterValue;
    console.log(this.processschedule.filter);
    console.log(this.processschedule.filteredData.length);
    this.tabledata = this.processschedule.filteredData.length <= '0'  ? false: true;
  }

  getscheduledata(){
    this.spinner.show();
    

    this.rest.get_processes_scheduled().subscribe(data1=>{
   
    let response:any =[];
    response=data1;
    response=response.map(item=>{
      let environment:any=this.environment.find(item2=>item2.environmentId==item.environment);
     item["environmentName"]=(environment!=undefined?environment.environmentName:"--");
     return item;
    })
    this.tabledata = response.length <= '0'  ? false: true;
    this.processschedule = new MatTableDataSource(response);  
    this.processschedule.paginator=this.paginator4;
    this.processschedule.sort=this.sort4;
   //  });
     this.spinner.hide(); 
   });
  }

  getEnvironmentlist() {
    this.rest.listEnvironments().subscribe(data => {
      this.environment=data
      this.getscheduledata();
  })
}
}
