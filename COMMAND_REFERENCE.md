# Command & File Reference - Copy-Paste Ready

## 🎵 Add Local Music

### Step 1: Find Your Music Folder

**Windows (Copy This Path):**
```
C:\Users\YourName\Music\
```
Replace `YourName` with your actual Windows username

**Mac (Copy This):**
```
~/Music/
```
Or open Finder → Click Music in sidebar

**Linux (Copy This):**
```
~/Music/
```
Or open file manager → Home → Music

### Step 2: Copy-Paste Commands

**Mac/Linux:**
```bash
# Copy one song
cp ~/Downloads/song.mp3 ~/Music/

# Copy entire folder of songs
cp -r ~/Downloads/MyMusicFolder ~/Music/

# See all songs in Music folder
ls ~/Music/
```

**Windows (PowerShell - Run as Admin):**
```powershell
# Copy one song
copy "C:\Users\YourName\Downloads\song.mp3" "C:\Users\YourName\Music\"

# Copy entire folder
xcopy "C:\Users\YourName\Downloads\MyMusicFolder" "C:\Users\YourName\Music\" /E

# See all songs
dir "C:\Users\YourName\Music\"
```

### Step 3: Start App
```bash
npm run dev
```

---

## 🎶 Add Spotify (3 Files to Edit)

### File 1: Create `.env` in Project Root

**Location:**
```
/Users/Mohak/Desktop/projects/electron/Project1/.env
```

**Contents to Copy:**
```env
VITE_SPOTIFY_CLIENT_ID=YOUR_CLIENT_ID_HERE
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
```

**Where to get Client ID:**
1. Go: https://developer.spotify.com/dashboard
2. Login/Create account
3. Create App
4. Copy the "Client ID" string
5. Replace `YOUR_CLIENT_ID_HERE` with it

**Example (with fake ID):**
```env
VITE_SPOTIFY_CLIENT_ID=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
```

### File 2: No Other Changes Needed
The app reads from `.env` automatically. No other edits required!

### File 3: Restart App
```bash
npm run dev
```

Then click "Connect to Spotify" in settings.

---

## 🔧 Build .EXE - Copy-Paste Commands

### Command 1: Build (Optimize)
```bash
npm run build
```

**Expected Output:**
```
✓ built in 2.5s
```

**What it creates:**
```
Project/dist/  (optimized app files)
```

### Command 2: Package (.EXE)
```bash
npm run package
```

**Expected Output:**
```
✓ built successfully
✓ artifacts:
  - out/Cupid Player Setup 1.0.0.exe
  - out/Cupid Player 1.0.0.exe
```

**What it creates:**
```
Project/out/Cupid Player Setup 1.0.0.exe  ← Share this!
```

### Do Both at Once
```bash
npm run build && npm run package
```

---

## 📁 Important File Locations

### Project Structure Reference

**Windows:**
```
C:\Users\YourName\Desktop\projects\electron\Project1\
├─ src\
│  ├─ App.jsx              (main UI)
│  ├─ App.css              (styling)
│  └─ ... other files ...
├─ electron\
│  └─ main.cjs             (backend)
├─ .env                    ← Create this for Spotify
├─ package.json
└─ vite.config.js
```

**Mac/Linux:**
```
~/Desktop/projects/electron/Project1/
├─ src/
│  ├─ App.jsx              (main UI)
│  ├─ App.css              (styling)
│  └─ ... other files ...
├─ electron/
│  └─ main.cjs             (backend)
├─ .env                    ← Create this for Spotify
├─ package.json
└─ vite.config.js
```

### Music Folder Locations

**Windows:**
```
C:\Users\YourName\Music\
```

**Mac:**
```
~/Music/
or
/Users/YourName/Music/
```

**Linux:**
```
~/Music/
or
/home/username/Music/
```

### Build Output Locations

**After `npm run build`:**
```
Project/dist/           (optimized files)
```

**After `npm run package`:**
```
Project/out/Cupid Player Setup 1.0.0.exe    ← Main installer
Project/out/Cupid Player 1.0.0.exe          (portable)
```

---

## 🚀 All Commands Reference

### Development
```bash
# Start with hot reload
npm run dev

# Just Vite (no Electron)
npm run vite

# Just Electron
npm run electron
```

### Building & Distribution
```bash
# Build optimized version
npm run build

# Create installer (.exe, .dmg, .AppImage)
npm run package

# Do both at once
npm run build && npm run package

# Preview build (test before sharing)
npm run preview
```

### Troubleshooting
```bash
# Clear and reinstall everything
rm -rf node_modules package-lock.json dist out
npm install
npm run dev

# Clear build cache
rm -rf dist out
npm run build
npm run package
```

---

## 📝 File Creation Checklist

### Create `.env` File

**Filename:** `.env` (exactly)
**Location:** Same folder as `package.json`
**Contents:**
```env
VITE_SPOTIFY_CLIENT_ID=paste_client_id
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
```

**How to create:**

**Windows:**
1. Open Notepad
2. Paste the contents above
3. File → Save As
4. Filename: `.env` (with the dot!)
5. Save Location: `Project1` folder
6. Make sure it says `.env` not `.env.txt`

**Mac/Linux:**
```bash
# Terminal command
echo 'VITE_SPOTIFY_CLIENT_ID=paste_id_here' > ~/.env
echo 'VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback' >> ~/.env
```

Or use VS Code:
1. Open VS Code
2. File → New File
3. Copy-paste the contents
4. File → Save As
5. Filename: `.env`
6. Location: Project1 folder

---

## 🎯 Quick Decision Tree

### "I want to add music"

```
Do you want free/offline access?
├─ YES → Use Local Music
│  └─ Copy songs to ~/Music/
│     └─ Done!
│
└─ NO → Use Spotify
   └─ Create .env file
      └─ Add Spotify Client ID
         └─ Restart app
            └─ Done!
```

### "I want to make an installer"

```
Do you have music added?
├─ NO → Add music first!
│
└─ YES → Run build commands
   ├─ npm run build
   ├─ npm run package
   └─ Find .exe in out/
      └─ Done!
```

### "I want to share with friends"

```
Have you built the .exe?
├─ NO → Run build commands first
│
└─ YES → Share the .exe
   ├─ Option 1: Email it
   ├─ Option 2: Cloud storage
   └─ Option 3: USB stick
      └─ Done!
```

---

## 📊 Typical Workflow Commands

### Session 1: Get Running

```bash
# Navigate to project
cd /Users/Mohak/Desktop/projects/electron/Project1

# Install (first time only)
npm install

# Start
npm run dev
```

### Session 2: Add Spotify

```bash
# Edit .env file (add Spotify Client ID)
nano .env

# Restart
npm run dev
```

### Session 3: Build .EXE

```bash
# Build
npm run build

# Package
npm run package

# Find .exe in out/ folder
ls out/
```

---

## 🔗 External Links (Copy-Paste URLs)

### Spotify Setup
```
https://developer.spotify.com/dashboard
```

### Apple Music Setup
```
https://developer.apple.com/musickit
```

### GitHub Project
```
https://github.com/cupidbity/cupid-music-player
```

### React Documentation
```
https://react.dev
```

### Electron Documentation
```
https://www.electronjs.org/docs
```

### Vite Documentation
```
https://vitejs.dev
```

---

## 💾 Backup Your Work

### After Building, Backup the .EXE

**Mac/Linux:**
```bash
# Copy to Desktop
cp out/Cupid\ Player\ Setup\ 1.0.0.exe ~/Desktop/

# Or zip it
zip -r Cupid-Music-Player-Release.zip out/
```

**Windows:**
```powershell
# Copy to Desktop
copy "out\Cupid Player Setup 1.0.0.exe" "$env:USERPROFILE\Desktop\"

# Or zip it
Compress-Archive -Path "out\*" -DestinationPath "Cupid-Music-Player-Release.zip"
```

---

## 🎵 File Extensions Reference

### Supported Audio Formats

✓ `.mp3` (MPEG-3)
✓ `.flac` (FLAC)
✓ `.wav` (WAV)
✓ `.m4a` (MPEG-4 Audio)
✓ `.wma` (Windows Media)
✓ `.opus` (Opus)
✓ `.aac` (Advanced Audio)
✓ `.ogg` (OGG Vorbis)

### NOT Supported

✗ `.aiff` (AIFF)
✗ `.alac` (Apple Lossless)
✗ `.wv` (WavPack)

---

## 🚀 Verification Commands

### Check Music Folder Exists

**Mac/Linux:**
```bash
ls -la ~/Music/
```

**Windows:**
```powershell
dir "C:\Users\YourName\Music\"
```

### Check .env File Exists

**Mac/Linux:**
```bash
cat ~/.env
```

**Windows:**
```powershell
type .env
```

### Check Build Worked

```bash
# After npm run build
ls dist/

# After npm run package
ls out/
```

---

## 🎯 Success Validation

### Local Music Works When:
```bash
npm run dev
# App opens
# Settings → Tracks
# You see your song titles ✓
```

### Spotify Works When:
```bash
npm run dev
# Settings → Connect to Spotify
# You login ✓
# Playlists appear ✓
```

### Build Works When:
```bash
npm run build && npm run package
# Terminal shows: ✓ built successfully
# File exists: out/Cupid Player Setup 1.0.0.exe ✓
# File size: > 100 MB ✓
```

---

## 📞 Quick Troubleshooting by Error

### "Cannot find module 'react'"
```bash
npm install
```

### "Port 5173 already in use"
```bash
# Kill process on port 5173
Mac/Linux:  lsof -ti:5173 | xargs kill -9
Windows:    netstat -ano | findstr :5173
            taskkill /PID <PID> /F
```

### ".env file not found"
```bash
# Create it
nano .env
# Add Spotify credentials
# Save and restart
npm run dev
```

### "dist folder not found"
```bash
# Build first
npm run build
# Then package
npm run package
```

### "out folder empty"
```bash
# Clear everything
rm -rf dist out node_modules
npm install
npm run build && npm run package
```

---

## 💡 Pro Tips

### Keep Music Organized
```
~/Music/
├─ Pop/
│  └─ song1.mp3
├─ Rock/
│  └─ song2.mp3
└─ Jazz/
   └─ song3.flac
```
App auto-scans all subfolders!

### Multiple .env Files (Advanced)
```bash
# For development
cp .env .env.development

# For production
cp .env .env.production

# Switch between them
ln -sf .env.development .env
ln -sf .env.production .env
```

### Keep .EXE Updates
```bash
# Save versions
cp out/Cupid\ Player\ Setup\ 1.0.0.exe ~/Desktop/Cupid-v1.0.0.exe
```

---

## 📋 One-Page Summary

| Task | Command/Action |
|------|-----------------|
| Add local music | Copy songs to ~/Music/ |
| Test locally | `npm run dev` |
| Add Spotify | Create `.env` with Client ID |
| Build | `npm run build && npm run package` |
| Find .EXE | Look in `out/` folder |
| Share | Send `Cupid Player Setup 1.0.0.exe` |
| Debug | Press Ctrl+Shift+I → Console |
| Clear cache | `npm install` |
| Restart | `npm run dev` |

---

**Everything you need on one page! Print or bookmark this. 🎵**
