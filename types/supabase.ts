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
          media_type: 'image' | 'video'
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
          media_type?: 'image' | 'video'
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
          media_type?: 'image' | 'video'
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
      comments: {
        Row: {
          id: number
          created_at: string
          upload_id: number
          content: string
          guest_name: string | null
          is_couple_reply: boolean
        }
        Insert: {
          id?: number
          created_at?: string
          upload_id: number
          content: string
          guest_name?: string | null
          is_couple_reply?: boolean
        }
        Update: {
          id?: number
          created_at?: string
          upload_id?: number
          content?: string
          guest_name?: string | null
          is_couple_reply?: boolean
        }
      }
      likes: {
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
