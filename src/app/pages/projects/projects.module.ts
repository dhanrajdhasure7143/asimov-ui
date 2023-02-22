import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import { ProjectsListScreenComponent } from './projects-list-screen/projects-list-screen.component';
import { DataTablesModule } from 'angular-datatables';
import { MatTableModule } from '@angular/material/table';  
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import { NgxSpinnerModule } from "ngx-spinner";
import { ModalModule, BsModalRef  } from 'ngx-bootstrap/modal';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CreateProjectsComponent } from './create-projects/create-projects.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ProjectDetailsScreenComponent } from './project-details-screen/project-details-screen.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { ProjectsDashboardComponent } from './projects-dashboard/projects-dashboard.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProcessNamePipe } from './pipes/process-name.pipe';
import { UserPipePipe } from './pipes/user-pipe.pipe';
import { ProjectRepoScreenComponent } from './project-repo-screen/project-repo-screen.component';
import { CreateTasksComponent } from './create-tasks/create-tasks.component';
import { AddResourcesComponent } from './forms/add-resources/add-resources.component';
import { Ng5SliderModule } from 'ng5-slider';
import { ProgramDetailsComponent } from './program-details/program-details.component';
import {MatSliderModule} from '@angular/material/slider';
import {NgxPaginationModule} from 'ngx-pagination';
import { RequestFileComponent } from './request-file/request-file.component';
import { FileSizePipe } from './pipes/file-size-pipe.pipe';
import { MatMenuModule } from '@angular/material/menu'; 
import { UserDetialsPipe } from './pipes/user-detials.pipe';
import { UserImagePipe } from './pipes/user-image-pipe';
import {CustomMatPaginatorIntl} from './../../shared/custom-mat-paginator-int';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CreateProjectFormComponent } from './forms/create-project-form/create-project-form.component';
import { EditTaskComponent } from './edit-task/edit-task.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IntitiativePipe } from './pipes/initiatives-pipe.pipe';
import { NotifierService } from 'angular-notifier';
import { BacklogsListComponent } from './backlogs-list/backlogs-list.component';
import { BacklogsCreateComponent } from './backlogs-create/backlogs-create.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { ProjectRpaDesignComponent } from './project-rpa-design/project-rpa-design.component';
import { NgbModalDraggableModule } from 'ngb-modal-draggable';
import { ProjectTaskListComponent } from './project-details-screen/project-task-list/project-task-list.component';
import { SharedModule } from '../../shared/shared.module';
import { AngularSplitModule } from 'angular-split';
import { PrimengCustomModule } from 'src/app/primeng-custom/primeng-custom.module';
import { ProjectTaskDetailsComponent } from './project-task-details/project-task-details.component';

import { ProjectsDocumentComponent } from './project-details-screen/projects-document/projects-document.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ProjectDocumentEditorComponent } from './project-details-screen/project-document-editor/project-document-editor.component';
import { ScrollIntoViewDirective } from './project-details-screen/scroll-into-view.directive';
const materialModules: any[] = [
    
    
  ];

@NgModule({
  declarations: [ProjectsComponent, ProjectsListScreenComponent, CreateProjectsComponent, FileSizePipe,UserImagePipe,
    ProjectDetailsScreenComponent, ProjectsDashboardComponent, ProcessNamePipe,IntitiativePipe, UserPipePipe, ProjectRepoScreenComponent,CreateTasksComponent, AddResourcesComponent,ProgramDetailsComponent, UserDetialsPipe,RequestFileComponent, CreateProjectFormComponent, EditTaskComponent, BacklogsListComponent,
     BacklogsCreateComponent,
     ScrollIntoViewDirective,
     ProjectRpaDesignComponent,
     ProjectTaskListComponent,
     ProjectTaskDetailsComponent,
     ProjectsDocumentComponent,
     ProjectDocumentEditorComponent],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    materialModules,
    ProjectsRoutingModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTabsModule,
    MatCardModule,
    MatTooltipModule,
    MatSlideToggleModule,
    DataTablesModule,MatTableModule,ReactiveFormsModule,FormsModule, MatSortModule,MatSliderModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatMenuModule,MatButtonModule,NgxSpinnerModule,NgxPaginationModule,
    ModalModule.forRoot(),
    MatProgressBarModule,NgSelectModule,Ng5SliderModule,
    NgbModule,
    MatExpansionModule,
    NgbModalDraggableModule,
    SharedModule,
    AngularSplitModule.forRoot(),
    PrimengCustomModule,
    Ng2SearchPipeModule,
  ],
  providers:[
    BsModalRef, NotifierService,
  {
      provide: MatPaginatorIntl, 
      useClass: CustomMatPaginatorIntl
    }

  ]
})
export class ProjectsModule { }
