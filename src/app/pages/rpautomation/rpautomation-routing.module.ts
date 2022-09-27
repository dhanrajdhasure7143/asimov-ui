import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RpautomationComponent } from './rpautomation.component';
import { RpaStudioComponent } from './rpa-studio/rpa-studio.component';
import { RpaenvironmentsComponent } from './rpa-environments/rpa-environments.component';
import { RpaWorkspaceComponent } from './rpa-workspace/rpa-workspace.component'
import { RpaConfigurationsComponent} from "./rpa-configurations/rpa-configurations.component"
import { RpaHomeComponent } from './rpa-home/rpa-home.component';
import { RpaAuditlogsComponent } from './rpa-auditlogs/rpa-auditlogs.component';

const routes: Routes = [
    {path:'', component:RpautomationComponent, children:[
      {path:'home', component:RpaHomeComponent},
      {path:'designer',component:RpaStudioComponent},
      {path:'configurations',  component:RpaConfigurationsComponent},
      {path:'workspace',  component:RpaWorkspaceComponent},
      {path:'auditlogs',component:RpaAuditlogsComponent},
      {path:'**', redirectTo:'/home', pathMatch: 'full'}
    ]}
  ];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class RpautomationRoutingModule { }

  