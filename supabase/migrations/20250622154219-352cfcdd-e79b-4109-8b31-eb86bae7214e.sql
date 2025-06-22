
-- Créer un type enum pour les statuts des guides
CREATE TYPE public.guide_status AS ENUM ('Actif', 'Inactif');

-- Créer un type enum pour les statuts des visites
CREATE TYPE public.visite_status AS ENUM ('à venir', 'en cours', 'terminée');

-- Créer un type enum pour les rôles utilisateurs
CREATE TYPE public.user_role AS ENUM ('Administrateur', 'Utilisateur');

-- Table des profils utilisateurs (liée à auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role user_role NOT NULL DEFAULT 'Utilisateur',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des guides touristiques
CREATE TABLE public.guides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    photo TEXT,
    statut guide_status NOT NULL DEFAULT 'Actif',
    pays_affectation TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des visites (sans colonne générée problématique)
CREATE TABLE public.visites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    photo TEXT,
    pays TEXT NOT NULL,
    lieu_visite TEXT NOT NULL,
    date_visite DATE NOT NULL,
    heure_debut TIME NOT NULL,
    duree INTEGER NOT NULL, -- durée en heures
    heure_fin TIME, -- sera calculée via trigger
    guide_id UUID REFERENCES public.guides(id),
    commentaire_visite TEXT,
    statut visite_status NOT NULL DEFAULT 'à venir',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des visiteurs
CREATE TABLE public.visiteurs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visite_id UUID REFERENCES public.visites(id) ON DELETE CASCADE,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    present BOOLEAN DEFAULT FALSE,
    commentaire TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fonction pour calculer l'heure de fin
CREATE OR REPLACE FUNCTION public.calculate_heure_fin()
RETURNS TRIGGER AS $$
BEGIN
    NEW.heure_fin := NEW.heure_debut + (NEW.duree || ' hours')::INTERVAL;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour calculer automatiquement l'heure de fin
CREATE TRIGGER trigger_calculate_heure_fin
    BEFORE INSERT OR UPDATE OF heure_debut, duree ON public.visites
    FOR EACH ROW
    EXECUTE FUNCTION public.calculate_heure_fin();

-- Activer RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visiteurs ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour profiles
CREATE POLICY "Les utilisateurs peuvent voir leur propre profil" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Les utilisateurs peuvent mettre à jour leur propre profil" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Politiques RLS pour guides (accessibles à tous les utilisateurs authentifiés)
CREATE POLICY "Les utilisateurs authentifiés peuvent voir les guides" ON public.guides
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Les utilisateurs authentifiés peuvent gérer les guides" ON public.guides
    FOR ALL TO authenticated USING (true);

-- Politiques RLS pour visites (accessibles à tous les utilisateurs authentifiés)
CREATE POLICY "Les utilisateurs authentifiés peuvent voir les visites" ON public.visites
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Les utilisateurs authentifiés peuvent gérer les visites" ON public.visites
    FOR ALL TO authenticated USING (true);

-- Politiques RLS pour visiteurs (accessibles à tous les utilisateurs authentifiés)
CREATE POLICY "Les utilisateurs authentifiés peuvent voir les visiteurs" ON public.visiteurs
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Les utilisateurs authentifiés peuvent gérer les visiteurs" ON public.visiteurs
    FOR ALL TO authenticated USING (true);

-- Fonction pour créer automatiquement un profil lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, nom, prenom, email, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'nom', ''),
        COALESCE(NEW.raw_user_meta_data->>'prenom', ''),
        NEW.email,
        'Utilisateur'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer automatiquement un profil
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insérer quelques données de test pour les guides
INSERT INTO public.guides (nom, prenom, photo, statut, pays_affectation, email) VALUES
('Dubois', 'Marie', 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face', 'Actif', 'France', 'marie.dubois@travelparadise.com'),
('Martin', 'Pierre', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 'Actif', 'Italie', 'pierre.martin@travelparadise.com'),
('Garcia', 'Ana', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', 'Actif', 'Espagne', 'ana.garcia@travelparadise.com');

-- Insérer des visites de test
INSERT INTO public.visites (photo, pays, lieu_visite, date_visite, heure_debut, duree, guide_id, commentaire_visite, statut) 
SELECT 
    'https://images.unsplash.com/photo-1549144511-f099e773c147?w=400&h=200&fit=crop',
    'France',
    'Tour Eiffel',
    '2024-06-25',
    '09:00',
    2,
    g.id,
    'Visite réussie malgré la pluie légère',
    'terminée'
FROM public.guides g WHERE g.email = 'marie.dubois@travelparadise.com';

INSERT INTO public.visites (photo, pays, lieu_visite, date_visite, heure_debut, duree, guide_id, statut) 
SELECT 
    'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=200&fit=crop',
    'France',
    'Musée du Louvre',
    '2024-06-26',
    '14:00',
    3,
    g.id,
    'en cours'
FROM public.guides g WHERE g.email = 'marie.dubois@travelparadise.com';

INSERT INTO public.visites (photo, pays, lieu_visite, date_visite, heure_debut, duree, guide_id, statut) 
SELECT 
    'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=200&fit=crop',
    'France',
    'Château de Versailles',
    '2024-06-27',
    '10:00',
    4,
    g.id,
    'à venir'
FROM public.guides g WHERE g.email = 'marie.dubois@travelparadise.com';
