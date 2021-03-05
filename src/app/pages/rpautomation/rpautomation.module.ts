import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RpautomationComponent } from './rpautomation.component';
import { RpaStudioComponent } from './rpa-studio/rpa-studio.component';
import { RpautomationRoutingModule } from './rpautomation-routing.module';
import { DndModule } from 'ngx-drag-drop';
import { ContextMenuModule } from 'ngx-contextmenu';
import { DynamicFormBuilderModule } from './dynamic-form-builder/dynamic-form-builder.module';
import { RpaStudioTabsComponent } from './rpa-studio-tabs/rpa-studio-tabs.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RpaStudioWorkspaceComponent } from './rpa-studio-workspace/rpa-studio-workspace.component';
import { RpaStudioActionsComponent } from './rpa-studio-actions/rpa-studio-actions.component';
import { RpaenvironmentsComponent } from './rpa-environments/rpa-environments.component';
import { DataTablesModule } from 'angular-datatables';
import { Ng5SliderModule } from 'ng5-slider';
import { HttpClientModule } from '@angular/common/http';
import { RpaWorkspaceComponent } from './rpa-workspace/rpa-workspace.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
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
import { RpaStudioActionsmenuComponent } from './rpa-studio-actionsmenu/rpa-studio-actionsmenu.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatTooltipModule} from '@angular/material/tooltip';
import{ipcustompipecreation} from './rpa-environments/IPAddressCustompipe';
import { RpaStudioDesignerworkspaceComponent, Checkoutputbox } from './rpa-studio-designerworkspace/rpa-studio-designerworkspace.component';
import { SchedulerComponent,Envname, Reverse } from './scheduler/scheduler.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {NgbTimepickerModule} from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {MatNativeDateModule} from '@angular/material';
import { RpaSchedulerComponent,ReverseRpa,EnvnameRpa } from './rpa-scheduler/rpa-scheduler.component';

import { MatExpansionModule } from '@angular/material/expansion';
import {Rpa_Hints} from './model/RPA-Hints';
@NgModule({
  declarations: [
    RpautomationComponent,
    ipcustompipecreation,
    Envname,
    Reverse,
    RpaStudioComponent,
    RpaStudioTabsComponent,
    RpaStudioWorkspaceComponent,
    RpaStudioActionsComponent,
    RpaenvironmentsComponent,
    RpaWorkspaceComponent,
    RpaHomeComponent,
    RpaConfigurationsComponent,
    RpaDatabaseConnectionsComponent,
    RpaToolsetComponent,
    RpaStudioDesignerComponent,
    RpaStudioActionsmenuComponent,
    RpaStudioDesignerworkspaceComponent,
    SchedulerComponent,
    RpaSchedulerComponent,
    Checkoutputbox,
    ReverseRpa,
    EnvnameRpa
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
    MatInputModule, MatIconModule, MatFormFieldModule,MatNativeDateModule,MatTooltipModule,MatSliderModule,MatDatepickerModule,
    MatSelectModule,
    NgxSpinnerModule,
    MatSlideToggleModule,
    Ng5SliderModule,
  ],
  providers: [MatDatepickerModule,Rpa_Hints]
})
export class RpautomationModule { }
