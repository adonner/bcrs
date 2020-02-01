/*
============================================
; Title: confirmation-dialog.component
; Author: Troy Martin
; Date: 01/11/2020
; Modified By: Troy Martin
; Description: Generic confirmation dialog
;===========================================
*/

// imports from angular core
import { Component, OnInit, Inject } from '@angular/core';
// imports from the material package
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// import our custom dialog data
import { ConfirmationDialogData } from '../../models/confirmation-dialog-data.model';

// declare the component
@Component({
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
// declare and export the component class
export class ConfirmationDialogComponent implements OnInit {
  // declare a title variable for the dialog
  dialogTitle: string;
  // declare a message variable for the dialog
  message: string;

  /*
  ; Params: none
  ; Response: none
  ; Description: default constructor
  */
  constructor(
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData
  ) {
    // set the variables based on the injected data
    this.dialogTitle = data.dialogTitle;
    this.message = data.message;
  }

  /*
  ; Params: none
  ; Response: none
  ; Description: initialize the component
  */
  ngOnInit() {}

  /*
  ; Params: result: boolean
  ; Response: none
  ; Description: close the dialog and return the result
  */
  close(result: boolean) {
    this.dialogRef.close(result);
  }
}
