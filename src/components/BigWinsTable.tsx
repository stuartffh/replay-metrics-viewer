
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency } from '@/utils/replayUtils';
import { Trophy, Medal, Award } from 'lucide-react';

interface BigWinsTableProps {
  data: Array<{
    amount: number;
    spinIndex: number;
  }>;
}

const BigWinsTable: React.FC<BigWinsTableProps> = ({ data }) => {
  // Make sure we have data sorted by amount (descending)
  const sortedData = [...data].sort((a, b) => b.amount - a.amount);

  // Function to get the appropriate icon based on rank
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-400" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-300" />;
      case 2:
        return <Medal className="h-5 w-5 text-amber-700" />;
      default:
        return <Award className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <Card className="metrics-card h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-gray-300">Maiores Vitórias</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {sortedData.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>Nenhuma grande vitória registrada neste replay.</p>
          </div>
        ) : (
          <ScrollArea className="h-[350px] pr-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-primary w-12">Rank</TableHead>
                  <TableHead className="text-primary">Giro</TableHead>
                  <TableHead className="text-right text-primary">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((win, index) => (
                  <TableRow key={index} className="border-b border-secondary/20">
                    <TableCell className="font-medium">
                      <div className="flex justify-center items-center">
                        {getRankIcon(index)}
                      </div>
                    </TableCell>
                    <TableCell>#{win.spinIndex}</TableCell>
                    <TableCell className="text-right text-green-400 font-bold">
                      {formatCurrency(win.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default BigWinsTable;
