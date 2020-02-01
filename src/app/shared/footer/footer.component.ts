/*
============================================
; Title: footer.component
; Author: Richard Krasso
; Date: 01/17/2019
; Modified By: Troy Martin
; Description: Common footer
;===========================================
*/
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  // declare copyright year for footer
  year: number = Date.now();

  constructor() { }

  ngOnInit() {
  }

}
