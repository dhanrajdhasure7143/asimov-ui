import { formatDate } from '@angular/common';
import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Base64 } from 'js-base64';
import { DataTransferService } from '../../services/data-transfer.service';
import { RestApiService } from '../../services/rest-api.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatMenuModule, MatButtonModule } from '@angular/material'; 
import moment from 'moment';


@Component({
  selector: 'app-project-details-screen',
  templateUrl: './project-details-screen.component.html',
  styleUrls: ['./project-details-screen.component.css']
})
export class ProjectDetailsScreenComponent implements OnInit {
  projects_toggle:Boolean=false;
  projectData: any;
  projectDetails: any;

  lastname: string;
  firstname: string;
  firstletter: string;
  retrievedImage: any;
  base64Data: any;
  public retrieveResonse: any;
  public profilePicture:boolean=false;
  tenantId: string;
 role: string;
  resourcetablefirstname: any;
  resourcetablelastname: any;
  process_names: any;
  selectedcategory: number;
  selectedvalue: any;
  dataSource2:MatTableDataSource<any>;
  dataSource9:MatTableDataSource<any>;
  categaoriesList: any;
  selected_process_names: any;
  displayedColumns: string[] = ["taskCategory","taskName","resources","status","percentageComplete","lastModifiedTimestamp","lastModifiedBy", "createdBy","action"];
  dataSource6:MatTableDataSource<any>;
  displayedColumns6: string[] = ["check","firstName","displayName","user_Id","last_active"];
  @ViewChild("sort14",{static:false}) sort14: MatSort;
  @ViewChild("sort11",{static:false}) sort11: MatSort;
  @ViewChild("paginator104",{static:false}) paginator104: MatPaginator;
  displayedColumns9: string[] = ["fileName","uploadedBy","uploadedDate","fileSize"];
  @ViewChild("sort16",{static:false}) sort16: MatSort;
  @ViewChild("paginator109",{static:false}) paginator109: MatPaginator;
  @ViewChild("sort12",{static:false}) sort12: MatSort;
  dataSource5:MatTableDataSource<any>;
  @ViewChild("sort13",{static:false}) sort13: MatSort;
  @ViewChild("sort10",{static:false}) sort10: MatSort;
  @ViewChild("paginator101",{static:false}) paginator101: MatPaginator;
  responsedata: any;
  bot_list: any=[];
  automatedtask: any;
  createtaskmodalref: BsModalRef;
  addresourcemodalref: BsModalRef;
  project_id: any;
  public tasks: any=[];
  multiFilesArray: any[] = [];
  public users_list:any=[];
  public selectedTab=0;
 public check_tab=0;
 slider: number = 3;
percentageComplete: number;
 options: any = {
   floor: 0,
   ceil: 100,
   horizontal: true
 };
 updatetaskForm: FormGroup;
 uploadtaskFileForm: FormGroup;
 updatetaskmodalref: BsModalRef;
 uploadtaskFilemodalref: BsModalRef;
 selectedtaskdata: any;
 currentdate: number;
 editcomment:any;
 showeditcomment:boolean=false;
 commentnumber:number;
 fileUploadData: any;
 selectedtaskfileupload: any;
 editdata:Boolean=false;
 resources:any=[];
  
  
  userid: any;
 
  rolelist: any=[];
  userrole: any=[];
  public rolename: any;
  roles: any;
  
  useremail: any;
  processes: any;
  taskdata: any;
  project: Object;
  modeldisable: boolean=false;
  public taskcomments: any=[];
  multicomments: any[];
  taskattacments: Object;
  taskcomments_list:any[]=[];
  taskhistory: any=[];
  filecategories: any;
  programId:any;
  taskresourceemail: any;
  resourceslength: any;
  latestFiveDocs: any;
  uploadFilemodalref: BsModalRef;
  uploadFileForm:FormGroup;
  uploadFileFormDetails:FormGroup;
  public Resourcedeleteflag:Boolean;
  public Resourcecheckeddisabled:boolean =false;
  public Resourcecheckflag:boolean = false;
  resources_list: any=[];
  projectid:any;
  uploadedFiledata: any;
  dataSource3:MatTableDataSource<any>;
  dataSource4: any;
  filterdArray: any[];
  requestedFiledata: any;
  fileList: File[] = [];
  listOfFiles: any[] = [];
  owner_letters: any;
  public isButtonVisible = false;
  public userRole:any = [];
  public userName:any;
  customUserRole: any;
  enableeditproject: boolean=false;
  enablecreatetask: boolean=false;
  enableedittask: boolean=false;
  enabledeletetask: boolean=false;
  mindate= moment().format("YYYY-MM-DD");
  projectenddate:any;
  projectStartDate:any;
  initiatives: any;
  loginresourcecheck: boolean=false;
  constructor(private dt:DataTransferService,private route:ActivatedRoute, private rpa:RestApiService,
    private modalService: BsModalService,private formBuilder: FormBuilder,private router: Router,
    private spinner:NgxSpinnerService) { }


  ngOnInit() {
    localStorage.setItem('project_id',null);
    localStorage.setItem('bot_id',null);
    $('.link').removeClass('active');
    $('#projects').addClass("active");
    this.updatetaskForm=this.formBuilder.group({
     // taskCategory: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
     priority: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
     startDate: ['', Validators.compose([Validators.maxLength(200)])],
     resources: ['', Validators.compose([Validators.maxLength(200)])],
    // taskName: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    // timeEstimate: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
     endDate: ['', Validators.compose([Validators.maxLength(200)])],
     approvers: ['', Validators.compose([Validators.maxLength(200)])],
     status:["",Validators.compose([Validators.required, Validators.maxLength(50)])],
     description: ["", Validators.compose([Validators.maxLength(150)])],
     comments: ['',Validators.compose([Validators.maxLength(200)])],
     summary: ['', Validators.compose([Validators.maxLength(200)])],
     percentageComplete: ['', Validators.compose([Validators.maxLength(200)])],
     editcomment: ['', Validators.compose([Validators.maxLength(200)])],
      })

      this.uploadtaskFileForm=this.formBuilder.group({
        category: ["", Validators.compose([Validators.required, Validators.maxLength(200)])],
        description: ["", Validators.compose([Validators.required, Validators.maxLength(200)])],
        filePath: ["", Validators.compose([Validators.required])],
       })
       this.uploadFileFormDetails=this.formBuilder.group({
        fileCategory: ["", Validators.compose([Validators.required, Validators.maxLength(200)])],
        description: ["", Validators.compose([Validators.required, Validators.maxLength(200)])],
        uploadFile: ["", Validators.compose([Validators.required])],
       })
    this.dt.changeParentModule({"route":"/pages/projects/projects-list-screen", "title":"Projects"});
    this.dt.changeChildModule(undefined);

    this.userRole = localStorage.getItem("userRole");
    this.userName=localStorage.getItem("firstName")+" "+localStorage.getItem("lastName");
    // this.userRole = this.userRole.split(',');
    // this.isButtonVisible = this.userRole.includes('SuperAdmin') || this.userRole.includes('Admin') || this.userRole.includes('Process Owner')
    // || this.userRole.includes('Process Architect') || this.userRole.includes('System Admin') 
    // || this.userRole.includes('Process Analyst')|| this.userRole.includes('RPA Developer');
    
    this.rpa.getCustomUserRole(2).subscribe(role=>{
      this.customUserRole=role;
      let element=[]
      for (let index = 0; index < this.customUserRole.message.length; index++) {
       element = this.customUserRole.message[index].permission;
        element.forEach(element1 => {
         if(element1.permissionName.includes('Project_Edit')){
           this.enableeditproject=true;
         }else if(element1.permissionName.includes('Task_Create')){
          this.enablecreatetask=true;
         }else if(element1.permissionName.includes('Task_Edit')){
          this.enableedittask=true;
         }else if(element1.permissionName=='Task_Delete'){
          this.enabledeletetask=true;
         }
        });
      }
        })

        
    this.getallusers();
    this.projectdetails();
    this.getallprocesses();
    setTimeout(() => {
      this.getImage();
      this.profileName();
        },2000);
       
      
      //  this.getallusers();
        this.getInitiatives();
        this.Resourcedeleteflag=false;
  }

  onTabChanged(event)
  {
    this.check_tab=event.index;
  }

  ResourcecheckAllCheckBox(ev) {
    this.resources_list.forEach(x =>
       x.checked = ev.target.checked);
    this.checktodelete();
  }
  uploadFile(template: TemplateRef<any>){
   
    this.getFileCategories();
    this.uploadFilemodalref = this.modalService.show(template,{class:"modal-lr"});
  }
  
  submitUploadFileFormattachment(){
    this.uploadFilemodalref.hide();
    this.spinner.show();
    var fileData = new FormData();
    const files = this.fileList;
    for(var i=0;i< files.length;i++){
      fileData.append("filePath",files[i]);
    }
    fileData.append("category", this.uploadFileFormDetails.get("fileCategory").value)
     fileData.append("comments", this.uploadFileFormDetails.get("description").value)
    //  fileData.append("filePath", this.fileUploadData)
     fileData.append("projectId", this.project_id)

    
 this.rpa.uploadProjectFile(fileData).subscribe(res => {
   //message: "Resource Added Successfully
   
   this.uploadFileFormDetails.get("fileCategory").setValue("");
   this.uploadFileFormDetails.get("description").setValue("");
   if(res.message!=undefined)
   {
    
    this.spinner.hide();
    this.getLatestFiveAttachments(this.project_id)

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
    this.resetdocform();
     
   }) 
     
   }
   else
   Swal.fire("Error",res.message,"error");
   
 })
 this.uploadFileFormDetails.reset();
        this.listOfFiles = [];
        this.fileList=[];
 this.spinner.hide();
  }
  resetdocform() {
    

    this.uploadFileFormDetails.reset();
    this.uploadFileFormDetails.get("category").setValue("");
    this.uploadFileFormDetails.get("comments").setValue("");

    
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
      }
      this.listOfFiles.push(value)
    }
    this.uploadtaskFileForm.get("filePath").setValue(this.fileList);
    this.uploadFileFormDetails.get("uploadFile").setValue(this.fileList);
    // this.fileUploadData = <File> e.target.files[0]
    // this.multiFilesArray.push(
    //   e.target.files[0]
    // )
    
    
  }
  removeSelectedFile(index) {
    // Delete the item from fileNames list
    this.listOfFiles.splice(index, 1);
    // delete file from FileList
    this.fileList.splice(index, 1);
   }
  getFileDetails(){
    this.rpa.getFileDetails(this.projectid).subscribe(data =>{
      this.uploadedFiledata=data.uploadedFiles.reverse();
      console.log(this.uploadedFiledata);
      this.dataSource3= new MatTableDataSource(this.uploadedFiledata);
      this.dataSource3.sort=this.sort11;
      this.dataSource3.paginator=this.paginator101;
      this.requestedFiledata=data.requestedFiles.reverse();
      this.dataSource4= new MatTableDataSource(this.requestedFiledata);
      this.dataSource4.sort=this.sort12;
      let loggedUser=localStorage.getItem("ProfileuserId")
      let responseArray=this.requestedFiledata
      this.filterdArray=[]
      responseArray.forEach(e=>{
        if(e.requestTo==loggedUser || e.requestFrom==loggedUser){
          this.filterdArray.push(e)
          
        }
        this.dataSource5= new MatTableDataSource(this.filterdArray);
        this.dataSource5.sort=this.sort13;
      })
    
      
    })
    this.spinner.hide();
  }
  getreducedValue(value) {​​​​​​​​
    if (value.length > 15)
    return value.substring(0,16) + '...';
    else
    return value;
  }​​​​​​​​
  downloadExcel(){
    console.log(this.projectDetails);
    this.spinner.show();
    this.rpa.exportproject(this.project_id).subscribe(data=>{
      let response:any=data;
      if(response.errorMessage==undefined)
      {
           var link = document.createElement('a');
           link.download = this.projectDetails.projectName;
           link.href =(`data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${response.encryptedString}`) ;
          link.click();
          Swal.fire("Success", response.message,"success");
          this.spinner.hide();
      }
      else
      {
        Swal.fire("Error", response.errorMessage,"error");
      }
    })
    this.spinner.hide();
  }
  checktodelete()
  {
    const selectedresourcedata = this.resources_list.filter(product => product.checked).map(p => p.id);
    if(selectedresourcedata.length>0)
    {
      this.Resourcedeleteflag=true;
    }else
    {
      this.Resourcedeleteflag=false;
    }
  }

  removeallchecks()
  {
    for(let i=0;i<this.resources_list.length;i++)
    {
      this.resources_list[i].checked= false;
    }
    this.Resourcecheckflag=false;
  }

  ResourcecheckEnableDisableBtn(id, event)
  {
    this.resources_list.find(data=>data.id==id).checked=event.target.checked;
    this.checktodelete();
  }
  inputNumberOnly(event){
    let numArray= ["0","1","2","3","4","5","6","7","8","9","Backspace","Tab"]
    let temp =numArray.includes(event.key); //gives true or false
   if(!temp){
    event.preventDefault();
   } 
  }
  getTaskandCommentsData(){
    this.rpa.gettaskandComments(this.project_id).subscribe(data =>{
      this.tasks=data;
      this.dataSource2= new MatTableDataSource(this.tasks);
      this.dataSource2.sort=this.sort10;
      this.dataSource2.paginator=this.paginator101;
    })
  }

  getTaskAttachments(){
    this.rpa.getTaskAttachments(this.selectedtaskdata.projectId,this.selectedtaskdata.id).subscribe(data =>{
      this.taskattacments=data
    })
  }

  getLatestFiveAttachments(projectid){
    this.rpa.getLatestfiveAttachments(projectid,"UTC").subscribe(data =>{
      this.latestFiveDocs=data;
      this.dataSource9= new MatTableDataSource(this.latestFiveDocs);
      this.dataSource9.sort=this.sort16;
      this.dataSource9.paginator=this.paginator109;
      })
    }

      getUserRole(){
    let user=this.users_list.find(item=>item.userId.userId==this.selectedtaskdata.resources);
    this.userid=user.userId.userId
    this.rpa.getRole(this.userid).subscribe(data =>{
      this.userrole=data
      for (let index = 0; index <= this.userrole.message.length; index++) {
        this.rolename =  this.userrole.message[index];

        this.rolelist.push(this.rolename.name)
        this.roles=this.rolelist.join(',')
        console.log("role", this.rolelist)
      }
      //this.rolename=this.userrole.message[0].name
     
    })
  }

  navigatetorepopage(){
    let encoded=Base64.encode(JSON.stringify(this.projectDetails));
    let project={id:encoded}
    this.router.navigate(['/pages/projects/projectreposcreen',project])
  }

  applyFilter(filterValue:any) {
    let processnamebyid=this.process_names.find(data=>filterValue==data.processId);
    this.selectedcategory=parseInt(processnamebyid.categoryId);
    this.selectedvalue=processnamebyid.processId;
    filterValue = processnamebyid.processName.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource2= new MatTableDataSource(this.automatedtask);
        this.dataSource2.sort=this.sort10;
        this.dataSource2.paginator=this.paginator101;
  }

 
projectdetails(){​​​​​​
  const userid=localStorage.getItem('ProfileuserId');
this.spinner.show()
this.route.queryParams.subscribe(data=>{​​​​​​
let paramsdata:any=data
this.project_id=paramsdata.id
this.editdata=false;
this.rpa.getProjectDetailsById(paramsdata.id).subscribe( res=>{​​​​​​
this.spinner.hide();
this.projectDetails=res
this.projectenddate=moment(this.projectDetails.endDate).format("YYYY-MM-DD");
this.projectStartDate = moment(this.projectDetails.startDate).format("YYYY-MM-DD");
console.log(this.projectDetails);

if(this.projectDetails){​​​​​​
let usr_name=this.projectDetails.owner.split('@')[0].split('.');
this.owner_letters=usr_name[0].charAt(0)+usr_name[1].charAt(0);
console.log(this.owner_letters);
}​​​​​​

//this.project_id=this.projectDetails.id
let users:any=[]
if(this.projectDetails.resource.length!=0){​​​​​​
this.projectDetails.resource.forEach(item=>{​​​​​​
users.push(item.resource)
 }​​​​​​)
this.resources=users
console.log(this.resources)
this.loginresourcecheck=this.resources.find(item2=>item2==userid);
console.log(this.loginresourcecheck)
 }​​​​​​
else{​​​​​​
this.resources=this.users_list
console.log(this.resources)
 }​​​​​​ 
 }​​​​​​)
 
this.getTaskandCommentsData();
this.getLatestFiveAttachments(this.project_id)
paramsdata.programId==undefined?this.programId=undefined:this.programId=paramsdata.programId;
 }​​​​​​);

}​​​​​​

  profileName(){
    setTimeout(() => {
    this.firstname=this.resourcetablefirstname;
      this.lastname=this.resourcetablelastname;
      var firstnameFirstLetter=this.firstname.charAt(0)
      var lastnameFirstLetter=this.lastname.charAt(0)
      this.firstletter=firstnameFirstLetter+lastnameFirstLetter
    }, 2000);
  }

  getImage() {
    
    const userid=localStorage.getItem('ProfileuserId');
    this.rpa.getUserDetails(userid).subscribe(res => {
      this.retrieveResonse = res;
      setTimeout(() => {
                this.resourcetablefirstname=this.retrieveResonse.firstName
                this.resourcetablelastname=this.retrieveResonse.lastName
              }, 500);
              if(this.retrieveResonse.image==null||this.retrieveResonse.image==""){
               this.profileName();
                this.profilePicture=false;
              }
              else{
                this.profilePicture=true;
              }
              this.base64Data= this.retrieveResonse.image;
             // console.log("image",this.base64Data);
             // localStorage.setItem('image', this.base64Data);
              this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
             // console.log(this.retrievedImage);
            }
          );

     
      }


      getallusers()
      {
        let tenantid=localStorage.getItem("tenantName")
        this.rpa.getuserslist(tenantid).subscribe(response=>{
        console.log(response);
        
          this.users_list=response;
          let users:any=[]
          this.projectDetails.resource.forEach(item=>{
              if(this.users_list.find(item2=>item2.userId.userId==item.resource)!=undefined)
                users.push(this.users_list.find(item2=>item2.userId.userId==item.resource))
         })
         this.resources_list=users
         if(this.resources_list.length>0){
          this.Resourcecheckeddisabled= false;
        }
        else
        {
          this.Resourcecheckeddisabled = true;
        }
        let users_updateddata=users
         this.resourceslength=users.length
         users_updateddata.forEach(element => {
           element["firstName"]=element.userId.firstName
           element["lastName"]=element.userId.lastName
           element["displayName"]=element.roleID.displayName
           element["user_Id"]=element.userId.userId
         });
          this.dataSource6= new MatTableDataSource(users_updateddata);
          this.dataSource6.sort=this.sort14;
          this.dataSource6.paginator=this.paginator104;
          this.getTaskandCommentsData();
          this.getLatestFiveAttachments(this.project_id);
        })
      }

      getallprocesses()
      {
        this.rpa.getprocessnames().subscribe(processnames=>{
          let resp:any=[]
          resp=processnames
          this.processes=resp.filter(item=>item.status=="APPROVED");
        })
      }


      createtask(createmodal){
        this.createtaskmodalref=this.modalService.show(createmodal,{class:"modal-lg"})
      }

      updatetaskdata(updatetaskmodal,data)
      {  
        this.taskcomments=[];
        this.taskhistory=[];
        this.rolelist=[];
       this.selectedtaskdata=data
       // this.updatetaskForm.get("taskCategory").setValue(data["taskCategory"]);
        this.updatetaskForm.get("priority").setValue(data["priority"]);
        this.updatetaskForm.get("startDate").setValue(data["startDate"]);
        this.updatetaskForm.get("resources").setValue(data["resources"]);
       //  this.updatetaskForm.get("taskName").setValue(data["taskName"]);
      //  this.updatetaskForm.get("timeEstimate").setValue(data["timeEstimate"]);
      
        this.updatetaskForm.get("endDate").setValue(this.projectenddate);
        this.updatetaskForm.get("approvers").setValue(data["approvers"]);
        this.updatetaskForm.get("status").setValue(data["status"]);
        this.updatetaskForm.get("description").setValue(data["description"]);
        this.updatetaskForm.get("summary").setValue(data["summary"]);
        this.slider=data["percentageComplete"];
        this.updatetaskForm.get("percentageComplete").setValue(this.slider);
        this.updatetaskForm.get("comments").setValue(data["comments"]);
        for (let index = 0; index < this.selectedtaskdata.comments.length; index++) {
          const element = this.selectedtaskdata.comments[index];
          this.taskcomments.push(element)
          this.taskcomments_list.push(element)
        }
        for (let index = 0; index < this.selectedtaskdata.history.length; index++) {
          const element = this.selectedtaskdata.history[index];
          this.taskhistory.push(element)
        }
        console.log("taskhistory",this.taskhistory)
        console.log("taskcomment",this.taskcomments,this.taskcomments_list)
        this.getTaskAttachments();
        this.getUserRole();
        let user=this.users_list.find(item=>item.userId.userId==this.selectedtaskdata.resources);
        this.taskresourceemail=user.userId.userId
        this.updatetaskmodalref=this.modalService.show(updatetaskmodal,{class:"modal-lg"})
      }
  
      navigateToWorkspace(data){

        localStorage.setItem('project_id',this.projectDetails.id);
        if(data.taskCategory=="RPA Implementation"){
          this.router.navigate(['/pages/rpautomation/designer'],{queryParams:{projectId:this.projectDetails.id,botId:data.correlationID}})
        }
        if(data.taskCategory=="BPMN Design"){
          this.router.navigate(['pages/businessProcess/uploadProcessModel'],
          {queryParams:{"bpsId":data.correlationID.split(":")[0],"ver":data.correlationID.split(":")[1],"ntype":"bpmn"}})
        }
        if(data.taskCategory=="Process Mining"){
          this.router.navigate(['pages/processIntelligence/flowChart'], {queryParams:{"wpiId":data.correlationID}})
        }
        else{
          this.modeldisable==true
        }
      }
    
      resetupdatetaskproject(){
       // this.taskcomments=[];
        this.updatetaskForm.reset();
        this.updatetaskForm.get("priority").setValue("");
        this.updatetaskForm.get("status").setValue("");
       (<HTMLInputElement>document.getElementById("addcomment")).value = '';
       this.commentnumber=null
        this.updatetaskForm.get("editcomment").setValue("");
     //  this.taskcomments=this.taskcomments;
      }
      canceltaskform(){
        this.commentnumber=null
        this.updatetaskForm.get("editcomment").setValue("");
        this.updatetaskmodalref.hide();
       
      }
      postcomments(comments: string) {
        if (comments!= "") {
          let now = new Date().getTime();
          this.currentdate = now;
          let idnumber=this.taskcomments.length+1
          this.taskcomments.push({
            "id":idnumber,
            "comments":comments
          });
      }
      (<HTMLInputElement>document.getElementById("addcomment")).value = '';
      }
      updatetask(){
        if(this.updatetaskForm.valid)
        {
          this.spinner.show();
          this.updatetaskmodalref.hide();
          let taskupdatFormValue =  this.updatetaskForm.value;
          taskupdatFormValue["id"]=this.selectedtaskdata.id
          taskupdatFormValue["percentageComplete"]=this.slider
          taskupdatFormValue["comments"]=this.taskcomments
          taskupdatFormValue["history"]=this.taskhistory
          this.rpa.updateTask(taskupdatFormValue).subscribe( res =>{
            let status: any= res;
            if(status.errorMessage==undefined)
            {
              Swal.fire("Success","Task Updated Successfully !!","success");
              this.getTaskandCommentsData();
              this.spinner.hide();
            }
            else
            {
              Swal.fire("Error",status.errorMessage,"error");
            }
            
          },err => {
            Swal.fire("Error","Something Went Wrong","error");
          });
    }
    else
    {
      alert("please fill all details");
    }
      }
    
      deletetask(data){
        let deletetask =[{
                "id":data.id
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
                    this.rpa.deleteTask(deletetask).subscribe( res =>{ 
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
                      this.getTaskandCommentsData();
                      this.spinner.hide();
                      },err => {
                        Swal.fire({
                          icon: 'error',
                          title: 'Oops...',
                          text: 'Something went wrong!',
                        })
                                     
                      })
                  }
                });
      }


  addresources(event)
  {
     let item_data={
       id:this.projectDetails.id,
       access:"Project",
       resources:JSON.parse(event),
     }
     this.spinner.show();
     this.addresourcemodalref.hide();
     this.rpa.addresourcebyid(item_data).subscribe(data=>{
        let response:any=data;
        if(response.errorMessage==undefined)
        {
          this.projectdetails();
          this.getallusers();
          this.removeallchecks();
          this.checktodelete();
          this.spinner.hide();
          Swal.fire("Success",response.status,"success");
        }
        else
        {
          Swal.fire("Error",response.errorMessage,"error");
        }
     })
    //   this.rpa.addresourcesbyprogramid(item_data).subscribe(data=>{
    //    let response:any=data;
    //    if(response.errorMessage==undefined)
    //    {
    //      this.spinner.hide();
    //       this.projectDetails.resources=[...this.projectDetails.resources,...(JSON.parse(event))];
    //       Swal.fire("Success",response.status,"success");
    //    }
    //    else
    //    {
    //       Swal.fire("Error",response.errorMessage,"error");
    //    }

    // })
  }

  // projectDetailsbyId(id){

  //   this.rpa.getProjectDetailsById(id).subscribe( res =>{
  //   this.project=res;
  //   this.navigatetodetailspage(this.project)
  //   })
  // }


  // navigatetodetailspage(detials){
  //   let encoded=Base64.encode(JSON.stringify(detials));
  //   let project={id:encoded}
  //   this.router.navigate(['/pages/projects/projectdetails',project])
  // }

  deleteresource(data){
    const selectedresource = this.resources_list.filter(product => product.checked==true).map(p=>{
      return{
        "projectId": this.project_id,
        "resource": p.userId.userId
      }
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
          this.rpa.deleteResource(selectedresource).subscribe( res =>{ 
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
            this.projectdetails();
            this.getallusers();
            this.removeallchecks();
            this.checktodelete();
            this.spinner.hide();
            },err => {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
              })
                           
            })
        }
      });
  }

      addresource(createmodal){
        this.addresourcemodalref=this.modalService.show(createmodal,{class:"modal-md"})
        this.getallusers();
        this.projectdetails();
      }


      posteditcancelcomment(){
        this.commentnumber=null
        this.updatetaskForm.get("editcomment").setValue("");
      }
      navigateToProjectRepo(){
        if(localStorage.getItem('project_id')=="null"){
          this.router.navigate(["/pages/projects/projectreposcreen"], {queryParams:{"id":this.projectDetails.id}})
        }
      }

      navigateToOrchestration(){
        localStorage.setItem('project_id',this.projectDetails.id);
        this.router.navigate(["/pages/serviceOrchestration/home"], 
        {queryParams:{"processid":this.projectDetails.process}})
      }

      editComments(comments,i){
        this.updatetaskForm.get("editcomment").setValue(comments);
        this.showeditcomment=true;
        this.commentnumber=i
        
      }
      updatecomment(id){
        this.commentnumber=null
        for (let i = 0; i < this.taskcomments.length; i++) {
        if(this.taskcomments[i].id==id){
          this.taskcomments[i].comments=this.updatetaskForm.get("editcomment").value
        
        }
        }

        console.log("taskc",this.taskcomments)
      }

      onFileSelected(e){

        this.fileUploadData = <File> e.target.files[0]
        console.log(this.fileUploadData.name);
        
      }
      uploadtaskfile(createmodal,data){
        this.getFileCategories();
        this.selectedtaskfileupload=data
        this.uploadtaskFilemodalref=this.modalService.show(createmodal,{class:"modal-lr"})
      }
      getFileCategories(){
        this.rpa.getFileCategories().subscribe(data =>{
          this.filecategories=data;
      })
      }

      submitUploadFileForm(){
        this.uploadtaskFilemodalref.hide();
        this.spinner.show();
        var fileData = new FormData();
        const files = this.fileList;
        for(var i=0;i< files.length;i++){
          fileData.append("filePath",files[i]);
        }
    fileData.append("category", this.uploadtaskFileForm.get("category").value)
    //  fileData.append("filePath", this.fileUploadData)
     fileData.append("projectId", this.selectedtaskfileupload.projectId)
     fileData.append("taskId", this.selectedtaskfileupload.id)
     fileData.append("description", this.uploadtaskFileForm.get("description").value)

     console.log("fileDataaa", fileData)
     this.rpa.uploadProjectFile(fileData).subscribe(res => {
      
      this.spinner.hide();
      let message: any= res;
       
       //if(res.message!=undefined)
       //{
      
        this.getTaskandCommentsData();
        this.getLatestFiveAttachments(this.selectedtaskfileupload.projectId)
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
         
         this.uploadtaskFileForm.reset();
       }) 
         
     //  }
      //  else
      //  Swal.fire("Error",res.message,"error");
       
     })
     this.uploadtaskFileForm.reset();
        this.listOfFiles = [];
        this.fileList=[];
      }
      updateprojectDetails()
      {
        this.spinner.show()
        this.projectDetails["type"]="Project";
        this.projectDetails.endDate=this.projectenddate;
        this.projectDetails.startDate=this.projectStartDate;
        this.projectDetails.effortsSpent=parseInt(this.projectDetails.effortsSpent)
        console.log(this.projectDetails);
        
        this.rpa.update_project(this.projectDetails).subscribe(res=>{
          this.spinner.hide()
          let response:any=res;
          if(response.errorMessage == undefined)
            Swal.fire("Success","Project Updated Successfully !!","success")
          else
            Swal.fire("Error",response.errorMessage,"error");
          this.projectdetails()
          this.editdata=false;
        });
      }


      downloadTaskAttachment(attachment)
      {
        let data=[attachment.fileName]
        this.rpa.downloadTaskAttachment(data).subscribe(data=>{
          let response:any=data
          var link = document.createElement('a');
          let extension=((((attachment.fileName.toString()).split("")).reverse()).join("")).split(".")[0].split("").reverse().join("")
          link.download = attachment.fileName;
          link.href =((extension=='png' ||extension=='jpg' ||extension=='svg' ||extension=='gif')?`data:image/${extension};base64,${response[0]}`:`data:application/${extension};charset=utf-8,${response[0]}`) ;
          link.click();
        })
      }
      uploadtaskFilemodalCancel(){
        this.uploadtaskFileForm.reset();
        this.listOfFiles = [];
        this.fileList=[];
        this.uploadtaskFilemodalref.hide();
      }
      uploadFilemodalCancel(){
        this.uploadFileFormDetails.reset();
        this.listOfFiles = [];
        this.fileList=[];
        this.uploadFilemodalref.hide();

      }

      endDateMethod(){
        return false;
       }

       onchangeDate(){
        if(this.projectDetails.endDate)
        this.projectDetails.endDate="0000-00-00";
      }

      getInitiatives(){
        this.rpa.getProjectIntitiatives().subscribe(res=>{
          let response:any=res;
          this.initiatives=response;
        })
      }
}
