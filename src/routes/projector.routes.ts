import { Router } from 'express';
import Projector from '../models/Projector';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const projector = new Projector(req.body);
    await projector.save();
    res.status(201).json(projector);
  } catch (err) {
    res.status(400).json({ error: 'Ошибка при сохранении', details: err });
  }
});

router.get('/', async (_req, res) => {
  const projectors = await Projector.find().sort({ createdAt: -1 });
  res.json(projectors);
});

export default router;
