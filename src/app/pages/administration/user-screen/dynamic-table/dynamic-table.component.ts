import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RestApiService } from 'src/app/pages/services/rest-api.service';



@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.css']
})
export class DynamicTableComponent implements OnInit {

  @Input()tableDataInput:any;
  @Input()selectedScreen:any;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  @Output("onDelete") deleteEvent:any= new EventEmitter<any>();
  @Output("onEdit") editEvent:any= new EventEmitter<any>();
  columnNames:any[]=[];
  dataSource:MatTableDataSource<any>;
  screenData: any =[];
  allowedit:boolean =false
  constructor(
    private rest: RestApiService,
  ) { }
  i: any;
  tablename1:any;
  finaldatasource: any = [];
  loading:boolean = false;

  ngOnInit(): void {
    this.loading = true;
  }
  
  ngOnChanges() {
    this.rest.getConnectionNames().subscribe((data:any)=>{
      this.tablename1=data
    })
    this.loading = true;
    this.columnNames =[];
    this.tableDataInput = this.tableDataInput.map((item: any) => {
      item["actions"] = "actions";
      return item;
    });
    setTimeout(() => {
      if(this.tableDataInput.length!=0){
        this.columnNames = Object.keys(this.tableDataInput[0]);
        this.columnNames.shift();
      }  
      this.dataSource = new MatTableDataSource(this.tableDataInput);
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;  
          this.dataSource.sort = this.sort;      
          this.loading = false; 
        }, 500);      
      }, 500);
      
}

ngAfterViewInit(){

 
 
}
  
  edit(rowData:any)
  {
    this.editEvent.emit(rowData);
  }
  
  delete(rowData: any) {
   this.deleteEvent.emit(rowData)     
  }
  onChangeTableName(connectionname1:any){
  
    this.rest.getconnectionActiontypes(connectionname1.value).subscribe((data:any)=>{
      this.tableDataInput=data;
      this.tableDataInput = this.tableDataInput.map((item: any) => {
        item["actions"] = "actions";
        return item;
      });
      
        if(this.tableDataInput.length!=0){
          this.columnNames = Object.keys(this.tableDataInput[0]);
          this.columnNames.shift();
        }  
        this.dataSource = new MatTableDataSource(this.tableDataInput);
            this.dataSource.paginator = this.paginator;  
            this.dataSource.sort = this.sort;      
            this.loading = false; 
           
      
     
    })
  
  }
  
}
