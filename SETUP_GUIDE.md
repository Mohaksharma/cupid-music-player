# Cupid Music Player - Setup & Getting Started Guide

## ✅ What You Have Now

You have the **official Cupid Music Player repository** cloned to your machine. This is a fully functional desktop music player written in React, Node.js, and Electron.

**Location:** `/Users/Mohak/Desktop/projects/electron/Project1/`

---

## 🚀 Quick Start (3 steps)

### Step 1: Install Dependencies
```bash
npm install
```
This downloads all required packages (React, Electron, etc.). This happens automatically via `package.json`.

**⏱️ Takes 2-5 minutes the first time**

### Step 2: Start Development Server
```bash
npm run dev
```

This does two things simultaneously:
1. **Vite starts** on `http://localhost:5173` (hot reload dev server)
2. **Electron launches** a window and loads your React app

The app opens automatically. You'll see the Cupid Music Player!

### Step 3: Start Playing Music
- **Local files**: Check the settings → file browser should show music files
- **Spotify**: Click settings → "Connect to Spotify" (requires API credentials in `.env`)
- **Apple Music**: Click settings → "Connect to Apple Music" (requires developer setup)

---

## 📚 Understanding the Documentation

This project includes **3 documentation files**:

### 1. **HOW_IT_WORKS.md** (Read First!)
- High-level explanation of React, Node.js, Electron
- How the app launches and works
- How each feature functions
- Troubleshooting common issues
- **Best for:** Understanding the big picture

### 2. **QUICK_REFERENCE.md** (Bookmark This!)
- Quick command reference
- File structure overview
- Code pattern examples
- Architecture diagrams
- Development tips
- **Best for:** Quick lookups while coding

### 3. **README.md** (Official Docs)
- Official project documentation
- Feature list
- Installation instructions
- Building/packaging guide
- **Best for:** Official information

---

## 🎵 Using the Player

### Local Files
1. Place music files in a folder
2. Open app settings (⚙️ icon)
3. Music should auto-discover from ~/Music or system library

### Spotify
1. Get credentials from [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create `.env` file with:
   ```env
   VITE_SPOTIFY_CLIENT_ID=your_client_id_here
   VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
   ```
3. Restart app: `npm run dev`
4. Click "Connect to Spotify" in settings

### Apple Music
1. See `APPLE_MUSIC_SETUP.md` in project root
2. Get developer token from Apple Developer
3. Add to `.env`:
   ```env
   APPLE_TEAM_ID=your_team_id
   APPLE_KEY_ID=your_key_id
   ```
4. Restart and connect

---

## 🔧 Available Commands

```bash
# Start development (hot reload enabled)
npm run dev

# Build for distribution
npm run build

# Preview the production build
npm run preview

# Start just Vite (no Electron)
npm run vite

# Start just Electron
npm run electron

# Package as installer
npm run package
```

---

## 📁 Key Files Explained

### `src/App.jsx` (The Main Component)
- Everything you see on screen
- All the buttons, controls, player logic
- ~600 lines, well-commented
- **Edit this** to change UI or features

### `src/App.css` (Styling)
- Colors, layouts, animations
- Pink and Blue theme definitions
- Responsive design
- **Edit this** to change how it looks

### `electron/main.cjs` (The Backend)
- Runs on your computer (Node.js, not in browser)
- Handles file access (reading music files)
- Manages window (minimize, maximize, close)
- Handles OAuth (Spotify/Apple login)
- **Advanced editing** - handles Electron infrastructure

### `package.json` (Project Metadata)
- Lists all dependencies (React, Electron, etc.)
- Scripts (npm run dev, npm run build)
- Build configuration
- **Don't edit** unless adding new dependencies

### `src/useAudioPlayer.js` (Audio Logic)
- Plays audio from any source
- Tracks current time, duration
- Implements play/pause/skip
- **Custom hook** - reusable audio code

### `src/useTheme.js` (Theme Management)
- Switches between pink and blue themes
- Saves preference to localStorage
- **Custom hook** - reusable theme logic

---

## 🎯 First Time Checklist

- [ ] Clone completed (`git clone ...`)
- [ ] Node.js installed (`node --version` returns v16+)
- [ ] Ran `npm install` (no errors)
- [ ] Started app: `npm run dev`
- [ ] App window opened
- [ ] Read `HOW_IT_WORKS.md`
- [ ] Tried clicking buttons (play, theme, settings)
- [ ] Saved `QUICK_REFERENCE.md` as bookmark

---

## 🐛 Troubleshooting

### App won't start
```bash
# Clear everything and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Blank white window
1. Press **Ctrl+Shift+I** (Windows/Linux) or **Cmd+Option+I** (Mac)
2. Click **Console** tab
3. Look for red error messages
4. Search error message on Google
5. Check `.env` file has correct settings

### Music not playing
- Ensure audio files exist
- Check file permissions
- Try opening DevTools (Ctrl+Shift+I) and check for errors

### Spotify login fails
- Verify `.env` has `VITE_SPOTIFY_CLIENT_ID`
- Check redirect URI matches in Spotify Developer Dashboard
- Credentials are case-sensitive

### Hot reload not working
- Restart: `npm run dev`
- Make sure you're editing files in `src/`

---

## 📖 Learning Path

### Day 1: Understand the Basics
1. Read `HOW_IT_WORKS.md` (30 min)
2. Read `QUICK_REFERENCE.md` (20 min)
3. Run `npm run dev` and explore the UI (15 min)

### Day 2: Explore the Code
1. Open `src/App.jsx` in VS Code
2. Read through the component structure
3. Look for comments explaining each section
4. Find the state variables at the top
5. Locate the render section

### Day 3: Make a Small Change
1. Open `src/App.css`
2. Find the color definitions
3. Change a hex color (e.g., `#ffb3d9` to something else)
4. Save and watch the live update
5. Try changing button text or adding a new button

### Day 4+: Build Features
1. Add new buttons or controls
2. Implement new hooks
3. Integrate with APIs
4. Create custom components

---

## 💡 Important Concepts

### What is React?
A JavaScript library that makes interactive UIs. When data changes, the UI automatically updates.

### What is Electron?
Packages a web app (React) as a desktop application. It runs in Chromium (like Chrome) with Node.js backend.

### What is Vite?
A build tool that:
- Bundles your React code
- Provides hot reload (instant updates)
- Optimizes for production

### What is Node.js?
JavaScript that runs on your computer, not in a browser. Handles file access, servers, APIs.

---

## 🔑 Key Takeaways

1. **The UI** (`src/App.jsx`) is React - interactive web interface
2. **The Backend** (`electron/main.cjs`) is Node.js - file access, OS interaction
3. **The Wrapper** (Electron) - makes it work as a desktop app
4. **The Builder** (Vite) - packages everything

When you run `npm run dev`:
- Vite bundles React code
- Electron launches it
- You get a desktop app with hot reload

When you run `npm run build`:
- Vite optimizes everything
- Electron-builder packages it
- You get an installer or standalone app

---

## 🚢 Building & Distributing

### Create a Distributable App
```bash
npm run build
npm run package
```

This creates:
- **Mac**: `.app` file or `.dmg` installer
- **Windows**: `.exe` installer
- **Linux**: `.AppImage` file

Located in `out/` folder.

### Manual Distribution
```bash
npm run build      # Creates dist/ folder with compiled code
```

Then use electron-builder:
```bash
npx electron-builder
```

---

## 📞 Getting Help

### If Something Breaks
1. Check the **Console** (Ctrl+Shift+I)
2. Read the error message carefully
3. Check `README.md` and `APPLE_MUSIC_SETUP.md` / `SPOTIFY_SETUP.md`
4. Search GitHub issues: https://github.com/cupidbity/cupid-music-player
5. Ask on Stack Overflow with tag `[react] [electron]`

### Useful Resources
- **React Docs**: https://react.dev
- **Electron Docs**: https://www.electronjs.org/docs
- **Vite Docs**: https://vitejs.dev
- **Spotify API**: https://developer.spotify.com/documentation
- **Apple MusicKit**: https://developer.apple.com/documentation/musickitjs

---

## ✨ Next Steps

**Option A: Just Use It**
- Run `npm run dev`
- Play music
- Explore features

**Option B: Understand the Code**
- Read documentation files
- Open `src/App.jsx`
- Trace through how things work

**Option C: Make Changes**
- Edit `src/App.css` (try changing colors)
- Edit button text in `src/App.jsx`
- Add a new feature
- See changes instantly (hot reload)

**Option D: Build for Distribution**
- Run `npm run build`
- Run `npm run package`
- Share the installer with friends

---

## ✅ You're All Set!

Everything is installed and ready. Run `npm run dev` and start playing music!

Questions? Check:
1. `HOW_IT_WORKS.md` - Big picture explanation
2. `QUICK_REFERENCE.md` - Quick lookups
3. `README.md` - Official documentation
4. GitHub issues - Solutions to common problems

**Happy coding! 🎵**
