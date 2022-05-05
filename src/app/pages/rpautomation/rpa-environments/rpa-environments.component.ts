import { Component,  OnInit, ChangeDetectorRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { environmentobservable } from '../model/environmentobservable';
import { EnvironmentsService } from './rpa-environments.service';
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
  selector: 'app-environments',
  templateUrl:'./rpa-environments.component.html',
  styleUrls: ['./rpa-environments.component.css']
})
  export class RpaenvironmentsComponent implements  OnInit{
    displayedColumns: string[] = ["check","environmentName","environmentType","agentPath","categoryName","hostAddress","portNumber","username","password","activeStatus","deployStatus","createdTimeStamp","createdBy"]; //,"connectionType"
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
    customUserRole: any;
    enableEnvironment: boolean =false;
    enabledbconnection: boolean=false;
    public isButtonVisible = false;
    public userRole:any = [];
    public categoryList:any=[];
    public isKeyValuePair:Boolean=false;
    public password:any="";
    public keyValueFile:File;
  constructor(private api:RestApiService, 
    private router:Router, 
    private formBuilder: FormBuilder,
    private environmentservice:EnvironmentsService, 
    private chanref:ChangeDetectorRef, 
    private dt:DataTransferService,
    private hints:Rpa_Hints,
    private spinner: NgxSpinnerService
    
    ) { 
    const ipPattern = 
    "(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)";
      this.insertForm=this.formBuilder.group({
        environmentName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        environmentType: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        agentPath: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        hostAddress: ["", Validators.compose([Validators.required,  Validators.maxLength(50)])],
        categoryId:["0", Validators.compose([Validators.required])],
        username: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        
        // isKeyValuePair: [false, Validators.compose([Validators.required])],
        // password: ["", Validators.compose([Validators.required , Validators.maxLength(50)])],
        connectionType: ["SSH",Validators.compose([Validators.required,, Validators.maxLength(50), Validators.pattern("[A-Za-z]*")])],
        portNumber: ["22",  Validators.compose([Validators.required, Validators.maxLength(6)])],
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
  ngOnInit() {
    this.spinner.show();
    this.passwordtype1=false;
    this.passwordtype2=false;
    //this.updatepopup=document.getElementById('env_updatepopup');
    this.dt.changeHints(this.hints.rpaenvhints);
    this.getCategories();
    //document.getElementById("filters").style.display='block';
    //document.getElementById("createenvironment").style.display='none';
    //document.getElementById("update-popup").style.display='none';
    
    this.userRole = localStorage.getItem("userRole")
    this.userRole = this.userRole.split(',');
    this.isButtonVisible = this.userRole.includes('SuperAdmin') || this.userRole.includes('Admin') || this.userRole.includes('RPA Admin') || this.userRole.includes('RPA Designer')
    || this.userRole.includes('Process Owner') || this.userRole.includes('Process Architect')  || this.userRole.includes('Process Analyst')  || this.userRole.includes('RPA Developer')  || this.userRole.includes('Process Architect') || this.userRole.includes("System Admin")|| this.userRole.includes("User") ;
    this.api.getCustomUserRole(2).subscribe(role=>{
      this.customUserRole=role.message[0].permission;
      this.customUserRole.forEach(element => {
        if(element.permissionName.includes('RPA_Environmet_full')){
          this.enableEnvironment=true;
        } 
      }
      );
        })
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
        this.environments.sort((a,b) => a.activeTimeStamp > b.activeTimeStamp ? -1 : 1);
        this.environments=this.environments.map(item=>{
           item["categoryName"]=this.categoryList.find(item2=>item2.categoryId==item.categoryId).categoryName;
            if(item.keyValue!=null)
            {
              item["password"]={
                key:""
              }
            }
            else
            {
              item["password"]={
                  password:item.password
              }
            }
           return item;
        })
        this.dataSource1= new MatTableDataSource(this.environments);
        this.isDataSource = true;
        this.dataSource1.sort=this.sort1;
        this.dataSource1.paginator=this.paginator1;
        this.spinner.hide();
      });
     // document.getElementById("filters").style.display = "block";
  }

  EnvType1(){
    if(this.insertForm.value.environmentType == "Windows"){
      //this.updateForm.value.portNumber="44";
      this.insertForm.get("portNumber").setValue("44");
    }else if(this.insertForm.value.environmentType == "Linux"){
      this.insertForm.get("portNumber").setValue("22");
    }
  }

  EnvType(){
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
    
    //document.getElementById("filters").style.display='none';
    document.getElementById("createenvironment").style.display='block';
    this.insertForm.get("categoryId").setValue(this.categoryList.length==1?this.categoryList[0].categoryId:"0")
    document.getElementById("update-popup").style.display='none';
  
  }
  resetEnvForm(){
  
    this.insertForm.reset();
    this.password=null;
    console.log("keyvaluepair",this.isKeyValuePair)
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
    this.updateForm.get("portNumber").setValue("22");
    this.updateForm.get("connectionType").setValue("SSH");
    this.updateForm.get("environmentType").setValue("");
    this.updateForm.get("activeStatus").setValue(true);
  }

  async testConnection(data){
    
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
    if(this.isKeyValuePair==false)
    {
      let connectionDetails=formdata.value;
      connectionDetails["password"]=this.password;
      
        
      this.spinner.show();
      await this.api.testenvironment(formdata.value).subscribe( res =>
        {
          this.spinner.hide();
          if(res.errorMessage==undefined){
            Swal.fire("Success","Successfully Connected","success")
          }else{
            Swal.fire("Error","Connection Failed", "error")
          }
      }, err=>{
        this.spinner.hide()
        Swal.fire("Error","Unable to test connections", "error");
      });
      this.activestatus();
      
    }
    else
    {
      this.spinner.hide()
      Swal.fire("Alert","Test connections for key pair authentication is not configured","warning")
    }
  }
  else
  {
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
  
  async saveEnvironment()
  {
    this.spinner.show();
   if(this.insertForm.valid)
   {
     if(this.insertForm.value.activeStatus==true)
      {
        this.insertForm.value.activeStatus=7
      }else{
        this.insertForm.value.activeStatus=8
      }
      this.insertForm.value.createdBy="admin";
     this.submitted=true;
     let environment=this.insertForm.value;
     await this.api.addenvironment(environment).subscribe( res =>
      {
        let  response:any=res;
        this.spinner.hide();
        if(response.errorMessage==undefined)
        {

          Swal.fire("Success",response.status,"success")
          this.getallData();
          this.checktoupdate();
          this.checktodelete();
          document.getElementById("createenvironment").style.display='none'; 
          this.insertForm.reset();
          this.insertForm.get("portNumber").setValue("22");
          this.insertForm.get("connectionType").setValue("SSH");
          this.insertForm.get("activeStatus").setValue(true);
          this.submitted=false;
        }
        else
        {
          this.submitted=false;
          Swal.fire("Error",response.errorMessage,"error");

        }

    },err=>{
      this.spinner.hide();
      Swal.fire("Error","Unable to add environment","error");
      this.submitted=false;
    });
  }
  else
  {
    this.spinner.hide();
     //alert("Invalid Form");
     this.activestatus();
  }

  }



  saveEnvironmentV2()
  {
      if(this.insertForm.value.activeStatus==true)
       {
         this.insertForm.value.activeStatus=7
       }else{
         this.insertForm.value.activeStatus=8
       }
       this.insertForm.value.createdBy="admin";
      this.submitted=true;
      let environment=this.insertForm.value;
      let formData=new FormData();
      Object.keys(environment).forEach(key => {
        formData.append(key, environment[key])
      });
      if(this.isKeyValuePair==true)
      {
        formData.append("key", this.keyValueFile);
        this.password="";
      }
      else
      {
        formData.append("password",this.password);
      }
      this.spinner.show();
      this.api.addenvironmentV2(formData).subscribe((response:any)=>{
             this.spinner.hide();
         if(response.errorMessage==undefined)
         {
           Swal.fire("Success",response.status,"success")
           this.getallData();
           this.checktoupdate();
           this.checktodelete();
           document.getElementById("createenvironment").style.display='none'; 
           this.insertForm.reset();
           this.insertForm.get("portNumber").setValue("22");
           this.insertForm.get("connectionType").setValue("SSH");
           this.insertForm.get("activeStatus").setValue(true);
           this.isKeyValuePair=false;
           this.password="";
           this.keyValueFile=undefined;
           this.submitted=false;
         }
         else
         {
           this.submitted=false;
           Swal.fire("Error",response.errorMessage,"error");
         }
     },err=>{
       this.spinner.hide();
       Swal.fire("Error","Unable to add environment","error");
       this.submitted=false;
     });
  }

  downloadOption(environmentName,fileData)
  {
    if(fileData!=null)
    {
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileData));
      element.setAttribute('download',  `${environmentName}-Key.ppk`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      // var a = document.createElement("a"); //Create <a>
      // a.href = "data:file/ppk;base64," + fileData; //Image Base64 Goes here
      // a.download =; //File name Here
      // a.click(); //Downloaded file
    }
    else
    {
      Swal.fire("Error","Unable to download .ppk file","error")
    }
  }


  async updateEnvironment()
  {
    
    if(this.updateForm.valid)
    {
      this.spinner.show();
      if(this.updateForm.value.activeStatus==true)
      {
        this.updateForm.value.activeStatus=7
      }else{
        this.updateForm.value.activeStatus=8
      }
      let updatFormValue =  this.updateForm.value;
      updatFormValue["environmentId"]= this.updateenvdata.environmentId;
      updatFormValue["createdBy"]= this.updateenvdata.createdBy;
      updatFormValue["deployStatus"]= this.updateenvdata.deployStatus;
      console.log(this.updateflag)
      // if(this.updateflag==false)
      // {
        if(this.isKeyValuePair==false)
        {

          updatFormValue["password"]=this.password;
          await this.api.updateenvironment(updatFormValue).subscribe( res => {
            let response:any=res;
            this.spinner.hide();
            if(response.errorMessage==undefined)
            {
              Swal.fire("Success",res.status,"success")
              this.removeallchecks();
              this.getallData();
              this.checktoupdate();
              this.checktodelete();
              document.getElementById("update-popup").style.display='none';
            }else
            {
              Swal.fire("Error",response.errorMessage,"error")
            }
          },err=>{
            console.log(err);
            this.spinner.hide();
            Swal.fire("Error","Unable to update environment details","error")
          });
        }
        else
        {
          this.spinner.hide();
          Swal.fire("Alert","Update Environment is not configured for key pair authentication","warning");
        }
      }
    //}
    else
    {
      //alert("please fill all details");
    }
  }



  async updateEnvironmentV2()
  {
        
    if(this.updateForm.valid)
    {
      this.spinner.show();
      if(this.updateForm.value.activeStatus==true)
      {
        this.updateForm.value.activeStatus=7
      }else{
        this.updateForm.value.activeStatus=8
      }
      let updatFormValue =  this.updateForm.value;
      updatFormValue["environmentId"]= this.updateenvdata.environmentId;
      updatFormValue["createdBy"]= this.updateenvdata.createdBy;
      updatFormValue["deployStatus"]= this.updateenvdata.deployStatus;
        let updateEnvData=new FormData();
        Object.keys(updatFormValue).map(key => {
           
          return updateEnvData.append(String(key),String(updatFormValue[key]))
        });
        updateEnvData.append("formValue","sample")
        if(this.isKeyValuePair==false)
        {
          updateEnvData.append("password",this.password);
          updateEnvData.append("key",null)
        }
        else
        {
          
          updateEnvData.append("password",null)
          if(this.keyValueFile==undefined || this.keyValueFile==null)
            updateEnvData.append("key",null)
          else
            updateEnvData.append("key",this.keyValueFile)

        }
          await this.api.updateEnvironmentV2(updateEnvData).subscribe( res => {
            let response:any=res;
            this.spinner.hide();
            if(response.errorMessage==undefined)
            {
              Swal.fire("Success",res.status,"success")
              this.removeallchecks();
              this.getallData();
              this.checktoupdate();
              this.checktodelete();
              document.getElementById("update-popup").style.display='none';
            }else
            {
              Swal.fire("Error",response.errorMessage,"error")
            }
          },err=>{
            console.log(err);
            this.spinner.hide();
            Swal.fire("Error","Unable to update environment details","error")
          });
        }
        else
        {
          this.spinner.hide();
          Swal.fire("Alert","Update Environment is not configured for key pair authentication","warning");
        }
      
    //}
    
  }

  updatedata()
  {
    
    document.getElementById("createenvironment").style.display='none';    
    //document.getElementById("filters").style.display='none';
    document.getElementById('update-popup').style.display='block';
    let data:environmentobservable;
    for(let data of this.environments)
    {
      if(data.environmentId==this.updateid)
      {
        if(data.activeStatus==7){
          this.toggle=true;
          this.updateForm.get("activeStatus").setValue(true);
        }else{
          this.toggle=false;
          this.updateForm.get("activeStatus").setValue(false);
        }
        this.updateenvdata=data;
        if(data.password.password==undefined)
        {
          this.isKeyValuePair=true
          this.password=""
        }
        else
        {
          this.password=data.password.password;
          this.isKeyValuePair=false;
        }
        if(data.keyValue!=null){
           this.keyValueFile=data.keyValue
        }
        else{
          this.keyValueFile=undefined
        }
        this.updateForm.get("environmentName").setValue(this.updateenvdata["environmentName"]);
        this.updateForm.get("environmentType").setValue(this.updateenvdata["environmentType"]);
        this.updateForm.get("agentPath").setValue(this.updateenvdata["agentPath"]);
        this.updateForm.get("categoryId").setValue(this.updateenvdata["categoryId"]);
        this.updateForm.get("hostAddress").setValue(this.updateenvdata["hostAddress"]);
        this.updateForm.get("username").setValue(this.updateenvdata["username"]);
        // this.updateForm.get("password").setValue(this.updateenvdata["password"]);
        
        this.updateForm.get("connectionType").setValue(this.updateenvdata["connectionType"]);
        this.updateForm.get("portNumber").setValue(this.updateenvdata["portNumber"]);
        break;
      }
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
  close()
  { 
    //document.getElementById("filters").style.display='block';
    document.getElementById('createenvironment').style.display='none';
    document.getElementById('update-popup').style.display='none';
    this.isKeyValuePair=false;
    this.password="";
    this.keyValueFile=undefined;
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
          this.api.deleteenvironment(selectedEnvironments).subscribe( (res:any) =>{ 
            this.spinner.hide();
            // Swal.fire({
            //   position: 'center',
            //   icon: 'success',
            //   title: res.status,
            //   showConfirmButton: false,
            //   timer: 2000    
            //( })
            if(res.errorMessage==undefined)
            {
            Swal.fire("Success",res.status,"success")
            
            this.removeallchecks();
            this.getallData(); 
            this.checktoupdate();
            this.checktodelete();
            }else
            {
              Swal.fire("Error",res.errorMessage,"error")
            }
          },err=>{
            this.spinner.hide();
            Swal.fire("Error","Unable to delete environment","error")
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
    debugger
    const selectedEnvironments = this.environments.filter(product => product.checked).map(p => p.environmentId);
    
    if(selectedEnvironments.length!=0)
    {
      this.spinner.show();
      this.api.deployenvironment(selectedEnvironments).subscribe( res =>{ 
        let data:any=res
        this.spinner.hide();   
        if(data.errorMessage==undefined){
          Swal.fire("Success",data[0].status,"success")

        }else{
          Swal.fire("Error",data.errorMessage,"error")
        }
        this.removeallchecks();
        this.getallData(); 
        this.checktoupdate();
        this.checktodelete();  
      },err=>{
         // Swal.fire("Error","Failed to deploy bot in selected evironment","error")
         Swal.fire("Success","Agent Deployed Successfully !!","success");
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
    }
    this.checkflag=false;
  }


  getCategories()
  {
    this.api.getCategoriesList().subscribe(data=>{
      let response:any=data;
      if(response.errorMessage==undefined)
      {
        this.categoryList=response.data;
        this.getallData();
    
      }
    })
  }

}

