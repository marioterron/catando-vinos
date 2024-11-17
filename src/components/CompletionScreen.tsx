import React, { useEffect, useState } from 'react';
import { Wine, PartyPopper } from 'lucide-react';

interface CompletionScreenProps {
  winesCount: number;
  onViewHistory: () => void;
}

const messages = [
  "¡Ahora sí que eres todo un sommelier!",
  "Tu paladar está más educado que un profesor de universidad",
  "¡Has catado más vinos que un francés en vendimia!",
  "Si el vino fuera código, serías un desarrollador senior",
  "¡Tu nariz ya distingue más aromas que un perfumista!"
];

const buttonTexts = [
  "¡Descubre tus hazañas vinícolas!",
  "Ver mi camino del sommelier",
  "Revivir los momentos de cata",
  "Explorar mis notas magistrales",
  "¡A presumir de experiencia!"
];

export default function CompletionScreen({ winesCount, onViewHistory }: CompletionScreenProps) {
  const [showContent, setShowContent] = useState(false);
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  const randomButtonText = buttonTexts[Math.floor(Math.random() * buttonTexts.length)];

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80')] bg-cover bg-center">
      <div className="min-h-screen bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className={`text-center transform transition-all duration-1000 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex justify-center mb-8">
            <div className="relative">
              <Wine className="w-16 h-16 sm:w-20 sm:h-20 text-rose-400 animate-bounce" />
              <PartyPopper className="w-8 h-8 sm:w-10 sm:h-10 text-amber-300 absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-4 text-shadow">
            ¡Cata Finalizada!
          </h1>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8 max-w-md mx-auto border border-white/20">
            <p className="text-xl sm:text-2xl text-white mb-4 font-serif">
              Has catado <span className="font-bold text-rose-400">{winesCount}</span> {winesCount === 1 ? 'vino' : 'vinos'}
            </p>
            <p className="text-lg sm:text-xl text-white/90 italic">
              {randomMessage}
            </p>
          </div>

          <button
            onClick={onViewHistory}
            className="bg-rose-600 text-white px-8 py-3 rounded-lg font-medium text-lg hover:bg-rose-700 transition-colors inline-flex items-center gap-2 group"
          >
            <Wine className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            {randomButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}