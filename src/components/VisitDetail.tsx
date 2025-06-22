
import { useState } from 'react';
import { Visite, Visiteur } from '@/types';
import { useUpdateVisiteur, useUpdateVisite } from '@/hooks/useVisites';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Save } from 'lucide-react';
import { toast } from 'sonner';

interface VisitDetailProps {
  visite: Visite;
  onBack: () => void;
}

export const VisitDetail = ({ visite, onBack }: VisitDetailProps) => {
  const [visiteurs, setVisiteurs] = useState<Visiteur[]>(visite.visiteurs);
  const [commentaireVisite, setCommentaireVisite] = useState(visite.commentaireVisite);
  const [statutVisite, setStatutVisite] = useState(visite.statut);
  
  const updateVisiteurMutation = useUpdateVisiteur();
  const updateVisiteMutation = useUpdateVisite();

  const handleVisiteurChange = (
    visiteurId: string, 
    field: 'present' | 'commentaire', 
    value: boolean | string
  ) => {
    setVisiteurs(prev => 
      prev.map(v => 
        v.id === visiteurId 
          ? { ...v, [field]: value }
          : v
      )
    );
  };

  const saveVisiteur = async (visiteur: Visiteur) => {
    try {
      await updateVisiteurMutation.mutateAsync({
        visiteurId: visiteur.id,
        present: visiteur.present,
        commentaire: visiteur.commentaire
      });
      toast.success('Visiteur mis à jour');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const saveVisite = async () => {
    try {
      await updateVisiteMutation.mutateAsync({
        visiteId: visite.id,
        commentaire: commentaireVisite,
        statut: statutVisite
      });
      toast.success('Visite mise à jour');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'terminée': return 'bg-green-100 text-green-800';
      case 'en cours': return 'bg-blue-100 text-blue-800';
      case 'à venir': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const presentsCount = visiteurs.filter(v => v.present).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Retour</span>
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{visite.lieuVisite}</h1>
              <p className="text-gray-500 text-sm">{visite.pays}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Informations de la visite */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
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
                <CardTitle>{visite.lieuVisite}</CardTitle>
                <CardDescription>Guide: {visite.guideAffecte}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
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
                  <span>{presentsCount}/{visiteurs.length} présents</span>
                </div>
              </CardContent>
            </Card>

            {/* Gestion de la visite */}
            <Card>
              <CardHeader>
                <CardTitle>Gestion de la visite</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="statut">Statut</Label>
                  <Select value={statutVisite} onValueChange={(value: any) => setStatutVisite(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="à venir">À venir</SelectItem>
                      <SelectItem value="en cours">En cours</SelectItem>
                      <SelectItem value="terminée">Terminée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="commentaire-visite">Commentaire de visite</Label>
                  <Textarea
                    id="commentaire-visite"
                    value={commentaireVisite}
                    onChange={(e) => setCommentaireVisite(e.target.value)}
                    placeholder="Ajoutez un commentaire sur cette visite..."
                    rows={3}
                  />
                </div>
                
                <Button 
                  onClick={saveVisite} 
                  className="w-full"
                  disabled={updateVisiteMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder la visite
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Liste des visiteurs */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Liste des visiteurs ({visiteurs.length})</span>
                  <Badge variant="outline">
                    {presentsCount} présents
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Gérez les présences et ajoutez des commentaires pour chaque visiteur
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {visiteurs.map((visiteur) => (
                    <div key={visiteur.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={visiteur.present}
                            onCheckedChange={(checked) => 
                              handleVisiteurChange(visiteur.id, 'present', checked as boolean)
                            }
                          />
                          <div>
                            <p className="font-medium">
                              {visiteur.prenom} {visiteur.nom}
                            </p>
                            <p className="text-sm text-gray-500">
                              {visiteur.present ? 'Présent' : 'Absent'}
                            </p>
                          </div>
                        </div>
                        
                        <Button
                          size="sm"
                          onClick={() => saveVisiteur(visiteur)}
                          disabled={updateVisiteurMutation.isPending}
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Sauvegarder
                        </Button>
                      </div>
                      
                      <div>
                        <Label htmlFor={`commentaire-${visiteur.id}`}>Commentaire</Label>
                        <Input
                          id={`commentaire-${visiteur.id}`}
                          value={visiteur.commentaire}
                          onChange={(e) => 
                            handleVisiteurChange(visiteur.id, 'commentaire', e.target.value)
                          }
                          placeholder="Commentaire sur ce visiteur..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
