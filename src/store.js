import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(
  persist(
    (set, get) => ({
      streak: 0,
      lastLoginDate: null,
      first10Score: 0,
      first10Total: 0,
      last10Score: 0,
      last10Total: 0,
      troubleWords: [], // Array of { word, english, arabic_context, misses }
      
      // Settings
      theme: 'light', // light/dark
      soundEnabled: true,
      
      updateLoginStreak: () => {
        const today = new Date().toDateString()
        const { lastLoginDate, streak } = get()
        
        if (lastLoginDate === today) return // already logged in today
        
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        
        if (lastLoginDate === yesterday.toDateString()) {
          set({ streak: streak + 1, lastLoginDate: today })
        } else {
          set({ streak: 1, lastLoginDate: today })
        }
      },
      
      recordQuizResult: (module, score, maxScore, results) => {
        set((state) => {
          const updates = {}
          if (module === 'first10') {
            updates.first10Score = score
            updates.first10Total = maxScore
          } else if (module === 'last10') {
            updates.last10Score = score
            updates.last10Total = maxScore
          }
          
          // Update trouble words
          let newTroubleWords = [...state.troubleWords]
          results.forEach(r => {
            if (!r.correct) {
              const missedWord = r.question.blanks[0].word
              const existingIndex = newTroubleWords.findIndex(tw => tw.word === missedWord)
              if (existingIndex >= 0) {
                newTroubleWords[existingIndex] = { 
                  ...newTroubleWords[existingIndex], 
                  misses: newTroubleWords[existingIndex].misses + 1 
                }
              } else {
                newTroubleWords.push({
                  word: missedWord,
                  english: r.question.english,
                  arabic_context: r.question.arabic,
                  misses: 1
                })
              }
            }
          })
          
          updates.troubleWords = newTroubleWords
          return updates
        })
      },

      setSetting: (key, value) => set({ [key]: value })
    }),
    {
      name: 'kahf-storage',
    }
  )
)
