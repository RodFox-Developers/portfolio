import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-assets-dialog',
  templateUrl: './add-assets-dialog.component.html',
  styleUrls: ['./add-assets-dialog.component.scss']
})
export class AddAssetsDialogComponent implements OnInit {

  categories: string[] = ['Cash', 'Bonds', 'Stocks', 'Commodities'];
  assetsForm: FormGroup;

  constructor() { }

  ngOnInit() {
    this.assetsForm = new FormGroup({
      'symbol': new FormControl(null, Validators.required),
      'category': new FormControl(null, Validators.required),
      'units': new FormControl(null, Validators.required),
      'avgOpenPrice': new FormControl(null, Validators.required),
    })
  }

  onSubmit() {
    if (this.assetsForm.invalid) return
    console.log(this,this.assetsForm.value);
    this.assetsForm.reset();
  }

}
