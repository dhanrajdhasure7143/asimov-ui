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

  tasks_list:any;
  project_id:any;
  columns_list:any[]=[];
  representatives:any[]=[];

  constructor(private rest_api: RestApiService,
    private route : ActivatedRoute,private Router:Router) { 
      }

  ngOnInit(): void {
    this.route.queryParams.subscribe(data=>{​​​​​​
      this.project_id=data.id
    this.getTasksList()
    })
  }

  getTasksList() {
    this.rest_api.gettaskandComments(this.project_id).subscribe(data => {
      this.tasks_list = data;
      console.log("tasks Data",data)
      this.tasks_list.map(item=>{item["timeStamp_converted"] = moment(item.lastModifiedTimestamp).valueOf();
        return item;
      })
        this.tasks_list.sort(function (a, b) {
          return b.timeStamp_converted - a.timeStamp_converted;
      });
    })

    this.columns_list = [
      { ColumnName: "taskName", DisplayName: "Task Name", ShowGrid:true, ShowFilter:true,filterWidget:"multiSelect",filterType:"text", sort:true,multi:false},
      { ColumnName: "taskCategory", DisplayName: "Type", ShowFilter:true, ShowGrid:true,filterWidget:"normal",filterType:"text", sort:true, multi:false},
      { ColumnName: "priority", DisplayName: "Priority", ShowGrid:true, ShowFilter:true, filterWidget:"normal",filterType:"text", sort:true,multi:false},
      { ColumnName: "resources", DisplayName: "Assigned To", ShowGrid:true, ShowFilter:true, filterWidget:"normal",filterType:"text", sort:true,multi:false},
      { ColumnName: "endDate", DisplayName: "Due Date", ShowGrid:true, ShowFilter:true, filterWidget:"normal",filterType:"date", sort:true,multi:false},
      // { ColumnName: "lastModifiedBy", DisplayName: "Last Updated By", ShowGrid:true, ShowFilter:true, filterWidget:"normal",filterType:"text", sort:true,multi:true,multiOptions:["lastModifiedBy","updatedDate"]},
      // { ColumnName: "updatedDate", DisplayName: "Updated Date", ShowGrid:false,ShowFilter:false, sort:false,multi:false},
      // { ColumnName: "status", DisplayName: "Status", ShowGrid:false,ShowFilter:false, sort:false,multi:false},
      { ColumnName: "action", DisplayName: "Action", ShowGrid:true,ShowFilter:false, sort:false,multi:false}
    ];
  }

  projectDetails(){
    this.Router.navigate(['listOfProjects']);
}

deleteById(event){

}

viewDetails(event){

}
}