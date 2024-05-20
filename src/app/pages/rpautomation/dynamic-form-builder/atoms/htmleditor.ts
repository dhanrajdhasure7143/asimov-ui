import { Component, OnInit, Input } from'@angular/core';
import { FormGroup } from'@angular/forms';
declare const CKEDITOR: any;
@Component({
selector:'html-editor',
template:`
    <div [formGroup]="form">
      <textarea  [formControlName]="field.name+'_'+field.id"  [id]="'template-editor'+field.id"></textarea>
      <span *ngIf="loaded">
      <span [hidden]=true>{{editorValue}}</span>
    </span>
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
  loaded:boolean=false;
  constructor() {
  }

  ngOnInit(): void {

    setTimeout(()=>{
      this.form.get(this.field.name+"_"+this.field.id).setValue(this.field.value);
      CKEDITOR.replace("template-editor"+this.field.id, {
        height: 250,
        extraPlugins: 'colorbutton',
        removeButtons: 'PasteFromWord'
      });
      CKEDITOR.config.allowedContent = true;   
      this.loaded=true
    // DecoupledEditor.create(document.querySelector("#editor_"+this.field.id),{
    //   // toolbar: [ 'bold', 'italic', 'undo', 'redo' ]
    //   removePlugins: ['CKFinderUploadAdapter', 'CKFinder', 'EasyImage', 'Image', 'ImageCaption', 'ImageStyle', 'ImageToolbar', 'ImageUpload', 'MediaEmbed'],
    // })
    //   .then((editor) => {
    //     // The toolbar needs to be explicitly appended.
    //     document
    //       .querySelector("#toolbar-container")
    //       .appendChild(editor.ui.view.toolbar.element);
    //       this.editorRef = editor;
    //       this.editorRef.setData(this.field.value);
    //       this.form.get(this.field.name+"_"+this.field.id).setValue(this.field.value);
    //     // window = editor;
    //   })
    //   .catch((error) => {
    //     console.error("There was a problem initializing the editor.", error);
    //   });
  
    }, 200)
  }

  // get editorValue(){
  //   this.form.get(this.field.name+"_"+ this.field.id).setValue(this.editorRef?.getData()??"");
  //   return this.editorRef?.getData()??"";
  // }

  get editorValue(){
    this.form.get(this.field.name+"_"+ this.field.id).setValue(CKEDITOR.instances["template-editor"+this.field.id].getData()??"");
    return CKEDITOR.instances["template-editor"+this.field.id].getData();
  }
}



