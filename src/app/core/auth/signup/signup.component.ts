import { NotificationService } from './../../../shared/services/notification.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit{

  signUpForm: FormGroup;

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private notificationService: NotificationService
    ) { }

  ngOnInit() {
    this.signUpForm = new FormGroup({
      inputFirstName: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      inputLastname: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      inputEmail: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]),
      inputPassword: new FormControl('', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')])
    })
  }

  onSignUp() {
    if (this.signUpForm) {
      this.authService.signUpWithEmailAndPassword(this.signUpForm.value)
        .catch(err => {
          this.notificationService.warn(err.message);
          console.log(err);
        })
    }
  }

  signUpWithGoolge() {
    this.authService.signWithGoogle()
      .catch(err => {
        this.notificationService.warn(err.message);
        console.log(err);
      })
  }

  openLoginDialog() {
    this.dialog.open(LoginComponent);
  }

}
