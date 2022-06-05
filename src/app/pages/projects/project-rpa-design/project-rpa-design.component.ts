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
  isEdit: boolean;
  }

const COLUMNS_SCHEMA = [
  {key: 'sNo',label: 'S No',type:'number',},
  {key: 'steps',label: 'Steps',},
  {key: 'description',label: 'Description',},
  {key: 'configuration',label: 'Configuration',},
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

  // displayedColumns: string[] = ['sNo', 'steps', 'description', 'configuration',  'Action'];

  dataSource: MatTableDataSource<any[]>;
  displayedColumns: string[] = COLUMNS_SCHEMA.map((col) => col.key);
  columnsSchema: any = COLUMNS_SCHEMA;
  USER_DATA :data[]= [
    {steps:"Login to Satuit",description:"Testing Description", configuration:"a.Testing",isEdit:false},
    {steps:"Download",description:"This action is apply search  criteria and export the result to excel", configuration:"a.HR",isEdit:false},
    {steps:"Login to seismic",description:"Testing 123", configuration:"a.Client ID",isEdit:false},
    {steps:"Tetsing",description:" DEscription", configuration:"a.User",isEdit:false}
  ];
  public myDataArray: any;

  public newUser ={steps:"",description:"", configuration:"",isEdit:true};

  constructor() { }

  ngOnInit(): void {
    this.myDataArray = [...this.USER_DATA];
    // this.dataSource = new MatTableDataSource(this.data);
  }

  onAddRow(){
    let data1 =  {steps:"",description:"", configuration:"",new:'true'}
    this.data.push(data1)
    // this.dataSource = new MatTableDataSource(this.data);
  }

  addUser() {
    let newUser1 ={steps:"",description:"", configuration:"",isEdit:true};
    this.USER_DATA.splice(0,0,newUser1)
    const newUsersArray = this.USER_DATA;
    // newUsersArray.push(newUser1);
    this.myDataArray = [...newUsersArray];
    }

  saveTableRow(e){
    console.log(e)
  }

  deleteNewRow(index){
    console.log(index,this.USER_DATA)
    // this.USER_DATA = this.USER_DATA.filter((value,key)=>{
    // return value.email != row_obj.email;
    // });
    // this.myDataArray = [...this.USER_DATA];//refresh the dataSource
    // Swal.fire('Deleted successfully..!')
    }

}
