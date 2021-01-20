import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EarningsDialogComponent } from './components/earnings-dialog/earnings-dialog.component';
import { EarningsService } from './services/earnings.service';

@Component({
  selector: 'app-earnings',
  templateUrl: './earnings.component.html',
  styleUrls: ['./earnings.component.scss']
})
export class EarningsComponent {

  constructor(
    private earningsService: EarningsService,
    public dialog: MatDialog
  ) { }

  openDialog() {
    this.earningsService.initFormGroup();
    this.dialog.open(EarningsDialogComponent);
  }

}
