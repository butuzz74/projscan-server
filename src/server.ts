import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/product.routes.ts';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB error:', err));

app.use('/api/products', productRoutes);

const PORT = parseInt(process.env.PORT || '4000', 10);

app.listen(PORT, '0.0.0.0', () => console.log('Listening on all interfaces'));
