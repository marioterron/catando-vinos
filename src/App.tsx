import React, { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import TastingForm from './components/TastingForm';
import TastingHistory from './components/TastingHistory';
import CompletionScreen from './components/CompletionScreen';
import Footer from './components/Footer';
import Modal from './components/Modal';
import AdminDashboard from './components/AdminDashboard';
import { TastingNote } from './types/wine';
import { useSwipeNavigation } from './hooks/useSwipeNavigation';
import { TOTAL_WINES } from './constants/wines';
import { useSupabase } from './hooks/useSupabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Wine } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState<'welcome' | 'tasting' | 'history' | 'completion' | 'admin'>('welcome');
  const [tastingNotes, setTastingNotes] = useState<TastingNote[]>([]);
  const [isSwipeTransition, setIsSwipeTransition] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const { session, loading, signIn, getTastingNotes, saveTastingNote } = useSupabase();

  useEffect(() => {
    if (session) {
      loadTastingNotes();
    } else {
      const savedNotes = localStorage.getItem('wine-tastings');
      if (savedNotes) {
        setTastingNotes(JSON.parse(savedNotes));
      }
    }
  }, [session, currentView]);

  const loadTastingNotes = async () => {
    const { data, error } = await getTastingNotes();
    if (data && !error) {
      setTastingNotes(data);
    }
  };

  const handleNewTasting = () => {
    if (tastingNotes.length >= TOTAL_WINES) {
      setShowResetModal(true);
    } else {
      setCurrentView('tasting');
    }
  };

  const handleResetTasting = () => {
    setTastingNotes([]);
    localStorage.removeItem('wine-tastings');
    setCurrentView('tasting');
    setShowResetModal(false);
  };

  const handleViewHistory = () => {
    setCurrentView('history');
  };

  const handleViewAdmin = () => {
    setCurrentView('admin');
  };

  const handleTastingSubmit = async (data: TastingNote) => {
    const newNote = {
      ...data,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    
    if (session) {
      const { error } = await saveTastingNote(newNote);
      if (!error) {
        await loadTastingNotes();
      }
    } else {
      const updatedNotes = [...tastingNotes, newNote];
      setTastingNotes(updatedNotes);
      localStorage.setItem('wine-tastings', JSON.stringify(updatedNotes));
    }
  };

  const handleBack = () => {
    setCurrentView('welcome');
  };

  const handleFinishTasting = () => {
    setCurrentView('completion');
  };

  useSwipeNavigation({
    onSwipeRight: () => {
      setIsSwipeTransition(true);
      if (currentView === 'tasting' || currentView === 'history' || currentView === 'admin') {
        handleBack();
      } else if (currentView === 'completion') {
        handleViewHistory();
      }
      setTimeout(() => setIsSwipeTransition(false), 300);
    },
  });

  const pageVariants = {
    initial: isSwipeTransition ? { 
      opacity: 0
    } : { opacity: 1 },
    animate: { 
      opacity: 1,
      transition: {
        duration: 0.2,
        ease: 'easeInOut'
      }
    },
    exit: isSwipeTransition ? { 
      opacity: 0,
      transition: {
        duration: 0.15,
        ease: 'easeInOut'
      }
    } : { opacity: 1 }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Wine className="w-12 h-12 text-rose-600 animate-bounce mx-auto mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentView}
          className="flex-grow"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {currentView === 'welcome' && (
            <WelcomeScreen
              onNewTasting={handleNewTasting}
              onViewHistory={handleViewHistory}
              onViewAdmin={handleViewAdmin}
              session={session}
              onSignIn={signIn}
            />
          )}
          {currentView === 'tasting' && (
            <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80')] bg-cover bg-center">
              <div className="min-h-screen bg-black/30 py-12">
                <TastingForm 
                  onSubmit={handleTastingSubmit} 
                  onBack={handleBack}
                  onFinish={handleFinishTasting}
                  wineNumber={tastingNotes.length + 1} 
                />
              </div>
            </div>
          )}
          {currentView === 'history' && (
            <TastingHistory
              notes={tastingNotes}
              onBack={handleBack}
            />
          )}
          {currentView === 'completion' && (
            <CompletionScreen
              winesCount={tastingNotes.length}
              onViewHistory={handleViewHistory}
            />
          )}
          {currentView === 'admin' && (
            <AdminDashboard
              notes={tastingNotes}
              onBack={handleBack}
            />
          )}
        </motion.div>
      </AnimatePresence>
      {currentView !== 'completion' && <Footer />}

      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleResetTasting}
        title={
          <div className="flex items-center gap-2">
            <Wine className="w-6 h-6 text-rose-600" />
            <span>¡Nueva aventura vinícola!</span>
          </div>
        }
        message="¿Te apetece embarcarte en una nueva experiencia de cata?"
        confirmText={
          <div className="flex items-center gap-2 justify-center">
            <Wine className="w-5 h-5" />
            <span>¡Sí, descorchemos más vinos!</span>
          </div>
        }
        cancelText="Mejor otro momento"
      />
    </div>
  );
}

export default App;