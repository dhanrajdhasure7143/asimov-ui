import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RestApiService } from '../../services/rest-api.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-project-repo-screen',
  templateUrl: './project-repo-screen.component.html',
  styleUrls: ['./project-repo-screen.component.css']
})
export class ProjectRepoScreenComponent implements OnInit {
  projects_toggle:Boolean=false;
  createRequestmodalref: BsModalRef;
  denyFileRequestmodalref : BsModalRef;
  uploadFilemodalref: BsModalRef;
  projectList:any[]=[];
  pendingList:any[]=[];
  denyFileRequestForm:FormGroup;
  uploadFileForm:FormGroup;
  fileUploadData: any;
  projectid: any;
  uploadedFiledata: any;
  requestedFiledata: any;
  userslist: any[] = [];
  isDeny: boolean = false;
  isNotFromorTo: boolean = false;
  loggedUser: any;
  revokeorDenyValue: any;
  denyOrrevokeData: any;
  filecategories: any;
  filterdArray: any[];
  dataSource3:MatTableDataSource<any>;
  displayedColumns3: string[] = ["category","fileName","uploadedDate","uploadedBy","fileSize","comments","action"];
  dataSource4:MatTableDataSource<any>;
  displayedColumns4: string[] = ["category","requestFrom","requestTo","comments","uploadedDate","action"];
  @ViewChild("sort12",{static:false}) sort12: MatSort;
  dataSource5:MatTableDataSource<any>;
  displayedColumns5: string[] = ["category","requestFrom","requestTo","comments","uploadedDate","action"];
  @ViewChild("sort13",{static:false}) sort13: MatSort;
  @ViewChild("sort11",{static:false}) sort11: MatSort;
  @ViewChild("paginator101",{static:false}) paginator101: MatPaginator;
  constructor(private modalService: BsModalService, private formBuilder: FormBuilder, private api:RestApiService, private route: ActivatedRoute) { 
    
this.route.queryParams.subscribe(data=>{​​​​​​​​
  console.log(data);
  
  this.projectid=data.id;}​​​​​​​​)
  }

  ngOnInit() {

    this.loggedUser = localStorage.getItem("ProfileuserId");
    
    this.getallusers();

console.log(this.projectid);

 
this.getFileDetails();



    this.projectList=[{category:'PDF', fullname:'peter', uploaded:'jan-12-2021', uploadedby:'john', filesize: '100kb',comments:'reviewed'},
 {category:'EXCEL', fullname:'john', uploaded:'july-2-2021', uploadedby:'peter', filesize: '130kb',comments:'reviewed'},
 {category:'PDF', fullname:'peter', uploaded:'jan-12-2021', uploadedby:'john', filesize: '100kb',comments:'reviewed'},
 {category:'PDF', fullname:'john', uploaded:'july-2-2021', uploadedby:'peter', filesize: '130kb',comments:'reviewed'}];
 
 this.pendingList=[{filecategory:'anlysis', requestfrom:'peter',requestto:'john', description:'now use LoremIpsum as their default moal text', requestdate:'16-jan-2021'},
 {filecategory:'design', requestfrom:'john',requestto:'peter', description:'now use LoremIpsum as their default moal text', requestdate:'16-june-2021'},
 {filecategory:'anlysis', requestfrom:'peter',requestto:'john', description:'now use LoremIpsum as their default moal text', requestdate:'16-jan-2021'},
 {filecategory:'design', requestfrom:'john',requestto:'peter', description:'now use LoremIpsum as their default moal text', requestdate:'16-june-2021'}]
  
 this.denyFileRequestForm=this.formBuilder.group({
  
  description: ["", Validators.compose([Validators.required, Validators.maxLength(200)])],
 })

 this.uploadFileForm=this.formBuilder.group({
  fileCategory: ["", Validators.compose([Validators.required, Validators.maxLength(200)])],
  description: ["", Validators.compose([Validators.required, Validators.maxLength(200)])],
  uploadFile: ["", Validators.compose([Validators.required])],
 })


}
  

  createUploadRequest(createmodal){
    this.createRequestmodalref=this.modalService.show(createmodal,{class:"modal-lr"})
  }
  
  denyFileRequest(template: TemplateRef<any>, ele) {
    this.denyOrrevokeData = ele;
    if(ele.requestFrom == this.loggedUser){
     this.isDeny = false;
     this.revokeorDenyValue = ele.requestTo;
    }else if(ele.requestTo == this.loggedUser){
      this.isDeny = true;
      this.revokeorDenyValue = ele.requestFrom;
    }else{
      
    }
    this.denyFileRequestmodalref = this.modalService.show(template);

  }
  onDeleteItem(){
    
  }
  sendDenyFileReq(){

    var objData = {
      "category": this.denyOrrevokeData.category,
      "comments": this.denyFileRequestForm.get("description").value,
      "id": this.denyOrrevokeData.id,
      "projectId": this.projectid,
      "requestFrom": this.denyOrrevokeData.requestFrom,
      "requestTo": this.denyOrrevokeData.requestTo
    }

    this.api.revokeOrDenyFileRequest(objData).subscribe(res => {
      this.denyFileRequestmodalref.hide();
      if(res.message!=undefined)
      {
        this.denyFileRequestForm.get("description").setValue("");
        let status: any= res;
       this.getFileDetails();
        Swal.fire({
          title: 'Success',
          text: ""+status.message,
          position: 'center',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#007bff',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ok'
      }).then((result) => {
       // this.resettask();
        
        
      }) 
        
      }
      else
      Swal.fire("Error",res.message,"error");

    })

  }
  clearMsg(){

  }
  uploadFile(template: TemplateRef<any>){

    this.getFileCategories();
    this.uploadFilemodalref = this.modalService.show(template);
  }
  submitUploadFileForm(){

    var fileData = new FormData();
    
    fileData.append("category", this.uploadFileForm.get("fileCategory").value)
     fileData.append("comments", this.uploadFileForm.get("fileCategory").value)
     fileData.append("filePath", this.fileUploadData)
     fileData.append("projectId", this.projectid)
   console.log("fileDattaa--- "+fileData);

    
 this.api.uploadProjectFile(fileData).subscribe(res => {
   //message: "Resource Added Successfully
   this.uploadFilemodalref.hide();
   if(res.message!=undefined)
   {
    this.getFileDetails();
     Swal.fire({
       title: 'Success',
       text: "File Uploaded Successfully",
       position: 'center',
       icon: 'success',
       showCancelButton: false,
       confirmButtonColor: '#007bff',
       cancelButtonColor: '#d33',
       confirmButtonText: 'Ok'
   }).then((result) => {
    // this.resettask();
     
     
   }) 
     
   }
   else
   Swal.fire("Error",res.message,"error");
   
 })
  }

  chnagefileUploadForm(e){

    this.fileUploadData = <File> e.target.files[0]
    console.log(this.fileUploadData);
    
    
  }
  getFileDetails(){
    this.api.getFileDetails(this.projectid).subscribe(data =>{
      this.uploadedFiledata=data.uploadedFiles.reverse();
      console.log(this.uploadedFiledata);
      this.dataSource3= new MatTableDataSource(this.uploadedFiledata);
      this.dataSource3.sort=this.sort11;
      this.dataSource3.paginator=this.paginator101;
      this.requestedFiledata=data.requestedFiles.reverse();
      console.log(this.requestedFiledata);
      this.dataSource4= new MatTableDataSource(this.requestedFiledata);
      this.dataSource4.sort=this.sort12;
      let loggedUser=localStorage.getItem("ProfileuserId")
      let responseArray=this.requestedFiledata
      this.filterdArray=[]
      responseArray.forEach(e=>{
        if(e.requestTo==loggedUser || e.requestFrom==loggedUser){
          this.filterdArray.push(e)
          
        }
        console.log(this.filterdArray);
        this.dataSource5= new MatTableDataSource(this.filterdArray);
        this.dataSource5.sort=this.sort13;
      })
      console.log("req-Data",this.requestedFiledata);
      console.log("upload-Data",this.uploadedFiledata);
      
    })
  }
  getallusers()
  {
    let tenantid=localStorage.getItem("tenantName")
    this.api.getuserslist(tenantid).subscribe(item=>{
      let users:any=item
      this.userslist=users;
      
    })
  }
  getUserName(event){
    var userName; 
    this.userslist.forEach(element => {
      if(element.userId.userId == event){
        
        userName =  element.userId.firstName+" "+element.userId.lastName
      }
    });
    return userName;
  }
  uploadRequetedFile(evnt, data){

    var fileData = new FormData();
    
    fileData.append("category", data.category)
     fileData.append("comments", data.comments)
     fileData.append("id", data.id)
     fileData.append("filePath", evnt.target.files[0])
     fileData.append("projectId", this.projectid)
   console.log("fileDattaa--- "+fileData);

    
 this.api.uploadProjectFile(fileData).subscribe(res => {
   //message: "Resource Added Successfully
   console.log(res);
   
   this.getFileDetails();
   if(res.message!=undefined)
   {
    
     Swal.fire({
       title: 'Success',
       text: "File Uploaded Successfully",
       position: 'center',
       icon: 'success',
       showCancelButton: false,
       confirmButtonColor: '#007bff',
       cancelButtonColor: '#d33',
       confirmButtonText: 'Ok'
   }).then((result) => {
    // this.resettask();
     
     
   }) 
     
   }
   else
   Swal.fire("Error",res.message,"error");
   
 })

  }
  onrequestFileData(en){
    console.log("came here"+ en);

    if(en){
            
      this.getFileDetails();
    }

  }
  getFileCategories(){
    this.api.getFileCategories().subscribe(data =>{
      this.filecategories=data;
  })
  }
}
