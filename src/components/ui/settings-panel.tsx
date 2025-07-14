import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Key, 
  Shield, 
  Bell, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  CheckCircle,
  AlertTriangle,
  Smartphone
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface APIKey {
  id: string;
  exchange: string;
  name: string;
  status: "active" | "inactive" | "error";
  lastSync: string;
}

export function SettingsPanel() {
  const [showApiKeys, setShowApiKeys] = useState<{ [key: string]: boolean }>({});
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: "1",
      exchange: "Binance",
      name: "API Key Principal",
      status: "active",
      lastSync: "2 min atrás"
    },
    {
      id: "2",
      exchange: "Bybit",
      name: "API Key Trading",
      status: "active",
      lastSync: "5 min atrás"
    }
  ]);
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    telegram: false,
    liquidationRisk: true,
    healthWarning: true,
    dailyReport: false
  });

  const { toast } = useToast();

  const toggleApiKeyVisibility = (keyId: string) => {
    setShowApiKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const addApiKey = () => {
    toast({
      title: "Adicionar API Key",
      description: "Funcionalidade em desenvolvimento",
    });
  };

  const deleteApiKey = (keyId: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== keyId));
    toast({
      title: "API Key removida",
      description: "A chave foi removida com sucesso",
    });
  };

  const testConnection = (exchange: string) => {
    toast({
      title: "Testando conexão...",
      description: `Verificando conectividade com ${exchange}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "success";
      case "inactive": return "secondary";
      case "error": return "destructive";
      default: return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return CheckCircle;
      case "error": return AlertTriangle;
      default: return Shield;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Configurações</h2>
        <p className="text-muted-foreground">
          Gerencie suas API keys, notificações e preferências de segurança
        </p>
      </div>

      <Tabs defaultValue="api-keys" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="api-keys" className="space-y-6">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    Chaves de API
                  </CardTitle>
                  <CardDescription>
                    Gerencie as conexões com exchanges e protocolos DeFi
                  </CardDescription>
                </div>
                <Button onClick={addApiKey} className="bg-gradient-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {apiKeys.map((apiKey) => {
                const StatusIcon = getStatusIcon(apiKey.status);
                return (
                  <div
                    key={apiKey.id}
                    className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-muted rounded-lg">
                        <Key className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{apiKey.exchange}</h4>
                        <p className="text-sm text-muted-foreground">{apiKey.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Última sincronização: {apiKey.lastSync}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Badge 
                        variant={getStatusColor(apiKey.status) === "success" ? "default" : "destructive"}
                        className="flex items-center gap-1"
                      >
                        <StatusIcon className="w-3 h-3" />
                        {apiKey.status === "active" ? "Ativa" : 
                         apiKey.status === "error" ? "Erro" : "Inativa"}
                      </Badge>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testConnection(apiKey.exchange)}
                      >
                        Testar
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteApiKey(apiKey.id)}
                        className="text-danger hover:text-danger"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}

              <div className="p-4 bg-muted/50 rounded-lg border border-dashed border-border">
                <div className="text-center">
                  <Key className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <h4 className="font-medium text-foreground mb-1">Adicionar Nova Exchange</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Conecte Aave, KuCoin ou outras exchanges suportadas
                  </p>
                  <Button variant="outline" onClick={addApiKey}>
                    <Plus className="w-4 h-4 mr-2" />
                    Conectar Exchange
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notificações
              </CardTitle>
              <CardDescription>
                Configure quando e como receber alertas sobre seus empréstimos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-foreground">Canais de Notificação</h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">E-mail</Label>
                    <p className="text-xs text-muted-foreground">
                      Receba alertas por e-mail
                    </p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) =>
                      setNotifications(prev => ({ ...prev, email: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Push Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Notificações no navegador
                    </p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) =>
                      setNotifications(prev => ({ ...prev, push: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Telegram</Label>
                    <p className="text-xs text-muted-foreground">
                      Alertas via Telegram Bot
                    </p>
                  </div>
                  <Switch
                    checked={notifications.telegram}
                    onCheckedChange={(checked) =>
                      setNotifications(prev => ({ ...prev, telegram: checked }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/50">
                <h4 className="text-sm font-medium text-foreground">Tipos de Alerta</h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Risco de Liquidação</Label>
                     <p className="text-xs text-muted-foreground">
                       Quando health ratio &lt; 1.3x
                     </p>
                  </div>
                  <Switch
                    checked={notifications.liquidationRisk}
                    onCheckedChange={(checked) =>
                      setNotifications(prev => ({ ...prev, liquidationRisk: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Aviso de Saúde</Label>
                     <p className="text-xs text-muted-foreground">
                       Quando health ratio &lt; 1.5x
                     </p>
                  </div>
                  <Switch
                    checked={notifications.healthWarning}
                    onCheckedChange={(checked) =>
                      setNotifications(prev => ({ ...prev, healthWarning: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Relatório Diário</Label>
                    <p className="text-xs text-muted-foreground">
                      Resumo diário às 8h
                    </p>
                  </div>
                  <Switch
                    checked={notifications.dailyReport}
                    onCheckedChange={(checked) =>
                      setNotifications(prev => ({ ...prev, dailyReport: checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Segurança
              </CardTitle>
              <CardDescription>
                Configurações de segurança e autenticação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-foreground">Autenticação de Dois Fatores</h4>
                
                <div className="flex items-center justify-between p-4 bg-success/10 border border-success/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-success/20 rounded-lg">
                      <Smartphone className="w-4 h-4 text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-success">2FA Ativado</p>
                      <p className="text-xs text-muted-foreground">
                        Configurado via Google Authenticator
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Reconfigurar
                  </Button>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/50">
                <h4 className="text-sm font-medium text-foreground">Sessão e Acesso</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Logout Automático</Label>
                      <p className="text-xs text-muted-foreground">
                        Encerrar sessão após inatividade
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Lembrar Dispositivo</Label>
                      <p className="text-xs text-muted-foreground">
                        Não solicitar 2FA por 30 dias
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Alterar Senha</h4>
                    <p className="text-xs text-muted-foreground">
                      Última alteração: há 2 meses
                    </p>
                  </div>
                  <Button variant="outline">
                    Alterar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}