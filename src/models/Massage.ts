import { Schema, model } from 'mongoose';

const massageSchema = new Schema({
  title: String,
  description: String,
  image: String,
  duration: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default model('Massage', massageSchema);
