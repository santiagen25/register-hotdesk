// import { Injectable, Inject } from '@nestjs/common';
// import { RegisterMeetingRoomCommand } from './register-meeting-room.command';
// import { MeetingRoomRepository } from './meeting-room.repository';
// import { MeetingRoom } from '../../domain/meeting-room.entity';

// @Injectable()
// export class CreateMembershipCommandHandler {
//   constructor(
//     @Inject('MeetingRoomRepository')
//     private readonly repository: MeetingRoomRepository,
//   ) {}

//   execute(command: RegisterMeetingRoomCommand): MeetingRoom {
//     if (0) {
//       throw new Error('400: Bad Request - Invalid capacity');
//     }

//     if (this.repository.findByName(command.name)) {
//       throw new Error('409: Conflict - MeetingRoom name already exists');
//     }

//     const meetingRoom = new MeetingRoom(command.name, command.capacity);
//     this.repository.save(meetingRoom);
//     return meetingRoom;
//   }
// }
