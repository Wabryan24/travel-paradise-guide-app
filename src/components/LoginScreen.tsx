
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MapPin, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export function LoginScreen() {
  const [email, setEmail] = useState('marie.dubois@travelparadise.com');
  const [password, setPassword] = useState('password123');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    const success = await login(email, password);
    
    if (!success) {
      toast.error('Email ou mot de passe incorrect');
    } else {
      toast.success('Connexion réussie !');
    }
  };

  return (
    <div className="mobile-container flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Logo et titre */}
        <div className="text-center space-y-4">
          <div className="gradient-bg w-20 h-20 rounded-full mx-auto flex items-center justify-center">
            <MapPin className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">TravelParadise</h1>
            <p className="text-gray-600 mt-2">Espace Guide</p>
          </div>
        </div>

        {/* Formulaire de connexion */}
        <Card className="glass-effect card-shadow">
          <CardHeader>
            <h2 className="text-xl font-semibold text-center">Connexion</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.email@travelparadise.com"
                  className="h-12"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 gradient-bg hover:opacity-90 transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Information de démonstration */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Démonstration:</strong></p>
              <p>Email: marie.dubois@travelparadise.com</p>
              <p>Mot de passe: password123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
