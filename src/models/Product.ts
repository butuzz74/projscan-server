import { Schema, model } from 'mongoose';

const productSchema = new Schema({
  brand: String,
  model: String,
  deviceType: String,
  serialNumber: { type: String, unique: true },
  manufactureCountry: String,
  createdAt: { type: Date, default: Date.now }
});

export default model('Product', productSchema);
