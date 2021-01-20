export interface Earnings {
  $key?: string;
  symbol: string;
  date: Date;
  openPrice: number;
  closePrice: number;
  profit?: number;
}
