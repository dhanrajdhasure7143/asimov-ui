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
  displayedColumns: string[] = ["id","department","createdBy","created_at","action"];
  public categories:any=[];

  constructor(private api: RestApiService,private spinner: NgxSpinnerService,private router: Router ) {
  
  }

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories(){
    this.api.getCategoriesList().subscribe(resp => {
      this.categories = resp
      this.dataSource2 = new MatTableDataSource(this.categories.data);
      this.dataSource2.paginator=this.paginator;
      this.dataSource2.sort = this.sort;    
    })
   }


  deleteDepartment(data) {

    let delbody = {
      "categoryId": data.categoryId,
      "categoryName": data.categoryName
    }
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
      this.api.deleteCategory(delbody).subscribe(resp => {
        let value: any = resp
        if (value.message === "Successfully deleted the category") {
          Swal.fire("Success", "Department Deleted Sucessfully!!", "success")
          this.getAllCategories();
        }
        else {
          Swal.fire("Error", value.message, "error");
        }
      })
    }
    })

  }

  editdepartment(element) {
    this.router.navigate(['/pages/admin/edit-department'], { queryParams: {id:element.categoryId, name: element.categoryName } });
  }
}