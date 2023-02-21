import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
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
  actionItems: any = ["Authenticated", "API Request"];
  authItems: any = [
    "No Auth",
    "API Key",
    "Bearer Token",
    "Basic Auth",
    "Digest Auth",
    "O AUth 1.0",
    "O Auth 2.0",
  ];
  grantItems: any = [
    "Authorization Code",
    "Implicit",
    "Client Credentials",
    "Password Credentials",
  ];
  isAuthenticated: boolean = false;
  isAction: boolean = false;
  isAuthorization: boolean = false;
  isClient: boolean = false;
  isPassword: boolean = false;
  isRequest: boolean = false;
  isResponse: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private rest_api: RestApiService
  ) {
    this.createItem();
  }

  ngOnInit(): void {
    this.connectorForm = this.formBuilder.group({
      connectionName: ["", Validators.compose([Validators.required])],
      httpMethodType: ["", Validators.compose([Validators.required])],
      actionType: ["", Validators.compose([Validators.required])],
      url: ["", Validators.compose([Validators.required])],
      authType: ["", Validators.compose([Validators.required])],
      bodyRaw: ["", Validators.compose([Validators.required])],
      paramsKey: ["", Validators.compose([Validators.required])],
      paramsValue: ["", Validators.compose([Validators.required])],
      encodedKey: ["", Validators.compose([Validators.required])],
      encodedValue: ["", Validators.compose([Validators.required])],
      paramsCheck: ["", Validators.compose([Validators.required])],
      encodedCheck: ["", Validators.compose([Validators.required])],
      encoded: this.formBuilder.array([this.createItem()]),
    });
    this.methodTypes();
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
      this.methodItems = res;
    });
  }

  addHeader() {}

  actionChange(event) {
    if (event == "Authenticated") {
      this.isAction = true;
      this.isRequest = false;
      this.isResponse = false;
    } else if (event == "API Request") {
      this.isRequest = true;
      this.isAction = false;
      this.isResponse = true;
      this.isClient = false;
      this.isPassword = false;
      this.isAuthenticated = false;
    }
  }

  authChange(event) {
    if (event == "O Auth 2.0") {
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
}
