import { Component, OnInit, TemplateRef, ViewChild, Output, EventEmitter, Inject } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { RestApiService } from '../../services/rest-api.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { DataTransferService } from "../../services/data-transfer.service";
import { Rpa_Hints } from "../model/RPA-Hints"
// import * as $ from 'jquery';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs/Observable';
import { Sort } from '@angular/material';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';
import { fromMatPaginator, fromMatSort, paginateRows, sortRows } from '../model/datasource-utils';
import { NgxSpinnerService } from 'ngx-spinner';
import { APP_CONFIG } from 'src/app/app.config';
import { SearchRpaPipe } from './Search.pipe';
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
  @Output() pageChange: EventEmitter<number>;
  @Output() pageBoundsCorrection: EventEmitter<number>;

  importenv: any = "";
  importcat: any = "";
  importfile: any = "";
  botImage: any = undefined;
  file_error: any = "";
  isCreateForm: boolean = false;
  botDetails: any;
  @ViewChild("paginator1", { static: false }) paginator1: MatPaginator;
  @ViewChild("paginator2", { static: false }) paginator2: MatPaginator;
  @ViewChild("sort1", { static: false }) sort1: MatSort;
  @ViewChild("sort2", { static: false }) sort2: MatSort;
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
  botslist: any = []
  userCheck: boolean = false;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  totalRows$: Observable<number>;
  @ViewChild("paginator301", { static: false }) paginator301: MatPaginator;
  freetrail: string;
  botlistitems: any = []
  categoryName: any;
  public sortkey: any;

  constructor(
    private rest: RestApiService,
    private modalService: BsModalService,
    private router: Router,
    private spinner: NgxSpinnerService,
    @Inject(APP_CONFIG) private appconfig
  ) { }

  openModal(template: TemplateRef<any>) {
    if (this.freetrail == 'true') {
      if (this.bot_list.length == this.appconfig.rpabotfreetraillimit) {
        Swal.fire({
          title: 'Error',
          text: "You have limited access to this product. Please contact EZFlow support team for more details.",
          position: 'center',
          icon: 'error',
          showCancelButton: false,
          confirmButtonColor: '#007bff',
          cancelButtonColor: '#d33',
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
    this.getCategoryList();
    this.getenvironments();
    this.getallbots();
    this.freetrail = localStorage.getItem('freetrail')
  }

  botdelete(botId) {
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
        let response;
        this.spinner.show()
        this.rest.getDeleteBot(botId).subscribe(data => {
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
    this.bot_list = [];
    let response: any = [];
    this.spinner.show();
    this.loadflag = true;
    this.rest.getAllActiveBots().subscribe(botlist => {
        this.loadflag = false;
      response = botlist;
      response.map(item => {
        if (item.version_new != null) {
          item["version_new"] = parseFloat(item.version_new)
          item["version_new"] = item.version_new.toFixed(1)
        }
      })
      this.botlistitems = botlist;
      this.botslist = botlist
      this.bot_list = botlist
      this.assignPagination(this.bot_list);
      this.spinner.hide();
      let selected_category = localStorage.getItem("rpa_search_category");
      if (this.categaoriesList.length == 1) {
        this.categoryName = this.categaoriesList[0].categoryName;
      } else {
        this.categoryName = selected_category ? selected_category : 'allcategories';
      }
      this.searchByCategory(this.categoryName);
    }, (err) => {
      this.spinner.hide();
    })
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
          confirmButtonColor: '#007bff',
          cancelButtonColor: '#d33',
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
    var extarr = file.name.split('.')
    var ext = extarr.reverse()[0]
    this.file_error = "";
    if (ext == "sql")
      this.importfile = file
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


  getBotImage(botId, version, event) {
    this.botImage = undefined
    this.rest.getBotImage(botId, version).subscribe(data => {
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
      if (this.categaoriesList.length == 1){
        this.rpaCategory = this.categaoriesList[0].categoryId;
          this.categoryName = this.categaoriesList[0].categoryName;
      }
    });
  }


  openEditBotOverlay(botDetails: any) {
    this.isCreateForm = false;
    this.botDetails = botDetails;
    document.getElementById('bot-form').style.display = 'block';
  }


  openCreateBotOverlay() {
    this.isCreateForm = true;
    this.botDetails = undefined;
    document.getElementById('bot-form').style.display = 'block';
  }


  botFormOutput(botOutput: any) {
    if (botOutput != null)
      if (botOutput.case == 'create')
        this.router.navigate(["/pages/rpautomation/designer"], { queryParams: { botId: botOutput.botId } });
      else if (botOutput.case == 'update')
        this.getallbots();
  }

  searchByCategory(category) {
    localStorage.setItem('rpa_search_category', category);    // Filter table data based on selected categories
    var filter_saved_diagrams = []
    this.botslist = []
    if (category == "allcategories") {
      this.botslist = this.botlistitems;
      this.assignPagination(this.botslist);
    } else {
      filter_saved_diagrams = this.botlistitems;
      filter_saved_diagrams.forEach(e => {
        if (e.categoryName === category) {
          this.botslist.push(e)
        }
      });
      this.assignPagination(this.botslist);
    }
  }

  assignPagination(data) {
    const sortEvents$: Observable<Sort> = fromMatSort(this.sort);
    const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator301);
    const rows$ = of(data);
    this.totalRows$ = rows$.pipe(map(rows => rows.length));
    this.displayedRows$ = rows$.pipe(sortRows(sortEvents$), paginateRows(pageEvents$));
    this.paginator301.firstPage();
  }

  applySearchFilter(v) {
    const filterPipe = new SearchRpaPipe();
    const fiteredArr = filterPipe.transform(this.botslist, v);
    this.assignPagination(fiteredArr)
  }

  closeFormOverlay(event){
  if(event)
  this.isCreateForm=true;
  }

}


