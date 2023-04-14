import mongoose from 'mongoose';
// Types
import { Time, Location, Product } from '../interfaces/__types__';
import MemberType from '../interfaces/member.interface';

const Schema = mongoose.Schema;
const memberSchema = new Schema(
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
    // No need to save Member's order history
    // you can get it directly from order.model
  },
  { timestamps: true }
);

const Member = mongoose.model<MemberType>('Member', memberSchema);
export default Member;
