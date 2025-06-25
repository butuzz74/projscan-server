import { Schema, model } from 'mongoose';

const deletedLogSchema = new Schema({
  model: String,
  serialNumber: String,
  deletedAt: { type: Date, default: Date.now }
});

export default model('DeletedLog', deletedLogSchema);
