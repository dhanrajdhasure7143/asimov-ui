import { Component,  OnInit, ChangeDetectorRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
// import { environmentobservable } from '../model/environmentobservable';
// import { EnvironmentsService } from './rpa-environments.service';
import Swal from 'sweetalert2';
import { RestApiService } from "../../../services/rest-api.service";
//import { } from ",,/..";
import {sohints} from "../model/so-hints";
import {Router} from "@angular/router";
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { NgxSpinnerService } from "ngx-spinner";
import { Pipe, PipeTransform } from '@angular/core';

@Component({
  selector: 'app-so-env-epsoft',
  templateUrl: './so-env-epsoft.component.html',
  styleUrls: ['./so-env-epsoft.component.css']
})
export class SoEnvEpsoftComponent implements OnInit {

  displayedColumns: string[] = ["check","environmentName","environmentType","agentPath","hostAddress","portNumber","username","password","activeStatus","deployStatus","createdTimeStamp","createdBy"]; //,"connectionType"
  dataSource1:MatTableDataSource<any>;
  public isDataSource: boolean;
  public isTableHasData : boolean = false;
  public FilterHasnodata : boolean = true;
  @ViewChild("paginator1") paginator1: MatPaginator;
  @ViewChild("sort1") sort1: MatSort;
  @ViewChild('closebutton') closebutton
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
  public updatesubmitted : Boolean;

constructor(private api:RestApiService,
  private router:Router,
  private formBuilder: FormBuilder,
  
  // private environmentservice:EnvironmentsService,
  private chanref:ChangeDetectorRef,
  // private dt:DataTransferService,
  // private hints:Rpa_Hints,
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
  this.passwordtype1=false;
  this.passwordtype2=false;
  //this.updatepopup=document.getElementById('env_updatepopup');
  // this.dt.changeHints(this.hints.rpaenvhints);
  this.getallData();
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
     
      if(this.environments.length > 0)
     {
      this.isTableHasData = false;
     }
     else 
     {
      this.isTableHasData = true;
     }
      this.environments.sort((a,b) => a.activeTimeStamp > b.activeTimeStamp ? -1 : 1);
      let envchange = this.environments;
    
 
      for(let i = 0; i< envchange.length;i++)
      {
       envchange[i].activeStatus = envchange[i].activeStatus == 7 ? 'Active': envchange[i].activeStatus == 8? 'Inactive': '';
       envchange[i].deployStatus = envchange[i].deployStatus == true ? 'Yes': envchange[i].deployStatus ==  false ? 'No': ''; 
      }
 
   
      this.dataSource1= new MatTableDataSource(envchange.filter(item=>item.activeStatus=="Active"));
      this.isDataSource = true;
      this.dataSource1.sort=this.sort1;
      this.dataSource1.paginator=this.paginator1;
      this.spinner.hide();
    });
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
      let response:any=res;
      this.spinner.hide();
      if(res.errorCode==undefined){
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: "Connected successfully!",
        showConfirmButton: false,
        timer: 2000
      })
      }else{
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: response.errorMessage,
          showConfirmButton: false,
          timer: 2000
        })
      }
  });
}
else
{
   //alert("Invalid Form")
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
      Swal.fire({
        position: 'center',
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
  // alert("Invalid Form")
}

}

async updateEnvironment()
{
  this.spinner.show();
 
  if(this.updateForm.valid)
  {
    if(this.updateForm.value.activeStatus==true)
    {
      this.updateForm.value.activeStatus=7
    }else{
      this.updateForm.value.activeStatus=8
    }
   
    let updatFormValue =  this.updateForm.value;
    updatFormValue["environmentId"]= this.updateenvdata.environmentId;
   
    updatFormValue["createdBy"]= this.updateenvdata.createdBy;
    this.updateenvdata.deployStatus = this.updateenvdata.deployStatus == 'Yes'? true: this.updateenvdata.deployStatus == 'No'? false: '';
    updatFormValue["deployStatus"]= this.updateenvdata.deployStatus;
        
          this.updatesubmitted = true;
    await this.api.updateenvironment(updatFormValue).subscribe( res => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: res.status,
        showConfirmButton: false,
        timer: 2000
      })
     
    this.removeallchecks();
    this.getallData();
    this.checktoupdate();
    this.checktodelete();
    document.getElementById("update-popup").style.display='none';
    this.updatesubmitted = false;
    this.spinner.hide();
    });
  }
  else
  {
    //alert("Please fill in all the details.");
  }
}

reset_UpdateEpsoft(){
  this.updateForm.reset();

  this.updateForm.get("portNumber").setValue("22");
  this.updateForm.get("connectionType").setValue("SSH");
  this.updateForm.get("environmentType").setValue("");
  this.updateForm.get("activeStatus").setValue(true);
}

updatedata()
{
  document.getElementById("createenvironment").style.display='none';
  document.getElementById('update-popup').style.display='block';
  let data:any;
  for(data of this.environments)
  {
    if(data.environmentId==this.updateid)
    {
      if(data.activeStatus=='Active'){
        this.toggle=true;
      }else{
        this.toggle=false;
      }
      this.updateenvdata=data;
    
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
      customClass: {
        confirmButton: 'btn bluebg-button',
        cancelButton:  'btn new-cancelbtn',
      },
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.api.deleteenvironment(selectedEnvironments).subscribe( res =>{
          Swal.fire({
            position: 'center',
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
        position: 'center',
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
  if(this.dataSource1.filteredData.length > 0){
    this.FilterHasnodata = true;
  } else {
    this.FilterHasnodata = false;
  }
}

removeallchecks()
{
  for(let i=0;i<this.environments.length;i++)
  {
    this.environments[i].checked= false;
   
  }
  this.checkflag=false;
  
}

}

@Pipe({
  name: 'ipcustompipe'
})
export class ipcustompipecreation implements PipeTransform {
    public countD:number = 0;
    public str: any;
    public str1: any;
    public str2: any;
    public hostadd:any=[];
    transform(value: any): any {
    var ip = value;
    this.str ='';
    this.str1 ='';
    this.str2 ='';
    this.countD = 0;
    for( let i=0;i<ip.length;i++)
    {
      if( this.countD < 3){
        this.str = (ip.charCodeAt(i) != 46 ? '*':'.');
        this.str1 = this.str1+ this.str;
        if(ip.charCodeAt(i) == 46 ){
          this.countD++;
        }
      }
      else
      {
        this.str2 = this.str2+ip[i];
      }
    }
    this.hostadd = this.str1+ this.str2;

    return this.hostadd;
  }
}
