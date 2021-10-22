import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestApiService } from '../../services/rest-api.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';



@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.css']
})
export class CreateTicketComponent implements OnInit {

  @ViewChild('matSelect', { static: true }) matSelect = null;

  userId: any;
  userName: any;
  orgName: any;
  createTicket: FormGroup;
  impactArray: any;
  severityLevelsArray: any;
  organizationArray: any;
  issueTypeArray: any;
  userDetails: any;
  fileName: any[] = [];
  tempAttachmentId: any;
  progress: number;
  uplodFiles: boolean;
  isLoading: boolean = false;
  fileError: boolean = false;
  createRequestData: any;
  requestKey: any = undefined;
  // ngModels
  comment: any;
  summary: any;
  description: any;
  component: any[] = [];
  priority: any;
  severity: any;
  impact: any;
  // ngModels
  commentRequest: any[] = [];
  showSaveButton: boolean = false;
  attachmentsForCustomerRequest: any[] = [];
  imageArray: any[] = [];
  customerStatus: any;
  Priority_list: any[] = ["High", "Medium", "Low", "Lowest"];
  // component_list:any[]=['Task Mining','Service Orchestration','Robatic Process Automation','Process Intelligence','Business Process Studio']
  component_list: any[] = []
  isCommentEditable: any;
  comment_data: any;
  newComment_data: any;
  isAddInputenable: boolean = false;
  isEdit: boolean = false;
  displayedColumns = ['name', 'created', 'file_size', 'actions'];
  dataSource: MatTableDataSource<any>;
  listof_uploadFiles: any[];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
    public formBuilder: FormBuilder,
    private api: RestApiService,
    private jwtHelper: JwtHelperService,
    private activateRouter: ActivatedRoute
  ) {
    var userDetails = localStorage.getItem('accessToken');
    var deCryptUserDetails = this.jwtHelper.decodeToken(userDetails);
    this.userId = deCryptUserDetails.userDetails.userId;
    this.userName = deCryptUserDetails.userDetails.userName;
    this.activateRouter.queryParams.subscribe(res => {
      if (res) {
        this.requestKey = res.requestKey;
      }
    });

  }

  ngOnInit(): void {
    this.getComponentsList();
    this.getAllImpactLevels();
    this.getAllSeverityLevels();
    this.getUserDetails(this.userId);

    this.createTicket = this.formBuilder.group({
      tempattachmentid: [this.tempAttachmentId],
      summary: ['', [Validators.required]],
      createdBy: [this.userName],
      description: ['', Validators.required],
      requestType: ['default', [Validators.required]],
      priority: ['', [Validators.required]],
      impact: ['', [Validators.required]],
      severity: ['', [Validators.required]],
      reporter: [this.userName],
      component: ['', Validators.required],
      comment: [''],
      newcomment: [''],
      status: ['']
    });
  }

  matSelectClose() {
    this.matSelect.close();
  }

  CreateNewTicket() {
    this.isLoading = true;
    this.createTicket.value.requestType = 'default';
    this.createTicket.value.reporter = this.userName;
    this.createTicket.value.organization = this.orgName;
    this.createTicket.value.createdBy = this.userName;
    if (this.tempAttachmentId) {
      if (!this.tempAttachmentId['errorCode']) {
        this.createTicket.value.tempattachmentid = this.tempAttachmentId;
      }
    }
    else {
      this.createTicket.value.tempattachmentid = [];
    }

    let record = {
      "requestType": "default",
      "summary": this.createTicket.value.summary,
      // "createdBy": this.createTicket.value.createdBy,
      "description": this.createTicket.value.description,
      "organization": this.createTicket.value.organization,
      "priority": this.createTicket.value.priority,
      "severity": this.createTicket.value.severity,
      "status": "new",
      "impact": this.createTicket.value.impact,
      "reporter": this.createTicket.value.reporter,
      "component": this.createTicket.value.component,
      "tempattachmentid": this.createTicket.value.tempattachmentid
    }
    this.api.createCustomerRequest(record).subscribe(res => {
      if (res == 'created request sucessfully') {
        Swal.fire({
          title: 'Ticket Created Successfully',
          icon: 'success'
        });
        this.reset();
        this.isLoading = false;
        this.fileName = [];
      }
      else if (res == 'request creation failed') {
        this.isLoading = false;
        this.fileError = false;
        Swal.fire({
          title: 'Ticket creation failed',
          text: 'Please try again later',
          icon: 'error'
        });
      }
      else if (res == `{"errorMessage":"Error occured","errorCode":5030}`) {
        this.isLoading = false;
        Swal.fire({
          title: 'Error occured',
          text: 'Please try again later',
          icon: 'error'
        });
      }
    }, err => {
      this.isLoading = false;
      Swal.fire({
        title: 'Error occured',
        text: 'Please try again later',
        icon: 'error'
      });
    });
  }

  reset() {
    this.isLoading = true;
    this.ngOnInit();
    this.fileName = [];
    this.createTicket.value.tempattachmentid = [];
    this.fileError = false;
    this.isLoading = false;
    this.component = [];
    this.createTicket.reset();
    this.createTicket.get('reporter').setValue(this.userName);
  }

  file(event) {
    this.fileError = false;
    this.isLoading = true;
    this.progress = 1;
    // this.fileName = [];
    for (var i = 0; i < event.target.files.length; i++) {
      this.fileName.push(event.target.files[i]);
    }
    const formdata = new FormData();
    for (var i = 0; i < this.fileName.length; i++) {
      formdata.append("file", this.fileName[i]);
    }
    this.api.createTemporaryFile(formdata).subscribe(res => {
      this.tempAttachmentId = res;
      this.isLoading = false;
      if (!res) {
        this.uplodFiles = false;
      }
      else {
        this.progress = 100;
        this.uplodFiles = true;
        if (!this.tempAttachmentId['errorCode']) {
          this.createTicket.value.tempattachmentid = this.tempAttachmentId;
        }
        else {
          this.createTicket.value.tempattachmentid = [];
        }
        this.createTicket.value.organization = this.orgName;
      }
    });

  }

  DeleteFile(file, i: number) {
    this.fileName.splice(i, 1);
    this.uplodFiles = false;
    this.isLoading = true;
    const formdata = new FormData();
    for (var i = 0; i < this.fileName.length; i++) {
      formdata.append("file", this.fileName[i]);
    }
    this.api.createTemporaryFile(formdata).subscribe(res => {
      this.isLoading = false;
      this.tempAttachmentId = res;
      if (!res) {
        this.uplodFiles = false;
      }
      if (res['errorMessage']) {
        this.fileError = true;
        this.createTicket.value.tempattachmentid = [];
      }
      if (!this.tempAttachmentId['errorCode']) {
        this.progress = 100;
        this.uplodFiles = true;
        this.fileError = false;
        this.createTicket.value.tempattachmentid = this.tempAttachmentId;
      }
    });
  }

  getAllImpactLevels() {
    this.api.getAllImpactLevels().subscribe(res => {
      this.impactArray = res;
    });
  }

  getAllSeverityLevels() {
    this.api.getAllSeverityLevels().subscribe(res => {
      this.severityLevelsArray = res;
    });
  }

  getComponentsList() {
    this.isLoading = true;
    this.api.getListOfComponents().subscribe((res: any[]) => {
      this.component_list = res;
      this.isLoading = false;
    })
  }

  getUserDetails(userid) {
    this.isLoading = true;
    this.api.getUserDetails(userid).subscribe(res => {
      this.userDetails = res;
      this.orgName = this.userDetails.company;
      this.createTicket.value.organization = this.orgName;
    this.isLoading = false;

    });
  }


}
