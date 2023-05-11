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
    this.columns_list = this.columns.scheduler_process;
    this.spinner.hide();
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
      let environment:any=this.environment.find(item2=>item2.environmentId==item.environment);
     return item;
    })
    this.tabledata = response.length <= '0'  ? false: true;
    this.processschedule = response
    this.table_searchFields =[
      "processName",
      "category",
      "environmentName",
      "lastRunTS",
      "nextRunTS",
      "scheduleInterval",
      "status",
      "timezone"
    ]
    // this.processschedule = new MatTableDataSource(response);  
    // this.processschedule.paginator=this.paginator4;
    // this.processschedule.sort=this.sort4;
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

clear(table: Table) {
  table.clear();
}
}