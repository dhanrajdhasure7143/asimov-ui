import { Component,  OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import {FormGroup, Validators, FormBuilder, Form } from '@angular/forms';
import Swal from 'sweetalert2';
import { RestApiService } from '../../services/rest-api.service';
import { DataTransferService} from "../../services/data-transfer.service";
import {RpaEnvHints} from "../model/rpa-environments-module-hints";
import {Router} from "@angular/router";
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-rpa-database-connections',
  templateUrl: './rpa-database-connections.component.html',
  styleUrls: ['./rpa-database-connections.component.css']
})

export class RpaDatabaseConnectionsComponent implements OnInit {
  displayedColumns1: string[] = ["check","connectiontName","dataBaseType","hostAddress","portNumber","username","password","databasename","schemaName","activeStatus","createdTimeStamp","createdBy"];
  public toggle:boolean;
  dataSource2:MatTableDataSource<any>;
  public dbupdateflag: boolean;
  public submitted:Boolean;
  public DBcheckflag:boolean = false;
  public dbupdateid : any;
  @ViewChild("paginator2",{static:false}) paginator2: MatPaginator;
  @ViewChild("sort2",{static:false}) sort2: MatSort;
  public button:string;
  public dbconnections:any=[];
  public checkeddisabled:boolean =false;
  public DBcheckeddisabled:boolean =false;
  public dbupdatedata:any;
  public insertdbForm:FormGroup;
    public updatedbForm:FormGroup;
    public DBupdateflag:Boolean;
    public DBdeleteflag:Boolean;
    public passwordtype1:Boolean;
    public passwordtype2:Boolean;
    
    constructor(private api:RestApiService, 
      private router:Router, 
      private formBuilder: FormBuilder,
      private chanref:ChangeDetectorRef, 
      private dt:DataTransferService,
      private hints:RpaEnvHints,
      private spinner: NgxSpinnerService
      ) { 
      const ipPattern = 
      "(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)";
          
      this.insertdbForm=this.formBuilder.group({
        connectiontName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        dataBaseType: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        databasename: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        hostAddress: ["", Validators.compose([Validators.required, Validators.pattern(ipPattern), Validators.maxLength(50)])],
        password: ["", Validators.compose([Validators.required , Validators.maxLength(50)])],
        portNumber: ["",  Validators.compose([Validators.required, Validators.maxLength(50), Validators.pattern("[0-9]*")])],
        schemaName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        username: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],     
    })
  
    this.updatedbForm=this.formBuilder.group({
      connectiontName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        dataBaseType: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        databasename: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        hostAddress: ["", Validators.compose([Validators.required, Validators.pattern(ipPattern), Validators.maxLength(50)])],
        password: ["", Validators.compose([Validators.required , Validators.maxLength(50)])],
        portNumber: ["",  Validators.compose([Validators.required, Validators.maxLength(50), Validators.pattern("[0-9]*")])],
        schemaName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        username: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],  
      
    })
      this.DBupdateflag=false;
      this.DBdeleteflag=false;
      
    }

  ngOnInit() {
    
    this.getallDBConnection();
    this.passwordtype1=false;
    this.passwordtype2=false;
  }

  async getallDBConnection(){
    this.dbconnections= [];
    await this.api.listDBConnection().subscribe(
      data1 => {
        this.dbconnections = data1;
        if(this.dbconnections.length>0)
         { 
           this.DBcheckeddisabled = false;
         }
         else
         {
           this.DBcheckeddisabled = true;
         }
        console.log(this.dbconnections);
        this.dbconnections.sort((a,b) => a.connectionId > b.connectionId ? -1 : 1);
        this.dataSource2= new MatTableDataSource(this.dbconnections);
        this.dataSource2.sort = this.sort2;
        this.dataSource2.paginator=this.paginator2;
      });
  }

  DBcheckAllCheckBox(ev) {
    this.dbconnections.forEach(x =>
       x.checked = ev.target.checked);
    this.DBchecktoupdate();
    this.checktodelete();
  }
  
  createdbconnection()
  {
    console.log("New button clicked"); 
    document.getElementById("createdbconnection").style.display='block';
    document.getElementById("Updatedbconnection").style.display='none';
  }

  Updatedbconnection(){
    document.getElementById("createdbconnection").style.display='none';
    document.getElementById("Updatedbconnection").style.display='block';
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
        if(res.errorCode==undefined){
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: "Successfully Connected",
          showConfirmButton: false,
          timer: 2000
        })
        }else{
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Connection Failed',
            showConfirmButton: false,
            timer: 2000
          })
        }
    });
  }
  else
  {
     alert("Invalid Form")
  }

  }
  

  saveDBConnection(){
    
    if(this.insertdbForm.valid)
   {
    console.log(this.insertdbForm.value.activeStatus)
    if(this.insertdbForm.value.activeStatus==true)
     {
       this.insertdbForm.value.activeStatus=7
     }else{
       this.insertdbForm.value.activeStatus=8
     }
     console.log(this.insertdbForm.value.activeStatus)

    this.insertdbForm.value.createdBy="admin";
    this.submitted=true;
    //this.insertdbForm.value.databasename = this.insertdbForm.value.dataBaseType;
    let DBConnection = this.insertdbForm.value;
    console.log(DBConnection);
    this.api.addDBConnection(DBConnection).subscribe( res =>{
      let status:any=res;
    Swal.fire({
            position: 'center',
            icon: 'success',
            title: status.status,
            showConfirmButton: false,
            timer: 2000
          })
          this.getallDBConnection();
          this.DBchecktoupdate();
          this.checktodelete();
          document.getElementById('createdbconnection').style.display= "none";
          this.resetDBForm();
          this.submitted=false;
      
    });
   
  }
  else{
    alert("Invalid Form");
  }
   }

  resetDBForm(){
    this.insertdbForm.reset();
  }

  resetupdateDBForm(){
    this.updatedbForm.reset();
  }
  
  dbconnectionupdate(){
    if(this.updatedbForm.valid)
    {
      console.log(this.updatedbForm.value);
      if(this.updatedbForm.value.activeStatus==true)
      {
        this.updatedbForm.value.activeStatus=7
      }else{
        this.updatedbForm.value.activeStatus=8
      }
    console.log(this.updatedbForm.value);
    let dbupdatFormValue =  this.updatedbForm.value;
    console.log(dbupdatFormValue);
    //dbupdatFormValue["databasename"]= this.dbupdatedata.dataBaseType;
    dbupdatFormValue["connectionId"]= this.dbupdatedata.connectionId;
    dbupdatFormValue["createdBy"]= this.dbupdatedata.createdBy;
    console.log(dbupdatFormValue);
    this.api.updateDBConnection(dbupdatFormValue).subscribe( res => {
      let status: any= res;
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: status.status,
        showConfirmButton: false,
        timer: 2000
      })
      console.log(res);
      this.removeallchecks();
      this.getallDBConnection();
      this.DBchecktoupdate();
      this.checktodelete();  
      document.getElementById('Updatedbconnection').style.display='none';   
  });
}
else
{
  alert("please fill all details");
}
  
}

updatedbdata()
  {    
    document.getElementById('Updatedbconnection').style.display='block';
    let data:any;
    for(data of this.dbconnections)
    {
      if(data.activeStatus==7){
        this.toggle=true;
      }else{
        this.toggle=false;
      }
      if(data.connectionId==this.dbupdateid)
      {
        this.dbupdatedata=data;
        this.updatedbForm.get("connectiontName").setValue(this.dbupdatedata["connectiontName"]);
        this.updatedbForm.get("dataBaseType").setValue(this.dbupdatedata["dataBaseType"]);
        this.updatedbForm.get("databasename").setValue(this.dbupdatedata["databasename"]);
        this.updatedbForm.get("hostAddress").setValue(this.dbupdatedata["hostAddress"]);
        this.updatedbForm.get("password").setValue(this.dbupdatedata["password"]);
        this.updatedbForm.get("portNumber").setValue(this.dbupdatedata["portNumber"]);
        this.updatedbForm.get("schemaName").setValue(this.dbupdatedata["schemaName"]);
        this.updatedbForm.get("username").setValue(this.dbupdatedata["username"]);
        console.log(this.updatedbForm.value);
        break;
      }
    }
  }

  closedbconnection()
  {     
    document.getElementById('createdbconnection').style.display='none';
    document.getElementById('Updatedbconnection').style.display='none';
    this.resetDBForm();
  }

  deletedbconnection(){
    const selecteddbconnection = this.dbconnections.filter(product => product.checked==true).map(p => p.connectionId);
    console.log(selecteddbconnection);
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
        this.api.deleteDBConnection(selecteddbconnection).subscribe( res =>{ 
          let status:any = res;
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: status.status,
            showConfirmButton: false,
            timer: 2000    
          });
          console.log(res);
          this.removeallchecks();
          this.getallDBConnection();
          this.DBchecktoupdate();  
          this.checktodelete();                 
        });
      }
    });

  }

  DBchecktoupdate()
  {
    const selectedbdconnections = this.dbconnections.filter(product => product.checked==true);
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
    console.log(event.target.checked);
    this.dbconnections.find(data=>data.connectionId==id).checked=event.target.checked;
    if(this.dbconnections.filter(data=>data.checked==true).length==this.dbconnections.length)
    {
      this.dbupdateflag=true;
    }else
    {
      this.dbupdateflag=false;  
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
      console.log(this.dbconnections[i]);
    }
    this.DBcheckflag=false;
    //console.log(this.environments);
  }
}
