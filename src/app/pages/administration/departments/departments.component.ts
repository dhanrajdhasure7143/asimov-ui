import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { RestApiService } from 'src/app/pages/services/rest-api.service';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent implements OnInit {

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  dataSource2:MatTableDataSource<any>;
  displayedColumns: string[] = ["check","categoryId","categoryName","owner","createdBy","createdAt","action"];
  public departments:any=[];
  public Departmentcheckeddisabled:boolean =false;
  public Departmentcheckflag:boolean = false;
  departments_list: any=[];
  public Departmentdeleteflag:Boolean;
  departmentName: any;
  department: string;
  users_list:any=[];
  constructor(private api: RestApiService,private spinner: NgxSpinnerService,private router: Router ) {
  
  }

  ngOnInit(): void {
    this.getAllDepartments();
    this.Departmentdeleteflag=false;
    this.getallusers();
  }

  getAllDepartments(){
    this.api.getDepartmentsList().subscribe(resp => {
      this.departments = resp
      this.dataSource2 = new MatTableDataSource(this.departments.data);
      this.dataSource2.paginator=this.paginator;
      this.dataSource2.sort = this.sort;    
      let selected_department=localStorage.getItem("department_search");
      this.department=selected_department?selected_department:'alldepartments';
      this.searchByCategory(this.department);
    })
   }


  deleteDepartment() {
    const delbody = this.departments.data.filter(p => p.checked==true).map(p=>{
      return{
        "categoryId": p.categoryId
      }
      });
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
      this.api.deleteDepartments(delbody).subscribe(resp => {
        let value: any = resp
        if (value.message === "Successfully deleted the category") {
          Swal.fire("Success", "Department Deleted Sucessfully!!", "success")
          this.getAllDepartments();
          this.removeallchecks();
          this.checktodelete();
        }
        else {
          Swal.fire("Error", value.message, "error");
        }
      })
    }
    })

  }

  editdepartment(element) {
    this.router.navigate(['/pages/admin/edit-department'], { queryParams: {id:element.categoryId } });
  }

  DepartmentscheckAllCheckBox(ev) {
    this.departments.data.forEach(x =>
       x.checked = ev.target.checked);
    this.checktodelete();
  }

  DepartmentscheckEnableDisableBtn(id, event)
  {
    this.departments.data.find(data=>data.categoryId==id).checked=event.target.checked;
    this.checktodelete();
  }

  checktodelete()
  {
    const selecteddepartmentdata = this.departments.data.filter(product => product.checked).map(p => p.categoryId);
    if(selecteddepartmentdata.length>0)
    {
      this.Departmentdeleteflag=true;
    }else
    {
      this.Departmentdeleteflag=false;
    }
  }

  removeallchecks()
  {
    for(let i=0;i<this.departments.data.length;i++)
    {
      this.departments.data[i].checked= false;
    }
    this.Departmentcheckflag=false;
  }

  searchByCategory(department) {      // Filter table data based on selected categories
    localStorage.setItem("department_search",department)
    if (department == "alldepartments") {
      var fulldata='';
      this.dataSource2.filter = fulldata;
      this.dataSource2.paginator.firstPage();
    }else{  
      this.dataSource2.filterPredicate = (data: any, filter: string) => {
        return data.categoryName === department;
       };
       this.dataSource2.filter = department;
       this.dataSource2.paginator=this.paginator;
       this.dataSource2.paginator.firstPage();
    }

  }

  resetSearch(department){
    if (department == "alldepartments") {
      var fulldata='';
      this.dataSource2.filter = fulldata;
      this.dataSource2.paginator.firstPage();
    }
    this.dataSource2.filter = department;
    this.dataSource2.paginator=this.paginator;
    this.dataSource2.paginator.firstPage();
    this.departmentName=""
  }

  getallusers()
  {
    let tenantid=localStorage.getItem("tenantName")
    this.api.getuserslist(tenantid).subscribe(item=>{
      let users:any=item
      this.users_list=users;
    })
  }
}