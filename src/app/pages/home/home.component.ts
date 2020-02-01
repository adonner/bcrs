/*
============================================
; Title: home.component.ts
; Author: Richard Krasso
; Date: 01/06/2020
; Modified By:
; Description: Home component
;===========================================
*/
import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/shared/services/session.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // declare and set the default base url for the http service calls
  apiBaseUrl = `${environment.baseUrl}/api/services`;

  username: string;
  services: [];

  constructor(private sessionService: SessionService, private http: HttpClient) {
    this.username = this.sessionService.getUsername();
    this.http.get(`${this.apiBaseUrl}/`).subscribe((services: []) => {
      this.services = services;
    }, (err) => {
      console.log('home.component/constructor', err);
    });
  }

  ngOnInit() {
  }

}
