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

  const materialModules: any[] = [
    
    
  ];

@NgModule({
  declarations: [ProjectsComponent, ProjectsListScreenComponent, ProjectsProgramsTableComponent, CreateProjectsComponent],
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
    DataTablesModule,MatTableModule,ReactiveFormsModule,FormsModule, MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatButtonModule,NgxSpinnerModule,
    ModalModule.forRoot(),
    
    
  ],
  providers:[
    BsModalRef,
  ]
})
export class ProjectsModule { }
