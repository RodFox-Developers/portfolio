import { HoldingsTable } from './../models/holdings-table.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class HoldingsService {

  assetsList: AngularFireList<HoldingsTable>;
  userId: string;

  //alphaVantage = https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=SUHZ26DQ79BZZ3R5
  //IEXCloudSandBox = https://sandbox.iexapis.com/stable/stock/${symbol}/quote?token=Tpk_05eb6b63ca634b8eab45963ebdb705b2
  //IEXCloud = https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=pk_8273ee4b39ad47429ae5dff65934a0b5

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
    return this.http.get(`https://sandbox.iexapis.com/stable/stock/${symbol}/quote?token=Tpk_05eb6b63ca634b8eab45963ebdb705b2`)
      .pipe(
        map(response => {
          /* const dataPrice = response['Time Series (Daily)'];
            if (dataPrice) {
              const dataPriceArray = Object.values(dataPrice);
              const lastPrice = Object.values(dataPriceArray[0]);
              return lastPrice[3];
            } else {
              return console.log('no server connection');
            } */
          const data = Object.values(response);
          return data[16];
        })
      );
  }

  getAssetsList(uid) {
    this.assetsList = this.db.list<HoldingsTable>(`holdingsCart/${uid}`)
    return this.assetsList.snapshotChanges()
    .pipe(
      map(actions => {
        return actions.map(action => {
          const a = action.payload.val();
          a['$key'] = action.key;
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
