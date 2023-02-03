import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { PrimengCustomModule } from '../primeng-custom/primeng-custom.module';
import { RemoveUnderscorePipe } from '../services/remove-underscore.pipe';
import { ScreenGenerationDynamicFormComponent } from './screen-generation-dynamic-form/screen-generation-dynamic-form.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { SplitOverlayComponent } from './split-overlay/split-overlay.component';
import { AngularSplitModule } from 'angular-split';


@NgModule({
    declarations: [UploadCreateDropBpmnComponent, BpmnDiagramComponent, ProcessCategoryOverlayComponent, SearchPipe, DeployNotationComponent, DynamicTableComponent, RemoveUnderscorePipe,ScreenGenerationDynamicFormComponent, SplitOverlayComponent],
    imports: [
        CommonModule,
        NgxDropzoneModule,
        CronEditorModule,
        FormsModule,
        MatInputModule, MatIconModule, MatFormFieldModule, MatDialogModule,
        MatOptionModule, MatSelectModule,
        MatTooltipModule,
        NgbModalDraggableModule,
        PrimengCustomModule,
        NgSelectModule,
        Ng2TelInputModule,
        ReactiveFormsModule,
        FormsModule,
        AngularSplitModule.forRoot(),
    ],
    providers: [],
    exports: [UploadCreateDropBpmnComponent, BpmnDiagramComponent, ProcessCategoryOverlayComponent, SearchPipe, DeployNotationComponent, DynamicTableComponent,ScreenGenerationDynamicFormComponent,
        SplitOverlayComponent]
})
export class SharedModule { }
