import request from 'supertest';
import express from 'express';
import http from 'http';
import { prisma, cleanDatabase, seedTestData, teardown } from './setup';

// You'll need to create a function to get your app without starting the server
// For now, we'll import the app directly
let app: express.Application;
let server: http.Server;

// Mock the app setup
beforeAll(async () => {
  await cleanDatabase();
  await seedTestData();
  
  // Import and setup app
  const indexModule = await import('../src/index');
  app = indexModule.app;
  server = indexModule.server;
});

afterAll(async () => {
  await teardown();
  if (server) {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  }
});

describe('Playlist Operations', () => {
  beforeEach(async () => {
    await prisma.playlistTrack.deleteMany();
  });

  describe('GET /api/playlist', () => {
    it('should return empty playlist initially', async () => {
      const response = await request(app).get('/api/playlist');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return playlist sorted by position', async () => {
      await prisma.playlistTrack.createMany({
        data: [
          { trackId: 'test-track-1', position: 2.0, votes: 0, addedBy: 'User1' },
          { trackId: 'test-track-2', position: 1.0, votes: 0, addedBy: 'User1' },
          { trackId: 'test-track-3', position: 3.0, votes: 0, addedBy: 'User1' },
        ],
      });

      const response = await request(app).get('/api/playlist');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(3);
      expect(response.body[0].position).toBe(1.0);
      expect(response.body[1].position).toBe(2.0);
      expect(response.body[2].position).toBe(3.0);
    });
  });

  describe('POST /api/playlist', () => {
    it('should add track to playlist', async () => {
      const response = await request(app)
        .post('/api/playlist')
        .send({
          trackId: 'test-track-1',
          addedBy: 'TestUser',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.trackId).toBe('test-track-1');
      expect(response.body.position).toBe(1.0);
    });

    it('should prevent duplicate tracks', async () => {
      await request(app)
        .post('/api/playlist')
        .send({ trackId: 'test-track-1', addedBy: 'User1' });

      const response = await request(app)
        .post('/api/playlist')
        .send({ trackId: 'test-track-1', addedBy: 'User2' });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('DUPLICATE_TRACK');
    });
  });
});