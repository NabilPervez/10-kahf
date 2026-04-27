import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Award, Settings as SettingsIcon, CheckCircle, XCircle, RefreshCw, Home, Bell, Volume2, Moon, Play, Pause, VolumeX, Volume1 } from 'lucide-react'
import clsx from 'clsx'
import kahfData from './data/kahf.json'
import { useStore } from './store'

export default function App() {
  const [currentTab, setCurrentTab] = useState('learn') // learn, progress, settings
  const [currentView, setCurrentView] = useState('dashboard') // dashboard, quiz, summary
  const [activeModule, setActiveModule] = useState(null)
  
  const { 
    streak, 
    updateLoginStreak, 
    first10Score, 
    first10Total, 
    last10Score, 
    last10Total,
    recordQuizResult,
    troubleWords,
    soundEnabled, // we can use this for global sound, but user asked for quiz-specific toggles
    theme,
    setSetting
  } = useStore()

  useEffect(() => {
    updateLoginStreak()
  }, [updateLoginStreak])

  // Quiz State
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [results, setResults] = useState([])
  
  // Audio State
  const audioRef = useRef(null)
  const [volume, setVolume] = useState(1)
  const [autoPlayAudio, setAutoPlayAudio] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)

  const activeQuestion = questions[currentIndex]

  const startQuiz = (moduleKey) => {
    setActiveModule(moduleKey)
    setQuestions(kahfData[moduleKey])
    setCurrentIndex(0)
    setScore(0)
    setResults([])
    setSelectedOption(null)
    setIsCorrect(null)
    setCurrentView('quiz')
    setCurrentTab('learn')
  }

  const handleOptionSelect = (index) => {
    if (selectedOption !== null) return

    setSelectedOption(index)
    const question = questions[currentIndex]
    const correct = index === question.blanks[0].correctIndex
    
    setIsCorrect(correct)
    if (correct) {
      setScore(prev => prev + 1)
    }

    const newResults = [...results, { id: question.id, correct, question }]
    setResults(newResults)

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1)
        setSelectedOption(null)
        setIsCorrect(null)
      } else {
        const finalScore = correct ? score + 1 : score
        recordQuizResult(activeModule, finalScore, questions.length, newResults)
        setCurrentView('summary')
      }
    }, 1500)
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

  const getProgressPercentage = (score, total) => {
    if (total === 0) return 0
    return Math.round((score / total) * 100)
  }

  // Audio URL constructor
  const getAudioUrl = (verseKey) => {
    if (!verseKey) return ''
    const [chapter, verse] = verseKey.split(':')
    return `https://verses.quran.com/Alafasy/mp3/${chapter.padStart(3, '0')}${verse.padStart(3, '0')}.mp3`
  }

  useEffect(() => {
    if (currentView === 'quiz' && activeQuestion && autoPlayAudio && audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(e => console.log('Autoplay prevented', e))
    }
  }, [currentIndex, currentView, activeQuestion, autoPlayAudio])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (audioRef.current.ended) {
        audioRef.current.currentTime = 0
        audioRef.current.play()
      } else if (audioRef.current.paused) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    }
  }

  const handleRepeat = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play()
    }
  }

  return (
    <div className={clsx(
      "min-h-screen flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative",
      theme === 'dark' ? 'bg-brand-charcoal text-white' : 'bg-brand-background text-brand-on-surface'
    )}>
      <main className="flex-1 overflow-y-auto pb-20">
        <AnimatePresence mode="wait">
          
          {/* LEARN TAB - DASHBOARD */}
          {currentTab === 'learn' && currentView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-container flex flex-col gap-stack-lg pt-12"
            >
              <header className="text-center">
                <h1 className="font-sans text-3xl font-bold tracking-tight text-brand-primary mb-2">Surah Kahf</h1>
                <p className="text-brand-on-surface-variant font-sans">
                  Welcome back! Your streak is <span className="font-bold text-brand-success">{streak} {streak === 1 ? 'day' : 'days'}</span>.
                </p>
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
                  <div className={clsx(
                    "h-14 w-14 rounded-full border-4 flex items-center justify-center font-bold text-sm",
                    first10Total > 0 && getProgressPercentage(first10Score, first10Total) === 100 
                      ? "border-brand-success text-brand-success bg-[#ecfdf5]" 
                      : "border-brand-primary text-brand-primary bg-brand-surface"
                  )}>
                    {first10Total > 0 ? `${getProgressPercentage(first10Score, first10Total)}%` : 'Go'}
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
                  <div className={clsx(
                    "h-14 w-14 rounded-full border-4 flex items-center justify-center font-bold text-sm",
                    last10Total > 0 && getProgressPercentage(last10Score, last10Total) === 100 
                      ? "border-brand-success text-brand-success bg-[#ecfdf5]" 
                      : "border-brand-primary text-brand-primary bg-brand-surface"
                  )}>
                    {last10Total > 0 ? `${getProgressPercentage(last10Score, last10Total)}%` : 'Go'}
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* QUIZ VIEW */}
          {currentTab === 'learn' && currentView === 'quiz' && activeQuestion && (
            <motion.div
              key={`quiz-${currentIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full relative"
            >
              <div className="p-container flex items-center justify-between border-b border-brand-outline-variant/20 bg-brand-surface-container-lowest sticky top-0 z-10">
                <button onClick={() => { 
                  if (results.length > 0) {
                    recordQuizResult(activeModule, score, questions.length, results)
                  }
                  setCurrentView('dashboard'); 
                  if(audioRef.current) audioRef.current.pause() 
                }} className="text-brand-primary font-semibold hover:opacity-80">Quit</button>
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
              
              <div className="flex-1 p-container flex flex-col justify-center items-center py-stack-sm">
                
                {/* Audio Controls */}
                <div className="w-full bg-brand-surface-container-lowest p-4 rounded-xl shadow-sm border border-brand-outline-variant/20 mb-4 flex flex-col gap-3">
                  <audio 
                    ref={audioRef} 
                    src={getAudioUrl(activeQuestion.verse_key)} 
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                  />
                  
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-brand-primary">Surah Al-Kahf, Ayah {activeQuestion.verse_key.split(':')[1]}</span>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={handleRepeat}
                        className="bg-brand-surface-container text-brand-primary p-2 rounded-full hover:bg-brand-surface-container-high transition-colors"
                        title="Repeat Ayah"
                      >
                        <RefreshCw size={18} />
                      </button>
                      
                      <button 
                        onClick={handlePlayPause}
                        className="bg-brand-primary text-white p-2 rounded-full hover:bg-brand-primary-container transition-colors shadow-md"
                        title={isPlaying ? "Pause Ayah" : "Play Ayah"}
                      >
                        {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-brand-surface-container rounded-lg p-2">
                    <div className="flex items-center gap-2 flex-1">
                      {volume === 0 ? <VolumeX size={16} className="text-brand-on-surface-variant" /> : <Volume1 size={16} className="text-brand-on-surface-variant" />}
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.05" 
                        value={volume} 
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-full h-1 bg-brand-outline-variant rounded-lg appearance-none cursor-pointer accent-brand-primary"
                      />
                    </div>
                    <div className="flex items-center gap-2 border-l border-brand-outline-variant/30 pl-4">
                      <span className="text-xs font-semibold text-brand-on-surface-variant">Auto-Play</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={autoPlayAudio} onChange={() => setAutoPlayAudio(!autoPlayAudio)} />
                        <div className="w-8 h-4 bg-brand-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-brand-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Question Area */}
                <div className="text-center w-full bg-brand-surface-container-lowest p-8 rounded-2xl shadow-sm border border-brand-outline-variant/20 relative">
                  <p className="font-arabic text-4xl leading-[2.2] text-brand-on-surface dir-rtl mb-6 mt-2">
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
                  
                  <hr className="border-brand-outline-variant/30 my-6" />
                  <p className="font-sans text-brand-on-surface-variant leading-relaxed text-lg">
                    {activeQuestion.english}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full mt-6">
                  {activeQuestion.blanks[0].options.map((opt, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleOptionSelect(i)}
                      disabled={selectedOption !== null}
                      className={clsx(
                        "font-arabic text-3xl py-6 rounded-xl border-2 transition-all duration-300 font-medium shadow-sm flex flex-col items-center gap-2",
                        getOptionClass(i)
                      )}
                    >
                      <span>{opt}</span>
                    </button>
                  ))}
                </div>

                <div className="w-full mt-6 bg-brand-surface-container-lowest p-4 rounded-xl border border-brand-outline-variant/20 shadow-sm">
                  <p className="text-sm font-bold text-brand-primary mb-1 uppercase tracking-wider">Transliteration</p>
                  <p className="font-sans text-brand-on-surface-variant italic leading-relaxed">
                    {activeQuestion.transliteration}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* SUMMARY VIEW */}
          {currentTab === 'learn' && currentView === 'summary' && (
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

          {/* PROGRESS TAB */}
          {currentTab === 'progress' && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-container flex flex-col gap-stack-lg pt-12 pb-24"
            >
              <header>
                <h1 className="font-sans text-3xl font-bold tracking-tight text-brand-primary mb-2">Your Progress</h1>
                <p className="text-brand-on-surface-variant text-sm">Track your memorization journey.</p>
              </header>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-brand-surface-container-lowest p-5 rounded-xl border border-brand-outline-variant/30 text-center shadow-sm">
                  <div className="text-3xl font-bold text-brand-primary mb-1">{getProgressPercentage(first10Score, first10Total)}%</div>
                  <div className="text-xs font-bold text-brand-on-surface-variant uppercase tracking-wider">First 10</div>
                </div>
                <div className="bg-brand-surface-container-lowest p-5 rounded-xl border border-brand-outline-variant/30 text-center shadow-sm">
                  <div className="text-3xl font-bold text-brand-primary mb-1">{getProgressPercentage(last10Score, last10Total)}%</div>
                  <div className="text-xs font-bold text-brand-on-surface-variant uppercase tracking-wider">Last 10</div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-brand-on-surface mb-4 flex items-center justify-between">
                  Trouble Words
                  <span className="bg-brand-error-container text-brand-on-error-container text-xs px-2 py-1 rounded-full">{troubleWords.length}</span>
                </h3>
                
                {troubleWords.length === 0 ? (
                  <div className="bg-brand-surface-container-lowest p-8 rounded-xl border border-brand-outline-variant/30 text-center">
                    <CheckCircle className="mx-auto text-brand-success mb-3" size={32} />
                    <p className="text-brand-on-surface-variant">You have no trouble words! Keep up the great work.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {troubleWords.sort((a,b) => b.misses - a.misses).map((tw, i) => (
                      <div key={i} className="bg-brand-surface-container-lowest p-4 rounded-xl border border-brand-outline-variant/30 shadow-sm flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-arabic text-2xl text-brand-on-surface mb-1 text-right">{tw.word}</p>
                          <p className="text-sm text-brand-on-surface-variant italic truncate">{tw.english}</p>
                        </div>
                        <div className="bg-brand-error-container text-brand-on-error-container font-bold text-sm h-8 w-8 rounded-full flex items-center justify-center shrink-0">
                          {tw.misses}x
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* SETTINGS TAB */}
          {currentTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-container flex flex-col gap-stack-lg pt-12 pb-24 h-full"
            >
              <header>
                <h1 className="font-sans text-3xl font-bold tracking-tight text-brand-primary mb-2">Settings</h1>
                <p className="text-brand-on-surface-variant text-sm">Customize your learning experience.</p>
              </header>

              <div className="bg-brand-surface-container-lowest rounded-2xl border border-brand-outline-variant/30 overflow-hidden shadow-sm">
                
                <div className="p-5 flex items-center justify-between border-b border-brand-outline-variant/20">
                  <div className="flex items-center gap-3 text-brand-on-surface">
                    <Volume2 size={20} className="text-brand-primary" />
                    <span className="font-semibold">App Sounds</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={soundEnabled} onChange={() => setSetting('soundEnabled', !soundEnabled)} />
                    <div className="w-11 h-6 bg-brand-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                  </label>
                </div>

                <div className="p-5 flex items-center justify-between border-b border-brand-outline-variant/20">
                  <div className="flex items-center gap-3 text-brand-on-surface">
                    <Moon size={20} className="text-brand-primary" />
                    <span className="font-semibold">Dark Theme</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={theme === 'dark'} onChange={() => setSetting('theme', theme === 'dark' ? 'light' : 'dark')} />
                    <div className="w-11 h-6 bg-brand-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                  </label>
                </div>

                <div className="p-5 flex items-center justify-between opacity-50 cursor-not-allowed">
                  <div className="flex items-center gap-3 text-brand-on-surface">
                    <Bell size={20} className="text-brand-primary" />
                    <span className="font-semibold">Thursday Reminders</span>
                  </div>
                  <div className="text-xs bg-brand-surface-container-high px-2 py-1 rounded">Coming Soon</div>
                </div>
              </div>
              
              <div className="mt-auto text-center pb-4">
                <p className="text-xs text-brand-on-surface-variant mb-1">A Waqf Project.</p>
                <p className="text-xs font-bold text-brand-primary">10-Kahf v1.0.0</p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <nav className="bg-brand-surface-container-lowest border-t border-brand-outline-variant/20 flex justify-around items-center h-20 absolute bottom-0 w-full z-20 pb-safe">
        <button 
          onClick={() => { setCurrentTab('learn'); setCurrentView('dashboard') }} 
          className={clsx("flex flex-col items-center gap-1 relative group transition-colors", currentTab === 'learn' ? "text-brand-primary" : "text-brand-on-surface-variant hover:text-brand-primary")}
        >
          <BookOpen size={24} className={clsx(currentTab === 'learn' && "stroke-[2.5px]", "group-hover:-translate-y-1 transition-transform")} />
          <span className="text-[10px] font-bold tracking-wider">LEARN</span>
          {currentTab === 'learn' && <div className="w-1.5 h-1.5 bg-brand-primary rounded-full absolute -bottom-3"></div>}
        </button>
        
        <button 
          onClick={() => setCurrentTab('progress')}
          className={clsx("flex flex-col items-center gap-1 relative group transition-colors", currentTab === 'progress' ? "text-brand-primary" : "text-brand-on-surface-variant hover:text-brand-primary")}
        >
          <Award size={24} className={clsx(currentTab === 'progress' && "stroke-[2.5px]", "group-hover:-translate-y-1 transition-transform")} />
          <span className="text-[10px] font-bold tracking-wider">PROGRESS</span>
          {currentTab === 'progress' && <div className="w-1.5 h-1.5 bg-brand-primary rounded-full absolute -bottom-3"></div>}
        </button>
        
        <button 
          onClick={() => setCurrentTab('settings')}
          className={clsx("flex flex-col items-center gap-1 relative group transition-colors", currentTab === 'settings' ? "text-brand-primary" : "text-brand-on-surface-variant hover:text-brand-primary")}
        >
          <SettingsIcon size={24} className={clsx(currentTab === 'settings' && "stroke-[2.5px]", "group-hover:-translate-y-1 transition-transform")} />
          <span className="text-[10px] font-bold tracking-wider">SETTINGS</span>
          {currentTab === 'settings' && <div className="w-1.5 h-1.5 bg-brand-primary rounded-full absolute -bottom-3"></div>}
        </button>
      </nav>
    </div>
  )
}
