// Database types for Supabase

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
      players: {
        Row: {
          id: string
          number: number
          name: string
          nickname: string
          handicap: number
          avatar: string | null
          challenge_points: number
          prediction_points: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          number: number
          name?: string
          nickname?: string
          handicap?: number
          avatar?: string | null
          challenge_points?: number
          prediction_points?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          number?: number
          name?: string
          nickname?: string
          handicap?: number
          avatar?: string | null
          challenge_points?: number
          prediction_points?: number
          created_at?: string
          updated_at?: string
        }
      }
      scores: {
        Row: {
          id: string
          player_id: string | null
          round_number: number
          hole_scores: number[]
          total: number
          blooper_note: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          player_id?: string | null
          round_number: number
          hole_scores?: number[]
          total?: number
          blooper_note?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          player_id?: string | null
          round_number?: number
          hole_scores?: number[]
          total?: number
          blooper_note?: string
          created_at?: string
          updated_at?: string
        }
      }
      photos: {
        Row: {
          id: string
          uploaded_by: string | null
          image_url: string
          caption: string
          proof_type: 'glory' | 'disaster' | 'lies' | 'life' | 'challenge'
          tagged_players: string[]
          reactions_fire: number
          reactions_dead: number
          reactions_laugh: number
          reactions_cap: number
          created_at: string
        }
        Insert: {
          id?: string
          uploaded_by?: string | null
          image_url: string
          caption?: string
          proof_type?: 'glory' | 'disaster' | 'lies' | 'life' | 'challenge'
          tagged_players?: string[]
          reactions_fire?: number
          reactions_dead?: number
          reactions_laugh?: number
          reactions_cap?: number
          created_at?: string
        }
        Update: {
          id?: string
          uploaded_by?: string | null
          image_url?: string
          caption?: string
          proof_type?: 'glory' | 'disaster' | 'lies' | 'life' | 'challenge'
          tagged_players?: string[]
          reactions_fire?: number
          reactions_dead?: number
          reactions_laugh?: number
          reactions_cap?: number
          created_at?: string
        }
      }
      challenges: {
        Row: {
          id: string
          title: string
          description: string
          points: number
          category: string
          proof_required: boolean
          witness_required: boolean
          status: 'open' | 'claimed' | 'verified'
          claimed_by: string | null
          verified_by: string[]
          disputed_by: string[]
          proof_photo_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          points?: number
          category: string
          proof_required?: boolean
          witness_required?: boolean
          status?: 'open' | 'claimed' | 'verified'
          claimed_by?: string | null
          verified_by?: string[]
          disputed_by?: string[]
          proof_photo_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          points?: number
          category?: string
          proof_required?: boolean
          witness_required?: boolean
          status?: 'open' | 'claimed' | 'verified'
          claimed_by?: string | null
          verified_by?: string[]
          disputed_by?: string[]
          proof_photo_id?: string | null
          created_at?: string
        }
      }
      bets: {
        Row: {
          id: string
          description: string
          players_involved: string[]
          stakes: string
          status: 'open' | 'settled'
          winner: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          description: string
          players_involved: string[]
          stakes: string
          status?: 'open' | 'settled'
          winner?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          description?: string
          players_involved?: string[]
          stakes?: string
          status?: 'open' | 'settled'
          winner?: string | null
          created_by?: string | null
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          player_id: string | null
          content: string
          reactions_fire: number
          reactions_dead: number
          reactions_laugh: number
          reactions_cap: number
          created_at: string
        }
        Insert: {
          id?: string
          player_id?: string | null
          content: string
          reactions_fire?: number
          reactions_dead?: number
          reactions_laugh?: number
          reactions_cap?: number
          created_at?: string
        }
        Update: {
          id?: string
          player_id?: string | null
          content?: string
          reactions_fire?: number
          reactions_dead?: number
          reactions_laugh?: number
          reactions_cap?: number
          created_at?: string
        }
      }
      quotes: {
        Row: {
          id: string
          content: string
          said_by: string | null
          context: string
          reactions_fire: number
          reactions_dead: number
          reactions_laugh: number
          reactions_cap: number
          created_at: string
        }
        Insert: {
          id?: string
          content: string
          said_by?: string | null
          context?: string
          reactions_fire?: number
          reactions_dead?: number
          reactions_laugh?: number
          reactions_cap?: number
          created_at?: string
        }
        Update: {
          id?: string
          content?: string
          said_by?: string | null
          context?: string
          reactions_fire?: number
          reactions_dead?: number
          reactions_laugh?: number
          reactions_cap?: number
          created_at?: string
        }
      }
      predictions: {
        Row: {
          id: string
          player_id: string | null
          round_number: number
          predicted_winner: string | null
          own_over_under: number
          first_water: string | null
          most_3_putts: string | null
          created_at: string
        }
        Insert: {
          id?: string
          player_id?: string | null
          round_number: number
          predicted_winner?: string | null
          own_over_under?: number
          first_water?: string | null
          most_3_putts?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          player_id?: string | null
          round_number?: number
          predicted_winner?: string | null
          own_over_under?: number
          first_water?: string | null
          most_3_putts?: string | null
          created_at?: string
        }
      }
      time_capsule: {
        Row: {
          id: string
          player_id: string | null
          trip_winner: string | null
          trip_last: string | null
          secret_goal: string
          prediction: string
          message_to_self: string
          created_at: string
        }
        Insert: {
          id?: string
          player_id?: string | null
          trip_winner?: string | null
          trip_last?: string | null
          secret_goal?: string
          prediction?: string
          message_to_self?: string
          created_at?: string
        }
        Update: {
          id?: string
          player_id?: string | null
          trip_winner?: string | null
          trip_last?: string | null
          secret_goal?: string
          prediction?: string
          message_to_self?: string
          created_at?: string
        }
      }
      foursomes: {
        Row: {
          id: string
          round_number: number
          group_1: string[]
          group_2: string[]
          group_3: string[]
          updated_at: string
        }
        Insert: {
          id?: string
          round_number: number
          group_1?: string[]
          group_2?: string[]
          group_3?: string[]
          updated_at?: string
        }
        Update: {
          id?: string
          round_number?: number
          group_1?: string[]
          group_2?: string[]
          group_3?: string[]
          updated_at?: string
        }
      }
      trip_info: {
        Row: {
          id: string
          house_address: string
          door_code: string
          wifi_password: string
          emergency_contact: string
          nearest_hospital: string
          local_pizza: string
          updated_at: string
        }
        Insert: {
          id?: string
          house_address?: string
          door_code?: string
          wifi_password?: string
          emergency_contact?: string
          nearest_hospital?: string
          local_pizza?: string
          updated_at?: string
        }
        Update: {
          id?: string
          house_address?: string
          door_code?: string
          wifi_password?: string
          emergency_contact?: string
          nearest_hospital?: string
          local_pizza?: string
          updated_at?: string
        }
      }
      itinerary_notes: {
        Row: {
          id: string
          day: 'thursday' | 'friday' | 'saturday' | 'sunday' | 'monday'
          notes: string[]
          updated_at: string
        }
        Insert: {
          id?: string
          day: 'thursday' | 'friday' | 'saturday' | 'sunday' | 'monday'
          notes?: string[]
          updated_at?: string
        }
        Update: {
          id?: string
          day?: 'thursday' | 'friday' | 'saturday' | 'sunday' | 'monday'
          notes?: string[]
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
