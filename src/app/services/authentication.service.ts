import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient,private router:Router) { }

  login(username: string, password: string) {
    return this.http.post<any>(`/oauth/token`, { 'username' : username, 'password' : password })
    .pipe(map(user => {
      if (user && user['errorCode']) {
        return throwError({ error: { message: 'Username or password is incorrect' } });
      }
      localStorage.setItem('currentUser', JSON.stringify(user));
      // set user data 
      return user;
    }));
  }

  logout() {
    this.loggedIn.next(false);
    localStorage.clear();
  }

  loginExpired() {
    // logic has to be implemented once integrated with AIOTAL project
    // location.reload();
  }

  backendServerDown() {
    // logic has to be implemented once integrated with AIOTAL project
    // location.reload();    
  }

  
  forbiddenAccess() {
    // logic has to be implemented once integrated with AIOTAL project
    // location.reload();
    localStorage.clear();
    this.router.navigate(['/login'])   
  }

  get isLoggedIn() {
    return this.loggedIn;
  }

}
