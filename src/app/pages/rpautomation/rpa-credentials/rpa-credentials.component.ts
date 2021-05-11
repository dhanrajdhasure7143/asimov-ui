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
  selector: 'app-rpa-credentials',
  templateUrl: './rpa-credentials.component.html',
  styleUrls: ['./rpa-credentials.component.css']
})
export class RpaCredentialsComponent implements OnInit {
  displayedColumns1: string[] = ["check","userName","password","createdTimeStamp","createdBy"];
  public toggle:boolean;
  dataSource2:MatTableDataSource<any>;
  public updateflag: boolean;
  public submitted:Boolean;
  public Credcheckflag:boolean = false;
  public dbupdateid : any;
  @ViewChild("paginator2",{static:false}) paginator2: MatPaginator;
  @ViewChild("sort2",{static:false}) sort2: MatSort;
  public button:string;
  public credentials:any=[];
  public checkeddisabled:boolean =false;
  public Credcheckeddisabled:boolean =false;
  public dbupdatedata:any;
  public insertForm:FormGroup;
    public updateForm:FormGroup;
    public Credupdateflag:Boolean;
    public Creddeleteflag:Boolean;
    public passwordtype1:Boolean;
    public passwordtype2:Boolean;
    customUserRole: any;
    enableCredential: boolean=false;
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
          
      this.insertForm=this.formBuilder.group({
        userName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        password: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    })
  
    this.updateForm=this.formBuilder.group({
        userName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        password: ["", Validators.compose([Validators.required , Validators.maxLength(50)])],
    })
      this.Credupdateflag=false;
      this.Creddeleteflag=false;
      
    }

  ngOnInit() {
    document.getElementById("filters").style.display='block';
    this.dt.changeHints(this.hints.rpadbchints);
    this.getallCredentials();
    this.passwordtype1=false;
    this.passwordtype2=false;

    this.userRole = localStorage.getItem("userRole")
    this.userRole = this.userRole.split(',');
    this.isButtonVisible = this.userRole.includes('SuperAdmin') || this.userRole.includes('Admin') || this.userRole.includes('RPA Admin') || this.userRole.includes('RPA Designer');
    
    this.api.getCustomUserRole(2).subscribe(role=>{
      this.customUserRole=role.message[0].permission;
      this.customUserRole.forEach(element => {
        if(element.permissionName.includes('RPA_DbConnection_full')){
          this.enableCredential=true;
        } 
      }
      );
        })
  }

  async getallCredentials(){
    this.credentials= [];
    await this.api.getAllCredentials().subscribe(
      data1 => {
        this.credentials = data1;
        if(this.credentials.length>0)
         { 
           this.Credcheckeddisabled = false;
         }
         else
         {
           this.Credcheckeddisabled = true;
         }
        this.credentials.sort((a,b) => a.credentialId > b.credentialId ? -1 : 1);
        this.dataSource2= new MatTableDataSource(this.credentials);
        setTimeout(() => {
          this.sortmethod(); 
        }, 80);
      });
      document.getElementById("filters").style.display='block'; 
  }

  sortmethod(){
    this.dataSource2.sort = this.sort2;   
    this.dataSource2.paginator=this.paginator2; 
  }

  CredcheckAllCheckBox(ev) {
    this.credentials.forEach(x =>
       x.checked = ev.target.checked);
    this.Credchecktoupdate();
    this.checktodelete();
  }
  
  createcredentials()
  {
    document.getElementById("filters").style.display='none';
    document.getElementById("createcredentials").style.display='block';
    document.getElementById("Updatecredntials").style.display='none';
  }

  Updatecredntials(){
    document.getElementById("filters").style.display='none';
    document.getElementById("createcredentials").style.display='none';
    document.getElementById("Updatecredntials").style.display='block';
  }
  

  saveCredentials(){
    
    if(this.insertForm.valid)
   {
    this.spinner.show();
    this.insertForm.value.createdBy="admin";
    this.submitted=true;
    let Credentials = this.insertForm.value;
    this.api.save_credentials(Credentials).subscribe( res =>{
      let status:any=res;
      this.spinner.hide();
    Swal.fire({
            position: 'center',
            icon: 'success',
            title: status.status,
            showConfirmButton: false,
            timer: 2000
          })
          this.getallCredentials();
          this.Credchecktoupdate();
          this.checktodelete();
          document.getElementById('createcredentials').style.display= "none";
          this.resetCredForm();
          this.submitted=false; 
    });
   
  }
  else{
    alert("Invalid Form");
  }
   }

  resetCredForm(){
    this.insertForm.reset();
  }

  resetupdateCredForm(){
    this.updateForm.reset();
  }
  
  credentialsupdate(){
    if(this.updateForm.valid)
    {
      this.spinner.show();
    let dbupdatFormValue =  this.updateForm.value;
    dbupdatFormValue["connectionId"]= this.dbupdatedata.connectionId;
    dbupdatFormValue["createdBy"]= this.dbupdatedata.createdBy;
    this.api.updateDBConnection(dbupdatFormValue).subscribe( res => {
      let status: any= res;
      this.spinner.hide();
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: status.status,
        showConfirmButton: false,
        timer: 2000
      });
      this.removeallchecks();
      this.getallCredentials();
      this.Credchecktoupdate();
      this.checktodelete(); 
      document.getElementById('Updatecredntials').style.display='none';   
  });
}
else
{
  alert("please fill all details");
}
  
}

updatecreddata()
  {    
    document.getElementById("filters").style.display='none';
    document.getElementById('Updatecredntials').style.display='block';
    let data:any;
    for(data of this.credentials)
    {
      if(data.credentialId==this.dbupdateid)
      {
        this.dbupdatedata=data;
        this.updateForm.get("userName").setValue(this.dbupdatedata["userName"]);
        this.updateForm.get("password").setValue(this.dbupdatedata["password"]);
        break;
      }
    }
  }

  closecredentials()
  {     
    document.getElementById("filters").style.display='block';
    document.getElementById('createcredentials').style.display='none';
    document.getElementById('Updatecredntials').style.display='none';
    this.resetCredForm();
  }

  deleteCredentials(){
    const selecteddbconnection = this.credentials.filter(product => product.checked==true).map(p => p.connectionId);
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
          this.removeallchecks();
          this.getallCredentials();
          this.Credchecktoupdate();  
          this.checktodelete();                 
        });
      }
    });

  }

  Credchecktoupdate()
  {
    const selectedbdconnections = this.credentials.filter(product => product.checked==true);
    if(selectedbdconnections.length==1)
    {
      this.Credupdateflag=true;
      this.dbupdateid=selectedbdconnections[0].credentialId;
    }else
    {
      this.Credupdateflag=false;
    }
  }

  CredcheckEnableDisableBtn(id, event)
  {
    this.credentials.find(data=>data.credentialId==id).checked=event.target.checked;
    if(this.credentials.filter(data=>data.checked==true).length==this.credentials.length)
    {
      this.updateflag=true;
    }else
    {
      this.updateflag=false;  
    }
    this.Credchecktoupdate();
    this.checktodelete();
  }

  checktodelete()
  {
    const selecteddbconnection = this.credentials.filter(product => product.checked).map(p => p.connectionId);
    if(selecteddbconnection.length>0)
    {
      this.Creddeleteflag=true;
    }else
    {
      this.Creddeleteflag=false;
    }
  }

  applyFilter1(filterValue: string) {
    
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource2.filter = filterValue;
  }

  removeallchecks()
  {
    for(let i=0;i<this.credentials.length;i++)
    {
      this.credentials[i].checked= false;
    }
    this.Credcheckflag=false;
  }
}
