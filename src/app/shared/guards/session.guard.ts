/*
============================================
; Title: session.guard
; Author: Troy Martin
; Date: 01/09/2020
; Modified By: Troy Martin
; Description: Guard for session
;===========================================
*/
// start program

// import the angular core module
import { Injectable } from '@angular/core';
// import the angular router module
import { CanActivate, Router, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SessionService } from '../services/session.service';

// declare the injectable
@Injectable()
// declare and export the class, implementing the CanActivate route guard interface
export class SessionGuard implements CanActivate, CanActivateChild {

  // define the constructor and inject a router
  constructor(private router: Router, private sessionService: SessionService) {}

  /*
  ; Params: none
  ; Response: boolean
  ; Description: If the user is logged in return true otherwise route to login page
  */
  canActivate(): boolean {
    // if the user is not logged in send to the login page
    return this.hasCookie();
  }

  /*
  ; Params: childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot
  ; Response: boolean
  ; Description: If the user is logged in return true otherwise route to the login page
  */
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // if the user is not logged in send to the login page
    return this.hasCookie();
  }

  /*
  ; Params: none
  ; Response: boolean
  ; Description: If the user is logged in return true otherwise route to the login page
  */
  private hasCookie() {
    if (!this.sessionService.hasCookie()) {
      // use the route to display the login page
      this.router.navigate(['session/signin']);
    }
    // return the logged in status
    return true;
  }
}

// end program
