import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import { ProjectsListScreenComponent } from './projects-list-screen/projects-list-screen.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from "ngx-spinner";
import { ModalModule, BsModalRef  } from 'ngx-bootstrap/modal';
import { CreateProjectsComponent } from './create-projects/create-projects.component';
import { ProjectDetailsScreenComponent } from './project-details-screen/project-details-screen.component';
import { ProjectsDashboardComponent } from './projects-dashboard/projects-dashboard.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProcessNamePipe } from './pipes/process-name.pipe';
import { UserPipePipe } from './pipes/user-pipe.pipe';
import { ProjectRepoScreenComponent } from './project-repo-screen/project-repo-screen.component';
import { CreateTasksComponent } from './create-tasks/create-tasks.component';
import { AddResourcesComponent } from './forms/add-resources/add-resources.component';
import { Ng5SliderModule } from 'ng5-slider';
import { ProgramDetailsComponent } from './program-details/program-details.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { RequestFileComponent } from './request-file/request-file.component';
import { FileSizePipe } from './pipes/file-size-pipe.pipe';
import { UserDetialsPipe } from './pipes/user-detials.pipe';
import { UserImagePipe } from './pipes/user-image-pipe';
import { CreateProjectFormComponent } from './forms/create-project-form/create-project-form.component';
import { EditTaskComponent } from './edit-task/edit-task.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IntitiativePipe } from './pipes/initiatives-pipe.pipe';
import { NotifierService } from 'angular-notifier';
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
import { ScrollIntoViewDirective } from './directives/scroll-into-view.directive';
import { UserFilterDirective } from './directives/user-filter.directive';
import { SanitizeHtmlPipe } from './pipes/sanitize-html.pipe';
import { MentionModule } from 'angular-mentions';
import { toastMessages } from 'src/app/shared/model/toast_messages';
import { ProjectProcessInfoComponent } from './project-details-screen/project-process-info/project-process-info.component';
const materialModules: any[] = [
    
    
  ];

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectsListScreenComponent,
    CreateProjectsComponent,
    FileSizePipe,
    UserImagePipe,
    ProjectDetailsScreenComponent,
    ProjectsDashboardComponent,
    ProcessNamePipe,
    IntitiativePipe, 
    UserPipePipe, 
    ProjectRepoScreenComponent,
    CreateTasksComponent,
    AddResourcesComponent,
    ProgramDetailsComponent,
    UserDetialsPipe,
    RequestFileComponent,
    CreateProjectFormComponent,
    EditTaskComponent,
     ScrollIntoViewDirective,
     ProjectRpaDesignComponent,
     ProjectTaskListComponent,
     ProjectTaskDetailsComponent,
     ProjectsDocumentComponent,
     ProjectDocumentEditorComponent,
     UserFilterDirective,
     SanitizeHtmlPipe,
     ProjectProcessInfoComponent],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    ProjectsRoutingModule,
    ReactiveFormsModule,
    FormsModule, 
    NgxSpinnerModule,
    NgxPaginationModule,
    ModalModule.forRoot(),
    NgSelectModule,
    Ng5SliderModule,
    NgbModule,
    NgbModalDraggableModule,
    SharedModule,
    AngularSplitModule.forRoot(),
    PrimengCustomModule,
    Ng2SearchPipeModule,
    MentionModule
  ],
  providers:[
    BsModalRef, NotifierService,
    toastMessages
  ],
  exports: [
    // export the ProjectProcessInfoComponent here
    ProjectProcessInfoComponent,
  ]
})
export class ProjectsModule { }
