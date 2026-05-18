# Building & Distributing Cupid Music Player

## Part 1: Export to .EXE (Windows Installer)

### What You're Creating
A standalone `.exe` installer file that Windows users can double-click to install the app.

### Prerequisites
You need to be on Windows OR use cross-platform build tools. The easiest way is to build on Windows.

### Step 1: Build the App
```bash
npm run build
```

This creates an optimized `dist/` folder with compiled code.

**What it does:**
- Minifies React code (makes it smaller)
- Optimizes CSS and JavaScript
- Removes development code
- Creates production-ready bundle

**Takes 1-2 minutes**

### Step 2: Package as .EXE
```bash
npm run package
```

This creates the installer using electron-builder.

**What it does:**
- Takes the `dist/` folder
- Wraps it with Electron
- Creates a Windows installer (.exe)
- Puts output in `out/` folder

**Takes 2-5 minutes**

### Step 3: Find Your .EXE Files

After running, check `out/` folder:

```
out/
├── Cupid Player Setup 1.0.0.exe    ← Main installer
├── Cupid Player 1.0.0.exe          ← Portable version
└── builder-effective-config.yaml    ← Config file (ignore)
```

**Two versions created:**
- **Setup .exe** - Installer (recommended for distribution)
- **Portable .exe** - Runs directly without installing

### Step 4: Distribute

1. **Share the Setup .exe** with friends/users
2. They double-click it
3. It installs Cupid Player to their computer
4. They can uninstall it like any Windows app

---

## Part 2: Add More Music

### Option 1: Local Music Files (Easiest!)

#### How It Works
The app scans your computer's music folders and plays them.

#### Step 1: Place Music Files
Put music files in your music directory:
- **Windows**: `C:\Users\YourName\Music\`
- **Mac**: `~/Music/`
- **Linux**: `~/Music/`

#### Supported Formats
- `.mp3` (MP3)
- `.flac` (FLAC)
- `.wav` (WAV)
- `.m4a` (AAC/Apple)
- `.wma` (Windows Media)
- `.opus` (Opus)
- `.aac` (AAC)
- `.ogg` (OGG Vorbis)

#### Step 2: Run the App
```bash
npm run dev
```

#### Step 3: Browse Music
1. Open app
2. Click settings ⚙️
3. Click "Show Tracks"
4. Music files appear automatically!

#### Step 4: Play
- Click a song
- Click play ▶️
- Music plays!

**That's it!** No additional setup needed.

---

### Option 2: Spotify (Stream Millions of Songs)

#### What You Get
- Access to Spotify's 100+ million songs
- Your playlists and saved songs
- Your personal recommendations
- Offline mode (Premium only)

#### Prerequisites
- Spotify account (free or Premium)
- Spotify API credentials

#### Step 1: Create Spotify App

Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)

1. Click **"Create an App"**
2. Accept terms
3. Name it: "Cupid Music Player"
4. Accept conditions and create
5. You'll see your **Client ID** and **Client Secret**

#### Step 2: Add to `.env` File

In project root, create/edit `.env`:

```env
VITE_SPOTIFY_CLIENT_ID=your_client_id_here
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
```

**Where to get these:**
- Go to your Spotify App settings
- Copy "Client ID" → paste after `=`
- Redirect URI should be `http://localhost:5173/callback`

**Example:**
```env
VITE_SPOTIFY_CLIENT_ID=abc123def456ghi789jkl012
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
```

#### Step 3: Restart App
```bash
npm run dev
```

#### Step 4: Login to Spotify

1. Open app
2. Click settings ⚙️
3. Look for **"Connect to Spotify"** button
4. Click it
5. Browser opens → Spotify login
6. Click **"Allow"** to give app permission
7. Browser redirects back to app
8. **Connected!** ✓

#### Step 5: Browse & Play

1. Click settings ⚙️
2. Look for **"Music Source"** or similar
3. Select **"Spotify"**
4. Your playlists appear
5. Click a song
6. Click play ▶️
7. Music streams from Spotify!

---

### Option 3: Apple Music (For Mac Users)

#### What You Get
- Access to 100+ million songs
- Your library and playlists
- Curated playlists
- Offline mode (Subscriber only)

#### Prerequisites
- Mac computer
- Apple Music subscription
- Apple Developer account

#### Setup Steps

**See the `APPLE_MUSIC_SETUP.md` file in project root for detailed instructions.**

#### Quick Summary
1. Create Apple Developer account
2. Create Developer Token from Apple Music API
3. Add to `.env` file:
   ```env
   APPLE_TEAM_ID=your_team_id
   APPLE_KEY_ID=your_key_id
   ```
4. Restart app
5. Login with Apple ID
6. Browse and play!

---

## Comparison: Which Source to Use?

| Feature | Local Files | Spotify | Apple Music |
|---------|-------------|---------|-------------|
| **Setup time** | 5 min | 15 min | 30 min |
| **Song variety** | Only files you own | 100+ million | 100+ million |
| **Cost** | Free | Free (ads) or Premium | Subscription |
| **Offline** | Yes | Premium only | Subscriber only |
| **Playlists** | Manual folders | Auto synced | Auto synced |
| **Best for** | Personal library | Streaming | Apple ecosystem |

**Recommendation:** Start with **Local Files** (easiest), then add **Spotify** for unlimited music!

---

## Complete Workflow: Build & Add Music

### 1. Add Local Music
```bash
# Place files in ~/Music/

# Run app
npm run dev

# Open settings → browse songs → play!
```

### 2. Setup Spotify (Optional)
```bash
# Edit .env file with Spotify credentials

# Run app
npm run dev

# Click "Connect to Spotify" → Login → Play!
```

### 3. Build for Distribution
```bash
# Build optimized version
npm run build

# Create Windows installer
npm run package

# Find .exe in out/ folder → Share with friends!
```

---

## Advanced: Where Does It Look for Local Music?

The app checks these locations for music files:

**On Mac:**
- `~/Music/` (your Music folder)
- `~/Library/Preferences/` (cached playlists)

**On Windows:**
- `C:\Users\YourName\Music\`
- `C:\Users\YourName\AppData\Local\` (cache)

**On Linux:**
- `~/Music/`
- `~/.local/share/` (cache)

### Add Music to These Folders
```bash
# Mac/Linux
mv /path/to/song.mp3 ~/Music/

# Windows
move C:\path\to\song.mp3 C:\Users\YourName\Music\
```

The app auto-discovers songs in these locations!

---

## Troubleshooting

### My .EXE won't create

**Problem:** `npm run package` fails

**Solution:**
```bash
# Clear build artifacts
rm -rf dist out

# Try again
npm run build
npm run package
```

### Music doesn't show up

**Problem:** Placed songs in ~/Music but they don't appear

**Causes & Fixes:**
- Unsupported format → Convert to .mp3 or .flac
- File permissions → Right-click file → Properties → Check "Read" is allowed
- App cache stale → Restart with `npm run dev`
- Wrong folder → Check Music folder location

### Spotify won't connect

**Problem:** "Invalid redirect URI" error

**Causes & Fixes:**
- `.env` not loaded → Restart: `npm run dev`
- Redirect URI mismatch → Check it matches in Spotify Dashboard exactly
- Client ID wrong → Copy-paste again from Spotify Dashboard

### Can't find Spotify Client ID

**Fix:**
1. Go to https://developer.spotify.com/dashboard
2. Login with Spotify account
3. Find your app
4. Click it
5. Look for **"Client ID"** (not "Client Secret")
6. Copy the long string
7. Paste in `.env` file

---

## Building on Different Platforms

### Build on Mac (for Mac .app)
```bash
npm run build
npm run package
```
Creates: `Cupid Player.app`

### Build on Windows (for Windows .exe)
```bash
npm run build
npm run package
```
Creates: `Cupid Player Setup.exe`

### Build on Linux (for AppImage)
```bash
npm run build
npm run package
```
Creates: `Cupid Player.AppImage`

### Cross-Platform Building (Advanced)

Build for multiple platforms using GitHub Actions:
1. Push code to GitHub
2. GitHub automatically builds for Windows/Mac/Linux
3. Downloads ready to distribute

**See project's `.github/workflows/` for automation**

---

## Share Your Build

### Option 1: Direct Download
1. Create folder on website
2. Upload `.exe` from `out/` folder
3. Share link
4. Users download and run

### Option 2: GitHub Releases
1. Push code to GitHub
2. Create Release
3. Upload `.exe` file
4. Users download from GitHub

### Option 3: Store Distribution
- **Windows Store** - Upload to Microsoft Store
- **Mac App Store** - Upload to Apple App Store
- **Snapcraft** - Upload to Linux Snapcraft

---

## Summary

### Add Music (3 Ways)
1. **Local Files** → Put in ~/Music/ → Auto-discovered ✓ (Easiest!)
2. **Spotify** → Add credentials to .env → Login ✓ (Recommended!)
3. **Apple Music** → Setup developer token → Login (Mac only)

### Export to .EXE (2 Commands)
```bash
npm run build      # Optimize code
npm run package    # Create installer
```

Then find `Cupid Player Setup 1.0.0.exe` in `out/` folder and share!

---

## Next Steps

1. **Add local music** → Put songs in ~/Music/
2. **Test locally** → `npm run dev` → play songs
3. **Setup Spotify** → Add `.env` credentials → Connect
4. **Build for Windows** → `npm run build && npm run package`
5. **Share the .exe** → Send to friends!

**Happy distributing! 🎵**
