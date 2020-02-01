/*
============================================
; Title: security-question-edit-dialog.component
; Author: Adam Donner
; Date: 01/10/2020
; Modified By: Adam Donner
; Description: Edits security questions
;===========================================
*/

// start program
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-security-question-edit-dialog',
  templateUrl: './security-question-edit-dialog.component.html',
  styleUrls: ['./security-question-edit-dialog.component.css']
})

export class SecurityQuestionEditDialogComponent implements OnInit {
  apiBaseUrl = `${environment.baseUrl}/api`;
  question: any;
  questionId: string;
  form: FormGroup;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SecurityQuestionEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SecurityQuestionEditDialogComponent) {
      this.questionId = data.questionId;
      this.question = data.question;
    }

  ngOnInit() {
    this.form = this.fb.group({
      text: [this.question.text, Validators.compose([Validators.required])]
    });
  }
  /**
   * Puts new value of security question using text from the form field
   */
  saveQuestion() {
    const updatedQuestion = this.form.controls.text.value;

    if (this.form.valid
      && updatedQuestion) {
      // write to the API
      this.http.put(`${this.apiBaseUrl}/security-questions/${this.questionId}`, { text: updatedQuestion })
      .subscribe( res => {
        // routes back to the security question page
        this.dialogRef.close({_id: this.questionId, text: updatedQuestion, message: null, updated: true});
      }, (err) => {
        this.dialogRef.close({_id: this.questionId, text: this.question, message: err, updated: false});
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
