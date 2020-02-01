/*
============================================
; Title: role-detail-dialog.component
; Author: Reva Baumann
; Date: 01/24/2020
; Modified By: Reva Baumann
; Description: Invoice summary component
;===========================================
*/

// Start Program

// Import the components
import { Component, OnInit, Inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Declare the template/styles
@Component({
  templateUrl: './role-detail-dialog.component.html',
  styleUrls: ['./role-detail-dialog.component.css']
})

// Export the details of classes
export class RoleDetailDialogComponent implements OnInit {
  // declare and set the default base url for the http service calls
  apiBaseUrl = `${environment.baseUrl}/api`;
  title: string;
  id: string;
  form: FormGroup;
  errorMessage: string;
  constructor(
    private http: HttpClient,
    private dialogRef: MatDialogRef<RoleDetailDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      if (data && data.id) {
        console.log('role-detail-dialog.component/constructor', data, 'edit');
        this.title = 'Edit role';
        this.id = data.id;
      } else {
        console.log('role-detail-dialog.component/constructor', 'add');
        this.id = null;
        this.title = 'Create role';
      }
     }
  ngOnInit() {
    this.form = this.fb.group({
      name: [null, [Validators.required]]
    });
    if (this.id) {
      this.http.get(this.apiBaseUrl + '/roles/' + this.id).subscribe((role: any) => {
        this.form.controls.name.setValue(role.name);
      }, (err) => {
        console.log('role-detail-dialog.component', err);
      });
    }
  }
  // Cancel
  cancel() {
    this.dialogRef.close(null);
  }

  // Save component
  save() {
    const roleName = this.form.controls.name.value;
    if (this.form.valid
      && roleName) {
      if (this.id){
        this.http.put(this.apiBaseUrl + '/roles/' + this.id, { name: roleName}).subscribe((role) => {
          if (role) {
            this.dialogRef.close(role);
          }
        }, (err) => {
          this.errorMessage = 'There was an error updating the role name.';
          console.log('role-detail-dialog.component/save', err);
        });
      } else {
        this.http.post(this.apiBaseUrl + '/roles', {name: roleName}).subscribe((role) => {
          if (role) {
            this.dialogRef.close(role);
          }
        }, (err) => {
          this.errorMessage = 'There was an error creating the role.';
          console.log('role-detail-dialog.component/save', err);
        });
      }
    }
  }
}

// End Program
