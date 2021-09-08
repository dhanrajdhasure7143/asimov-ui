import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-programlandingpage',
  templateUrl: './programlandingpage.component.html',
  styleUrls: ['./programlandingpage.component.css']
})
export class ProgramComponent implements OnInit {
  public selectedTab=0;
  public check_tab=0;
  constructor() { }


  ngOnInit() {
  }

  onTabChanged(event)
  {
    this.check_tab=event.index;
  }
}
