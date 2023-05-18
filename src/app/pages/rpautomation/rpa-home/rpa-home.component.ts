import { Component, OnInit, TemplateRef, ViewChild, Output, EventEmitter, Inject, Input } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { RestApiService } from '../../services/rest-api.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/filter';
// import * as $ from 'jquery';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs/Observable';
import { APP_CONFIG } from 'src/app/app.config';
import { Table } from 'primeng/table';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { DataTransferService } from '../../services/data-transfer.service';
declare var $: any;

@Component({
  selector: 'app-rpa-home',
  templateUrl: './rpa-home.component.html',
  styleUrls: ['./rpa-home.component.css']
})
export class RpaHomeComponent implements OnInit {
  public isTableHasData = true;
  public respdata1 = false;
  departmentlist: string[] = ['Development', 'QA', 'HR'];
  botNameFilter = new FormControl('');
  botTypeFilter = new FormControl('');
  departmentFilter = new FormControl('');
  public isDataSource: boolean;
  public userRole: any = [];
  public isButtonVisible = false;
  public bot_list: any = [];
  public process_names: any = [];
  public selectedvalue: any;
  public selectedTab: number;
  public responsedata;
  public selectedEnvironment: any = '';
  public environments: any = [];
  public categaoriesList: any = [];
  loadflag: Boolean = false;
  customUserRole: any;
  term: any;
  pageSize: any = 10;
  userFilter: any = { botName: '', department: '' };
  globalfilter: any;
  enableConfiguration: boolean = false;
  enablecreatebot: boolean = false;
  showWorkspace: boolean = false;
  modalRef: BsModalRef;
  exportid: any;
  allbots: any = [];
  botFormVisibility:boolean=false;
  @Output() pageChange: EventEmitter<number>;
  @Output() pageBoundsCorrection: EventEmitter<number>;
  importenv: any = "";
  importcat: any = "";
  importfile: any = "";
  botImage: any = undefined;
  file_error: any = "";
  isCreateForm: boolean = false;
  botDetails: any;
  modbotName: any;
  modbotDescription: any;
  modDepartment: any;
  count: any;
  botNamespace: boolean;
  checkbotname: boolean;
  public editbot: FormGroup;
  insertbot: FormGroup;
  rpaCategory: any = "";
  newRpaCategory: any;
  config: any;
  userName: any = "";
  displayedRows$: Observable<any[]>;
  rpaVisible: boolean = false;
  userCheck: boolean = false;
  @ViewChild(MatSort) sort: MatSort;
  totalRows$: Observable<number>;
  freetrail: string;
  botlistitems: any = []
  categoryName: any;
  public sortkey: any;
  noDataMessage: boolean;
  hiddenPopUp:boolean = false;
  _selectedColumns: any[];
  search_fields:any[]=[];
  categories_list_new:any[]=[];
  columns_list = [
    { ColumnName: 'botName', DisplayName: 'Bot Name',filterType:"text",filterWidget:"normal",ShowFilter:true,showTooltip:true},
    { ColumnName: 'createdBy', DisplayName: 'Created By',filterType:"text",filterWidget:"normal",ShowFilter:true },
    { ColumnName: 'description', DisplayName: 'Description',filterType:"text",filterWidget:"normal", ShowFilter:true,showTooltip:true},
    { ColumnName: 'categoryName', DisplayName: 'Category',filterType:"text",filterWidget:"dropdown",ShowFilter:true,dropdownList:this.categories_list_new},
    { ColumnName: 'version_new', DisplayName: 'Version',filterType:"text",filterWidget:"normal",ShowFilter:true},
    // { ColumnName: 'last_modified_date', DisplayName: 'Last Modified',filterType:"date",filterWidget:"normal",ShowFilter:true },
    { ColumnName: 'botStatus', DisplayName: 'Status',filterType:"text",filterWidget:"dropdown",ShowFilter:true,dropdownList:["Success","Running","New","Failure","Killed","Stopped"] },
    { ColumnName: '', DisplayName: 'Actions' }
  ];
  EdithiddenPopUp:boolean=false;
  importBotForm=new FormGroup({
    botName:new FormControl("", Validators.compose([Validators.required,, Validators.pattern("^[a-zA-Z0-9_-]*$")])),
    categoryId:new FormControl("", Validators.compose([Validators.required])),
    environmentId:new FormControl("", Validators.compose([Validators.required]))
  })
  importBotJson:any= undefined;
  final_tasks:any=[];
  finaldataobjects:any=[];
  checkorderflag:boolean=true;
  stopNodeId:any;
  users_list:any[]=[];
  statusColors = {
    New: '#3CA4F3',
    Failure: '#FE665D',
    Success: '#4BD963',
    Killed:"#B91C1C",
    Stopped: '#FE665D',
    Running:"#C4B28E"
  };

  constructor(
    private rest: RestApiService,
    private modalService: BsModalService,
    private router: Router,
    private spinner: LoaderService,
    @Inject(APP_CONFIG) private appconfig,
    private dt : DataTransferService
  ) { }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.columns_list.filter((col) =>
      val.includes(col)
    );
  }

  openModal(template: TemplateRef<any>) {
    if (this.freetrail == 'true') {
      if (this.bot_list.length == this.appconfig.rpabotfreetraillimit) {
        Swal.fire({
          title: 'Error',
          text: "You have limited access to this product. Please contact EZFlow support team for more details.",
          position: 'center',
          icon: 'error',
          showCancelButton: false,
          customClass: {
            confirmButton: 'btn bluebg-button',
            cancelButton:  'btn new-cancelbtn',
          },
	
          heightAuto: false,
          confirmButtonText: 'Ok'
        })
      }
      else {
        this.importfile = "";
        this.file_error = "";
        this.importcat = "";
        this.modalRef = this.modalService.show(template, { class: 'modal-lr' });
      }
    }
    else {
      this.importfile = "";
      this.file_error = "";
      this.importcat = "";
      this.modalRef = this.modalService.show(template, { class: 'modal-lr' });
    }
  }

  ngOnInit() {
    $('.link').removeClass('active');
    $('#rpa').addClass("active");
    $('#expand_menu').addClass("active");
    this.userRole = localStorage.getItem("userRole")
    this.userRole = this.userRole.split(',');
    localStorage.setItem("isHeader", "false");
    //this.isButtonVisible = this.userRole.includes('SuperAdmin') || this.userRole.includes('Admin') || this.userRole.includes('RPA Admin')||this.userRole.includes("Process Owner")||this.userRole.includes("System Admin")||;
    this.isButtonVisible = this.userRole.includes("Process Analyst")
    this.rpaVisible = this.userRole.includes('SuperAdmin') || this.userRole.includes('Admin') || this.userRole.includes('Process Owner') || this.userRole.includes('Process Architect') || this.userRole.includes('Process Analyst') || this.userRole.includes('RPA Developer') || this.userRole.includes('Process Architect') || this.userRole.includes("System Admin") || this.userRole.includes("User");
    this.userName = localStorage.getItem("firstName") + " " + localStorage.getItem("lastName");
    let processId = undefined;
    this.userCheck = this.userRole.includes("User")
    //this.dataSource1.filterPredicate = this.createFilter();
    this.sortkey = {
      botName: true,
      version: true,
      botType: true,
      department: true,
      botStatus: true,
      description: true,
    }
    this.spinner.show();
    this.getCategoryList();
    this.getenvironments();
    // this.getallbots();
    this.getUsersList();
    this._selectedColumns = this.columns_list;
    this.freetrail = localStorage.getItem('freetrail')
  }

  botdelete(bot) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      customClass: {
        confirmButton: 'btn bluebg-button',
        cancelButton:  'btn new-cancelbtn',
      },
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        let response;
        this.spinner.show()
        this.rest.getDeleteBot(bot.botId).subscribe(data => {
          response = data;
          if (response.status != undefined) {
            this.spinner.hide()
            Swal.fire("Success", response.status, "success");
            this.getallbots();
          } else {
            this.spinner.hide()
            Swal.fire("Error", response.errorMessage, "error");
          }
        })
        setTimeout(() => {
          this.getallbots();
        }, 550);
      }
    })
  }

  getallbots() {
    let response: any = [];
    this.spinner.show();
    this.loadflag = true;
    this.rest.getAllActiveBots().subscribe(botlist => {
        this.loadflag = false;
        this.bot_list = [];
      response = botlist;
      response.map(item => {
        if (item.version_new != null) {
          item["version_new"] = parseFloat(item.version_new)
          item["version_new"] = item.version_new.toFixed(1)
        }
        item["last_modified_date"] = new Date(item.createdAt)
      })
      this.botlistitems = botlist;
      this.bot_list = botlist
      this.spinner.hide();
    }, (err) => {
      this.spinner.hide();
    })
    this.search_fields =['botName',"description","categoryName","version_new","last_modified_date","botStatus","createdBy"]
  }

  createoverlay() {
    this.botNamespace = false;
    if (this.freetrail == 'true') {
      if (this.bot_list.length == this.appconfig.rpabotfreetraillimit) {
        Swal.fire({
          title: 'Error',
          text: "You have limited access to this product. Please contact EZFlow support team for more details.",
          position: 'center',
          icon: 'error',
          showCancelButton: false,
          customClass: {
            confirmButton: 'btn bluebg-button',
            cancelButton:  'btn new-cancelbtn',
          },
	
          heightAuto: false,
          confirmButtonText: 'Ok'
        })
      }
      else {
        this.insertbot.reset();
        document.getElementById("create-bot").style.display = "block";
        if (this.categaoriesList.length == 1) {
          this.rpaCategory = this.categaoriesList[0].categoryId;
          let Id = this.categaoriesList[0].categoryId
          this.categoryName = this.categaoriesList[0].categoryName;
          this.insertbot.get('botDepartment').setValue(Id)
          this.insertbot.controls.botDepartment.disable();
        }
        else {
          this.insertbot.get('botDepartment').setValue('')
          this.insertbot.controls.botDepartment.enable();
        }
      }
    }
    else {
      this.insertbot.reset();
      document.getElementById("create-bot").style.display = "block";
      if (this.categaoriesList.length == 1) {
        this.rpaCategory = this.categaoriesList[0].categoryId;
        let Id = this.categaoriesList[0].categoryId
        this.categoryName = this.categaoriesList[0].categoryName;
        this.insertbot.get('botDepartment').setValue(Id)
        this.insertbot.controls.botDepartment.disable();
      }
      else {
        this.insertbot.get('botDepartment').setValue('')
        this.insertbot.controls.botDepartment.enable();
      }
    }
  }

  onCreateSubmit() {
    this.userFilter.name = "";
    document.getElementById("create-bot").style.display = "none";
    var createBotFormValue = this.insertbot.value;
    let createbot = {
      "botName": createBotFormValue.botName,
      // "department":createBotFormValue.botDepartment
      "department": String(this.rpaCategory)
    }
    if (createBotFormValue.botDepartment == "others") {
      let rpaCategory: any = { "categoryName": this.insertbot.value.newCategoryName, "categoryId": 0, "createdAt": "" };
      this.rest.addCategory(rpaCategory).subscribe(data => {
        let catResponse: any;
        if (catResponse.errorMessage == undefined) {
          catResponse = data;
          createBotFormValue.botDepartment = catResponse.data.categoryId;
          this.spinner.show();
          this.rest.createBot(createbot).subscribe((res: any) => {
            let botId = res.botId;
            if (res.errorMessage == undefined) {
              this.spinner.hide()
              this.router.navigate(["/pages/rpautomation/designer"], { queryParams: { botId: botId } });
            }
            else {
              this.spinner.hide();
              Swal.fire("Error", res.errorMessage, "error");
            }
          }, err => {
            this.spinner.hide();
            Swal.fire("Error", catResponse.errorMessage, "error");
          });
          // let botId=Base64.encode(JSON.stringify(createBotFormValue));
        }
        else {
          Swal.fire("Error", catResponse.errorMessage, "error");
        }

      });
    } else {
      this.spinner.show();
      // let botId=Base64.encode(JSON.stringify(createBotFormValue));
      this.rest.createBot(createbot).subscribe((res: any) => {
        let botId = res.botId
        if (res.errorMessage == undefined) {
          this.spinner.hide()
          this.router.navigate(["/pages/rpautomation/designer"], { queryParams: { botId: botId } });
        }
        else {
          this.spinner.hide();
          Swal.fire("Error", res.errorMessage, "error");
        }
      }, err => {
        this.spinner.hide();
        Swal.fire("Error", "error");
      })
    }
    this.insertbot.reset();
  }


  close() {
    document.getElementById("create-bot").style.display = "none";
    document.getElementById("edit-bot").style.display = "none";
    if (document.getElementById("load-bot"))
      document.getElementById("load-bot").style.display = "none";
  }

  editclose() {
    document.getElementById("edit-bot").style.display = "none";
    this.checkbotname = false;
  }

  loadbotdata(botId) {
    this.router.navigateByUrl(`./designer?botId=${botId}`)
  }

  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }

  importbotfile() {
    if (this.importenv != "", this.importfile != "", this.importcat != "") {
      let form = new FormData();
      form.append("file", this.importfile);
      form.append("env-id", this.importenv);
      form.append("categoryId", this.importcat);
      this.rest.importbot(form).subscribe(data => {
        let response: any = data;
        this.importcat = "";
        this.importenv = "";
        this.importfile = "";
        if (response.errorMessage == undefined) {
          Swal.fire("Success", response.status, "success");
          this.getallbots();
        }
        else
          Swal.fire("Error", response.errorMessage, "error");
        this.modalRef.hide()
        this.getallbots();
      })

    }
  }

  upload(file) {
    var reader = new FileReader();
    var extarr = file.name.split('.');
    var ext = extarr.reverse()[0];
    this.file_error = "";
    if (ext == "json")
    {
      reader.readAsText(file);
      this.spinner.show();
      reader.onload = (e) => {
        let botDetails=(JSON.parse(reader.result.toString()));
        this.importBotJson=botDetails;
        this.importBotForm.get("botName").setValue(botDetails.botName);
        this.validateBotName();
      }
      
    }
    else
      this.file_error = "Invalid file format, only it allows .sql format"


  }

  exportbot(bot) {
    this.rest.bot_export(bot.botId).subscribe((data) => {

      const linkSource = `data:application/txt;base64,${data}`;
      const downloadLink = document.createElement('a');
      document.body.appendChild(downloadLink);

      downloadLink.href = linkSource;
      downloadLink.target = '_self';
      downloadLink.download = bot.botName + "-V" + bot.version + ".sql";
      downloadLink.click();
      Swal.fire("Success", "Bot Exported Successfully", "success");
    })
  }

  converBase64toBlob(content, contentType) {
    contentType = contentType || '';
    var sliceSize = 512;
    var byteCharacters = window.atob(content); //method which converts base64 to binary
    var byteArrays = [
    ];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);
      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, {
      type: contentType
    }); //statement which creates the blob
    return blob;
  }


  getBotImage(bot) {
    this.botImage = undefined
    this.rest.getBotImage(bot.botId, bot.version).subscribe(data => {
      let response: any = data;
      if (response.errorMessage) {
        this.botImage = {
          errorMessage: "No Preview"
        }
      } else {
        this.botImage = {
          svg: response.status
        }
      }
    })
  }


  getenvironments() {
    this.rest.listEnvironments().subscribe(response => {
      let resp: any = response
      if (resp.errorCode == undefined) {
        this.environments = response;
      }
    })
  }

  getCategoryList() {
    this.rest.getCategoriesList().subscribe(data => {
      let catResponse: any;
      catResponse = data
      this.categaoriesList = catResponse.data.sort((a, b) => (a.categoryName.toLowerCase() > b.categoryName.toLowerCase()) ? 1 : ((b.categoryName.toLowerCase() > a.categoryName.toLowerCase()) ? -1 : 0));
      this.categaoriesList.forEach(element => {
        this.categories_list_new.push(element.categoryName)
      });
      this.columns_list.map(item=>{
        if(item.ColumnName === "categoryName"){
          item["dropdownList"]=this.categories_list_new
        }
      })
      if (this.categaoriesList.length == 1){
        this.rpaCategory = this.categaoriesList[0].categoryId;
          this.categoryName = this.categaoriesList[0].categoryName;
      }
    });
  }


  openEditBotOverlay(botDetails: any) {
    this.hiddenPopUp = true;
    this.isCreateForm = false;
    this.botDetails = botDetails;
    this.botFormVisibility=true;
    // document.getElementById('bot-form').style.display = 'block';
  }


  openCreateBotOverlay() {
    this.isCreateForm = true;
    this.hiddenPopUp = true;
    this.botDetails = undefined;
    this.botFormVisibility=true;
    // document.getElementById('bot-form').style.display = 'block';
  }


  botFormOutput(botOutput: any) {
    
    if (botOutput != null)
      if (botOutput.case == 'create')
        this.router.navigate(["/pages/rpautomation/designer"], { queryParams: { botId: botOutput.botId } });
      else if (botOutput.case == 'update')
        this.getallbots();
  }


  closeFormOverlay(event){
  if(event)
    this.isCreateForm=true;
    this.botFormVisibility=false;
    this.hiddenPopUp=false;
    this.EdithiddenPopUp=false;
  }

  loopTrackBy(index, term) {
    return index;
  }

  clear(table: Table) {
    table.clear();
  }
  onNavigateToWorkSpace(row){
    this.router.navigate(["/pages/rpautomation/designer"], {
      queryParams: { botId: row.botId },
    });
  }
  cofigurationList(){
    this.router.navigate(["/pages/rpautomation/configurations"],{
      queryParams: {index:0}
    })
  }
  closeOverlay(event) {
    this.hiddenPopUp = event;
  }
  closeOverlay1(event) {
    this.EdithiddenPopUp = event;
  }
  fitTableView(description) {
    if (description && description.length > 15)
      return description.substr(0, 15) + "...";
    return description;
  }

  exportBot(botId)
  {
    this.rest.getbotdata(botId).subscribe((response:any)=>{
      if(response.errorMessage==undefined)
      {
        let botDetails:any={
          botName:response.botName,
          botDescription:response.description,
          department:response.department,
          tasks:[...response.tasks.map((item:any)=>{
            delete item.botTId;
            delete item.version;
            delete item.botId;
            delete item.versionNew;
            item.attributes=item.attributes.map((attrItem)=>{
              delete attrItem.botTaskId;
              delete attrItem.attrId;
              delete attrItem.botId;
              return attrItem;
            })
            return item;
          })],
          sequences:[...response.sequences.map((item:any)=>{
            delete item.botId;
            delete item.version;
            delete item.sequenceId;
            return item;
          })],
          envIds:[],
          versionType:'',
          botType:0,
          botMainSchedulerEntity:null,
          comments:"", 
          executionMode:response.executionMode   
        };
        this.downloadJson(botDetails)
      } else {

      }
    })
  }

  filteredEnvironments:any=[];
  filterEnvironments(categoryId)
  {
    this.importBotForm.get("environmentId").setValue("");
    this.filteredEnvironments=this.environments.filter(item=>item.categoryId==categoryId);
  }
importBot()
{
  this.final_tasks=[];
  this.finaldataobjects=[];
  let basicBotDetails={
    botName:this.importBotForm.get("botName").value,
    botDescription:this.importBotJson.botDescription,
    department:this.importBotForm.get("categoryId").value,
    isPredefined:this.importBotJson.isPredefined,
    categoryId:this.importBotForm.get("categoryId").value
  }
  this.modalRef.hide();
  this.spinner.show();
  this.rest.createBot(basicBotDetails).subscribe(async (response:any)=>{
    if(response.errorMessage==undefined)
    {
      this.finaldataobjects=[...this.importBotJson.tasks]
      let start=this.finaldataobjects.find((item:any)=>item.inSeqId.split("_")[0]=="START")?.inSeqId??undefined;
      this.stopNodeId=this.finaldataobjects.find((item:any)=>item.outSeqId.split("_")[0]=="STOP")?.outSeqId??undefined;
      if(this.finaldataobjects.executionMode=="v1") this.arrange_task_order(start);
      else this.final_tasks=[...this.finaldataobjects];
      this.importBotJson["botId"]=response.botId;
      this.importBotJson["botName"]=this.importBotForm.get("botName").value;
      this.importBotJson["envIds"]=[parseInt(this.importBotForm.get("environmentId").value)];
      this.importBotJson["tasks"]=[...this.final_tasks];
      this.importBotJson["department"]=response.department;
      (await this.rest.updateBot(this.importBotJson)).subscribe((response:any)=>{
        this.spinner.hide();
        Swal.fire("Success","Bot imported successfully","success");
        this.getallbots();
      },err=>{
        this.spinner.hide();
        Swal.fire("Error","Unable to bot task configurations","error");
      })
    }
  },err=>{
    this.spinner.hide();
    Swal.fire("Error","Unable to import bot","error");
  })
}


  validateBotName() {
    let botname = this.importBotForm.get("botName").value;
    this.rest.checkbotname(botname).subscribe(data => {
      this.spinner.hide()
      if (data == true) {
        this.checkbotname = false;
      } else {
        this.checkbotname = true;
      }
    })
  }

  downloadJson(payload:any)
  {
    payload=this.removeDuplicateTasks(payload);
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload));
    let dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href",dataStr);
    dlAnchorElem.setAttribute("download", payload.botName+".json");
    dlAnchorElem.click();
  }



  get importedBotName()
  {
    return this.importBotForm.get("botName").value;
  }

  arrange_task_order(start) {
    this.final_tasks = [];
    let object = this.finaldataobjects.find(
      (object) => object.inSeqId == start
    );
    this.add_order(object);
  }

  add_order(object) {
    let end = this.stopNodeId;
    if (object != undefined) {
      this.final_tasks.push(object);
    }

    if (object == undefined) {
      this.checkorderflag = false;
      return;
    }
    if (object.outSeqId == end) {
      return;
    } else {
      object = this.finaldataobjects.find(
        (object2) => object2.nodeId.split("__")[1] == object.outSeqId
      );
      if (object == undefined) {
        this.checkorderflag = false;
        return;
      } else if (object.taskName == "If condition") {
        this.final_tasks.push(object);
        if (JSON.parse(object.outSeqId).length < 2) {
          this.checkorderflag = false;
          return;
        }
        JSON.parse(object.outSeqId).forEach((report) => {
          if (report == end) {
            return;
          } else {
            let node = this.finaldataobjects.find(
              (process) => process.nodeId.split("__")[1] == report
            );
            this.add_order(node);
          }
        });
        return;
      } else {
        this.add_order(object);
      }
    }
    return;
  }


  removeDuplicateTasks(payload)
  {
    
    payload.tasks.forEach((item:any, index:number)=>{
      if(payload.tasks.filter((taskItem:any)=>taskItem.nodeId==item.nodeId).length>1)
      {
        payload.tasks.splice(index, 1);
      }
    })
    return payload;
  }

  getUsersList() {
    this.dt.tenantBased_UsersList.subscribe((res) => {
      if (res) {
        this.users_list = res;
      this.getallbots();
      }
    });
  }

  getColor(status) {
    return this.statusColors[status]?this.statusColors[status]:'';
  }
}


