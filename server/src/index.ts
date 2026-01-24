import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { setupWebSocket } from './websocket';
import { PrismaClient } from '@prisma/client';
import { calculatePosition } from './utils/position';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
}));
app.use(express.json());

const server = http.createServer(app);
const { broadcast } = setupWebSocket(server, prisma);

// Make broadcast available to routes
app.set('broadcast', broadcast);

// GET /api/tracks - get all tracks from library
app.get('/api/tracks', async (req, res) => {
    try {
        const tracks = await prisma.track.findMany({
            orderBy: {title: 'asc'}
        });
        res.json(tracks);
    } catch(error){
        res.status(500).json({ error: { code: 'FETCH_FAILED', message: 'Failed to fetch tracks' }});
    }
});

// GET /api/playlist - current playlist
app.get('/api/playlist', async (req, res) => {
    try {
        const items = await prisma.playlistTrack.findMany({
            include: { track: true },
            orderBy: { position: 'asc' }
        });
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: { code: 'FETCH_FAILED', message: 'Failed to fetch playlist' }}); 
    }
});

// POST /api/playlist - add track to the playlist
app.post('/api/playlist', async (req, res) => {
    try {
        const { trackId, addedBy } = req.body;

        //precheck if the track already exists in the playlist
        const existing = await prisma.playlistTrack.findFirst({
            where: { trackId }
        });

        if (existing){
            return res.status(400).json({
                error: {
                    code: 'DUPLICATE_TRACK',
                    message: 'This track already exists in the playlist',
                    details: { trackId }
                }
            });
        }
        //get last position in playlist
        const lastItem = await prisma.playlistTrack.findFirst({
            orderBy: { position: 'desc' }
        });

        const newPosition = calculatePosition(lastItem?.position || null, null);

        const item = await prisma.playlistTrack.create({
            data: {
                trackId,
                position: newPosition,
                addedBy: addedBy || 'Anonymous'
            },
            include: { track: true }
        });

        // Broadcast to all connected clients
        const broadcastFn = req.app.get('broadcast');
        broadcastFn({ 
            type: 'track.added', 
            item 
        });

        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ error: { code: 'CREATE_FAILED', message: 'Failed to add track' }});
    }
});

// PATCH /api/playlist/:id - update position/playing
app.patch('/api/playlist/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { position, isPlaying } = req.body;

    console.log('PATCH /api/playlist/:id called');
    console.log('  id:', id);
    console.log('  body:', req.body);

    const updateData: any = {};

    if (position !== undefined) updateData.position = position;
    if (isPlaying !== undefined) {
      updateData.isPlaying = isPlaying;

      // If setting to playing, unset all others
      if (isPlaying) {
        console.log('  Setting isPlaying=true, unsetting all others...');
        await prisma.playlistTrack.updateMany({
          where: { isPlaying: true },
          data: { isPlaying: false }
        });
        updateData.playedAt = new Date();
      }
    }

    console.log('  Updating item with:', updateData);
    const item = await prisma.playlistTrack.update({
      where: { id },
      data: updateData,
      include: { track: true }
    });

    console.log('  Updated item:', item);

    // Broadcast based on what changed
    const broadcastFn = req.app.get('broadcast');
    
    if (position !== undefined) {
      console.log('  Broadcasting track.moved');
      broadcastFn({ 
        type: 'track.moved', 
        item 
      });
    }
    
    if (isPlaying !== undefined) {
      console.log('  Broadcasting track.playing with id:', item.id);
      broadcastFn({ 
        type: 'track.playing', 
        id: item.id,
        item
      });
    }

    res.json(item);
  } catch (error) {
    console.error('PATCH error:', error);
    res.status(500).json({ error: { code: 'UPDATE_FAILED', message: 'Failed to update track' }});
  }
});

app.post('/api/playback/pause', async (req, res) => {
    try {
        const broadcastFn = req.app.get('broadcast');
        broadcastFn({
            type: 'playback.paused'
        });

        res.json({ status: 'paused' });
    } catch(error) {
        console.log('Pause error', error);
        res.status(500).json({ error: { code: 'PAUSE_FAILED', message: 'Failed to pause' }});
    }
});

//POST /api/playback/resume
app.post('/api/playback/resume', async (req, res) => {
    try {
        const broadcastFn = req.app.get('broadcast');
        broadcastFn({
            type: 'playback.resumed'
        });
        res.json({ status: 'playing'});
    } catch(error){
        console.error('Resume error:', error);
        res.status(500).json({ error: { code: 'RESUME_FAILED', message: 'Failed to resume' }});
    }
})

// POST /api/playlist/auto-sort - toggle auto-sort by votes
app.post('/api/playlist/auto-sort', async (req, res) => {
    try {
        const { enabled } = req.body;

        // Broadcast auto-sort state to all clients
        const broadcastFn = req.app.get('broadcast');
        broadcastFn({
            type: 'playlist.autoSortToggled',
            enabled
        });

        res.json({ autoSort: enabled });
    } catch(error){
        console.error('Auto-sort toggle error:', error);
        res.status(500).json({ error: { code: 'AUTO_SORT_FAILED', message: 'Failed to toggle auto-sort' }});
    }
});

// POST /api/playlist/:id/vote - vote
app.post('/api/playlist/:id/vote', async (req, res) => {
    try {
        const { id } = req.params;
        const { direction } = req.body;

        const item = await prisma.playlistTrack.findUnique({ where: { id }});
        if (!item) {
            return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Track not found' }});
        }

        const newVotes = direction === 'up' ? item.votes + 1 : item.votes - 1;

        const updated = await prisma.playlistTrack.update({
            where: { id},
            data: { votes: newVotes},
            include: {track: true}
        });

        // Broadcast vote change
        const broadcastFn = req.app.get('broadcast');
        broadcastFn({ 
            type: 'track.voted', 
            item: updated 
        });

        res.json(updated);
    }catch(error){
        res.status(500).json({ error: { code: 'VOTE_FAILED', message: 'Failed to vote' }}); 
    }
});


//GET /api/history - get recently played tracks
app.get('/api/history', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit as string) || 50;

        const history = await prisma.recentlyPlayed.findMany({
            take: limit,
            orderBy: {playedAt: 'desc'},
            include: {track: true}
        });
        res.json(history);
    } catch(error){
        console.error('Get history error:', error);
        res.status(500).json({ 
        error: { code: 'FETCH_FAILED', message: 'Failed to fetch history' }
        });
    }
});

//POST /api/history when track starts playing
app.post('/api/history', async (req, res) => {
    try {
        const {trackId, playedBy} = req.body;

        // Check if this exact track was added in the last 60 seconds to prevent duplicates
        const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
        const recentEntry = await prisma.recentlyPlayed.findFirst({
            where: {
                trackId,
                playedBy,
                playedAt: {
                    gte: oneMinuteAgo
                }
            }
        });

        // If found, return the existing entry without creating a duplicate
        if (recentEntry) {
            const entryWithTrack = await prisma.recentlyPlayed.findUnique({
                where: { id: recentEntry.id },
                include: { track: true }
            });
            return res.json(entryWithTrack);
        }

        const entry = await prisma.recentlyPlayed.create({
            data: {
                trackId,
                playedBy
            },
            include: { track: true }
        });

        //broadcast to all clients
        const broadcastFn = req.app.get('broadcast');
        broadcastFn({
            type: 'history.added',
            entry
        });
        res.json(entry);
    } catch (error){
        console.error('Add to history error:', error);
        res.status(500).json({
        error: { code: 'ADD_FAILED', message: 'Failed to add to history' }
        });
    }
}); 
// DELETE /api/playlist/:id - remove
app.delete('/api/playlist/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Broadcast before deleting
        const broadcastFn = req.app.get('broadcast');
        broadcastFn({ 
            type: 'track.removed', 
            id 
        });

        await prisma.playlistTrack.delete({ where: { id }});
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: { code: 'DELETE_FAILED', message: 'Failed to delete track' }});
    }
});


export { app, server };

// Only start server if not in test mode
if (process.env.NODE_ENV !== 'test' && require.main === module) {
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`WebSocket available at ws://localhost:${PORT}/ws`);
  });
}