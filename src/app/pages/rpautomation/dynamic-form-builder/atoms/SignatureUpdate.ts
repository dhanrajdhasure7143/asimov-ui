import { Component, OnInit, Input } from'@angular/core';
import { FormGroup } from'@angular/forms';
declare const CKEDITOR: any;
@Component({
selector:'template-editor',
template:`
    <div [formGroup]="form">
      <textarea  [formControlName]="field.name+'_'+field.id"  [id]="'template-editor'+field.id"></textarea>
      <input type="file" class="form-control"  (change)="onFileUpload($event)">
    </div>
    <span *ngIf="loaded">
      <span [hidden]=true>{{editorValue}}</span>
    </span>
    <span class="errspan required">{{errorMessage}}</span>
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
export class SignatureUpdate implements OnInit {
  @Input() field:any = {};
  @Input() form:FormGroup;
  errorMessage:any="";
  isHovering;
  toggleHover;
  getisValid() { return this.form.controls[this.field.name+"_"+this.field.id].valid; }
  getisDirty() { return this.form.controls[this.field.name+"_"+this.field.id].dirty; }
  @Input('feilddisable') public feilddisable:boolean;
  public editorRef:any;
  public loaded:boolean=false;
  constructor() {
  }

  ngOnInit(): void {
    setTimeout(()=>{
          this.form.get(this.field.name+"_"+this.field.id).setValue(this.field.value);
          CKEDITOR.replace("template-editor"+this.field.id,{
            height: 250,
            extraPlugins: 'colorbutton',
            removeButtons: 'PasteFromWord'
          });
          CKEDITOR.config.allowedContent = true;
          this.loaded=true;
    }, 200)
    
  }

  get editorValue(){
    this.form.get(this.field.name+"_"+ this.field.id).setValue(CKEDITOR.instances["template-editor"+this.field.id].getData()??"");
    return CKEDITOR.instances["template-editor"+this.field.id].getData();
  }

  onFileUpload(event:any)
  {
      let file=(event.target.files[0]);
      if(file.type.startsWith("text/html"))
      {
        this.errorMessage="";
        const reader = new FileReader();
        reader.onload = (e) => {
          const htmlCode = reader.result.toString();
          CKEDITOR.instances["template-editor"+this.field.id].setData(htmlCode);
          this.form.get(this.field.name+"_"+this.field.id).setValue(htmlCode);
        };
      reader.readAsText(file);
    }
    else{
      this.errorMessage="Upload .html file";
    }
  }
}



