import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"
import { SharebpmndiagramService } from '../../services/sharebpmndiagram.service';

@Component({
  selector: 'app-processintelligence',
  templateUrl: './processintelligence.component.html',
  styleUrls: ['./processintelligence.component.css']
})
export class ProcessintelligenceComponent implements OnInit {
  uploadedBpmnfile:any

  constructor(private router:Router, private bpmnservice:SharebpmndiagramService) { }

  ngOnInit() {
  }
  navigatebpmn(){
    this.router.navigate(['/processintelligencebpmn'])
  }
  uploadBpmn(){
    let newFile = (<HTMLInputElement>document.getElementById("Finput2")).files[0];
    this.uploadedBpmnfile=newFile.name;
    this.router.navigate(['/processintelligencebpmn'])
    console.log(this.uploadedBpmnfile)
    this.bpmnservice.uploadBpmn(this.uploadedBpmnfile)

  }

}
