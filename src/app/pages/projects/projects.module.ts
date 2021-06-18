import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import { ProjectsListScreenComponent } from './projects-list-screen/projects-list-screen.component';
import {
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatTabsModule,
  MatTooltipModule,
  MatCardModule} from '@angular/material';

  const materialModules: any[] = [
    
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTabsModule,
    MatCardModule,
    MatTooltipModule
  ];

@NgModule({
  declarations: [ProjectsComponent, ProjectsListScreenComponent],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    materialModules,
    ProjectsRoutingModule
  ]
})
export class ProjectsModule { }
