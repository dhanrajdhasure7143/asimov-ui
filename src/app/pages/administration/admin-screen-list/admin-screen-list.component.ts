import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatSort } from '@angular/material/sort';
import { RestApiService } from '../../services/rest-api.service';


@Component({
  selector: 'app-admin-screen-list',
  templateUrl: './admin-screen-list.component.html',
  styleUrls: ['./admin-screen-list.component.css']
})
export class AdminScreenListComponent implements OnInit {
  screenlist: any =[];
  loading:boolean = false;
  columns_list:any =[]
  constructor(private router:Router, private rest: RestApiService) { }

  ngOnInit(): void {
    this.getScreenList();
  }
  
  

  addNew(){
    this.router.navigate(['./pages/admin/admin-screen-create'])
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
 
  }
  
  getScreenList(){
    this.loading= true;
    this.rest.getScreenList().subscribe(data=>{
    this.screenlist =data;
    this.columns_list = [
      {
        ColumnName: "Screen_Name",
        DisplayName: "Screen Name",
        ShowGrid: true,
        ShowFilter: true,
        filterWidget: "multiSelect",
        filterType: "text",
        sort: true,
        multi: false,
      },
      {
        ColumnName: "Table_Name",
        DisplayName: "Table Name",
        ShowGrid: true,
        ShowFilter: true,
        filterWidget: "multiSelect",
        filterType: "text",
        sort: true,
        multi: false,
      },
      {
        ColumnName: "action",
        DisplayName: "Actions",
        ShowGrid: true,
        ShowFilter: true,
        filterWidget: "multiSelect",
        filterType: "text",
        sort: true,
        multi: false,
      }
    ]
    this.loading =false;
    })
  }

  editScreen(event:any){
    this.router.navigate(['./pages/admin/admin-screen-create'],{queryParams:{id:event.Screen_ID}});
  }

  deleteScreen(id: any) {
    this.loading = true;
    this.rest.deleteScreen(id.Screen_ID).subscribe(data => {
      Swal.fire("Success", "Record deleted successfully", "success")
      this.getScreenList();
      this.loading = false;
    }),(err: any) => {
      Swal.fire("Error", "Unable to delete record", "error")
    }
  }
}
