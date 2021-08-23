import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RestApiService } from '../../services/rest-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {

  selectedtask:any;
  taskcomments:any=[];
  taskhistory:any=[];
  rolelist:any=[];
  updatetaskForm:FormGroup;
  taskcomments_list:any=[];
  projectsList:any=[];
  slider:any;
  currentDate:any;
  showeditcomment:any;
  commentnumber:any;
  userdata:any;
  users_list:any=[];

  constructor(private formBuilder:FormBuilder,
    private router:ActivatedRoute,
    private rest:RestApiService
    ) { }

  ngOnInit(): void {
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
      description: ["", Validators.compose([Validators.maxLength(200)])],
      comments: ['',Validators.compose([Validators.maxLength(200)])],
      summary: ['', Validators.compose([Validators.maxLength(200)])],
      percentageComplete: ['', Validators.compose([Validators.maxLength(200)])],
      editcomment: ['', Validators.compose([Validators.maxLength(200)])],
       })


       this.gettask();
       this.getImage();
       this.getallusers();
  }


  gettask()
  {
    this.router.queryParams.subscribe(data=>{
      this.rest.gettaskandComments(data.projectid).subscribe(response=>{
        let taskList:any=response;
        console.log("-----------------sample-------------",taskList.find(item=>item.id==data.taskId))
        let task:any=taskList.find(item=>item.id==data.taskId)
        this.updatetaskdata(task);
        
      })
    })
  }

  
  updatetaskdata(data)
  {  
    this.taskcomments=[];
    this.taskhistory=[];
    this.rolelist=[];
    this.selectedtask=data
    this.updatetaskForm.get("priority").setValue(data["priority"]);
    this.updatetaskForm.get("startDate").setValue(data["startDate"]);
    this.updatetaskForm.get("resources").setValue(data["resources"]);
    this.updatetaskForm.get("endDate").setValue(data["endDate"]);
    this.updatetaskForm.get("approvers").setValue(data["approvers"]);
    this.updatetaskForm.get("status").setValue(data["status"]);
    this.updatetaskForm.get("description").setValue(data["description"]);
    this.updatetaskForm.get("summary").setValue(data["summary"]);
    this.slider=data["percentageComplete"];
    this.updatetaskForm.get("percentageComplete").setValue(this.slider);
    this.updatetaskForm.get("comments").setValue(data["comments"]);
    
      this.taskcomments=this.selectedtask.comments
      this.taskcomments_list=this.selectedtask.comments

      this.taskhistory=this.selectedtask.history
    console.log("taskhistory",this.taskhistory)
    console.log("taskcomment",this.taskcomments,this.taskcomments_list)
    // this.getTaskAttachments();
    // this.getUserRole();
    // let user=this.users_list.find(item=>item.userId.userId==this.selectedtaskdata.resources);
    // this.taskresourceemail=user.userId.userId
    // this.updatetaskmodalref=this.modalService.show(updatetaskmodal,{class:"modal-lg"})
  }
  updatetask(){
    if(this.updatetaskForm.valid)
    {
      let taskupdatFormValue =  this.updatetaskForm.value;
      taskupdatFormValue["id"]=this.selectedtask.id
      taskupdatFormValue["percentageComplete"]=this.slider
      taskupdatFormValue["comments"]=this.taskcomments
      taskupdatFormValue["history"]=this.taskhistory
      this.rest.updateTask(taskupdatFormValue).subscribe( res =>{
        let status: any= res;
        if(status.errorMessage==undefined)
        {
          Swal.fire("Success",status.message,"success");
          //this.getTaskandCommentsData();
          //this.spinner.hide();
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
      this.userdata = res;
      })
    }


    
    getallusers()
    {
      let tenantid=localStorage.getItem("tenantName")
      this.rest.getuserslist(tenantid).subscribe(response=>{
      
        this.users_list=response;
      });
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

}
