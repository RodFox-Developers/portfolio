import { HoldingsTable } from './../../models/holdings-table.interface';
import { HoldingsService } from './../../services/holdings.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { map, take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-holdings-table',
  templateUrl: './holdings-table.component.html',
  styleUrls: ['./holdings-table.component.scss']
})
export class HoldingsTableComponent implements OnInit, OnDestroy {

  /* dataTableSource: HoldingsTable[] = []; */
  displayedColumns: string[] = ['symbol', 'category', 'price', 'units', 'avgOpenPrice', 'invested', 'profitLoss', 'profitLossPercentage', 'totalValue'];
  dataSource: MatTableDataSource<HoldingsTable>;

  subscription: Subscription;

  constructor(private holdingsService: HoldingsService) {}

  ngOnInit() {
    this.subscription = this.holdingsService.getAssetsList().subscribe(a => {
      this.dataSource = new MatTableDataSource<HoldingsTable>(a);
      console.log(a);
    });
  }

  ngOnDestroy() {
    /* this.subscription.unsubscribe(); */
  }
}
