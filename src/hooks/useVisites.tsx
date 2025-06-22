
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Visite, Visiteur } from '@/types';

export const useVisites = () => {
  return useQuery({
    queryKey: ['visites'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('visites')
        .select(`
          *,
          guides(nom, prenom),
          visiteurs(*)
        `)
        .order('date_visite', { ascending: true });

      if (error) {
        console.error('Error fetching visites:', error);
        throw error;
      }

      // Transformer les données pour correspondre au format attendu
      const visites: Visite[] = data.map(visite => ({
        id: visite.id,
        photo: visite.photo || '',
        pays: visite.pays,
        lieuVisite: visite.lieu_visite,
        dateVisite: visite.date_visite,
        heureDebut: visite.heure_debut,
        duree: visite.duree,
        heureFin: visite.heure_fin || '',
        guideAffecte: visite.guides ? `${visite.guides.prenom} ${visite.guides.nom}` : '',
        visiteurs: visite.visiteurs.map((v: any) => ({
          id: v.id,
          nom: v.nom,
          prenom: v.prenom,
          present: v.present || false,
          commentaire: v.commentaire || ''
        })),
        commentaireVisite: visite.commentaire_visite || '',
        statut: visite.statut as 'à venir' | 'en cours' | 'terminée'
      }));

      return visites;
    },
  });
};

export const useUpdateVisiteur = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ visiteurId, present, commentaire }: { 
      visiteurId: string; 
      present: boolean; 
      commentaire: string; 
    }) => {
      const { error } = await supabase
        .from('visiteurs')
        .update({ 
          present, 
          commentaire,
          updated_at: new Date().toISOString()
        })
        .eq('id', visiteurId);

      if (error) {
        console.error('Error updating visiteur:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visites'] });
    },
  });
};

export const useUpdateVisite = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ visiteId, commentaire, statut }: { 
      visiteId: string; 
      commentaire: string; 
      statut: 'à venir' | 'en cours' | 'terminée';
    }) => {
      const { error } = await supabase
        .from('visites')
        .update({ 
          commentaire_visite: commentaire,
          statut,
          updated_at: new Date().toISOString()
        })
        .eq('id', visiteId);

      if (error) {
        console.error('Error updating visite:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visites'] });
    },
  });
};
