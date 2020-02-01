/*
============================================
; Title: session.service
; Author: Troy Martin
; Date: 01/09/2019
; Modified By: Troy Martin
; Description: Session cookie service
;===========================================
*/
// imports from the angular core module
import { Injectable } from '@angular/core';
// imports from the ngx-cookie-service module
import { CookieService } from 'ngx-cookie-service';
// imports from rxjs
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

// declare the injectable
@Injectable({
  providedIn: 'root'
})
// declare and export the class
export class SessionService {
  // declare the cookie name and set the default value
  cookieName = 'sessionuser';
  // declare and set the default base url for the http service calls
  apiBaseUrl = `${environment.baseUrl}/api/users`;


  /*
  ; Params: cookieService
  ; Response: none
  ; Description: default constructor
  */
  constructor(private cookieService: CookieService, private http: HttpClient) { }

  getUser(): string {
    // retrieve the cookie by name
    const user = this.cookieService.get(this.cookieName);

    // if truthy
    if (user) {
      return user;
    } else {
      return null;
    }
  }

  getUserRole(): Observable<string> {
    return this.http.get<string>(`${this.apiBaseUrl}/${this.cookieService.get(this.cookieName)}/role`);
  }

  /*
  ; Params: none
  ; Response: none
  ; Description: does the sessionuser cookie exist
  */
  hasCookie(): boolean {
    // retrieve the cookie by name
    const user = this.cookieService.get(this.cookieName);

    // if truthy
    if (user) {
      return true;
    } else {
      return false;
    }
  }

  /*
  ; Params: none
  ; Response: none
  ; Description: Delete the seesionuser cookie, logging the user out
  */
  logOut() {
    this.cookieService.delete(this.cookieName);
  }

  /*
  ; Params: none
  ; Response: none
  ; Description: gets the username from the cookie
  */
  getUsername(): string {
    return this.cookieService.get(this.cookieName);
  }
}
