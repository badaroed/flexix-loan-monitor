import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Shield, AlertTriangle } from "lucide-react";

interface DashboardStatsProps {
  totalCollateral: number;
  totalBorrowed: number;
  averageHealth: number;
  activeLoans: number;
}

export function DashboardStats({
  totalCollateral,
  totalBorrowed,
  averageHealth,
  activeLoans,
}: DashboardStatsProps) {
  const collateralRatio = totalCollateral > 0 ? (totalCollateral / totalBorrowed) : 0;
  const healthColor = averageHealth >= 1.5 ? "success" : averageHealth >= 1.2 ? "warning" : "danger";

  const stats = [
    {
      title: "Garantia Total",
      value: `$${totalCollateral.toLocaleString()}`,
      icon: DollarSign,
      trend: "+12.5%",
      trendUp: true,
      gradient: "from-primary/20 to-primary/5",
      iconColor: "text-primary",
    },
    {
      title: "Total Emprestado",
      value: `$${totalBorrowed.toLocaleString()}`,
      icon: TrendingDown,
      trend: "+5.2%",
      trendUp: true,
      gradient: "from-secondary/20 to-secondary/5",
      iconColor: "text-secondary-foreground",
    },
    {
      title: "Saúde Média",
      value: `${averageHealth.toFixed(2)}x`,
      icon: healthColor === "success" ? Shield : AlertTriangle,
      trend: healthColor === "danger" ? "Crítico" : "Saudável",
      trendUp: healthColor !== "danger",
      gradient: `from-${healthColor}/20 to-${healthColor}/5`,
      iconColor: `text-${healthColor}`,
    },
    {
      title: "Empréstimos Ativos",
      value: activeLoans.toString(),
      icon: TrendingUp,
      trend: "3 exchanges",
      trendUp: true,
      gradient: "from-accent/20 to-accent/5",
      iconColor: "text-accent-foreground",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className={`bg-gradient-to-br ${stat.gradient} border-border/50 shadow-card hover:shadow-glow transition-all duration-300`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground mb-1">
              {stat.value}
            </div>
            <div className={`flex items-center text-xs ${
              stat.trendUp ? "text-success" : "text-danger"
            }`}>
              {stat.trendUp ? (
                <TrendingUp className="mr-1 h-3 w-3" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3" />
              )}
              {stat.trend}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}