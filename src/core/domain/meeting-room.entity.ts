import { v4 as uuidv4 } from 'uuid';

export class MeetingRoom {
  readonly id: string;
  readonly name: string;
  readonly capacity: number;
  readonly status: string;
  readonly createdAt: Date;
  updatedAt: Date;

  constructor(name: string, capacity: number) {
    this.id = uuidv4();
    this.name = name;
    this.capacity = capacity;
    this.status = 'Active';
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
