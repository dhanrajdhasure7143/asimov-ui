import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-project-repo-screen',
  templateUrl: './project-repo-screen.component.html',
  styleUrls: ['./project-repo-screen.component.css']
})
export class ProjectRepoScreenComponent implements OnInit {
  projects_toggle:Boolean=false;
  createRequestmodalref: BsModalRef;
  denyFileRequestmodalref : BsModalRef;
  projectList:any[]=[];
  pendingList:any[]=[];
  denyFileRequestForm:FormGroup;
  constructor(private modalService: BsModalService, private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.projectList=[{category:'PDF', fullname:'peter', uploaded:'jan-12-2021', uploadedby:'john', filesize: '100kb',comments:'reviewed'},
 {category:'EXCEL', fullname:'john', uploaded:'july-2-2021', uploadedby:'peter', filesize: '130kb',comments:'reviewed'},
 {category:'PDF', fullname:'peter', uploaded:'jan-12-2021', uploadedby:'john', filesize: '100kb',comments:'reviewed'},
 {category:'PDF', fullname:'john', uploaded:'july-2-2021', uploadedby:'peter', filesize: '130kb',comments:'reviewed'}];
 
 this.pendingList=[{filecategory:'anlysis', requestfrom:'peter',requestto:'john', description:'now use LoremIpsum as their default moal text', requestdate:'16-jan-2021'},
 {filecategory:'design', requestfrom:'john',requestto:'peter', description:'now use LoremIpsum as their default moal text', requestdate:'16-june-2021'},
 {filecategory:'anlysis', requestfrom:'peter',requestto:'john', description:'now use LoremIpsum as their default moal text', requestdate:'16-jan-2021'},
 {filecategory:'design', requestfrom:'john',requestto:'peter', description:'now use LoremIpsum as their default moal text', requestdate:'16-june-2021'}]
  
 this.denyFileRequestForm=this.formBuilder.group({
  
  description: ["", Validators.compose([Validators.required, Validators.maxLength(200)])],
 })


}
  

  createUploadRequest(createmodal){
    this.createRequestmodalref=this.modalService.show(createmodal,{class:"modal-lr"})
  }
  
  denyFileRequest(template: TemplateRef<any>) {
    this.denyFileRequestmodalref = this.modalService.show(template);
  }
  onDeleteItem(){
    
  }
  sendDenyFileReq(){

  }
  clearMsg(){

  }

}
