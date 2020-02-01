/*
============================================
; Title: not-found
; Author: Reva Baumann
; Date: 01/06/2020
; Modified By: Reva Baumann
; Description: 404 Page
;===========================================
*/

// Start Program

// Import the modules
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

// Link the Components
@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  constructor(private router: Router, private cookie: CookieService) { }

  ngOnInit() {
  }

  goHome() {
    const cookieValue: string = this.cookie.get('isAuthenticated');
    if (cookieValue) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/session/login']);
    }
  }

}

// End Program
