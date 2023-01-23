import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { UploadCreateDropBpmnComponent } from '../shared/upload-create-drop-bpmn/upload-create-drop-bpmn.component';
import { BpmnDiagramComponent } from './bpmn-diagram/bpmn-diagram.component';
import { CronEditorModule } from './cron-editor/cron-editor.module';
import { ProcessCategoryOverlayComponent } from './process-category-overlay/process-category-overlay.component';
import { SearchPipe } from './pipes/search.pipe';
import { DeployNotationComponent } from './deploy-notation/deploy-notation.component';
import { NgbModalDraggableModule } from 'ngb-modal-draggable';
import { DynamicTableComponent } from './dynamic-table/dynamic-table.component';
import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {CalendarModule} from 'primeng/calendar';
import {SliderModule} from 'primeng/slider';
import {MultiSelectModule} from 'primeng/multiselect';
import {ContextMenuModule} from 'primeng/contextmenu';
import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {ProgressBarModule} from 'primeng/progressbar';
import {InputTextModule} from 'primeng/inputtext';

@NgModule({
    declarations: [UploadCreateDropBpmnComponent, BpmnDiagramComponent, ProcessCategoryOverlayComponent, SearchPipe, DeployNotationComponent, DynamicTableComponent,],
    imports: [
        CommonModule,
        NgxDropzoneModule,
        CronEditorModule,
        FormsModule,
        MatInputModule, MatIconModule, MatFormFieldModule, MatDialogModule,
        MatOptionModule, MatSelectModule,
        MatTooltipModule,
        NgbModalDraggableModule,
        TableModule,
        ToastModule,
        CalendarModule,
        SliderModule,
        MultiSelectModule,
        ContextMenuModule, 
        DialogModule, 
        ButtonModule,
        DropdownModule,
        ProgressBarModule,
        InputTextModule
    ],
    providers: [],
    exports: [UploadCreateDropBpmnComponent, BpmnDiagramComponent, ProcessCategoryOverlayComponent, SearchPipe, DeployNotationComponent, DynamicTableComponent]
})
export class SharedModule { }
