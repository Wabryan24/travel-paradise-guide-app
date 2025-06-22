
import { Visite } from '@/types';

export const mockVisites: Visite[] = [
  {
    id: '1',
    photo: 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=400&h=200&fit=crop',
    pays: 'France',
    lieuVisite: 'Tour Eiffel',
    dateVisite: '2024-06-25',
    heureDebut: '09:00',
    duree: 2,
    heureFin: '11:00',
    guideAffecte: 'Marie Dubois',
    visiteurs: [
      { id: '1', nom: 'Martin', prenom: 'Pierre', present: true, commentaire: 'Très intéressé par l\'histoire' },
      { id: '2', nom: 'Durand', prenom: 'Sophie', present: false, commentaire: '' },
      { id: '3', nom: 'Bernard', prenom: 'Jean', present: true, commentaire: 'Photographe amateur' },
      { id: '4', nom: 'Petit', prenom: 'Marie', present: true, commentaire: '' },
      { id: '5', nom: 'Robert', prenom: 'Paul', present: true, commentaire: 'Première visite à Paris' }
    ],
    commentaireVisite: 'Visite réussie malgré la pluie légère',
    statut: 'terminée'
  },
  {
    id: '2',
    photo: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=200&fit=crop',
    pays: 'France',
    lieuVisite: 'Musée du Louvre',
    dateVisite: '2024-06-26',
    heureDebut: '14:00',
    duree: 3,
    heureFin: '17:00',
    guideAffecte: 'Marie Dubois',
    visiteurs: [
      { id: '6', nom: 'Moreau', prenom: 'Julie', present: false, commentaire: '' },
      { id: '7', nom: 'Simon', prenom: 'Marc', present: false, commentaire: '' },
      { id: '8', nom: 'Michel', prenom: 'Anne', present: false, commentaire: '' },
      { id: '9', nom: 'Lefebvre', prenom: 'Tom', present: false, commentaire: '' },
      { id: '10', nom: 'Roux', prenom: 'Emma', present: false, commentaire: '' },
      { id: '11', nom: 'David', prenom: 'Lucas', present: false, commentaire: '' }
    ],
    commentaireVisite: '',
    statut: 'en cours'
  },
  {
    id: '3',
    photo: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=200&fit=crop',
    pays: 'France',
    lieuVisite: 'Château de Versailles',
    dateVisite: '2024-06-27',
    heureDebut: '10:00',
    duree: 4,
    heureFin: '14:00',
    guideAffecte: 'Marie Dubois',
    visiteurs: [
      { id: '12', nom: 'Garnier', prenom: 'Alice', present: false, commentaire: '' },
      { id: '13', nom: 'Faure', prenom: 'Hugo', present: false, commentaire: '' },
      { id: '14', nom: 'Andre', prenom: 'Clara', present: false, commentaire: '' },
      { id: '15', nom: 'Mercier', prenom: 'Noah', present: false, commentaire: '' }
    ],
    commentaireVisite: '',
    statut: 'à venir'
  }
];
