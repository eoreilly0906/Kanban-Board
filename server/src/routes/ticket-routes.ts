import { Router, Request, Response } from 'express';
import { Ticket } from '../models/ticket.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Get all tickets
router.get('/', authenticateToken, async (_req: Request, res: Response): Promise<void> => {
  try {
    const tickets = await Ticket.findAll();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// Get ticket by ID
router.get('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) {
      res.status(404).json({ error: 'Ticket not found' });
      return;
    }
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ticket' });
  }
});

// Create new ticket
router.post('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const ticket = await Ticket.create(req.body);
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// Update ticket
router.put('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) {
      res.status(404).json({ error: 'Ticket not found' });
      return;
    }
    await ticket.update(req.body);
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update ticket' });
  }
});

// Delete ticket
router.delete('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) {
      res.status(404).json({ error: 'Ticket not found' });
      return;
    }
    await ticket.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete ticket' });
  }
});

export default router; 