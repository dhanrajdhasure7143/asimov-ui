import {Component, OnInit, ViewChild, Input} from '@angular/core';
import { Table } from 'primeng/table';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import { LoaderService } from 'src/app/services/loader/loader.service';

@Component({
  selector: 'app-processes',
  templateUrl: './processes.component.html',
  styleUrls: ['./processes.component.css']
})
export class ProcessesComponent implements OnInit {

  public log:any=[];
  public tabledata: boolean = false;
  public processschedule: any = [];
  environment: any;
  enivornmentname: any;
  search:any;
  @Input("categoriesList") public categoriesList: any[] = [];
  columnList=[
    {field:"processName",DisplayName:"Process Name",ShowFilter: true,filterType:"text"},
    {field:"category",DisplayName:"Category",ShowFilter: true,filterType :"text"},
    {field:"environmentName",DisplayName:"Environment",ShowFilter: true,filterType :"text"},
    {field:"lastRunTS",DisplayName:"Previous Run",ShowFilter: true,filterType :"date"},
    {field:"nextRunTS",DisplayName:"Next Run",ShowFilter: true,filterType :"date"},
    {field:"scheduleInterval",DisplayName:"Schedule Interval",ShowFilter: true,filterType :"text"},
    {field:"status",DisplayName:"Status",ShowFilter: true,filterType :"text"},
    {field:"timezone",DisplayName:"Time Zone",ShowFilter: true,filterType :"text"},
  ];

  constructor(
      private rest:RestApiService,
      private spinner:LoaderService,
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.getEnvironmentlist();
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
     item["environmentName"]=(environment!=undefined?environment.environmentName:"--");
     return item;
    })
    this.tabledata = response.length <= '0'  ? false: true;
    this.processschedule = response
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