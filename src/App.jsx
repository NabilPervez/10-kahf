import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Award, Settings, CheckCircle, XCircle, RefreshCw, Home, Eye, EyeOff } from 'lucide-react'
import clsx from 'clsx'
import kahfData from './data/kahf.json'

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard') // dashboard, quiz, summary
  const [activeModule, setActiveModule] = useState(null) // 'first10' or 'last10'
  
  // Quiz State
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [showTranslation, setShowTranslation] = useState(false)
  const [results, setResults] = useState([]) // array of { id, correct }

  const startQuiz = (moduleKey) => {
    setActiveModule(moduleKey)
    setQuestions(kahfData[moduleKey])
    setCurrentIndex(0)
    setScore(0)
    setResults([])
    setSelectedOption(null)
    setIsCorrect(null)
    setShowTranslation(false)
    setCurrentView('quiz')
  }

  const handleOptionSelect = (index) => {
    if (selectedOption !== null) return // prevent multiple clicks

    setSelectedOption(index)
    const question = questions[currentIndex]
    const correct = index === question.blanks[0].correctIndex
    
    setIsCorrect(correct)
    if (correct) {
      setScore(prev => prev + 1)
    }

    setResults(prev => [...prev, { id: question.id, correct, question }])

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1)
        setSelectedOption(null)
        setIsCorrect(null)
        setShowTranslation(false)
      } else {
        setCurrentView('summary')
      }
    }, 1500) // wait 1.5s to show feedback before advancing
  }

  const getOptionClass = (index) => {
    if (selectedOption === null) return "border-brand-surface-container-high bg-brand-surface-container-lowest text-brand-on-surface hover:border-brand-primary"
    
    const correctIndex = questions[currentIndex].blanks[0].correctIndex
    if (index === correctIndex) {
      return "border-brand-success bg-[#ecfdf5] text-brand-success shadow-[0_0_15px_rgba(34,197,94,0.3)]"
    }
    if (index === selectedOption && index !== correctIndex) {
      return "border-brand-error bg-brand-error-container text-brand-on-error-container"
    }
    return "border-brand-surface-container-high bg-brand-surface-container-lowest opacity-50"
  }

  const activeQuestion = questions[currentIndex]

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-brand-background shadow-2xl overflow-hidden relative">
      <main className="flex-1 overflow-y-auto pb-20">
        <AnimatePresence mode="wait">
          
          {/* DASHBOARD */}
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
                <p className="text-brand-on-surface-variant font-sans">Welcome back! Your streak is <span className="font-bold text-brand-success">3 days</span>.</p>
              </header>

              <div className="flex flex-col gap-stack-md">
                <button 
                  onClick={() => startQuiz('first10')}
                  className="bg-brand-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(6,95,70,0.05)] border border-brand-outline-variant/30 text-left flex items-center justify-between group hover:shadow-[0_8px_30px_rgba(6,95,70,0.08)] transition-all"
                >
                  <div>
                    <h2 className="text-xl font-bold text-brand-on-surface mb-1 group-hover:text-brand-primary transition-colors">First 10 Ayahs</h2>
                    <p className="text-sm text-brand-on-surface-variant">Master the opening protection</p>
                  </div>
                  <div className="h-12 w-12 rounded-full border-4 border-brand-success flex items-center justify-center text-brand-success font-bold bg-[#ecfdf5]">
                    Go
                  </div>
                </button>

                <button 
                  onClick={() => startQuiz('last10')}
                  className="bg-brand-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(6,95,70,0.05)] border border-brand-outline-variant/30 text-left flex items-center justify-between group hover:shadow-[0_8px_30px_rgba(6,95,70,0.08)] transition-all"
                >
                  <div>
                    <h2 className="text-xl font-bold text-brand-on-surface mb-1 group-hover:text-brand-primary transition-colors">Last 10 Ayahs</h2>
                    <p className="text-sm text-brand-on-surface-variant">Complete your memorization</p>
                  </div>
                  <div className="h-12 w-12 rounded-full border-4 border-brand-surface-variant flex items-center justify-center text-brand-on-surface-variant font-bold">
                    Go
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* QUIZ VIEW */}
          {currentView === 'quiz' && activeQuestion && (
            <motion.div
              key={`quiz-${currentIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full relative"
            >
              <div className="p-container flex items-center justify-between border-b border-brand-outline-variant/20 bg-brand-surface-container-lowest sticky top-0 z-10">
                <button onClick={() => setCurrentView('dashboard')} className="text-brand-primary font-semibold hover:opacity-80">Quit</button>
                <div className="flex-1 mx-4">
                  <div className="h-2 bg-brand-surface-container-high rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-brand-success rounded-full transition-all duration-500"
                      style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-bold text-brand-on-surface-variant">{currentIndex + 1}/{questions.length}</span>
              </div>
              
              <div className="flex-1 p-container flex flex-col justify-center items-center py-stack-lg">
                <div className="text-center w-full bg-brand-surface-container-lowest p-8 rounded-2xl shadow-sm border border-brand-outline-variant/20 relative">
                  
                  <button 
                    onClick={() => setShowTranslation(!showTranslation)}
                    className="absolute top-4 right-4 text-brand-on-surface-variant hover:text-brand-primary transition-colors bg-brand-surface-container p-2 rounded-full"
                    title="Toggle Translation Hint"
                  >
                    {showTranslation ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>

                  <p className="font-arabic text-4xl leading-[2.2] text-brand-on-surface dir-rtl mb-6 mt-4">
                    {activeQuestion.arabic.split(activeQuestion.blanks[0].word).map((part, i, arr) => (
                      <span key={i}>
                        {part}
                        {i !== arr.length - 1 && (
                           <span className={clsx(
                             "inline-block border-b-4 mx-2 min-w-[80px] text-center px-2 pb-1 transition-colors duration-300",
                             selectedOption === null ? "border-brand-primary text-transparent" : 
                             isCorrect ? "border-brand-success text-brand-success" : "border-brand-error text-brand-error"
                           )}>
                             {selectedOption !== null ? activeQuestion.blanks[0].options[selectedOption] : '_______'}
                           </span>
                        )}
                      </span>
                    ))}
                  </p>
                  
                  <AnimatePresence>
                    {showTranslation && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <hr className="border-brand-outline-variant/30 my-6" />
                        <p className="font-sans text-brand-on-surface-variant leading-relaxed text-lg">
                          {activeQuestion.english}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full mt-12">
                  {activeQuestion.blanks[0].options.map((opt, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleOptionSelect(i)}
                      disabled={selectedOption !== null}
                      className={clsx(
                        "font-arabic text-3xl py-6 rounded-xl border-2 transition-all duration-300 font-medium",
                        getOptionClass(i)
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* SUMMARY VIEW */}
          {currentView === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-container flex flex-col h-full pt-12 pb-24"
            >
              <div className="text-center mb-8">
                <div className="w-32 h-32 mx-auto rounded-full border-8 border-brand-success flex items-center justify-center mb-4 bg-[#ecfdf5]">
                  <span className="text-4xl font-bold text-brand-success">{Math.round((score/questions.length)*100)}%</span>
                </div>
                <h2 className="text-2xl font-bold text-brand-primary">Module Complete!</h2>
                <p className="text-brand-on-surface-variant mt-2">You got {score} out of {questions.length} correct.</p>
              </div>

              <div className="flex-1 bg-brand-surface-container-lowest rounded-2xl border border-brand-outline-variant/30 p-4 overflow-y-auto mb-8 shadow-sm">
                <h3 className="font-bold text-brand-on-surface mb-4 border-b border-brand-outline-variant/20 pb-2">Review</h3>
                <div className="flex flex-col gap-4">
                  {results.map((r, i) => (
                    <div key={i} className="flex gap-3 items-start border-b border-brand-surface-container pb-3 last:border-0">
                      {r.correct ? (
                        <CheckCircle className="text-brand-success shrink-0 mt-1" size={20} />
                      ) : (
                        <XCircle className="text-brand-error shrink-0 mt-1" size={20} />
                      )}
                      <div>
                        <p className="font-arabic text-xl dir-rtl text-right text-brand-on-surface leading-loose">{r.question.arabic}</p>
                        {!r.correct && (
                          <p className="text-sm mt-2 text-brand-error bg-brand-error-container p-2 rounded-lg">
                            <span className="font-bold">Missed word:</span> <span className="font-arabic text-lg">{r.question.blanks[0].word}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => startQuiz(activeModule)}
                  className="flex-1 flex items-center justify-center gap-2 bg-brand-surface-container text-brand-primary font-bold py-4 rounded-xl hover:bg-brand-surface-container-high transition-colors"
                >
                  <RefreshCw size={20} />
                  Retry
                </button>
                <button 
                  onClick={() => setCurrentView('dashboard')}
                  className="flex-1 flex items-center justify-center gap-2 bg-brand-primary text-brand-on-primary font-bold py-4 rounded-xl hover:bg-brand-primary-container transition-colors shadow-lg shadow-brand-primary/20"
                >
                  <Home size={20} />
                  Home
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <nav className="bg-brand-surface-container-lowest border-t border-brand-outline-variant/20 flex justify-around items-center h-20 absolute bottom-0 w-full z-20 pb-safe">
        <button className="flex flex-col items-center gap-1 text-brand-primary relative group">
          <BookOpen size={24} className="stroke-[2.5px] group-hover:-translate-y-1 transition-transform" />
          <span className="text-[10px] font-bold tracking-wider">LEARN</span>
          <div className="w-1.5 h-1.5 bg-brand-primary rounded-full absolute -bottom-3"></div>
        </button>
        <button className="flex flex-col items-center gap-1 text-brand-on-surface-variant hover:text-brand-primary transition-colors group">
          <Award size={24} className="group-hover:-translate-y-1 transition-transform" />
          <span className="text-[10px] font-bold tracking-wider">PROGRESS</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-brand-on-surface-variant hover:text-brand-primary transition-colors group">
          <Settings size={24} className="group-hover:-translate-y-1 transition-transform" />
          <span className="text-[10px] font-bold tracking-wider">SETTINGS</span>
        </button>
      </nav>
    </div>
  )
}
