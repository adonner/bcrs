/*
============================================
; Title: server-error.component
; Author: Troy Martin
; Date: 01/19/2020
; Modified By: Troy Martin
; Description: Server Error page
;===========================================
*/
import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.css']
})
export class ServerErrorComponent implements OnInit {
  // default year for footer
  year: number = Date.now();

  constructor() { }

  ngOnInit() {
  }

}
