import React, { useState } from "react";
import { Wine, BookOpenCheck, BarChart3, Mail, LogIn } from "lucide-react";
import Modal from "./Modal";

interface WelcomeScreenProps {
  onNewTasting: () => void;
  onViewHistory: () => void;
  onViewAdmin: () => void;
  session: unknown;
  onSignIn: (email: string) => Promise<{ error: string | null }>;
}

export default function WelcomeScreen({
  onNewTasting,
  onViewHistory,
  onViewAdmin,
  session,
  onSignIn,
}: WelcomeScreenProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const isAdmin = session?.user?.email === "marioterron157@gmail.com";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await onSignIn(email);

    if (error) {
      setMessage({ type: "error", text: error });
    } else {
      setMessage({
        type: "success",
        text: "¡Revisa tu email! Te hemos enviado un enlace mágico para acceder.",
      });
    }
    setLoading(false);
  };

  const LoginForm = (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          placeholder="tu@email.com"
          required
        />
      </div>
      {message && (
        <div
          className={`p-3 rounded-md text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-800"
              : "bg-rose-50 text-rose-800"
          }`}
        >
          {message.text}
        </div>
      )}
    </form>
  );

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col"
      style={{
        backgroundImage:
          'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80")',
      }}
    >
      {/* Header with login button */}
      {!session && (
        <div className="p-4 flex justify-end">
          <button
            onClick={() => setShowLoginModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white transition-colors"
          >
            <span className="text-sm">Iniciar Sesión</span>
            <LogIn className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Main content */}
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full px-4 sm:px-6 md:px-8 max-w-4xl mx-auto -mt-12 sm:mt-0">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-3 sm:mb-4 leading-tight">
              Catando vinos a ciegas
            </h1>
            <p className="text-lg md:text-xl text-gray-200">
              Porque lo importante es el sabor, no la etiqueta. ¡A probar se ha
              dicho!
            </p>
          </div>

          <div
            className={`grid grid-cols-1 ${
              isAdmin ? "md:grid-cols-3" : "md:grid-cols-2"
            } gap-4 md:gap-8 max-w-3xl mx-auto`}
          >
            <button
              onClick={onNewTasting}
              disabled={!session}
              className="group bg-white/10 backdrop-blur-md hover:bg-white/20 p-6 md:p-8 rounded-lg border border-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/10"
            >
              <Wine className="w-10 h-10 md:w-12 md:h-12 text-rose-300 mb-3 md:mb-4 mx-auto group-hover:scale-110 transition-transform" />
              <h2 className="text-xl md:text-2xl font-serif text-white mb-2">
                Nueva Cata
              </h2>
              <p className="text-sm md:text-base text-gray-300">
                ¡Vamos a darle al vino!
              </p>
            </button>

            <button
              onClick={onViewHistory}
              disabled={!session}
              className="group bg-white/10 backdrop-blur-md hover:bg-white/20 p-6 md:p-8 rounded-lg border border-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/10"
            >
              <BookOpenCheck className="w-10 h-10 md:w-12 md:h-12 text-amber-300 mb-3 md:mb-4 mx-auto group-hover:scale-110 transition-transform" />
              <h2 className="text-xl md:text-2xl font-serif text-white mb-2">
                Ver Historial
              </h2>
              <p className="text-sm md:text-base text-gray-300">
                Revisa tus favoritos
              </p>
            </button>

            {isAdmin && (
              <button
                onClick={onViewAdmin}
                disabled={!session}
                className="group bg-white/10 backdrop-blur-md hover:bg-white/20 p-6 md:p-8 rounded-lg border border-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/10"
              >
                <BarChart3 className="w-10 h-10 md:w-12 md:h-12 text-emerald-300 mb-3 md:mb-4 mx-auto group-hover:scale-110 transition-transform" />
                <h2 className="text-xl md:text-2xl font-serif text-white mb-2">
                  Estadísticas
                </h2>
                <p className="text-sm md:text-base text-gray-300">
                  Analiza los resultados
                </p>
              </button>
            )}
          </div>

          {!session && (
            <div className="mt-8 text-center">
              <p className="text-white/80 text-sm">
                Inicia sesión para comenzar a catar vinos
              </p>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showLoginModal && !session}
        onClose={() => {
          setShowLoginModal(false);
          setMessage(null);
          setEmail("");
        }}
        title={
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-rose-600" />
            <span>Accede para continuar</span>
          </div>
        }
        message={LoginForm}
        confirmText={loading ? "Enviando..." : "Acceder con Email"}
        cancelText="Cancelar"
        onConfirm={handleSubmit}
      />
    </div>
  );
}
