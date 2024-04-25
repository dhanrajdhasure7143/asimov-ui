import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PredefinedbotsComponent } from './predefinedbots.component';
import { PredefinedBotsListComponent } from './predefined-bots-list/predefined-bots-list.component';

const routes: Routes = [
  {path:'', component:PredefinedbotsComponent, children:[
    {path:'home', component:PredefinedBotsListComponent},
  ]
}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PredefinedbotsRoutingModule { }
