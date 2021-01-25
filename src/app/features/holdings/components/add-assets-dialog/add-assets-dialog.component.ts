import { NotificationService } from './../../../../shared/services/notification.service';
import { HoldingsService } from './../../services/holdings.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EarningsService } from 'src/app/features/earnings/services/earnings.service';
import { BalanceService } from 'src/app/shared/services/balance.service';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { map, mergeMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-add-assets-dialog',
  templateUrl: './add-assets-dialog.component.html',
  styleUrls: ['./add-assets-dialog.component.scss']
})
export class AddAssetsDialogComponent implements OnInit, OnDestroy {

  assetsForm: FormGroup;

  depositWithdrawBanalce: number = 0;
  totalInvested: number = 0;
  totalEarnings: number = 0;
  cashAvailable: number = 0;

  userSubscription: Subscription;

  constructor(
    private holdingsService: HoldingsService,
    private notificationService: NotificationService,
    private dialogService: DialogService,
    private router: Router,
    private earningsService: EarningsService,
    private balanceService: BalanceService,
    private authService: AuthService
    ) { }

  ngOnInit() {
    this.assetsForm = this.holdingsService.form;

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
          })
          this.cashAvailable = this.depositWithdrawBanalce + this.totalEarnings - this.totalInvested;
        });
    })
  }

  onSubmit() {
    if (this.assetsForm.invalid) return

    let addAssetValue = this.holdingsService.form.value.units * this.holdingsService.form.value.avgOpenPrice;
    let verifyCashAvailable: number = this.cashAvailable - addAssetValue;

    if (verifyCashAvailable >= 0) {
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
        this.userSubscription = this.authService.user$.subscribe(user => {
        this.holdingsService.getAssetsList(user.uid)
          .pipe(
            take(1),
            mergeMap(a => {
              return a.map(action => {
                return this.holdingsService.getStockPrice(action.symbol)
                  .pipe(
                    map(data => {
                      action.price = data;
                      return action;
                    })
                  )
              })
            })
          )
          .subscribe(res => {
            res.subscribe(assets => {
              this.holdingsService.initAssetsList(assets);
            })
          });
        });
      }
    } else {
      this.notificationService.warn(":: Sorry, you don't have enough funds");
    }

    this.assetsForm.reset();
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
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
