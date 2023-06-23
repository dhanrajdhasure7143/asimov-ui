import { Component,  OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { RestApiService } from '../../services/rest-api.service';
import { DataTransferService} from "../../services/data-transfer.service";
import {Rpa_Hints} from "../model/RPA-Hints";
import { LoaderService } from 'src/app/services/loader/loader.service';
import { columnList } from 'src/app/shared/model/table_columns';
import { Router } from '@angular/router';
@Component({
  selector: 'app-rpa-credentials',
  templateUrl: './rpa-credentials.component.html',
  styleUrls: ['./rpa-credentials.component.css'],
  providers: [columnList]
})
export class RpaCredentialsComponent implements OnInit {
  public toggle:boolean;
  public updateflag: boolean;
  public submitted:boolean;
  categoryList:any;
  public button:string;
  public credentials:any[]=[];
  public credupdatedata:any;
    public Credupdateflag:boolean;
    public Creddeleteflag:boolean;
    public passwordtype1:boolean;
    public passwordtype2:boolean;
    customUserRole: any;
    enableCredential: boolean=false;
    userRole: any;
    public isButtonVisible = false;
    addflag:boolean = false;
    isCreateForm:boolean=true;
    isSearch:boolean=false;
    isLoading:boolean=true;
    columns_list:any =[];
    selectedData: any;
    categories_list: any =[];
    table_searchFields: any[]=[];
    hiddenPopUp:boolean=false;
    originalCredentialsList:any[]=[];
    hideLables:boolean = true
    constructor(private api:RestApiService, 
      private router:Router,
      private hints:Rpa_Hints, 
      private dt:DataTransferService,
      private spinner: LoaderService,
      private columnList: columnList
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
    this.columns_list = this.columnList.emailList_column
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

  getallCredentials(){
    this.Credupdateflag = false;
    this.credentials= [];
    let role=localStorage.getItem('userRole')
    this.api.get_All_Credentials(role).subscribe((data1:any) => {
        this.credentials = data1;
        this.isLoading=false;
        if(this.credentials.length>0){ 
           this.credentials.sort((a,b) => a.credentialId > b.credentialId ? -1 : 1);
           if(this.categoryList!=undefined){
            this.credentials=this.credentials.map(item=>{
              item["categoryName"]=this.categoryList.find(item2=>item2.categoryId==item.categoryId).categoryName;
              item["createdTimeStamp_converted"] = new Date(item.createdTimeStamp);
              item["password_new"]=(item["password"]!="")?("*").repeat(10):"-";
              item["tableClientId"]="";
              item["tableClientSecret"]="";
              item["tableOfficeTenant"]="";
              if(item["clientId"]!=null && item["clientId"]!="")
              item["tableClientId"]= item["clientId"].length>=6?(item["clientId"].substr(0, 2) +("x").repeat( item["clientId"].length-4) + item["clientId"].substr( item["clientId"].length-2,  item["clientId"].length)):item["clientId"];
              if(item["clientSecret"]!=null && item["clientSecret"]!="")
              item["tableClientSecret"]= item["clientSecret"].length>=6?(item["clientSecret"].substr(0, 2) +("x").repeat( item["clientSecret"].length-4) + item["clientSecret"].substr( item["clientSecret"].length-2,  item["clientSecret"].length)):item["clientSecret"];
              if(item["officeTenant"]!=null && item["officeTenant"]!="")
              item["tableOfficeTenant"]=  item["officeTenant"].length>=6?(item["officeTenant"].substr(0, 2) +("x").repeat( item["officeTenant"].length-4) + item["officeTenant"].substr( item["officeTenant"].length-2,  item["officeTenant"].length)):item["officeTenant"]; 
              return item;
            })
            this.readSelectedData([]);
           }
         }
        this.table_searchFields=["userName","serverName","tableClientId","tableClientSecret","tableOfficeTenant","categoryName","createdBy","createdTimeStamp_converted","host","port"]
        this.spinner.hide();
      });
  }

  
  
  openCreateCredential(){
    this.isCreateForm = true;
    this.hideLables = false
    this.hiddenPopUp=true;
    // document.getElementById("createcredentials").style.display='block';
    // this.insertForm.get("categoryId").setValue(this.categoryList.length==1?this.categoryList[0].categoryId:"0")
    // document.getElementById("Updatecredntials").style.display='none';
  }

  openUpdateCredential() {
    this.hiddenPopUp=true;
    // document.getElementById('createcredentials');
    this.isCreateForm = false;
    this.credupdatedata = this.selectedData[0];
  }

  deleteCredentials(){
    const selectedcredentials = this.selectedData.map(p => p.credentialId);
    Swal.fire({
      title: 'Are you Sure?',
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
        this.api.delete_Credentials(selectedcredentials).subscribe( res =>{ 
          let status:any = res;
          this.spinner.hide();
          if(status.errorMessage==undefined){
            Swal.fire("Success",status.status,"success");
            this.getallCredentials();
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

 

  applyFilter1(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    // this.dataSource2.filter = filterValue;
    // if (this.dataSource2.filteredData.length === 0) {
    //   this.noDataMessage = true;
    // }else {
    //   this.noDataMessage = false;
    // }
  }

  getCategories(){
    this.api.getCategoriesList().subscribe(data=>{
      let response:any=data;
        this.categoryList=response.data;
        let sortedList=this.categoryList.sort((a, b) => (a.categoryName.toLowerCase() > b.categoryName.toLowerCase()) ? 1 : ((b.categoryName.toLowerCase() > a.categoryName.toLowerCase()) ? -1 : 0));
    sortedList.forEach(element => {
      this.categories_list.push(element.categoryName)
    });
    this.columns_list.map(item=>{
      if(item.ColumnName === "categoryName"){
        item["dropdownList"]=this.categories_list
      }
    })
      this.getallCredentials();
    })
  }

  refreshCredentialList(event){
    if(event){
      this.hiddenPopUp=false;
      this.getallCredentials();
    }
  }

  readSelectedData(data) {
    this.selectedData =data;
    this.selectedData.length > 0 ?this.addflag =true :this.addflag =false
    this.selectedData.length > 0 ?this.Creddeleteflag =true :this.Creddeleteflag =false
    this.selectedData.length == 1 ?this.Credupdateflag =true :this.Credupdateflag =false
  }
  closeOverlay(event){
    this.hiddenPopUp=false;
  }

  updateCredential(data) {
    this.hiddenPopUp=true;
    this.isCreateForm = false;
    this.credupdatedata = data;
  }

  deleteEmailByRow(row){
    // const selectedcredentials = this.selectedData.map(p => p.credentialId);
    const selectedcredentials=[]
    selectedcredentials.push(row.credentialId);
    Swal.fire({
      title: 'Are you Sure?',
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
        this.api.delete_Credentials(selectedcredentials).subscribe( res =>{ 
          let status:any = res;
          this.spinner.hide();
          if(status.errorMessage==undefined){
            Swal.fire("Success",status.status,"success");
            this.getallCredentials();
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
}
