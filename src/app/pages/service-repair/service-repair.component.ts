/*
============================================
; Title: service-repair.component
; Author: Adam Donner
; Date: 01/25/2020
; Modified By: Adam Donner
; Description: Service repair component
;===========================================
*/
// Start Program

// Import the Modules


import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Service } from 'src/app/models/service.model';
import { SessionService } from 'src/app/shared/services/session.service';
import { InvoiceSummaryDialogComponent } from 'src/app/dialogs/invoice-summary-dialog/invoice-summary-dialog.component';


@Component({
  selector: 'app-service-repair',
  templateUrl: './service-repair.component.html',
  styleUrls: ['./service-repair.component.css']
})
export class ServiceRepairComponent implements OnInit {
  form: FormGroup;
  username: string;
  serviceOfferings: Service[];
  get serviceControls() {
    return this.form.controls.services as FormArray;
  }

  constructor(
    private http: HttpClient,
    private sessionService: SessionService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router) {

    // get the username
    this.username = this.sessionService.getUsername();
  }


  ngOnInit() {

    this.form = this.fb.group({
      parts: [null, Validators.compose([Validators.required])],
      labor: [null, Validators.compose([Validators.required])],
      alternator: [null, null],
      services: new FormArray([])
    });

    // retrieve services from MongoDB
    this.http.get<Service[]>(`/api/services/`).subscribe((services) => {
      this.serviceOfferings = services;
    }, (err) => {
      console.log('service-repair.component/ngOnInit', err);
    }, () => {
      // create the form controls mapping the product into a control
      const formArray = this.form.controls.services as FormArray;
      this.serviceOfferings.forEach((x) => formArray.push(new FormControl(false)));
    });
  }

  submit() {
    console.log('service-repair.component/submit', this.form);
    let lineItemTotal = 0;

    const lineItems = [];
    // Determine and calculate selected services
    this.serviceControls.controls.forEach((x, i) => {
      if (x.value) {
        const service = this.serviceOfferings[i];
        const price = Number(service.price);
        lineItemTotal += price;
        lineItems.push({
          service: {
            description: service.description,
            price: service.price
          },
          itemTotal: service.price,
          quantity: 1
        });
      }
    });
    // declare and compute the parts amount
    const partsAmount = Number(this.form.controls.parts.value as string);
    // declare and computer the labor amount
    const laborAmount = Number(this.form.controls.labor.value as string) * 50;
    // declare and compute the invoice total
    const total = partsAmount + laborAmount + lineItemTotal;

    // declare invoice object
    const invoice = {
      lineItems,
      partsAmount,
      laborAmount,
      lineItemTotal,
      total,
      username: this.username,
      orderDate: new Date()
    };

    console.log('service-repair.component/submit', invoice);

    const dialogRef = this.dialog.open(InvoiceSummaryDialogComponent, {
      data: {
        invoice
      },
      disableClose: true,
      width: '800px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        console.log('service-repair.component/submit', 'Invoice Saved');
        this.http.post('/api/invoices/' + invoice.username, invoice)
        .subscribe(res => {
          this.router.navigate(['/']);
        }, err => {
          console.log('service-repair.component/submit', err);
        });
      }
    });

  }
}
// end program
