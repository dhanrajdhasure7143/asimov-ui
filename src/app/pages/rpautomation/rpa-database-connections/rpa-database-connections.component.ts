import { Component,  OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import {FormGroup, Validators, FormBuilder, Form } from '@angular/forms';
import Swal from 'sweetalert2';
import { RestApiService } from '../../services/rest-api.service';
import { DataTransferService} from "../../services/data-transfer.service";
import {Rpa_Hints} from "../model/RPA-Hints";
import {Router} from "@angular/router";
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { NgxSpinnerService } from "ngx-spinner";
import * as moment from 'moment';
import { RpaDatabaseFormComponent } from '../forms/rpa-database-form/rpa-database-form.component';
@Component({
  selector: 'app-rpa-database-connections',
  templateUrl: './rpa-database-connections.component.html',
  styleUrls: ['./rpa-database-connections.component.css']
})

export class RpaDatabaseConnectionsComponent implements OnInit {
  public databaselist:any;
  displayedColumns1: string[] = ["check","connectiontName","categoryName","dataBaseType","hostAddress","portNumber","username","password","databasename","schemaName","activeStatus","createdTimeStamp","createdBy"];
  public toggle:boolean;
  dataSource2:MatTableDataSource<any>;
  public dbupdateflag: boolean = false;
  public submitted:Boolean;
  public DBcheckflag:boolean = false;
  public dbupdateid : any;
  @ViewChild("paginator4",{static:false}) paginator4: MatPaginator;
  @ViewChild("sort2",{static:false}) sort2: MatSort;
  @ViewChild("rpaDatabase",{static:false}) rpaDatabase : RpaDatabaseFormComponent
  public button:string;
  public dbconnections:any=[]
  public checkeddisabled:boolean =false;
  public DBcheckeddisabled:boolean =false;
  public dbupdatedata:any;
  public insertdbForm:FormGroup;
    public updatedbForm:FormGroup;
    public DBupdateflag:Boolean;
    public DBdeleteflag:Boolean;
    public passwordtype1:Boolean;
    public passwordtype2:Boolean;
    public snowflakeflag:boolean=true;
    public categoryList:any=[];
    customUserRole: any;
    enableDbconnection: boolean=false;
    userRole: any;
    public isButtonVisible = false;
    pwdflag:boolean=false;
    addflag:boolean=false;
    isDatabase:boolean=false;
    h2flag:boolean=false;

    constructor(private api:RestApiService, 
      private router:Router,
      private hints:Rpa_Hints, 
      private dt:DataTransferService,
      private spinner: NgxSpinnerService
      ) { 
      const ipPattern = 
      "(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)";
    
      this.DBupdateflag=false;
      this.DBdeleteflag=false;
      
    }

  ngOnInit() {
    this.api.getDatabaselist().subscribe(res => {
      this.databaselist = res;
    })
    //   //     document.getElementById("filters").style.display='block';
    //this.getallDBConnection();
    this.getCategories()
    this.spinner.show();
    this.passwordtype1 = false;
    this.passwordtype2 = false;
    this.userRole = localStorage.getItem("userRole")
    this.userRole = this.userRole.split(',');
    this.isButtonVisible = this.userRole.includes('SuperAdmin') || this.userRole.includes('Admin') || this.userRole.includes('RPA Admin') || this.userRole.includes('RPA Designer')
      || this.userRole.includes('Process Owner') || this.userRole.includes('Process Architect') || this.userRole.includes('Process Analyst') || this.userRole.includes('RPA Developer') || this.userRole.includes('Process Architect') || this.userRole.includes("System Admin") || this.userRole.includes('User');

    this.api.getCustomUserRole(2).subscribe(role => {
      this.customUserRole = role.message[0].permission;
      this.customUserRole.forEach(element => {
        if (element.permissionName.includes('RPA_DbConnection_full')) {
          this.enableDbconnection = true;
        }
      }
      );
    })
  }


  async getallDBConnection() {
    this.dbconnections = [];
    await this.api.listDBConnection().subscribe(data1 => {
        if (Array.isArray(data1)) {
          this.dbconnections = data1;
          if (this.dbconnections.length > 0) {
            this.DBcheckeddisabled = false;
          }else {
            this.DBcheckeddisabled = true;
          }
          this.dbconnections.sort((a, b) => a.connectionId > b.connectionId ? -1 : 1);
          this.dbconnections = this.dbconnections.map(item => {
            item["categoryName"] = this.categoryList.find(item2 => item2.categoryId == item.categoryId).categoryName;
            item["createdTimeStamp_converted"] = moment(new Date(item.createdTimeStamp)).format('LLL')
            return item;
          })
          this.dataSource2 = new MatTableDataSource(this.dbconnections);
          setTimeout(() => {
            this.sortmethod();
          }, 80);
        }
        this.spinner.hide();
      });
  }

  sortmethod(){
    this.dataSource2.sort = this.sort2;   
    this.dataSource2.paginator=this.paginator4; 
  }

  DBcheckAllCheckBox(ev) {
    this.dbconnections.forEach(x =>
      x.checked = ev.target.checked);
    if (this.dbconnections.filter(data => data.checked == true).length == this.dbconnections.length) {
      this.DBcheckflag = true;
    } else {
      this.DBcheckflag = false;
    }
    this.DBchecktoupdate();
    this.checktodelete();
  }
  
  opencreatedbconnection(){
    this.isDatabase = true;
    document.getElementById("createdbconnection").style.display='block';
    // this.insertdbForm.get("categoryId").setValue(this.categoryList.length==1?this.categoryList[0].categoryId:"0")
    // document.getElementById("Updatedbconnection").style.display='none';
  }

  Updatedbconnection(){
    document.getElementById("createdbconnection").style.display='none';
    // document.getElementById("Updatedbconnection").style.display='block';
  }
  

  async testConnection(data){
    this.spinner.show();
    let formdata:any;
    if(data=="insert"){
      formdata=this.insertdbForm;
    }else{
      formdata=this.updatedbForm;
    }
   if(formdata.valid)
   {
    if(formdata.value.activeStatus==true)
    {
      formdata.value.activeStatus=7
    }else{
      formdata.value.activeStatus=8
    }
     await this.api.testdbconnections(formdata.value).subscribe( res =>
      {
        this.spinner.hide();
        if(res.errorMessage==undefined){
        Swal.fire("Success","Successfully Connected","success")
        }else{   
        Swal.fire("Error","Connection Failed","error")
        }
    },err=>{
      this.spinner.hide();
      Swal.fire("Error","Unable to test connection details","error")
    });
    this.activestatus();
  }
  else
  {
    this.spinner.hide();
     this.activestatus();
  }

  }

  activestatus(){
    if(this.insertdbForm.value.activeStatus == 7)
    {
      this.insertdbForm.value.activeStatus = true;
    }else{
      this.insertdbForm.value.activeStatus = false;
    }

    if(this.updatedbForm.value.activeStatus == 7)
    {
      this.updatedbForm.value.activeStatus = true;
    }else{
      this.updatedbForm.value.activeStatus = false;
    }
  }

  updatedbdata() {
    document.getElementById('createdbconnection').style.display = 'block';
    let data: any;
    this.isDatabase = false;
    for (data of this.dbconnections) {
      if (data.connectionId == this.dbupdateid) {
        this.dbupdatedata = data;
      }
    }
  }

  closedbconnection(){  
    setTimeout(()=>{
      this.rpaDatabase.resetDBForm();
    this.rpaDatabase.resetdbForm();  
    },1000) 
    document.getElementById('createdbconnection').style.display='none';
  }

  deletedbconnection(){
    const selecteddbconnection = this.dbconnections.filter(product => product.checked==true).map(p => p.connectionId);
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.api.deleteDBConnection(selecteddbconnection).subscribe( res =>{ 
          let status:any = res;
          this.spinner.hide();
          if(status.errorMessage==undefined)
          {
            Swal.fire("Success",status.status,"success")
            this.removeallchecks();
            this.getallDBConnection();
            this.DBchecktoupdate();  
            this.checktodelete();
          }                 
          else
          Swal.fire("Error",status.errorMessage,"error")

        },err=>{
          this.spinner.hide();
          Swal.fire("Error","Unable to delete database connections","error")
        });
      }
    });

  }

  DBchecktoupdate()
  {
    const selectedbdconnections = this.dbconnections.filter(product => product.checked==true);
    if(selectedbdconnections.length > 0){
      this.addflag = true;
    }else{
      this.addflag = false;
    }
    if(selectedbdconnections.length==1)
    {
      this.DBupdateflag=true;
      this.dbupdateid=selectedbdconnections[0].connectionId;
    }else
    {
      this.DBupdateflag=false;
    }
  }

  DBcheckEnableDisableBtn(id, event)
  {
    this.dbconnections.find(data=>data.connectionId==id).checked=event.target.checked;
    if(this.dbconnections.filter(data=>data.checked==true).length==this.dbconnections.length)
    {
      this.DBcheckflag=true;
    }else
    {
      this.DBcheckflag=false;  
    }
    this.DBchecktoupdate();
    this.checktodelete();
  }

  checktodelete()
  {
    const selecteddbconnection = this.dbconnections.filter(product => product.checked).map(p => p.connectionId);
    if(selecteddbconnection.length>0)
    {
      this.DBdeleteflag=true;
    }else
    {
      this.DBdeleteflag=false;
    }
  }

  applyFilter1(filterValue: string) {
    
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource2.filter = filterValue;
  }

  removeallchecks()
  {
    for(let i=0;i<this.dbconnections.length;i++)
    {
      this.dbconnections[i].checked= false;
    }
    this.DBcheckflag=false;
  }


  getCategories()
  {
    this.api.getCategoriesList().subscribe(data=>{
      let response:any=data;
      if(response.errorMessage==undefined)
      {
        this.categoryList=response.data;
        this.getallDBConnection();
      }
    })
  }

  refreshDatabaselist(ev){
    if(ev){
      this.getallDBConnection()
    }
  }
}
