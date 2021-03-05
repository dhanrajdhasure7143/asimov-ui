import { Component, ViewChild, OnInit } from '@angular/core';
import {RestApiService} from '../../../services/rest-api.service';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-new-so-management',
  templateUrl: './new-so-management.component.html',
  styleUrls: ['./new-so-management.component.css']
})
export class NewSoManagementComponent implements OnInit {
  url: string = "http://10.11.0.129:8080/knowage/servlet/AdapterHTTP?ACTION_NAME=EXECUTE_DOCUMENT_ACTION&OBJECT_LABEL=Incident_Mngmt Tab&TOOLBAR_VISIBLE=false&ORGANIZATION=DEMO&NEW_SESSION=false";
  urlSafe: SafeResourceUrl;
  constructor(
    private rest:RestApiService,
    private spinner:NgxSpinnerService,public sanitizer: DomSanitizer
  ) { }



  displayedColumns: string[] = [
  "incidentId",
  "short_description" ,
  "description",
  "createdAt",
  "incidentStatus",
  "assignedTo"
];
  @ViewChild("paginator1",{static:false}) paginator1: MatPaginator;
  @ViewChild("sort1",{static:false}) sort1: MatSort;
  dataSource1:any;
  isTableHasData:Boolean=false;
  nodata:Boolean=false;
  ngOnInit(){
    this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    //this.gettickets();
  }



  gettickets()
  {
    this.spinner.show();
    this.rest.getincidenttickets().subscribe(data=>{
      let response:any=data;
      if(response.errorMessage==undefined)
      {
        this.dataSource1= new MatTableDataSource(response);

        this.dataSource1.paginator=this.paginator1;
        this.dataSource1.sort=this.sort1;
        this.isTableHasData=true;
        this.nodata=true;
       this.spinner.hide();
      }
      else
      {
        this.spinner.hide();
        this.nodata=true;
        Swal.fire(response.errorMessage,"","error")
      }
    })
  }



  applyFilter2(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource1.filter = filterValue;
  }
}
