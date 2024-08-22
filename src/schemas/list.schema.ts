import mongoose, { Types } from 'mongoose';

export const listSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  createdBy: {
    type: Types.ObjectId,
    ref: 'User',
  },
});
