# Quick Build & Music Guide (TL;DR)

## 🎵 Add Music - Quick Steps

### Method 1: Local Music (Easiest ⭐)

```
1. Locate your Music folder:
   - Mac: ~/Music/
   - Windows: C:\Users\YourName\Music\
   - Linux: ~/Music/

2. Put your .mp3, .flac, or .wav files there

3. Run: npm run dev

4. Open app → Settings ⚙️ → See your songs!
```

**Supported formats:** MP3, FLAC, WAV, M4A, WMA, OPUS, AAC, OGG

### Method 2: Spotify (Unlimited Music ⭐⭐)

```
1. Go: https://developer.spotify.com/dashboard
2. Login → Create App → Copy Client ID
3. Edit .env file:
   VITE_SPOTIFY_CLIENT_ID=paste_your_id_here
4. Restart: npm run dev
5. Click Settings ⚙️ → Connect to Spotify
6. Login → Enjoy 100+ million songs!
```

### Method 3: Apple Music (Mac Only)

```
See: APPLE_MUSIC_SETUP.md
(Requires Apple Developer account)
```

---

## 🔧 Build .EXE (3 Steps)

### Step 1: Build (Optimize Code)
```bash
npm run build
```
Creates folder: `dist/` (optimized app)

### Step 2: Package (Create Installer)
```bash
npm run package
```
Creates folder: `out/` with .exe files

### Step 3: Share
```
Find in out/ folder:
  ✓ Cupid Player Setup 1.0.0.exe ← Share this!
  ✓ Cupid Player 1.0.0.exe (portable)
```

### Complete Command (Do Both At Once)
```bash
npm run build && npm run package
```

---

## 📊 File Locations After Build

**On Mac:**
```
out/
├── Cupid Player-1.0.0.dmg      ← Mac installer
└── Cupid Player-1.0.0.pkg      ← Mac package
```

**On Windows:**
```
out/
├── Cupid Player Setup 1.0.0.exe ← Windows installer
└── Cupid Player 1.0.0.exe       ← Portable exe
```

**On Linux:**
```
out/
└── Cupid Player-1.0.0.AppImage  ← Linux app
```

---

## 🎯 Complete Workflow

```
Step 1: Add Music
└─ Copy songs to ~/Music/ folder

Step 2: Test Locally
└─ npm run dev
└─ Play in app ▶️

Step 3: Build
└─ npm run build && npm run package

Step 4: Share
└─ Send .exe file from out/ to friends

Step 5: They Install
└─ Double-click .exe
└─ Follows installer
└─ App installed! ✓
```

---

## 📱 Music Organization (Optional)

Create folders to organize music:

```
~/Music/
├── Pop/
│   ├── song1.mp3
│   └── song2.mp3
├── Rock/
│   ├── song3.mp3
│   └── song4.mp3
└── Jazz/
    ├── song5.flac
    └── song6.wav
```

App auto-scans all subfolders!

---

## ⚡ Common Issues & Quick Fixes

| Issue | Fix |
|-------|-----|
| `.exe` not created | `npm run build` first, then `npm run package` |
| Music not showing | Restart `npm run dev` or check file permissions |
| Spotify won't connect | Check `.env` file has correct Client ID |
| Building takes forever | Normal first time (5-10 min) |
| Can't find Music folder | See "Music Locations" below |

---

## 🗂️ Music Locations

### Find Your Music Folder

**Mac:**
- Click Finder → Music (in sidebar)
- Or: Open `~/Music/`

**Windows:**
- Open File Explorer
- Click Music in left sidebar
- Or: `C:\Users\YourName\Music\`

**Linux:**
- Open file manager
- Go to home folder
- Look for Music folder
- Or: `~/Music/`

### Add Songs
1. Copy `.mp3` files
2. Paste in Music folder
3. Done! App finds them

---

## 🔑 Spotify Setup (Copy-Paste Version)

### Create Spotify App

1. Go: https://developer.spotify.com/dashboard
2. Click: **Create an App**
3. Name: `Cupid Music Player`
4. Check boxes and create
5. **Copy the Client ID** (long string)

### Update .env File

Create file called `.env` in project root:

```env
VITE_SPOTIFY_CLIENT_ID=PASTE_YOUR_CLIENT_ID_HERE
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
```

Replace `PASTE_YOUR_CLIENT_ID_HERE` with actual ID

### Restart & Connect

```bash
npm run dev
```

Then in app:
- Settings ⚙️
- Find Spotify section
- Click **"Connect to Spotify"**
- Login with Spotify account
- Click **"Allow"**
- Connected! ✓

---

## 📦 Distribution Checklist

- [ ] Local music added (or Spotify connected)
- [ ] Tested with `npm run dev`
- [ ] Built with `npm run build`
- [ ] Packaged with `npm run package`
- [ ] Found .exe in `out/` folder
- [ ] Tested opening .exe
- [ ] Ready to share!

---

## 🚀 Give to Friends

### Option 1: Email/Cloud
1. Find `.exe` in `out/` folder
2. Upload to Google Drive / OneDrive
3. Send link to friend
4. They download and double-click
5. App installs!

### Option 2: USB Stick
1. Copy `.exe` file to USB
2. Give USB to friend
3. They plug in USB
4. Double-click .exe
5. App installs!

### Option 3: Website
1. Upload `.exe` to website
2. Create download link
3. Share link
4. People download and run
5. App installs!

---

## 💾 Backup Your Music

After building, backup your setup:

```bash
# Copy the built app
cp -r out/ ~/Desktop/Cupid-Backup/

# Or zip it
zip -r Cupid-Music-Player.zip out/
```

Now you have a backup if something breaks!

---

## 📋 Cheat Sheet

```bash
# Add music: Copy to ~/Music/ folder

# Test locally: npm run dev

# Build: npm run build

# Package: npm run package

# Find .exe: Look in out/ folder

# Setup Spotify: Edit .env, add Client ID

# Share: Send .exe file to friends
```

---

## 🎵 Final Result

After following this guide:

✅ Your computer has Cupid Music Player running  
✅ Plays music from local files or Spotify  
✅ Built into a .exe file  
✅ Can share with friends  
✅ Friends can install with one click  

**You're done! 🎉**

---

## 📖 Need More Details?

- **Full build guide**: `BUILD_AND_DISTRIBUTE.md`
- **How it all works**: `HOW_IT_WORKS.md`
- **Getting started**: `START_HERE.md`

**Happy building! 🎵**
