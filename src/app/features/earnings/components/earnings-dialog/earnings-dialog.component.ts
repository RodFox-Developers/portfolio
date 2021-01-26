import { EarningsService } from './../../services/earnings.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-earnings-dialog',
  templateUrl: './earnings-dialog.component.html',
  styleUrls: ['./earnings-dialog.component.scss']
})
export class EarningsDialogComponent implements OnInit {

  earningsForm: FormGroup;

  constructor(
    private earningsService: EarningsService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.earningsForm = this.earningsService.earningsForm;
  }

  onSubmit() {
    if (this.earningsForm.invalid) return
    if (this.earningsService.earningsForm.get('$key').value) {
      this.earningsService.updateEarningsList(this.earningsService.earningsForm.value);
      this.notificationService.success(':: Submitted successfully');
    } else {
      this.earningsService.setEarningsList(this.earningsForm.value);
      this.notificationService.success(':: Submitted successfully');
    }
    this.earningsForm.reset();
  }

  eventHandler(event) {
    if (event.keyCode === 32) {
      event.preventDefault();
    }
  }

  eventNumbers(event) {
    if (event.key == "-") {
      event.preventDefault();
      return false;
    }
  }

}
