import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RpautomationComponent } from './rpautomation.component';
import { RpautomationRoutingModule } from './rpautomation-routing.module';
import { DndModule } from 'ngx-drag-drop';
import { DynamicFormBuilderModule } from './dynamic-form-builder/dynamic-form-builder.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RpaenvironmentsComponent } from './rpa-environments/rpa-environments.component';
import { DataTablesModule } from 'angular-datatables';
import { Ng5SliderModule } from 'ng5-slider';
import { HttpClientModule } from '@angular/common/http';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule, BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CronEditorModule } from 'src/app/shared/cron-editor/cron-editor.module';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { NgxPasswordToggleModule } from 'ngx-password-toggle';
import { SharedModule } from 'src/app/shared/shared.module';
import { RpaHomeComponent } from './rpa-home/rpa-home.component';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatInputModule, MatIconModule, MatFormFieldModule} from '@angular/material';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSelectModule} from '@angular/material/select';
import { NgxSpinnerModule } from "ngx-spinner";
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSliderModule} from '@angular/material/slider';
import { RpaConfigurationsComponent } from './rpa-configurations/rpa-configurations.component';
import { RpaDatabaseConnectionsComponent } from './rpa-database-connections/rpa-database-connections.component';
import { RpaToolsetComponent } from './rpa-toolset/rpa-toolset.component';
import { RpaStudioDesignerComponent} from './rpa-studio-designer/rpa-studio-designer.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatTooltipModule} from '@angular/material/tooltip';
import{ipcustompipecreation} from './rpa-environments/IPAddressCustompipe';
import { RpaStudioDesignerworkspaceComponent, Checkoutputbox } from './rpa-studio-designerworkspace/rpa-studio-designerworkspace.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {NgbTimepickerModule} from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {MatNativeDateModule} from '@angular/material';
import { RpaSchedulerComponent,ReverseRpa,EnvnameRpa } from './rpa-scheduler/rpa-scheduler.component';

import { MatExpansionModule } from '@angular/material/expansion';
import {Rpa_Hints} from './model/RPA-Hints';
import { RpaCredentialsComponent } from './rpa-credentials/rpa-credentials.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { TaskPipe } from './custom-pipes/task.pipe';
import { TasksearchPipe } from './custom-pipes/tasksearch.pipe';
import {MatPaginatorIntl} from '@angular/material';
import { CustomMatPaginatorIntl } from 'src/app/shared/custom-mat-paginator-int';
import { RpaSoLogsComponent } from './rpa-so-logs/rpa-so-logs.component';
import { AngularSplitModule } from 'angular-split';
import { NgbModalDraggableModule } from 'ngb-modal-draggable';
import { ResizableModule } from 'angular-resizable-element';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { RpaAuditlogsComponent } from './rpa-auditlogs/rpa-auditlogs.component'
import { RpaBotFormComponent } from './forms/rpa-bot-form/rpa-bot-form.component';
import { RpaDatabaseFormComponent } from './forms/rpa-database-form/rpa-database-form.component';
import { RpaCredentialFormComponent } from './forms/rpa-credential-form/rpa-credential-form.component';
import { RpaEnvironmentFormComponent } from './forms/rpa-environment-form/rpa-environment-form.component';
import { SearchRpaPipe } from './rpa-home/Search.pipe';

@NgModule({
  declarations: [
    RpautomationComponent,
    ipcustompipecreation,
    RpaenvironmentsComponent,
    RpaHomeComponent,
    RpaConfigurationsComponent,
    RpaDatabaseConnectionsComponent,
    RpaToolsetComponent,
    RpaStudioDesignerComponent,
    RpaStudioDesignerworkspaceComponent,
    RpaSchedulerComponent,
    Checkoutputbox,
    ReverseRpa,
    EnvnameRpa,
    RpaCredentialsComponent,
    TaskPipe,
    TasksearchPipe,
    RpaSoLogsComponent,
    RpaAuditlogsComponent,
    RpaBotFormComponent,
    RpaDatabaseFormComponent,
    RpaCredentialFormComponent,
    RpaEnvironmentFormComponent,
    SearchRpaPipe
  ],
  imports: [
    NgxMaterialTimepickerModule,
    CommonModule,
    MatMenuModule,
    NgbTimepickerModule,
    NgxPaginationModule,
    RpautomationRoutingModule,
    NgxPasswordToggleModule,
    DndModule,
    MatTableModule,
    MatTabsModule,
    FilterPipeModule,
    DataTablesModule,
    NgbModule,MatExpansionModule,
    //ContextMenuModule.forRoot(),
    DynamicFormBuilderModule,
    ReactiveFormsModule,
    CronEditorModule,
    HttpClientModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    SharedModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatInputModule, MatIconModule, MatFormFieldModule,MatNativeDateModule,MatTooltipModule,MatSliderModule,MatDatepickerModule,MatSidenavModule,
    MatSelectModule,
    NgxSpinnerModule,
    MatSlideToggleModule,
    Ng5SliderModule,
    AngularSplitModule.forRoot(),
    NgbModalDraggableModule,
    ResizableModule,
    PopoverModule,
  ],
  exports:[RpaSoLogsComponent],
  providers: [MatDatepickerModule,Rpa_Hints, BsModalRef, BsModalService,
    {
           provide: MatPaginatorIntl, 
           useClass: CustomMatPaginatorIntl
    }
  ]
})
export class RpautomationModule { }
