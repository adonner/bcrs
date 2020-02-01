/*
============================================
; Title: app.module
; Author: Richard Krasso
; Date: 01/06/2020
; Modified By:
; Description: App module
;===========================================
*/
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutes } from './app.routing';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BaseLayoutComponent } from './shared/base-layout/base-layout.component';
import { AuthLayoutComponent } from './shared/auth-layout/auth-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatCardModule,
  MatPaginatorModule,
  MatFormFieldModule,
  MatInputModule,
  MatMenuModule,
  MatDialogModule,
  MatStepperModule,
  MatSnackBarModule,
  MatChipsModule,
  MatIconModule,
  MatTableModule,
  MatButtonModule,
  MatToolbarModule,
  MatButtonToggleModule,
  MatTabsModule
} from '@angular/material';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatListModule} from '@angular/material/list';
import { SessionGuard } from './shared/guards/session.guard';
import { SessionService } from './shared/services/session.service';
import { CookieService } from 'ngx-cookie-service';
import { SecurityQuestionService } from './shared/services/security-question.service';
import { SecurityQuestionsListComponent } from './pages/admin/security-questions-list/security-questions-list.component';
import { SigninComponent } from './pages/signin/signin.component';
import { SecurityQuestionCreateDialogComponent } from './dialogs/security-question-create-dialog/security-question-create-dialog.component';
import { SecurityQuestionEditDialogComponent } from './dialogs/security-question-edit-dialog/security-question-edit-dialog.component';
import { ConfirmationDialogComponent } from './dialogs/confirmation-dialog/confirmation-dialog.component';
import { UserListComponent } from './pages/admin/user-list/user-list.component';
import { UserDetailDialogComponent } from './dialogs/user-detail-dialog/user-detail-dialog.component';
import { UserRegistrationDialogComponent } from './dialogs/user-registration-dialog/user-registration-dialog.component';
import { ForgotPasswordDialogComponent } from './dialogs/forgot-password-dialog/forgot-password-dialog.component';
import { ServerErrorComponent } from './pages/server-error/server-error.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ErrorInterceptor } from './shared/interceptors/error.interceptor';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { ServiceListComponent } from './pages/admin/service-list/service-list.component';
import { ServiceDetailDialogComponent } from './dialogs/service-detail-dialog/service-detail-dialog.component';
import { PurchasesGraphComponent } from './pages/admin/purchases-graph/purchases-graph.component';
import { ChartModule } from 'primeng/chart';
import { RoleGuard } from './shared/guards/role.guard';
import { ServiceRepairComponent } from './pages/service-repair/service-repair.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { InvoiceSummaryDialogComponent } from './dialogs/invoice-summary-dialog/invoice-summary-dialog.component';
import { RoleListComponent } from './pages/admin/role-list/role-list.component';
import { RoleDetailDialogComponent } from './dialogs/role-detail-dialog/role-detail-dialog.component';

// options required by ngx-mask
export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  declarations: [
    AppComponent,
    BaseLayoutComponent,
    AuthLayoutComponent,
    HomeComponent,
    SigninComponent,
    SecurityQuestionsListComponent,
    SecurityQuestionCreateDialogComponent,
    SecurityQuestionEditDialogComponent,
    ConfirmationDialogComponent,
    UserListComponent,
    UserDetailDialogComponent,
    UserRegistrationDialogComponent,
    ForgotPasswordDialogComponent,
    ServerErrorComponent,
    FooterComponent,
    NotFoundComponent,
    ContactUsComponent,
    AboutUsComponent,
    ServiceListComponent,
    ServiceDetailDialogComponent,
    PurchasesGraphComponent,
    ServiceRepairComponent,
    UserProfileComponent,
    InvoiceSummaryDialogComponent,
    RoleListComponent,
    RoleDetailDialogComponent,
  ],
  imports: [
    NgxMaskModule.forRoot(options),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(AppRoutes, {
      useHash: true,
      enableTracing: false,
      scrollPositionRestoration: 'enabled'
    }),
    FlexLayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatCardModule,
    MatPaginatorModule,
    MatMenuModule,
    MatDialogModule,
    MatStepperModule,
    MatSnackBarModule,
    MatChipsModule,
    MatListModule,
    ChartModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatTabsModule
  ],
  providers: [
    SessionGuard,
    CookieService,
    SessionService,
    SecurityQuestionService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    RoleGuard
  ],
  entryComponents: [
    SecurityQuestionCreateDialogComponent,
    SecurityQuestionEditDialogComponent,
    ConfirmationDialogComponent,
    UserDetailDialogComponent,
    UserRegistrationDialogComponent,
    ForgotPasswordDialogComponent,
    ServiceDetailDialogComponent,
    InvoiceSummaryDialogComponent,
    RoleDetailDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
