import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';
import { createToken } from '../utils/auth';
// Services
import BakerService from '../services/baker.service';
// Types
import BakerType from '../interfaces/baker.interface';
export default class BakerController {
  public bakerServices: BakerService = new BakerService();

  public index = (req: Request, res: Response, next: NextFunction) => {
    this.bakerServices
      .getBakers(req.body.location, req.body.distance)
      .then((result) => res.status(200).send(result))
      .catch((err) => console.error(err));
  };

  public indexOne = (req: Request, res: Response, next: NextFunction) => {
    this.bakerServices
      .getBaker(req.params.id)
      .then((result) => res.status(200).send(result))
      .catch((err) => console.error(err));
  };

  public signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newBaker = (await this.bakerServices.createBaker(
        req.body
      )) as BakerType;
      const accessToken = await createToken({
        Name: `${newBaker.firstName} ${newBaker.lastName}`,
        rating: newBaker.rating,
        collectionTime: newBaker.collectionTime,
      });

      res
        .cookie('access-token', accessToken, {
          maxAge: 60 * 60 * 2, // 2hours
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        })
        .status(201)
        .json({
          decoded: {
            Name: `${newBaker.firstName} ${newBaker.lastName}`,
            rating: newBaker.rating,
            collectionTime: newBaker.collectionTime,
          },
          accessToken,
        });
    } catch (err) {
      return console.error(err);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const existingBaker = (await this.bakerServices.login(
        req.body
      )) as BakerType;

      const accessToken = await createToken({
        Name: `${existingBaker.firstName} ${existingBaker.lastName}`,
        rating: existingBaker.rating,
        collectionTime: existingBaker.collectionTime,
      });

      res
        .cookie('access-token', accessToken, {
          maxAge: 60 * 60 * 2, // 2hours
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        })
        .status(200)
        .json({
          decoded: {
            Name: `${existingBaker.firstName} ${existingBaker.lastName}`,
            rating: existingBaker.rating,
            collectionTime: existingBaker.collectionTime,
          },
          accessToken,
        });
    } catch (err) {
      console.error(err);
    }
  };

  public logout = async (req: Request, res: Response, next: NextFunction) => {
    if (req.cookies['access-token']) {
      res
        .clearCookie('access-token')
        .status(200)
        .json({ message: 'Logged Out!' });
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    this.bakerServices
      .update(req.params.id, req.body)
      .then((updatedBaker) => {
        return res.status(201).json({
          success: true,
          Baker: updatedBaker,
        });
      })
      .catch((err) => logger.error(err));
  };

  public remove = async (req: Request, res: Response, next: NextFunction) => {
    this.bakerServices
      .remove(req.params.id)
      .then(() => res.send('Deleted Successfully'))
      .catch((err) => console.error(err));
  };

  // ////////////////////////////
  // Baker's Product////////////
  public bakersProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const bakers = await this.bakerServices.getBakers(
        req.body.location,
        req.body.distance
      );
      const products = await this.bakerServices.getBakersProducts(
        bakers,
        req.body.type
      );
      res.status(200).send(products);
    } catch (err) {
      console.error(err);
    }
  };

  public bakerProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const baker = await this.bakerServices.getBaker(req.params.id);
      const products = await this.bakerServices.getBakerProducts(
        baker,
        req.body.type
      );
      res.status(200).send(products);
    } catch (err) {
      console.error(err);
    }
  };

  public addProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    this.bakerServices
      .addProduct(req.params.id, req.body)
      .then((updatedProducts) => {
        res.status(201).json({
          success: true,
          Baker: req.params.id,
          Products: updatedProducts,
        });
      })
      .catch((err) => console.error(err));
  };

  public editProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    this.bakerServices
      .editProduct(req.params.id, Number(req.params.index), req.body)
      .then((updatedProduct) => {
        return res.status(201).json({
          success: true,
          Products: updatedProduct,
        });
      })
      .catch((err) => console.error(err));
  };

  public removeProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    this.bakerServices
      .removeProduct(req.params.id, Number(req.params.index))
      .then(() => {
        return res
          .status(201)
          .json({ Product_Number: req.params.index, state: 'Deleted' });
      })
      .catch((err) => console.error(err));
  };
}
