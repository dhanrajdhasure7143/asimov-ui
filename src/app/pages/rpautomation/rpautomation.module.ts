import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RpautomationComponent } from './rpautomation.component';
import { RpaStudioComponent } from './rpa-studio/rpa-studio.component';
import { RpautomationRoutingModule } from './rpautomation-routing.module';
import { DndModule } from 'ngx-drag-drop';
import {  ContextMenuModule } from 'ngx-contextmenu';
import { DynamicFormBuilderModule } from './dynamic-form-builder/dynamic-form-builder.module';
import { RpaStudioTabsComponent } from './rpa-studio-tabs/rpa-studio-tabs.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RpaStudioWorkspaceComponent } from './rpa-studio-workspace/rpa-studio-workspace.component';
import { RpaStudioActionsComponent } from './rpa-studio-actions/rpa-studio-actions.component';
import { RpaenvironmentsComponent } from './rpa-environments/rpa-environments.component';
import { DataTablesModule } from 'angular-datatables';
import { HttpClientModule } from '@angular/common/http';
import { RpaWorkspaceComponent } from './rpa-workspace/rpa-workspace.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RpaHints } from './model/rpa-module-hints';
import { CronEditorModule } from 'src/app/shared/cron-editor/cron-editor.module';
import { RpaDragHints } from './model/rpa-workspace-module-hints';
import { FilterPipeModule } from 'ngx-filter-pipe';
import {RpaEnvHints} from "./model/rpa-environments-module-hints";
import {RpaWorkspace} from "./model/rpa-workspaceslist-module-hints";
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

@NgModule({
  declarations: [RpautomationComponent, RpaStudioComponent, RpaStudioTabsComponent, RpaStudioWorkspaceComponent, RpaStudioActionsComponent, RpaenvironmentsComponent, RpaWorkspaceComponent, RpaHomeComponent],
  imports: [
    CommonModule,
    RpautomationRoutingModule,
    NgxPasswordToggleModule,
    DndModule,
    MatTableModule,
    MatTabsModule,
    FilterPipeModule,
    DataTablesModule,
    NgbModule,
    ContextMenuModule.forRoot(),
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
    MatInputModule, MatIconModule, MatFormFieldModule,
    MatSelectModule,
    NgxSpinnerModule
  ],
  providers: [RpaHints,RpaDragHints,RpaEnvHints,RpaWorkspace]
})
export class RpautomationModule { }
