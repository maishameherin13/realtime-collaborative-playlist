import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { calculatePosition } from './utils/position';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// GET /api/tracks - get all tracks from library
app.get('/api/tracks', async (req, res) => {
    try {
        const tracks = await prisma.track.findMany({
            orderBy: {title: 'asc'}
        });
        res.json(tracks);
    } catch(error){
        res.status(500).json({ error: { code: 'UPDATE_FAILED', message: 'Failed to update track' }});
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
        res.status(500).json({ error: { code: 'UPDATE_FAILED', message: 'Failed to update track' }}); 
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

        const updateData: any = {};

        if (position !== undefined) updateData.position = position;
        if (isPlaying !== undefined) {
            updateData.isPlaying = isPlaying;

            //if playing, unset all other tracks
            if (isPlaying){
                await prisma.playlistTrack.updateMany({
                    where: { isPlaying: true },
                    data: { isPlaying: false}
                });
                updateData.playedAt = new Date();
            }
        }

        const item = await prisma.playlistTrack.update({
            where: { id },
            data: updateData,
            include: { track: true}
        });
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: { code: 'UPDATE_FAILED', message: 'Failed to update track' }});
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

        res.json(updated);
    }catch(error){
        res.status(500).json({ error: { code: 'VOTE_FAILED', message: 'Failed to vote' }}); 
    }
});

// DELETE /api/playlist/:id - remove
app.delete('/api/playlist/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.playlistTrack.delete({ where: { id }});
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: { code: 'DELETE_FAILED', message: 'Failed to delete track' }});
  }
});

app.listen(PORT, () => console.log(`Server on : ${PORT}`));