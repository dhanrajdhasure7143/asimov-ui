import { Component, OnInit,TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { RestApiService } from '../../services/rest-api.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { Base64 } from 'js-base64';
import { Router } from '@angular/router';
import moment from 'moment';
import { CryptoService } from 'src/app/services/crypto.service';
import countries from 'src/app/../assets/jsons/countries.json';
import { DataTransferService } from '../../services/data-transfer.service';
import { LoaderService } from 'src/app/services/loader/loader.service';

@Component({
  selector: "app-myaccount",
  templateUrl: "./myaccount.component.html",
  styleUrls: ["./myaccount.component.css"],
})
export class MyAccountComponent implements OnInit {
  public formOne: any = {};
  public otherdepartment: any;
  private spacialSymbolEncryption: string = "->^<-";
  public addDepartment: boolean = false;
  public departments: any;
  public useremail: any;
  isRefresh: boolean = false;
  countryInfo: any[] = [];
  phnCountryCode: any;
  stateInfo: any[] = [];
  cityInfo: any[] = [];
  pswdmodel: any = {};
  public eyeshow: boolean = true;
  public neweyeshow: boolean = true;
  public confeyeshow: boolean = true;
  show: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private api: RestApiService,
    private loader: LoaderService,
    private modalService: BsModalService,
    private router: Router,
    private cryptoService: CryptoService,
    private dt: DataTransferService
  ) {}

  ngOnInit() {
    this.loader.show();
    this.countryInfo = countries.Countries;
    setTimeout(() => {
      this.userDetails();
    }, 500);
  }

  updateAccount() {
    this.loader.show();
    if (this.formOne.department == "Others") {
      this.formOne.department = this.otherdepartment;
    }
    let encrypt =
      this.spacialSymbolEncryption +
      this.cryptoService.encrypt(JSON.stringify(this.formOne));
    let reqObj = { enc: encrypt };
    this.api.updateUser(reqObj).subscribe(
      (data) => {
        Swal.fire({
          title: "Success",
          text: "User Details Updated Successfully!!",
          position: "center",
          icon: "success",
          showCancelButton: false,
          confirmButtonColor: "#007bff",
          heightAuto: false,
          cancelButtonColor: "#d33",
          confirmButtonText: "Ok",
        });
        this.loader.hide();
        this.addDepartment = false;
        this.getAllDepartments();
        this.userDetails();
      },
      (err) => {
        this.loader.hide();
        Swal.fire("Error", "Please try again!", "error");
      }
    );
  }

  getAllDepartments() {
    this.api.getDepartments().subscribe((resp) => {
      this.departments = resp;
    });
  }
  userDetails() {
    this.useremail = localStorage.getItem("ProfileuserId");
    this.api.getUserDetails(this.useremail).subscribe((data) => {
      this.formOne = data;
      this.dt.userDetails(data);
      this.getAllDepartments();
      this.getAllStates();
      this.gatAllCities();
      this.isRefresh = !this.isRefresh;
      this.show = true;
      for (var i = 0; i < this.countryInfo.length; i++) {
        if (this.countryInfo[i].CountryName == this.formOne.country) {
          this.phnCountryCode = this.countryInfo[i].CountryCode;
        }
      }
      if (this.formOne.country == null || this.formOne.country == undefined) {
        this.formOne.country = "United States";
      }
      this.show = false;
      this.loader.hide();
    });
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
        this.phnCountryCode = this.countryInfo[i].CountryCode;
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
    let numArray = ["0","1","2","3","4","5","6","7","8","9","Backspace","Tab",];
    let temp = numArray.includes(event.key); //gives true or false
    if (!temp) {
      event.preventDefault();
    }
  }

  lettersOnly(event): boolean {
    var regex = new RegExp("^[a-zA-Z ]+$");
    var key = String.fromCharCode(
      !event.charCode ? event.which : event.charCode
    );
    if (!regex.test(key)) {
      event.preventDefault();
      return false;
    }
  }

}