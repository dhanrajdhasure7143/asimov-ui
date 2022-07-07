import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormsComponent } from './dynamic-forms/dynamic-forms.component';
import { FormBuilderComponent } from './form-builder/form-builder.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckBoxComponent } from './atoms/checkbox';
import { DropDownComponent } from './atoms/dropdown';
import { RadioComponent } from './atoms/radio';
import { TextBoxComponent } from './atoms/textbox';
import { FileComponent } from './atoms/file.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { DragDropModule } from "@angular/cdk/drag-drop";



@NgModule({
  declarations: [
    DynamicFormsComponent, 
    FormBuilderComponent,
    CheckBoxComponent,
    DropDownComponent,
    RadioComponent,
    TextBoxComponent,
    FileComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    DragDropModule,
  ],
  exports: [DynamicFormsComponent],
  providers: []
})
export class DynamicFormBuilderModule { }
