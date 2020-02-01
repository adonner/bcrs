import { UserSecurityQuestion } from './user-security-question.model';

/*
============================================
; Title: user.model
; Author: Troy Martin
; Date: 01/15/2020
; Modified By: Troy Martin
; Description: Model of user
;===========================================
*/
export class User {
  id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  role: string;
  dateCreated: string;
  dateModified: string;
  SecurityQuestions: UserSecurityQuestion[];
}
