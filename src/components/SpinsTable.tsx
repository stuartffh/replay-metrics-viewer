
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency } from '@/utils/replayUtils';

interface SpinsTableProps {
  data: Array<{
    balance: number;
    win: number;
    spinIndex?: number;
  }>;
}

const SpinsTable: React.FC<SpinsTableProps> = ({ data }) => {
  return (
    <Card className="metrics-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-gray-300">Histórico de Giros</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[350px] pr-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-primary">Giro</TableHead>
                <TableHead className="text-primary">Ganho</TableHead>
                <TableHead className="text-right text-primary">Saldo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((entry, index) => (
                <TableRow key={index} className="border-b border-secondary/20">
                  <TableCell className="font-medium">{entry.spinIndex || index + 1}</TableCell>
                  <TableCell className={entry.win > 0 ? 'text-green-400' : 'text-gray-400'}>
                    {formatCurrency(entry.win)}
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
