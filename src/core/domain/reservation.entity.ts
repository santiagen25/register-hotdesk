import { v4 as uuidv4 } from 'uuid';

export class Reservation {
  readonly id: string;
  readonly meetingRoomId: string;
  readonly userId: string;
  readonly date: string;
  readonly hour: number;
  readonly duration: number;
  readonly status: string;
  readonly createdAt: string;
  updatedAt: string;

  constructor(
    meetingRoomId: string,
    userId: string,
    date: string,
    hour: number,
    duration: number,
  ) {
    this.id = uuidv4();
    this.meetingRoomId = meetingRoomId;
    this.userId = userId;
    this.date = date;
    this.hour = hour;
    this.duration = duration;
    this.status = 'Active';
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }
}
