import { Location, Person } from './__types__';

export default interface MemberType extends Person {
  password: string;
}
