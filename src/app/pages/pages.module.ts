import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';

import { SharedModule } from '../shared/shared.module';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { SharebpmndiagramService } from './services/sharebpmndiagram.service';
import { PagesHints } from './model/pages.model';

@NgModule({
  declarations: [
    PagesComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    PagesRoutingModule,
    SharedModule
  ],
  providers: [SharebpmndiagramService, PagesHints]
})
export class PagesModule { }
