import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
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
  @Input() isCreate: boolean = true;
  connectorTable: any = [];
  representatives: any = [];
  columns_list: any = [];
  addflag: boolean = true;
  delete_flag: boolean = false;
  isConnectorForm: boolean = true;
  isFormOverlay: boolean = false;
  authorizationType: any = [];
  isAuthOverlay: boolean = false;
  updateflag: boolean = false;
  viewConnetorflag = false;
  createConnectorForm: FormGroup;
  selectedData: any;
  public connctionupdatedata: any;
  submitted: boolean;

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
      name: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      taskIcon: ["", Validators.compose([Validators.required])]
    })

    // this.configurationOptions = this.formBuilder.group({
    //   GrantType: ["",Validators.compose([Validators.required])],
    //   accessToken: ["",Validators.compose([Validators.required])],
    //   clienId: ["",Validators.compose([Validators.required])],
    //   clientSecret: ["",Validators.compose([Validators.required])],
    //   userName: ["",Validators.compose([Validators.required])],
    //   password: ["",Validators.compose([Validators.required])],
    //   scope: ["",Validators.compose([Validators.required])],
    // })

    this.getAllConnections();
    // this.connectorTable =[
    //   {id:"1",connectionName:"Zoho", authorization_Type:"OAuth 2.0"},
    //   {id:"2",connectionName:"GIt", authorization_Type:"OAuth 2.0"},
    //   {id:"2",connectionName:"Microsoft online", authorization_Type:"OAuth 2.0"},
    // ]
  }

  getAllConnections() {
    this.rest_api.getConnectionslist().subscribe((data: any) => {
      this.connectorTable = data;
      console.log("List Of Connections",data);
      this.spinner.hide();
      this.columns_list = [
        {
          ColumnName: "name",
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
      ];
    });
  }

  viewDetails(event) {}

  deleteById(event) {}

  deleteConnection() {}
  
  viewConnector() {
    console.log("Selected Data",this.selectedData[0].id)
    this.router.navigate(["/pages/rpautomation/action-item"],{
    queryParams:{id:this.selectedData[0].id}
    })
  }

  addNewConnection() {
    this.isCreate = true;
    this.isFormOverlay = true;
  }

  openUpdateOverlay() {
    this.isCreate = false;
    this.isFormOverlay = true;
    this.connctionupdatedata = this.selectedData[0];
    this.createConnectorForm.get("name").setValue(this.connctionupdatedata["name"]);
    this.createConnectorForm.get("taskIcon").setValue(this.connctionupdatedata["taskIcon"]);
    console.log(this.selectedData);
  }

  readSelectedData(data) {
    this.selectedData = data;
    this.selectedData.length > 0
      ? (this.addflag = false)
      : (this.addflag = true);
    this.selectedData.length > 0
      ? (this.delete_flag = true)
      : (this.delete_flag = false);
    this.selectedData.length == 1
      ? (this.updateflag = true)
      : (this.updateflag = false);
    this.selectedData.length == 1
      ? (this.viewConnetorflag = true)
      : (this.viewConnetorflag = false);
  }

  closeFormOverlay(event) {
    this.isFormOverlay = event;
    this.createConnectorForm.reset();
  }

  closeAuthOverlay(event) {
    this.isAuthOverlay = event;
    this.isFormOverlay = true;
  }

  saveConfigurations() {
    this.isAuthOverlay = false;
    this.isFormOverlay = true;
  }
  resetForm(){
  this.createConnectorForm.reset();
  this.createConnectorForm.get("name").setValue("");
  this.createConnectorForm.get("taskIcon").setValue("");
  }

  saveConnector() {
    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Connector Added Successfully !!",
      heightAuto: false,
    });
    this.isFormOverlay = false;
  }

updateConnector() {
    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Connector Updated Successfully !!",
      heightAuto: false,
    });
    this.isFormOverlay = false;
  }
}
