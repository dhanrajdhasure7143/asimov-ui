import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-backlogs-list',
  templateUrl: './backlogs-list.component.html',
  styleUrls: ['./backlogs-list.component.css']
})
export class BacklogsListComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  onCreate(){
    this.router.navigate(['/pages/projects/createBacklog'])
  }

}
