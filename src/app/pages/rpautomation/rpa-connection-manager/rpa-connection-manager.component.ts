import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
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
  connectorTable: any = [];
  representatives: any = [];
  columns_list: any = [];
  addflag: boolean = true;
  delete_flag: boolean = false;
  checkBoxShow: boolean = true;

  constructor(
    private rest_api: RestApiService,
    private router: Router,
    private hints: Rpa_Hints,
    private spinner: LoaderService
  ) {}

  ngOnInit() {
    this.spinner.show();
    this.getAllConnections();
  }

  getAllConnections() {
    this.rest_api.getConnectionslist().subscribe((data: any) => {
      this.connectorTable = data;
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
        {
          ColumnName: "httpMethodType",
          DisplayName: "Connection Name",
          ShowFilter: true,
          ShowGrid: true,
          filterWidget: "normal",
          filterType: "text",
          sort: true,
          multi: false,
        },
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
          ColumnName: "authorization_Type",
          DisplayName: "Authentication Type",
          ShowGrid: true,
          ShowFilter: true,
          filterWidget: "normal",
          filterType: "text",
          sort: true,
          multi: false,
        },
        {
          ColumnName: "createdDate",
          DisplayName: "Created Date",
          ShowGrid: true,
          ShowFilter: true,
          filterWidget: "normal",
          filterType: "date",
          sort: true,
          multi: false,
        },
        {
          ColumnName: "lastModifiedBy",
          DisplayName: "Created By",
          ShowGrid: true,
          ShowFilter: true,
          filterWidget: "normal",
          filterType: "text",
          sort: true,
          multi: false,
        },
        // {
        //   ColumnName: "action",
        //   DisplayName: "Action",
        //   ShowGrid: true,
        //   ShowFilter: false,
        //   sort: false,
        //   multi: false,
        // },
      ];
    });
  }

  viewDetails(event) {}
  deleteById(event) {}
  deleteConnection() {}
  readSelectedData(data) {
    data.length > 0 ?this.addflag =false :this.addflag =true
    data.length > 0 ?this.delete_flag =true :this.delete_flag =false
  }
}
