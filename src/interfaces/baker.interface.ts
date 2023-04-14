import { Time, Product, Person } from './__types__';

export default interface BakerType extends Person {
  password: String;
  rating: Number;
  collectionTime: {
    start: Time;
    end: Time;
  };
  products: Product[];
}
