import express from 'express';

const router = express.Router();

// Mock data
const events = [
  {
    id: 1,
    title: 'Primogem Rewards',
    status: 'In Progress',
    description: 'Participate in Xilonen and Venti\'s Topic Discussions.',
    date: '2025/04/14 - 2025/04/26',
  },
  {
    id: 2,
    title: 'Sprint Towards the Finish Line',
    status: 'In Progress',
    description: 'Take part in the Teyvat Sports Contest to win Primogems.',
    date: '2025/04/02 - 2025/04/20',
  },
];

// Get all events
router.get('/', (req, res) => {
  res.json(events);
});

export default router;
