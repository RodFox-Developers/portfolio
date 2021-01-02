export interface HoldingsTable {
  $key?: string;
  symbol: string;
  category: string;
  price?: number;
  units: number;
  avgOpenPrice: number;
  invested?: number;
  profitLoss?: number;
  profitLossPercentage?: number;
  totalValue?: number;
}
