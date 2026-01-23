import request from 'supertest';
import express from 'express';
import http from 'http';
import { prisma, cleanDatabase, seedTestData, teardown } from './setup';

let app: express.Application;
let server: http.Server;

describe('Playlist Operations', () => {
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

  beforeEach(async () => {
    // Clean playlist before each test
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
      expect(response.body.votes).toBe(0);
      expect(response.body.addedBy).toBe('TestUser');
    });

    it('should prevent duplicate tracks', async () => {
      // Add track first time
      await request(app)
        .post('/api/playlist')
        .send({ trackId: 'test-track-1', addedBy: 'User1' });

      // Try to add same track again
      const response = await request(app)
        .post('/api/playlist')
        .send({ trackId: 'test-track-1', addedBy: 'User2' });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('DUPLICATE_TRACK');
    });

    it('should add track with correct position (multiple tracks)', async () => {
      // Add first track
      await request(app)
        .post('/api/playlist')
        .send({ trackId: 'test-track-1', addedBy: 'User1' });

      // Add second track
      const response = await request(app)
        .post('/api/playlist')
        .send({ trackId: 'test-track-2', addedBy: 'User1' });

      expect(response.status).toBe(201);
      expect(response.body.position).toBe(2.0);
    });

    it('should fail with non-existent track', async () => {
      const response = await request(app)
        .post('/api/playlist')
        .send({ trackId: 'non-existent', addedBy: 'User1' });

      expect(response.status).toBe(500);
    });
  });

  describe('PATCH /api/playlist/:id', () => {
    let playlistItemId: string;

    beforeEach(async () => {
      const item = await prisma.playlistTrack.create({
        data: {
          trackId: 'test-track-1',
          position: 1.0,
          votes: 0,
          addedBy: 'User1',
        },
      });
      playlistItemId = item.id;
    });

    it('should update position', async () => {
      const response = await request(app)
        .patch(`/api/playlist/${playlistItemId}`)
        .send({ position: 1.5 });

      expect(response.status).toBe(200);
      expect(response.body.position).toBe(1.5);
    });

    it('should set isPlaying to true', async () => {
      const response = await request(app)
        .patch(`/api/playlist/${playlistItemId}`)
        .send({ isPlaying: true });

      expect(response.status).toBe(200);
      expect(response.body.isPlaying).toBe(true);
      expect(response.body.playedAt).toBeDefined();
    });

    it('should ensure only one track is playing (exclusivity)', async () => {
      // Add second track
      const item2 = await prisma.playlistTrack.create({
        data: {
          trackId: 'test-track-2',
          position: 2.0,
          votes: 0,
          addedBy: 'User1',
          isPlaying: true,
        },
      });

      // Set first track to playing
      await request(app)
        .patch(`/api/playlist/${playlistItemId}`)
        .send({ isPlaying: true });

      // Check that second track is no longer playing
      const item2Updated = await prisma.playlistTrack.findUnique({
        where: { id: item2.id },
      });

      expect(item2Updated?.isPlaying).toBe(false);
    });
  });

  describe('POST /api/playlist/:id/vote', () => {
    let playlistItemId: string;

    beforeEach(async () => {
      const item = await prisma.playlistTrack.create({
        data: {
          trackId: 'test-track-1',
          position: 1.0,
          votes: 5,
          addedBy: 'User1',
        },
      });
      playlistItemId = item.id;
    });

    it('should upvote a track', async () => {
      const response = await request(app)
        .post(`/api/playlist/${playlistItemId}/vote`)
        .send({ direction: 'up' });

      expect(response.status).toBe(200);
      expect(response.body.votes).toBe(6);
    });

    it('should downvote a track', async () => {
      const response = await request(app)
        .post(`/api/playlist/${playlistItemId}/vote`)
        .send({ direction: 'down' });

      expect(response.status).toBe(200);
      expect(response.body.votes).toBe(4);
    });

    it('should allow votes to go negative', async () => {
      // Create track with 0 votes
      const item = await prisma.playlistTrack.create({
        data: {
          trackId: 'test-track-2',
          position: 2.0,
          votes: 0,
          addedBy: 'User1',
        },
      });

      const response = await request(app)
        .post(`/api/playlist/${item.id}/vote`)
        .send({ direction: 'down' });

      expect(response.status).toBe(200);
      expect(response.body.votes).toBe(-1);
    });
  });

  describe('DELETE /api/playlist/:id', () => {
    it('should remove track from playlist', async () => {
      const item = await prisma.playlistTrack.create({
        data: {
          trackId: 'test-track-1',
          position: 1.0,
          votes: 0,
          addedBy: 'User1',
        },
      });

      const response = await request(app)
        .delete(`/api/playlist/${item.id}`);

      expect(response.status).toBe(204);

      // Verify it's deleted
      const deletedItem = await prisma.playlistTrack.findUnique({
        where: { id: item.id },
      });
      expect(deletedItem).toBeNull();
    });

    it('should return 404 for non-existent item', async () => {
      const response = await request(app)
        .delete('/api/playlist/non-existent-id');

      expect(response.status).toBe(500);
    });
  });

  describe('Drag and Drop Simulation', () => {
    it('should reorder track via position update', async () => {
      // Create playlist: Track1(1.0), Track2(2.0), Track3(3.0)
      const items = await Promise.all([
        prisma.playlistTrack.create({
          data: { trackId: 'test-track-1', position: 1.0, votes: 0, addedBy: 'User1' },
        }),
        prisma.playlistTrack.create({
          data: { trackId: 'test-track-2', position: 2.0, votes: 0, addedBy: 'User1' },
        }),
        prisma.playlistTrack.create({
          data: { trackId: 'test-track-3', position: 3.0, votes: 0, addedBy: 'User1' },
        }),
      ]);

      // Drag Track3 between Track1 and Track2
      // New position should be (1.0 + 2.0) / 2 = 1.5
      const response = await request(app)
        .patch(`/api/playlist/${items[2].id}`)
        .send({ position: 1.5 });

      expect(response.status).toBe(200);
      expect(response.body.position).toBe(1.5);

      // Verify order: Track1(1.0), Track3(1.5), Track2(2.0)
      const playlist = await request(app).get('/api/playlist');
      expect(playlist.body[0].trackId).toBe('test-track-1');
      expect(playlist.body[1].trackId).toBe('test-track-3');
      expect(playlist.body[2].trackId).toBe('test-track-2');
    });
  });
});