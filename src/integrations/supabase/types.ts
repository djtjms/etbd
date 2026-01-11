export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author_id: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          published_at: string | null
          seo_description: string | null
          seo_keywords: string[] | null
          seo_title: string | null
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      branding_settings: {
        Row: {
          company_address: string | null
          company_email: string | null
          company_phone: string | null
          facebook_url: string | null
          id: string
          linkedin_url: string | null
          logo_text: string | null
          logo_url: string | null
          primary_color: string | null
          tagline: string | null
          twitter_url: string | null
          updated_at: string
          whatsapp_number: string | null
        }
        Insert: {
          company_address?: string | null
          company_email?: string | null
          company_phone?: string | null
          facebook_url?: string | null
          id?: string
          linkedin_url?: string | null
          logo_text?: string | null
          logo_url?: string | null
          primary_color?: string | null
          tagline?: string | null
          twitter_url?: string | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Update: {
          company_address?: string | null
          company_email?: string | null
          company_phone?: string | null
          facebook_url?: string | null
          id?: string
          linkedin_url?: string | null
          logo_text?: string | null
          logo_url?: string | null
          primary_color?: string | null
          tagline?: string | null
          twitter_url?: string | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      case_studies: {
        Row: {
          client_name: string | null
          created_at: string
          description: string | null
          featured_image: string | null
          gallery_images: string[] | null
          id: string
          results: string | null
          slug: string
          status: string
          technologies: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          client_name?: string | null
          created_at?: string
          description?: string | null
          featured_image?: string | null
          gallery_images?: string[] | null
          id?: string
          results?: string | null
          slug: string
          status?: string
          technologies?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          client_name?: string | null
          created_at?: string
          description?: string | null
          featured_image?: string | null
          gallery_images?: string[] | null
          id?: string
          results?: string | null
          slug?: string
          status?: string
          technologies?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      chatbot_config: {
        Row: {
          created_at: string
          fallback_to_contact: boolean
          id: string
          is_active: boolean
          question_pattern: string
          response: string
        }
        Insert: {
          created_at?: string
          fallback_to_contact?: boolean
          id?: string
          is_active?: boolean
          question_pattern: string
          response: string
        }
        Update: {
          created_at?: string
          fallback_to_contact?: boolean
          id?: string
          is_active?: boolean
          question_pattern?: string
          response?: string
        }
        Relationships: []
      }
      consultation_requests: {
        Row: {
          created_at: string | null
          email: string
          id: string
          interested_project: string | null
          is_read: boolean | null
          message: string | null
          name: string
          phone: string | null
          source: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          interested_project?: string | null
          is_read?: boolean | null
          message?: string | null
          name: string
          phone?: string | null
          source?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          interested_project?: string | null
          is_read?: boolean | null
          message?: string | null
          name?: string
          phone?: string | null
          source?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean
          message: string
          name: string
          phone: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean
          message: string
          name: string
          phone?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          message?: string
          name?: string
          phone?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      demo_project_credentials: {
        Row: {
          access_code: string | null
          access_notes: string | null
          access_password: string | null
          access_username: string | null
          created_at: string
          project_id: string
          updated_at: string
        }
        Insert: {
          access_code?: string | null
          access_notes?: string | null
          access_password?: string | null
          access_username?: string | null
          created_at?: string
          project_id: string
          updated_at?: string
        }
        Update: {
          access_code?: string | null
          access_notes?: string | null
          access_password?: string | null
          access_username?: string | null
          created_at?: string
          project_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      demo_projects: {
        Row: {
          allow_interaction: boolean | null
          created_at: string
          demo_url: string | null
          description: string | null
          id: string
          is_featured: boolean
          preview_mode: string | null
          project_type: string
          screenshots: string[] | null
          slug: string | null
          status: string
          technologies: string[] | null
          thumbnail: string | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          allow_interaction?: boolean | null
          created_at?: string
          demo_url?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean
          preview_mode?: string | null
          project_type?: string
          screenshots?: string[] | null
          slug?: string | null
          status?: string
          technologies?: string[] | null
          thumbnail?: string | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          allow_interaction?: boolean | null
          created_at?: string
          demo_url?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean
          preview_mode?: string | null
          project_type?: string
          screenshots?: string[] | null
          slug?: string | null
          status?: string
          technologies?: string[] | null
          thumbnail?: string | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: []
      }
      interaction_events: {
        Row: {
          created_at: string | null
          element_id: string | null
          element_type: string | null
          event_type: string
          id: string
          metadata: Json | null
          page_path: string
          project_id: string | null
          session_id: string
          x_position: number | null
          y_position: number | null
        }
        Insert: {
          created_at?: string | null
          element_id?: string | null
          element_type?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          page_path: string
          project_id?: string | null
          session_id: string
          x_position?: number | null
          y_position?: number | null
        }
        Update: {
          created_at?: string | null
          element_id?: string | null
          element_type?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          page_path?: string
          project_id?: string | null
          session_id?: string
          x_position?: number | null
          y_position?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "interaction_events_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "demo_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      seo_settings: {
        Row: {
          id: string
          meta_description: string | null
          meta_keywords: string[] | null
          meta_title: string | null
          og_image: string | null
          page_name: string
          updated_at: string
        }
        Insert: {
          id?: string
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          og_image?: string | null
          page_name: string
          updated_at?: string
        }
        Update: {
          id?: string
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          og_image?: string | null
          page_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          client_avatar: string | null
          client_company: string | null
          client_name: string
          client_position: string | null
          created_at: string
          id: string
          is_featured: boolean
          rating: number
          review: string
        }
        Insert: {
          client_avatar?: string | null
          client_company?: string | null
          client_name: string
          client_position?: string | null
          created_at?: string
          id?: string
          is_featured?: boolean
          rating?: number
          review: string
        }
        Update: {
          client_avatar?: string | null
          client_company?: string | null
          client_name?: string
          client_position?: string | null
          created_at?: string
          id?: string
          is_featured?: boolean
          rating?: number
          review?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      visitor_analytics: {
        Row: {
          click_count: number | null
          created_at: string | null
          device_type: string | null
          id: string
          page_path: string
          referrer: string | null
          scroll_depth: number | null
          session_id: string
          time_on_page: number | null
        }
        Insert: {
          click_count?: number | null
          created_at?: string | null
          device_type?: string | null
          id?: string
          page_path: string
          referrer?: string | null
          scroll_depth?: number | null
          session_id: string
          time_on_page?: number | null
        }
        Update: {
          click_count?: number | null
          created_at?: string | null
          device_type?: string | null
          id?: string
          page_path?: string
          referrer?: string | null
          scroll_depth?: number | null
          session_id?: string
          time_on_page?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
