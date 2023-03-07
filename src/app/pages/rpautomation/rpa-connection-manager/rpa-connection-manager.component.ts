import {Component, Input, OnInit,} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { LoaderService } from "src/app/services/loader/loader.service";
import Swal from "sweetalert2";
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
  connectorName:any;
  conn_logo:any;
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
    this.getAllConnections();
    }

  getAllConnections() {
    this.spinner.show();
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
        //   ColumnName: "connectionLogo",
        //   DisplayName: "Connector Logo",
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

  deleteConnection(){
    this.spinner.show();
    let selectedId = this.selectedData[0].id;
    this.rest_api.deleteConnectorbyId(selectedId).subscribe((resp) => {
    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Done Successfully !!",
      heightAuto: false,
    });
    this.getAllConnections();
    this.spinner.hide();
  },(err) => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
      heightAuto: false,
    });
    this.spinner.hide();
  });
    }
 
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
  this.spinner.show();
  this.connectorName = this.createConnectorForm.get('name').value
  let req_body = {
    "id": '',
    "name": this.connectorName,
    "connectionLogo": this.conn_logo
  }
  this.rest_api.saveConnector(req_body).subscribe((res:any)=>{
  this.spinner.hide();
    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Connector Added Successfully !!",
      heightAuto: false,
    });
    this.createConnectorForm.reset();
    this.isFormOverlay=false;
    this.getAllConnections();
  },(err: any) => {
    Swal.fire("Error", "Unable to save connector", "error")
    this.createConnectorForm.reset();
    this.isFormOverlay=false;
    this.spinner.hide();
  })
}

updateConnector() {
  this.spinner.show();
  let connectorName1 = this.createConnectorForm.get('name').value
  let data={
  connectionLogo: this.conn_logo,
  id: this.selectedData[0].id,
  name: connectorName1
};
  this.rest_api.updateConnection(data).subscribe((res:any)=>{
  this.spinner.hide();
    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Connector Updated Successfully !!",
      heightAuto: false,
    });
    this.isFormOverlay = false;
    this.getAllConnections();
  },(err: any) => {
    Swal.fire("Error", "Unable to update connector", "error")
    this.spinner.hide();
  });
  }
  imageUpload(e) {
    console.log("input change")
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
        alert('invalid format');
        return;
    }
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
}
_handleReaderLoaded(e) {
     console.log("_handleReaderLoaded")
    var reader = e.target;
    this.conn_logo = reader.result;
}
}
