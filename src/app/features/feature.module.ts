import { AddAssetsDialogComponent } from './holdings/components/add-assets-dialog/add-assets-dialog.component';
import { AddAssetsComponent } from './holdings/components/add-assets/add-assets.component';
import { HoldingsComponent } from './holdings/holdings.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HoldingsTableComponent } from './holdings/components/holdings-table/holdings-table.component';
import { MaterialModule } from '../shared/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireDatabaseModule } from '@angular/fire/database';


@NgModule({
  declarations: [
    DashboardComponent,
    HoldingsComponent,
    PageNotFoundComponent,
    HoldingsTableComponent,
    AddAssetsComponent,
    AddAssetsDialogComponent,

  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    AngularFireDatabaseModule,
  ]
})
export class FeatureModule { }
