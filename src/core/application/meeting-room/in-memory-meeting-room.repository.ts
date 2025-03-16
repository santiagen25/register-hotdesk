import { Injectable } from '@nestjs/common';
import { MeetingRoomRepository } from './meeting-room.repository';
import { MeetingRoom } from '../../domain/meeting-room.entity';

@Injectable()
export class InMemoryMeetingRoomRepository implements MeetingRoomRepository {
  findById(id: string): MeetingRoom | undefined {
    return this.meetingRooms.find((room) => room.id === id);
  }
  private meetingRooms: MeetingRoom[] = [];

  findByName(name: string): MeetingRoom | undefined {
    return this.meetingRooms.find((room) => room.name === name);
  }

  save(meetingRoom: MeetingRoom): void {
    this.meetingRooms.push(meetingRoom);
  }
}
