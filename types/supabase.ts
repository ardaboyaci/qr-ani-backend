export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: number
          created_at: string
          slug: string
          couple_name: string
          wedding_date: string
          venue_name: string
          owner_id: string
          password?: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          slug: string
          couple_name: string
          wedding_date: string
          venue_name: string
          owner_id: string
          password?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          slug?: string
          couple_name?: string
          wedding_date?: string
          venue_name?: string
          owner_id?: string
          password?: string | null
        }
      }
      uploads: {
        Row: {
          id: number
          created_at: string
          event_id: number
          file_url: string
          thumbnail_url: string | null
          guest_hash: string
          likes_count: number
          is_hidden: boolean
        }
        Insert: {
          id?: number
          created_at?: string
          event_id: number
          file_url: string
          thumbnail_url?: string | null
          guest_hash: string
          likes_count?: number
          is_hidden?: boolean
        }
        Update: {
          id?: number
          created_at?: string
          event_id?: number
          file_url?: string
          thumbnail_url?: string | null
          guest_hash?: string
          likes_count?: number
          is_hidden?: boolean
        }
      }
      favorites: {
        Row: {
          id: number
          created_at: string
          upload_id: number
          guest_hash: string
        }
        Insert: {
          id?: number
          created_at?: string
          upload_id: number
          guest_hash: string
        }
        Update: {
          id?: number
          created_at?: string
          upload_id?: number
          guest_hash?: string
        }
      }
    }
    Views: {
      [key: string]: {
        Row: { [key: string]: any }
      }
    }
    Functions: {
      increment_likes: {
        Args: { row_id: number }
        Returns: void
      }
    }
    Enums: {
      [key: string]: any
    }
  }
}
