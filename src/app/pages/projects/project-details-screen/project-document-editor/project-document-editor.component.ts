import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { asBlob } from 'html-docx-js-typescript'
import {saveAs} from 'file-saver';
@Component({
  selector: 'app-project-document-editor',
  templateUrl: './project-document-editor.component.html',
  styleUrls: ['./project-document-editor.component.css']
})
export class ProjectDocumentEditorComponent implements OnInit {

  public documentData:string;
  public projectName:string;
  public project_id:any;
  public ckeConfig:any;
  constructor(private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params:any)=>{
      this.project_id=params.project_id;
      this.projectName=params.projectName;
      this.ckeConfig = {
        allowedContent: false,
        extraPlugins: 'divarea',
        forcePasteAsPlainText: true,
        removePlugins: 'exportpdf'
      };
    })
  }

  saveDocument()
  {
    console.log(this.documentData)
    asBlob(this.documentData).then((data:any) => {
      saveAs(data, 'file.docx') // save as docx file
    })
  }

}
