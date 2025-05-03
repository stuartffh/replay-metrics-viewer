
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { extractReplayParams, extractGameConfig } from "@/utils/replayUtils";

const SearchForm = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast({
        title: "URL é necessária",
        description: "Por favor, insira um URL de replay válido",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const params = extractReplayParams(url);
      
      if (!params?.token) {
        throw new Error("Token de replay não encontrado na URL");
      }
      
      // Extract roundID and envID from the HTML
      const gameConfig = await extractGameConfig(url);
      
      if (!gameConfig?.roundID || !gameConfig?.envID) {
        throw new Error("Não foi possível extrair os parâmetros do replay");
      }
      
      navigate(`/replay/${params.token}/${gameConfig.roundID}/${gameConfig.envID}`);
    } catch (error) {
      console.error("Error processing replay URL:", error);
      toast({
        title: "Erro ao processar URL",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-darkCharcoal border-secondary/20 p-6 max-w-2xl w-full mx-auto shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center gradient-text">
        Analise seus replays de jogos
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="Cole a URL do replay aqui (ex: https://euioa.jxcsysekgu.net/5qGZRqiCxI)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="input-search h-12"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-secondary h-12 text-white"
          disabled={loading}
        >
          {loading ? "Processando..." : "Analisar Replay"}
        </Button>
      </form>
    </Card>
  );
};

export default SearchForm;
