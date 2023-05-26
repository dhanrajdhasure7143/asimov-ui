import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RpautomationComponent } from './rpautomation.component';
import { RpaConfigurationsComponent} from "./rpa-configurations/rpa-configurations.component"
import { RpaHomeComponent } from './rpa-home/rpa-home.component';
import { RpaAuditlogsComponent } from './rpa-auditlogs/rpa-auditlogs.component';
import { RpaStudioDesignerComponent } from './rpa-studio-designer/rpa-studio-designer.component';
import { RpaConnectionManagerFormComponent } from './forms/rpa-connection-manager-form/rpa-connection-manager-form.component';
import { RpaActionItemsComponent } from './rpa-action-items/rpa-action-items.component';
import { RpaApprovalsComponent } from './rpa-approvals/rpa-approvals.component';

const routes: Routes = [
    {path:'', component:RpautomationComponent, children:[
      {path:'home', component:RpaHomeComponent},
      {path:'designer',component:RpaStudioDesignerComponent},
      {path:'configurations',  component:RpaConfigurationsComponent},
      {path:'auditlogs',component:RpaAuditlogsComponent},
      {path:'connection',component:RpaConnectionManagerFormComponent},      
      {path:'action-item',component:RpaActionItemsComponent},
      {path:"approvals", component:RpaApprovalsComponent},
      {path:'**', redirectTo:'/home', pathMatch: 'full'}
    ]}
  ];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class RpautomationRoutingModule { }

  