import { HoldingsTable } from './../models/holdings-table.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';
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
    return this.http.get(`http://api.marketstack.com/v1/eod?access_key=de917322f2f8bcfff4e4a8283df6589a&symbols=${symbol}`)
      .pipe(
        map(response => {
          const dataPrice = response['data'];
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

}
