import { v4 as uuidv4 } from 'uuid';

export class Office {
  readonly id: string;
  readonly number: number;
  readonly leasePeriod: number;
  readonly status: string;
  readonly createdAt: Date;
  updatedAt: Date;

  constructor(number: number, leasePeriod?: number, status?: string) {
    this.id = uuidv4();
    this.number = number;
    this.leasePeriod = leasePeriod && leasePeriod > 0 ? leasePeriod : 12;
    this.status = status === 'Inactive' ? 'Inactive' : 'Active';
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
