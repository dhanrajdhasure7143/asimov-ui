import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharebpmndiagramService } from '../../services/sharebpmndiagram.service';

@Component({
  selector: 'app-bpshome',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class BpsHomeComponent {

  uploadedBpmnfile:any
  constructor(private router:Router, private bpmnservice:SharebpmndiagramService ) { }

  uploadBpmn(){
    let newFile = (<HTMLInputElement>document.getElementById("Finput")).files[0];
    this.uploadedBpmnfile=newFile.name;
    this.router.navigate(['/pages/businessProcess/uploadProcessModel'])
    this.bpmnservice.uploadBpmn(this.uploadedBpmnfile)
  }

}
