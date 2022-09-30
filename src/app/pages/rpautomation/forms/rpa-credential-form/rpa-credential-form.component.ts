import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
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

  constructor(private api:RestApiService, 
    private formBuilder: FormBuilder,
    private chanref:ChangeDetectorRef, 
    private spinner: NgxSpinnerService) {

      this.credentialForm=this.formBuilder.group({
        userName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        password: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        categoryId:["0", Validators.compose([Validators.required])],
        serverName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        inBoundAddress: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        inBoundAddressPort: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        outBoundAddress: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        outboundAddressPort: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    })

      this.Credupdateflag=false;
      this.Creddeleteflag=false;
     }

  ngOnInit(): void {
    this.spinner.show();
    this.getCategories();
    this.passwordtype1=false;
    this.passwordtype2=false;

    
  }

  ngOnChanges(changes:SimpleChanges){
    console.log(changes,this.isCreateForm)
    if(!this.isCreateForm){
      this.credentialForm.get("userName").setValue(this.credupdatedata["userName"]);
      this.credentialForm.get("password").setValue(this.credupdatedata["password"]);
      this.credentialForm.get("serverName").setValue(this.credupdatedata["serverName"]);
      this.credentialForm.get("categoryId").setValue(this.credupdatedata["categoryId"]);
      this.credentialForm.get("inBoundAddress").setValue(this.credupdatedata["inBoundAddress"]);
      this.credentialForm.get("inBoundAddressPort").setValue(this.credupdatedata["inBoundAddressPort"]);
      this.credentialForm.get("outBoundAddress").setValue(this.credupdatedata["outBoundAddress"]);
      this.credentialForm.get("outboundAddressPort").setValue(this.credupdatedata["outboundAddressPort"]);
    }else{
      this.credentialForm=this.formBuilder.group({
        userName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        password: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        categoryId:["0", Validators.compose([Validators.required])],
        serverName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        inBoundAddress: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        inBoundAddressPort: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
        outBoundAddress: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
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
        });

      }
      else {

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
      this.api.update_Credentials(credupdatFormValue).subscribe(res => {
        let status: any = res;
        this.spinner.hide();
        this.refreshTable.emit(true)
        if (status.errorMessage == undefined) {
          Swal.fire("Success", status.status, "success");
          document.getElementById('Updatecredntials').style.display = 'none';
        } else {
          Swal.fire("Error", status.errorMessage, "error");
        }
      }, err => {
        this.spinner.hide();
        Swal.fire("Error", "Unable to update credentials", "error")
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

}
