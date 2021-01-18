import { ReactiveFormsModule } from '@angular/forms';
import { FundsDialogComponent } from './components/balance/components/funds-dialog/funds-dialog.component';
import { MaterialModule } from './material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatConfirmDialogComponent } from './components/mat-confirm-dialog/mat-confirm-dialog.component';

@NgModule({
  declarations: [
    MatConfirmDialogComponent,
    FundsDialogComponent
    ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
