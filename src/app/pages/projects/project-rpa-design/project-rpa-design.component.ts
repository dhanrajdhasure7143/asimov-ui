import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestApiService } from '../../services/rest-api.service';

export interface data {
  steps: string;
  description: string;
  configuration: string;
  // isEdit: boolean;
  id:Number
  }

const COLUMNS_SCHEMA = [
  {key: 'sNo',label: 'Steps No',type:'number',},
  {key: 'steps',label: 'Steps',type:'text',},
  {key: 'description',label: 'Description',type:'text',},
  {key: 'configuration',label: 'Configuration',type:'textarea'},
  {key: 'isEdit',type: 'isEdit',label: 'Action'},
  
];

@Component({
  selector: 'app-project-rpa-design',
  templateUrl: './project-rpa-design.component.html',
  styleUrls: ['./project-rpa-design.component.css']
})
export class ProjectRpaDesignComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  data:any=[];

  displayedColumns: string[] = ['sNo', 'steps', 'description', 'configuration',  'Action'];

  dataSource: MatTableDataSource<any[]>;
  // displayedColumns: string[] = COLUMNS_SCHEMA.map((col) => col.key);
  columnsSchema: any = COLUMNS_SCHEMA;
  USER_DATA:any[]= [
    {steps:"Login to Satuit",description:"Testing Description", configuration:"a.test\nB.liuFHUW",id:123},
    {steps:"Download",description:"This action is apply search  criteria and export the result to excel", configuration:"a.HR\nEg.testing\nb.test",id:133},
    {steps:"Login to seismic",description:"Testing 123", configuration:"a.Client ID",id:20},
    {steps:"Tetsing",description:" DEscription", configuration:"a.User",id:22}
  ];
  public myDataArray: any;
  selectedId: any;


  constructor(private rest_api:RestApiService) { }

  ngOnInit(): void {
    // this.myDataArray = [...this.USER_DATA];
    // this.dataSource.sort=this.sort;

    this.dataSource = new MatTableDataSource(this.USER_DATA);
    setTimeout(() => {
      this.dataSource.paginator=this.paginator;
    }, 2000);
  }

  addUser() {
    let newUser1 ={steps:"",description:"", configuration:"",id:122,new:true};
    this.USER_DATA.splice(0,0,newUser1)
    const newUsersArray = this.USER_DATA;
    // newUsersArray.push(newUser1);
    // this.myDataArray = [...newUsersArray];
    this.dataSource = new MatTableDataSource(this.USER_DATA);

    }

  onSave(e){
  let req_body={
    
  }
  // this.rest_api.saveRpaDesign(e).subscribe(res=>{res_data=res

  // })
    console.log(e)
    this.selectedId = null;
  }
  
  cancelUpdaterow(){
    this.selectedId = null;
  }

  deleteRow(index){
    console.log(index,this.USER_DATA)
    // this.USER_DATA = this.USER_DATA.filter((value,key)=>{
    // return value.email != row_obj.email;
    // });
    // this.myDataArray = [...this.USER_DATA];//refresh the dataSource
    // Swal.fire('Deleted successfully..!')
    }

    cancelCreateNewrow(i){
      console.log("index:",i);
      this.USER_DATA.splice(i,1);
    this.dataSource = new MatTableDataSource(this.USER_DATA);
    this.myDataArray.paginator=this.paginator;

      // this.myDataArray = [...this.USER_DATA];
    }

    onEdit(item){
      this.selectedId=item.id;
    }

}
