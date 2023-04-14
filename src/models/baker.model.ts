import mongoose from 'mongoose';
// Types
import { Time, Location, Product } from '../interfaces/__types__';
import BakerType from '../interfaces/baker.interface';

const Schema = mongoose.Schema;
const bakerSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxLength: 20,
    },
    lastName: {
      type: String,
      required: true,
      maxLength: 20,
    },
    phone: {
      type: String,
      required: false,
      maxLength: 20,
    },
    password: {
      type: String,
      required: true,
    },
    location: {} as Location,
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    collectionTime: {
      start: {} as Time,
      end: {} as Time,
    },
    products: {
      type: [] as Product[],
      required: false,
    },
  },
  { timestamps: true }
);

const Baker = mongoose.model<BakerType>('Baker', bakerSchema);
export default Baker;
