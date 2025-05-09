
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from "recharts";
import { formatCurrency } from '@/utils/replayUtils';

interface BalanceChartProps {
  data: Array<{
    balance: number;
    win: number;
    bet?: number;
    timestamp?: number;
    spinIndex?: number;
  }>;
}

const BalanceChart: React.FC<BalanceChartProps> = ({ data }) => {
  // Prepare data for chart
  const chartData = data.map((entry, index) => ({
    name: `#${entry.spinIndex || index + 1}`,
    balance: entry.balance,
    win: entry.win,
    bet: entry.bet || 0
  }));
  
  // Calculate starting balance for reference line
  const startingBalance = data.length > 0 ? data[0].balance : 0;

  return (
    <Card className="metrics-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-gray-300">Evolução do Saldo</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#9b87f5" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="winGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1EAEDB" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#1EAEDB" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#9b87f5' }} 
              stroke="#444"
              interval="preserveStartEnd"
              minTickGap={15}
            />
            <YAxis 
              tick={{ fill: '#9b87f5' }} 
              stroke="#444"
              tickFormatter={(value) => formatCurrency(value).replace('R$', '')}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#221F26', 
                border: '1px solid #7E69AB',
                borderRadius: '4px',
                color: '#E5DEFF'
              }}
              formatter={(value: number, name: string) => {
                if (name === "balance") return [formatCurrency(value), "Saldo"];
                if (name === "win") return [formatCurrency(value), "Ganho"];
                if (name === "bet") return [formatCurrency(value), "Aposta"];
                return [formatCurrency(value), name];
              }}
              labelFormatter={(label) => `Giro ${label}`}
            />
            <ReferenceLine
              y={startingBalance}
              stroke="#ffffff55"
              strokeDasharray="3 3"
              label={{
                value: "Saldo Inicial",
                fill: "#ffffff55",
                fontSize: 10,
                position: "insideBottomRight"
              }}
            />
            <Area 
              type="monotone" 
              dataKey="balance" 
              name="Saldo"
              stroke="#9b87f5" 
              fill="url(#balanceGradient)" 
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="win" 
              name="Ganho"
              stroke="#1EAEDB" 
              fill="url(#winGradient)" 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default BalanceChart;
