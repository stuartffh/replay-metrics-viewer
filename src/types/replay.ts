
export interface ReplayData {
  error: number;
  description: string;
  init: string;
  log: LogEntry[];
}

export interface LogEntry {
  cr: string;
  sr: string;
}

export interface ParsedLogEntry {
  action: string;
  bet: number;
  balance: number;
  win: number;
  timestamp?: number;
  spinIndex?: number;
}

export interface ReplayMetrics {
  totalBets: number;
  totalWins: number;
  netProfit: number;
  winRate: number;
  biggestWin: number;
  biggestWinIndex: number;
  spinsCount: number;
  balanceHistory: {balance: number, win: number, timestamp?: number, spinIndex?: number}[];
  startingBalance?: number;
  endingBalance?: number;
}
