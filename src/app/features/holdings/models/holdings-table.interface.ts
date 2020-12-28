export interface HoldingsTable {
  position: number;
  symbol: string;
  category: string;
  price: number;
  amount: number;
  entryPrice: number;
  invested: number;
  profitLoss: number;
  profitLossPercentage: number;
  totalValue: number;
}
