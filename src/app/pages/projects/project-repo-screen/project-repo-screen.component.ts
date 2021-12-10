import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RestApiService } from '../../services/rest-api.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

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
  uploadedFiledata: any=[];
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
  displayedColumns3: string[] = ["check","category","fileName","uploadedDate","uploadedBy","fileSize","comments","action"];
  dataSource4:MatTableDataSource<any>;
  displayedColumns4: string[] = ["category","requestFrom","requestTo","comments","uploadedDate","action"];
  @ViewChild("sort12",{static:false}) sort12: MatSort;
  dataSource5:MatTableDataSource<any>;
  displayedColumns5: string[] = ["category","requestFrom","requestTo","comments","uploadedDate","action"];
  @ViewChild("sort13",{static:false}) sort13: MatSort;
  @ViewChild("sort11",{static:false}) sort11: MatSort;
  @ViewChild("paginator101",{static:false}) paginator101: MatPaginator;
  @ViewChild("paginator102",{static:false}) paginator102: MatPaginator;
  multiFilesArray: any[] = [];
  fileId: any;
  filedeleteflag:Boolean;
  filecheckeddisabled:boolean =false;
  filecheckflag:boolean = true;
  selectedFiles: any=[];
  fileList: File[] = [];
  listOfFiles: any[] = [];
  // resources_list: any=[];

  constructor(private modalService: BsModalService, private formBuilder: FormBuilder, private api:RestApiService, private route: ActivatedRoute, private spinner:NgxSpinnerService) { 
    
this.route.queryParams.subscribe(data=>{​​​​​​​​
  console.log(data);
  
  this.projectid=data.id;}​​​​​​​​)
  }

  ngOnInit() {

    this.loggedUser = localStorage.getItem("ProfileuserId");
    
    this.getallusers();

console.log(this.projectid);

 this.spinner.show();
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
    this.denyFileRequestmodalref = this.modalService.show(template,{class:"modal-lr"});

  }
  onDeleteItem(id,fileName){
    console.log("came to onDelete");
    let input=[{
      "id": id,
      "fileName":fileName
    }];
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.api.deleteFiles(input).subscribe( res =>{ 
          let status:any = res;
          Swal.fire({
            title: 'Success',
            text: ""+status.message,
            position: 'center',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#007bff',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok'
          }) 
          this.getFileDetails();
          this.spinner.hide();
          },err => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
            })
            this.spinner.hide();
                         
          })
      }
    });
    
    
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

    this.denyFileRequestForm.get("description").setValue("");
    this.denyFileRequestForm.reset();
  }
  uploadFile(template: TemplateRef<any>){

    this.getFileCategories();
    this.uploadFilemodalref = this.modalService.show(template,{class:"modal-lr"});
  }
  submitUploadFileForm(){
    this.uploadFilemodalref.hide();
    this.spinner.show();
     var fileData = new FormData();
     const files = this.fileList;
  for(var i=0;i< files.length;i++){
    fileData.append("filePath",files[i]);
  }
     fileData.append("category", this.uploadFileForm.get("fileCategory").value)
     fileData.append("comments", this.uploadFileForm.get("description").value)
    //  fileData.append("filePath", this.fileList)
     fileData.append("projectId", this.projectid)
     
   console.log("fileDattaa--- "+fileData);

    
 this.api.uploadProjectFile(fileData).subscribe(res => {
   //message: "Resource Added Successfully
   
   this.uploadFileForm.get("fileCategory").setValue("");
   this.uploadFileForm.get("description").setValue("");
   if(res.message!=undefined)
   {

    this.getFileDetails();
    this.spinner.hide();
     Swal.fire({
       title: 'Success',
       text: "File(s) Uploaded Successfully",
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
  this.uploadFileForm.reset();
      this.listOfFiles=[];
      this.fileList=[];
  this.spinner.hide();
  }

  chnagefileUploadForm(e){

    for (var i = 0; i <= e.target.files.length - 1; i++) {
      var selectedFile = e.target.files[i];
      this.fileList.push(selectedFile);
      var value = {
        // File Name 
         name: selectedFile.name,
         //File Size 
         size: selectedFile.size,
         
     };
      this.listOfFiles.push(value)
    }
    this.uploadFileForm.get("uploadFile").setValue(this.fileList);
    
    
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
      this.dataSource4.paginator=this.paginator102;
      let loggedUser=localStorage.getItem("ProfileuserId")
      let responseArray=this.requestedFiledata
      this.filterdArray=[]
      if(responseArray=[]){
        this.dataSource5= new MatTableDataSource(this.requestedFiledata);
        this.dataSource5.sort=this.sort13;
      }
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
    this.spinner.hide();
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

  getreducedValue(value) {​​​​​​​​
    if (value.length > 15)
    return value.substring(0,16) + '...';
    else
    return value;
  }​​​​​​​​
  onDownloadItem(fileName){
    this.spinner.show();
    let data=[fileName]
    this.api.downloadTaskAttachment(data).subscribe(data=>{
    let response:any=data
    var link = document.createElement('a');
    let extension=((((fileName.toString()).split("")).reverse()).join("")).split(".")[0].split("").reverse().join("")
    link.download = fileName;
    link.href =((extension=='png' ||extension=='jpg' ||extension=='svg' ||extension=='gif')?`data:image/${extension};base64,${response[0]}`:`data:application/${extension};base64,${response[0]}`) ;
    link.click();
    this.spinner.hide();
    })
    // this.fileId = element.id;
    // this.api.downloadFiles(this.fileId).subscribe(res => {
    //   const urlCreator = window.URL;
    //   const blob = new Blob([res], {
    //     type: 'PNG',
    //   });
    //   const url = urlCreator.createObjectURL(blob);
    //   const a: any = document.createElement('a');
    //   document.body.appendChild(a);
    //   a.style = 'display: none';
    //   a.href = url;
    //   a.download = element.fileName;
    //   a.click();
    //   window.URL.revokeObjectURL(url);
    //   // this.notifier.show({
    //   //   type: "success",
    //   //   message: "Downloading....",
    //   //   id: "123"
    //   // });
    // }, err => {
    //   Swal.fire("Error", "Error in file download","error");
    // }
    // )

    console.log("came to domwload file");
    
  }
  onDownloadSelectedItems(){
    let downloadSelectedfiles=[];
    this.uploadedFiledata.filter(product => product.checked==true).map(p=>{
     downloadSelectedfiles.push(p.fileName);
    });
    this.api.downloadTaskAttachment(downloadSelectedfiles).subscribe(data=>{
      let response:any=data
      // downloadSelectedfiles.forEach(fileName=>{
      for(let i=0;i<response.length;i++){
      var link = document.createElement('a');
      let extension=((((downloadSelectedfiles[i].toString()).split("")).reverse()).join("")).split(".")[0].split("").reverse().join("")
      link.download = downloadSelectedfiles[i];
      link.href =((extension=='png' ||extension=='jpg' ||extension=='svg' ||extension=='gif')?`data:image/${extension};base64,${response[i]}`:`data:application/${extension};base64,${response[i]}`) ;
      link.click();
      }
    })
      // })
  }

  filecheckAll(ev) {
    // this.uploadedFiledata.forEach(x =>
    //    x.checked = ev.target.checked);
    
    if(this.filecheckeddisabled==false)
      this.uploadedFiledata=this.uploadedFiledata.map(item=>{item.checked=true; return item});
    if(this.filecheckeddisabled==true)
      this.uploadedFiledata=this.uploadedFiledata.map(item=>{item.checked=false; return item});
    this.checktodelete();
  }

  checktodelete()
  {
    // const selectedresourcedata = this.uploadedFiledata.filter(product => product.checked).map(p => p.id);
    // if(selectedresourcedata.length>0)
    // {
    //   this.filedeleteflag=true;
    // }else
    // {
    //   this.filedeleteflag=false;
    // }
    this.uploadedFiledata.filter(item=>item.checked==true).length>0?(this.filecheckflag=false):(this.filecheckflag=true);
    this.uploadedFiledata.filter(item=>item.checked==true).length==this.uploadedFiledata.length?(this.filecheckeddisabled=true):(this.filecheckeddisabled=false);
  }

  removeallchecks()
  {
    // for(let i=0;i<this.uploadedFiledata.length;i++)
    // {
    //   this.uploadedFiledata[i].checked= false;
    // }
    // this.filecheckflag=false;
    this.uploadedFiledata=this.uploadedFiledata.map(item=>{item.checked=false;return item});
    this.checktodelete();
  }

  filechecktoggle(id, event)
  {
    this.uploadedFiledata.find(data=>data.id==id).checked=event.target.checked;
    this.checktodelete();
  }
  onDeleteSelectedItems(event){
    const selectedFiles = [];
    this.uploadedFiledata.filter(product => product.checked==true).map(p=>{
      let obj={
        "id": p.id,
        "fileName": p.fileName
      }
      selectedFiles.push(obj);
      });
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
          this.spinner.show();
          this.api.deleteFiles(selectedFiles).subscribe( res =>{ 
            let status:any = res;
            Swal.fire({
              title: 'Success',
              text: ""+status.message,
              position: 'center',
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#007bff',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ok'
            }) 
            this.getFileDetails();
            this.spinner.hide();
            },err => {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
              })
              this.spinner.hide();
                           
            })
        }
      });
      
  }

  removeSelectedFile(index) {
    // Delete the item from fileNames list
    this.listOfFiles.splice(index, 1);
    // delete file from FileList
    this.fileList.splice(index, 1);
   }
   uploadFilemodalCancel(){
     this.uploadFileForm.reset();
     this.listOfFiles=[];
     this.fileList=[];
     this.uploadFilemodalref.hide();
     
   }

}
