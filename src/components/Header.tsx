
import { Search } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-darkCharcoal border-b border-secondary/20 py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-primary rounded-full p-2">
            <Search className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold gradient-text">Replay Metrics</h1>
        </Link>
        
        <div className="text-sm text-gray-400">
          Visualize suas métricas de jogos
        </div>
      </div>
    </header>
  );
};

export default Header;
