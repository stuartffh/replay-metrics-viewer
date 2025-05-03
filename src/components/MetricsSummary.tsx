
import React from 'react';
import { Card } from "@/components/ui/card";
import { ReplayMetrics } from '@/types/replay';
import { formatCurrency } from '@/utils/replayUtils';
import { ArrowLeftRight, Award, Coins, Sparkles, Percent, Zap } from 'lucide-react';
import MetricsCard from '@/components/MetricsCard';

interface MetricsSummaryProps {
  metrics: ReplayMetrics;
  isLoading: boolean;
}

const MetricsSummary: React.FC<MetricsSummaryProps> = ({ metrics, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="metrics-card animate-pulse-light p-4 h-[100px]">
            <div className="h-4 bg-secondary/20 rounded w-2/3 mb-4"></div>
            <div className="h-8 bg-secondary/20 rounded w-full"></div>
          </Card>
        ))}
      </div>
    );
  }

  // Calculate ROI (Return on Investment)
  const roi = metrics.totalBets > 0 ? (metrics.netProfit / metrics.totalBets * 100) : 0;
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <MetricsCard
        title="Total Apostado"
        value={formatCurrency(metrics.totalBets)}
        icon={<Coins className="h-4 w-4" />}
      />
      
      <MetricsCard
        title="Total Ganho"
        value={formatCurrency(metrics.totalWins)}
        icon={<Award className="h-4 w-4" />}
        trend={metrics.totalWins >= metrics.totalBets ? 'up' : 'down'}
      />
      
      <MetricsCard
        title="Lucro/Prejuízo"
        value={formatCurrency(metrics.netProfit)}
        icon={<ArrowLeftRight className="h-4 w-4" />}
        className={metrics.netProfit >= 0 ? 'profit-card' : 'loss-card'}
        trend={metrics.netProfit >= 0 ? 'up' : 'down'}
      />
      
      <MetricsCard
        title="Maior Vitória"
        value={formatCurrency(metrics.biggestWin)}
        icon={<Sparkles className="h-4 w-4" />}
      />
      
      <MetricsCard
        title="Taxa de Vitória"
        value={`${metrics.winRate.toFixed(1)}%`}
        icon={<Percent className="h-4 w-4" />}
      />
      
      <MetricsCard
        title="ROI"
        value={`${roi.toFixed(1)}%`}
        icon={<Zap className="h-4 w-4" />}
        trend={roi >= 0 ? 'up' : 'down'}
      />
    </div>
  );
};

export default MetricsSummary;
