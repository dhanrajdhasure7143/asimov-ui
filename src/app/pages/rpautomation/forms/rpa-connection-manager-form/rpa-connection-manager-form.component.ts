import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators,} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { RestApiService } from "src/app/pages/services/rest-api.service";
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
  dynamicForm =[];
  action_id:any;
  selectedConnector: any;
  istoolSet: boolean;
  isDisabled: any = {
    AuthenticatedType:false,
    methodType:false,
  };
  actionUpdate: any;
  actionData: any = [];
  action_logo: any;
  isUpdate: boolean = false;
  isHeader : boolean = false;
  isReqDisable : boolean = false;
  isRefresh: boolean = false;
  icon: any;
  paramForm = [];
  selectedParam: any[] = [];
  action_icon : any;
  isIconSize: boolean;
  isaddTo:boolean = false;
  isKeyValue:boolean = false;
  isKeyValueTab:boolean =false;
  requestParams:any =[];
  payload: any = [];
  actionNameCheck:boolean;

  constructor(
    private formBuilder: FormBuilder,
    private rest_api: RestApiService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private spinner: LoaderService
  ) {
    this.route.queryParams.subscribe((data) => {
      //this.isDisabled = data.formDisabled;
      this.selectedId = data.id;
      this.action_id = data.action_Id;
      this.isCreate = data.create;
      this.icon = data.logo
      if(this.isCreate == false){
        this.isDisabled.AuthenticatedType = true;
        this.isDisabled.methodType=true;
      } else {
        this.isDisabled.methodType = false;
        this.isDisabled.AuthenticatedType=false;
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
      actionName: ["", Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z_]+(\\s[a-zA-Z]+)*$"),Validators.maxLength(50)])],
      methodType: ["", Validators.compose([Validators.required])],
      actionType: ["", Validators.compose([Validators.required])],
      endPoint: ["", Validators.compose([Validators.required,Validators.pattern("^[Hh][Tt][Tt][Pp][Ss]?:\\/\\/(?:(?:[a-zA-Z\\u00a1-\\uffff0-9]+-?)*[a-zA-Z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-zA-Z\\u00a1-\\uffff0-9]+-?)*[a-zA-Z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-zA-Z\\u00a1-\\uffff]{2,}))(?::\\d{2,5})?(?:\\/[^\\s]*)|\\[@[a-zA-Z][a-zA-Z\\s]*\\|[a-zA-Z]+\\|[Hh][Tt][Tt][Pp][Ss]?:\\/\\/(?:(?:[a-zA-Z\\u00a1-\\uffff0-9]+-?)*[a-zA-Z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-zA-Z\\u00a1-\\uffff0-9]+-?)*[a-zA-Z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-zA-Z\\u00a1-\\uffff]{2,}))(?::\\d{2,5})?(?:\\/[^\\s]*)?@]")])],
      authType: [""],
      icon: ["", Validators.compose([])],
      grantType: [""],
      code: [""],
      redirect_uri: [""],
      userName: [""],
      password: [""],
      clientId: [""],
      clientSecret: [""],
      verifier: [""],
      request: ["", Validators.compose([])],
      response: ["", Validators.compose([])],
      scope: ["", Validators.compose([])],
      refreshToken: [""],
      addTo:[""],
      requestKey:["",],
      requestValue:[""]
    });

    this.methodTypes();
    this.authTypes();
    this.getActionType();
    this.getGrantTypes();
    this.getHeadersParams();
    if (this.isCreate == "false") {
      this.isUpdate = true;
      this.getActionById();
      this.getIconbyId();
    }
    this.connectorForm.get('endPoint').disable();
  }

  saveAction() {
    this.spinner.show();
    let req_body
    if (this.connectorForm.value.actionType == "Authenticated") {
      req_body =
      {
        "id": "",
        "name": this.connectorForm.value.actionName,
        "audit": null,
        "actionType": this.connectorForm.value.actionType,
        "configuredConnectionId": this.selectedId,
        // "description": "login for zoho", //we dont have description in UI
        "actionLogo": this.action_logo == undefined ? '' : new String(this.action_logo.split(",")[1]),
        // "endPoint": this.connectorForm.value.endPoint
      };
      this.onChangeAddTo(this.connectorForm.value.addTo);
      let object = {
        // endPoint: this.connectorForm.value.endPoint,
        // grantType: this.connectorForm.value.grantType,
        methodType: this.connectorForm.value.methodType,
        type: this.connectorForm.value.authType,
        task_type: "AUTHENTICATION",
        task_subtype: "OAUTH2",
        outputReference: "[@Output Reference|string|@]"
        // "actionType": this.connectorForm.value.actionType,
      };
      if (this.connectorForm.value.authType == "OAUTH2") {
        object["endPoint"] = this.connectorForm.value.endPoint;
        object["grantType"] = this.connectorForm.value.grantType;
      } else if (this.connectorForm.value.authType == "API_KEY") {
        object["addTo"] = this.connectorForm.value.addTo;
        object["httpHeaders"] = this.payload.headers,
        object["queryParams"] = this.payload.queryParams;
      };
      if (this.connectorForm.value.grantType == "AuthorizationCode") {
        object["clientId"] = this.connectorForm.value.clientId;
        object["clientSecret"] = this.connectorForm.value.clientSecret;
        object["code"] = this.connectorForm.value.code;
        object["redirect_uri"] = this.connectorForm.value.redirect_uri;
      } else if (this.connectorForm.value.grantType == "password") {
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
        object["refreshToken"] = this.connectorForm.value.refreshToken
      }
      let dynamic = []
      this.dynamicForm.forEach(ele => {
        dynamic.push({ [ele.dynamicKey]: ele.dynamicValue });
      })
      object["customAttributes"] = dynamic;

      req_body["configuration"] = btoa(JSON.stringify(object));
    } else {
      req_body = {
        "id": "",
        "name": this.connectorForm.value.actionName,
        "actionLogo": this.action_logo == undefined ? '' : new String(this.action_logo.split(",")[1]),
        "actionType": this.connectorForm.value.actionType,
        "configuredConnectionId": this.selectedId,
        "description": "",
      }

      let headers = []
      this.headerForm.forEach(ele => {
        // if(ele.check)
        // obj[ele["encodedKey"]]=ele["encodedValue"];
        // if (ele.check) {
          headers.push({ [ele.encodedKey]: ele.encodedValue });
        // }
      })

      let params = []
      this.paramForm.forEach(ele => {
        // if(ele.check)
        // params[ele["paramKey"]]=ele["paramValue"];
        // if (ele.check) {
          params.push({ [ele.paramKey]: ele.paramValue });
        // }
      })

      let object = {
        "endPoint": this.connectorForm.value.endPoint,
        "methodType": this.connectorForm.value.methodType,
        // "actionType": this.connectorForm.value.actionType,
        // "requestMethod":this.connectorForm.value.methodType,
        "contentType": "application/json",
        "httpHeaders": headers,
        "queryParams": params,
        "type": "API",
        "task_type": "ACTION",
        "task_subtype": "API",
        "inputReference": "[@Input Reference|string|@]",
        "outputReference": "[@Output Reference|string|@]",
        // "requestPayload": this.connectorForm.get("request").value == null ? "" : this.connectorForm.get("request").value.replace(/\s/g, "")
        "requestPayload": this.connectorForm.get("request").value == null ? "" : this.connectorForm.get("request").value.replace(/[^\x20-\x7E\n]/gmi, '')
      }
      req_body["configuration"] = btoa(JSON.stringify(object));
    }
    this.rest_api.saveAction(req_body).subscribe((res:any) => {
      this.spinner.hide();
      if (res.message === "Successfully saved configured action") {
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Action saved successfully!"
        })
          setTimeout(() =>{
            this.router.navigate(["/pages/rpautomation/action-item"], {
              queryParams: {
              id: this.selectedId,
              name: this.selectedConnector,
              icon : this.icon  },
          });
          },1000)
      } else {
        this.spinner.hide();
        // (err:any) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Oops! Something went wrong.",
          });
        // };
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
    } else if (this.connectorForm.value.grantType == "password") {
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
          detail: "Unable to generate the access token!",
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
      this.authItems = Object.keys(res).map(key => ({
        type: key,
        value: res[key]
      })).filter(item => !['BASIC', 'NONE', 'OAUTH'].includes(item.type));
    });
    return this.authItems;
  }

  // authTypes() {
  //   this.rest_api.getAuthTypes().subscribe((res: any) => {
  //     let filterData = res;
  //     this.authItems = Object.keys(filterData).map((key) => ({
  //       type: key,
  //       value: filterData[key],
  //     }));
  //     return this.authItems;
  //   });
  // }

  // isJsonValid() {
  //   let jsonData = this.connectorForm.get("response").value;
  //   try {
  //     JSON.parse(jsonData);
  //     this.validateJSON = false;
  //   } catch (e) {
  //     this.validateJSON = true;
  //   }
  // }

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
    const exclude: string[] = ['actionName', 'actionType'];
      Object.keys(this.connectorForm.controls).forEach(key => {
        if (exclude.findIndex(q => q === key) === -1) {
            this.connectorForm.get(key).reset();
            if(key !='methodType'&& key !='endPoint')
            this.connectorForm.get(key).clearValidators();
            this.connectorForm.get(key).updateValueAndValidity();
        }
      });

    if (event == "Authenticated") {
      this.isAction = true;
      this.isRequest = false;
      this.isHeader = false
      this.isResponse = false;
      this.connectorForm.get('methodType').setValue("POST");
      this.connectorForm.get('endPoint').disable();
      this.isDisabled.methodType=true;
      const setValidators: string[] = ['authType', 'grantType'];
      Object.keys(this.connectorForm.controls).forEach(key => {
        if (setValidators.findIndex(q => q === key) != -1) {
            this.connectorForm.get(key).setValidators([Validators.required]);
            this.connectorForm.get(key).updateValueAndValidity();
        }
      });
    }
    else if (event == "APIRequest") {
      this.connectorForm.get('methodType').setValue("");
      this.connectorForm.get('endPoint').enable();
      this.isDisabled.methodType=false;
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
      this.isVerifier = false;
      this.isKeyValueTab = false;
      this.isKeyValue = false;
      this.isaddTo = false;
      const setValidators: string[] = ['endPoint'];
      Object.keys(this.connectorForm.controls).forEach(key => {
        if (setValidators.findIndex(q => q === key) != -1) {
          this.connectorForm.get('endPoint').setValidators([Validators.required,Validators.pattern("^[Hh][Tt][Tt][Pp][Ss]?:\\/\\/(?:(?:[a-zA-Z\\u00a1-\\uffff0-9]+-?)*[a-zA-Z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-zA-Z\\u00a1-\\uffff0-9]+-?)*[a-zA-Z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-zA-Z\\u00a1-\\uffff]{2,}))(?::\\d{2,5})?(?:\\/[^\\s]*)|\\[@[a-zA-Z][a-zA-Z\\s]*\\|[a-zA-Z]+\\|[Hh][Tt][Tt][Pp][Ss]?:\\/\\/(?:(?:[a-zA-Z\\u00a1-\\uffff0-9]+-?)*[a-zA-Z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-zA-Z\\u00a1-\\uffff0-9]+-?)*[a-zA-Z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-zA-Z\\u00a1-\\uffff]{2,}))(?::\\d{2,5})?(?:\\/[^\\s]*)?@]")]);
          this.connectorForm.get('endPoint').updateValueAndValidity();
        }
      });
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

      this.isAuthorization = false;
      this.isClient = false;
      this.isResponse = false;
      this.isPassword = false;
      this.isVerifier = false;
      this.isScopeField = false;
      this.isRefreshToken = false;
      this.isaddTo = false;
      this.isKeyValue = false;
      this.isKeyValueTab = false;
      this.connectorForm.get('endPoint').enable();
      const setValidators: string[] = ['endPoint', 'grantType'];
      const exclude: string[] = ['actionName', 'actionType','methodType',"authType"];
      Object.keys(this.connectorForm.controls).forEach(key => {
        if (exclude.findIndex(q => q === key) === -1) {
            this.connectorForm.get(key).reset();
            // this.connectorForm.get(key).clearValidators();
            // this.connectorForm.get(key).updateValueAndValidity();
        }
        if (setValidators.findIndex(q => q === key) != -1) {
          // this.connectorForm.get(key).reset();
          if(key == 'endPoint')
            this.connectorForm.get('endPoint').setValidators([Validators.required,Validators.pattern("^[Hh][Tt][Tt][Pp][Ss]?:\\/\\/(?:(?:[a-zA-Z\\u00a1-\\uffff0-9]+-?)*[a-zA-Z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-zA-Z\\u00a1-\\uffff0-9]+-?)*[a-zA-Z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-zA-Z\\u00a1-\\uffff]{2,}))(?::\\d{2,5})?(?:\\/[^\\s]*)|\\[@[a-zA-Z][a-zA-Z\\s]*\\|[a-zA-Z]+\\|[Hh][Tt][Tt][Pp][Ss]?:\\/\\/(?:(?:[a-zA-Z\\u00a1-\\uffff0-9]+-?)*[a-zA-Z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-zA-Z\\u00a1-\\uffff0-9]+-?)*[a-zA-Z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-zA-Z\\u00a1-\\uffff]{2,}))(?::\\d{2,5})?(?:\\/[^\\s]*)?@]")]);
            this.connectorForm.get('endPoint').updateValueAndValidity();
          if(key == 'grantType')
            this.connectorForm.get('grantType').setValidators([Validators.required]);
            this.connectorForm.get('grantType').updateValueAndValidity();
      }
      });
    } else if(event == "API_KEY"){
      this.isaddTo = true;
      this.isKeyValue = true;
      this.isKeyValueTab = true;
    
      this.isAuthenticated = false;
      this.isAuthorization = false;
      this.isClient = false;
      this.isResponse = false;
      this.isPassword = false;
      this.isVerifier = false;
      this.isScopeField = false;
      this.isRefreshToken = false;
      this.connectorForm.get('endPoint').disable();
      const setValidators: string[] = ['requestKey', 'requestValue', 'addTo'];
      const exclude: string[] = ['actionName', 'actionType','methodType',"authType"];
      Object.keys(this.connectorForm.controls).forEach(key => {
        if (exclude.findIndex(q => q === key) === -1) {
            this.connectorForm.get(key).reset();
            this.connectorForm.get(key).clearValidators();
            this.connectorForm.get(key).updateValueAndValidity();
        }
        if (setValidators.findIndex(q => q === key) != -1) {
          // this.connectorForm.get(key).reset();
          if(key == 'requestKey')
            this.connectorForm.get(key).setValidators([Validators.required,Validators.pattern("^(?:([a-zA-Z0-9%~\\._\\-=\\/]+)|\\[@[a-zA-Z][a-zA-Z\\s]*\\|[a-zA-Z]+\\|([a-zA-Z0-9%~,\\._\\-=\\/]+)@\\])$")]);
            this.connectorForm.get(key).updateValueAndValidity();
          if(key == 'requestValue')
            this.connectorForm.get(key).setValidators([Validators.required,Validators.pattern("^(?:([a-zA-Z0-9!@#$%^&*()-=_+{}~`;:',.<>/?\\s]+)|\\[@[a-zA-Z][a-zA-Z\\s]*\\|[a-zA-Z]+\\|([a-zA-Z0-9!@#$%^&*()-=_+{}~`;:',.<>/?\\s]+)@\\])$")]);
            this.connectorForm.get(key).updateValueAndValidity();
          if(key == 'addTo')
            this.connectorForm.get(key).setValidators([Validators.required]);
            this.connectorForm.get(key).updateValueAndValidity();
      }
      });
    }
  }

  grantChange(event) {
    const setValidators: string[] = ['clientId', 'clientSecret'];
    const exclude: string[] = ['actionName', 'actionType','methodType','endPoint',"authType","grantType"]
    Object.keys(this.connectorForm.controls).forEach(key => {
      if (exclude.findIndex(q => q === key) === -1) {
        this.connectorForm.get(key).reset();
        this.connectorForm.get(key).clearValidators();
        this.connectorForm.get(key).updateValueAndValidity();
      }
      if (setValidators.findIndex(q => q === key) != -1) {
        // this.connectorForm.get(key).reset();
        if(key =='clientId')
          this.connectorForm.get(key).setValidators([Validators.required,Validators.pattern("^(?:([a-zA-Z0-9%~\\._\\-=\\/]+)|\\[@[a-zA-Z][a-zA-Z\\s]*\\|[a-zA-Z]+\\|([a-zA-Z0-9%~,\\._\\-=\\/]+)@\\])$")]);
          this.connectorForm.get(key).updateValueAndValidity();
        if(key =='clientSecret')
          this.connectorForm.get(key).setValidators([Validators.required,Validators.pattern("^(?:([a-zA-Z0-9%~\\._\\-=\\/]+)|\\[@[a-zA-Z][a-zA-Z\\s]*\\|[a-zA-Z]+\\|([a-zA-Z0-9%~,\\._\\-=\\/]+)@\\])$")]);
          this.connectorForm.get(key).updateValueAndValidity();
    }
     
    });
      // this.connectorForm.get('clientId').setValidators([Validators.required]);
      // this.connectorForm.get('clientId').updateValueAndValidity();
      // this.connectorForm.get('clientSecret').setValidators([Validators.required]);
      // this.connectorForm.get('clientSecret').updateValueAndValidity();
    if (event == "AuthorizationCode") {
      this.isAuthorization = true;
      this.isClient = true;
      this.isResponse = true;
      this.isPassword = false;
      this.isVerifier = false;
      this.isScopeField = false;
      this.isRefreshToken = false;

      const setValidators: string[] = ['code', 'redirect_uri'];
      Object.keys(this.connectorForm.controls).forEach(key => {
        if (setValidators.findIndex(q => q === key) != -1) {
          if(key == 'code')
            this.connectorForm.get(key).setValidators([Validators.required,Validators.pattern("^(?:([a-zA-Z0-9%~\\._\\-=\\/]+)|\\[@[a-zA-Z][a-zA-Z\\s]*\\|[a-zA-Z]+\\|([a-zA-Z0-9%~,\\._\\-=\\/]+)@\\])$")]);
            this.connectorForm.get(key).updateValueAndValidity();
          if(key == 'redirect_uri')
          this.connectorForm.get(key).setValidators([Validators.required,Validators.pattern("^[Hh][Tt][Tt][Pp][Ss]?:\\/\\/(?:(?:[a-zA-Z\\u00a1-\\uffff0-9]+-?)*[a-zA-Z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-zA-Z\\u00a1-\\uffff0-9]+-?)*[a-zA-Z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-zA-Z\\u00a1-\\uffff]{2,}))(?::\\d{2,5})?(?:\\/[^\\s]*)|\\[@[a-zA-Z][a-zA-Z\\s]*\\|[a-zA-Z]+\\|[Hh][Tt][Tt][Pp][Ss]?:\\/\\/(?:(?:[a-zA-Z\\u00a1-\\uffff0-9]+-?)*[a-zA-Z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-zA-Z\\u00a1-\\uffff0-9]+-?)*[a-zA-Z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-zA-Z\\u00a1-\\uffff]{2,}))(?::\\d{2,5})?(?:\\/[^\\s]*)?@]")]);
          this.connectorForm.get(key).updateValueAndValidity();
        }
      });

    } else if (event == "password") {
      this.isPassword = true;
      this.isClient = true;
      this.isResponse = true;
      this.isAuthorization = false;
      this.isVerifier = false;
      this.isScopeField = false;
      this.isRefreshToken = false;
      this.isRefresh = true;
      const setValidators: string[] = ['userName', 'password','clientId','clientSecret'];
      Object.keys(this.connectorForm.controls).forEach(key => {
        if (setValidators.findIndex(q => q === key) != -1) {
          if(key == 'userName')
            this.connectorForm.get(key).setValidators([Validators.required,Validators.pattern("^(?:([a-zA-Z0-9@._]+)|\\[@[a-zA-Z][a-zA-Z\\s]*\\|[a-zA-Z]+\\|([a-zA-Z0-9@._]+)@\\])$")]);
            this.connectorForm.get(key).updateValueAndValidity();
          if(key == 'password')
            this.connectorForm.get(key).setValidators([Validators.required,Validators.pattern("^(?:([a-zA-Z0-9%~\\@\\$\\#&\\/\\^*]+)|\\[@[a-zA-Z][a-zA-Z\\s]*\\|[a-zA-Z]+\\|([a-zA-Z0-9%~\\@\\$\\#&\\/\\^*]+)@\\])$")]);
            this.connectorForm.get(key).updateValueAndValidity();
          if(key =='clientId')
            this.connectorForm.get(key).setValidators([]);
            this.connectorForm.get(key).updateValueAndValidity();
          if(key =='clientSecret')
            this.connectorForm.get(key).setValidators([]);
            this.connectorForm.get(key).updateValueAndValidity();
        }
      });
      
    } else if (event == "client_credentials") {
      this.isClient = true;
      this.isResponse = true;
      this.isAuthorization = false;
      this.isPassword = false;
      this.isVerifier = false;
      this.isScopeField = true;
      this.isRefreshToken = false;
      this.isRefresh = true;
    } else if (event == "AuthorizationCodeWithPKCE") {
      this.isAuthorization = true;
      this.isClient = true;
      this.isResponse = true;
      this.isPassword = false;
      this.isVerifier = true;
      this.isScopeField = false;
      this.isRefreshToken = false;
      this.isRefresh = true;
      const setValidators: string[] = ['code', 'redirect_uri','verifier'];
      Object.keys(this.connectorForm.controls).forEach(key => {
        if (setValidators.findIndex(q => q === key) != -1) {
          if(key == 'code')
            this.connectorForm.get(key).setValidators([Validators.required,Validators.pattern("^(?:([a-zA-Z0-9%~\\._\\-=\\/]+)|\\[@[a-zA-Z][a-zA-Z\\s]*\\|[a-zA-Z]+\\|([a-zA-Z0-9%~,\\._\\-=\\/]+)@\\])$")]);
            this.connectorForm.get(key).updateValueAndValidity();
          if(key == 'redirect_uri')
            this.connectorForm.get(key).setValidators([Validators.required,Validators.pattern("^[Hh][Tt][Tt][Pp][Ss]?:\\/\\/(?:(?:[a-zA-Z\\u00a1-\\uffff0-9]+-?)*[a-zA-Z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-zA-Z\\u00a1-\\uffff0-9]+-?)*[a-zA-Z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-zA-Z\\u00a1-\\uffff]{2,}))(?::\\d{2,5})?(?:\\/[^\\s]*)|\\[@[a-zA-Z][a-zA-Z\\s]*\\|[a-zA-Z]+\\|[Hh][Tt][Tt][Pp][Ss]?:\\/\\/(?:(?:[a-zA-Z\\u00a1-\\uffff0-9]+-?)*[a-zA-Z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-zA-Z\\u00a1-\\uffff0-9]+-?)*[a-zA-Z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-zA-Z\\u00a1-\\uffff]{2,}))(?::\\d{2,5})?(?:\\/[^\\s]*)?@]")]);
            this.connectorForm.get(key).updateValueAndValidity();
          if(key == 'verifier')
            this.connectorForm.get(key).setValidators([Validators.required,Validators.pattern("^(?:([a-zA-Z0-9%~\\._\\-=\\/]+)|\\[@[a-zA-Z][a-zA-Z\\s]*\\|[a-zA-Z]+\\|([a-zA-Z0-9%~,\\._\\-=\\/]+)@\\])$")]);
            this.connectorForm.get(key).updateValueAndValidity();
        }
      });
      
    } else if (event == "refresh_token") {
      this.isAuthorization = false;
      this.isClient = true;
      this.isResponse = true;
      this.isPassword = false;
      this.isVerifier = false;
      this.isScopeField = true;
      this.isRefreshToken = true;
      this.isRefresh = true;
      this.connectorForm.get('refreshToken').setValidators([Validators.required,Validators.pattern("^(?:([a-zA-Z0-9%~\\._\\-=\\/]+)|\\[@[a-zA-Z][a-zA-Z\\s]*\\|[a-zA-Z]+\\|([a-zA-Z0-9%~,\\._\\-=\\/]+)@\\])$")]);
      this.connectorForm.get('refreshToken').updateValueAndValidity();
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

  // getGrantTypes() {
  //   this.rest_api.getGrantTypes().subscribe((res: any) => {
  //     let filterData = res;
  //     this.grantItems = Object.keys(filterData).map((key) => ({
  //       type: key,
  //       value: filterData[key],
  //     }));
  //     return this.grantItems;
  //   });
  // }
  getGrantTypes() {
    this.rest_api.getGrantTypes().subscribe((res: any) => {
      this.grantItems = Object.keys(res).map(key => ({
        type: key,
        value: res[key]
      })).filter(item => !['implicit', 'AuthorizationCodeWithPKCE'].includes(item.type));
    });
    return this.authItems;
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
    // for(const each of this.headerForm){
    //   if(each.encodedKey.length > 0 || each.encodedValue.length > 0){
    //     each.check = true;
    //   } else {
    //     each.check = false;
    //   }
    // }
  }

  addDynamic() {
    this.dynamicForm.push({
      index: this.dynamicForm.length,
      dynamicKey: "",
      dynamicValue: "",
    });
  }

  backToaction() {
    this.router.navigate(["/pages/rpautomation/action-item"], {
      queryParams: { id: this.selectedId, name: this.selectedConnector, icon : this.icon },
    });
  }

  getActionById() {
    this.spinner.show();
    this.rest_api.getActionById(this.action_id).subscribe((res) => {
      this.actionData = res["data"];
      this.isDisabled.AuthenticatedType = true;
      this.isDisabled.methodType=true;     
      if (this.actionData["actionType"] == "APIRequest") {
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
        this.connectorForm.get('endPoint').enable();
      }

      if (this.actionData["actionType"] == "Authenticated") {
        //this.isDisabled = true;
        this.isAction = true;
        this.isRequest = false;
        this.isHeader = false;
        this.isResponse = false;
        const setValidators: string[] = ['clientId','clientSecret'];
        Object.keys(this.connectorForm.controls).forEach(key => {
          if (setValidators.findIndex(q => q === key) != -1) {
            if(key =='clientId')
              this.connectorForm.get(key).setValidators([Validators.required,Validators.pattern("^(?:([a-zA-Z0-9%~\\._\\-=\\/]+)|\\[@[a-zA-Z][a-zA-Z\\s]*\\|[a-zA-Z]+\\|([a-zA-Z0-9%~,\\._\\-=\\/]+)@\\])$")]);
              this.connectorForm.get(key).updateValueAndValidity();
            if(key =='clientSecret')
              this.connectorForm.get(key).setValidators([Validators.required,Validators.pattern("^(?:([a-zA-Z0-9%~\\._\\-=\\/]+)|\\[@[a-zA-Z][a-zA-Z\\s]*\\|[a-zA-Z]+\\|([a-zA-Z0-9%~,\\._\\-=\\/]+)@\\])$")]);
              this.connectorForm.get(key).updateValueAndValidity();
          }
        });
      }

      if (this.actionData.configurationAsJson["type"] == "OAUTH2") {
        this.isAuthenticated = true;
        this.connectorForm.get('endPoint').enable();
        const setValidators: string[] = ['grantType'];
        Object.keys(this.connectorForm.controls).forEach(key => {
          if (setValidators.findIndex(q => q === key) != -1) {
              this.connectorForm.get(key).setValidators([Validators.required]);
              this.connectorForm.get(key).updateValueAndValidity();
          }
        });
      }else if(this.actionData.configurationAsJson["type"] == "API_KEY"){
          this.isaddTo = true;
          this.isKeyValue = true;
          this.isKeyValueTab =true;
          this.connectorForm.get('endPoint').disable();
          const setValidators: string[] = ['requestKey', 'requestValue', 'addTo'];
          const exclude: string[] = ['actionName', 'actionType','methodType',"authType"];
          Object.keys(this.connectorForm.controls).forEach(key => {
            if (exclude.findIndex(q => q === key) === -1) {
                this.connectorForm.get(key).reset();
                this.connectorForm.get(key).clearValidators();
                this.connectorForm.get(key).updateValueAndValidity();
            }
            if (setValidators.findIndex(q => q === key) != -1) {
              // this.connectorForm.get(key).reset();
              if(key == 'requestKey')
                this.connectorForm.get(key).setValidators([Validators.required,Validators.pattern("^(?:([a-zA-Z0-9%~\\._\\-=\\/]+)|\\[@[a-zA-Z][a-zA-Z\\s]*\\|[a-zA-Z]+\\|([a-zA-Z0-9%~,\\._\\-=\\/]+)@\\])$")]);
                this.connectorForm.get(key).updateValueAndValidity();
              if(key == 'requestValue')
                this.connectorForm.get(key).setValidators([Validators.required,Validators.pattern("^(?:([a-zA-Z0-9!@#$%^&*()-=_+{}~`;:',.<>/?\\s]+)|\\[@[a-zA-Z][a-zA-Z\\s]*\\|[a-zA-Z]+\\|([a-zA-Z0-9!@#$%^&*()-=_+{}~`;:',.<>/?\\s]+)@\\])$")]);
                this.connectorForm.get(key).updateValueAndValidity();
          }
      });
      }else {
        this.isAuthenticated = false;
        this.isAuthorization = false;
        this.isClient = false;
        this.isResponse = false;
        this.isPassword = false;
        this.isVerifier = false;
        this.isScopeField = false;
        this.isRefreshToken = false;
        this.isaddTo = false;
        this.isKeyValue = false;
        this.isKeyValueTab = false;
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
        const setValidators: string[] = ['code','redirect_uri'];
        Object.keys(this.connectorForm.controls).forEach(key => {
          if (setValidators.findIndex(q => q === key) != -1) {
            if(key == 'code')
              this.connectorForm.get(key).setValidators([Validators.required,Validators.pattern("^(?:([a-zA-Z0-9%~\\._\\-=\\/]+)|\\[@[a-zA-Z][a-zA-Z\\s]*\\|[a-zA-Z]+\\|([a-zA-Z0-9%~,\\._\\-=\\/]+)@\\])$")]);
              this.connectorForm.get(key).updateValueAndValidity();
            if(key == 'redirect_uri')
              this.connectorForm.get(key).setValidators([Validators.required,Validators.pattern("^[Hh][Tt][Tt][Pp][Ss]?:\\/\\/(?:(?:[a-zA-Z\\u00a1-\\uffff0-9]+-?)*[a-zA-Z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-zA-Z\\u00a1-\\uffff0-9]+-?)*[a-zA-Z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-zA-Z\\u00a1-\\uffff]{2,}))(?::\\d{2,5})?(?:\\/[^\\s]*)|\\[@[a-zA-Z][a-zA-Z\\s]*\\|[a-zA-Z]+\\|[Hh][Tt][Tt][Pp][Ss]?:\\/\\/(?:(?:[a-zA-Z\\u00a1-\\uffff0-9]+-?)*[a-zA-Z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-zA-Z\\u00a1-\\uffff0-9]+-?)*[a-zA-Z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-zA-Z\\u00a1-\\uffff]{2,}))(?::\\d{2,5})?(?:\\/[^\\s]*)?@]")]);
              this.connectorForm.get(key).updateValueAndValidity();
          }
        });
      } else if (
        this.actionData.configurationAsJson["grantType"] == "password"
      ) {
        this.isPassword = true;
        this.isClient = true;
        this.isResponse = true;
        this.isAuthorization = false;
        this.isVerifier = false;
        this.isScopeField = false;
        this.isRefreshToken = false;
        const setValidators: string[] = ['userName','password', 'clientId', 'clientSecret'];
        Object.keys(this.connectorForm.controls).forEach(key => {
          if (setValidators.findIndex(q => q === key) != -1) {
            if(key == 'userName')
              this.connectorForm.get(key).setValidators([Validators.required,Validators.pattern("^(?:([a-zA-Z0-9@._]+)|\\[@[a-zA-Z][a-zA-Z\\s]*\\|[a-zA-Z]+\\|([a-zA-Z0-9@._]+)@\\])$")]);
              this.connectorForm.get(key).updateValueAndValidity();
            if(key == 'password')
              this.connectorForm.get(key).setValidators([Validators.required,Validators.pattern("^(?:([a-zA-Z0-9%~\\@\\$\\#&\\/\\^*]+)|\\[@[a-zA-Z][a-zA-Z\\s]*\\|[a-zA-Z]+\\|([a-zA-Z0-9%~\\@\\$\\#&\\/\\^*]+)@\\])$")]);
              this.connectorForm.get(key).updateValueAndValidity();
            if(key =='clientId')
              this.connectorForm.get(key).setValidators([]);
              this.connectorForm.get(key).updateValueAndValidity();
            if(key =='clientSecret')
              this.connectorForm.get(key).setValidators([]);
              this.connectorForm.get(key).updateValueAndValidity();
          }
        });
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
        this.actionData.configurationAsJson["grantType"] == "AuthorizationCodeWithPKCE"
      ) {
        this.isAuthorization = true;
        this.isClient = true;
        this.isResponse = true;
        this.isPassword = false;
        this.isVerifier = true;
        this.isScopeField = false;
        this.isRefreshToken = false;
        const setValidators: string[] = ['code','redirect_uri','verifier'];
        Object.keys(this.connectorForm.controls).forEach(key => {
          if (setValidators.findIndex(q => q === key) != -1) {
            if(key == 'code')
              this.connectorForm.get(key).setValidators([Validators.required,Validators.pattern("^(?:([a-zA-Z0-9%~\\._\\-=\\/]+)|\\[@[a-zA-Z][a-zA-Z\\s]*\\|[a-zA-Z]+\\|([a-zA-Z0-9%~,\\._\\-=\\/]+)@\\])$")]);
              this.connectorForm.get(key).updateValueAndValidity();
            if(key == 'redirect_uri')
              this.connectorForm.get(key).setValidators([Validators.required,Validators.pattern("^[Hh][Tt][Tt][Pp][Ss]?:\\/\\/(?:(?:[a-zA-Z\\u00a1-\\uffff0-9]+-?)*[a-zA-Z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-zA-Z\\u00a1-\\uffff0-9]+-?)*[a-zA-Z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-zA-Z\\u00a1-\\uffff]{2,}))(?::\\d{2,5})?(?:\\/[^\\s]*)|\\[@[a-zA-Z][a-zA-Z\\s]*\\|[a-zA-Z]+\\|[Hh][Tt][Tt][Pp][Ss]?:\\/\\/(?:(?:[a-zA-Z\\u00a1-\\uffff0-9]+-?)*[a-zA-Z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-zA-Z\\u00a1-\\uffff0-9]+-?)*[a-zA-Z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-zA-Z\\u00a1-\\uffff]{2,}))(?::\\d{2,5})?(?:\\/[^\\s]*)?@]")]);
              this.connectorForm.get(key).updateValueAndValidity();
            if(key == 'verifier')
              this.connectorForm.get(key).setValidators([Validators.required,Validators.pattern("^(?:([a-zA-Z0-9%~\\._\\-=\\/]+)|\\[@[a-zA-Z][a-zA-Z\\s]*\\|[a-zA-Z]+\\|([a-zA-Z0-9%~,\\._\\-=\\/]+)@\\])$")]);
              this.connectorForm.get(key).updateValueAndValidity();
          }
        });
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
        this.connectorForm.get('refreshToken').setValidators([Validators.required,Validators.pattern("^(?:([a-zA-Z0-9%~\\._\\-=\\/]+)|\\[@[a-zA-Z][a-zA-Z\\s]*\\|[a-zA-Z]+\\|([a-zA-Z0-9%~,\\._\\-=\\/]+)@\\])$")]);
        this.connectorForm.get('refreshToken').updateValueAndValidity();
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
      this.connectorForm.get("addTo").setValue(this.actionData.configurationAsJson["addTo"]);
      if(this.actionData.configurationAsJson.httpHeaders || this.actionData.configurationAsJson.queryParams){
      if(this.actionData.configurationAsJson.httpHeaders.length>0){
        let data= Object.keys(this.actionData.configurationAsJson["httpHeaders"][0]).map((key) => (
        this.connectorForm.get("requestKey").setValue(key),
        this.connectorForm.get("requestValue").setValue(this.actionData.configurationAsJson["httpHeaders"][0][key])
        ));
      }
      if(this.actionData.configurationAsJson.queryParams.length>0){
        let data= Object.keys(this.actionData.configurationAsJson["queryParams"][0]).map((key) => (
        this.connectorForm.get("requestKey").setValue(key),
        this.connectorForm.get("requestValue").setValue(this.actionData.configurationAsJson["queryParams"][0][key])
        ));
      }
    }
    if(this.actionData.configurationAsJson.customAttributes){
      let custom_attributes = this.actionData.configurationAsJson.customAttributes
      Object.keys(custom_attributes).forEach((key,i) => {
        let DynamicFormKey = Object.keys(custom_attributes[i])[0];
        let DynamicFormValue = custom_attributes[i][DynamicFormKey];
        this.dynamicForm.push({
          index: i,
          dynamicKey: DynamicFormKey,
          dynamicValue: DynamicFormValue,
        })
    });
      this.selectedOne = this.dynamicForm;
    }

      if(this.actionData.configurationAsJson.httpHeaders){
        let headers_data = this.actionData.configurationAsJson.httpHeaders
        Object.keys(headers_data).forEach((key,i) => {
          let headerKey = Object.keys(headers_data[i])[0];
          let headervalue = headers_data[i][headerKey];
          this.headerForm.push({
            index: i,
            encodedKey: headerKey,
            encodedValue: headervalue,
            // check:true
          })
      });
        this.selectedOne = this.headerForm;
      }
      if (this.actionData.configurationAsJson.queryParams) {
        let params_data = this.actionData.configurationAsJson.queryParams;
        Object.keys(params_data).forEach((key, i) => {
          let paramKey = Object.keys(params_data[i])[0];
          let paramValue = params_data[i][paramKey];
          this.paramForm.push({
            index: i,
            paramKey: paramKey,
            paramValue: paramValue,
            // check: true
          });
        });
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
    if(e.target.files[0].size > 200000){
      this.isIconSize =true;
       }else{
      this.isIconSize=false;
    }
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
      this.onChangeAddTo(this.connectorForm.value.addTo);

      let object = {
        // endPoint: this.connectorForm.value.endPoint,
        // grantType: this.connectorForm.value.grantType,
        methodType: this.connectorForm.value.methodType,
        type: this.connectorForm.value.authType,
        task_type:"AUTHENTICATION",
        task_subtype:"OAUTH2",
        outputReference: "[@Output Reference|string|@]",
        // "actionType": this.connectorForm.value.actionType,
      };
      if(this.connectorForm.value.authType == "OAUTH2"){
        object["endPoint"] = this.connectorForm.value.endPoint;
        object["grantType"] = this.connectorForm.value.grantType;
      }else if(this.connectorForm.value.authType == "API_KEY"){
        object["addTo"] = this.connectorForm.value.addTo;
        object["httpHeaders"] = this.payload.headers,
        object["queryParams"] = this.payload.queryParams;
      }
      if (this.connectorForm.value.grantType == "AuthorizationCode") {
        object["clientId"] = this.connectorForm.value.clientId;
        object["clientSecret"] = this.connectorForm.value.clientSecret;
        object["code"] = this.connectorForm.value.code;
        object["redirect_uri"] = this.connectorForm.value.redirect_uri;
      } else if (this.connectorForm.value.grantType == "password") {
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

      let dynamic = []
      this.dynamicForm.forEach(ele => {
        dynamic.push({ [ele.dynamicKey]: ele.dynamicValue });
      })
      object["customAttributes"] = dynamic;
      
      req_body["configuration"] = btoa(JSON.stringify(object));
    } else {
      req_body = {
        id: this.action_id,
        name: this.connectorForm.value.actionName,
        actionLogo: this.action_logo==undefined ? this.actionData["actionLogo"] :new String(this.action_logo.split(",")[1]),
        actionType: this.connectorForm.value.actionType,
        configuredConnectionId: this.selectedId,
        description: "",
      };
      this.requestJson_body.push(this.connectorForm.get("request").value);
      let headers=[]
      this.headerForm.forEach(ele=>{
        // if (ele.check) {
          headers.push({ [ele.encodedKey]: ele.encodedValue });
        // }
      })
        
        let params=[]
        this.paramForm.forEach(ele=>{
          // if (ele.check) {
            params.push({ [ele.paramKey]: ele.paramValue });
          // }
        })

      let object = {
        endPoint: this.connectorForm.value.endPoint,
        methodType: this.connectorForm.value.methodType,
        // "actionType": this.connectorForm.value.actionType,
        // "requestMethod":this.connectorForm.value.methodType,
        contentType: "application/json",
        httpHeaders: headers,
        queryParams: params,
        "type":"API",
        "task_type":"ACTION",
        "task_subtype":"API",
        "inputReference": "[@Input Reference|string|@]",
        "outputReference": "[@Output Reference|string|@]",
        // "requestPayload":this.connectorForm.get("request").value.replace(/\s/g, "")
        "requestPayload":this.connectorForm.get("request").value.replace(/[^\x20-\x7E\n]/gmi, '')
      };
      req_body["configuration"] = btoa(JSON.stringify(object));
    }
    this.rest_api.updateAction(this.action_id, req_body).subscribe((res: any) => {
        this.spinner.hide();
        if (res.message === "Successfully updated configured action") {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Action updated successfully!",
          })            
            setTimeout(()=>{
              this.router.navigate(["/pages/rpautomation/action-item"], {
                queryParams: {
                  id: this.selectedId,
                  name: this.selectedConnector,
                  icon : this.icon
                },
            });
            },1000)
        
        } else {
          this.spinner.hide();
          // (err) => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Oops! Something went wrong.",
            })
          // };
        }
      });
  }

  addParams(){
    this.paramForm.push({
      index: this.paramForm.length,
      paramKey: "",
      paramValue: "",
      // check:false,
    });
  }

  paramsDelete(index) {
    this.paramForm.splice(index, 1);
    this.onKeyEntered();
  }

  getIconbyId(){
    this.rest_api.getIcon(this.action_id).subscribe((res) => {
      this.action_icon = res["data"]
    })

  }

  onKeyEntered(){
    let queryParams="?";
    // let paramsValue = this.connectorForm.get("endPoint").value.split("?")[1]?this.connectorForm.get("endPoint").value.split("?")[1]:"?"
    // let queryParams=paramsValue;
    // console.log(paramsValue)
    for(const each of this.paramForm){
      // if(each.check==true) {queryParams  = queryParams + each.paramKey + "=" + each.paramValue + "&"}
      queryParams  = queryParams + each.paramKey + "=" + each.paramValue + "&"
      // if(each.paramKey.length > 0 || each.paramValue.length > 0){
      //   each.check = true;
      // } else {
      //   each.check = false;
      // }
    }
    let value = this.connectorForm.get("endPoint").value.includes('?')?this.connectorForm.get("endPoint").value.split("?")[0]:this.connectorForm.get("endPoint").value;
    let regex=new RegExp("^[Hh][Tt][Tt][Pp][Ss]?:\\/\\/(?:(?:[a-zA-Z\\u00a1-\\uffff0-9]+-?)*[a-zA-Z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-zA-Z\\u00a1-\\uffff0-9]+-?)*[a-zA-Z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-zA-Z\\u00a1-\\uffff]{2,}))(?::\\d{2,5})?(?:\\/[^\\s]*)")
    if(regex.test(value)){
    this.connectorForm.get("endPoint").setValue(value+queryParams.slice(0,-1));
  }
    else{
      let splitValue = value.split("@")
      const modifiedStr = splitValue[0]+"@"+splitValue[1]+queryParams.slice(0,-1)+"@]"
      this.connectorForm.get("endPoint").setValue(modifiedStr);
    }
  }

  get checkEndPoint(){
    return ((this.connectorForm.get("endPoint")?.value?.length??0)==0)?true:false; 
  }

  // onChangeParamCheckBox(index:number, event){
  //   this.onKeyEntered();
  //   this.paramForm[index].check=event.currentTarget.checked;
  // }

  // onHeaders(index){
  //     if(this.headerForm[index].encodedKey.length > 0 || this.headerForm[index].encodedValue.length > 0){
  //       this.headerForm[index].check = true;
  //     } else {
  //       this.headerForm[index].check = false;
  //     }
  // }
  getHeadersParams() {
    this.rest_api.getHeadersParams().subscribe((res: any) => {
      let filterData = res;
      this.requestParams = Object.keys(filterData).map((key) => ({
        type: key,
        value: filterData[key],
      }));
      return this.requestParams;
    });
  }

  onChangeAddTo(value){
    if (value === 'HEADERS') {
      this.payload.headers = []
      let obj ={}
       obj[this.connectorForm.value.requestKey] = this.connectorForm.value.requestValue;
      this.payload.headers.push(obj)
      this.payload.queryParams = [];
    } else if (value === 'QUERY_PARAMS') {
      this.payload.queryParams = []
      let obj ={}
      obj[this.connectorForm.value.requestKey] = this.connectorForm.value.requestValue;
      this.payload.queryParams.push(obj)
      this.payload.headers =[];
    }
  }

  backToConnection() {
    this.router.navigate(["/pages/rpautomation/configurations"], {
      queryParams: { index: 2 },
    });
  }

  onEnterEndpoint(){
    let endPointValue = this.connectorForm.value.endPoint
    this.paramForm=[]
    let regex=new RegExp("^[Hh][Tt][Tt][Pp][Ss]?:\\/\\/(?:(?:[a-zA-Z\\u00a1-\\uffff0-9]+-?)*[a-zA-Z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-zA-Z\\u00a1-\\uffff0-9]+-?)*[a-zA-Z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-zA-Z\\u00a1-\\uffff]{2,}))(?::\\d{2,5})?(?:\\/[^\\s]*)")
    if(regex.test(endPointValue)){
      if(endPointValue.includes("?")){
    let splitValue = this.connectorForm.value.endPoint.split("?")[1].split("&")
    splitValue.forEach(item=>{
      let splitItem = item.split("=")  
      let obj={
        index: this.paramForm.length,
        paramKey: item.split("=")[0],
        paramValue: item.split("=")[1],
        check:true,
      };
      this.paramForm.push(obj)
    })
  }
  } else{
  if(endPointValue.includes("?")){
    let splitValue = endPointValue.split("@")[1].split("?")[1].split("&")
    splitValue.forEach(item=>{
      let obj={
        index: this.paramForm.length,
        paramKey: item.split("=")[0],
        paramValue: item.split("=")[1],
        check:true,
      };
      this.paramForm.push(obj)
    })
  }else{
    console.log("testingFalse")
  }
 }
}

checkActionName(){
  let connectorId = this.selectedId;
  let actionName =this.connectorForm.get("actionName").value;
  this.rest_api.checkActionName(connectorId,actionName).subscribe((data) => {
    if(data == false){
      this.actionNameCheck = true;
    }else{
      this.actionNameCheck = false;
    }
  });
}

dynamicDelete(index) {
  this.dynamicForm.splice(index, 1);
}

}