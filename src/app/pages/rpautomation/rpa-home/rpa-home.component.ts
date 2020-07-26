
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {RestApiService} from '../../services/rest-api.service';
@Component({
  selector: 'app-rpa-home',
  templateUrl: './rpa-home.component.html',
  styleUrls: ['./rpa-home.component.css']
})
export class RpaHomeComponent implements OnInit {

  displayedColumns: string[] = ["botName","botType","department","botStatus"];
  dataSource:MatTableDataSource<any>;
  public isDataSource: boolean;  
  @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
  @ViewChild(MatSort,{static:false}) sort: MatSort;
  
  constructor(private rest:RestApiService)
  { }
  ngOnInit() {
    this.getallbots();
 
  }
  

  ngAfterViewInit() {
   
  }


  getallbots()
  {
    let response:any=[];
    this.rest.getbotlist(1,1).subscribe(botlist =>
    {
      response=botlist;
      this.dataSource= new MatTableDataSource(response);
      this.isDataSource = true;
      console.log(response)
      this.dataSource.sort=this.sort;
      this.dataSource.paginator=this.paginator;
    })
  }

  onCreate(){}


  opencreate()
  {
    document.getElementById("create-bot").style.display ="block";
  }

  openload()
  {
    document.getElementById("load-bot").style.display ="block";
  }


  close()
  {
    document.getElementById("create-bot").style.display ="none";
    
    document.getElementById("load-bot").style.display ="none";

  }

}
