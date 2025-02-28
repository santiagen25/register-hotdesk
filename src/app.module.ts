import { Module } from '@nestjs/common';
import { HotDeskController } from './core/infrastructure/hotdesk.controller';
import { RegisterHotDeskCommandHandler } from './core/application/hotdesk/register-hotdesk.command-handler';
import { InMemoryHotDeskRepository } from './core/application/hotdesk/in-memory-hotdesk.repository';
import { RegisterMeetingRoomCommandHandler } from './core/application/meeting-room/register-meeting-room.command-handler';
import { InMemoryMeetingRoomRepository } from './core/application/meeting-room/in-memory-meeting-room.repository';
import { MeetingRoomController } from './core/infrastructure/meeting-room.controller';

@Module({
  controllers: [HotDeskController, MeetingRoomController],
  providers: [
    RegisterHotDeskCommandHandler,
    RegisterMeetingRoomCommandHandler,
    {
      provide: 'HotDeskRepository',
      useClass: InMemoryHotDeskRepository,
    },
    {
      provide: 'MeetingRoomRepository',
      useClass: InMemoryMeetingRoomRepository,
    },
  ],
})
export class AppModule {}
