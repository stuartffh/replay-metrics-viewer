
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MetricsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
  trend?: 'up' | 'down' | 'neutral';
}

const MetricsCard: React.FC<MetricsCardProps> = ({ 
  title, 
  value, 
  icon,
  className = "",
  trend
}) => {
  return (
    <Card className={`metrics-card ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-md font-medium text-gray-400">{title}</CardTitle>
        {icon && <div className="text-primary">{icon}</div>}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-2xl font-bold">
          {value}
          {trend && (
            <span className={`ml-2 text-sm font-medium ${
              trend === 'up' ? 'text-green-500' : 
              trend === 'down' ? 'text-red-500' : 
              'text-gray-500'
            }`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricsCard;
