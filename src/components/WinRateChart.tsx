
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface WinRateChartProps {
  winRate: number;
}

const WinRateChart: React.FC<WinRateChartProps> = ({ winRate }) => {
  return (
    <Card className="metrics-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-gray-300">Taxa de Vitória</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="text-3xl font-bold text-primary">{winRate.toFixed(1)}%</div>
          <Progress value={winRate} className="h-2 bg-secondary/30" />
          <p className="text-sm text-gray-400">
            Porcentagem de giros que resultaram em vitória
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WinRateChart;
