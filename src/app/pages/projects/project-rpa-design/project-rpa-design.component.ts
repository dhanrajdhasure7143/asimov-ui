import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestApiService } from '../../services/rest-api.service';



@Component({
  selector: 'app-project-rpa-design',
  templateUrl: './project-rpa-design.component.html',
  styleUrls: ['./project-rpa-design.component.css']
})
export class ProjectRpaDesignComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;

  displayedColumns: string[] = ['stepNo', 'steps', 'description', 'configuration',  'Action'];
  dataSource: MatTableDataSource<any[]>;
  USER_DATA:any[]= []
  public myDataArray: any;
  selectedId: any;
  projectId:any;
  programId:any;
  taskId:any;


  constructor(private rest_api:RestApiService,private router : Router, private route : ActivatedRoute) {
    this.route.queryParams.subscribe(params=>{
      console.log(params)
      // id=2892&programId=2896
      this.projectId = params.projectId
      this.taskId = params.taskId
      this.programId = params.programId
    })
   }

  ngOnInit(): void {
this.getRPAdesignData()

  }

  getRPAdesignData(){
    let res_data:any
    this.rest_api.getRPAdesignData(this.taskId).subscribe(res=>{res_data = res
      console.log(res);
      this.USER_DATA = res_data.data
      this.dataSource = new MatTableDataSource(this.USER_DATA);
      setTimeout(() => {
        this.dataSource.paginator=this.paginator;
      // this.dataSource.sort=this.sort;
  
      }, 2000);
    })
  }

  addUser() {
    let newUser1 ={steps:"",description:"", configuration:"",id:122,new:true};
    this.USER_DATA.splice(0,0,newUser1)
    this.dataSource = new MatTableDataSource(this.USER_DATA);
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

  cancelCreateNewrow(i) {
    console.log("index:", i);
    this.USER_DATA.splice(i, 1);
    this.dataSource = new MatTableDataSource(this.USER_DATA);
    this.myDataArray.paginator = this.paginator;

    // this.myDataArray = [...this.USER_DATA];
  }

  onEdit(item) {
    this.selectedId = item.id;
  }

  backToProjects() {
    this.router.navigate(['/pages/projects/projectdetails'],{queryParams:{id:this.projectId,programId:this.programId}})
  }

  saveConfiguration(element,i){
    let req_body = {
      "projectId": this.projectId,
      "taskId": this.taskId,
      "stepNo": i,
      "steps": element.steps,
      "description": element.description,
      "configuration": element.configuration,
      "createdBy": localStorage.getItem("firstName") + " " + localStorage.getItem("lastName"),
      "createdUserId": localStorage.getItem("ProfileuserId"),
    }

    this.rest_api.saveRpaDesign([req_body]).subscribe(res=>{
      console.log(res)
      this.getRPAdesignData();
    })
  }

  updateConfiguration(item){
    let req_body = {
      "id": item.id,
      "steps": item.steps,
      "description": item.description,
      "configuration": item.configuration,
    }

    this.rest_api.updateRPADesignData([req_body]).subscribe(res=>{
      console.log(res)
      this.getRPAdesignData();
    })

  }
  deleteConfiguration(item){
    let req_body={
      "id": item.id,
    }
    this.rest_api.deleteRpaDesign([req_body]).subscribe(res=>{
      console.log(res)
      this.getRPAdesignData();
    })
  }
}
