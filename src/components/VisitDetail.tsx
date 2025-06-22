
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Users, 
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  UserCheck
} from 'lucide-react';
import { Visite, Visiteur } from '@/types';
import { toast } from 'sonner';

interface VisitDetailProps {
  visit: Visite;
  onBack: () => void;
}

export function VisitDetail({ visit, onBack }: VisitDetailProps) {
  const [visiteurs, setVisiteurs] = useState<Visiteur[]>(visit.visiteurs);
  const [commentaireGeneral, setCommentaireGeneral] = useState(visit.commentaireVisite);
  const [commentairesIndividuels, setCommentairesIndividuels] = useState<{[key: string]: string}>(() => {
    const comments: {[key: string]: string} = {};
    visit.visiteurs.forEach(v => {
      comments[v.id] = v.commentaire;
    });
    return comments;
  });

  const handlePresenceChange = (visiteurId: string, present: boolean) => {
    setVisiteurs(prev => prev.map(v => 
      v.id === visiteurId ? { ...v, present } : v
    ));
  };

  const handleCommentChange = (visiteurId: string, commentaire: string) => {
    setCommentairesIndividuels(prev => ({
      ...prev,
      [visiteurId]: commentaire
    }));
  };

  const handleTerminerVisite = () => {
    // Ici on sauvegarderait les données
    toast.success('Visite marquée comme terminée !');
    onBack();
  };

  const handleSauvegarder = () => {
    // Sauvegarder les présences et commentaires
    toast.success('Informations sauvegardées !');
  };

  const presentsCount = visiteurs.filter(v => v.present).length;
  const tauxPresence = Math.round((presentsCount / visiteurs.length) * 100);

  const getStatusIcon = () => {
    switch (visit.statut) {
      case 'terminée':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'en cours':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      default:
        return <Clock className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="mobile-container">
      {/* Header */}
      <div className="gradient-bg p-4 text-white">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">{visit.lieuVisite}</h1>
            <p className="text-white/80 text-sm flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {visit.pays}
            </p>
          </div>
          {getStatusIcon()}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Informations générales */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-travel-blue" />
              <span>Informations de la visite</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <img 
              src={visit.photo} 
              alt={visit.lieuVisite}
              className="w-full h-32 rounded-lg object-cover"
            />
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Date:</span>
                <p className="font-medium">{new Date(visit.dateVisite).toLocaleDateString('fr-FR')}</p>
              </div>
              <div>
                <span className="text-gray-600">Horaire:</span>
                <p className="font-medium">{visit.heureDebut} - {visit.heureFin}</p>
              </div>
              <div>
                <span className="text-gray-600">Durée:</span>
                <p className="font-medium">{visit.duree}h</p>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <Badge className="mt-1">
                  {visit.statut.charAt(0).toUpperCase() + visit.statut.slice(1)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques présence */}
        <Card className="card-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="text-2xl font-bold text-travel-green">{presentsCount}</div>
                <div className="text-xs text-gray-600">Présents</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400">{visiteurs.length - presentsCount}</div>
                <div className="text-xs text-gray-600">Absents</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-travel-blue">{tauxPresence}%</div>
                <div className="text-xs text-gray-600">Taux présence</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des visiteurs */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-travel-blue" />
              <span>Appel des visiteurs ({visiteurs.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {visiteurs.map((visiteur, index) => (
              <div key={visiteur.id}>
                <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <Checkbox
                    id={`visiteur-${visiteur.id}`}
                    checked={visiteur.present}
                    onCheckedChange={(checked) => 
                      handlePresenceChange(visiteur.id, checked as boolean)
                    }
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-2">
                    <label 
                      htmlFor={`visiteur-${visiteur.id}`}
                      className="flex items-center cursor-pointer"
                    >
                      <span className={`font-medium ${visiteur.present ? 'text-gray-900' : 'text-gray-500'}`}>
                        {visiteur.prenom} {visiteur.nom}
                      </span>
                      {visiteur.present && (
                        <CheckCircle2 className="w-4 h-4 text-green-600 ml-2" />
                      )}
                    </label>
                    
                    <Textarea
                      placeholder="Commentaire pour ce visiteur..."
                      value={commentairesIndividuels[visiteur.id] || ''}
                      onChange={(e) => handleCommentChange(visiteur.id, e.target.value)}
                      className="min-h-[60px] text-sm"
                    />
                  </div>
                </div>
                {index < visiteurs.length - 1 && <Separator className="my-2" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Commentaire général */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-travel-blue" />
              <span>Commentaire sur la visite</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Ajoutez vos commentaires généraux sur cette visite..."
              value={commentaireGeneral}
              onChange={(e) => setCommentaireGeneral(e.target.value)}
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3 pb-6">
          <Button 
            className="w-full h-12"
            variant="outline"
            onClick={handleSauvegarder}
          >
            Sauvegarder les modifications
          </Button>
          
          {visit.statut === 'en cours' && (
            <Button 
              className="w-full h-12 gradient-bg hover:opacity-90"
              onClick={handleTerminerVisite}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Terminer la visite
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
