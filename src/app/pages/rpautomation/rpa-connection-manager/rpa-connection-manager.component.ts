import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";
import { LoaderService } from "src/app/services/loader/loader.service";
import { RestApiService } from "../../services/rest-api.service";
import { Rpa_Hints } from "../model/RPA-Hints";
import { columnList } from "src/app/shared/model/table_columns";
import { DatePipe } from '@angular/common';
import { ToasterService } from "src/app/shared/service/toaster.service";
import { toastMessages } from "src/app/shared/model/toast_messages";

@Component({
  selector: "app-rpa-connection-manager",
  templateUrl: "./rpa-connection-manager.component.html",
  styleUrls: ["./rpa-connection-manager.component.css"],
  providers:[columnList]
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
  connectorName: any;
  conn_logo: any;
  table_searchFields:any[]=[];
  connector_id:any;
  userRole:any=[]
  connector_icon: any;
  isIconSize: boolean;
  connectionNameCheck: boolean = false;

  constructor(
    private rest_api: RestApiService,
    private router: Router,
    private hints: Rpa_Hints,
    private spinner: LoaderService,
    private toastService: ToasterService,
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder,
    private columnList: columnList,
    private datePipe: DatePipe,
    private toastMessages: toastMessages
  ) {}

  ngOnInit() {
    this.spinner.show();
    this.createConnectorForm = this.formBuilder.group({
      name: ["",Validators.compose([Validators.required,Validators.pattern('^[a-zA-Z]+(\\s[a-zA-Z]+)*$'), Validators.maxLength(50)])],
      taskIcon: ["", Validators.compose([Validators.required])],
    });
    this.getAllConnections();
    this.userRole = localStorage.getItem("userRole");
    this.columns_list = this.columnList.connectionsList_column
  }

  getAllConnections() {
    this.spinner.show();
    this.rest_api.getConnectionslist().subscribe((res: any) => {
      this.connectorTable = res.data;
      this.connectorTable = this.connectorTable.map(item => {
        item["createdAt"] = this.datePipe.transform(new Date(item.createdAt),'MMM dd, y HH:mm')
        return item;
      })
      this.readSelectedData([]); 
      this.spinner.hide();
      this.table_searchFields=["name","actionCount","createdBy","createdAt"]
    });
  }

  viewDetails(event) {
    this.router.navigate(["/pages/rpautomation/action-item"], {
      queryParams: { id: event.id, name : event.name, icon : event.connectionLogo },
    });
  }

  deleteById(event) {

    this.spinner.show();
    let selectedId = event.id;
    let selectedName =event.name;
    this.confirmationService.confirm({
      message: "Do you want to delete this connector?",
      header: 'Are you sure?',
      
      accept: () => {
        this.spinner.show();
        this.rest_api.deleteConnectorbyId(selectedId).subscribe(
          (resp) => {
            this.toastService.showSuccess(selectedName,'delete');
            this.spinner.hide();
            this.getAllConnections();
          },
          (err) => {
            this.toastService.showError("Please delete the action items!");
            this.spinner.hide();
            this.getAllConnections();
          }
        );
      },
      reject: (type) => {
        this.spinner.hide();
      },
      key: "positionDialog"
    });
  }

  addNewConnection() {
    this.isCreate = true;
    this.isFormOverlay = true;
  }

  openUpdateOverlay(event) {
    this.isCreate = false;
    this.isFormOverlay = true;
    this.connctionupdatedata = event;
    let id = event.id
    this.rest_api.getIconForConnector(id).subscribe((res:any) =>{
      this.connector_icon = res["data"]
    })
    this.createConnectorForm.get("name").setValue(this.connctionupdatedata["name"]);
    this.createConnectorForm.get("taskIcon").setValue(this.connctionupdatedata["taskIcon"]);
  }

  readSelectedData(data) {
    this.selectedData = data;
    this.selectedData.length > 0
      ? (this.addflag = false)
      : (this.addflag = true);
    this.selectedData.length == 1
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
    this.connectionNameCheck = false;
  }

  closeAuthOverlay(event) {
    this.isAuthOverlay = event;
    this.isFormOverlay = true;
  }

  saveConfigurations() {
    this.isAuthOverlay = false;
    this.isFormOverlay = true;
  }
  resetForm() {
    this.createConnectorForm.reset();
    this.createConnectorForm.get("name").setValue("");
    this.createConnectorForm.get("taskIcon").setValue("");
  }

  saveConnector() {
    this.spinner.show();
    this.connectorName = this.createConnectorForm.get("name").value;
    let req_body = {
      id: "",
      name: this.connectorName,
      connectionLogo: new String(this.conn_logo.split(",")[1]),
    };
    this.rest_api.saveConnector(req_body).subscribe(
      (res: any) => {
        this.spinner.hide();
        this.toastService.showSuccess(this.connectorName,'save');
        this.createConnectorForm.reset();
        this.isFormOverlay = false;
        this.getAllConnections();
      },
      (err: any) => {      
        this.toastService.showError(this.toastMessages.saveError);
        this.createConnectorForm.reset();
        this.isFormOverlay = false;
        this.spinner.hide();
        this.getAllConnections();
      }
    );
  }

  updateConnector() {
    this.spinner.show();
    let connectorName1 = this.createConnectorForm.get("name").value;
    let id = this.connctionupdatedata.id
    let data = {
      connectionLogo: this.conn_logo == undefined ? this.connctionupdatedata.connectionLogo  : new String(this.conn_logo.split(",")[1]),
      name: connectorName1
    };
    this.rest_api.updateConnection(id,data).subscribe((res: any) =>{    
        this.spinner.hide();
        this.toastService.showSuccess(connectorName1,'update');
        this.isFormOverlay = false;
        this.createConnectorForm.reset();
        this.getAllConnections();
      },
      (err: any) => {   
        // this.toastService.showError("Unable to update Connector!");    
        this.toastService.showError(this.toastMessages.updateError); 
        this.spinner.hide();
      }
    );
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
    this.conn_logo = reader.result;
  }

  checkConnectionName() {
    let connectionName = this.createConnectorForm.get("name").value;
    this.rest_api.checkConnectionName(connectionName).subscribe((data) => {
        this.connectionNameCheck = !this.isCreate ? (this.connctionupdatedata["name"] !== connectionName ? !data : false) : !data;
      },
      (error) => {
        this.connectionNameCheck = true;
      }
    );
  }
}
