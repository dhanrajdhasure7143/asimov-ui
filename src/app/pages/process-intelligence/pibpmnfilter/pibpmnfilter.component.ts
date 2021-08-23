import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pibpmnfilter',
  templateUrl: './pibpmnfilter.component.html',
  styleUrls: ['./pibpmnfilter.component.css']
})
export class PibpmnfilterComponent implements OnInit {
  category='';
  name=''

  constructor(private router:Router) { }

  ngOnInit() {
  }
  applyFilter(){
    //save details in db
    this.router.navigate(['/pages/processIntelligence/flowChart']);
  }
  slideDown(){
    document.getElementById("foot").classList.add("slide-down");
    document.getElementById("foot").classList.remove("slide-up");
  }

}
