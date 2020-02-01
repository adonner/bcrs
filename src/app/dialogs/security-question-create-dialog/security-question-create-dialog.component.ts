/*
============================================
; Title: security-question-create-dialog.component
; Author: Adam Donner
; Date: 01/10/2020
; Modified By: Adam Donner
; Description: Creates new security questions
;===========================================
*/


// start program
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-security-question-create-dialog',
  templateUrl: './security-question-create-dialog.component.html',
  styleUrls: ['./security-question-create-dialog.component.css']
})
export class SecurityQuestionCreateDialogComponent implements OnInit {
  apiBaseUrl = `${environment.baseUrl}/api`;
  form: FormGroup;

  constructor(private http: HttpClient,
              private fb: FormBuilder,
              private router: Router,
              private dialogRef: MatDialogRef<SecurityQuestionCreateDialogComponent>) {
   }

  ngOnInit() {
    this.form = this.fb.group({
      text: [null, Validators.compose([Validators.required])]
    });
  }
  /**
   * Creates a new security question using text from the form field
   */
  create() {
    const newQuestion = this.form.controls.text.value;

    if (this.form.valid
      && newQuestion) {
      // write to the API
      this.http.post(`${this.apiBaseUrl}/security-questions`, {
        text: newQuestion
      }).subscribe( res => {
        this.dialogRef.close({text: newQuestion}); // routes back to the secutiy question page
      });
    }
  }

  /**
   * If cancels route back to security questions page
   */
  cancel() {
    this.dialogRef.close(true);
  }
}
// end program
