import { EarningsDialogComponent } from './../earnings-dialog/earnings-dialog.component';
import { EarningsService } from './../../services/earnings.service';
import { Earnings } from './../../models/earnings';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { AuthService } from 'src/app/core/auth/services/auth.service';


@Component({
  selector: 'app-earnings-table',
  templateUrl: './earnings-table.component.html',
  styleUrls: ['./earnings-table.component.scss']
})
export class EarningsTableComponent implements OnInit {

  displayedColumns: string[] = ['symbol', 'date', 'openPrice', 'closePrice', 'profit', 'actions'];
  dataSource: MatTableDataSource<Earnings>;

  userSubscription: Subscription;

  totalEarnings: number;

  noData: boolean;

  constructor(
    private earningsService: EarningsService,
    public dialog: MatDialog,
    public notificationService: NotificationService,
    private dialogService: DialogService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.userSubscription = this.authService.user$.subscribe(user => {
      this.earningsService.getEarningsList(user.uid)
      .subscribe(a => {
        this.dataSource = new MatTableDataSource<Earnings>(a);
        this.totalEarnings = a.map(t => t.closePrice - t.openPrice).reduce((acc, value) => acc + value, 0);
        if (a.length > 0) {
          this.noData = false;
        } else {
          this.noData = true;
        }
      });
    })
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  edit(row) {
    this.earningsService.showEarningsOnDialog(row);
    this.dialog.open(EarningsDialogComponent);
    this.earningsService.updateEarningsList(row);
  }

  deleteRow(key) {
    this.dialogService.openConfirmDialog()
      .afterClosed().subscribe(res => {
        if (res) {
          this.earningsService.deleteEarningsList(key);
          this.notificationService.success('! Successfully deleted');
        }
        return
      })
  }

}
