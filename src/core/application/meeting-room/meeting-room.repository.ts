import { MeetingRoom } from '../../domain/meeting-room.entity';

export interface MeetingRoomRepository {
  findById(meetingRoomId: string): unknown;
  findByName(name: string): MeetingRoom | undefined;
  save(meetingRoom: MeetingRoom): void;
}
