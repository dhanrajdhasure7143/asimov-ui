import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SharebpmndiagramService } from '../../pages/services/sharebpmndiagram.service';
import { GlobalScript } from '../global-script';

@Component({
  selector: 'app-upload-create-drop-bpmn',
  templateUrl: './upload-create-drop-bpmn.component.html',
  styleUrls: ['./upload-create-drop-bpmn.component.css']
})
export class UploadCreateDropBpmnComponent implements OnInit {
  constructor(private router:Router, private bpmnservice:SharebpmndiagramService, private global: GlobalScript) { }

  ngOnInit() {
  }
  onSelect(e){
    if(e.addedFiles.length == 1 && e.rejectedFiles.length == 0){
      this.router.navigate(['/pages/businessProcess/uploadProcessModel'])
      this.bpmnservice.uploadBpmn(e.addedFiles[0].name)
    }else{
      let message = "Oops! Something went wrong";
      if(e.rejectedFiles[0].reason == "type")
        message = "Please upload proper *.bpmn file";
      this.global.notify(message,"error");
    }
  }

  createBpmn(){
    this.router.navigateByUrl('/pages/businessProcess/createDiagram');
  }

}
