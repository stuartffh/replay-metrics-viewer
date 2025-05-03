
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ReplayMetrics } from '@/types/replay';
import { formatCurrency } from '@/utils/replayUtils';
import { ArrowLeftRight, Award, Coins, Percent } from 'lucide-react';

interface MetricsSummaryProps {
  metrics: ReplayMetrics;
  isLoading: boolean;
}

const MetricsSummary: React.FC<MetricsSummaryProps> = ({ metrics, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="metrics-card animate-pulse-light">
            <CardContent className="p-6">
              <div className="h-4 bg-secondary/20 rounded w-2/3 mb-4"></div>
              <div className="h-8 bg-secondary/20 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="metrics-card flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Total Apostado</span>
          <Coins className="h-4 w-4 text-primary" />
        </div>
        <div className="text-xl font-bold">{formatCurrency(metrics.totalBets)}</div>
      </div>
      
      <div className="metrics-card flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Total Ganho</span>
          <Award className="h-4 w-4 text-primary" />
        </div>
        <div className="text-xl font-bold">{formatCurrency(metrics.totalWins)}</div>
      </div>
      
      <div className="metrics-card flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Lucro/Prejuízo</span>
          <ArrowLeftRight className="h-4 w-4 text-primary" />
        </div>
        <div className={`text-xl font-bold ${metrics.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {formatCurrency(metrics.netProfit)}
        </div>
      </div>
      
      <div className="metrics-card flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Maior Vitória</span>
          <Percent className="h-4 w-4 text-primary" />
        </div>
        <div className="text-xl font-bold text-green-400">{formatCurrency(metrics.biggestWin)}</div>
      </div>
    </div>
  );
};

export default MetricsSummary;
