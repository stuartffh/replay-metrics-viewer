
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency, formatTimestamp } from '@/utils/replayUtils';
import { Sparkles } from 'lucide-react';

interface SpinsTableProps {
  data: Array<{
    balance: number;
    win: number;
    bet?: number;
    timestamp?: number;
    spinIndex?: number;
    isFreeSpin?: boolean;
  }>;
}

const SpinsTable: React.FC<SpinsTableProps> = ({ data }) => {
  return (
    <Card className="metrics-card h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-gray-300">Histórico de Giros</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[350px] pr-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-primary">Giro</TableHead>
                <TableHead className="text-primary">Aposta</TableHead>
                <TableHead className="text-primary">Ganho</TableHead>
                <TableHead className="text-right text-primary">Saldo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((entry, index) => (
                <TableRow key={index} className={`border-b border-secondary/20 ${entry.isFreeSpin ? 'bg-primary/10' : ''}`}>
                  <TableCell className="font-medium">
                    {entry.spinIndex || index + 1}
                    {entry.isFreeSpin && <span className="ml-2 text-primary text-xs">(Free)</span>}
                  </TableCell>
                  <TableCell>
                    {entry.bet ? formatCurrency(entry.bet) : '-'}
                  </TableCell>
                  <TableCell className={entry.win > 0 ? 'text-green-400' : 'text-gray-400'}>
                    {formatCurrency(entry.win)}
                    {entry.win >= 100 && <Sparkles className="inline ml-1 h-3 w-3 text-yellow-400" />}
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(entry.balance)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SpinsTable;
