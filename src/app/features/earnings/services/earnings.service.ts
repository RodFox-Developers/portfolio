import { Earnings } from './../models/earnings';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class EarningsService {

  earningsList: AngularFireList<Earnings>;
  userId: string;

  constructor(private db: AngularFireDatabase) { }

  earningsForm: FormGroup = new FormGroup({
    $key: new FormControl(null),
    'symbol': new FormControl(null, Validators.required),
    'date': new FormControl(null, Validators.required),
    'openPrice': new FormControl(null, Validators.required),
    'closePrice': new FormControl(null, Validators.required)
  })

  initFormGroup() {
    this.earningsForm.setValue({
      $key: null,
      'symbol': '',
      'date': null,
      'openPrice': null,
      'closePrice': null
    })
  }

  getEarningsList(uid) {
    this.earningsList = this.db.list<Earnings>(`earnings/${uid}`)
    return this.earningsList.snapshotChanges()
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

  setEarningsList(earn: Earnings) {
    this.earningsList.push({
      'symbol': earn.symbol,
      'date': earn.date,
      'openPrice': earn.openPrice,
      'closePrice': earn.closePrice
    })
  }

  updateEarningsList(earn: Earnings) {
    this.earningsList.update(earn.$key, {
      'symbol': earn.symbol,
      'date': earn.date,
      'openPrice': earn.openPrice,
      'closePrice': earn.closePrice
    })
  }

  deleteEarningsList(key) {
    this.earningsList.remove(key);
  }

  showEarningsOnDialog(earn) {
    this.earningsForm.setValue({
      $key: earn.$key,
      'symbol': earn.symbol,
      'date': earn.date,
      'openPrice': earn.openPrice,
      'closePrice': earn.closePrice
    });
  }
}
