import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { RedirectionComponent } from './rediraction/redirection.component';

const routes: Routes = [
  { path:'', redirectTo:"login", pathMatch:"full" },
  { path: 'login', component: LoginComponent },
  { path: 'redirect', component: RedirectionComponent },
  { path: 'pages', loadChildren: () => import('src/app/pages/pages.module').then(m => m.PagesModule), canActivate: [AuthGuard] },
  { path: 'dashboard', loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule) },//resolve: {userSharedData: ContentReslover}
  { path: '**', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
