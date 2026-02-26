import React, { useState, useEffect } from 'react';
import { X, Heart, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EXIT_INTENT_KEY = 'slay_exit_shown';

export const ExitIntentModal = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed
    if (localStorage.getItem(EXIT_INTENT_KEY)) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger when mouse moves toward top of viewport (leaving)
      if (e.clientY <= 5 && !localStorage.getItem(EXIT_INTENT_KEY)) {
        setIsVisible(true);
      }
    };

    // Also trigger on mobile after 45 seconds of inactivity
    const mobileTimer = setTimeout(() => {
      if (window.innerWidth < 768 && !localStorage.getItem(EXIT_INTENT_KEY)) {
        setIsVisible(true);
      }
    }, 45000);

    // Delay adding listener so it doesn't fire immediately
    const addDelay = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 5000);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(mobileTimer);
      clearTimeout(addDelay);
    };
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(EXIT_INTENT_KEY, 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleDismiss}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-teal-500 p-6 text-white relative">
              <button
                onClick={handleDismiss}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
              <Heart className="w-8 h-8 mb-3" />
              <h2 className="text-2xl font-bold">Wait! Before you go...</h2>
              <p className="text-white/80 mt-1">Your future together deserves 5 minutes</p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-slate-700 font-medium">
                  Did you know? <strong>40% of couples</strong> discover preventable health issues after marriage. A simple check can save years of heartbreak.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-800">Get your free health checklist:</p>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    10 tests every couple should take
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    Red flags to watch for
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    Questions to ask your doctor
                  </li>
                </ul>
              </div>

              <a
                href="/login"
                onClick={handleDismiss}
                className="w-full flex items-center justify-center gap-2 bg-[#D4544C] text-white py-3 px-6 rounded-xl font-semibold hover:bg-[#c24941] transition-colors"
              >
                Get Started Free <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={handleDismiss}
                className="w-full text-sm text-slate-400 hover:text-slate-600 transition-colors py-2"
              >
                No thanks, I'll risk it
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
