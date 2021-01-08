import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit{

  signUpForm: FormGroup;

  ngOnInit() {
    this.signUpForm = new FormGroup({
      inputFirstName: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      inputLastname: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      inputEmail: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]),
      inputPassword: new FormControl('', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')])
    })
  }

  onSignUp() {
    console.log(this.signUpForm);
  }

}
