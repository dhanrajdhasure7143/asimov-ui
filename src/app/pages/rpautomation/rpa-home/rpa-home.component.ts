import { Component, OnInit, TemplateRef, ViewChild, Output, EventEmitter, Inject, Input } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { RestApiService } from '../../services/rest-api.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/filter';
// import * as $ from 'jquery';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { APP_CONFIG } from 'src/app/app.config';
import { Table } from 'primeng/table';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { DataTransferService } from '../../services/data-transfer.service';
import {ConfirmationService } from "primeng/api";
import { ToasterService } from 'src/app/shared/service/toaster.service';
import { toastMessages } from 'src/app/shared/model/toast_messages';
import { environment } from 'src/environments/environment';
import { CryptoService } from 'src/app/services/crypto.service';
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
    { ColumnName: 'description', DisplayName: 'Description',filterType:"text",filterWidget:"normal", ShowFilter:true,showTooltip:true},
    { ColumnName: 'categoryName', DisplayName: 'Category',filterType:"text",filterWidget:"dropdown",ShowFilter:true,dropdownList:this.categories_list_new},
    { ColumnName: 'version_new', DisplayName: 'Version',filterType:"text",filterWidget:"normal",ShowFilter:true},
    { ColumnName: 'createdBy', DisplayName: 'Created By',filterType:"text",filterWidget:"normal",ShowFilter:true },
    // { ColumnName: 'last_modified_date', DisplayName: 'Last Modified',filterType:"date",filterWidget:"normal",ShowFilter:true },
    { ColumnName: 'botStatus', DisplayName: 'Status',filterType:"text",filterWidget:"dropdown",ShowFilter:true,dropdownList:["Success","Running","New","Failure","Killed","Stopped"] },
    { ColumnName: '', DisplayName: 'Actions' }
  ];
  EdithiddenPopUp:boolean=false;
  importBotForm=new FormGroup({
    botName:new FormControl("", Validators.compose([Validators.required,Validators.maxLength(50),Validators.minLength(1), Validators.pattern("^[a-zA-Z0-9_-]*$")])),
    categoryId:new FormControl("", Validators.compose([Validators.required])),
    environmentId:new FormControl("", Validators.compose([Validators.required])),
    description:new FormControl("", )
  })
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
  searchValue: string;
  @ViewChild("dt1",{static:true}) table:Table
  isConfigurationEnable : boolean = false;
  showLoader:boolean = false;
  isExportBot:boolean = false;
  exportType:any;
  selectedTaskList:any[]=[];
  bot_tasksList:any[]=[];
  isExportDisable:boolean = false;
  bot_toExport:any={};
  import_BotData:any;
  importBot_overlay:boolean = false;
  filteredEnvironments:any=[];

  constructor(
    private rest: RestApiService,
    private router: Router,
    private spinner: LoaderService,
   @Inject(APP_CONFIG) private appconfig,
    private dt : DataTransferService,
    private confirmationService:ConfirmationService,
    private toastService: ToasterService,
    private toastMessages: toastMessages,
    private crypto : CryptoService
  ) { }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.columns_list.filter((col) =>
      val.includes(col)
    );
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
    //this.spinner.show();
    this.getCategoryList();
    this.getenvironments();
    // this.getallbots();
    this.getUsersList();
    this._selectedColumns = this.columns_list;
    this.freetrail = localStorage.getItem('freetrail')
    this.dt.resetTableSearch$.subscribe((res)=>{
      if(res == true){
        this.clearTableFilters(this.table);
      }
    })
    this.isConfigurationEnable = environment.isRPAConfigurationsImportEnabled;
  }

  botdelete(bot) {
    this.confirmationService.confirm({
      header: 'Are you sure?',
      message: "Do you want to delete this bot? This can't be undo.",
      acceptLabel:'Yes',
      rejectLabel:'No',
      rejectButtonStyleClass: ' btn reset-btn',
      acceptButtonStyleClass: 'btn bluebg-button',
      defaultFocus: 'none',
      rejectIcon: 'null',
      acceptIcon: 'null',
      accept: () => {
        let response;
        this.spinner.show()
        this.rest.getDeleteBot(bot.botId).subscribe(data => {
          response = data;
          if (response.status != undefined) {
            this.spinner.hide()
            this.getallbots();
            this.toastService.showSuccess(bot.botName,'delete');
          } else {
            this.spinner.hide();
            this.toastService.showError(response.errorMessage);
          }
        })
        // setTimeout(() => {
        //   this.getallbots();
        // }, 550);
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
          text: "You have limited access to this product. Please contact the EZFlow support team for more details.",
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
              this.toastService.showError(res.errorMessage);
            }
          }, err => {
            this.spinner.hide();
            this.toastService.showError(catResponse.errorMessage);
          });
          // let botId=Base64.encode(JSON.stringify(createBotFormValue));
        }
        else {
          this.toastService.showError(catResponse.errorMessage);
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
         this.toastService.showError(res.errorMessage);
        }
      }, err => {
        this.spinner.hide();
        // this.messageService.add({severity:'error', summary: 'Error', detail:'Error'});
        this.toastService.showError(this.toastMessages.createError);
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
          this.toastService.showSuccess(response.status,'response');
          this.getallbots();
        }
        else
          this.toastService.showError(response.errorMessage);
        this.getallbots();
      })

    }
  }

  Change(event) {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement.files;
      const file = files[0];
    var reader = new FileReader();
    var extarr = file.name.split('.');
    var ext = extarr.reverse()[0];
    this.file_error = "";
    if (ext == "json"){
      reader.readAsText(file);
      this.spinner.show();
      reader.onload = (e) => {
        let botDetails=(JSON.parse(reader.result.toString()));
        this.import_BotData=botDetails;
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
      // this.messageService.add({severity:'success', summary: 'Success', detail:'Bot exported successfully!'});
      this.toastService.showSuccess(this.toastMessages.botExport,'response');
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

  clearTableFilters(table: Table) {
   this.searchValue=""
   table.filterGlobal("","");
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

  onclickDownload(item){
    this.isExportBot = true;
    this.exportType = null;
    this.selectedTaskList =[];
    this.bot_toExport={};
    this.bot_toExport["botName"]= item.botName + " (V"+ item.version_new +")"
    this.bot_toExport["botId"]= item.botId
    this.rest.getbotTaskList(item.botId).subscribe((res:any)=>{
      this.bot_tasksList = res.actionItems
    })
    return
    this.rest.getbotdata(item.botId).subscribe((response:any)=>{
      if(response.errorMessage==undefined){
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
              if(!this.isConfigurationEnable){
                attrItem.attrValue="";
              }
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
          executionMode:response.executionMode,
          startStopCoordinate:response.startStopCoordinate   
        };
        // this.downloadJson(botDetails)
      } else {

      }
    })
  }

  filterEnvironments(event){
    console.log(event)
    this.importBotForm.get("environmentId").setValue("");
    this.filteredEnvironments=this.environments.filter(item=>item.categoryId==event.value);
  }

importBot(){
  this.final_tasks=[];
  this.finaldataobjects=[];
  let basicBotDetails={
    botName:this.importBotForm.get("botName").value,
    botDescription:this.import_BotData.botDescription,
    department:this.importBotForm.get("categoryId").value,
    isPredefined:this.import_BotData.isPredefined,
    categoryId:this.importBotForm.get("categoryId").value
  }
  this.spinner.show();
  this.rest.createBot(basicBotDetails).subscribe( async (response:any)=>{
    if(response.errorMessage==undefined){
      this.import_BotData=this.updateNodeIds(this.import_BotData, basicBotDetails);
      this.finaldataobjects = [...this.import_BotData.tasks]
      let start=this.finaldataobjects.find((item:any)=>item.inSeqId.split("_")[0]=="START")?.inSeqId??undefined;
      this.stopNodeId=this.finaldataobjects.find((item:any)=>item.outSeqId.split("_")[0]=="STOP")?.outSeqId??undefined;
      if(this.import_BotData.executionMode=="v1") this.arrange_task_order(start);
      else this.final_tasks=[...this.finaldataobjects];
      this.import_BotData["botId"]=response.botId;
      this.import_BotData["botName"]=this.importBotForm.get("botName").value;
      this.import_BotData["envIds"]=[parseInt(this.importBotForm.get("environmentId").value)];
      this.import_BotData["tasks"]=[...this.final_tasks];
      this.import_BotData["department"]=response.department;
      (await this.rest.updateBot(this.import_BotData)).subscribe((response:any)=>{
        this.spinner.hide();
        this.toastService.showSuccess(this.toastMessages.botImport,'response');
        this.resetImportBotForm();
        this.getallbots();
      },err=>{
        this.spinner.hide();
        this.resetImportBotForm();
        this.toastService.showError(this.toastMessages.botConfigError);
      });
    }
  },err=>{
    this.spinner.hide();
    this.resetImportBotForm();
    this.toastService.showError(this.toastMessages.botImportError);
  })
}


  resetImportBotForm(){
    this.import_BotData=undefined;
    this.file_error="";
    this.importBotForm.reset();
    this.importBotForm.get("categoryId").setValue("");
    this.importBotForm.get("environmentId").setValue("");
    this.importBotForm.get("botName").setValue('');
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

  downloadJson(payload:any){
    payload=this.removeDuplicateTasks(payload);
  //  payload=this.updateNodeIds(payload);
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload));
    let dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href",dataStr);
    dlAnchorElem.setAttribute("download", payload.botName+".json");
    dlAnchorElem.click();
    this.downloadEncryptedData(JSON.stringify(payload))
  }



  get importedBotName(){
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


  removeDuplicateTasks(payload){
    
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


  approvalsList()
  {
    this.router.navigate(["/pages/rpautomation/approvals"])
  }


  updateNodeIds(payload, botDetails){
    
    payload.tasks.forEach((item:any, index)=>{
      let nodeId=payload.tasks[index].nodeId;
      if(item.inSeqId.split("_")[0]=="START"){
        payload.tasks[index].inSeqId="START_"+botDetails.botName;
      }
      if(item.outSeqId.split("_")[0]=="STOP"){
        payload.tasks[index].outSeqId="STOP_"+botDetails.botName;
      }
      
      let nodeSplitId=nodeId.split("__");
      if(nodeSplitId[0]!="START" && nodeSplitId[0]!="STOP"){
        let actualNodeID=nodeSplitId[1];
        let newNodeId=this.idGenerator()
        payload.tasks[index].nodeId=nodeSplitId[0]+"__"+newNodeId;
        if(payload.tasks.find((taskItem:any)=>taskItem.inSeqId==actualNodeID)) payload.tasks.find((taskItem:any)=>taskItem.inSeqId==actualNodeID).inSeqId=newNodeId;
        if(payload.tasks.find((taskItem:any)=>taskItem.outSeqId==actualNodeID)) payload.tasks.find((taskItem:any)=>taskItem.outSeqId==actualNodeID).outSeqId=newNodeId;
        payload.sequences.forEach((item, index2)=>{
          if(item.sourceTaskId.split("_")[0]=="START"){
            payload.sequences[index2].sourceTaskId="START_"+botDetails.botName
          }
          if(item.targetTaskId.split("_")[0]=="STOP"){
            payload.sequences[index2].targetTaskId="STOP_"+botDetails.botName
          }
          if(item.sourceTaskId==actualNodeID){
              payload.sequences[index2].sourceTaskId=newNodeId;
          }
          else if(item.targetTaskId==actualNodeID){
            payload.sequences[index2].targetTaskId=newNodeId;
          }
        })
      }

    });
    return payload;
  }


  idGenerator() {
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
    );
  }

  closeLoader(){
    // this.downloadEncryptedData("hfuwefhuhwefhwef jefwejfiwefij")
  }
  
  closeExportOverlay(event) {
    this.isExportBot = event;
  }

  onchangeCustomConfig(){
        this.exportType === 'customConfig' ? (this.isExportDisable = true) : (this.isExportDisable = false, this.selectedTaskList = []);
  }
  
  ontaskListChange(){
    this.selectedTaskList.length >0 ? this.isExportDisable= false : this.isExportDisable= true; 
  }

  getEncryptedData(){
    let req_body={
      "exportType": this.exportType,
      "taskList": this.selectedTaskList
    }
    this.showLoader = true;
    this.isExportBot = false;
    this.rest.getEncryptedbotData(this.bot_toExport.botId,req_body).subscribe((res:any)=>{
      if(res)
      if(res.code != 4200){
        this.showLoader = false;
        this.toastService.showError(this.bot_toExport.botName+" "+res.message);
      }else{
        let data:any = res;
        if(data.message){
          // this.downloadEncryptedData(this.crypto.encrypt(JSON.stringify(data.data)));
          // this.downloadEncryptedData(JSON.stringify(data.data));
          this.toastService.toastSuccess(this.bot_toExport.botName+" "+this.toastMessages.exportSuccess);
          this.showLoader = false;
          this.removeUnusedData(data.data.botData)
      }
    }
    },err=>{
      this.toastService.showError(this.bot_toExport.botName+" "+this.toastMessages.exportError);
      this.showLoader = false;
    })
  }

  removeUnusedData(response){
    if(response.errorMessage==undefined){
      let botDetails:any={
        botName:response.botName,
        // botDescription:response.description,
        department:response.department,
        categoryId:response.categoryId,
        tasks:[...response.tasks.map((item:any)=>{
          delete item.botTId;
          delete item.version;
          delete item.botId;
          delete item.versionNew;
          item.attributes=item.attributes.map((attrItem)=>{
            delete attrItem.botTaskId;
            delete attrItem.attrId;
            delete attrItem.botId;
            // if(!this.isConfigurationEnable){
            //   attrItem.attrValue="";
            // }
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
        executionMode:response.executionMode,
        startStopCoordinate:response.startStopCoordinate   
      };
      // this.downloadJson(botDetails)
       this.downloadEncryptedData(this.crypto.encrypt(JSON.stringify(botDetails)));
    } else {

    }
  }

  downloadEncryptedData(encryptedData): void {
    let envName = environment.environmentName
    let sub_envName = localStorage.getItem("tenantSwitchName")?localStorage.getItem("tenantSwitchName"):"Production";
    let company = localStorage.getItem("company")?localStorage.getItem("company"):""
    const blob = new Blob([encryptedData], { type: 'application/octet-stream' });
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(blob);
    // downloadLink.download = this.bot_toExport.botName+"_"+company+"_"+sub_envName+"_"+envName+'.txt'; // Set the desired filename
    downloadLink.download = this.bot_toExport.botName+"_"+envName+"_"+company+"_"+sub_envName+'.txt'; // Set the desired filename
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    this.showLoader = false;
  }

  onFileChange(event) {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const content = event.target?.result as string;
        console.log('File content:', content);
      };
      reader.onerror = (event: ProgressEvent<FileReader>) => {
        console.error('Error reading file.');
      };
      reader.readAsText(file);
      reader.onload = (e) => {
        // this.import_BotData  = this.crypto.decrypt(JSON.parse(reader.result.toString()));
        this.import_BotData  = JSON.parse(this.crypto.decrypt(reader.result.toString()));
        console.log(this.import_BotData)
        // this.importBotForm.get("botName").setValue(this.import_BotData.botName);
        this.validateBotName();
      }
    }
  }

  importEncryptedBotData(){
    this.final_tasks=[];
    this.finaldataobjects=[];
    let basicBotDetails={
      botName:this.importBotForm.get("botName").value,
      description:this.importBotForm.get("description").value,
      department:this.importBotForm.get("categoryId").value,
      isPredefined:this.import_BotData.isPredefined,
      categoryId:this.importBotForm.get("categoryId").value
    }
    this.spinner.show();
    let req_body:any={};
    this.rest.createBot(basicBotDetails).subscribe(async (response:any)=>{
      this.import_BotData=this.updateNodeIds(this.import_BotData, basicBotDetails);
      this.finaldataobjects = [...this.import_BotData.tasks]
      let start=this.finaldataobjects.find((item:any)=>item.inSeqId.split("_")[0]=="START")?.inSeqId??undefined;
      this.stopNodeId=this.finaldataobjects.find((item:any)=>item.outSeqId.split("_")[0]=="STOP")?.outSeqId??undefined;
      if(this.import_BotData.executionMode=="v1") this.arrange_task_order(start);
      else this.final_tasks=[...this.finaldataobjects];
      this.import_BotData["botId"]=response.botId;
      this.import_BotData["botName"]=this.importBotForm.get("botName").value;
      this.import_BotData["envIds"]=[parseInt(this.importBotForm.get("environmentId").value)];
      this.import_BotData["tasks"]=[...this.final_tasks];
      this.importBot_overlay= false;
        // req_body["botId"]=response.botId;
        // req_body["botName"]=this.importBotForm.get("botName").value;
        // req_body["envIds"]=[parseInt(this.importBotForm.get("environmentId").value)];
        // req_body["department"]=response.department;
        req_body["botData"]  = this.import_BotData;
        // let req_payload= this.crypto.encrypt(JSON.stringify(this.import_BotData));
        let req_payload= this.import_BotData;
        this.getRplacedTaskIds(req_payload);
      // (await this.rest.importBotwithEncryptedData(req_payload)).subscribe((response:any)=>{
      //   this.spinner.hide();
      //   this.toastService.showSuccess(this.importBotForm.get("botName").value+" "+this.toastMessages.botImport,'response');
      //   this.resetImportBotForm();
      //   this.getallbots();
      // },err=>{
      //   this.spinner.hide();
      //   this.resetImportBotForm();
      //   this.toastService.showError(this.toastMessages.botConfigError);
      // })
    },err=>{
      this.toastService.showError("Failed to import bot");
      this.spinner.hide();
    })
  }

  onCancelImport(){
    this.resetImportBotForm();
    this.importBotForm.get("botName").setValue('')
    this.importBot_overlay= false;
  }

  openModal() {
    if (this.freetrail == 'true') {
      if (this.bot_list.length == this.appconfig.rpabotfreetraillimit) {
        this.confirmationService.confirm({
          message: 'You have limited access to this product. Please contact the EZFlow support team for more details.',
          header: 'Error',
          rejectVisible: false,
          acceptLabel: "Ok",
          acceptButtonStyleClass: 'btn bluebg-button',
          defaultFocus: 'none',
          acceptIcon: 'null',
          accept: () => {},
        });
      }
      else {
        this.importfile = "";
        this.file_error = "";
        this.importcat = "";
        this.importBot_overlay = true;
      }
    }else {
      this.resetImportBotForm();
      this.importBotForm.get("botName").setValue('');
      this.importBot_overlay = true;
      this.importfile = "";
      this.file_error = "";
      this.importcat = "";
    }
  }

  getRplacedTaskIds(botData){
    console.log("botData",botData)
    let task_list=[]
    this.rest.toolSet().subscribe((response:any)=>{
      console.log(response)

      response.Advanced.forEach(element => {
        element.taskList.forEach(item => {
        task_list.push(item)
        });
      });
      response.General.forEach(element => {
        element.taskList.forEach(item => {
          task_list.push(item)
        });
      });
      console.log("totaltask_list",task_list);
      // console.log("botData",botData)
       let generatedPyload :any= this.generateImportPayload(task_list,botData)
       setTimeout(() => {
          console.log("generatedPyload",generatedPyload)
          console.log("generatedPyload",JSON.stringify(generatedPyload))
      //  this.rest.importBotwithEncryptedData(this.crypto.encrypt(JSON.stringify(generatedPyload))).subscribe((response:any)=>{
        this.rest.importBotwithEncryptedData(generatedPyload).subscribe((response:any)=>{
        this.spinner.hide();
        this.toastService.showSuccess(this.importBotForm.get("botName").value+" "+this.toastMessages.botImport,'response');
        this.resetImportBotForm();
        this.getallbots();
      },err=>{
        this.spinner.hide();
        this.resetImportBotForm();
        this.toastService.showError(this.toastMessages.botConfigError);
      })
       }, 1000);
    })
  }

  generateImportPayload(task_list,botData){
    let depractedTask = task_list.filter(item =>{return item.name == "Deprecated" });
  //  console.log("depractedTask",depractedTask)
  botData.tasks.map(element => {
      task_list.forEach(item => {
        if(element.isConnectionManagerTask){
          
          let splitValue=element.nodeId.split("__")
              element["taskName"] = depractedTask[0].name;
              element["tMetaId"] = Number(depractedTask[0].taskId);
              element["attributes"] = [];
              element["nodeId"] = "Developer __"+splitValue[1]
              element["taskConfiguration"] = "null"
              element["isConnectionManagerTask"] = false
              element["actionUUID"] = "null"
          
          } else{ 
              if(element.taskName == item.name){
                element.tMetaId = Number(item.taskId)
              }
          }
      });
    });
    // setTimeout(() => {
    //   console.log(JSON.stringify(botData))
    // }, 1000);
    return botData
  }

}


