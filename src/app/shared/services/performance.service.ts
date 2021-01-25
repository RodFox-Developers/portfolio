import { Performance } from './../models/performance';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {

  performanceList: AngularFireList<Performance>;

  constructor(
    private db: AngularFireDatabase
  ) { }

  getPerformance(uid) {
    this.performanceList = this.db.list<Performance>(`performance/${uid}`)
    return this.performanceList.snapshotChanges()
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

  setPerformance(openProfit, openProfitPercentage, accountValue) {
    this.performanceList.push({
      'openProfit': openProfit,
      'openProfitPercentage': openProfitPercentage,
      'accountValue': accountValue
    })
  }
}
