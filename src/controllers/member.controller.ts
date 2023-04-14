import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';
import { createToken } from '../utils/auth';
// Services
import MemberService from '../services/member.service';
import BakerService from '../services/baker.service';
// Types
import MemberType from '../interfaces/member.interface';

export default class MemberController {
  public memberService = new MemberService();
  private bakerService = new BakerService();

  public index = (req: Request, res: Response, next: NextFunction) => {
    this.memberService
      .getMembers()
      .then((result) => res.status(200).send(result))
      .catch((err) => logger.error(`ERROR: ${err}`));
  };

  public indexOne = (req: Request, res: Response, next: NextFunction) => {
    this.memberService
      .getMember(req.params.id)
      .then((result) => res.status(200).send(result))
      .catch((err) => logger.error(`ERROR: ${err}`));
  };

  public getNearBakers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const member = await this.memberService.getMember(req.params.id);
      const distance = Number(req.params.distance);
      if (member && distance > -1) {
        const nearBakers = await this.bakerService.getBakers(
          member.location,
          distance
        );
        return res.status(200).send(nearBakers);
      }
    } catch (err) {
      logger.error(err);
    }
  };

  public signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newMember = (await this.memberService.createMember(
        req.body
      )) as MemberType;
      const accessToken = await createToken({
        Name: `${newMember.firstName} ${newMember.lastName}`,
      });
      res
        .cookie('access-token', accessToken, {
          maxAge: 60 * 60 * 8, // 8hours
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        })
        .status(201)
        .json({
          decoded: {
            Name: `${newMember.firstName} ${newMember.lastName}`,
          },
          accessToken,
        });
    } catch (err) {
      return logger.error(err);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const existingMember = (await this.memberService.login(
        req.body
      )) as MemberType;

      const accessToken = await createToken({
        Name: `${existingMember.firstName} ${existingMember.lastName}`,
      });

      res
        .cookie('access-token', accessToken, {
          maxAge: 60 * 60 * 2, //2 hours,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        })
        .status(200)
        .json({
          decoded: {
            Name: `${existingMember.firstName} ${existingMember.lastName}`,
          },
          accessToken,
        });
    } catch (err) {
      return logger.error(err);
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
}
