import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateTicketComponent } from './create-ticket/create-ticket.component';
import { TicketListComponent } from './ticket-list/ticket-list.component';
import { SupportRoutingModule }  from './support-routing.module';
import { SupportComponent } from './support.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatPaginatorModule, MatProgressBarModule } from '@angular/material';
import { JwtModule } from '@auth0/angular-jwt';



@NgModule({
  declarations: [CreateTicketComponent, TicketListComponent, SupportComponent],
  imports: [
    CommonModule,
    SupportRoutingModule,
    NgxSpinnerModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatTabsModule,
    MatTableModule,
    MatSelectModule,
    MatSortModule,
    MatIconModule,
    FormsModule,
    MatPaginatorModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter:  () => localStorage.getItem('accesstoken')
      }
    })
  ]
})
export class SupportModule { }
