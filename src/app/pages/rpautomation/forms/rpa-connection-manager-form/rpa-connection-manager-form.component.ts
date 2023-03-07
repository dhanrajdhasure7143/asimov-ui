import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { RestApiService } from "src/app/pages/services/rest-api.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-rpa-connection-manager-form",
  templateUrl: "./rpa-connection-manager-form.component.html",
  styleUrls: ["./rpa-connection-manager-form.component.css"],
})
export class RpaConnectionManagerFormComponent implements OnInit {
  public connectorForm: FormGroup;
  methodItems: any = [];
  encoded: FormArray;
  actionItems: any = [];
  authItems: any = [];
  grantItems: any = [];
  isAuthenticated: boolean = false;
  isAction: boolean = false;
  isAuthorization: boolean = false;
  isClient: boolean = false;
  isPassword: boolean = false;
  isRequest: boolean = false;
  isResponse: boolean = false;
  attribute = [];
  addInputForm: FormGroup;
  validateJSON: boolean = false;
  selectedId:any;
  selectedOne:any[]=[];
  isCreate:boolean=false;
  isVerifier: boolean;
  isScopeField: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private rest_api: RestApiService,
    private router:Router,
    private route:ActivatedRoute
  ) {
    this.createItem();
    this.route.queryParams.subscribe((data)=>{
    this.selectedId = data.id;
    this.isCreate = data.create;
    console.log(this.isCreate);
    
    })
  }

  ngOnInit(): void {
    this.connectorForm = this.formBuilder.group({
      actionName: ["", Validators.compose([Validators.required])],
      methodType: ["", Validators.compose([Validators.required])],
      actionType: ["", Validators.compose([Validators.required])],
      endPoint: ["", Validators.compose([Validators.required])],
      authType: ["", Validators.compose([Validators.required])],
      icon: ["", Validators.compose([])],
      attribute: ["", Validators.compose([Validators.required])],
      grantType: ["", Validators.compose([Validators.required])],
      code: ["", Validators.compose([Validators.required])],
      redirect_uri: ["", Validators.compose([Validators.required])],
      userName: ["", Validators.compose([Validators.required])],
      password: ["", Validators.compose([Validators.required])],
      clientId: ["", Validators.compose([Validators.required])],
      clientSecret: ["", Validators.compose([Validators.required])],
      verifier: ["", Validators.compose([Validators.required])],
      headerKey: ["", Validators.compose([Validators.required])],
      headerValue: ["", Validators.compose([Validators.required])],
      headerCheck: ["", Validators.compose([Validators.required])],
      request: ["", Validators.compose([])],
      response: ["", Validators.compose([])],
      ScopeFeild: ["", Validators.compose([])],
      encoded: this.formBuilder.array([this.createItem()]),
    });

    this.methodTypes();
    this.authTypes();
    this.getActionType();
    this.getGrantTypes();

    this.addInputForm = new FormGroup({
      addInputField: new FormArray([
        new FormGroup({
          encodedCheck: new FormControl(""),
          encodedKey: new FormControl(""),
          encodedValue: new FormControl(""),
          encodedDelete: new FormControl(""),
        }),
      ]),
    });
  }

  createItem() {
    return this.formBuilder.group({
      encodedKey: ["", Validators.required],
      encodedValue: ["", Validators.required],
      encodedCheck: ["", Validators.required],
    });
  }

  addInput() {
    let rows = this.connectorForm.get("encoded") as FormArray;
    rows.push(this.createItem());
  }

  saveForm() {
    let connect = this.connectorForm.value;
    this.rest_api.saveConnector(connect).subscribe(
      (res) => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Done Successfully !!",
          heightAuto: false,
        });
      },
      (err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
          heightAuto: false,
        });
      }
    );
    this.connectorForm.reset();
  }

  testForm() {
    let req_body:any={
    "clientId": this.connectorForm.value.clientId,
    "clientSecret": this.connectorForm.value.clientSecret,
    "endPoint": this.connectorForm.value.endPoint,
    "type": "OAUTH"
  }
    if (this.connectorForm.value.grantType == "AuthorizationCode") {
      req_body["grantType"]="authorization_code"
      req_body["code"]= this.connectorForm.value.code
      req_body["redirect_uri"]=this.connectorForm.value.redirect_uri
    } 
    else if (this.connectorForm.value.grantType == "PasswordCredentials") {
      // "grantType": this.connectorForm.value.grantType,
      req_body["grantType"]= "password",
      req_body["password"]= this.connectorForm.value.password
      req_body["userName"]= this.connectorForm.value.userName
    } 
    else if (this.connectorForm.value.grantType == "ClientCredentials") {
      req_body["grantType"]=this.connectorForm.value.grantType
      req_body["scope"]= this.connectorForm.value.scope
    }
    // else if (this.connectorForm.value.grantType == "RefreshToken") {
    //       req_body["grantType"]="refresh_token"
    //       req_body["refreshToken"]="1000.246a848d7739e32dace9179429e3451a.0b4254d5019f473478da157067e697ad"
    // }
    console.log(this.connectorForm.value)
    this.rest_api.testActions(req_body).subscribe((res:any)=>{
    if(res.access_token)
    this.connectorForm.get("response").setValue(res.access_token)
    })
  }

  methodTypes() {
    this.rest_api.getMethodTypes().subscribe((res: any) => {
      let filterData = res;
      this.methodItems = Object.keys(filterData).map((key) => ({
        type: key,
        value: filterData[key],
      }));
      return this.methodItems;
    });
  }

  authTypes() {
    this.rest_api.getAuthTypes().subscribe((res: any) => {
      let filterData = res;
      this.authItems = Object.keys(filterData).map((key) => ({
        type: key,
        value: filterData[key],
      }));
      console.log(this.authItems);
      
      return this.authItems;
    });
  }

  isJsonValid() {
    let jsonData = this.connectorForm.get("scope").value;
    try {
      JSON.parse(jsonData);
      this.validateJSON = false;
    } catch (e) {
      this.validateJSON = true;
    }
  }

  isJsonData(){
    let jsonValidate = this.connectorForm.get("request").value;
    try {
      JSON.parse(jsonValidate);
      this.validateJSON = false;
    } catch (e) {
      this.validateJSON = true;
    }
  }

  actionChange(event) {
    if (event == "Authenticated") {
      this.isAction = true;
      this.isRequest = false;
      this.isResponse = false;
    } else if (event == "API Request") {
      this.isRequest = true;
      this.isAction = false;
      this.isResponse = false;
      this.isClient = false;
      this.isPassword = false;
      this.isAuthenticated = false;
      this.isAuthorization = false;
    }
  }

  authChange(event) {
    if (event == "OAuth 2.0") {
      this.isAuthenticated = true;
    }
  }

  grantChange(event) {
    if (event == "AuthorizationCode") {
      this.isAuthorization = true;
      this.isClient = true;
      this.isResponse = true;
      this.isPassword = false;
      this.isVerifier = false;
      this.isScopeField = false;
    } else if (event == "PasswordCredentials") {
      this.isPassword = true;
      this.isClient = true;
      this.isResponse = true;
      this.isAuthorization = false;
      this.isVerifier = false;
      this.isScopeField = false;
    } else if (event == "ClientCredentials") {
      this.isClient = true;
      this.isResponse = true;
      this.isAuthorization = false;
      this.isPassword = false;
      this.isVerifier = false;
      this.isScopeField = true;
    } else if(event == "AuthorizationCodeWithPKCE"){
      this.isAuthorization = true;
      this.isClient = true;
      this.isResponse = true;
      this.isPassword = false;
      this.isVerifier = true;
      this.isScopeField = false;
    }
  }

  getActionType() {
    this.rest_api.getActionType().subscribe((res: any) => {
      let filterData = res;
      this.actionItems = Object.keys(filterData).map((key) => ({
        type: key,
        value: filterData[key],
      }));
      return this.actionItems;
    });
  }

  getGrantTypes() {
    this.rest_api.getGrantTypes().subscribe((res: any) => {
      let filterData = res;      
      this.grantItems = Object.keys(filterData).map((key) => ({
        type: key,
        value: filterData[key],
      }));
    console.log(this.grantItems);
      return this.grantItems;
    });
  }
  get addInputField(): FormArray {
    return this.addInputForm.get("addInputField") as FormArray;
  }
  addHeader() {
    this.addInputField.push(
      new FormGroup({
        encodedCheck: new FormControl(""),
        encodedKey: new FormControl(""),
        encodedValue: new FormControl(""),
        encodedDelete: new FormControl(""),
      })
    );
  }
  backToaction(){
    this.router.navigate(['/pages/rpautomation/action-item'],{queryParams: {id: this.selectedId}}
  )}

}
