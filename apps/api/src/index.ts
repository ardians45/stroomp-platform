import express, { Request, Response } from 'express';
import cors from 'cors';
import http from 'http';
import { authenticateToken, authenticateWallet, getUserProfile, AuthRequest } from './auth';
import { createWebSocketServer, notifyDonation } from './websocket';

const app = express();
const port = 3001;

// Create HTTP server to be used by both Express and WebSocket
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Import shared types if needed
import { Stream, Donation, Poll } from '@stroomp/shared-types';

// In-memory storage for demonstration (would use database in production)
const streams: Stream[] = [];
const donations: Donation[] = [];
const polls: Poll[] = [];

// Create WebSocket server
const wsServer = createWebSocketServer(server);

// Public route
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Hello from STROOMP API!',
    endpoints: {
      'POST /auth/wallet': 'Authenticate wallet and get JWT token',
      'GET /user/profile': 'Get user profile (requires auth token)',
      'GET /streams': 'Get all live streams',
      'GET /streams/:id': 'Get specific stream',
      'POST /streams': 'Create new stream (requires auth)',
      'POST /donations': 'Create new donation (requires auth)',
      'GET /donations': 'Get donations for a stream',
      'POST /polls': 'Create new poll (requires auth)',
      'POST /polls/:id/vote': 'Vote on a poll (requires auth)'
    }
  });
});

// Authentication routes
app.post('/auth/wallet', authenticateWallet);

// Protected routes
app.get('/user/profile', authenticateToken, getUserProfile);

// Stream routes
app.get('/streams', (req: Request, res: Response) => {
  const formattedStreams = streams.map(s => ({
    ...s,
    status: s.isLive ? 'LIVE' : s.status,
    startTime: s.startTime.toISOString(), // Convert to ISO string
    viewers: s.viewerCount // Map viewerCount to viewers
  }));
  res.json({ success: true, data: formattedStreams });
});

app.get('/streams/live', (req: Request, res: Response) => {
  const liveStreams = streams
    .filter(s => s.isLive)
    .map(s => ({
      ...s,
      status: 'LIVE', // Explicitly set to LIVE
      startTime: s.startTime.toISOString(), // Convert to ISO string
      viewers: s.viewerCount // Map viewerCount to viewers
    }));
  res.json({ success: true, data: liveStreams });
});

app.get('/streams/:id', (req: Request, res: Response) => {
  const stream = streams.find(s => s.id === req.params.id);
  if (!stream) {
    return res.status(404).json({ success: false, message: 'Stream not found' });
  }
  const formattedStream = {
    ...stream,
    status: stream.isLive ? 'LIVE' : stream.status,
    startTime: stream.startTime.toISOString(), // Convert to ISO string
    viewers: stream.viewerCount // Map viewerCount to viewers
  };
  res.json({ success: true, data: formattedStream });
});

app.post('/streams', authenticateToken, (req: AuthRequest, res: Response) => {
  const { title, description, category } = req.body;
  const streamerId = req.user?.id;
  
  if (!title || !streamerId) {
    return res.status(400).json({ 
      success: false, 
      message: 'Title and valid user required' 
    });
  }
  
  const newStream: Stream = {
    id: `stream_${Date.now()}`,
    title,
    description,
    category,
    streamerId,
    viewerCount: 0,
    isLive: true, // Set to true initially
    createdAt: new Date(),
    startTime: new Date(), // Add startTime
    status: 'LIVE' as any // Using 'as any' to avoid enum typing issues for now
  };
  
  streams.push(newStream);
  
  // Convert to frontend format before sending response
  const formattedStream = {
    ...newStream,
    status: 'LIVE',
    startTime: newStream.startTime.toISOString(),
    viewers: newStream.viewerCount
  };
  
  res.status(201).json({ success: true, data: formattedStream });
});

// Helper function to convert backend Donation to frontend format
const convertDonationToFrontendFormat = (d: any) => ({
  ...d,
  timestamp: d.timestamp.toISOString()
});

// Donation routes
app.get('/donations', (req: Request, res: Response) => {
  const { streamId } = req.query as { streamId?: string };
  let filteredDonations = donations;
  
  if (streamId) {
    filteredDonations = donations.filter(d => d.to === streamId);
  }
  
  const formattedDonations = filteredDonations.map(d => convertDonationToFrontendFormat(d));
  res.json({ success: true, data: formattedDonations });
});

app.post('/donations', authenticateToken, (req: AuthRequest, res: Response) => {
  const { to, amount, message, txSignature, isAnonymous } = req.body;
  const from = req.user?.wallet;
  
  if (!from || !to || !amount || !txSignature) {
    return res.status(400).json({ 
      success: false, 
      message: 'From wallet, to wallet, amount, and txSignature required' 
    });
  }
  
  const newDonation: Donation = {
    id: `donation_${Date.now()}`,
    from,
    to,
    amount,
    message,
    txSignature,
    timestamp: new Date(),
    isAnonymous
  };
  
  donations.push(newDonation);
  
  // Notify via WebSocket
  notifyDonation(wsServer, newDonation);
  
  // Convert to frontend format
  const formattedDonation = convertDonationToFrontendFormat(newDonation);
  
  res.status(201).json({ success: true, data: formattedDonation });
});

// Poll routes
app.get('/polls/:streamId', (req: Request, res: Response) => {
  const { streamId } = req.params;
  const streamPolls = polls.filter(p => p.streamId === streamId && p.isActive);
  
  res.json({ success: true, data: streamPolls });
});

app.post('/polls', authenticateToken, (req: AuthRequest, res: Response) => {
  const { question, options, streamId } = req.body;
  
  if (!question || !options || !streamId) {
    return res.status(400).json({ 
      success: false, 
      message: 'Question, options, and streamId required' 
    });
  }
  
  const newPoll: Poll = {
    id: `poll_${Date.now()}`,
    question,
    options,
    isActive: true,
    streamId,
    createdAt: new Date()
  };
  
  polls.push(newPoll);
  res.status(201).json({ success: true, data: newPoll });
});

app.post('/polls/:id/vote', authenticateToken, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { optionId } = req.body;
  
  const poll = polls.find(p => p.id === id);
  if (!poll || !poll.isActive) {
    return res.status(404).json({ 
      success: false, 
      message: 'Poll not found or not active' 
    });
  }
  
  const optionIndex = poll.options.findIndex((opt: any) => opt.id === optionId);
  if (optionIndex === -1) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid option ID' 
    });
  }
  
  // Update vote count (this is a simplified implementation)
  // In a real app, you'd want to prevent duplicate voting
  const updatedOptions = [...poll.options];
  updatedOptions[optionIndex] = {
    ...updatedOptions[optionIndex],
    votes: updatedOptions[optionIndex].votes + 1
  };
  
  poll.options = updatedOptions;
  
  // Notify poll update via WebSocket
  wsServer.sendToStream(poll.streamId, {
    type: 'poll_update',
    data: poll
  });
  
  res.json({ success: true, data: poll });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Start server
server.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
  console.log(`WebSocket server listening at ws://localhost:${port}`);
});
