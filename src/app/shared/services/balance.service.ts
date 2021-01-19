import { CashBalance } from './../components/balance/models/cash-balance';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {

  cashBalance: AngularFireList<CashBalance>;
  userId: string;

  constructor(private db: AngularFireDatabase) { }

  form: FormGroup = new FormGroup({
    $key: new FormControl(null),
    'category': new FormControl(null, Validators.required),
    'funds': new FormControl(null, Validators.required)
  })

  getFunds(uid) {
    this.cashBalance = this.db.list<CashBalance>(`funds/${uid}`)
    return this.cashBalance.snapshotChanges()
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

  setFunds(funds: CashBalance) {
    this.cashBalance.push({
      'funds': funds.funds
    })
  }

  updateFunds(funds, $key) {
    this.cashBalance.update($key, {
      'funds': funds
    })
  }
}
