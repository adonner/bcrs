/*
============================================
; Title: user-registration-dialog.component
; Author: Troy Martin
; Date: 01/16/2019
; Modified By: Troy Martin
; Description: Enrollment
;===========================================
*/

// imports from angular and our custom components
import { Component, OnInit, Output } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { map } from 'rxjs/operators';
import { SecurityQuestion } from 'src/app/models/security-question.model';

// declare the component
@Component({
  templateUrl: './user-registration-dialog.component.html',
  styleUrls: ['./user-registration-dialog.component.css']
})
// declare and export the class
export class UserRegistrationDialogComponent implements OnInit {
  // declare and set the default base url for the http service calls
  apiBaseUrl = `${environment.baseUrl}/api`;

  // declare the variables
  user: User = new User();
  isLinear = true;
  personalInfoForm: FormGroup;
  addressForm: FormGroup;
  accountForm: FormGroup;
  securityQuestionsForm: FormGroup;
  username: string;
  questions: SecurityQuestion[];

  /*
  ; Params: none
  ; Response: none
  ; Description: default constructor
  */
  constructor(
    private http: HttpClient,
    private dialogRef: MatDialogRef<UserRegistrationDialogComponent>,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    // get the security questions to display in the dropdowns
    this.http.get<SecurityQuestion[]>(`${this.apiBaseUrl}/security-questions`)
      .subscribe((questions) => {
        this.questions = questions;
      }, (err) => {
        console.log('user-registration-dialog.component/constructor', err);
      });
  }

  /*
  ; Params: none
  ; Response: none
  ; Description: initialize the component
  */
  ngOnInit() {
    // declare the personal information form
    this.personalInfoForm = this.fb.group({
      firstName: [null],
      lastName: [null],
      email: [null, [Validators.email]],
      phoneNumber: [null]
    });

    // subscribe to form changes and populate the user variable for the component
    this.personalInfoForm.valueChanges.subscribe(() => {
      this.user.firstName = this.personalInfoForm.controls.firstName.value;
      this.user.lastName = this.personalInfoForm.controls.lastName.value;
      this.user.phoneNumber = this.personalInfoForm.controls.phoneNumber.value;
      this.user.email = this.personalInfoForm.controls.email.value;
    });

    // declare the address form
    this.addressForm = this.fb.group({
      addressLine1: [null],
      addressLine2: [null],
      city: [null],
      state: [null],
      postalCode: [null]
    });

    // subscribe to address form changes and populate the user on the component
    this.addressForm.valueChanges.subscribe(() => {
      this.user.addressLine1 = this.addressForm.controls.addressLine1.value;
      this.user.addressLine2 = this.addressForm.controls.addressLine2.value;
      this.user.city = this.addressForm.controls.city.value;
      this.user.state = this.addressForm.controls.state.value;
      this.user.postalCode = this.addressForm.controls.postalCode.value;
    });

    // declare the account form, set validators for the password
    this.accountForm = this.fb.group({
      username: [null, [Validators.required], [this.availableUsernameValidator.bind(this)]],
      password: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/[a-z]/),
          Validators.pattern(/[A-Z]/),
          Validators.pattern(/[0-9]/)
        ])
      ]
    });

    // subscribe to form changes and populate the user on the component
    this.accountForm.valueChanges.subscribe(() => {
      this.user.username = this.accountForm.controls.username.value;
      this.user.password = this.accountForm.controls.password.value;
    });

    // declare the security question form
    this.securityQuestionsForm = this.fb.group({
      questionId1: [null, [Validators.required]],
      answer1: [null, [Validators.required]],
      questionId2: [null, [Validators.required]],
      answer2: [null, [Validators.required]],
      questionId3: [null, [Validators.required]],
      answer3: [null, [Validators.required]],

    });
  }

  /*
  ; Params: none
  ; Response: none
  ; Description: Get the questions and answers from the form and put them on the user
  */
  getQuestions() {
    this.user.SecurityQuestions = [];
    this.user.SecurityQuestions.push({
      id: this.securityQuestionsForm.controls.questionId1.value,
      answer: this.securityQuestionsForm.controls.answer1.value
    });
    this.user.SecurityQuestions.push({
      id: this.securityQuestionsForm.controls.questionId2.value,
      answer: this.securityQuestionsForm.controls.answer2.value
    });
    this.user.SecurityQuestions.push({
      id: this.securityQuestionsForm.controls.questionId3.value,
      answer: this.securityQuestionsForm.controls.answer3.value
    });
  }

  /*
  ; Params: none
  ; Response: none
  ; Description: Async validator to test if user name is valid
  */
  availableUsernameValidator(control: FormControl) {
    // get the user by user name
    return this.http.get(this.apiBaseUrl + '/sessions/verify/users/' + control.value).pipe(map((u: any) => {
      // validation statement
      return u ? { usernameExists: true } : null;
    }
    ));
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
  ; Description: Complete the registration process and sign in
  */
  signIn() {
    // todo also validate that we have three security questions for the user
    if (this.accountForm.valid
      && this.securityQuestionsForm.valid) {
      this.http
        .post(`${this.apiBaseUrl}/sessions/register`, this.user)
        .subscribe(
          (res: any) => {
            // if we get a result and the result has a mongo id then success
            if (res
              && res._id) {
              // log the response
              console.log('user-registration-dialog.component/signIn', 'success', res);
              this.username = res.username;
            }
          },
          (err) => {
            // log the error and display a message to the user
            console.log('user-registration-dialog.component/signIn', 'error', err);
            this.displayMessage('There was an error creating your account.');
          },
          () => {
            // on complete if we succeeded in creating the user close the dialog
            if (this.username) {
              this.dialogRef.close(this.username);
            }
          }
        );
    }
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
