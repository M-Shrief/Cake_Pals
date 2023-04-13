import { NextFunction, Request, Response } from 'express';
import BakerService from '../services/baker.service';
import {
  comparePassword,
  createToken,
  decodeToken,
  hashPassword,
  verifyToken,
} from '../utils/auth';
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

  public remove = async (req: Request, res: Response, next: NextFunction) => {
    this.bakerServices
      .remove(req.params.id)
      .then(() => res.send('Deleted Successfully'))
      .catch((err) => console.error(err));
  };
}
