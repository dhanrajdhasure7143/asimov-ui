import { Component, OnInit,TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestApiService } from '../../services/rest-api.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { Base64 } from 'js-base64';
import { Router } from '@angular/router';
import moment from 'moment';
import { CryptoService } from 'src/app/services/crypto.service';
import countries from 'src/app/../assets/jsons/countries.json';

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.css']
})
export class MyAccountComponent implements OnInit {
  
  public formOne: any = {};
  public otherdepartment: any;
  private spacialSymbolEncryption:string = '->^<-';
  public addDepartment: boolean = false;
  public departments: any;
  public useremail: any;
  isRefresh: boolean = false;
  countryInfo: any[] = [];
  phnCountryCode: any;
  stateInfo: any[] = [];
  cityInfo: any[] = [];
  pswdmodel:any = {};
  public eyeshow: boolean = true;
  public neweyeshow: boolean = true;
  public confeyeshow: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private api:RestApiService, 
    private spinner:NgxSpinnerService,
    private modalService: BsModalService,
    private router: Router,
    private cryptoService: CryptoService
    ) { }

  ngOnInit() {
    this.countryInfo = countries.Countries;
    this.userDetails();
   
  }

  updateAccount() {
    if (this.formOne.department == "Others") {

      this.formOne.department = this.otherdepartment;
    }
    let encrypt = this.spacialSymbolEncryption + this.cryptoService.encrypt(JSON.stringify(this.formOne));
    let reqObj = {"enc": encrypt};
 
    
    this.api.updateUser(reqObj).subscribe(data => {
    Swal.fire({
      title: "Success",
      text: "User Details Updated Successfully!!",
      position: 'center',
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#007bff',
      heightAuto: false,
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ok'
    });
    this.addDepartment=false;
    this.getAllDepartments();
    this.userDetails();
    
    }, err => {
      Swal.fire("Error","Please try again!","error");
     
    });

  }

  getAllDepartments(){
    this.api.getDepartments().subscribe(resp => {
      this.departments = resp
    })
  }
  userDetails() {
    this.useremail = localStorage.getItem("ProfileuserId");
    this.api.getUserDetails(this.useremail).subscribe(data => {this.formOne = data     
      this.getAllDepartments()
      this. getAllStates();
      this.gatAllCities();
      this.isRefresh = !this.isRefresh;
      for (var i = 0; i < this.countryInfo.length; i++) {
        if (this.countryInfo[i].CountryName == this.formOne.country) {
          this.phnCountryCode = this.countryInfo[i].CountryCode
        
        }
      }
    })
   
  }
  getAllStates() {
    // this.formOne.country = this.countryInfo[countryValue].CountryName;
    for (var i = 0; i < this.countryInfo.length; i++) {
      if (this.countryInfo[i].CountryName == this.formOne.country) {
        this.stateInfo = this.countryInfo[i].States;
      }
    }
  }
  gatAllCities() {
    for (var i = 0; i < this.stateInfo.length; i++) {
      if (this.stateInfo[i].StateName == this.formOne.state) {
        this.cityInfo = this.stateInfo[i].Cities;
      }
    }
  }
  onChangeCountry(countryValue) {
    this.isRefresh = !this.isRefresh;
    // this.formOne.country = this.countryInfo[countryValue].CountryName;
    for (var i = 0; i < this.countryInfo.length; i++) {
      if (this.countryInfo[i].CountryName == countryValue) {
        this.phnCountryCode = this.countryInfo[i].CountryCode
        this.stateInfo = this.countryInfo[i].States;
      }
    }
  }
  onChangeState(stateValue) {
    for (var i = 0; i < this.stateInfo.length; i++) {
      if (this.stateInfo[i].StateName == stateValue) {
        this.cityInfo = this.stateInfo[i].Cities;
      }
    }
  }
  onKeydown(event) {
    let numArray = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Backspace","Tab"]
    let temp = numArray.includes(event.key); //gives true or false
    if (!temp) {
      event.preventDefault();
    }
  }
  lettersOnly(event): boolean {
    var regex = new RegExp("^[a-zA-Z ]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
      if (!regex.test(key)) {
        event.preventDefault();
        return false;
      }
  }
 

  


  
}