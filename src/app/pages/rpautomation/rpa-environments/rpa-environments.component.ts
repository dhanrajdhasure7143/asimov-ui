import { Component,  OnInit, ChangeDetectorRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { environmentobservable } from '../model/environmentobservable';
import { EnvironmentsService } from './rpa-environments.service';
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
  selector: 'app-environments',
  templateUrl:'./rpa-environments.component.html',
  styleUrls: ['./rpa-environments.component.css']
})
  export class RpaenvironmentsComponent implements  OnInit{
    displayedColumns: string[] = ["check","environmentName","environmentType","agentPath","username","password","connectionType","portNumber","createdTimeStamp","createdBy","activeStatus","deployStatus"];
    dataSource1:MatTableDataSource<any>;
    public isDataSource: boolean;  
    @ViewChild("paginator1",{static:false}) paginator1: MatPaginator;
    @ViewChild("sort1",{static:false}) sort1: MatSort;
    @ViewChild('closebutton', {static: false}) closebutton 
    @Output()
    title:EventEmitter<string> = new EventEmitter<string>();
    public environments:any=[];
    public checkeddisabled:boolean =false;
    public createpopup=document.getElementById('createevironment');
    public button:string;
    //public updatepopup=document.getElementById('env_updatepopup');
    public delete_elements:number[];
    public masterSelected:Boolean;
    public updateenvdata:any;
    public environmentName:FormControl;
    public insertForm:FormGroup;
    public updateForm:FormGroup;
    public updateflag:Boolean;
    public deleteflag:Boolean;
    private updateid:number;
    public term:string;
    public submitted:Boolean;
    public checkflag:Boolean;
    public toggle:Boolean;
    public passwordtype1:Boolean;
    public passwordtype2:Boolean;
    isDtInitialized:boolean = false;
    
  constructor(private api:RestApiService, 
    private router:Router, 
    private formBuilder: FormBuilder,
    private environmentservice:EnvironmentsService, 
    private chanref:ChangeDetectorRef, 
    private dt:DataTransferService,
    private hints:RpaEnvHints,
    private spinner: NgxSpinnerService
    ) { 
    const ipPattern = 
    "(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)";
      this.insertForm=this.formBuilder.group({
        environmentName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        environmentType: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        agentPath: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        hostAddress: ["", Validators.compose([Validators.required, Validators.pattern(ipPattern), Validators.maxLength(50)])],
        username: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        password: ["", Validators.compose([Validators.required , Validators.maxLength(50)])],
        connectionType: ["SSH",Validators.compose([Validators.required,, Validators.maxLength(50), Validators.pattern("[A-Za-z]*")])],
        portNumber: ["22",  Validators.compose([Validators.required, Validators.maxLength(50), Validators.pattern("[0-9]*")])],
        activeStatus: [true]
       
    })

    this.updateForm=this.formBuilder.group({
      environmentName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      environmentType: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      agentPath: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      hostAddress: ["", Validators.compose([Validators.required, Validators.pattern(ipPattern), Validators.maxLength(50)])],
      username: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      password: ["", Validators.compose([Validators.required , Validators.maxLength(50)])],
      connectionType: ["SSH",Validators.compose([Validators.required,, Validators.maxLength(50), Validators.pattern("[A-Za-z]*")])],
      portNumber: ["22",  Validators.compose([Validators.required, Validators.maxLength(50), Validators.pattern("[0-9]*")])],
      activeStatus: [""]
    
    })
    this.updateflag=false;
    this.deleteflag=false;
    
  }
  ngOnInit() {
    this.spinner.show();
    //this.updatepopup=document.getElementById('env_updatepopup');
    this.dt.changeHints(this.hints.rpaenvhints);
    this.getallData();
    
    document.getElementById("createenvironment").style.display='none';
    document.getElementById("update-popup").style.display='none';
    this.passwordtype1=false;
    this.passwordtype2=false;

  }

 async getallData()
  {
    this.environments=[];
    await this.api.listEnvironments().subscribe(
    data => {
         let response:any= data;	
         if(response.length>0)
         { 
           this.checkeddisabled = false;
         }
         else
         {
           this.checkeddisabled = true;
         }
        for(let i=0;i<response.length;i++)
        {
          let checks={
            checked:false,
            }
          this.environments.push(Object.assign({}, response[i], checks));
        }
        console.log(this.environments)
        this.dataSource1= new MatTableDataSource(this.environments);
        this.isDataSource = true;
        this.dataSource1.sort=this.sort1;
        this.dataSource1.paginator=this.paginator1;
        this.spinner.hide();
      });
  }

  EnvType1(){
    console.log(this.insertForm.value.environmentType)
    if(this.insertForm.value.environmentType == "Windows"){
      //this.updateForm.value.portNumber="44";
      this.insertForm.get("portNumber").setValue("44");
    }else if(this.insertForm.value.environmentType == "Linux"){
      this.insertForm.get("portNumber").setValue("22");
    }
  }

  EnvType(){
    console.log(this.updateForm.value.environmentType)
    if(this.updateForm.value.environmentType == "Windows"){
      //this.updateForm.value.portNumber="44";
      this.updateForm.get("portNumber").setValue("44");
    }else if(this.updateForm.value.environmentType == "Linux"){
      this.updateForm.get("portNumber").setValue("22");
    }
  }


  checkAllCheckBox(ev) {
    this.environments.forEach(x => x.checked = ev.target.checked)
    this.checktoupdate();
    this.checktodelete();

	}

  isAllCheckBoxChecked() {
    this.environments.forEach(data=>{
      if(data.checked==false)
      {
        return false;
      }
    })
    return true;
  }
  
  create()
  {
    
    document.getElementById("createenvironment").style.display='block';
    document.getElementById("update-popup").style.display='none';
  
  }
  resetEnvForm(){
    this.insertForm.reset();
    
    this.insertForm.get("portNumber").setValue("22");
    this.insertForm.get("connectionType").setValue("SSH");
    this.insertForm.get("environmentType").setValue("");
    this.insertForm.get("activeStatus").setValue(true);
  }

  async testConnection(data){
    this.spinner.show();
    let formdata:any;
    if(data=="insert"){
      formdata=this.insertForm;
    }else{
      formdata=this.updateForm;
    }
   if(formdata.valid)
   {
    if(formdata.value.activeStatus==true)
    {
      formdata.value.activeStatus=7
    }else{
      formdata.value.activeStatus=8
    }
     await this.api.testenvironment(formdata.value).subscribe( res =>
      {
        this.spinner.hide();
        if(res.errorCode==undefined){
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: "Successfully Connected",
          showConfirmButton: false,
          timer: 2000
        })
        }else{
          Swal.fire({
            position: 'top-end',
            icon: 'question',
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
  
  async saveEnvironment()
  {
    this.spinner.show();
   if(this.insertForm.valid)
   {
     console.log(this.insertForm.value.activeStatus)
     if(this.insertForm.value.activeStatus==true)
      {
        this.insertForm.value.activeStatus=7
      }else{
        this.insertForm.value.activeStatus=8
      }
      console.log(this.insertForm.value.activeStatus)

      this.insertForm.value.createdBy="admin";
     this.submitted=true;
     let environment=this.insertForm.value;
     await this.api.addenvironment(environment).subscribe( res =>
      {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: res.status,
          showConfirmButton: false,
          timer: 2000
        })
        this.getallData();
        this.checktoupdate();
        this.checktodelete();
        document.getElementById("createenvironment").style.display='none'; 
        this.insertForm.reset();
        this.insertForm.get("portNumber").setValue("22");
        this.insertForm.get("connectionType").setValue("SSH");
        this.submitted=false;
        this.spinner.hide();
    });
  }
  else
  {
     alert("Invalid Form")
  }

  }

  async updateEnvironment()
  {
    this.spinner.show();
    console.log(this.updateForm.value);
    if(this.updateForm.valid)
    {
      if(this.updateForm.value.activeStatus==true)
      {
        this.updateForm.value.activeStatus=7
      }else{
        this.updateForm.value.activeStatus=8
      }
      console.log(this.updateForm.value.environmentName);
      console.log(this.updateForm.value);
      let updatFormValue =  this.updateForm.value;
      updatFormValue["environmentId"]= this.updateenvdata.environmentId;
      console.log(this.updateenvdata.createdBy);
      updatFormValue["createdBy"]= this.updateenvdata.createdBy;
      updatFormValue["deployStatus"]= this.updateenvdata.deployStatus;
            console.log(updatFormValue);
      await this.api.updateenvironment(updatFormValue).subscribe( res => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: res.status,
          showConfirmButton: false,
          timer: 2000
        })
        console.log(res);
      this.removeallchecks();
      this.getallData();
      this.checktoupdate();
      this.checktodelete();
      document.getElementById("update-popup").style.display='none';
      this.spinner.hide();
      });
    }
    else
    {
      alert("please fill all details");
    }
  }

  updatedata()
  {
    document.getElementById("createenvironment").style.display='none';
    document.getElementById('update-popup').style.display='block';
    let data:environmentobservable;
    for(data of this.environments)
    {
      if(data.environmentId==this.updateid)
      {
        if(data.activeStatus==7){
          this.toggle=true;
        }else{
          this.toggle=false;
        }
        this.updateenvdata=data;
        console.log(this.updateenvdata);
      console.log(this.updateForm.value);
      console.log(this.updateenvdata.environmentId);
        this.updateForm.get("environmentName").setValue(this.updateenvdata["environmentName"]);
        this.updateForm.get("environmentType").setValue(this.updateenvdata["environmentType"]);
        this.updateForm.get("agentPath").setValue(this.updateenvdata["agentPath"]);
        this.updateForm.get("hostAddress").setValue(this.updateenvdata["hostAddress"]);
        this.updateForm.get("username").setValue(this.updateenvdata["username"]);
        this.updateForm.get("password").setValue(this.updateenvdata["password"]);
        this.updateForm.get("connectionType").setValue(this.updateenvdata["connectionType"]);
        this.updateForm.get("portNumber").setValue(this.updateenvdata["portNumber"]);
        break;
      }
    }
  }

  close()
  { 
    
    document.getElementById('createenvironment').style.display='none';
    document.getElementById('update-popup').style.display='none';
    this.resetEnvForm();
  }


  async deleteEnvironments(){
		const selectedEnvironments = this.environments.filter(product => product.checked==true).map(p => p.environmentId);
    if(selectedEnvironments.length!=0)
    {
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
          this.api.deleteenvironment(selectedEnvironments).subscribe( res =>{ 
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: res.status,
              showConfirmButton: false,
              timer: 2000    
            })
            
            this.removeallchecks();
            this.getallData(); 
            this.spinner.hide();
            this.checktoupdate();
            this.checktodelete();
          })
        }
      }) 
    }
  }
 


  checktoupdate()
  {
    const selectedEnvironments = this.environments.filter(product => product.checked==true);
    if(selectedEnvironments.length==1)
    {
      this.updateflag=true;
      this.updateid=selectedEnvironments[0].environmentId;
    }else
    {
      this.updateflag=false;
    }
  }

  

  checktodelete()
  {
    const selectedEnvironments = this.environments.filter(product => product.checked).map(p => p.environmentId);
    if(selectedEnvironments.length>0)
    {
      this.deleteflag=true;
    }else
    {
      this.deleteflag=false;
    }
  }





  checkEnableDisableBtn(id, event)
  {
    console.log(event.target.checked);
    this.environments.find(data=>data.environmentId==id).checked=event.target.checked;
    if(this.environments.filter(data=>data.checked==true).length==this.environments.length)
    {
      this.checkflag=true;
    }else
    {
      this.checkflag=false;  
    }
    this.checktoupdate();
    this.checktodelete();
  }




  deploybotenvironment()
  {
    const selectedEnvironments = this.environments.filter(product => product.checked).map(p => p.environmentId);
    this.spinner.show();
    if(selectedEnvironments.length!=0)
    {
      this.api.deployenvironment(selectedEnvironments).subscribe( res =>{ 
        let data:any=res
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: data[0].status,
          showConfirmButton: false,
          timer: 2000
        })
        this.removeallchecks();
        this.getallData(); 
        this.checktoupdate();
        this.checktodelete();  
        this.spinner.hide();   
      })
    }
  }
  
  applyFilter(filterValue: string) {
    
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource1.filter = filterValue;
  }

  removeallchecks()
  {
    for(let i=0;i<this.environments.length;i++)
    {
      this.environments[i].checked= false;
      console.log(this.environments[i]);
    }
    this.checkflag=false;
    //console.log(this.environments);
  }

}

