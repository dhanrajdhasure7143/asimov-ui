import { Component, OnInit, ViewChild } from '@angular/core';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import moment from 'moment';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-project-task-list',
  templateUrl: './project-task-list.component.html',
  styleUrls: ['./project-task-list.component.css']
})
export class ProjectTaskListComponent implements OnInit {


  tasks:any;
  project_id:any;
  dataSource2: MatTableDataSource<any>;
  dataSource9: MatTableDataSource<any>;
  @ViewChild("sort10", { static: false }) sort10: MatSort;
  @ViewChild("paginator101", { static: false }) paginator101: MatPaginator;

  constructor(private rest_api: RestApiService,
    private route : ActivatedRoute,private Router:Router) { 
      }

  ngOnInit(): void {
    this.route.queryParams.subscribe(data=>{​​​​​​
      this.project_id=data.id
    this.getTaskandCommentsData()
    })
  }

  getTaskandCommentsData() {
    this.rest_api.gettaskandComments(this.project_id).subscribe(data => {
      this.tasks = data;
      this.tasks.map(item=>{item["timeStamp_converted"] = moment(item.lastModifiedTimestamp).valueOf();
        return item;
      })
        this.tasks.sort(function (a, b) {
          return b.timeStamp_converted - a.timeStamp_converted;
      });
      this.dataSource2 = new MatTableDataSource(this.tasks);
      this.dataSource2.sort = this.sort10;
      this.dataSource2.paginator = this.paginator101;
    })
  }
  projectDetails(){
    this.Router.navigate(['listOfProjects']);
}
}