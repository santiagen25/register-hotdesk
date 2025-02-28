import { MeetingRoom } from '../../domain/meeting-room.entity';

export interface MeetingRoomRepository {
  findByName(name: string): MeetingRoom | undefined;
  save(meetingRoom: MeetingRoom): void;
}
