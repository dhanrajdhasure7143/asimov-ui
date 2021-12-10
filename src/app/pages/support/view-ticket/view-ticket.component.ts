import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestApiService } from '../../services/rest-api.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as JSZip from 'jszip';
import { saveAs } from "file-saver";
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-view-ticket',
  templateUrl: './view-ticket.component.html',
  styleUrls: ['./view-ticket.component.css']
})
export class ViewTicketComponent implements OnInit {
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
  comment: any=[];
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
  component_list: any[] = []
  isCommentEditable: any;
  comment_data: any;
  newComment_data: any;
  isAddInputenable: boolean = false;
  isEdit: boolean = true;
  displayedColumns = ['name', 'created', 'file_size', 'actions'];
  dataSource: MatTableDataSource<any>;
  listof_uploadFiles: any[];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  ticket_status: any;
  all_attachements:any[];
  attachment_namesArray:any[];
  ticket_created:any;

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
    // console.log("name", this.userName,"id", this.userId);
    
    this.activateRouter.queryParams.subscribe(res => {
      if (res) {
        this.requestKey = res.requestKey;
        // this.orgName = atob(res.org)
      }
    });

  }

  ngOnInit(): void {
    this.getComponentsList();
    this.getAllCustomerRequestsBykey();
    this.getAllImpactLevels();
    this.getAllSeverityLevels();
    this.getRequestComments(this.requestKey);
    this.getAttachmentsForCustomerRequest(this.requestKey);
  }

  async getComponentsList() {
    this.isLoading = true;
    await this.api.getListOfComponents().subscribe((res: any[]) => {
      this.component_list = res;
      // this.isLoading = false;
    })
  }

  async getAllCustomerRequestsBykey() {
    this.isLoading = true;
    let res_data: any;
    this.api.getselectedRequestKey(this.requestKey).subscribe(res=>{res_data=res
    // this.api.getAllCustomerRequestsByOrg(orgName).subscribe((res: any) => {
    //   res.forEach((e: any) => {
    //     res_array.push(e.jiraServiceDesk);
    //   });
      this.createRequestData = res_data;
      // this.createRequestData = this.createRequestData.filter((e: any) => e.requestKey == this.requestKey);
      this.summary = res_data.summary;
      this.description = res_data.description;
      this.component = res_data.component;
      this.impact = res_data.impact;
      this.severity = res_data.severity;
      this.priority = res_data.priority;
      this.ticket_status = res_data.status;
      this.ticket_created= res_data.createdBy
      // this.isLoading = false;
      setTimeout(() => {
        this.autoGrowTextZone('y');
      }, 100);
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

  getRequestComments(id) {
    this.api.getRequestComments(id).subscribe((res: any) => {
      this.commentRequest = res;
        this.comment = this.commentRequest;
    });
  }

  getAttachmentsForCustomerRequest(id: any) {
    this.isLoading = true;
    this.imageArray = [];
    this.api.getAttachmentsForCustomerRequest(id).subscribe((res: any) => {
      this.attachmentsForCustomerRequest = res;
      this.attachmentsForCustomerRequest.forEach(element => {
        let type=element.fileName.split('.')
        element['fileData'] = atob(element.fileData)
        element['fileSize'] = this.convertFileSize(element.fileSize);
        // element['imgSrc']=this.addImageSource(element.fileName)
        element['type']=type[type.length-1];
      });
      this.all_attachements=this.attachmentsForCustomerRequest
      this.dataSource = new MatTableDataSource(this.attachmentsForCustomerRequest);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      }, 100);
      this.isLoading = false;
    },err=>{
      this.isLoading=false;
    });
  }

  removeAllAttachmentsFromCustomerRequest() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      heightAuto: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.isLoading = true;
        this.api.removeAllAttachmentsFromCustomerRequest(this.requestKey).subscribe((res: any) => {
          if (res == 'removed attachments sucessfully') {
            Swal.fire({
              title: 'Success',
              text: 'Attachments Deleted Successfully !',
              icon: 'success',
              heightAuto: false,
            });
            this.getAttachmentsForCustomerRequest(this.requestKey);
            this.imageArray = [];
            this.fileName = [];
          } else {
            Swal.fire({
              title: 'Error occured',
              text: 'Please try again later !',
              icon: 'error',
              heightAuto: false
            });
          }
          this.isLoading = false;
        }, err => {
          Swal.fire({
            title: 'Error occured',
            text: 'Please try again later !',
            icon: 'error',
            heightAuto: false
          });
          this.isLoading = false;
        });
      }
    });

  }

  editComment1(index, data) {
    this.isCommentEditable = index;
    this.comment_data = data.comment;
    this.newComment_data = '';
    this.isAddInputenable = false;
    setTimeout(() => {
      this.autoGrowcommentsBox1();
    }, 100);
  }

  cancelCommentupdate() {
    this.isCommentEditable = null;
  }

  cancelCreateComment() {
    this.newComment_data = '';
    this.isAddInputenable = false;
      let element =document.getElementById("text_new1")
      element.style.height ="50px";
      // element.style.height = "px";
  }

  addCommentClick() {
    this.isAddInputenable = true;
    this.isCommentEditable = null;
    setTimeout(() => {
      var element = document.getElementById('actn_div');
    element.scrollIntoView({behavior: "auto",block: "center", inline: "nearest"});
    }, 50);
  }

  addNewComment(value) {
    this.isLoading = true;
    let req_body = {

      //'requestKey': this.requestKey,
      //"commentBody": value
      'requestKey': this.requestKey,
      'commentBody': value,
      "createdBy":this.userName
    };
    this.api.createCommentInRequest(req_body).subscribe(res => {
      if (res == 'comment created sucessfully') {
        Swal.fire({
          title: 'Success',
          text: 'Comment Created Successfully !',
          icon: 'success',
          heightAuto: false,
        });
        this.cancelCreateComment();
        this.getRequestComments(this.requestKey);
        this.isLoading = false;
      } else {
        Swal.fire({
          title: 'Failed To Create',
          text: 'Please try again later',
          icon: 'error',
          heightAuto: false,
        });
        this.isLoading = false;
      }
    }, err => {
      Swal.fire({
        title: 'Failed To Create',
        text: 'Please try again later',
        icon: 'error',
        heightAuto: false,
      });
      this.isLoading = false;
    });

  }

  updateComment(comment, obj) {
    this.isLoading = true;
    let req_obj = {
      'requestKey': this.requestKey,
      'jiracommentId': obj.commentId,
      'commentBody': comment
    };

    this.api.editComment(req_obj).subscribe(res => {
      if (res == 'comment Edited sucessfully') {
        Swal.fire({
          title: 'Success',
          text: 'Comment Updated Successfully !',
          icon: 'success',
          heightAuto: false
        });
        this.getRequestComments(this.requestKey);
        this.isLoading = false;
        this.cancelCommentupdate();
      } else {
        Swal.fire({
          title: 'Failed To Update',
          text: 'Please try again later',
          icon: 'error',
          heightAuto: false
        });
        this.isLoading = false;
      }
    }, err => {
      Swal.fire({
        title: 'Failed To Update',
        text: 'Please try again later',
        icon: 'error',
        heightAuto: false
      });
      this.isLoading = false;
    });
  }

  deleteComment(e) {
    let req_body = {
      "requestKey": this.requestKey,
      "jiracommentId": e.commentId
    }

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      heightAuto: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.isLoading = true;
        this.api.deleteComment(req_body).subscribe(res => {
          let status: any = res;
          Swal.fire({
            title: 'Success',
            text: 'Comment Deleted Successfully !',
            position: 'center',
            icon: 'success',
            showCancelButton: false,
            heightAuto: false,
            confirmButtonColor: '#007bff',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok'
          })
          this.isLoading = false;
          this.getRequestComments(this.requestKey);
        }, err => {
          this.getRequestComments(this.requestKey);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
            heightAuto: false,
          })
          this.isLoading = false;
        })
      }
    });

  }

  getFileName(e) {
    if (e && e.length >= 17)
      return e.substr(0, 17) + '...';
    return e;
  }

  convertFileSize(e) {
    let divided_size: any = String(e / 1024)
    if (e / 1024 <= 1024) {
      if (divided_size.includes('.')) {
        return divided_size.split('.')[0] + ' KB'
      } else {
        return divided_size + ' KB';
      }
    } else {
      let size1: any = String(divided_size / 1024)
      if (size1.includes('.')) {
        return size1.split('.')[0] + ' MB'
      } else {
        return size1 + ' MB';
      }
    }
  }

  addImageSource(fileName) {
    let filename_split = fileName.split('.');
    let file_type = filename_split[filename_split.length - 1]
    if (file_type == 'jpg' || file_type == 'PNG' || file_type == 'svg' || file_type == 'jpeg' || file_type == 'png') {
      return "/assets/images/Admin/image.svg"
    } else if (file_type == 'pdf') {
      return "/assets/images/Admin/pdf.svg"
    } else if (file_type == 'xlsx') {
      return "/assets/images/Admin/xlsx.svg"
    } else if (file_type == 'csv') {
      return "/assets/images/Admin/csv.svg"
    } else {
      return "/assets/images/Admin/fle.svg"
    }
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
          text: 'Summary Updated Successfully !',
          icon: 'success',
          heightAuto: false
        });
        this.getAllCustomerRequestsBykey();
        this.isLoading = false;
      }
      else {
        this.isLoading = false;
        Swal.fire({
          title: 'Failed To Update',
          text: 'Please try again later',
          icon: 'error',
          heightAuto: false
        });
      }
    },err=>{
      this.isLoading = false;
      Swal.fire({
        title: 'Failed To Update',
        text: 'Please try again later',
        icon: 'error',
        heightAuto: false
      });
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
          text: 'Description Updated Successfully !',
          icon: 'success',
          heightAuto: false
        });
        // this.getUserDetails(this.userId);
        this.getAllCustomerRequestsBykey();
        this.isLoading = false;
      }
      else {
        Swal.fire({
          title: 'Failed To Update',
          text: 'Please try again later',
          icon: 'error',
          heightAuto: false
        });
        this.isLoading = false;
      }
    });
  }

  removeAttachmentsFromCustomerRequest(data) {
    let record = {
      "fileList": [data.fileVersion],
      "requestKey": this.requestKey
    }

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      heightAuto: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.isLoading = true;
        this.api.removeAttachmentsFromCustomerRequest(record).subscribe((res: any) => {
          if (res == 'removed attachments sucessfully') {
            Swal.fire({
              title: 'Success',
              text: 'Attachment Deleted Successfully !',
              icon: 'success',
              heightAuto: false
            });
            this.getAttachmentsForCustomerRequest(this.requestKey);
            this.isLoading = false;
          } else {
            Swal.fire({
              title: 'Error occured',
              text: 'Please try again later !',
              icon: 'error',
              heightAuto: false
            });
            this.isLoading = false;
          }
        }, err => {
          Swal.fire({
            title: 'Error occured',
            text: 'Please try again later !',
            icon: 'error',
            heightAuto: false
          });
          this.isLoading = false;
        });
      }
    });
  }

  file(event) {
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
    this.api.createAttachmentsForATicket(formdata).subscribe(res => {
      if (res == 'created attachment sucessfully') {
        this.getAttachmentsForCustomerRequest(this.requestKey);
        Swal.fire({
          title: 'Success',
          text: 'Attachment Added Successfully !',
          icon: 'success',
          heightAuto: false,
        });
        // this.isLoading = false;
      }
      else {
        Swal.fire({
          title: 'Failed',
          text: 'Please try again later',
          icon: 'error',
          heightAuto: false,
        });
        this.isLoading = false;
      }
    }, err => {
      Swal.fire({
        title: 'Failed',
        text: 'Please try again later',
        icon: 'error',
        heightAuto: false
      });
      this.isLoading = false;
    });
  }

  getTime(e){
    let date1:any = new Date();
    let date2:any = new Date(e);
    const diffTime = Math.abs(date2 - date1);
    // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    if(this.timeConversion(diffTime).includes('Days')){
      return e
    }else{
      return this.timeConversion(diffTime)
    }
  }

  timeConversion(millisec) {    //convert time duration millisec to proper formate
    var seconds:any = (millisec / 1000).toFixed(1);
    var minutes:any = (millisec / (1000 * 60)).toFixed(1);
    var hours:any = (millisec / (1000 * 60 * 60)).toFixed(1);
    var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);
    
    if (seconds < 60) {
      return '1 Min ago'
      // if(seconds.includes('.')){
      //   return seconds.split('.')[0] + " Sec ago";
      // }else{
      //   return seconds + " Sec ago";
      // }
    } else if (minutes < 60) {
      if(minutes.includes('.')){
        return minutes.split('.')[0] + " Min ago";
      }else{
        return minutes + " Min ago";
      }
    } else if (hours < 24) {
      if(hours.includes('.')){
        return hours.split('.')[0] + " Hrs ago";
      }else{
        return hours + " Hrs ago";
      }
    } else {
        return days + " Days"
    }
  }

  cancelSummary() {
    this.summary = this.createRequestData.summary;
    let element =document.getElementById("text_summary")
    element.style.height ="50px";
  }
  cancelDescription() {
    this.description = this.createRequestData.description;
    setTimeout(() => {
    this.autoGrowTextZone('z');
    }, 100);
  }
  
autoGrowTextZone(value) {
  // let e = document.getElementById('text_new');
  // e.style.height = "0px";
  // e.style.height = (e.scrollHeight + 10)+"px";
  let element =document.getElementById("text_new")
    element.style.height ="5px";
    element.style.height = (element.scrollHeight+5)+"px";
    let ele=document.getElementById('CreateTkt-btns1')
    if(value=='x')
    ele.scrollIntoView({behavior: "auto",block: "end", inline: "nearest"});
    if(value=='z')
    element.scrollIntoView();
}
autoGrowcommentsBox() {
  let element =document.getElementById("text_new1")
    element.style.height ="5px";
    element.style.height = (element.scrollHeight+10)+"px";
}
autoGrowcommentsBox1() {
  let element =document.getElementById("text_new2")
    element.style.height ="5px";
    element.style.height = (element.scrollHeight+10)+"px";
}
autoGrowSummaryTextZone() {
  let element =document.getElementById("text_summary")
    element.style.height ="5px";
    element.style.height = (element.scrollHeight+10)+"px";
}

  downloadAllFiles(){
    this.attachment_namesArray=[]
    this.all_attachements.forEach((e,i)=>{
      let name= e.fileName.split('.')
      if(this.attachment_namesArray.includes(e.fileName)){
        this.attachment_namesArray.push(name[0]+'('+i+').'+name[1]);
        e["file_name"]=name[0]+'('+i+').'+name[1]
      }else{
        this.attachment_namesArray.push(e.fileName);
        e["file_name"]=e.fileName
      }
    })
    let _self=this;
    var zip = new JSZip();
    this.all_attachements.forEach((value,i) => {
      if(value.type=='jpg'|| 'PNG' || 'svg' || 'jpeg' || 'png'){
      zip.file(value.file_name,value.fileData,{base64:true});
      }else{
      zip.file(value.file_name,value.fileData);
      }
    });
    // zip.file(this.all_attachements[1].file_name,this.all_attachements[1].fileData,{base64:true});
    zip.generateAsync({ type: "blob" }).then(function (content) {
      FileSaver.saveAs(content, _self.requestKey+".zip");
    });
  }
  getletters(name){
    let split_name=name.split(' ');
    // return name;
    let user_letters=split_name[0].charAt(0)+split_name[split_name.length-1].charAt(0)
  return user_letters
  }


}