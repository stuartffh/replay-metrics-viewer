
import React from 'react';
import Header from '@/components/Header';
import SearchForm from '@/components/SearchForm';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-darkPurple">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-4xl w-full text-center mb-10 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4 gradient-text">
            Replay Metrics Viewer
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Visualize e analise métricas detalhadas dos seus replays de jogos de apostas
          </p>
        </div>
        
        <div className="w-full animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <SearchForm />
        </div>
        
        <div className="mt-16 text-center text-gray-400 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-xl font-bold mb-4">Como funciona</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-4">
              <div className="mb-2 flex justify-center">
                <div className="bg-secondary/20 rounded-full p-3 w-12 h-12 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">1</span>
                </div>
              </div>
              <h4 className="text-lg font-bold text-gray-300 mb-2">Cole o link</h4>
              <p>Insira o URL completo do replay que você deseja analisar</p>
            </div>
            <div className="p-4">
              <div className="mb-2 flex justify-center">
                <div className="bg-secondary/20 rounded-full p-3 w-12 h-12 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">2</span>
                </div>
              </div>
              <h4 className="text-lg font-bold text-gray-300 mb-2">Analise</h4>
              <p>Nosso sistema processa automaticamente os dados do replay</p>
            </div>
            <div className="p-4">
              <div className="mb-2 flex justify-center">
                <div className="bg-secondary/20 rounded-full p-3 w-12 h-12 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">3</span>
                </div>
              </div>
              <h4 className="text-lg font-bold text-gray-300 mb-2">Visualize</h4>
              <p>Veja estatísticas detalhadas e o replay lado a lado</p>
            </div>
          </div>
        </div>
      </main>
      <footer className="py-4 text-center text-gray-400 border-t border-secondary/20">
        <p>Replay Metrics Viewer © 2023</p>
      </footer>
    </div>
  );
};

export default HomePage;
