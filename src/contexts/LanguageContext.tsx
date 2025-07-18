import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'pt' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  pt: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.loans': 'Empréstimos',
    'nav.settings': 'Configurações',
    
    // Landing Page
    'landing.title': 'Flexix',
    'landing.subtitle': 'Monitore seus Empréstimos DeFi em Tempo Real',
    'landing.description': 'Acompanhe, analise e gerencie todos os seus empréstimos descentralizados em uma única plataforma. Receba alertas inteligentes e tome decisões informadas.',
    'landing.login': 'Entrar',
    'landing.signup': 'Começar Agora',
    'landing.demo': 'Ver Demo',
    'landing.back': 'Voltar',
    
    // Features
    'features.title': 'Por que escolher o Flexix?',
    'features.analytics.title': 'Analytics Avançados',
    'features.analytics.description': 'Visualize dados detalhados dos seus empréstimos com gráficos interativos',
    'features.alerts.title': 'Alertas Inteligentes',
    'features.alerts.description': 'Receba notificações sobre liquidações, vencimentos e oportunidades',
    'features.integration.title': 'Integração Completa',
    'features.integration.description': 'Conecte-se com Binance, Bybit, Aave e outras principais exchanges',
    
    // Pricing
    'pricing.title': 'Plano Simples e Transparente',
    'pricing.subtitle': 'Acesso completo a todas as funcionalidades por um preço justo',
    'pricing.popular': 'Mais Popular',
    'pricing.premium': 'Plano Premium',
    'pricing.premium.description': 'Acesso total à plataforma',
    'pricing.price': 'R$ 27,90',
    'pricing.month': '/mês',
    'pricing.feature1': 'Monitoramento ilimitado de empréstimos',
    'pricing.feature2': 'Alertas em tempo real',
    'pricing.feature3': 'Analytics avançados',
    'pricing.feature4': 'Integração com todas as exchanges',
    'pricing.feature5': 'Suporte prioritário',
    'pricing.cta': 'Começar Teste Gratuito',
    
    // Footer
    'footer.rights': '© 2025 Flexix. Todos os direitos reservados.',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.subtitle': 'Visão geral dos seus empréstimos e indicadores de saúde',
    'dashboard.sync': 'Sincronizar',
    'dashboard.report': 'Relatório',
    'dashboard.health.title': 'Acompanhamento da Saúde',
    'dashboard.health.daily': 'Diário',
    'dashboard.health.weekly': 'Semanal',
    'dashboard.health.monthly': 'Mensal',
    'dashboard.health.average': 'Saúde Média',
    'dashboard.health.highest': 'Maior Saúde',
    'dashboard.health.lowest': 'Menor Saúde',
    'dashboard.loans.by.exchange': 'Empréstimos por Exchange',
    
    // Loans
    'loans.title': 'Empréstimos Ativos',
    'loans.subtitle': 'Gerencie e monitore todos os seus empréstimos colateralizados',
    'loans.new.connection': 'Nova Conexão',
    
    // Demo
    'demo.mode': 'Modo Demo',
    'demo.description': 'Esta é uma versão demonstrativa da plataforma Flexix',
    'demo.back.home': 'Voltar à Home',
    'demo.settings.title': 'Configurações',
    'demo.settings.description': 'Área de configurações da plataforma (disponível na versão completa)',
    
    // Stats
    'stats.total.collateral': 'Garantia Total',
    'stats.total.borrowed': 'Emprestado Total',
    'stats.average.health': 'Saúde Média',
    'stats.active.loans': 'Empréstimos Ativos',
    
    // Common
    'common.loading': 'Carregando...',
    'common.error': 'Erro',
    'common.success': 'Sucesso',
    'common.cancel': 'Cancelar',
    'common.save': 'Salvar',
    'common.delete': 'Excluir',
    'common.edit': 'Editar',
    'common.close': 'Fechar',
    
    // Loan Card
    'loan.health.ratio': 'Razão de Saúde',
    'loan.liquidation.price': 'Preço de Liquidação',
    'loan.current.price': 'Preço Atual',
    'loan.collateral': 'Garantia',
    'loan.borrowed': 'Emprestado',
    
    // Badges
    'badge.monitoring': 'Monitoramento Inteligente',
  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.loans': 'Loans',
    'nav.settings': 'Settings',
    
    // Landing Page
    'landing.title': 'Flexix',
    'landing.subtitle': 'Monitor your DeFi Loans in Real Time',
    'landing.description': 'Track, analyze and manage all your decentralized loans in one platform. Get smart alerts and make informed decisions.',
    'landing.login': 'Login',
    'landing.signup': 'Get Started',
    'landing.demo': 'View Demo',
    'landing.back': 'Back',
    
    // Features
    'features.title': 'Why choose Flexix?',
    'features.analytics.title': 'Advanced Analytics',
    'features.analytics.description': 'Visualize detailed data of your loans with interactive charts',
    'features.alerts.title': 'Smart Alerts',
    'features.alerts.description': 'Receive notifications about liquidations, expirations and opportunities',
    'features.integration.title': 'Complete Integration',
    'features.integration.description': 'Connect with Binance, Bybit, Aave and other major exchanges',
    
    // Pricing
    'pricing.title': 'Simple and Transparent Plan',
    'pricing.subtitle': 'Full access to all features for a fair price',
    'pricing.popular': 'Most Popular',
    'pricing.premium': 'Premium Plan',
    'pricing.premium.description': 'Full platform access',
    'pricing.price': '$4.99',
    'pricing.month': '/month',
    'pricing.feature1': 'Unlimited loan monitoring',
    'pricing.feature2': 'Real-time alerts',
    'pricing.feature3': 'Advanced analytics',
    'pricing.feature4': 'Integration with all exchanges',
    'pricing.feature5': 'Priority support',
    'pricing.cta': 'Start Free Trial',
    
    // Footer
    'footer.rights': '© 2025 Flexix. All rights reserved.',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.subtitle': 'Overview of your loans and health indicators',
    'dashboard.sync': 'Sync',
    'dashboard.report': 'Report',
    'dashboard.health.title': 'Health Tracking',
    'dashboard.health.daily': 'Daily',
    'dashboard.health.weekly': 'Weekly',
    'dashboard.health.monthly': 'Monthly',
    'dashboard.health.average': 'Average Health',
    'dashboard.health.highest': 'Highest Health',
    'dashboard.health.lowest': 'Lowest Health',
    'dashboard.loans.by.exchange': 'Loans by Exchange',
    
    // Loans
    'loans.title': 'Active Loans',
    'loans.subtitle': 'Manage and monitor all your collateralized loans',
    'loans.new.connection': 'New Connection',
    
    // Demo
    'demo.mode': 'Demo Mode',
    'demo.description': 'This is a demo version of the Flexix platform',
    'demo.back.home': 'Back to Home',
    'demo.settings.title': 'Settings',
    'demo.settings.description': 'Platform settings area (available in full version)',
    
    // Stats
    'stats.total.collateral': 'Total Collateral',
    'stats.total.borrowed': 'Total Borrowed',
    'stats.average.health': 'Average Health',
    'stats.active.loans': 'Active Loans',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.close': 'Close',
    
    // Loan Card
    'loan.health.ratio': 'Health Ratio',
    'loan.liquidation.price': 'Liquidation Price',
    'loan.current.price': 'Current Price',
    'loan.collateral': 'Collateral',
    'loan.borrowed': 'Borrowed',
    
    // Badges
    'badge.monitoring': 'Smart Monitoring',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('pt');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'pt' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}