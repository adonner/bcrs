/*
============================================
; Title: service-detail-dialog.component
; Author: Troy Martin
; Date: 01/19/2020
; Modified By: Troy Martin
; Description: Service Detail Dialog
;===========================================
*/
// import angular components and our custom components
import { Component, OnInit, Inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Service } from 'src/app/models/service.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  templateUrl: './service-detail-dialog.component.html',
  styleUrls: ['./service-detail-dialog.component.css']
})
export class ServiceDetailDialogComponent implements OnInit {
  // declare and set the default base url for the http service calls
  apiBaseUrl = `${environment.baseUrl}/api/services`;
  service: Service;
  form: FormGroup;
  id: string;

  /*
  ; Params: none
  ; Response: none
  ; Description: default constructor
  */
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ServiceDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id }) {
    if (data && data.id) {
      this.id = data.id;
    }
  }

  /*
  ; Params: none
  ; Response: none
  ; Description: initialize the component
  */
  ngOnInit() {

    this.form = this.fb.group({
      description: [null, Validators.compose([Validators.required])],
      price: [null, Validators.compose([Validators.required])]
    });

    if (this.id) {
      this.http.get<Service>(`${this.apiBaseUrl}/${this.id}`).subscribe((service) => {
        if (service) {
          this.service = service;
        }
      }, (err) => {
        console.log('service-detail-dialog.component/ngOninit', err);
      }, () => {
        if (!this.service) {
          this.service = new Service();
        }

        this.initForm();
      });
    } else {
      this.service = new Service();
      this.initForm();
    }
  }

  /*
  ; Params: none
  ; Response: none
  ; Description: initialize the form
  */
  initForm() {
    this.form.controls.description.setValue(this.service.description);
    this.form.controls.price.setValue(this.service.price);
  }

  /*
  ; Params: none
  ; Response: none
  ; Description: close the dialog box
  */
  cancel() {
    this.dialogRef.close(null);
  }

  /*
  ; Params: none
  ; Response: none
  ; Description: if the form is valid save the service
  */
  save() {
    if (this.form.valid) {
      // update
      if (this.service._id) {
        this.http.put<Service>(`${this.apiBaseUrl}/${this.service._id}`, {
          description: this.form.controls.description.value,
          price: this.form.controls.price.value
        })
          .subscribe((res) => {
            if (res) {
              // close the dialog and return the updated service
              this.dialogRef.close(res);
            }
          }, (err) => {
            console.log('service-detail-dialog.component/save', err);
          });
      } else {
        // create
        this.http.post<Service>(`${this.apiBaseUrl}/`, {
          description: this.form.controls.description.value,
          price: this.form.controls.price.value
        })
          .subscribe((res) => {
            if (res) {
              // close the dialog and return the new service
              this.dialogRef.close(res);
            }
          }, (err) => {
            console.log('service-detail-dialog.component/save', err);
          });

      }


    }
  }

}
