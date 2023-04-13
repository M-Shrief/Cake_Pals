import { NextFunction, Request, Response } from 'express';
import BakerService from '../services/baker.service';

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
}
