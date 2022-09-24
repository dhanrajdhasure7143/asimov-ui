import { Component, OnInit,  ViewChild} from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RestApiService } from '../../services/rest-api.service';
import Swal from 'sweetalert2';
import { NgxSpinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import * as JSZip from 'jszip';
import { saveAs } from "file-saver";
import * as FileSaver from 'file-saver';
import  * as moment from 'moment'
@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {

  public selectedtask:any;
  taskcomments:any=[];
  taskattacments: any=[];
  taskhistory:any=[];
  rolelist:any=[];
  userid: any;
  public rolename: any;
  roles: any;
  userrole: any=[];
  updatetaskForm:FormGroup;
  taskcomments_list:any=[];
  selectedtaskdata: any;
  projectsList:any=[];
  slider:any;
  currentDate:any;
  taskresourceemail: any;
  showeditcomment:any;
  commentnumber:any;
  userdata:any;
  public users_list:any=[];
  project_id:number;
  lastname: string;
  firstname: string;
  firstletter: string;
  retrievedImage: any;
  base64Data: any;
  public retrieveResonse: any;
  public profilePicture:boolean=false;
  resourcetablefirstname: any;
  resourcetablelastname: any;
  uploadedFiledata: any;
  dataSource3:MatTableDataSource<any>;
  displayedColumns3: string[] = ["check","fileName","fileSize","action"];
  @ViewChild("sort11",{static:false}) sort11: MatSort;
  @ViewChild("paginator101",{static:false}) paginator101: MatPaginator;
  dataSource4:MatTableDataSource<any>;
  displayedColumns4: string[] = ["lastUpdated"];
  @ViewChild("sort12",{static:false}) sort12: MatSort;
  @ViewChild("paginator102",{static:false}) paginator102: MatPaginator;
  requestedFiledata: any;
  filedeleteflag:Boolean;
  filecheckeddisabled:boolean =false;
  filecheckflag:boolean = true;
  selectedFiles: any=[];
  fileList: File[] = [];
  listOfFiles: any[] = [];
  taskresourcedata: any=[];
  taskcategory: any;
  taskname: any;
  lastModifiedBy: any;
  lastModifiedTimestamp: any;
  taskresource: any;
  startDate: any;
  endDate: any;
  public hidetaskdeletedownload: boolean;
  pi_process_list: any;
  bpm_process_list: any;
  bot_list: any;
  mindate= moment().format("YYYY-MM-DD");
  taskSummaryFlag: boolean = false;
  taskDescriptionFlag: boolean = false;
  taskcategories: Object;
  optionValue:any;
  taskcategoriesList:any[]=[]
  constructor(private formBuilder:FormBuilder,
    private router:ActivatedRoute,
    private route:Router,
    private rest:RestApiService,
    private spinner:NgxSpinnerService
    ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.updatetaskForm=this.formBuilder.group({
      taskName:["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      taskCategory: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      priority: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      startDate: ['', Validators.compose([Validators.maxLength(200)])],
      resources: ['', Validators.compose([Validators.maxLength(200)])],
     // timeEstimate: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      endDate: ['', Validators.compose([Validators.maxLength(200)])],
      approvers: ['', Validators.compose([Validators.maxLength(200)])],
      status:["",Validators.compose([Validators.required, Validators.maxLength(50)])],
      description: ["", Validators.compose([Validators.maxLength(200)])],
      comments: ['',Validators.compose([Validators.maxLength(200)])],
      summary: ['', Validators.compose([Validators.maxLength(200)])],
      percentageComplete: ['', Validators.compose([Validators.maxLength(200)])],
      editcomment: ['', Validators.compose([Validators.maxLength(200)])],
      correlationID: [""],
       })


    //  this.getallusers();
       this.gettask();
      
       setTimeout(() => {
        this.getImage();
        this.profileName();
          },500);

        this.getallpiprocess();
        this.getallbpmprocess();
        this.getallbots();
        this.getTaskCategoriesByProject();
        this.getTaskCategories();
  }


  gettask()
  {
    this.router.queryParams.subscribe(data=>{
      let params:any=data
      this.project_id=params.projectid
      this.rest.gettaskandComments(params.projectid).subscribe(response=>{
        let taskList:any=response;
        let task:any=taskList.find(item=>item.id==data.taskId)
        //this.taskcategory=task.taskCategory
        this.taskname=task.taskName
        this.lastModifiedBy=task.lastModifiedBy
        this.lastModifiedTimestamp=task.lastModifiedTimestamp
        this.taskresource=task.resources
        this.startDate=task.startDate
        this.endDate=moment(task.endDate).format("YYYY-MM-DD")
        this.mindate=moment(this.startDate).format("YYYY-MM-DD")
          this.updatetaskdata(task);
       
        
      })
    })
  }

  getTaskCategories(){
    this.rest.getTaskCategories().subscribe(data =>{
      this.taskcategories=data
    })
  }
  OnChangeTaskCategory(data){
    if(this.selectedtask.taskCategory==data.target.value){
    this.updatetaskForm.get("correlationID").setValue(this.selectedtask.correlationID);
  }else{
    this.updatetaskForm.get("correlationID").setValue("");
    }
  }
  updatetaskdata(data)
  {  
    this.taskcomments=[];
    this.taskhistory=[];
    this.rolelist=[];
    this.selectedtask=data
    
    this.updatetaskForm.get("taskName").setValue(data.taskName);
    this.updatetaskForm.get("taskCategory").setValue(data.taskCategory);
    this.updatetaskForm.get("priority").setValue(data["priority"]);
    this.updatetaskForm.get("endDate").setValue(this.endDate);
    this.updatetaskForm.get("resources").setValue(data["resources"]);
    this.updatetaskForm.get("endDate").setValue(data["endDate"]);
    this.updatetaskForm.get("approvers").setValue(data["approvers"]);
    this.updatetaskForm.get("status").setValue(data["status"]);
    this.updatetaskForm.get("description").setValue(data["description"]);
    this.updatetaskForm.get("summary").setValue(data["summary"]);
    this.slider=data["percentageComplete"];
    this.updatetaskForm.get("correlationID").setValue(data.correlationID);
    this.updatetaskForm.get("percentageComplete").setValue(this.slider);
    this.updatetaskForm.get("comments").setValue(data["comments"]);
    
      this.taskcomments=this.selectedtask.comments
      this.taskcomments_list=this.selectedtask.comments

      this.taskhistory=this.selectedtask.history
    this.getTaskAttachments();
    // setTimeout(() => {
    //   let user=this.users_list.find(item=>item.userId.userId==this.selectedtask.resources);
    //   this.taskresourceemail=user.userId.userId
    //   this.getUserRole();
    // }, 200);
    this.getallusers()
   
    // this.updatetaskmodalref=this.modalService.show(updatetaskmodal,{class:"modal-lg"})
  }
  getallusers()
  {
    
    let tenantid=localStorage.getItem("tenantName")
    this.rest.getuserslist(tenantid).subscribe(response=>{
    
      this.users_list=response;
      let user=this.users_list.find(item=>item.userId.userId==this.selectedtask.resources);
        this.taskresourceemail=user.userId.userId
         this.getUserRole();
    });
  }
  updatetask(){
    
    if(this.updatetaskForm.valid)
    {
      let taskupdatFormValue =  this.updatetaskForm.value;
      taskupdatFormValue["id"]=this.selectedtask.id
      taskupdatFormValue["percentageComplete"]=this.slider
      taskupdatFormValue["comments"]=this.taskcomments
      taskupdatFormValue["history"]=this.taskhistory
      taskupdatFormValue["endDate"]=this.endDate
      taskupdatFormValue["taskName"]=this.taskname
      if(this.optionValue == 'As-Is Process' || this.optionValue == 'To-Be Process'){
        taskupdatFormValue["process"] = this.bpm_process_list.find(each=>each.correlationID == this.updatetaskForm.value.correlationID).processId
      }
     // taskupdatFormValue["taskCategory"]=this.taskcategory
      this.spinner.show();
      this.rest.updateTask(taskupdatFormValue).subscribe( res =>{
        this.spinner.hide();
        let status: any= res;
        if(status.errorMessage==undefined)
        {
          Swal.fire("Success","Task Updated Successfully !!","success");
          this.route.navigate(['/pages/projects/projectdetails'],{queryParams:{id:this.project_id}})
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

  profileName(){
    setTimeout(() => {
    this.firstname=this.resourcetablefirstname;
      this.lastname=this.resourcetablelastname;
      var firstnameFirstLetter=this.firstname.charAt(0)
      var lastnameFirstLetter=this.lastname.charAt(0)
      this.firstletter=firstnameFirstLetter+lastnameFirstLetter
    }, 1000);
  }


  postcomments(comments: string) {
    if (comments!= "") {
      let now = new Date().getTime();
      this.currentDate = now;
      let idnumber=this.taskcomments.length+1
      this.taskcomments.push({
        "id":idnumber,
        "comments":comments
      });
  }
  (<HTMLInputElement>document.getElementById("addcomment")).value = '';
  }

  
  editComments(comments,i){
    this.updatetaskForm.get("editcomment").setValue(comments);
    this.showeditcomment=true;
    this.commentnumber=i
    
  }
  

  posteditcancelcomment(){
    this.commentnumber=null
    this.updatetaskForm.get("editcomment").setValue("");
  }

  getImage() {
    
    const userid=localStorage.getItem('ProfileuserId');
    this.rest.getUserDetails(userid).subscribe(res => {
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


    
   

    getTaskAttachments(){
      this.rest.getTaskAttachments(this.selectedtask.projectId,this.selectedtask.id).subscribe(data =>{
        this.taskattacments=data
        if(this.taskattacments.length==0){
          this.hidetaskdeletedownload=false
        }
        else{
          this.hidetaskdeletedownload=true
        }
        this.dataSource3= new MatTableDataSource(this.taskattacments);
      this.dataSource3.sort=this.sort11;
      this.dataSource3.paginator=this.paginator101;
      })

    }

    getUserRole(){
      
      let user=this.users_list.find(item=>item.userId.userId==this.taskresource);
      this.userid=user.userId.userId
      this.rest.getRole(this.userid).subscribe(data =>{
        this.userrole=data
        for (let index = 0; index <= this.userrole.message.length; index++) {
          this.rolename =  this.userrole.message[index];
          if(this.rolename!=undefined){
            this.rolelist.push(this.rolename.name)
            this.roles=this.rolelist.join(',')
          }
        
        }
        //this.rolename=this.userrole.message[0].name
       
      })
this.spinner.hide();
    }


    updatecomment(id){
      this.commentnumber=null
      for (let i = 0; i < this.taskcomments.length; i++) {
      if(this.taskcomments[i].id==id){
        this.taskcomments[i].comments=this.updatetaskForm.get("editcomment").value
      
      }
      }

    
    }
    resetupdatetaskproject(){
      this.updatetaskForm.reset();
    }

    onDownloadItem(fileName){
      this.spinner.show();
      let data=[fileName]
      this.rest.downloadTaskAttachment(data).subscribe(data=>{
      let response:any=data
      var link = document.createElement('a');
      let extension=((((fileName.toString()).split("")).reverse()).join("")).split(".")[0].split("").reverse().join("")
      link.download = fileName;
      link.href =((extension=='png' ||extension=='jpg' ||extension=='svg' ||extension=='gif')?`data:image/${extension};base64,${response[0]}`:`data:application/${extension};base64,${response[0]}`) ;
      link.click();
      this.spinner.hide();
      })
      this.getTaskAttachments();
      this.removeallchecks();
    }


  onDeleteItem(id,fileName){
  
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
        this.rest.deleteFiles(input).subscribe( res =>{ 
          this.spinner.hide();
          let status:any = res;
          if(status.errorMessage==undefined)
          {
          Swal.fire("Success",status.message,"success") 
          this.getTaskAttachments();
          this.removeallchecks();
          this.checktodelete();
          }else
          {
            Swal.fire("Error",status.errorMessage,"error")
          }

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


  filecheckAll(ev) {
    if(this.filecheckeddisabled==false)
      this.taskattacments=this.taskattacments.map(item=>{item.checked=true; return item});
    if(this.filecheckeddisabled==true)
      this.taskattacments=this.taskattacments.map(item=>{item.checked=false; return item});
    this.checktodelete();
  }

  checktodelete()
  {
    this.taskattacments.filter(item=>item.checked==true).length>0?(this.filecheckflag=false):(this.filecheckflag=true);
    this.taskattacments.filter(item=>item.checked==true).length==this.taskattacments.length?(this.filecheckeddisabled=true):(this.filecheckeddisabled=false);
  }

  removeallchecks()
  {
    this.taskattacments=this.taskattacments.map(item=>{item.checked=false;return item});
    this.checktodelete();
  }

  filechecktoggle(id, event)
  {
    this.taskattacments.find(data=>data.id==id).checked=event.target.checked;
    this.checktodelete();
  }

  onDownloadSelectedItems(){
    let downloadSelectedfiles=[];
    downloadSelectedfiles=this.taskattacments.filter(product => product.checked==true).map(p=>{return (p.fileName)});
    this.spinner.show();
    this.rest.downloadTaskAttachment(downloadSelectedfiles).subscribe((response:any)=>{
      this.spinner.hide();
      if(response.errorMessage==undefined)
      {
        var zip = new JSZip();
        response.forEach((value,i) => {
          let extension=((((downloadSelectedfiles[i].toString()).split("")).reverse()).join("")).split(".")[0].split("").reverse().join("")
          if(extension=='jpg'|| 'PNG' || 'svg' || 'jpeg' || 'png')
            zip.file(downloadSelectedfiles[i],value,{base64:true});
          else
            zip.file(downloadSelectedfiles[i],value);    
        });
        zip.generateAsync({ type: "blob" }).then(function (content) {
          FileSaver.saveAs(content, `Attachments.zip`);
          Swal.fire("Success","Attachments downloaded successfully","success")
        });
      }
      else
      {
        Swal.fire("Error",response.errorMessage,"error");
      }
      // for(let i=0;i<response.length;i++){
      // var link = document.createElement('a');
      // let extension=((((downloadSelectedfiles[i].toString()).split("")).reverse()).join("")).split(".")[0].split("").reverse().join("")
      // link.download = downloadSelectedfiles[i];
      // link.href =((extension=='png' ||extension=='jpg' ||extension=='svg' ||extension=='gif')?`data:image/${extension};base64,${response[i]}`:`data:application/${extension};base64,${response[i]}`) ;
      // link.click();
      // }
    },(err:any)=>{
    
      this.spinner.hide();
      
      Swal.fire("Error","Unable to task attachments","error");
    })
   // this.getTaskAttachments();
  }

  onDeleteSelectedItems(event){
    const selectedFiles = [];
    this.taskattacments.filter(product => product.checked==true).map(p=>{
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
        if (result.isConfirmed) {
          this.spinner.show();
          this.rest.deleteFiles(selectedFiles).subscribe( res =>{ 
              let status:any = res;
              this.spinner.hide();
              if(status.errorMessage==undefined)
              {
                Swal.fire("Success",status.message,"success");
                this.getTaskAttachments();
                this.removeallchecks();
              } 
              else
              {
                Swal.fire("Error",status.errorMessage,"error");
              }
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

  getallbpmprocess(){
    this.rest.getprocessnames().subscribe(data =>{
      let response:any=data;
      let resp:any="";
    resp=response.filter(item=>item.status=="APPROVED");
    this.bpm_process_list=resp.sort((a,b) => (a.processName.toLowerCase() > b.processName.toLowerCase() ) ? 1 : ((b.processName.toLowerCase() > a.processName.toLowerCase() ) ? -1 : 0));
    })
  }

  getallpiprocess(){
    this.rest.getAlluserProcessPiIds().subscribe(data =>{
      let response:any=data;
      this.pi_process_list=response.data.sort((a,b) => (a.piName.toLowerCase() > b.piName.toLowerCase() ) ? 1 : ((b.piName.toLowerCase() > a.piName.toLowerCase() ) ? -1 : 0));
    })
  }

  getallbots(){
    this.rest.getAllActiveBots().subscribe(data =>{
      let response:any=data;
     this.bot_list=response.sort((a,b) => (a.botName.toLowerCase() > b.botName.toLowerCase() ) ? 1 : ((b.botName.toLowerCase() > a.botName.toLowerCase() ) ? -1 : 0));
    })
  }
  taskSummaryMaxLength(value){
    if(value.length > 150){
    this.taskSummaryFlag = true;
    }else{
      this.taskSummaryFlag = false;
    }
     }
     taskDescriptionMaxLength(value){
      if(value.length > 150){
      this.taskDescriptionFlag = true;
      }else{
        this.taskDescriptionFlag = false;
      }
       }
  getTaskCategoriesByProject() {
    this.rest.getTaskCategoriesByProject(this.project_id).subscribe((res:any) => {
      this.taskcategoriesList = res
    })

       }
}
