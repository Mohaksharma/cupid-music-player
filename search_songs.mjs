import { innertube } from 'youtubei.js';

const songs = [
  { id: 1, title: "Lovers Rock", artist: "TV Girl" },
  { id: 2, title: "Cherry Cola", artist: "Clairo" },
  { id: 3, title: "Pretty When You Cry", artist: "VAST" },
  { id: 4, title: "Sunday Best", artist: "Surfaces" },
  { id: 5, title: "Dreams", artist: "Fleetwood Mac" }
];

(async () => {
  const yt = await innertube();
  const updated = [];
  
  for (const song of songs) {
    try {
      const query = `${song.title} ${song.artist}`;
      console.log(`Searching: ${query}`);
      
      const results = await yt.music.search(query, { type: 'song' });
      if (results && results.length > 0) {
        const first = results[0];
        updated.push({
          id: song.id,
          title: song.title,
          artist: song.artist,
          video_id: first.id
        });
        console.log(`  ✓ Found: ${first.title} (ID: ${first.id})`);
      } else {
        console.log(`  ✗ No results`);
      }
    } catch (err) {
      console.error(`  Error: ${err.message}`);
    }
  }
  
  console.log('\nUpdated playlist:');
  console.log(JSON.stringify(updated, null, 2));
})().catch(console.error);
