import { Component, OnInit, HostListener, ViewChild, Inject } from '@angular/core';
import { Router } from '@angular/router';
import * as BpmnJS from './../../../bpmn-modeler.development.js';
import * as CmmnJS from 'cmmn-js/dist/cmmn-modeler.production.min.js';
import * as DmnJS from 'dmn-js/dist/dmn-modeler.development.js';

import { SharebpmndiagramService } from '../../services/sharebpmndiagram.service';
import { DataTransferService } from '../../services/data-transfer.service';
import { RestApiService } from '../../services/rest-api.service';
import { BpsHints } from '../model/bpmn-module-hints';
import Swal from 'sweetalert2';
import { GlobalScript } from 'src/app/shared/global-script';
import {MatTableDataSource} from '@angular/material/table';

import { MatPaginator, PageEvent } from '@angular/material';
import { fromMatPaginator, paginateRows } from './../model/datasource-utils';
import { Observable  } from 'rxjs/Observable';
import { of  } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';
import { MatSort, Sort } from '@angular/material';;
import { fromMatSort, sortRows } from './../model/datasource-utils';
import {FilterPipe} from './../custom_filter.pipe';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-bpshome',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class BpsHomeComponent implements OnInit {
  bpmnModeler: any;
  saved_diagrams:any[] = [];
  bkp_saved_diagrams:any[] = [];
  p: number = 1;
  term = "";
  isLoading:boolean = false;
  isApproverUser:boolean = false;
  isAdminUser:boolean = false;
  sortedData:any;
  data;
  categoryName: any;
  categoryList: any = [];
  dataSource:MatTableDataSource<any>;
  orderAsc:boolean = true;
  sortIndex:number=2;
  index:number;
  xpandStatus=false;
  autosavedDiagramList = [];
  autosavedDiagramVersion = [];
  pendingStatus='PENDING APPROVAL';
  userRole;
  systemAdmin:Boolean=false;
  userEmail:any="";
  savedDiagrams_list:any[]=[];
  isButtonVisible:boolean = false;
  bpmnVisible:Boolean=false;
  displayedRows$: Observable<any[]>;
  totalRows$: Observable<number>;
  @ViewChild(MatSort,{static:false}) sort: MatSort;
  @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
  categories_list:any[]=[];
  saved_diagramsList:any=[];
  isEdit:boolean=false;
  selectedObj:any={};
  refreshSubscription:Subscription;

  constructor(private router:Router, private bpmnservice:SharebpmndiagramService, private dt:DataTransferService,
     private rest:RestApiService, private hints:BpsHints, private global:GlobalScript,
    ) { }

  ngOnInit(){
    localStorage.setItem("isheader","false")
    this.userRole = localStorage.getItem("userRole")
    this.userRole = this.userRole.split(',');
    this.bpmnVisible=this.userRole.includes('SuperAdmin') || this.userRole.includes('Admin') || this.userRole.includes('Process Owner') || this.userRole.includes('Process Architect')  || this.userRole.includes('Process Analyst')  || this.userRole.includes('RPA Developer')  || this.userRole.includes('Process Architect') || this.userRole.includes("System Admin") ;
    if(this.userRole.includes('SuperAdmin')){
      this.isButtonVisible = true;
    }else if(this.userRole.includes('System Admin') ){
      this.isButtonVisible = true;
      this.isAdminUser = true;
    }
    this.systemAdmin=this.userRole.includes("System Admin");
    this.userEmail=localStorage.getItem("ProfileuserId");
    this.isApproverUser = this.userRole.includes('Process Architect')
    this.isLoading = true;
    this.dt.changeParentModule({"route":"/pages/businessProcess/home", "title":"Business Process Studio"});
    this.dt.changeChildModule({"route":"/pages/businessProcess/home","title":"BPMN Upload"});
    this.dt.changeHints(this.hints.bpsHomeHints);
    this.getBPMNList();
    this.getAutoSavedDiagrams();
    this.getAllCategories();
    // document.getElementById("filters").style.display = "block";
    let obj={}
    this.dt.bpsNotationaScreenValues(obj);
    this.dt.bpsHeaderValues('');
    this.refreshSubscription=this.dt.isTableRefresh.subscribe(res => {
      if (res) {
        if (res.isRfresh) {
          this.isLoading = true;
          this.getBPMNList();
        }
      }
    })
  }

  async getBPMNList(){
    this.dt.processDetailsUpdateSuccess({"isRfresh":false});
    await this.rest.getUserBpmnsList().subscribe( (res:any[]) =>  {
      this.saved_diagrams = res; 
      this.saved_diagramsList=res;
      this.saved_diagrams.map(item => {item.xpandStatus = false;return item;})
      this.saved_diagrams.forEach(ele => {
        ele['eachObj']={
          "bpmnXmlNotation":ele.bpmnXmlNotation,
          "bpmnConfProcessMeta":ele.bpmnConfProcessMeta,
          "bpmnProcessApproved":ele.bpmnProcessApproved,
          "convertedCreatedTime":ele.convertedCreatedTime,
          "createdTimestamp":ele.createdTimestamp,
          "hasConformance":ele.hasConformance,
          "id":ele.id,
          "notationFromPI":ele.notationFromPI,
          "tenantId":ele.tenantId,
          "userName":ele.userName,
          "modifiedTimestamp":ele.modifiedTimestamp
        }
        ele["bpmnXmlNotation"]=''
        ele["bpmnConfProcessMeta"]=''
        ele["bpmnProcessApproved"]=''
        ele["convertedCreatedTime"]=''
        ele["createdTimestamp"]=''
        ele["hasConformance"]=''
        ele["id"]=''
        ele["notationFromPI"]=''
        ele["tenantId"]=''
        ele["userName"]=''
        ele['modifiedTimestamp']=''
      });

      this.bkp_saved_diagrams = res; 
      this.isLoading = false;
      this.savedDiagrams_list=this.saved_diagrams;
      this.assignPagenation(this.saved_diagrams);

      let selected_category=localStorage.getItem("bps_search_category");
      if(this.categories_list.length == 1){
        this.categoryName=this.categories_list[0].categoryName;
      }else{
        this.categoryName=selected_category?selected_category:'allcategories';
      }
      this.searchByCategory(this.categoryName);
    },
    
    (err) => {
      this.isLoading = false;
    });
  }

  @HostListener('document:click',['$event'])
  clickout(event) {
    if(!document.getElementById("bpmn_list").contains(event.target) && this.index>=0)
      this.saved_diagrams[this.index].xpandStatus=false;
  }

  openDiagram(bpmnDiagram,index){
    // if(bpmnDiagram.bpmnProcessStatus && bpmnDiagram.bpmnProcessStatus =="PENDING" ) return;
    let binaryXMLContent = bpmnDiagram.eachObj.bpmnXmlNotation; 
// return;
    let bpmnModelId = bpmnDiagram.bpmnModelId;
    let bpmnVersion = bpmnDiagram.version;
    let bpmnType = bpmnDiagram.ntype;
    this.bpmnservice.uploadBpmn(atob(binaryXMLContent));
    let push_Obj={"rejectedOrApproved":bpmnDiagram.bpmnProcessStatus,"isfromApprover":false,
    "isShowConformance":false,"isStartProcessBtn":false,"autosaveTime":bpmnDiagram.eachObj.modifiedTimestamp,
    "isFromcreateScreen":false,'process_name':bpmnDiagram.bpmnProcessName,'isEditbtn':false,'isSavebtn':true,"selectedNotation":this.saved_diagramsList[index]}
this.dt.bpsNotationaScreenValues(push_Obj);
this.dt.bpsHeaderValues('');
    this.router.navigate(['/pages/businessProcess/uploadProcessModel'], { queryParams: { bpsId: bpmnModelId , ver: bpmnVersion, ntype: bpmnType}});
  }

  getAutoSavedDiagrams(){
    this.rest.getBPMNTempNotations().subscribe( (res:any) =>  {
      if(Array.isArray(res))
        this.autosavedDiagramList = res;
    });
   }

  getColor(status) {
    switch (status) {
      case 'PENDING':
        return '#F99D1C';
      case 'REJECTED':
        return 'red';
      case 'APPROVED':
        return 'green';
      case 'INPROGRESS':
        return '#F99D1C';
    }
  }

  fitTableView(processName){
    if(processName && processName.length > 14)
      return processName.substr(0,14)+'...';
    return processName;
  }
  fitTableViewCategory(processName){
    if(processName && processName.length > 7)
      return processName.substr(0,7)+'..';
    return processName;
  }

  fitTableViewTime(processName){
    if(processName && processName.length > 12)
      return processName.substr(0,12)+'...';
    return processName;
  }

  filterAutoSavedDiagrams(modelId){
    this.autosavedDiagramVersion = this.autosavedDiagramList.filter(each_asDiag => {
      return each_asDiag.bpmnModelId == modelId;
    })
   }

  formatApproverName(apprName){
    if(apprName && apprName.length > 15)
      return apprName.substr(0,15)+'..';
    return apprName;
    // let appr_arr = apprName.split('.');
    // let fName = appr_arr[0];
    // let lName = appr_arr[1];
    // if(fName)
    //   fName = fName.charAt(0).toUpperCase()+fName.substr(1);
    // if(lName)
    //   lName = lName.charAt(0).toUpperCase()+lName.substr(1);
    // return fName&&lName?fName+" "+lName:fName?fName:lName?lName:'-';
   }

  getDiagram(eachBPMN,i){
      var element = document.getElementById('_diagram'+i);
    element.scrollIntoView({behavior: "auto",block: "center", inline: "nearest"});
    let byteBpmn = atob(eachBPMN.eachObj.bpmnXmlNotation);
    this.index=i;
    if(document.getElementsByClassName('diagram_container'+i)[0].innerHTML.trim() != "") return;
    let notationJson = {
      container: '.diagram_container'+i,
      keyboard: {
        bindTo: window
      }
    }
    if(eachBPMN.ntype == "bpmn")
      this.bpmnModeler = new BpmnJS(notationJson);
    else if(eachBPMN.ntype == "cmmn")
      this.bpmnModeler = new CmmnJS(notationJson);
    else if(eachBPMN.ntype == "dmn")
      this.bpmnModeler = new DmnJS(notationJson); 
    if(eachBPMN.bpmnProcessStatus != "APPROVED" && eachBPMN.bpmnProcessStatus != "REJECTED")
      this.filterAutoSavedDiagrams(eachBPMN.bpmnModelId);
    if(this.autosavedDiagramVersion[0] && this.autosavedDiagramVersion[0]["bpmnProcessMeta"])
      byteBpmn = atob(this.autosavedDiagramVersion[0]["bpmnProcessMeta"]);
      if(byteBpmn == "undefined"){
        this.rest.getBPMNFileContent("assets/resources/newDiagram.bpmn").subscribe(res => {
          this.bpmnModeler.importXML(res, function(err){
            if(err){
              console.error('could not import BPMN EZFlow notation', err);
            }
          })
        });
      }else{
        this.bpmnModeler.importXML(byteBpmn, function(err){
          if(err){
            console.error('could not import BPMN EZFlow diagram', err);
          }
        })
      }
    // let canvas = this.bpmnModeler.get('canvas');
    // canvas.zoom('fit-viewport');
  }

  loopTrackBy(index, term){
    return index;
  }
  getAllCategories() {    // get all categories list for dropdown
    this.rest.getCategoriesList().subscribe(res => {
    this.categoryList = res;
    this.categories_list=this.categoryList.data
    })
  }
  searchByCategory(category) {      // Filter table data based on selected categories
    localStorage.setItem('bps_search_category',category);
    var filter_saved_diagrams= []
    this.saved_diagrams=[]
    if (category == "allcategories") {
     this.saved_diagrams=this.savedDiagrams_list;
     this.assignPagenation(this.saved_diagrams);
      // this.dataSource.filter = fulldata;
    }
    else{  
      filter_saved_diagrams=this.savedDiagrams_list;
      
      filter_saved_diagrams.forEach(e=>{
        if(e.category===category){
          this.saved_diagrams.push(e)
        }
      });
      this.assignPagenation(this.saved_diagrams);
    }
  }
  sort1(colKey,ind) { // if not asc, desc
    this.sortIndex=ind
    let asc=this.orderAsc
    this.orderAsc=!this.orderAsc
    this.saved_diagrams= this.saved_diagrams.sort(function(a,b){
      if(ind!=1){
        if (asc) 
        return (a[colKey].toLowerCase() > b[colKey].toLowerCase()) ? 1 : -1;
       else 
        return (a[colKey].toLowerCase() < b[colKey].toLowerCase()) ? 1 : -1;
      }else{
        if (asc) 
        return (a[colKey] > b[colKey]) ? 1 : -1;
       else 
        return (a[colKey] < b[colKey]) ? 1 : -1;
      }
      
    });
    this.assignPagenation(this.saved_diagrams);
  }

  sendReminderMail(e, bpmNotation){
    e.stopPropagation();
    Swal.fire({
      title: 'Reminder mail',
      text: bpmNotation.bpmnProcessName+' V1.'+bpmNotation.version+' reminder mail to '+bpmNotation.approverName,
      icon: 'info',
      showCancelButton: true,
      heightAuto: false,
      confirmButtonText: 'Send',
      cancelButtonText: 'Cancel'
    }).then((res) => {
      if(res.isConfirmed){
        let data = {
          "bpmnModelId":bpmNotation.bpmnModelId,
          "version": bpmNotation.version
        }
        this.rest.sendReminderMailToApprover(data).subscribe(res => {
          this.global.notify('Sent reminder successfully','success')
        }, err => {
          this.global.notify('Oops! Something went wrong','error')
        })
      }
    })
  }

  fitNotationView(e){    //Fit notation to canvas
    if(e=='dmn'){
      this.bpmnModeler.getActiveViewer().get('canvas').zoom('fit-viewport');
        this.global.notify("Notation is fit to view port", "success")
      return;
    }
   let canvas = this.bpmnModeler.get('canvas');
    canvas.zoom('fit-viewport');
    let msg="Notation";
    this.global.notify(msg+" is fit to view port", "success")
  }

  deleteProcess(e, bpmNotation){
    e.stopPropagation();
    let status = bpmNotation.bpmnProcessStatus == "PENDING"?"PENDING APPROVAL":bpmNotation.bpmnProcessStatus;
    Swal.fire({
      title: 'Are you sure?',
      text: bpmNotation.bpmnProcessName+' V1.'+bpmNotation.version+' in '+status+' status will be deleted',
      icon: 'warning',
      showCancelButton: true,
      heightAuto: false,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((res) => {
      if(res.isConfirmed){
        let data = {
          "bpmnModelId":bpmNotation.bpmnModelId,
          "version": bpmNotation.version
        }
        this.rest.deleteBPMNProcess(data).subscribe(res => {
          // console.log(res)
          if(res == "It is an ongoing project.Please contact Project Owner(s)"){
            Swal.fire({
              icon: 'info',
              title: 'Info',
              text: res,
              heightAuto: false
            })
          }else{
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: bpmNotation.bpmnProcessName+' V1.'+bpmNotation.version+' deleted',
              heightAuto: false
            });
          this.isLoading = true;
          this.getBPMNList();
          }
          // this.global.notify(bpmNotation.bpmnProcessName+' V1.'+bpmNotation.version+' deleted','success')
        }, err => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
            heightAuto: false,
          });
          // this.global.notify('Oops! Something went wrong','error')
        })
      }
    })
  } 
  
  gotoBPMNPlatform() {
    var token = localStorage.getItem('accessToken');
    let selecetedTenant =  localStorage.getItem("tenantName");
    let userId = localStorage.getItem("ProfileuserId");
    let splitTenant:any;
    if(selecetedTenant){
       splitTenant = selecetedTenant.split('-')[0];
    }
    window.location.href = "https://eiapcamundademo.epsoftinc.com:86/camunda/app/welcome/"+splitTenant+"/#!/login?accessToken=" + token + "&userID="+userId+"&tenentID="+selecetedTenant;
  }


  
  searchList(event: Event) {       // search entered process ids from search input
    const filterValue = (event.target as HTMLInputElement).value;
    let test:any=[]
    if(!filterValue){
      this.assignPagenation(this.saved_diagrams);
      return;
    }
    this.saved_diagrams.filter(item =>{
      Object.keys(item).some(k =>{ 
        if(item[k] != null &&item[k].toString().toLowerCase().includes(filterValue.toLowerCase())){
              test.push(item)
        }
      })
      });
 
var filtered = test.reduce((filtered, item) => {
  if( !filtered.some(filteredItem => JSON.stringify(filteredItem.bpmnModelId) == JSON.stringify(item.bpmnModelId)) )
    filtered.push(item)
  return filtered
}, [])
this.assignPagenation(filtered)
// const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator);
//     const rows$ = of(filtered);
//     this.totalRows$ = rows$.pipe(map(rows => rows.length));
//     this.displayedRows$ = rows$.pipe(paginateRows(pageEvents$));
  }
 
  assignPagenation(data){
    const sortEvents$: Observable<Sort> = fromMatSort(this.sort);
    const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator);
    const rows$ = of(data);
    this.totalRows$ = rows$.pipe(map(rows => rows.length));
    this.displayedRows$ = rows$.pipe(sortRows(sortEvents$), paginateRows(pageEvents$));
    this.paginator.firstPage();
  }

  getNotationStatus(value){
    if(value=="PENDING"){
      return "PENDING APPROVAL"
    }else if(value=="INPROGRESS"){
      return "In Progress"
    }else {
      return value;
    }
  }

  applySearchFilter(v){
    const filterPipe = new FilterPipe();
  const fiteredArr = filterPipe.transform(this.saved_diagrams,v);
  this.assignPagenation(fiteredArr)
  }

  onEdit(e,obj){
    e.stopPropagation();

    this.isEdit=true;
    this.selectedObj={
      "category":obj.category,
      "bpmnProcessName":obj.bpmnProcessName,
      "ntype":obj.ntype,
      "id":obj.eachObj.id,
      "bpmnModelId":obj.bpmnModelId,
      "processOwner":obj.processOwner
    }
    setTimeout(() => {
      this.isEdit=false;
    }, 500);
  }

  ngOnDestroy() {
    this.refreshSubscription.unsubscribe();
  }
 
}
