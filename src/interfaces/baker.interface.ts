import { Time, Product, Person } from './__types__';

export default interface BakerType extends Person {
  password: string;
  rating: number;
  collectionTime: {
    start: Time;
    end: Time;
  };
  products: Product[];
}
