import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { RestApiService } from '../../services/rest-api.service';
import { Observable  } from 'rxjs/Observable';
import { of  } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';
import { MatSort, Sort } from '@angular/material';;
// import { fromMatSort, sortRows } from './../model/datasource-utils';
import { fromMatSort, sortRows } from './../../../pages/business-process/model/datasource-utils';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

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
  displayedColumns: string[] = ["vcmLevel",'fileName',"description","uploadedBy","convertedUploadedTime",'actions'];
  displayedColumns1: string[] = ["level","parent","title","processOwner","description"];
  displayedColumns3: string[] = ["level","parent","title","processOwner","description"];
  expandedData:any=[];
  vcm_id:any;
  vcm_process:any;
  isShowAll:boolean=false;

  constructor(private rest_api: RestApiService,private route:ActivatedRoute) {
    this.route.queryParams.subscribe(res => {
      this.vcm_id = res.id
      this.vcm_process = res.vcmLevel
      this.vcm_process== "all"?this.isShowAll=true : this.isShowAll=false;
    });
   }

  ngOnInit(): void {
    console.log(this.edit);
    // this.getAttachements();

  }

  ngOnChanges(){
    console.log("this.vcm_data",this.vcm_data)
    console.log("this.vcm_resData",this.vcm_resData)
    // this.vcm_data.forEach(element => {
    //   if(element.processOwner){
    //     this.prop_data.push(element)
    //   }
    // })
    // console.log("properties data",this.prop_data)
    if(this.vcm_process != "all"){
      this.dataSource3= new MatTableDataSource(this.vcm_data);

    }else{
      this.vcm_data.map(item => {item.xpandStatus = false;return item;})
      this.assignPagenation(this.vcm_data)
    }

  }
  ngAfterViewInit(){
    this.getAttachements();

  }

  getAttachements(){
    if(this.vcm_resData){
      this.isLoading=true;
      let reqBody={
        "masterId": this.vcm_resData.data.id,
        "parent": this.vcm_process
      }
      let res_data
      this.attachments=[];
      this.dataSource= new MatTableDataSource(this.attachments);
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
  }

  assignPagenation(data){
    // const sortEvents$: Observable<Sort> = fromMatSort(this.sort);
    // const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator);
    const rows$ = of(data);
    this.totalRows$ = rows$.pipe(map(rows => rows.length));
    this.displayedRows$ = rows$;
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
}
