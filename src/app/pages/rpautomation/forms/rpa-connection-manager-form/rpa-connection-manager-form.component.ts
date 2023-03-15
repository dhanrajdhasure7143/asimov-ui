import { Component, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { RestApiService } from "src/app/pages/services/rest-api.service";
import Swal from "sweetalert2";
import { LoaderService } from "src/app/services/loader/loader.service";

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
  validateJSON: boolean = false;
  addInputForm: FormGroup;
  selectedId: any;
  selectedOne: any[] = [];
  isCreate: any;
  isVerifier: boolean;
  isScopeField: boolean;
  selectedToolsetName:string;
  requestJson_body:any[]=[];
  headerForm = [{
  index:0,
  encodedKey: "",
  encodedValue: "",
  }
];
  action_id:any;

  constructor(
    private formBuilder: FormBuilder,
    private rest_api: RestApiService,
    private router:Router,
    private route:ActivatedRoute,
    private spinner:LoaderService
  ) {
    this.createItem();
    this.route.queryParams.subscribe((data) => {
      this.selectedId = data.id;
      this.action_id = data.action_Id;
      this.isCreate = data.create;
      if (data.name) this.selectedToolsetName = data.name;
    });
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
      scope: ["", Validators.compose([Validators.required])],
      encoded: this.formBuilder.array([this.createItem()]),
    });

    this.methodTypes();
    this.authTypes();
    this.getActionType();
    this.getGrantTypes();
    if (this.isCreate == "false") {
      this.getActionById();
    }

    // this.addInputForm = new FormGroup({
    //   addInputField: new FormArray([
    //     new FormGroup({
    //       encodedKey: new FormControl(""),
    //       encodedValue: new FormControl(""),
    //     }),
    //   ]),
    // });
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
    console.log(this.connectorForm.value);
    let req_body
    if(this.connectorForm.value.actionType == "Authenticated"){
    
    req_body=
      {
        // "id": this.selectedId,
        "name": this.connectorForm.value.actionName,
        "audit": null,
        // "type": this.connectorForm.value.methodType,
        "configuredConnectionId": this.selectedId,
        // "description": "login for zoho", //we dont have description in UI
        // "configuration": "{\"endPoint\" : \"https://accounts.zoho.com/oauth/v2/token\",\"actionType\":\"APIRequest\",\"clientId\" : \"1000.B88M52TRKWRD3SG8G4BFUOM1NC4WHA\",\"clientSecret\" : \"e81b73aeca3594855c40605eb27d3152c466f22ac9\",\"grantType\" : \"refresh_token\",\"scope\" : null,\"userName\" : null,\"password\" : null,\"refreshToken\" : \"1000.ca5e3c4bc17652d3c6458f2ccb913572.05a4a81c4e8e05baa2eedad22759d28f\",\"contentType\" : null,\"authorizationCode\" : null,\"redirectUri\" : null,\"attributes\" : [ \"ClientId\", \"ClientSecret\" ],\"type\" : \"OAUTH\"}",
        // "actionType":this.connectorForm.value.actionType,
        "actionLogo" : ""
        // "endPoint": this.connectorForm.value.endPoint
      }
    
    // "configuration": "{\"endPoint\": \"http.sample\",
    // [@endPoint|string|https://accounts.zoho.com/oauth/v2/token@]\",\"grant_type\": \"[@grant_type|string|authorization_code@]\",\"client_id\": \"[@client_id|string|1000.CH7ESPHDBG11Z0JJQJRCHQOYJVVWEJ@]\",\"client_secret\": \"[@client_secret|string|b864aac0bbd2a1e220763893424634e5e435d6c23a@]\",\"refresh_token\": \"[@refresh_token|string|1000.f0d3765b56b3d90eeebe6554981e68d9.a26589d8b570f3ba33e9f7d0e8eab980@]\"}"
    let object={
      "endPoint" : `[@endPoint|string|${this.connectorForm.value.endPoint}@]`,
      "grant_type" : `[@grant_type|string|${this.connectorForm.value.grantType}@]`,
      "methodType" : this.connectorForm.value.methodType,
      "actionType": this.connectorForm.value.actionType,
    }
    if (this.connectorForm.value.grantType == "AuthorizationCode") {

      object["clientId"] = `[@clientId|string|${this.connectorForm.value.clientId}@]`
      object["clientSecret"] = `[@clientSecret|string|${this.connectorForm.value.clientSecret}@]`
      object["code"] = `[@code|string|${this.connectorForm.value.code}@]`
      object["redirect_uri"] = `[@redirect_uri|string|${this.connectorForm.value.redirect_uri}@]`

    } else if (this.connectorForm.value.grantType == "PasswordCredentials") {
      object["clientId"] = `[@clientId|string|${this.connectorForm.value.clientId}@]`
      object["clientSecret"] = `[@clientSecret|string|${this.connectorForm.value.clientSecret}@]`
      object["userName"] = `[@userName|string|${this.connectorForm.value.userName}@]`
      object["password"] = `[@password|string|${this.connectorForm.value.password}@]`

    } else if (this.connectorForm.value.grantType == "ClientCredentials") {
      object["clientId"] = `[@clientId|string|${this.connectorForm.value.clientId}@]`
      object["clientSecret"] = `[@clientSecret|string|${this.connectorForm.value.clientSecret}@]`
      object["scope"] = `[@scope|string|${this.connectorForm.value.scope}@]`

    } else if (this.connectorForm.value.grantType == "AuthorizationCodeWithPKCE") {
      object["clientId"] = `[@clientId|string|${this.connectorForm.value.clientId}@]`
      object["clientSecret"] = `[@clientSecret|string|${this.connectorForm.value.clientSecret}@]`
      object["code"] = `[@code|string|${this.connectorForm.value.code}@]`
      object["redirect_uri"] = `[@redirect_uri|string|${this.connectorForm.value.redirect_uri}@]`
      object["verifier"] = `[@verifier|string|${this.connectorForm.value.verifier}@]`
    }
   // "refreshToken" : \"1000.ca5e3c4bc17652d3c6458f2ccb913572.05a4a81c4e8e05baa2eedad22759d28f\" // dont have refresh token
    req_body["configuration"]=JSON.stringify(object);
    console.log(req_body);

    }
    else{
      req_body = {
        "name" : this.connectorForm.value.actionName,
        // "type" : this.connectorForm.value.actionType,
        "configuredConnectionId" : this.selectedId,
        "description" : "",
        // "configuration" : "{\"endPoint\":\"https://www.zohoapis.com/crm/v3/Leads\",\"requestPayload\":{\"data\":[{\"Company\":\"AmeripriseDummy\",\"Last_Name\":\"Matt\",\"First_Name\":\"[@First_Name|string|Haley@]\",\"Email\":\"Matt.Haley@gmail.com\",\"State\":\"[@State|string|California@]\"}]}\",\"requestMethod\":\"POST\",\"contentType\":\"application/json\",\"httpHeaders\":null,\"type\":\"API\"}"
      }
      this.requestJson_body.push(this.connectorForm.get("request").value)
      let object={
        // "endPoint" : this.connectorForm.value.endPoint,
        "endPoint" : `[@endPoint|string|${this.connectorForm.value.endPoint}@]`,
        "methodType" : this.connectorForm.value.methodType,
        "actionType": this.connectorForm.value.actionType,
        // "requestMethod":this.connectorForm.value.methodType,
        "contentType":"application/json",
        "httpHeaders":null,
        "type":"API",
        "requestPayload":{
          "data":this.requestJson_body
        }
    }
    req_body["configuration"]=JSON.stringify(object)
    }
    console.log(req_body)
    this.rest_api.saveAction(req_body).subscribe((res) => {
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
          text: "Something went wrong !!",
          heightAuto: false,
        });
      }
    );
    this.connectorForm.reset();
  }

  testForm() {
    this.spinner.show();
    let req_body:any={
    "clientId": this.connectorForm.value.clientId,
    "clientSecret": this.connectorForm.value.clientSecret,
    "endPoint": this.connectorForm.value.endPoint,
    "type": "OAUTH"
  }
    if (this.connectorForm.value.grantType == "AuthorizationCode") {
      req_body["grantType"] = "authorization_code";
      req_body["code"] = this.connectorForm.value.code;
      req_body["redirect_uri"] = this.connectorForm.value.redirect_uri;
    } else if (this.connectorForm.value.grantType == "PasswordCredentials") {
      // "grantType": this.connectorForm.value.grantType,
      (req_body["grantType"] = "password"),
      (req_body["password"] = this.connectorForm.value.password);
      req_body["userName"] = this.connectorForm.value.userName;
    } else if (this.connectorForm.value.grantType == "ClientCredentials") {
      req_body["grantType"] = this.connectorForm.value.grantType;
      req_body["scope"] = this.connectorForm.value.scope;
    }
    // else if (this.connectorForm.value.grantType == "RefreshToken") {
    //       req_body["grantType"]="refresh_token"
    //       req_body["refreshToken"]="1000.246a848d7739e32dace9179429e3451a.0b4254d5019f473478da157067e697ad"
    // }
    console.log(this.connectorForm.value)
    this.rest_api.testActions(req_body).subscribe((res:any)=>{
    if(res.data.access_token)
    this.connectorForm.get("response").setValue(res.data.access_token)
    this.spinner.hide();
    Swal.fire({
      icon: "success",
      title: "Success",
      text: res.message,
      heightAuto: false,
    })
    },(err: any) => {
      Swal.fire("Error", "Unable generate access token", "error")
      this.spinner.hide();
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

  isJsonData() {
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
    } else if (event == "APIRequest") {
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
    } else if (event == "AuthorizationCodeWithPKCE") {
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
      return this.grantItems;
    });
  }

  get addInputField(): FormArray {
    return this.addInputForm.get("addInputField") as FormArray;
  }

  addHeader() {
    // this.addInputField.push(
    //   new FormGroup({
    //     encodedKey: new FormControl(""),
    //     encodedValue: new FormControl(""),
    //   })
    // );
    this.headerForm.push({
      index:this.headerForm.length,
      encodedKey: "",
      encodedValue: "",
    });

  }
  backToaction(){
    this.router.navigate(['/pages/rpautomation/action-item'],{queryParams: {id: this.selectedId}})
  }

getActionById(){
  this.rest_api.getActionById(this.selectedId).subscribe((res)=>{})
}

selectRow(){
  console.log(this.selectedOne);
  this.requestJson_body=[]
  let obj={}
  this.selectedOne.forEach(ele=>{
    obj[ele["encodedKey"]]=ele["encodedValue"]
  })
  this.requestJson_body.push(obj);
  // this.connectorForm.get("request").setValue(JSON.stringify(this.requestJson_body))
}

onDelete(index){
  this.headerForm.splice(index,1)
}

}
