import { NextFunction, Request, Response } from 'express';
import BakerService from '../services/baker.service';

export default class BakerController {
  public bakerServices: BakerService = new BakerService();

  public index = (request: Request, response: Response, next: NextFunction) => {
    this.bakerServices
      .getBakers(request.body.location, request.body.distance)
      .then((result) => response.status(200).send(result))
      .catch((err) => console.error(err));
  };
}
