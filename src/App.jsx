import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Award, Settings, CheckCircle, XCircle } from 'lucide-react'
import clsx from 'clsx'

// Mock Data
const MOCK_DATA = {
  first10: [
    {
      id: 1,
      arabic: "ٱلْحَمْدُ لِلَّهِ ٱلَّذِىٓ أَنزَلَ عَلَىٰ عَبْدِهِ ٱلْكِتَـٰبَ وَلَمْ يَجْعَل لَّهُۥ عِوَجَا ۜ",
      english: "All praise is due to Allah, who has sent down upon His Servant the Book and has not made therein any deviance.",
      blanks: [
        { word: "ٱلْكِتَـٰبَ", options: ["ٱلْكِتَـٰبَ", "ٱلْقُرْءَانَ", "ٱلْفُرْقَانَ", "ٱلذِّكْرَ"], correctIndex: 0 },
      ]
    }
    // ... more ayahs
  ]
}

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard') // dashboard, quiz_first, quiz_last, summary

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-brand-background shadow-2xl overflow-hidden relative">
      {/* Content Area */}
      <main className="flex-1 overflow-y-auto pb-20">
        <AnimatePresence mode="wait">
          {currentView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-container flex flex-col gap-stack-lg pt-12"
            >
              <header className="text-center">
                <h1 className="font-sans text-3xl font-bold tracking-tight text-brand-primary mb-2">Surah Kahf</h1>
                <p className="text-brand-on-surface-variant font-sans">Welcome back! Your current streak is <span className="font-bold text-brand-success">3 days</span>.</p>
              </header>

              <div className="flex flex-col gap-stack-md">
                <button 
                  onClick={() => setCurrentView('quiz_first')}
                  className="bg-brand-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(6,95,70,0.05)] border border-brand-outline-variant/30 text-left flex items-center justify-between group hover:shadow-[0_8px_30px_rgba(6,95,70,0.08)] transition-all"
                >
                  <div>
                    <h2 className="text-xl font-bold text-brand-on-surface mb-1 group-hover:text-brand-primary transition-colors">First 10 Ayahs</h2>
                    <p className="text-sm text-brand-on-surface-variant">Master the opening protection</p>
                  </div>
                  <div className="h-12 w-12 rounded-full border-4 border-brand-success flex items-center justify-center text-brand-success font-bold">
                    80%
                  </div>
                </button>

                <button 
                  onClick={() => setCurrentView('quiz_last')}
                  className="bg-brand-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(6,95,70,0.05)] border border-brand-outline-variant/30 text-left flex items-center justify-between group hover:shadow-[0_8px_30px_rgba(6,95,70,0.08)] transition-all"
                >
                  <div>
                    <h2 className="text-xl font-bold text-brand-on-surface mb-1 group-hover:text-brand-primary transition-colors">Last 10 Ayahs</h2>
                    <p className="text-sm text-brand-on-surface-variant">Complete your memorization</p>
                  </div>
                  <div className="h-12 w-12 rounded-full border-4 border-brand-surface-variant flex items-center justify-center text-brand-on-surface-variant font-bold">
                    10%
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {currentView === 'quiz_first' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full"
            >
              <div className="p-container flex items-center justify-between border-b border-brand-outline-variant/20 bg-brand-surface-container-lowest sticky top-0 z-10">
                <button onClick={() => setCurrentView('dashboard')} className="text-brand-primary font-semibold">Cancel</button>
                <div className="flex-1 mx-4">
                  <div className="h-1.5 bg-brand-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-brand-primary w-1/10 rounded-full transition-all duration-500"></div>
                  </div>
                </div>
                <span className="text-sm font-semibold text-brand-on-surface-variant">1/10</span>
              </div>
              
              <div className="flex-1 p-container flex flex-col justify-center items-center py-stack-lg">
                <div className="text-center w-full bg-brand-surface-container-lowest p-8 rounded-xl shadow-sm border border-brand-outline-variant/20">
                  <p className="font-arabic text-3xl leading-[2.5] text-brand-on-surface dir-rtl mb-6">
                    ٱلْحَمْدُ لِلَّهِ ٱلَّذِىٓ أَنزَلَ عَلَىٰ عَبْدِهِ <span className="inline-block border-b-2 border-brand-primary min-w-[80px] mx-2 text-transparent select-none">_______</span> وَلَمْ يَجْعَل لَّهُۥ عِوَجَا ۜ
                  </p>
                  <hr className="border-brand-outline-variant/30 my-6" />
                  <p className="font-sans text-brand-on-surface-variant leading-relaxed text-lg">
                    All praise is due to Allah, who has sent down upon His Servant the Book and has not made therein any deviance.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full mt-12">
                  {MOCK_DATA.first10[0].blanks[0].options.map((opt, i) => (
                    <button key={i} className="font-arabic text-2xl py-4 bg-brand-surface-container-lowest border-2 border-brand-surface-container-high rounded-xl hover:border-brand-primary hover:bg-brand-surface-container transition-all text-brand-on-surface">
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <nav className="bg-brand-surface-container-lowest border-t border-brand-outline-variant/20 flex justify-around items-center h-20 absolute bottom-0 w-full z-20 pb-safe">
        <button className="flex flex-col items-center gap-1 text-brand-primary relative">
          <BookOpen size={24} className="stroke-[2.5px]" />
          <span className="text-[10px] font-bold tracking-wider">LEARN</span>
          <div className="w-1.5 h-1.5 bg-brand-primary rounded-full absolute -bottom-3"></div>
        </button>
        <button className="flex flex-col items-center gap-1 text-brand-on-surface-variant hover:text-brand-primary transition-colors">
          <Award size={24} />
          <span className="text-[10px] font-bold tracking-wider">PROGRESS</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-brand-on-surface-variant hover:text-brand-primary transition-colors">
          <Settings size={24} />
          <span className="text-[10px] font-bold tracking-wider">SETTINGS</span>
        </button>
      </nav>
    </div>
  )
}
