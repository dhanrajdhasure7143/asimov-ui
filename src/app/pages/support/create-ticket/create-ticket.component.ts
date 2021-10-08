import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestApiService } from '../../services/rest-api.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';


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
  component: any[]=[];
  priority: any;
  severity: any;
  impact: any;
  // ngModels
  commentRequest: any[]=[];
  showSaveButton: boolean = false;
  attachmentsForCustomerRequest: any;
  imageArray: any[] = [];
  customerStatus: any;
  Priority_list:any[]=["High","Medium","Low","Lowest"];
  component_list:any[]=['Task Mining','Service Orchestration','Robatic Process Automation','Process Intelligence','Business Process Studio']
  isCommentEditable:any;
  comment_data:any;
  newComment_data:any;
  isAddInputenable:boolean=false;
  isEdit:boolean=false;

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
    console.log(this.userId,this.userName)

    this.activateRouter.queryParams.subscribe(res => {
      this.requestKey = res.requestKey;
      // console.log(this.requestKey);
    });

  }

  ngOnInit(): void {
    this.getUserDetails(this.userId);
    // console.log(this.createRequestData);
    this.getIssueType();
    this.getOrganizations();
    this.getAllImpactLevels();
    this.getAllSeverityLevels();
    if(this.requestKey){
      this.isEdit=true;
    this.getCustomerRequestStatus(this.requestKey);
    this.getRequestComments(this.requestKey);
    this.getAttachmentsForCustomerRequest(this.requestKey);
    }

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
      status:['']
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
      "createdBy": this.createTicket.value.createdBy,
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
    // console.log(record);
    this.api.createCustomerRequest(record).subscribe(res => {
      // console.log(res);
      if (res == 'created request sucessfully') {
        Swal.fire({
          title: 'Ticket Created Successfully',
          icon: 'success',
          timer: 2000
        });
        this.reset();
        this.isLoading = false;
      }
      else if (res == 'request creation failed') {
        this.isLoading = false;
        this.fileError = false;
        Swal.fire({
          title: 'Ticket Created failed',
          text: 'Please try again later',
          icon: 'error',
          timer: 2000
        });
      }
      else if (res == `{"errorMessage":"Error occured","errorCode":5030}`) {
        this.isLoading = false;
        Swal.fire({
          title: 'Error occured',
          text: 'Please try again later',
          icon: 'error',
          timer: 2000
        });
      }
    },err=>{
      this.isLoading = false;
      Swal.fire({
        title: 'Error occured',
        text: 'Please try again later',
        icon: 'error',
        timer: 2000
      });
    });

  }

  editSummary() {
    this.isLoading = true;
    let record: any = {
      "fields": {
        "summary": this.summary
      }
    };
    this.api.editSummary(this.requestKey, record).subscribe(res => {
      if (res == 'Summary updated Sucessfully!') {
        Swal.fire({
          title: 'Success',
          text: 'Summary Updated Sucessfully !',
          icon: 'success',
          timer: 2000
        });
        this.getUserDetails(this.userId);
        this.isLoading = false;
      }
      else {
        Swal.fire({
          title: 'Failed To Update',
          text: 'Please try again later',
          icon: 'error',
          timer: 2000
        });
      }
      console.log(res);
    });
  }

  editDescription() {
    this.isLoading = true;
    let record = {
      "version": 1,
      "type": "doc",
      "content": [
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": this.description
            }
          ]
        }
      ]
    }
    this.api.editDescription(this.requestKey, record).subscribe(res => {
      if (res == 'Description updated Sucessfully!') {
        Swal.fire({
          title: 'Success',
          text: 'Description Updated Sucessfully !',
          icon: 'success',
          timer: 2000
        });
        this.getUserDetails(this.userId);
        this.isLoading = false;
      }
      else {
        Swal.fire({
          title: 'Failed To Update',
          text: 'Please try again later',
          icon: 'error',
          timer: 2000
        });
        this.isLoading = false;
      }
      console.log(res);
    });
  }

  cancelComment() {
    if (this.commentRequest.length>0) {
      this.comment = this.commentRequest[0].comment;
    }
    else {
      this.comment = "";
    }
  }

  cancelSummary() {
    this.summary = this.createRequestData[0].summary;
  }
  cancelDescription() {
    this.description = this.createRequestData[0].description;
  }


  reset() {
    this.isLoading = true;
    this.ngOnInit();
    this.fileName = [];
    this.createTicket.value.tempattachmentid = [];
    this.fileError = false;
    this.isLoading = false;
  }

  file(event) {
    if (this.requestKey != undefined || null) {
      this.isLoading = true;
      this.fileName = [];
      for (var i = 0; i < event.target.files.length; i++) {
        this.fileName.push(event.target.files[i]);
      }
      const formdata = new FormData();
      formdata.append("requestKey", this.requestKey);
      for (var i = 0; i < this.fileName.length; i++) {
        formdata.append("file", this.fileName[i]);
      }
      console.log(formdata);
      this.api.createAttachmentsForATicket(formdata).subscribe(res => {
        console.log(res);
        if(res == 'created attachment sucessfully'){
          Swal.fire({
            title: 'Success',
            text: 'Attachment added Sucessfully !',
            icon: 'success',
            timer: 2000
          });
          this.getAttachmentsForCustomerRequest(this.requestKey);
          this.isLoading = false;
        }
        else{
          Swal.fire({
            title: 'Failed',
            text: 'Please try again later',
            icon: 'error',
            timer: 2000
          });
          this.isLoading = false;
        }
      });
    }
    else {
      this.fileError = false;
      this.isLoading = true;
      this.progress = 1;
      for (var i = 0; i < event.target.files.length; i++) {
        this.fileName.push(event.target.files[i]);
      }
      const formdata = new FormData();
      for (var i = 0; i < this.fileName.length; i++) {
        formdata.append("file", this.fileName[i]);
      }
      this.api.createTemporaryFile(formdata).subscribe(res => {
        console.log("this.tempAttachmentId",this.tempAttachmentId)
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

  //api calls

  getIssueType() {
    this.api.getAllRequestTypes().subscribe(res => {
      this.issueTypeArray = res;
    });
  }

  getOrganizations() {
    this.api.getAllJiraOrganizations().subscribe(res => {
      this.organizationArray = res;
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

  getUserDetails(userid) {
    // this.isLoading = true;
    this.api.getUserDetails(userid).subscribe(res => {
      this.userDetails = res;
      this.orgName = this.userDetails.company;
      this.createTicket.value.organization = this.orgName;
      if (this.requestKey != undefined || null) {
        this.getAllCustomerRequestsByOrg(this.orgName);
      }
    });
    // this.isLoading = false;
  }

  getRequestComments(id) {
    // this.isLoading = true;
    this.api.getRequestComments(id).subscribe((res:any) => {
      this.commentRequest = res;
      console.log(res, "comment");
      if (this.commentRequest.length > 0) {
        // this.comment = this.commentRequest[0].comment;
        this.comment = this.commentRequest;
      }
      // this.isLoading = false;
    });
  }

  async getAllCustomerRequestsByOrg(orgName: string) {
    this.isLoading = true;
    var Array: any[] = [];
    this.api.getAllCustomerRequestsByOrg(orgName).subscribe((res: any) => {
      res.forEach((e: any) => {
        Array.push(e.jiraServiceDesk);
      });
      this.createRequestData = Array;
      this.createRequestData = this.createRequestData.filter((e: any) => e.requestKey == this.requestKey);
      console.log(this.createRequestData);
      this.summary = this.createRequestData[0].summary;
      // this.createTicket.get('summary').setValue(this.createRequestData[0].summary)
      this.description = this.createRequestData[0].description;
      this.component = this.createRequestData[0].component;
      this.impact = this.createRequestData[0].impact;
      this.severity = this.createRequestData[0].severity;
      this.priority = this.createRequestData[0].priority;
      // console.log(this.component);
      this.isLoading = false;
    });
  }

  getAttachmentsForCustomerRequest(id: any) {
    // this.isLoading = true;
    this.imageArray = [];
    this.api.getAttachmentsForCustomerRequest(id).subscribe((res: any) => {
      this.attachmentsForCustomerRequest = res.attachmentData;
      if(this.attachmentsForCustomerRequest){
        this.imageArray = [];
      let keyval: any[] = Object.keys(this.attachmentsForCustomerRequest);
      let imgObject = [];
      imgObject = Object.values(this.attachmentsForCustomerRequest);
      for (var i = 0; i < imgObject.length; i++) {
        var img: string = imgObject[i];
        const imageName = keyval[i];
        var type = keyval[i].split('.');
        let obj = {}
        obj['name'] = keyval[i]
        obj['file'] = atob(img);
        obj['type'] = type[1];
        this.imageArray.push(obj);
      }
    }
      // console.log(this.imageArray);
      // this.isLoading = false;
    });
  }

  getCustomerRequestStatus(requestKey) {
    this.api.getCustomerRequestStatus(requestKey).subscribe((res:any) => {
      this.customerStatus = res;
      this.createTicket.value.status = this.customerStatus;
      console.log(this.customerStatus);
    });
  }

  removeAttachmentsFromCustomerRequest(data){
    this.isLoading = true;
    console.log(data);
    let record = {
      "fileList": [
          data.name
      ],
      "requestKey": this.requestKey
  }
  console.log(record);
    this.api.removeAttachmentsFromCustomerRequest(record).subscribe((res:any)=>{      
      console.log(res);
      if(res == 'removed attachments sucessfully'){
        Swal.fire({
          title: 'Success',
          text: 'Attachment Removed Sucessfully !',
          icon: 'success',
          timer: 2000
        });
        this.getAttachmentsForCustomerRequest(this.requestKey);
        this.isLoading = false;
      }
      else{
        Swal.fire({
          title: 'Error occured',
          text: 'Please try again later !',
          icon: 'error',
          timer: 2000
        });
        this.isLoading = false;
      }
    });
  }

  removeAllAttachmentsFromCustomerRequest(){
    this.isLoading = true;
    this.api.removeAllAttachmentsFromCustomerRequest(this.requestKey).subscribe((res:any)=>{      
      console.log(res);
      if(res == 'removed attachments sucessfully'){
        Swal.fire({
          title: 'Success',
          text: 'Attachment Removed Sucessfully !',
          icon: 'success',
          timer: 2000
        });
        this.getAttachmentsForCustomerRequest(this.requestKey);
        this.imageArray = [];
        this.fileName = [];
        this.isLoading = false;
      }
      else{
        Swal.fire({
          title: 'Error occured',
          text: 'Please try again later !',
          icon: 'error',
          timer: 2000
        });
        this.isLoading = false;
      }
    });
  }

  editComment1(index,data){
    this.isCommentEditable=index;
    this.comment_data=data.comment;
    this.newComment_data='';
    this.isAddInputenable=false;
  }

  cancelCommentupdate(){
    this.isCommentEditable=null;
    // this.comment_data=''
  }

  cancelCreateComment(){
    this.newComment_data='';
    this.isAddInputenable=false;
  }

  addCommentClick(){
    this.isAddInputenable=true;
    this.isCommentEditable=null;
  }

  addNewComment(value){
      this.isLoading = true;
      let req_body = {
        'requestKey':this.requestKey,
        "commentBody":value
      };
      this.api.createCommentInRequest(req_body).subscribe(res => {
        if (res == 'comment created sucessfully') {
          Swal.fire({
            title: 'Success',
            text: 'Comment Created Sucessfully !',
            icon: 'success',
            timer: 2000
          });
          this.cancelCreateComment();
          this.getRequestComments(this.requestKey);
          this.isLoading = false;
        }else {
          Swal.fire({
            title: 'Failed To Create',
            text: 'Please try again later',
            icon: 'error',
            timer: 2000
          });
          this.isLoading = false;
        }
        console.log(res);
      },err=>{
        Swal.fire({
          title: 'Failed To Create',
          text: 'Please try again later',
          icon: 'error',
        });
        this.isLoading = false;
      });

  }

  updateComment(comment,obj){
    this.isLoading = true;
      let req_obj = {
        'requestKey':this.requestKey,
        'jiracommentId':obj.commentId,
        'commentBody':comment
      };

      // console.log(req_obj);
      this.api.editComment(req_obj).subscribe(res => {
        if (res == 'comment Edited sucessfully') {
          Swal.fire({
            title: 'Success',
            text: 'Comment Updated Sucessfully !',
            icon: 'success',
            timer: 2000
          });
          this.getRequestComments(this.requestKey);
          this.isLoading = false;
          this.cancelCommentupdate();
        }else {
          Swal.fire({
            title: 'Failed To Update',
            text: 'Please try again later',
            icon: 'error',
            timer: 2000
          });
          this.isLoading = false;
        }
        console.log(res);
      },err=>{
        Swal.fire({
          title: 'Failed To Update',
          text: 'Please try again later',
          icon: 'error',
        });
        this.isLoading = false;
      });
  }



}
