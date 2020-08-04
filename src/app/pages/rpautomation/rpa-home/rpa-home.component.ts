
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {RestApiService} from '../../services/rest-api.service';
import {RpaStudioComponent} from '../rpa-studio/rpa-studio.component';
import { id } from '@swimlane/ngx-charts/release/utils';
@Component({
  selector: 'app-rpa-home',
  templateUrl: './rpa-home.component.html',
  styleUrls: ['./rpa-home.component.css']
})
export class RpaHomeComponent implements OnInit {

  displayedColumns: string[] = ["botName","botType","department","botStatus"];
  dataSource:MatTableDataSource<any>;
  public isDataSource: boolean;  
  public userRole:any = [];
  public isButtonVisible = false;
  @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
  @ViewChild(MatSort,{static:false}) sort: MatSort;
  
  constructor(private rest:RestApiService, private rpa_studio:RpaStudioComponent)
  { }
  ngOnInit() {

    this.userRole = localStorage.getItem("userRole")
    
    if(this.userRole.includes('SuperAdmin')){
      this.isButtonVisible = true;
    }else if(this.userRole.includes('Admin')){
      this.isButtonVisible = true;
    }else if(this.userRole.includes('RPA Admin')){
      this.isButtonVisible = true;
    }else{
      this.isButtonVisible = false;
    }


    this.getallbots();
 }
  
  

  ngAfterViewInit() {
   
  }


  getallbots()
  {
    let response:any=[];
    this.rest.getAllActiveBots().subscribe(botlist =>
    {
      response=botlist;
      this.dataSource= new MatTableDataSource(response);
      this.isDataSource = true;
      console.log(response)
      this.dataSource.sort=this.sort;
      this.dataSource.paginator=this.paginator;
    })
  }


  createoverlay()
  {
   
    this.rpa_studio.onCreate();
    //document.getElementById("create-bot").style.display ="block";
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


  loadbotdata(botId)
  {
    this.rpa_studio.getloadbotdata(botId);
  }

}
