import { Component, Input, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { RestApiService } from '../../services/rest-api.service';
import { Observable  } from 'rxjs/Observable';
import { of  } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';
import { MatSort, Sort } from '@angular/material';;
// import { fromMatSort, sortRows } from './../model/datasource-utils';
import { fromMatSort, sortRows } from './../../../pages/business-process/model/datasource-utils';
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
  displayedRows1$: Observable<any[]>;
  totalRows$: Observable<number>;
  @ViewChild(MatSort,{static:false}) sort: MatSort;
  @ViewChild(MatSort,{static:false}) sort1: MatSort;
  @ViewChild('sort3',{static:false}) sort3: MatSort;
  // @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
  dataSource:MatTableDataSource<any>;
  dataSource1:MatTableDataSource<any>;
  dataSource3:MatTableDataSource<any>;
  displayedColumns: string[] = ["vcmLevel",'fileName',"description","uploadedBy","convertedUploadedTime",'actions'];
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
    this.collaboratorsArray=[
      {
        "id": 0,
        "stakeholder": "",
        "interest": "",
        "role": "",
        "uniqueId": ""
        },
    ]
  }

  ngOnChanges(){
    console.log("this.vcm_data",this.vcm_data)
    console.log("this.vcmTreeData",this.vcmTreeData)
    // this.vcm_data.forEach(element => {
    //   if(element.processOwner){
    //     this.prop_data.push(element)
    //   }
    // })
    this.vcmTreeData.forEach(element => {
      element.children.forEach(e => {
        this.vcmTreeData1.push(e)
        
      });
    });

    this.assignPagenation(this.vcmTreeData1);
    console.log("vcmTreeData1 data",this.vcmTreeData1)
    // this.vcmTreeData=this.vcm_resData.data.vcmV2
    // console.log(this.vcmTreeData)
    if(this.vcm_process != "all"){
      this.dataSource3= new MatTableDataSource(this.vcm_data);

    }else{
      this.vcm_data.map(item => {item.xpandStatus = false;return item;})
      // this.assignPagenation(this.vcm_data)
    }

  }
  ngAfterViewInit(){
    this.getAttachements();
    this.getApproverList();
  }

  getAttachements(){
    if(this.vcm_resData){
      // this.isLoading=true;
      let reqBody={
        "masterId": this.vcm_resData.data.id,
        "parent": this.vcm_process
      }
      let res_data
      this.attachments=[];
      // this.dataSource= new MatTableDataSource(this.attachments);
    this.rest_api.getvcmAttachements(reqBody).subscribe(res=>{res_data=res
      this.attachments=res_data.data
      this.dataSource= new MatTableDataSource(this.attachments);
      this.dataSource.sort=this.sort1;

      this.isLoading=false;
    })
    }
  }

  getexpandedlevel(data){
    console.log(data,this.vcm_data)
    this.expandedData=[];
    this.vcm_data.forEach(element => {
      if(element.parent == data.parent && element.level != data.level){
        this.expandedData.push(element);
      }
    });
    this.dataSource1= new MatTableDataSource(this.expandedData);
    this.assignPagenation1(this.expandedData);
  }

  assignPagenation(data){
    // const sortEvents$: Observable<Sort> = fromMatSort(this.sort);
    // const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator);
    const rows$ = of(data);
    this.totalRows$ = rows$.pipe(map(rows => rows.length));
    this.displayedRows$ = rows$;
    // this.paginator.firstPage();
  }
  assignPagenation1(data){
    // const sortEvents$: Observable<Sort> = fromMatSort(this.sort);
    // const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator);
    const rows$ = of(data);
    this.totalRows$ = rows$.pipe(map(rows => rows.length));
    this.displayedRows1$ = rows$;
    // this.paginator.firstPage();
  }

  ondeleteAttachements(data) {
    let req_body = []
    let obj = {
      "uniqueId": data.uniqueId,
      "fileVersion": data.fileVersion
    }
    req_body.push(obj)
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
        this.rest_api.ondeleteAttachements(req_body).subscribe(res => {
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

  addCollaborators(template: TemplateRef<any>,obj){
    console.log(obj)
   this.addCollaboratorsOverlay = this.modalService.show(template,{class:"modal-lr"});
 }

 addNewcollabratorsObj(){
   let object= {
    "id": 0,
    "stakeholder": "",
    "interest": "",
    "role": "",
    "uniqueId": ""
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
     console.log(res)
 });
}

submitCollabrators(){
  console.log(this.collaboratorsArray)
}

deleteCollaborater(index){
  this.collaboratorsArray.splice(index,1)
}

viewCollaborators(template: TemplateRef<any>,obj){
  let collaborations= [
    {
    "id": 3736,
    "stakeholder": "anitha.gada123@epsoftinc.com",
    "interest": "informed",
    "role": "Exec",
    "uniqueId": "a4ae9b84-8038-3762-6021-c92e9ba6204b"
    },
    {
    "id": 3737,
    "stakeholder": "ranjith@epsoftinc.co",
    "interest": "informed",
    "role": "Exec",
    "uniqueId": "a4ae9b84-8038-3762-6021-c92e9ba6204b"
    }
  ]
  // this.collaboratorsList= obj.collaborations ? obj.collaborations : []
  this.collaboratorsList=collaborations
   this.viewCollaboratorsOverlay = this.modalService.show(template,{class:"modal-lr"});
 }

 cancelViewModel(){
  this.viewCollaboratorsOverlay.hide();
  this.selectedIndex=null;
}

editCollaborator(obj,index){
  this.selectedIndex = index;
}

}
