import { comparePassword, hashPassword } from '../utils/auth';
// Model
import Member from '../models/member.model';
// Types
import MemberType from '../interfaces/member.interface';
import { logger } from '../utils/logger';

export default class MemberService {
  public async getMembers(): Promise<MemberType[]> {
    return Member.find({}, { firstName: 1, lastName: 1, phone: 1 });
  }

  public async getMember(id: string): Promise<MemberType | null> {
    return Member.findById(id, {
      firstName: 1,
      lastName: 1,
      phone: 1,
      location: 1,
    });
  }

  public createMember(memberData: MemberType) {
    try {
      const { firstName, lastName, phone, location } = memberData;
      const password = hashPassword(memberData.password as string);
      const newMember = new Member({
        firstName,
        lastName,
        location,
        phone,
        password,
      });

      return newMember.save();
    } catch (err) {
      return logger.error(err);
    }
  }

  public async login(memberData: MemberType) {
    const { phone, password } = memberData;
    try {
      const existingMember = await Member.findOne(
        { phone },
        { firstName: 1, lastName: 1, rating: 1, collectionTime: 1, password: 1 }
      );

      if (!existingMember) return console.error('Invalid Data');

      const isValid = comparePassword(
        password as string,
        existingMember.password as string
      );

      if (!isValid) return console.error('Invalid Data');

      return existingMember;
    } catch (err) {
      console.error(err);
    }
  }

  // public async logout(): Promise<void> {}

  public async update(id: string, memberData: MemberType) {
    const member = await Member.findById(id);
    if (member) {
      member
        .updateOne({ $set: memberData })
        .then((updatedMember: MemberType) => {
          return updatedMember;
        })
        .catch((err) => logger.error(err));
    } else {
      logger.error(`Error: member not found`);
    }
  }

  public async remove(id: string) {
    return Member.findByIdAndRemove(id);
  }
}
