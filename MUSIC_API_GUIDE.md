# Music API Integration & Search Features Guide

## Part 1: Free Music APIs (No Cost!)

### ✅ Best Free Options

| API | Songs | Search | Stream | Cost | Setup |
|-----|-------|--------|--------|------|-------|
| **YouTube Music** | Unlimited | ✅ Yes | ✅ Yes | Free | Medium |
| **Last.fm** | Metadata | ✅ Yes | ❌ No | Free | Easy |
| **Spotify Free** | Limited | ✅ Yes | ✅ Yes | Free | Medium |
| **JioSaavn** | Unlimited | ✅ Yes | ✅ Yes | Free | Hard |
| **Deezer** | Limited | ✅ Yes | ✅ Yes | Freemium | Medium |

---

## Option 1: YouTube Music (Recommended for .EXE)

### Why YouTube Music?
- ✅ Unlimited free songs (YouTube has everything)
- ✅ Streaming built-in
- ✅ Search functionality
- ✅ Works in .EXE without API key
- ✅ Already integrated in this app!

### How It Works in This App

The Cupid Player **already has YouTube support**! Check:

```bash
# Look at the code
cat src/App.jsx | grep -i youtube

# Or check the youtube integration
ls -la src/ | grep -i youtube
```

### Using YouTube Music

#### Step 1: Enable in App

The app might already have YouTube enabled. Check Settings:
1. Open app: `npm run dev`
2. Click ⚙️ Settings
3. Look for "Music Source" section
4. If YouTube is available, click it

#### Step 2: Search for Songs

```
1. Settings → Music Source → YouTube
2. Click Search box
3. Type song name: "Lovers Rock"
4. Results appear
5. Click song to play
```

#### Step 3: Build to .EXE

```bash
npm run build && npm run package
```

YouTube music works in the .EXE! No API key needed.

---

## Option 2: Spotify Free API

### Setup (15 minutes)

#### Step 1: Create Spotify App
```
1. Go: https://developer.spotify.com/dashboard
2. Login/Create account (free)
3. Create an App
4. Copy Client ID
```

#### Step 2: Add to .env

```env
VITE_SPOTIFY_CLIENT_ID=your_client_id_here
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
```

#### Step 3: Add Search Feature

The app **already has Spotify search**!

When connected to Spotify:
1. Click Settings ⚙️
2. Select "Spotify" as source
3. You get:
   - ✅ Your playlists
   - ✅ Browse songs
   - ✅ Search functionality

#### Step 4: Build to .EXE

```bash
npm run build && npm run package
```

**Important:** The .EXE needs the Spotify credentials in `.env` to work.

---

## Option 3: Add JioSaavn API (Free Music - India Based)

### Why JioSaavn?
- Free streaming API
- 50M+ songs
- Search support
- No credit card needed

### Setup (30 minutes)

#### Step 1: Install JioSaavn Library

```bash
npm install jiosaavn-api
```

#### Step 2: Create Search Hook

Create file: `src/useJioSaavanPlayer.js`

```javascript
import { useState, useCallback } from 'react';
import JioSaavan from 'jiosaavn-api';

export function useJioSaavanPlayer() {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [loading, setLoading] = useState(false);

  const searchSongs = useCallback(async (query) => {
    setLoading(true);
    try {
      const results = await JioSaavan.search(query);
      setSongs(results);
      setLoading(false);
      return results;
    } catch (error) {
      console.error('Search failed:', error);
      setLoading(false);
      return [];
    }
  }, []);

  const playSong = useCallback((song) => {
    setCurrentSong(song);
  }, []);

  return {
    songs,
    currentSong,
    searchSongs,
    playSong,
    loading,
  };
}
```

#### Step 3: Add Search UI to App.jsx

Add this to your App.jsx (in Settings section):

```jsx
import { useJioSaavanPlayer } from './useJioSaavanPlayer';

// Inside App component:
const jioSaavan = useJioSaavanPlayer();
const [searchQuery, setSearchQuery] = useState('');

const handleSearch = async () => {
  await jioSaavan.searchSongs(searchQuery);
};

// In JSX (add to settings):
<div className="settings-section">
  <h3>Search JioSaavan</h3>
  <input
    type="text"
    placeholder="Search songs..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    style={{ width: '100%', padding: '8px' }}
  />
  <button onClick={handleSearch} style={{ marginTop: '8px', width: '100%' }}>
    Search
  </button>
  
  {jioSaavan.songs.length > 0 && (
    <div style={{ maxHeight: '150px', overflowY: 'auto', marginTop: '10px' }}>
      {jioSaavan.songs.map((song, idx) => (
        <div
          key={idx}
          onClick={() => jioSaavan.playSong(song)}
          style={{
            padding: '8px',
            background: '#f0f0f0',
            marginBottom: '4px',
            cursor: 'pointer',
          }}
        >
          {song.title} - {song.artists}
        </div>
      ))}
    </div>
  )}
</div>
```

#### Step 4: Build to .EXE

```bash
npm run build && npm run package
```

JioSaavan works in the .EXE with no API keys!

---

## Part 2: Add Search & List Features

### Feature 1: Music Search

#### Implementation A: Simple Search (Easiest)

```jsx
// Add to App.jsx state
const [searchQuery, setSearchQuery] = useState('');
const [searchResults, setSearchResults] = useState([]);

// Add search handler
const handleSearch = (query) => {
  // Filter local tracks
  const results = tracks.filter(track => 
    track.title.toLowerCase().includes(query.toLowerCase()) ||
    track.artist.toLowerCase().includes(query.toLowerCase())
  );
  setSearchResults(results);
};

// Add to UI
<div className="settings-section">
  <h3>Search Music</h3>
  <input
    type="text"
    placeholder="Search by title or artist..."
    onChange={(e) => {
      setSearchQuery(e.target.value);
      handleSearch(e.target.value);
    }}
    style={{ width: '100%', padding: '8px' }}
  />
  
  {searchResults.length > 0 ? (
    <ul>
      {searchResults.map((song, idx) => (
        <li key={idx} onClick={() => handleSelectTrack(idx)}>
          {song.title} - {song.artist}
        </li>
      ))}
    </ul>
  ) : searchQuery && (
    <p>No songs found</p>
  )}
</div>
```

#### Implementation B: API Search

If using **Spotify**, **YouTube**, or **JioSaavan**:

```jsx
// Search function
const searchSpotify = async (query) => {
  const results = await spotifyApi.search(query, ['track']);
  setSearchResults(results.tracks.items);
};

// Search YouTube
const searchYouTube = async (query) => {
  const results = await youtubeApi.search(query);
  setSearchResults(results);
};
```

---

### Feature 2: Playlist Management

#### Create Playlists

```jsx
// Add to state
const [playlists, setPlaylists] = useState([
  { id: 1, name: 'Favorites', songs: [] },
  { id: 2, name: 'Workout', songs: [] },
]);
const [selectedPlaylist, setSelectedPlaylist] = useState(1);

// Add song to playlist
const addToPlaylist = (song, playlistId) => {
  setPlaylists(playlists.map(p => 
    p.id === playlistId 
      ? { ...p, songs: [...p.songs, song] }
      : p
  ));
};

// UI for playlists
<div className="settings-section">
  <h3>Playlists</h3>
  {playlists.map(playlist => (
    <div key={playlist.id}>
      <h4>{playlist.name}</h4>
      <button onClick={() => setSelectedPlaylist(playlist.id)}>
        Load Playlist ({playlist.songs.length} songs)
      </button>
    </div>
  ))}
</div>
```

---

### Feature 3: Song List with Details

```jsx
// Display all songs with details
<div className="settings-section">
  <h3>All Songs</h3>
  <table style={{ width: '100%', fontSize: '10px' }}>
    <thead>
      <tr>
        <th>#</th>
        <th>Title</th>
        <th>Artist</th>
        <th>Duration</th>
      </tr>
    </thead>
    <tbody>
      {tracks.map((track, idx) => (
        <tr 
          key={idx}
          onClick={() => handleSelectTrack(idx)}
          style={{
            cursor: 'pointer',
            background: idx === currentTrackIndex ? '#f0f0f0' : 'white'
          }}
        >
          <td>{idx + 1}</td>
          <td>{track.title}</td>
          <td>{track.artist}</td>
          <td>{formatTime(track.duration || 0)}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

---

## Part 3: Complete Integration for .EXE

### Step-by-Step Implementation

#### Step 1: Choose Your Music Source

**Option A: Local Files (Easiest)**
```bash
# Just works - no API needed
# Music from ~/Music/ folder
# Add to .env: (nothing needed)
npm run build && npm run package
```

**Option B: YouTube (Recommended)**
```bash
# Already built-in
# Works in .EXE without setup
npm run build && npm run package
```

**Option C: Spotify (Best quality)**
```bash
# Create .env file
VITE_SPOTIFY_CLIENT_ID=your_id

# Add to bundled .env in .EXE
npm run build && npm run package
```

**Option D: JioSaavan (Free streaming)**
```bash
# Install: npm install jiosaavn-api
# Add hook from this guide
# Works in .EXE without API key
npm run build && npm run package
```

#### Step 2: Add Features

**Add Search:**
```jsx
// Copy code from "Feature 1: Music Search" above
// Paste into App.jsx
```

**Add Playlists:**
```jsx
// Copy code from "Feature 2: Playlist Management" above
// Paste into App.jsx
```

**Add List:**
```jsx
// Copy code from "Feature 3: Song List" above
// Paste into App.jsx
```

#### Step 3: Build

```bash
npm run build && npm run package
```

Find `.exe` in `out/` folder!

---

## Complete Working Example

Here's a minimal example adding **Search + List + Playlists**:

### Create file: `src/useMusicIntegration.js`

```javascript
import { useState, useCallback } from 'react';

export function useMusicIntegration(tracks) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [playlists, setPlaylists] = useState([
    { id: 1, name: 'Favorites', songs: [] },
    { id: 2, name: 'Workout', songs: [] },
  ]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(1);

  const search = useCallback((query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    
    const results = tracks.filter(track =>
      track.title.toLowerCase().includes(query.toLowerCase()) ||
      track.artist.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(results);
  }, [tracks]);

  const addToPlaylist = useCallback((song, playlistId) => {
    setPlaylists(playlists.map(p =>
      p.id === playlistId
        ? { ...p, songs: [...p.songs, song] }
        : p
    ));
  }, [playlists]);

  const removeFromPlaylist = useCallback((songId, playlistId) => {
    setPlaylists(playlists.map(p =>
      p.id === playlistId
        ? { ...p, songs: p.songs.filter(s => s.id !== songId) }
        : p
    ));
  }, [playlists]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    search,
    playlists,
    selectedPlaylist,
    setSelectedPlaylist,
    addToPlaylist,
    removeFromPlaylist,
  };
}
```

### Use in App.jsx

```jsx
import { useMusicIntegration } from './useMusicIntegration';

// In App component:
const music = useMusicIntegration(tracks);

// In JSX (add to settings):
<div className="settings-section">
  <h3>🔍 Search</h3>
  <input
    type="text"
    placeholder="Search songs..."
    value={music.searchQuery}
    onChange={(e) => {
      music.setSearchQuery(e.target.value);
      music.search(e.target.value);
    }}
    style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
  />
  
  {music.searchResults.length > 0 && (
    <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
      {music.searchResults.map((song, idx) => (
        <div key={idx} style={{ padding: '4px', cursor: 'pointer' }}>
          {song.title} - {song.artist}
        </div>
      ))}
    </div>
  )}
</div>

<div className="settings-section">
  <h3>📋 All Songs</h3>
  {tracks.map((track, idx) => (
    <div key={idx} style={{ padding: '4px', borderBottom: '1px solid #ccc' }}>
      {idx + 1}. {track.title} - {track.artist}
      <button onClick={() => music.addToPlaylist(track, music.selectedPlaylist)}>
        Add
      </button>
    </div>
  ))}
</div>

<div className="settings-section">
  <h3>❤️ Playlists</h3>
  {music.playlists.map(p => (
    <div key={p.id}>
      <h4>{p.name} ({p.songs.length})</h4>
      <button onClick={() => music.setSelectedPlaylist(p.id)}>
        Load
      </button>
    </div>
  ))}
</div>
```

---

## Quick Comparison: Which to Choose?

### For .EXE Distribution

| Need | Solution |
|------|----------|
| **Easiest** | Local files (~/Music/) |
| **Free unlimited songs** | YouTube Music |
| **Best quality** | Spotify (free tier) |
| **All features** | YouTube + Local combined |

### My Recommendation

**Best for .EXE:**

```
1. Use Local Music + YouTube Music (both together)
   ├─ Local: Custom songs
   └─ YouTube: Search + unlimited songs
   
2. Add Search + List + Playlists (from Feature 1-3 above)

3. Build to .EXE (no API keys needed!)

4. Users can:
   ├─ Use local music
   ├─ Search YouTube
   ├─ Create playlists
   └─ Enjoy!
```

---

## Implementation Checklist

### Step 1: Add Music Source
- [ ] Local files (already works)
- [ ] YouTube (already built-in)
- [ ] Or add Spotify (if you want)

### Step 2: Add Features
- [ ] Search functionality
- [ ] Song list/library
- [ ] Playlist management

### Step 3: Test Locally
```bash
npm run dev
# Test search, list, playlists
```

### Step 4: Build
```bash
npm run build && npm run package
# Find .exe in out/
```

### Step 5: Share
```
Send .exe to friends
They download and run
Works with no setup!
```

---

## Code Files to Modify

### Files to Edit:
1. `src/App.jsx` - Add features from above
2. `src/App.css` - Style the new features
3. Create `src/useMusicIntegration.js` - Search/playlist hook

### No Changes Needed:
- `package.json`
- `electron/main.cjs`
- `vite.config.js`

---

## Final Steps

### To Add Search + List + Playlists to Your .EXE:

```bash
# 1. Create the integration hook
# (copy useMusicIntegration.js code above)
# save as: src/useMusicIntegration.js

# 2. Update App.jsx
# (add the hook and JSX from above)

# 3. Test locally
npm run dev

# 4. Build
npm run build && npm run package

# 5. Find .exe in out/ folder
ls out/
```

Done! Your .EXE now has:
- ✅ Search functionality
- ✅ Song list with all details
- ✅ Playlist management
- ✅ Free music (YouTube or local)
- ✅ No API keys needed

**Ready to distribute!** 🎵
