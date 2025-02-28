import { v4 as uuidv4 } from 'uuid';

export class HotDeskReservation {
  readonly id: string;
  readonly userId: string;
  readonly date: string;
  readonly status: string;
  readonly includedInMembership: boolean;
  readonly createdAt: string;
  updatedAt: string;

  constructor(userId: string, date: string, includedInMembership: boolean) {
    this.id = uuidv4();
    this.userId = userId;
    this.date = date;
    this.status = 'Active';
    this.includedInMembership = includedInMembership;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }
}
