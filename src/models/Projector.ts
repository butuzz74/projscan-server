import { Schema, model } from 'mongoose';

const projectorSchema = new Schema({
  brand: String,
  model: String,
  deviceType: String,
  serialNumber: { type: String, unique: true },
  partNumber: String,
  ean: String,
  upc: String,
  regulatoryModel: String,
  manufactureCountry: String,
  manufactureDate: String,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now }
});

export default model('Projector', projectorSchema);
