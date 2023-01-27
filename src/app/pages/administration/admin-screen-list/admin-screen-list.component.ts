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
  displayedColumns: string[] = ['name', 'tableName', 'action'];
  dataSource:MatTableDataSource<any>;
  screenlist: any =[];
  loading:boolean = false;
  @ViewChild("paginator",{static:false}) paginator: MatPaginator;
  @ViewChild("sort",{static:false}) sort: MatSort;

  constructor(private router:Router, private rest: RestApiService) { }

  ngOnInit(): void {
    this.getScreenList();
  }
  
  

  addNew(){
    this.router.navigate(['./pages/admin/admin-screen-create'])
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();    
  }
  
  getScreenList(){
    this.loading= true;
    this.rest.getScreenList().subscribe(data=>{
    this.screenlist =data;
    this.dataSource= new MatTableDataSource(this.screenlist);  
    setTimeout(() => {
    this.dataSource.paginator=this.paginator;
    this.dataSource.sort = this.sort;
    }, 500);
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
