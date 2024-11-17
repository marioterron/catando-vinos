import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface DbTastingNote {
  id: string;
  user_id: string;
  rating: number;
  perceived_price: number;
  flavors: string[];
  comments?: string;
  wine_id: string;
  created_at: string;
  is_revealed: boolean;
}

export interface DbUser {
  id: string;
  email: string;
  role: "admin" | "user";
  created_at: string;
}
