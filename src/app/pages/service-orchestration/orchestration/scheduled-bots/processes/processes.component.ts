import {Component, OnInit, ViewChild, Input} from '@angular/core';
import { Table } from 'primeng/table';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { columnList } from 'src/app/shared/model/table_columns';

@Component({
  selector: 'app-processes',
  templateUrl: './processes.component.html',
  styleUrls: ['./processes.component.css'],
  providers:[columnList]
})
export class ProcessesComponent implements OnInit {

  public log:any=[];
  public tabledata: boolean = false;
  public processschedule: any = [];
  environment: any;
  enivornmentname: any;
  search:any;
  columns_list:any[]=[];
  table_searchFields: any=[];
  @Input("categoriesList") public categoriesList: any[] = [];
  

  constructor(
      private rest:RestApiService,
      private spinner:LoaderService,
      private columns:columnList
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.getEnvironmentlist();
    this.columns_list = this.columns.schedulerProcess_column;
    this.spinner.hide();
  }

  ngOnChanges(){
    let categories_list=[];
    this.categoriesList.forEach(element => {
      categories_list.push(element.categoryName)
    });
    setTimeout(() => {
      this.columns_list.map(item=>{
        if(item.ColumnName === "category"){
          item["dropdownList"]=categories_list;
        }
      });
    }, 1000);
  }

  ngAfterViewInit() {
    
  }

  applyFilter2(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.processschedule.filter = filterValue;
    this.tabledata = this.processschedule.filteredData.length <= '0'  ? false: true;
  }

  getscheduledata(){
    this.spinner.show();
    this.rest.get_processes_scheduled().subscribe(data1=>{
    let response:any =[];
    response=data1;
    response=response.map(item=>{
      // let environment:any=this.environment.find(item2=>item2.environmentId==item.environment);
      if(item.status == "Resumed")item.status= "Stopped"
      if(item.status == "Resume")item.status= "Stopped"
      if(item.status == "Stop")item.status= "Stopped"
      item.lastRunTS=item.lastRunTS?item.lastRunTS.length>5?new Date(item.lastRunTS):null:null;
      item.nextRunTS=item.nextRunTS?item.nextRunTS.length>5?new Date(item.nextRunTS):null:null;
     return item;
    })

    this.tabledata = response.length <= '0'  ? false: true;
    this.processschedule = response
    this.table_searchFields =["processName","category","environmentName","lastRunTS","nextRunTS","scheduleInterval","status","timezone"]
    this.spinner.hide(); 
   },err=>{
    this.spinner.hide(); 
   });
  }

  getEnvironmentlist() {
    this.rest.listEnvironments().subscribe(data => {
      this.environment=data
      this.getscheduledata();
  })
}

clear(table: Table) {
  table.clear();
}
}