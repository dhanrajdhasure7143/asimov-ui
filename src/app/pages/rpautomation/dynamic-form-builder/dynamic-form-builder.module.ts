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
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatPaginatorIntl} from '@angular/material';
import { CustomMatPaginatorIntl } from 'src/app/shared/custom-mat-paginator-int';
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
