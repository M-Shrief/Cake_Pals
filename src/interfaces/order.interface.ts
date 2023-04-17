import { Time, Product, Person } from './__types__';

export default interface OrderType {
  status: 'On Hold' | 'Rejected' | 'On Progress' | 'Delivered';
  baker: String;
  member: String;
  customer: Person;
  products: Product[];
  // We'll assume that every baker provide these methods
  paymentMethod: 'CASH' | 'CARD';
  overallPrice: Number;
  timeToBake: String;
  collectionTime: Time;
}
