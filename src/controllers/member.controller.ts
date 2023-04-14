import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';
// Services
import MemberService from '../services/member.service';
// Types
import MemberType from '../interfaces/member.interface';

export default class MemberController {
  public memberService = new MemberService();

  public index = (req: Request, res: Response, next: NextFunction) => {
    this.memberService
      .getMembers()
      .then((result) => res.status(200).send(result))
      .catch((err) => logger.error(`ERROR: ${err}`));
  };
}
