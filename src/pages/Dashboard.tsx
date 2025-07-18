import { useState } from "react";
import { Navigate, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Navigation } from "@/components/ui/navigation";
import { DashboardStats } from "@/components/ui/dashboard-stats";
import { LoanCard } from "@/components/ui/loan-card";
import { SettingsPanel } from "@/components/ui/settings-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { RefreshCw, Plus, BarChart3, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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

// Mock data for health tracking charts
const generateHealthData = (period: string) => {
  const now = new Date();
  const data = [];
  
  if (period === "daily") {
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        health: 1.5 + Math.random() * 1.0,
        collateral: 280000 + (Math.random() - 0.5) * 20000,
        debt: 100000 + (Math.random() - 0.5) * 10000,
      });
    }
  } else if (period === "weekly") {
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - (i * 7));
      data.push({
        date: `Sem ${12 - i}`,
        health: 1.5 + Math.random() * 1.0,
        collateral: 280000 + (Math.random() - 0.5) * 30000,
        debt: 100000 + (Math.random() - 0.5) * 15000,
      });
    }
  } else {
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      data.push({
        date: date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
        health: 1.5 + Math.random() * 1.0,
        collateral: 280000 + (Math.random() - 0.5) * 50000,
        debt: 100000 + (Math.random() - 0.5) * 25000,
      });
    }
  }
  
  return data;
};

// Dashboard Overview Component
function DashboardOverview() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { t } = useLanguage();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            {t('dashboard.title')}
          </h2>
          <p className="text-muted-foreground">
            {t('dashboard.subtitle')}
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
            <span>{t('dashboard.sync')}</span>
          </Button>
          <Button className="bg-gradient-primary">
            <BarChart3 className="w-4 h-4 mr-2" />
            {t('dashboard.report')}
          </Button>
        </div>
      </div>

      <DashboardStats {...mockStats} />

      {/* Health Tracking Chart */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <CardTitle className="text-foreground">{t('dashboard.health.title')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="daily" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="daily">{t('dashboard.health.daily')}</TabsTrigger>
              <TabsTrigger value="weekly">{t('dashboard.health.weekly')}</TabsTrigger>
              <TabsTrigger value="monthly">{t('dashboard.health.monthly')}</TabsTrigger>
            </TabsList>
            
            {["daily", "weekly", "monthly"].map((period) => (
              <TabsContent key={period} value={period} className="space-y-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={generateHealthData(period)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="date" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        domain={[1, 3]}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--popover-foreground))"
                        }}
                        formatter={(value: number, name: string) => [
                          name === 'health' ? value.toFixed(2) : `$${value.toLocaleString()}`,
                          name === 'health' ? t('dashboard.health.average') : name === 'collateral' ? t('loan.collateral') : t('loan.borrowed')
                        ]}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="health" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3}
                        dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                        name="health"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">{t('dashboard.health.average')}</p>
                    <p className="text-2xl font-bold text-primary">
                      {(generateHealthData(period).reduce((acc, item) => acc + item.health, 0) / generateHealthData(period).length).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">{t('dashboard.health.highest')}</p>
                    <p className="text-2xl font-bold text-success">
                      {Math.max(...generateHealthData(period).map(item => item.health)).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">{t('dashboard.health.lowest')}</p>
                    <p className="text-2xl font-bold text-warning">
                      {Math.min(...generateHealthData(period).map(item => item.health)).toFixed(2)}
                    </p>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">
          {t('dashboard.loans.by.exchange')}
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

// Loans Page Component
function LoansPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { t } = useLanguage();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            {t('loans.title')}
          </h2>
          <p className="text-muted-foreground">
            {t('loans.subtitle')}
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
            <span>{t('dashboard.sync')}</span>
          </Button>
          <Button className="bg-gradient-primary">
            <Plus className="w-4 h-4 mr-2" />
            {t('loans.new.connection')}
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
}

// Settings Page Component
function SettingsPage() {
  return <SettingsPanel />;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Simulate authentication check
  const isAuthenticated = true; // This should come from auth context
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Determine active tab from current route
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/emprestimos')) return 'loans';
    if (path.includes('/configuracoes')) return 'settings';
    return 'dashboard';
  };

  const handleTabChange = (tab: string) => {
    switch (tab) {
      case 'loans':
        navigate('/dashboard/emprestimos');
        break;
      case 'settings':
        navigate('/dashboard/configuracoes');
        break;
      default:
        navigate('/dashboard');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={getActiveTab()} onTabChange={handleTabChange} />
      
      <main className="container mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<DashboardOverview />} />
          <Route path="/emprestimos" element={<LoansPage />} />
          <Route path="/configuracoes" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  );
}