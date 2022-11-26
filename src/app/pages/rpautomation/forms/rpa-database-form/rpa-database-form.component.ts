import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTransferService } from 'src/app/pages/services/data-transfer.service';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import Swal from 'sweetalert2';
import { Rpa_Hints } from '../../model/RPA-Hints';

@Component({
  selector: 'app-rpa-database-form',
  templateUrl: './rpa-database-form.component.html',
  styleUrls: ['./rpa-database-form.component.css']
})
export class RpaDatabaseFormComponent implements OnInit {

  @Input() isDatabase : boolean;
  @Input() dbupdatedata : any = [];
  @Output() refreshData = new EventEmitter<any>();
  public databaselist:any;
  public toggle:boolean;
  public dbupdateflag: boolean = false;
  public submitted:Boolean;
  public dbupdateid : any;
 
  public button:string;
  public dbconnections:any=[]
  public checkeddisabled:boolean =false;
  public DBcheckeddisabled:boolean =false;
  public dbForm:FormGroup;
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
    h2flag:boolean=false;

  constructor(private api:RestApiService, 
    private router:Router,
    private hints:Rpa_Hints, 
    private formBuilder: FormBuilder,
    private chanref:ChangeDetectorRef, 
    private dt:DataTransferService,
    private spinner: NgxSpinnerService) { 
          
      this.dbForm=this.formBuilder.group({
        connectiontName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        dataBaseType: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        databasename: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        hostAddress: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        categoryId:["0", Validators.compose([Validators.required])],
        password: ["", Validators.compose([Validators.required , Validators.maxLength(50)])],
        portNumber: ["",  Validators.compose([Validators.required, Validators.maxLength(6)])],
        schemaName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        username: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        role:["",Validators.compose([Validators.maxLength(50)])],
        warehouse:["",Validators.compose([Validators.maxLength(50)])],
        activeStatus: [true], 
    })
    }

  ngOnInit(): void {
    this.spinner.show();
    this.api.getDatabaselist().subscribe(res=>{
      this.databaselist=res;
    })
    this.getCategories()
    this.passwordtype1=false;
    this.passwordtype2=false;
  }

  ngOnChanges(changes : SimpleChanges){
     if(!this.isDatabase){    
      if(this.dbupdatedata){
      this.dbForm.get("connectiontName").setValue(this.dbupdatedata["connectiontName"]);
      this.dbForm.get("categoryId").setValue(this.dbupdatedata["categoryId"]);      
      this.dbForm.get("dataBaseType").setValue(this.dbupdatedata["dataBaseType"]);  
      if(this.dbupdatedata.activeStatus==7){
        this.dbForm.get("activeStatus").setValue(true);
      }else{
        this.dbForm.get("activeStatus").setValue(false);
      }
      if(this.dbupdatedata["dataBaseType"]=='PostgreSQL'){
        this.snowflakeflag=false;
        this.h2flag=false;
        this.pwdflag=false;
        this.dbForm.controls.portNumber.setValidators([Validators.required,Validators.maxLength(6)]);
        this.dbForm.controls.password.setValidators([Validators.required,Validators.maxLength(50)]);
        this.dbForm.controls.schemaName.setValidators([Validators.required,Validators.maxLength(50)]);
        this.dbForm.controls.portNumber.updateValueAndValidity();
        this.dbForm.controls.password.updateValueAndValidity()
        this.dbForm.controls.schemaName.updateValueAndValidity()
      }else if(this.dbupdatedata["dataBaseType"]=='Snowflake'){
        this.snowflakeflag=true;
        this.pwdflag=false;
        this.h2flag=false;
        this.dbForm.controls.portNumber.clearValidators();
        this.dbForm.controls.portNumber.updateValueAndValidity()
      }else if(this.dbupdatedata["dataBaseType"]=='H2')   {
        this.pwdflag=true;
        this.h2flag=true;
        this.snowflakeflag=false;
        this.dbForm.controls.password.clearValidators();
        this.dbForm.controls.password.updateValueAndValidity();
        this.dbForm.controls.schemaName.clearValidators();
        this.dbForm.controls.schemaName.updateValueAndValidity();
        this.dbForm.controls.warehouse.clearValidators();
        this.dbForm.controls.warehouse.updateValueAndValidity();
        this.dbForm.controls.role.clearValidators();
        this.dbForm.controls.role.updateValueAndValidity();
      }
      this.dbForm.get("databasename").setValue(this.dbupdatedata["databasename"]);        
      this.dbForm.get("hostAddress").setValue(this.dbupdatedata["hostAddress"]);      
      this.dbForm.get("password").setValue(this.dbupdatedata["password"]);
      this.dbForm.get("portNumber").setValue(this.dbupdatedata["portNumber"]);
      this.dbForm.get("schemaName").setValue(this.dbupdatedata["schemaName"]);
      this.dbForm.get("username").setValue(this.dbupdatedata["username"]);
      this.dbForm.get("role").setValue(this.dbupdatedata["role"]);
      this.dbForm.get("warehouse").setValue(this.dbupdatedata["warehouse"]);
    }
     }else{
      this.dbForm=this.formBuilder.group({
        connectiontName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        dataBaseType: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        databasename: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        hostAddress: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        categoryId:["0", Validators.compose([Validators.required])],
        password: ["", Validators.compose([Validators.required , Validators.maxLength(50)])],
        portNumber: ["",  Validators.compose([Validators.required, Validators.maxLength(6)])],
        schemaName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        username: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        role:["",Validators.compose([Validators.maxLength(50)])],
        warehouse:["",Validators.compose([Validators.maxLength(50)])],
        activeStatus: [true], 
    });
     }
  }

  async testConnection(data) {
    this.spinner.show();
    let formdata: any;
    if (data == "insert") {
      formdata = this.dbForm;
    } else {
      formdata = this.dbForm;
    }
    if (formdata.valid) {
      if (formdata.value.activeStatus == true) {
        formdata.value.activeStatus = 7
      } else {
        formdata.value.activeStatus = 8
      }
      await this.api.testdbconnections(formdata.value).subscribe(res => {
        this.spinner.hide();
        if (res.errorMessage == undefined) {
          Swal.fire("Success", "Successfully Connected", "success")
        } else {
          Swal.fire("Error", "Connection Failed", "error")
        }
      }, err => {
        this.spinner.hide();
        Swal.fire("Error", "Unable to test connection details", "error")
      });
      this.activestatus();
    }
    else {
      this.spinner.hide();
      this.activestatus();
    }
  }

  activestatus() {
    if (this.dbForm.value.activeStatus == 7) {
      this.dbForm.value.activeStatus = true;
    } else {
      this.dbForm.value.activeStatus = false;
    }
    if (this.dbForm.value.activeStatus == 7) {
      this.dbForm.value.activeStatus = true;
    } else {
      this.dbForm.value.activeStatus = false;
    }
  }
  
  saveDBConnection() {
    if (this.isDatabase) {
      if (this.dbForm.valid) {
        this.spinner.show();
        if (this.dbForm.value.activeStatus == true) {
          this.dbForm.value.activeStatus = 7
        } else {
          this.dbForm.value.activeStatus = 8
        }
        this.dbForm.value.createdBy = "admin";
        this.submitted = true;
        let DBConnection = this.dbForm.value;
        this.api.addDBConnection(DBConnection).subscribe(res => {
          let status: any = res;
          this.spinner.hide();
          this.refreshData.emit(true)
          if (status.errorMessage == undefined) {
            Swal.fire("Success", status.status, "success")
            document.getElementById('createdbconnection').style.display = "none";
            this.resetDBForm();
            this.submitted = false;
            this.dbForm.get("activeStatus").setValue(true);
          } else {
            this.submitted = false
            Swal.fire("Error", status.errorMessage, "error")
          }
        }, err => {
          this.spinner.hide();
          this.submitted = false;
          Swal.fire("Error", "Unable to save database connections", "error")
        });
      } else {
        this.activestatus();
      }
    } else {
      this.dbconnectionupdate()
    }
  }

  resetDBForm(){
    this.dbForm.reset();
    this.dbForm.get("dataBaseType").setValue("");
    this.dbForm.get("categoryId").setValue(this.categoryList.length==1?this.categoryList[0].categoryId:'0')
    this.dbForm.get("activeStatus").setValue(true);
    this.passwordtype1=false;
  }
  
  dbconnectionupdate() {
    if (this.dbForm.valid) {
      this.spinner.show();
      if (this.dbForm.value.activeStatus == true) {
        this.dbForm.value.activeStatus = 7
      } else {
        this.dbForm.value.activeStatus = 8
      }
      let dbupdatFormValue = this.dbForm.value;
      dbupdatFormValue["connectionId"] = this.dbupdatedata.connectionId;
      dbupdatFormValue["createdBy"] = this.dbupdatedata.createdBy;
      this.api.updateDBConnection(dbupdatFormValue).subscribe(res => {
        let status: any = res;
        this.spinner.hide();
        this.refreshData.emit(true)
        if (status.errorMessage == undefined) {
          Swal.fire("Success", status.status, "success")
          document.getElementById('Updatedbconnection').style.display = 'none';
        } else {
          Swal.fire("Error", status.errorMessage, "error")
        }
      }, err => {
        this.spinner.hide();
        Swal.fire("Error", "Unable to update database connection details", "error")
      });
    }
  }

  getCategories(){
    this.api.getCategoriesList().subscribe(data=>{
      let response:any=data;
      if(response.errorMessage==undefined){
        this.categoryList=response.data;
      }
    })
  }

  changeDatabaseType(event){
    if(event.target.value=='Snowflake'){
      this.snowflakeflag=true;
      this.pwdflag=false;
      this.h2flag=false;
      this.dbForm.controls.portNumber.clearValidators();
      this.dbForm.controls.portNumber.updateValueAndValidity()
    }
    else if(event.target.value=='H2'){
     this.pwdflag=true;
     this.h2flag=true;
     this.snowflakeflag=false;
     //this.dbForm.controls.portNumber.clearValidators();
     //this.dbForm.controls.portNumber.updateValueAndValidity();
     this.dbForm.controls.password.clearValidators();
     this.dbForm.controls.password.updateValueAndValidity();
     this.dbForm.controls.schemaName.clearValidators();
     this.dbForm.controls.schemaName.updateValueAndValidity();
     this.dbForm.controls.warehouse.clearValidators();
     this.dbForm.controls.warehouse.updateValueAndValidity();
     this.dbForm.controls.role.clearValidators();
     this.dbForm.controls.role.updateValueAndValidity();

    }
    else{
      this.snowflakeflag=false;
      this.pwdflag=false;
      this.h2flag=false;
      this.dbForm.controls.portNumber.setValidators([Validators.required,Validators.maxLength(6)]);
      this.dbForm.controls.portNumber.updateValueAndValidity();
      this.dbForm.controls.password.setValidators([Validators.required , Validators.maxLength(50)]) 
      this.dbForm.controls.password.updateValueAndValidity();
      this.dbForm.controls.schemaName.setValidators([Validators.required , Validators.maxLength(50)]);
      this.dbForm.controls.schemaName.updateValueAndValidity();
    }
 }

 closedbconnection(){  
    this.resetDBForm();
  document.getElementById('createdbconnection').style.display='none';
}

}
