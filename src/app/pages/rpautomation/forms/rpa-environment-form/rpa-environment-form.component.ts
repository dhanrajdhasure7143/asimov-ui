import { RestApiService } from './../../../services/rest-api.service';
import { Component, OnInit, ChangeDetectorRef, ViewChild, EventEmitter, Output, SimpleChanges, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import {Router} from "@angular/router";
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { NgxSpinnerService } from "ngx-spinner";
import * as moment from 'moment';
import { environmentobservable } from './../../model/environmentobservable';

@Component({
  selector: 'app-rpa-environment-form',
  templateUrl: './rpa-environment-form.component.html',
  styleUrls: ['./rpa-environment-form.component.css'],
})
  export class RpaEnvironmentFormComponent implements  OnInit{
    @Input() isCreate:boolean;
    @Input() updateenvdata:any;
    public isDataSource: boolean;
    @Output() title:EventEmitter<string> = new EventEmitter<string>();
    public environments:any=[];
    public checkeddisabled:boolean =false;
    public delete_elements:number[];
    public masterSelected:Boolean;
    public environmentName:FormControl;
    public insertForm:FormGroup;
    public updateForm:FormGroup;
    public updateflag:Boolean;
    public deleteflag:Boolean;
    private updateid:number;
    public term:string;
    public submitted:Boolean;
    public checkflag:Boolean = false;
    public toggle:Boolean;
    public passwordtype1:Boolean;
    public passwordtype2:Boolean;
    isDtInitialized:boolean = false;
    customUserRole: any;
    enableEnvironment: boolean =false;
    enabledbconnection: boolean=false;
    public isButtonVisible = false;
    public userRole:any = [];
    public categoryList:any=[];
    public isKeyValuePair:Boolean=false;
    public password:any="";
    public keyValueFile:File;
    addflag:boolean=false;
    
  constructor(private api:RestApiService, 
    private router:Router, 
    private formBuilder: FormBuilder,
    private chanref:ChangeDetectorRef, 
    private spinner: NgxSpinnerService
    
    ) { 
    this.insertForm=this.formBuilder.group({
        environmentName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        environmentType: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        agentPath: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        hostAddress: ["", Validators.compose([Validators.required,  Validators.maxLength(50)])],
        categoryId:["0", Validators.compose([Validators.required])],
        username: ["", Validators.compose([Validators.required,Validators.pattern('^[a-zA-Z \-\']+') ,Validators.maxLength(50)])],
        connectionType: ["SSH",Validators.compose([Validators.required,, Validators.maxLength(50), Validators.pattern("[A-Za-z]*")])],
        portNumber: ["22",  Validators.compose([Validators.required, Validators.maxLength(4)])],
        activeStatus: [true] 
    })

    this.updateForm=this.formBuilder.group({
      environmentName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      environmentType: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      agentPath: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      hostAddress: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      categoryId:["0", Validators.compose([Validators.required])],
      username: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      //password: ["", Validators.compose([Validators.required , Validators.maxLength(50)])],
      connectionType: ["SSH",Validators.compose([Validators.required,, Validators.maxLength(50), Validators.pattern("[A-Za-z]*")])],
      portNumber: ["22",  Validators.compose([Validators.required, Validators.maxLength(6)])],
      activeStatus: [""]
    
    })
    this.updateflag=false;
    this.deleteflag=false;
    
  }

  ngOnChanges(changes: SimpleChanges){
    if(!this.isCreate && this.updateenvdata){
    this.updateForm.get("environmentName").setValue(this.updateenvdata["environmentName"]);
        this.updateForm.get("environmentType").setValue(this.updateenvdata["environmentType"]);
        this.updateForm.get("agentPath").setValue(this.updateenvdata["agentPath"]);
        this.updateForm.get("categoryId").setValue(this.updateenvdata["categoryId"]);
        this.updateForm.get("hostAddress").setValue(this.updateenvdata["hostAddress"]);
        this.updateForm.get("username").setValue(this.updateenvdata["username"]);
        // this.updateForm.get("password").setValue(this.updateenvdata["password"]);
        
        this.updateForm.get("connectionType").setValue(this.updateenvdata["connectionType"]);
        this.updateForm.get("portNumber").setValue(this.updateenvdata["portNumber"]);
        if (this.updateenvdata.activeStatus == 7) {
          this.toggle = true;
          this.updateForm.get("activeStatus").setValue(true);
        } else {
          this.toggle = false;
          this.updateForm.get("activeStatus").setValue(false);
        }
    }else{
      this.insertForm.get("categoryId").setValue(this.categoryList.length==1?this.categoryList[0].categoryId:"0")
    }
  }
  
  ngOnInit() {
    this.spinner.show();
    this.passwordtype1 = false;
    this.passwordtype2 = false;
    this.getCategories();
    this.userRole = localStorage.getItem("userRole")
    this.userRole = this.userRole.split(',');
    this.isButtonVisible = this.userRole.includes('SuperAdmin') || this.userRole.includes('Admin') || this.userRole.includes('RPA Admin') || this.userRole.includes('RPA Designer')
      || this.userRole.includes('Process Owner') || this.userRole.includes('Process Architect') || this.userRole.includes('Process Analyst') || this.userRole.includes('RPA Developer') || this.userRole.includes('Process Architect') || this.userRole.includes("System Admin") || this.userRole.includes("User");
    this.api.getCustomUserRole(2).subscribe(role => {
      this.customUserRole = role.message[0].permission;
      this.customUserRole.forEach(element => {
        if (element.permissionName.includes('RPA_Environmet_full')) {
          this.enableEnvironment = true;
        }
      }
      );
    })
  }

  EnvType1(){
    if(this.insertForm.value.environmentType == "Windows"){
      this.insertForm.get("portNumber").setValue("44");
    }else if(this.insertForm.value.environmentType == "Linux"){
      this.insertForm.get("portNumber").setValue("22");
    }
  }

  EnvType(){
    if(this.updateForm.value.environmentType == "Windows"){
      this.updateForm.get("portNumber").setValue("44");
    }else if(this.updateForm.value.environmentType == "Linux"){
      this.updateForm.get("portNumber").setValue("22");
    }
  }
  
  resetEnvForm(){
    this.insertForm.reset();
    this.password=null;
    this.isKeyValuePair=false;
    this.insertForm.get("portNumber").setValue("22");
    this.insertForm.get("connectionType").setValue("SSH");
    this.insertForm.get("categoryId").setValue(this.categoryList.length==1?this.categoryList[0].categoryId:'0');
    this.insertForm.get("environmentType").setValue("");
    this.insertForm.get("activeStatus").setValue(true);
    this.passwordtype1=false;
  }

  resetupdateEnvForm(){
    this.updateForm.reset();
    this.password=null;
    this.isKeyValuePair=false;
    this.updateenvdata.keyValue=null;
    this.updateForm.get("portNumber").setValue("22");
    this.updateForm.get("connectionType").setValue("SSH");
    this.updateForm.get("environmentType").setValue("");
    this.updateForm.get("activeStatus").setValue(true);
  }

  async testConnection(data) {
    let formdata: any;
    if (data == "insert") {
      formdata = this.insertForm;
    } else {
      formdata = this.updateForm;
    }
    if (formdata.valid) {
      if (formdata.value.activeStatus == true) {
        formdata.value.activeStatus = 7
      } else {
        formdata.value.activeStatus = 8
      }
      if (this.isKeyValuePair == false) {
        let connectionDetails = JSON.parse(JSON.stringify(formdata.value));
        connectionDetails["password"] = this.password;
        // Object.assign(connectionDetails,({"password":this.password}))
        this.spinner.show();
        await this.api.testenvironment(connectionDetails).subscribe(res => {
          this.spinner.hide();
          if (res.errorMessage == undefined) {
            Swal.fire("Success", "Successfully Connected", "success")
          } else {
            Swal.fire("Error", "Connection Failed", "error")
          }
        }, err => {
          this.spinner.hide()
          Swal.fire("Error", "Unable to test connections", "error");
        });
        this.activestatus();
      } else {
        this.spinner.hide()
        Swal.fire("Alert", "Test connections for key pair authentication is not configured", "warning")
      }
    } else {
      this.spinner.hide();
      //alert("Invalid Form");
      this.activestatus();
    }
  }

  activestatus(){
    if(this.insertForm.value.activeStatus == 7)
    {
      this.insertForm.value.activeStatus = true;
    }else{
      this.insertForm.value.activeStatus = false;
    }

    if(this.updateForm.value.activeStatus == 7)
    {
      this.updateForm.value.activeStatus = true;
    }else{
      this.updateForm.value.activeStatus = false;
    }
  }


  saveEnvironmentV2() {
    if (this.insertForm.value.activeStatus == true) {
      this.insertForm.value.activeStatus = 7
    } else {
      this.insertForm.value.activeStatus = 8
    }
    this.insertForm.value.createdBy = "admin";
    this.submitted = true;
    let environment = this.insertForm.value;
    let formData = new FormData();
    Object.keys(environment).forEach(key => {
      formData.append(key, environment[key])
    });
    if (this.isKeyValuePair == true) {
      formData.append("key", this.keyValueFile);
      this.password = "";
    }
    else {
      formData.append("password", this.password);
    }
    this.spinner.show();
    this.api.addenvironmentV2(formData).subscribe((response: any) => {
      this.spinner.hide();
      if (response.errorMessage == undefined) {
        Swal.fire("Success", response.status, "success")
        document.getElementById("createenvironment").style.display = 'none';
        this.insertForm.reset();
        this.insertForm.get("portNumber").setValue("22");
        this.insertForm.get("connectionType").setValue("SSH");
        this.insertForm.get("activeStatus").setValue(true);
        this.isKeyValuePair = false;
        this.password = "";
        this.keyValueFile = undefined;
        this.submitted = false;
      }
      else {
        this.submitted = false;
        Swal.fire("Error", response.errorMessage, "error");
      }
    }, err => {
      this.spinner.hide();
      Swal.fire("Error", "Unable to add environment", "error");
      this.submitted = false;
    });
  }

  downloadOption(environmentName, fileData) {
    if (fileData != null) {
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileData));
      element.setAttribute('download', `${environmentName}-Key.ppk`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
    }
    else {
      Swal.fire("Error", "Unable to download .ppk file", "error")
    }
  }


  async updateEnvironment() {
    if (this.updateForm.valid) {
      this.spinner.show();
      if (this.updateForm.value.activeStatus == true) {
        this.updateForm.value.activeStatus = 7
      } else {
        this.updateForm.value.activeStatus = 8
      }
      let updatFormValue = this.updateForm.value;
      updatFormValue["environmentId"] = this.updateenvdata.environmentId;
      updatFormValue["createdBy"] = this.updateenvdata.createdBy;
      updatFormValue["deployStatus"] = this.updateenvdata.deployStatus;

      // if(this.updateflag==false)
      // {
      if (this.isKeyValuePair == false) {

        updatFormValue["password"] = this.password;
        await this.api.updateenvironment(updatFormValue).subscribe(res => {
          let response: any = res;
          this.spinner.hide();
          if (response.errorMessage == undefined) {
            Swal.fire("Success", res.status, "success")
            document.getElementById("update-popup").style.display = 'none';
          } else {
            Swal.fire("Error", response.errorMessage, "error")
          }
        }, err => {

          this.spinner.hide();
          Swal.fire("Error", "Unable to update environment details", "error")
        });
      }
      else {
        this.spinner.hide();
        Swal.fire("Alert", "Update Environment is not configured for key pair authentication", "warning");
      }
    }
    //}
    else {
      //alert("please fill all details");
    }
  }



  async updateEnvironmentV2() {

    if (this.updateForm.valid) {
      this.spinner.show();
      if (this.updateForm.value.activeStatus == true) {
        this.updateForm.value.activeStatus = 7
      } else {
        this.updateForm.value.activeStatus = 8
      }
      let updatFormValue = this.updateForm.value;
      updatFormValue["environmentId"] = this.updateenvdata.environmentId;
      updatFormValue["createdBy"] = this.updateenvdata.createdBy;
      updatFormValue["deployStatus"] = this.updateenvdata.deployStatus;
      let updateEnvData = new FormData();
      Object.keys(updatFormValue).map(key => {

        return updateEnvData.append(String(key), String(updatFormValue[key]))

      });

      updateEnvData.append("formValue", "sample")
      if (this.isKeyValuePair == false) {
        updateEnvData.append("password", this.password);
        // updateEnvData.append("password",this.updateenvdata.password.password)
        updateEnvData.append("key", null)
      }
      else {

        updateEnvData.append("password", null)
        if (this.keyValueFile == undefined || this.keyValueFile == null)
          updateEnvData.append("key", null)
        else
          updateEnvData.append("key", this.keyValueFile)

      }
      await this.api.updateEnvironmentV2(updateEnvData).subscribe(res => {
        let response: any = res;
        this.spinner.hide();
        if (response.errorMessage == undefined) {
          Swal.fire("Success", res.status, "success")
          document.getElementById("update-popup").style.display = 'none';
        } else {
          Swal.fire("Error", response.errorMessage, "error")
        }
      }, err => {

        this.spinner.hide();
        Swal.fire("Error", "Unable to update environment details", "error")
      });
    }
    else {
      this.spinner.hide();
      Swal.fire("Alert", "Update Environment is not configured for key pair authentication", "warning");
    }
  }

  keypair(event){
    this.isKeyValuePair=!this.isKeyValuePair;
    if(event.target.checked==true){
      if(this.updateenvdata.password.password!=undefined){
        this.password=this.updateenvdata.password.password
      }
      else{
        this.password=''
      }
      
        if(this.keyValueFile==undefined){
          this.keyValueFile=undefined
        }
        else{
         
          this.keyValueFile= this.updateenvdata.keyValue
         
        }
      
     
    }
    else{
      if(this.keyValueFile==undefined){
        this.keyValueFile=undefined
      }
      if(this.updateenvdata.password.password!=undefined){
        this.password=this.updateenvdata.password.password
      }
      else{
        this.password=''
      }
      
    }
  }

  getCategories() {
    this.api.getCategoriesList().subscribe(data => {
      let response: any = data;
      if (response.errorMessage == undefined) {
        this.categoryList = response.data;
      }
    })
  }

  onlyAlphabetsAllowed(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode
    if(charCode > 31 && charCode != 32 && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122)){
      return false
    }
    return true
  }

 onlyNumbersAllowed(event): boolean {
  const charCode = (event.which) ? event.which : event.keyCode
  if(charCode != 43 && charCode != 45 && charCode != 46 && charCode != 69 && charCode != 101){
    return true 
  }
  return false 
 }

}


