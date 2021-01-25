import { PerformanceService } from './../../services/performance.service';
import { EarningsService } from './../../../features/earnings/services/earnings.service';
import { BalanceService } from './../../services/balance.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { HoldingsService } from 'src/app/features/holdings/services/holdings.service';
import { map, mergeMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit, OnDestroy {

  userSubscription: Subscription;

  depositWithdrawBanalce: number = 0;
  totalEarnings: number = 0;
  totalInvested: number = 0;
  totalProfitLoss: number = 0;
  totalProfitLossPercent: number = 0;

  constructor(
    private holdingsService: HoldingsService,
    private authService: AuthService,
    private balanceService: BalanceService,
    private earningsService: EarningsService,
    private performanceService: PerformanceService
  ) { }

  ngOnInit() {
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
          this.holdingsService.updateAssetsList(assets);
        })
      });

      this.performanceService.getPerformance(user.uid);

      this.holdingsService.getAssetsList(user.uid)
        .pipe(take(1))
        .subscribe(a => {
          a.map(action => {
            this.totalInvested = a.map(t => t.units * t.avgOpenPrice).reduce((acc, value) => acc + value, 0);
            this.totalProfitLoss = a.map(t => (t.units * t.price) - (t.units * t.avgOpenPrice)).reduce((acc, value) => acc + value, 0);
            this.totalProfitLossPercent = this.totalProfitLoss / this.totalInvested;
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

          let accountValue = this.depositWithdrawBanalce + this.totalEarnings + this.totalProfitLoss;
          this.performanceService.setPerformance(this.totalProfitLoss, this.totalProfitLossPercent, accountValue);
        });
    })
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

}
