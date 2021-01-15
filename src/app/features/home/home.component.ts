import { Router } from '@angular/router';
import { AuthService } from './../../core/auth/services/auth.service';
import { SignupComponent } from './../../core/auth/signup/signup.component';
import { LoginComponent } from './../../core/auth/login/login.component';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  userSubscription: Subscription;

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router
    ) {
      this.userSubscription = this.authService.user$.subscribe(user => {
        if (user) {
          this.router.navigate(['nav']);
        }
      });
    }

  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  openLoginDialog() {
    this.dialog.open(LoginComponent);
  }

  openSignupDialog() {
    this.dialog.open(SignupComponent);
  }



}
