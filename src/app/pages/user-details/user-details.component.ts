import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Country, State, City } from 'country-state-city';

import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { RestApiService } from '../services/rest-api.service';
import { CryptoService } from '../services/crypto.service';
import { environment } from 'src/environments/environment';
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
@Component({
    selector: 'app-user-details',
    templateUrl: './user-details.component.html',
    styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
    userForm: FormGroup;
    showUserScreen: boolean = true;
    orgExsist: boolean = false;
    isErrorMessage: boolean = false;
    isInput: boolean = false;
    phnCountry: string = 'US'; // Initial country for phone number input
    isSubscriptionEnabled: boolean = false
    errorMessage: any;
    errorMessage1: any;
    errorMessage2: any;
    countryInfo: any[] = [];
    stateInfo: any[] = [];
    cityInfo: any[] = [];
    departments: any[] = [];
    userId: any
    userPsw: any;
    constructor(
        private formBuilder: FormBuilder,
        private rest_api: RestApiService,
        private crypto: CryptoService,
        private spinner: LoaderService,
        private router: Router,
        private route: ActivatedRoute,
        private toaster: ToasterService


    ) {
        this.route.queryParams.subscribe((res) => {
            if (res) {
                if (res) {
                    //   let parms = JSON.parse(atob(res.ProfileuserId))
                    //   if(parms.screen == 2){
                    // this.showUserScreen = true;
                    this.userId = res.ProfileuserId
                    this.userPsw = res.userpassword
                    //   }else{
                    //     this.showUserScreen = false;
                    //   }
                }
            }
        });
    }

    ngOnInit() {
        this.isSubscriptionEnabled = environment.isSubscrptionEnabled
        this.initForm();
        this.getAllDepartments();
        this.getCountries();

    }

    initForm() {
        this.userForm = this.formBuilder.group({
            jobTitle: ["", Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z]+(\\s[a-zA-Z]+)*$'), Validators.minLength(2), Validators.maxLength(50)])],
            // organization: ["", Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z]+(\\s[a-zA-Z]+)*$'), Validators.minLength(2), Validators.maxLength(30)])],
            zipCode: ["", Validators.compose([Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(5), Validators.maxLength(6)])],
            department: ['', Validators.required],
            country: ['', Validators.required],
            state: ['', Validators.required],
            city: ['', Validators.required],
            phoneNumber: ['', Validators.required],
            // phoneNumber: ['', [Validators.required, Validators.pattern(/^((\+91-?)|0)?[0-9]{10}$/)]],
        });
    }

    get f() { return this.userForm.controls; }

    getErrorMessage(controlName: string): string {
        const control = this.userForm.get(controlName);
        if (control.touched && control.errors && control.dirty) {
            if (control.errors.required) {
                if (controlName == "jobTitle") {
                    return "Job Title required"
                }
                else if (controlName == "organization") {
                    return "Organization required"
                }
                else if (controlName == "zipCode") {
                    return "Zip Code required"
                }
                return `${controlName} required`;
            }
            if (controlName != "zipCode") {
                if (control.errors.minlength) {
                    return "Minimum 2 characters required";
                }
                if (control.errors.maxlength) {
                    return "Maximum of 50 charecters";
                }
            }
            if (controlName == "zipCode") {
                if (control.errors.minlength) {
                    return "Zip Code must be 5 to 6 characters";
                }
                if (control.errors.maxlength) {
                    return "Zip Code cannot be more than 6 characters long";
                }
            }
            if (control.errors.pattern) {
                return "Space between words are allowed";
            }
        }

        return '';
    }

    checkOrganizationName(event: any) {
        this.rest_api.organizationCheck(event.target.value).subscribe(res => {
            if (res.message == "Organization Name already Exists") {
                this.orgExsist = true;
            } else {
                this.orgExsist = false;
            }
        })
    }
    getAllDepartments() {
        this.rest_api.getAllDepartments().subscribe((response: any) => {
            this.departments = response;
        })
    }
    getCountries() {
        this.countryInfo = Country.getAllCountries();
    }
    onChangeCountry(countryValue: any) {
        this.isInput = !this.isInput;
        this.stateInfo = State.getAllStates();
        if (countryValue) {
            const matchingCountry = this.countryInfo.find((item) => item.name === countryValue.value);
            console.log("matchingCountry", matchingCountry);
            this.phnCountry = matchingCountry?.isoCode.toLowerCase();
            this.stateInfo = this.stateInfo.filter((state) => state.countryCode === matchingCountry?.isoCode);
            this.errorMessage = "";
            if (this.stateInfo.length === 0) {
                this.stateInfo = [{ name: 'NA' }];
                this.cityInfo = [{ name: 'NA' }];
            }
        }
    }

    onChangeState(stateValue: any) {
        this.cityInfo = City.getAllCities();
        if (stateValue) {
            const matchingState = this.stateInfo.find((item: any) => item.name == stateValue.value);
            console.log("matchingState", matchingState);
            this.cityInfo = this.cityInfo.filter((city: any) => city.countryCode === matchingState.countryCode && city.stateCode === matchingState.isoCode);
            this.errorMessage1 = ""
            if (this.cityInfo.length === 0) {
                this.cityInfo = [{ name: 'NA' }];
            }
        }
    }

    onChangeCity(cityValue) {
        if (cityValue) {
            this.errorMessage2 = ''
        }
    }

    onKeydown(event) {
        let numArray = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"]
        let temp = numArray.includes(event.key); //gives true or false
        if (!temp) {
            event.preventDefault();
        }
    }

    OnFlagChange(event: any) {
        if (event.name != this.userForm.value.country.name) {
            this.isErrorMessage = true;
            this.errorMessage = "Please Select Appropriate Country";
            this.errorMessage1 = "Please Select Appropriate State";
            this.errorMessage2 = "Please Select Appropriate City"
        }
    }

    lettersOnly(event): boolean {
        var regex = new RegExp("^[a-zA-Z ]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
        if ((event.target.selectionStart === 0 && event.code === 'Space')) {
            event.preventDefault();
        }
    }

    resetForm() {
        this.userForm.reset();
        this.errorMessage = "";
        this.errorMessage1 = "";
        this.errorMessage2 = ""
    }

    userDetailsSave() {
        this.spinner.show();
        // This payload is for Registration Continue API
        var payload = new FormData();
        var reqObj = {}
        reqObj = {
            userId: localStorage.getItem("ProfileuserId"),
            jobTitle: this.userForm.value.jobTitle,
            department: this.userForm.value.department,
            // organization: this.userForm.value.organization,
            country: this.userForm.value.country,
            state: this.userForm.value.state,
            city: this.userForm.value.city,
            zipCode: this.userForm.value.zipCode,
            phoneNumber: this.userForm.value.phoneNumber,
        }
        payload.append('firstName', this.crypto.encrypt(JSON.stringify(reqObj)));
        console.log("Req_Payload", reqObj);

        this.rest_api.registrationContinue(payload).subscribe((res: any) => {
            this.spinner.hide();
            if (res.body.message == "User Details Saved Successfully!!") {
                // this.toaster.toastSuccess(res.body.message);
                this.toaster.toastSuccess("Your details have been saved successfully.");
                this.rest_api.expiryInfo().subscribe(data => {
                    if(data.isPredefinedBots){
                        this.router.navigate(["/pages/aiagent/home"]);
                    }else{
                        if(environment.isCopilotEnable)
                        this.router.navigate(["/pages/copilot/home"]);
                          if(!environment.isCopilotEnable)
                            this.rest_api.getDashBoardsList().subscribe((res:any)=>{
                            let dashbordlist:any=res.data;
                            let defaultDashBoard = dashbordlist.find(item=>item.defaultDashboard == true);
                            if(defaultDashBoard == undefined || dashbordlist.length == 0 ){
                              this.router.navigate(["/pages/dashboard/create-dashboard"])
                            }else{
                              const newObj = {dashboardId: defaultDashBoard.id,dashboardName : defaultDashBoard.dashboardName};
                              this.router.navigate(['/pages/dashboard/dynamicdashboard'], { queryParams: newObj})
                            }
                          })
                    }
                })
            }
        }, err => {
            this.spinner.hide();
            this.toaster.showError("Error occured, Please try again.")
        })
    }
}
