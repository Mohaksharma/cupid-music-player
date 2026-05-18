import { useCallback, useRef, useEffect, useState } from 'react';
import './App.css';
import useAudioPlayer from './useAudioPlayer';
import useSpotifyPlayer from './useSpotifyPlayer';
import useTheme from './useTheme';
import { useMusicIntegration } from './useMusicIntegration';
import { login as spotifyLogin, handleCallback, isLoggedIn as isSpotifyLoggedIn, logout as spotifyLogout } from './spotify/auth.js';
import { fetchPlaylistTracks as fetchSpotifyTracks, fetchMyPlaylists as fetchSpotifyPlaylists } from './spotify/api.js';
import { login as appleLogin, logout as appleLogout, isLoggedIn as isAppleLoggedIn, initMusicKit } from './apple/auth.js';
import { fetchMyPlaylists as fetchApplePlaylists, fetchPlaylistTracks as fetchAppleTracks } from './apple/api.js';

import progressBarStars from '../assets/progress_bar_stars.png';
import star from '../assets/star.png';
import starSelected from '../assets/star_selected.png';

function useResize(corner) {
  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    let lastX = e.screenX;
    let lastY = e.screenY;

    const onMouseMove = (e) => {
      const dx = e.screenX - lastX;
      const dy = e.screenY - lastY;
      lastX = e.screenX;
      lastY = e.screenY;
      window.cupid?.resize({ dx, dy, corner });
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, [corner]);

  return onMouseDown;
}

function formatTime(seconds) {
  if (!seconds || !isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function MarqueeText({ className, text }) {
  const outerRef = useRef(null);
  const textRef = useRef(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  useEffect(() => {
    const outer = outerRef.current;
    const textEl = textRef.current;
    if (!outer || !textEl) return;
    setShouldScroll(textEl.offsetWidth > outer.clientWidth);
  }, [text]);

  return (
    <div className={`${className} marquee-container`} ref={outerRef}>
      {/* Hidden span to measure true text width */}
      <span ref={textRef} className="marquee-measure">{text}</span>
      <span className={shouldScroll ? 'marquee-scroll' : ''}>
        {text}
        {shouldScroll && <span className="marquee-gap">{text}</span>}
      </span>
    </div>
  );
}

export default function App() {
  // ── Source state ─────────────────────────────────────────
  const [source, setSource] = useState('local'); // 'local' | 'streaming'
  const [spotifyConnected, setSpotifyConnected] = useState(isSpotifyLoggedIn());
  const [appleConnected, setAppleConnected] = useState(isAppleLoggedIn());
  const [streamTracks, setStreamTracks] = useState([]);
  const [spotifyPlaylists, setSpotifyPlaylists] = useState([]);
  const [applePlaylists, setApplePlaylists] = useState([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);
  const [loadingPlaylist, setLoadingPlaylist] = useState(false);
  const [settingsError, setSettingsError] = useState(null);
  const [musicService, setMusicService] = useState('local'); // 'spotify' | 'apple' | 'local'
  const [playMode, setPlayMode] = useState('normal'); // 'normal' | 'shuffle' | 'repeat'
  const [volumeHovered, setVolumeHovered] = useState(false);
  const [volumeDragging, setVolumeDragging] = useState(false);
  const volumeBarRef = useRef(null);
  const [showDebug] = useState(false);
  const [localTracks, setLocalTracks] = useState([]);

  // ── Music Integration: Search, List, Playlists ────────────
  const music = useMusicIntegration(localTracks);

  const loadLocalPlaylist = useCallback(async () => {
    if (!window.cupid?.getLocalPlaylist) return;
    try {
      const tracks = await window.cupid.getLocalPlaylist();
      setLocalTracks(Array.isArray(tracks) ? tracks : []);
    } catch (err) {
      console.error('Failed to load local playlist:', err);
    }
  }, []);

  useEffect(() => { loadLocalPlaylist(); }, [loadLocalPlaylist]);

  // Determine which tracks to play: from active playlist or from local files
  const activePlaylistSongs = music.playlists.find(p => p.id === music.selectedPlaylist)?.songs || [];
  const tracksToPlay = activePlaylistSongs.length > 0 ? activePlaylistSongs : localTracks;
  console.log('[APP] tracksToPlay length:', tracksToPlay.length, 'Selected playlist ID:', music.selectedPlaylist, 'Active playlist songs:', activePlaylistSongs.length, 'localTracks:', localTracks.length);

  const local = useAudioPlayer(tracksToPlay, playMode, window.cupid?.getLocalAudioPath);
  const streaming = useSpotifyPlayer(streamTracks, playMode);
  const player = source === 'streaming' ? streaming : local;

  const {
    track,
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
  } = player;

  const cyclePlayMode = useCallback(() => {
    setPlayMode((m) => m === 'normal' ? 'shuffle' : m === 'shuffle' ? 'repeat' : 'normal');
  }, []);

  // ── Fetch Spotify playlists ────────────────────────────
  const loadSpotifyPlaylists = useCallback((silent = false) => {
    setLoadingPlaylists(true);
    if (!silent) setSettingsError(null);
    fetchSpotifyPlaylists()
      .then((p) => { setSpotifyPlaylists(p); setSettingsError(null); })
      .catch((err) => { if (!silent) setSettingsError(err.message); })
      .finally(() => setLoadingPlaylists(false));
  }, []);

  // ── Fetch Apple Music playlists ────────────────────────
  const loadApplePlaylists = useCallback((silent = false) => {
    setLoadingPlaylists(true);
    if (!silent) setSettingsError(null);
    fetchApplePlaylists()
      .then((p) => { setApplePlaylists(p); setSettingsError(null); })
      .catch((err) => { if (!silent) setSettingsError(err.message); })
      .finally(() => setLoadingPlaylists(false));
  }, []);

  // ── Handle Spotify OAuth callback on mount ─────────────
  useEffect(() => {
    async function checkCallback() {
      const params = new URLSearchParams(window.location.search);
      if (params.has('code')) {
        try {
          await handleCallback();
          setSpotifyConnected(true);
          // Small delay to let token settle before fetching
          setTimeout(() => loadSpotifyPlaylists(true), 500);
        } catch (err) {
          setSettingsError(err.message);
        }
      } else {
        if (isSpotifyLoggedIn()) loadSpotifyPlaylists(true);
        if (isAppleLoggedIn()) loadApplePlaylists(true);
      }
    }
    checkCallback();
  }, []);

  // ── Load a playlist by ID (works for both services) ───
  const loadPlaylist = useCallback(async (id, service) => {
    setLoadingPlaylist(true);
    setSettingsError(null);
    try {
      const fetcher = service === 'apple' ? fetchAppleTracks : fetchSpotifyTracks;
      const tracks = await fetcher(id);
      if (tracks.length === 0) {
        setSettingsError('Playlist is empty');
        return;
      }
      setStreamTracks(tracks);
      setSource('streaming');
    } catch (err) {
      setSettingsError(err.message);
    } finally {
      setLoadingPlaylist(false);
    }
  }, []);

  const { theme, toggleTheme, assets } = useTheme();

  const [recordFrame, setRecordFrame] = useState(0);
  const [needleFrame, setNeedleFrame] = useState(0);
  const [isPink, setIsPink] = useState(theme === 'pink');
  const [swapping, setSwapping] = useState(false);
  const [needleLifted, setNeedleLifted] = useState(false);
  const [starHovered, setStarHovered] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [hoverProgress, setHoverProgress] = useState(null);
  const seekRef = useRef(null);

  useEffect(() => {
    if (!dragging) return;
    const onMouseMove = (e) => {
      const rect = seekRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      setHoverProgress(pct);
      seek(pct);
    };
    const onMouseUp = () => {
      setDragging(false);
      setStarHovered(false);
      setHoverProgress(null);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging, seek]);

  useEffect(() => {
    if (!volumeDragging) return;
    const onMouseMove = (e) => {
      if (!volumeBarRef.current) return;
      const rect = volumeBarRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height));
      setVolume(pct);
    };
    const onMouseUp = () => {
      setVolumeDragging(false);
      setVolumeHovered(false);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [volumeDragging, setVolume]);
  const [needleChangeFrame, setNeedleChangeFrame] = useState(0);
  // null sentinel = haven't seen any track yet; 'No track' = placeholder while
  // tracks load async. Both should silently set the ref without animating.
  const prevTrackRef = useRef(null);

  const currentFrames = isPink ? assets.recordFramesA : assets.recordFramesB;
  const incomingFrames = isPink ? assets.recordFramesB : assets.recordFramesA;

  // Spin animation while playing
  useEffect(() => {
    if (!isPlaying || swapping) return;
    const interval = setInterval(() => {
      setRecordFrame((f) => (f + 1) % currentFrames.length);
      setNeedleFrame((f) => (f + 1) % assets.needlePlayFrames.length);
    }, 400);
    return () => clearInterval(interval);
  }, [isPlaying, swapping, currentFrames.length]);

  // Detect song change and trigger swap
  // Sequence: needle lifts (0→1→2) → records swap → needle lowers (2→1→0)
  useEffect(() => {
    if (prevTrackRef.current === track.title) return;
    const wasInitialOrPlaceholder = prevTrackRef.current === null || prevTrackRef.current === 'No track';
    prevTrackRef.current = track.title;
    if (track.title === 'No track') return;
    if (wasInitialOrPlaceholder) return;
    if (needleLifted) return;

    setNeedleLifted(true);
    setNeedleChangeFrame(0);

    // Show needle lifted (frame 1 = index 1)
    setTimeout(() => setNeedleChangeFrame(1), 200);

    // Start record swap
    setTimeout(() => setSwapping(true), 400);

    // Finish swap, switch color
    setTimeout(() => {
      setIsPink((p) => !p);
      setRecordFrame(0);
      setSwapping(false);
    }, 1000);

    // Needle lower after swap is done, reset to frame 1
    setTimeout(() => {
      setNeedleChangeFrame(0);
      setNeedleLifted(false);
      setNeedleFrame(0);
    }, 1100);

  }, [track.title, needleLifted]);

  const resizeTL = useResize('top-left');
  const resizeTR = useResize('top-right');
  const resizeBL = useResize('bottom-left');
  const resizeBR = useResize('bottom-right');

  return (
    <div className={`player ${theme === 'blue' ? 'theme-blue' : ''}`}>
      {/* Base frame */}
      <img src={assets.frame} className="layer" alt="" draggable={false} />

      {/* Window title */}
      <div className="window-title">cupid player</div>

      {/* Record player centered in frame */}
      <img src={assets.recordPlayer} className="record-player" alt="" draggable={false} />
      <img
        src={currentFrames[recordFrame]}
        className={`record-player ${swapping ? 'record-slide-out' : ''}`}
        alt=""
        draggable={false}
      />
      {swapping && (
        <img
          src={incomingFrames[0]}
          className="record-player record-slide-in"
          alt=""
          draggable={false}
        />
      )}
      <img
        src={needleLifted ? assets.needleChangeFrames[needleChangeFrame] : assets.needlePlayFrames[needleFrame]}
        className="record-player"
        alt=""
        draggable={false}
      />

      {/* Frame overlay (no background) to clip sliding records */}
      <img src={assets.frameNoBg} className="layer frame-overlay" alt="" draggable={false} />

      {/* Decorative */}
      <img src={assets.plant} className="plant-icon" alt="" draggable={false} />

      {/* Progress bar layers */}
      <img src={assets.progressBar} className="layer layer-ui" alt="" draggable={false} />
      <img
        src={progressBarStars}
        className="layer layer-ui"
        alt=""
        draggable={false}
        style={{
          clipPath: `inset(0 ${(1 - (131 + (hoverProgress ?? progress) * 226 + 10) / 512) * 100}% 0 0)`,
        }}
      />
      <img
        src={starHovered ? starSelected : star}
        className={`layer layer-ui star-indicator ${starHovered ? 'star-hovered' : ''}`}
        alt=""
        draggable={false}
        style={{
          transform: `translateX(calc(-3 / 306 * 100vw + ${(hoverProgress ?? progress) * (226 / 512) * 171.9}vw))`,
        }}
      />

      {/* Playback control layers (visual only) */}
      <img src={assets.backwardsButton} className="layer layer-ui" alt="" draggable={false} />
      <img src={isPlaying ? assets.pauseButton : assets.playButton} className="layer layer-ui" alt="" draggable={false} />
      <img src={assets.forwardsButton} className="layer layer-ui" alt="" draggable={false} />

      {/* Volume/mute button layer */}
      <img
        src={muted ? assets.muteButton : assets.volumeButton}
        className="layer layer-ui"
        alt=""
        draggable={false}
        style={{ opacity: 0.8 }}
      />

      {/* Shuffle/repeat button layer */}
      <img
        src={playMode === 'repeat' ? assets.repeatButton : assets.shuffleButton}
        className="layer layer-ui"
        alt=""
        draggable={false}
        style={{ opacity: playMode === 'normal' ? 0.4 : 0.8 }}
      />

      {/* Window control layers (visual only) */}
      <img src={assets.minimizerButton} className="layer layer-ui" alt="" draggable={false} />
      <img src={assets.windowButton} className="layer layer-ui" alt="" draggable={false} />
      <img src={assets.exitButton} className="layer layer-ui" alt="" draggable={false} />

      {/* Search button layer */}
      <img src={assets.searchButton} className="layer layer-ui" alt="" draggable={false} />

      {/* Settings button layer */}
      <img src={assets.settings} className="layer layer-ui settings-layer" alt="" draggable={false} />

      {/* SVG clip-path for pixel-art album mask */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id="album-mask" clipPathUnits="objectBoundingBox">
            {/* 35x41 centered vertically */}
            <rect x="0.07317" y="0" width="0.85366" height="1" />
            {/* 37x39 */}
            <rect x="0.04878" y="0.02439" width="0.90244" height="0.95122" />
            {/* 39x37 */}
            <rect x="0.02439" y="0.04878" width="0.95122" height="0.90244" />
            {/* 41x35 */}
            <rect x="0" y="0.07317" width="1" height="0.85366" />
          </clipPath>
        </defs>
      </svg>

      {/* Album art clipped to pixel mask */}
      {track.art && (
        <div className="album-mask">
          <img src={track.art} className="album-art" alt="" draggable={false} />
        </div>
      )}

      {/* Album frame overlay */}
      <img src={assets.albumFrame} className="layer album-frame-layer" alt="" draggable={false} />

      {/* Now playing section */}
      <div className="now-playing">
        <div className="track-info">
          <div className="now-playing-label">
            now playing...
          </div>
          <MarqueeText className="track-title" text={track.title} />
          <div className="track-artist">by {track.artist}</div>
        </div>
      </div>

      {/* Time display */}
      <div className="time-display">
        <span className="time-current">{formatTime(currentTime)}</span>
        <span className="time-remaining">{formatTime(duration - currentTime)}</span>
      </div>

      {/* Drag region for moving the window */}
      <div className="drag-region" />

      {/* Custom resize handles at frame corners */}
      <div className="resize-handle top-left" onMouseDown={resizeTL} />
      <div className="resize-handle top-right" onMouseDown={resizeTR} />
      <div className="resize-handle bottom-left" onMouseDown={resizeBL} />
      <div className="resize-handle bottom-right" onMouseDown={resizeBR} />

      {/* Progress bar seek target */}
      <div
        className="progress-seek"
        ref={seekRef}
        onMouseEnter={() => setStarHovered(true)}
        onMouseLeave={() => { if (!dragging) { setStarHovered(false); } }}
        onMouseDown={(e) => {
          e.preventDefault();
          setDragging(true);
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
          setHoverProgress(pct);
          seek(pct);
        }}
      />

      {/* Playback control click targets */}
      <div className="btn btn-prev" onClick={prev} />
      <div className="btn btn-play" onClick={togglePlay} />
      <div className="btn btn-next" onClick={() => { console.log('[NEXT-BUTTON] Clicked — source:', source, 'tracksToPlay.length:', tracksToPlay.length, 'titles:', tracksToPlay.map(t => t.title)); next(); }} />

      {/* Volume bar layers — shown on hover or drag */}
      {(volumeHovered || volumeDragging) && (
        <>
          <img src={assets.volumeBarLow} className="layer layer-ui volume-bar-layer" alt="" draggable={false} />
          <img
            src={assets.volumeBarHigh}
            className="layer layer-ui volume-bar-layer"
            alt=""
            draggable={false}
            style={{
              clipPath: `inset(${((1 - (muted ? 0 : volume)) * (420 - 338) / 512 + 338 / 512) * 100}% 0 0 0)`,
            }}
          />
        </>
      )}

      {/* Volume icon — hover to reveal bar */}
      <div
        className={`volume-hover-zone ${(volumeHovered || volumeDragging) ? 'expanded' : ''}`}
        onMouseLeave={() => { if (!volumeDragging) setVolumeHovered(false); }}
      >
        <div
          className="btn-volume-icon"
          onClick={toggleMute}
          onMouseEnter={() => setVolumeHovered(true)}
        />
        {(volumeHovered || volumeDragging) && (
          <div
            className="volume-bar-area"
            ref={volumeBarRef}
            onMouseDown={(e) => {
              e.preventDefault();
              setVolumeDragging(true);
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height));
              setVolume(pct);
            }}
          />
        )}
      </div>

      {/* Shuffle/repeat click target */}
      <div className="btn btn-playmode" onClick={cyclePlayMode} title={playMode} />

      {/* Window control click targets */}
      <div className="btn btn-minimize" onClick={() => window.cupid?.minimize()} />
      <div className="btn btn-window" onClick={() => window.cupid?.maximize()} />
      <div className="btn btn-exit" onClick={() => window.cupid?.close()} />

      {/* Search button click target */}
      <div className="btn btn-search" onClick={() => setShowSearch((v) => !v)} />

      {/* Settings button */}
      <div className="btn btn-settings" onClick={() => setShowSettings((v) => !v)} />

      {/* Debug overlays — toggle with showDebug state */}
      {showDebug && (
        <>
          <div className="debug-overlay btn btn-prev" />
          <div className="debug-overlay btn btn-play" />
          <div className="debug-overlay btn btn-next" />
          <div className="debug-overlay volume-hover-zone" />
          <div className="debug-overlay volume-bar-area-debug" />
          <div className="debug-overlay btn btn-playmode" />
        </>
      )}


      {/* Settings panel */}
      {showSettings && (
        <div className="settings-panel">
          <div className="settings-panel-inner">
            {/* ═══════════════════════════════════════════════════════════ */}
            {/* PLAYLISTS */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <div className="settings-label">❤️ playlists</div>
            <div style={{ marginBottom: '8px' }}>
              {music.playlists.map(p => (
                <div
                  key={p.id}
                  style={{
                    padding: '6px',
                    marginBottom: '4px',
                    background: '#f9f9f9',
                    borderRadius: '3px',
                    border: p.id === music.selectedPlaylist ? '2px solid #ff69b4' : '1px solid #eee',
                    fontSize: '10px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: '9px', opacity: 0.7 }}>
                        {p.songs.length} songs
                      </div>
                    </div>
                    <button
                      onClick={() => music.setSelectedPlaylist(p.id)}
                      style={{
                        padding: '3px 6px',
                        fontSize: '9px',
                        cursor: 'pointer',
                        background: p.id === music.selectedPlaylist ? '#ff69b4' : '#e0e0e0',
                        color: p.id === music.selectedPlaylist ? 'white' : 'black',
                        border: 'none',
                        borderRadius: '2px',
                      }}
                    >
                      {p.id === music.selectedPlaylist ? '✓' : 'select'}
                    </button>
                  </div>

                  {p.id === music.selectedPlaylist && p.songs.length > 0 && (
                    <div style={{ marginTop: '4px', maxHeight: '80px', overflowY: 'auto', fontSize: '9px' }}>
                      {p.songs.map((song, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '2px 4px',
                            borderBottom: '1px solid #ddd',
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span>{song.title}</span>
                          <button
                            onClick={() => music.removeFromPlaylist(song.title, p.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#999',
                              cursor: 'pointer',
                              fontSize: '9px',
                              padding: '0 2px',
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* THEME */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <div className="settings-label">theme</div>
            <div className="settings-theme-row">
              <button
                className={`settings-theme-btn ${theme === 'pink' ? 'active' : ''}`}
                onClick={() => { if (theme !== 'pink') toggleTheme(); }}
              >
                pink
              </button>
              <button
                className={`settings-theme-btn ${theme === 'blue' ? 'active' : ''}`}
                onClick={() => { if (theme !== 'blue') toggleTheme(); }}
              >
                blue
              </button>
            </div>

            {settingsError && <div className="settings-error">{settingsError}</div>}
          </div>
        </div>
      )}

      {/* SEARCH PANEL */}
      {showSearch && (
        <div className="settings-panel">
          <div className="settings-panel-inner">
            <div className="settings-label">🔍 search</div>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
              <input
                type="text"
                autoFocus
                placeholder="search youtube..."
                value={music.searchQuery}
                onChange={(e) => music.setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && music.searchQuery.trim()) {
                    music.search(music.searchQuery);
                  }
                }}
                style={{
                  flex: 1,
                  padding: '6px',
                  borderRadius: '3px',
                  border: '1px solid #ccc',
                  fontSize: '11px',
                  boxSizing: 'border-box',
                }}
              />
              <button
                onClick={() => {
                  if (music.searchQuery.trim()) {
                    music.search(music.searchQuery);
                  }
                }}
                style={{
                  padding: '6px 10px',
                  borderRadius: '3px',
                  border: '1px solid #aaa',
                  background: '#e0e0e0',
                  fontSize: '11px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  imageRendering: 'pixelated',
                }}
              >
                🔍
              </button>
            </div>

            {music.searchLoading && (
              <div style={{ color: '#999', fontSize: '10px', marginBottom: '8px' }}>
                searching...
              </div>
            )}

            {Array.isArray(music.searchResults) && music.searchResults.length > 0 && !music.searchLoading && (
              <div style={{ marginBottom: '8px' }}>
                {music.searchResults.map((song, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      // Add song to active playlist
                      music.addToPlaylist(song, music.selectedPlaylist);
                      // Compute the index of the newly added song
                      // (it will be appended at the end of the playlist's songs)
                      const currentPlaylist = music.playlists.find(p => p.id === music.selectedPlaylist);
                      const newIndex = currentPlaylist ? currentPlaylist.songs.length : 0;
                      // Use setTimeout to let React re-render with the updated tracksToPlay
                      setTimeout(() => {
                        if (playTrackAt) playTrackAt(newIndex);
                      }, 0);
                    }}
                    style={{
                      width: '100%',
                      padding: '6px',
                      marginBottom: '4px',
                      background: '#f5f5f5',
                      border: '1px solid #ddd',
                      borderRadius: '3px',
                      fontSize: '10px',
                      cursor: 'pointer',
                      color: '#333',
                    }}
                  >
                    <div style={{ fontWeight: 'bold', color: '#222' }}>
                      {song.title}
                    </div>
                    <div style={{ fontSize: '9px', opacity: 0.7, color: '#555' }}>
                      {song.artist}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {music.searchQuery && (!Array.isArray(music.searchResults) || music.searchResults.length === 0) && !music.searchLoading && (
              <div style={{ color: '#999', fontSize: '10px', marginBottom: '8px' }}>
                No songs found
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
