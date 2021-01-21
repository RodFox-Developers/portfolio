import { NotificationService } from './../../../../shared/services/notification.service';
import { HoldingsService } from './../../services/holdings.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-assets-dialog',
  templateUrl: './add-assets-dialog.component.html',
  styleUrls: ['./add-assets-dialog.component.scss']
})
export class AddAssetsDialogComponent implements OnInit {

  assetsForm: FormGroup;

  constructor(
    private holdingsService: HoldingsService,
    private notificationService: NotificationService,
    private dialogService: DialogService,
    private router: Router
    ) { }

  ngOnInit() {
    this.assetsForm = this.holdingsService.form;
  }

  onSubmit() {
    if (this.assetsForm.invalid) return
    if (this.holdingsService.form.get('$key').value) {
      if (this.assetsForm.value.units > 0) {
        this.holdingsService.updateAssetsList(this.holdingsService.form.value);
        this.notificationService.success(':: Submitted successfully');
        this.dialogService.openConfirmDialog('If you sold some units. Please update the earnings table!')
            .afterClosed().subscribe(res => {
              if (res) {
                this.router.navigate(['nav/earnings']);
              }
              return
            })
      } else {
        this.notificationService.warn("! Can't decrease to 0. plase 'Sell All'");
      }
    } else {
      this.holdingsService.setAssetsList(this.assetsForm.value);
      this.notificationService.success(':: Submitted successfully');
    }
    this.assetsForm.reset();
  }

  eventHandler(event) {
    if (event.keyCode === 32) {
      event.preventDefault();
    }
  }

  eventNumbers(event) {
    if(!((event.keyCode > 95 && event.keyCode < 106)
    || (event.keyCode > 47 && event.keyCode < 58)
    || event.keyCode == 8)) {
      return false;
    }
  }

}
