import { Time, Product, Person } from './__types__';

export default interface OrderType {
  status: 'On Hold' | 'Rejected' | 'On Progress' | 'Delivered';
  baker: String;
  member: String;
  customer: Person;
  products: Product[];
  // overallPrice: Number;
  // timeToBake: Time;
  collectionTime: Time;
}
