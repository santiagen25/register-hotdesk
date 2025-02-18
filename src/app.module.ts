import { Module } from '@nestjs/common';
import { HotDeskController } from './core/infrastructure/hotdesk.controller';
import { RegisterHotDeskCommandHandler } from './core/application/hotdesk/register-hotdesk.command-handler';
import { InMemoryHotDeskRepository } from './core/application/hotdesk/in-memory-hotdesk.repository';

@Module({
  controllers: [HotDeskController],
  providers: [
    RegisterHotDeskCommandHandler,
    {
      provide: 'HotDeskRepository',
      useClass: InMemoryHotDeskRepository,
    },
  ],
})
export class AppModule {}
