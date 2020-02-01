/*============================================
; Title: base-layout.component.ts
; Author: Adam Donner
; Date: 10 January 2020
; Description:  base-layout.component.ts
;===========================================
*/


// start program

import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.css']
})
export class BaseLayoutComponent implements OnInit {
  year: number = Date.now();
  hasAdmin = false;

  constructor(
    private sessionService: SessionService,
    private router: Router) {
      this.sessionService
      .getUserRole()
      .subscribe((res) => {
        this.hasAdmin = res.toLowerCase().trim() === 'admin';
      }, (err) => {
        console.log('base-layout.component/setQuestions', err);
      });
  }

  ngOnInit() {
  }

  /**
   * Delete cookie and redirect to signin page.
   */
  logout() {
    this.sessionService.logOut();
    this.router.navigate(['/session/signin']);
  }

}
// end program
