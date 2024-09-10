import { Component, EventEmitter, OnInit,Output,TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { RestApiService } from '../services/rest-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CryptoService } from 'src/app/services/crypto.service';
import countries from 'src/app/../assets/jsons/countries.json';
import { DataTransferService } from '../services/data-transfer.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToasterService } from 'src/app/shared/service/toaster.service';

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.css']
})
export class MyaccountComponent implements OnInit {
  public formOne: any = {};
  public otherdepartment: any;
  private spacialSymbolEncryption: string = "->^<-";
  public addDepartment: boolean = false;
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
  errorMessage: string;
  isFormOverlay: boolean = false;
  @Output() valueChange = new EventEmitter();


  constructor(
    private formBuilder: FormBuilder,
    private api: RestApiService,
    private loader: LoaderService,
    private cryptoService: CryptoService,
    private dt: DataTransferService,	
    private toastService: ToasterService,
    private confirmationService:ConfirmationService
  ) {

  }

  ngOnInit() {
    // this.loader.show();
    this.userDetails();
    this.countryInfo = countries.Countries;
    console.log(this.countryInfo)
  }

  updateAccount() {
    this.loader.show();
    let encrypt = this.spacialSymbolEncryption + this.cryptoService.encrypt(JSON.stringify(this.formOne));
    let reqObj = { enc: encrypt };
    this.api.updateUser(reqObj).subscribe(
      (data) => {
      this.valueChange.emit(this.isFormOverlay)
      this.addDepartment = false;
      this.toastService.toastSuccess("User details updated successfully!");
      this.loader.hide();
      // this.getAllDepartments();
      this.userDetails();
      // this.confirmationService.confirm({
      //   header:'Success',
      //   message:'User details updated successfully!',
      //   rejectVisible:false,
      //   acceptLabel:'Ok',
      //   acceptButtonStyleClass:'',
      //   acceptIcon:'none',
      //   accept:()=>{
      //     this.loader.hide();
      //     this.valueChange.emit(this.isFormOverlay)
      //     this.addDepartment = false;
      //     // this.getAllDepartments();
      //     this.userDetails();
      //   }
      // })
      },(err) => {
        this.loader.hide();
        this.toastService.showError('Please try again!')
      }
    );
  }

  userDetails() {
    this.useremail = localStorage.getItem("ProfileuserId");
    this.api.getUserDetails(this.useremail).subscribe((data) => {
      this.formOne = data;
      this.formOne.country = this.formOne.country.toLowerCase();
      console.log(this.formOne)
      this.dt.userDetails(data);
      // this.getAllStates();
      // this.gatAllCities();
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

  onChangeCountry(event) {
    let countryValue= event.value
    this.isRefresh = !this.isRefresh;
    this.formOne.country = countryValue;
    for (var i = 0; i < this.countryInfo.length; i++) {
      if (this.countryInfo[i].CountryName == countryValue) {
        this.phnCountryCode = this.countryInfo[i].CountryCode;
        this.stateInfo = this.countryInfo[i].States;
        this.errorMessage=''
      }
      // else{
      //   this.errorMessage =""
      // }
    }
  }
  onChangeState(stateValue) {
    for (var i = 0; i < this.stateInfo.length; i++) {
      if (this.stateInfo[i].StateName == stateValue) {
        this.cityInfo = this.stateInfo[i].Cities;
      }
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

  OnFlagChange(event){
    if(event.name !=this.formOne.country){
      this.errorMessage="Please Select Appropriate Country *"
    }
   if(event.iso2 ==this.phnCountryCode){
      this.errorMessage =""
    }
}

Space(event: any) {
  if (event.target.selectionStart === 0 && event.code === "Space") {
    event.preventDefault();
  }
}
}