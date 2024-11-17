export const TOTAL_WINES = 4;

export const WINES = [
  {
    id: "1",
    label: "Riesling Alsace",
    winery: "Wolfberger",
    year: 2022,
    price: 10.95,
    type: "blanco" as const,
    region: "Alsacia, Francia",
    grapes: ["Riesling"],
    imageUrl:
      "https://images.vivino.com/thumbs/Nw6xYwqdRkyNnDYKL9X-Ag_pb_x600.png",
  },
  {
    id: "2",
    label: "Blanc Inicial",
    winery: "B.R.O.T",
    year: 2022,
    price: 12.95,
    type: "blanco" as const,
    region: "Penedès, Cataluña",
    grapes: ["Xarel·lo"],
    imageUrl:
      "https://www.coenecoop.com/content/images/thumbs/0050931_bio-dem-brot-blanc-inicial.png",
  },
  {
    id: "3",
    label: "Graciano",
    winery: "Viña Zorzal",
    year: 2020,
    price: 8.49,
    type: "tinto" as const,
    region: "Navarra, España",
    grapes: ["Graciano"],
    imageUrl:
      "https://images.vivino.com/thumbs/vcHp6G75TwuJPmUOOkccNA_pb_x600.png",
  },
  {
    id: "4",
    label: "Ribeira Sacra Refugallo",
    winery: "Dominio do Bibei",
    year: 2014,
    price: 11.95,
    type: "tinto" as const,
    region: "Ribeira Sacra, Galicia",
    grapes: ["Mencía"],
    imageUrl:
      "https://images.vivino.com/thumbs/L4V8cFlrQV-qxSOxGdwn4A_pb_x600.png",
  },
];
