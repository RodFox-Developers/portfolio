import { NotificationService } from './../../../../shared/services/notification.service';
import { HoldingsService } from './../../services/holdings.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-assets-dialog',
  templateUrl: './add-assets-dialog.component.html',
  styleUrls: ['./add-assets-dialog.component.scss']
})
export class AddAssetsDialogComponent implements OnInit {

  assetsForm: FormGroup;

  constructor(
    private holdingsService: HoldingsService,
    private notificationService: NotificationService
    ) { }

  ngOnInit() {
    this.assetsForm = this.holdingsService.form;
  }

  onSubmit() {
    if (this.assetsForm.invalid) return
    if (this.holdingsService.form.get('$key').value) {
      this.holdingsService.updateAssetsList(this.holdingsService.form.value);
    } else {
      this.holdingsService.setAssetsList(this.assetsForm.value);
    }

    this.assetsForm.reset();
    this.notificationService.success(':: Submitted successfully')
  }



}
