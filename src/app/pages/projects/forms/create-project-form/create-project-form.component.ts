import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import moment from "moment";
import { RestApiService } from "src/app/pages/services/rest-api.service";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { NotifierService } from "angular-notifier";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { LoaderService } from "src/app/services/loader/loader.service";
@Component({
  selector: "app-create-project-form",
  templateUrl: "./create-project-form-new.component.html",
  styleUrls: ["./create-project-form.component.css"],
})
export class CreateProjectFormComponent implements OnInit {
  @Input('hiddenPopUp') public hiddenPopUp: boolean;
  insertForm2: FormGroup;
  selectedresources: any = [];
  valuechain: any = [];
  valuechainprocesses: any = [];
  mindate = moment().format("YYYY-MM-DD");
  @Input("users_list") public users_list: any[];
  @Input("processes") public processes: any[];
  @Input("initiatives_list") public initiatives_list: any[];
  selected_process_names: any = [];
  @Output() oncreate = new EventEmitter<String>();
  date = new Date();
  loggedInUserId: any;
  categories_list: any[] = [];
  categoriesList: any = [];
  freetrail: string;
  processOwner: boolean;
  public resources_list: any[] = [];
  activeUsersList:any[]=[];


  constructor(
    private formBuilder: FormBuilder,
    private spinner: LoaderService,
    private rest_api: RestApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loggedInUserId = localStorage.getItem("ProfileuserId");
    this.insertForm2 = this.formBuilder.group({
      projectName: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern("^[a-zA-Z0-9_-]*$"),
        ]),
      ],
      processOwner: [""],
      process: ["", Validators.compose([Validators.maxLength(50)])],
      priority: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      mapValueChain: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      projectPurpose: [
        "",
        Validators.compose([Validators.required]),
      ],
      owner: [this.loggedInUserId, Validators.compose([Validators.required, Validators.maxLength(50)])],

      // initiatives: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      // resource: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      // endDate: [""],
      // startDate: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      // measurableMetrics: ["", Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9_-]*$")])],
      // description: ["", Validators.compose([Validators.maxLength(200)])],
      // access: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      // status: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
    });

    // this.getvalchain();
    this.getprocessnames();
    this.freetrail = localStorage.getItem("freetrail");

    if (this.freetrail != "true") {
      this.insertForm2.get("process").setValidators(Validators.required);
      this.insertForm2.get("processOwner").setValidators(Validators.required);
    } else {
      this.insertForm2.get("process").clearValidators();
      this.insertForm2.get("processOwner").clearValidators();
    }
    this.rest_api.getCategoriesList().subscribe((res) => {
      this.categoriesList = res;
      this.categories_list = this.categoriesList.data.sort((a, b) =>
        a.categoryName.toLowerCase() > b.categoryName.toLowerCase()
          ? 1
          : b.categoryName.toLowerCase() > a.categoryName.toLowerCase()
          ? -1
          : 0
      );
      // if(this.categories_list.length==1){
      //   this.categoryName=this.categories_list[0].categoryName
      // }
    });
  };

  ngOnChanges() {
      setTimeout(() => {
        this.activeUsersList = this.users_list.filter(x => x.user_role_status == 'ACTIVE')

        this.activeUsersList.forEach((element) => {
          if (element.user_email != this.loggedInUserId)
            this.resources_list.push(element);
        });
      if(!this.hiddenPopUp)
        this.resetcreateproject();
      }, 200);
  }

  getprocessnames() {
    this.rest_api.getprocessnames().subscribe((processnames:any) => {
      let response: any = processnames;
      let resp: any = [];
      //resp=processnames
      //this.selected_process_names=resp.filter(item=>item.status=="APPROVED");
      resp = response.filter((item) => item.status == "APPROVED");
      this.selected_process_names = resp.sort((a, b) =>
        a.processName.toLowerCase() > b.processName.toLowerCase()
          ? 1
          : b.processName.toLowerCase() > a.processName.toLowerCase()
          ? -1
          : 0
      );
      // this.selected_process_names =[...this.selected_process_names.map(process=>

      //   {
      //     let userdata=this.users_list.find(userData=>userData.userId.userId==process.ProcessOwner)
      //     if(userdata!=undefined){
      //       process["processOwnerName"]=userdata.firstName +" "+  userdata.lastName;

      //     }
      //     return process;})]
    });
  }

  // createproject()
  // {
  //   if(this.insertForm2.valid)
  //   {
  //     let userfirstname=localStorage.getItem("firstName")
  //     let userlastname=localStorage.getItem("lastName")
  //     let username=userfirstname+" "+userlastname
  //     this.insertForm2.value.status="New";
  //     this.insertForm2.value.createdBy=username;
  //     //this.insertForm2.value.mapValueChain=this.valuechain.find(item=>item.processGrpMasterId==this.insertForm2.value.mapValueChain).processName;
  //     let data=this.insertForm2.value;
  //     data["resource"]=data.resource.map(item=>{ return {resource:item}});
  //     data["effortsSpent"]=0;
  //     data["projectHealth"]="Good";
  //     data["projectPercentage"] =0;
  //     let project=JSON.stringify(data)
  //     this.oncreate.emit(project);
  //   }
  // }
  onProcessChange(processId: number) {
    let process = this.selected_process_names.find(
      (process) => process.processId == processId
    );
    if (process != undefined) {
      let processOwner: any = this.users_list.find(
        (item) => item.userId.userId == process.ProcessOwner
      );
      if (processOwner != undefined) {
        this.insertForm2
          .get("processOwner")
          .setValue(processOwner.userId.userId);
        this.processOwner = false;
      } else {
        this.insertForm2.get("processOwner").setValue("");
        Swal.fire(
          "Error",
          "Unable to find process owner for selected process",
          "error"
        );
      }
    }
  }

  resetcreateproject() {
    this.insertForm2.reset();
    this.insertForm2.get("owner").setValue(this.loggedInUserId)
    // this.insertForm2.get("resource").setValue("");
    // this.insertForm2.get("mapValueChain").setValue("");
    // this.insertForm2.get("owner").setValue(this.loggedInUserId);

    // this.insertForm2.get("processOwner").setValue("");
    // this.insertForm2.get("initiatives").setValue("");
    // this.insertForm2.get("priority").setValue("");
    // this.insertForm2.get("process").setValue("");
  }

  getValueChainProcesses(value) {
    this.rest_api.getvaluechainprocess(value).subscribe((data) => {
      let response: any = data;
      this.valuechainprocesses = response;
    });
  }

  // getvalchain()
  // {
  //   this.valuechain=[];
  //   this.rest.getvaluechain().subscribe(res=>{
  //     let response:any=res;
  //     this.valuechain=response;
  //   })
  // }
  DateMethod() {
    return false;
  }
  endDateMethod() {
    return false;
  }
  onchangeDate() {
    if (this.insertForm2.get("endDate").value)
      this.insertForm2.get("endDate").setValue("0000-00-00");
    this.mindate = this.insertForm2.get("startDate").value;
  }

  createproject() {
    let userfirstname = localStorage.getItem("firstName");
    let userlastname = localStorage.getItem("lastName");
    let username = userfirstname + " " + userlastname;
    this.insertForm2.value.status = "New";
    this.insertForm2.value.createdBy = username;
    //this.insertForm2.value.mapValueChain=this.valuechain.find(item=>item.processGrpMasterId==this.insertForm2.value.mapValueChain).processName;
    let data = this.insertForm2.value;
    // data["resource"]=data.resource.map(item=>{ return {resource:item}});
    let selectedBpmn=this.selected_process_names.find(each=>each.processId == this.insertForm2.value.process).correlationID
    data["resource"] = [];
    data["effortsSpent"] = 0;
    data["projectHealth"] = "Good";
    data["projectPercentage"] = 0;
    data["correlationID"] = selectedBpmn;

    // let project=JSON.stringify(data)

    this.spinner.show();
    this.rest_api.createProject(data).subscribe((data) => {
      let response: any = data;
      this.spinner.hide();
      if (response.errorMessage == undefined) {
        let status: any = response;
        let req_body = [
          { key: 1, label: "Analysis", data: "folder",ChildId: "1",dataType: "folder",fileSize: "",task_id: "",projectId: response.project.id},
          { key: 2, label: "System Connectivity", data: "folder",ChildId: "1",dataType: "folder",fileSize: "",task_id: "",projectId: response.project.id},
          { key: 3, label: "Process Document", data: "folder",ChildId: "1",dataType: "folder",fileSize: "",task_id: "",projectId: response.project.id},
          { key: 4, label: "Testing", data: "folder",ChildId: "1",dataType: "folder",fileSize: "",task_id: "",projectId: response.project.id},
          { key: 5, label: "Reference",data: "folder",ChildId: "1",dataType: "folder",fileSize: "",task_id: "",projectId: response.project.id}
        ];
      
        this.rest_api.createFolderByProject(req_body).subscribe(res=>{
        })
        Swal.fire({
          title: "Success",
          text: response.message,
          position: "center",
          icon: "success",
          showCancelButton: false,
          customClass: {
            confirmButton: 'btn bluebg-button',
            cancelButton:  'btn new-cancelbtn',
          },
          confirmButtonText: "Ok",
        }).then((result) => {
          this.resetcreateproject();
          // this.router.navigate(['/pages/projects/projectdetails'],{queryParams:{id:response.project.id}})
          this.router.navigate(["/pages/projects/projectdetails"], {
            queryParams: { project_id: response.project.id,project_name: response.project.projectName,isCreated:true},
          });
        });
      } else Swal.fire("Error", response.errorMessage, "error");
    });
  }
}
