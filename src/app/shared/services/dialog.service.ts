import { MatConfirmDialogComponent } from './../components/mat-confirm-dialog/mat-confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  openConfirmDialog() {
    return this.dialog.open(MatConfirmDialogComponent, {
      width: '390px',
      disableClose: true,
      position: {top: '10px'}
    });
  }
}
