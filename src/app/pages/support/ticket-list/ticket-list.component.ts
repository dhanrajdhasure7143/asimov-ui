import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestApiService } from '../../services/rest-api.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

export interface PeriodicElement {
  id: any;
  summary: any;
  reporter: any;
  component: any;
  status: any;
  impact: any;
  severity: any;
  priority: any;
  created_at: any;
  modified_at: any;
  Action: any;
}


@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements OnInit {

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;

  displayedColumns: string[] = ['id', 'summary', 'reporter', 'component', 'status',
    'impact', 'severity', 'priority', 'created_at', 'modified_at', 'Action'];

  dataSource: MatTableDataSource<PeriodicElement>;
  userId: any;
  userDetails: any;
  orgName: any;
  isLoading: boolean;
  categories: any[] = [];
  severityLevelsArray: any;
  selectedCategory:any;

  constructor(private api: RestApiService, private jwtHelper: JwtHelperService, private router: Router) {
    var userDetails = localStorage.getItem('accessToken');
    var deCryptUserDetails = this.jwtHelper.decodeToken(userDetails);
    this.userId = deCryptUserDetails.userDetails.userId;

  }

  ngOnInit(): void {
    this.isLoading = true;
    this.getUserDetails(this.userId);
    this.getAllSeverityLevels();
    this.selectedCategory="All Categories"
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  getUserDetails(userid) {
    this.api.getUserDetails(userid).subscribe(res => {
      this.userDetails = res;
      this.orgName = this.userDetails.company;
      this.getAllCustomerRequestsByOrg(this.orgName);
    });
  }

  getAllCustomerRequestsByOrg(orgName: string) {
    var res_Array: any[] = [];
    this.api.getAllCustomerRequestsByOrg(orgName).subscribe((res: PeriodicElement[]) => {
      res.forEach((e: any) => {
        // e.jiraServiceDesk.created_at = (e.jiraServiceDesk.created_at.split('T')[0] + " " + e.jiraServiceDesk.created_at.split('T')[1].split('.')[0]);
        // e.jiraServiceDesk.modified_at = (e.jiraServiceDesk.modified_at.split('T')[0] + " " + e.jiraServiceDesk.modified_at.split('T')[1].split('.')[0]);
        res_Array.push(e.jiraServiceDesk);
        res_Array.sort(function (a, b) {
          a = new Date(a.created_at);
          b = new Date(b.created_at);
          return a > b ? -1 : a < b ? 1 : 0;
        });
      });
      this.dataSource = new MatTableDataSource(res_Array);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoading = false;
    });
  }

  ViewMode(element) {
    this.router.navigate(['/pages/support/create-ticket'], { queryParams: { requestKey: element.requestKey } });
  }

  getAllSeverityLevels() {
    var category = [
      "All Categories",  "High", "Low", "Medium", "Lowest", "Task Mining", "Service Orchestration", "Robatic Process Automation",
      "Process Intelligence", "Business Process Studio"
    ];
    this.api.getAllSeverityLevels().subscribe(res => {
      var severity_array = [];
      this.severityLevelsArray = res;
      this.severityLevelsArray.forEach((e) => {
        severity_array.push(e.severity);
      });
      this.categories = category.concat(severity_array);
    });
  }

  categoryFilter(event) {
    if (event.target.value == "All Categories") {
      var fulldata = '';
      this.dataSource.filter = fulldata;
      this.dataSource.paginator.firstPage();
    } else {
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        return data.priority == event.target.value || data.severity == event.target.value || data.component == event.target.value;
      };
      this.dataSource.filter = event.target.value;
      this.dataSource.paginator = this.paginator;
      this.dataSource.paginator.firstPage();
    }
  }


}