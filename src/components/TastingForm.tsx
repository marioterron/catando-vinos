import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRightCircle,
  CheckCircle2,
  Droplet,
  Euro,
  PenTool,
  Star,
  Wine,
} from "lucide-react";

import { TOTAL_WINES, WINES } from "../constants/wines";
import { TastingNote } from "../types/wine";
import Autocomplete from "./Autocomplete";
import Modal from "./Modal";

interface TastingFormProps {
  onSubmit: (data: TastingNote) => void;
  onBack: () => void;
  onFinish: () => void;
  wineNumber: number;
}

export default function TastingForm({
  onSubmit,
  onBack,
  onFinish,
  wineNumber,
}: TastingFormProps) {
  const [rating, setRating] = useState(5);
  const [price, setPrice] = useState(15);
  const [notes, setNotes] = useState("");
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLastWine = wineNumber === TOTAL_WINES;

  const flavorSuggestions = [
    "Frutal",
    "Terroso",
    "Especiado",
    "Floral",
    "Roble",
    "Mineral",
    "Herbáceo",
    "Cítrico",
    "Mora",
    "Cereza",
    "Ciruela",
    "Grosella",
    "Vainilla",
    "Tabaco",
    "Cuero",
    "Chocolate",
    "Café",
    "Pimienta",
    "Canela",
    "Miel",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const tastingNote: TastingNote = {
        id: crypto.randomUUID(),
        rating,
        perceivedPrice: price,
        flavors: selectedFlavors,
        comments: notes,
        wine: WINES[wineNumber - 1],
        date: new Date().toISOString(),
      };

      await onSubmit(tastingNote);

      if (isLastWine) {
        onFinish();
      } else {
        // Reset form for next wine
        setRating(5);
        setPrice(15);
        setNotes("");
        setSelectedFlavors([]);
      }
    } catch (error) {
      console.error("Error submitting tasting note:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmFinish = async (e: React.FormEvent) => {
    await handleSubmit(e);
    onFinish();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6">
      <div className="bg-white/95 rounded-lg shadow-xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-serif text-gray-800">
              Vino #{wineNumber}
            </h2>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              key={wineNumber}
              className="text-rose-600"
            >
              <Wine className="w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform" />
            </motion.div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          <div>
            <label className="flex items-center gap-2 text-base sm:text-lg font-medium text-gray-700 mb-2">
              <Star className="text-amber-500" />
              Valoración
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={rating}
              onChange={(e) => {
                setRating(Number(e.target.value));
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="text-center text-xl sm:text-2xl font-bold text-amber-500 mt-2">
              {rating}/10
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-base sm:text-lg font-medium text-gray-700 mb-2">
              <Euro className="text-green-600" />
              Precio Estimado
            </label>
            <input
              type="range"
              min="3"
              max="35"
              step="0.5"
              value={price}
              onChange={(e) => {
                setPrice(Number(e.target.value));
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
            />
            <div className="text-center text-xl sm:text-2xl font-bold text-green-600 mt-2">
              {price.toFixed(2)} €
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-base sm:text-lg font-medium text-gray-700 mb-3">
              <Droplet className="text-purple-600" />
              Aromas y Sabores
            </label>
            <Autocomplete
              suggestions={flavorSuggestions}
              selectedItems={selectedFlavors}
              onItemsChange={(items) => {
                setSelectedFlavors(items);
              }}
              placeholder="Escribe un aroma o sabor..."
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-base sm:text-lg font-medium text-gray-700 mb-2">
              <PenTool className="text-gray-600" />
              Notas
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-base"
              rows={3}
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
              }}
              placeholder="Describe tus impresiones sobre el vino..."
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-rose-600 text-white py-3 rounded-lg hover:bg-rose-700 transition-colors font-medium text-lg flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLastWine ? (
                <>
                  <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>
                    {isSubmitting ? "Guardando..." : "Finalizar Cata"}
                  </span>
                </>
              ) : (
                <>
                  <ArrowRightCircle className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  <span>
                    {isSubmitting ? "Guardando..." : "Siguiente Vino"}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <Modal
        isOpen={showFinishModal}
        onClose={() => setShowFinishModal(false)}
        onConfirm={handleConfirmFinish}
        title="Finalizar Cata"
        message="Tienes cambios sin guardar. ¿Deseas guardar los cambios antes de finalizar?"
        confirmText={isSubmitting ? "Guardando..." : "Guardar y finalizar"}
        cancelText="Cancelar"
      />
    </div>
  );
}
