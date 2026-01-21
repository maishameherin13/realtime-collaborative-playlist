import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const tracks = [
  // Rock Classics
  { title: "Bohemian Rhapsody", artist: "Queen", album: "A Night at the Opera", durationSeconds: 355, genre: "Rock" },
  { title: "Stairway to Heaven", artist: "Led Zeppelin", album: "Led Zeppelin IV", durationSeconds: 482, genre: "Rock" },
  { title: "Hotel California", artist: "Eagles", album: "Hotel California", durationSeconds: 391, genre: "Rock" },
  { title: "Sweet Child O' Mine", artist: "Guns N' Roses", album: "Appetite for Destruction", durationSeconds: 356, genre: "Rock" },
  { title: "Smells Like Teen Spirit", artist: "Nirvana", album: "Nevermind", durationSeconds: 301, genre: "Rock" },
  { title: "Dream On", artist: "Aerosmith", album: "Aerosmith", durationSeconds: 263, genre: "Rock" },
  { title: "November Rain", artist: "Guns N' Roses", album: "Use Your Illusion I", durationSeconds: 537, genre: "Rock" },
  { title: "Black", artist: "Pearl Jam", album: "Ten", durationSeconds: 343, genre: "Rock" },

  // Pop Hits
  { title: "Blinding Lights", artist: "The Weeknd", album: "After Hours", durationSeconds: 200, genre: "Pop" },
  { title: "Shape of You", artist: "Ed Sheeran", album: "÷ (Divide)", durationSeconds: 233, genre: "Pop" },
  { title: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia", durationSeconds: 203, genre: "Pop" },
  { title: "Anti-Hero", artist: "Taylor Swift", album: "Midnights", durationSeconds: 200, genre: "Pop" },
  { title: "Flowers", artist: "Miley Cyrus", album: "Endless Summer Vacation", durationSeconds: 200, genre: "Pop" },
  { title: "As It Was", artist: "Harry Styles", album: "Harry's House", durationSeconds: 167, genre: "Pop" },
  { title: "Bad Guy", artist: "Billie Eilish", album: "When We All Fall Asleep", durationSeconds: 194, genre: "Pop" },

  // Hip-Hop/Rap
  { title: "HUMBLE.", artist: "Kendrick Lamar", album: "DAMN.", durationSeconds: 177, genre: "Hip-Hop" },
  { title: "Sicko Mode", artist: "Travis Scott", album: "Astroworld", durationSeconds: 312, genre: "Hip-Hop" },
  { title: "God's Plan", artist: "Drake", album: "Scorpion", durationSeconds: 198, genre: "Hip-Hop" },
  { title: "Lose Yourself", artist: "Eminem", album: "8 Mile Soundtrack", durationSeconds: 326, genre: "Hip-Hop" },
  { title: "MONTERO", artist: "Lil Nas X", album: "MONTERO", durationSeconds: 137, genre: "Hip-Hop" },
  { title: "Hotline Bling", artist: "Drake", album: "Views", durationSeconds: 267, genre: "Hip-Hop" },

  // Electronic/EDM
  { title: "Strobe", artist: "Deadmau5", album: "For Lack of a Better Name", durationSeconds: 636, genre: "Electronic" },
  { title: "Titanium", artist: "David Guetta ft. Sia", album: "Nothing but the Beat", durationSeconds: 245, genre: "Electronic" },
  { title: "Wake Me Up", artist: "Avicii", album: "True", durationSeconds: 247, genre: "Electronic" },
  { title: "Animals", artist: "Martin Garrix", album: "Animals", durationSeconds: 302, genre: "Electronic" },
  { title: "One More Time", artist: "Daft Punk", album: "Discovery", durationSeconds: 320, genre: "Electronic" },
  { title: "Clarity", artist: "Zedd ft. Foxes", album: "Clarity", durationSeconds: 271, genre: "Electronic" },

  // Jazz
  { title: "Take Five", artist: "Dave Brubeck", album: "Time Out", durationSeconds: 324, genre: "Jazz" },
  { title: "So What", artist: "Miles Davis", album: "Kind of Blue", durationSeconds: 563, genre: "Jazz" },
  { title: "My Favorite Things", artist: "John Coltrane", album: "My Favorite Things", durationSeconds: 823, genre: "Jazz" },
  { title: "Autumn Leaves", artist: "Bill Evans Trio", album: "Portrait in Jazz", durationSeconds: 310, genre: "Jazz" },
  { title: "Round Midnight", artist: "Thelonious Monk", album: "Genius of Modern Music", durationSeconds: 189, genre: "Jazz" },

  // Classical
  { title: "Clair de Lune", artist: "Claude Debussy", album: "Suite Bergamasque", durationSeconds: 300, genre: "Classical" },
  { title: "Moonlight Sonata", artist: "Ludwig van Beethoven", album: "Piano Sonata No. 14", durationSeconds: 360, genre: "Classical" },
  { title: "The Four Seasons: Spring", artist: "Antonio Vivaldi", album: "The Four Seasons", durationSeconds: 600, genre: "Classical" },
  { title: "Symphony No. 5", artist: "Ludwig van Beethoven", album: "Symphony No. 5", durationSeconds: 420, genre: "Classical" },

  // R&B/Soul
  { title: "Superstition", artist: "Stevie Wonder", album: "Talking Book", durationSeconds: 245, genre: "R&B" },
  { title: "Redbone", artist: "Childish Gambino", album: "Awaken, My Love!", durationSeconds: 327, genre: "R&B" },
  { title: "Thinking Out Loud", artist: "Ed Sheeran", album: "x", durationSeconds: 281, genre: "R&B" },
  { title: "Earned It", artist: "The Weeknd", album: "Beauty Behind the Madness", durationSeconds: 259, genre: "R&B" },
  { title: "Crazy in Love", artist: "Beyoncé ft. Jay-Z", album: "Dangerously in Love", durationSeconds: 236, genre: "R&B" },

  // Alternative/Indie
  { title: "Radioactive", artist: "Imagine Dragons", album: "Night Visions", durationSeconds: 187, genre: "Alternative" },
  { title: "Mr. Brightside", artist: "The Killers", album: "Hot Fuss", durationSeconds: 222, genre: "Alternative" },
  { title: "Somebody That I Used to Know", artist: "Gotye", album: "Making Mirrors", durationSeconds: 244, genre: "Alternative" },
  { title: "Take Me to Church", artist: "Hozier", album: "Hozier", durationSeconds: 241, genre: "Alternative" },
  { title: "Stressed Out", artist: "Twenty One Pilots", album: "Blurryface", durationSeconds: 202, genre: "Alternative" },

  // Country
  { title: "Jolene", artist: "Dolly Parton", album: "Jolene", durationSeconds: 162, genre: "Country" },
  { title: "The Gambler", artist: "Kenny Rogers", album: "The Gambler", durationSeconds: 216, genre: "Country" },
  { title: "Tennessee Whiskey", artist: "Chris Stapleton", album: "Traveller", durationSeconds: 302, genre: "Country" },

  // Latin
  { title: "Despacito", artist: "Luis Fonsi ft. Daddy Yankee", album: "Vida", durationSeconds: 228, genre: "Latin" },
  { title: "La Bamba", artist: "Ritchie Valens", album: "La Bamba", durationSeconds: 126, genre: "Latin" },
];

const initialPlaylist = [
  { trackIndex: 0, position: 1.0, votes: 8, addedBy: "Alice", isPlaying: true },  // Bohemian Rhapsody
  { trackIndex: 9, position: 2.0, votes: 5, addedBy: "Bob", isPlaying: false },   // Blinding Lights
  { trackIndex: 16, position: 3.0, votes: 3, addedBy: "Charlie", isPlaying: false }, // HUMBLE.
  { trackIndex: 22, position: 4.0, votes: 7, addedBy: "Diana", isPlaying: false }, // Strobe
  { trackIndex: 4, position: 5.0, votes: 2, addedBy: "Eve", isPlaying: false },    // Smells Like Teen Spirit
  { trackIndex: 41, position: 6.0, votes: -1, addedBy: "Frank", isPlaying: false }, // Mr. Brightside
  { trackIndex: 10, position: 7.0, votes: 4, addedBy: "Grace", isPlaying: false }, // Levitating
  { trackIndex: 27, position: 8.0, votes: 1, addedBy: "Henry", isPlaying: false }, // Take Five
  { trackIndex: 2, position: 9.0, votes: 6, addedBy: "Ivy", isPlaying: false },    // Hotel California
  { trackIndex: 14, position: 10.0, votes: -2, addedBy: "Jack", isPlaying: false }, // Bad Guy
];

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.playlistTrack.deleteMany();
  await prisma.track.deleteMany();

  // Seed tracks
  console.log('Seeding tracks...');
  const createdTracks = [];
  for (const track of tracks) {
    const created = await prisma.track.create({ data: track });
    createdTracks.push(created);
  }
  console.log(`Created ${createdTracks.length} tracks`);

  // Seed initial playlist
  console.log('Seeding initial playlist...');
  for (const item of initialPlaylist) {
    await prisma.playlistTrack.create({
      data: {
        trackId: createdTracks[item.trackIndex].id,
        position: item.position,
        votes: item.votes,
        addedBy: item.addedBy,
        isPlaying: item.isPlaying,
      },
    });
  }
  console.log(`Created ${initialPlaylist.length} playlist items`);

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
});