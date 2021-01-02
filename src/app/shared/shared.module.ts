import { MaterialModule } from './material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatConfirmDialogComponent } from './components/mat-confirm-dialog/mat-confirm-dialog.component';


@NgModule({
  declarations: [
    MatConfirmDialogComponent
    ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class SharedModule { }
