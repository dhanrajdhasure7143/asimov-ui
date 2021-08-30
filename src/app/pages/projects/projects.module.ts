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
import {
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatTabsModule,
  MatTooltipModule,
  MatCardModule,
  MatFormFieldModule,
  MatButtonModule} from '@angular/material';
import { ProjectsProgramsTableComponent } from './projects-list-screen/projects-programs-table/projects-programs-table.component';
import { CreateProjectsComponent } from './create-projects/create-projects.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ProjectDetailsScreenComponent } from './project-details-screen/project-details-screen.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { ProjectDetailsHeaderComponent } from './project-details-header/project-details-header.component';
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
import { MatMenuModule } from '@angular/material'; 
import { UserDetialsPipe } from './pipes/user-detials.pipe';
import { UserImagePipe } from './pipes/user-image-pipe';
import {CustomMatPaginatorIntl} from './../../shared/custom-mat-paginator-int';
import {MatPaginatorIntl} from '@angular/material';
import { CreateProjectFormComponent } from './forms/create-project-form/create-project-form.component';
import { EditTaskComponent } from './edit-task/edit-task.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const materialModules: any[] = [
    
    
  ];

@NgModule({
  declarations: [ProjectsComponent, ProjectsListScreenComponent, ProjectsProgramsTableComponent, CreateProjectsComponent, FileSizePipe,UserImagePipe,
    ProjectDetailsScreenComponent,ProjectDetailsHeaderComponent, ProjectsDashboardComponent, ProcessNamePipe, UserPipePipe, ProjectRepoScreenComponent,CreateTasksComponent, AddResourcesComponent,ProgramDetailsComponent, UserDetialsPipe,RequestFileComponent, CreateProjectFormComponent, EditTaskComponent],
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
    NgbModule
    
  ],
  providers:[
    BsModalRef, 
  {
      provide: MatPaginatorIntl, 
      useClass: CustomMatPaginatorIntl
    }

  ]
})
export class ProjectsModule { }
