import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import countries from 'src/app/../assets/jsons/countries.json';
import { LoaderService } from 'src/app/services/loader/loader.service';

@Component({
  selector: 'app-billing-address',
  templateUrl: './billing-address.component.html',
  styleUrls: ['./billing-address.component.css']
})
export class BillingAddressComponent implements OnInit {
  createtaskForm:FormGroup;
  countryInfo: any=[]
  stateInfo: any[];
  cityInfo: any[];
  phnCountry: any;
  isRefresh: any;
  constructor(private formBuilder: FormBuilder, private Spinner:LoaderService) { }

  ngOnInit(): void {
    this.createtaskForm=this.formBuilder.group({
      firstName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      lastName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      country: [""],
      city: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      state: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      postalCode: ["", Validators.compose([Validators.required])],
      addressLine1: ["",Validators.compose([Validators.required])],
      addressLine2: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      phoneNumber: ["",Validators.compose([Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")])],
      email: [""],

  })
this.getCountries()
}

getCountries(){
this.countryInfo = countries.Countries;
}

onChangeCountry(countryValue) {
  this.isRefresh = !this.isRefresh;
  this.stateInfo=[];
  for(var i=0; i< this.countryInfo.length; i++){
    if(this.countryInfo[i].CountryName == countryValue.CountryName){
      this.phnCountry = this.countryInfo[i].CountryCode
      this.stateInfo=this.countryInfo[i].States; 
    }
  }
this.cityInfo=[];
}

onChangeState(stateValue) {
  this.cityInfo=[];
  for(var i=0; i< this.stateInfo.length; i++){
    if(this.stateInfo[i].StateName == stateValue.StateName ){
    this.cityInfo=this.stateInfo[i].Cities; 
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
}
