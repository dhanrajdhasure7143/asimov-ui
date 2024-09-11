import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
// import countries from "src/app/../assets/jsons/countries.json";
import { Country, State, City }  from 'country-state-city';
import { LoaderService } from "src/app/services/loader/loader.service";
import { RestApiService } from "../../services/rest-api.service";
import { ToasterService } from "src/app/shared/service/toaster.service";
@Component({
  selector: "app-billing-address",
  templateUrl: "./billing-address.component.html",
  styleUrls: ["./billing-address.component.css"],
})
export class BillingAddressComponent implements OnInit {
  billingForm: FormGroup;
  countryInfo: any[] = [];
  stateInfo: any;
  cityInfo: any[];
  phnCountry: any;
  billingInfo: any = [];
  countryName: any;
  stateName: any;
  cityName: any;
  activeIndex: any;
  id: any;
  editButton: boolean;
  selectedCountry: any;
  states: any;
  phnCountryCode: any;
  isInput: boolean = false;
  optionValue: any;
  errorMessage: string;
  errorMessage1: string;
  errorMessage2: string;
  billingData: any; 
  billingAddress: any;
  stateErrorMessage: string;
  selectedCountryIsoCode: any;

  constructor(
    private formBuilder: FormBuilder,
    private spinner: LoaderService,
    private api: RestApiService,
    private toastService: ToasterService,
  ) {}

  ngOnInit(): void {
    this.billingForm = this.formBuilder.group({
      name: ["", Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z]+(\\s[a-zA-Z]+)*$'), Validators.maxLength(50)])],
      country: ["", Validators.compose([Validators.required])],
      city: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      state: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      postalcode: ["", Validators.compose([Validators.required, Validators.maxLength(6), Validators.pattern('^[0-9]+$')])],
      // addressLine1: ["", Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9-/,]+(\\s[a-zA-Z0-9-/]+)*$'), Validators.maxLength(50)])],
      // addressLine1: ["", Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9,./-]+( [a-zA-Z0-9,./-]+)*$'), Validators.maxLength(50)])],
      addressLine1: ["", Validators.compose([Validators.required, Validators.maxLength(100)])],
      addressLine2: ["", Validators.compose([Validators.maxLength(100)])],
      // phoneNumber: ["", Validators.compose([Validators.required, Validators.maxLength(10), Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")])],
      email: ["", Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"), Validators.maxLength(50)])],
    });
    this.getCountries();
    this.getBillingInfo();
  }
  
  getCountries() {
    this.countryInfo = Country.getAllCountries();
  }

  // onChangeCountry(countryValue) {
  //   this.isInput = !this.isInput;
  //   this.stateInfo = State.getAllStates();
  //   this.cityInfo = [];
  //   const matchingCountry = this.countryInfo.find((item: any) => item.name == countryValue);
  //   if (!matchingCountry) {
  //     this.countryName = countryValue;
  //     this.countryInfo.push({ name: countryValue, countryCode: this.phnCountryCode, isoCode: '' });
  //   }

  //   if (matchingCountry) {
  //     this.stateInfo = this.stateInfo.filter((state: any) => state.countryCode === matchingCountry.isoCode);
  //     this.countryName = matchingCountry.name;
  //     this.phnCountryCode = matchingCountry.isoCode;
  //     this.errorMessage = '';
  //   }
  // }

  // onChangeState(stateValue) {
  //   this.cityInfo = City.getAllCities();
  //   const matchingState = this.stateInfo.find((state: any) => state.name === stateValue);
    
  //   if (!matchingState) {
  //     this.stateName = stateValue;
  //     this.stateInfo.push({ name: stateValue, countryCode: this.phnCountryCode, isoCode: '' }); // Add the state to the stateInfo array
  //   } 
    
  //   if (matchingState) {
  //     this.stateName = matchingState.name;
  //     this.cityInfo = this.cityInfo.filter((city: any) => city.countryCode === matchingState.countryCode && city.stateCode === matchingState.isoCode);
  //     this.errorMessage1='';
  //   }
  // }

  onChangeCountry(countryValue) {
    this.isInput = !this.isInput;
    this.stateInfo = State.getAllStates();
    this.cityInfo = [];
    const matchingCountryDetails = this.countryInfo.find((item: any) => item.name == countryValue || item.isoCode == countryValue);
    const matchingCountry = matchingCountryDetails.isoCode;
    if (!matchingCountry) {
      this.countryName = countryValue;
      this.countryInfo.push({ name: countryValue, countryCode: this.countryName, isoCode: '' });
    }

    else {
      this.countryName = matchingCountryDetails.name;
      this.stateInfo = this.stateInfo.filter((state: any) => state.countryCode === matchingCountry);
      this.errorMessage = '';
    }
    setTimeout(() => {
      this.billingForm.get("state").setValue(this.billingAddress["state"]);
      
    }, 500);
  }

  // onChangeState(stateValue) {
  //   this.cityInfo = City.getAllCities();
  //   const matchingStateDetails = this.stateInfo.find((state: any) => state.name === stateValue);
  //   const matchingState = matchingStateDetails.name;

  //   if (!matchingState) {
  //     this.stateName = stateValue;
  //     this.stateInfo.push({ name: stateValue, countryCode: this.countryName, isoCode: '' }); // Add the state to the stateInfo array
  //   } 
    
  //   else {
  //     this.stateName = matchingState;
  //     this.cityInfo = this.cityInfo.filter((city: any) => city.countryCode === matchingState.countryCode && city.stateCode === matchingState.isoCode);
  //     this.errorMessage1='';
  //   }
  // }

  onChangeCity(cityValue) {
    const matchingCity = this.cityInfo.find((city: any) => city.name === cityValue);
    if (!matchingCity) {
      this.cityName = cityValue;
      this.cityInfo.push({ name: cityValue, countryCode: this.phnCountryCode }); // Add the city to the cityInfo array
    }else {
      this.cityName = matchingCity.name;
    }
    if (cityValue) {
      this.errorMessage2 = '';
    }
  }
 
  saveBillingInfo() {
    this.spinner.show();
    let payload = {
        name: this.billingForm.get('name').value,
        email: this.billingForm.get('email').value,
        address: {
          country: this.billingForm.get('country').value,
          "state": this.billingForm.get('state').value,
          "city": this.billingForm.get('city').value,
          line1: this.billingForm.get('addressLine1').value,
          line2: this.billingForm.get('addressLine2').value,
          postalCode: this.billingForm.get('postalcode').value,
        }
      };
      
      this.api.updateBillingInfo(payload).subscribe((data:any) => {
        if (data.code == 4200) {
          this.toastService.showSuccess("Updated successfully!",'response');
          this.getBillingInfo();
          this.spinner.hide();
        }
      }),(err) => {
          this.toastService.showError("Please update again!");
         this.spinner.hide();
        };
}



  getBillingInfo() {
    this.spinner.show();
    this.api.getBillingInfo().subscribe((data:any) => {
      this.spinner.hide();
      if(data){
        this.billingData = data.message;       
        this.billingAddress = data.message.address;
        // setTimeout(()=>{
        //   this.billingForm.get("country").setValue(this.countryName);
        //   this.billingForm.get("state").setValue(this.stateName);
        //   this.billingForm.get("city").setValue(this.cityName);
        // },300);
        this.billingForm.get("name").setValue(this.billingData["name"]);
        this.billingForm.get("email").setValue(this.billingData["email"]);
        this.billingForm.get("postalcode").setValue(this.billingAddress["postalCode"]);
        this.billingForm.get("addressLine1").setValue(this.billingAddress["line1"]);
        this.billingForm.get("addressLine2").setValue(this.billingAddress["line2"]);
        this.billingForm.get("city").setValue(this.billingAddress["city"]);
        this.billingForm.get("country").setValue(this.billingAddress["country"]);
        
        // this.billingForm.get("phoneNumber").setValue(this.billingAddress.["phone"]);
        this.onChangeCountry(this.billingAddress.country);
        // this.onChangeState(this.billingAddress.country);
        // this.onChangeCity(this.billingAddress.city);
        this.editButton=true;
      }
      },
      (err) => {
        this.toastService.showError("Unable to get the data!");
        this.spinner.hide();
      }
    );
  }

  OnFlagChange(event){
    if(event.name !=this.optionValue){
      this.errorMessage="Select appropriate country";
      this.errorMessage1="Select appropriate state";
      this.errorMessage2="Select appropriate city";
    }
  }

  numbersOnly(event): boolean {
    var regex = new RegExp("^[0-9]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
      event.preventDefault();
      return false;
    }
  }

  getSelectedCountryName(): string {
    const selectedIsoCode = this.billingForm.get('country').value;
    const selectedCountry = this.countryInfo.find(country => country.isoCode === selectedIsoCode);
    return selectedCountry ? selectedCountry.name : 'Select Country';
  }

  onMessageInput(event: any) {
    const inputValue = event.target.value;
    const cursorPosition = event.target.selectionStart;
    // Prevent space as the first character
    if (cursorPosition === 0 && event.code === "Space") {
      event.preventDefault();
    }
    // Prevent multiple spaces between words
    // if (event.code === "Space" && inputValue[cursorPosition - 1] === ' ') {
    //   event.preventDefault();
    // }
  }

  onChangeState(stateValue) {
    console.log
    this.isInput = !this.isInput;
    this.cityInfo = [];
    
    const matchingStateDetails = this.stateInfo.find((item: any) => item.name == stateValue || item.isoCode == stateValue);
    const matchingState = matchingStateDetails?.isoCode;
    
    if (!matchingState) {
      this.stateName = stateValue;
      this.stateInfo.push({ name: stateValue, countryCode: this.selectedCountryIsoCode, isoCode: '' });
      this.stateErrorMessage = 'State added without ISO code.';
    } 
    else {
      this.stateName = matchingStateDetails.name;
      this.cityInfo = this.cityInfo.filter((city: any) => city.stateCode === matchingState);
      this.stateErrorMessage = '';
    }
}

getSelectedStateName(): string {
    const selectedIsoCode = this.billingForm.get('state').value;
    const selectedState = this.stateInfo.find(state => state.isoCode === selectedIsoCode);
    return selectedState ? selectedState.name : 'Select State';
}

  
}
