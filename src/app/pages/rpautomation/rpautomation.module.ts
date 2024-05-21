import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RpautomationComponent } from './rpautomation.component';
import { RpautomationRoutingModule } from './rpautomation-routing.module';
import { DndModule } from 'ngx-drag-drop';
import { DynamicFormBuilderModule } from './dynamic-form-builder/dynamic-form-builder.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RpaenvironmentsComponent } from './rpa-environments/rpa-environments.component';
import { HttpClientModule } from '@angular/common/http';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule, BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CronEditorModule } from 'src/app/shared/cron-editor/cron-editor.module';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { SharedModule } from 'src/app/shared/shared.module';
import { RpaHomeComponent } from './rpa-home/rpa-home.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSelectModule} from '@angular/material/select';
import { NgxSpinnerModule } from "ngx-spinner";
import { RpaConfigurationsComponent } from './rpa-configurations/rpa-configurations.component';
import { RpaDatabaseConnectionsComponent } from './rpa-database-connections/rpa-database-connections.component';
import { RpaToolsetComponent } from './rpa-toolset/rpa-toolset.component';
import { RpaStudioDesignerComponent} from './rpa-studio-designer/rpa-studio-designer.component';
import {MatMenuModule} from '@angular/material/menu';
import{ipcustompipecreation} from '../../pipes/IPAddressCustompipe';
import { RpaStudioDesignerworkspaceComponent, Checkoutputbox } from './rpa-studio-designerworkspace/rpa-studio-designerworkspace.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {NgbTimepickerModule} from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { RpaSchedulerComponent } from './rpa-scheduler/rpa-scheduler.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { RpaCredentialsComponent } from './rpa-credentials/rpa-credentials.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { TaskPipe } from './../../pipes/task.pipe';
import { TasksearchPipe } from './../../pipes/tasksearch.pipe';
import { RpaSoLogsComponent } from './rpa-so-logs/rpa-so-logs.component';
import { NgbModalDraggableModule } from 'ngb-modal-draggable';
import { ResizableModule } from 'angular-resizable-element';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { RpaAuditlogsComponent } from './rpa-auditlogs/rpa-auditlogs.component'
import { RpaBotFormComponent } from './forms/rpa-bot-form/rpa-bot-form.component';
import { RpaDatabaseFormComponent } from './forms/rpa-database-form/rpa-database-form.component';
import { RpaCredentialFormComponent } from './forms/rpa-credential-form/rpa-credential-form.component';
import { RpaEnvironmentFormComponent } from './forms/rpa-environment-form/rpa-environment-form.component';
import { RpaConnectionManagerFormComponent } from './forms/rpa-connection-manager-form/rpa-connection-manager-form.component';
import { RpaConnectionManagerComponent } from './rpa-connection-manager/rpa-connection-manager.component';
import { RpaActionItemsComponent } from './rpa-action-items/rpa-action-items.component';
import { PrimengCustomModule } from 'src/app/primeng-custom/primeng-custom.module';
import { RpaApprovalsComponent } from './rpa-approvals/rpa-approvals.component';
import { ClipboardModule } from 'ngx-clipboard';
import { toastMessages } from 'src/app/shared/model/toast_messages';
import { Rpa_Hints } from './model/RPA-Hints';
import { RpaSdkComponent } from './rpa-sdk/rpa-sdk.component';
import { RpaSdkFormComponent } from './forms/rpa-sdk-form/rpa-sdk-form.component';
 

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
    RpaCredentialsComponent,
    TaskPipe,
    TasksearchPipe,
    RpaSoLogsComponent,
    RpaAuditlogsComponent,
    RpaBotFormComponent,
    RpaDatabaseFormComponent,
    RpaCredentialFormComponent,
    RpaEnvironmentFormComponent,
    RpaConnectionManagerFormComponent,
    RpaConnectionManagerComponent,
    RpaActionItemsComponent,
    RpaApprovalsComponent,
    RpaSdkComponent,
    RpaSdkFormComponent,
  ],
  imports: [
    NgxMaterialTimepickerModule,
    CommonModule,
    MatMenuModule,
    NgbTimepickerModule,
    NgxPaginationModule,
    RpautomationRoutingModule,
    DndModule,
    MatTabsModule,
    FilterPipeModule,
    NgbModule,MatExpansionModule,
    //ContextMenuModule.forRoot(),
    DynamicFormBuilderModule,
    ReactiveFormsModule,
    CronEditorModule,
    HttpClientModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    SharedModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatSelectModule,
    NgxSpinnerModule,
    NgbModalDraggableModule,
    ResizableModule,
    PopoverModule,
    PrimengCustomModule,
    ClipboardModule
  ],
  exports:[RpaSoLogsComponent,RpaSchedulerComponent, RpaStudioDesignerComponent],
  providers: [MatDatepickerModule,
    Rpa_Hints, 
    BsModalRef, 
    BsModalService,
    DatePipe,
    toastMessages
  ]
})
export class RpautomationModule { }
