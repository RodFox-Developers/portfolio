import { async } from '@angular/core/testing';
import { HoldingsTable } from './../models/holdings-table.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, reduce, take } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class HoldingsService {

  assetsList: AngularFireList<HoldingsTable>;

  constructor(
    private http: HttpClient,
    private db: AngularFireDatabase
    ) {}

  form: FormGroup = new FormGroup({
    $key: new FormControl(null),
    'symbol': new FormControl(null, Validators.required),
    'category': new FormControl(null, Validators.required),
    'units': new FormControl(null, Validators.required),
    'avgOpenPrice': new FormControl(null, Validators.required)
  })

  initFormGroup() {
    this.form.setValue({
      $key: null,
      'symbol': '',
      'category': '',
      'units': null,
      'avgOpenPrice': null
    })
  }

  getStockPrice(symbol: string) {
    return this.http.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=SUHZ26DQ79BZZ3R5`)
      .pipe(
        map(response => {
          const dataPrice = response['Time Series (Daily)'];
            if (dataPrice) {
              const dataPriceArray = Object.values(dataPrice);
              const lastPrice = Object.values(dataPriceArray[0]);
              return lastPrice[3];
            }
        })
      );
  }

  getAssetsList() {
    this.assetsList = this.db.list<HoldingsTable>('assets')
    return this.assetsList.snapshotChanges()
    .pipe(
      map(actions => {
        return actions.map(action => {
          const a = action.payload.val();
          a['$key'] = action.key;
          this.getStockPrice(a.symbol).pipe(take(1)).subscribe(data => {
            a.price = data;
          });
          return a;
        })
      })
    );
  }

  setAssetsList(asset: HoldingsTable) {
    this.assetsList.push({
      'symbol': asset.symbol,
      'category': asset.category,
      'units': asset.units,
      'avgOpenPrice': asset.avgOpenPrice
    })
  }

  updateAssetsList(asset: HoldingsTable) {
    this.assetsList.update(asset.$key, {
      'symbol': asset.symbol,
      'category': asset.category,
      'units': asset.units,
      'avgOpenPrice': asset.avgOpenPrice
    })
  }

  deleteAssetList(key) {
    this.assetsList.remove(key);
  }

  showAssetonDialog(asset) {
    this.form.setValue({
      $key: asset.$key,
      'symbol': asset.symbol,
      'category': asset.category,
      'units': asset.units,
      'avgOpenPrice': asset.avgOpenPrice
    });
  }

  getTotalInvested() {
    return this.getAssetsList().pipe(
      map(res => {
        return res.map(t => t.units * t.avgOpenPrice).reduce((acc, value) => acc + value, 0);
      })
    )
  }

  getTotalProfitLoss() {
    return this.getAssetsList()
    .pipe(
      map(res => {
        return res.map(t => t.price)
      })
    )
  }

  getTotalProfitLossPercent() {
    return this.getAssetsList().pipe(
      map(res => {
        return res.map(t => t.units).reduce((acc, value) => acc + value, 0);
      })
    )
  }

  getTotal() {
    return this.getAssetsList().pipe(
      map(res => {
        return res.map(t => t.price).reduce((acc, value) => acc + value, 0);
      })
    )
  }
}
