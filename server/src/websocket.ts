import { WebSocket, WebSocketServer } from 'ws';
import { Server } from 'http';
import { PrismaClient } from '@prisma/client';

interface BroadcastEvent {
  type: string;
  [key: string]: any;
}

export function setupWebSocket(server: Server, prisma: PrismaClient) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  const clients = new Set<WebSocket>();

  wss.on('connection', async (ws) => {
    console.log('Client connected');
    clients.add(ws);

    // Send current recently played history to the new client
    try {
      const history = await prisma.recentlyPlayed.findMany({
        take: 50,
        orderBy: { playedAt: 'desc' },
        include: { track: true }
      });

      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'history.sync',
          history
        }));
      }
    } catch (error) {
      console.error('Failed to send history to new client:', error);
    }

    // Send heartbeat every 30 seconds
    const heartbeat = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'ping',
          ts: new Date().toISOString()
        }));
      }
    }, 30000);

    ws.on('close', () => {
      console.log('Client disconnected');
      clients.delete(ws);
      clearInterval(heartbeat);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  // Broadcast function to send events to all clients
  function broadcast(event: BroadcastEvent) {
    const message = JSON.stringify(event);
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  return { broadcast };
}