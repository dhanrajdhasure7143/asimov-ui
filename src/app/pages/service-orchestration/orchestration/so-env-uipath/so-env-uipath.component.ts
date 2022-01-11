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
  selector: 'app-so-env-uipath',
  templateUrl: './so-env-uipath.component.html',
  styleUrls: ['./so-env-uipath.component.css']
})
export class SoEnvUipathComponent implements OnInit {

  
  displayedColumns: string[] = ["check","accountName","categoryName","tenantName","clientId","userKey","active","createdTimeStamp","createdBy"];
  dataSource1:MatTableDataSource<any>;
  public isDataSource: boolean;
  @ViewChild("paginator1",{static:false}) paginator1: MatPaginator;
  @ViewChild("sort1",{static:false}) sort1: MatSort;
  @ViewChild('closebutton', {static: false}) closebutton
  @Output()
  title:EventEmitter<string> = new EventEmitter<string>();
  public environments:any=[];
  public selectedTab=0;
  public check_tab=0;
  public param:any=0;
  public processId : any;
  public checkeddisabled:boolean =false;
  public categoryLengthCheck:Boolean=false;
  public createpopup=document.getElementById('createevironment');
  public button:string;
  //public updatepopup=document.getElementById('env_updatepopup');
  public delete_elements:number[];
  public masterSelected:Boolean;
  public updateenvdata:any;
  public environmentName:FormControl;
  public insertForm:FormGroup;
  public updateflag:Boolean;
  public deleteflag:Boolean;
  private updateid:number;
  public term:string;
  public submitted:Boolean;
  public updatesubmitted : Boolean=false;
  public checkflag:Boolean;
  public toggle:Boolean;
  public passwordtype1:Boolean;
  public passwordtype2:Boolean;
  isDtInitialized:boolean = false;
  public Uipath_configs:any;
  public UipathForm:FormGroup;
  public UpdateUipathForm:FormGroup;
  public BluePrismFlag:boolean=false;
  public addBPconfigstatus:boolean=false;
  public isTableHasData : boolean = false;
  public FilterHasnodata : boolean = true;
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

    this.UipathForm = this.formBuilder.group({
      accountName: ["", Validators.compose([Validators.required,Validators.maxLength(50)])],
      tenantName: ["", Validators.compose([Validators.required,Validators.maxLength(50)])],
      categoryId:["",Validators.compose([Validators.required])],
      userKey: ["", Validators.compose([Validators.required,Validators.maxLength(50)])],
      clientId: ["", Validators.compose([Validators.required,Validators.maxLength(50)])],
      active : [],
    });

    this.UpdateUipathForm = this.formBuilder.group({
      accountName: ["", Validators.compose([Validators.required,Validators.maxLength(50)])],
      tenantName: ["", Validators.compose([Validators.required,Validators.maxLength(50)])],
      categoryId:["",Validators.compose([Validators.required])],
      userKey: ["", Validators.compose([Validators.required,Validators.maxLength(50)])],
      clientId: ["", Validators.compose([Validators.required,Validators.maxLength(50)])],
      active : [],
    });
}
ngOnInit() {
  this.spinner.show();
  this.passwordtype1=false;
  this.passwordtype2=false;
  //this.updatepopup=document.getElementById('env_updatepopup');
  // this.dt.changeHints(this.hints.rpaenvhints);
  this.getCategoryList();
  //this.getallData();
  this.spinner.hide();
}


getUiPath()
{
  this.api.getOrchestrationconfig().subscribe(data=>{
   this.Uipath_configs=data;
   if(this.Uipath_configs.value.length > 0)
     {
      this.isTableHasData = false;
     }
     else 
     {
      this.isTableHasData = true;
     }
   this.Uipath_configs= this.Uipath_configs.value;
  
   this.Uipath_configs=this.Uipath_configs.map(item=>{
     item["categoryName"]=this.categoryList.find(item2=>item2.categoryId==item.categoryId).categoryName;
     return item;
   })
   this.dataSource1= new MatTableDataSource(this.Uipath_configs);
  
   this.isDataSource = true;
   this.dataSource1.sort=this.sort1;
   this.dataSource1.paginator=this.paginator1;
  this.deleteflag=false;
   this.updateflag=false;
  })
}

createUiPath(){
  
  this.UipathForm.reset();
  document.getElementById("createUipath").style.display = "block";
  document.getElementById("updateUipath").style.display = "none";
  if(this.categoryList.length==1)
    this.UipathForm.get("categoryId").setValue(this.categoryList[0].categoryId)
  else
    this.UipathForm.get("categoryId").setValue("")

  
}

savedata(){
 
}

close(){
  document.getElementById("createUipath").style.display = "none";
}

closeUBP(){
  document.getElementById("updateUipath").style.display = "none";
}

UpdateUipath(){
  document.getElementById("updateUipath").style.display = "block";
}


//Checkbox realted


checkEnableDisableBtn(id, event)
{
  
  this.Uipath_configs.find(data=>data.sourceAccId==id).checked=event.target.checked;
  if(this.Uipath_configs.filter(data=>data.checked==true).length==this.Uipath_configs.length)
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
  const selectedBluePrism = this.Uipath_configs.filter(product => product.checked==true);
  if(selectedBluePrism.length==1)
  {
    this.updateflag=true;
    this.updateid=selectedBluePrism[0].sourceAccId;
  }else
  {
    this.updateflag=false;
  }
}


checktodelete()
{
 
  const selectedBluePrism = this.Uipath_configs.filter(product => product.checked).map(p => p.userKey);
  if(selectedBluePrism.length>0)
  {
    this.deleteflag=true;
  }else
  {
    this.deleteflag=false;
  }
}


removeallchecks()
{
  for(let i=0;i<this.Uipath_configs.length;i++)
  {
  
    this.Uipath_configs[i].checked= false;
    
  }
  this.checkflag=false;
}

checkAllCheckBox(ev) {
  this.Uipath_configs.forEach(x => x.checked = ev.target.checked)
  this.checktoupdate();
  this.checktodelete();
}

//update functions

saveUiPath(){
  if(this.UipathForm.valid){
    let data=this.UipathForm.value;
    data["sourceType"]="UiPath";
    data["sourceAccId"]=0
    this.spinner.show()
    this.api.save_ui_path_env(data).subscribe(res=>{
      let response:any=res;
      if(response.errorMessage==undefined)
        Swal.fire("Success",response.status,"success")
      else
        Swal.fire("Error",response.errorMessage,"error")
      this.spinner.hide();
      this.getUiPath();
    })

    document.getElementById("createUipath").style.display='none';
  }
  
}
updatedata()
{
  document.getElementById("createUipath").style.display='none';
  document.getElementById('updateUipath').style.display='block';
  let data:any;
  
  for(data of this.Uipath_configs)
  {
    if(data.sourceAccId==this.updateid)
    {
      if(data.active==true)
        data.active=1
      else
        data.active=0;
      this.UpdateUipathForm.get("accountName").setValue(data["accountName"]);
      this.UpdateUipathForm.get("tenantName").setValue(data["tenantName"]);
      this.UpdateUipathForm.get("categoryId").setValue(data["categoryId"]);
      this.UpdateUipathForm.get("userKey").setValue(data["userKey"]);
      this.UpdateUipathForm.get("clientId").setValue(data["clientId"]);
      this.UpdateUipathForm.get("active").setValue(data["active"]);
      if(this.categoryList.length==1)
      {
        this.UpdateUipathForm.get("categoryId").setValue(this.categoryList[0].categoryId);
      }else
      {
        this.UpdateUipathForm.get("categoryId").setValue(data["categoryId"]);
      }
      break;
    }
  }
  this.updatesubmitted=false;
  
}

Update_UiPath(){
  this.spinner.show();
    let updatedData=this.UpdateUipathForm.value;
    updatedData["sourceAccId"]=this.updateid,
    updatedData["sourceType"]="UiPath"
   
    this.api.update_uipath_env(updatedData).subscribe(res=>{
      this.spinner.hide();
      let response:any=res;
      this.updatesubmitted=false;
      if(response.errorMessage==undefined)
      {
        Swal.fire("Success",response.status,"success");
        document.getElementById('updateUipath').style.display='none';
      }
      else{
        Swal.fire("Error",response.errorMessage,"error")
      }
    })
  
  }


// apply filter

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


getCategoryList()
{
  this.api.getCategoriesList().subscribe(data=>{
    let catResponse : any;
    catResponse=data
    if(catResponse.errorMessage==undefined)
    {
      this.categoryList=catResponse.data;
      if(this.categoryList.length==1)
      {
        this.categoryLengthCheck=true;
      }
      else
      {
        this.categoryLengthCheck=false;
      }
    }
    this.getUiPath();
  });
}

reset_createUiPath(){
this.UipathForm.reset();
this.UipathForm.get("categoryId").setValue("")
}

reset_UpdateUiPath(){
  this.UpdateUipathForm.reset();
  this.UpdateUipathForm.get("categoryId").setValue("")
}
}
