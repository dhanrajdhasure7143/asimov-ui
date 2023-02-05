import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Inplace } from "primeng/inplace";
import { RestApiService } from "../../services/rest-api.service";

@Component({
  selector: "app-project-task-details",
  templateUrl: "./project-task-details.component.html",
  styleUrls: ["./project-task-details.component.css"],
})
export class ProjectTaskDetailsComponent implements OnInit {
  @ViewChild("inplace") inplace!: Inplace;
  
  desc: any =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore neque cumque quo fugiat mollitia quas id earum perferendis ratione repudiandae magni odio nulla eveniet rerum accusamus error, ducimus provident. Est.";
  project_id:any;
  task_details:any={};
  users_list:any;
  taskcomments_list:any[]=[]
  taskhistory_list:any[]=[]

  constructor(private route : ActivatedRoute,
    private rest_api : RestApiService,
    private router: Router) {}

  ngOnInit(): void {
    this.getallusers();
  }


  inplaceActivate() {
    // this.ip.activate();
    this.inplace.deactivate();
  }

  gettask() {
    this.route.queryParams.subscribe((data) => {
      let params: any = data;
      console.log(data);
      this.project_id = params.project_id;
      this.rest_api.gettaskandComments(this.project_id).subscribe((response) => {
        let taskList: any = response;
        this.task_details = taskList.find((item) => item.id == data.task_id);
        console.log(this.task_details)
        this.taskcomments_list = this.task_details.comments;
        this.taskhistory_list = this.task_details.history;
      });
    });
  }

  backToTaskList(){
    console.log(this.project_id)
    // this.router.navigate(['/pages/projects/tasks'],{
    //   queryParams:{id: this.project_id}
    // })
  }

  getallusers() {
    let tenantid = localStorage.getItem("tenantName");
    this.rest_api.getuserslist(tenantid).subscribe((response) => {
      this.users_list = response;
      this.gettask();
      // let user = this.users_list.find(
      //   (item) => item.userId.userId == this.selectedtask.resources
      // );
      // this.taskresourceemail = user.userId.userId;
      // this.getUserRole();
    });
  }

}
