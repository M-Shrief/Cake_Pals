import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';
import { createToken } from '../utils/auth';
// Services
import MemberService from '../services/member.service';
import BakerService from '../services/baker.service';
// Types
import MemberType from '../interfaces/member.interface';

export default class MemberController {
  private memberService = new MemberService();
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
      res.status(400).send('Bad Request');
    }
  };

  public signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newMember = (await this.memberService.createMember(
        req.body
      )) as MemberType;
      const accessToken = await createToken({
        Name: `${newMember.firstName} ${newMember.lastName}`,
        permissions: ['member:read', 'member:write'],
      });
      res.set('Authorization', `Bearer ${accessToken}`);

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
      logger.error(err);
      res.status(400).send('Bad Request');
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const existingMember = (await this.memberService.login(
        req.body
      )) as MemberType;

      const accessToken = await createToken({
        Name: `${existingMember.firstName} ${existingMember.lastName}`,
        permissions: ['member:read', 'member:write'],
      });
      res.set('Authorization', `Bearer ${accessToken}`);

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
      logger.error(err);
      res.status(400).send('Bad Request');
    }
  };

  public logout = async (req: Request, res: Response, next: NextFunction) => {
    if (req.cookies['access-token']) {
      res.set('Authorization', undefined);
      res
        .clearCookie('access-token')
        .status(200)
        .json({ message: 'Logged Out!' });
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    this.memberService
      .update(req.params.id, req.body)
      .then((updatedMember) => {
        return res.status(201).json({
          success: true,
          Member: updatedMember,
        });
      })
      .catch((err) => logger.error(err));
  };

  public remove = (req: Request, res: Response, next: NextFunction) => {
    this.memberService
      .remove(req.params.id)
      .then(() => res.send('Deleted Successfully'))
      .catch((err) => logger.error(err));
  };
}
