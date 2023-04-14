import {
  comparePassword,
  createToken,
  // decodeToken,
  hashPassword,
  verifyToken,
} from '../utils/auth';
// Models
import Baker from '../models/baker.model';
// Types
import { Location, Product } from '../interfaces/__types__';
import BakerType from '../interfaces/baker.interface';

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
        { firstName: 1, products: 1, location: 1, rating: 1 }
      );
    } else {
      bakers = await Baker.find(
        {},
        { firstName: 1, products: 1, location: 1, rating: 1 }
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
    try {
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

  // public async logout(): Promise<void> {}

  public async remove(id: string) {
    return Baker.findByIdAndRemove(id);
  }

  // ////////////////////////////
  // Baker's Product////////////

  public async getBakersProducts(
    bakers: BakerType[],
    type?: 'Sweets' | 'Salty'
  ): Promise<Product[]> {
    let products = [] as Product[];
    // we access in order: allBakers' Products -> Baker's Products -> individual Product in Product[]
    const bakersProducts = bakers.map((baker) => baker.products);
    bakersProducts.forEach((bakerProducts) => {
      if (bakerProducts.length) {
        bakerProducts
          .map((products) => products)
          .forEach((product) => {
            products.push(product);
          });
      }
    });
    // To filter by type if provided in req.body
    if (type) {
      let filteredProducts = products.filter((product) => product.type == type);
      return filteredProducts;
    }
    return products;
  }

  public async getBakerProducts(
    baker: BakerType,
    type?: 'Sweets' | 'Salty'
  ): Promise<Product[]> {
    let products = baker.products as Product[];
    // To filter by type if provided in req.body
    if (type) {
      let filteredProducts = products.filter((product) => product.type == type);
      return filteredProducts;
    }
    return products;
  }

  public async addProduct(id: string, productData: any) {
    const baker = await Baker.findById(id, { products: 1 });
    if (baker) {
      const products = baker.products as Product[];
      const product = { baker: baker._id, ...productData } as Product;
      products.push(product);

      baker
        .updateOne({ $set: { products } })
        .then((updatedProducts: Product[]) => {
          return updatedProducts;
        })
        .catch((err) => console.error(err));
    }
  }

  public async editProduct(id: string, productIndex: number, productData: any) {
    const baker = await Baker.findById(id, { products: 1 });

    if (baker && productIndex > -1) {
      const products = baker.products as Product[];
      products[productIndex] = productData;

      baker
        .updateOne({
          $set: { products },
        })
        .then((updatedProducts: Product[]) => {
          return updatedProducts;
        })
        .catch((err) => console.error(err));
    }
  }

  public async removeProduct(id: string, productIndex: number) {
    const baker = await Baker.findById(id, { products: 1 });
    if (baker && productIndex > -1) {
      const products = baker.products as Product[];
      products.splice(productIndex, 1);

      baker
        .updateOne({
          $set: { products },
        })
        .catch((err) => console.error(err));
    }
  }
}
