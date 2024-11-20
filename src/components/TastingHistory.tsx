import React, { useEffect, useState } from "react";
import { ArrowLeft, Trash2, Wine } from "lucide-react";

import { useSupabase } from "../hooks/useSupabase";
import type { TastingNote } from "../types/wine";
import Footer from "./Footer";
import Modal from "./Modal";
import WineCard from "./WineCard";
import { IS_DEV } from "../constants/environment";

interface TastingHistoryProps {
  notes: TastingNote[];
  onBack: () => void;
}

export default function TastingHistory({
  notes: initialNotes,
  onBack,
}: TastingHistoryProps) {
  const [showModal, setShowModal] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [localNotes, setLocalNotes] = useState<TastingNote[]>([]);
  const {
    clearTastingNotes,
    subscribeToTastingNotes,
    session,
    updateTastingNote,
  } = useSupabase();

  // Initialize local notes from props
  useEffect(() => {
    setLocalNotes(initialNotes);
  }, [initialNotes]);

  // Subscribe to changes if using Supabase
  useEffect(() => {
    if (session) {
      const unsubscribe = subscribeToTastingNotes((updatedNotes) => {
        if (JSON.stringify(updatedNotes) !== JSON.stringify(localNotes)) {
          setLocalNotes(updatedNotes);
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [session, subscribeToTastingNotes]);

  const handleClearHistory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsClearing(true);

    try {
      const { error } = await clearTastingNotes();
      if (error) {
        console.error("Error clearing history:", error);
        return;
      }

      setShowModal(false);
      setLocalNotes([]);
    } catch (err) {
      console.error("Error in handleClearHistory:", err);
    } finally {
      setIsClearing(false);
    }
  };

  const handleRevealWine = async (index: number) => {
    const noteToUpdate = localNotes[index];
    if (!noteToUpdate || !noteToUpdate.wine) return;

    const updatedNote = {
      ...noteToUpdate,
      wine: {
        ...noteToUpdate.wine,
        isRevealed: true,
      },
    };

    if (session?.user && !IS_DEV) {
      const { error } = await updateTastingNote(updatedNote);
      if (error) {
        console.error("Error updating note:", error);
        return;
      }
    } else {
      const updatedNotes = localNotes.map((note, i) =>
        i === index ? updatedNote : note
      );
      setLocalNotes(updatedNotes);
      localStorage.setItem("wine-tastings", JSON.stringify(updatedNotes));
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "wine-tastings",
          newValue: JSON.stringify(updatedNotes),
        })
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="flex-grow bg-gray-50 py-8 sm:py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver</span>
            </button>
            <h2 className="text-2xl sm:text-3xl font-serif text-gray-800 flex items-center gap-2">
              <Wine className="text-rose-600 w-5 h-5 sm:w-6 sm:h-6" />
              Historial
            </h2>
          </div>

          {localNotes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No hay registros de catas anteriores.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:gap-6 mb-8">
                {localNotes.map((note, index) => (
                  <WineCard
                    key={note.id}
                    note={note}
                    index={index}
                    onReveal={() => handleRevealWine(index)}
                  />
                ))}
              </div>

              <div className="flex justify-center mb-16">
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors"
                  title="Limpiar historial"
                >
                  <Trash2 className="w-5 h-5" />
                  <span className="text-sm sm:text-base">
                    Limpiar Historial
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleClearHistory}
        title="Limpiar historial"
        message="¿Estás seguro de que deseas borrar todo el historial? Esta acción no se puede deshacer."
        confirmText={isClearing ? "Borrando..." : "Sí, borrar todo"}
        cancelText="Cancelar"
      />
    </div>
  );
}
