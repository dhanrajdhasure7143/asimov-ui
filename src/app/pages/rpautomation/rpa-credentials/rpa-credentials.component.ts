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
import * as moment from 'moment';
@Component({
  selector: 'app-rpa-credentials',
  templateUrl: './rpa-credentials.component.html',
  styleUrls: ['./rpa-credentials.component.css']
})
export class RpaCredentialsComponent implements OnInit {
  displayedColumns1: string[] = ["check","userName","password","serverName","categoryName","createdTimeStamp","createdBy"];
  public toggle:boolean;
  dataSource2:MatTableDataSource<any>;
  public updateflag: boolean;
  public submitted:Boolean;
  public Credcheckflag:boolean = false;
  public dbupdateid : any;
  categoryList:any;
  @ViewChild("paginator3",{static:false}) paginator3: MatPaginator;
  @ViewChild("sort2",{static:false}) sort2: MatSort;
  public button:string;
  public credentials:any=[];
  public checkeddisabled:boolean =false;
  public Credcheckeddisabled:boolean =false;
  public credupdatedata:any;
    public Credupdateflag:Boolean;
    public Creddeleteflag:Boolean;
    public passwordtype1:Boolean;
    public passwordtype2:Boolean;
    customUserRole: any;
    enableCredential: boolean=false;
    userRole: any;
    public isButtonVisible = false;
    addflag:boolean=false;
    isCreateForm:boolean=true;
    isSearch:boolean=false;
    isLoading:boolean=true;

    
    constructor(private api:RestApiService, 
      private router:Router,
      private hints:Rpa_Hints, 
      private formBuilder: FormBuilder,
      private chanref:ChangeDetectorRef, 
      private dt:DataTransferService,
      private spinner: NgxSpinnerService
      ) { 
  
      this.Credupdateflag=false;
      this.Creddeleteflag=false;
      
    }

  ngOnInit() {
    this.spinner.show();
    this.dt.changeHints(this.hints.rpadbchints);
    this.getCategories();
    this.passwordtype1=false;
    this.passwordtype2=false;

    this.userRole = localStorage.getItem("userRole")
    this.userRole = this.userRole.split(',');
    this.isButtonVisible = this.userRole.includes('SuperAdmin') || this.userRole.includes('Admin') || this.userRole.includes('RPA Admin') || this.userRole.includes('RPA Designer')
    || this.userRole.includes('Process Owner') || this.userRole.includes('Process Architect')  || this.userRole.includes('Process Analyst')  || this.userRole.includes('RPA Developer')  || this.userRole.includes('Process Architect') || this.userRole.includes("System Admin") || this.userRole.includes('User');
    
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

inputNumberOnly(event){
      let numArray= ["0","1","2","3","4","5","6","7","8","9","Backspace","Tab"]
      let temp =numArray.includes(event.key); //gives true or false
     if(!temp){
      event.preventDefault();
     } 
    }

  async getallCredentials(){
    this.credentials= [];
    let role=localStorage.getItem('userRole')
    await this.api.get_All_Credentials(role).subscribe(
      data1 => {
        this.credentials = data1;
        this.isLoading=false;
        if(this.credentials.length>0){ 
           this.Credcheckeddisabled = false;
           this.credentials.sort((a,b) => a.credentialId > b.credentialId ? -1 : 1);
           if(this.categoryList!=undefined){
            this.credentials=this.credentials.map(item=>{
              item["categoryName"]=this.categoryList.find(item2=>item2.categoryId==item.categoryId).categoryName;
              item["createdTimeStamp_converted"] = moment(new Date(item.createdTimeStamp)).format('lll')
              return item;
            })
           }
         
         
           setTimeout(() => {
            this.sortmethod(); 
          }, 80);
  
         }
         else
         {
           this.Credcheckeddisabled = true;
         }
        this.dataSource2= new MatTableDataSource(this.credentials);
        this.spinner.hide();
      });
  }

  sortmethod(){
    this.dataSource2.sort = this.sort2;   
    this.dataSource2.paginator=this.paginator3; 
  }

  CredcheckAllCheckBox(ev) {
    this.credentials.forEach(x =>
       x.checked = ev.target.checked);
       if(this.credentials.filter(data=>data.checked==true).length==this.credentials.length){
         this.Credcheckflag=true;
       }
       else{
         this.Credcheckflag=false;  
       }
    this.Credchecktoupdate();
    this.checktodelete();
  }
  
  openCreateCredential(){
    this.isCreateForm = true;
    document.getElementById("createcredentials").style.display='block';
    // this.insertForm.get("categoryId").setValue(this.categoryList.length==1?this.categoryList[0].categoryId:"0")
    // document.getElementById("Updatecredntials").style.display='none';
  }

  openUpdateCredential() {
    document.getElementById('createcredentials').style.display = 'block';
    let data: any;
    this.isCreateForm = false;
    for (data of this.credentials) {
      if (data.credentialId == this.dbupdateid) {
        this.credupdatedata = data;
        break;
      }
    }
  }

  deleteCredentials(){
    const selectedcredentials = this.credentials.filter(product => product.checked==true).map(p => p.credentialId);
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
        this.api.delete_Credentials(selectedcredentials).subscribe( res =>{ 
          let status:any = res;
          this.spinner.hide();
          if(status.errorMessage==undefined){
            Swal.fire("Success",status.status,"success");
            this.removeallchecks();
            this.getallCredentials();
            this.Credchecktoupdate();  
            this.checktodelete();   
          }else{
            Swal.fire("Error",status.errorMessage,"error")
          }              
        },err=>{
          this.spinner.hide();
          Swal.fire("Error","Unable to delete credentails","error");
        });
      }
    });
  }

  Credchecktoupdate(){
    const selectedcredentials = this.credentials.filter(product => product.checked==true);
    if(selectedcredentials.length > 0){
      this.addflag = true;
    }else{
      this.addflag = false;
    }
    if(selectedcredentials.length==1)
    {
      this.Credupdateflag=true;
      this.dbupdateid=selectedcredentials[0].credentialId;
    }else{
      this.Credupdateflag=false;
    }
  }

  CredcheckEnableDisableBtn(id, event){
    this.credentials.find(data=>data.credentialId==id).checked=event.target.checked;
    if(this.credentials.filter(data=>data.checked==true).length==this.credentials.length){
      this.Credcheckflag=true;
    }else{
      this.Credcheckflag=false;  
    }
    this.Credchecktoupdate();
    this.checktodelete();
  }

  checktodelete(){
    const selectedcredentialsdata = this.credentials.filter(product => product.checked).map(p => p.credentialId);
    if(selectedcredentialsdata.length>0){
      this.Creddeleteflag=true;
    }else{
      this.Creddeleteflag=false;
    }
  }

  applyFilter1(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource2.filter = filterValue;
  }

  removeallchecks(){
    for(let i=0;i<this.credentials.length;i++){
      this.credentials[i].checked= false;
    }
    this.Credcheckflag=false;
  }

  getCategories(){
    this.api.getCategoriesList().subscribe(data=>{
      let response:any=data;
        this.categoryList=response.data;
      this.getallCredentials();
    })
  }

  refreshCredentialList(event){
    console.log(event)
    if(event){
      this.getallCredentials();
    }
  }
}
