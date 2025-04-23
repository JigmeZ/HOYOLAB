import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import postsRouter from './routes/posts.js';
import eventsRouter from './routes/events.js';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/posts', postsRouter);
app.use('/api/events', eventsRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// Default route
app.get('/', (req, res) => {
  res.send('HOYOLAB Backend is running!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Catch-all route for undefined endpoints
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
