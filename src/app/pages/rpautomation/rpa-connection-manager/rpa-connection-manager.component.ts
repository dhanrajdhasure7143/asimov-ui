import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import moment from "moment";
import { NgxSpinnerService } from "ngx-spinner";
import { LoaderService } from "src/app/services/loader/loader.service";
import Swal from "sweetalert2";
import { DataTransferService } from "../../services/data-transfer.service";
import { RestApiService } from "../../services/rest-api.service";
import { Rpa_Hints } from "../model/RPA-Hints";

@Component({
  selector: "app-rpa-connection-manager",
  templateUrl: "./rpa-connection-manager.component.html",
  styleUrls: ["./rpa-connection-manager.component.css"],
})
export class RpaConnectionManagerComponent implements OnInit {
  @Input() isCreate: boolean=true;
  connectorTable: any = [];
  representatives: any = [];
  columns_list: any = [];
  addflag: boolean = true;
  delete_flag: boolean = false;
  checkBoxShow: boolean = true;
  isConnectorForm: boolean = true;
  isFormOverlay: boolean = false;
  authorizationType: any = [];
  isAuthOverlay: boolean = false;
  grantType:any=["Authorization Code",
                 "Password Credentials",
                 "Refresh Token"];
  updateflag:boolean = false;
  viewConnetorflag = false;
  createConnectorForm: FormGroup;
  configurationOptions: FormGroup;
  optionValue:any;
  optionValue1:any;
  selectedData: any;
  public connctionupdatedata:any;


  constructor(
    private rest_api: RestApiService,
    private router: Router,
    private hints: Rpa_Hints,
    private spinner: LoaderService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.spinner.show();
    this.createConnectorForm = this.formBuilder.group({
      connectionName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      // authorization_Type: ["", Validators.compose([Validators.required])],
      taskIcon: ["", Validators.compose([Validators.required])]
    })

    this.configurationOptions = this.formBuilder.group({
      GrantType: ["",Validators.compose([Validators.required])],
      accessToken: ["",Validators.compose([Validators.required])],
      clienId: ["",Validators.compose([Validators.required])],
      clientSecret: ["",Validators.compose([Validators.required])],
      userName: ["",Validators.compose([Validators.required])],
      password: ["",Validators.compose([Validators.required])],
      scope: ["",Validators.compose([Validators.required])],
    })

    this.getAllConnections();
    this.authTypes();
    this.getGrantType();

    this.connectorTable =[
      {id:"1",connectionName:"Zoho", authorization_Type:"OAuth 2.0"},
      {id:"2",connectionName:"GIt", authorization_Type:"OAuth 2.0"}

    ]
  }

  getAllConnections() {
    // this.rest_api.getConnectionslist().subscribe((data: any) => {
    //   this.connectorTable = data;
    //   console.log("List Of Connections",data);
      this.spinner.hide();
      this.columns_list = [
        {
          ColumnName: "connectionName",
          DisplayName: "Connector Name",
          ShowGrid: true,
          ShowFilter: true,
          filterWidget: "normal",
          filterType: "text",
          sort: true,
          multi: false,
        },
        // {
        //   ColumnName: "authorization_Type",
        //   DisplayName: "Authentication Type",
        //   ShowGrid: true,
        //   ShowFilter: true,
        //   filterWidget: "normal",
        //   filterType: "text",
        //   sort: true,
        //   multi: false,
        // },
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
  addNewConnection(){
    this.isCreate = true;

  }
  openUpdateOverlay() {
    this.isCreate =false;
    this.isFormOverlay = true;
    this.connctionupdatedata = this.selectedData[0];
    this.createConnectorForm.get("connectionName").setValue(this.connctionupdatedata["connectionName"]);
    this.createConnectorForm.get("authorization_Type").setValue(this.connctionupdatedata["authorization_Type"]);
    this.createConnectorForm.get("taskIcon").setValue(this.connctionupdatedata["taskIcon"]);
    console.log(this.selectedData);
  }
  viewConnector() {}
  readSelectedData(data) {
    this.selectedData = data;
    this.selectedData.length > 0 ? (this.addflag = false) : (this.addflag = true);
    this.selectedData.length > 0 ? (this.delete_flag = true) : (this.delete_flag = false);
    this.selectedData.length == 1 ? (this.updateflag =true) : (this.updateflag = false);
    this.selectedData.length == 1 ? (this.viewConnetorflag = true) : (this.viewConnetorflag = false);
  }

  openConnectorForm() {
    this.isFormOverlay = true;
    this.isConnectorForm = true;
  }

  authTypes() {
    this.rest_api.getAuthTypes().subscribe((res: any) => {
      this.authorizationType = res;
      console.log("auth types",res);
    });
  }

  closeFormOverlay(event) {
    this.isFormOverlay = event;
  }

  changeAuth(event) {
    this.isAuthOverlay = true;
  }

  closeAuthOverlay(event) {
    this.isAuthOverlay = event;
    this.isFormOverlay = true;
  }

  saveConfigurations() {
    this.isAuthOverlay = false;
    this.isFormOverlay = true;
  }

  getGrantType(){
    this.rest_api.getGrantTypes().subscribe((res:any)=>{
      // this.grantType =res;
      console.log("grant types",res)
    })

  }
}
