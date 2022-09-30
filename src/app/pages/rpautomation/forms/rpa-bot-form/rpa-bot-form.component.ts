import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, Input, OnInit, Output, TemplateRef, ViewChild, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent, Sort } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'jquery';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, of } from 'rxjs';
import { APP_CONFIG } from 'src/app/app.config';
import { DataTransferService } from 'src/app/pages/services/data-transfer.service';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import Swal from 'sweetalert2';
import { fromMatSort, fromMatPaginator, sortRows, paginateRows } from '../../model/datasource-utils';
import { Rpa_Hints } from '../../model/RPA-Hints';
// import { MyFilter } from '../../rpa-home/rpa-home.component';
import { SearchRpaPipe } from '../../rpa-home/Search.pipe';

@Component({
  selector: 'app-rpa-bot-form',
  templateUrl: './rpa-bot-form.component.html',
  styleUrls: ['./rpa-bot-form.component.css']
})
export class RpaBotFormComponent implements OnInit {

  @Input() isbotForm : boolean;

  public isTableHasData = true;
  public respdata1=false;

   displayedColumns: string[] = ["botName","description","department","version","actions"];
  displayedColumns2: string[] = ["processName","taskName","Assign","status","successTask","failureTask","Operations"];
  departmentlist :string[] = ['Development','QA','HR'];
  botNameFilter = new FormControl('');
  botTypeFilter = new FormControl('');
  departmentFilter = new FormControl('');
  filteredValues: MyFilter = { department: [], botName: ''};
  dataSource1:MatTableDataSource<any>;
  dataSource2:MatTableDataSource<any>;
  public isDataSource: boolean;
  public userRole:any = [];
  public isButtonVisible = false;
  public bot_list:any=[];
  public process_names:any=[];
  public selectedvalue:any;
  public selectedTab:number;
  public responsedata;
  public selectedEnvironment:any='';
  public environments:any=[];
  public categaoriesList:any=[];
  loadflag:Boolean=false;
  customUserRole: any;
  term:any;
  pageSize:any=10;
  userFilter:any = { botName:'',department:'' };
  globalfilter:any;
  enableConfiguration: boolean=false;
  enablecreatebot: boolean=false;
  showWorkspace: boolean=false;
 modalRef: BsModalRef;
 exportid:any;
 allbots:any=[];
  @Output() pageChange: EventEmitter<number>;
  @Output() pageBoundsCorrection: EventEmitter<number>;

  importenv:any="";
  importcat:any="";
  importfile:any="";
  botImage:any=undefined;
  file_error:any="";
  @ViewChild("paginator1",{static:false}) paginator1: MatPaginator;
  @ViewChild("paginator2",{static:false}) paginator2: MatPaginator;
  @ViewChild("sort1",{static:false}) sort1: MatSort;
  @ViewChild("sort2",{static:false}) sort2: MatSort;
  modbotName: any;
  modbotDescription: any;
  modDepartment: any;
  count:any;
  botNamespace: boolean;
  checkbotname: boolean;
  botForm:FormGroup;
  rpaCategory: any="";
  newRpaCategory: any;
  config:any;
  userName:any="";
  displayedRows$: Observable<any[]>;
  rpaVisible:boolean=false;
  botslist:any=[]
  userCheck:boolean=false;
  @ViewChild(MatSort,{static:false}) sort: MatSort;
  totalRows$: Observable<number>;
  @ViewChild("paginator301",{static:false}) paginator301: MatPaginator;
  freetrail: string;
  botlistitems:any=[]
   categoryName:any;
  rpa_studio: any;

  constructor( private route: ActivatedRoute, 
    private rest:RestApiService, 
    private http:HttpClient, 
    private dt:DataTransferService, 
    private datahints:Rpa_Hints,
    private modalService: BsModalService,
    private formBuilder:FormBuilder,
    private router:Router,
    private spinner:NgxSpinnerService,
    @Inject(APP_CONFIG) private appconfig) { 
    this.botForm = this.formBuilder.group({
      botName: ["", Validators.compose([Validators.required, Validators.maxLength(30)])],
      botDepartment: ["", Validators.required],
      botDescription: ["", Validators.compose([Validators.maxLength(500)])],
      taskId: [""],
      predefinedBot: [false],
      newCategoryName: [""]
    });
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

  ngOnInit(): void {
    $('.link').removeClass('active');
    $('#rpa').addClass("active"); 
    $('#expand_menu').addClass("active");   


    this.userRole = localStorage.getItem("userRole")
    this.userRole = this.userRole.split(',');
    localStorage.setItem("isHeader","false");
    //this.isButtonVisible = this.userRole.includes('SuperAdmin') || this.userRole.includes('Admin') || this.userRole.includes('RPA Admin')||this.userRole.includes("Process Owner")||this.userRole.includes("System Admin")||;
    this.isButtonVisible=this.userRole.includes("Process Analyst")
    this.rpaVisible= this.userRole.includes('SuperAdmin') || this.userRole.includes('Admin') || this.userRole.includes('Process Owner') || this.userRole.includes('Process Architect')  || this.userRole.includes('Process Analyst')  || this.userRole.includes('RPA Developer')  || this.userRole.includes('Process Architect') || this.userRole.includes("System Admin")  || this.userRole.includes("User") ;
    this.userName=localStorage.getItem("firstName")+" "+localStorage.getItem("lastName");
    let processId=undefined;
    this.userCheck=this.userRole.includes("User")
    //this.dataSource1.filterPredicate = this.createFilter();
    this.dt.changeParentModule({"route":"/pages/rpautomation/home", "title":"RPA Studio"});
    this.dt.changeChildModule({"route":"/pages/rpautomation/home","title":"RPA Home"});
    this.sortkey={
        botName:true,
        version:true,
        botType:true,
        department:true,
        botStatus:true,
        description:true,
      }
    this.dt.changeHints(this.datahints.rpahomehints );
    // this.getCategoryList();
    this.getenvironments();
    
      
      this.getallbots();


    if(localStorage.getItem("taskId")!=undefined)
    {
       this.createtaskbotoverlay(localStorage.getItem("taskId"))
      localStorage.removeItem("taskId");
    }
    this.route.queryParams.subscribe(params => {
      processId=params;
      if(this.isEmpty(processId))
      {
        this.getautomatedtasks(0);
        this.selectedTab=0;
      }
      else
      {
        this.getautomatedtasks(processId.processid);
        this.selectedTab=1;
      }
     }

    );

  
          this.freetrail=localStorage.getItem('freetrail')
  }

  ngOnChanges(changes : SimpleChanges, botdetails){
    console.log(changes, this.isbotForm);
    if(!this.isbotForm){
      let category=botdetails.categoryName;
   let selectedcategory=this.categaoriesList.find(item=>item.categoryName==category)
    this.rpaCategory=selectedcategory.categoryId;
    if(this.rpaCategory==="others"){
    this.botForm.setValue({
      botId:botdetails.botId,
      botName:botdetails.botName, 
      department:this.rpaCategory, 
      description:botdetails.description,
      newCategoryName:this.newRpaCategory})
    }else{
      this.botForm.setValue({
        botId:botdetails.botId,
        botName:botdetails.botName, 
        department:this.rpaCategory, 
        description:botdetails.description,
        newCategoryName:this.rpaCategory})
    }
    if(this.categaoriesList.length==1){
      this.botForm.controls.department.disable()     
   }
   else{
     this.botForm.controls.department.enable()
   }
    } else {
      this.botForm=this.formBuilder.group({
        botName: ["", Validators.compose([Validators.required, Validators.maxLength(30)])],
        botDepartment:["", Validators.required],
        botDescription:["", Validators.compose([Validators.maxLength(500)])],
        taskId:[""],
        predefinedBot:[false],
        newCategoryName:[""]
    });
    }
    
  }

 

  assignreset(id)
  {
    let botId=$("#"+id+"__select").val();
    if(botId!=0)
      {
        $("#"+id+"__select").prop('selectedIndex',0);
      }
  }
  Resetfilters(){
    this.botNameFilter.setValue("");
    this.departmentFilter.setValue("");
    this.getallbots();
  }

  getallbots()
  {
    this.bot_list=[];
    let response:any=[];
    this.spinner.show();
    this.loadflag=true;
  
    this.rest.getAllActiveBots().subscribe(botlist =>
    {
      setTimeout(()=>{
        this.spinner.hide();
        this.loadflag=false;
      },1000)
      response=botlist;
      this.botlistitems=botlist;
      this.botslist=botlist
   
      response.forEach(data=>{ 
        let object:any=data;
      if(this.categaoriesList.find(resp => resp.categoryId==data.department)!=undefined)
      {
        object.department=this.categaoriesList.find(resp => resp.categoryId==data.department).categoryName;
      }
        if(data.department==1)
        {
          object.department='Development'
        }
        else if(data.department==2)
        {
          object.department='HR';
        }
        else if(data.department==3)
        {
          object.department='QA';
        }
        this.bot_list.push(object)
         this.assignPagination( this.bot_list);
      })
      this.bot_list=botlist;
      if(this.bot_list.length >0)
      {
        this.respdata1 = false;
      }else
      {
        this.respdata1 = true;
      }
      let selected_category=localStorage.getItem("rpa_search_category");
      if(this.categaoriesList.length == 1){
        this.categoryName=this.categaoriesList[0].categoryName;
      }else{
        this.categoryName=selected_category?selected_category:'allcategories';
      }
      this.searchByCategory(this.categoryName);
   
     this.allbots=response;
  
    },(err)=>{
      this.spinner.hide();
    })
  }

  

  applyFilter2(filterValue: string) {
    alert(filterValue)
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource1.filter = filterValue;
  }

  getautomatedtasks(process)
  {
    let response:any=[];

    this.spinner.show();
    this.rest.getautomatedtasks(process).subscribe(automatedtasks=>{
      response=automatedtasks;
      this.responsedata=response.automationTasks;
      this.dataSource2= new MatTableDataSource(response.automationTasks);
      this.dataSource2.sort=this.sort2;
      this.dataSource2.paginator=this.paginator2;
      if(process==0)
      {

        this.getprocessnames(undefined);
      }else
      {

        this.getprocessnames(process);
      }
      this.update_task_status();
      this.spinner.hide()
    },(err)=>{
      this.spinner.hide()

    })
  }



  getprocessnames(processId)
  {
    this.rest.getprocessnames().subscribe(processnames=>{
      this.process_names=processnames;
      let processnamebyid;
      if(processId != undefined)
      {
        processnamebyid=this.process_names.find(data=>processId==data.processId);
        this.selectedvalue=processnamebyid.processId;
        this.applyFilter(this.selectedvalue);
      }
      else
      {

        //this.rpa_studio.spinner.hide();
        this.selectedvalue="";
      }
    },(err)=>{
      //this.rpa_studio.spinner.hide();
    })
  }





  getStartIndex(currentPage: number, lastPage: number): string {
    let firstIndex = 1;
    if((currentPage !== lastPage) || (currentPage > 0 && lastPage > 0)) {
      firstIndex = (Number(this.pageSize) * (Number(currentPage) -1) + 1);
    }
    return firstIndex.toString();
  }

  getLastIndex(currentPage: number, lastPage: number): string {
    let lastIndex = this.bot_list ? this.bot_list.length : null;
    if((currentPage !== lastPage)) {
      lastIndex = (Number(this.pageSize) * (Number(currentPage)));
    }
    return lastIndex.toString();
  }


  applyFilter(filterValue:any) {
    let processnamebyid=this.process_names.find(data=>filterValue==data.processId);
    this.selectedvalue=filterValue;
    filterValue = processnamebyid.processName.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource2.filter = filterValue;
  }

  applyFilter1(filterValue: string) {

    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource1.filter = filterValue;
  }



  createoverlay()
  {
    this.botNamespace=false;
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
        this.botForm.reset();
        document.getElementById("create-bot").style.display = "block";
        if(this.categaoriesList.length==1){
          this.rpaCategory=this.categaoriesList[0].categoryId;
          let Id=this.categaoriesList[0].categoryId
          this.categoryName=this.categaoriesList[0].categoryName;       
            this.botForm.get('botDepartment').setValue(Id)
           this.botForm.controls.botDepartment.disable();   
        }
        else{
          this.botForm.get('botDepartment').setValue('')
          this.botForm.controls.botDepartment.enable();
        }
      }
    }
    else{
      this.botForm.reset();
      document.getElementById("create-bot").style.display = "block";
      if(this.categaoriesList.length==1){
        this.rpaCategory=this.categaoriesList[0].categoryId;
        let Id=this.categaoriesList[0].categoryId
        this.categoryName=this.categaoriesList[0].categoryName;       
          this.botForm.get('botDepartment').setValue(Id)
         this.botForm.controls.botDepartment.disable();   
      }
      else{
        this.botForm.get('botDepartment').setValue('')
        this.botForm.controls.botDepartment.enable();
      }
    }
  }


  


  onCreateSubmit() {
    if(this.isbotForm){
      this.userFilter.name = "";
   
      document.getElementById("create-bot").style.display ="none";
      var createBotFormValue=this.botForm.value;
       let createbot={
        "botName":createBotFormValue.botName,
       // "department":createBotFormValue.botDepartment
       "department":String(this.rpaCategory)
       }
      if(createBotFormValue.botDepartment=="others"){
        let rpaCategory:any={"categoryName":this.botForm.value.newCategoryName,"categoryId":0, "createdAt":""};
        this.rest.addCategory(rpaCategory).subscribe(data=>{
          let catResponse : any;
          if(catResponse.errorMessage==undefined)
          {
            catResponse=data;
            createBotFormValue.botDepartment=catResponse.data.categoryId;  
            this.spinner.show();
            this.rest.createBot(createbot).subscribe((res:any)=>{
              console.log("res",res)
              let botId=res.botId;
              if(res.errorMessage==undefined){
                this.spinner.hide()
                this.router.navigate(["/pages/rpautomation/designer"],{queryParams:{botId:botId}});
              }
              else{
                this.spinner.hide();
                Swal.fire("Error",res.errorMessage,"error");
              }        
           
             },err=>{
              this.spinner.hide();
              Swal.fire("Error",catResponse.errorMessage,"error");
            });
           // let botId=Base64.encode(JSON.stringify(createBotFormValue));
  
           
          }
          else
          {
            Swal.fire("Error",catResponse.errorMessage,"error");
          }
         
        });
      }else{
        this.spinner.show();
       // let botId=Base64.encode(JSON.stringify(createBotFormValue));
        this.rest.createBot(createbot).subscribe((res:any)=>{
          let botId=res.botId
          if(res.errorMessage==undefined){
            this.spinner.hide()
            this.router.navigate(["/pages/rpautomation/designer"],{queryParams:{botId:botId}});
          }
          else{
            this.spinner.hide();
            Swal.fire("Error",res.errorMessage,"error");
          }        
         },err=>{
          this.spinner.hide();
          Swal.fire("Error","error");
         })
      
         
      }
      this.botForm.reset();
    } else {
     this.onEditBot();
    }

  }

  onEditBot() {
    this.spinner.show()
    let botdetails = this.botForm.value;
    if(botdetails.department==="others"){
      this.saveRpaCategory().subscribe(data=>{
        let catResponse : any;
        catResponse=data;
        botdetails.department=catResponse.data.categoryId;
        let modbotdetails={
          "botId": botdetails.botId,
          "botName": botdetails.botName,
          "department": botdetails.department,
          "description": botdetails.description
         };
       
       this.rest.modifybotdetails(modbotdetails).subscribe(data=>{
        if(data.message==="Bot details updated successfully"){
          Swal.fire("Success","Bot Details Updated Successfully","success");
           this.getallbots();
        }else {
          Swal.fire("Error","Failed to update bot details","error");
        }
          })
          document.getElementById("edit-bot").style.display="none";
       },err=>{
        console.log(err)
        this.spinner.hide();
        Swal.fire("Error","Unable to update bot details","error")
       });
      } else {
      this.rest.modifybotdetails(botdetails).subscribe(data=>{
        this.spinner.hide();
        if(data.message==="Bot details updated successfully"){
          Swal.fire("Success","Bot Details Updated Successfully","success");
          this.getallbots();
        }else {
          Swal.fire("Error","Failed to update bot details","error");
        }
          },err=>{
            console.log(err)
            this.spinner.hide();
            Swal.fire("Error","Unable to update bot details","error")
          })
          document.getElementById("edit-bot").style.display="none";
        }
      }


  close()
  {
    document.getElementById("create-bot").style.display ="none";
    document.getElementById("edit-bot").style.display="none";
    if(document.getElementById("load-bot"))
    document.getElementById("load-bot").style.display ="none";
  }
  editclose(){
    document.getElementById("edit-bot").style.display="none";
    this.checkbotname=false;
  }
  

  assignbot(id)
  {
    let botId=$("#"+id+"__select").val();
    if(botId!=0)
    this.rest.assign_bot_and_task(botId,id,"EPSoft","Automated").subscribe(data=>{
      let response:any=data;
      if(response.status!=undefined)
      {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title:response.status,
          showConfirmButton: false,
          timer: 2000
        })
      }
    })



  }


  createtaskbotoverlay(taskId)
  {
   this.rpa_studio.onCreate(taskId);
    document.getElementById("create-bot").style.display ="block";
  }


  loadbotdata(botId)
  {
 
    this.router.navigateByUrl(`./designer?botId=${botId}`)
  }


  isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
  }


  

  resetbot(taskid:any)
  {
    $("#"+taskid+"__select").val((this.responsedata.find(data=>data.taskId==taskid).botId));
  }


  startprocess()
  {

    if(this.selectedvalue!=undefined)
    {
    //this.rpa_studio.spinner.show();
    this.rest.startprocess(this.selectedvalue,this.selectedEnvironment,'Serial').subscribe(data=>{
      let response:any=data;
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title:response.status,
        showConfirmButton: false,
        timer: 2000
      });
      //this.rpa_studio.spinner.hide();
      this.update_task_status();
    },(err)=>{
      //this.rpa_studio.spinner.hide();
    })
  }
  }


  resettasks()
  {

   // this.rpa_studio.spinner.show();
    this.rest.getautomatedtasks(0).subscribe(response=>{
      let data:any=response;
      this.dataSource2= new MatTableDataSource(data.automationTasks);
      this.dataSource2.sort=this.sort2;
      this.dataSource2.paginator=this.paginator2;
      if(this.selectedvalue==undefined)
      {
        this.applyFilter(this.selectedvalue)
      }

     // this.rpa_studio.spinner.hide();
    });
  }



  update_task_status()
  {
    let timer= setInterval(() => {
      this.rest.getautomatedtasks(0).subscribe(response=>{
        let responsedata:any=response;
        if(responsedata.automationTasks!=undefined)
        {
          if(responsedata.automationTasks.length==0)
          {
            clearInterval(timer);
          }else{
            responsedata.automationTasks.forEach(statusdata=>{
              let data:any;
              if(statusdata.status=="InProgress")
              {
                data="<span class='text-primary'><img src='../../../../assets/images/RPA/processloading.svg' style='height:25px'></span>&nbsp;<span class='text-primary'>"+statusdata.status+"</span>";
              }else if(statusdata.status=="Success")
              {
                //data="<img src='../../../../assets/images/RPA/processloading.svg' style='height:30px'>";

                data='<span class="text-success"><i class="fa fa-check" aria-hidden="true"></i></span>&nbsp;<span class="text-success">Success</span>';
              }
              else if(statusdata.status=="Failed")
              {
                data='<span class="text-danger"><i class="fa fa-times" aria-hidden="true"></i></span>&nbsp;<span class="text-danger">Failed</span>';
              }
              else if(statusdata.status=="New")
              {
                data="<span><img src='/assets/images/RPA/newicon.png' style='height:20px' ></span>&nbsp;<span class='text-primary'>"+statusdata.status+"</span>";
              }
              else if(statusdata.status=="")
              {
                data="---";
              }
              $("#"+statusdata.taskId+"__status").html(data);

              $("#"+statusdata.taskId+"__failed").html(statusdata.failureTask)

              $("#"+statusdata.taskId+"__success").html(statusdata.successTask)
              if(responsedata.automationTasks.filter(prodata=>prodata.status=="InProgress").length>0)
              {
              }else
              {
                clearInterval(timer);
              }
            })
          }
        }else
        {
          clearInterval(timer);
        }

      })

    }, 5000);
  }

  getenvironments()
  {
    this.rest.listEnvironments().subscribe(response=>{
      let resp:any=response
      if(resp.errorCode == undefined)
      {
        this.environments=response;
      }
    })
  }

  getCategoryList(){
    this.rest.getCategoriesList().subscribe(data=>{
      let catResponse : any;
      catResponse=data
      this.categaoriesList=catResponse.data.sort((a, b) => (a.categoryName.toLowerCase() > b.categoryName.toLowerCase()) ? 1 : ((b.categoryName.toLowerCase() > a.categoryName.toLowerCase()) ? -1 : 0));
      //console.log(this.categaoriesList)
      if(this.categaoriesList.length==1)
        this.rpaCategory=this.categaoriesList[0].categoryId;
    });
  }








  public sortkey:any;

  sortasc(colKey,sorttype)
  {
    let sortdes=this.sortkey[colKey];
    this.bot_list=this.bot_list.sort(function(a,b){
      let check_a=isNaN(a[colKey])?a[colKey].toUpperCase():a[colKey];
      let check_b=isNaN(b[colKey])?b[colKey].toUpperCase():b[colKey];
     
     
      if (sortdes==true)
        return (check_a > check_b) ? 1 : -1;
      else
        return (check_a < check_b) ? 1 : -1;
   },this);
   this.sortkey[colKey]=!sortdes;
  }
  botFormoverlay(botdetails){
    this.botNamespace=false
    document.getElementById("edit-bot").style.display="block";
   let category=botdetails.categoryName;
   let selectedcategory=this.categaoriesList.find(item=>item.categoryName==category)
    this.rpaCategory=selectedcategory.categoryId;
    if(this.rpaCategory==="others"){
    this.botForm.setValue({
      botId:botdetails.botId,
      botName:botdetails.botName, 
      department:this.rpaCategory, 
      description:botdetails.description,
      newCategoryName:this.newRpaCategory})
    }else{
      this.botForm.setValue({
        botId:botdetails.botId,
        botName:botdetails.botName, 
        department:this.rpaCategory, 
        description:botdetails.description,
        newCategoryName:this.rpaCategory})
    }
    if(this.categaoriesList.length==1){
      this.botForm.controls.department.disable()     
   }
   else{
     this.botForm.controls.department.enable()
   }
  }

  validate(code,event){
    let validate = code;
    let botname = event.target.value;
    this.count = 0;
    // for(let i=0;i < validate.length; i++){
    //   if(validate.charAt(i) == String.fromCharCode(32)||validate.charAt(i) == String.fromCharCode(46)){
    //     this.count= this.count+1;
    //   }
    // }
    var regex = new RegExp("^[a-zA-Z0-9_-]*$");

   

      if(!(regex.test(botname))){

        this.count=1;

      }
    if(this.count !== 0)
    {
      this.botNamespace = true;
    }
    else{
      this.botNamespace = false;
      
    }
  }




  checkBotnamevalidation()
  {
    let botname=this.botForm.get("botName").value;

    this.rest.checkbotname(botname).subscribe(data=>{
    if(data==true)
    {
      this.checkbotname=false;
    }else
    {
      this.checkbotname=true;
    }
    })
  }
  saveRpaCategory(){
    let rpaCategory:any={"categoryName":"","categoryId":0, "createdAt":""};
     rpaCategory["categoryName"] =this.botForm.value.newCategoryName;
   return this.rest.addCategory(rpaCategory);
  }
  searchByCategory(category) {   
    localStorage.setItem('rpa_search_category',category);    // Filter table data based on selected categories
    var filter_saved_diagrams= []
    this.botslist=[]
    if (category == "allcategories") {
     this.botslist=this.botlistitems;
     this.assignPagination(this.botslist);
      // this.dataSource.filter = fulldata;
    }
    else{  
      filter_saved_diagrams=this.botlistitems;
      
      filter_saved_diagrams.forEach(e=>{
        if(e.categoryName===category){
          this.botslist.push(e)
        }
      });
      this.assignPagination(this.botslist);
    }
  }
  onbotForm() {
    this.spinner.show()
    let botdetails = this.botForm.value;
    if(botdetails.department==="others"){
      this.saveRpaCategory().subscribe(data=>{
        let catResponse : any;
        catResponse=data;
        botdetails.department=catResponse.data.categoryId;
        let modbotdetails={
          "botId": botdetails.botId,
          "botName": botdetails.botName,
          "department": botdetails.department,
          "description": botdetails.description
         };
       
       this.rest.modifybotdetails(modbotdetails).subscribe(data=>{
        if(data.message==="Bot details updated successfully"){
          Swal.fire("Success","Bot Details Updated Successfully","success");
           this.getallbots();
        }else {
          Swal.fire("Error","Failed to update bot details","error");
        }
          })
          document.getElementById("edit-bot").style.display="none";
       },err=>{
        console.log(err)
        this.spinner.hide();
        Swal.fire("Error","Unable to update bot details","error")
       });
      } else {
      this.rest.modifybotdetails(botdetails).subscribe(data=>{
        this.spinner.hide();
        if(data.message==="Bot details updated successfully"){
          Swal.fire("Success","Bot Details Updated Successfully","success");
          this.getallbots();
        }else {
          Swal.fire("Error","Failed to update bot details","error");
        }
          },err=>{
            console.log(err)
            this.spinner.hide();
            Swal.fire("Error","Unable to update bot details","error")
          })
          document.getElementById("edit-bot").style.display="none";
        }
      }

  assignPagination(data) {
    const sortEvents$: Observable<Sort> = fromMatSort(this.sort);
    const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator301);
    const rows$ = of(data);
    // this.totalRows$ = rows$.pipe(map((rows: string | any[]) => rows.length));
    this.displayedRows$ = rows$.pipe(sortRows(sortEvents$), paginateRows(pageEvents$));
    this.paginator301.firstPage();
  }


}

export interface dataSource1 {
  department: string;
  botName: string;
}

export interface MyFilter {
  department: string[],
  botName: string,
}