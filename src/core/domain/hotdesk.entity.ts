import { v4 as uuidv4 } from 'uuid';

export class HotDesk {
  readonly id: string;
  readonly number: number;
  readonly status: string;
  readonly createdAt: Date;
  updatedAt: Date;

  constructor(number: number) {
    this.id = uuidv4();
    this.number = number;
    this.status = 'Active';
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
