
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { extractReplayParams, extractGameConfig } from "@/utils/replayUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Define form schemas for validation
const urlSchema = z.object({
  url: z.string().url("URL inválida").min(1, "URL é obrigatória")
});

const roundIdSchema = z.object({
  roundId: z.string().min(1, "ID da rodada é obrigatório")
});

const SearchForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // URL form setup
  const urlForm = useForm<z.infer<typeof urlSchema>>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: "",
    },
  });

  // Round ID form setup
  const roundIdForm = useForm<z.infer<typeof roundIdSchema>>({
    resolver: zodResolver(roundIdSchema),
    defaultValues: {
      roundId: "",
    },
  });

  // Handle URL form submission
  const handleUrlSubmit = async (values: z.infer<typeof urlSchema>) => {
    setLoading(true);
    
    try {
      const params = extractReplayParams(values.url);
      
      if (!params?.token) {
        throw new Error("Token de replay não encontrado na URL");
      }
      
      // Extract roundID and envID from the HTML
      const gameConfig = await extractGameConfig(values.url);
      
      if (!gameConfig?.roundID || !gameConfig?.envID) {
        throw new Error("Não foi possível extrair os parâmetros do replay");
      }
      
      navigate(`/replay/${params.token}/${gameConfig.roundID}/${gameConfig.envID}`);
    } catch (error) {
      console.error("Erro ao processar URL do replay:", error);
      toast({
        title: "Erro ao processar URL",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Round ID form submission
  const handleRoundIdSubmit = async (values: z.infer<typeof roundIdSchema>) => {
    setLoading(true);
    
    try {
      // For Round ID only, we'll use a different route without token and envID
      navigate(`/replay/roundid/${values.roundId}`);
    } catch (error) {
      console.error("Erro ao processar ID da rodada:", error);
      toast({
        title: "Erro ao processar ID da rodada",
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
      
      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="url">URL do Replay</TabsTrigger>
          <TabsTrigger value="roundId">ID da Rodada</TabsTrigger>
        </TabsList>
        
        <TabsContent value="url">
          <Form {...urlForm}>
            <form onSubmit={urlForm.handleSubmit(handleUrlSubmit)} className="space-y-4">
              <FormField
                control={urlForm.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL do Replay</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: https://euioa.jxcsysekgu.net/5qGZRqiCxI"
                        className="input-search h-12"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-secondary h-12 text-white"
                disabled={loading}
              >
                {loading ? "Processando..." : "Analisar Replay"}
              </Button>
            </form>
          </Form>
        </TabsContent>
        
        <TabsContent value="roundId">
          <Form {...roundIdForm}>
            <form onSubmit={roundIdForm.handleSubmit(handleRoundIdSubmit)} className="space-y-4">
              <FormField
                control={roundIdForm.control}
                name="roundId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID da Rodada</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: 92665039135027"
                        className="input-search h-12"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-secondary h-12 text-white"
                disabled={loading}
              >
                {loading ? "Processando..." : "Analisar por ID"}
              </Button>
              
              <p className="text-xs text-gray-400 text-center mt-2">
                Nota: Análise por ID mostrará apenas métricas, sem o replay visual do jogo.
              </p>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default SearchForm;
