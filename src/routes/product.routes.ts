import { Router } from 'express';
import Product from '../models/Product.ts';
import mongoose from 'mongoose';

type Query = {
  model?: string;
  serialNumber?: string;
};

const router = Router();

router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    const error = err as mongoose.mongo.MongoServerError;
    if (error.code === 11000 && error.keyPattern?.serialNumber) {
      res.status(409).json({ message: 'Серийный номер уже существует в базе.' });
    } else {
      res.status(400).json({ error: 'Ошибка при сохранении', details: error });
    }
  }
});

router.get('/', async (req, res) => {
  const { model, serialNumber } = req.query;
  const query: Query = {};
  if (model && typeof model === 'string') query.model = model;
  if (serialNumber && typeof serialNumber === 'string') query.serialNumber = serialNumber;
  try {
    const products = await Product.find(query).select('-__v -createdAt');
    if (!products || products.length === 0) {
      res.status(400).json({ message: 'Товар(ы) отсутствуют в базе' });
    } else {
      res.json(products);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Ошибка при получении данных' });
  }
});

router.delete('/', async (req, res) => {
  const { serialNumber } = req.query;
  const query: Query = {};
  if (serialNumber && typeof serialNumber === 'string') query.serialNumber = serialNumber;
  try {
    await Product.deleteOne(query);
    res.status(200).json({ message: 'Товар удален' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Ошибка при получении данных' });
  }
});

export default router;
