import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

// Set test database URL before any PrismaClient is instantiated
process.env.DATABASE_URL = 'file:./test.db';

export const prisma = new PrismaClient();

// Initialize test database
export async function initTestDatabase() {
  try {
    // Run migrations for test database
    execSync('DATABASE_URL="file:./test.db" npx prisma migrate deploy', {
      stdio: 'inherit',
    });
  } catch (error) {
    console.error('Failed to initialize test database:', error);
  }
}

// Clean database before each test
export async function cleanDatabase() {
  try {
    await prisma.recentlyPlayed.deleteMany();
  } catch (error) {
    // Table might not exist yet, skip
    console.log('RecentlyPlayed table not found, skipping...');
  }
  
  await prisma.playlistTrack.deleteMany();
  await prisma.track.deleteMany();
}

// Seed test data
export async function seedTestData() {
  await Promise.all([
    prisma.track.upsert({
      where: { id: 'test-track-1' },
      update: {},
      create: {
        id: 'test-track-1',
        title: 'Test Song 1',
        artist: 'Test Artist 1',
        album: 'Test Album',
        durationSeconds: 180,
        genre: 'Rock',
      },
    }),
    prisma.track.upsert({
      where: { id: 'test-track-2' },
      update: {},
      create: {
        id: 'test-track-2',
        title: 'Test Song 2',
        artist: 'Test Artist 2',
        album: 'Test Album',
        durationSeconds: 200,
        genre: 'Pop',
      },
    }),
    prisma.track.upsert({
      where: { id: 'test-track-3' },
      update: {},
      create: {
        id: 'test-track-3',
        title: 'Test Song 3',
        artist: 'Test Artist 3',
        album: 'Test Album',
        durationSeconds: 240,
        genre: 'Jazz',
      },
    }),
  ]);
}

// Cleanup after all tests
export async function teardown() {
  await prisma.$disconnect();
}