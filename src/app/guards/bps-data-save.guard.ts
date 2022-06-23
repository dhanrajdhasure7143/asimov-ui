import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable()
export class BpsDataSaveGuard implements CanDeactivate<ComponentCanDeactivate> {
  canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
    return component.canDeactivate() ?
      true :
      // NOTE: this warning message will only be shown when navigating elsewhere within your angular app;
      // when navigating away from your angular app, the browser will show a generic warning message
      // see https://stackoverflow.com/questions/52044306/how-to-add-candeactivate-functionality-in-component
      confirm("WARNING!!\nIf you have unsaved changes, they will be lost.\nPlease click 'Cancel' and save your changes.");
  }
}
// export class BpsDataSaveGuard implements CanActivate, CanDeactivate<ActivatedRouteSnapshot> {
//   canActivate(
//     next: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
//     return true;
//   }
  
//   canDeactivate(next: ActivatedRouteSnapshot):any {
//     // Swal.fire({
//     //   title: 'Are you sure?',
//     //   text: 'Your current changes will be lost on changing diagram.',
//     //   icon: 'warning',
//     //   showCancelButton: true,
//     //   confirmButtonText: 'Save and Continue',
//     //   cancelButtonText: 'Discard'
//     // }).then((res)=>{
//     //   // if(){
//     //     // this.saveprocess(null);
//     //     return res.isConfirmed;
//     //   // }
//     // })
//     return confirm("WARNING!!\nIf you have unsaved changes, they will be lost.\nPlease click 'Cancel' and save your changes.");
//   }

// }
