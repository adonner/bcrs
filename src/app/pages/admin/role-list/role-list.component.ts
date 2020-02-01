/*
============================================
; Title: role-list.component
; Author: Troy Martin
; Date: 01/25/2019
; Modified By: Troy Martin
; Description: Role List
;===========================================
*/
// import angular and our custom components
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Role } from 'src/app/models/role.model';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { RoleDetailDialogComponent } from 'src/app/dialogs/role-detail-dialog/role-detail-dialog.component';
import { ConfirmationDialogComponent } from 'src/app/dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css']
})
export class RoleListComponent implements OnInit {
  // declare and set the default base url for the http role calls
  apiBaseUrl = `${environment.baseUrl}/api/roles`;
  roles: Role[] = [];
  // this list is required for the material table to render correctly
  displayedColumns: string[] = [
    'name',
    'functions'
  ];

  /*
  ; Params: none
  ; Response: none
  ; Description: default constructor
  */
  constructor(private http: HttpClient, private dialog: MatDialog) {
    this.getRoleList();
   }

   /*
   ; Params: none
   ; Response: none
   ; Description: initialize the component
   */
  ngOnInit() {
  }

  /*
  ; Params: none
  ; Response: none
  ; Description: add a new role
  */
  addRole(): void {
    // declare and create the material dialog
    const dialogRef = this.dialog.open(RoleDetailDialogComponent, {
      width: '40%', // options to control height and width of dialog
      disableClose: true, // the user cannot click in the overlay to close
      // pass a null id to the dialog to start an add
      data: { id: null }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // the role was updated refresh the array
        this.getRoleList();
      }
      // else the canceled nothing to do here
    });
  }

  /*
  ; Params: id: string
  ; Response: none
  ; Description: edit an existing role
  */
  editRole(id: string): void {
    // declare and create the material dialog
    const dialogRef = this.dialog.open(RoleDetailDialogComponent, {
      width: '40%', // options to control height and width of dialog
      disableClose: true, // the user cannot click in the overlay to close
      // pass the title and message to the dialog
      data: { id }
    });

    dialogRef.afterClosed().subscribe((result: Role) => {
      if (result) {
        // the role was updated need to replace them in the array
        this.roles.forEach((u) => {
          if (u._id === result._id) {
            u.name = result.name;
          }
        });
      }
      // else the canceled nothing to do here
    });
  }

  /*
  ; Params: id: string
  ; Response: none
  ; Description: delete an existing role
  */
  deleteRole(id: string): void {
    // find the role to delete
    const role = this.roles.find(x => {
      // match the value with the role id
      return x._id === id;
    });

    // declare and create the material dialog
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '40%', // options to control height and width of dialog
      disableClose: true, // the user cannot click in the overlay to close
      // pass the title and message to the dialog
      data: {
        dialogTitle: 'Delete role',
        message: `Delete role ${role.name}`
      }
    });

    // subscribe to the after closed event
    dialogRef.afterClosed().subscribe((result) => {
      // if true delete the role from the db
      if (result) {
        // soft delete the role from the database
        this.http.delete(`${this.apiBaseUrl}/${id}`).subscribe(
          (disabledRole: any) => {
            if (disabledRole && disabledRole.isDisabled) {
              // filter the role from the existing list to save trip to server
              this.roles = this.roles.filter(x => {
                // match the value with the role id
                return x._id !== id;
              });
            }
          },
          err => {
            // log the error to the console
            console.log('purchases-graph.component/deleteRole', err);
          },
          () => {
            // log complete to the console
            console.log('purchases-graph.component/deleteRole', 'delete role is complete');
          }
        );
      }
    });
  }

  /*
  ; Params: none
  ; Response: none
  ; Description: Gets a list of all roles to display
  */
  getRoleList() {
    this.http.get<Role[]>(`${this.apiBaseUrl}/`).subscribe((roles) => {
      if (roles) {
        this.roles = roles;
      } else {
        this.roles = [];
      }

    }, (err) => {
      console.log('purchases-graph.component/getRoleList', err);
    });

  }

}
