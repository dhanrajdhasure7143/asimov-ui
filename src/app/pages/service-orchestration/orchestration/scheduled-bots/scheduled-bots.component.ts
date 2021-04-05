import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {RestApiService} from '../../../services/rest-api.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-scheduled-bots',
  templateUrl: './scheduled-bots.component.html',
  styleUrls: ['./scheduled-bots.component.css']
})
export class ScheduledBotsComponent implements OnInit {
  displayedblueprismcolums: string[] = ['botName','scheduleInterval','timezone','lastRunTS','nextRunTS','status'];
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
    this.rest.get_scheduled_bots().subscribe(data=>{
    this.log  = data;
    this.tabledata = this.log.length <= '0'  ? false: true;
    console.log(this.tabledata); 
    this.blueprimslogs = new MatTableDataSource(this.log);  
    this.blueprimslogs.paginator=this.paginator4;
    this.blueprimslogs.sort=this.sort4;
     });
     this.spinner.hide(); 
   }
}
