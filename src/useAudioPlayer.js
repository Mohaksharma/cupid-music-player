import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Local audio player hook (HTML5 Audio).
 *
 * Tracks come from the user's editable playlist (audio/playlist.json),
 * loaded in App via window.cupid.getLocalPlaylist(). Files are resolved
 * to file:// URLs through getAudioPath so spaces/Unicode work correctly.
 */
export default function useAudioPlayer(tracks, playMode = 'normal', getAudioPath) {
  const audioRef = useRef(new Audio());
  const playModeRef = useRef(playMode);
  playModeRef.current = playMode;
  const [trackIndex, setTrackIndex] = useState(0);
  const tracksRef = useRef(tracks);
  tracksRef.current = tracks;
  // Bump to force the load-track effect even when trackIndex is unchanged
  const [loadGeneration, setLoadGeneration] = useState(0);
  const getAudioPathRef = useRef(getAudioPath);
  getAudioPathRef.current = getAudioPath;

  console.log('[useAudioPlayer] render — trackIndex:', trackIndex, 'tracks.length:', tracks.length, 'loadGen:', loadGeneration);

  // Reset index when the playlist array identity changes (mirrors useSpotifyPlayer)
  const prevTracksRef = useRef(tracks);
  if (prevTracksRef.current !== tracks) {
    const prevTrackAtIdx = prevTracksRef.current?.[trackIndex];
    const newTrackAtIdx = tracks[trackIndex];
    const trackAtIndexChanged = prevTrackAtIdx !== newTrackAtIdx;
    console.log('[useAudioPlayer] tracks reference changed, prevLen:', prevTracksRef.current?.length, 'newLen:', tracks.length, 'trackAtIndexChanged:', trackAtIndexChanged);
    prevTracksRef.current = tracks;
    if (trackIndex >= tracks.length) {
      console.log('[useAudioPlayer] trackIndex', trackIndex, '>= tracks.length', tracks.length, '— resetting to 0');
      setTrackIndex(0);
    } else if (trackAtIndexChanged) {
      // The track at the current index changed — re-load it
      setLoadGeneration(g => g + 1);
    }
  }

  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false);
  isPlayingRef.current = isPlaying;
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolumeState] = useState(() => {
    const saved = localStorage.getItem('cupid-volume');
    return saved !== null ? parseFloat(saved) : 1;
  });
  const [muted, setMuted] = useState(false);

  const track = tracks[trackIndex] ?? { title: 'No track', artist: '', file: '', art: null };
  const audio = audioRef.current;
  audio.volume = muted ? 0 : volume;

  // Load track when index, tracks, or loadGeneration change
  useEffect(() => {
    const currentTracks = tracksRef.current;
    const t = currentTracks[trackIndex];
    console.log('[LOAD-EFFECT] Loading track at index', trackIndex, ':', t?.title || t, '— tracks.length:', currentTracks.length, 'loadGen:', loadGeneration);
    if (!t) {
      console.log('[useAudioPlayer] LOAD useEffect — no track at index', trackIndex);
      return;
    }

    let cancelled = false;
    const audioEl = audioRef.current;
    const resolveAudioPath = getAudioPathRef.current;

    (async () => {
      let src;

      // Check if this is a YouTube search result (has video_id, no file)
      if (t.video_id && !t.file) {
        // Fetch stream URL from YouTube
        try {
          console.log('[useAudioPlayer] Fetching YouTube stream for:', t.title, '-', t.artist);
          src = await window.cupid.getStreamUrl(t.title, t.artist);
          console.log('[useAudioPlayer] YouTube stream URL:', src ? 'fetched OK' : 'FAILED (null)');
        } catch (err) {
          console.error('[useAudioPlayer] Failed to get YouTube stream:', err);
          return;
        }
      } else if (t.file) {
        // Local file from playlist.json
        if (resolveAudioPath) {
          src = await resolveAudioPath(t.file);
        } else {
          src = `./${t.file}`;
        }
        console.log('[useAudioPlayer] Local file src:', src);
      } else {
        console.log('[useAudioPlayer] No valid source for track:', t);
        return; // No valid source
      }

      if (cancelled) {
        console.log('[useAudioPlayer] LOAD effect cancelled after await, skipping src assignment');
        return;
      }
      if (!src) {
        console.log('[useAudioPlayer] src is falsy, skipping');
        return;
      }
      console.log('[useAudioPlayer] Setting audio.src, isPlaying:', isPlayingRef.current, 'oldSrc:', audioEl.src?.slice(-40), 'newSrc:', src?.slice(-40));
      audioEl.pause();
      audioEl.src = src;
      audioEl.load();
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);
      if (isPlayingRef.current) {
        audioEl.play().catch((e) => console.error('[useAudioPlayer] play() failed:', e));
      }
    })();

    return () => {
      console.log('[useAudioPlayer] LOAD useEffect cleanup — cancelling for trackIndex:', trackIndex);
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIndex, loadGeneration]);

  // Time update listener
  useEffect(() => {
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) {
        setProgress(audio.currentTime / audio.duration);
      }
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const onEnded = () => {
      if (playModeRef.current === 'repeat') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
        return;
      }
      setTrackIndex((prev) => {
        const len = tracksRef.current.length;
        if (len === 0) return 0;
        let nextIdx;
        if (playModeRef.current === 'shuffle') {
          do { nextIdx = Math.floor(Math.random() * len); } while (nextIdx === prev && len > 1);
        } else {
          nextIdx = (prev + 1) % len;
        }
        // Single-track playlist: index won't change, bump generation to reload
        if (nextIdx === prev) {
          setTimeout(() => setLoadGeneration(g => g + 1), 0);
        }
        return nextIdx;
      });
      setIsPlaying(true);
    };

    const onError = (e) => {
      console.error('[useAudioPlayer] audio error event:', audio.error?.code, audio.error?.message, 'src:', audio.src);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const play = useCallback(() => {
    audio.play().catch(() => {});
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    audio.pause();
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause]);

  const next = useCallback(() => {
    const len = tracksRef.current.length;
    console.log('[NEXT-BUTTON] Total tracks:', len, 'Track titles:', tracksRef.current.map(t => t.title));
    if (len === 0) return;

    setTrackIndex((prev) => {
      let nextIdx;
      if (playModeRef.current === 'shuffle' && len > 1) {
        do { nextIdx = Math.floor(Math.random() * len); } while (nextIdx === prev);
      } else {
        nextIdx = (prev + 1) % len;
      }
      console.log('[NEXT-BUTTON] Current trackIndex:', prev, 'Total tracks:', len, 'Next index will be:', nextIdx);

      // If index doesn't change (e.g. single-song playlist), bump generation
      // to force the load effect to re-run
      if (nextIdx === prev) {
        console.log('[useAudioPlayer] next() — same index, bumping loadGeneration');
        // Schedule after this setState batch completes
        setTimeout(() => setLoadGeneration(g => g + 1), 0);
      }
      return nextIdx;
    });
    setIsPlaying(true);
  }, []);

  const prev = useCallback(() => {
    setIsPlaying(true);
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } else {
      setTrackIndex((p) => {
        const len = tracksRef.current.length;
        if (len === 0) return 0;
        return (p - 1 + len) % len;
      });
    }
  }, []);

  const playTrackAt = useCallback((index) => {
    const len = tracksRef.current.length;
    if (len === 0) return;
    const idx = Math.max(0, Math.min(index, len - 1));
    setTrackIndex((prev) => {
      if (prev === idx) {
        // Same index — bump generation to force reload
        setTimeout(() => setLoadGeneration(g => g + 1), 0);
      }
      return idx;
    });
    setIsPlaying(true);
  }, []);

  const seek = useCallback((fraction) => {
    if (audio.duration) {
      audio.currentTime = Math.min(fraction, 1) * audio.duration;
    }
  }, []);

  const setVolume = useCallback((v) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
    audio.volume = clamped;
    localStorage.setItem('cupid-volume', clamped);
    if (clamped > 0) setMuted(false);
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      audio.volume = m ? volume : 0;
      return !m;
    });
  }, [volume]);

  return {
    track,
    trackIndex,
    isPlaying,
    progress,
    duration,
    currentTime,
    togglePlay,
    next,
    prev,
    seek,
    volume,
    setVolume,
    muted,
    toggleMute,
    playTrackAt,
  };
}
