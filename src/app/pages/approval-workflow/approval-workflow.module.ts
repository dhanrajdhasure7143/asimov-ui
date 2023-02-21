import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ApprovalWorkflowComponent } from './approval-workflow.component';
import { ApprovalWorkflowRoutingModule } from './approval-workflow-routing.module';
import { BpmnDiagramListComponent } from './bpmn-diagram-list/bpmn-diagram-list.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ApprovalHomeHints } from './bpmn-diagram-list/model/bpmn_approval_workflow';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OrderByPipe } from './oerderby-pipe';
import {CustomMatPaginatorIntl} from './../../shared/custom-mat-paginator-int';
import { MatPaginatorIntl } from '@angular/material/paginator';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { PrimengCustomModule } from 'src/app/primeng-custom/primeng-custom.module';


@NgModule({
  declarations: [ApprovalWorkflowComponent, BpmnDiagramListComponent, OrderByPipe],
  imports: [
    CommonModule,
    SharedModule,
    MatExpansionModule,
    FormsModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    ApprovalWorkflowRoutingModule,
    MatProgressSpinnerModule,
    MatInputModule, MatIconModule, MatFormFieldModule,
    MatOptionModule, MatSelectModule,MatTooltipModule,MatPaginatorModule,MatSortModule,
    PrimengCustomModule
  ],
  providers: [ApprovalHomeHints,
    {
      provide: MatPaginatorIntl, 
      useClass: CustomMatPaginatorIntl
    }]
})

export class ApprovalWorkflowModule { }
