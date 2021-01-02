import { HoldingsService } from './../../services/holdings.service';
import { AddAssetsDialogComponent } from '../add-assets-dialog/add-assets-dialog.component';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-assets',
  templateUrl: './add-assets.component.html',
  styleUrls: ['./add-assets.component.scss']
})
export class AddAssetsComponent {

  constructor(
    public dialog: MatDialog,
    private holdingsService: HoldingsService
    ) {}

  openDialog() {
    this.holdingsService.initFormGroup();
    this.dialog.open(AddAssetsDialogComponent);
  }

}
