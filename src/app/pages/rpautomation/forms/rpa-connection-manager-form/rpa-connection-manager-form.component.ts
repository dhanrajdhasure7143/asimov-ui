import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
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
  public result ={};
  public reactiveForm:FormGroup;
  validateJSON:boolean=false;
  disabled : boolean;

  constructor(
    private formBuilder: FormBuilder,
    private rest_api: RestApiService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((res:any) => {
       this.disabled = res.isDisabled
    });
  }

  ngOnInit(): void {
    this.connectorForm = this.formBuilder.group({
      actionName: ["", Validators.compose([Validators.required])],
      methodType: ["", Validators.compose([Validators.required])],
      actionType: ["", Validators.compose([Validators.required])],
      url: ["", Validators.compose([Validators.required])],
      authType: ["", Validators.compose([Validators.required])],
      icon: ["", Validators.compose([])],
      attribute: ["", Validators.compose([Validators.required])],
      grantType: ["", Validators.compose([Validators.required])],
      code: ["", Validators.compose([Validators.required])],
      redirect: ["", Validators.compose([Validators.required])],
      username: ["", Validators.compose([Validators.required])],
      password: ["", Validators.compose([Validators.required])],
      clientId: ["", Validators.compose([Validators.required])],
      secret: ["", Validators.compose([Validators.required])],
      verifier: ["", Validators.compose([Validators.required])],
      headerKey: ["", Validators.compose([Validators.required])],
      headerValue: ["", Validators.compose([Validators.required])],
      headerCheck: ["", Validators.compose([Validators.required])],
      request: ["", Validators.compose([])],
      response: ["", Validators.compose([])],
      encoded: this.formBuilder.array([this.createItem()]),
    });

    this.methodTypes();
    this.authTypes();
    this.getActionType();
    this.getGrantTypes();
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
    let connector = this.connectorForm.value;
    this.rest_api.testConnections(connector).subscribe(
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

  addHeader() {}
  isJsonValid(){
    let jsonData=this.connectorForm.get('bodyRaw').value;
      try{
        JSON.parse(jsonData);
        this.validateJSON= false;
      }
      catch(e)
      {
        console.log(e)
        this.validateJSON=true;
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
    if (event == "Authorization Code") {
      this.isAuthorization = true;
      this.isClient = true;
      this.isResponse = true;
      this.isPassword = false;
    } else if (event == "Password Credentials") {
      this.isPassword = true;
      this.isClient = true;
      this.isResponse = true;
      this.isAuthorization = false;
    } else if (event == "Client Credentials") {
      this.isClient = true;
      this.isResponse = true;
      this.isAuthorization = false;
      this.isPassword = false;
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

}
