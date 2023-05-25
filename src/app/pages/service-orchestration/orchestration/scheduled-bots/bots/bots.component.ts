import {Component, OnInit, ViewChild, Input} from '@angular/core';
import * as moment from 'moment';
import { Table } from 'primeng/table';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { columnList } from 'src/app/shared/model/table_columns';

@Component({
  selector: 'app-bots',
  templateUrl: './bots.component.html',
  styleUrls: ['./bots.component.css'],
  providers: [columnList]
})
export class BotsComponent implements OnInit {  
  public log:any=[];
  public tabledata: boolean = false;
  public scheduledbots: any = [];
  search:any;
  @Input("categoriesList") public categoriesList: any[] = [];
  columns_list:any[]=[];
  table_searchFields: any=[];

  constructor(
      private rest:RestApiService,
      private spinner:LoaderService,
      private columns:columnList
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.getSchedulebots();
    this.columns_list = this.columns.schedulerBots_column
  }

  ngOnChanges(){
    let categories_list=[];
    this.categoriesList.forEach(element => {
      categories_list.push(element.categoryName)
    });
    this.columns_list.map(item=>{
      if(item.ColumnName === "category"){
        item["dropdownList"]=categories_list
      }
    })
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
    this.rest.get_scheduled_bots().subscribe(data1=>{
    this.log  = data1;
    this.tabledata = this.log.length <= '0'  ? false: true;
    this.scheduledbots = this.log
    this.scheduledbots.map(item=>{
      item.lastRunTS=item.lastRunTS?(item.lastRunTS!= "00:00"?new Date(item.lastRunTS):null):null;
      item.nextRunTS=item.nextRunTS?(item.nextRunTS!="00:00"?new Date(item.nextRunTS):null):null;
      return item
    });
    this.table_searchFields = ["botName","botSource","category","lastRunTS","nextRunTS","scheduleInterval","status","timezone"];
     this.spinner.hide(); 
   },err=>{
    this.spinner.hide();
   });
  }
  
  clear(table: Table) {
    table.clear();
  }
}