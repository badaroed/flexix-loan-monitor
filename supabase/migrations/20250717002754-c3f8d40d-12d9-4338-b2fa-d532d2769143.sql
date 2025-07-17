-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create exchanges table
CREATE TABLE public.exchanges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  icon_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_exchange_connections table for API keys
CREATE TABLE public.user_exchange_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exchange_id UUID NOT NULL REFERENCES public.exchanges(id),
  api_key_encrypted TEXT NOT NULL,
  api_secret_encrypted TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, exchange_id)
);

-- Create loans table
CREATE TABLE public.loans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exchange_id UUID NOT NULL REFERENCES public.exchanges(id),
  external_loan_id TEXT NOT NULL,
  collateral_asset TEXT NOT NULL,
  collateral_amount DECIMAL(20,8) NOT NULL,
  borrowed_asset TEXT NOT NULL,
  borrowed_amount DECIMAL(20,8) NOT NULL,
  collateral_value_usd DECIMAL(15,2) NOT NULL,
  borrowed_value_usd DECIMAL(15,2) NOT NULL,
  health_ratio DECIMAL(5,2) NOT NULL,
  liquidation_threshold DECIMAL(5,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, exchange_id, external_loan_id)
);

-- Create loan_history table for charts
CREATE TABLE public.loan_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  loan_id UUID NOT NULL REFERENCES public.loans(id) ON DELETE CASCADE,
  collateral_value_usd DECIMAL(15,2) NOT NULL,
  borrowed_value_usd DECIMAL(15,2) NOT NULL,
  health_ratio DECIMAL(5,2) NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create alerts table
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  loan_id UUID REFERENCES public.loans(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  threshold_value DECIMAL(5,2),
  is_active BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default exchanges
INSERT INTO public.exchanges (name, display_name, icon_url) VALUES
('binance', 'Binance', '/icons/binance.svg'),
('bybit', 'Bybit', '/icons/bybit.svg'),
('aave', 'Aave', '/icons/aave.svg');

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_exchange_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for user_exchange_connections
CREATE POLICY "Users can view their own connections" 
ON public.user_exchange_connections 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own connections" 
ON public.user_exchange_connections 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own connections" 
ON public.user_exchange_connections 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own connections" 
ON public.user_exchange_connections 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for loans
CREATE POLICY "Users can view their own loans" 
ON public.loans 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own loans" 
ON public.loans 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own loans" 
ON public.loans 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for loan_history
CREATE POLICY "Users can view their loan history" 
ON public.loan_history 
FOR SELECT 
USING (auth.uid() = (SELECT user_id FROM public.loans WHERE id = loan_id));

CREATE POLICY "Users can create loan history" 
ON public.loan_history 
FOR INSERT 
WITH CHECK (auth.uid() = (SELECT user_id FROM public.loans WHERE id = loan_id));

-- Create RLS policies for alerts
CREATE POLICY "Users can view their own alerts" 
ON public.alerts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own alerts" 
ON public.alerts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alerts" 
ON public.alerts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own alerts" 
ON public.alerts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Make exchanges table public (read-only for authenticated users)
CREATE POLICY "Authenticated users can view exchanges" 
ON public.exchanges 
FOR SELECT 
TO authenticated 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_exchange_connections_updated_at
BEFORE UPDATE ON public.user_exchange_connections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_loans_updated_at
BEFORE UPDATE ON public.loans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_alerts_updated_at
BEFORE UPDATE ON public.alerts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name', NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_loans_user_id ON public.loans(user_id);
CREATE INDEX idx_loan_history_loan_id ON public.loan_history(loan_id);
CREATE INDEX idx_loan_history_recorded_at ON public.loan_history(recorded_at);
CREATE INDEX idx_user_exchange_connections_user_id ON public.user_exchange_connections(user_id);
CREATE INDEX idx_alerts_user_id ON public.alerts(user_id);