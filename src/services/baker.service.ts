import { Location } from '../interfaces/__types__';
import {
  comparePassword,
  createToken,
  // decodeToken,
  hashPassword,
  verifyToken,
} from '../utils/auth';
import BakerType from '../interfaces/baker.interface';
import Baker from '../models/baker';

export default class BakerService {
  public async getBakers(
    location?: Location,
    distance?: number
  ): Promise<BakerType[]> {
    let bakers;
    // Filter Bakers by Location if provided in req.body
    if (location && distance) {
      bakers = await Baker.find(
        {
          location: {
            $nearSphere: {
              $geometry: location, // like { type: "Point", coordinates: [ longitude , latitude ] }
              $maxDistance: distance * 1000, // computing the distance in kilometers
            },
          },
        },
        { firstName: 1, lastName: 1, products: 1, location: 1 }
      );
    } else {
      bakers = await Baker.find(
        {},
        { firstName: 1, lastName: 1, products: 1, location: 1 }
      );
    }
    return bakers;
  }
  public async getBaker(id: string): Promise<BakerType> {
    let baker = (await Baker.findById(id, {
      firstName: 1,
      lastName: 1,
      location: 1,
      rating: 1,
      products: 1,
      collectionTime: 1,
    })) as BakerType;
    return baker;
  }
  public async createBaker(bakerData: BakerType): Promise<BakerType | void> {
    const { firstName, lastName, phone, location, rating, collectionTime } =
      bakerData;
    const password = hashPassword(bakerData.password as string);
    const baker = new Baker({
      firstName,
      lastName,
      phone,
      password,
      location,
      rating,
      collectionTime,
    });
    try {
      return baker.save();
    } catch (err) {
      return console.error(err);
    }
  }

  public async login(bakerData: BakerType): Promise<BakerType | void> {
    const { phone, password } = bakerData;

    try {
      const existingBaker = await Baker.findOne(
        { phone },
        { firstName: 1, lastName: 1, rating: 1, collectionTime: 1, password: 1 }
      );

      if (!existingBaker) return console.error('Invalid Data');

      const isValid = comparePassword(
        password as string,
        existingBaker.password as string
      );

      if (!isValid) return console.error('Invalid Data');

      return existingBaker;
    } catch (err) {
      console.error(err);
    }
  }
}
