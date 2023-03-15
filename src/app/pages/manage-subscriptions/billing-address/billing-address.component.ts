import { Component, OnInit, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { element } from "protractor";
import countries from "src/app/../assets/jsons/countries.json";
import { LoaderService } from "src/app/services/loader/loader.service";
import { DataTransferService } from "../../services/data-transfer.service";
import { RestApiService } from "../../services/rest-api.service";

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
  constructor(
    private formBuilder: FormBuilder,
    private spinner: LoaderService,
    private api: RestApiService,
    private messageService:MessageService,
  ) {}

  ngOnInit(): void {
    this.billingForm = this.formBuilder.group({
      firstName: ["",Validators.compose([Validators.required, Validators.maxLength(50)]),],
      lastName: ["",Validators.compose([Validators.required, Validators.maxLength(50)])],
      country: ["India", Validators.compose([Validators.required])],
      city: ["",Validators.compose([Validators.required, Validators.maxLength(50)])],
      state: ["",Validators.compose([Validators.required, Validators.maxLength(50)])],
      postalcode: ["", Validators.compose([Validators.required])],
      addressLine1: ["", Validators.compose([Validators.required])],
      addressLine2: ["",Validators.compose([Validators.required, Validators.maxLength(50)])],
      phoneNumber: ["", Validators.compose([Validators.required,Validators.maxLength(10),Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")])],
      email: ["", Validators.compose([Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])],
    });
    this.getCountries();
    this.getBillingInfo()
    
  }

  getCountries() {
    this.countryInfo = countries.Countries;
  }
  

  onChangeCountry(countryValue) {
    this.stateInfo = [];
    for (var i = 0; i < this.countryInfo.length; i++) {
      if (this.countryInfo[i].CountryName == countryValue) {
        this.stateInfo = this.countryInfo[i].States;
      }
    }
    this.cityInfo = [];
  }

  onChangeState(stateValue) {
    this.cityInfo = [];
    for (var i = 0; i < this.stateInfo.length; i++) {
      if (this.stateInfo[i].StateName == stateValue.StateName) {
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
          this.spinner.hide();
          this.id = this.billingInfo.id;
          if(data){
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: "Saved Successfully !!",
            });
          }
          this.billingForm.reset();
          this.getBillingInfo();
        })
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
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Updated Successfully !!",
        });
  }
  }

  getBillingInfo() {
    this.spinner.show();
    this.api.getBillingInfo().subscribe(data => {
      this.billingContactData = data;
      this.spinner.hide();
      if(data){
      this.billingForm.get("firstName").setValue(this.billingContactData["firstName"]);
      this.billingForm.get("lastName").setValue(this.billingContactData["lastName"]);
      // this.billingForm.get("country").setValue(this.billingContactData["country"]);
      this.billingForm.get("state").setValue(this.billingContactData["state"]);
      this.billingForm.get("city").setValue(this.billingContactData["city"]);
      this.billingForm.get("postalcode").setValue(this.billingContactData["postalcode"]);
      this.billingForm.get("addressLine1").setValue(this.billingContactData["addressLine1"]);
      this.billingForm.get("addressLine2").setValue(this.billingContactData["addressLine2"]);
      this.billingForm.get("phoneNumber").setValue(this.billingContactData["phoneNumber"]);
      this.billingForm.get("email").setValue(this.billingContactData["email"]);
      }
    });
  }
}
