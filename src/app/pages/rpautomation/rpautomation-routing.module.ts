import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RpautomationComponent } from './rpautomation.component';
import { RpaConfigurationsComponent} from "./rpa-configurations/rpa-configurations.component"
import { RpaHomeComponent } from './rpa-home/rpa-home.component';
import { RpaAuditlogsComponent } from './rpa-auditlogs/rpa-auditlogs.component';
import { RpaStudioDesignerComponent } from './rpa-studio-designer/rpa-studio-designer.component';

const routes: Routes = [
    {path:'', component:RpautomationComponent, children:[
      {path:'home', component:RpaHomeComponent},
      {path:'designer',component:RpaStudioDesignerComponent},
      {path:'configurations',  component:RpaConfigurationsComponent},
      {path:'auditlogs',component:RpaAuditlogsComponent},
      {path:'**', redirectTo:'/home', pathMatch: 'full'}
    ]}
  ];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class RpautomationRoutingModule { }

  