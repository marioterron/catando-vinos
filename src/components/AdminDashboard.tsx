import React, { useEffect } from "react";
import { ArrowLeft, Wine, Star, Euro, Grape } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { useSupabase } from "../hooks/useSupabase";
import type { TastingNote } from "../types/wine";

interface AdminDashboardProps {
  notes: TastingNote[];
  onBack: () => void;
}

const COLORS = ["#E11945", "#9333EA", "#0EA5E9", "#10B981"];

export default function AdminDashboard({
  notes: initialNotes,
  onBack,
}: AdminDashboardProps) {
  const [notes, setNotes] = React.useState(initialNotes);
  const { subscribeToTastingNotes } = useSupabase();

  useEffect(() => {
    const unsubscribe = subscribeToTastingNotes((updatedNotes) => {
      setNotes(updatedNotes);
    });

    return () => {
      unsubscribe();
    };
  }, [subscribeToTastingNotes]);

  const ratingData = Array.from({ length: 10 }, (_, i) => ({
    rating: i + 1,
    count: notes.filter((note) => note.rating === i + 1).length,
  }));

  const priceRanges = [
    { range: "0-10€", min: 0, max: 10 },
    { range: "10-20€", min: 10, max: 20 },
    { range: "20-30€", min: 20, max: 30 },
    { range: "30+€", min: 30, max: Infinity },
  ];

  const priceData = priceRanges
    .map((range) => ({
      name: range.range,
      value: notes.filter(
        (note) =>
          note.perceivedPrice >= range.min && note.perceivedPrice < range.max
      ).length,
    }))
    .filter((data) => data.value > 0);

  const averageRating =
    notes.length > 0
      ? (
          notes.reduce((sum, note) => sum + note.rating, 0) / notes.length
        ).toFixed(1)
      : "0";

  const averagePrice =
    notes.length > 0
      ? (
          notes.reduce((sum, note) => sum + note.perceivedPrice, 0) /
          notes.length
        ).toFixed(2)
      : "0";

  const allFlavors = notes.flatMap((note) => note.flavors);
  const topFlavors = Object.entries(
    allFlavors.reduce((acc, flavor) => {
      acc[flavor] = (acc[flavor] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: {
      name: string;
      value: number;
    }[];
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
          <p className="text-sm">{`${payload[0].name}: ${payload[0].value} ${
            payload[0].value === 1 ? "vino" : "vinos"
          }`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-serif text-gray-800 flex items-center gap-2">
            <Wine className="text-rose-600 w-6 h-6" />
            Panel de Control
          </h1>
        </div>

        {notes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No hay datos disponibles aún.
            </p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-medium text-gray-700">
                    Valoración Media
                  </h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {averageRating}/10
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <Euro className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-medium text-gray-700">
                    Precio Medio
                  </h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {averagePrice}€
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <Grape className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-medium text-gray-700">
                    Vinos Catados
                  </h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {notes.length}
                </p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Rating Distribution */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Distribución de Valoraciones
                </h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer>
                    <BarChart
                      data={ratingData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="rating"
                        label={{
                          value: "Valoración",
                          position: "bottom",
                          offset: 0,
                        }}
                      />
                      <YAxis
                        allowDecimals={false}
                        label={{
                          value: "Cantidad",
                          angle: -90,
                          position: "insideLeft",
                          offset: 10,
                        }}
                      />
                      <Tooltip />
                      <Bar dataKey="count" fill="#E11945" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Price Distribution */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Distribución de Precios
                </h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={priceData}
                        cx="50%"
                        cy="50%"
                        labelLine
                        label={({ name, percent }) =>
                          `${name} (${(percent * 100).toFixed(0)}%)`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {priceData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Top Flavors */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Aromas más Frecuentes
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {topFlavors.map(([flavor, count]) => (
                  <div
                    key={flavor}
                    className="bg-purple-50 p-4 rounded-lg text-center"
                  >
                    <p className="text-lg font-medium text-purple-700">
                      {flavor}
                    </p>
                    <p className="text-sm text-purple-600">
                      {count} {count === 1 ? "vez" : "veces"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
