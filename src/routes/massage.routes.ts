import { Router } from 'express';
import Massage from '../models/Massage.js';
import mongoose from 'mongoose';

type Query = {
  _id?: string | mongoose.Types.ObjectId;
};

const router = Router();

router.get('/', async (req, res) => {
  const { _id } = req.query;
  const query: Query = {};

  if (_id && typeof _id === 'string') {
    if (mongoose.Types.ObjectId.isValid(_id)) {
      query._id = new mongoose.Types.ObjectId(_id);
    } else {
      res.status(400).json({ message: 'Некорректный _id' });
    }
  }
  console.log(query._id);
  try {
    const massages = await Massage.find(query).select('-__v -createdAt -updatedAt');
    if (!massages || massages.length === 0) {
      res.status(400).json({ message: 'Товар(ы) отсутствуют в базе' });
    } else {
      res.json(massages);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Ошибка при получении данных' });
  }
});

export default router;
