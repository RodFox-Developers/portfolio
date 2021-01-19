import { Subscription } from 'rxjs';
import { AuthService } from './../../../../../core/auth/services/auth.service';
import { BalanceService } from './../../../../services/balance.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-funds-dialog',
  templateUrl: './funds-dialog.component.html',
  styleUrls: ['./funds-dialog.component.scss']
})
export class FundsDialogComponent implements OnInit, OnDestroy {

  cashBalanceFund;

  fundsForm: FormGroup;

  userSubscription: Subscription;

  constructor(
    private balanceService: BalanceService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.fundsForm = this.balanceService.form;
    this.userSubscription = this.authService.user$.subscribe(user => {
      this.balanceService.getFunds(user.uid)
      .subscribe(a => {
        a.map(action => {
            this.cashBalanceFund = action;
        })
      });
    })
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  onSubmit() {
    if (this.fundsForm.invalid) return
    if (this.fundsForm.value.category == 'deposit') {

      if (this.cashBalanceFund) {
        let total: number = this.cashBalanceFund.funds + this.fundsForm.value.funds;
        this.balanceService.updateFunds(total, this.cashBalanceFund.$key);
        this.notificationService.success(':: Submitted successfully')
      } else {
        this.balanceService.setFunds(this.fundsForm.value);
        this.notificationService.success(':: Submitted successfully')
      }

    } else if (this.fundsForm.value.category == 'withdraw' && this.cashBalanceFund.funds >= 0) {

      let total: number = this.cashBalanceFund.funds - this.fundsForm.value.funds;
      if (total >= 0) {
        this.balanceService.updateFunds(total, this.cashBalanceFund.$key);
        this.notificationService.success(':: Submitted successfully')
      } else {
        this.notificationService.warn(":: Sorry, you don't have enough funds")
      }
    }
    this.fundsForm.reset();
  }

}
