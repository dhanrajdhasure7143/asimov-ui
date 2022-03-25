import { Component, Input, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { RestApiService } from '../../services/rest-api.service';
import { Observable  } from 'rxjs/Observable';
import { of  } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';
import { MatSort, Sort } from '@angular/material';;
import { fromMatSort, sortRows } from './../model/datasource-utils';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-view-properties',
  templateUrl: './view-properties.component.html',
  styleUrls: ['./view-properties.component.css']
})
export class ViewPropertiesComponent implements OnInit {

  @Input() vcm_data:any;
  @Input() processOwners_list:any=[];
  @Input() vcm_resData:any;
  @Input() edit:any;
  @Input() vcmTreeData:any;
  isDisabled:boolean=true;
  attachments:any=[];
  prop_data:any=[];
  isLoading:boolean=false;
  displayedRows$: Observable<any[]>;
  totalRows$: Observable<number>;
  @ViewChild(MatSort,{static:false}) sort: MatSort;
  @ViewChild(MatSort,{static:false}) sort1: MatSort;
  @ViewChild('sort3',{static:false}) sort3: MatSort;
  // @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
  dataSource:MatTableDataSource<any>;
  dataSource1:MatTableDataSource<any>;
  dataSource3:MatTableDataSource<any>;
  displayedColumns: string[] = ["vcmLevel",'processName','fileName',"description","uploadedBy","convertedUploadedTime",'actions'];
  displayedColumns1: string[] = ["level","parent","title","processOwner","description"];
  displayedColumns3: string[] = ["level","parent","title","processOwner","description","actions"];
  expandedData:any=[];
  vcm_id:any;
  vcm_process:any;
  isShowAll:boolean=false;
  vcmTreeData1:any=[];
  addCollaboratorsOverlay: BsModalRef;
  viewCollaboratorsOverlay: BsModalRef;
  collaboratorsArray:any=[];
  collaboratorsList:any=[];
  stackHolders_list:any=[];
  selectedIndex:number;
  selectedCollaboratorsObj:any;
  isLoading1:boolean=false;
  collaboratorsRoles=["Executive"]
  collaboratorsInterests=["Informed","Accountable"]

  constructor(private router: Router, private rest_api: RestApiService,
    private route: ActivatedRoute, private modalService: BsModalService) {
    this.route.queryParams.subscribe(res => {
      this.vcm_id = res.id
      this.vcm_process = res.vcmLevel
      this.vcm_process== "all"?this.isShowAll=true : this.isShowAll=false;
    });
   }

  ngOnInit(): void {
    // this.getAttachements();
    this.dataSource= new MatTableDataSource(this.attachments);
  }

  ngOnChanges(){
    console.log("this.vcm_data",this.vcm_data)
    console.log("this.vcmTreeData",this.vcmTreeData)
    if(this.vcm_process != "all"){
      let filteredData=[]
      this.vcm_data.forEach(element => {
        if(!element.bpsId){
          filteredData.push(element)
        }
      });
      this.dataSource3= new MatTableDataSource(filteredData);
      this.dataSource3.sort=this.sort3;
    }else{
      this.vcmTreeData1=[]
      this.vcmTreeData.forEach(element => {
        element.children.forEach(e => {
          this.vcmTreeData1.push(e)
        });
      });
      setTimeout(() => {
        this.assignPagenation(this.vcmTreeData1);
      }, 500);
      console.log("vcmTreeData1 data",this.vcmTreeData1)
    }
  }

  ngAfterViewInit(){
    this.getAttachements();
    this.getApproverList();
  }

  ngDestroy(){
    this.assignPagenation([]);
  }

  getAttachements(){
    if(this.vcm_resData){
      this.isLoading=true;
      let request={"masterId":this.vcm_resData.data.id,"parent":this.vcm_process}
      let res_data
      this.attachments=[];
      this.rest_api.getAttachementsBycategory(request).subscribe(res=>{res_data=res
        if(res_data.data){
          this.attachments=res_data.data
      this.dataSource= new MatTableDataSource(this.attachments);
      this.dataSource.sort=this.sort;
        console.log(this.attachments)
      }
      this.isLoading=false;
      })
    // this.rest_api.getvcmAttachements(reqBody).subscribe(res=>{res_data=res
    //   this.attachments=res_data.data
    //   this.dataSource= new MatTableDataSource(this.attachments);
    //   this.dataSource.sort=this.sort;

    //   this.isLoading=false;
    // })
    }
  }

  assignPagenation(data){
    console.log(data)
    // const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator);
    const rows$ = of(data);
    this.totalRows$ = rows$.pipe(map(rows => rows.length));
    const sortEvents$: Observable<Sort> = fromMatSort(this.sort);
    // this.displayedRows$ = rows$;
    this.displayedRows$ = rows$.pipe(sortRows(sortEvents$));
  }

  ondeleteAttachements(data) {
    let req_body=[{"documentId":data.uniqueId}]
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      heightAuto: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.isLoading = true;
        this.rest_api.deleteAttachements(req_body).subscribe(res=>{
          this.isLoading=false;
        // this.rest_api.ondeleteAttachements(req_body).subscribe(res => {
          let status: any = res;
          Swal.fire({
            title: 'Success',
            text: "Attachement Deleted Successfully !!",
            position: 'center',
            icon: 'success',
            showCancelButton: false,
            heightAuto: false,
            confirmButtonColor: '#007bff',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok'
          })
          this.isLoading = false;
          this.getAttachements();
        }, err => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
            heightAuto: false,
          })

        })
      }
    });
  }

  addCollaborators(template: TemplateRef<any>,obj,event){
    if(event){  
      event.stopPropagation();
    }
    console.log(obj)
    this.selectedCollaboratorsObj=obj
    this.collaboratorsArray=[
      {
        "stakeholder": "",
        "stakeholderEmail":"",
        "interest": "",
        "role": "",
        "uniqueId": obj.uniqueId
        },
    ];
   this.addCollaboratorsOverlay = this.modalService.show(template,{class:"modal-lr"});
 }

 addNewcollabratorsObj(){
   let object= {
    "stakeholder": "",
    "stakeholderEmail":"",
    "interest": "",
    "role": "",
    "uniqueId": this.selectedCollaboratorsObj.uniqueId
    }
  this.collaboratorsArray.push(object)
 }

 cancelModel(){
  this.addCollaboratorsOverlay.hide();
}

 getApproverList(){
  let roles={"roleNames": ["Process Owner","Process Architect"]}
   this.rest_api.getmultipleApproverforusers(roles).subscribe( res =>  {//Process Architect
    if(Array.isArray(res))
     this.stackHolders_list = res;
 });
}

saveCollabrators(){
  let req_body=[]
  this.collaboratorsArray.forEach(element => {
    this.stackHolders_list.forEach(e => {
      if(element.stakeholderEmail == e.userId){
        element.stakeholder = e.firstName + " " + e.lastName
      }
    });
    req_body.push(element)  
  });
  console.log(this.collaboratorsArray)
    this.rest_api.createCollaborators(req_body).subscribe((res:any)=>{
      if(res){
      Swal.fire({
        title: 'Success',
        text: res.message,
        position: 'center',
        icon: 'success',
        showCancelButton: false,
        heightAuto: false,
      })
      this.cancelModel();
    }
  },err=>{
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong!',
      heightAuto: false,
    });
  })
}

deleteCollaborater(index){
  this.collaboratorsArray.splice(index,1)
}

viewCollaborators(template: TemplateRef<any>,obj,event){
  console.log(obj)
  if(event){  
    event.stopPropagation();
  }
  this.isLoading=true;
  // obj.uniqueId="90f813c9-6964-1b9d-a5a1-f5585fd4d31f"
  let res_data:any;
  this.rest_api.getCollaborators(obj.uniqueId).subscribe(res =>{res_data=res
    console.log(res)
    this.isLoading=false;
    this.collaboratorsList=res_data.data
   this.viewCollaboratorsOverlay = this.modalService.show(template,{class:"modal-lr"});
  })
 }

 cancelViewModel(){
  this.viewCollaboratorsOverlay.hide();
  this.selectedIndex=null;
}

editCollaborator(obj,index){
  this.selectedIndex = index;
}

viewDeleteCollaborator(obj,index){
  let req_body=[{"id": obj.id}]
  this.rest_api.deleteCollaborators(req_body).subscribe((res:any)=>{
    this.collaboratorsList.splice(index,1);
    Swal.fire({
      title: 'Success',
      text: res.message,
      position: 'center',
      icon: 'success',
      showCancelButton: false,
      heightAuto: false,
    })
    console.log(res)
  })
}

updateCollabrators(element){
  let req_body=[];
  this.isLoading=true;
  req_body.push(element)
  req_body.forEach(element => {
    this.stackHolders_list.forEach(e => {
      if(element.stakeholderEmail == e.userId){
        element.stakeholder = e.firstName + " " + e.lastName
      }
    });
  });
  this.rest_api.updateCollaborators(req_body).subscribe(res=>{
      console.log(res);
      this.isLoading=false;
      this.selectedIndex=null;
  });
}
// getAttachementsBycategory(){
//     let request={"masterId":this.vcm_resData.data.id,"parent":this.vcm_process}
//   this.isLoading=true;
//   let res_data:any;
//   this.isLoading=false;
//   this.rest_api.getAttachementsBycategory(request).subscribe(res=>{res_data=res
//     if(res_data.data)
//     this.attachementsList=res_data.data
//     console.log(this.attachementsList)
//   })
// }

}
