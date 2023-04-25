import { Component, OnInit, Input } from'@angular/core';
import { FormGroup } from'@angular/forms';
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import * as $ from 'jquery';
@Component({
selector:'html-editor',
template:`
    <div [formGroup]="form">
    <div class="document-editor">
    <div id="toolbar-container"></div>
    <div class="editor-container">
        <div id="editor_{{field.id}}"></div>
    </div>
    <textarea [hidden]="true" [formControlName]="field.name+'_'+field.id" name='editor1' id='editor1'>{{editorValue}}</textarea>
</div>
    </div>
  `,
  styles:[`
  .form-control
  {
    border-radius:0px;
    border-top:none;
    border-right:none;
    border-left:none;
    box-shadow:none;
  }
  .editor-container {
    border: 1px solid hsl( 0, 0%, 80% );
    max-height: calc( 100vh - 100px );
    overflow: auto;
    }
  `],
})
export class HtmlEditor implements OnInit {
  @Input() field:any = {};
  @Input() form:FormGroup;
  isHovering;
  toggleHover;
  getisValid() { return this.form.controls[this.field.name+"_"+this.field.id].valid; }
  getisDirty() { return this.form.controls[this.field.name+"_"+this.field.id].dirty; }
  @Input('feilddisable') public feilddisable:boolean;
  public editorRef:any;
  constructor() {
  }

  ngOnInit(): void {
    setTimeout(()=>{
      
    DecoupledEditor.create(document.querySelector("#editor_"+this.field.id),{
      // toolbar: [ 'bold', 'italic', 'undo', 'redo' ]
      removePlugins: ['CKFinderUploadAdapter', 'CKFinder', 'EasyImage', 'Image', 'ImageCaption', 'ImageStyle', 'ImageToolbar', 'ImageUpload', 'MediaEmbed'],
    })
      .then((editor) => {
        // The toolbar needs to be explicitly appended.
        document
          .querySelector("#toolbar-container")
          .appendChild(editor.ui.view.toolbar.element);
          this.editorRef = editor;
          console.log(this.field.value)
          this.editorRef.setData(this.field.value);
          this.form.get(this.field.name+"_"+this.field.id).setValue(this.field.value);
        // window = editor;
      })
      .catch((error) => {
        console.error("There was a problem initializing the editor.", error);
      });
  
    }, 200)
  }

  get editorValue(){
    this.form.get(this.field.name+"_"+ this.field.id).setValue(this.editorRef?.getData()??"");
    return this.editorRef?.getData()??"";
  }
}



