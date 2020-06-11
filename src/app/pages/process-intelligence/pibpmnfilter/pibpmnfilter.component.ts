import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pibpmnfilter',
  templateUrl: './pibpmnfilter.component.html',
  styleUrls: ['./pibpmnfilter.component.css']
})
export class PibpmnfilterComponent implements OnInit {
  disableSavegenerate:boolean=true;
  category='';
  name=''

  constructor(private router:Router) { }

  ngOnInit() {
  }
  applyFilter(){
    // if(document.getElementById("name")!= null && document.getElementById("category")!=null){ 
    //   this.disableSavegenerate=!this.disableSavegenerate
    // }
    this.router.navigate(['/pages/processIntelligence/flowChart']);
    
  }
  slideDown(){
    document.getElementById("foot").classList.add("slide-down");
    document.getElementById("foot").classList.remove("slide-up");
    
  }

}
