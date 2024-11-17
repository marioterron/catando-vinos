import React from "react";

import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="absolute bottom-0 w-full py-3 sm:py-4 text-center text-white bg-black/20 backdrop-blur-sm">
      <p className="flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base">
        Made with
        <Heart
          className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400 animate-pulse"
          fill="currentColor"
        />
        by Mario Terrón
      </p>
    </footer>
  );
}
