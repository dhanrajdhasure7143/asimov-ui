import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators,} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { RestApiService } from "src/app/pages/services/rest-api.service";
import Swal from "sweetalert2";
import { LoaderService } from "src/app/services/loader/loader.service";
import { MessageService } from "primeng/api";

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
  isReqDisable : boolean = false;
  isRefresh: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private rest_api: RestApiService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
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
        actionLogo: this.action_logo==undefined?"":new String(this.action_logo.split(",")[1]),
        // "endPoint": this.connectorForm.value.endPoint
      };

      let object = {
        endPoint: this.connectorForm.value.endPoint,
        grantType: this.connectorForm.value.grantType,
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
      } else if (this.connectorForm.value.grantType == "client_credentials") {
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
      } else if (this.connectorForm.value.grantType == "refresh_token") {
        object["clientId"] = this.connectorForm.value.clientId;
        object["clientSecret"] = this.connectorForm.value.clientSecret;
        object["scope"] = this.connectorForm.value.scope;
        object["refreshToken"]=this.connectorForm.value.refreshToken
  }
      req_body["configuration"] = JSON.stringify(object);
    } else {
      req_body = {
        "id":"",
        "name" : this.connectorForm.value.actionName,
        "actionLogo":this.action_logo==undefined?"":new String(this.action_logo.split(",")[1]),
        "actionType" : this.connectorForm.value.actionType,
        "configuredConnectionId" : this.selectedId,
        "description" : "",
      }
      
        this.requestJson_body=[]
        let obj={}
        this.selectedOne.forEach(ele=>{
          obj[ele["encodedKey"]]=ele["encodedValue"];
        })
       
      let object={
        "endPoint" : this.connectorForm.value.endPoint,
        "methodType" : this.connectorForm.value.methodType,
        // "actionType": this.connectorForm.value.actionType,
        // "requestMethod":this.connectorForm.value.methodType,
        "contentType":"application/json",
        "httpHeaders": obj,
        "type":"API",
        "requestPayload":this.connectorForm.get("request").value.replace(/\s/g, "")
    }
    req_body["configuration"]=JSON.stringify(object);
    }
    this.rest_api.saveAction(req_body).subscribe((res:any) => {
      this.spinner.hide();
      if (res.message === "Successfully saved configured action") {
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Action Saved Successfully !!"
        })
          setTimeout(() =>{
            this.router.navigate(["/pages/rpautomation/action-item"], {
              queryParams: {
              id: this.selectedId,
              name: this.selectedConnector },
          });
          },3500)
      } else {
        this.spinner.hide();
        (err) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Something Went Wrong !!",
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
    } else if (this.connectorForm.value.grantType == "client_credentials") {
      req_body["grantType"] = this.connectorForm.value.grantType;
      req_body["scope"] = this.connectorForm.value.scope;
    } else if (this.connectorForm.value.grantType == "refresh_token") {
      req_body["grantType"] = "refresh_token";
      req_body["refreshToken"] = this.connectorForm.value.refreshToken;
      req_body["scope"] = this.connectorForm.value.scope;
    }
    this.rest_api.testActions(req_body).subscribe(
      (res: any) => {
        if (res.data)
          this.connectorForm.get("response").setValue(JSON.stringify(res.data));
        this.spinner.hide();
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: res.message,
        });
      },
      (err: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Unable to Generate Access Token !!",
        });        
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
      this.connectorForm.get('methodType').setValue("POST")
    } else if (event == "APIRequest") {
      this.connectorForm.get('methodType').setValue("")
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
     this.isReqDisable = true;
    }else{
      this.isReqDisable = false;
    }
  }

  authChange(event) {
    if (event == "OAUTH2") {
      this.isAuthenticated = true;
      } else {
      this.isAuthenticated = false;
      this.isAuthorization = false;
      this.isClient = false;
      this.isResponse = false;
      this.isPassword = false;
      this.isVerifier = false;
      this.isScopeField = false;
      this.isRefreshToken = false;
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
      this.connectorForm.get('code').setValue("")
      this.connectorForm.get('redirect_uri').setValue("")
      this.connectorForm.get('clientId').setValue("")
      this.connectorForm.get('clientSecret').setValue("")
    } else if (event == "PasswordCredentials") {
      this.isPassword = true;
      this.isClient = true;
      this.isResponse = true;
      this.isAuthorization = false;
      this.isVerifier = false;
      this.isScopeField = false;
      this.isRefreshToken = false;
      this.connectorForm.get('userName').setValue("")
      this.connectorForm.get('password').setValue("")
      this.connectorForm.get('clientId').setValue("")
      this.connectorForm.get('clientSecret').setValue("")
      this.isRefresh = true;
    } else if (event == "client_credentials") {
      this.isClient = true;
      this.isResponse = true;
      this.isAuthorization = false;
      this.isPassword = false;
      this.isVerifier = false;
      this.isScopeField = true;
      this.isRefreshToken = false;
      this.connectorForm.get('clientId').setValue("")
      this.connectorForm.get('clientSecret').setValue("")
      this.connectorForm.get('scope').setValue("")
      this.isRefresh = true;
    } else if (event == "AuthorizationCodeWithPKCE") {
      this.isAuthorization = true;
      this.isClient = true;
      this.isResponse = true;
      this.isPassword = false;
      this.isVerifier = true;
      this.isScopeField = false;
      this.isRefreshToken = false;
      this.connectorForm.get('code').setValue("")
      this.connectorForm.get('redirect_uri').setValue("")
      this.connectorForm.get('clientId').setValue("")
      this.connectorForm.get('clientSecret').setValue("")
      this.connectorForm.get('verifier').setValue("")
      this.isRefresh = true;
    } else if (event == "refresh_token") {
      this.isAuthorization = false;
      this.isClient = true;
      this.isResponse = true;
      this.isPassword = false;
      this.isVerifier = false;
      this.isScopeField = true;
      this.isRefreshToken = true;
      this.connectorForm.get('clientId').setValue("")
      this.connectorForm.get('clientSecret').setValue("")
      this.connectorForm.get('scope').setValue("")
      this.connectorForm.get('refreshToken').setValue("")
      this.isRefresh = true;
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
        this.isRefreshToken = false;
        this.isScopeField = false;
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
      } else {
        this.isAuthenticated = false;
        this.isAuthorization = false;
        this.isClient = false;
        this.isResponse = false;
        this.isPassword = false;
        this.isVerifier = false;
        this.isScopeField = false;
        this.isRefreshToken = false;
      }

      if (
        this.actionData.configurationAsJson["grantType"] == "AuthorizationCode"
      ) {
        this.isAuthorization = true;
        this.isClient = true;
        this.isResponse = true;
        this.isPassword = false;
        this.isVerifier = false;
        this.isScopeField = false;
        this.isRefreshToken = false;
      } else if (
        this.actionData.configurationAsJson["grantType"] ==
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
        this.actionData.configurationAsJson["grantType"] == "client_credentials"
      ) {
        this.isClient = true;
        this.isResponse = true;
        this.isAuthorization = false;
        this.isPassword = false;
        this.isVerifier = false;
        this.isScopeField = true;
        this.isRefreshToken = false;
      } else if (
        this.actionData.configurationAsJson["grantType"] ==
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
        this.actionData.configurationAsJson["grantType"] == "refresh_token"
      ) {
        this.isAuthorization = false;
        this.isClient = true;
        this.isResponse = true;
        this.isPassword = false;
        this.isVerifier = false;
        this.isScopeField = true;
        this.isRefreshToken = true;
      }

      if(this.actionData.configurationAsJson["methodType"] == "GET" && this.actionData["actionType"] == "APIRequest"){
        this.isReqDisable = true;
       }else{
         this.isReqDisable = false;
       }

      this.connectorForm.get("actionName").setValue(this.actionData["name"]);
      this.connectorForm.get("endPoint").setValue(this.actionData.configurationAsJson["endPoint"]);
      this.connectorForm.get("actionType").setValue(this.actionData["actionType"]);
      this.connectorForm.get("methodType").setValue(this.actionData.configurationAsJson["methodType"]);
      this.connectorForm.get("icon").setValue(this.actionData["actionLogo"]);
      this.connectorForm.get("authType").setValue(this.actionData.configurationAsJson["type"]);
      this.connectorForm.get("grantType").setValue(this.actionData.configurationAsJson["grantType"]);
      this.connectorForm.get("code").setValue(this.actionData.configurationAsJson["code"]);
      this.connectorForm.get("redirect_uri").setValue(this.actionData.configurationAsJson["redirect_uri"]);
      this.connectorForm.get("userName").setValue(this.actionData.configurationAsJson["userName"]);
      this.connectorForm.get("password").setValue(this.actionData.configurationAsJson["password"]);
      this.connectorForm.get("clientId").setValue(this.actionData.configurationAsJson["clientId"]);
      this.connectorForm.get("clientSecret").setValue(this.actionData.configurationAsJson["clientSecret"]);
      this.connectorForm.get("verifier").setValue(this.actionData.configurationAsJson["verifier"]);
      this.connectorForm.get("scope").setValue(this.actionData.configurationAsJson["scope"]);
      this.connectorForm.get("refreshToken").setValue(this.actionData.configurationAsJson["refreshToken"]);
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
      if (this.actionData["actionType"] == "APIRequest"){
        this.connectorForm.get("request").setValue(this.actionData.configurationAsJson["requestPayload"]);
      }
      this.connectorForm.get("response").setValue(this.actionData["response"]);
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
        id: this.action_id,
        name: this.connectorForm.value.actionName,
        audit: null,
        actionType: this.connectorForm.value.actionType,
        configuredConnectionId: this.selectedId,
        // "description": "login for zoho", //we dont have description in UI
         actionLogo: this.action_logo == undefined ? this.actionData["actionLogo"] : new String(this.action_logo.split(",")[1]),
        // "endPoint": this.connectorForm.value.endPoint
      };

      let object = {
        endPoint: this.connectorForm.value.endPoint,
        grantType: this.connectorForm.value.grantType,
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
      } else if (this.connectorForm.value.grantType == "client_credentials") {
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
      } else if (this.connectorForm.value.grantType == "refresh_token") {
        object["clientId"] = this.connectorForm.value.clientId;
        object["clientSecret"] = this.connectorForm.value.clientSecret;
        object["scope"] = this.connectorForm.value.scope;
        object["refreshToken"]=this.connectorForm.value.refreshToken
      }
      req_body["configuration"] = JSON.stringify(object);
    } else {
      req_body = {
        id: this.action_id,
        name: this.connectorForm.value.actionName,
        actionLogo: this.action_logo==undefined?"":new String(this.action_logo.split(",")[1]),
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
        "type":"API",
        "requestPayload":this.connectorForm.get("request").value.replace(/\s/g, "")
      };
      req_body["configuration"] = JSON.stringify(object);
    }
    this.rest_api.updateAction(this.action_id, req_body).subscribe((res: any) => {
        this.spinner.hide();
        if (res.message === "Successfully updated configured action") {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Action Updated Successfully !!",
          })            
            setTimeout(()=>{
              this.router.navigate(["/pages/rpautomation/action-item"], {
                queryParams: {
                  id: this.selectedId,
                  name: this.selectedConnector,
                },
            });
            },3500)
        
        } else {
          this.spinner.hide();
          (err) => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Something Went Wrong !!",
            })
          };
        }
      });
  }
}