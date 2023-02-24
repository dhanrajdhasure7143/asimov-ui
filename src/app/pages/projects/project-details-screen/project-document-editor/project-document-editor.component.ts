import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { asBlob } from 'html-docx-js-typescript'
import {saveAs} from 'file-saver';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
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
  public editorRef:any;
  navigarteURL:any;
  constructor(private activatedRoute:ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params:any)=>{
      let paramsData = JSON.parse(atob(params.id))
      this.navigarteURL = paramsData.url
      this.project_id=paramsData.projectId;
      this.projectName=paramsData.projectName;
      // this.ckeConfig = {
      //   allowedContent: false,
      //   extraPlugins: 'divarea',
      //   forcePasteAsPlainText: true,
      //   removePlugins: 'exportpdf'
      // };
      DecoupledEditor
	.create( document.querySelector( '#editor' ) )
	.then( editor => {
		// The toolbar needs to be explicitly appended.
		document.querySelector( '#toolbar-container' ).appendChild( editor.ui.view.toolbar.element );
    this.editorRef=editor;
		// window = editor;
	} )
	.catch( error => {
		console.error( 'There was a problem initializing the editor.', error );
	} );
    })
  }

  saveDocument()
  {
    this.documentData=this.editorRef.getData()
    asBlob(this.documentData).then((data:any) => {
      saveAs(data, 'file.docx') // save as docx file
    })
  }

  onNavigate(){
    this.router.navigateByUrl(this.navigarteURL)
  }

}
