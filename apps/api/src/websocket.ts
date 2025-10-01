import WebSocket from 'ws';
import { Server as HttpServer } from 'http';
import { Donation } from '@stroomp/shared-types';

interface WebSocketServer {
  wss: WebSocket.Server;
  broadcast: (data: any) => void;
  sendToStream: (streamId: string, data: any) => void;
}

// Store active connections by stream ID
const connections: Map<string, Set<WebSocket.WebSocket>> = new Map();

// Function to create WebSocket server
const createWebSocketServer = (server: HttpServer): WebSocketServer => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws: WebSocket.WebSocket, req) => {
    console.log('New WebSocket connection');
    
    // Parse stream ID from URL
    const urlParams = new URLSearchParams(req.url?.split('?')[1]);
    const streamId = urlParams.get('streamId') || 'global';
    
    // Add connection to stream group
    if (!connections.has(streamId)) {
      connections.set(streamId, new Set());
    }
    connections.get(streamId)?.add(ws);
    
    console.log(`Connection added to stream ${streamId}, total: ${connections.get(streamId)?.size}`);
    
    // Handle messages from client
    ws.on('message', (message: WebSocket.Data) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received message:', data);
        
        // Echo message back to sender
        ws.send(JSON.stringify({ type: 'echo', data }));
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });
    
    // Handle connection close
    ws.on('close', () => {
      console.log('WebSocket connection closed');
      // Remove connection from stream group
      connections.get(streamId)?.delete(ws);
      if (connections.get(streamId)?.size === 0) {
        connections.delete(streamId);
      }
      console.log(`Connection removed from stream ${streamId}`);
    });
    
    // Handle connection error
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
    
    // Send welcome message
    ws.send(JSON.stringify({
      type: 'welcome',
      message: 'Connected to Stroomp WebSocket server',
      streamId
    }));
  });
  
  // Broadcast message to all connections
  const broadcast = (data: any) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  };
  
  // Send message to specific stream connections
  const sendToStream = (streamId: string, data: any) => {
    const streamConnections = connections.get(streamId);
    if (streamConnections) {
      streamConnections.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    }
  };

  return {
    wss,
    broadcast,
    sendToStream
  };
};

// Function to notify donations
const notifyDonation = (wss: WebSocketServer, donation: Donation) => {
  const message = {
    type: 'donation',
    data: donation
  };
  
  // Send to streamer's stream
  wss.sendToStream(donation.to, message);
  
  // Also broadcast globally for notification center
  wss.broadcast({
    type: 'global_donation',
    data: {
      from: donation.from,
      to: donation.to,
      amount: donation.amount,
      message: donation.message,
      timestamp: donation.timestamp
    }
  });
};

export { createWebSocketServer, notifyDonation, WebSocketServer };