
/*
============================================
; Title: forgot-password-dialog.component
; Author: Adam Donner
; Date: 01/19/2020
; Modified By: Adam Donner
; Description: Forgot Password
;===========================================
*/
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef, MatSnackBar, MatStepper } from '@angular/material';
import { environment } from 'src/environments/environment';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-forgot-password-dialog',
  templateUrl: './forgot-password-dialog.component.html',
  styleUrls: ['./forgot-password-dialog.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }
  }]
})
export class ForgotPasswordDialogComponent implements OnInit {
  // declare the variables
  apiBaseUrl = `${environment.baseUrl}/api`;
  isLinear = true;
  userNameForm: FormGroup;
  securityQuestionForm: FormGroup;
  newPasswordForm: FormGroup;
  selectedSecurityQuestions: any;
  question1: string;
  question2: string;
  question3: string;
  errorMessage: string;
  username: string;
  isCompleted = false;
  questionsVerified = true;


  /*
  ; Params: none
  ; Response: none
  ; Description: default constructor
  */
  constructor(
    private http: HttpClient,
    private dialogRef: MatDialogRef<ForgotPasswordDialogComponent>,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.isCompleted = false;
    this.userNameForm = this.fb.group({
      username: [null, [Validators.required]]
    });

    this.securityQuestionForm = this.fb.group({
      answerToSecurityQuestion1: [null, [Validators.required]],
      answerToSecurityQuestion2: [null, [Validators.required]],
      answerToSecurityQuestion3: [null, [Validators.required]]
    });


    // declare the new password form
    this.newPasswordForm = this.fb.group({
      password: [null, Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/[a-z]/),
        Validators.pattern(/[A-Z]/),
        Validators.pattern(/[0-9]/)
      ])],
      confirmationPassword: [null, [Validators.required, this.matchingPassword.bind(this)]]
    });

  }

  /*
  ; Params: control: FormControl
  ; Response: null = no errors, { passwordsDoNotMatch: true} = errors
  ; Description: Validator function to compare the passwords
  */
  matchingPassword(control: FormControl) {
    if (control && this.newPasswordForm && this.newPasswordForm.controls) {
      return control.value === this.newPasswordForm.controls.password.value ? null
        : { passwordsDoNotMatch: true };
    }

    // since the control is not defined yet return null
    return null;
  }

  verifySecurityQuestions(stepper: MatStepper) {
    const answer1 = this.securityQuestionForm.controls.answerToSecurityQuestion1.value;
    const answer2 = this.securityQuestionForm.controls.answerToSecurityQuestion2.value;
    const answer3 = this.securityQuestionForm.controls.answerToSecurityQuestion3.value;

    this.http.post(`${this.apiBaseUrl}/sessions/verify/users/${this.username}/security-questions`, {
      answerToSecurityQuestion1: answer1,
      answerToSecurityQuestion2: answer2,
      answerToSecurityQuestion3: answer3,
    }).subscribe((res: any) => {
      if (res.auth
        && res.auth === true) {
        console.log('forgot-password-dialog.component/verifySecurityQuestions', res);
        stepper.next();
      } else {
        console.log('forgot-password-dialog.component/verifySecurityQuestions', 'Unable to verify security questions');
        this.securityQuestionForm.controls.answerToSecurityQuestion1.setValue(null);
        this.securityQuestionForm.controls.answerToSecurityQuestion2.setValue(null);
        this.securityQuestionForm.controls.answerToSecurityQuestion3.setValue(null);
        this.questionsVerified = false;

      }
    });
  }




  /**
   * Params: Username
   * Response: boolean, security questions for username.
   * description: Test if there is a valid username in the system.
   */
  validUserName(stepper: MatStepper) {
    const username = this.userNameForm.controls.username.value;

    this.http.get(`${this.apiBaseUrl}/sessions/verify/users/${username}`).subscribe(res => {
      // if true pull selected security questions.
      if (res) {
        console.log('forgot-password-dialog.component/validUserName', res);
        this.http.get(`${this.apiBaseUrl}/users/${username}/security-questions`).subscribe(q => {
          this.selectedSecurityQuestions = q;
          this.username = username;
          console.log('forgot-password-dialog.component/validUserName', this.selectedSecurityQuestions);
        }, err => {
          console.log('forgot-password-dialog.component/validUserName', err);
        }, () => {
          // find selected security questions by id and populate from array
          this.http.post(`${this.apiBaseUrl}/security-questions/find-by-ids`, {
            question1: this.selectedSecurityQuestions[0].id,
            question2: this.selectedSecurityQuestions[1].id,
            question3: this.selectedSecurityQuestions[2].id,
          }).subscribe(a => {
            this.question1 = a[0].text;
            this.question2 = a[1].text;
            this.question3 = a[2].text;
          });
        });
        stepper.next();
      } else {
        this.errorMessage = 'Invalid username.';
        this.userNameForm.controls.username.setValue(null);

      }
    }, err => {
      console.log('forgot-password-dialog.component/validUserName', err);
      this.errorMessage = 'Invalid username.';
      this.userNameForm.controls.username.setValue(null);

    })
  }

  /*
  ; Params: none
  ; Response: none
  ; Description: close the dialog box without saving
  */
  cancel() {
    this.dialogRef.close(null);
  }

  /*
  ; Params: none
  ; Response: none
  ; Description: Change the users password if the form is valid and we have a username
  */
  changePassword() {
    // if the password form is valid and we have the user name change the password
    if (this.newPasswordForm.valid
      && this.username) {
      this.http.put(`${this.apiBaseUrl}/sessions/users/${this.username}/reset-password`,
        { password: this.newPasswordForm.controls.password.value })
        .subscribe((result) => {
          if (result) {
            // we changed the password close the dialog
            this.dialogRef.close(true);
          } else {
            this.errorMessage = 'There was an error updating your password';
          }
        }, (err) => {
          console.log('forgot-password-dialog.component/changePassword', err);
          this.errorMessage = 'There was an error updating your password';
        });
    } else {
      this.errorMessage = 'Invalid username or password.';
    }
  }


}

















