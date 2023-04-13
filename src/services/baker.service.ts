import { Location } from '../interfaces/__types__';
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
}
