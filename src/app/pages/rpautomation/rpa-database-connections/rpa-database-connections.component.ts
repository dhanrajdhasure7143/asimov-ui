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
    customUserRole: any;
    enableDbconnection: boolean=false;
    userRole: any;
    public isButtonVisible = false;
    
    constructor(private api:RestApiService, 
      private router:Router,
      private hints:Rpa_Hints, 
      private formBuilder: FormBuilder,
      private chanref:ChangeDetectorRef, 
      private dt:DataTransferService,
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
        portNumber: ["",  Validators.compose([Validators.required, Validators.maxLength(6)])],
        schemaName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        username: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],    
        activeStatus: [true], 
    })
  
    this.updatedbForm=this.formBuilder.group({
      connectiontName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        dataBaseType: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        databasename: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        hostAddress: ["", Validators.compose([Validators.required, Validators.pattern(ipPattern), Validators.maxLength(50)])],
        password: ["", Validators.compose([Validators.required , Validators.maxLength(50)])],
        portNumber: ["",  Validators.compose([Validators.required, Validators.maxLength(6)])],
        schemaName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        username: ["", Validators.compose([Validators.required, Validators.maxLength(50)])], 
        activeStatus: [""], 
      
    })
      this.DBupdateflag=false;
      this.DBdeleteflag=false;
      
    }

  ngOnInit() {
  //   //     document.getElementById("filters").style.display='block';
    this.dt.changeHints(this.hints.rpadbchints);
    this.getallDBConnection();
    this.passwordtype1=false;
    this.passwordtype2=false;

    this.userRole = localStorage.getItem("userRole")
    this.userRole = this.userRole.split(',');
    this.isButtonVisible = this.userRole.includes('SuperAdmin') || this.userRole.includes('Admin') || this.userRole.includes('RPA Admin') || this.userRole.includes('RPA Designer');
    
    this.api.getCustomUserRole(2).subscribe(role=>{
      this.customUserRole=role.message[0].permission;
      this.customUserRole.forEach(element => {
        if(element.permissionName.includes('RPA_DbConnection_full')){
          this.enableDbconnection=true;
        } 
      }
      );
        })
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
        this.dbconnections.sort((a,b) => a.connectionId > b.connectionId ? -1 : 1);
        this.dataSource2= new MatTableDataSource(this.dbconnections);
        setTimeout(() => {
          this.sortmethod(); 
        }, 80);
      });
    //     document.getElementById("filters").style.display='block'; 
  }

  sortmethod(){
    this.dataSource2.sort = this.sort2;   
    this.dataSource2.paginator=this.paginator2; 
  }

  DBcheckAllCheckBox(ev) {
    this.dbconnections.forEach(x =>
       x.checked = ev.target.checked);
    this.DBchecktoupdate();
    this.checktodelete();
  }
  
  createdbconnection()
  {
  //     document.getElementById("filters").style.display='none;
    document.getElementById("createdbconnection").style.display='block';
    document.getElementById("Updatedbconnection").style.display='none';
  }

  Updatedbconnection(){
  //     document.getElementById("filters").style.display='none;
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
        // Swal.fire({
        //   position: 'center',
        //   icon: 'success',
        //   title: "Successfully Connected",
        //   showConfirmButton: false,
        //   timer: 2000
        // })
        Swal.fire("Success","Successfully Connected","success")
        }else{
          // Swal.fire({
          //   position: 'center',
          //   icon: 'error',
          //   title: 'Connection Failed',
          //   showConfirmButton: false,
          //   timer: 2000
          // })
          
        Swal.fire("Error","Connection Failed","error")
        }
    });
    this.activestatus();
  }
  else
  {
    this.spinner.hide();
     alert("Invalid Form");
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
  
  

  saveDBConnection(){
    
    if(this.insertdbForm.valid)
   {
    this.spinner.show();
    if(this.insertdbForm.value.activeStatus==true)
     {
       this.insertdbForm.value.activeStatus=7
     }else{
       this.insertdbForm.value.activeStatus=8
     }

    this.insertdbForm.value.createdBy="admin";
    this.submitted=true;
    //this.insertdbForm.value.databasename = this.insertdbForm.value.dataBaseType;
    let DBConnection = this.insertdbForm.value;
    this.api.addDBConnection(DBConnection).subscribe( res =>{
      let status:any=res;
      this.spinner.hide();
    // Swal.fire({
    //         position: 'center',
    //         icon: 'success',
    //         title: status.status,
    //         showConfirmButton: false,
    //         timer: 2000
    //       })

          if(status.errorMessage==undefined)
          {
            
            Swal.fire("Success",status.status,"success")
            this.getallDBConnection();
            this.DBchecktoupdate();
            this.checktodelete();
            document.getElementById('createdbconnection').style.display= "none";
            this.resetDBForm();
            this.submitted=false;
            this.insertdbForm.get("activeStatus").setValue(true);    
          }
          else
          {
              Swal.fire("Error",status.errorMessage,"error")
          }
    });
   
  }
  else{
    alert("Invalid Form");
    this.activestatus();
  }
   }

  resetDBForm(){
    this.insertdbForm.reset();
    this.insertdbForm.get("dataBaseType").setValue("");
    this.insertdbForm.get("activeStatus").setValue(true);
  }

  resetupdateDBForm(){
    this.updatedbForm.reset();
    this.updatedbForm.get("dataBaseType").setValue("");
    this.updatedbForm.get("activeStatus").setValue(true);
  }
  
  dbconnectionupdate(){
    if(this.updatedbForm.valid)
    {
      this.spinner.show();
      if(this.updatedbForm.value.activeStatus==true)
      {
        this.updatedbForm.value.activeStatus=7
      }else{
        this.updatedbForm.value.activeStatus=8
      }
    let dbupdatFormValue =  this.updatedbForm.value;
    //dbupdatFormValue["databasename"]= this.dbupdatedata.dataBaseType;
    dbupdatFormValue["connectionId"]= this.dbupdatedata.connectionId;
    dbupdatFormValue["createdBy"]= this.dbupdatedata.createdBy;
    this.api.updateDBConnection(dbupdatFormValue).subscribe( res => {
      let status: any= res;
      this.spinner.hide();
      // Swal.fire({
      //   position: 'center',
      //   icon: 'success',
      //   title: status.status,
      //   showConfirmButton: false,
      //   timer: 2000
      // });
      if(status.errorMessage==undefined)
      {
        Swal.fire("Success",status.status,"success")
        this.removeallchecks();
        this.getallDBConnection();
        this.DBchecktoupdate();
        this.checktodelete(); 
        document.getElementById('Updatedbconnection').style.display='none';   
      }
      else
      {
        Swal.fire("Error",status.errorMessage,"error")
      }
  });
}
else
{
  alert("please fill all details");
}
  
}

updatedbdata()
  {    
  //     document.getElementById("filters").style.display='none;
    document.getElementById('Updatedbconnection').style.display='block';
    let data:any;
    for(data of this.dbconnections)
    {
      if(data.activeStatus==7){
        this.toggle=true;
        this.updatedbForm.get("activeStatus").setValue(true);
      }else{
        this.toggle=false;
        this.updatedbForm.get("activeStatus").setValue(false);
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
        break;
      }
    }
  }

  closedbconnection()
  {     
  //     document.getElementById("filters").style.display='block';
    document.getElementById('createdbconnection').style.display='none';
    document.getElementById('Updatedbconnection').style.display='none';
    this.resetDBForm();
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
          // Swal.fire({
          //   position: 'center',
          //   icon: 'success',
          //   title: status.status,
          //   showConfirmButton: false,
          //   timer: 2000    
          // });
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
    }
    this.DBcheckflag=false;
  }
}
