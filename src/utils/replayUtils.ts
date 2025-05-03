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
    console.error("Falha ao analisar URL do replay:", error);
    return null;
  }
}

// Extract game configuration from HTML
export async function extractGameConfig(replayUrl: string): Promise<{roundID: string, envID: string} | null> {
  try {
    const response = await fetch(replayUrl);
    if (!response.ok) throw new Error('Falha ao buscar página de replay');
    
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
    console.error("Falha ao extrair configuração do jogo:", error);
    return null;
  }
}

// Fetch replay data using round ID only
export async function fetchReplayDataByRoundID(roundID: string): Promise<ReplayData | null> {
  try {
    const dataUrl = `https://euioa.jxcsysekgu.net/ReplayServiceGlobal/api/replay/data?roundID=${roundID}`;
    const response = await fetch(dataUrl);
    
    if (!response.ok) {
      throw new Error(`Falha ao buscar dados do replay: ${response.statusText}`);
    }
    
    const data: ReplayData = await response.json();
    
    if (data.error !== 0) {
      throw new Error(`API retornou erro: ${data.description}`);
    }
    
    return data;
  } catch (error) {
    console.error("Falha ao buscar dados por Round ID:", error);
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

// Helper function to parse number values that might contain commas or be formatted differently
function parseNumberWithCommas(value: string): number {
  if (!value) return 0;
  // Handle both comma and dot decimal separators
  return parseFloat(value.replace(',', '.'));
}

// Parse all log entries to get structured data
export function parseLogEntries(replayData: ReplayData): ParsedLogEntry[] {
  if (!replayData.log || replayData.log.length === 0) {
    return [];
  }

  return replayData.log.map((entry, index) => {
    const crParams = parseLogEntry(entry.cr);
    const srParams = parseLogEntry(entry.sr);
    
    const action = crParams.action || '';
    const isCollect = action === 'doCollect';
    
    // Handle different number formats
    const bet = parseFloat(crParams.c || '0') * (parseInt(crParams.l || '0', 10) || 20);
    
    // Parse balance - ensure we handle thousand separators properly
    const balanceStr = srParams.balance || '0';
    const balance = balanceStr.includes(',') 
      ? parseFloat(balanceStr.split(',')[0]) + parseFloat(balanceStr.split(',')[1]) / 100
      : parseFloat(balanceStr);
    
    // For big wins, check additional parameters
    // First try apwa (Big win value), if not present try w (regular win)
    let win = 0;
    if (srParams.apwa) {
      // Mega win
      win = parseNumberWithCommas(srParams.apwa || '0');
    } else {
      // Regular win
      win = parseNumberWithCommas(srParams.w || '0');
    }
    
    const totalWin = parseNumberWithCommas(srParams.tw || '0');
    const freeSpinWin = parseNumberWithCommas(srParams.fswin || '0');
    
    // Check if this is a free spin
    const isFreeSpin = srParams.fs !== undefined && srParams.fs !== '0';
    
    // Net profit tracking from ntp parameter
    const netProfit = parseNumberWithCommas(srParams.ntp || '0');
    
    return {
      action,
      bet,
      balance,
      win,
      totalWin,
      freeSpinWin,
      timestamp: parseInt(srParams.stime || '0', 10),
      spinIndex: parseInt(srParams.index || '0', 10),
      isFreeSpin,
      isCollect,
      netProfit
    };
  });
}

// Calculate metrics from parsed log entries
export function calculateMetrics(parsedEntries: ParsedLogEntry[]): ReplayMetrics {
  let totalBets = 0;
  let totalWins = 0;
  let biggestWin = 0;
  let biggestWinIndex = -1;
  let freeSpinsCount = 0;
  let freeSpinsWin = 0;
  const bigWins: {amount: number, spinIndex: number}[] = [];
  
  const balanceHistory: {
    balance: number;
    win: number;
    totalWin?: number;
    bet?: number;
    timestamp?: number;
    spinIndex?: number;
    isFreeSpin?: boolean;
  }[] = [];
  
  // Filter by actual spin or collect actions
  const validEntries = parsedEntries.filter(entry => 
    entry.action === 'doSpin' || entry.action === 'doCollect');
  
  const spinsCount = validEntries.filter(entry => entry.action === 'doSpin').length;
  
  // Find the initial balance (use the first entry's balance)
  const startingBalance = validEntries.length > 0 ? validEntries[0].balance : 0;
  
  // Find the final balance (use the last entry's balance, especially for doCollect)
  const endingBalance = validEntries.length > 0 ? 
    validEntries[validEntries.length - 1].balance : 0;
  
  // Calculate net profit as the difference between final and initial balance
  const netProfit = endingBalance - startingBalance;
  
  validEntries.forEach((entry, index) => {
    // Skip entries without balance information
    if (entry.balance === undefined) return;
    
    if (entry.action === 'doSpin') {
      // Track bets
      if (entry.bet > 0) {
        totalBets += entry.bet;
      }
      
      // Track wins
      if (entry.win > 0) {
        totalWins += entry.win;
        
        // Track big wins (wins over 10x bet)
        if (entry.win > entry.bet * 10) {
          bigWins.push({
            amount: entry.win,
            spinIndex: entry.spinIndex || index
          });
        }
        
        // Track biggest win
        if (entry.win > biggestWin) {
          biggestWin = entry.win;
          biggestWinIndex = entry.spinIndex || index;
        }
      }
      
      // Track free spins
      if (entry.isFreeSpin) {
        freeSpinsCount++;
        if (entry.freeSpinWin) {
          freeSpinsWin += entry.freeSpinWin;
        }
      }
      
      // Add to balance history with accurate data
      balanceHistory.push({
        balance: entry.balance,
        win: entry.win,
        totalWin: entry.totalWin,
        bet: entry.bet,
        timestamp: entry.timestamp,
        spinIndex: entry.spinIndex || index,
        isFreeSpin: entry.isFreeSpin
      });
    } else if (entry.isCollect) {
      // Handle collect actions (end of session)
      balanceHistory.push({
        balance: entry.balance,
        win: entry.win || 0,
        timestamp: entry.timestamp,
        spinIndex: entry.spinIndex || index
      });
    }
  });
  
  // Sort big wins by amount (descending)
  bigWins.sort((a, b) => b.amount - a.amount);
  
  // Calculate final metrics
  const winRate = spinsCount > 0 ? 
    validEntries.filter(entry => entry.win > 0).length / spinsCount * 100 : 0;
  
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
    endingBalance,
    freeSpinsCount,
    freeSpinsWin,
    bigWins
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
