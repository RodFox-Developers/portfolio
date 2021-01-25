import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { BalanceService } from 'src/app/shared/services/balance.service';
import { PerformanceService } from 'src/app/shared/services/performance.service';
import { EarningsService } from '../earnings/services/earnings.service';
import { HoldingsService } from '../holdings/services/holdings.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit, OnDestroy {

/*   userSubscription: Subscription; */

  constructor(
    public authService: AuthService,
    private holdingsService: HoldingsService,
    private earningsService: EarningsService,
    private balanceService: BalanceService,
    private performanceService: PerformanceService) { }

  ngOnInit(): void {

  }

  ngOnDestroy() {
    /* this.userSubscription.unsubscribe(); */
  }

}
