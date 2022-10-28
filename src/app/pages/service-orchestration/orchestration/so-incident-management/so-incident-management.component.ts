import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import moment from "moment";
import { NgxSpinnerService } from "ngx-spinner";
import { RestApiService } from "src/app/pages/services/rest-api.service";
import Swal from "sweetalert2";
@Component({
  selector: "app-so-incident-management",
  templateUrl: "./so-incident-management.component.html",
  styleUrls: ["./so-incident-management.component.css"],
})
export class SoIncidentManagementComponent implements OnInit {
  incidentFlag: boolean = false;
  loadingFlag: boolean = true;
  seachInput: string = "";
  @ViewChild("incidentTablePaginator", { static: false })
  incidentTablePaginator: MatPaginator;
  @ViewChild("incidentTableSort", { static: false }) incidentTableSort: MatSort;
  incidentTableDisplayedColumns: any[] = [
    "incidentId",
    "convertedCreatedTime",
    "assignedTo",
    "description",
    "priority",
    "incidentStatus",
  ];
  incidentTableDataSource: MatTableDataSource<any>;

  constructor(
    private rest: RestApiService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getIncidents();
  }

  getIncidents() { // to get all incidents
    this.spinner.show();
    this.rest.getIncident().subscribe(
      (response: any) => {
        this.loadingFlag = false;
        if (response.errorMessage == undefined) {
          this.incidentFlag = response.configuration;
          if (response.configuration == true) {
            let modifiedResponse = response.incidents.map((item: any) => {
              item["convertedCreatedTime"] = moment(item.createdAt).format(
                "MMM, DD, yyyy, hh:mm A"
              );
              return item;
            });
            setTimeout(() => {
              this.incidentTableDataSource = new MatTableDataSource(
                modifiedResponse
              );
              this.incidentTableDataSource.sort = this.incidentTableSort;
              this.incidentTableDataSource.paginator =
                this.incidentTablePaginator;
              this.spinner.hide();
            }, 100);
          }
        } else{ this.spinner.hide(); Swal.fire("Error", response.errorMessage, "error")};
      },
      (err) => {
        this.loadingFlag = false;
        this.spinner.hide();
        Swal.fire("Error", "Unable to get incidents", "error");
      }
    );
  }

  searchIncidentTable() { // search table data
    let searchText = this.seachInput.trim();
    searchText = searchText.toLowerCase();
    this.incidentTableDataSource.filter = searchText;
  }

  reset() { // reset search input field
    this.seachInput = "";
    this.incidentTableDataSource.filter = "";
  }
}
