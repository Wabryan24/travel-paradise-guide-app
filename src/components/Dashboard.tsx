
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  LogOut,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  PlayCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { mockVisites } from '@/data/mockData';
import { Visite } from '@/types';
import { VisitDetail } from './VisitDetail';

export function Dashboard() {
  const { user, logout } = useAuth();
  const [selectedVisit, setSelectedVisit] = useState<Visite | null>(null);
  
  if (!user) return null;

  if (selectedVisit) {
    return <VisitDetail visit={selectedVisit} onBack={() => setSelectedVisit(null)} />;
  }

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'terminée':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />Terminée</Badge>;
      case 'en cours':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100"><PlayCircle className="w-3 h-3 mr-1" />En cours</Badge>;
      case 'à venir':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100"><AlertCircle className="w-3 h-3 mr-1" />À venir</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const visitesDuJour = mockVisites.filter(v => v.dateVisite === '2024-06-26');
  const visitesAVenir = mockVisites.filter(v => v.statut === 'à venir');
  const visitesTerminees = mockVisites.filter(v => v.statut === 'terminée');

  return (
    <div className="mobile-container">
      {/* Header avec profil */}
      <div className="gradient-bg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 border-2 border-white/20">
              <AvatarImage src={user.guide.photo} alt={user.guide.prenom} />
              <AvatarFallback className="bg-white/20 text-white">
                {user.guide.prenom[0]}{user.guide.nom[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">{user.guide.prenom} {user.guide.nom}</h2>
              <p className="text-white/80 text-sm flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {user.guide.paysAffectation}
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={logout}
            className="text-white hover:bg-white/20"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Statistiques rapides */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="card-shadow">
            <CardContent className="pt-4 pb-4 text-center">
              <div className="text-2xl font-bold text-travel-blue">{mockVisites.length}</div>
              <div className="text-xs text-gray-600">Total visites</div>
            </CardContent>
          </Card>
          <Card className="card-shadow">
            <CardContent className="pt-4 pb-4 text-center">
              <div className="text-2xl font-bold text-travel-green">{visitesDuJour.length}</div>
              <div className="text-xs text-gray-600">Aujourd'hui</div>
            </CardContent>
          </Card>
          <Card className="card-shadow">
            <CardContent className="pt-4 pb-4 text-center">
              <div className="text-2xl font-bold text-travel-orange">{visitesAVenir.length}</div>
              <div className="text-xs text-gray-600">À venir</div>
            </CardContent>
          </Card>
        </div>

        {/* Visite en cours */}
        {visitesDuJour.map(visite => visite.statut === 'en cours' && (
          <Card key={visite.id} className="card-shadow border-orange-200 bg-orange-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-orange-800">Visite en cours</CardTitle>
                {getStatusBadge(visite.statut)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <img 
                    src={visite.photo} 
                    alt={visite.lieuVisite}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{visite.lieuVisite}</h3>
                    <p className="text-sm text-gray-600 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {visite.pays}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    {visite.heureDebut} - {visite.heureFin}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-1" />
                    {visite.visiteurs.length} visiteurs
                  </div>
                </div>

                <Button 
                  className="w-full gradient-bg hover:opacity-90"
                  onClick={() => setSelectedVisit(visite)}
                >
                  Gérer la visite
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Toutes les visites */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-travel-blue" />
            Mes visites
          </h3>
          
          <div className="space-y-3">
            {mockVisites.map(visite => (
              <Card 
                key={visite.id} 
                className="card-shadow visit-card transition-all duration-200 cursor-pointer hover:shadow-lg"
                onClick={() => setSelectedVisit(visite)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={visite.photo} 
                      alt={visite.lieuVisite}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900 truncate">{visite.lieuVisite}</h4>
                        {getStatusBadge(visite.statut)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 space-x-4">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(visite.dateVisite)}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {visite.heureDebut}
                        </span>
                        <span className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {visite.visiteurs.length}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
