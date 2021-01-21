export interface Earnings {
  $key?: string;
  symbol: string;
  date: Date;
  units: number;
  openPrice: number;
  closePrice: number;
  profit?: number;
}
