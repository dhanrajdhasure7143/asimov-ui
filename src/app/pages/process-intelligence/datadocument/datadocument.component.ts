import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-datadocument',
  templateUrl: './datadocument.component.html',
  styleUrls: ['./datadocument.component.css']
})
export class DatadocumentComponent implements OnInit {
  lastchild: string;
  fileData:any[];

  constructor(private router:Router) { }

  ngOnInit() {
 

  }
  generatepg(){
    // this.router.navigate(['/processintelligence']);
    this.router.navigate(['/flowChart']);
  }
}
