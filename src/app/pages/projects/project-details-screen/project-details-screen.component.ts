import { formatDate } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
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
  categaoriesList: any;
  selected_process_names: any;
  displayedColumns: string[] = ["taskCategory","taskName","resources","status","percentage","lastModifiedTimestamp","lastModifiedBy", "createdBy","action"];
  responsedata: any;
  bot_list: any=[];
  automatedtask: any;
  createtaskmodalref: BsModalRef;
  addresourcemodalref: BsModalRef;
  project_id: any;
  public tasks: any=[];
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
 updatetaskmodalref: BsModalRef;
 selectedtaskdata: any;
 currentdate: number;
 editcomment:any;
 showeditcomment:boolean=false;
 commentnumber:number;


  
  @ViewChild("sort10",{static:false}) sort10: MatSort;
  @ViewChild("paginator101",{static:false}) paginator101: MatPaginator;
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

  constructor(private dt:DataTransferService,private route:ActivatedRoute, private rpa:RestApiService,
    private modalService: BsModalService,private formBuilder: FormBuilder,private router: Router,
    private spinner:NgxSpinnerService) { }


  ngOnInit() {

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


    this.dt.changeParentModule({"route":"/pages/projects/projects-list-screen", "title":"Projects"});
    this.dt.changeChildModule(undefined);

    this.projectdetails();

    
 


    this.getallusers();
    this.getallprocesses();

    setTimeout(() => {
      this.getImage();
      this.profileName();
        },1000);
       
      
        this.getallusers();
        this.getTaskandCommentsData();
  }

  onTabChanged(event)
  {
    this.check_tab=event.index;
  }

  getTaskandCommentsData(){
    this.rpa.gettaskandComments(this.project_id).subscribe(data =>{
      this.tasks=data
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

  getUserRole(){
    let user=this.users_list.find(item=>item.userId.id==this.selectedtaskdata.resources);
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

  projectdetails(){

    this.route.params.subscribe(data=>{this.projectData=data

      this.projectDetails=JSON.parse(Base64.decode(this.projectData.id));
      this.project_id=this.projectDetails.id
      console.log("project details",this.projectDetails)
        });
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
        this.rpa.getuserslist(tenantid).subscribe(item=>{
          let users:any=item
          this.users_list=users;

          this.useremail=this.users_list.find(item=>item.userId.id==this.projectDetails.resources);
          return this.useremail!=undefined?(this.useremail.userId.userId):this.projectDetails.resources;
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
        this.updatetaskForm.get("endDate").setValue(data["endDate"]);
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
        
        console.log("taskcomment",this.taskcomments,this.taskcomments_list)
        this.getTaskAttachments();
        this.getUserRole();
        this.updatetaskmodalref=this.modalService.show(updatetaskmodal,{class:"modal-lg"})
      }
  
      navigateToWorkspace(data){

        if(data.taskCategory=="RPA Implementation"){
          this.router.navigate(['/pages/rpautomation/home'])
        }
        if(data.taskCategory=="BPMN Design"){
          this.router.navigate(['/pages/businessProcess/home'])
        }
        else{
          this.modeldisable==true
        }
      }
    
      resetupdatetaskproject(){
        this.taskcomments=[];
        this.updatetaskForm.reset();
        this.updatetaskForm.get("priority").setValue("");
        this.updatetaskForm.get("status").setValue("");
       (<HTMLInputElement>document.getElementById("addcomment")).value = '';
       this.commentnumber=null
        this.updatetaskForm.get("editcomment").setValue("");
       this.taskcomments=this.taskcomments_list;
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
         // taskupdatFormValue["history"]=this.taskhistory
          this.rpa.updateTask(taskupdatFormValue).subscribe( res =>{
            let status: any= res;
            if(status.errorMessage==undefined)
            {
              Swal.fire("Success",status.message,"success");
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
       resources:JSON.parse(event),
     }
     this.spinner.show();
     this.addresourcemodalref.hide();
     console.log("-------------",item_data);
     this.rpa.addresourcebyid(item_data).subscribe(data=>{
        let response:any=data;
        if(response.errorMessage==undefined)
        {
          this.spinner.hide();
          this.projectDetails.resources=[...this.projectDetails.resources,...(JSON.parse(event))];
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

  projectDetailsbyId(id){

    this.rpa.getProjectDetailsById(id).subscribe( res =>{
    this.project=res;
    this.navigatetodetailspage(this.project)
    })
  }


  navigatetodetailspage(detials){
    let encoded=Base64.encode(JSON.stringify(detials));
    let project={id:encoded}
    this.router.navigate(['/pages/projects/projectdetails',project])
  }



      addresource(createmodal){
        this.addresourcemodalref=this.modalService.show(createmodal,{class:"modal-md"})
      }


      posteditcancelcomment(){
        this.commentnumber=null
        this.updatetaskForm.get("editcomment").setValue("");
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
}
