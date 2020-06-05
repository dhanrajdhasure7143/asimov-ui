import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-of-changes',
  templateUrl: './list-of-changes.component.html',
  styleUrls: ['./list-of-changes.component.css']
})
export class ListOfChangesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  slideDown(){
    document.getElementById("foot").classList.add("slide-down");
    document.getElementById("foot").classList.remove("slide-up");
    
  }
}
