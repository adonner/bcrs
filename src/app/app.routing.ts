/*
============================================
; Title: app.routing
; Author: Richard Krasso
; Date: 01/09/2020
; Modified By:
; Description: Routing
;===========================================
*/
import {Routes} from '@angular/router';
import {BaseLayoutComponent} from './shared/base-layout/base-layout.component';
import {HomeComponent} from './pages/home/home.component';
import { SessionGuard } from './shared/guards/session.guard';
import {SigninComponent} from './pages/signin/signin.component';
import { AuthLayoutComponent } from './shared/auth-layout/auth-layout.component';
import { SecurityQuestionsListComponent } from './pages/admin/security-questions-list/security-questions-list.component';
import { UserListComponent } from './pages/admin/user-list/user-list.component';
import { ServerErrorComponent } from './pages/server-error/server-error.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { ServiceListComponent } from './pages/admin/service-list/service-list.component';
import { PurchasesGraphComponent } from './pages/admin/purchases-graph/purchases-graph.component';
import { RoleGuard } from './shared/guards/role.guard';
import { ServiceRepairComponent } from './pages/service-repair/service-repair.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { RoleListComponent } from './pages/admin/role-list/role-list.component';

export const AppRoutes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'admin/security-questions',
        component: SecurityQuestionsListComponent,
        canActivate: [RoleGuard]
      },
      {
        path: 'admin/users',
        component: UserListComponent,
        canActivate: [RoleGuard]
      },
      {
        path: 'admin/services',
        component: ServiceListComponent,
        canActivate: [RoleGuard]
      },
      {
        path: 'admin/purchases-graph',
        component: PurchasesGraphComponent,
        canActivate: [RoleGuard]
      },
      {
        path: 'admin/roles',
        component: RoleListComponent,
        canActivate: [RoleGuard]
      },
      {
        path: 'contactus',
        component: ContactUsComponent
      },
      {
        path: 'aboutus',
        component: AboutUsComponent
      },
      {
        path: 'services',
        component: ServiceRepairComponent
      },
      {
        path: 'profile',
        component: UserProfileComponent
      }
    ],
    // use the can activate child to secure the routes
    canActivateChild: [SessionGuard]
  },
  {
    path: 'session',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'signin',
        component: SigninComponent
      },
      {
        path: '500',
        component: ServerErrorComponent
      },
      {
        path: '404',
        component: NotFoundComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'session/404'
  }
];
