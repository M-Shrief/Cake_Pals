import { Time, Location, Product } from './__types__';

export default interface BakerType {
  firstName: String;
  lastName: String;
  phone: String;
  password: String;
  location: Location;
  rating: Number;
  collectionTime: {
    start: Time;
    end: Time;
  };
  products: Product[];
}
