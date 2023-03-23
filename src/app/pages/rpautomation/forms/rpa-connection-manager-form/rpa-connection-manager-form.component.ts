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
  // attribute = [];
  validateJSON: boolean = false;
  addInputForm: FormGroup;
  selectedId: any;
  selectedOne: any[] = [];
  isCreate: any;
  isVerifier: boolean;
  isRefreshToken: boolean;
  isScopeField: boolean;
  selectedToolsetName:string;
  requestJson_body:any[]=[];
  headerForm = [];
  action_id:any;
  selectedConnector: any;
  istoolSet: boolean;
  isDisabled: boolean = false;
  actionUpdate: any;
  actionData: any = [];
  action_logo: any;
  isUpdate: boolean = false;
  isHeader : boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private rest_api: RestApiService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: LoaderService
  ) {
    this.route.queryParams.subscribe((data) => {
      this.isDisabled = data.formDisabled;
      this.selectedId = data.id;
      this.action_id = data.action_Id;
      this.isCreate = data.create;
      if(this.isCreate == false){
        this.isDisabled = true;
      } else {
        this.isDisabled = false
      }
      this.selectedConnector = data.connector_name;
      if (data.name) {
        this.selectedConnector = data.connector_name;
        this.selectedToolsetName = data.name;
        this.istoolSet = false;
      }
      if (!data.name) {
        this.selectedConnector = data.connector_name;
        this.istoolSet = true;
      }
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
      // attribute: ["", Validators.compose([Validators.required])],
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
      scope: ["", Validators.compose([])],
      refreshToken: ["", Validators.compose([Validators.required])],
    });

    this.methodTypes();
    this.authTypes();
    this.getActionType();
    this.getGrantTypes();
    if (this.isCreate == "false") {
      this.isUpdate = true;
      this.getActionById();
    }
  }


  saveAction() {
    this.spinner.show();
    let req_body
    if(this.connectorForm.value.actionType == "Authenticated"){
    
    req_body=
      {
        "id": "",
        "name": this.connectorForm.value.actionName,
        "audit": null,
        "actionType": this.connectorForm.value.actionType,
        "configuredConnectionId": this.selectedId,
        // "description": "login for zoho", //we dont have description in UI
        // "actionLogo" : ""
        actionLogo: new String(this.action_logo.split(",")[1]),
        // "endPoint": this.connectorForm.value.endPoint
      };

      let object = {
        endPoint: this.connectorForm.value.endPoint,
        grant_type: this.connectorForm.value.grantType,
        methodType: this.connectorForm.value.methodType,
        type: this.connectorForm.value.authType,
        // "actionType": this.connectorForm.value.actionType,
      };
      if (this.connectorForm.value.grantType == "AuthorizationCode") {
        object["clientId"] = this.connectorForm.value.clientId;
        object["clientSecret"] = this.connectorForm.value.clientSecret;
        object["code"] = this.connectorForm.value.code;
        object["redirect_uri"] = this.connectorForm.value.redirect_uri;
      } else if (this.connectorForm.value.grantType == "PasswordCredentials") {
        object["clientId"] = this.connectorForm.value.clientId;
        object["clientSecret"] = this.connectorForm.value.clientSecret;
        object["userName"] = this.connectorForm.value.userName;
        object["password"] = this.connectorForm.value.password;
      } else if (this.connectorForm.value.grantType == "ClientCredentials") {
        object["clientId"] = this.connectorForm.value.clientId;
        object["clientSecret"] = this.connectorForm.value.clientSecret;
        object["scope"] = this.connectorForm.value.scope;
      } else if (
        this.connectorForm.value.grantType == "AuthorizationCodeWithPKCE"
      )  {
        object["clientId"] = this.connectorForm.value.clientId;
        object["clientSecret"] = this.connectorForm.value.clientSecret;
        object["code"] = this.connectorForm.value.code;
        object["redirect_uri"] = this.connectorForm.value.redirect_uri;
        object["verifier"] = this.connectorForm.value.verifier;
      } else if (this.connectorForm.value.grantType == "RefreshToken") {
        req_body["grantType"]="refresh_token"
        req_body["refreshToken"]=this.connectorForm.value.refreshToken
  }
      // "refreshToken" : \"1000.ca5e3c4bc17652d3c6458f2ccb913572.05a4a81c4e8e05baa2eedad22759d28f\" // dont have refresh token
      req_body["configuration"] = JSON.stringify(object);
    } else {
      req_body = {
        "id":"",
        "name" : this.connectorForm.value.actionName,
        "actionLogo": new String(this.action_logo.split(",")[1]),
        "actionType" : this.connectorForm.value.actionType,
        "configuredConnectionId" : this.selectedId,
        "description" : "",
      }
      
        this.requestJson_body=[]
        let obj={}
        this.selectedOne.forEach(ele=>{
          obj[ele["encodedKey"]]=ele["encodedValue"];
        })
        // this.requestJson_body.push(obj1);
      // this.requestJson_body.push(this.connectorForm.get("request").value)
      // let obj={};
      // obj[this.connectorForm.value.headerKey]=this.connectorForm.value.headerValue
      let object={
        "endPoint" : this.connectorForm.value.endPoint,
        "methodType" : this.connectorForm.value.methodType,
        // "actionType": this.connectorForm.value.actionType,
        // "requestMethod":this.connectorForm.value.methodType,
        "contentType":"application/json",
        "httpHeaders": obj,
        // "type":"API",
        "requestPayload":this.connectorForm.get("request").value.replace(/\s/g, "")
    }
    // console.log(this.connectorForm.get("request").value.replace(/\n|\t/g, ''))
    req_body["configuration"]=JSON.stringify(object);
    }
    console.log("req_body",req_body)
    this.rest_api.saveAction(req_body).subscribe((res:any) => {
      this.spinner.hide();
      if (res.message === "Successfully saved configured action") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Action Saved Successfully !!",
          heightAuto: false,
        }).then((result) => {
          this.connectorForm.reset();
          this.router.navigate(["/pages/rpautomation/action-item"], {
            queryParams: { id: this.selectedId, name: this.selectedConnector },
          });
        });
      } else {
        this.spinner.hide();
        (err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong !!",
            heightAuto: false,
          });
        };
      }
    });
    this.connectorForm.reset();
  }

  testAction() {
    this.spinner.show();
    let req_body: any = {
      clientId: this.connectorForm.value.clientId,
      clientSecret: this.connectorForm.value.clientSecret,
      endPoint: this.connectorForm.value.endPoint,
      type: this.connectorForm.value.authType,
    };
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
    } else if (this.connectorForm.value.grantType == "RefreshToken") {
      req_body["grantType"] = "refresh_token";
      req_body["refreshToken"] = this.connectorForm.value.refreshToken;
    }
    this.rest_api.testActions(req_body).subscribe(
      (res: any) => {
        if (res.data.access_token)
          this.connectorForm.get("response").setValue(res.data.access_token);
        this.spinner.hide();
        Swal.fire({
          icon: "success",
          title: "Success",
          text: res.message,
          heightAuto: false,
        });
      },
      (err: any) => {
        Swal.fire("Error", "Unable generate access token", "error");
        this.spinner.hide();
      }
    );
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
      this.isHeader = false
      this.isResponse = false;
    } else if (event == "APIRequest") {
      this.isRequest = true;
      this.isHeader = true;
      this.isAction = false;
      this.isResponse = false;
      this.isClient = false;
      this.isPassword = false;
      this.isAuthenticated = false;
      this.isAuthorization = false;
      this.isRefreshToken = false;
      this.isScopeField = false;
    }
  }

  methodChange(event){
    if(event == "GET" && this.connectorForm.value.actionType == "APIRequest"){
     this.isRequest = false;
    } else {
      this.isRequest = true;    
    }
  }

  authChange(event) {
    if (event == "OAUTH2") {
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
      this.isRefreshToken = false;
    } else if (event == "PasswordCredentials") {
      this.isPassword = true;
      this.isClient = true;
      this.isResponse = true;
      this.isAuthorization = false;
      this.isVerifier = false;
      this.isScopeField = false;
      this.isRefreshToken = false;
    } else if (event == "ClientCredentials") {
      this.isClient = true;
      this.isResponse = true;
      this.isAuthorization = false;
      this.isPassword = false;
      this.isVerifier = false;
      this.isScopeField = true;
      this.isRefreshToken = false;
    } else if (event == "AuthorizationCodeWithPKCE") {
      this.isAuthorization = true;
      this.isClient = true;
      this.isResponse = true;
      this.isPassword = false;
      this.isVerifier = true;
      this.isScopeField = false;
      this.isRefreshToken = false;
    } else if (event == "RefreshToken") {
      this.isAuthorization = false;
      this.isClient = true;
      this.isResponse = true;
      this.isPassword = false;
      this.isVerifier = false;
      this.isScopeField = true;
      this.isRefreshToken = true;
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
    this.headerForm.push({
      index: this.headerForm.length,
      encodedKey: "",
      encodedValue: "",
    });
  }
  backToaction() {
    this.router.navigate(["/pages/rpautomation/action-item"], {
      queryParams: { id: this.selectedId, name: this.selectedConnector },
    });
  }

  getActionById() {
    this.spinner.show();
    this.rest_api.getActionById(this.action_id).subscribe((res) => {
      this.actionData = res["data"];      
      console.log(this.actionData, "this.actionData");
      if (this.actionData["actionType"] == "APIRequest") {
        this.isDisabled = true;
        this.isRequest = true;
        this.isHeader = true;
        this.isAction = false;
        this.isResponse = false;
        this.isClient = false;
        this.isPassword = false;
        this.isAuthenticated = false;
        this.isAuthorization = false;
      }
      if (this.actionData["actionType"] == "Authenticated") {
        this.isDisabled = true;
        this.isAction = true;
        this.isRequest = false;
        this.isHeader = false;
        this.isResponse = false;
      }
      if (this.actionData.configurationAsJson["type"] == "OAUTH2") {
        this.isAuthenticated = true;
      }
      if (
        this.actionData.configurationAsJson["grant_type"] == "AuthorizationCode"
      ) {
        this.isAuthorization = true;
        this.isClient = true;
        this.isResponse = true;
        this.isPassword = false;
        this.isVerifier = false;
        this.isScopeField = false;
        this.isRefreshToken = false;
      } else if (
        this.actionData.configurationAsJson["grant_type"] ==
        "PasswordCredentials"
      ) {
        this.isPassword = true;
        this.isClient = true;
        this.isResponse = true;
        this.isAuthorization = false;
        this.isVerifier = false;
        this.isScopeField = false;
        this.isRefreshToken = false;
      } else if (
        this.actionData.configurationAsJson["grant_type"] == "ClientCredentials"
      ) {
        this.isClient = true;
        this.isResponse = true;
        this.isAuthorization = false;
        this.isPassword = false;
        this.isVerifier = false;
        this.isScopeField = true;
        this.isRefreshToken = false;
      } else if (
        this.actionData.configurationAsJson["grant_type"] ==
        "AuthorizationCodeWithPKCE"
      ) {
        this.isAuthorization = true;
        this.isClient = true;
        this.isResponse = true;
        this.isPassword = false;
        this.isVerifier = true;
        this.isScopeField = false;
        this.isRefreshToken = false;
      } else if (
        this.actionData.configurationAsJson["grant_type"] == "RefreshToken"
      ) {
        this.isAuthorization = false;
        this.isClient = true;
        this.isResponse = true;
        this.isPassword = false;
        this.isVerifier = false;
        this.isScopeField = true;
        this.isRefreshToken = true;
      }

      if (this.actionData["actionType"] == "APIRequest" && this.actionData["methodType"] == "GET") { 
        this.isRequest = false;
      } else {
        this.isRequest = true;    
      }

      this.connectorForm.get("actionName").setValue(this.actionData["name"]);
      this.connectorForm.get("endPoint").setValue(this.actionData.configurationAsJson["endPoint"]);
      this.connectorForm.get("actionType").setValue(this.actionData["actionType"]);
      this.connectorForm.get("methodType").setValue(this.actionData.configurationAsJson["methodType"]);
      this.connectorForm.get("icon").setValue(this.actionData["actionLogo"]);
      this.connectorForm.get("authType").setValue(this.actionData.configurationAsJson["type"]);
      this.connectorForm.get("grantType").setValue(this.actionData.configurationAsJson["grant_type"]);
      this.connectorForm.get("code").setValue(this.actionData.configurationAsJson["code"]);
      this.connectorForm.get("redirect_uri").setValue(this.actionData.configurationAsJson["redirect_uri"]);
      this.connectorForm.get("userName").setValue(this.actionData.configurationAsJson["userName"]);
      this.connectorForm.get("password").setValue(this.actionData.configurationAsJson["password"]);
      this.connectorForm.get("clientId").setValue(this.actionData.configurationAsJson["clientId"]);
      this.connectorForm.get("clientSecret").setValue(this.actionData.configurationAsJson["clientSecret"]);
      this.connectorForm.get("verifier").setValue(this.actionData.configurationAsJson["verifier"]);
      if(this.actionData.configurationAsJson["httpHeaders"]){
        let headers_data = this.actionData.configurationAsJson["httpHeaders"]
        Object.keys(headers_data).map((key,i) => (
        this.headerForm.push({
          index: i,
          encodedKey: key,
          encodedValue: headers_data[key],
        })
        ));
        this.selectedOne = this.headerForm;
      }
      this.connectorForm.get("request").setValue(this.actionData.configurationAsJson["requestPayload"]);
      this.connectorForm.get("response").setValue(this.actionData["response"]);
      this.connectorForm.get("scope").setValue(this.actionData["scope"]);
      this.connectorForm.get("refreshToken").setValue(this.actionData["refreshToken"]);
      this.spinner.hide();
    });
  }

  selectRow(){
  }

  onDelete(index) {
    this.headerForm.splice(index, 1);
  }

  imageUpload(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e) {
    var reader = e.target;
    this.action_logo = reader.result;
  }

  updateAction() {
    this.spinner.show();
    let req_body;
    if (this.connectorForm.value.actionType == "Authenticated") {
      req_body = {
        id: "",
        name: this.connectorForm.value.actionName,
        audit: null,
        actionType: this.connectorForm.value.actionType,
        configuredConnectionId: this.selectedId,
        // "description": "login for zoho", //we dont have description in UI
        // "actionLogo" : ""
        actionLogo: new String(this.action_logo.split(",")[1]),
        // "endPoint": this.connectorForm.value.endPoint
      };

      let object = {
        endPoint: this.connectorForm.value.endPoint,
        grant_type: this.connectorForm.value.grantType,
        methodType: this.connectorForm.value.methodType,
        type: this.connectorForm.value.authType,
        // "actionType": this.connectorForm.value.actionType,
      };
      if (this.connectorForm.value.grantType == "AuthorizationCode") {
        object["clientId"] = this.connectorForm.value.clientId;
        object["clientSecret"] = this.connectorForm.value.clientSecret;
        object["code"] = this.connectorForm.value.code;
        object["redirect_uri"] = this.connectorForm.value.redirect_uri;
      } else if (this.connectorForm.value.grantType == "PasswordCredentials") {
        object["clientId"] = this.connectorForm.value.clientId;
        object["clientSecret"] = this.connectorForm.value.clientSecret;
        object["userName"] = this.connectorForm.value.userName;
        object["password"] = this.connectorForm.value.password;
      } else if (this.connectorForm.value.grantType == "ClientCredentials") {
        object["clientId"] = this.connectorForm.value.clientId;
        object["clientSecret"] = this.connectorForm.value.clientSecret;
        object["scope"] = this.connectorForm.value.scope;
      } else if (
        this.connectorForm.value.grantType == "AuthorizationCodeWithPKCE"
      ) {
        object["clientId"] = this.connectorForm.value.clientId;
        object["clientSecret"] = this.connectorForm.value.clientSecret;
        object["code"] = this.connectorForm.value.code;
        object["redirect_uri"] = this.connectorForm.value.redirect_uri;
        object["verifier"] = this.connectorForm.value.verifier;
      } else if (this.connectorForm.value.grantType == "RefreshToken") {
        req_body["grantType"]="refresh_token"
        req_body["refreshToken"]=this.connectorForm.value.refreshToken
      }
      // "refreshToken" : \"1000.ca5e3c4bc17652d3c6458f2ccb913572.05a4a81c4e8e05baa2eedad22759d28f\" // dont have refresh token
      req_body["configuration"] = JSON.stringify(object);
    } else {
      req_body = {
        id: this.action_id,
        name: this.connectorForm.value.actionName,
        actionLogo: new String(this.action_logo.split(",")[1]),
        actionType: this.connectorForm.value.actionType,
        configuredConnectionId: this.selectedId,
        description: "",
      };
      this.requestJson_body.push(this.connectorForm.get("request").value);
        let obj={}
        this.selectedOne.forEach(ele=>{
          obj[ele["encodedKey"]]=ele["encodedValue"];
        })
      let object = {
        endPoint: this.connectorForm.value.endPoint,
        methodType: this.connectorForm.value.methodType,
        // "actionType": this.connectorForm.value.actionType,
        // "requestMethod":this.connectorForm.value.methodType,
        contentType: "application/json",
        httpHeaders: obj,
        // "type":"API",
        "requestPayload":this.connectorForm.get("request").value.replace(/\s/g, "")
        // requestPayload: {
        //   data: this.requestJson_body,
        // },
      };
      req_body["configuration"] = JSON.stringify(object);
    }
    this.rest_api.updateAction(this.action_id, req_body).subscribe((res: any) => {
        this.spinner.hide();
        if (res.message === "Successfully updated configured action") {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Action Updated Successfully !!",
            heightAuto: false,
          }).then((result) => {
            this.connectorForm.reset();
            this.router.navigate(["/pages/rpautomation/action-item"], {
              queryParams: {
                id: this.selectedId,
                name: this.selectedConnector,
              },
            });
          });
        } else {
          this.spinner.hide();
          (err) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong !!",
              heightAuto: false,
            });
          };
        }
      });
    this.connectorForm.reset();
  }
}