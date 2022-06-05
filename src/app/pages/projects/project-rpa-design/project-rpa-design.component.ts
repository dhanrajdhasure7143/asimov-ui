import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestApiService } from '../../services/rest-api.service';

@Component({
  selector: 'app-project-rpa-design',
  templateUrl: './project-rpa-design.component.html',
  styleUrls: ['./project-rpa-design.component.css']
})
export class ProjectRpaDesignComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  data:any=[];

  displayedColumns: string[] = ['sNo', 'steps', 'description', 'configuration',  'Action'];

  dataSource: MatTableDataSource<any[]>;

  constructor() { }

  ngOnInit(): void {
    this.data = [
      {steps:"Login to Satuit",description:"Testing Description", configuration:"a.testing"}
    ]
    this.dataSource = new MatTableDataSource(this.data);
  }

  onAddRow(){
    let data1 =  {steps:"",description:"", configuration:""}
    this.data.push(data1)
    this.dataSource = new MatTableDataSource(this.data);
  }

}
