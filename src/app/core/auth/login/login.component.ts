import { NotificationService } from './../../../shared/services/notification.service';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private notificationService: NotificationService
    ) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      inputEmail: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]),
      inputPassword: new FormControl('', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')])
    })
  }

  onSignIn() {
    if (this.loginForm) {
      this.authService.signInWithEmailAndPassword(this.loginForm.value)
        .catch(err => {
          this.notificationService.warn(err.message);
          console.log(err);
        })
    }
  }

  signInWithGoolge() {
    this.authService.signWithGoogle()
      .catch(err => {
        this.notificationService.warn(err.message);
        console.log(err);
      })
  }

  openSignupDialog() {
    this.dialog.open(SignupComponent);
  }

}
