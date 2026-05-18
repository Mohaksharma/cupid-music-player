import { useState, useRef, useEffect } from 'react'

export function useAudioPlayer(playlist, playMode = 'normal') {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)

  const currentSong = playlist[currentSongIndex]

  // Helper to get next index based on play mode
  const getNextIndex = (currentIndex) => {
    if (playMode === 'shuffle') {
      return Math.floor(Math.random() * playlist.length)
    }
    return (currentIndex + 1) % playlist.length
  }

  // Set up audio event listeners
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const handleEnded = () => {
      if (playMode === 'repeat') {
        // Restart current song
        audio.currentTime = 0
        audio.play()
      } else {
        // Move to next song
        const nextIdx = getNextIndex(currentSongIndex)
        setCurrentSongIndex(nextIdx)
      }
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [currentSongIndex, playMode, getNextIndex])

  // Auto-play when song changes
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play()
    }
  }, [currentSongIndex])

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleNext = () => {
    const nextIndex = getNextIndex(currentSongIndex)
    setCurrentSongIndex(nextIndex)
    setIsPlaying(true)
  }

  const handlePrevious = () => {
    const prevIndex = currentSongIndex === 0 ? playlist.length - 1 : currentSongIndex - 1
    setCurrentSongIndex(prevIndex)
    setIsPlaying(true)
  }

  const handleProgressChange = (e) => {
    const newTime = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    currentSongIndex,
    currentSong,
    handlePlayPause,
    handleNext,
    handlePrevious,
    handleProgressChange,
    formatTime,
  }
}
