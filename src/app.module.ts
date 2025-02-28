import { Module } from '@nestjs/common';
import { HotDeskController } from './core/infrastructure/hotdesk.controller';
import { MeetingRoomController } from './core/infrastructure/meeting-room.controller';
import { OfficeController } from './core/infrastructure/office.controller';
import { RegisterHotDeskCommandHandler } from './core/application/hotdesk/register-hotdesk.command-handler';
import { RegisterMeetingRoomCommandHandler } from './core/application/meeting-room/register-meeting-room.command-handler';
import { RegisterOfficeCommandHandler } from './core/application/office/register-office.command-handler';
import { InMemoryHotDeskRepository } from './core/application/hotdesk/in-memory-hotdesk.repository';
import { InMemoryMeetingRoomRepository } from './core/application/meeting-room/in-memory-meeting-room.repository';
import { InMemoryOfficeRepository } from './core/application/office/in-memory-office.repository';

@Module({
  controllers: [HotDeskController, MeetingRoomController, OfficeController],
  providers: [
    RegisterHotDeskCommandHandler,
    RegisterMeetingRoomCommandHandler,
    RegisterOfficeCommandHandler,
    {
      provide: 'HotDeskRepository',
      useClass: InMemoryHotDeskRepository,
    },
    {
      provide: 'MeetingRoomRepository',
      useClass: InMemoryMeetingRoomRepository,
    },
    {
      provide: 'OfficeRepository',
      useClass: InMemoryOfficeRepository,
    },
  ],
})
export class AppModule {}
