import { SignupComponent } from './../../core/auth/signup/signup.component';
import { LoginComponent } from './../../core/auth/login/login.component';
import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openLoginDialog() {
    this.dialog.open(LoginComponent);
  }

  openSignupDialog() {
    this.dialog.open(SignupComponent);
  }

}
