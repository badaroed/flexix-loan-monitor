import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, TrendingUp, Shield, BarChart3, Users, Zap } from "lucide-react";
import { LoginForm } from "@/components/ui/login-form";
import { LanguageSelector } from "@/components/ui/language-selector";
import { useLanguage } from "@/contexts/LanguageContext";
import Dashboard from "./Dashboard";
const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  if (isAuthenticated) {
    return <Dashboard />;
  }
  if (showLogin) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <div className="w-full max-w-md">
          <Button variant="ghost" onClick={() => setShowLogin(false)} className="mb-4">
            ← {t('landing.back')}
          </Button>
          <LoginForm />
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">{t('landing.title')}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <LanguageSelector />
          <Button onClick={() => setShowLogin(true)}>
            {t('landing.login')}
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge className="mb-6" variant="secondary">
          {t('badge.monitoring')}
        </Badge>
        <h2 className="text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
          {t('landing.subtitle')}
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          {t('landing.description')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => setShowLogin(true)}>
            {t('landing.signup')}
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/demo")}>
            {t('landing.demo')}
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold text-center mb-12">
          {t('features.title')}
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>{t('features.analytics.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('features.analytics.description')}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>{t('features.alerts.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('features.alerts.description')}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>{t('features.integration.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('features.integration.description')}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">{t('pricing.title')}</h3>
          <p className="text-muted-foreground">
            {t('pricing.subtitle')}
          </p>
        </div>
        
        <div className="max-w-md mx-auto">
          <Card className="relative border-primary shadow-lg">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
              {t('pricing.popular')}
            </Badge>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl">{t('pricing.premium')}</CardTitle>
              <CardDescription>{t('pricing.premium.description')}</CardDescription>
              <div className="mt-4">
                <span className="text-5xl font-bold">{t('pricing.price')}</span>
                <span className="text-muted-foreground">{t('pricing.month')}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>{t('pricing.feature1')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>{t('pricing.feature2')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>{t('pricing.feature3')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>{t('pricing.feature4')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>{t('pricing.feature5')}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg" onClick={() => setShowLogin(true)}>
                {t('pricing.cta')}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="font-semibold">{t('landing.title')}</span>
          </div>
          <p className="text-muted-foreground">{t('footer.rights')}</p>
        </div>
      </footer>
    </div>;
};
export default Index;