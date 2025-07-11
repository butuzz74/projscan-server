import { Router } from 'express';
import Booking from '../models/Booking.js';
import WorkDay from '../models/WorkDay.js';
import mongoose from 'mongoose';

type Query = {
  date?: string;
  time?: string;
};

const router = Router();

router.get('/', async (req, res) => {
  const { date, time } = req.query;
  const query: Query = {};

  if (date && typeof date === 'string') query.date = date;
  if (time && typeof time === 'string') query.time = time;
  try {
    const booking = await Booking.find(query).select('-__v -createdAt -updatedAt -massageId');
    if (!booking || booking.length === 0) {
      res.status(400).json({ message: 'Бронь отсутствует в базе' });
    } else {
      res.json(booking);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Ошибка при получении данных' });
  }
});

router.post('/', async (req, res) => {
  const { date, time } = req.body;
  try {
    const booking = new Booking(req.body);
    await booking.save();
    const workDay = await WorkDay.findOne({ date });
    if (workDay) {
      workDay.slots.forEach((slot) =>
        slot.time === String(time) ? (slot.available = false) : (slot.available = true)
      );
      await workDay.save();
    }
    res.status(201).json(booking);
  } catch (err) {
    const error = err as mongoose.mongo.MongoServerError;
    res.status(400).json({ error: 'Ошибка при сохранении', details: error });
  }
});

export default router;
