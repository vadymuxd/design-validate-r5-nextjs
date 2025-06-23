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
      app_feedback: {
        Row: {
          category_slug: string | null
          collection_slug: string | null
          created_at: string
          device_id: string | null
          id: number
          ip_address: string | null
          sentiment: Database["public"]["Enums"]["sentiment_type"]
        }
        Insert: {
          category_slug?: string | null
          collection_slug?: string | null
          created_at?: string
          device_id?: string | null
          id?: number
          ip_address?: string | null
          sentiment: Database["public"]["Enums"]["sentiment_type"]
        }
        Update: {
          category_slug?: string | null
          collection_slug?: string | null
          created_at?: string
          device_id?: string | null
          id?: number
          ip_address?: string | null
          sentiment?: Database["public"]["Enums"]["sentiment_type"]
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          id: number
          message: string
          ip_address: string | null
          user_agent: string | null
          device_id: string | null
          device_type: string | null
          country: string | null
          browser: string | null
          os: string | null
          created_at: string
          email_sent: boolean
          email_sent_at: string | null
        }
        Insert: {
          id?: number
          message: string
          ip_address?: string | null
          user_agent?: string | null
          device_id?: string | null
          device_type?: string | null
          country?: string | null
          browser?: string | null
          os?: string | null
          created_at?: string
          email_sent?: boolean
          email_sent_at?: string | null
        }
        Update: {
          id?: number
          message?: string
          ip_address?: string | null
          user_agent?: string | null
          device_id?: string | null
          device_type?: string | null
          country?: string | null
          browser?: string | null
          os?: string | null
          created_at?: string
          email_sent?: boolean
          email_sent_at?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          collection_id: number
          id: number
          name: string
          slug: string
        }
        Insert: {
          collection_id: number
          id?: number
          name: string
          slug: string
        }
        Update: {
          collection_id?: number
          id?: number
          name?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          id: number
          name: string
          slug: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      tool_category_leaderboard: {
        Row: {
          category_id: number
          current_downvotes: number | null
          current_upvotes: number | null
          initial_downvotes: number | null
          initial_upvotes: number | null
          tool_id: string
        }
        Insert: {
          category_id: number
          current_downvotes?: number | null
          current_upvotes?: number | null
          initial_downvotes?: number | null
          initial_upvotes?: number | null
          tool_id: string
        }
        Update: {
          category_id?: number
          current_downvotes?: number | null
          current_upvotes?: number | null
          initial_downvotes?: number | null
          initial_upvotes?: number | null
          tool_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tool_category_leaderboard_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tool_category_leaderboard_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
        ]
      }
      tool_pros_and_cons: {
        Row: {
          id: number
          tool_id: string
          category_id: number
          pro_text: string
          con_text: string
        }
        Insert: {
          id?: number
          tool_id: string
          category_id: number
          pro_text: string
          con_text: string
        }
        Update: {
          id?: number
          tool_id?: string
          category_id?: number
          pro_text?: string
          con_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "tool_pros_and_cons_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tool_pros_and_cons_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      tools: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          logo_url: string | null
          name: string
          website_url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          website_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          website_url?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          device_id: string | null
          email: string
          id: number
          ip_address: string | null
          name: string | null
        }
        Insert: {
          created_at?: string
          device_id?: string | null
          email: string
          id?: number
          ip_address?: string | null
          name?: string | null
        }
        Update: {
          created_at?: string
          device_id?: string | null
          email?: string
          id?: number
          ip_address?: string | null
          name?: string | null
        }
        Relationships: []
      }
      votes: {
        Row: {
          category_id: number
          created_at: string
          device_id: string | null
          id: number
          ip_address: string | null
          sentiment: Database["public"]["Enums"]["vote_type"]
          tool_id: string
          updated_at: string | null
        }
        Insert: {
          category_id: number
          created_at?: string
          device_id?: string | null
          id?: number
          ip_address?: string | null
          sentiment: Database["public"]["Enums"]["vote_type"]
          tool_id: string
          updated_at?: string | null
        }
        Update: {
          category_id?: number
          created_at?: string
          device_id?: string | null
          id?: number
          ip_address?: string | null
          sentiment?: Database["public"]["Enums"]["vote_type"]
          tool_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "votes_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
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
      sentiment_type: "LIKE" | "DISLIKE"
      vote_type: "UPVOTE" | "DOWNVOTE"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
