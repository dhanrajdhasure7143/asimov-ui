import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class BpsDataSaveGuard implements CanActivate, CanDeactivate<ActivatedRouteSnapshot> {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  
  canDeactivate(next: ActivatedRouteSnapshot):any {
    // Swal.fire({
    //   title: 'Are you sure?',
    //   text: 'Your current changes will be lost on changing diagram.',
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonText: 'Save and Continue',
    //   cancelButtonText: 'Discard'
    // }).then((res)=>{
    //   // if(){
    //     // this.saveprocess(null);
    //     return res.isConfirmed;
    //   // }
    // })
    return confirm("WARNING!!\nIf you have unsaved changes, they will be lost.\nPlease click 'Cancel' and save your changes.");
  }

}
