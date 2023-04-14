import { hashPassword } from '../utils/auth';
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
}
