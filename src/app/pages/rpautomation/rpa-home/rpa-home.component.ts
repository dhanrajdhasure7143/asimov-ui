import {Component, OnInit, TemplateRef,ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {RestApiService} from '../../services/rest-api.service';
import {RpaStudioComponent} from '../rpa-studio/rpa-studio.component';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';
import { DataTransferService } from "../../services/data-transfer.service";
import { Rpa_Hints } from "../model/RPA-Hints"
// import * as $ from 'jquery';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../service-orchestration/orchestration/so-dashboard/so-dashboard.component';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { validateHorizontalPosition } from '@angular/cdk/overlay';
import { isNumber } from 'util';

import { Observable  } from 'rxjs/Observable';
import { Sort } from '@angular/material';
import { of  } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';
import { fromMatPaginator, fromMatSort, paginateRows, sortRows } from '../model/datasource-utils';

declare var $:any;

@Component({
  selector: 'app-rpa-home',
  templateUrl: './rpa-new-home.component.html',
  styleUrls: ['./rpa-home.component.css']
})
export class RpaHomeComponent implements OnInit {
  public isTableHasData = true;
  public respdata1=false;

  displayedColumns: string[] = ["botName","description","department","botType","version","botStatus","actions"];
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
  userFilter:any = { botName:'',department:'' };
  globalfilter:any;
  enableConfiguration: boolean=false;
  enablecreatebot: boolean=false;
  showWorkspace: boolean=false;
 modalRef: BsModalRef;
 exportid:any;
 allbots:any=[];

 importenv:any="";
 importcat:any="";
 importfile:any="";

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
  public editbot:FormGroup;
  rpaCategory: any;
  newRpaCategory: any;

  displayedRows$: Observable<any[]>;
  @ViewChild(MatSort,{static:false}) sort: MatSort;
  totalRows$: Observable<number>;
  @ViewChild(MatPaginator,{static:false}) paginator301: MatPaginator;

  constructor(
    private route: ActivatedRoute, 
    private rest:RestApiService, 
    private rpa_studio:RpaStudioComponent,
    private http:HttpClient, 
    private dt:DataTransferService, 
    private datahints:Rpa_Hints,
    private modalService: BsModalService,
    private formBuilder:FormBuilder
    )
  {
    this.editbot=this.formBuilder.group({
      botId: ["", Validators.required],
      botName: ["", Validators.compose([Validators.required, Validators.maxLength(30)])],
      department:["", Validators.required],
      description:["", Validators.compose([Validators.maxLength(500)])],
      newCategoryName:[""]
     });
  }

  openModal(template: TemplateRef<any>) {
    this.importfile="";
    this.file_error="";
    this.importcat="";
    this.modalRef = this.modalService.show(template,{class: 'modal-lr'});
  }

  ngOnInit() {
    $('.link').removeClass('active');
    $('#rpa').addClass("active"); 
    $('#expand_menu').addClass("active");   
    this.userRole = localStorage.getItem("userRole")
    this.userRole = this.userRole.split(',');
    localStorage.setItem("isHeader","false");
    this.isButtonVisible = this.userRole.includes('SuperAdmin') || this.userRole.includes('Admin') || this.userRole.includes('RPA Admin');

    let processId=undefined;
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
    this.getCategoryList();
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

    // this.rest.getCustomUserRole(2).subscribe(role=>{
    //   this.customUserRole=role.message[0].permission;
    //   this.customUserRole.forEach(element => {
    //     if(element.permissionName.includes('RPA_Bot_Configuration_full')){
    //       this.enableConfiguration=true;
    //     } if(element.permissionName.includes('RPA_Bot_Create')){
    //       this.enablecreatebot=true;
    //     }if(element.permissionName.includes('RPA_Workspace_full')){
    //       this.showWorkspace=true;
    //     }
    //   }
    //       );
    //     })


          if(localStorage.getItem('project_id')!="null" && localStorage.getItem('bot_id')!="null"){
            this.loadbotdata(localStorage.getItem('bot_id'));
          }

     }

  ngAfterViewInit() {

  }

  botdelete(botId)
  {
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
          this.rest.getDeleteBot(botId).subscribe(data=>{
            response= data;
            if(response.status!=undefined)
            {
              Swal.fire("Success",response.status,"success");
              this.getallbots();
              // Swal.fire({
              //   position:'center',
              //   icon:"success",
              //   title:response.status,
              //   showConfirmButton:false,
              //   timer:2000})
            }else
            {
              Swal.fire("Error",response.errorMessage,"error");
                // Swal.fire({
                //   position:'center',
                //   icon:"error",
                //   title:response.errorMessage,
                //   showConfirmButton:false,
                //   timer:2000})
                  //this.rpa_tabs.closeTab(this.botState);

            }
          })
          this.getCategoryList();
          this.getenvironments();
          setTimeout(()=> {
            this.getallbots();
            }, 550);
    
          //this.nodes = this.nodes.filter((node): boolean => nodeId !== node.id);
          //this.jsPlumbInstance.removeAllEndpoints(nodeId);
        }

      })
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
    let response:any=[];
    this.rpa_studio.spinner.show();
    this.loadflag=true;
    //spinner.show();
    //http://192.168.0.7:8080/rpa-service/get-all-bots
    this.rest.getAllActiveBots().subscribe(botlist =>
    {
      setTimeout(()=>{
        this.rpa_studio.spinner.hide();
        this.loadflag=false;
      },1000)
      response=botlist;
      response=response.reverse();
      if(response.length==0)
      {
        this.rpa_studio.spinner.hide();
      }
      response.forEach(data=>{
        let object:any=data;
        if(data.botType==0)
        {
          object.botType='Attended'
        }
        else if(data.botType==1)
        {
          object.botType='Unattended';
        }
        this.bot_list.push(object)
        this.assignPagination( this.bot_list);
      })
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
      })
      this.bot_list=botlist;
      if(this.bot_list.length >0)
      {
        this.respdata1 = false;
      }else
      {
        this.respdata1 = true;
      }
      //response.sort((a,b) => a.createdAt > b.createdAt ? -1 : 1);
      
      //response=response.reverse();
      this.dataSource1= new MatTableDataSource(response);
      this.isDataSource = true;
      this.dataSource1.sort=this.sort1;
      this.dataSource1.paginator=this.paginator1;
     this.dataSource1.data = response;
     this.allbots=response;
     this.departmentFilter.valueChanges.subscribe((departmentFilterValue) => {
      if(departmentFilterValue != ""){
    let category=this.categaoriesList.find(val=>departmentFilterValue ==val.categoryId);
      this.filteredValues['department'] = category;
      }
      else{
        this.filteredValues['department'] = departmentFilterValue;
      }
      this.dataSource1.filter = JSON.stringify(this.filteredValues);
      if(this.dataSource1.filteredData.length > 0){
        this.isTableHasData = true;
      } else {
        this.isTableHasData = false;
      }
   
      },(err)=>{

        this.rpa_studio.spinner.hide();
      });

        this.botNameFilter.valueChanges.subscribe((botNameFilterValue) => {
          this.filteredValues['botName'] = botNameFilterValue;
          this.dataSource1.filter = JSON.stringify(this.filteredValues);
          if(this.dataSource1.filteredData.length > 0){
            this.isTableHasData = true;
          } else {
            this.isTableHasData = false;
          }
        });

      this.dataSource1.filterPredicate = this.customFilterPredicate();
    },(err)=>{
      this.rpa_studio.spinner.hide();
    })
  }

  customFilterPredicate() {
    const myFilterPredicate = (data: dataSource1, filter: string): boolean => {
      let searchString = JSON.parse(filter);
      if(searchString.department != ''){
      return data.department.toString().trim().indexOf(searchString.department.categoryName) !== -1 &&
        data.botName.toString().trim().toLowerCase().indexOf(searchString.botName.toLowerCase()) !== -1;
    }
    else
    {
      return true &&
        data.botName.toString().trim().toLowerCase().indexOf(searchString.botName.toLowerCase()) !== -1;
    }
  }
    return myFilterPredicate;
  }

  getautomatedtasks(process)
  {
    let response:any=[];

    //this.rpa_studio.spinner.show();
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
     // this.rpa_studio.spinner.hide()
    },(err)=>{
      //this.rpa_studio.spinner.hide()

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
    this.rpa_studio.onCreate(0);
  }

  /*openload()
  {

    document.getElementById("load-bot").style.display ="block";
  }*/


  close()
  {
    document.getElementById("create-bot").style.display ="none";
    
    document.getElementById("load-bot").style.display ="none";

    document.getElementById("edit-bot").style.display="none";

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
    //document.getElementById("create-bot").style.display ="block";
  }




  loadbotdata(botId)
  {
    localStorage.setItem("botId",botId)
    this.rpa_studio.getloadbotdata(botId);
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
    this.rpa_studio.spinner.show();
    this.rest.startprocess(this.selectedvalue,this.selectedEnvironment).subscribe(data=>{
      let response:any=data;
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title:response.status,
        showConfirmButton: false,
        timer: 2000
      });
      this.rpa_studio.spinner.hide();
      this.update_task_status();
    },(err)=>{
      this.rpa_studio.spinner.hide();
    })
  }
  }


  resettasks()
  {

    this.rpa_studio.spinner.show();
    this.rest.getautomatedtasks(0).subscribe(response=>{
      let data:any=response;
      this.dataSource2= new MatTableDataSource(data.automationTasks);
      this.dataSource2.sort=this.sort2;
      this.dataSource2.paginator=this.paginator2;
      if(this.selectedvalue==undefined)
      {
        this.applyFilter(this.selectedvalue)
      }

      this.rpa_studio.spinner.hide();
    });
  }

  importbotfile()
  {
    if(this.importenv!="",this.importfile!="",this.importcat!="")
    {
       let form=new FormData();
       form.append("file",this.importfile);
       form.append("env-id",this.importenv);
       form.append("categoryId",this.importcat);
       this.rest.importbot(form).subscribe(data=>{
        let response:any=data; 
        this.importcat="";
        this.importenv="";
        this.importfile="";
        if(response.errorMessage==undefined)
        {
          Swal.fire("Success",response.status,"success");
          this.getallbots();
        }
        else
          Swal.fire("Error",response.errorMessage,"error");
          this.modalRef.hide()
          this.getallbots();
       })

    }
  }
  upload(file)
  {
    var extarr = file.name.split('.')
    var ext=extarr.reverse()[0]
    this.file_error="";
    if(ext=="sql")
      this.importfile=file
    else
      this.file_error="Invalid file format, only it allows .sql format"
  }


  exportbot(bot)
  {
    this.rest.bot_export(bot.botId).subscribe((data)=>{
      console.log(data)
        const linkSource = `data:application/txt;base64,${data}`;
        const downloadLink = document.createElement('a');
        document.body.appendChild(downloadLink);

        downloadLink.href = linkSource;
        downloadLink.target = '_self';
        downloadLink.download = bot.botName+"-V"+bot.version+".sql";
        downloadLink.click(); 
        Swal.fire("Success","Bot Exported Successfully","success");
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
      this.categaoriesList=catResponse.data;
    });
  }

  public sortkey:any;

  sortasc(colKey,sorttype)
  {
    let sortdes=this.sortkey[colKey];
    this.bot_list=this.bot_list.sort(function(a,b){
      let check_a=isNaN(a[colKey])?a[colKey].toUpperCase():a[colKey];
      let check_b=isNaN(b[colKey])?b[colKey].toUpperCase():b[colKey];
      console.log(sortdes)
      console.log(colKey)
      if (sortdes==true)
        return (check_a > check_b) ? 1 : -1;
      else
        return (check_a < check_b) ? 1 : -1;
   },this);
   this.sortkey[colKey]=!sortdes;
  }
  editbotoverlay(botdetails){
    document.getElementById("edit-bot").style.display="block";
   let category=botdetails.department;
   let selectedcategory=this.categaoriesList.find(item=>item.categoryName==category)
    this.rpaCategory=selectedcategory.categoryId;
    if(this.rpaCategory==="others"){
    this.editbot.setValue({
      botId:botdetails.botId,
      botName:botdetails.botName, 
      department:this.rpaCategory, 
      description:botdetails.description,
      newCategoryName:this.newRpaCategory})
    }else{
      this.editbot.setValue({
        botId:botdetails.botId,
        botName:botdetails.botName, 
        department:this.rpaCategory, 
        description:botdetails.description,
        newCategoryName:this.rpaCategory})
    }
  }

  validate(code){
    let validate = code;
    this.count = 0;
    for(let i=0;i < validate.length -1; i++){
      if(validate.charAt(i) == String.fromCharCode(32)){
        this.count= this.count+1;
      }
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
    let botname=this.editbot.get("botName").value;

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
     rpaCategory["categoryName"] =this.editbot.value.newCategoryName;
   return this.rest.addCategory(rpaCategory);
  }
  onEditBot() {
    let botdetails = this.editbot.value;
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
          Swal.fire("Bot Details Updated Successfully","","success");
           this.getallbots();
        }else {
          Swal.fire("Failed to update bot details","","error");
        }
          })
          document.getElementById("edit-bot").style.display="none";
       });
      } else {
      this.rest.modifybotdetails(botdetails).subscribe(data=>{
        if(data.message==="Bot details updated successfully"){
          Swal.fire("Bot Details Updated Successfully","","success");
          this.getallbots();
        }else {
          Swal.fire("Failed to update bot details","","error");
        }
          })
          document.getElementById("edit-bot").style.display="none";
        }
      }

      assignPagination(data){
        const sortEvents$: Observable<Sort> = fromMatSort(this.sort);
        const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator301);
        const rows$ = of(data);
        this.totalRows$ = rows$.pipe(map(rows => rows.length));
        this.displayedRows$ = rows$.pipe(sortRows(sortEvents$), paginateRows(pageEvents$));
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


