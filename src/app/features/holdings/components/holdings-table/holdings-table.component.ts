import { AuthService } from './../../../../core/auth/services/auth.service';
import { DialogService } from './../../../../shared/services/dialog.service';
import { NotificationService } from './../../../../shared/services/notification.service';
import { HoldingsTable } from './../../models/holdings-table.interface';
import { HoldingsService } from './../../services/holdings.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddAssetsDialogComponent } from '../add-assets-dialog/add-assets-dialog.component';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-holdings-table',
  templateUrl: './holdings-table.component.html',
  styleUrls: ['./holdings-table.component.scss']
})
export class HoldingsTableComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['symbol', 'category', 'price', 'units', 'avgOpenPrice', 'invested', 'profitLoss', 'profitLossPercentage', 'totalValue', 'actions'];
  dataSource: MatTableDataSource<HoldingsTable>;

  userSubscription: Subscription;

  totalInvested: number;
  totalProfitLoss: number;
  totalProfitLossPercent: number;
  totalValue: number;

  noData: boolean;

  constructor(
    private holdingsService: HoldingsService,
    public dialog: MatDialog,
    public notificationService: NotificationService,
    private dialogService: DialogService,
    private authService: AuthService
    ) {}

  ngOnInit() {
    this.userSubscription = this.authService.user$.subscribe(user => {
      this.holdingsService.getAssetsList(user.uid)
      .subscribe(a => {
        a.map(action => {
          this.holdingsService.getStockPrice(action.symbol).subscribe(data => {
            action.price = data;
            this.dataSource = new MatTableDataSource<HoldingsTable>(a);
            this.totalInvested = a.map(t => t.units * t.avgOpenPrice).reduce((acc, value) => acc + value, 0);
            this.totalProfitLoss = a.map(t => (t.units * t.price) - (t.units * t.avgOpenPrice)).reduce((acc, value) => acc + value, 0);
            this.totalProfitLossPercent = this.totalProfitLoss / this.totalInvested;
            this.totalValue = a.map(t => t.units * t.price).reduce((acc, value) => acc + value, 0);
          });
        })
        if (a.length > 0) {
          this.noData = false;
        } else {
          this.noData = true;
        }
      });
    })
/*     this.userSubscription = this.holdingsService.getAssetsList()
      .subscribe(a => {
        a.map(action => {
          this.holdingsService.getStockPrice(action.symbol).pipe(take(1)).subscribe(data => {
            action.price = data;
            this.dataSource = new MatTableDataSource<HoldingsTable>(a);
            this.totalInvested = a.map(t => t.units * t.avgOpenPrice).reduce((acc, value) => acc + value, 0);
            this.totalProfitLoss = a.map(t => (t.units * t.price) - (t.units * t.avgOpenPrice)).reduce((acc, value) => acc + value, 0);
            this.totalProfitLossPercent = this.totalProfitLoss / this.totalInvested;
            this.totalValue = a.map(t => t.units * t.price).reduce((acc, value) => acc + value, 0);
          });
        })
        if (a.length > 0) {
          this.noData = false;
        } else {
          this.noData = true;
        }
      }); */
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  onEdit(row) {
    this.holdingsService.showAssetonDialog(row);
    this.dialog.open(AddAssetsDialogComponent);
    this.holdingsService.updateAssetsList(row);
  }

  onDelete(key) {
    this.dialogService.openConfirmDialog()
      .afterClosed().subscribe(res => {
        if (res) {
          this.holdingsService.deleteAssetList(key);
          this.notificationService.warn('! Deleted successfully');
        }
        return
      })
  }

}
