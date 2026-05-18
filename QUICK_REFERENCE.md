# Quick Reference Guide

## What is This App?
A desktop music player built with React, Node.js, and Electron. Plays music from local files, Spotify, or Apple Music.

## Commands

```bash
# Install dependencies (run once)
npm install

# Start developing (hot reload enabled)
npm run dev

# Build for distribution
npm run build

# Preview the build
npm preview
```

## File Structure at a Glance

```
src/
├── App.jsx              ← Main UI (what you see)
├── App.css              ← Styling
├── useAudioPlayer.js    ← Audio playback logic
├── useTheme.js          ← Theme colors
├── useSpotifyPlayer.js  ← Spotify integration
├── spotify/             ← Spotify authentication & API
└── apple/               ← Apple Music authentication & API

electron/
├── main.cjs             ← Electron backend (file access, IPC)
└── preload.cjs          ← Security bridge

assets/                 ← Icons and images
audio/                  ← Sample audio files
font/                   ← Custom fonts
```

## Key Concepts (Simple)

| Term | Meaning |
|------|---------|
| **React** | Creates what you see on screen |
| **Node.js** | Runs code on your computer (not in browser) |
| **Electron** | Makes web apps work as desktop apps |
| **Vite** | Packages code and enables hot reload |
| **Hook** | Function that manages data (useState, useEffect) |
| **State** | Data that can change and causes UI updates |
| **IPC** | Communication between React (UI) and Node (backend) |
| **API** | Way to request data from Spotify/Apple |
| **OAuth** | Secure login (Spotify/Apple) |

## Common Code Patterns

### Using State (Track Changes)
```javascript
const [isPlaying, setIsPlaying] = useState(false);
// useState returns: [currentValue, functionToChangeIt]
// When you call setIsPlaying(true), React updates the UI
```

### Using Effects (Run When Data Changes)
```javascript
useEffect(() => {
  // This code runs when 'isPlaying' changes
  console.log('Playing:', isPlaying);
}, [isPlaying]); // Dependency array
```

### Using Refs (Access DOM Elements)
```javascript
const audioRef = useRef(null);
// Later: audioRef.current.play() // Play the audio
```

### Communicating with Electron
```javascript
// From React, ask Electron to do something:
const tracks = await window.cupid.getLocalPlaylist();

// Electron listens and responds:
ipcMain.handle('get-local-playlist', async () => {
  return readMusicFilesFromDisk();
});
```

## How to Make Changes

### Change the UI
Edit `src/App.jsx` and refresh (hot reload)

### Change Colors
Edit `src/App.css` or `src/useTheme.js`

### Add Spotify Features
Edit `src/spotify/api.js` or `src/useSpotifyPlayer.js`

### Debug the App
Press **Ctrl+Shift+I** (or **Cmd+Option+I** on Mac) → DevTools opens → Console tab for errors

## Understanding the Player Flow

```
1. npm run dev starts Vite + Electron
2. React code loads and displays the player UI
3. User interacts (clicks buttons, logs in, plays music)
4. React state updates, UI re-renders
5. For local files: React asks Electron to read from disk
6. For streaming: React communicates with Spotify/Apple APIs
7. Audio plays, progress updates in real-time
```

## Important Files to Know

| File | What it does |
|------|-------------|
| `src/App.jsx` | Everything you see + main logic |
| `electron/main.cjs` | File access, window management, Electron setup |
| `package.json` | Dependencies, scripts, build config |
| `vite.config.js` | How Vite builds your code |
| `.env` | API keys (Spotify, Apple) |

## Spotify Integration Quick Start

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create an app
3. Copy Client ID
4. Add to `.env`:
   ```env
   VITE_SPOTIFY_CLIENT_ID=your_id
   VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
   ```
5. Restart: `npm run dev`

## Apple Music Integration Quick Start

1. See `APPLE_MUSIC_SETUP.md` in project root
2. Generate developer token from Apple
3. Add to `.env`:
   ```env
   APPLE_TEAM_ID=...
   APPLE_KEY_ID=...
   ```

## Common Issues & Fixes

| Problem | Solution |
|---------|----------|
| App won't start | `npm install` then `npm run dev` |
| Blank window | Press Ctrl+Shift+I, check Console for errors |
| Hot reload not working | Restart `npm run dev` |
| Spotify login fails | Check `.env` credentials |
| Can't find music files | Check file permissions in Electron |

## Understanding React Components

A component is like a function that returns UI:

```javascript
function App() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

**What happens:**
1. Component renders (returns JSX/HTML)
2. User clicks button → onClick fires
3. setCount updates state
4. Component re-renders with new count
5. UI updates automatically

## Understanding Hooks

Hooks are functions that "hook into" React features:

```javascript
// Hook 1: useState - Store data
const [data, setData] = useState(initialValue);

// Hook 2: useEffect - Run code on change
useEffect(() => {
  // Do something when 'data' changes
}, [data]);

// Hook 3: useRef - Reference to DOM element
const inputRef = useRef(null);
inputRef.current.focus();

// Hook 4: useCallback - Optimize functions
const handleClick = useCallback(() => {
  // Function definition
}, [dependencies]);
```

## Next Level: Custom Hooks

The app uses custom hooks:

```javascript
// Custom hook
function useAudioPlayer(tracks) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  return { isPlaying, handlePlayPause, currentTime };
}

// Use in component
function App() {
  const { isPlaying, handlePlayPause } = useAudioPlayer(tracks);
  return <button onClick={handlePlayPause}>{isPlaying ? '⏸' : '▶'}</button>;
}
```

Custom hooks let you reuse logic and keep components clean!

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│ Electron Window (Desktop App)                        │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌────────────────────────────────────────────┐    │
│  │ Renderer Process (React in Chromium)       │    │
│  │                                            │    │
│  │  ┌──────────────────────────────────────┐  │    │
│  │  │ App.jsx (Main Component)             │  │    │
│  │  │ - UI Layout                          │  │    │
│  │  │ - useAudioPlayer hook                │  │    │
│  │  │ - useTheme hook                      │  │    │
│  │  │ - useSpotifyPlayer hook              │  │    │
│  │  └──────────────────────────────────────┘  │    │
│  │              ↕ IPC ↕                       │    │
│  └────────────────────────────────────────────┘    │
│                                                      │
│  ┌────────────────────────────────────────────┐    │
│  │ Main Process (Node.js)                     │    │
│  │                                            │    │
│  │  - File Access (read music files)          │    │
│  │  - Window Management                       │    │
│  │  - Spotify OAuth                           │    │
│  │  - Apple Music OAuth                       │    │
│  │  - API Requests (with auth tokens)         │    │
│  └────────────────────────────────────────────┘    │
│              ↓              ↓                       │
│  ┌──────────────┐  ┌──────────────────────┐       │
│  │ Your Disk    │  │ Spotify/Apple APIs   │       │
│  │ (Music Files)│  │ (Stream Music)       │       │
│  └──────────────┘  └──────────────────────┘       │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## Development Tips

1. **Use console.log** to debug
   - Press Ctrl+Shift+I to open DevTools
   
2. **Hot reload** keeps your app running
   - Save file → changes appear instantly
   
3. **Read error messages carefully**
   - They tell you exactly what's wrong
   
4. **Keep components small**
   - Each component should do one thing well
   
5. **Use browser DevTools**
   - Inspect elements, test CSS changes
   - Network tab to see API calls

## Resources

- [React Docs](https://react.dev)
- [Electron Docs](https://www.electronjs.org/docs)
- [Vite Docs](https://vitejs.dev)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api)
- [Apple Music Kit JS](https://developer.apple.com/documentation/musickitjs)

---

**Now go build something cool!** 🎵
