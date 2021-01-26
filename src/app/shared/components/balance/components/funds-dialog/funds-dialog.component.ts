import { EarningsService } from './../../../../../features/earnings/services/earnings.service';
import { HoldingsService } from 'src/app/features/holdings/services/holdings.service';
import { Subscription } from 'rxjs';
import { AuthService } from './../../../../../core/auth/services/auth.service';
import { BalanceService } from './../../../../services/balance.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-funds-dialog',
  templateUrl: './funds-dialog.component.html',
  styleUrls: ['./funds-dialog.component.scss']
})
export class FundsDialogComponent implements OnInit, OnDestroy {

  depositWithdrawBanalceKey;
  depositWithdrawBanalce: number = 0;
  totalInvested: number = 0;
  totalEarnings: number = 0;
  cashAvailable: number = 0;

  fundsForm: FormGroup;

  userSubscription: Subscription;

  constructor(
    private balanceService: BalanceService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private holdingsService: HoldingsService,
    private earningsService: EarningsService
  ) { }

  ngOnInit(): void {
    this.fundsForm = this.balanceService.form;
    this.userSubscription = this.authService.user$.subscribe(user => {
      this.holdingsService.getAssetsList(user.uid)
      .pipe(take(1))
      .subscribe(a => {
        a.map(action => {
          this.totalInvested = a.map(t => t.units * t.avgOpenPrice).reduce((acc, value) => acc + value, 0);
        })
      });

      this.earningsService.getEarningsList(user.uid)
        .subscribe(a => {
          this.totalEarnings = a.map(t => (t.closePrice * t.units) - (t.openPrice * t.units)).reduce((acc, value) => acc + value, 0);
        });

      this.balanceService.getFunds(user.uid)
        .subscribe(a => {
          a.map(action => {
            this.depositWithdrawBanalce = action.funds;
            this.depositWithdrawBanalceKey = action.$key
          })
          this.cashAvailable = this.depositWithdrawBanalce + this.totalEarnings - this.totalInvested;
        });
    })
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  onSubmit() {
    if (this.fundsForm.invalid) return
    let verifyCashAvailable: number = this.cashAvailable - this.fundsForm.value.funds;
    if (this.fundsForm.value.category == 'deposit') {
      let total: number = this.depositWithdrawBanalce + this.fundsForm.value.funds;
      if (this.depositWithdrawBanalce) {
        this.balanceService.updateFunds(total, this.depositWithdrawBanalceKey);
        this.notificationService.success(':: Submitted successfully')
      } else {
        this.balanceService.setFunds(this.fundsForm.value);
        this.notificationService.success(':: Submitted successfully')
      }
    } else if (this.fundsForm.value.category == 'withdraw' && this.depositWithdrawBanalce >= 0) {
      let total: number = this.depositWithdrawBanalce - this.fundsForm.value.funds;
      if (verifyCashAvailable >= 0) {
        this.balanceService.updateFunds(total, this.depositWithdrawBanalceKey);
        this.notificationService.success(':: Submitted successfully')
      } else {
        this.notificationService.warn(":: Sorry, you don't have enough funds")
      }
    }
    this.fundsForm.reset();
  }

  eventNumbers(event) {
    if (event.key == "-") {
      event.preventDefault();
      return false;
    }
  }
}

