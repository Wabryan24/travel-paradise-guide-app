
import { useAuth } from '@/hooks/useAuth';
import { useVisites } from '@/hooks/useVisites';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, MapPin, Users, LogOut } from 'lucide-react';
import { VisitDetail } from './VisitDetail';
import { useState } from 'react';
import { Visite } from '@/types';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const { data: visites = [], isLoading, error } = useVisites();
  const [selectedVisite, setSelectedVisite] = useState<Visite | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement des visites...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Erreur lors du chargement des données</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  if (selectedVisite) {
    return (
      <VisitDetail 
        visite={selectedVisite} 
        onBack={() => setSelectedVisite(null)} 
      />
    );
  }

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'terminée': return 'bg-green-100 text-green-800';
      case 'en cours': return 'bg-blue-100 text-blue-800';
      case 'à venir': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">TravelParadise</h1>
              <span className="text-gray-500">Dashboard Guide</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={user?.guide.photo} alt={user?.guide.prenom} />
                  <AvatarFallback>
                    {user?.guide.prenom?.[0]}{user?.guide.nom?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">
                    {user?.guide.prenom} {user?.guide.nom}
                  </p>
                  <p className="text-gray-500">{user?.guide.paysAffectation}</p>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Déconnexion</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Mes Visites</h2>
          <p className="text-gray-600">Gérez vos visites guidées et suivez les présences</p>
        </div>

        {visites.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune visite programmée</h3>
              <p className="text-gray-500">Vos prochaines visites apparaîtront ici.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visites.map((visite) => (
              <Card 
                key={visite.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedVisite(visite)}
              >
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <img
                    src={visite.photo}
                    alt={visite.lieuVisite}
                    className="w-full h-full object-cover"
                  />
                  <Badge 
                    className={`absolute top-3 right-3 ${getStatutColor(visite.statut)}`}
                  >
                    {visite.statut}
                  </Badge>
                </div>
                
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{visite.lieuVisite}</span>
                  </CardTitle>
                  <CardDescription>{visite.pays}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(visite.dateVisite).toLocaleDateString('fr-FR')}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{visite.heureDebut} - {visite.heureFin} ({visite.duree}h)</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>
                        {visite.visiteurs.filter(v => v.present).length}/{visite.visiteurs.length} présents
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
