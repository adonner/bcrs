/*
============================================
; Title: user-profile.component
; Author: Troy Martin
; Date: 01/23/2020
; Modified By: Troy Martin
; Description: User profile
;===========================================
*/
// import angular and our custom components
import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/shared/services/session.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/models/user.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SecurityQuestion } from 'src/app/models/security-question.model';
import { MatSnackBar } from '@angular/material';
import { map } from 'rxjs/operators';

@Component({
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  // declare and set variables
  apiBaseUrl = `${environment.baseUrl}/api`;
  username: string;
  user: User;
  questions: SecurityQuestion[];
  personalInfoForm: FormGroup;
  newPasswordForm: FormGroup;
  securityQuestionsForm: FormGroup;
  errorMessage: string;

  /*
  ; Params: none
  ; Response: none
  ; Description: default constructor
  */
  constructor(
    private sessionService: SessionService,
    private http: HttpClient,
    private fb: FormBuilder,
    private snackBar: MatSnackBar) {
    // get the logged in user name
    this.username = this.sessionService.getUsername();

    // get the security questions to display in the drop downs
    this.http.get<SecurityQuestion[]>(`${this.apiBaseUrl}/security-questions`)
      .subscribe((questions) => {
        this.questions = questions;
      }, (err) => {
        console.log('user-profile.component/constructor', err);
      });
  }

  /*
  ; Params: none
  ; Response: none
  ; Description: Initialize the component
  */
  ngOnInit() {
    // declare the personal information form
    this.personalInfoForm = this.fb.group({
      firstName: [null],
      lastName: [null],
      email: [null, [Validators.email]],
      phoneNumber: [null],
      addressLine1: [null],
      addressLine2: [null],
      city: [null],
      state: [null],
      postalCode: [null]

    });

    // declare the new password form
    this.newPasswordForm = this.fb.group({
      currentPassword: [null, Validators.required],
      password: [null, Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/[a-z]/),
        Validators.pattern(/[A-Z]/),
        Validators.pattern(/[0-9]/)
      ])],
      confirmationPassword: [null, [Validators.required, this.matchingPassword.bind(this)]]
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

    // get the logged in users information
    this.http.get(`${this.apiBaseUrl}/sessions/verify/users/${this.username}`)
      .pipe(
        map((res: any) => {
          return this.mapUser(res);
        })
      ).subscribe((u) => {
        this.user = u;
      }, (err) => {
        console.log('user-profile.component/ngOnInit', err);
      }, () => {
        // on completion set the form values
        this.setFormValues();
      });
  }

  /*
  ; Params: none
  ; Response: none
  ; Description: Reset the personal information form back to original values
  */
  resetPersonalInfo() {
    this.setPersonalInformation();
  }

  /*
  ; Params: none
  ; Response: none
  ; Description: Update the users personal information
  */
  savePersonalInfo() {
    if (this.personalInfoForm.valid) {
      this.getFormValues();
      this.http.put(`${this.apiBaseUrl}/users/${this.user.id}`, this.user)
        .pipe(
          map((result: any) => {
            return this.mapUser(result);
          })
        ).subscribe((u) => {
          this.user = u;
        }, (err) => {
          console.log('user-profile.component/savePersonalInfo', err);
        }, () => {
          this.displayMessage('Your personal information has been updated.');
          this.setFormValues();
        });
    }

  }

  /*
  ; Params: none
  ; Response: none
  ; Description: Change the users password
  */
  changePassword() {
    if (this.newPasswordForm.valid) {
      // test the current password
      this.http.post(`${this.apiBaseUrl}/sessions/signin`, {
        username: this.username,
        password: this.newPasswordForm.controls.currentPassword.value
      }).pipe(map((result: any) => {
        return result.isAuthenticated;
      }, (err) => {
        console.log('user-profile.component/changePassword', err);
      })).subscribe((auth) => {
        if (auth) {
          this.http.put(`${this.apiBaseUrl}/sessions/users/${this.username}/reset-password`,
            { password: this.newPasswordForm.controls.password.value })
            .subscribe((hasUpdatedPassword) => {
              if (hasUpdatedPassword) {
                this.displayMessage('Your password has been changed.');
                this.newPasswordForm.reset();
                this.newPasswordForm.controls.currentPassword.markAsPristine();
                this.newPasswordForm.controls.password.markAsPristine();
                this.newPasswordForm.controls.confirmationPassword.markAsPristine();
              } else {
                this.displayMessage('There was an error updating your password');
              }
            }, (err) => {
              console.log('user-profile.component/changePassword', err);
              this.displayMessage('There was an error trying to reset your password please try again.');
            });
        } else {
          this.displayMessage('Invalid current password.');
        }
      });
    }
  }

  /*
  ; Params: none
  ; Response: none
  ; Description: Reset the security questions
  */
  resetQuestions() {
    this.setUsersQuestions();
  }

  /*
  ; Params: none
  ; Response: none
  ; Description: Update the users security question choices
  */
  setQuestions() {
    if (this.securityQuestionsForm.valid) {
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

      this.http.put(`${this.apiBaseUrl}/users/${this.username}/security-questions`, this.user)
      .pipe(map((u) => {
        if (u) {
          return this.mapUser(u);
        }
      }, (err) => {
        console.log('user-profile.component/setQuestions', err);
      })).subscribe((u) => {
        this.user = u;
      }, (err) => {
        console.log('user-profile.component/setQuestions', err);
      }, () => {
        this.setFormValues();
      });

    }

    this.displayMessage('Your security questions and answers have been updated.')
  }

  /*
  ; Params: none
  ; Response: none
  ; Description: Sets the form values based on the current user
  */
  private setFormValues() {
    this.setPersonalInformation();
    this.setUsersQuestions();
  }

  /*
  ; Params: none
  ; Response: none
  ; Description: Sets the personal information form to the user values
  */
  private setPersonalInformation() {
    // set if we have a user
    if (this.user) {
      this.personalInfoForm.controls.firstName.setValue(this.user.firstName);
      this.personalInfoForm.controls.lastName.setValue(this.user.lastName);
      this.personalInfoForm.controls.phoneNumber.setValue(this.user.phoneNumber);
      this.personalInfoForm.controls.email.setValue(this.user.email);
      this.personalInfoForm.controls.addressLine1.setValue(this.user.addressLine1);
      this.personalInfoForm.controls.addressLine2.setValue(this.user.addressLine2);
      this.personalInfoForm.controls.city.setValue(this.user.city);
      this.personalInfoForm.controls.state.setValue(this.user.state);
      this.personalInfoForm.controls.postalCode.setValue(this.user.postalCode);

    }
  }

  /*
  ; Params: none
  ; Response: none
  ; Description: Set the users security questions
  */
  private setUsersQuestions() {
    // set if we have a user and questions
    if (this.user && this.user.SecurityQuestions) {
      this.securityQuestionsForm.controls.questionId1.setValue(this.user.SecurityQuestions[0].id);
      this.securityQuestionsForm.controls.answer1.setValue(this.user.SecurityQuestions[0].answer);

      this.securityQuestionsForm.controls.questionId2.setValue(this.user.SecurityQuestions[1].id);
      this.securityQuestionsForm.controls.answer2.setValue(this.user.SecurityQuestions[1].answer);

      this.securityQuestionsForm.controls.questionId3.setValue(this.user.SecurityQuestions[2].id);
      this.securityQuestionsForm.controls.answer3.setValue(this.user.SecurityQuestions[2].answer);
    }
  }

  /*
  ; Params: message
  ; Response: none
  ; Description: map the user to the object
  */
  private mapUser(result: any): User {
    const user = new User();
    user.id = result._id;
    user.username = result.username;
    user.password = result.password;
    user.firstName = result.firstName;
    user.lastName = result.lastName;
    user.phoneNumber = result.phoneNumber;
    user.email = result.email;
    user.addressLine1 = result.addressLine1;
    user.addressLine2 = result.addressLine2;
    user.city = result.city;
    user.state = result.state;
    user.postalCode = result.postalCode;
    user.role = result.role;
    user.SecurityQuestions = result.SecurityQuestions;
    return user;
  }

  /*
  ; Params: none
  ; Response: none
  ; Description: Set the user to the corresponding form value
  */
  private getFormValues() {
    this.user.firstName = this.personalInfoForm.controls.firstName.value;
    this.user.lastName = this.personalInfoForm.controls.lastName.value;
    this.user.phoneNumber = this.personalInfoForm.controls.phoneNumber.value;
    this.user.email = this.personalInfoForm.controls.email.value;
    this.user.addressLine1 = this.personalInfoForm.controls.addressLine1.value;
    this.user.addressLine2 = this.personalInfoForm.controls.addressLine2.value;
    this.user.city = this.personalInfoForm.controls.city.value;
    this.user.state = this.personalInfoForm.controls.state.value;
    this.user.postalCode = this.personalInfoForm.controls.postalCode.value;
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
}
