# Cupid Music Player - Complete Technical Documentation

## Table of Contents
1. [High-Level Overview](#high-level-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [How Everything Works](#how-everything-works)
5. [Getting Started](#getting-started)
6. [Building & Running](#building--running)

---

## High-Level Overview

Cupid Music Player is a **desktop application** that lets you play music from three sources:
- **Local files** (music you already have)
- **Spotify** (stream your Spotify library)
- **Apple Music** (stream your Apple Music library)

Think of it like how you might build a house:
- **React** = the walls and decorations (what you see on screen)
- **Node.js** = the builder/contractor (runs background tasks)
- **Electron** = the frame that makes it work like a real desktop app (like Chrome or Spotify)

---

## Technology Stack

### What are these technologies?

#### **React** (User Interface)
- **What it is**: A JavaScript library that creates interactive web pages
- **What it does**: Renders the music player UI on your screen and handles user interactions (button clicks, text input, etc.)
- **How it works**: 
  - You write code describing what the UI should look like
  - React automatically updates the screen when data changes
  - When you click a button, React detects it and runs your code
- **In this project**: All files in `src/` are React code

#### **Node.js** (Backend/Server)
- **What it is**: JavaScript that runs on your computer (not in a browser)
- **What it does**: 
  - Handles file operations (reading music files)
  - Communicates with Spotify/Apple Music servers
  - Manages authentication (logging in to Spotify/Apple)
  - Processes metadata (song title, artist, duration)
- **In this project**: 
  - `electron/main.cjs` is Node.js code
  - Runs in the background while React handles the UI

#### **Electron** (Desktop Framework)
- **What it is**: A framework that lets you build desktop apps using web technologies
- **What it does**: Makes your React app work like a native desktop application (with a window, menu, etc.)
- **How it works**:
  - Combines Chromium (the browser from Google Chrome) with Node.js
  - Your React code runs in Chromium (like in a browser)
  - Electron's main process (Node.js) handles OS interactions (file access, window management)
  - They communicate via IPC (Inter-Process Communication)
- **Why use it**: Build once, run on Windows/Mac/Linux without rewriting

#### **Vite** (Build Tool)
- **What it is**: A fast development and build tool
- **What it does**: 
  - Packages your React code into something browsers can run
  - Provides hot reload (code changes appear instantly without restarting)
- **In this project**: `vite.config.js` configures how Vite builds the app

---

## Project Structure

```
cupid-music-player/
├── src/                          # React code (UI & logic)
│   ├── App.jsx                   # Main player component
│   ├── App.css                   # Player styling
│   ├── main.jsx                  # React entry point
│   ├── index.css                 # Global styles
│   ├── useAudioPlayer.js         # Hook: Audio playback logic
│   ├── useTheme.js               # Hook: Theme switching
│   ├── useSpotifyPlayer.js       # Hook: Spotify playback
│   ├── spotify/                  # Spotify integration
│   │   ├── auth.js               # Login/logout
│   │   ├── api.js                # Fetch playlists & tracks
│   │   └── player.js             # Play Spotify tracks
│   └── apple/                    # Apple Music integration
│       ├── auth.js               # Login/logout
│       └── api.js                # Fetch playlists & tracks
│
├── electron/                     # Electron/Node.js code (Backend)
│   ├── main.cjs                  # Main process (window management, IPC)
│   └── preload.cjs               # Bridge between React & Electron
│
├── assets/                       # Images, icons, etc.
├── audio/                        # Sample audio files
├── font/                         # Custom fonts
├── package.json                  # Project metadata & dependencies
├── vite.config.js                # Vite build configuration
├── index.html                    # HTML entry point
└── .env.example                  # Environment variables template
```

---

## How Everything Works

### 1. **Application Startup (npm run dev)**

```
npm run dev
  │
  ├─ Vite starts (dev server on port 5173)
  │  └─ Compiles React code in real-time
  │
  └─ Electron starts
     └─ Loads your React app from http://localhost:5173
```

**In detail:**
1. `npm run dev` runs concurrently (two processes at once):
   - **Vite**: Bundles React code and serves it on `http://localhost:5173`
   - **Electron**: Opens a window and loads that URL
2. Your React code runs inside Electron's renderer process (like a browser tab)
3. The window shows the music player UI

### 2. **User Clicks Play Button**

```
User clicks ▶ button
  │
  ├─ React detects click (event listener)
  │
  ├─ Calls handlePlayPause() function
  │
  ├─ Updates state: isPlaying = true
  │
  ├─ React re-renders the UI (button becomes ⏸)
  │
  └─ Audio element plays via audioRef
```

**What's happening:**
- React components have `state` (data that can change)
- When state changes, React automatically updates what's shown on screen
- The `audioRef` is a reference to the HTML `<audio>` element that actually plays music

### 3. **Playing Local Music**

```
User plays a local file
  │
  ├─ React asks Electron for the file path
  │
  ├─ Electron reads the file from disk
  │
  ├─ Creates a "cupid-local://" URL for it
  │
  ├─ React's <audio> element plays that URL
  │
  └─ Audio streams to your speakers
```

**How it works:**
- Local files need special handling because browsers can't directly access your hard drive
- Electron's main process can access files
- The custom `cupid-local://` protocol bridges React and Electron
- IPC (Inter-Process Communication) sends messages between them

### 4. **Playing Spotify Music**

```
User logs into Spotify
  │
  ├─ App redirects to Spotify's login page
  │
  ├─ You log in and click "Allow"
  │
  ├─ Spotify gives app an access token (permission key)
  │
  ├─ App stores token in memory (securely)
  │
  └─ Can now fetch your playlists & play music
```

**The flow:**
1. **Authentication**: 
   - App requests permission from Spotify
   - You grant it
   - Spotify gives app a token (like a VIP pass)
2. **Fetching Data**:
   - App uses token to ask Spotify: "Give me my playlists"
   - Spotify API returns list of playlists
3. **Playing Music**:
   - App shows playlists in the player
   - Click a song → Spotify Web Playback SDK plays it
   - Works just like Spotify's web player

### 5. **Playing Apple Music**

Similar to Spotify, but with a key difference:
- Requires a **developer token** generated from your Apple Developer account
- Uses the MusicKit JavaScript framework
- You authenticate with your Apple ID
- Then plays from your Apple Music library

### 6. **Theme Switching (Pink ↔ Blue)**

```
User clicks 🎨 theme button
  │
  ├─ React calls toggleTheme()
  │
  ├─ useTheme hook updates currentTheme
  │
  ├─ Saves preference to localStorage (your computer's storage)
  │
  ├─ CSS variables swap colors
  │  ├─ Pink: #ffb3d9, #78364F, etc.
  │  └─ Blue: #a3d5ff, #063940, etc.
  │
  └─ UI instantly re-renders with new colors
```

**What's localStorage:**
- Data stored in your browser that persists between sessions
- Key-value pairs (like a tiny database)
- Next time you open the app, your theme preference loads automatically

---

## Key Concepts Explained

### **Hooks** (React Feature)
Hooks are functions that let components use state and other React features.

```javascript
const { isPlaying, handlePlayPause } = useAudioPlayer(tracks);
```

**What it does:**
- `useAudioPlayer` is a custom hook that manages audio playback
- Returns `isPlaying` (true/false) and `handlePlayPause` (function)
- Encapsulates complex audio logic, keeping App.jsx clean

**Common hooks:**
- `useState()` - Store data that can change
- `useEffect()` - Run code when component loads or when data changes
- `useRef()` - Reference to DOM elements (like `<audio>`)
- `useCallback()` - Optimize function definitions

### **Component Lifecycle**
Components go through stages:

```
1. Mount (component created)
   └─ Run useEffect hooks
   
2. Update (data changes)
   └─ Re-render UI
   
3. Unmount (component destroyed)
   └─ Cleanup
```

### **Props vs State**
- **Props**: Data passed down from parent (read-only)
- **State**: Data that can change, stored in component

### **IPC (Inter-Process Communication)**
Electron has two processes:
- **Main process** (Node.js) - Can access OS, files, etc.
- **Renderer process** (React/Browser) - Can only interact with UI

They communicate via:
```javascript
// Renderer (React) sends message
ipcRenderer.invoke('get-local-playlist');

// Main (Node.js) listens and responds
ipcMain.handle('get-local-playlist', async () => {
  return await readMusicFiles();
});
```

### **CSS Variables**
Dynamic styling without rewriting CSS:

```css
/* Define once */
:root {
  --vinyl-center: #ffb3d9;  /* Pink */
}

/* Use everywhere */
.vinyl::before {
  background: var(--vinyl-center);
}

/* Change for blue theme */
[data-theme="blue"] {
  --vinyl-center: #a3d5ff;  /* Blue */
}
```

All elements automatically update!

---

## Getting Started

### **Prerequisites**
1. **Node.js** installed (includes npm)
2. **Git** for cloning
3. A text editor (VS Code recommended)

### **Installation**

```bash
# 1. Clone the repository
git clone https://github.com/cupidbity/cupid-music-player.git
cd cupid-music-player

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env

# 4. Start development server
npm run dev
```

### **Environment Variables (.env)**
Some features need API keys:

```env
# Spotify (optional)
VITE_SPOTIFY_CLIENT_ID=your_id_here
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback

# Apple Music (optional)
APPLE_TEAM_ID=your_team_id
APPLE_KEY_ID=your_key_id
```

Get these from:
- **Spotify**: [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
- **Apple Music**: [Apple Developer Account](https://developer.apple.com)

---

## Building & Running

### **Development (npm run dev)**
- Starts Vite dev server (hot reload)
- Starts Electron with React UI
- Perfect for development/testing

### **Production Build (npm run build)**
```bash
npm run build
```

**What it does:**
1. Vite compiles React code → optimized `dist/` folder
2. `electron-builder` creates standalone app
3. Output: Installer or app in `out/` folder

### **Running the Built App**
On Mac:
```bash
./out/Cupid\ Player.app/Contents/MacOS/Cupid\ Player
```

On Windows:
```bash
.\out\Cupid Player.exe
```

---

## Common Tasks

### **Add a New Feature**

1. **Create React component** in `src/`
2. **Import in App.jsx**
3. **Use hooks** for state management
4. **Style with CSS**
5. **Test with npm run dev**

### **Debug the App**

```javascript
// In React code:
console.log('Debug info:', variable);

// Press Ctrl+Shift+I (or Cmd+Option+I on Mac)
// DevTools opens → Console tab shows logs
```

### **Modify the UI**

Edit `src/App.jsx` and `src/App.css`:
- **App.jsx**: Structure and interactivity
- **App.css**: Colors, layout, animations

Changes appear instantly (hot reload)!

---

## Troubleshooting

### **"npm run dev" fails**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### **App is blank**
- Press Ctrl+Shift+I to open DevTools
- Check Console for errors
- Ensure port 5173 isn't blocked

### **Spotify login not working**
- Check `.env` file has correct credentials
- Ensure redirect URI matches in Spotify Developer Dashboard

### **Apple Music requires developer token**
- See `APPLE_MUSIC_SETUP.md` and `SPOTIFY_SETUP.md` in project root

---

## File Purposes Reference

| File | Purpose |
|------|---------|
| `src/App.jsx` | Main UI component, orchestrates all features |
| `src/useAudioPlayer.js` | Hook that manages audio playback (local files) |
| `src/useSpotifyPlayer.js` | Hook for Spotify playback |
| `src/useTheme.js` | Theme switching and color management |
| `electron/main.cjs` | Electron main process, file access, IPC handlers |
| `electron/preload.cjs` | Security bridge between React and Electron |
| `src/spotify/` | Spotify OAuth, API calls, playback |
| `src/apple/` | Apple Music OAuth, API calls |
| `vite.config.js` | Build configuration |
| `package.json` | Dependencies and scripts |

---

## How Data Flows

### **Example: Playing a Spotify Track**

```
1. User sees playlists → React displays them

2. User clicks a playlist → handlePlaylistSelect()

3. App makes API call to Spotify
   spotify/api.js → fetch tracks

4. Spotify returns track list → React updates state

5. User clicks a track → handlePlay()

6. If using Spotify Web Playback SDK:
   → Spotify SDK plays directly

7. Progress bar updates every second via:
   → Audio element's timeupdate event
   → React re-renders progress

8. User clicks ⏸ → handlePlayPause()
   → Calls pause() on player
   → Updates UI
```

### **Example: Playing a Local File**

```
1. Electron's main process watches ~/Music

2. Finds MP3/FLAC files → reads metadata (title, artist)

3. Returns to React via IPC

4. React displays file list

5. User clicks song → handlePlayLocal()

6. IPC calls: "Please play this file"

7. Electron reads file → streams to custom protocol

8. React's <audio> plays cupid-local://path/to/file

9. Audio element handles playback
   → React syncs progress bar
```

---

## Summary

The Cupid Music Player works by:

1. **React** creates the visual interface and handles user interactions
2. **Node.js** (Electron main) manages files, authentication, and APIs
3. **Vite** packages everything for Electron to run
4. **IPC** bridges the gap between UI (React) and backend (Node)
5. **Electron** wraps it all up as a desktop app

Think of it like:
- **React** = The dashboard
- **Node** = The engine
- **Electron** = The chassis
- **Vite** = The assembly line

When you run `npm run dev`, all these pieces start up together and create a fully functional music player!

---

## Next Steps

1. **Explore the code**: Open `src/App.jsx` and read through it
2. **Make small changes**: Edit `src/App.css` colors and see them update instantly
3. **Add features**: Use the hooks pattern to create new functionality
4. **Build it**: Run `npm run build` to create a distributable app

Happy coding! 🎵
