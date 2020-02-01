/*============================================
; Title: signin.component.ts
; Author: Adam Donner
; Date: 9 January 2020
; Description:  signin.component.ts
;===========================================
*/


// start program

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatSnackBar } from '@angular/material';
import { registerLocaleData } from '@angular/common';
import { UserRegistrationDialogComponent } from 'src/app/dialogs/user-registration-dialog/user-registration-dialog.component';
import { ForgotPasswordDialogComponent } from 'src/app/dialogs/forgot-password-dialog/forgot-password-dialog.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  apiBaseUrl = `${environment.baseUrl}/api`;

  form: FormGroup;
  errorMessage: string;

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private fb: FormBuilder,
    private http: HttpClient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.form = this.fb.group({
      username: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')])]
    });
  }
  /**
   * SignIn function.
   * Tests signin calling API from server.
   */
  signin() {
    /**
     * Assign variables with values collected from form.
     */
    const username = this.form.controls.username.value;
    const password = this.form.controls.password.value;

    // Call API
    this.http.post(`${this.apiBaseUrl}/sessions/signin`, {
      username,
      password
    }).subscribe(res => {
      if (res['isAuthenticated']) {
        /**
         * Signing to application
         */
        this.cookieService.set('sessionuser', username, 1);
        this.router.navigate(['/']);
      } else { // else display error message
        this.errorMessage = res['message'];
      }
    }, (err) => {
      console.log('signin.component/signin', err);
      this.errorMessage = err.error.message;
    });
  }

  register() {
    // declare and create the material dialog
    const dialogRef = this.dialog.open(UserRegistrationDialogComponent, {
      width: '60%', // options to control height and width of dialog
      disableClose: true, // the user cannot click in the overlay to close
      // pass the title and message to the dialog
      data: { id: null }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // the user was updated need to replace them in the array
        this.cookieService.set('sessionuser', result, 1);
        this.router.navigate(['/']);
      }

      // else they canceled nothing to do here
    });
  }

  forgotPassword() {
    // declare and create the material dialog
    const dialogRef = this.dialog.open(ForgotPasswordDialogComponent, {
      width: '40%', // options to control height and width of dialog
      disableClose: true, // the user cannot click in the overlay to close
      // pass the title and message to the dialog
      data: { id: null }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.displayMessage('Your password was updated login with your username and new password.')
      }
      // else they canceled nothing to do here
    });
  }

  /*
  ; Params: message
  ; Response: none
  ; Description: display the snackbar message
  */
  private displayMessage(message: string) {
    // display the snackbar message for 10sec
    this.snackBar.open(message, 'OK', {
      duration: 10000
    });
  }
}
// end program
