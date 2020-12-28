import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HoldingsService {

  stockData = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=VTI&apikey=AJXW7G1JV2AP0JQ4';



  constructor(private http: HttpClient) {}

  getStockData() {
    return this.http.get(this.stockData)
      .pipe(
        map(response => {
          return response as any;
        })
      );
  }
}
