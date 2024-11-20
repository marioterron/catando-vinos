export const IS_DEV =
  import.meta.env.DEV && import.meta.env.VITE_USE_REAL_AUTH === "false";

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
