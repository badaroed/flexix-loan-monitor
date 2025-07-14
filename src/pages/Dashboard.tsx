import { useState } from "react";
import { Navigation } from "@/components/ui/navigation";
import { DashboardStats } from "@/components/ui/dashboard-stats";
import { LoanCard } from "@/components/ui/loan-card";
import { SettingsPanel } from "@/components/ui/settings-panel";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus, BarChart3 } from "lucide-react";

// Mock data for demonstration
const mockLoans = [
  {
    exchange: "Binance",
    collateralAsset: "BTC",
    collateralAmount: 2.5,
    borrowedAsset: "USDT",
    borrowedAmount: 50000,
    healthRatio: 2.3,
    liquidationPrice: 42000,
    currentPrice: 67000,
  },
  {
    exchange: "Bybit",
    collateralAsset: "ETH",
    collateralAmount: 15.8,
    borrowedAsset: "USDC",
    borrowedAmount: 35000,
    currentPrice: 3200,
    healthRatio: 1.8,
    liquidationPrice: 2100,
  },
  {
    exchange: "Aave",
    collateralAsset: "WETH",
    collateralAmount: 8.2,
    borrowedAsset: "DAI",
    borrowedAmount: 18000,
    healthRatio: 1.15,
    liquidationPrice: 2800,
    currentPrice: 3200,
  },
];

const mockStats = {
  totalCollateral: 285000,
  totalBorrowed: 103000,
  averageHealth: 1.75,
  activeLoans: 3,
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "settings":
        return <SettingsPanel />;
      
      case "loans":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Empréstimos Ativos
                </h2>
                <p className="text-muted-foreground">
                  Gerencie e monitore todos os seus empréstimos colateralizados
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  <span>Sincronizar</span>
                </Button>
                <Button className="bg-gradient-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Conexão
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockLoans.map((loan, index) => (
                <LoanCard key={index} {...loan} />
              ))}
            </div>
          </div>
        );
      
      default:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Dashboard
                </h2>
                <p className="text-muted-foreground">
                  Visão geral dos seus empréstimos e indicadores de saúde
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  <span>Sincronizar</span>
                </Button>
                <Button className="bg-gradient-primary">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Relatório
                </Button>
              </div>
            </div>

            <DashboardStats {...mockStats} />

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">
                Empréstimos por Exchange
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockLoans.map((loan, index) => (
                  <LoanCard key={index} {...loan} />
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="container mx-auto px-6 py-8">
        {renderContent()}
      </main>
    </div>
  );
}