import { HoldingsTable } from './../../models/holdings-table.interface';
import { HoldingsService } from './../../services/holdings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-holdings-table',
  templateUrl: './holdings-table.component.html',
  styleUrls: ['./holdings-table.component.scss']
})
export class HoldingsTableComponent implements OnInit {

  dataTableSource: HoldingsTable[] = [
    {position: 1, symbol: 'VTI', category: 'stocks', price: 10, amount: 2, entryPrice: 12.05, invested: 24.1, profitLoss: 50, profitLossPercentage: 6, totalValue: 35},
    {position: 1, symbol: 'VTI', category: 'stocks', price: 10, amount: 2, entryPrice: 12.05, invested: 24.1, profitLoss: 50, profitLossPercentage: 6, totalValue: 35},
    {position: 1, symbol: 'VTI', category: 'stocks', price: 10, amount: 2, entryPrice: 12.05, invested: 24.1, profitLoss: 50, profitLossPercentage: 6, totalValue: 35}
  ];

  displayedColumns: string[] = ['position', 'symbol', 'category', 'price', 'amount', 'entryPrice', 'invested', 'profitLoss', 'profitLossPercentage', 'totalValue'];
  dataSource = new MatTableDataSource(this.dataTableSource);

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  stockPrice: number;
  stockData;

  constructor(private stocksService: HoldingsService) { }

  ngOnInit() {
    this.stocksService.getStockData().subscribe(data => {

      const dataPrice = data['Time Series (Daily)'];
      const dataPriceArray = Object.values(dataPrice);
      const lastPrice = Object.values(dataPriceArray[0]);
      this.stockPrice = lastPrice[3];

      const dataStock = data['Meta Data'];
      const dataStockArray = Object.values(dataStock);
      this.stockData = dataStockArray[1];

    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

}
