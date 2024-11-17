import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Wine as WineIcon,
  Star,
  Euro,
  Wine,
  Grape,
  MapPin,
  ImageOff,
  AlertTriangle,
} from "lucide-react";
import { TastingNote } from "../types/wine";

interface WineCardProps {
  note: TastingNote;
  index: number;
  onReveal?: () => void;
}

export default function WineCard({ note, index, onReveal }: WineCardProps) {
  const wine = note.wine;
  const isRevealed = wine?.isRevealed;
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <motion.div
      layout
      className="relative"
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        layout
        className={`wine-card ${
          isRevealed ? "bg-gradient-to-br from-rose-50 to-white" : ""
        }`}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {!isRevealed ? (
          <>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg sm:text-xl font-serif text-gray-800">
                Vino #{index + 1}
              </h3>
              <span className="text-xs sm:text-sm text-gray-500">
                {new Date(note.date!).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2">
                <Star className="text-amber-500 w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-base sm:text-lg font-medium">
                  Valoración: {note.rating}/10
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Euro className="text-green-600 w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-base sm:text-lg font-medium">
                  Precio estimado: {note.perceivedPrice.toFixed(2)} €
                </span>
              </div>

              {note.flavors.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2 text-sm sm:text-base">
                    Aromas y Sabores:
                  </h4>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {note.flavors.map((flavor) => (
                      <span
                        key={flavor}
                        className="px-2 sm:px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm"
                      >
                        {flavor}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {note.comments && (
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                  <p className="text-gray-700 text-sm sm:text-base">
                    {note.comments}
                  </p>
                </div>
              )}
            </div>

            {wine && !isRevealed && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={onReveal}
                  className="w-full bg-rose-600 text-white py-2.5 sm:py-3 rounded-lg hover:bg-rose-700 transition-colors flex items-center justify-center gap-2 text-base sm:text-lg font-medium"
                >
                  <WineIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  Revelar vino
                </button>
                <div className="mt-3 flex items-start gap-2 text-amber-600 text-xs sm:text-sm">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>
                    Esta acción es irreversible y contiene spoilers. No reveles
                    el vino hasta que el anfitrión lo indique.
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          wine && (
            <div className="flex gap-4 sm:gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-3 mb-4 sm:mb-6">
                  <h3 className="text-xl sm:text-2xl font-serif text-gray-800 leading-tight">
                    {wine.label}
                  </h3>
                  <span className="px-2 sm:px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs sm:text-sm whitespace-nowrap">
                    {wine.type}
                  </span>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2">
                    <Wine className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 shrink-0" />
                    <span className="text-base sm:text-lg truncate">
                      {wine.winery}
                    </span>
                  </div>

                  {wine.year && (
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-lg sm:text-xl">
                        {wine.year}
                      </span>
                    </div>
                  )}

                  {wine.grapes && (
                    <div className="flex items-center gap-2">
                      <Grape className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 shrink-0" />
                      <div className="flex flex-wrap gap-1 sm:gap-1.5">
                        {wine.grapes.map((grape) => (
                          <span
                            key={grape}
                            className="px-2 py-0.5 sm:px-2 sm:py-1 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm"
                          >
                            {grape}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {wine.region && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0" />
                      <span className="text-sm sm:text-base">
                        {wine.region}
                      </span>
                    </div>
                  )}

                  {wine.price && (
                    <div className="flex items-center gap-2">
                      <Euro className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 shrink-0" />
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <span className="text-base sm:text-lg font-medium">
                          {wine.price.toFixed(2)} €
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500">
                          (estimaste: {note.perceivedPrice.toFixed(2)} €)
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="pt-3 sm:pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-amber-500">
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                      <span className="text-base sm:text-lg font-medium">
                        Tu valoración: {note.rating}/10
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {wine.imageUrl && !imageError ? (
                <div className="relative w-24 sm:w-32 md:w-40 shrink-0">
                  <div className="absolute inset-0 flex items-center">
                    <div className="relative h-full w-full rounded-lg overflow-hidden shadow-lg bg-gray-100">
                      <img
                        src={wine.imageUrl}
                        alt={wine.label}
                        onError={handleImageError}
                        className="h-full w-full object-contain object-center p-2"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent pointer-events-none" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative w-24 sm:w-32 md:w-40 shrink-0">
                  <div className="absolute inset-0 flex items-center">
                    <div className="flex items-center justify-center h-full w-full rounded-lg bg-gray-100">
                      <ImageOff className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </motion.div>
    </motion.div>
  );
}
