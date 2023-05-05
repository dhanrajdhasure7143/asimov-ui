import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rpa-credential-form',
  templateUrl: './rpa-credential-form.component.html',
  styleUrls: ['./rpa-credential-form.component.css']
})
export class RpaCredentialFormComponent implements OnInit {
  @Input() isCreateForm:boolean;
  @Input() credupdatedata:any=[];
  @Output() refreshTable = new EventEmitter<any>();
  categoryList: any;
  public credentialForm: FormGroup;
  public Credupdateflag: Boolean;
  public Creddeleteflag: Boolean;
  public passwordtype1: Boolean;
  public passwordtype2: Boolean;
  submitted: boolean;
  public maskedFields:any={
    officeTenant:true,
    clientId:true,
    clientSecret:true
  }
  constructor(private api:RestApiService,
    private formBuilder: FormBuilder,
    private chanref:ChangeDetectorRef,
    private spinner: LoaderService) {

      this.credentialForm=this.formBuilder.group({
        userName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        password: ["", Validators.compose([Validators.maxLength(50)])],
        categoryId:["0", Validators.compose([Validators.required])],
        serverName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        authType:[""],
        clientSecret:[""],
        clientId:[""],
        officeTenant:[""],
        host:[""],
        port:[""],
        inBoundAddress: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        inBoundAddressPort: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        outBoundAddress: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        outboundAddressPort: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    })

      this.Credupdateflag=false;
      this.Creddeleteflag=false;
     }

  ngOnInit(): void {
    // this.spinner.show();
    this.getCategories();
    this.passwordtype1=false;
    this.passwordtype2=false;
    this.spinner.hide();


  }

  ngOnChanges(changes:SimpleChanges){
    if(!this.isCreateForm){
      this.credentialForm.get("userName").setValue(this.credupdatedata["userName"]);
      this.credentialForm.get("password").setValue(this.credupdatedata["password"]);
      this.credentialForm.get("categoryId").setValue(this.credupdatedata["categoryId"]);
      setTimeout(()=>{
        this.credentialForm.get("serverName").setValue(this.credupdatedata["serverName"]);
        if(this.credentialForm.get("serverName").value=="Office365")
        {        
          if(this.credupdatedata["password"]!="" && this.credupdatedata["password"] != null)
          {
            this.credentialForm.get("authType").setValue("password");
            this.onChangeAuthType("password");

          }
          else
          {
            this.credentialForm.get("authType").setValue("secretKey");
            this.onChangeAuthType("secretKey");
          }
        }
      },100);
      this.credentialForm.get("host").setValue(this.credupdatedata["host"]);
      this.credentialForm.get("port").setValue(this.credupdatedata["port"]);
      this.credentialForm.get("clientId").setValue(this.credupdatedata["clientId"]);
      this.credentialForm.get("clientSecret").setValue(this.credupdatedata["clientSecret"]);
      this.credentialForm.get("officeTenant").setValue(this.credupdatedata["officeTenant"]);
      this.credentialForm.get("inBoundAddress").setValue(this.credupdatedata["inBoundAddress"]);
      this.credentialForm.get("inBoundAddressPort").setValue(this.credupdatedata["inBoundAddressPort"]);
      this.credentialForm.get("outBoundAddress").setValue(this.credupdatedata["outBoundAddress"]);
      this.credentialForm.get("outboundAddressPort").setValue(this.credupdatedata["outboundAddressPort"]);
    }else{
      this.credentialForm=this.formBuilder.group({
        userName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        password: ["", Validators.compose([ Validators.maxLength(50)])],
        clientSecret:[""],
        authType:[""],
        clientId:[""],
        officeTenant:[""],
        host:[""],
        port:[""],
        categoryId:["", Validators.compose([Validators.required])],
        serverName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        inBoundAddress: ["", Validators.compose([Validators.required, Validators.maxLength(50),Validators.pattern("^[a-zA-Z0-9_-]*$")])],
        inBoundAddressPort: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        outBoundAddress: ["", Validators.compose([Validators.required, Validators.maxLength(50),Validators.pattern("^[a-zA-Z0-9_-]*$")])],
        outboundAddressPort: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    })
    }


  }


  inputNumberOnly(event){
    let numArray= ["0","1","2","3","4","5","6","7","8","9","Backspace","Tab"]
    let temp =numArray.includes(event.key); //gives true or false
   if(!temp){
    event.preventDefault();
   }
  }

  saveCredentials() {
    if (this.isCreateForm) {
      if (this.credentialForm.valid) {
        this.spinner.show();
        this.submitted = true;
        let Credentials = this.credentialForm.value;
        Credentials["categoryId"]=parseInt(Credentials["categoryId"]);
        if(Credentials["serverName"]!='Office365')
        {
            Credentials["clientId"]="";
            Credentials["clientSecret"]="";
            Credentials["officeTenant"]="";
        }
        if(Credentials["serverName"]=="Office365")
        {
          if(Credentials["authType"]=="password")
          {
            Credentials["clientId"]="";
            Credentials["clientSecret"]="";
            Credentials["officeTenant"]="";
          }
          else
          {
            Credentials["password"]="";
          }
        }
        if(Credentials["serverName"]!="Others")
        {
          Credentials["host"]="";
          Credentials["port"]="";
        }
        this.api.save_credentials(Credentials).subscribe(res => {
          let status: any = res;
          this.spinner.hide();
          if (status.errorMessage == undefined) {
            this.refreshTable.emit(true)
            Swal.fire("Success", status.status, "success");
            document.getElementById('createcredentials').style.display = "none";
            this.resetCredForm();
            this.submitted = false;
          }
          else
            Swal.fire("Error", status.errorMessage, "error");
        }, err => {
          this.spinner.hide();
          Swal.fire("Error", "Unable to save credentials", "error");
          this.refreshTable.emit(false)
        });
      }
    } else {
      this.credentialsupdate();
    }
  }

resetCredForm(){
  this.credentialForm.reset();
  this.credentialForm.get("categoryId").setValue(this.categoryList.length==1?this.categoryList[0].categoryId:'0')
  this.credentialForm.get("serverName").setValue("")
  this.passwordtype1=false;
}

  credentialsupdate() {
    if (this.credentialForm.valid) {
      this.spinner.show();
      let credupdatFormValue = this.credentialForm.value;
      credupdatFormValue["credentialId"] = this.credupdatedata.credentialId;
      credupdatFormValue["categoryId"]=parseInt(credupdatFormValue["categoryId"]);
      if(credupdatFormValue["serverName"]!='Office365')
        {
          credupdatFormValue["clientId"]="";
          credupdatFormValue["clientSecret"]="";
          credupdatFormValue["officeTenant"]="";
        }
       
        if(credupdatFormValue["serverName"]!="Others")
        {
          credupdatFormValue["host"]="";
          credupdatFormValue["port"]="";
        }
      // if(credupdatFormValue["clientId"]=="")
      //   credupdatFormValue["clientId"]=this.credupdatedata["clientId"];
      // if(credupdatFormValue["clientSecret"]=="")
      //   credupdatFormValue["clientSecret"]=this.credupdatedata["clientSecret"];
      // if(credupdatFormValue["officeTenant"] =="")
      //   credupdatFormValue["officeTenant"]=this.credupdatedata["officeTenant"];

        if(credupdatFormValue["serverName"]=="Office365")
        {
          if(credupdatFormValue["authType"]=="password")
          {
            credupdatFormValue["clientId"]="";
            credupdatFormValue["clientSecret"]="";
            credupdatFormValue["officeTenant"]="";
          }
          else
          {
            credupdatFormValue["password"]="";
            if(credupdatFormValue["clientId"]=="")
              credupdatFormValue["clientId"]=this.credupdatedata["clientId"];
            if(credupdatFormValue["clientSecret"]=="")
              credupdatFormValue["clientSecret"]=this.credupdatedata["clientSecret"];
            if(credupdatFormValue["officeTenant"] =="")
              credupdatFormValue["officeTenant"]=this.credupdatedata["officeTenant"];
          }
        }
      this.api.update_Credentials(credupdatFormValue).subscribe(res => {
        let status: any = res;
        this.spinner.hide();
        this.refreshTable.emit(true)
        if (status.errorMessage == undefined) {
          Swal.fire("Success", status.status, "success");
          // document.getElementById('Updatecredntials').style.display = 'none';
          document.getElementById('createcredentials').style.display = 'none';
        } else {
          Swal.fire("Error", status.errorMessage, "error");
        }
      }, err => {
        this.spinner.hide();
        Swal.fire("Error", "Unable to update credentials", "error")
        this.refreshTable.emit(false);
      });
    } else {
      Swal.fire("Error", "please fill all details", "error");
    }
  }

  getCategories() {
    this.api.getCategoriesList().subscribe(data => {
      let response: any = data;
      this.categoryList = response.data;
    })
  }

  closecredentials(){
    document.getElementById('createcredentials').style.display='none';
    this.resetCredForm();
  }

  onChangeServer(serverName)
  {
    setTimeout(()=>{
      this.credentialForm.get("password").clearValidators();
      if(serverName=="Office365")
      {
        this.credentialForm.get("password").setValidators([]);
        this.credentialForm.get("password").updateValueAndValidity();
      }
      else{
        this.credentialForm.get("password").setValidators([Validators.required]);
        this.credentialForm.get("password").updateValueAndValidity();
      }
      if(serverName=="Others")
      {
        this.credentialForm.get("host").setValidators([Validators.required]);
        this.credentialForm.get("host").updateValueAndValidity();
        this.credentialForm.get("port").setValidators([Validators.required]);
        this.credentialForm.get("port").updateValueAndValidity();
      }else
      {
        this.credentialForm.get("host").clearValidators();
        this.credentialForm.get("host").updateValueAndValidity();
        this.credentialForm.get("port").clearValidators();
        this.credentialForm.get("port").updateValueAndValidity();
      }
   
    },100)
  }


  onChangeAuthType(selectedAuthType:String)
  {
    if(this.selectedMailServer=='Office365')
    {
      if(selectedAuthType=="password")
      {
        this.credentialForm.get("password").setValidators([Validators.required]);
        this.credentialForm.get("password").updateValueAndValidity();
                
        this.credentialForm.get("clientId").clearValidators();
        this.credentialForm.get("clientId").updateValueAndValidity();

        this.credentialForm.get("clientSecret").clearValidators();
        this.credentialForm.get("clientSecret").updateValueAndValidity();

        this.credentialForm.get("officeTenant").clearValidators();
        this.credentialForm.get("officeTenant").updateValueAndValidity();
      }
      else
      {
        this.credentialForm.get("password").clearValidators();
        this.credentialForm.get("password").updateValueAndValidity();

        this.credentialForm.get("clientId").setValidators([Validators.required, Validators.minLength(6)]);
        this.credentialForm.get("clientId").updateValueAndValidity();

        this.credentialForm.get("clientSecret").setValidators([Validators.required, Validators.minLength(6)]);
        this.credentialForm.get("clientSecret").updateValueAndValidity();

        this.credentialForm.get("officeTenant").setValidators([Validators.required, Validators.minLength(6)]);
        this.credentialForm.get("officeTenant").updateValueAndValidity();
      }
    }
  }

  disableMaskedField(field)
  {
    this.maskedFields[field]=false;
    this.credentialForm.get(field).setValue("");
  }


  get selectedAuthType()
  {
    return this.credentialForm.get("authType").value;
  }

  get selectedMailServer()
  {
    return this.credentialForm.get("serverName").value;
  }

  get officeDetails()
  {
    return {
      clientId:this.credentialForm.get("clientId").value,
      officeTenant:this.credentialForm.get("officeTenant").value,
      secretKey:this.credentialForm.get("secretKey").value,
    }
  }
}
