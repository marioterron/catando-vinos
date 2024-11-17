export interface Wine {
  id: string;
  label: string;
  winery: string;
  year?: number;
  price?: number;
  type: "tinto" | "blanco" | "rosado" | "espumoso";
  region?: string;
  grapes?: string[];
  isRevealed?: boolean;
  imageUrl?: string;
}

export interface TastingNote {
  comments: string;
  date: string;
  flavors: string[];
  id: string;
  perceivedPrice: number;
  rating: number;
  wine: Wine;
}
