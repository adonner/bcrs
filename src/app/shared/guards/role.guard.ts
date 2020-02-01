/*
============================================
; Title: role.guard
; Author: Troy Martin
; Date: 01/22/2020
; Modified By: Troy Martin
; Description: Guard for role
;===========================================
*/
// start program

// import the angular core module
import { Injectable } from '@angular/core';
// import the angular router module
import { CanActivate, Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { map } from 'rxjs/operators';

// declare the injectable
@Injectable()
// declare and export the class, implementing the CanActivate route guard interface
export class RoleGuard implements CanActivate {

  // define the constructor and inject a router
  constructor(private router: Router, private sessionService: SessionService) { }

  /*
  ; Params: none
  ; Response: boolean
  ; Description: If the user is logged in return true otherwise route to login page
  */
  canActivate() {
    return this.sessionService
      .getUserRole()
      .pipe(map((role) => {
        if (role
          && role.toLowerCase().trim() === 'admin') {
          return true;
        } else {
          this.router.navigate(['/']);
          return false;
        }

      }));
  }
}

// end program
