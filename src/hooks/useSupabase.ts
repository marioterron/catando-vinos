import { useEffect, useState } from "react";

import { DEV_SESSION } from "../constants/auth";
import { IS_DEV } from "../constants/environment";
import { WINES } from "../constants/wines";
import { DbTastingNote, supabase } from "../lib/supabase";
import type { TastingNote } from "../types/wine";

export function useSupabase() {
  const [session, setSession] = useState(IS_DEV ? DEV_SESSION : null);
  const [loading, setLoading] = useState(!IS_DEV);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (IS_DEV) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string) => {
    if (IS_DEV) {
      setSession(DEV_SESSION);
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const signOut = async () => {
    if (IS_DEV) {
      setSession(null);
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      setError(error.message);
    }
  };

  const saveTastingNote = async (note: TastingNote) => {
    try {
      if (!session?.user) throw new Error("No user logged in");

      if (IS_DEV) {
        const savedNotes = localStorage.getItem("wine-tastings");
        const notes = savedNotes ? JSON.parse(savedNotes) : [];
        const updatedNotes = [...notes, note];
        localStorage.setItem("wine-tastings", JSON.stringify(updatedNotes));
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "wine-tastings",
            newValue: JSON.stringify(updatedNotes),
          })
        );
        return { data: note, error: null };
      }

      const { data, error } = await supabase
        .from("tasting_notes")
        .insert({
          id: note.id,
          user_id: session.user.id,
          rating: note.rating,
          perceived_price: note.perceivedPrice,
          flavors: note.flavors,
          comments: note.comments,
          wine_id: note.wine?.id,
          is_revealed: false, // Always set to false for new notes
          created_at: note.date || new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error("Error saving tasting note:", error);
        throw error;
      }
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  };

  const updateTastingNote = async (note: TastingNote) => {
    try {
      if (!session?.user) throw new Error("No user logged in");

      const { error } = await supabase
        .from("tasting_notes")
        .update({
          rating: note.rating,
          perceived_price: note.perceivedPrice,
          flavors: note.flavors,
          comments: note.comments,
          is_revealed: note.wine?.isRevealed || false,
        })
        .eq("id", note.id)
        .eq("user_id", session.user.id);

      if (error) {
        console.error("Error updating tasting note:", error);
        throw error;
      }
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const subscribeToTastingNotes = (
    onUpdate: (notes: TastingNote[]) => void
  ) => {
    if (IS_DEV) {
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === "wine-tastings") {
          const notes = e.newValue ? JSON.parse(e.newValue) : [];
          onUpdate(notes);
        }
      };
      window.addEventListener("storage", handleStorageChange);
      const savedNotes = localStorage.getItem("wine-tastings");
      onUpdate(savedNotes ? JSON.parse(savedNotes) : []);
      return () => window.removeEventListener("storage", handleStorageChange);
    }

    const subscription = supabase
      .channel("tasting_notes_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasting_notes",
        },
        async () => {
          const { data } = await getTastingNotes({ all: true });
          if (data) {
            onUpdate(data);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const getTastingNotes = async ({
    all = false,
  }: { all?: boolean } = {}): Promise<{
    data: TastingNote[] | null;
    error: string | null;
  }> => {
    try {
      if (!session?.user) throw new Error("No user logged in");

      if (IS_DEV) {
        const savedNotes = localStorage.getItem("wine-tastings");
        return {
          data: savedNotes ? JSON.parse(savedNotes) : [],
          error: null,
        };
      }

      let query = supabase
        .from("tasting_notes")
        .select("*")
        .order("created_at", { ascending: false });

      if (!all) {
        query = query.eq("user_id", session.user.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error getting tasting notes:", error);
        throw error;
      }

      const tastingNotes: TastingNote[] = data.map((note: DbTastingNote) => ({
        id: note.id,
        rating: note.rating,
        perceivedPrice: note.perceived_price,
        flavors: note.flavors,
        comments: note.comments,
        date: note.created_at,
        wine: {
          ...WINES.find((w) => w.id === note.wine_id)!,
          isRevealed: note.is_revealed,
        },
      }));

      return { data: tastingNotes, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  };

  const clearTastingNotes = async () => {
    try {
      if (!session?.user) throw new Error("No user logged in");

      if (IS_DEV) {
        localStorage.removeItem("wine-tastings");
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "wine-tastings",
            newValue: "[]",
          })
        );
        return { error: null };
      }

      const { error } = await supabase
        .from("tasting_notes")
        .delete()
        .eq("user_id", session.user.id);

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error("Error clearing tasting notes:", error);
      return { error: error.message };
    }
  };

  return {
    session,
    loading,
    error,
    signIn,
    signOut,
    saveTastingNote,
    updateTastingNote,
    getTastingNotes,
    clearTastingNotes,
    subscribeToTastingNotes,
  };
}
