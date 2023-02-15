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
  authorizationType: any = ["O Auth 2.0"];
  encoded: FormArray;
  connectorTable: any = [];
  representatives: any = [];
  columns_list: any = [];
  addflag: boolean = true;
  delete_flag: boolean = false;
  checkBoxShow: boolean = true;

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
      authorization_Type: ["", Validators.compose([Validators.required])],
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
    this.authTypes();
    this.getAlltoolsets();
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

  authTypes() {
    this.rest_api.getAuthTypes().subscribe((res: any) => {
      this.authorizationType = res;
    });
  }

  addHeader() {}

  getAlltoolsets() {
    // this.rest_api.getConnectionslist().subscribe((data: any) => {
      // this.connectorTable = data;
      this.columns_list = [
        {
          ColumnName: "actionType",
          DisplayName: "Action Type",
          ShowGrid: true,
          ShowFilter: true,
          filterWidget: "normal",
          filterType: "text",
          sort: true,
          multi: false,
        },
        {
          ColumnName: "url",
          DisplayName: "URL/Root Domain",
          ShowFilter: true,
          ShowGrid: true,
          filterWidget: "normal",
          filterType: "text",
          sort: true,
          multi: false,
        },
        {
          ColumnName: "httpMethodType",
          DisplayName: "Method Type",
          ShowGrid: true,
          ShowFilter: true,
          filterWidget: "normal",
          filterType: "text",
          sort: true,
          multi: false,
        },
        {
          ColumnName: "authorization_Type",
          DisplayName: "Attributes",
          ShowGrid: true,
          ShowFilter: true,
          filterWidget: "normal",
          filterType: "text",
          sort: true,
          multi: false,
        },
        {
          ColumnName: "createdDate",
          DisplayName: "Purpose",
          ShowGrid: true,
          ShowFilter: true,
          filterWidget: "normal",
          filterType: "date",
          sort: true,
          multi: false,
        }
        // {
        //   ColumnName: "lastModifiedBy",
        //   DisplayName: "Created By",
        //   ShowGrid: true,
        //   ShowFilter: true,
        //   filterWidget: "normal",
        //   filterType: "text",
        //   sort: true,
        //   multi: false,
        // },
        // {
        //   ColumnName: "action",
        //   DisplayName: "Action",
        //   ShowGrid: true,
        //   ShowFilter: false,
        //   sort: false,
        //   multi: false,
        // },
      ];
    // });
  }

  viewDetails(event) {}
  deleteById(event) {}
  deleteConnection() {}
  readSelectedData(data) {
    data.length > 0 ?this.addflag =false :this.addflag =true
    data.length > 0 ?this.delete_flag =true :this.delete_flag =false
  }
}
