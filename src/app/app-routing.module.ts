import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path:'', redirectTo:"login", pathMatch:"full" },
  { path: 'login', component: LoginComponent },
  { path: 'pages', loadChildren: 'src/app/pages/pages.module#PagesModule', canActivate: [AuthGuard] },//resolve: {userSharedData: ContentReslover}
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
