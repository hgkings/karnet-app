import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          plan: 'free' | 'pro';
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          plan?: 'free' | 'pro';
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          plan?: 'free' | 'pro';
          created_at?: string;
        };
      };
      analyses: {
        Row: {
          id: string;
          user_id: string;
          marketplace: string;
          product_name: string;
          inputs: any;
          outputs: any;
          risk_score: number;
          risk_level: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          marketplace: string;
          product_name: string;
          inputs: any;
          outputs: any;
          risk_score: number;
          risk_level: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          marketplace?: string;
          product_name?: string;
          inputs?: any;
          outputs?: any;
          risk_score?: number;
          risk_level?: string;
          created_at?: string;
        };
      };
    };
  };
}
