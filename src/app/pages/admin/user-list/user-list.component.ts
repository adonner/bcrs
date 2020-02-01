/*
============================================
; Title: user-list.component.ts
; Author: Troy Martin
; Date: 12 January 2020
; Modified By: Troy Martin
; Description: user-list.component.ts
;===========================================
*/

// Start Program

// Import the Modules
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { UserDetailDialogComponent } from 'src/app/dialogs/user-detail-dialog/user-detail-dialog.component';
@Component({
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
// Export the class
export class UserListComponent implements OnInit {
  // declare and set the default base url for the http service calls
  apiBaseUrl = `${environment.baseUrl}/api/users`;

  // declare an array of users
  users = [];

  // this list is required for the material table to render correctly
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'username',
    'functions'
  ];

  /*
  ; Params: none
  ; Response: none
  ; Description: default constructor
  */
  constructor(private http: HttpClient, private dialog: MatDialog) {
    // get all users that are not disabled
    this.getUserList();
  }



  /*
  ; Params: none
  ; Response: none
  ; Description: initialize the component
  */
  ngOnInit() {}

  /*
  ; Params: none
  ; Response: none
  ; Description: add a new user
  */
  addUser(): void {
    // declare and create the material dialog
    const dialogRef = this.dialog.open(UserDetailDialogComponent, {
      width: '60%', // options to control height and width of dialog
      disableClose: true, // the user cannot click in the overlay to close
      // pass the title and message to the dialog
      data: { id: null }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // the user was updated need to replace them in the array
       this.getUserList();
      }
      // else the canceled nothing to do here
    });
  }

  /*
  ; Params: id: string
  ; Response: none
  ; Description: edit an existing user
  */
  editUser(id: string): void {
    // declare and create the material dialog
    const dialogRef = this.dialog.open(UserDetailDialogComponent, {
      width: '60%', // options to control height and width of dialog
      disableClose: true, // the user cannot click in the overlay to close
      // pass the title and message to the dialog
      data: { id }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // the user was updated need to replace them in the array
        this.users.forEach((u) => {
          if (u._id === result.id) {
            u.user = result.username;
            u.firstName = result.firstName;
            u.lastName = result.lastName;
          }
        });
      }
      // else the canceled nothing to do here
    });
  }

  /*
  ; Params: id: string
  ; Response: none
  ; Description: delete an existing user
  */
  deleteUser(id: string): void {
    // find the user to delete
    const user = this.users.find(x => {
      // match the value with the user id
      return x._id === id;
    });

    // declare and create the material dialog
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '40%', // options to control height and width of dialog
      disableClose: true, // the user cannot click in the overlay to close
      // pass the title and message to the dialog
      data: {
        dialogTitle: 'Delete user',
        message: `Delete user ${user.username}`
      }
    });

    // subscribe to the after closed event
    dialogRef.afterClosed().subscribe(result => {
      // if true delete the user from the db
      if (result) {
        // soft delete the user from the database
        this.http.delete(`${this.apiBaseUrl}/${id}`).subscribe(
          (disabledUser: any) => {
            if (disabledUser && disabledUser.isDisabled) {
              // filter the user from the existing list to save trip to server
              this.users = this.users.filter(x => {
                // match the value with the user id
                return x._id !== id;
              });
            }
          },
          err => {
            // log the error to the console
            console.log('user-list.component/deleteUser', err);
          },
          () => {
            // log complete to the console
            console.log('user-list.component/deleteUser', 'delete user is complete');
          }
        );
      }
    });
  }

  private getUserList() {
    this.http.get(this.apiBaseUrl).subscribe(
      // if there are users set the users variable on the component
      (users: []) => {
        console.log('user-list.component/getUserList', users);
        this.users = users;
      }, err => {
        // display the error in the log
        console.log('user-list.component/getUserList', err);
      }, () => {
        // the subscription completed
        console.log('user-list.component/getUserList', 'complete');
      });
  }
}

// End Program
