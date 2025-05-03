
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import ReplayVideo from '@/components/ReplayVideo';
import MetricsSummary from '@/components/MetricsSummary';
import BalanceChart from '@/components/BalanceChart';
import SpinsTable from '@/components/SpinsTable';
import WinRateChart from '@/components/WinRateChart';
import { ReplayData, ReplayMetrics } from '@/types/replay';
import { parseLogEntries, calculateMetrics, fetchReplayDataByRoundID } from '@/utils/replayUtils';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BigWinsTable from '@/components/BigWinsTable';

const ReplayPage = () => {
  const { token, roundID, envID } = useParams();
  const [replayData, setReplayData] = useState<ReplayData | null>(null);
  const [metrics, setMetrics] = useState<ReplayMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Log params to check what we're receiving
  console.log("Route parameters:", { token, roundID, envID });
  
  // Determine if we're in Round ID only mode
  const isRoundIdMode = token === 'roundid' && roundID && !envID;
  console.log("Is Round ID mode:", isRoundIdMode);
  
  useEffect(() => {
    const fetchReplayData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (isRoundIdMode) {
          // Round ID only mode - using just the roundID parameter
          console.log("Fetching by Round ID mode:", roundID);
          
          if (!roundID) {
            console.error("Round ID is missing");
            throw new Error('ID da rodada não fornecido');
          }
          
          // Use the specific function for fetching by round ID
          const data = await fetchReplayDataByRoundID(roundID);
          console.log("Round ID data received:", data);
          
          if (!data) {
            console.error("Failed to fetch data by Round ID");
            throw new Error('Falha ao buscar dados pelo ID da rodada');
          }
          setReplayData(data);
          
          // Parse the log entries
          const parsedEntries = parseLogEntries(data);
          console.log("Parsed entries:", parsedEntries.length);
          
          // Calculate metrics
          const calculatedMetrics = calculateMetrics(parsedEntries);
          console.log("Calculated metrics:", calculatedMetrics);
          setMetrics(calculatedMetrics);
          
        } else {
          // Standard method with full parameters
          console.log("Fetching by full parameters");
          
          if (!token || !roundID || !envID) {
            console.error("Missing URL parameters:", { token, roundID, envID });
            throw new Error('Parâmetros de URL incompletos');
          }
          
          const dataUrl = `https://euioa.jxcsysekgu.net/ReplayServiceGlobal/api/replay/data?token=${token}&roundID=${roundID}&envID=${envID}`;
          console.log("Fetching URL data:", dataUrl);
          
          const response = await fetch(dataUrl);
          console.log("URL API Response status:", response.status);
          
          if (!response.ok) {
            console.error("URL API Error response:", response.statusText);
            throw new Error(`Falha ao buscar dados do replay: ${response.statusText}`);
          }
          
          const data: ReplayData = await response.json();
          console.log("URL API Data received:", data);
          setReplayData(data);
          
          if (data.error !== 0) {
            console.error("URL API returned error:", data.description);
            throw new Error(`API retornou erro: ${data.description}`);
          }
          
          // Parse the log entries
          const parsedEntries = parseLogEntries(data);
          
          // Calculate metrics
          const calculatedMetrics = calculateMetrics(parsedEntries);
          setMetrics(calculatedMetrics);
        }
        
      } catch (err) {
        console.error("Erro ao buscar dados do replay:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido");
        toast({
          title: "Erro ao carregar dados",
          description: err instanceof Error ? err.message : "Ocorreu um erro inesperado",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReplayData();
  }, [token, roundID, envID, isRoundIdMode, toast]);

  // Set the appropriate URL for the video player
  const replayUrl = token && token !== 'roundid' ? `https://euioa.jxcsysekgu.net/${token}` : '';

  return (
    <div className="min-h-screen flex flex-col bg-darkPurple">
      <Header />
      
      <main className="flex-1 container mx-auto p-4 lg:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold gradient-text">Análise de Replay</h1>
          {isRoundIdMode ? (
            <p className="text-gray-400">ID da Rodada: {roundID}</p>
          ) : (
            <p className="text-gray-400">ID: {token}</p>
          )}
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse-light">
            <div className="bg-darkCharcoal h-[500px] rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-24 bg-darkCharcoal rounded-lg"></div>
              <div className="h-[400px] bg-darkCharcoal rounded-lg"></div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Erro ao carregar dados</h3>
            <p>{error}</p>
          </div>
        ) : (
          <>
            {/* Metrics Summary */}
            <div className="mb-6 animate-fade-in">
              {metrics && <MetricsSummary metrics={metrics} isLoading={loading} />}
            </div>
            
            {/* Main Content: Video and Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Only show video in full mode, not in Round ID mode */}
              {!isRoundIdMode ? (
                <div className="h-[500px] animate-fade-in" style={{ animationDelay: '0.1s' }}>
                  <ReplayVideo replayUrl={replayUrl} />
                </div>
              ) : (
                <div className="h-[500px] animate-fade-in p-4 bg-darkCharcoal rounded-lg flex items-center justify-center" 
                  style={{ animationDelay: '0.1s' }}>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-300 mb-4">
                      Reprodução de vídeo não disponível
                    </h3>
                    <p className="text-gray-400 max-w-md">
                      A visualização do replay não está disponível quando apenas o ID da rodada é fornecido.
                      As métricas e estatísticas estão disponíveis ao lado.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="h-[500px] animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <Tabs defaultValue="chart" className="h-full flex flex-col">
                  <TabsList className="grid w-full grid-cols-3 mb-4 bg-darkCharcoal">
                    <TabsTrigger value="chart">Gráficos</TabsTrigger>
                    <TabsTrigger value="table">Histórico</TabsTrigger>
                    <TabsTrigger value="big-wins">Grandes Vitórias</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="chart" className="flex-1 overflow-hidden space-y-4">
                    {metrics && (
                      <>
                        <BalanceChart data={metrics.balanceHistory} />
                        <WinRateChart winRate={metrics.winRate} />
                      </>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="table" className="flex-1">
                    {metrics && <SpinsTable data={metrics.balanceHistory} />}
                  </TabsContent>
                  
                  <TabsContent value="big-wins" className="flex-1">
                    {metrics && <BigWinsTable data={metrics.bigWins || []} />}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ReplayPage;
