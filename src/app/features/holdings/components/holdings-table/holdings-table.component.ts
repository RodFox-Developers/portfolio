import { DialogService } from './../../../../shared/services/dialog.service';
import { NotificationService } from './../../../../shared/services/notification.service';
import { HoldingsTable } from './../../models/holdings-table.interface';
import { HoldingsService } from './../../services/holdings.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddAssetsDialogComponent } from '../add-assets-dialog/add-assets-dialog.component';

@Component({
  selector: 'app-holdings-table',
  templateUrl: './holdings-table.component.html',
  styleUrls: ['./holdings-table.component.scss']
})
export class HoldingsTableComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['symbol', 'category', 'price', 'units', 'avgOpenPrice', 'invested', 'profitLoss', 'profitLossPercentage', 'totalValue', 'actions'];
  dataSource: MatTableDataSource<HoldingsTable>;

  subscription: Subscription;

  constructor(
    private holdingsService: HoldingsService,
    public dialog: MatDialog,
    public notificationService: NotificationService,
    private dialogService: DialogService
    ) {}

  ngOnInit() {
    this.subscription = this.holdingsService.getAssetsList().subscribe(a => {
      this.dataSource = new MatTableDataSource<HoldingsTable>(a);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
