
import { ReplayData, ParsedLogEntry, ReplayMetrics } from "../types/replay";

// Extract replay parameters from URL
export function extractReplayParams(replayUrl: string): { token: string; roundID: string; envID: string } | null {
  try {
    const url = new URL(replayUrl);
    const token = url.pathname.split('/').pop() || '';
    
    // Default values - will be updated if we find JSON data
    return { 
      token,
      roundID: '', 
      envID: ''
    };
  } catch (error) {
    console.error("Failed to parse replay URL:", error);
    return null;
  }
}

// Extract game configuration from HTML
export async function extractGameConfig(replayUrl: string): Promise<{roundID: string, envID: string} | null> {
  try {
    const response = await fetch(replayUrl);
    if (!response.ok) throw new Error('Failed to fetch replay page');
    
    const html = await response.text();
    const gameConfigMatch = html.match(/gameConfig: '(.+?)'/);
    
    if (gameConfigMatch && gameConfigMatch[1]) {
      const gameConfig = JSON.parse(gameConfigMatch[1]);
      return {
        roundID: gameConfig.replayRoundId?.toString() || '',
        envID: gameConfig.environmentId?.toString() || ''
      };
    }
    return null;
  } catch (error) {
    console.error("Failed to extract game config:", error);
    return null;
  }
}

// Parse a log entry
export function parseLogEntry(entry: string): Record<string, string> {
  const params: Record<string, string> = {};
  entry.split('&').forEach(param => {
    const [key, value] = param.split('=');
    if (key && value !== undefined) {
      params[key] = decodeURIComponent(value);
    }
  });
  return params;
}

// Parse all log entries to get structured data
export function parseLogEntries(replayData: ReplayData): ParsedLogEntry[] {
  return replayData.log.map(entry => {
    const crParams = parseLogEntry(entry.cr);
    const srParams = parseLogEntry(entry.sr);
    
    return {
      action: crParams.action || '',
      bet: parseFloat(srParams.c || '0') * (parseInt(crParams.l || '0', 10) || 20),
      balance: parseFloat(srParams.balance || '0'),
      win: parseFloat(srParams.w || '0'),
      timestamp: parseInt(srParams.stime || '0', 10),
      spinIndex: parseInt(srParams.index || '0', 10),
    };
  }).filter(entry => entry.action === 'doSpin' || entry.action === 'doCollect');
}

// Calculate metrics from parsed log entries
export function calculateMetrics(parsedEntries: ParsedLogEntry[]): ReplayMetrics {
  let totalBets = 0;
  let totalWins = 0;
  let biggestWin = 0;
  let biggestWinIndex = -1;
  const balanceHistory: {balance: number, win: number, timestamp?: number, spinIndex?: number}[] = [];
  const spinsCount = parsedEntries.filter(entry => entry.action === 'doSpin').length;
  
  parsedEntries.forEach((entry, index) => {
    if (entry.action === 'doSpin') {
      totalBets += entry.bet;
      totalWins += entry.win;
      
      if (entry.win > biggestWin) {
        biggestWin = entry.win;
        biggestWinIndex = entry.spinIndex || index;
      }
      
      balanceHistory.push({
        balance: entry.balance,
        win: entry.win,
        timestamp: entry.timestamp,
        spinIndex: entry.spinIndex
      });
    }
  });
  
  const startingBalance = parsedEntries[0]?.balance || 0;
  const endingBalance = parsedEntries[parsedEntries.length - 1]?.balance || 0;
  const netProfit = endingBalance - startingBalance;
  const winRate = spinsCount > 0 ? parsedEntries.filter(entry => entry.win > 0).length / spinsCount * 100 : 0;
  
  return {
    totalBets,
    totalWins,
    netProfit,
    winRate,
    biggestWin,
    biggestWinIndex,
    spinsCount,
    balanceHistory,
    startingBalance,
    endingBalance
  };
}

// Format currency values
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  }).format(value);
}

// Format time from timestamp
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: false
  });
}
