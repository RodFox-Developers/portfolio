import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-funds-dialog',
  templateUrl: './funds-dialog.component.html',
  styleUrls: ['./funds-dialog.component.scss']
})
export class FundsDialogComponent implements OnInit {

  fundsForm: FormGroup;

  constructor() { }

  ngOnInit(): void {
    this.fundsForm = new FormGroup({
      $key: new FormControl(null),
      'category': new FormControl(null, Validators.required),
      'funds': new FormControl(null, Validators.required)
    })
  }

  onSubmit() {

  }

}
