/*
============================================
; Title: service-list.component
; Author: Troy Martin
; Date: 01/25/2020
; Modified By: Troy Martin
; Description: Service List
;===========================================
*/
// imports from angular and our custom components
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from 'src/app/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ServiceDetailDialogComponent } from 'src/app/dialogs/service-detail-dialog/service-detail-dialog.component';
import { Service } from 'src/app/models/service.model';

@Component({
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent implements OnInit {
  // declare and set the default base url for the http service calls
  apiBaseUrl = `${environment.baseUrl}/api/services`;
  services: Service[] = [];

  // this list is required for the material table to render correctly
  displayedColumns: string[] = [
    'description',
    'price',
    'functions'
  ];

  /*
  ; Params: none
  ; Response: none
  ; Description: default constructor
  */
  constructor(private http: HttpClient, private dialog: MatDialog) {
    this.getServiceList();
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
  ; Description: add a new user
  */
  addService(): void {
    // declare and create the material dialog
    const dialogRef = this.dialog.open(ServiceDetailDialogComponent, {
      width: '40%', // options to control height and width of dialog
      disableClose: true, // the user cannot click in the overlay to close
      // pass the title and message to the dialog
      data: { id: null }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // the service was updated refresh the array
        this.getServiceList();
      }
      // else the canceled nothing to do here
    });
  }

  /*
  ; Params: id: string
  ; Response: none
  ; Description: edit an existing service
  */
  editService(id: string): void {
    // declare and create the material dialog
    const dialogRef = this.dialog.open(ServiceDetailDialogComponent, {
      width: '40%', // options to control height and width of dialog
      disableClose: true, // the user cannot click in the overlay to close
      // pass the title and message to the dialog
      data: { id }
    });

    dialogRef.afterClosed().subscribe((result: Service) => {
      if (result) {
        // the user was updated need to replace them in the array
        this.services.forEach((u) => {
          if (u._id === result._id) {
            u.description = result.description;
            u.price = result.price;
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
  deleteService(id: string): void {
    // find the user to delete
    const service = this.services.find(x => {
      // match the value with the service id
      return x._id === id;
    });

    // declare and create the material dialog
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '40%', // options to control height and width of dialog
      disableClose: true, // the user cannot click in the overlay to close
      // pass the title and message to the dialog
      data: {
        dialogTitle: 'Delete service',
        message: `Delete service ${service.description}`
      }
    });

    // subscribe to the after closed event
    dialogRef.afterClosed().subscribe((result: Service) => {
      // if true delete the user from the db
      if (result) {
        // soft delete the user from the database
        this.http.delete(`${this.apiBaseUrl}/${id}`).subscribe(
          (disabledService: any) => {
            if (disabledService && disabledService.isDisabled) {
              // filter the user from the existing list to save trip to server
              this.services = this.services.filter(x => {
                // match the value with the user id
                return x._id !== id;
              });
            }
          },
          err => {
            // log the error to the console
            console.log('service-list.component/deleteService', err);
          },
          () => {
            // log complete to the console
            console.log('service-list.component/deleteService', 'delete service is complete');
          }
        );
      }
    });
  }

  /*
  ; Params: none
  ; Response: none
  ; Description: Gets a list of all services to display
  */
  getServiceList() {
    this.http.get<Service[]>(`${this.apiBaseUrl}/`).subscribe((services) => {
      if (services) {
        this.services = services;
      } else {
        this.services = [];
      }

    }, (err) => {
      console.log('service-list.component/getServiceList', err);
    });

  }

}
