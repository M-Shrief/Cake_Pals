// Model
import Member from '../models/member.model';
// Types
import { Location } from '../interfaces/__types__';
import MemberType from '../interfaces/member.interface';

export default class MemberService {
  public async getMembers() {
    return Member.find();
  }
}
