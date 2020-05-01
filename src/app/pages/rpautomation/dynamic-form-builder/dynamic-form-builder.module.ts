import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormsComponent } from './dynamic-forms/dynamic-forms.component';
import { FormBuilderComponent } from './form-builder/form-builder.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckBoxComponent } from './atoms/checkbox';
import { DropDownComponent } from './atoms/dropdown';
import { RadioComponent } from './atoms/radio';
import { TextBoxComponent } from './atoms/textbox';



@NgModule({
  declarations: [
    DynamicFormsComponent, 
    FormBuilderComponent,
    CheckBoxComponent,
    DropDownComponent,
    RadioComponent,
    TextBoxComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [DynamicFormsComponent],
  providers: []
})
export class DynamicFormBuilderModule { }
