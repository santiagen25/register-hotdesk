import { Injectable, Inject } from '@nestjs/common';
import { RegisterMeetingRoomCommand } from './register-meeting-room.command';
import { MeetingRoomRepository } from './meeting-room.repository';
import { MeetingRoom } from '../../domain/meeting-room.entity';

@Injectable()
export class RegisterMeetingRoomCommandHandler {
  constructor(
    @Inject('MeetingRoomRepository')
    private readonly repository: MeetingRoomRepository,
  ) {}

  execute(command: RegisterMeetingRoomCommand): MeetingRoom {
    if (
      !command.name ||
      command.name.trim() === '' ||
      !Number.isInteger(command.capacity) ||
      command.capacity <= 0
    ) {
      throw new Error('400: Bad Request - Invalid name or capacity');
    }

    if (this.repository.findByName(command.name)) {
      throw new Error('498: Conflict - MeetingRoom name already exists');
    }

    const meetingRoom = new MeetingRoom(command.name, command.capacity);
    this.repository.save(meetingRoom);
    return meetingRoom;
  }
}
