import { useState, useCallback } from 'react';

export function useMusicIntegration(tracks) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [playlists, setPlaylists] = useState([
    { id: 1, name: '❤️ Favorites', songs: [] },
    { id: 2, name: '🎵 Workout', songs: [] },
    { id: 3, name: '😴 Chill', songs: [] },
  ]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(1);

  const search = useCallback(async (query) => {
    console.log('[search] Query:', query);
    if (!query || !query.trim()) {
      console.log('[search] Query empty, clearing results');
      setSearchResults([]);
      return;
    }

    console.log('[search] Starting search for:', query);
    setSearchLoading(true);
    try {
      console.log('[search] Calling window.cupid.searchYouTubeMusic');
      if (!window.cupid?.searchYouTubeMusic) {
        console.error('[search] window.cupid.searchYouTubeMusic not available');
        setSearchResults([]);
        return;
      }
      const results = await window.cupid.searchYouTubeMusic(query);
      console.log('[search] Results received:', results?.length || 0);
      setSearchResults(Array.isArray(results) ? results : []);
    } catch (err) {
      console.error('[search] Error:', err.message);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const addToPlaylist = useCallback((song, playlistId) => {
    setPlaylists(prev => prev.map(p =>
      p.id === playlistId
        ? { ...p, songs: [...p.songs, song] }
        : p
    ));
  }, []);

  const removeFromPlaylist = useCallback((songTitle, playlistId) => {
    setPlaylists(prev => prev.map(p =>
      p.id === playlistId
        ? { ...p, songs: p.songs.filter(s => s.title !== songTitle) }
        : p
    ));
  }, []);

  const createPlaylist = useCallback((name) => {
    setPlaylists(prev => {
      const newId = Math.max(...prev.map(p => p.id), 0) + 1;
      return [...prev, { id: newId, name, songs: [] }];
    });
  }, []);

  const deletePlaylist = useCallback((playlistId) => {
    setPlaylists(prev => prev.filter(p => p.id !== playlistId));
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    search,
    searchLoading,
    playlists,
    selectedPlaylist,
    setSelectedPlaylist,
    addToPlaylist,
    removeFromPlaylist,
    createPlaylist,
    deletePlaylist,
  };
}
