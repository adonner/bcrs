/*
============================================
; Title: security-question.service
; Author: Troy Martin
; Date: 01/09/2020
; Modified By: Troy Martin
; Description: Security question service
;===========================================
*/
// imports from the angular core module
import { Injectable } from '@angular/core';
// imports from angular common
import { HttpClient } from '@angular/common/http';
// import rxjs
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
// import our custom security question model
import { SecurityQuestion } from '../../models/security-question.model';
import { environment } from '../../../environments/environment';
// tslint:disable-next-line: max-line-length
import { SecurityQuestionCreateDialogComponent } from '../../dialogs/security-question-create-dialog/security-question-create-dialog.component';

// declare injectable
@Injectable({
  providedIn: 'root'
})
// declare and export the service class
export class SecurityQuestionService {
  // declare and set the default base url for the http service calls
  apiBaseUrl = `${environment.baseUrl}/api/security-questions`;

  /*
  ; Params: http: HttpClient
  ; Response: none
  ; Description: default constructor
  */
  constructor(private http: HttpClient) { }

  /*
  ; Params: none
  ; Response: SecurityQuestion[]
  ; Description: FindAll security questions
  */
  getAll(): Observable<SecurityQuestion[]> {
    return this.http.get<SecurityQuestion[]>(`${this.apiBaseUrl}/`);
  }

  /*
  ; Params: id: string
  ; Response: none
  ; Description:
  */
  delete(id: string): Observable<boolean> {
    // use pipe pluck to return if the question is now disabled
    return this.http.delete<boolean>(`${this.apiBaseUrl}/${id}`)
    .pipe(pluck('isDisabled'));
  }
}
