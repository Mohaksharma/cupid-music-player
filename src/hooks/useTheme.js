import { useState, useEffect } from 'react'

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState(() => {
    // Load theme from localStorage or default to 'pink'
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cupid-theme') || 'pink'
    }
    return 'pink'
  })

  // Persist theme to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cupid-theme', currentTheme)
      // Update CSS data attribute for theme switching
      document.documentElement.setAttribute('data-theme', currentTheme)
    }
  }, [currentTheme])

  const toggleTheme = () => {
    setCurrentTheme((prev) => (prev === 'pink' ? 'blue' : 'pink'))
  }

  return {
    currentTheme,
    toggleTheme,
  }
}
