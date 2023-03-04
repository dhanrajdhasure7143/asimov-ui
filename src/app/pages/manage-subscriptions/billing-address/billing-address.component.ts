import { Component, OnInit, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import countries from "src/app/../assets/jsons/countries.json";
import { LoaderService } from "src/app/services/loader/loader.service";
import { RestApiService } from "../../services/rest-api.service";

@Component({
  selector: "app-billing-address",
  templateUrl: "./billing-address.component.html",
  styleUrls: ["./billing-address.component.css"],
})
export class BillingAddressComponent implements OnInit {
  billingForm: FormGroup;
  countryInfo: any = [];
  stateInfo: any[];
  cityInfo: any[];
  phnCountry: any;
  isRefresh: any;
  billingInfo: any = [];
  countryName: any;
  stateName: any;
  activeIndex: any;
  id: any;
  editButton: boolean;
  data: Object;
  constructor(
    private formBuilder: FormBuilder,
    private spinner: LoaderService,
    private route: ActivatedRoute,
    private api: RestApiService
  ) {
    this.route.queryParams.subscribe((data) => {
      if (data) {
        this.activeIndex = data.index;
      }
    });
  }

  ngOnInit(): void {
    this.billingForm = this.formBuilder.group({
      firstName: ["",Validators.compose([Validators.required, Validators.maxLength(50)]),],
      lastName: ["",Validators.compose([Validators.required, Validators.maxLength(50)])],
      country: ["", Validators.compose([Validators.required])],
      city: ["",Validators.compose([Validators.required, Validators.maxLength(50)])],
      state: ["",Validators.compose([Validators.required, Validators.maxLength(50)])],
      postalcode: ["", Validators.compose([Validators.required])],
      addressLine1: ["", Validators.compose([Validators.required])],
      addressLine2: ["",Validators.compose([Validators.required, Validators.maxLength(50)])],
      phoneNumber: ["", Validators.compose([Validators.required,Validators.maxLength(10),Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")])],
      email: ["", Validators.compose([Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])],
    });
    this.getCountries();
  }

  getCountries() {
    this.countryInfo = countries.Countries;
  }

  onChangeCountry(countryValue) {
    this.isRefresh = !this.isRefresh;
    this.stateInfo = [];
    for (var i = 0; i < this.countryInfo.length; i++) {
      if (this.countryInfo[i].CountryName == countryValue.CountryName) {
        this.countryName = countryValue.CountryName;
        this.phnCountry = this.countryInfo[i].CountryCode;
        this.stateInfo = this.countryInfo[i].States;
      }
    }
    this.cityInfo = [];
  }

  onChangeState(stateValue) {
    this.cityInfo = [];
    for (var i = 0; i < this.stateInfo.length; i++) {
      if (this.stateInfo[i].StateName == stateValue.StateName) {
        this.stateName = stateValue.StateName;
        this.cityInfo = this.stateInfo[i].Cities;
      }
    }
  }

  onKeydown(event) {
    let numArray = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "Backspace",
      "Tab",
    ];
    let temp = numArray.includes(event.key); //gives true or false
    if (!temp) {
      event.preventDefault();
    }
  }

  saveBillingInfo() {
    this.spinner.show();
    let payload = this.billingForm.value;
    if (!this.editButton) {
      if (this.billingForm.valid) {
        payload["country"] = this.countryName;
        payload["state"] = this.stateName;
        this.api.saveBillingInfo(payload).subscribe((data) => {
          this.billingInfo = data;
          this.id = this.billingInfo.id;
          setTimeout(() => {
            this.getBillingInfo();
          }, 500);
          this.spinner.hide();
        });
      }
    } else {
      this.updateForm();
    }
  }

  updateForm() {
    let payload = this.billingForm.value;
    if (this.billingForm.valid) {
      payload["country"] = this.countryName;
      payload["state"] = this.stateName;
      this.api.updateInfo(this.id, payload).subscribe();
    }
  }

  getBillingInfo() {
    this.spinner.show();
    this.api.getBillingInfo(this.id).subscribe((data) => {
      this.data = data;
      this.spinner.hide();
      this.billingForm.reset();
      this.billingForm.get("firstName").setValue(this.data["firstName"]);
      this.billingForm.get("lastName").setValue(this.data["lastName"]);
      this.countryName= this.billingForm.get("country").setValue(this.data["country"]);
      this.billingForm.get("state").setValue(this.data["state"]);
      this.billingForm.get("city").setValue(this.data["city"]);
      this.billingForm.get("postalcode").setValue(this.data["postalcode"]);
      this.billingForm.get("addressLine1").setValue(this.data["addressLine1"]);
      this.billingForm.get("addressLine2").setValue(this.data["addressLine2"]);
      this.billingForm.get("phoneNumber").setValue(this.data["phoneNumber"]);
      this.billingForm.get("email").setValue(this.data["email"]);
    });
  }
}
