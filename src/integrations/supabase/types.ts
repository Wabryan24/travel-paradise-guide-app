export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      guides: {
        Row: {
          created_at: string | null
          email: string
          id: string
          nom: string
          pays_affectation: string
          photo: string | null
          prenom: string
          statut: Database["public"]["Enums"]["guide_status"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          nom: string
          pays_affectation: string
          photo?: string | null
          prenom: string
          statut?: Database["public"]["Enums"]["guide_status"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          nom?: string
          pays_affectation?: string
          photo?: string | null
          prenom?: string
          statut?: Database["public"]["Enums"]["guide_status"]
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          nom: string
          prenom: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          nom: string
          prenom: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          nom?: string
          prenom?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      visites: {
        Row: {
          commentaire_visite: string | null
          created_at: string | null
          date_visite: string
          duree: number
          guide_id: string | null
          heure_debut: string
          heure_fin: string | null
          id: string
          lieu_visite: string
          pays: string
          photo: string | null
          statut: Database["public"]["Enums"]["visite_status"]
          updated_at: string | null
        }
        Insert: {
          commentaire_visite?: string | null
          created_at?: string | null
          date_visite: string
          duree: number
          guide_id?: string | null
          heure_debut: string
          heure_fin?: string | null
          id?: string
          lieu_visite: string
          pays: string
          photo?: string | null
          statut?: Database["public"]["Enums"]["visite_status"]
          updated_at?: string | null
        }
        Update: {
          commentaire_visite?: string | null
          created_at?: string | null
          date_visite?: string
          duree?: number
          guide_id?: string | null
          heure_debut?: string
          heure_fin?: string | null
          id?: string
          lieu_visite?: string
          pays?: string
          photo?: string | null
          statut?: Database["public"]["Enums"]["visite_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visites_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "guides"
            referencedColumns: ["id"]
          },
        ]
      }
      visiteurs: {
        Row: {
          commentaire: string | null
          created_at: string | null
          id: string
          nom: string
          prenom: string
          present: boolean | null
          updated_at: string | null
          visite_id: string | null
        }
        Insert: {
          commentaire?: string | null
          created_at?: string | null
          id?: string
          nom: string
          prenom: string
          present?: boolean | null
          updated_at?: string | null
          visite_id?: string | null
        }
        Update: {
          commentaire?: string | null
          created_at?: string | null
          id?: string
          nom?: string
          prenom?: string
          present?: boolean | null
          updated_at?: string | null
          visite_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visiteurs_visite_id_fkey"
            columns: ["visite_id"]
            isOneToOne: false
            referencedRelation: "visites"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      guide_status: "Actif" | "Inactif"
      user_role: "Administrateur" | "Utilisateur"
      visite_status: "à venir" | "en cours" | "terminée"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      guide_status: ["Actif", "Inactif"],
      user_role: ["Administrateur", "Utilisateur"],
      visite_status: ["à venir", "en cours", "terminée"],
    },
  },
} as const
