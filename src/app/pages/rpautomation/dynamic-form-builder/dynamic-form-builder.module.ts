import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormsComponent } from './dynamic-forms/dynamic-forms.component';
import { FormBuilderComponent } from './form-builder/form-builder.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckBoxComponent } from './atoms/checkbox';
import { DropDownComponent } from './atoms/dropdown';
import { RadioComponent } from './atoms/radio';
import { TextBoxComponent } from './atoms/textbox';
import { IPCCheckboxComponent } from './atoms/ipc-checkbox'
import { FileComponent } from './atoms/file.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomMatPaginatorIntl } from 'src/app/shared/custom-mat-paginator-int';
import { NgxPaginationModule } from 'ngx-pagination';
import { DragDropModule } from "@angular/cdk/drag-drop";
import { CdkDirective } from '../../../shared/directives/cdkdirective';
import { Secretkey } from './atoms/secretkey';
import { HtmlEditor } from './atoms/htmleditor';
import { SignatureUpdate } from './atoms/SignatureUpdate';
@NgModule({
  declarations: [
    DynamicFormsComponent, 
    FormBuilderComponent,
    CheckBoxComponent,
    DropDownComponent,
    RadioComponent,
    TextBoxComponent,
    FileComponent,
    IPCCheckboxComponent,
    CdkDirective,
    Secretkey,
    HtmlEditor,
    SignatureUpdate
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    NgxPaginationModule,
    DragDropModule
  ],
  exports: [DynamicFormsComponent],
  providers: [{
    provide: MatPaginatorIntl, 
    useClass: CustomMatPaginatorIntl
  }]
})
export class DynamicFormBuilderModule { }
