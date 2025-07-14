import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingDown, TrendingUp, AlertTriangle, Shield } from "lucide-react";

interface LoanCardProps {
  exchange: string;
  collateralAsset: string;
  collateralAmount: number;
  borrowedAsset: string;
  borrowedAmount: number;
  healthRatio: number;
  liquidationPrice: number;
  currentPrice: number;
}

export function LoanCard({
  exchange,
  collateralAsset,
  collateralAmount,
  borrowedAsset,
  borrowedAmount,
  healthRatio,
  liquidationPrice,
  currentPrice,
}: LoanCardProps) {
  const getHealthColor = (ratio: number) => {
    if (ratio >= 1.5) return "success";
    if (ratio >= 1.2) return "warning";
    return "danger";
  };

  const getHealthIcon = (ratio: number) => {
    if (ratio >= 1.5) return Shield;
    if (ratio >= 1.2) return TrendingDown;
    return AlertTriangle;
  };

  const healthColor = getHealthColor(healthRatio);
  const HealthIcon = getHealthIcon(healthRatio);
  const healthPercentage = Math.min((healthRatio / 2) * 100, 100);

  const getExchangeColor = (exchange: string) => {
    switch (exchange.toLowerCase()) {
      case "binance":
        return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/30";
      case "bybit":
        return "bg-gradient-to-r from-orange-500/20 to-orange-600/20 border-orange-500/30";
      case "aave":
        return "bg-gradient-to-r from-purple-500/20 to-purple-600/20 border-purple-500/30";
      default:
        return "bg-gradient-card border-border";
    }
  };

  return (
    <Card className={`${getExchangeColor(exchange)} shadow-card hover:shadow-glow transition-all duration-300`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{exchange}</CardTitle>
          <Badge 
            variant={healthColor === "success" ? "default" : "destructive"}
            className={`${
              healthColor === "success" 
                ? "bg-success text-success-foreground" 
                : healthColor === "warning"
                  ? "bg-warning text-warning-foreground"
                  : "bg-danger text-danger-foreground"
            }`}
          >
            <HealthIcon className="w-3 h-3 mr-1" />
            {healthRatio.toFixed(2)}x
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Collateral Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Garantia</span>
            <span className="font-medium">
              {collateralAmount.toLocaleString()} {collateralAsset}
            </span>
          </div>
        </div>

        {/* Borrowed Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Emprestado</span>
            <span className="font-medium">
              {borrowedAmount.toLocaleString()} {borrowedAsset}
            </span>
          </div>
        </div>

        {/* Health Ratio Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Saúde do Empréstimo</span>
            <span className="font-medium">
              {(healthPercentage).toFixed(0)}%
            </span>
          </div>
          <Progress 
            value={healthPercentage} 
            className={`h-2 ${
              healthColor === "success" 
                ? "[&>div]:bg-success" 
                : healthColor === "warning"
                  ? "[&>div]:bg-warning"
                  : "[&>div]:bg-danger"
            }`}
          />
        </div>

        {/* Price Information */}
        <div className="pt-2 border-t border-border/50">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-muted-foreground">Preço Atual</span>
              <p className="font-semibold text-foreground">
                ${currentPrice.toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Liquidação</span>
              <p className={`font-semibold ${
                currentPrice <= liquidationPrice * 1.1 ? "text-danger" : "text-foreground"
              }`}>
                ${liquidationPrice.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Risk Indicator */}
        {healthRatio < 1.3 && (
          <div className="flex items-center gap-2 p-2 bg-danger/10 border border-danger/20 rounded-md">
            <AlertTriangle className="w-4 h-4 text-danger" />
            <span className="text-xs text-danger font-medium">
              Risco elevado de liquidação
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}