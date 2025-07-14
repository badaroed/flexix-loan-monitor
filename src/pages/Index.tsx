import { useState } from "react";
import { LoginForm } from "@/components/ui/login-form";
import Dashboard from "./Dashboard";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return <LoginForm />;
};

export default Index;
