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
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-so-env-blueprism',
  templateUrl: './so-env-blueprism.component.html',
  styleUrls: ['./so-env-blueprism.component.css']
})
export class SoEnvBlueprismComponent implements OnInit {

  
  displayedColumns: string[] = ["check","configName","category","bluePrismUsername","bluPrismPassword","hostAddress","username","password","port","status","createdTimeStamp","createdBy"];
  dataSource1:MatTableDataSource<any>;
  public isDataSource: boolean;
  public createblueprism : boolean = false;
  public updateblueprims : boolean = false;
  public isTableHasData : boolean = false;
  public FilterHasnodata : boolean = true;
  public Formresponse : any;
  @ViewChild("paginator1",{static:false}) paginator1: MatPaginator;
  @ViewChild("sort1",{static:false}) sort1: MatSort;
  @ViewChild('closebutton', {static: false}) closebutton
  @Output()
  title:EventEmitter<string> = new EventEmitter<string>();
  public updateflag:Boolean;
  public submitted : Boolean;
  public updatesubmitted : Boolean;
  public deleteflag:Boolean;
  private updateid:number;
  public checkflag:Boolean;
  public passwordtype1:Boolean;
  public passwordtype2:Boolean;
  public blueprism_configs:any;
  public BluePrismConfigForm:FormGroup;
  public UpdateBluePrismConfigForm:FormGroup;
  public BluePrismFlag:boolean=false;
  public addBPconfigstatus:boolean=false;
  public bpid : any;
  public toggle: boolean = false;
  public categoryList:any=[]
constructor(private api:RestApiService,
  private router:Router,
  private formBuilder: FormBuilder,
  private route : ActivatedRoute,
  // private environmentservice:EnvironmentsService,
  private chanref:ChangeDetectorRef,
  // private dt:DataTransferService,
  // private hints:Rpa_Hints,
  private spinner: NgxSpinnerService
  ) {
    const ipPattern =
  "(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)";
    this.BluePrismConfigForm = this.formBuilder.group({
      configName: ["", Validators.compose([Validators.required,Validators.maxLength(50)])],
      bluPrismPassword: ["", Validators.compose([Validators.required,Validators.maxLength(50)])],
      bluePrismUsername: ["", Validators.compose([Validators.required,Validators.maxLength(50)])],
      categoryId:["", Validators.compose([Validators.required])],
      hostAddress: ["", Validators.compose([Validators.required, Validators.pattern(ipPattern), Validators.maxLength(50)])],
      username: ["", Validators.compose([Validators.required,Validators.maxLength(50)])],
      password: ["", Validators.compose([Validators.required,Validators.maxLength(50)])],
      port: ["", Validators.compose([Validators.required,Validators.maxLength(50)])],
      status : [],
    });

    this.UpdateBluePrismConfigForm = this.formBuilder.group({
      configName: ["", Validators.compose([Validators.required,Validators.maxLength(50)])],
      bluPrismPassword: ["", Validators.compose([Validators.required,Validators.maxLength(50)])],
      bluePrismUsername: ["", Validators.compose([Validators.required,Validators.maxLength(50)])],
      categoryId:["", Validators.compose([Validators.required])],
      hostAddress: ["", Validators.compose([Validators.required,Validators.pattern(ipPattern),Validators.maxLength(50)])],
      username: ["", Validators.compose([Validators.required,Validators.maxLength(50)])],
      password: ["", Validators.compose([Validators.required,Validators.maxLength(50)])],
      port: ["", Validators.compose([Validators.required,Validators.maxLength(50)])],
      status : [],
    });

}
ngOnInit() {
  this.spinner.show();
  this.passwordtype1=false;
  this.passwordtype2=false;
  //this.getblueprismconnections();
  this.getCategoryList();
  this.spinner.hide();
}


getblueprismconnections()
{
  this.api.getblueprisconnections().subscribe(data=>{
   this.blueprism_configs=data;
   if(this.blueprism_configs.length > 0)
    this.isTableHasData = false;
    else 
    this.isTableHasData = true;
   let envchange = this.blueprism_configs;
    envchange=envchange.map(data=>{
      data.status = data.status == 1 ? 'Active': data.status == 0? 'Inactive': ''; 
      data["categoryName"]=this.categoryList.find(item=>item.categoryId==data.categoryId).categoryName;
      return data;
    });
    
    //this.dataSource1= new MatTableDataSource(envchange.filter(item=>item.activeStatus=="Active"));
    this.dataSource1= new MatTableDataSource(envchange);
    this.isDataSource = true;
    this.dataSource1.sort=this.sort1;
    this.dataSource1.paginator=this.paginator1;
    this.deleteflag=false;
    this.updateflag=false;
  })
}

createBlueprism(){
  this.createblueprism = true;
  this.updateblueprims = false;
  document.getElementById("createbprism").style.display = "block";
  document.getElementById("updatebprism").style.display='none';
}

savedata(){
  console.log(this.BluePrismConfigForm);
}

close(){
  
  this.createblueprism = false;
  this.updateblueprims = false;
  document.getElementById("createbprism").style.display = "none";
}

closeUBP(){
  
  this.createblueprism = false;
  this.updateblueprims = false;
  document.getElementById("updatebprism").style.display = "none";
}

checkEnableDisableBtn(id, event)
{
  console.log(event);
  console.log(id);
  console.log(event.target.checked);
  this.blueprism_configs.find(data=>data.bluePrismId==id).checked=event.target.checked;
  if(this.blueprism_configs.filter(data=>data.checked==true).length==this.blueprism_configs.length)
  {
    this.checkflag=true;
  }else
  {
    this.checkflag=false;
  }
  this.checktoupdate();
  this.checktodelete();
}


checktoupdate()
{
  const selectedBluePrism = this.blueprism_configs.filter(product => product.checked==true);
  if(selectedBluePrism.length==1)
  {
    this.updateflag=true;
    this.updateid=selectedBluePrism[0].bluePrismId;
  }else
  {
    this.updateflag=false;
  }
}


checktodelete()
{
  console.log(this.blueprism_configs.filter(product => product.checked).map(p => p.bluePrismId));
  const selectedBluePrism = this.blueprism_configs.filter(product => product.checked).map(p => p.bluePrismId);
  if(selectedBluePrism.length>0)
  {
    this.deleteflag=true;
  }else
  {
    this.deleteflag=false;
  }
}


 delete_blueprism_config(){
    console.log("delete_blueprism_config");
    const selectedEnvironments = this.blueprism_configs.filter(product => product.checked==true).map(p => p.bluePrismId);
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
          this.api.delete_blueprism_config(selectedEnvironments).subscribe( data =>{
            let res:any=data;
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: res.status,
              showConfirmButton: false,
              timer: 2000
            })
  
            this.removeallchecks();
            this.getblueprismconnections();
            //this.getallData();
            this.spinner.hide();
            this.checktoupdate();
            this.checktodelete();
          })
        }
      })
    }
  }
  
  removeallchecks()
{
  for(let i=0;i<this.blueprism_configs.length;i++)
  {
    console.log(this.blueprism_configs[i]);
    this.blueprism_configs[i].checked= false;
    console.log(this.blueprism_configs[i]);
  }
  this.checkflag=false;
}

checkAllCheckBox(ev) {
  this.blueprism_configs.forEach(x => x.checked = ev.target.checked)
  this.checktoupdate();
  this.checktodelete();
}

reset_createblueprism(){
  
  this.BluePrismConfigForm.reset();
  this.BluePrismConfigForm.get("categoryId").setValue(this.categoryList.lenght==1?this.categoryList[0].categoryId:"0")
}

reset_Updateblueprism(){
  this.UpdateBluePrismConfigForm.reset();
  this.BluePrismConfigForm.get("categoryId").setValue("0")

}


saveBluePrism()
{
  this.spinner.show();
 if(this.BluePrismConfigForm.valid)
 {
  let response:any;
      response=this.BluePrismConfigForm.value;
      (response.status==true)?response.status=1:response.status=0;
      response.port=parseInt(response.port);
      this.submitted=true;
      this.api.save_blueprism_config(response).subscribe(resp=>{
        let response:any=resp;
        this.spinner.hide();
        if(response.errorMessage==undefined)
        {
          // Swal.fire({
          //   position: 'center',
          //   icon: 'success',
          //   title: response.status,
          //   showConfirmButton: false,
          //   timer: 2000
          // })
          Swal.fire("Success",response.status,"success")
        //this.getallData();
          this.checktoupdate();
          this.checktodelete();
          document.getElementById("createbprism").style.display='none';        
          this.createblueprism = false;
          this.updateblueprims = false;
          this.BluePrismConfigForm.reset();
          this.getblueprismconnections();
          this.submitted=true;
        }
        else
        {
          Swal.fire("Error",response.errorMessage,"error")
        }
        });
    }
  else
  {
  }
}

Update_BluePrism()
{
  this.spinner.show();
 if(this.UpdateBluePrismConfigForm.valid)
 {
  let response:any;
      response=this.UpdateBluePrismConfigForm.value;
      console.log(response);
      (response.status==true)?response.status=1:response.status=0;
      response.port=parseInt(response.port);
      console.log(response);
      response["bluePrismId"]=this.bpid;
      this.updatesubmitted = true;
      this.api.edit_blueprism_config(response).subscribe(resp=>{
        let response:any=resp;
        if(response.errorMessage==undefined)
        {
          this.spinner.hide();
          Swal.fire("Success",response.status,"success")
          this.removeallchecks();
          this.checktoupdate();
          this.checktodelete();
          document.getElementById("updatebprism").style.display='none';        
          this.createblueprism = false;
          this.updateblueprims = false;
          this.UpdateBluePrismConfigForm.reset();
          this.getblueprismconnections();
          this.updatesubmitted = false;
            
        }
        else
        {
          Swal.fire("Error",response.errorMessage,"error")
        }
      },(err)=>{
        console.log(err);
        Swal.fire("Error","Failed to update environment","error");
      });
    }
  else
  {
    // alert("Invalid Form")
  }
}

updateBluePrism(){
  console.log("Hello updatecall");
}


updatedata()
{
  document.getElementById("createbprism").style.display='none';
  document.getElementById('updatebprism').style.display='block';
  this.createblueprism = false;
  this.updateblueprims = true;
  let data:any;
  console.log("this.blueprism_configs.value",this.blueprism_configs);
  for(data of this.blueprism_configs)
  {
    if(data.bluePrismId==this.updateid)
    {
      if(data.status=='Active'){
        this.toggle=true;
      }else{
        this.toggle=false;
      }
      this.bpid = this.updateid;
      this.UpdateBluePrismConfigForm.get("configName").setValue(data["configName"]);
      this.UpdateBluePrismConfigForm.get("bluePrismUsername").setValue(data["bluePrismUsername"]);
      this.UpdateBluePrismConfigForm.get("bluPrismPassword").setValue(data["bluPrismPassword"]);
      this.UpdateBluePrismConfigForm.get("categoryId").setValue(data["categoryId"]);
      this.UpdateBluePrismConfigForm.get("hostAddress").setValue(data["hostAddress"]);
      this.UpdateBluePrismConfigForm.get("username").setValue(data["username"]);
      this.UpdateBluePrismConfigForm.get("password").setValue(data["password"]);
      this.UpdateBluePrismConfigForm.get("port").setValue(data["port"]);
      //this.UpdateBluePrismConfigForm.get("status").setValue(data["status"]);
      break;
    }
  }
  console.log(this.UpdateBluePrismConfigForm.value);
}

testBluePrismconnection()
  {
    if(this.createblueprism == true)
    {
      if(this.BluePrismConfigForm.valid)
      {
        this.Formresponse=this.BluePrismConfigForm.value;
      }
    }
    else if(this.updateblueprims == true)
    {
      if(this.UpdateBluePrismConfigForm.valid)
      {
        this.Formresponse=this.UpdateBluePrismConfigForm.value;
      }
    }
    if(this.BluePrismConfigForm.valid)
    {
      let response:any;
      response= this.Formresponse;
      (response.status==true)?response.status=1:response.status=0;
      response.port=parseInt(response.port);
      this.api.testcon_blueprism_config(response).subscribe(resp=>{
        let response:any=resp
        Swal.fire(response.status,"","success");
        if(response.errorCode==undefined){
          // Swal.fire({
          //   position: 'center',
          //   icon: 'success',
          //   title: response.status,
          //   showConfirmButton: false,
          //   timer: 2000
          // })
          Swal.fire("Success",response.status,"success");
          }else{
            // Swal.fire({
            //   position: 'center',
            //   icon: 'error',
            //   title: response.errorMessage,
            //   showConfirmButton: false,
            //   timer: 2000
            // })
            
            Swal.fire("Error",response.errorMessage,"error");
          }
      })
    }
    else
    {
      console.log("Invalid Form");

    }
  }
  //apply filter
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

  BluePrismCreatetestconnection()
  {
    if(this.BluePrismConfigForm.valid)
    {
      this.spinner.show();
      this.Formresponse=this.BluePrismConfigForm.value;
      let response:any;
      response= this.Formresponse;
      (response.status==true)?response.status=1:response.status=0;
      response.port=parseInt(response.port);
      this.api.testcon_blueprism_config(response).subscribe(resp=>{
        let response:any=resp;
        this.spinner.hide();
        Swal.fire(response.status,"","success");
        if(response.errorCode==undefined){
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Successfully Connected',
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
      })
    }
    else
    {
      console.log("Invalid Form");
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Invalid Form',
        showConfirmButton: false,
        timer: 2000
      })

    }
  }

  BluePrismupdatetestconnection()
  {
    if(this.UpdateBluePrismConfigForm.valid)
    {
      this.spinner.show();
      this.Formresponse=this.UpdateBluePrismConfigForm.value;
      let response:any;
      response= this.Formresponse;
      (response.status==true)?response.status=1:response.status=0;
      response.port=parseInt(response.port);
      this.api.testcon_blueprism_config(response).subscribe(resp=>{
        let response:any=resp
        this.spinner.hide();
        Swal.fire(response.status,"","success");
        if(response.errorCode==undefined){
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Successfully Connected',
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
      })
    }
    else
    {
      console.log("Invalid Form");
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Invalid Form',
        showConfirmButton: false,
        timer: 2000
      })
    }
  }

  
getCategoryList()
{
  this.api.getCategoriesList().subscribe(data=>{
    let catResponse : any;
    catResponse=data
    this.categoryList=catResponse.data;
    this.getblueprismconnections();
  });
}

}
