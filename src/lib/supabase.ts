import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../constants/environment";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
