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
  activeIndex: any;
  id: any;
  editButton: boolean;
  billingContactData: any;
  selectedCountry: any;
  states: any;
  phnCountryCode: any;
  isInput: boolean = false;
  optionValue: any;
  errorMessage: string;
  errorMessage1: string;
  errorMessage2: string;
  constructor(
    private formBuilder: FormBuilder,
    private spinner: LoaderService,
    private api: RestApiService,
    private toastService: ToasterService
  ) {}

  ngOnInit(): void {
    this.billingForm = this.formBuilder.group({
      firstName: [
        "",
        Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z]+(\\s[a-zA-Z]+)*$'), Validators.maxLength(50)]),
      ],
      lastName: [
        "",
        Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z]+(\\s[a-zA-Z]+)*$'), Validators.maxLength(50)]),
      ],
      country: ["", Validators.compose([Validators.required])],
      city: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      state: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      postalcode: [
        "",
       Validators.compose([
        Validators.required,
        Validators.maxLength(10),
        Validators.pattern('^[a-zA-Z0-9-/,]+(\\s[a-zA-Z0-9-/]+)*$'),
      ]),
      ],
      addressLine1: ["", Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9-/,]+(\\s[a-zA-Z0-9-/]+)*$'), Validators.maxLength(50)])],
      addressLine2: ["", Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9-/,]+(\\s[a-zA-Z0-9-/]+)*$'), Validators.maxLength(50)]),],
      phoneNumber: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(10),
          Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
        ]),
      ],
      email: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"),
        ]),
      ],
    });
    this.getCountries();
    this.getBillingInfo();
  }

  getCountries() {
    this.countryInfo = Country.getAllCountries();
  }

  onChangeCountry(countryValue) {
    this.isInput = !this.isInput;
    this.stateInfo = State.getAllStates();
    this.cityInfo = [];
    const matchingCountry = this.countryInfo.find((item: any) => item.name == countryValue);
    if (matchingCountry) {
      this.stateInfo = this.stateInfo.filter((state: any) => state.countryCode === matchingCountry.isoCode);
      this.phnCountryCode = matchingCountry.isoCode;
      this.errorMessage='';
    }
  }

  onChangeState(stateValue) {
    this.cityInfo = City.getAllCities();
    const matchingState = this.stateInfo.find((item: any) => item.name == stateValue);
    if (matchingState) {
      this.cityInfo = this.cityInfo.filter((city: any) => city.countryCode === matchingState.countryCode && city.stateCode === matchingState.isoCode);
      this.errorMessage1='';
    }
    if (this.cityInfo.length === 0) {
      this.cityInfo = [{ name: 'NA' }];
    }
  }
  onChangeCity(cityValue){
    if(cityValue){
      this.errorMessage2 ='';
    }
  }


  saveBillingInfo() {
    this.spinner.show();
    let payload = this.billingForm.value;
    payload.country = this.billingForm.get('country').value;
    payload.state =  this.billingForm.get('state').value;
    payload.city = this.billingForm.get('city').value;
   if(!this.editButton) { 
    this.api.saveBillingInfo(payload).subscribe((data) => {
    if (data) {
      this.billingInfo = data;
      this.editButton = true;
      this.spinner.hide();
      this.id = this.billingInfo.id;
      this.toastService.showSuccess("Saved successfully!",'response');
      this.billingForm.reset();
      this.getBillingInfo();
      this.spinner.hide();
    }
  },(err) => {
    this.toastService.showError("Please save again!");
   this.spinner.hide();
  })}
    else {
      this.editButton = true;
      this.api.updateBillingInfo(this.id, payload).subscribe((data) => {
        if (data) {
          this.toastService.showSuccess("Updated successfully!",'response');
          this.billingForm.reset();
          this.getBillingInfo();
          this.spinner.hide();
        }
      }),(err) => {
          this.toastService.showError("Please update again!");
         this.spinner.hide();
        };
    }

}

  getBillingInfo() {
    this.spinner.show();
    this.api.getBillingInfo().subscribe((data:any) => {
      this.spinner.hide();
      if(data){
        this.billingContactData = data;
        this.editButton=true;
        this.id=data.id;
        this.onChangeCountry(data.country);
        this.onChangeState(data.state);
        this.billingForm.get("firstName").setValue(this.billingContactData["firstName"]);
        this.billingForm.get("lastName").setValue(this.billingContactData["lastName"]);
        setTimeout(()=>{
          this.billingForm.get("country").setValue(data.country)
          this.billingForm.get("state").setValue(this.billingContactData["state"]);
          this.billingForm.get("city").setValue(this.billingContactData["city"]);
        },300);
        this.billingForm.get("postalcode").setValue(this.billingContactData["postalcode"]);
        this.billingForm.get("addressLine1").setValue(this.billingContactData["addressLine1"]);
        this.billingForm.get("addressLine2").setValue(this.billingContactData["addressLine2"]);
        this.billingForm.get("phoneNumber").setValue(this.billingContactData["phoneNumber"]);
        this.billingForm.get("email").setValue(this.billingContactData["email"]);
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
}
