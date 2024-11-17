import React, { useState } from 'react';
import { Mail } from 'lucide-react';

interface AuthProps {
  onSignIn: (email: string) => Promise<{ error: string | null }>;
}

export default function Auth({ onSignIn }: AuthProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await onSignIn(email);

    if (error) {
      setMessage({ type: 'error', text: error });
    } else {
      setMessage({
        type: 'success',
        text: '¡Revisa tu email! Te hemos enviado un enlace mágico para acceder.',
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80')] bg-cover bg-center">
      <div className="min-h-screen bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-md p-8 rounded-lg border border-white/20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif text-white mb-2">Bienvenido</h2>
            <p className="text-gray-200">Accede para guardar tus catas y ver estadísticas</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="tu@email.com"
                  required
                />
                <Mail className="absolute right-3 top-2.5 text-white/50 w-5 h-5" />
              </div>
            </div>

            {message && (
              <div
                className={`p-4 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-green-500/20 text-green-100'
                    : 'bg-rose-500/20 text-rose-100'
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-600 text-white py-2 rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Acceder con Email'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}