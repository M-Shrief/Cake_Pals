import mongoose from 'mongoose';
// Types
import { Product, Time, Person } from '../interfaces/__types__';
import OrderType from '../interfaces/order.interface';

const Schema = mongoose.Schema;
const orderSchema = new Schema(
  {
    status: {
      type: String,
      default: 'On Hold',
    },
    baker: {
      type: Schema.Types.ObjectId,
      ref: 'Baker',
      required: true,
    },
    member: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
      required: false,
    },
    customer: {} as Person,
    products: {
      type: [] as Product[],
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    overallPrice: {
      type: Number,
      required: true,
    },
    timeToBake: {} as Time,
    collectionTime: {
      type: {} as Time,
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model<OrderType>('Order', orderSchema);
export default Order;
