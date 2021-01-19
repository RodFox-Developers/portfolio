import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { HoldingsService } from '../../services/holdings.service';

@Component({
  selector: 'app-buy-sell-dialog',
  templateUrl: './buy-sell-dialog.component.html',
  styleUrls: ['./buy-sell-dialog.component.scss']
})
export class BuySellDialogComponent implements OnInit {

  buySellForm: FormGroup;

  constructor(
    private notificationService: NotificationService,
    private holdingsService: HoldingsService
  ) { }

  ngOnInit(): void {
    this.buySellForm = new FormGroup({
      $key: new FormControl(null),
      'symbol': new FormControl(null, Validators.required),
      'category': new FormControl(null, Validators.required),
      'units': new FormControl(null, Validators.required),
      'avgOpenPrice': new FormControl(null, Validators.required)
    })
  }

  onSubmit() {
    if (this.buySellForm.invalid) return
    if (this.holdingsService.form.get('$key').value) {
      this.holdingsService.updateAssetsList(this.holdingsService.form.value);
    } else {
      this.holdingsService.setAssetsList(this.buySellForm.value);
    }

    this.buySellForm.reset();
    this.notificationService.success(':: Submitted successfully')
  }

}
