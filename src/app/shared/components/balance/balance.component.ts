import { BalanceService } from './../../services/balance.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { HoldingsService } from 'src/app/features/holdings/services/holdings.service';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit, OnDestroy {

  userSubscription: Subscription;

  cashBalance: number;
  totalInvested: number;
  totalProfitLoss: number;
  totalProfitLossPercent: number;
  totalValue: number;

  constructor(
    private holdingsService: HoldingsService,
    private authService: AuthService,
    private balanceService: BalanceService
  ) { }

  ngOnInit() {
    this.userSubscription = this.authService.user$.subscribe(user => {

      this.holdingsService.getAssetsList(user.uid)
      .subscribe(a => {
        a.map(action => {
          this.holdingsService.getStockPrice(action.symbol).subscribe(data => {
            action.price = data;
            this.totalInvested = a.map(t => t.units * t.avgOpenPrice).reduce((acc, value) => acc + value, 0);
            this.totalProfitLoss = a.map(t => (t.units * t.price) - (t.units * t.avgOpenPrice)).reduce((acc, value) => acc + value, 0);
            this.totalProfitLossPercent = this.totalProfitLoss / this.totalInvested;
            this.totalValue = a.map(t => t.units * t.price).reduce((acc, value) => acc + value, 0);
          });
        })
      });

      this.balanceService.getFunds(user.uid)
      .subscribe(a => {
        a.map(action => {
            this.cashBalance = action.funds;
        })
      });
    })
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

}
