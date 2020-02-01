/*
============================================
; Title: app.component
; Author: Richard Krasso
; Date: 01/06/2020
; Modified By:
; Description: App component
;===========================================
*/
// imports from angular core
import { Component } from '@angular/core';

// declare the component
@Component({
  // define the selector to output the component
  selector: 'app-root',
  // define the HTML template
  template: `<router-outlet></router-outlet>`,
  // define the CSS for the component
  styles: [``]
})
// declare and export the component class
export class AppComponent {
  // declare and set a default title
  title = 'Bob\'s Computer Repair Shop';
}
