
export interface Guide {
  id: string;
  nom: string;
  prenom: string;
  photo: string;
  statut: 'Actif' | 'Inactif';
  paysAffectation: string;
  email: string;
}

export interface Visiteur {
  id: string;
  nom: string;
  prenom: string;
  present: boolean;
  commentaire: string;
}

export interface Visite {
  id: string;
  photo: string;
  pays: string;
  lieuVisite: string;
  dateVisite: string;
  heureDebut: string;
  duree: number;
  heureFin: string;
  guideAffecte: string;
  visiteurs: Visiteur[];
  commentaireVisite: string;
  statut: 'à venir' | 'en cours' | 'terminée';
}

export interface AuthUser {
  guide: Guide;
  token: string;
}
